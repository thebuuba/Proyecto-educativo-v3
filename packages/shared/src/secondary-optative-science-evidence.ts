import {commonScienceCriteria,type CommonScienceTask} from './secondary-science-common'
import type {CommonScienceTopic} from './secondary-science-common-types'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'
import {focusCtFourTopic,matchesCtFourFacet} from './secondary-optative-ct-4-facets'
import {selectCtFiveTopics} from './secondary-optative-ct-5-facets'

export const optativeScienceVerbs='simul(?:a|an|ar|e|en)|model(?:a|an|ar|e|en)|program(?:a|an|ar|e|en)|depur(?:a|an|ar|e|en)|document(?:a|an|ar|e|en)|predic(?:e|en)|propon\\w*|aplic(?:a|an|ar)|apliqu(?:e|en)|discut(?:e|en|ir|a|an)'
export function optativeScienceRequirement(value:string){
 let text=value.replace(/\bdataset\b/gi,'conjunto de datos')
 if(/ya realizado|ya proporcionad|(?:investigación|proyecto)[^.;]*proporcionad/i.test(text))text=text.replace(/\bproyecto de investigaci[oó]n\b|\binvestigaci[oó]n(?: experimental simulada| experimental| bibliogr[aá]fica)?\b/gi,'trabajo documentado')
 return text.replace(/\b(?:no|sin)\s+(?:program\w*|simul\w*|model\w*|publi\w*|desplieg\w*|entren\w*|recopil\w*)[^.;]*/gi,'')
}
export function selectOptativeScienceTopics(text:string,topics:CommonScienceTopic[]){
 if(topics[0]?.grade===5)return selectCtFiveTopics(text,topics)
 text=text.replace(/\b(?:sin|no se (?:pide|requiere|incluye))\s+[^.;,]*/g,'')
 const normalized=(s:string)=>s.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase()
 const exact=topics.filter(t=>text.includes(normalized(t.label)))
 if(exact.length)return exact.filter(t=>!exact.some(other=>other!==t&&normalized(other.label).includes(normalized(t.label))))
 let found=topics.filter(t=>(new RegExp(`\\b(?:${t.match})\\b`).test(text)||matchesCtFourFacet(text,t))&&(!t.exclude||!new RegExp(t.exclude).test(text)))
 const has=(id:string)=>found.some(t=>t.id===id)
 const specific=['lab-report-reading','mental-health','balanced-diet-model','pregnancy-complications','blood-pressure-reading','respiratory-sounds','insulin-information','glucose-meter-model','first-aid-simulation']
 if(found.some(t=>specific.includes(t.id)))found=found.filter(t=>t.id!=='disease-groups')
 if(has('biological-models')&&!/\benfermedad(?:es)?\b/.test(text))found=found.filter(t=>t.id!=='disease-groups')
 if(has('pregnancy-complications'))found=found.filter(t=>t.id!=='pregnancy-development')
 if(has('biological-machine-learning'))found=found.filter(t=>t.id!=='biological-programming')
 if(has('environmental-privacy'))found=found.filter(t=>t.id!=='environmental-data')
 if(has('emerging-environmental-technology'))found=found.filter(t=>t.id!=='environmental-project')
 if(has('biotech-market-model'))found=found.filter(t=>!['biotech-product-design','biotech-processes'].includes(t.id))
 if(found.length>1&&/\binforme de.*fisiologia\b/.test(text))found=found.filter(t=>t.id!=='scientific-communication')
 return found.map(t=>focusCtFourTopic(text,t))
}
type Action=CommonScienceTask['actions'][number]
export type OptativeScienceEvidenceTask=CommonScienceTask&{alternatives?:CommonScienceTask[]}
export const scientificAlternativeBranches=(text:string)=>text.split(new RegExp(`\\s+(?:o bien|o)\\s+(?=(?:${optativeScienceVerbs}|elabor\\w*|analiz\\w*|interpret(?:a|an|ar|e|en)|explic(?:a|an|ar)|represent(?:a|an|ar|e|en)|debat\\w*)\\b)`,'i'))
const action=(text:string,pattern:RegExp)=>pattern.test(text)&&!/^\s*(?:explic\w*|describ\w*|analiz\w*|interpret\w*)\b/.test(text)
const models=(text:string)=>action(text,/\bmodel(?:a|an|ar|e|en)\b/)
const simulates=(text:string)=>action(text,/\bsimul(?:a|an|ar|e|en)\b/)
const programs=(text:string)=>action(text,/\b(?:program(?:a|an|ar|e|en)|depur\w*)\b/)
const appliesAlgorithm=(text:string)=>action(text,/\baplic\w*\b[^.;]*\balgoritmo\b/)
const plans=(text:string)=>action(text,/\b(?:disen\w*|elabor\w*|propon\w*)\b[^.;]*\b(?:plan|propuesta|prototipo|consulta|mapa|empresa|producto|opciones)\b/)
export function adaptOptativeScienceTask(task:CommonScienceTask):CommonScienceTask{
 const text=task.actions.map(a=>a.text).join('. '),report=/\b(?:redact\w*|elabor\w*|escrib\w*)\b[^.;]*\b(?:informe|reporte|ensayo)\b/.test(text)
 const cognitive=task.actions.every(a=>/^\s*(?:analiz\w*|interpret\w*|explic\w*|describ\w*|identific\w*)\b/.test(a.text))
 const primaryProblem=task.grade===5&&/^\s*resuelv\w*\b/.test(task.actions[0].text)
 const activityType=report?'REPORT':primaryProblem?'EXERCISE_SET':task.actions.some(a=>simulates(a.text)||models(a.text)||programs(a.text)||plans(a.text))?'PROJECT':task.actions.some(a=>appliesAlgorithm(a.text))?'EXERCISE_SET':cognitive&&['COMPARISON','OBSERVATION','RESEARCH'].includes(task.activityType)?'ANALYSIS':task.activityType
 return{...task,activityType,technique:['PROJECT','RESEARCH'].includes(activityType)?'proyecto':activityType==='ORAL_PRESENTATION'?'presentacion':activityType==='DEBATE'?'debate':['ANALYSIS','COMPARISON','EXERCISE_SET','REPORT'].includes(activityType)?'analisis-producciones':task.technique}
}
function criterion(topic:CommonScienceTopic,key:string,title:string,success:string,partial:string,error:string):ContextualTopicCriterion{
 return{templateId:`nat-${topic.grade}-${topic.id}-${key}`,title,observable:success,weight:4,progressionLevels:[success,success+' Una referencia puntual necesita precisión sin cambiar la relación principal.',partial,error,`No aporta evidencia verificable del desempeño solicitado sobre ${topic.label}.`]}
}
function alternativeCriterion(alternatives:ContextualTopicCriterion[][],task:CommonScienceTask):ContextualTopicCriterion[]{
  const progressionLevels=[0,1,2,3,4].map(i=>`En la alternativa elegida: ${alternatives.map(rows=>rows.map(r=>r.progressionLevels[i]).join(' ')).join(' O BIEN: ')}`) as ContextualTopicCriterion['progressionLevels']
  return[{templateId:`nat-${task.grade}-${task.actions[0].topics[0].id}-alternative`,title:'Alternativa científica o computacional elegida',observable:progressionLevels[0],progressionLevels,weight:4}]
}
function criteriaFor(actionRow:Action,task:CommonScienceTask):ContextualTopicCriterion[]{
 const {text,topics}=actionRow
 const branches=scientificAlternativeBranches(text)
 if(branches.length>1){
  const alternatives=branches.map(text=>{const own=selectOptativeScienceTopics(text,topics);return criteriaFor({text,topics:own.length?own:topics},task)})
  return alternativeCriterion(alternatives,task)
 }
 const custom:ContextualTopicCriterion[]=[],grouped=task.actions.some(a=>/\ben equipo\b|\ben parejas\b|\bcompartid\w*\b/.test(a.text))
 const contributionRequested=grouped&&(/\b(?:aportacion|contribucion)\w*\b/.test(text)||task.grade===5&&/\baport(?:o|a|an|ar|e|en)\b/.test(text))
 for(const t of topics){
  const add=(key:string,title:string,success:string,partial:string,error:string)=>custom.push(criterion(t,key,title,success,partial,error))
  if(simulates(text))add('simulation',`Simulación de ${t.label}`,`Ejecuta la simulación solicitada de ${t.label} con las entradas, parámetros y condiciones proporcionados; registra las salidas y las distingue de observaciones empíricas, atendiendo a ${t.relation}.`,`La simulación conserva parte de las condiciones dadas, pero un parámetro o salida queda sin documentar.`,`La simulación altera condiciones esenciales o presenta salidas inventadas como resultados obtenidos.`)
  if(models(text))add('model',`Modelo de ${t.label}`,`Construye el modelo solicitado de ${t.label} relacionando sus entradas, componentes y salidas bajo los supuestos proporcionados y delimita su alcance mediante ${t.relation}.`,`El modelo conserva algunas relaciones, pero una entrada o supuesto no respalda la salida presentada.`,`El modelo contradice los datos o atribuye relaciones ausentes de la información proporcionada.`)
  if(programs(text))add('programming',`Programa de ${t.label}`,`El programa solicitado de ${t.label} representa los pasos y decisiones del algoritmo dado y permite comprobar las entradas y salidas previstas mediante los casos proporcionados, atendiendo a ${t.relation}.`,`El programa conserva parte del algoritmo, pero una decisión o caso dado queda sin comprobar.`,`El programa utiliza relaciones incompatibles con el algoritmo o atribuye salidas no obtenidas.`)
  if(appliesAlgorithm(text))add('algorithm-application',`Aplicación del algoritmo de ${t.label}`,`Aplica los pasos del algoritmo proporcionado de ${t.label} a los datos dados y relaciona sus salidas con las referencias indicadas, respetando ${t.relation}.`,`Aplica parte del algoritmo, pero una decisión o correspondencia no queda respaldada por los datos.`,`Las salidas contradicen el algoritmo dado o se presentan como validación fuera de la muestra sin evidencia.`)
  if(action(text,/\b(?:predic(?:e|en)|formula\w*[^.;]*prediccion)\b/))add('prediction',`Predicción sobre ${t.label}`,`Formula la predicción solicitada de ${t.label} con respaldo en ${t.relation} e indica sus supuestos y límites, sin presentarla como resultado empírico ya comprobado.`,`La predicción responde parcialmente a los datos, pero deja un supuesto o límite sin precisar.`,`La predicción contradice los datos o se presenta como certeza sin respaldo.`)
  if(plans(text)){
   const key=/\bconsulta\b/.test(text)?'query-design':/\bmapa\b/.test(text)?'map':'design'
   add(key,`Diseño de ${t.label}`,`Elabora el diseño solicitado de ${t.label} relacionando propósito, componentes, datos y restricciones proporcionados, con decisiones coherentes con ${t.relation}; distingue lo diseñado de una ejecución real.`,`El diseño responde parcialmente al propósito, pero una relación o condición dada no es verificable.`,`El diseño contradice los datos o atribuye una implementación no realizada ni proporcionada.`)
  }
  if(contributionRequested)add('contribution','Aportación técnica al trabajo compartido',`Documenta una aportación científica o computacional identificable de ${t.label} al trabajo compartido y relaciona su procedimiento o resultado con el producto común.`,`La aportación es identificable, pero su relación con el procedimiento o producto común queda parcialmente documentada.`,`La aportación documentada contradice los datos o atribuye como propia una acción ajena.`)
  if(task.grade===5&&/^\s*propon\w*\b/.test(text)&&/\bdecisiones\b/.test(text))add('decision',`Decisiones justificadas sobre ${t.label}`,`Propone las decisiones solicitadas sobre ${t.label} relacionando cada medida con las evidencias y restricciones dadas, atendiendo a ${t.relation}; distingue la propuesta de una actuación real.`,`La propuesta responde parcialmente al caso, pero una medida queda sin relacionar con la evidencia o la restricción proporcionada.`,`La propuesta contradice los riesgos, residuos o restricciones documentados o atribuye una actuación real no realizada.`)
 }
 // Reuse common criteria with scoped vocabulary: a report is still a written
 // product, and privacy rules are information to analyse, not measurements.
 let commonText=text.replace(/\bregistros?\b/g,'datos disponibles').replace(/\b(?:reporte|ensayo)\b/g,'informe').replace(/\bdiscut(?:e|en)\b(?=[^.;]*\bseminario\b)/g,'expone')
 if(task.grade===5){
  if(/^\s*debat\w*\b/.test(text))commonText=commonText.replace(/\binterpretaciones\b/g,'perspectivas documentadas')
  commonText=commonText.replace(/\bcontrasta(?:n|r)? las afirmaciones\b/g,'argumenta las afirmaciones')
  commonText=commonText.replace(/\bdistingue(?=\s+(?:las inferencias|los supuestos))\b/g,'delimita')
  if(/^\s*(?:analiz\w*|interpret\w*|explic\w*)\b/.test(text))commonText=commonText.replace(/\bcontraste de ideas\b/g,'contraposición de ideas').replace(/\bevidencias observables\b/g,'evidencias documentadas').replace(/\bcaracterizacion\b/g,'identificación estructural documentada')
  commonText=commonText.replace(/\bcontrastar la solucion\b/g,'comprobar la solución')
  if(topics.every(t=>['computational-ethics','food-ethics'].includes(t.id)))commonText=commonText.replace(/\bdatos\b/g,'información').replace(/\bresultados\b/g,'conclusiones')
 }
 if(/^\s*(?:explic\w*|analiz\w*|interpret\w*)\b/.test(text))commonText=commonText.replace(/\binterpretacion\b/g,'lectura').replace(/\bargumentacion\b/g,'razonamiento')
 commonText=commonText.replace(/\bdiscut(?:e|en)\b/g,'analiza')
 if(grouped&&/\b(?:aportacion|contribucion)\w*\b/.test(text))commonText=commonText.replace(/\bregistr(?:a|an|ar|e|en)\b/g,'documenta')
 if(/^\s*disen\w*\b/.test(text))commonText=commonText.replace(/\bconsulta\b/g,'selección de datos')
 if(/\b(?:redact\w*|elabor\w*|escrib\w*)\b[^.;]*\binforme\b/.test(commonText))commonText=commonText.replace(/\bproyecto\b/g,'trabajo documentado')
 if(topics.every(t=>['research-ethics','environmental-privacy','biotech-implications'].includes(t.id)))commonText=commonText.replace(/\bdatos\b/g,'información')
 if(/^\s*analiz\w*\b/.test(commonText)&&/\btrabajo documentado\b/.test(commonText)&&task.actions.some(a=>/\bresultados\b/.test(a.text)))commonText=commonText.replace(/trabajo documentado/,'resultados del trabajo documentado')
 const common=task.grade===5&&contributionRequested?[]:commonScienceCriteria({...task,actions:[{...actionRow,text:commonText}]}).filter(r=>task.grade!==5||!programs(text)||!['calculation','result'].some(key=>r.templateId.endsWith('-'+key)))
 const ownKeys=new Set(custom.map(r=>r.templateId))
 return[...custom,...common.filter(r=>!ownKeys.has(r.templateId)&&!(custom.length&&r.templateId.endsWith('-content'))&&!(plans(text)&&r.templateId.endsWith('-design')))]
}
export function optativeScienceEvidence(task:OptativeScienceEvidenceTask):ContextualTopicCriterion[]{
 if(task.alternatives?.length)return alternativeCriterion(task.alternatives.map(optativeScienceEvidence),task)
 const rows=task.actions.flatMap(a=>criteriaFor(a,task))
 const unique=rows.filter((r,i)=>rows.findIndex(other=>other.templateId===r.templateId&&other.title===r.title&&other.observable===r.observable)===i)
 const occurrences=new Map<string,number>()
 return unique.map(row=>{
  const count=(occurrences.get(row.templateId)??0)+1
  occurrences.set(row.templateId,count)
  if(count===1)return row
  const topic=task.actions.flatMap(a=>a.topics).find(t=>row.templateId.startsWith(`nat-${task.grade}-${t.id}-`))
  const prefix=`nat-${task.grade}-${topic?.id}-`
  return{...row,templateId:prefix+`action-${count}-`+row.templateId.slice(prefix.length)}
 })
}
