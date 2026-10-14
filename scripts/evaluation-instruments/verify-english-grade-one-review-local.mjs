import assert from 'node:assert/strict'
import {writeFileSync} from 'node:fs'
import {localClient,context} from './language-local-client.mjs'
const {request,health}=await localClient(),results=[]
assert.equal(health.development.catalogVersion,'evaluation-2026.35')
const sectionSubjectId=context.assignments.find(a=>a.grade===1&&a.code==='ING').id
for(const description of [
 'Expresarán oralmente en inglés sus preferencias sobre actividades de tiempo libre.',
 'Escribirán en inglés una invitación a una celebración.',
 'Responderán oralmente en inglés a una invitación, aceptándola o rechazándola con cortesía.',
 'Escucharán un pronóstico del tiempo en inglés e identificarán las condiciones atmosféricas, el lugar y el día anunciados.',
]){
 const input={sectionSubjectId,activityTitle:'Actividad',description,maxScore:17.35,participationMode:'INDIVIDUAL'}
 const proposal=await request('/evaluation-instruments/recommend',input)
 if(description.includes('tiempo libre'))assert(!proposal.criteria.some(c=>c.templateId==='ing-1-weather'))
 if(description.startsWith('Escribirán'))assert(!/acepta|rechaza/.test(proposal.criteria[0].description))
 if(description.startsWith('Responderán'))assert(!proposal.criteria[0].description.includes('Formula una invitación'))
 if(description.startsWith('Escucharán')){assert.equal(proposal.instrumentType,'lista-cotejo');assert.equal(proposal.internalTrace.ruleId,'ENGLISH_COMMUNICATIVE_PURPOSE')}
 results.push({input,proposal})
}
for(const [purpose,format] of [
 ['Se valorará la calidad en varias dimensiones.','rubrica'],
 ['Se comprobará la presencia de cada evidencia con sí o no.','lista-cotejo'],
 ['Se registrará la regularidad de cada indicador.','escala'],
 ['Se distribuirán pesos entre los componentes verificables.','lista-ponderada'],
]){
 const description='Conversarán en inglés solicitando y ofreciendo información personal: nombre y edad. '+purpose
 const input={sectionSubjectId,activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL'}
 const interpretation=await request('/evaluation-instruments/interpret',{sectionSubjectId,activityTitle:input.activityTitle,description})
 const proposal=await request('/evaluation-instruments/recommend',input)
 assert.equal(interpretation.suggestedInstrumentType,format)
 assert.equal(proposal.instrumentType,format)
 results.push({input,interpretation,proposal})
}
writeFileSync('docs/curriculum/cobertura-secundaria/evidencias/ingles-1-revision-servicio.json',JSON.stringify({health,verifiedAt:new Date().toISOString(),results},null,2)+'\n')
console.log(JSON.stringify({proposals:results.length,interpretations:4}))
