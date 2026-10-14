import assert from 'node:assert/strict'
import {writeFileSync} from 'node:fs'
import {localClient,context} from './language-local-client.mjs'
const {request,health}=await localClient()
assert.equal(health.development.catalogVersion,'evaluation-2026.27')
const assignment=context.assignments.find(a=>a.grade===3&&a.code==='LEN'),results=[]
for(const [purpose,format] of [
 ['Se valorará la calidad en varias dimensiones.','rubrica'],
 ['Se comprobará la presencia de cada evidencia con sí o no.','lista-cotejo'],
 ['Se registrará la regularidad con que se cumplen los indicadores.','escala'],
 ['Se distribuirán pesos entre los componentes verificables.','lista-ponderada'],
]){
 const input={sectionSubjectId:assignment.id,activityTitle:'Actividad',description:`Analizarán una entrevista identificando sus roles y preguntas. ${purpose}`}
 const interpretation=await request('/evaluation-instruments/interpret',input)
 assert.equal(interpretation.suggestedInstrumentType,format)
 const proposal=await request('/evaluation-instruments/recommend',{...input,maxScore:17.35,participationMode:'INDIVIDUAL'})
 assert.equal(proposal.instrumentType,format)
 results.push({purpose,format,interpretation,proposal})
}
const research=await request('/evaluation-instruments/interpret',{sectionSubjectId:assignment.id,activityTitle:'Trabajo',description:'Investigarán datos y fuentes para un catálogo de especies.'})
assert.equal(research.suggestedActivityType,'RESEARCH')
assert.equal(research.suggestedEvaluationTechnique,'analisis-producciones')
writeFileSync('docs/curriculum/cobertura-secundaria/evidencias/lengua-3-seleccion-servicio.json',JSON.stringify({verifiedAt:new Date().toISOString(),health,requests:9,results,research},null,2)+'\n')
console.log(JSON.stringify({requests:9,automaticFormats:4,researchTechnique:research.suggestedEvaluationTechnique}))
