import type {InstrumentAcademicContext} from './secondary-science'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'
import type {InstrumentRecommendation,InstrumentType} from './instrument-recommendation'
import {withoutResources} from './evaluation-task-text'
import {fhrGradeOneTopics} from './secondary-fhr-grade-1'
import {fhrGradeTwoTopics} from './secondary-fhr-grade-2'

type FhrPurpose='ANALYSIS'|'COMPARISON'|'RESEARCH'|'DEBATE'|'PRESENTATION'|'PRODUCTION'|'PLAN'|'PERFORMANCE'|'VERIFICATION'|'OBSERVATION'
export type FhrTopic={id:string;grade:number;label:string;match:string;object:string;relation:string;sourceRecordIds:string[];pdfPages:number[];choices?:string[][];choiceDefault?:string;excludeWhen?:string;productType?:string;objects?:Partial<Record<FhrPurpose,string>>}
type FhrAction={text:string;topics:FhrTopic[];purpose:FhrPurpose}
export type CommonFhrTask={grade:number;text:string;actions:FhrAction[];activityType:string;technique:string}
export const commonFhrModules=[{id:'formacion-humana-religiosa-comun-1',grade:1,topics:fhrGradeOneTopics,policy:'OBSERVABLE_INTERPRETATION_AND_PRODUCTS_NOT_PRIVATE_FAITH'},{id:'formacion-humana-religiosa-comun-2',grade:2,topics:fhrGradeTwoTopics,policy:'OBSERVABLE_INTERPRETATION_AND_PRODUCTS_NOT_PRIVATE_FAITH'}]
const normalize=(value:string)=>value.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase()
const action='(?:analiz|explic|describ|relat|narr|reflexion|identific|clasific|interpret|compar|contrast|investig|indag|debat|argument|justific|sustent|present|expon|elabor|cre|constru|redact|compon|organiz|prepar|planific|propon|represent|dramatiz|escenific|realiz|registr|verific|comprueb)[a-z]*'
const affirmative=(value:string)=>normalize(withoutResources(value.replace(/<\/(?:p|li|div)>|<br\s*\/?\s*>/gi,'. ').replace(/<[^>]*>/g,' ').replace(/&nbsp;|&#160;/g,' '))).replace(/\b(?:no|sin(?!\s+acceso\b))\b[^.;\n]*/g,'').trim()
const join=(parts:string[])=>parts.length<2?parts[0]:parts.slice(0,-1).join(', ')+' y '+parts.at(-1)
function selectedTopics(text:string,available:FhrTopic[]){
 const exact=available.filter(t=>text.replace(/[.\s]+$/,'')==='explica '+normalize(t.label))
 if(exact.length)return exact
 let topics=available.filter(t=>(text.includes(normalize(t.label))||new RegExp(`\\b(?:${t.match})\\b`).test(text))&&(!t.excludeWhen||!new RegExp(t.excludeWhen).test(text)))
 if(topics.some(t=>['environment-mural','environment-campaign','environment-news','environment-laws'].includes(t.id)))topics=topics.filter(t=>t.id!=='environment-care')
 return topics
}
function purposeFor(text:string):FhrPurpose{
 const first=text.match(new RegExp(`\\b${action}\\b`))?.[0]??''
 if(/^registr/.test(first)&&/frecuencia|oportunidades/.test(text))return'OBSERVATION'
 if(/^verific|^comprueb/.test(first))return'VERIFICATION'
 if(/^compar|^contrast/.test(first))return'COMPARISON'
 if(/^investig|^indag/.test(first))return'RESEARCH'
 if(/^debat|^argument/.test(first)||/^(?:realiz|organiz|prepar)/.test(first)&&/panel|mesa redonda|debate/.test(text))return'DEBATE'
 if(/^present|^expon/.test(first))return'PRESENTATION'
 if(/^planific|^propon/.test(first)||/^(?:elabor|cre|constru|organiz)/.test(first)&&/\bplan\b/.test(text))return'PLAN'
 if(/^elabor|^cre|^constru|^redact|^compon/.test(first))return'PRODUCTION'
 if(/^represent|^dramatiz|^escenific|^realiz/.test(first))return'PERFORMANCE'
 return'ANALYSIS'
}
const types:Record<FhrPurpose,string>={ANALYSIS:'ANALYSIS',COMPARISON:'COMPARISON',RESEARCH:'RESEARCH',DEBATE:'DEBATE',PRESENTATION:'EXPOSITION',PRODUCTION:'PROJECT',PLAN:'PROJECT',PERFORMANCE:'PERFORMANCE',VERIFICATION:'ANALYSIS',OBSERVATION:'OBSERVATION'}
export function resolveCommonFhrTask(title:string,description:string,context?:InstrumentAcademicContext|null,providedTopics?:FhrTopic[]):CommonFhrTask|null{
 if(context?.level!=='SECONDARY'||context.subjectCode.trim().toUpperCase()!=='FHR'||context.optativeExitName)return null
 const module=commonFhrModules.find(m=>m.grade===context.grade);if(!module)return null
 const text=affirmative(description||title);if(!new RegExp(`\\b${action}\\b`).test(text))return null
 const available=(providedTopics??module.topics).filter(t=>t.grade===context.grade),actions:FhrAction[]=[]
 const clauses=text.split(new RegExp(`[.;\\n]+|\\s+(?:y|luego|despues)\\s+(?=${action}\\b)`)).map(s=>s.trim()).filter(Boolean)
 for(const clause of clauses){
  const topics=selectedTopics(clause,available),previous=actions.at(-1)
  if(!topics.length||previous&&topics.every(t=>previous.topics.some(p=>p.id===t.id))&&/^(?:justifica|sustenta|relaciona|explica)\b/.test(clause)){
   if(previous)previous.text+='. '+clause
  }else actions.push({text:clause,topics,purpose:purposeFor(clause)})
 }
 if(!actions.length)return null
 const first=actions[0],purpose=first.purpose,activityType=purpose==='PRODUCTION'?(first.topics[0].productType??types[purpose]):types[purpose]
 return{grade:context.grade!,text,actions,activityType,technique:activityType==='PORTFOLIO'?'portafolio':purpose==='DEBATE'?'debate':purpose==='PRESENTATION'?'presentacion':purpose==='PERFORMANCE'&&/dramatiz|represent|escenific/.test(first.text)?'dramatizacion':purpose==='PERFORMANCE'||purpose==='OBSERVATION'?'observacion-sistematica':'analisis-producciones'}
}
function topicObject(topic:FhrTopic,text:string,purpose:FhrPurpose){
 const parts=topic.choices?.filter(([pattern])=>new RegExp(`\\b(?:${pattern})\\b`).test(text)).map(([,label])=>label)??[]
 const choice=parts.length>1&&/\bo\b/.test(text)?'la opción elegida entre '+parts.join(' o '):parts.length?join(parts):topic.choiceDefault??'los componentes expresamente elegidos'
 return{object:(topic.objects?.[purpose]??topic.object).replaceAll('{choice}',choice),choice}
}
function requestedEvidence(topic:FhrTopic,purpose:FhrPurpose,text:string):ContextualTopicCriterion{
 const selected=topicObject(topic,text,purpose),choice=selected.choice,object=purpose==='PLAN'&&/panel/.test(text)&&!selected.object.includes('panel')?'el panel sobre '+selected.object:selected.object,reference=topic.relation
 const first=text.match(new RegExp(`\\b${action}\\b`))?.[0]??'',analysisVerb=/^clasific/.test(first)?'Clasifica':/^identific/.test(first)?'Identifica':/^interpret/.test(first)?'Interpreta':/^analiz/.test(first)?'Analiza':/^describ/.test(first)?'Describe':/^relat/.test(first)?'Relata':/^narr/.test(first)?'Narra':/^reflexion/.test(first)?'Reflexiona':'Explica'
 const forum=/mesa redonda/.test(text)?'Realiza la mesa redonda':/panel/.test(text)?'Realiza el panel':/^argument/.test(first)?'Argumenta':'Debate'
 const performanceVerb=/^represent/.test(first)?'Representa':/^dramatiz/.test(first)?'Dramatiza':/^escenific/.test(first)?'Escenifica':'Realiza'
 const success:Record<FhrPurpose,string>={
  ANALYSIS:`${analysisVerb}${analysisVerb==='Reflexiona'?' sobre':''} ${object} sustentando sus relaciones mediante ${reference}.`,
  COMPARISON:`Compara ${object} sustentando semejanzas y diferencias mediante ${reference}.`,
  RESEARCH:`${/^indag/.test(first)?'Indaga':'Investiga'} ${object} relacionando ${reference} con las fuentes proporcionadas.`,
  DEBATE:`${forum} sobre ${object} sustentando y contrastando argumentos mediante ${reference}.`,
  PRESENTATION:`Presenta ${object} relacionando ${reference} con las evidencias proporcionadas.`,
  PRODUCTION:topic.id==='community-values'?`Construye ${/^(?:la|el|los|las) /.test(choice)?choice:'el '+choice} sobre ${object} relacionando ${reference} con sus evidencias.`:`Elabora ${object} relacionando ${reference} con las evidencias proporcionadas.`,
  PLAN:`Planifica una propuesta sobre ${object} relacionando ${reference} con las alternativas proporcionadas, sin exigir ejecución.`,
  PERFORMANCE:`${performanceVerb} ${object} haciendo reconocibles las acciones y decisiones según ${reference}.`,
  VERIFICATION:`Verifica el cumplimiento de ${object} justificando cada marca con las acciones y condiciones del registro proporcionado.`,
  OBSERVATION:`Cumple ${object} en todas las oportunidades observadas según las reglas concretas proporcionadas.`
 }
 const producing=purpose==='PRODUCTION',planning=purpose==='PLAN',performing=purpose==='PERFORMANCE'
 let levels:ContextualTopicCriterion['progressionLevels']=[success[purpose],
  `${producing?'El producto':planning?'La propuesta':performing?'La representación o acción':'La interpretación'} permite reconocer ${object} según ${reference}; una relación secundaria queda poco precisada.`,
  `Incluye ${performing?'acciones':'evidencias'} pertinentes sobre ${object}, pero una ${performing?'decisión':'relación'} no se sustenta en ${reference}.`,
  performing?`Las acciones no permiten reconocer ${object} según ${reference}.`:`Sustituye las evidencias de ${reference} por atribuciones no sustentadas sobre ${object}.`,
  `No aporta evidencia del desempeño expresamente solicitado sobre ${object}.`
 ]
 if(purpose==='OBSERVATION')levels=[success[purpose],`Cumple ${object} en casi todas las oportunidades observadas según las reglas dadas.`,`Cumple ${object} en algunas oportunidades observadas según las reglas dadas.`,`Cumple ${object} en pocas oportunidades observadas según las reglas dadas.`,`No cumple ${object} en las oportunidades observadas; no equivale a ausencia de registro ni a un juicio de creencia privada.`]
 return{templateId:`fhr-${topic.grade}-${topic.id}-${purpose.toLowerCase()}-requested-evidence`,title:topic.label,observable:levels[0],weight:4,progressionLevels:levels}
}
export function commonFhrCriteria(task:CommonFhrTask):ContextualTopicCriterion[]{
 const rows=task.actions.flatMap(a=>a.topics.map(t=>requestedEvidence(t,a.purpose,a.text)))
 return rows.filter((row,index)=>rows.findIndex(other=>other.templateId===row.templateId)===index)
}
export function commonFhrSelections(task:CommonFhrTask){
 const purpose=task.actions[0].purpose,suggestedInstrumentType:InstrumentType=purpose==='OBSERVATION'?'escala':purpose==='VERIFICATION'?'lista-cotejo':'rubrica'
 return{suggestedInstrumentType,suggestedEvaluationTechnique:task.technique}
}
export function adaptFhrScale(proposal:InstrumentRecommendation,task:CommonFhrTask):InstrumentRecommendation{
 if(proposal.instrumentType!=='escala')return proposal
 const indexes=proposal.levels.length===4?[0,1,2,4]:[0,1,2,3,4],frequency=task.actions.every(a=>a.purpose==='OBSERVATION'),labels=frequency?['Siempre','Casi siempre','A veces','Casi nunca','Nunca']:['Completo','Suficiente','Parcial','Incipiente','Aún no logrado']
 return{...proposal,levels:proposal.levels.map((level,i)=>({...level,label:labels[indexes[i]]})),criteria:proposal.criteria.map(row=>({...row,descriptors:row.descriptors.map((d,i)=>({...d,text:row.progressionLevels?.[indexes[i]]??d.text}))}))}
}
