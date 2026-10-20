import type {CommonMathTopic} from './secondary-math-common-types'
import {commonMathCriteria,type CommonMathTask} from './secondary-math-common'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'

export const calculusVerbs='registr(?:a|an|ar|e|en)|document(?:a|an|ar|e|en)|propon(?:e|en|er)|present(?:a|an|ar|e|en)'
export const calculusRequirement=(value:string)=>value
 .replace(/\btransform(?:a|an|ar|e|en)\b/gi,'convierte')
 .replace(/\b(analiz\w*|interpret\w*|explic\w*|compar\w*|identific\w*)\s+(gr[aá]ficas?)\b/gi,(_match,verb:string,noun:string)=>`${verb} ${/s$/i.test(noun)?'las':'la'} ${noun}`)
export function selectCalculusTopics(text:string,topics:CommonMathTopic[]):CommonMathTopic[]{
 let found=topics.filter(t=>new RegExp(`\\b(?:${t.match})\\b`).test(text)&&(!t.exclude||!new RegExp(t.exclude).test(text)))
 const has=(...ids:string[])=>found.some(t=>ids.includes(t.id))
 if(/\bconstru\w*\s+(?:la |una )?ecuacion de (?:la )?superficie\b/.test(text))return found.filter(t=>t.id==='quadric-surfaces')
 if(has('point-conversion'))found=found.filter(t=>!['polar-coordinates','polar-graph','equation-conversion'].includes(t.id))
 else if(has('equation-conversion'))found=found.filter(t=>!['polar-coordinates','polar-graph'].includes(t.id))
 if(has('polar-circle','polar-conic','polar-spiral','cardioid'))found=found.filter(t=>!['polar-coordinates','polar-graph'].includes(t.id))
 if(has('paraboloid','hyperboloid','ellipsoid','ruled-surface','spheroid'))found=found.filter(t=>t.id!=='quadric-surfaces')
 if(has('vector-derivatives'))found=found.filter(t=>t.id!=='vector-functions')
 return found.map(t=>['polar-coordinates','polar-graph'].includes(t.id)&&/\brectangular(?:es)?\b/.test(text)&&/\bpolar(?:es)?\b/.test(text)?{...t,label:'representaciones polares y rectangulares',relation:'la correspondencia de las representaciones polares y rectangulares proporcionadas, que describen el mismo objeto bajo los intervalos, las unidades y las restricciones del dominio dados'}:t)
}
export function adaptCalculusTask(task:CommonMathTask):CommonMathTask{
 const text=task.actions.map(a=>a.text).join(' ')
 return {...task,activityType:task.activityType==='ANALYSIS'&&/\bmodel(?:a|an|ar|e|en)\b/.test(text)?'EXERCISE_SET':task.activityType}
}
type Action=CommonMathTask['actions'][number]
type Levels=ContextualTopicCriterion['progressionLevels']
function actionCriteria(action:Action,task:CommonMathTask):ContextualTopicCriterion[]{
 if(action.steps)return action.steps.flatMap(a=>actionCriteria(a,task))
 if(action.alternatives){
  const branches=action.alternatives.map(a=>actionCriteria(a,task))
  return [{templateId:`mat-6-${action.topics[0].id}-alternative`,title:'Cumplimiento de una alternativa matemática',weight:3,observable:`En la alternativa elegida: ${branches.map(rs=>rs.map(r=>r.progressionLevels[0]).join(' ')).join(' O BIEN: ')}`,progressionLevels:[0,1,2,3,4].map(i=>`En la alternativa elegida: ${branches.map(rs=>rs.map(r=>r.progressionLevels[i]).join(' ')).join(' O BIEN: ')}`) as Levels}]
 }
 const text=action.text,topic=action.topics[0]
 if(!topic)return []
 const grouped=task.actions.some(a=>/\b(?:en parejas|en equipo|compartid\w*|procedimiento comun)\b/.test(a.text))
 if(/\bconstru\w*\s+(?:la |una )?ecuacion de (?:la )?superficie\b/.test(text)){
  const observable='Construye la ecuación solicitada de la superficie a partir de la ecuación rectangular y las condiciones proporcionadas, conservando las variables, los parámetros y las restricciones del dominio indicados.'
  return [{templateId:`mat-6-${topic.id}-equation`,title:'Formulación de la ecuación de la superficie',observable,weight:4,progressionLevels:[observable,'La ecuación conserva las relaciones y condiciones principales; una referencia a una variable o parámetro necesita precisión.','Formula parte de la ecuación de la superficie, pero omite una condición necesaria del modelo dado.','La ecuación altera las relaciones o las restricciones de la ecuación rectangular proporcionada.','No aporta una ecuación verificable de la superficie solicitada.']}]
 }
 if(grouped&&/\b(?:aportacion|contribucion)\w*\b/.test(text)){
  const observable=`Documenta una aportación matemática identificable de ${topic.label} al trabajo compartido, relacionando su procedimiento o resultado con la solución o construcción común.`
  return [{templateId:`mat-6-${topic.id}-contribution`,title:'Aportación matemática al trabajo compartido',observable,weight:3,progressionLevels:[observable,'La aportación es identificable y pertinente al trabajo común; una referencia a su procedimiento o resultado necesita precisión.','Identifica parte de su aportación, pero solo relaciona parcialmente el procedimiento con el trabajo común.','La aportación documentada contradice los datos o los procedimientos válidos del trabajo compartido.','No documenta una aportación matemática verificable al trabajo común.']}]
 }
 if(/\bpropon(?:e|en|er)\b/.test(text)){
  const observable=`Propone una solución matemática de ${topic.label} para el caso ficticio dado, respaldada por ${topic.relation}, y delimita qué permite concluir el modelo.`
  return [{templateId:`mat-6-${topic.id}-proposal`,title:`Propuesta matemática de ${topic.label}`,observable,weight:3,progressionLevels:[observable,`La propuesta de ${topic.label} responde al caso dado; un supuesto o límite necesita precisión.`,`La propuesta de ${topic.label} responde parcialmente al problema, con una relación insuficientemente respaldada.`,`La propuesta contradice los datos o las condiciones matemáticas del caso de ${topic.label}.`,`No aporta una propuesta verificable de ${topic.label} para el caso dado.`]}]
 }
 // A supplied model or investigation is an object, rather than a new modelling/research command.
 const safeText=text.replace(/\bmodelos?\b/g,'esquema').replace(/\bproyecto de investigacion matematica ya realizado\b/g,'trabajo matemático ya realizado')
 return commonMathCriteria({...task,actions:[{...action,text:safeText}]})
}
export const calculusMathCriteria=(task:CommonMathTask)=>task.actions.flatMap(a=>actionCriteria(a,task))
