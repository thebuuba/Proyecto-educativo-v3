import assert from 'node:assert/strict'
import {writeFileSync} from 'node:fs'
import {localClient,context} from './language-local-client.mjs'
const {request,health}=await localClient()
assert.equal(health.development.catalogVersion,'evaluation-2026.29')
const assignment=context.assignments.find(a=>a.grade===4&&a.code==='LEN'),results=[]
for(const [purpose,format] of [
 ['Se valorará la calidad en varias dimensiones.','rubrica'],
 ['Se comprobará la presencia de cada evidencia con sí o no.','lista-cotejo'],
 ['Se registrará la regularidad con que se cumplen los indicadores.','escala'],
 ['Se distribuirán pesos entre los componentes verificables.','lista-ponderada'],
]){
 const input={sectionSubjectId:assignment.id,activityTitle:'Actividad',description:`Analizarán un instructivo identificando sus pasos y finalidad. ${purpose}`}
 const interpretation=await request('/evaluation-instruments/interpret',input)
 assert.equal(interpretation.suggestedInstrumentType,format)
 const proposal=await request('/evaluation-instruments/recommend',{...input,maxScore:17.35,participationMode:'INDIVIDUAL'})
 assert.equal(proposal.instrumentType,format)
 results.push({purpose,format,interpretation,proposal})
}
const research=await request('/evaluation-instruments/interpret',{sectionSubjectId:assignment.id,activityTitle:'Trabajo',description:'Investigarán datos y fuentes para un informe de investigación.'})
assert.equal(research.suggestedActivityType,'RESEARCH')
assert.equal(research.suggestedEvaluationTechnique,'analisis-producciones')
const suppliedData=[]
for(const preferredInstrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada']){
 const proposal=await request('/evaluation-instruments/recommend',{sectionSubjectId:assignment.id,activityTitle:'Trabajo',description:'Redactarán un informe de investigación con los datos proporcionados, relacionando problema, método y resultados.',maxScore:17.35,participationMode:'INDIVIDUAL',preferredInstrumentType})
 assert(!proposal.criteria.some(c=>c.templateId.endsWith('research-sources')))
 suppliedData.push(proposal)
}
writeFileSync('docs/curriculum/cobertura-secundaria/evidencias/lengua-4-seleccion-servicio.json',JSON.stringify({verifiedAt:new Date().toISOString(),health,requests:13,results,research,suppliedData},null,2)+'\n')
console.log(JSON.stringify({requests:13,automaticFormats:4,suppliedDataFormats:4,researchTechnique:research.suggestedEvaluationTechnique}))
