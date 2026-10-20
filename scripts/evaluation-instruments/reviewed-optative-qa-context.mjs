import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
import {parseEnv} from 'node:util'
import {createRequire} from 'node:module'
import {developmentEnvironment,developmentProjectRef as project} from '../cloudflare-development-environment.mjs'

// Reuse the existing fictitious academic course; never change a personal course or an account.
const subjectCode=process.argv[2]
const grade={'OPT-MT-4':4,'OPT-HCS-SOC-6':6,'OPT-HCS-SOC-5':5,'OPT-HCS-SOC-4':4,'OPT-HCS-LEN-6':6,'OPT-HCS-LEN-5':5,'OPT-HCS-LEN-4':4,'OPT-HLM-LEN-4':4,'OPT-HLM-LEN-5':5,'OPT-HLM-LEN-6':6,'OPT-HLM-ING-4':4,'OPT-HLM-ING-5':5,'OPT-HLM-ING-6':6}[subjectCode]
assert(grade,'Solo se admiten las optativas revisadas explícitamente')
const family=subjectCode==='OPT-MT-4'?'optative-mt':['OPT-HCS-SOC-4','OPT-HCS-SOC-5','OPT-HCS-SOC-6'].includes(subjectCode)?'optative-hcs-soc':['OPT-HCS-LEN-4','OPT-HCS-LEN-5','OPT-HCS-LEN-6'].includes(subjectCode)?'optative-hcs-len':['OPT-HLM-ING-4','OPT-HLM-ING-5','OPT-HLM-ING-6'].includes(subjectCode)?'optative-hlm-ing':'optative-hlm-len'
const read=p=>JSON.parse(readFileSync(p,'utf8')),qa=read(`.wrangler/secondary-completion/social-${grade}-context.json`)
const matrix=read(`docs/curriculum/cobertura-secundaria/${family}-${grade}-matriz.json`)
assert.equal(qa.project,project);assert.equal(matrix.subjectCode,subjectCode);assert.equal(matrix.sourceVisualReview.status,'REVIEWED')
assert.equal(matrix.verification.fullReview.pending,0)
Object.assign(process.env,developmentEnvironment(parseEnv(readFileSync('.dev.vars.local','utf8'))))
const {prisma}=createRequire(new URL('../../apps/backend/package.json',import.meta.url))('@aula/database')
try{
 const original=await prisma.sectionSubject.findUniqueOrThrow({where:{id:qa.sectionSubjectId},include:{school:true,grade:{include:{academicLevel:true,defaultModality:true}},section:true}})
 assert.equal(original.schoolId,qa.schoolId);assert.match(original.school.name,/ficticio QA Development/)
 assert.equal(original.grade.sequence,grade);assert.equal(original.grade.academicLevel.code,'secundario');assert.equal(original.grade.defaultModality.code,'academic')
 assert.equal(original.grade.schoolId,qa.schoolId);assert.equal(original.section.schoolId,qa.schoolId)
 const assignment=await prisma.$transaction(async tx=>{
  const subject=await tx.subject.findFirst({where:{schoolId:qa.schoolId,code:subjectCode}})??await tx.subject.create({data:{schoolId:qa.schoolId,code:subjectCode,name:matrix.subjectName}})
  assert.equal(subject.name,matrix.subjectName)
  const row=await tx.sectionSubject.findFirst({where:{schoolId:qa.schoolId,schoolYearId:qa.schoolYearId,sectionId:original.sectionId,subjectId:subject.id}})??await tx.sectionSubject.create({data:{schoolId:qa.schoolId,schoolYearId:qa.schoolYearId,gradeId:original.gradeId,sectionId:original.sectionId,subjectId:subject.id}})
  assert.equal(row.gradeId,original.gradeId);assert.equal(row.status,'ACTIVE')
  const exit=await tx.sectionCurriculumContext.findUnique({where:{sectionSubjectId:row.id}})
  if(exit)assert.equal(exit.optativeExitName,matrix.optativeExitName)
  else await tx.sectionCurriculumContext.create({data:{sectionSubjectId:row.id,optativeExitName:matrix.optativeExitName}})
  return row
 })
 writeFileSync(`.wrangler/secondary-completion/${family}-${grade}-context.json`,JSON.stringify({...qa,grade,subjectCode,sectionSubjectId:assignment.id,modalityCode:'academic',optativeExitName:matrix.optativeExitName},null,2)+'\n')
 console.log(JSON.stringify({project,subjectCode,grade,existingCourseUnchanged:true,newAccounts:0,qaContextReady:true}))
}finally{await prisma.$disconnect()}
