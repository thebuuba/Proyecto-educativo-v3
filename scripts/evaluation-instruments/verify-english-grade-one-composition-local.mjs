import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
import {localClient,context} from './language-local-client.mjs'
const fixtures=JSON.parse(readFileSync('data/evaluation-instruments/english-grade-one-composition-contracts.json','utf8'))
const {request,health}=await localClient(),results=[]
assert.equal(health.development.catalogVersion,'evaluation-2026.41')
const sectionSubjectId=context.assignments.find(a=>a.grade===1&&a.code==='ING').id
for(const f of fixtures)for(const preferredInstrumentType of [undefined,'rubrica','lista-cotejo','escala','lista-ponderada'])for(const maxScore of [20,17.35]){
 const input={sectionSubjectId,activityTitle:'Actividad',description:f.description,maxScore,participationMode:'INDIVIDUAL',preferredInstrumentType}
 const proposal=await request('/evaluation-instruments/recommend',input)
 assert.equal(proposal.curriculumScopeId,'7e7fbeb7-c16c-526c-9b7f-ff20ef44d44f')
 assert.equal(proposal.activityType,f.activity)
 assert.equal(proposal.instrumentType,preferredInstrumentType??f.instrument)
 for(const [id,meaning] of f.expected)assert(proposal.criteria.some(c=>c.templateId.startsWith(id)&&c.description.includes(meaning)),`${f.id} ${id}`)
 assert.equal(proposal.criteria.reduce((n,c)=>n+c.maxScoreUnits,0),Math.round(maxScore*100))
 results.push({id:f.id,input,proposal})
}
const interpretations=[]
for(const f of fixtures){const response=await request('/evaluation-instruments/interpret',{sectionSubjectId,activityTitle:'Actividad',description:f.description});assert.equal(response.suggestedActivityType,f.activity);assert.equal(response.suggestedInstrumentType,f.instrument);interpretations.push({id:f.id,response})}
writeFileSync('docs/curriculum/cobertura-secundaria/evidencias/ingles-1-composicion-servicio.json',JSON.stringify({health,verifiedAt:new Date().toISOString(),results,interpretations})+'\n')
console.log(JSON.stringify({proposals:results.length,interpretations:interpretations.length}))
