import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
import {localClient,context} from './language-local-client.mjs'
import {capacityDescription} from './criterion-capacity-fixture.mjs'
const grammar=JSON.parse(readFileSync('data/evaluation-instruments/english-grade-one-grammar-contracts.json','utf8'))
const {request,requestResult,health}=await localClient(),results=[]
assert.equal(health.development.catalogVersion,'evaluation-2026.42')
const sectionSubjectId=context.assignments.find(a=>a.grade===1&&a.code==='ING').id
for(const preferredInstrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'])for(const maxScore of [20,17.35]){
 const input={sectionSubjectId,activityTitle:'Actividad',description:capacityDescription,maxScore,participationMode:'INDIVIDUAL',preferredInstrumentType}
 const rejected=await requestResult('/evaluation-instruments/recommend',input)
 assert.equal(rejected.status,400)
 assert(JSON.stringify(rejected.body).includes('31 criterios'))
 const accepted=await request('/evaluation-instruments/recommend',{...input,description:`Leerán un texto en inglés e identificarán ${grammar.slice(0,20).map(f=>f.term).join(', ')}.`})
 assert.equal(accepted.criteria.length,20)
 assert.equal(accepted.criteria.reduce((sum,c)=>sum+c.maxScoreUnits,0),Math.round(maxScore*100))
 results.push({input,rejected,accepted})
}
writeFileSync('docs/curriculum/cobertura-secundaria/evidencias/criterios-capacidad-servicio.json',JSON.stringify({health,verifiedAt:new Date().toISOString(),results})+'\n')
console.log(JSON.stringify({rejectedWithoutTruncation:8,acceptedAtCapacity:8}))
