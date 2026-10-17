import assert from 'node:assert/strict'
import {writeFileSync} from 'node:fs'
import {localClient,context} from './language-local-client.mjs'
const before=process.argv.includes('--before'),{request,health}=await localClient()
assert.equal(health.development.catalogVersion,before?'evaluation-2026.63':'evaluation-2026.66')
const cases=[
 {id:'cv',description:'Leerán en inglés un curriculum vitae e identificarán la experiencia y capacidades del perfil proporcionado de un personaje ficticio.'},
 {id:'revision',description:'Escribirán en inglés un correo electrónico con un mensaje para un personaje ficticio. Revisarán el sentido y la corrección del texto.'},
 {id:'relation',description:'Leerán en inglés un horario e identificarán la actividad y el momento que le corresponde.'},
 {id:'without-revision',description:'Escribirán en inglés un correo electrónico con un mensaje para un personaje ficticio.'},
 {id:'cv-written',description:'Escribirán en inglés un curriculum vitae del personaje ficticio e incluirán su experiencia y capacidades.'},
]
const results=[],selections=[]
for(const grade of before?[6]:[1,2,3,4,5,6])for(const c of before?cases.slice(0,2):cases)for(const preferredInstrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'])for(const maxScore of [20,17.35]){
 const input={sectionSubjectId:context.assignments.find(a=>a.grade===grade&&a.code==='ING').id,activityTitle:'Actividad',description:c.description,maxScore,participationMode:'INDIVIDUAL',preferredInstrumentType}
 const proposal=await request('/evaluation-instruments/recommend',input)
 if(!before){
  assert.equal(proposal.instrumentType,preferredInstrumentType)
  assert.equal(proposal.criteria.reduce((s,c)=>s+c.maxScoreUnits,0),Math.round(maxScore*100))
  if(c.id==='cv'){
   assert.equal(proposal.criteria.length,preferredInstrumentType==='lista-cotejo'?2:1)
   if(preferredInstrumentType==='lista-cotejo')assert.deepEqual(proposal.criteria.map(c=>c.templateId),[`ing-${grade}-genre-cv:experience`,`ing-${grade}-genre-cv:capacities`])
  }
  if(c.id==='cv-written')assert.equal(proposal.criteria.filter(r=>r.templateId.includes('genre-cv')).length,preferredInstrumentType==='lista-cotejo'?2:1)
  if(c.id==='revision')for(const r of proposal.criteria.filter(r=>r.templateId.includes('strategy-revision'))){assert(r.description.includes('mantiene lo correcto'));assert(r.description.includes('observable'));assert(!r.description.includes('Los cambios realizados'))}
  if(c.id==='without-revision')assert(!proposal.criteria.some(r=>r.templateId.includes('strategy-revision')))
  if(c.id==='relation')assert.equal(proposal.criteria.filter(r=>r.templateId.includes('genre-schedule')).length,1)
 }
 results.push({grade,case:c.id,input,proposal})
 if(results.length%32===0)console.log(JSON.stringify({verified:results.length}))
}
if(!before)for(const grade of [1,2,3,4,5,6])for(const c of cases){
 const input={sectionSubjectId:context.assignments.find(a=>a.grade===grade&&a.code==='ING').id,activityTitle:'Actividad',description:c.description}
 const interpretation=await request('/evaluation-instruments/interpret',input),expected=['cv','relation'].includes(c.id)?'lista-cotejo':'rubrica'
 assert.equal(interpretation.suggestedInstrumentType,expected)
 selections.push({grade,case:c.id,input,interpretation,rule:expected==='lista-cotejo'?'Discrete requested information can be checked separately.':'Written communication/revision requires judging quality in related dimensions.'})
}
const functionalChecks=[]
if(!before)for(const c of [
 {grade:1,description:'Presentarán oralmente en inglés información personal de un personaje ficticio, indicando nombre y edad.',parent:'ing-1-personal',keys:['name','age']},
 {grade:2,description:'Leerán en inglés un mensaje e identificarán el estado de ánimo y la sensación física del personaje ficticio.',parent:'ing-2-states',keys:['mood','physical']},
])for(const preferredInstrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'])for(const maxScore of [20,17.35]){
 const input={sectionSubjectId:context.assignments.find(a=>a.grade===c.grade&&a.code==='ING').id,activityTitle:'Actividad',description:c.description,maxScore,preferredInstrumentType,participationMode:'INDIVIDUAL'},proposal=await request('/evaluation-instruments/recommend',input)
 assert.deepEqual(proposal.criteria.filter(r=>r.templateId.startsWith(c.parent)).map(r=>r.templateId),preferredInstrumentType==='lista-cotejo'?c.keys.map(k=>c.parent+':'+k):[c.parent])
 assert.equal(proposal.criteria.reduce((s,c)=>s+c.maxScoreUnits,0),Math.round(maxScore*100));functionalChecks.push({input,proposal})
}
writeFileSync(`docs/curriculum/cobertura-secundaria/evidencias/ingles-calidad-${before?'reproduccion-63':'servicio-66'}.json`,JSON.stringify({health,results,selections,functionalChecks,scope:'FOUR_FORMATS_TWO_TOTALS_SERVICE;NATURAL_TASKS_WITHOUT_INSTRUMENT_DIRECTIVES'},null,2)+'\n')
console.log(JSON.stringify({cases:results.length,naturalSelections:selections.length,functionalChecks:functionalChecks.length,status:before?'REPRODUCED':'passed'}))
