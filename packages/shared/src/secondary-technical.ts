import type {InstrumentAcademicContext} from './secondary-science'
import type {CommonScienceTopic} from './secondary-science-common-types'
import {resolveScienceTaskForTopics,scienceRequirementText,adaptScienceScale} from './secondary-science-common'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'
import type {InstrumentRecommendation,InstrumentType} from './instrument-recommendation'
import {technicalMf053Four} from './secondary-technical-mf053-4'

export type TechnicalTopic=CommonScienceTopic&{
 sourceRecordIds:string[];requires?:string;fallbackGroup?:string;application?:string
}
export type TechnicalModule={
 id:string;programCode:string;moduleCode:string;grade:number;cycle:number;modalityCode:string;
 subjectName:string;sourceScopeId:string;pdfPages:number[];policy:string;topics:TechnicalTopic[]
}
type TechnicalAction={text:string;topics:TechnicalTopic[]}
export type TechnicalTask={
 module:TechnicalModule;grade:number;actions:TechnicalAction[];activityType:string;technique:string;alternatives?:TechnicalTask[]
}
export const technicalModules:TechnicalModule[]=[technicalMf053Four]
const technicalVerbs='disen\\w*|seleccion\\w*|aplic\\w*|apliqu\\w*|tabul\\w*|depur\\w*|gener\\w*|diagram\\w*|jerarqui\\w*|enumer\\w*|distingu\\w*|reconoc\\w*|utiliz\\w*|program\\w*|desplieg\\w*|implement\\w*|organiz\\w*|justific\\w*|propon\\w*|propong\\w*'
const alternativeVerbs=`${technicalVerbs}|elabor\\w*|dibuj\\w*|represent\\w*|analiz\\w*|describ\\w*|explic\\w*|compar\\w*|identific\\w*`
const affirmative=(value:string)=>scienceRequirementText(value)
 .replace(/\b(?:opcionalmente|si lo deseas|como apoyo|como recurso)\b[^.;\n]*/g,'')
 .replace(/\b(?:puedes?|podran|podras)\s+(?:consult\w*|utiliz\w*|usar\w*)[^.;\n]*/g,'')
 .replace(new RegExp(`\\b(?:no\\s+(?:(?:se|deben?|es necesario)\\s+)?|sin\\s+)(?:${technicalVerbs})[^.;\\n]*`,'g'),'').trim()

const fallbackMembers:Record<string,(topic:TechnicalTopic)=>boolean>={
 feasibility:t=>t.id.startsWith('feasibility-'),
 method:t=>t.id.startsWith('method-')&&t.id!=='method-selection',
 collection:t=>['interview','questionnaire','observation','document-review','sampling'].includes(t.id),
 diagram:t=>t.id.startsWith('diagram-')&&t.id!=='diagram-selection',
 class:t=>t.id==='diagram-class',object:t=>t.id==='diagram-object',
 record:t=>t.id==='debug-records',array:t=>t.id==='array-types',
 'system-detail':t=>!['systems','requirements'].includes(t.id),
}
function selectTopics(text:string,topics:TechnicalTopic[]) {
 const selected=topics.filter(t=>new RegExp(`\\b(?:${t.match})\\b`).test(text)&&(!t.requires||new RegExp(t.requires).test(text)))
 return selected.filter(t=>!t.fallbackGroup||!selected.some(fallbackMembers[t.fallbackGroup]))
}
export function resolveTechnicalTask(title:string,description:string,context?:InstrumentAcademicContext|null,modules:TechnicalModule[]=technicalModules):TechnicalTask|null{
 if(context?.level!=='SECONDARY'||context.optativeExitName)return null
 const module=modules.find(m=>m.moduleCode===context.subjectCode.trim().toUpperCase()
  &&m.grade===context.grade&&(context.cycle==null?context.grade>=4:context.cycle===m.cycle)
  &&m.modalityCode===context.modalityCode)
 if(!module)return null
 const requirement=affirmative(description.trim()?description:title)
 if(!requirement)return null
 const parse=(text:string):TechnicalTask|null=>{
  const parsed=resolveScienceTaskForTopics('',text,module.grade,module.topics,{
   additionalVerbs:technicalVerbs,selectTopics:(part,topics)=>selectTopics(part,topics as TechnicalTopic[]),
  })
  if(!parsed)return null
  // Reuse the action parser, not its science-specific purpose heuristics.
  const modes=parsed.actions.map(a=>modeFor(a.text))
  const report=parsed.actions.some(a=>['evidence','representation'].includes(modeFor(a.text))
   &&/\b(?:redact\w*|elabor\w*|escrib\w*|present\w*)\s+(?:(?:un|el)\s+)?informe\b/.test(a.text))
  const oral=parsed.actions.some(a=>modeFor(a.text)==='evidence'&&/\b(?:expon\w*|expone\w*|present\w*\s+oralmente)\b/.test(a.text))
  const design=modes.some(mode=>mode==='design'||mode==='representation')
  const application=parsed.actions.some(a=>modeFor(a.text)==='application'&&a.topics.some(t=>['interview','questionnaire','observation'].includes(t.id)))
  const activityType=report?'REPORT':oral?'ORAL_PRESENTATION':design?'PROJECT':application?'OBSERVATION':modes.includes('calculation')?'EXERCISE_SET':modes.includes('comparison')?'COMPARISON':'ANALYSIS'
  const technique=activityType==='PROJECT'?'proyecto':activityType==='OBSERVATION'?'observacion-sistematica':activityType==='ORAL_PRESENTATION'?'presentacion':'analisis-producciones'
  return{...parsed,actions:parsed.actions as TechnicalAction[],activityType,technique,module}
 }
 const task=parse(requirement)
 if(!task)return null
 const branches=requirement.split(/\s+(?:o bien|o)\s+/)
 if(branches.length>1){
  const verb=new RegExp(`\\b(?:${alternativeVerbs})\\b`)
  const inheritedVerb=branches[0].match(verb)?.[0]
  const alternatives=branches.map(branch=>parse(!verb.test(branch)&&inheritedVerb?`${inheritedVerb} ${branch}`:branch))
  if(alternatives.every((branch):branch is TechnicalTask=>branch!==null))task.alternatives=alternatives
 }
 return task
}

type Mode='identification'|'description'|'explanation'|'comparison'|'selection'|'design'|'application'|'analysis'|'classification'|'sequence'|'tabulation'|'debugging'|'verification'|'representation'|'recording'|'justification'|'proposal'|'calculation'|'evidence'
const modeRules:[Mode,RegExp][]=[
 ['description',/\bdescrib\w*\b/],['explanation',/\bexplic\w*\b/],
 ['identification',/\b(?:identific\w*|reconoc\w*|senal\w*|enumer\w*)\b/],
 ['comparison',/\b(?:compar\w*|contrast\w*|distingu\w*)\b/],
 ['selection',/\bseleccion\w*\b/],['design',/\bdisen\w*\b/],
 ['analysis',/\b(?:analiz\w*|interpret\w*)\b/],
 ['justification',/\b(?:justific\w*|argument\w*)\b/],
 ['proposal',/\b(?:propon\w*|propong\w*)\b/],['recording',/\bregistr(?:a|an|ar|e|en|ando|aran)\b/],
 ['classification',/\bclasific\w*\b/],['tabulation',/\btabul\w*\b/],
 ['debugging',/\bdepur\w*\b/],['verification',/\b(?:verific\w*|comprob\w*)\b/],
 ['sequence',/\b(?:orden\w*|jerarqui\w*|organiz\w*)\b/],
 ['calculation',/\b(?:calcul(?:a|an|ar|e|en|ando|aran)|resuelv(?:e|en|a|an)|resolv(?:er|iendo|era|eran))\b/],
 ['representation',/\b(?:dibuj\w*|represent\w*|diagram\w*|elabor\w*)\b/],
 ['application',/\b(?:aplic\w*|apliqu\w*|utiliz\w*|genera\w*|realiz\w*)\b/],
]
const modeFor=(text:string):Mode=>modeRules.map(([mode,pattern])=>({mode,index:text.search(pattern)}))
 .filter(r=>r.index>=0).sort((a,b)=>a.index-b.index)[0]?.mode??'evidence'
const modeWords:Record<Mode,[string,string]>={
 identification:['Identificación','Identifica'],description:['Descripción','Describe'],explanation:['Explicación','Explica'],
 comparison:['Comparación','Compara los casos solicitados atendiendo a'],selection:['Selección','Selecciona la opción adecuada atendiendo a'],
 design:['Diseño','El diseño representa'],application:['Aplicación','Aplica el procedimiento solicitado manteniendo'],
 analysis:['Análisis','Analiza'],classification:['Clasificación','Clasifica los elementos solicitados atendiendo a'],
 sequence:['Organización','Organiza los elementos solicitados manteniendo'],tabulation:['Tabulación','Tabula los datos manteniendo'],
 debugging:['Depuración','Depura los datos manteniendo'],verification:['Verificación','Comprueba'],
 recording:['Registro','Registra los datos conservando'],justification:['Justificación','Justifica la decisión solicitada apoyándose en'],
 proposal:['Propuesta','La propuesta responde a'],
 calculation:['Resolución','Resuelve el caso manteniendo'],
 representation:['Representación','La representación conserva'],evidence:['Evidencia','La evidencia solicitada muestra'],
}
function actionCriteria(action:TechnicalAction):ContextualTopicCriterion[]{
 const mode=modeFor(action.text),[label,verb]=modeWords[mode]
 return action.topics.map(topic=>{
  let relation=topic.relation
  if(topic.id==='interview'&&mode==='application')relation='la correspondencia entre las preguntas formuladas, las respuestas escuchadas y la información requerida por el sistema'
  if(['interview','questionnaire'].includes(topic.id)&&mode==='recording')relation='la fidelidad del registro a las respuestas del usuario, distinguiendo datos ausentes de interpretaciones del analista'
  if(topic.id==='processes'&&mode==='identification'&&/finalidad/.test(action.text))relation='la finalidad del proceso dentro de la organización del caso'
  if(topic.id==='sampling'&&mode==='identification'&&/variables/.test(action.text))relation='las variables presentes en la muestra que aportan información relevante para el sistema'
  if(topic.id==='process-measurement'&&mode==='analysis')relation='la correspondencia entre los indicadores del proceso y los datos proporcionados'
  if(topic.id==='process-measurement'&&mode==='proposal')relation='la necesidad de mejora identificada en los datos e indicadores del proceso'
  const success=mode==='application'&&topic.application?topic.application
   :mode==='recording'&&['interview','questionnaire'].includes(topic.id)?`Registra las respuestas conservando ${relation}.`
   :`${verb} ${relation}.`
  const progressionLevels:ContextualTopicCriterion['progressionLevels']=[
   success,
   `${success} Una imprecisión menor necesita ajuste, pero permite comprobar la relación solicitada.`,
   `La evidencia de ${topic.label.toLowerCase()} conserva parte de la relación solicitada, pero omite un elemento necesario para comprobarla.`,
   `La evidencia de ${topic.label.toLowerCase()} presenta una contradicción con ${relation}.`,
   `No se presenta evidencia reconocible de ${topic.label.toLowerCase()} para la acción solicitada.`,
  ]
  return{templateId:`technical-mf053-${topic.id}-${mode}`,title:topic.label.startsWith(label)?topic.label:`${label}: ${topic.label}`,observable:success,progressionLevels,weight:3}
 })
}
export function technicalCriteria(task:TechnicalTask):ContextualTopicCriterion[]{
 if(task.alternatives){
  const branches=task.alternatives.map(technicalCriteria)
  const progressionLevels=[0,1,2,3,4].map(index=>`En la alternativa elegida: ${branches.map(rows=>rows.map(r=>r.progressionLevels[index]).join(' ')).join(' O BIEN: ')}`) as ContextualTopicCriterion['progressionLevels']
  return[{templateId:'technical-mf053-alternative',title:'Alternativa técnica solicitada',observable:progressionLevels[0],progressionLevels,weight:3}]
 }
 return [...new Map(task.actions.flatMap(actionCriteria).map(row=>[row.templateId,row])).values()]
}
export function technicalSelections(task:TechnicalTask,description:string){
 const text=affirmative(description)
 const observed=task.actions.some(a=>a.topics.some(t=>t.id==='observation')&&modeFor(a.text)==='application')
 const suggestedInstrumentType:InstrumentType=/credito parcial|ponder\w*|puntos por|pesos por/.test(text)?'lista-ponderada'
  :observed&&/frecuencia|regularidad/.test(text)?'escala'
  :task.actions.some(a=>['analysis','explanation','comparison','design','justification','proposal'].includes(modeFor(a.text)))||['REPORT','ORAL_PRESENTATION'].includes(task.activityType)?'rubrica':'lista-cotejo'
 return{suggestedInstrumentType,suggestedEvaluationTechnique:task.technique}
}
export function adaptTechnicalScale(proposal:InstrumentRecommendation,description:string,task:TechnicalTask){
 const frequency=technicalSelections(task,description).suggestedInstrumentType==='escala'
 return adaptScienceScale(proposal,frequency?'Observa y registra la frecuencia del proceso solicitado.':'Calidad de la evidencia técnica solicitada.')
}
