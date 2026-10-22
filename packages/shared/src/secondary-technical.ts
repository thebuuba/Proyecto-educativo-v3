import type {InstrumentAcademicContext} from './secondary-science'
import type {CommonScienceTopic} from './secondary-science-common-types'
import {resolveScienceTaskForTopics,scienceRequirementText,adaptScienceScale} from './secondary-science-common'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'
import type {InstrumentRecommendation,InstrumentType} from './instrument-recommendation'
import {technicalMf053Four} from './secondary-technical-mf053-4'
import {technicalMf002Four} from './secondary-technical-mf002-4'
import {technicalMf054Five} from './secondary-technical-mf054-5'
import {technicalMf056Four} from './secondary-technical-mf056-4'
import {technicalMf059Four} from './secondary-technical-mf059-4'
import {technicalMf057Five} from './secondary-technical-mf057-5'

export type TechnicalTopic=CommonScienceTopic&{
 sourceRecordIds:string[];requires?:string;fallbackGroup?:string;application?:string;suppresses?:string[];relationsByMode?:Record<string,string>
}
export type TechnicalModule={
 id:string;programCode:string;moduleCode:string;grade:number;cycle:number;modalityCode:string;
 subjectName:string;sourceScopeId:string;pdfPages:number[];policy:string;topics:TechnicalTopic[]
 programCodes?:string[];templatePrefix?:string;additionalVerbs?:string
}
type TechnicalAction={text:string;topics:TechnicalTopic[]}
export type TechnicalTask={
 module:TechnicalModule;grade:number;actions:TechnicalAction[];activityType:string;technique:string;alternatives?:TechnicalTask[]
}
export const technicalModules:TechnicalModule[]=[technicalMf053Four,technicalMf002Four,technicalMf054Five,technicalMf056Four,technicalMf059Four,technicalMf057Five]
const technicalVerbs='disen\\w*|seleccion\\w*|aplic\\w*|apliqu\\w*|tabul\\w*|depur\\w*|gener\\w*|diagram\\w*|jerarqui\\w*|enumer\\w*|distingu\\w*|reconoc\\w*|utiliz\\w*|program\\w*|desplieg\\w*|implement\\w*|organiz\\w*|justific\\w*|propon\\w*|propong\\w*'
const alternativeVerbs=`${technicalVerbs}|elabor\\w*|dibuj\\w*|represent\\w*|analiz\\w*|describ\\w*|explic\\w*|compar\\w*|identific\\w*`
const affirmative=(value:string,additionalVerbs='')=>scienceRequirementText(value)
 .replace(/\b(?:opcionalmente|si lo deseas|como apoyo|como recurso)\b[^.;\n]*/g,'')
 .replace(/\b(?:puedes?|podran|podras)\s+(?:consult\w*|utiliz\w*|usar\w*)[^.;\n]*/g,'')
 .replace(new RegExp(`\\b(?:no\\s+(?:(?:se|deben?|es necesario)\\s+)?|sin\\s+)(?:${additionalVerbs||technicalVerbs})\\b[^.;\\n]*`,'g'),'').trim()

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
 const selected=topics.filter(t=>new RegExp(`\\b(?:${t.match})\\b`).test(text)&&(!t.requires||new RegExp(t.requires).test(text))&&(!t.exclude||!new RegExp(t.exclude).test(text)))
 const suppressed=new Set(selected.flatMap(t=>t.suppresses??[]))
 return selected.filter(t=>!suppressed.has(t.id)&&(!t.fallbackGroup||!selected.some(fallbackMembers[t.fallbackGroup])))
}
export function resolveTechnicalTask(title:string,description:string,context?:InstrumentAcademicContext|null,modules:TechnicalModule[]=technicalModules):TechnicalTask|null{
 if(context?.level!=='SECONDARY'||context.optativeExitName)return null
 const module=modules.find(m=>m.moduleCode===context.subjectCode.trim().toUpperCase()
  &&m.grade===context.grade&&(context.cycle==null?context.grade>=4:context.cycle===m.cycle)
  &&m.modalityCode===context.modalityCode)
 if(!module)return null
 let requirement=affirmative(description.trim()?description:title,module.additionalVerbs)
 // A comma between explicit office actions can share the same final object.
 // Preserve ordinary lists of fields and the parser behaviour of older modules.
 if(module.moduleCode==='MF_002_3')requirement=requirement.replace(new RegExp(`,\\s*(?=(?:${module.additionalVerbs})\\b)`,'g'),' y ')
 // MIDI names a format here; the shared science parser also recognizes «mid…» as measuring.
 if(module.moduleCode==='MF_059_3')requirement=requirement.replace(/\b(y|e)\s+midi\b/g,'$1 formato midi')
 if(!requirement)return null
 const parse=(text:string):TechnicalTask|null=>{
  const parsed=resolveScienceTaskForTopics('',text,module.grade,module.topics,{
   additionalVerbs:module.additionalVerbs??technicalVerbs,selectTopics:(part,topics)=>selectTopics(part,topics as TechnicalTopic[]),
  })
  if(!parsed)return null
  // Reuse the action parser, not its science-specific purpose heuristics.
  const mode=(text:string)=>modeFor(text,module)
  const modes=parsed.actions.map(a=>mode(a.text))
  const report=parsed.actions.some(a=>['evidence','representation','creation'].includes(mode(a.text))
   &&/\b(?:redact\w*|elabor\w*|escrib\w*|present\w*)\s+(?:(?:un|el)\s+)?informe\b/.test(a.text))
  const oral=parsed.actions.some(a=>mode(a.text)==='evidence'&&/\b(?:expon\w*|expone\w*|present\w*\s+oralmente)\b/.test(a.text))
  const design=modes.some(mode=>mode==='design'||mode==='representation'||mode==='creation'||mode==='development'||mode==='coding')
  const application=parsed.actions.some(a=>mode(a.text)==='application'&&a.topics.some(t=>['interview','questionnaire','observation'].includes(t.id)))
  const officeObservation=module.moduleCode==='MF_002_3'&&modes.includes('observation')
   ||module.moduleCode==='MF_054_3'&&modes.includes('execution')
   ||module.moduleCode==='MF_059_3'&&modes.includes('verification')
   ||module.moduleCode==='MF_057_3'&&modes.some(mode=>['verification','observation'].includes(mode))
  const officePractice=module.moduleCode==='MF_002_3'&&modes.some(mode=>['application','configuration','correction','sequence'].includes(mode))
   ||['MF_054_3','MF_056_3'].includes(module.moduleCode)&&modes.includes('application')
   ||module.moduleCode==='MF_059_3'&&modes.some(mode=>['application','configuration','correction'].includes(mode))
   ||module.moduleCode==='MF_057_3'&&modes.some(mode=>['application','configuration','correction'].includes(mode))
  const activityType=report?'REPORT':oral?'ORAL_PRESENTATION':design?'PROJECT':application||officeObservation?'OBSERVATION':modes.includes('calculation')||officePractice?'EXERCISE_SET':modes.includes('comparison')?'COMPARISON':'ANALYSIS'
  const technique=activityType==='PROJECT'?'proyecto':activityType==='OBSERVATION'?'observacion-sistematica':activityType==='ORAL_PRESENTATION'?'presentacion':'analisis-producciones'
  return{...parsed,actions:parsed.actions as TechnicalAction[],activityType,technique,module}
 }
 const task=parse(requirement)
 if(!task)return null
 const branches=requirement.split(/\s+(?:o bien|o)\s+/)
 if(branches.length>1){
  // Product nouns such as «programa» and «diseño» must not replace an inherited action.
  const verbs=['MF_054_3','MF_056_3','MF_059_3','MF_057_3'].includes(module.moduleCode)?`${module.additionalVerbs}|elabor(?:a|an|ar|e|en|ando)|represent(?:a|an|ar|e|en|ando)|dibuj(?:a|an|ar|e|en|ando)`:`${alternativeVerbs}${module.additionalVerbs?'|'+module.additionalVerbs:''}`
  const verb=new RegExp(`\\b(?:${verbs})\\b`)
  const inheritedVerb=branches[0].match(verb)?.[0]
  const alternatives=branches.map(branch=>parse(!verb.test(branch)&&inheritedVerb?`${inheritedVerb} ${branch}`:branch))
  if(alternatives.every((branch):branch is TechnicalTask=>branch!==null))task.alternatives=alternatives
 }
 return task
}

type Mode='identification'|'description'|'explanation'|'comparison'|'selection'|'design'|'application'|'analysis'|'classification'|'sequence'|'tabulation'|'debugging'|'verification'|'representation'|'recording'|'justification'|'proposal'|'calculation'|'evidence'|'creation'|'configuration'|'correction'|'observation'|'retrieval'|'development'|'coding'|'execution'
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
const officeModeRules:[Mode,RegExp][]=[
 ['creation',/\b(?:cre(?:a|an|ar|e|en|ando|ara|aran)|prepar(?:a|an|ar|e|en|ando|ara|aran)|redact\w*|escrib\w*)\b/],
 ['sequence',/\breorganiz(?:a|an|ar|e|en|ando|ara|aran)\b/],
 ['verification',/\bcomprueb(?:a|an|e|en)\b/],
 ['observation',/\bobserv(?:a|an|ar|e|en|ando)\b/],
 ['retrieval',/\bbusc(?:a|an|ar|ando)\b|\bbusqu(?:e|en)\b/],
 ['configuration',/\b(?:configur\w*|personaliz\w*)\b/],
 ['correction',/\b(?:corrig\w*)\b/],
 ['application',/\b(?:insert\w*|anad\w*|combin\w*|guard\w*|gestion\w*|distribu\w*|filtr\w*|import\w*|export\w*|duplic\w*|archiv\w*|conect\w*|desconect\w*|transcrib\w*|practic\w*|practiqu\w*|modific\w*|envi\w*|imprim\w*|publi\w*)\b/],
]
const developmentModeRules:[Mode,RegExp][]=[
 ['development',/\b(?:desarroll(?:a|an|ar|e|en|ando)|construy(?:e|en|a|an)|construir)\b/],
 ['coding',/\bcodific(?:a|an|ar|ando)\b|\bcodifiqu(?:e|en)\b/],
 ['execution',/\bejecut(?:a|an|ar|e|en|ando)\b/],
 ['verification',/\brevis(?:a|an|ar|e|en|ando)\b|\bcomprueb(?:a|an|e|en)\b/],
 ['selection',/\b(?:elige|eligen|elegir)\b/],
]
const databaseModeRules:[Mode,RegExp][]=[
 ['design',/\bdefin(?:e|en|ir|a|an)\b/],
 ['identification',/\bdetermin(?:a|an|ar|e|en)\b/],
 ['application',/\b(?:elimin(?:a|an|ar|e|en)|relacion(?:a|an|ar|e|en))\b/],
]
const webModeRules:[Mode,RegExp][]=[
 ['design',/\bdefin(?:e|en|ir|a|an)\b(?=[^.;]*\b(?:regiones?|zonas?)\b)/],
 ['description',/\bdefin(?:e|en|ir|a|an)\b/],
 ['creation',/\bdocument(?:a|an|ar|e|en|ando)\b/],
 ['sequence',/\bdetermin(?:a|an|ar|e|en)\b/],
 ['verification',/\b(?:prueb(?:a|an|e|en)|probar|comprueb(?:a|an|e|en))\b/],
 ['application',/\b(?:desactiv\w*|vincul\w*|enlaz\w*|cambi\w*|adapt\w*)\b/],
 ['selection',/\b(?:elige|eligen|elegir|escog(?:e|en|er))\b/],
]
const administrationModeRules:[Mode,RegExp][]=[
 ['description',/\bdefin(?:e|en|ir|a|an)\b/],
 ['selection',/\bdetermin(?:a|an|ar|e|en)\b/],
 ['creation',/\bdocument(?:a|an|ar|e|en|ando)\b|\bgenera(?=[^.;]*\bdocumentacion\b)/],
 ['design',/\bplanific(?:a|an|ar|ando)\b|\bplanifiqu(?:e|en)\b/],
 ['verification',/\b(?:prueb(?:a|an|e|en)|probar|comprueb(?:a|an|e|en)|revis(?:a|an|ar|e|en|ando))\b/],
 ['verification',/\baplica(?=[^.;]*\bpruebas\b)/],
 ['observation',/\bmonitore(?:a|an|ar|e|en|ando)\b/],
 ['configuration',/\bprogram(?:a|an|ar|e|en|ando)\b|\bestablece(?=[^.;]*\bperiodos\b)/],
 ['correction',/\brealiza(?=[^.;]*\bcorrecciones\b)/],
 ['application',/\b(?:administr|implement|ejecut|restaur|reestructur|elimin|recuper|automatiz|establec|actualiz)(?:a|an|ar|e|en|er|ando|iendo)\b/],
]
const modeFor=(text:string,module?:TechnicalModule):Mode=>[...(module?.moduleCode==='MF_057_3'?administrationModeRules:[]),...modeRules,...(module?.moduleCode==='MF_002_3'?officeModeRules:module?.moduleCode==='MF_054_3'?[...developmentModeRules,...officeModeRules]:module?.moduleCode==='MF_056_3'?[...databaseModeRules,...officeModeRules]:module?.moduleCode==='MF_059_3'?[...webModeRules,...officeModeRules]:module?.moduleCode==='MF_057_3'?officeModeRules:[])].map(([mode,pattern])=>({mode,index:text.search(pattern)}))
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
 creation:['Creación','El producto creado muestra'],configuration:['Configuración','Configura las opciones solicitadas manteniendo'],correction:['Corrección','Corrige los elementos indicados manteniendo'],
 observation:['Observación','Observa y comprueba'],retrieval:['Búsqueda','Localiza información que responde a'],
 development:['Desarrollo','El desarrollo conserva'],coding:['Codificación','El código conserva'],execution:['Ejecución','La ejecución permite comprobar'],
}
function actionCriteria(action:TechnicalAction,module:TechnicalModule):ContextualTopicCriterion[]{
 const mode=modeFor(action.text,module),[actionLabel,verb]=modeWords[mode]
 const alternativeFacets:{id:string;members:string[]}[]=[]
 const criteria=action.topics.flatMap(topic=>{
  const facets=topic.facets?.filter(f=>new RegExp(f.match).test(action.text))
  if(module.moduleCode==='MF_056_3'&&facets&&facets.length>1){
   const positions=facets.map(f=>action.text.search(new RegExp(f.match))).sort((a,b)=>a-b)
   if(/\bo\b/.test(action.text.slice(positions[0],positions.at(-1))))alternativeFacets.push({id:`${module.templatePrefix}-${topic.id}-alternative`,members:facets.map(f=>`${module.templatePrefix}-${topic.id}-${f.id}-${mode}`)})
  }
  return facets?.length?facets.map(f=>({...topic,id:`${topic.id}-${f.id}`,label:f.label,relation:f.relation,facets:undefined})):[topic]
 }).map(topic=>{
  let relation=topic.relationsByMode?.[mode]??topic.relation
  let label=topic.label
  if(topic.id==='interview'&&mode==='application')relation='la correspondencia entre las preguntas formuladas, las respuestas escuchadas y la información requerida por el sistema'
  if(['interview','questionnaire'].includes(topic.id)&&mode==='recording')relation='la fidelidad del registro a las respuestas del usuario, distinguiendo datos ausentes de interpretaciones del analista'
  if(topic.id==='processes'&&mode==='identification'&&/finalidad/.test(action.text))relation='la finalidad del proceso dentro de la organización del caso'
  if(topic.id==='sampling'&&mode==='identification'&&/variables/.test(action.text))relation='las variables presentes en la muestra que aportan información relevante para el sistema'
  if(topic.id==='process-measurement'&&mode==='analysis')relation='la correspondencia entre los indicadores del proceso y los datos proporcionados'
  if(topic.id==='process-measurement'&&mode==='proposal')relation='la necesidad de mejora identificada en los datos e indicadores del proceso'
  if(module.moduleCode==='MF_002_3'&&topic.id==='software'&&mode==='comparison'&&/\bhardware\b/.test(action.text)&&!/software de sistema|software de aplicacion/.test(action.text)){
   relation='la función de los programas frente a los componentes físicos del equipo del caso'
   label='Software del equipo'
  }
  if(module.moduleCode==='MF_002_3'&&topic.id==='workbooks'&&mode==='application'&&/\bduplic/.test(action.text))relation='la fidelidad de la copia o duplicado a las hojas originales, conservando los datos que deben mantenerse'
  if(module.moduleCode==='MF_002_3'&&topic.id==='slide-config'&&mode==='application'&&/\bexport/.test(action.text))relation='la correspondencia entre el archivo exportado y el contenido, secuencia y opciones de salida indicados'
  if(module.moduleCode==='MF_002_3'&&topic.id==='browser-search'&&/\bmetabuscador/.test(action.text))relation='la distinción entre acceso a páginas, búsqueda mediante un índice y consulta conjunta de varios buscadores, según las herramientas de la ficha'
  if(module.moduleCode==='MF_002_3'&&topic.id==='files-folders'&&mode==='recording'&&/\bfrecuencia\b/.test(action.text))relation='la correspondencia entre la frecuencia registrada y las observaciones del cumplimiento de las reglas dadas'
  if(module.moduleCode==='MF_002_3'&&topic.id==='pivot-table'){
   const table=/tablas? dinamicas?/.test(action.text),chart=/graficos? dinamicos?/.test(action.text)
   if(table&&!chart)label='Tablas dinámicas'
   if(chart&&!table){
    label='Gráficos dinámicos'
    relation='la correspondencia entre los campos y agrupaciones solicitados y su representación gráfica a partir de los datos dados'
   }
  }
  const success=mode==='application'&&topic.application?topic.application
   :mode==='recording'&&['interview','questionnaire'].includes(topic.id)?`Registra las respuestas conservando ${relation}.`
   :`${verb} ${relation}.`
  const progressionLevels:ContextualTopicCriterion['progressionLevels']=[
   success,
   `${success} Una imprecisión menor necesita ajuste, pero permite comprobar la relación solicitada.`,
   `La evidencia de ${label.toLowerCase()} conserva parte de la relación solicitada, pero omite un elemento necesario para comprobarla.`,
   `La evidencia de ${label.toLowerCase()} presenta una contradicción con ${relation}.`,
   `No se presenta evidencia reconocible de ${label.toLowerCase()} para la acción solicitada.`,
  ]
  return{templateId:`${module.templatePrefix??'technical-mf053'}-${topic.id}-${mode}`,title:label.startsWith(actionLabel)?label:`${actionLabel}: ${label}`,observable:success,progressionLevels,weight:3}
 })
 for(const group of alternativeFacets){
  const first=criteria.findIndex(r=>group.members.includes(r.templateId))
  const branches=criteria.filter(r=>group.members.includes(r.templateId)).map(r=>[r])
  const combined=alternativeCriterion(branches,group.id)
  for(let i=criteria.length-1;i>first;i--)if(group.members.includes(criteria[i].templateId))criteria.splice(i,1)
  criteria[first]=combined
 }
 return criteria
}
function alternativeCriterion(branches:ContextualTopicCriterion[][],templateId:string):ContextualTopicCriterion{
 const progressionLevels=[0,1,2,3,4].map(index=>`En la alternativa elegida: ${branches.map(rows=>rows.map(r=>r.progressionLevels[index]).join(' ')).join(' O BIEN: ')}`) as ContextualTopicCriterion['progressionLevels']
 return{templateId,title:'Alternativa técnica solicitada',observable:progressionLevels[0],progressionLevels,weight:3}
}
export function technicalCriteria(task:TechnicalTask):ContextualTopicCriterion[]{
 if(task.alternatives){
  const branches=task.alternatives.map(technicalCriteria)
  return[alternativeCriterion(branches,`${task.module.templatePrefix??'technical-mf053'}-alternative`)]
 }
 return [...new Map(task.actions.flatMap(action=>actionCriteria(action,task.module)).map(row=>[row.templateId,row])).values()]
}
export function technicalSelections(task:TechnicalTask,description:string){
 const text=affirmative(description,task.module.additionalVerbs)
 const observed=task.actions.some(a=>a.topics.some(t=>t.id==='observation')&&modeFor(a.text,task.module)==='application'
  ||task.module.moduleCode==='MF_002_3'&&modeFor(a.text,task.module)==='observation')
 const suggestedInstrumentType:InstrumentType=/credito parcial|ponder\w*|puntos por|pesos por/.test(text)?'lista-ponderada'
  :observed&&/frecuencia|regularidad/.test(text)?'escala'
  :task.actions.some(a=>['analysis','explanation','comparison','design','justification','proposal'].includes(modeFor(a.text,task.module)))||['REPORT','ORAL_PRESENTATION'].includes(task.activityType)?'rubrica':'lista-cotejo'
 return{suggestedInstrumentType,suggestedEvaluationTechnique:task.technique}
}
export function adaptTechnicalScale(proposal:InstrumentRecommendation,description:string,task:TechnicalTask){
 const frequency=technicalSelections(task,description).suggestedInstrumentType==='escala'
 return adaptScienceScale(proposal,frequency?'Observa y registra la frecuencia del proceso solicitado.':'Calidad de la evidencia técnica solicitada.')
}
