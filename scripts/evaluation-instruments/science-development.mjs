import assert from 'node:assert/strict'
import {readFileSync,writeFileSync,existsSync,mkdirSync} from 'node:fs'
import {parseEnv} from 'node:util'
import {createRequire} from 'node:module'
import {developmentEnvironment,developmentProjectRef as project} from '../cloudflare-development-environment.mjs'
Object.assign(process.env,developmentEnvironment(parseEnv(readFileSync('.dev.vars.local','utf8'))))
const require=createRequire(new URL('../../apps/backend/package.json',import.meta.url)),{prisma}=require('@aula/database')
const {evaluationCatalogCurrent:catalog,evaluationCatalogForVersion}=require('../../apps/backend/dist/modules/evaluation-instruments/catalog-current.js')
const shift=process.argv[2]==='development'?1:0,operation=process.argv[2+shift],gradeNumber=Number(process.argv[3+shift]??1)
assert(catalog.scienceCommonModules?.some(m=>m.grade===gradeNumber),'Grade not connected in this build')
const qa=JSON.parse(readFileSync('.development-qa-context.local','utf8'));assert.equal(qa.project,project)
const output='.wrangler/science-source';mkdirSync(output,{recursive:true})
const fingerprints=async()=>({releases:await prisma.$queryRaw`SELECT version, md5(payload::text) AS hash FROM evaluation_catalog_releases ORDER BY version`,snapshots:await prisma.$queryRaw`SELECT id::text, md5(to_jsonb(s)::text) AS hash FROM evaluation_instrument_snapshots s ORDER BY id`})
try{
  const school=await prisma.school.findUniqueOrThrow({where:{id:qa.schoolId}});assert.match(school.name,/ficticio QA Development/)
  const user=await prisma.appUser.findUniqueOrThrow({where:{id:qa.userId}});assert.equal(user.schoolId,qa.schoolId)
  if(operation==='install'){
    const before=await fingerprints(),baselineFile=output+'/history-before.json'
    if(!existsSync(baselineFile))writeFileSync(baselineFile,JSON.stringify({project,...before},null,2)+'\n')
    const gradeBaselineFile=`${output}/grade-${gradeNumber}-history-before.json`
    if(!existsSync(gradeBaselineFile))writeFileSync(gradeBaselineFile,JSON.stringify({project,...before},null,2)+'\n',{flag:'wx'})
    const prior=`evaluation-2026.${Number(catalog.version.split('.').at(-1))-1}`,frozen=evaluationCatalogForVersion(prior);assert(frozen)
    if(before.releases.some(r=>r.version===prior)){
      const [match]=await prisma.$queryRaw`SELECT payload=${JSON.stringify(frozen)}::jsonb AS identical FROM evaluation_catalog_releases WHERE version=${prior}`;assert.equal(match.identical,true,'Frozen previous release differs from stored payload')
    }
    const install=async()=>{
      const rows=await prisma.$queryRaw`SELECT payload=${JSON.stringify(catalog)}::jsonb AS identical FROM evaluation_catalog_releases WHERE version=${catalog.version}`
      if(rows.length){assert.equal(rows[0].identical,true,'Existing release differs: version it, never overwrite');return 'UNCHANGED'}
      try{await prisma.evaluationCatalogRelease.create({data:{version:catalog.version,payload:catalog}});return 'CREATED'}catch(error){if(error.code!=='P2002')throw error;return install()}
    }
    const first=await install(),second=await install();assert.equal(second,'UNCHANGED')
    const after=await fingerprints()
    for(const row of before.releases)assert.equal(after.releases.find(r=>r.version===row.version)?.hash,row.hash)
    for(const row of before.snapshots)assert.equal(after.snapshots.find(r=>r.id===row.id)?.hash,row.hash)
    const result={project,catalog:catalog.version,grade:gradeNumber,first,second,preservedReleases:before.releases.length,preservedSnapshots:before.snapshots.length}
    writeFileSync(`${output}/grade-${gradeNumber}-catalog.json`,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result))
  }else if(operation==='context'){
    const schoolId=qa.schoolId,level=await prisma.drAcademicLevel.findUniqueOrThrow({where:{code:'secundario'}}),cycle=await prisma.drAcademicCycle.findUniqueOrThrow({where:{code:gradeNumber<=3?'secundario_primer_ciclo':'secundario_segundo_ciclo'}}),modality=await prisma.drModality.findUniqueOrThrow({where:{code:'academic'}})
    const name=`${gradeNumber}.º secundaria QA Ciencias Naturaleza Development`
    const grade=await prisma.grade.findFirst({where:{schoolId,name}})??await prisma.grade.create({data:{schoolId,name,sequence:gradeNumber,level:'Secundario',academicLevelId:level.id,academicCycleId:cycle.id,defaultModalityId:modality.id}})
    assert.equal(grade.sequence,gradeNumber)
    const section=await prisma.section.findFirst({where:{schoolId,gradeId:grade.id,name:'QA Ciencias Naturaleza'}})??await prisma.section.create({data:{schoolId,gradeId:grade.id,name:'QA Ciencias Naturaleza'}})
    const subject=await prisma.subject.findFirst({where:{schoolId,code:['NAT-TU','NAT-VIDA','NAT-FISICAS','NAT-BIO','NAT-QUI','NAT-FIS'][gradeNumber-1]}})??await prisma.subject.create({data:{schoolId,code:['NAT-TU','NAT-VIDA','NAT-FISICAS','NAT-BIO','NAT-QUI','NAT-FIS'][gradeNumber-1],name:'Ciencias de la Naturaleza'}})
    const assignment=await prisma.sectionSubject.findFirst({where:{schoolId,schoolYearId:qa.schoolYearId,sectionId:section.id,subjectId:subject.id}})??await prisma.sectionSubject.create({data:{schoolId,schoolYearId:qa.schoolYearId,gradeId:grade.id,sectionId:section.id,subjectId:subject.id}})
    const context={...qa,grade:gradeNumber,subjectCode:subject.code,gradeId:grade.id,sectionId:section.id,subjectId:subject.id,sectionSubjectId:assignment.id}
    writeFileSync(`${output}/grade-${gradeNumber}-context.json`,JSON.stringify(context,null,2)+'\n');console.log(JSON.stringify({project,grade:gradeNumber,subject:subject.code,sectionSubjectId:assignment.id}))
  }else if(operation==='history'){
    const before=JSON.parse(readFileSync(output+'/history-before.json','utf8'));assert.equal(before.project,project);const after=await fingerprints()
    for(const row of before.releases)assert.equal(after.releases.find(r=>r.version===row.version)?.hash,row.hash)
    for(const row of before.snapshots)assert.equal(after.snapshots.find(r=>r.id===row.id)?.hash,row.hash)
    const result={project,preservedReleases:before.releases.length,preservedSnapshots:before.snapshots.length,newReleases:after.releases.length-before.releases.length,newSnapshots:after.snapshots.length-before.snapshots.length}
    const gradeBaselineFile=`${output}/grade-${gradeNumber}-history-before.json`
    if(existsSync(gradeBaselineFile)){
      const gradeBefore=JSON.parse(readFileSync(gradeBaselineFile,'utf8'));assert.equal(gradeBefore.project,project)
      for(const row of gradeBefore.releases)assert.equal(after.releases.find(r=>r.version===row.version)?.hash,row.hash)
      for(const row of gradeBefore.snapshots)assert.equal(after.snapshots.find(r=>r.id===row.id)?.hash,row.hash)
      result.gradeBaseline={grade:gradeNumber,preservedReleases:gradeBefore.releases.length,preservedSnapshots:gradeBefore.snapshots.length,newReleases:after.releases.length-gradeBefore.releases.length,newSnapshots:after.snapshots.length-gradeBefore.snapshots.length}
    }
    writeFileSync(`${output}/history-after.json`,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result))
    writeFileSync(`${output}/grade-${gradeNumber}-history-after.json`,JSON.stringify(result,null,2)+'\n')
  }else throw Error('Select install, context or history')
}finally{await prisma.$disconnect()}
