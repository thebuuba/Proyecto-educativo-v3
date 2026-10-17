import assert from 'node:assert/strict'
import {createHash} from 'node:crypto'
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs'
import {createRequire} from 'node:module'
import {parseEnv} from 'node:util'
import {developmentEnvironment,developmentProjectRef as project} from '../cloudflare-development-environment.mjs'

// One literal, visually reviewed common grade. No catalog seed or school/account writes.
const [subjectCode,gradeText,matrixPath]=process.argv.slice(2),grade=Number(gradeText)
const subjects={SOC:'Ciencias Sociales',ART:'Educación Artística',EFI:'Educación Física',FHR:'Formación Integral Humana y Religiosa'}
assert(subjectCode in subjects&&Number.isInteger(grade)&&grade>=1&&grade<=6,'Código común y grado explícitos requeridos')
assert(matrixPath?.startsWith('docs/curriculum/cobertura-secundaria/')&&matrixPath.endsWith('.json'),'Matriz curricular explícita requerida')
const matrix=JSON.parse(readFileSync(matrixPath,'utf8')),rows=readFileSync('data/curriculum/secondary-2023.jsonl','utf8').trim().split('\n').map(JSON.parse)
const source=rows.find(r=>r.kind==='document'),digest=value=>createHash('sha256').update(value).digest('hex')
assert.equal(digest(readFileSync('apps/frontend/public/docs/adecuacion-curricular-nivel-secundario-2023.pdf')),source.sha256)
assert.equal(matrix.source.sha256,source.sha256);assert.equal(matrix.grade,grade)
assert.equal(matrix.sourceVisualReview.status,'REVIEWED')
const scope=rows.find(r=>r.kind==='scope'&&r.id===matrix.scopeId)
assert(scope);assert.equal(scope.grade,grade);assert.equal(scope.subjectName,subjects[subjectCode]);assert.equal(scope.optativeExitName,null)
const elements=rows.filter(r=>r.kind==='element'&&r.scopeKey===scope.stableKey),ids=new Set(elements.map(r=>r.id))
const relations=rows.filter(r=>r.kind==='relation'&&ids.has(r.fromId)&&ids.has(r.toId))
assert.equal(elements.length,matrix.officialRecords.length)
for(const row of elements){
 const reviewed=matrix.officialRecords.find(r=>r.id===row.id);assert(reviewed)
 assert.equal(row.originalText,reviewed.text);assert.equal(row.type,reviewed.type)
 assert.equal(row.source.pdfPage,reviewed.pdfPage);assert(matrix.sourceVisualReview.pages.includes(row.source.pdfPage))
}
const excluded=matrix.explicitExclusions??[]
assert.equal(new Set(excluded.map(r=>r.id)).size,excluded.length)
for(const row of excluded)assert(ids.has(row.id)&&row.reason&&row.explanation)
const code=`MINERD_SECUNDARIA_2023_${subjectCode}_COMUN_G${grade}_V1`
const id=(kind,original)=>{
 const b=createHash('sha1').update(Buffer.from('6ba7b8119dad11d180b400c04fd430c8','hex')).update(`${code}/${kind}/${original}`).digest().subarray(0,16)
 b[6]=(b[6]&15)|80;b[8]=(b[8]&63)|128
 const h=b.toString('hex');return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`
}
const versionId=id('version',source.versionId),documentId=id('document',source.id),scopeId=id('scope',scope.id)
const metadata={subjectCodes:[subjectCode],grades:[grade],commonOnly:true,datasetDigest:digest(JSON.stringify({source,scopes:[scope],elements,relations})),sourceVersionId:source.versionId,sourcePdfHash:source.sha256,scopeMap:{[grade]:{sourceId:scope.id,id:scopeId}},review:matrixPath,reviewKind:'LITERAL_SOURCE_AND_SCOPE_NOT_COMPLETE_INSTRUMENT_COVERAGE',excludedAssessmentElementIds:excluded.map(r=>id('element',r.id))}
const manifest={project,code,versionId,documentId,scopeId,metadata,elementIdMap:Object.fromEntries(elements.map(r=>[r.id,id('element',r.id)])),elements:elements.length,relations:relations.length,excludedFromAssessment:excluded.length}
if(!process.argv.includes('--install')){console.log(JSON.stringify(manifest,null,2));process.exit(0)}
Object.assign(process.env,developmentEnvironment(parseEnv(readFileSync('.dev.vars.local','utf8'))))
const require=createRequire(new URL('../../apps/backend/package.json',import.meta.url)),{prisma}=require('@aula/database')
const normalize=value=>value?.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase()??null
const fingerprints=()=>prisma.$transaction(async db=>{
 await db.$executeRawUnsafe('SET TRANSACTION READ ONLY')
 return{releases:await db.$queryRawUnsafe('SELECT version,md5(payload::text) AS hash FROM evaluation_catalog_releases ORDER BY version'),snapshots:await db.$queryRawUnsafe('SELECT id::text,md5(to_jsonb(s)::text) AS hash FROM evaluation_instrument_snapshots s ORDER BY id')}
})
try{
 const before=await fingerprints(),existing=await prisma.curriculumVersion.findUnique({where:{code},include:{documents:true}})
 let result='UNCHANGED'
 if(existing){
  assert.equal(existing.id,versionId);assert.equal(existing.status,'PUBLISHED');assert.deepEqual(existing.importMetadata,metadata)
  assert.equal(existing.documents.length,1);assert.equal(existing.documents[0].sha256,source.sha256)
 }else{
  await prisma.$transaction(async tx=>{
   await tx.curriculumVersion.create({data:{id:versionId,code,level:'SECONDARY',editionYear:2023,status:'DRAFT',importMetadata:metadata}})
   const {kind,url,...document}=source
   await tx.curriculumDocument.create({data:{...document,id:documentId,versionId}})
   await tx.curriculumScope.create({data:{id:scopeId,versionId,stableKey:scope.stableKey,cycle:scope.cycle,grade,areaName:scope.areaName,subjectName:scope.subjectName,modalityName:scope.modalityName,optativeExitName:null,assignmentSourcePdfPage:scope.assignmentSourcePdfPage,areaSearch:normalize(scope.areaName),subjectSearch:normalize(scope.subjectName)}})
   await tx.curriculumElement.createMany({data:elements.map(r=>({id:id('element',r.id),versionId,scopeId,stableKey:r.stableKey,elementType:r.type,originalText:r.originalText,normalizedText:r.normalizedText,reviewStatus:'REVIEWED',sourceOrder:r.sourceOrder}))})
   if(relations.length)await tx.curriculumElementRelation.createMany({data:relations.map(r=>({versionId,fromElementId:id('element',r.fromId),toElementId:id('element',r.toId),relationType:r.type}))})
   await tx.curriculumSourceSpan.createMany({data:elements.map(r=>({versionId,elementId:id('element',r.id),documentId,pdfPage:r.source.pdfPage,printedPage:r.source.printedPage,sectionName:r.source.sectionName,boundingBox:r.source.boundingBox??undefined}))})
   await tx.curriculumVersion.update({where:{id:versionId},data:{status:'VALIDATED',validatedAt:new Date()}})
   await tx.curriculumVersion.update({where:{id:versionId},data:{status:'PUBLISHED',publishedAt:new Date()}})
  },{timeout:120000})
  result='CREATED'
 }
 assert.equal(await prisma.curriculumScope.count({where:{versionId}}),1)
 assert.equal(await prisma.curriculumElementRelation.count({where:{versionId}}),relations.length)
 assert.equal(await prisma.curriculumSourceSpan.count({where:{versionId}}),elements.length)
 const stored=await prisma.curriculumElement.findMany({where:{versionId},select:{id:true,originalText:true,elementType:true,scopeId:true,sourceSpans:{select:{pdfPage:true,printedPage:true,documentId:true}}}})
 assert.equal(stored.length,elements.length)
 for(const row of elements){
  const actual=stored.find(r=>r.id===id('element',row.id));assert(actual)
  assert.equal(actual.originalText,row.originalText);assert.equal(actual.elementType,row.type);assert.equal(actual.scopeId,scopeId)
  assert.deepEqual(actual.sourceSpans,[{pdfPage:row.source.pdfPage,printedPage:row.source.printedPage,documentId}])
 }
 const after=await fingerprints()
 for(const key of ['releases','snapshots'])for(const old of before[key])assert.deepEqual(after[key].find(r=>key==='releases'?r.version===old.version:r.id===old.id),old)
 mkdirSync('.wrangler/secondary-completion',{recursive:true})
 const evidence={...manifest,result,preservedReleases:before.releases.length,preservedSnapshots:before.snapshots.length}
 writeFileSync(`.wrangler/secondary-completion/${code}-source.json`,JSON.stringify(evidence,null,2)+'\n')
 console.log(JSON.stringify({project,code,versionId,result,elements:elements.length,excludedFromAssessment:excluded.length,preservedReleases:before.releases.length,preservedSnapshots:before.snapshots.length}))
}finally{await prisma.$disconnect()}
