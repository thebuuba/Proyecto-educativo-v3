import assert from 'node:assert/strict'
import {writeFileSync} from 'node:fs'
import {localClient,context} from './language-local-client.mjs'
const {request,health}=await localClient()
assert.equal(health.development.catalogVersion,'evaluation-2026.33')
const assignment=context.assignments.find(a=>a.grade===6&&a.code==='LEN'),results=[]
for(const [purpose,format] of [
 ['Se valorará la calidad en varias dimensiones.','rubrica'],
 ['Se comprobará la presencia de cada evidencia con sí o no.','lista-cotejo'],
 ['Se registrará la regularidad con que se cumplen los indicadores.','escala'],
 ['Se distribuirán pesos entre los componentes verificables.','lista-ponderada'],
]){
 const input={sectionSubjectId:assignment.id,activityTitle:'Actividad',description:`Analizarán un ensayo argumentativo relacionando tesis y razones. ${purpose}`}
 const interpretation=await request('/evaluation-instruments/interpret',input)
 assert.equal(interpretation.suggestedInstrumentType,format)
 const proposal=await request('/evaluation-instruments/recommend',{...input,maxScore:17.35,participationMode:'INDIVIDUAL'})
 assert.equal(proposal.instrumentType,format)
 const preferredInstrumentType=format==='rubrica'?'lista-cotejo':'rubrica'
 const manual=await request('/evaluation-instruments/recommend',{...input,maxScore:17.35,participationMode:'INDIVIDUAL',preferredInstrumentType})
 assert.equal(manual.instrumentType,preferredInstrumentType)
 results.push({purpose,format,interpretation,proposal,manual})
}
const performance=await request('/evaluation-instruments/interpret',{sectionSubjectId:assignment.id,activityTitle:'Trabajo',description:'Representarán un monólogo teatral.'})
assert.equal(performance.suggestedActivityType,'PERFORMANCE')
assert.equal(performance.suggestedEvaluationTechnique,'dramatizacion')
const finalCases=[]
for(const preferredInstrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'])for(const description of ['Representarán un monólogo teatral.','Declamarán un poema social con entonación.']){
 const proposal=await request('/evaluation-instruments/recommend',{sectionSubjectId:assignment.id,activityTitle:'Trabajo',description,maxScore:17.35,participationMode:'INDIVIDUAL',preferredInstrumentType})
 if(description.startsWith('Represent')){assert.equal(proposal.activityType,'PERFORMANCE');assert(proposal.criteria.some(c=>c.templateId.endsWith('-performance')));assert(proposal.criteria.every(c=>! /^(?:Interpreta|Explica)/.test(c.description)))}
 else {assert.equal(proposal.activityType,'ORAL_PRESENTATION');assert(!proposal.criteria.some(c=>c.templateId.endsWith('-feature-nonverbal')));assert(proposal.criteria.some(c=>c.description.includes('poema social')))}
 finalCases.push({description,proposal})
}
const fifthAssignment=context.assignments.find(a=>a.grade===5&&a.code==='LEN'),fifthPerformances=[]
for(const preferredInstrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada']){
 const proposal=await request('/evaluation-instruments/recommend',{sectionSubjectId:fifthAssignment.id,activityTitle:'Trabajo',description:'Representarán un entremés teatral.',maxScore:17.35,participationMode:'INDIVIDUAL',preferredInstrumentType})
 assert.equal(proposal.activityType,'PERFORMANCE');assert(proposal.criteria.every(c=>! /^(?:Interpreta|Explica|Relaciona el conflicto)/.test(c.description)))
 fifthPerformances.push(proposal)
}
writeFileSync('docs/curriculum/cobertura-secundaria/evidencias/lengua-6-seleccion-servicio.json',JSON.stringify({verifiedAt:new Date().toISOString(),health,requests:25,results,performance,finalCases,fifthPerformances},null,2)+'\n')
console.log(JSON.stringify({requests:25,automaticFormats:4,manualOverrides:4,finalCases:8,fifthPerformances:4}))
