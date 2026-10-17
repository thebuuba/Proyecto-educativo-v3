import assert from 'node:assert/strict'
import {writeFileSync} from 'node:fs'
import {localClient,context} from './language-local-client.mjs'
const {request,health}=await localClient()
assert.equal(health.development.catalogVersion,'evaluation-2026.62')
const sectionSubjectId=context.assignments.find(a=>a.grade===5&&a.code==='ING').id
const cases=[
 {description:'Escribirán en inglés una sugerencia para el problema del personaje ficticio.',required:'ing-5-suggestion',contains:'La sugerencia solicitada o comunicada'},
 {description:'Leerán un mensaje en inglés e identificarán un deseo o un plan futuro del personaje, eligiendo una intención.',required:'ing-5-context-wishes-or-plans',excluded:['ing-5-context-wishes','ing-5-context-plans']},
 {description:'Escucharán un mensaje en inglés y solicitarán ayuda y repetición de la parte que necesitan comprender.',required:'ing-5-strategy-help',contains:'ayuda y repetición'},
 {description:'Leerán en inglés un mensaje e identificarán los deseos y aspiraciones del personaje ficticio, distinguiéndolos de hechos confirmados.',required:'ing-5-context-wishes',contains:'los deseos y las aspiraciones'},
 {description:'Escribirán en inglés un correo o una carta para comunicar un consejo o una sugerencia sobre el problema ficticio del caso, eligiendo un producto y una intención.',required:'ing-5-advice-or-suggestion',excluded:['ing-5-advice','ing-5-suggestion','ing-5-genre-email','ing-5-genre-letter']},
]
const results=[]
for(const c of cases)for(const preferredInstrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'])for(const maxScore of [20,17.35]){
 const input={sectionSubjectId,activityTitle:'Actividad',description:c.description,maxScore,participationMode:'INDIVIDUAL',preferredInstrumentType},proposal=await request('/evaluation-instruments/recommend',input)
 assert(proposal.criteria.some(r=>r.templateId===c.required))
 for(const id of c.excluded??[])assert(!proposal.criteria.some(r=>r.templateId===id))
 if(c.contains&&preferredInstrumentType==='rubrica')assert(JSON.stringify(proposal.criteria.find(r=>r.templateId===c.required)).includes(c.contains),`${c.required}: ${preferredInstrumentType}`)
 assert.equal(proposal.criteria.reduce((sum,c)=>sum+c.maxScoreUnits,0),Math.round(maxScore*100))
 results.push({input,proposal})
}
writeFileSync('docs/curriculum/cobertura-secundaria/evidencias/ingles-5-seguimientos-servicio-62.json',JSON.stringify({health,results},null,2)+'\n')
console.log(JSON.stringify({followups:results.length,status:'passed'}))
