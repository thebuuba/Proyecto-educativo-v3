import assert from 'node:assert/strict'
import {readFileSync,writeFileSync,existsSync} from 'node:fs'
import {localClient,context,fingerprint} from './language-local-client.mjs'
const fixtures=JSON.parse(readFileSync('data/evaluation-instruments/english-grade-two-contracts.json','utf8'))
const root='docs/curriculum/cobertura-secundaria/evidencias/'
const before=process.argv.includes('--before'),{request,health}=await localClient()
assert.equal(health.development.catalogVersion,before?'evaluation-2026.46':'evaluation-2026.48')
const sectionSubjectId=context.assignments.find(a=>a.grade===2&&a.code==='ING').id
const results=[],interpretations=[]
if(before){
 const path=root+'ingles-2-historicos-base.json'
 assert(!existsSync(path),'Do not overwrite the historical baseline')
 const current=await request('/activities')
 const snapshots=current.filter(a=>a.instrumentSnapshot).map(a=>({id:a.id,hash:fingerprint({snapshot:a.instrumentSnapshot,fields:a.instrumentCriteria,maxScore:a.maxScore,instrumentType:a.instrumentType})}))
 assert.equal(snapshots.length,108)
 writeFileSync(path,JSON.stringify({health,recordedAt:new Date().toISOString(),snapshots},null,2)+'\n')
}
for(const fixture of fixtures){
 if(!before){
  const input={sectionSubjectId,activityTitle:'Actividad',description:fixture.description}
  const response=await request('/evaluation-instruments/interpret',input)
  assert.equal(response.suggestedActivityType,fixture.activity)
  interpretations.push({family:fixture.id,input,response})
 }
 for(const preferredInstrumentType of before?['rubrica']:['rubrica','lista-cotejo','escala','lista-ponderada'])for(const maxScore of before?[20]:[20,17.35]){
  const input={sectionSubjectId,activityTitle:'Actividad',description:fixture.description,maxScore,participationMode:'INDIVIDUAL',preferredInstrumentType}
  const proposal=await request('/evaluation-instruments/recommend',input)
  assert.equal(proposal.catalogVersion,health.development.catalogVersion)
  assert.equal(proposal.curriculumScopeId,'7e4c1236-8f04-5817-b017-a9ace9edff5e')
  if(before)assert(proposal.criteria.every(c=>!c.templateId.startsWith('ing-2-')))
  else{
   assert.equal(proposal.activityType,fixture.activity)
   assert.equal(proposal.instrumentType,preferredInstrumentType)
   assert.deepEqual(proposal.criteria.map(c=>c.templateId),fixture.criteria.map(id=>`ing-2-${id}`))
   for(const word of fixture.contains)assert(JSON.stringify(proposal.criteria).includes(word))
   if(fixture.id==='plans')assert(proposal.criteria[0].description.includes('el día, la hora y el lugar'))
   for(const word of fixture.excludes)assert(!JSON.stringify(proposal.criteria).toLowerCase().includes(word.toLowerCase()))
   assert.equal(proposal.criteria.reduce((n,c)=>n+c.maxScoreUnits,0),Math.round(maxScore*100))
  }
  results.push({family:fixture.id,input,proposal})
 }
 console.log(JSON.stringify({family:fixture.id,proposals:results.length,before}))
}
if(!before){
 const baseline=JSON.parse(readFileSync(root+'ingles-2-historicos-base.json','utf8'))
 const current=await request('/activities')
 for(const old of baseline.snapshots){
  const actual=current.find(a=>a.id===old.id);assert(actual)
  assert.equal(fingerprint({snapshot:actual.instrumentSnapshot,fields:actual.instrumentCriteria,maxScore:actual.maxScore,instrumentType:actual.instrumentType}),old.hash)
 }
 writeFileSync(root+'ingles-2-funciones-historicos.json',JSON.stringify({health,verifiedAt:new Date().toISOString(),baselinePreserved:baseline.snapshots.length,currentSnapshots:current.filter(a=>a.instrumentSnapshot).length},null,2)+'\n')
}
writeFileSync(root+`ingles-2-funciones-${before?'antes':'servicio'}.json`,JSON.stringify({health,verifiedAt:new Date().toISOString(),status:'FUNCTIONS_ONLY_GRADE_PARTIAL',interpretations,results},null,2)+'\n')
console.log(JSON.stringify({proposals:results.length,interpretations:interpretations.length,status:'FUNCTIONS_ONLY_GRADE_PARTIAL'}))
