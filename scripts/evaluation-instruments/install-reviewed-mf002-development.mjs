import assert from 'node:assert/strict'
import {createHash} from 'node:crypto'
import {readFileSync,writeFileSync} from 'node:fs'
import {createRequire} from 'node:module'
import {parseEnv} from 'node:util'
import {pathToFileURL} from 'node:url'
import {resolve} from 'node:path'
import {developmentEnvironment,developmentProjectRef} from '../cloudflare-development-environment.mjs'
import {readDevelopmentHistory} from './development-history.mjs'
import {mf002SourceManifest} from './reviewed-mf002-source.mjs'

/** New reviewed source only. Existing versions are verified, never updated. */
export async function installMf002Source(prisma,manifest){
 assert.equal(manifest.project,developmentProjectRef)
 assert.equal(manifest.code,'MINERD_IFC007_MF002_4_NORM_2017_V1')
 const versionId=manifest.version.id
 const existing=await prisma.curriculumVersion.findUnique({where:{code:manifest.code}})
 if(existing){
  assert.equal(existing.id,versionId);assert.equal(existing.status,'PUBLISHED')
  assert.deepEqual(Object.fromEntries(Object.keys(manifest.version).map(key=>[key,existing[key]])),manifest.version)
 }else{
  await prisma.$transaction(async tx=>{
   await tx.curriculumVersion.create({data:{...manifest.version,status:'DRAFT'}})
   await tx.curriculumDocument.createMany({data:manifest.documents})
   await tx.curriculumScope.create({data:manifest.scope})
   await tx.curriculumElement.createMany({data:manifest.elements})
   await tx.curriculumSourceSpan.createMany({data:manifest.spans})
   await tx.curriculumVersion.update({where:{id:versionId},data:{status:'VALIDATED',validatedAt:new Date()}})
   await tx.curriculumVersion.update({where:{id:versionId},data:{status:'PUBLISHED',publishedAt:new Date()}})
  },{timeout:120000})
 }
 for(const [model,expected]of [
  ['curriculumDocument',manifest.documents],['curriculumScope',[manifest.scope]],['curriculumElement',manifest.elements],['curriculumSourceSpan',manifest.spans],
 ]){
  const keys=Object.keys(expected[0]),select=Object.fromEntries(keys.map(key=>[key,true]))
  const actual=await prisma[model].findMany({where:{versionId},select})
  const ordered=rows=>rows.map(row=>JSON.stringify(Object.fromEntries(keys.map(key=>[key,row[key]])))).sort()
  assert.deepEqual(ordered(actual),ordered(expected),model)
 }
 return existing?'UNCHANGED':'CREATED'
}

if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 assert(process.argv.includes('--install'),'Se requiere --install explícito.')
 const manifest=mf002SourceManifest(JSON.parse(readFileSync('docs/curriculum/cobertura-secundaria/technical-mf002-4-matriz.json','utf8')))
 for(const [index,flag]of ['--pdf-ifc006','--pdf-ifc007'].entries()){
  const position=process.argv.indexOf(flag);assert(position>=0&&process.argv[position+1],`Falta ${flag}`)
  assert.equal(createHash('sha256').update(readFileSync(process.argv[position+1])).digest('hex'),manifest.documents[index].sha256,'PDF diferente al revisado')
 }
 Object.assign(process.env,developmentEnvironment(parseEnv(readFileSync('.dev.vars.local','utf8'))))
 const require=createRequire(new URL('../../apps/backend/package.json',import.meta.url)),{prisma}=require('@aula/database')
 try{
  const [role]=await prisma.$queryRawUnsafe('select current_user::text as name, (select rolbypassrls from pg_roles where rolname=current_user) as bypass')
  assert(['app_backend_local','app_backend'].includes(role.name));assert.equal(role.bypass,false)
  const before=await readDevelopmentHistory(),result=await installMf002Source(prisma,manifest),after=await readDevelopmentHistory()
  assert.deepEqual(after,before,'Una instalación de fuente no debe alterar catálogos ni snapshots')
  const evidence={project:manifest.project,code:manifest.code,result,versionId:manifest.version.id,scopeId:manifest.scope.id,documentIds:manifest.documents.map(d=>d.id),elementIdMap:manifest.elementIdMap,metadata:manifest.metadata,elements:192,spans:271,documentaryRecords:18,literalRecords:210,literalParts:302,excludedFromAssessment:22,preservedReleases:before.releases.length,preservedSnapshots:before.snapshots.length}
  writeFileSync(`.wrangler/secondary-completion/${manifest.code}-source.json`,JSON.stringify(evidence,null,2)+'\n')
  console.log(JSON.stringify({...evidence,elementIdMap:undefined,metadata:undefined}))
 }finally{await prisma.$disconnect()}
}
