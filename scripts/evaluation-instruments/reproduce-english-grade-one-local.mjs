import {writeFileSync} from 'node:fs'
import {localClient,context} from './language-local-client.mjs'
const {request,health}=await localClient(),results=[]
const descriptions=[
 'Conversarán en inglés solicitando y ofreciendo información personal de personajes ficticios: nombre, edad y nacionalidad. Se valorará la calidad en varias dimensiones.',
 'Escucharán un pronóstico del tiempo en inglés e identificarán las condiciones atmosféricas, el lugar y el día anunciados. Se comprobará la presencia de cada evidencia con sí o no.',
 'Escribirán en inglés su rutina diaria relacionando las actividades con sus horarios. Se distribuirán pesos entre los componentes verificables.',
 'En varios intercambios orales en inglés invitarán a una celebración y aceptarán o rechazarán la invitación con cortesía. Se registrará la regularidad de cada indicador.',
]
for(const description of descriptions){
 const input={sectionSubjectId:context.assignments.find(a=>a.grade===1&&a.code==='ING').id,activityTitle:'Actividad',description,maxScore:17.35,participationMode:'INDIVIDUAL'}
 const interpretation=await request('/evaluation-instruments/interpret',{sectionSubjectId:input.sectionSubjectId,activityTitle:input.activityTitle,description})
 const proposal=await request('/evaluation-instruments/recommend',input)
 results.push({input,interpretation,proposal})
}
writeFileSync('docs/curriculum/cobertura-secundaria/evidencias/ingles-1-antes.json',JSON.stringify({health,verifiedAt:new Date().toISOString(),results},null,2)+'\n')
console.log(JSON.stringify(results.map(r=>({description:r.input.description,type:r.proposal.activityType,format:r.proposal.instrumentType,criteria:r.proposal.criteria.map(c=>c.title)}))))
