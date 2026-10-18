import type {InstrumentAcademicContext} from './secondary-science'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'
import type {InstrumentRecommendation,InstrumentType} from './instrument-recommendation'
import {withoutResources} from './evaluation-task-text'
import {physicalGradeOneTopics} from './secondary-physical-grade-1'

type PhysicalPurpose='ANALYSIS'|'COMPARISON'|'RESEARCH'|'REPORT'|'PLAN'|'PERFORMANCE'|'PRODUCTION'|'PROBLEM_SOLVING'|'OBSERVATION'|'VERIFICATION'|'DEBATE'|'PRESENTATION'
type PhysicalEvidence={id?:string;title:string;success:string;sufficient:string;partial:string;error:string;absent?:string}
export type PhysicalTopic={id:string;grade:number;label:string;match:string;excludeWhen?:string;relation:string;pdfPages:number[];sourceRecordIds:string[];primaryPurpose:PhysicalPurpose;evidence:(PhysicalEvidence&{id:string;plan?:PhysicalEvidence;variants?:Partial<Record<PhysicalPurpose,PhysicalEvidence>>})[]}
type PhysicalAction={text:string;topics:PhysicalTopic[];purpose:PhysicalPurpose}
export type CommonPhysicalTask={grade:number;text:string;actions:PhysicalAction[];activityType:string;technique:string}
export const commonPhysicalModules=[{id:'educacion-fisica-comun-1',grade:1,topics:physicalGradeOneTopics,policy:'REQUESTED_ADAPTED_MOTOR_EVIDENCE_V1'}]

const normalize=(value:string)=>value.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase()
const action='(?:analiz|compar|contrast|explic|identific|interpret|verific|comprueb|registr|organiz|recopil|investig|indag|debat|expon|present|resuelv|ejecut|realiz|recorr|juega|combin|represent|improvis|particip|facilit|cre|elabor|disen|planific|propon|observ|ubic|relacion|justific|sustent)[a-z]*'
function requestedText(value:string){
 return normalize(withoutResources(value.replace(/<\/(?:p|li|div)>|<br\s*\/?\s*>/gi,'. ').replace(/<[^>]*>/g,' ').replace(/&nbsp;|&#160;/g,' ')))
  .replace(new RegExp(`\\b(?:no|sin)\\b[^.;\\n]*?(?=[.;\\n]|\\s+(?:pero|y)\\s+(?:${action})\\b|$)`,'g'),'').trim()
}
function selectedTopics(text:string,available:PhysicalTopic[]){
 let topics=available.filter(t=>(text.includes(normalize(t.label))||new RegExp(`\\b(?:${t.match})\\b`).test(text))&&(!t.excludeWhen||!new RegExp(t.excludeWhen).test(text)))
 const has=(id:string)=>topics.some(t=>t.id===id)
 if(has('dance-elements'))topics=topics.filter(t=>t.id!=='movement-rhythm')
 if(has('expressive-situation'))topics=topics.filter(t=>t.id!=='movement-rhythm')
 if(has('adapted-variant'))topics=topics.filter(t=>!['handball-rules','basketball-rules'].includes(t.id))
 if(has('equilibrium-observation')&&!/fuerza|velocidad|flexibilidad|resistencia|coordinacion|orientacion/.test(text))topics=topics.filter(t=>t.id!=='physical-condition-explanation')
 if(has('flexibility-observation')&&!/fuerza|velocidad|resistencia|coordinacion|equilibrio|orientacion/.test(text))topics=topics.filter(t=>t.id!=='physical-condition-explanation')
 if(has('spatial-orientation')&&!/fuerza|velocidad|flexibilidad|resistencia|coordinacion|equilibrio/.test(text))topics=topics.filter(t=>t.id!=='physical-condition-explanation')
 if(has('game-facilitation'))topics=topics.filter(t=>t.id!=='game-performance')
 if(has('apparatus-reference-analysis'))topics=topics.filter(t=>t.id!=='gymnastics-sequence')
 if(has('chess-problem')||has('chess-game-analysis')||has('chess-notation'))topics=topics.filter(t=>t.id!=='chess-tactic-concept')
 return topics
}
function purposeFor(text:string,topics:PhysicalTopic[]):PhysicalPurpose{
 const first=text.match(new RegExp(`\\b${action}\\b`))?.[0]??''
 if(/^compar|^contrast/.test(first))return 'COMPARISON'
 if(/^analiz|^explic|^identific|^interpret|^observ|^ubic/.test(first))return 'ANALYSIS'
 if(/^registr/.test(first)&&/frecuencia|regularidad/.test(text))return 'OBSERVATION'
 if(/^verific|^comprueb/.test(first)||/^registr/.test(first)&&/cumplimiento/.test(text))return 'VERIFICATION'
 if(/^investig|^indag/.test(first))return 'RESEARCH'
 if(/^debat/.test(first))return 'DEBATE'
 if(/^expon|^present/.test(first))return 'PRESENTATION'
 if(/^resuelv/.test(first))return 'PROBLEM_SOLVING'
 if(/^planific|^propon/.test(first)||/^(?:cre[a-z]*|elabor[a-z]*|disen[a-z]*|organiz[a-z]*)\s+(?:un |el |una |la )?plan\b/.test(text)||/^organiz/.test(first)&&topics.some(t=>t.id==='circuit-plan'))return 'PLAN'
 if(/^registr|^organiz|^recopil/.test(first))return 'REPORT'
 if(/^ejecut|^realiz|^recorr|^juega|^combin|^represent|^improvis|^particip|^facilit/.test(first))return 'PERFORMANCE'
 if(/^cre/.test(first))return 'PRODUCTION'
 return topics[0]?.primaryPurpose??'ANALYSIS'
}
const activityTypes:Record<PhysicalPurpose,string>={ANALYSIS:'ANALYSIS',COMPARISON:'COMPARISON',RESEARCH:'RESEARCH',REPORT:'PORTFOLIO',PLAN:'PROJECT',PERFORMANCE:'MOTOR_SPORTS_PRACTICE',PRODUCTION:'MOTOR_SPORTS_PRACTICE',PROBLEM_SOLVING:'PROBLEM_SOLVING',OBSERVATION:'OBSERVATION',VERIFICATION:'ANALYSIS',DEBATE:'DEBATE',PRESENTATION:'EXPOSITION'}
export function resolveCommonPhysicalTask(title:string,description:string,context?:InstrumentAcademicContext|null,providedTopics?:PhysicalTopic[]):CommonPhysicalTask|null{
 if(context?.level!=='SECONDARY'||context.subjectCode.trim().toUpperCase()!=='EFI'||context.optativeExitName)return null
 const module=commonPhysicalModules.find(m=>m.grade===context.grade);if(!module)return null
 const text=requestedText(description||title);if(!new RegExp(`\\b${action}\\b`).test(text))return null
 const available=(providedTopics??module.topics).filter(t=>t.grade===context.grade)
 const clauses=text.split(new RegExp(`[.;\\n]+|\\s+(?:y|luego|despues)\\s+(?=${action}\\b)`)).map(s=>s.trim()).filter(Boolean)
 const actions:PhysicalAction[]=[]
 for(const clause of clauses){
  const own=selectedTopics(clause,available),previous=actions.at(-1)
  if(!own.length||previous&&own.every(t=>previous.topics.some(p=>p.id===t.id))&&/^(?:explica|relaciona|sustenta|justifica|registra)\b/.test(clause)){
   if(previous){previous.text+='. '+clause;previous.purpose=purposeFor(previous.text,previous.topics)}
   continue
  }
  actions.push({text:clause,topics:own,purpose:purposeFor(clause,own)})
 }
 if(!actions.length)return null
 const purpose=actions[0].purpose,technique=['PERFORMANCE','PRODUCTION','OBSERVATION'].includes(purpose)?'observacion-sistematica':purpose==='REPORT'?'portafolio':purpose==='DEBATE'?'debate':purpose==='PRESENTATION'?'presentacion':purpose==='PROBLEM_SOLVING'?'resolucion-problemas':'analisis-producciones'
 return{grade:context.grade!,text,actions,activityType:activityTypes[purpose],technique}
}
function criterion(topic:PhysicalTopic,purpose:PhysicalPurpose,e:PhysicalEvidence):ContextualTopicCriterion{
 return{templateId:`efi-${topic.grade}-${topic.id}-${purpose.toLowerCase()}-${e.id??'requested-evidence'}`,title:e.title,observable:e.success,weight:4,progressionLevels:[e.success,e.sufficient,e.partial,e.error,e.absent??`No aporta evidencia del desempeño solicitado sobre ${topic.label}.`]}
}
function observedEvidence(topic:PhysicalTopic,text:string):PhysicalEvidence[]{
 const chosen=(options:[string,string,string][])=>options.filter(([pattern])=>new RegExp(pattern).test(text))
 const options: [string,string,string][]=topic.id==='warmup-observation'?chosen([['general','general','las acciones de calentamiento general ya indicadas'],['especifico','specific','las acciones de calentamiento específico ya indicadas']]):topic.id==='tactical-cooperation'?chosen([['propuest|soluciones','proposals','propuestas vinculadas con la solución técnica acordada'],['acuerdos','agreements','los acuerdos técnicos concretos de la tarea colectiva']]):chosen([['materiales','materials','las acciones acordadas de cuidado de materiales'],['espacio','space','las acciones acordadas de cuidado del espacio']])
 return(options.length?options:[['','requested','las acciones expresamente acordadas']]).map(([,id,target])=>{
  const verb=id==='proposals'?'Aporta':'Cumple'
  return{id:'observed-'+id,title:id==='proposals'?'Frecuencia de propuestas pertinentes':`Frecuencia de ${target}`,success:`${verb} ${target} en todas las oportunidades observadas.`,sufficient:`${verb} ${target} en casi todas las oportunidades observadas.`,partial:`${verb} ${target} en algunas oportunidades observadas.`,error:`${verb} ${target} en pocas oportunidades observadas.`,absent:`No ${verb.toLowerCase()} ${target} en las oportunidades observadas; no equivale a ausencia de registro.`}
 })
}
function analysisEvidence(topic:PhysicalTopic):PhysicalEvidence{
 return{id:'analysis-relations',title:`Relaciones de ${topic.label}`,success:`Explica ${topic.relation} mediante evidencias o ejemplos pertinentes del contexto trabajado.`,sufficient:`Las relaciones principales de ${topic.label} se sustentan; una referencia secundaria queda poco precisada.`,partial:`Identifica elementos pertinentes de ${topic.label}, pero una relación no se sustenta en los ejemplos examinados.`,error:`Atribuye al referente relaciones incompatibles con las evidencias examinadas de ${topic.label}.`}
}
function contextualTopic(topic:PhysicalTopic,text:string):PhysicalTopic{
 const select=(options:[string,string][])=>options.filter(([pattern])=>new RegExp(`\\b(?:${pattern})\\b`).test(text)).map(([,label])=>label)
 const join=(parts:string[])=>parts.length<2?parts[0]:parts.slice(0,-1).join(', ')+' y '+parts.at(-1)
 let evidence=topic.evidence.map(e=>({...e}))
 if(topic.id==='dance-elements'){
  const parts=select([['marchas?','marchas'],['movimientos? de brazos','movimientos de brazos'],['giros?','giros'],['equilibrios?','equilibrios'],['saltos?','saltos'],['resortes?','resortes'],['ondas?','ondas'],['poses?','poses']])
  evidence=evidence.map(e=>({...e,success:`Ejecuta ${parts.length?join(parts):'los elementos de danza expresamente elegidos'} según el ritmo, dirección y apoyos acordados de la secuencia adaptada dada.`}))
 }
 if(['basketball-fundamentals','handball-fundamentals'].includes(topic.id)){
  const parts=select([['pases?','pases'],['recepciones?','recepciones'],['dribles?','dribles'],['tiros?','tiros'],['rebotes?','rebotes'],['bote','bote'],['lanzamientos?','lanzamientos'],['desplazamientos?','desplazamientos'],['bloqueos?','bloqueos'],['gestos tecnicos','gestos técnicos']])
  const chosen=parts.length>1&&/\bo\b/.test(text)&&/elegid|seleccion|alternativ/.test(text)?'la técnica elegida de '+parts.join(' o '):parts.length?join(parts):'los fundamentos expresamente elegidos'
  const sport=topic.id==='basketball-fundamentals'?'baloncesto':'balonmano'
  evidence=evidence.map(e=>({...e,success:`Ejecuta ${chosen} relacionando control, dirección y decisión con las señales y apoyos de la tarea adaptada de ${sport} dada.`}))
 }
 if(topic.id==='technique-comparison'){
  const techniques=select([['pases?','pases'],['dribles?','dribles'],['tiros?','tiros']]),dimensions=select([['direccion','dirección'],['recepcion','recepción'],['situacion de uso','situación de uso']])
  evidence=evidence.map(e=>({...e,success:`Compara los tipos de ${techniques.length?join(techniques):'la técnica expresamente elegida'} de los referentes proporcionados según ${dimensions.length?join(dimensions):'los rasgos expresamente asignados'}.`}))
 }
 if(topic.id==='given-nutrition-record'){
  const parts=select([['alimentaria|alimenticios','alimentaria'],['hidratacion','de hidratación']])
  evidence=evidence.map(e=>({...e,success:`Organiza la información ${parts.length?join(parts):'expresamente asignada'} relacionando las acciones del caso ficticio con las evidencias de la ficha proporcionada, sin recomendar ingesta personal ni pedir datos privados.`}))
 }
 if(topic.id==='physical-condition-explanation'){
  const parts=select([['fuerza rapida','fuerza rápida'],['velocidad de reaccion','velocidad de reacción'],['traslacion','traslación'],['gestual','velocidad gestual'],['flexibilidad','flexibilidad'],['resistencia aerobica','resistencia aeróbica'],['coordinacion','coordinación'],['equilibrio','equilibrio'],['orientacion','orientación']]),contrast=/diferenci|compar|contrast/.test(text)
  const target=parts.length?join(parts):'las capacidades físicas expresamente asignadas'
  evidence=evidence.map(e=>({...e,success:`Explica ${contrast?'las diferencias entre':'la función de'} ${target} mediante evidencias de los ejemplos adaptados proporcionados, sin clasificar cuerpos o personas.`,...(!contrast?{sufficient:'La función de la capacidad se sustenta; una relación secundaria con el ejemplo queda poco precisada.',partial:'Reconoce la capacidad pertinente, pero su función no se vincula con la acción del ejemplo dado.'}:{})}))
 }
 if(topic.id==='expressive-situation'&&!/fictici/.test(text))evidence=evidence.map(e=>({...e,success:e.success.replace('circunstancia ficticia','circunstancia')}))
 return{...topic,evidence}
}
export function commonPhysicalCriteria(task:CommonPhysicalTask):ContextualTopicCriterion[]{
 const rows=task.actions.flatMap(action=>action.topics.flatMap(originalTopic=>{
  const topic=contextualTopic(originalTopic,action.text)
  if(action.purpose==='OBSERVATION')return observedEvidence(topic,action.text).map(e=>criterion(topic,action.purpose,e))
  const brief=action.text.replace(/[.\s]+$/,'')===`explica ${normalize(topic.label)}`
  if(action.purpose==='ANALYSIS'&&(brief||topic.primaryPurpose!=='ANALYSIS'))return[criterion(topic,action.purpose,analysisEvidence(topic))]
  return topic.evidence.map(original=>{
   const override=original.variants?.[action.purpose]??(action.purpose==='PLAN'?original.plan:undefined)
   const chosen=override?{...original,...override}:original
   return criterion(topic,action.purpose,chosen)
  })
 }))
 return rows.filter((row,index)=>rows.findIndex(other=>other.templateId===row.templateId)===index)
}
export function commonPhysicalSelections(task:CommonPhysicalTask){
 const purpose=task.actions[0].purpose
 const suggestedInstrumentType:InstrumentType=/credito parcial|ponderada|pesos por|puntos por/.test(task.text)?'lista-ponderada':purpose==='OBSERVATION'?'escala':purpose==='VERIFICATION'?'lista-cotejo':'rubrica'
 return{suggestedInstrumentType,suggestedEvaluationTechnique:task.technique}
}
/** Same progression indexes and four-format contract as existing contextual providers. */
export function adaptPhysicalScale(proposal:InstrumentRecommendation,task:CommonPhysicalTask):InstrumentRecommendation{
 if(proposal.instrumentType!=='escala')return proposal
 const indexes=proposal.levels.length===4?[0,1,2,4]:[0,1,2,3,4],frequency=task.actions.every(a=>a.purpose==='OBSERVATION')
 const labels=frequency?['Siempre','Casi siempre','A veces','Casi nunca','Nunca']:['Completo','Suficiente','Parcial','Incipiente','Aún no logrado']
 return{...proposal,levels:proposal.levels.map((level,i)=>({...level,label:labels[indexes[i]]})),criteria:proposal.criteria.map(row=>({...row,descriptors:row.descriptors.map((descriptor,i)=>({...descriptor,text:row.progressionLevels?.[indexes[i]]??descriptor.text}))}))}
}
