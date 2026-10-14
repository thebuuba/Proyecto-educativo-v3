import assert from 'node:assert/strict'
import {writeFileSync} from 'node:fs'
import {localClient,context} from './language-local-client.mjs'
const {request,health}=await localClient(),results=[]
assert.equal(health.development.catalogVersion,'evaluation-2026.36')
const sectionSubjectId=context.assignments.find(a=>a.grade===1&&a.code==='ING').id
for(const [term,ids] of [
 ['adverbios de tiempo, frecuencia y modo',['time-adverbs','frequency-adverbs','manner-adverbs']],
 ['preposiciones de tiempo y lugar',['time-prepositions','place-prepositions']],
 ['conectores de coordinación, tiempo y secuencia',['coordination-connectors','time-connectors','sequence-connectors']],
]){
 const input={sectionSubjectId,activityTitle:'Actividad',description:`Leerán un texto en inglés e identificarán ${term}.`,maxScore:17.35,participationMode:'INDIVIDUAL'}
 const proposal=await request('/evaluation-instruments/recommend',input)
 assert.deepEqual(proposal.criteria.map(c=>c.templateId),ids.map(id=>`ing-1-feature-${id}`))
 assert.equal(proposal.totalScoreUnits,1735)
 results.push({input,proposal})
}
const input={sectionSubjectId,activityTitle:'Actividad',description:'Comparen por escrito dos lugares en inglés usando comparativos.',maxScore:20,participationMode:'INDIVIDUAL'}
const proposal=await request('/evaluation-instruments/recommend',input)
assert(proposal.criteria.some(c=>c.templateId==='ing-1-comparison'))
assert(proposal.criteria.some(c=>c.templateId==='ing-1-feature-comparative'))
assert.equal(proposal.totalScoreUnits,2000)
results.push({input,proposal})
writeFileSync('docs/curriculum/cobertura-secundaria/evidencias/ingles-1-gramatica-combinaciones.json',JSON.stringify({health,verifiedAt:new Date().toISOString(),results},null,2)+'\n')
console.log(JSON.stringify({proposals:results.length}))
