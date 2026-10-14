import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
import {localClient,context} from './language-local-client.mjs'
const fixtures=JSON.parse(readFileSync('data/evaluation-instruments/english-grade-one-contracts.json','utf8'))
const {request,health}=await localClient(),results=[]
assert.equal(health.development.catalogVersion,'evaluation-2026.35')
const sectionSubjectId=context.assignments.find(a=>a.grade===1&&a.code==='ING').id
for(const f of fixtures){
 const interpretation=await request('/evaluation-instruments/interpret',{sectionSubjectId,activityTitle:'Actividad',description:f.description})
 assert.equal(interpretation.suggestedActivityType,f.activity)
 assert.equal(interpretation.suggestedEvaluationTechnique,f.technique)
 for(const preferredInstrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'])for(const maxScore of [20,17.35]){
  const input={sectionSubjectId,activityTitle:'Actividad',description:f.description,maxScore,participationMode:'INDIVIDUAL',preferredInstrumentType}
  const proposal=await request('/evaluation-instruments/recommend',input)
  assert.equal(proposal.catalogVersion,health.development.catalogVersion)
  assert.equal(proposal.curriculumScopeId,'7e7fbeb7-c16c-526c-9b7f-ff20ef44d44f')
  assert.equal(proposal.activityType,f.activity)
  assert.equal(proposal.instrumentType,preferredInstrumentType)
  assert.deepEqual(proposal.criteria.map(c=>c.templateId),f.criteria.map(id=>`ing-1-${id}`))
  for(const word of f.contains)assert(JSON.stringify(proposal.criteria).includes(word))
  assert.equal(proposal.criteria.reduce((n,c)=>n+c.maxScoreUnits,0),Math.round(maxScore*100))
  results.push({topic:f.topic,input,interpretation,proposal})
 }
}
writeFileSync('docs/curriculum/cobertura-secundaria/evidencias/ingles-1-servicio.json',JSON.stringify({health,verifiedAt:new Date().toISOString(),results},null,2)+'\n')
console.log(JSON.stringify({requests:results.length,interpretations:fixtures.length,formats:4,totals:[20,17.35]}))
