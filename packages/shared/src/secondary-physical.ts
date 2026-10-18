import type {InstrumentAcademicContext} from './secondary-science'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'
import type {InstrumentRecommendation,InstrumentType} from './instrument-recommendation'
import {withoutResources} from './evaluation-task-text'
import {physicalGradeOneTopics} from './secondary-physical-grade-1'
import {physicalGradeTwoTopics} from './secondary-physical-grade-2'

type PhysicalPurpose='ANALYSIS'|'COMPARISON'|'RESEARCH'|'REPORT'|'PLAN'|'PERFORMANCE'|'PRODUCTION'|'PROBLEM_SOLVING'|'OBSERVATION'|'VERIFICATION'|'DEBATE'|'PRESENTATION'
type PhysicalEvidence={id?:string;title:string;success:string;sufficient:string;partial:string;error:string;absent?:string}
export type PhysicalTopic={id:string;grade:number;label:string;match:string;excludeWhen?:string;relation:string;pdfPages:number[];sourceRecordIds:string[];primaryPurpose:PhysicalPurpose;evidence:(PhysicalEvidence&{id:string;plan?:PhysicalEvidence;variants?:Partial<Record<PhysicalPurpose,PhysicalEvidence>>})[]}
type PhysicalAction={text:string;topics:PhysicalTopic[];purpose:PhysicalPurpose}
export type CommonPhysicalTask={grade:number;text:string;actions:PhysicalAction[];activityType:string;technique:string}
export const commonPhysicalModules=[{id:'educacion-fisica-comun-1',grade:1,topics:physicalGradeOneTopics,policy:'REQUESTED_ADAPTED_MOTOR_EVIDENCE_V1'},{id:'educacion-fisica-comun-2',grade:2,topics:physicalGradeTwoTopics,policy:'REQUESTED_ADAPTED_MOTOR_EVIDENCE_V1'}]

const normalize=(value:string)=>value.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase()
const action='(?:analiz|compar|contrast|explic|identific|interpret|verific|comprueb|registr|organiz|recopil|investig|indag|debat|expon|present|resuelv|ejecut|realiz|recorr|juega|combin|represent|improvis|particip|facilit|cre|constru|instal|filde|corre|elabor|disen|planific|propon|observ|ubic|relacion|justific|sustent)[a-z]*'
function requestedText(value:string){
 return normalize(withoutResources(value.replace(/<\/(?:p|li|div)>|<br\s*\/?\s*>/gi,'. ').replace(/<[^>]*>/g,' ').replace(/&nbsp;|&#160;/g,' ')))
  .replace(new RegExp(`\\b(?:no(?!\\s+convencional(?:es)?\\b)|sin)\\b[^.;\\n]*?(?=[.;\\n]|\\s+(?:pero|y)\\s+(?:${action})\\b|$)`,'g'),'').trim()
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
 if((has('compass-orientation')||has('gps-orientation'))&&!/fuerza|velocidad|flexibilidad|resistencia|coordinacion|equilibrio/.test(text))topics=topics.filter(t=>t.id!=='physical-condition-explanation')
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
 if(/^ejecut|^realiz|^recorr|^juega|^filde|^corre|^combin|^represent|^improvis|^particip|^facilit/.test(first))return 'PERFORMANCE'
 if(/^cre|^constru|^instal/.test(first))return 'PRODUCTION'
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
 const options: [string,string,string][]=topic.id==='warmup-observation'?chosen([['general','general',topic.grade===2?'las acciones de preparación general ya indicadas':'las acciones de calentamiento general ya indicadas'],['especific[oa]','specific',topic.grade===2?'las acciones de preparación específica ya indicadas':'las acciones de calentamiento específico ya indicadas']]):topic.id==='tactical-cooperation'?chosen([['propuest|soluciones','proposals','propuestas vinculadas con la solución técnica acordada'],['acuerdos','agreements','los acuerdos técnicos concretos de la tarea colectiva']]):chosen([['materiales','materials','las acciones acordadas de cuidado de materiales'],['espacio','space','las acciones acordadas de cuidado del espacio']])
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
 if(topic.grade===2&&topic.id==='motor-variation'){
  const motions=select([['saltos?','saltos'],['giros?','giros'],['desplazamientos?','desplazamientos']]),changes=select([['direccion','dirección'],['sentido','sentido'],['velocidad','velocidad'],['centro de gravedad','centro de gravedad']])
  evidence=evidence.map(e=>({...e,success:`Combina ${motions.length?join(motions):'los movimientos expresamente dados'} variando ${changes.length?join(changes):'las condiciones expresamente señaladas'} según las señales y apoyos de la tarea adaptada proporcionada.`,partial:'Presenta acciones pertinentes, pero una respuesta no corresponde a las señales o variaciones dadas.',absent:'No aporta evidencia de los movimientos y variaciones expresamente solicitados.'}))
 }
 if(topic.grade===2){
  const absent='No aporta evidencia del desempeño expresamente solicitado.'
  if(topic.id==='baseball-history'||topic.id==='baseball-rules'){
   const parts=select([['beisbol','béisbol'],['softbol','softbol']]),chosen=parts.length>1&&/\bo\b/.test(text)&&/elegid|seleccion/.test(text)?'la disciplina elegida de '+parts.join(' o '):parts.length?join(parts):'la disciplina expresamente elegida'
   if(parts.length===1)topic={...topic,label:(topic.id==='baseball-history'?'historia':'reglas')+' de '+parts[0],relation:topic.id==='baseball-history'?`la relación entre hechos, personajes, fechas y fuentes del ámbito histórico de ${parts[0]} asignado`:`las funciones y condiciones de las reglas de ${parts[0]} expresamente asignadas`}
   evidence=evidence.map(e=>({...e,absent,success:topic.id==='baseball-history'?`Presenta los hechos y personajes de ${chosen} expresamente asignados relacionando fechas y evidencias con las fuentes del ámbito proporcionado.`:`Verifica si las decisiones del caso de ${chosen} cumplen las reglas proporcionadas justificando cada marca con las evidencias del registro.`}))
  }
  if(topic.id==='baseball-fielding'){
   const parts=select([['rolling','rolling'],['flay|fly','flay']]),chosen=parts.length===1?'el batazo de '+parts[0]:parts.length?'los batazos de '+join(parts):'el batazo expresamente elegido'
   evidence=evidence.map(e=>({...e,absent,success:`Fildea ${chosen} de la tarea adaptada de béisbol según posición y condiciones supervisadas dadas, con los apoyos permitidos.`}))
  }
  if(topic.id==='baseball-pitcher'){
   const parts=select([['de frente','de frente'],['de lado','de lado']]),chosen=parts.length?join(parts):'en la posición expresamente elegida'
   evidence=evidence.map(e=>({...e,absent,success:`Ejecuta la mecánica adaptada de lanzador ${chosen} de béisbol según las fases, señales y condiciones supervisadas proporcionadas.`}))
  }
  if(topic.id==='chess-pawn-structure'){
   const parts=select([['aislados','aislados'],['doblados','doblados'],['retrasados','retrasados'],['pasados','pasados']]),chosen=parts.length?join(parts):'expresamente seleccionados'
   evidence=evidence.map(e=>({...e,absent,success:`Analiza los peones ${chosen} de la posición proporcionada relacionando su estructura con las decisiones del referente de ajedrez.`}))
  }
  if(topic.id==='baseball-positions'){
   const parts=select([['infielders?','infielder'],['outfielders?','outfielder']]),chosen=parts.length===1?'la posición '+parts[0]:parts.length?'las posiciones '+join(parts):'las posiciones expresamente elegidas'
   evidence=evidence.map(e=>({...e,absent,success:`Analiza ${chosen} del referente de béisbol relacionando ubicación y función defensiva con las evidencias proporcionadas.`}))
  }
  if(topic.id==='diet-rest-case'){
   const parts=select([['alimentacion|dieta','alimentación'],['descanso','descanso']]),chosen=parts.length>1?'la relación entre '+join(parts):parts[0]==='descanso'?'el descanso':parts[0]==='alimentación'?'la alimentación':'los aspectos expresamente solicitados'
   evidence=evidence.map(e=>({...e,absent,title:parts.length===1?`${parts[0]==='descanso'?'Descanso':'Alimentación'} y condiciones del caso`:e.title,success:`Analiza ${chosen} del caso ficticio sustentándolo en las acciones, condiciones y fichas proporcionadas, sin recomendar hábitos personales.`,sufficient:'La relación del aspecto solicitado se sustenta; una referencia secundaria a las condiciones queda poco precisada.',partial:'Identifica datos pertinentes del aspecto solicitado, pero una relación no se sustenta en las acciones y condiciones documentadas.',error:'Atribuye al caso relaciones incompatibles con los datos proporcionados o solicita información privada.'}))
  }
  if(topic.id==='shelter-assembly'){
   const parts=select([['casas? de campana','casa de campaña'],['refugios?','refugio']]),chosen=parts.length===1?'el modelo de '+parts[0]:parts.length?'los modelos de '+join(parts):'el modelo expresamente elegido',verb=/constru/.test(text)&&/instal/.test(text)?'Construye e instala':/instal/.test(text)?'Instala':'Construye'
   evidence=evidence.map(e=>({...e,absent,success:`${verb} ${chosen} siguiendo el esquema, recursos y condiciones de la simulación supervisada proporcionada.`}))
  }
  if(topic.id==='athletic-walk-run'){
   const parts=select([['caminata','caminata'],['carrera','carrera']]),chosen=parts.length>1&&/\bo\b/.test(text)&&/elegid|seleccion/.test(text)?'la prueba elegida de '+parts.join(' o '):parts.length===1?'la '+parts[0]:parts.length?'las pruebas de '+join(parts):'la prueba expresamente elegida'
   if(parts.length===1)topic={...topic,label:parts[0]+' atlética adaptada',relation:`la relación entre la ${parts[0]} atlética, sus señales y las condiciones adaptadas proporcionadas`}
   evidence=evidence.map(e=>({...e,absent,success:`Ejecuta ${chosen} de la tarea atlética adaptada siguiendo las señales y condiciones supervisadas dadas con los apoyos permitidos, sin comparar rapidez personal.`}))
  }
 }
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
  if(topic.grade===2&&parts.length){
   const names=parts.map(p=>p==='alimentaria'?'información alimentaria':'hidratación')
   topic={...topic,label:names.length===1?names[0]+' del caso':topic.label,relation:names.length===1?`la relación entre la ${names[0]} del caso y las evidencias de la ficha proporcionada`:'la relación entre la información alimentaria y la hidratación del caso'}
  }
 }
 if(topic.id==='physical-condition-explanation'){
  const parts=select([['fuerza rapida','fuerza rápida'],['velocidad de reaccion','velocidad de reacción'],['traslacion','traslación'],['gestual','velocidad gestual'],['flexibilidad','flexibilidad'],['resistencia aerobica','resistencia aeróbica'],['coordinacion','coordinación'],['equilibrio','equilibrio'],['orientacion','orientación']]),contrast=/diferenci|compar|contrast/.test(text)
  const target=parts.length?join(parts):'las capacidades físicas expresamente asignadas'
  evidence=evidence.map(e=>({...e,success:`Explica ${contrast?'las diferencias entre':'la función de'} ${target} mediante evidencias de los ejemplos adaptados proporcionados, sin clasificar cuerpos o personas.`,...(!contrast?{sufficient:'La función de la capacidad se sustenta; una relación secundaria con el ejemplo queda poco precisada.',partial:'Reconoce la capacidad pertinente, pero su función no se vincula con la acción del ejemplo dado.'}:{})}))
 }
 if(topic.id==='expressive-situation'&&!/fictici/.test(text))evidence=evidence.map(e=>({...e,success:e.success.replace('circunstancia ficticia','circunstancia')}))
 if(topic.grade===2&&!/fictici|simulad|simulacion/.test(text)){
  // El contexto real o simulado lo determina la consigna, también en referencias breves.
  const given=(value:string)=>value.replaceAll('ficticio','proporcionado').replaceAll('ficticia','proporcionada').replaceAll('simulado','proporcionado').replaceAll('simulada','proporcionada').replaceAll('simulación','actividad')
  topic={...topic,relation:given(topic.relation)}
  evidence=evidence.map(e=>({...e,success:given(e.success),sufficient:given(e.sufficient),partial:given(e.partial),error:given(e.error),...(e.absent?{absent:given(e.absent)}:{})}))
 }
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
