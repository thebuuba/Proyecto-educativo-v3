import type {InstrumentAcademicContext} from './secondary-science'
import type {CommonMathTopic} from './secondary-math-common-types'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'
import {resolveMathTaskForTopics,commonMathCriteria,commonMathSelections,type CommonMathTask} from './secondary-math-common'
import {optativeMtFour} from './secondary-optative-mt-4'
import {optativeMtFive} from './secondary-optative-mt-5'
import {statisticalVerbs,statisticalRequirement,selectStatisticalTopics,adaptStatisticalTask,statisticalMathCriteria} from './secondary-optative-statistics-evidence'

export type OptativeMathTopic=CommonMathTopic&{sourceRecordIds:string[];priority:number}
export type OptativeMathModule={id:string;grade:number;cycle:number;subjectCode:string;subjectName:string;optativeExitName:string;modalityCodes:string[];sourceScopeId:string;pdfPages:number[];policy:string;topics:OptativeMathTopic[]}
export type OptativeMathTask=CommonMathTask&{module:OptativeMathModule}
export const optativeMathModules:OptativeMathModule[]=[optativeMtFour,optativeMtFive]
const additionalVerbs='registr(?:a|an|ar|e|en)|prepar(?:a|an|ar|e|en)|formul(?:a|an|ar|e|en)|concili(?:a|an|ar|e|en)'
function selectTopics(text:string,topics:CommonMathTopic[]):CommonMathTopic[]{
 let matches=(topics as OptativeMathTopic[]).filter(t=>new RegExp(`\\b(?:${t.match})\\b`).test(text))
 if(matches.some(t=>t.id==='cards')&&!/debitos?|cuentas de credito/.test(text))matches=matches.filter(t=>t.id!=='debit-credit')
 const priority=Math.max(...matches.map(t=>t.priority))
 return matches.filter(t=>/\bcompar\w*\b/.test(text)||t.priority===priority).map(topic=>{
  let t:CommonMathTopic={...topic,originIsHistorical:false}
  if(t.id==='account-classification'&&!/origen/.test(text))t={...t,label:'clasificación de las cuentas',relation:'la naturaleza de las cuentas proporcionadas y la clasificación solicitada en el caso ficticio'}
  if(t.id==='annuities'){
   const requested=text.match(/\b((?:monto|renta)(?: y (?:la |el )?(?:monto|renta))?) de (?:la |una )?anualidad\b/)?.[1]??''
   const targets=['monto','renta'].filter(label=>requested.includes(label))
   if(targets.length)t={...t,label:targets.map(x=>'el '+x).join(' y ').replace('el renta','la renta')+' de la anualidad',relation:`los pagos y el valor solicitado de la anualidad, conservando la tasa, el plazo y el momento de los pagos dados, sin asumir una anualidad vencida o anticipada no indicada`}
  }
  return t
 })
}
export function resolveOptativeMathTask(title:string,description:string,context?:InstrumentAcademicContext|null,modules:OptativeMathModule[]=optativeMathModules):OptativeMathTask|null{
 if(context?.level!=='SECONDARY'||context.cycle!=null&&context.cycle!==2)return null
 const module=modules.find(m=>m.grade===context.grade&&m.subjectCode===context.subjectCode.trim().toUpperCase()&&m.modalityCodes.includes(context.modalityCode??'')&&(!context.optativeExitName||context.optativeExitName===m.optativeExitName))
 if(!module)return null
 // A tool noun must not be read as the action «calcula» by the common parser.
 const statistics=module.subjectCode==='OPT-MT-5'
 const taskDescription=(statistics?statisticalRequirement(description):description).replace(/\bcalculadoras?\b/gi,'herramienta tecnológica').replace(/\bcálculos?\b/gi,'procedimiento')
 const heading=title.replace(/^\s*resoluci[oó]n de problemas\b/i,'Resuelve problemas')
 let task=resolveMathTaskForTopics(heading,taskDescription,module.grade,module.topics,{additionalVerbs:statistics?statisticalVerbs:additionalVerbs,selectTopics:statistics?selectStatisticalTopics:selectTopics,knownTopics:modules.flatMap(m=>m.topics)})
 if(!task)return null
 if(statistics)task=adaptStatisticalTask(task)
 const operational=/\b(?:registr\w*|prepar\w*|formul\w*|concili\w*|elabor\w*|model\w*)\b/.test(task.actions[0]?.text??'')
 if(!statistics&&operational&&task.activityType==='ANALYSIS')task.activityType='EXERCISE_SET'
 return {...task,module}
}
/** Accounting products require traceable records, rather than a generic concept row. */
export function optativeMathCriteria(task:OptativeMathTask):ContextualTopicCriterion[]{
 const rows=task.module.subjectCode==='OPT-MT-5'?statisticalMathCriteria(task):task.actions.flatMap(action=>{
  const mathematicalAction={...action,text:action.text.replace(/\bclasificacion\b/g,'categorías').replace(/\bcomprobacion\b/g,'contraste')}
  const operational=/^\s*(?:registr\w*|prepar\w*|formul\w*|concili\w*|elabor\w*|constru\w*)\b/.test(action.text)
  if(!operational||action.alternatives||action.steps)return commonMathCriteria({...task,actions:[mathematicalAction]})
  const products=action.topics.map(topic=>{
   const observable=`Elabora el registro o producto solicitado de ${topic.label} respetando ${topic.relation}.`
   return {templateId:`mat-${task.grade}-${topic.id}-production`,title:`Elaboración de ${topic.label}`,observable,weight:4,progressionLevels:[observable,`El producto de ${topic.label} conserva las relaciones principales; una referencia o importe requiere precisión.`,`Presenta parte de ${topic.label}, con omisiones o relaciones inconsistentes en los datos.`,`El producto de ${topic.label} contradice las relaciones o los registros dados.`,`No aporta el producto solicitado de ${topic.label}.`] as ContextualTopicCriterion['progressionLevels']}
  })
  const requested=commonMathCriteria({...task,actions:[mathematicalAction]}).filter(r=>!r.templateId.endsWith('-representation')&&!r.templateId.endsWith('-concept'))
  return [...products,...requested]
 })
 return rows.filter((r,i)=>rows.findIndex(other=>other.templateId===r.templateId&&other.observable===r.observable)===i).map((row,i,all)=>({...row,templateId:row.templateId.replace(`mat-${task.grade}-`,`opt-mt-${task.grade}-`)+(all.findIndex(r=>r.templateId===row.templateId)===i?'':':'+i)}))
}
export const optativeMathSelections=(task:OptativeMathTask,description:string)=>commonMathSelections(task,description)
