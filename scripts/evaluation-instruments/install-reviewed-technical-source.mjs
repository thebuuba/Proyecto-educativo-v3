import assert from 'node:assert/strict'
import {developmentProjectRef} from '../cloudflare-development-environment.mjs'

/** Insert one reviewed source atomically; an existing source is verified without repair. */
export async function installReviewedTechnicalSource(prisma,manifest,expectedCode){
 assert(['MINERD_IFC007_MF002_4_NORM_2017_V1','MINERD_IFC006_MF054_5_NORM_2017_V1','MINERD_IFC006_MF056_4_NORM_2017_V1'].includes(expectedCode))
 assert.equal(manifest.project,developmentProjectRef)
 assert.equal(manifest.code,expectedCode)
 const versionId=manifest.version.id,documents=manifest.documents??[manifest.document]
 const existing=await prisma.curriculumVersion.findUnique({where:{code:manifest.code}})
 if(existing){
  assert.equal(existing.id,versionId);assert.equal(existing.status,'PUBLISHED')
  assert.deepEqual(Object.fromEntries(Object.keys(manifest.version).map(key=>[key,existing[key]])),manifest.version)
 }else{
  await prisma.$transaction(async tx=>{
   await tx.curriculumVersion.create({data:{...manifest.version,status:'DRAFT'}})
   await tx.curriculumDocument.createMany({data:documents})
   await tx.curriculumScope.create({data:manifest.scope})
   await tx.curriculumElement.createMany({data:manifest.elements})
   await tx.curriculumSourceSpan.createMany({data:manifest.spans})
   await tx.curriculumVersion.update({where:{id:versionId},data:{status:'VALIDATED',validatedAt:new Date()}})
   await tx.curriculumVersion.update({where:{id:versionId},data:{status:'PUBLISHED',publishedAt:new Date()}})
  },{timeout:120000})
 }
 for(const [model,expected]of [
  ['curriculumDocument',documents],['curriculumScope',[manifest.scope]],['curriculumElement',manifest.elements],['curriculumSourceSpan',manifest.spans],
 ]){
  const keys=Object.keys(expected[0]),select=Object.fromEntries(keys.map(key=>[key,true]))
  const actual=await prisma[model].findMany({where:{versionId},select})
  const ordered=rows=>rows.map(row=>JSON.stringify(Object.fromEntries(keys.map(key=>[key,row[key]])))).sort()
  assert.deepEqual(ordered(actual),ordered(expected),model)
 }
 return existing?'UNCHANGED':'CREATED'
}
