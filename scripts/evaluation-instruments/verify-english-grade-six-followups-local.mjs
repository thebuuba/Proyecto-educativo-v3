import assert from 'node:assert/strict'
import {writeFileSync} from 'node:fs'
import {localClient,context} from './language-local-client.mjs'
const {request,health}=await localClient()
assert.equal(health.development.catalogVersion,'evaluation-2026.63')
const cases=[
 {grade:5,description:'Interactuarán en inglés en una consulta médica simulada, con la ficha de un personaje ficticio.',required:'ing-5-medical-interaction',activity:'ORAL_INTERACTION'},
 {grade:6,description:'Interactuarán en inglés en una entrevista de trabajo simulada con la ficha de un personaje ficticio.',required:'ing-6-job-interview',activity:'ORAL_INTERACTION'},
 {grade:6,description:'Realizarán en inglés una entrevista de trabajo simulada con el perfil proporcionado de un personaje ficticio.',required:'ing-6-job-interview',activity:'ORAL_INTERACTION'},
 {grade:6,description:'Hipotetizarán en inglés sobre una situación pasada del caso ficticio, relacionando la condición no cumplida y su resultado alternativo.',required:'ing-6-past-hypothesis',activity:'ANALYSIS',excluded:['ing-6-written']},
 {grade:6,description:'Explicarán oralmente en inglés la función del recurso tecnológico con los datos proporcionados.',required:'ing-6-explanations',activity:'ORAL_PRESENTATION'},
 {grade:6,description:'Explicarán oralmente en inglés la función de used to con ejemplos proporcionados.',required:'ing-6-feature-used-to',excluded:['ing-6-explanations']},
 {grade:6,description:'Escribirán en inglés un mensaje utilizando omisión del pronombre relativo.',required:'ing-6-feature-relative-omission',excluded:['ing-6-feature-relative-pronouns']},
 {grade:6,description:'Escribirán en inglés un mensaje utilizando be used to.',required:'ing-6-feature-be-used-to',excluded:['ing-6-feature-used-to']},
 {grade:6,description:'Escribirán en inglés un mensaje utilizando get used to.',required:'ing-6-feature-get-used-to',excluded:['ing-6-feature-used-to']},
 {grade:6,description:'Escucharán un mensaje en inglés e indicarán lo que comprendieron.',required:'ing-6-strategy-understanding',excludedText:'aclarar'},
 {grade:6,description:'Compararán en inglés las creencias de los ejemplos proporcionados de República Dominicana y otros países.',required:'ing-6-strategy-cultural-comparison',excludedText:'valores'},
]
const results=[]
for(const c of cases)for(const preferredInstrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'])for(const maxScore of [20,17.35]){
 const input={sectionSubjectId:context.assignments.find(a=>a.grade===c.grade&&a.code==='ING').id,activityTitle:'Actividad',description:c.description,maxScore,participationMode:'INDIVIDUAL',preferredInstrumentType},proposal=await request('/evaluation-instruments/recommend',input)
 assert(proposal.criteria.some(r=>r.templateId===c.required),c.required)
 for(const id of c.excluded??[])assert(!proposal.criteria.some(r=>r.templateId===id))
 if(c.excludedText)assert(!JSON.stringify(proposal.criteria.find(r=>r.templateId===c.required)).includes(c.excludedText))
 if(c.activity)assert.equal(proposal.activityType,c.activity)
 assert.equal(proposal.criteria.reduce((sum,c)=>sum+c.maxScoreUnits,0),Math.round(maxScore*100))
 results.push({input,proposal})
}
writeFileSync('docs/curriculum/cobertura-secundaria/evidencias/ingles-6-seguimientos-servicio-63.json',JSON.stringify({health,results},null,2)+'\n')
console.log(JSON.stringify({followups:results.length,status:'passed'}))
