import assert from 'node:assert/strict'
import {writeFileSync} from 'node:fs'
import {localClient,context} from './language-local-client.mjs'
const {request,health}=await localClient()
assert.equal(health.development.catalogVersion,'evaluation-2026.60')
const cases=[
 {grade:4,description:'Dialogarán en inglés para solicitar y dar indicaciones para llegar al lugar del croquis proporcionado.',required:'ing-4-directions',startsWith:'Solicita y comunica '},
 {grade:4,description:'Dialogarán en inglés para solicitar instrucciones para una tarea escolar.',required:'ing-4-instructions',startsWith:'Solicita '},
 {grade:4,description:'Dialogarán en inglés para solicitar indicaciones para llegar al lugar del croquis.',required:'ing-4-directions',startsWith:'Solicita '},
 {grade:4,description:'Dialogarán en inglés para formular una respuesta solidaria de apoyo a la necesidad comunicada por un personaje ficticio.',required:'ing-4-context-empathetic-response'},
 {grade:3,description:'Dialogarán en inglés para aportar una propuesta individual ante un problema comunitario ficticio, con los datos de la situación proporcionada.',required:'ing-3-context-social-contribution',excludedText:'equipo'},
 {grade:4,description:'Presentarán oralmente en inglés una conversación para comunicar la información solicitada.',required:'ing-4-genre-conversation',excluded:'ing-4-information'},
 {grade:4,description:'Escribirán en inglés un mensaje para ofrecer información sobre los datos de la lectura.',required:'ing-4-information',activity:'WRITTEN_PRODUCTION'},
 {grade:4,description:'Presentarán oralmente en inglés los datos de una investigación tecnológica para ofrecer información al grupo.',required:'ing-4-information',activity:'ORAL_PRESENTATION'},
]
const results=[]
for(const c of cases){
 const input={sectionSubjectId:context.assignments.find(a=>a.grade===c.grade&&a.code==='ING').id,activityTitle:'Actividad',description:c.description,maxScore:20,participationMode:'INDIVIDUAL'}
 const proposal=await request('/evaluation-instruments/recommend',input)
 assert(proposal.criteria.some(r=>r.templateId===c.required))
 if(c.excluded)assert(!proposal.criteria.some(r=>r.templateId===c.excluded))
 if(c.excludedText)assert(!JSON.stringify(proposal.criteria).includes(c.excludedText))
 if(c.activity)assert.equal(proposal.activityType,c.activity)
 if(c.startsWith)assert(proposal.criteria.find(r=>r.templateId===c.required).description.startsWith(c.startsWith))
 results.push({input,proposal})
}
writeFileSync('docs/curriculum/cobertura-secundaria/evidencias/ingles-4-seguimientos-servicio-60.json',JSON.stringify({health,results},null,2)+'\n')
console.log(JSON.stringify({followups:results.length,status:'passed'}))
