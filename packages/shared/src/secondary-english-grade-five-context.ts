import type {UpperEnglishEvidence} from './secondary-english-upper-task'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'
import {gradeFourContextCriteria} from './secondary-english-grade-four-context'
import {gradeThreeContextCriteria} from './secondary-english-grade-three-context'
import {withoutGradeFiveLexicalTargets} from './secondary-english-grade-five-lexicon'
import {upperEnglishRow} from './secondary-english-upper-communication'
import {englishAlternativeGroups} from './secondary-english-grammar'
const row=(id:string,title:string,levels:Parameters<typeof upperEnglishRow>[3])=>upperEnglishRow('ing-5',`context-${id}`,title,levels,3)
/** Same observable conditions are reused only where fifth's own competencies
 * and attitudes repeat their meaning. Private habits and internal traits are excluded. */
export function gradeFiveContextCriteria(task:UpperEnglishEvidence,existing:ContextualTopicCriterion[]){
 const text=withoutGradeFiveLexicalTargets(task.contextText),receptive=['reading','listening','analysis','comparison','research'].includes(task.mode)
 const shared=new Set(['ethical-ict','empathetic-response','faithful-information','respect-differences','care','social-contribution','critical-information','problem-information','problem-description','problem-solution','research','source-information','inference'])
 const rows=gradeFourContextCriteria({...task,text,contextText:text,requirementText:text},existing.map(c=>({...c,templateId:c.templateId.replace('ing-5-','ing-4-')}))).filter(c=>shared.has(c.templateId.replace(/^ing-4-(?:context-)?/,''))&&!(c.templateId==='ing-4-context-problem-solution'&&existing.some(r=>r.templateId==='ing-5-complaint'))).map(c=>({...c,templateId:c.templateId.replace('ing-4-','ing-5-')}))
 if(!receptive)rows.push(...gradeThreeContextCriteria(text.replace(/normas proporcionadas para (?:el )?intercambio/g,'normas del intercambio proporcionadas')).filter(c=>c.templateId==='ing-3-context-agreed-norms').map(c=>({...c,templateId:'ing-5-context-agreed-norms'})))
 if(!receptive&&/\b(?:compra|compras|consumo|ahorro)\b/.test(text)&&/\b(?:justific\w*|eleg\w*|eleccion)\b/.test(text)&&/\b(?:precios?|presupuesto|necesidades)\b/.test(text)){
  const conditions=[/precios?/.test(text)?'los precios':'',/necesidades/.test(text)?'las necesidades':'',/presupuesto/.test(text)?'el presupuesto':''].filter(Boolean).join(', ')
  rows.push(row('purchase-choice','Elección de consumo sustentada en los datos de la tarea',[
   `Justifica en inglés la elección de compra o consumo simulados, relacionando el bien o servicio con ${conditions} proporcionados para el personaje.`,
   'La elección responde a las condiciones principales; una relación con los datos necesita precisión.',
   'Menciona una opción, pero deja sin relacionar un dato necesario para justificarla.',
   'Justifica la elección con condiciones incompatibles con los datos del personaje o de la transacción.',
   'No aporta una elección justificada reconocible con los datos de la tarea.',
  ]))
 }
 if(!receptive&&/\bequipo\b/.test(text)&&/\b(?:aport\w*|contribu\w*)\b/.test(text)&&!rows.some(c=>c.templateId==='ing-5-context-social-contribution'))rows.push(row('team-contribution','Aporte comunicativo relacionado con el trabajo del equipo',[
  'Aporta en inglés información pertinente al trabajo del equipo, relacionándola con la tarea y los aportes de sus compañeros para continuar el intercambio acordado.',
  'El aporte permite avanzar en el intercambio; una relación con la tarea o los aportes previos necesita precisión.',
  'Comunica información aislada sin relacionarla claramente con la tarea o los aportes disponibles.',
  'El aporte contradice los datos de la tarea o cambia el asunto del trabajo acordado.',
  'No se reconoce un aporte comunicativo relacionado con el trabajo del equipo.',
 ]))
 const plans=/\b(?:planes?|plan futuro|actividades futuras)\b|\bplanific\w* (?:las )?actividades\b/.test(text),wishes=/\b(?:deseos?|aspiraciones?)\b/.test(text)
 if(plans)rows.push(row('plans','Acciones futuras del plan comunicado',[
  receptive?'Reconoce en el mensaje en inglés las acciones futuras del plan del referente y las relaciona con los datos solicitados.':'Comunica en inglés las acciones futuras del plan del referente indicado, relacionándolas con los datos solicitados de la situación proporcionada.',
  'El plan se comprende; una relación entre las acciones y los datos necesita precisión.',
  'Menciona acciones futuras aisladas sin relacionar parte de la información del plan.',
  'Cambia las acciones o referentes y comunica un plan distinto del proporcionado.',
  'No se reconoce un plan futuro relacionado con la situación indicada.',
 ]))
 if(wishes){
  const target=/deseos? y (?:las )?aspiraciones?/.test(text)?'los deseos y las aspiraciones':/deseos?/.test(text)&&/aspiraciones?/.test(text)?'los deseos o aspiraciones, según lo solicitado':/deseos?/.test(text)?'los deseos':'las aspiraciones'
  rows.push(row('wishes','Deseos y aspiraciones del referente indicado',[
  `${receptive?'Identifica en el mensaje en inglés':'Comunica en inglés'} ${target} del referente indicado, distinguiendo lo deseado de un hecho confirmado.`,
  'Se comprende lo deseado; una referencia al resultado esperado necesita precisión.',
  'Menciona resultados posibles sin precisar qué desea o a qué aspira el referente.',
  'Presenta como confirmado lo que el referente solo desea o atribuye el deseo a otra persona.',
  'No se reconocen deseos o aspiraciones relacionados con el referente indicado.',
 ]))}
 if(/\b(?:salud|medioambiente|medio ambiente)\b/.test(text)&&/\b(?:opciones|eleccion|eleg\w*)\b/.test(text)&&/\b(?:efectos|impact\w*|consecuencias)\b/.test(text)){
  const target=[/salud/.test(text)?'la salud':'',/medioambiente|medio ambiente/.test(text)?'el medioambiente':''].filter(Boolean).join(' y ')
  rows.push(row('care-choice','Elección relacionada con los efectos indicados',[
   `Justifica en inglés la elección entre las opciones proporcionadas, relacionándola con los efectos indicados para ${target} en la situación ficticia.`,
   'La elección se relaciona con los efectos principales; una relación con la situación necesita precisión.',
   'Menciona una opción sin relacionar parte de sus efectos indicados para la situación.',
   'La elección se justifica mediante efectos incompatibles con los datos proporcionados.',
   'No se reconoce una elección sustentada en los efectos de las opciones indicadas.',
  ]))
 }
 const alternatives=englishAlternativeGroups(text,rows.filter(c=>['ing-5-context-wishes','ing-5-context-plans'].includes(c.templateId)).map(c=>({...c,id:c.templateId.endsWith('wishes')?'wishes':'plans',match:c.templateId.endsWith('wishes')?'deseos?|aspiraciones?':'planes?|plan futuro'}))).find(group=>group.length>1)
 if(alternatives){
  const position=rows.findIndex(c=>alternatives.some(a=>a.templateId===c.templateId))
  for(let i=rows.length-1;i>=0;i--)if(alternatives.some(a=>a.templateId===rows[i].templateId))rows.splice(i,1)
  rows.splice(position,0,row(alternatives.map(c=>c.id).join('-or-'),alternatives.map(c=>c.title).join(' o '),[0,1,2,3,4].map(i=>alternatives.map(c=>c.progressionLevels![i]).join(' / ')+' Se valora únicamente la alternativa elegida.') as Parameters<typeof row>[2]))
 }
 return rows.map(c=>{
  if(c.templateId==='ing-5-context-source-information'&&/actualiz\w*/.test(text)&&/fecha/.test(text)){
   const levels=c.progressionLevels!.map((l,i)=>i===0?l+' Relaciona también la fecha disponible con la actualidad solicitada de la información.':l) as NonNullable<ContextualTopicCriterion['progressionLevels']>
   return {...c,observable:levels[0],progressionLevels:levels}
  }
  return c
 })
}
