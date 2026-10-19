import type {InstrumentAcademicContext} from './secondary-science'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'
import type {InstrumentRecommendation,InstrumentType} from './instrument-recommendation'
import {withoutResources} from './evaluation-task-text'
import {fhrGradeOneTopics} from './secondary-fhr-grade-1'
import {fhrGradeTwoTopics} from './secondary-fhr-grade-2'
import {fhrGradeThreeTopics} from './secondary-fhr-grade-3'
import {fhrGradeFourTopics} from './secondary-fhr-grade-4'
import {fhrGradeFiveTopics} from './secondary-fhr-grade-5'
import {fhrGradeSixTopics} from './secondary-fhr-grade-6'

type FhrPurpose='ANALYSIS'|'COMPARISON'|'RESEARCH'|'DEBATE'|'PRESENTATION'|'PRODUCTION'|'PLAN'|'PERFORMANCE'|'VERIFICATION'|'OBSERVATION'
export type FhrTopic={id:string;grade:number;label:string;match:string;object:string;relation:string;sourceRecordIds:string[];pdfPages:number[];choices?:string[][];choiceDefault?:string;productChoices?:string[][];productChoiceDefault?:string;excludeWhen?:string;productType?:string;objects?:Partial<Record<FhrPurpose,string>>;planReferenceOnly?:boolean;conceptBrief?:boolean}
type FhrAction={text:string;topics:FhrTopic[];purpose:FhrPurpose}
export type CommonFhrTask={grade:number;text:string;actions:FhrAction[];activityType:string;technique:string}
export const commonFhrModules=[{id:'formacion-humana-religiosa-comun-1',grade:1,topics:fhrGradeOneTopics,policy:'OBSERVABLE_INTERPRETATION_AND_PRODUCTS_NOT_PRIVATE_FAITH'},{id:'formacion-humana-religiosa-comun-2',grade:2,topics:fhrGradeTwoTopics,policy:'OBSERVABLE_INTERPRETATION_AND_PRODUCTS_NOT_PRIVATE_FAITH'},{id:'formacion-humana-religiosa-comun-3',grade:3,topics:fhrGradeThreeTopics,policy:'OBSERVABLE_INTERPRETATION_AND_PRODUCTS_NOT_PRIVATE_FAITH'},{id:'formacion-humana-religiosa-comun-4',grade:4,topics:fhrGradeFourTopics,policy:'OBSERVABLE_INTERPRETATION_AND_PRODUCTS_NOT_PRIVATE_FAITH'},{id:'formacion-humana-religiosa-comun-5',grade:5,topics:fhrGradeFiveTopics,policy:'OBSERVABLE_INTERPRETATION_AND_PRODUCTS_NOT_PRIVATE_FAITH'},{id:'formacion-humana-religiosa-comun-6',grade:6,topics:fhrGradeSixTopics,policy:'OBSERVABLE_INTERPRETATION_AND_PRODUCTS_NOT_PRIVATE_FAITH'}]
const normalize=(value:string)=>value.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase()
const action='(?!(?:creacion|crecimiento|realizacion)\\b)(?:analiz|explic|describ|relat|narr|reflexion|identific|clasific|interpret|compar|contrast|investig|indag|recopil|compil|debat|argument|justific|sustent|present|expon|socializ|elabor|cre|constru|redact|compon|disen|formul|organiz|prepar|planific|propon|represent|dramatiz|escenific|realiz|registr|verific|comprueb)[a-z]*'
const affirmative=(value:string)=>normalize(withoutResources(value.replace(/<\/(?:p|li|div)>|<br\s*\/?\s*>/gi,'. ').replace(/<[^>]*>/g,' ').replace(/&nbsp;|&#160;/g,' '))).replace(/\b(?:no(?!\s+sentido\b)|sin(?!\s+(?:acceso|sentido)\b))\b[^.;\n]*/g,'').trim()
const join=(parts:string[])=>parts.length<2?parts[0]:parts.slice(0,-1).join(', ')+' y '+parts.at(-1)
function selectedTopics(text:string,available:FhrTopic[]){
 const exact=available.filter(t=>text.replace(/[.\s]+$/,'')==='explica '+normalize(t.label))
 if(exact.length)return exact
 const concepts=available.filter(t=>t.conceptBrief&&new RegExp(t.match).test(text))
 if(concepts.length)return concepts
 let topics=available.filter(t=>!t.conceptBrief&&(text.includes(normalize(t.label))||new RegExp(`\\b(?:${t.match})\\b`).test(text))&&(!t.excludeWhen||!new RegExp(t.excludeWhen).test(text)))
 if(topics.some(t=>['environment-mural','environment-campaign','environment-news','environment-laws'].includes(t.id)))topics=topics.filter(t=>t.id!=='environment-care')
 return topics
}
function purposeFor(text:string,topics:FhrTopic[]):FhrPurpose{
 const first=text.match(new RegExp(`\\b${action}\\b`))?.[0]??''
 if(/^registr/.test(first)&&/frecuencia|oportunidades/.test(text))return'OBSERVATION'
 if(/^verific|^comprueb/.test(first))return'VERIFICATION'
 if(/^compar|^contrast/.test(first))return'COMPARISON'
 if(/^compil/.test(first))return topics.some(t=>t.productType==='PORTFOLIO')?'PRODUCTION':'RESEARCH'
 if(/^investig|^indag|^recopil/.test(first))return'RESEARCH'
 if(/^debat|^argument/.test(first)||/^(?:realiz|organiz|prepar)/.test(first)&&/panel|mesa redonda|conversatorio|debate/.test(text))return'DEBATE'
 if(/^present|^expon|^socializ/.test(first))return'PRESENTATION'
 if(/^planific|^propon/.test(first)||/^(?:elabor|cre|constru|organiz|disen|formul)/.test(first)&&/\bplan\b/.test(text))return'PLAN'
 if(/^elabor|^cre|^constru|^redact|^compon|^disen|^formul/.test(first))return'PRODUCTION'
 if(/^realiz/.test(first)&&/\brealiz[a-z]*\s+(?:(?:un|una|el|la|unos|unas|los|las)\s+)?(?:mural(?:es)?|cartel(?:es)?|afiches?|brochures?)\b/.test(text))return'PRODUCTION'
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
  }else actions.push({text:clause,topics,purpose:purposeFor(clause,topics)})
 }
 if(!actions.length)return null
 const first=actions[0],purpose=first.purpose,activityType=purpose==='PRODUCTION'?(first.topics[0].productType??types[purpose]):types[purpose]
 return{grade:context.grade!,text,actions,activityType,technique:activityType==='PORTFOLIO'?'portafolio':purpose==='DEBATE'?'debate':purpose==='PRESENTATION'?'presentacion':purpose==='PERFORMANCE'&&/dramatiz|represent|escenific/.test(first.text)?'dramatizacion':purpose==='PERFORMANCE'||purpose==='OBSERVATION'?'observacion-sistematica':'analisis-producciones'}
}
function selectedComponents(text:string,choices:string[][]|undefined,fallback:string){
 const parts=choices?.flatMap(([pattern,label])=>{const match=new RegExp(`\\b(?:${pattern})\\b`).exec(text);return match?[{label,start:match.index,end:match.index+match[0].length}]:[]})??[]
 const span=parts.length>1?text.slice(Math.min(...parts.map(p=>p.start)),Math.max(...parts.map(p=>p.end))):''
 return parts.length>1&&/\bo\b/.test(span)?'la opción elegida entre '+parts.map(p=>p.label).join(' o '):parts.length?join(parts.map(p=>p.label)):fallback
}
function topicObject(topic:FhrTopic,text:string,purpose:FhrPurpose){
 const choice=selectedComponents(text,topic.choices,topic.choiceDefault??'los componentes expresamente elegidos'),product=selectedComponents(text,topic.productChoices,topic.productChoiceDefault??'el producto expresamente pedido')
 return{object:(topic.objects?.[purpose]??topic.object).replaceAll('{choice}',choice).replaceAll('{product}',product),choice}
}
function requestedEvidence(topic:FhrTopic,purpose:FhrPurpose,text:string):ContextualTopicCriterion{
 const selected=topicObject(topic,text,purpose),choice=selected.choice,object=purpose==='PLAN'&&/panel/.test(text)&&!selected.object.includes('panel')?'el panel sobre '+selected.object:selected.object,reference=topic.relation.replaceAll('{choice}',choice)
 const first=text.match(new RegExp(`\\b${action}\\b`))?.[0]??'',analysisVerb=/^clasific/.test(first)?'Clasifica':/^identific/.test(first)?'Identifica':/^interpret/.test(first)?'Interpreta':/^analiz/.test(first)?'Analiza':/^describ/.test(first)?'Describe':/^relat/.test(first)?'Relata':/^narr/.test(first)?'Narra':/^reflexion/.test(first)?'Reflexiona':'Explica'
 const forum=/mesa redonda/.test(text)?'Realiza la mesa redonda':/panel/.test(text)?'Realiza el panel':/conversatorio/.test(text)?'Realiza el conversatorio':/^argument/.test(first)?'Argumenta':'Debate'
 const performanceVerb=/^represent/.test(first)?'Representa':/^dramatiz/.test(first)?'Dramatiza':/^escenific/.test(first)?'Escenifica':'Realiza'
 const success:Record<FhrPurpose,string>={
  ANALYSIS:`${analysisVerb}${analysisVerb==='Reflexiona'?' sobre':''} ${object} sustentando sus relaciones mediante ${reference}.`,
  COMPARISON:`Compara ${object} sustentando semejanzas y diferencias mediante ${reference}.`,
  RESEARCH:`${/^compil/.test(first)?'Compila':/^recopil/.test(first)?'Recopila':/^indag/.test(first)?'Indaga':'Investiga'} ${object} relacionando ${reference} con las fuentes proporcionadas.`,
  DEBATE:`${forum} sobre ${object} sustentando y contrastando argumentos mediante ${reference}.`,
  PRESENTATION:`Presenta ${object} relacionando ${reference} con las evidencias proporcionadas.`,
  PRODUCTION:topic.id==='community-values'?`Construye ${/^(?:la|el|los|las) /.test(choice)?choice:'el '+choice} sobre ${object} relacionando ${reference} con sus evidencias.`:`${/^compil/.test(first)?'Compila':'Elabora'} ${object} relacionando ${reference} con las evidencias proporcionadas.`,
  // El catálogo anterior conserva su redacción; las nuevas referencias no añaden alternativas no pedidas.
  PLAN:topic.planReferenceOnly&&!/\balternativas?\b/.test(text)?`Planifica una propuesta sobre ${object} relacionando ${reference}, sin exigir ejecución.`:`Planifica una propuesta sobre ${object} relacionando ${reference} con las alternativas proporcionadas, sin exigir ejecución.`,
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
