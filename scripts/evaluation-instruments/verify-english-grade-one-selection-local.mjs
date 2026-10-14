import assert from 'node:assert/strict'
import {writeFileSync} from 'node:fs'
import {localClient,context} from './language-local-client.mjs'
const {request,health}=await localClient(),results=[]
assert.equal(health.development.catalogVersion,'evaluation-2026.44')
const sectionSubjectId=context.assignments.find(a=>a.grade===1&&a.code==='ING').id
for(const [purpose,instrument] of [['Se valorará la calidad en varias dimensiones.','rubrica'],['Se comprobará la presencia de cada evidencia con sí o no.','lista-cotejo'],['Se registrará la regularidad de cada indicador.','escala'],['Se distribuirán pesos entre los componentes verificables.','lista-ponderada']]){
 const description='Conversarán en inglés solicitando y ofreciendo información personal: nombre y edad. '+purpose
 const input={sectionSubjectId,activityTitle:'Actividad',description,maxScore:17.35,participationMode:'INDIVIDUAL'}
 const interpretation=await request('/evaluation-instruments/interpret',{sectionSubjectId,activityTitle:'Actividad',description})
 const proposal=await request('/evaluation-instruments/recommend',input)
 const manual=await request('/evaluation-instruments/recommend',{...input,preferredInstrumentType:instrument==='rubrica'?'lista-cotejo':'rubrica'})
 assert.equal(interpretation.suggestedInstrumentType,instrument);assert.equal(proposal.instrumentType,instrument);assert.notEqual(manual.instrumentType,instrument)
 assert.equal(interpretation.suggestedActivityType,'ORAL_INTERACTION');assert.equal(interpretation.suggestedEvaluationTechnique,'observacion-directa')
 results.push({input,interpretation,proposal,manual})
}
writeFileSync('docs/curriculum/cobertura-secundaria/evidencias/ingles-1-seleccion-final-servicio.json',JSON.stringify({verifiedAt:new Date().toISOString(),health,results},null,2)+'\n')
console.log(JSON.stringify({interpretations:4,automaticRecommendations:4,manualOverrides:4}))
