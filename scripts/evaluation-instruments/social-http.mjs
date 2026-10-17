import assert from 'node:assert/strict'
import {readFileSync,writeFileSync,existsSync} from 'node:fs'
import {parseEnv} from 'node:util'
import {createRequire} from 'node:module'
import {randomUUID,createHash} from 'node:crypto'
import {developmentEnvironment,developmentProjectRef as project} from '../cloudflare-development-environment.mjs'
import {editableFallbackRecommendation,recommendationToFields,alignRecommendationWithFields} from '../../apps/frontend/src/modules/activities/services/instrumentPreparation.ts'
import {scoreInstrumentFields} from '../../apps/frontend/src/modules/activities/services/instrumentScoring.ts'
import {validateInstrumentDefinition} from '../../packages/shared/src/index.ts'
Object.assign(process.env,developmentEnvironment(parseEnv(readFileSync('.dev.vars.local','utf8'))))
const path='.wrangler/secondary-completion/',context=JSON.parse(readFileSync(path+'social-1-context.json','utf8'))
assert.equal(context.project,project)
const qa=JSON.parse(readFileSync('.development-qa-account.local','utf8'))
const require=createRequire(new URL('../../apps/backend/package.json',import.meta.url)),{prisma}=require('@aula/database')
const base='http://localhost:8787',progressPath=path+'social-1-http-progress.json'
const progress=existsSync(progressPath)?JSON.parse(readFileSync(progressPath,'utf8')):{project,grade:1,writes:[],timings:[]}
assert.equal(progress.project,project)
const save=()=>writeFileSync(progressPath,JSON.stringify(progress,null,2)+'\n')
let cookie
const request=async(endpoint,input)=>{
 const start=performance.now(),response=await fetch(base+'/api/v1'+endpoint,{method:input?'POST':'GET',headers:{'content-type':'application/json',...(cookie?{cookie}:{})},...(input?{body:JSON.stringify(input)}:{}),signal:AbortSignal.timeout(30000)})
 progress.timings.push({endpoint,status:response.status,ms:performance.now()-start});save()
 assert(response.ok,endpoint+': HTTP '+response.status)
 return{data:(await response.json()).data,response}
}
const canonical=v=>JSON.stringify(v,(_,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.entries(x).sort(([a],[b])=>a.localeCompare(b))):x)
const hash=v=>createHash('sha256').update(canonical(v)).digest('hex')
const definition=a=>({instrumentId:a.instrumentId,snapshotId:a.instrumentSnapshotId,snapshot:a.instrumentSnapshot,criteria:a.instrumentCriteria,maxScore:a.maxScore,type:a.instrumentType,technique:a.evaluationTechnique})
const content=p=>({activity:p.activityType,type:p.instrumentType,levels:p.levels,criteria:p.criteria.map(({id,sourceReferences,sourceType,...c})=>c)})
const descriptions=[
 'Analiza las causas y consecuencias de la expansión colonial europea usando las fuentes proporcionadas.',
 'Ubica los lugares señalados en el mapa utilizando los puntos cardinales. Sin calcular escalas ni utilizar GPS.',
 'Compara liberalismo y conservadurismo en Europa e interpreta las perspectivas de los autores proporcionados.',
 'Elabora una línea de tiempo de la Revolución Francesa con los hechos y fechas indicados.',
]
const formats=['rubrica','lista-cotejo','escala','lista-ponderada']
try{
 const school=await prisma.school.findUniqueOrThrow({where:{id:context.schoolId}});assert.match(school.name,/ficticio QA Development/)
 const login=await request('/auth/login',{email:qa.email,password:qa.password})
 cookie=login.response.headers.getSetCookie().find(s=>s.startsWith('aulabase_session='))?.split(';')[0];assert(cookie)
 const center=(await request('/activities/center?contextOnly=true')).data
 assert(center.sectionSubjects.some(s=>s.id===context.sectionSubjectId))
 const activities=async()=>(await request('/activities?sectionSubjectId='+context.sectionSubjectId)).data
 for(const [i,format] of formats.entries()){
  let write=progress.writes.find(w=>w.format===format)
  if(!write){
   const score=i%2?17.35:20,description=descriptions[i],name=`QA Sociales 1.º · ${format} · ${randomUUID().slice(0,8)}`
   const input={sectionSubjectId:context.sectionSubjectId,activityTitle:name,description,competencyBlock:'b1',maxScore:score,preferredInstrumentType:format,participationMode:'INDIVIDUAL'}
   const interpretation=(await request('/evaluation-instruments/interpret',{sectionSubjectId:context.sectionSubjectId,activityTitle:name,description,competencyBlock:'b1'})).data
   const proposal=(await request('/evaluation-instruments/recommend',input)).data
   assert.equal(proposal.catalogVersion,'evaluation-2026.94');assert(proposal.criteria.every(c=>c.templateId.startsWith('soc-1-')))
   assert.equal(interpretation.suggestedActivityType,proposal.activityType)
   const local=editableFallbackRecommendation({...input,instrumentType:format,academicContext:{level:'SECONDARY',grade:1,subjectCode:'SOC',subjectName:'Ciencias Sociales'}})
   assert.deepEqual(content(proposal),content(local))
   const pending=scoreInstrumentFields(recommendationToFields(proposal,name),format,null,proposal)
   assert.equal(pending[`${format}:points:0`],'')
   const fields=scoreInstrumentFields(pending,format,score,proposal)
   fields[`${format}:criterion:0`]='Texto manual QA Sociales'
   assert.deepEqual(validateInstrumentDefinition(format,fields,score),[])
   write={format,creationId:randomUUID(),input:{sectionSubjectId:context.sectionSubjectId,schoolYearId:context.schoolYearId,academicPeriodId:context.academicPeriodId,competencyBlockId:'b1',name,description,maxScore:score,activityType:'individual',instrumentType:format,instrumentCriteria:fields,instrumentSnapshot:alignRecommendationWithFields(proposal,fields,score),pedagogicalActivityType:proposal.activityType,teachingStrategyId:null,teachingStrategyOrigin:null}}
   progress.writes.push(write);save()
  }
  const existing=await prisma.evaluationActivity.findUnique({where:{id:write.creationId},select:{schoolId:true,sectionSubjectId:true}})
  if(existing){assert.equal(existing.schoolId,context.schoolId);assert.equal(existing.sectionSubjectId,context.sectionSubjectId)}
  else await request('/activities',{creationId:write.creationId,...write.input})
  const original=(await activities()).find(a=>a.id===write.creationId);assert(original)
  if(!write.originalHash){write.originalHash=hash(definition(original));save()}
  assert.equal(hash(definition(original)),write.originalHash)
  if(original.teachingStrategyId!=='CASE_STUDY')await request('/activities',{...write.input,id:write.creationId,instrumentId:original.instrumentId,teachingStrategyId:'CASE_STUDY',teachingStrategyOrigin:'MANUAL'})
  const reopened=(await activities()).find(a=>a.id===write.creationId);assert(reopened)
  assert.equal(hash(definition(reopened)),write.originalHash);assert.equal(reopened.teachingStrategyId,'CASE_STUDY')
  assert.deepEqual(reopened.instrumentCriteria,write.input.instrumentCriteria)
  const db=await prisma.evaluationActivity.findUniqueOrThrow({where:{id:write.creationId},select:{schoolId:true,instrumentSnapshotId:true,teachingStrategyId:true}})
  assert.equal(db.schoolId,context.schoolId);assert.equal(db.instrumentSnapshotId,reopened.instrumentSnapshotId)
  write.verified={format,score:write.input.maxScore,activityId:write.creationId,snapshotId:db.instrumentSnapshotId,strategyOnlyInstrumentUnchanged:true,manualTextPreserved:true,hash:write.originalHash};save()
  console.log(JSON.stringify({phase:'saved-reopened',format,grade:1}))
 }
 const result={project,grade:1,catalog:'evaluation-2026.94',verification:'AUTHENTICATED_HTTP_DB_NOT_BROWSER',sourceScope:'NOT_INSTALLED_YET',samples:progress.writes.map(w=>w.verified),timings:progress.timings,browser:'PENDING'}
 writeFileSync(path+'social-1-http.json',JSON.stringify(result,null,2)+'\n')
}finally{await prisma.$disconnect()}
