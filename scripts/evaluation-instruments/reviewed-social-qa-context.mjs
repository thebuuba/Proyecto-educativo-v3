import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
import {parseEnv} from 'node:util'
import {createRequire} from 'node:module'
import {developmentEnvironment,developmentProjectRef as project} from '../cloudflare-development-environment.mjs'

// Only the existing fictitious QA school; no accounts, real-school data or catalog writes.
const gradeNumber=Number(process.argv[2])
assert(Number.isInteger(gradeNumber)&&gradeNumber>=1&&gradeNumber<=6)
const matrix=JSON.parse(readFileSync(`docs/curriculum/cobertura-secundaria/sociales-${gradeNumber}-matriz.json`,'utf8'))
assert.equal(matrix.grade,gradeNumber);assert.equal(matrix.sourceVisualReview.status,'REVIEWED')
Object.assign(process.env,developmentEnvironment(parseEnv(readFileSync('.dev.vars.local','utf8'))))
const qa=JSON.parse(readFileSync('.development-qa-context.local','utf8'));assert.equal(qa.project,project)
const require=createRequire(new URL('../../apps/backend/package.json',import.meta.url)),{prisma}=require('@aula/database')
try{
 const school=await prisma.school.findUniqueOrThrow({where:{id:qa.schoolId}});assert.match(school.name,/ficticio QA Development/)
 const [level,cycle,modality]=await Promise.all([
  prisma.drAcademicLevel.findUniqueOrThrow({where:{code:'secundario'}}),
  prisma.drAcademicCycle.findUniqueOrThrow({where:{code:gradeNumber<=3?'secundario_primer_ciclo':'secundario_segundo_ciclo'}}),
  prisma.drModality.findUniqueOrThrow({where:{code:'academic'}}),
 ])
 const schoolId=qa.schoolId,name=`${gradeNumber}.º secundaria QA Ciencias Sociales Development`
 const grade=await prisma.grade.findFirst({where:{schoolId,name}})??await prisma.grade.create({data:{schoolId,name,sequence:gradeNumber,level:'Secundario',academicLevelId:level.id,academicCycleId:cycle.id,defaultModalityId:modality.id}})
 assert.equal(grade.sequence,gradeNumber);assert.equal(grade.academicCycleId,cycle.id)
 const section=await prisma.section.findFirst({where:{schoolId,gradeId:grade.id,name:'QA Ciencias Sociales'}})??await prisma.section.create({data:{schoolId,gradeId:grade.id,name:'QA Ciencias Sociales'}})
 const subject=await prisma.subject.findFirst({where:{schoolId,code:'SOC'}})??await prisma.subject.create({data:{schoolId,code:'SOC',name:'Ciencias Sociales'}})
 const assignment=await prisma.sectionSubject.findFirst({where:{schoolId,schoolYearId:qa.schoolYearId,sectionId:section.id,subjectId:subject.id}})??await prisma.sectionSubject.create({data:{schoolId,schoolYearId:qa.schoolYearId,gradeId:grade.id,sectionId:section.id,subjectId:subject.id}})
 writeFileSync(`.wrangler/secondary-completion/social-${gradeNumber}-context.json`,JSON.stringify({...qa,grade:gradeNumber,sectionSubjectId:assignment.id,subjectCode:'SOC'},null,2)+'\n')
 console.log(JSON.stringify({project,grade:gradeNumber,qaContextReady:true,noAccountWrites:true}))
}finally{await prisma.$disconnect()}
