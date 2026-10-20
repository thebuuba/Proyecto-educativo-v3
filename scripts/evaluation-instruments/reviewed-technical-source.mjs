import assert from 'node:assert/strict'
import {createHash} from 'node:crypto'
import {readFileSync,writeFileSync} from 'node:fs'
import {createRequire} from 'node:module'
import {parseEnv} from 'node:util'
import {pathToFileURL} from 'node:url'
import {resolve} from 'node:path'
import {developmentEnvironment,developmentProjectRef as project} from '../cloudflare-development-environment.mjs'
import {readDevelopmentHistory} from './development-history.mjs'

const matrixPath='docs/curriculum/cobertura-secundaria/technical-ifc006-mf053-4-matriz.json'
const digest=value=>createHash('sha256').update(value).digest('hex')
const normalize=value=>value.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase()
const code='MINERD_IFC006_MF053_4_NORM_2017_V1'
const id=(kind,key)=>{
 const b=createHash('sha1').update(Buffer.from('6ba7b8119dad11d180b400c04fd430c8','hex')).update(`${code}/${kind}/${key}`).digest().subarray(0,16)
 b[6]=(b[6]&15)|80;b[8]=(b[8]&63)|128
 const h=b.toString('hex');return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`
}
/** No DB access. Only the individually reviewed MF053 source is admissible. */
export function technicalSourceManifest(matrix){
 for(const [key,value]of Object.entries({moduleCode:'MF_053_3',subjectCode:'MF_053_3',programCode:'IFC006_3',level:'SECONDARY',grade:4,cycle:2,modalityCode:'technical_professional',optativeExitName:null}))assert.equal(matrix[key],value,key)
 assert.equal(matrix.source.sha256,'70e6f9b44322610fadb7da3dc733e49d32d1abada73267da36f7e115e39817e9')
 assert.equal(matrix.source.editionYear,null);assert.equal(matrix.source.pageCount,74)
 assert.equal(matrix.sourceVisualReview.status,'REVIEWED');assert.deepEqual(matrix.sourceVisualReview.pages,[15,16,17,18,19])
 assert.equal(matrix.normativeValidation.year,2017);assert.equal(matrix.normativeValidation.code,'06-2017')
 const records=matrix.officialRecords.map(({id,type,sourceCode,literal,pdfPages,parts,assessmentPolicy})=>({id,type,sourceCode,literal,pdfPages,parts,assessmentPolicy}))
 const sourceDigest=digest(JSON.stringify(records))
 assert.equal(sourceDigest,'8d4af8ce1208c4039aac6458170d965b8c05b5cad32bd3489d19281c73b88b92','Los literales revisados fueron alterados')
 const versionId=id('version','2017'),documentId=id('document',matrix.source.sha256),scopeId=id('scope','ifc006-mf053-4')
 // RA and teaching orientations have no equivalent element type in the current schema.
 // Preserve them literally as documentary metadata, never relabel as competencies/concepts.
 const documentaryRecords=records.filter(r=>['LEARNING_OUTCOME','TEACHING_STRATEGY'].includes(r.type))
 const typeMap={EVALUATION_CRITERION:'EVALUATION_CRITERION',CONCEPT:'CONCEPT',PROCEDURE:'PROCEDURE',ATTITUDE:'ATTITUDE_VALUE'}
 const selectable=records.filter(r=>r.type in typeMap)
 assert.equal(selectable.length,75);assert.equal(documentaryRecords.length,8)
 const elements=selectable.map((r,sourceOrder)=>({id:id('element',r.id),versionId,scopeId,stableKey:r.id,elementType:typeMap[r.type],originalText:r.literal,normalizedText:normalize(r.literal),reviewStatus:'REVIEWED',sourceOrder}))
 const spans=selectable.flatMap(r=>r.parts.map(part=>({versionId,elementId:id('element',r.id),documentId,pdfPage:part.pdfPage,printedPage:null,sectionName:'MF_053_3 Análisis y Diseño de Sistemas Informáticos'})))
 const metadata={
  technicalModuleCode:'MF_053_3',technicalProgramCode:'IFC006_3',subjectCodes:['MF_053_3'],grades:[4],
  modalityCodes:['technical_professional'],commonOnly:false,sourceEditionYear:null,editionYearBasis:'NORMATIVE_VALIDATION',
  normativeValidation:matrix.normativeValidation,sourcePdfHash:matrix.source.sha256,sourceUrl:matrix.source.url,
  datasetDigest:sourceDigest,review:matrixPath,reviewKind:'LITERAL_SOURCE_AND_SCOPE_NOT_COMPLETE_INSTRUMENT_COVERAGE',
  scopeMap:{4:{sourceId:'ifc006-mf053-4',id:scopeId}},
  excludedAssessmentElementIds:selectable.filter(r=>r.type==='ATTITUDE').map(r=>id('element',r.id)),
  documentaryRecords,sourceRecordTypes:Object.fromEntries(records.map(r=>[r.id,r.type])),
  literalRecordParts:Object.fromEntries(records.map(r=>[r.id,r.parts])),
  learningOutcomeLinks:records.filter(r=>r.type==='LEARNING_OUTCOME').map(r=>({outcome:r.id,criteria:records.filter(c=>c.type==='EVALUATION_CRITERION'&&c.sourceCode.startsWith(r.sourceCode.replace('RA','CE')+'.')).map(c=>id('element',c.id))})),
 }
 return{
  project,code,metadata,version:{id:versionId,code,level:'SECONDARY',editionYear:2017,importMetadata:metadata},
  document:{id:documentId,versionId,title:'Bachillerato Técnico en Desarrollo y Administración de Aplicaciones Informáticas — IFC006_3',originalFilename:'IFC006_3.pdf',sha256:matrix.source.sha256,pageCount:74,issuingBody:'MINERD'},
  scope:{id:scopeId,versionId,stableKey:'ifc006-mf053-4',cycle:2,grade:4,areaName:'Informática y Comunicaciones',subjectName:matrix.subjectName,modalityName:'Técnico Profesional',optativeExitName:null,assignmentSourcePdfPage:14,areaSearch:normalize('Informática y Comunicaciones'),subjectSearch:normalize(matrix.subjectName)},
  elements,spans,elementIdMap:Object.fromEntries(selectable.map(r=>[r.id,id('element',r.id)])),
 }
}
async function install(manifest,pdfPath){
 assert(pdfPath,'Se requiere --pdf con el PDF oficial verificado')
 assert.equal(digest(readFileSync(pdfPath)),manifest.document.sha256,'PDF diferente al revisado')
 Object.assign(process.env,developmentEnvironment(parseEnv(readFileSync('.dev.vars.local','utf8'))))
 const require=createRequire(new URL('../../apps/backend/package.json',import.meta.url)),{prisma}=require('@aula/database')
 try{
  const before=await readDevelopmentHistory(),existing=await prisma.curriculumVersion.findUnique({where:{code}})
  let result='UNCHANGED'
  if(existing){
   assert.equal(existing.id,manifest.version.id);assert.equal(existing.status,'PUBLISHED');assert.deepEqual(existing.importMetadata,manifest.metadata)
  }else{
   await prisma.$transaction(async tx=>{
    await tx.curriculumVersion.create({data:{...manifest.version,status:'DRAFT'}})
    await tx.curriculumDocument.create({data:manifest.document})
    await tx.curriculumScope.create({data:manifest.scope})
    await tx.curriculumElement.createMany({data:manifest.elements})
    await tx.curriculumSourceSpan.createMany({data:manifest.spans})
    await tx.curriculumVersion.update({where:{id:manifest.version.id},data:{status:'VALIDATED',validatedAt:new Date()}})
    await tx.curriculumVersion.update({where:{id:manifest.version.id},data:{status:'PUBLISHED',publishedAt:new Date()}})
   },{timeout:120000})
   result='CREATED'
  }
  const versionId=manifest.version.id
  const actualElements=await prisma.curriculumElement.findMany({where:{versionId},select:{id:true,stableKey:true,originalText:true,elementType:true,scopeId:true}})
  assert.equal(actualElements.length,manifest.elements.length)
  for(const e of manifest.elements)assert.deepEqual(actualElements.find(r=>r.id===e.id),{id:e.id,stableKey:e.stableKey,originalText:e.originalText,elementType:e.elementType,scopeId:e.scopeId})
  assert.equal(await prisma.curriculumScope.count({where:{versionId}}),1)
  assert.equal(await prisma.curriculumDocument.count({where:{versionId}}),1)
  for(const [model,expected]of [['curriculumDocument',manifest.document],['curriculumScope',manifest.scope]]){
   const actual=await prisma[model].findUniqueOrThrow({where:{id:expected.id}})
   assert.deepEqual(Object.fromEntries(Object.keys(expected).map(key=>[key,actual[key]])),expected)
  }
  const actualSpans=await prisma.curriculumSourceSpan.findMany({where:{versionId},select:{versionId:true,elementId:true,documentId:true,pdfPage:true,printedPage:true,sectionName:true}})
  const ordered=rows=>rows.map(r=>JSON.stringify(r)).sort()
  assert.deepEqual(ordered(actualSpans),ordered(manifest.spans))
  const after=await readDevelopmentHistory()
  for(const key of ['releases','snapshots'])for(const prior of before[key])assert.deepEqual(after[key].find(r=>key==='releases'?r.version===prior.version:r.id===prior.id),prior)
  const evidence={project,code,result,versionId,documentId:manifest.document.id,scopeId:manifest.scope.id,metadata:manifest.metadata,elementIdMap:manifest.elementIdMap,elements:manifest.elements.length,spans:manifest.spans.length,documentaryRecords:8,literalRecords:83,excludedFromAssessment:6,preservedReleases:before.releases.length,preservedSnapshots:before.snapshots.length}
  writeFileSync(`.wrangler/secondary-completion/${code}-source.json`,JSON.stringify(evidence,null,2)+'\n')
  console.log(JSON.stringify({...evidence,elementIdMap:undefined,metadata:undefined}))
 }finally{await prisma.$disconnect()}
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 const manifest=technicalSourceManifest(JSON.parse(readFileSync(matrixPath,'utf8')))
 if(process.argv.includes('--install')){
  assert(process.argv.includes('--pdf'),'Se requiere --pdf con el PDF oficial verificado')
  await install(manifest,process.argv[process.argv.indexOf('--pdf')+1])
 }
 else console.log(JSON.stringify(manifest,null,2))
}
