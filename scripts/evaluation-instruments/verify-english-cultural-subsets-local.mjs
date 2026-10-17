import assert from 'node:assert/strict'
import {writeFileSync} from 'node:fs'
import {localClient,context} from './language-local-client.mjs'
const {request,health}=await localClient()
assert.equal(health.development.catalogVersion,'evaluation-2026.56')
const cases=[
 {grade:3,target:'leyendas',excluded:['historias'],description:'Compararán en inglés las leyendas de los ejemplos proporcionados de República Dominicana y otros países.'},
 {grade:3,target:'advertencias',excluded:['prohibiciones'],description:'Compararán en inglés las advertencias de los ejemplos proporcionados de República Dominicana y otros países.'},
 {grade:4,target:'tradiciones',excluded:['valores','creencias'],description:'Compararán en inglés las tradiciones de los ejemplos proporcionados de República Dominicana y otros países, que incluyen celebraciones.'},
]
const results=[]
for(const f of cases){
 const sectionSubjectId=context.assignments.find(a=>a.grade===f.grade&&a.code==='ING').id
 const input={sectionSubjectId,activityTitle:'Actividad',description:f.description,maxScore:20,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'}
 const proposal=await request('/evaluation-instruments/recommend',input)
 const c=proposal.criteria.find(c=>c.templateId===`ing-${f.grade}-strategy-cultural-comparison`)
 assert(c);assert(c.description.includes(f.target));assert.equal(proposal.activityType,'COMPARISON')
 for(const absent of f.excluded)assert(!c.description.includes(absent))
 assert.equal(proposal.totalScoreUnits,2000)
 results.push({grade:f.grade,input,proposal})
}
writeFileSync('docs/curriculum/cobertura-secundaria/evidencias/ingles-cultural-subconjuntos-servicio-56.json',JSON.stringify({verifiedAt:new Date().toISOString(),health,results},null,2)+'\n')
console.log(JSON.stringify({runtime:health.development,cases:results.length,requestedComponentsOnly:true}))
