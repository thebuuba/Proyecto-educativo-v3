import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
import {localClient,context} from './language-local-client.mjs'
const fixtures=JSON.parse(readFileSync('data/evaluation-instruments/english-grade-one-strategy-contracts.json','utf8'))
const before=process.argv.includes('--before'),{request,health}=await localClient(),results=[]
assert.equal(health.development.catalogVersion,before?'evaluation-2026.38':'evaluation-2026.39')
const sectionSubjectId=context.assignments.find(a=>a.grade===1&&a.code==='ING').id
for(const [index,f] of fixtures.entries()){
 if(before&&!['inference','planning'].includes(f.id))continue
 for(const preferredInstrumentType of before?['rubrica']:['rubrica','lista-cotejo','escala','lista-ponderada']){
  const input={sectionSubjectId,activityTitle:'Actividad',description:f.description,maxScore:index%2?20:17.35,participationMode:'INDIVIDUAL',preferredInstrumentType}
  const proposal=await request('/evaluation-instruments/recommend',input)
  if(!before){
   assert.equal(proposal.curriculumScopeId,'7e7fbeb7-c16c-526c-9b7f-ff20ef44d44f')
   const criterion=proposal.criteria.find(c=>c.templateId===`ing-1-strategy-${f.id}`)
   assert(criterion,`Missing ${f.id}`)
   assert(criterion.description.includes(f.meaning))
   assert.equal(proposal.activityType,f.mode)
   assert.equal(proposal.instrumentType,preferredInstrumentType)
   assert.equal(proposal.criteria.reduce((n,c)=>n+c.maxScoreUnits,0),Math.round(input.maxScore*100))
  }
  results.push({feature:f.id,input,proposal})
 }
}
writeFileSync(`docs/curriculum/cobertura-secundaria/evidencias/ingles-1-estrategias-${before?'antes':'servicio'}.json`,JSON.stringify({health,verifiedAt:new Date().toISOString(),results})+'\n')
console.log(JSON.stringify({before,requests:results.length}))
