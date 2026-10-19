import type {InstrumentAcademicContext} from './secondary-science'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'
import type {InstrumentRecommendation,InstrumentType} from './instrument-recommendation'
import {withoutResources} from './evaluation-task-text'
import {physicalGradeOneTopics} from './secondary-physical-grade-1'
import {physicalGradeTwoTopics} from './secondary-physical-grade-2'
import {physicalGradeThreeTopics} from './secondary-physical-grade-3'
import {physicalGradeFourTopics} from './secondary-physical-grade-4'
import {physicalGradeFiveTopics} from './secondary-physical-grade-5'
import {physicalGradeSixTopics} from './secondary-physical-grade-6'

type PhysicalPurpose='ANALYSIS'|'COMPARISON'|'RESEARCH'|'REPORT'|'PLAN'|'PERFORMANCE'|'PRODUCTION'|'PROBLEM_SOLVING'|'OBSERVATION'|'VERIFICATION'|'DEBATE'|'PRESENTATION'
type PhysicalEvidence={id?:string;title:string;success:string;sufficient:string;partial:string;error:string;absent?:string}
export type PhysicalTopic={id:string;grade:number;label:string;match:string;excludeWhen?:string;relation:string;pdfPages:number[];sourceRecordIds:string[];primaryPurpose:PhysicalPurpose;evidence:(PhysicalEvidence&{id:string;plan?:PhysicalEvidence;variants?:Partial<Record<PhysicalPurpose,PhysicalEvidence>>})[]}
type PhysicalAction={text:string;topics:PhysicalTopic[];purpose:PhysicalPurpose}
export type CommonPhysicalTask={grade:number;text:string;actions:PhysicalAction[];activityType:string;technique:string}
export const commonPhysicalModules=[{id:'educacion-fisica-comun-1',grade:1,topics:physicalGradeOneTopics,policy:'REQUESTED_ADAPTED_MOTOR_EVIDENCE_V1'},{id:'educacion-fisica-comun-2',grade:2,topics:physicalGradeTwoTopics,policy:'REQUESTED_ADAPTED_MOTOR_EVIDENCE_V1'},{id:'educacion-fisica-comun-3',grade:3,topics:physicalGradeThreeTopics,policy:'REQUESTED_ADAPTED_MOTOR_EVIDENCE_V1'},{id:'educacion-fisica-comun-4',grade:4,topics:physicalGradeFourTopics,policy:'REQUESTED_ADAPTED_MOTOR_EVIDENCE_V1'},{id:'educacion-fisica-comun-5',grade:5,topics:physicalGradeFiveTopics,policy:'REQUESTED_ADAPTED_MOTOR_EVIDENCE_V1'},{id:'educacion-fisica-comun-6',grade:6,topics:physicalGradeSixTopics,policy:'REQUESTED_ADAPTED_MOTOR_EVIDENCE_V1'}]

const normalize=(value:string)=>value.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase()
const action='(?:(?:analiz|compar|contrast|explic|identific|interpret|verific|comprueb|registr|organiz|recopil|investig|indag|debat|expon|present|resuelv|ejecut|realiz|recorr|juega|combin|represent|improvis|particip|facilit|cre|constru|instal|filde|corre|elabor|disen|planific|propon|observ|ubic|relacion|justific|sustent)[a-z]*|clasifica|clasifiquen|selecciona|seleccionen|reproduce|reproduzcan|conduce|conduzcan|recepciona|recepcionen|valora|valoren)'
function requestedText(value:string,preservePossession=false){
 return normalize(withoutResources(value.replace(/<\/(?:p|li|div)>|<br\s*\/?\s*>/gi,'. ').replace(/<[^>]*>/g,' ').replace(/&nbsp;|&#160;/g,' ')))
  .replace(new RegExp(`\\b(?:no(?!\\s+convencional(?:es)?\\b)|sin${preservePossession?'(?!\\s+posesion\\b)':''})\\b[^.;\\n]*?(?=[.;\\n]|\\s+(?:pero|y)\\s+(?:${action})\\b|$)`,'g'),'').trim()
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
 if(['orientation-race','orientation-rules','orientation-history'].some(has)&&!/fuerza|velocidad|flexibilidad|resistencia|coordinacion|equilibrio/.test(text))topics=topics.filter(t=>t.id!=='physical-condition-explanation')
 for(const family of ['volleyball','football'])if(topics.some(t=>[3,6].includes(t.grade)&&t.id.startsWith(family+'-')&&t.id!==family+'-rules')&&!/^(?:explica|interpreta|analiza)\s+(?:las\s+)?reglas|^(?:verifica|comprueba|registra)\b/.test(text))topics=topics.filter(t=>t.id!==family+'-rules')
 if(has('game-facilitation'))topics=topics.filter(t=>t.id!=='game-performance')
 if(has('apparatus-reference-analysis'))topics=topics.filter(t=>t.id!=='gymnastics-sequence')
 if(has('chess-problem')||has('chess-game-analysis')||has('chess-notation'))topics=topics.filter(t=>t.id!=='chess-tactic-concept')
 if(topics.some(t=>t.grade===4)){
  if(has('postural-expression'))topics=topics.filter(t=>t.id!=='postural-execution')
  if(has('gymnastics-sequence'))topics=topics.filter(t=>t.id!=='movement-rhythm')
  if(has('movement-rhythm'))topics=topics.filter(t=>t.id!=='physical-condition-explanation')
  if(has('basketball-adapted-rules')||has('basketball-three-on-three'))topics=topics.filter(t=>t.id!=='basketball-rules')
  if(has('basketball-game'))topics=topics.filter(t=>t.id!=='basketball-three-on-three')
  for(const family of ['basketball','handball'])if(topics.some(t=>t.id.startsWith(family+'-')&&t.id!==family+'-rules')&&!/^(?:explica|interpreta|analiza)\s+(?:las\s+)?reglas|^(?:verifica|comprueba|registra)\b/.test(text))topics=topics.filter(t=>t.id!==family+'-rules')
 }
 if(topics.some(t=>t.grade===5)){
  if(has('shelter-plan'))topics=topics.filter(t=>t.id!=='shelter-assembly')
  if(has('baseball-fielding')||has('baseball-double-play')||has('baseball-pitcher'))topics=topics.filter(t=>t.id!=='baseball-throwing')
  if(has('baseball-offensive-reference'))topics=topics.filter(t=>t.id!=='baseball-batting')
  if(has('baseball-five-rules'))topics=topics.filter(t=>t.id!=='baseball-rules')
  if(has('baseball-game')||has('baseball-tactics'))topics=topics.filter(t=>!['baseball-rules','baseball-five-rules'].includes(t.id))
 }
 if(topics.some(t=>t.grade===6)){
  if(has('physical-image-reference'))topics=topics.filter(t=>t.id!=='wellbeing-reference')
  if(has('chess-pawn-openings')||has('chess-pawn-game'))topics=topics.filter(t=>t.id!=='chess-pawn-structure')
  if(has('orientation-race')&&/^(?:recorre|realiza|ejecuta)\b/.test(text))topics=topics.filter(t=>!['orientation-map','orientation-signs'].includes(t.id))
 }
 return topics
}
function purposeFor(text:string,topics:PhysicalTopic[]):PhysicalPurpose{
 const first=text.match(new RegExp(`\\b${action}\\b`))?.[0]??''
 if(/^compar|^contrast/.test(first))return 'COMPARISON'
 if(/^analiz|^explic|^identific|^clasific|^seleccion|^interpret|^observ|^ubic/.test(first))return 'ANALYSIS'
 if(/^registr/.test(first)&&/frecuencia|regularidad/.test(text))return 'OBSERVATION'
 if(/^verific|^comprueb/.test(first)||/^registr/.test(first)&&/cumplimiento/.test(text))return 'VERIFICATION'
 if(/^investig|^indag/.test(first))return 'RESEARCH'
 if(/^debat/.test(first))return 'DEBATE'
 if(/^expon|^present/.test(first))return 'PRESENTATION'
 if(/^resuelv/.test(first))return 'PROBLEM_SOLVING'
 if(/^planific|^propon/.test(first)||/^(?:cre[a-z]*|elabor[a-z]*|disen[a-z]*|organiz[a-z]*)\s+(?:un |el |una |la )?plan\b/.test(text)||/^organiz/.test(first)&&topics.some(t=>t.id==='circuit-plan'))return 'PLAN'
 if(/^registr|^organiz|^recopil/.test(first))return 'REPORT'
 if(/^ejecut|^realiz|^reproduc|^conduc|^recepcion|^recorr|^juega|^filde|^corre|^combin|^represent|^improvis|^particip|^facilit/.test(first))return 'PERFORMANCE'
 if(/^cre|^constru|^instal/.test(first))return 'PRODUCTION'
 return topics[0]?.primaryPurpose??'ANALYSIS'
}
const activityTypes:Record<PhysicalPurpose,string>={ANALYSIS:'ANALYSIS',COMPARISON:'COMPARISON',RESEARCH:'RESEARCH',REPORT:'PORTFOLIO',PLAN:'PROJECT',PERFORMANCE:'MOTOR_SPORTS_PRACTICE',PRODUCTION:'MOTOR_SPORTS_PRACTICE',PROBLEM_SOLVING:'PROBLEM_SOLVING',OBSERVATION:'OBSERVATION',VERIFICATION:'ANALYSIS',DEBATE:'DEBATE',PRESENTATION:'EXPOSITION'}
export function resolveCommonPhysicalTask(title:string,description:string,context?:InstrumentAcademicContext|null,providedTopics?:PhysicalTopic[]):CommonPhysicalTask|null{
 if(context?.level!=='SECONDARY'||context.subjectCode.trim().toUpperCase()!=='EFI'||context.optativeExitName)return null
 const module=commonPhysicalModules.find(m=>m.grade===context.grade);if(!module)return null
 const text=requestedText(description||title,context.grade===6);if(!new RegExp(`\\b${action}\\b`).test(text))return null
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
 const purpose=actions[0].purpose,tacticalScheme=purpose==='PRODUCTION'&&actions[0].topics.some(t=>t.grade===3&&t.id==='chess-scheme'||t.grade===6&&t.id==='orientation-map'),technique=tacticalScheme?'analisis-producciones':['PERFORMANCE','PRODUCTION','OBSERVATION'].includes(purpose)?'observacion-sistematica':purpose==='REPORT'?'portafolio':purpose==='DEBATE'?'debate':purpose==='PRESENTATION'?'presentacion':purpose==='PROBLEM_SOLVING'?'resolucion-problemas':'analisis-producciones'
 return{grade:context.grade!,text,actions,activityType:tacticalScheme?'PROJECT':activityTypes[purpose],technique}
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
 if([5,6].includes(topic.grade)){
  evidence=evidence.map(e=>({...e,absent:'No aporta evidencia del desempeño expresamente solicitado.'}))
  const choice=(parts:string[])=>parts.length>1&&/\bo\b/.test(text)?'la opción elegida entre '+parts.join(' o '):parts.length?join(parts):'la opción expresamente elegida'
  const update=(success:string,relation?:string)=>{evidence=evidence.map(e=>({...e,success}));if(relation)topic={...topic,relation}}
  if(topic.id==='compass-orientation'&&/no convencional/.test(text))evidence=evidence.map(e=>({...e,variants:{...e.variants,PERFORMANCE:{...e,...e.variants?.PERFORMANCE,success:'Realiza la orientación con la brújula no convencional del trayecto adaptado siguiendo los puntos cardinales y referencias proporcionadas con los apoyos permitidos.'}}}))
  if(topic.id==='flexibility-observation')update(`Verifica el cumplimiento de las acciones de flexibilidad ${choice(select([['activa','activa'],['pasiva','pasiva']]))} adaptadas contrastando el registro con la ficha docente proporcionada, sin medir amplitud corporal ni añadir maniobras.`)
  if(topic.id==='equilibrium-observation'){
   const parts=select([['base de sustentacion','base de sustentación'],['apoyos','apoyos'],['altura','altura'],['planos?','plano'],['niveles','niveles'],['estatico','equilibrio estático'],['dinamico','equilibrio dinámico']]),target=parts.length?join(parts):'las condiciones expresamente dadas'
   update(`Analiza el equilibrio del referente adaptado relacionando ${target} con las evidencias de la ficha proporcionada, sin exigir ejecución.`,`la relación entre ${target} y el equilibrio del referente adaptado proporcionado`)
  }
  if(topic.id==='shelter-plan'||topic.id==='shelter-assembly'){
   const target=choice(select([['casas? de campana','casa de campaña'],['refugios?','refugio']]))
   topic={...topic,label:'modelo de '+target,relation:`la relación entre el modelo de ${target}, sus recursos y condiciones dados`}
   update(topic.id==='shelter-plan'?`Planifica el modelo de ${target} relacionando esquema, recursos y condiciones supervisadas proporcionadas, sin exigir construcción.`:`${/constru/.test(text)&&/instal/.test(text)?'Construye e instala':/instal/.test(text)?'Instala':'Construye'} el modelo de ${target} siguiendo el esquema, recursos y condiciones supervisadas proporcionadas.`)
  }
  if(topic.id==='camping-knots'){
   const parts=select([['vuelta de cota simple','vuelta de cota simple'],['cabestrillo','cabestrillo']]),target=parts.length?'el nudo '+choice(parts):'los nudos y amarres expresamente dados',relation=`la relación entre ${target} y las condiciones de la ficha de cabuyería proporcionada`
   topic={...topic,label:target.replace(/^(?:el|los) /,''),relation};update(`Elabora ${target} en el modelo de cabuyería según la ficha y condiciones supervisadas dadas, sin personas ni cargas y sin inventar instrucciones.`)
  }
  if(topic.id==='athletic-high-jump'||topic.id==='athletic-long-jump'){
   const parts=select([['tijera','tijera'],['natural','natural'],['colgante','colgante']]),target=parts.length?'modalidad '+choice(parts):'de la modalidad expresamente dada',high=topic.id==='athletic-high-jump',name=high?'salto alto':'salto largo'
   topic={...topic,label:name+' '+target,relation:`la relación entre las fases del ${name} ${target} y las evidencias del referente adaptado proporcionado`}
   update(high?`Ejecuta el salto alto ${target} adaptado según las señales y condiciones supervisadas proporcionadas con los apoyos permitidos, sin fijar alturas.`:`Analiza el salto largo ${target} relacionando fases y apoyos con las evidencias del referente adaptado proporcionado, sin exigir ejecución.`)
  }
  if(topic.id==='athletic-walk-run'){
   const target=choice(select([['caminata','caminata'],['carrera','carrera']]))
   topic={...topic,label:target+' atlética adaptada',relation:`la relación entre ${target}, sus señales y las condiciones adaptadas proporcionadas`}
   update(`Ejecuta ${/^(?:caminata|carrera)$/.test(target)?'la '+target:target} de la tarea atlética adaptada siguiendo las señales y condiciones supervisadas dadas con los apoyos permitidos, sin comparar rapidez personal.`)
  }
  if(['baseball-history','baseball-rules','baseball-biography','baseball-game'].includes(topic.id)){
   const sport=choice(select([['beisbol(?: convencional)?(?!\\s*5)','béisbol'],['beisbol\\s*5','béisbol 5'],['softbol','softbol']])),scope=/comunidad/.test(text)?'de la comunidad asignada':/local/.test(text)?'del ámbito local asignado':'del ámbito expresamente asignado'
   const label=topic.id==='baseball-history'?'historia de '+sport:topic.id==='baseball-biography'?'aportes biográficos de atletas de '+sport:topic.id==='baseball-rules'?'reglas de '+sport:'juego adaptado de '+sport
   topic={...topic,label,relation:`la relación entre las evidencias de ${label} ${scope} y las referencias proporcionadas`}
   if(topic.id==='baseball-history'){
    const success=`Investiga la historia de los clubes y equipos de ${sport} ${scope} relacionando hechos y aportes con las evidencias de las fuentes proporcionadas.`
    evidence=evidence.map(e=>({...e,success:`Presenta los hechos históricos de ${sport} ${scope} relacionando personajes, fechas y evidencias de las fuentes proporcionadas.`,variants:{...e.variants,RESEARCH:{...e,...e.variants?.RESEARCH,success}}}))
   }else update(topic.id==='baseball-rules'?`Verifica si las decisiones del caso de ${sport} cumplen las reglas proporcionadas justificando cada marca con las evidencias del registro.`:topic.id==='baseball-biography'?`Presenta los aportes biográficos de atletas dominicanos de ${sport} ${scope} relacionándolos con las evidencias de las fuentes proporcionadas.`:`Juega la situación adaptada de ${sport} aplicando las reglas y decisiones ofensivas y defensivas proporcionadas con los apoyos acordados, sin evaluar ganar.`)
  }
  if(topic.id==='baseball-five-rules')update('Compara las reglas del béisbol convencional y béisbol 5 relacionando semejanzas y diferencias con las decisiones de la situación proporcionada.')
  if(topic.id==='baseball-fielding'){
   const target=choice(select([['rolling','rolling'],['fly|flay','fly']])),throwing=/tiro/.test(text)?' con tiro a la base expresamente dada':''
   topic={...topic,label:'fildeo de '+target,relation:`la relación entre el fildeo de ${target}${throwing} y las señales de la tarea adaptada proporcionada`}
   update(`Fildea ${target}${throwing} de la tarea adaptada de béisbol según las señales, posición y condiciones supervisadas proporcionadas con los apoyos permitidos.`)
  }
  if(topic.id==='baseball-throwing'){
   const target=choice(select([['corta distancia','corta distancia'],['larga distancia','larga distancia']]))
   update(`Ejecuta el tiro a ${target} de béisbol hacia la referencia señalada según las condiciones supervisadas proporcionadas, sin fijar distancias nuevas.`)
  }
  if(topic.id==='base-running')update('Corre las bases de béisbol de la situación adaptada dada siguiendo las señales y decisiones expresamente proporcionadas con los apoyos permitidos.','la relación entre las decisiones del corrido de bases y las señales y condiciones expresamente proporcionadas')
  if(topic.id==='baseball-offensive-reference'){
   const target=choice(select([['agarre del bate','el agarre del bate'],['caja de bateo','la colocación en la caja de bateo'],['zona de strikes','la zona de strikes']]))
   update(`Analiza ${target} del referente de béisbol relacionándolo con las señales y evidencias proporcionadas, sin exigir ejecución.`)
  }
  if(topic.id==='baseball-tactics'){
   const target=choice(select([['ofensiva','ofensiva'],['defensiva','defensiva']])),sport=/beisbol\s*5/.test(text)?'béisbol 5':'béisbol',references=/reglas|reglamento/.test(text)?'posiciones, alternativas y reglamento proporcionados':'posiciones y alternativas proporcionadas'
   update(`Resuelve la situación ${target} de ${sport} del caso dado justificando la decisión según ${references}.`)
  }
  if(topic.id==='chess-ending-problem'){
   const parts=select([['rey y peon contra rey','rey y peón contra rey'],['dama contra peon','dama contra peón']]),target=parts.length?'de '+choice(parts):'expresamente elegido'
   topic={...topic,relation:`la relación entre las piezas del final ${target} y las jugadas justificadas de la posición dada`};update(`Resuelve el problema del final de ajedrez ${target} justificando las jugadas con la posición y reglas proporcionadas.`)
  }
  if(topic.id==='martial-history')update(`Presenta los hechos históricos de las artes marciales ${/adaptadas/.test(text)?'adaptadas ':''}${/local/.test(text)?'del ámbito local asignado':'del ámbito expresamente asignado'} relacionando fechas, personajes y evidencias de las fuentes proporcionadas.`)
  if(topic.id==='martial-kata'){
   const target=choice(select([['kata','kata'],['poomsae','poomsae']]))
   topic={...topic,label:target+' básica adaptada',relation:`la relación entre posiciones, secuencia y apoyos de ${target} y el referente dado`};update(`Ejecuta la secuencia básica adaptada de ${target} según las posiciones y condiciones supervisadas proporcionadas con los apoyos permitidos, sin añadir maniobras.`)
  }
  if(topic.id==='martial-fundamentals'){
   const target=choice(select([['posiciones','posiciones'],['desplazamientos','desplazamientos'],['bloqueos','bloqueos'],['patadas','patadas'],['puno','puño'],['agarres','agarres'],['proyecciones','proyecciones'],['caidas','caídas'],['defensas','defensas'],['combates','combates']]))
   update(`Ejecuta ${target} adaptados de artes marciales según las señales y condiciones supervisadas proporcionadas con los apoyos permitidos, sin añadir maniobras.`)
  }
 }
 if(topic.grade===4){
  evidence=evidence.map(e=>({...e,absent:'No aporta evidencia del desempeño expresamente solicitado.'}))
  const choice=(parts:string[])=>parts.length>1&&/\bo\b/.test(text)&&/elegid|seleccion/.test(text)?'la opción elegida entre '+parts.join(' o '):parts.length?join(parts):'la opción expresamente elegida'
  const replaceSuccess=(success:string)=>{evidence=evidence.map(e=>({...e,success}))}
  if(topic.id==='warmup-observation'){
   const hasGeneral=/general/.test(text),hasSpecific=/especific[oa]/.test(text)
   if(hasGeneral!==hasSpecific)evidence=evidence.filter(e=>e.id===(hasGeneral?'general':'specific'))
  }
  if(topic.id==='flexibility-observation'){
   const parts=select([['activa','activa'],['pasiva','pasiva']])
   if(parts.length)replaceSuccess(`Verifica el cumplimiento de las acciones de flexibilidad ${join(parts)} adaptadas contrastando el registro con la ficha docente proporcionada, sin medir amplitud corporal ni añadir maniobras.`)
  }
  if(topic.id==='equilibrium-observation'){
   const parts=select([['base de sustentacion','base de sustentación'],['apoyos','apoyos'],['altura','altura'],['planos?','plano'],['niveles','niveles']]),selected=parts.length?join(parts):'las condiciones expresamente dadas'
   replaceSuccess(`Analiza el equilibrio del referente adaptado relacionando ${selected} con las evidencias de la ficha proporcionada, sin exigir ejecutar la maniobra.`)
  }
  if(topic.id==='postural-expression'){
   const parts=select([['abiertas','abiertas'],['cerradas','cerradas'],['atras','hacia atrás'],['delante','hacia delante']]),selected=parts.length>1&&/\bo\b/.test(text)&&/elegid|seleccion/.test(text)?'la opción elegida entre posturas '+parts.join(' o '):'las posturas '+(parts.length?join(parts):'expresamente elegidas')
   topic={...topic,relation:`la relación entre las señales de ${selected} y la intención representada en el referente dado`}
   replaceSuccess(`Interpreta la expresión corporal de ${selected} relacionando sus señales observables con la intención representada en el referente proporcionado.`)
  }
  if(topic.id==='gymnastics-modalities'||topic.id==='gymnastics-sequence'){
   const parts=select([['ritmica|ritmicos','rítmica'],['artistica|artisticos','artística'],['acrobatica|acrobaticos','acrobática']]),selected=parts.length?choice(parts):'expresamente asignada'
   if(topic.id==='gymnastics-modalities')replaceSuccess(`Compara las modalidades de gimnasia ${selected} relacionando sus características con las evidencias de los referentes proporcionados.`)
   else replaceSuccess(`Crea la composición de gimnasia ${selected} adaptada con los movimientos expresamente dados relacionando secuencia, espacio y ritmo según las condiciones supervisadas proporcionadas.`)
  }
  if(topic.id==='cardiovascular-reference'){
   const selected=choice(select([['aerobicos','aeróbicos'],['zumba','zumba']]))
   replaceSuccess(`Explica las características de ${selected} mediante las evidencias de los referentes cardiovasculares proporcionados.`)
  }
  if(topic.id==='basketball-screen'){
   const selected=choice(select([['indirecto','el bloqueo indirecto'],['directo','el bloqueo directo']]))
   replaceSuccess(`Analiza ${selected} del referente de baloncesto relacionando posiciones y decisiones con las evidencias proporcionadas.`)
  }
  if(topic.id==='basketball-wheelchair'){
   const parts=select([['pase','pase'],['recepcion','recepción'],['drible|dribleo','drible'],['tiro','tiro'],['finta','finta'],['desplazamiento','desplazamiento']]),selected=parts.length?'las decisiones de '+choice(parts):'las decisiones expresamente solicitadas'
   replaceSuccess(`Analiza ${selected} del referente de baloncesto en silla de ruedas relacionando reglas adaptadas y participación con las evidencias proporcionadas, sin exigir ejecutar maniobras.`)
  }
  for(const sport of ['basketball','handball'])if(topic.id===sport+'-tactics'){
   const parts=select([['ofensiva','ofensiva'],['defensiva','defensiva']]),selected=parts.length?choice(parts):'expresamente asignada',name=sport==='basketball'?'baloncesto':'balonmano'
   const references=/reglas|reglamento/.test(text)?'las alternativas, posiciones y reglas proporcionadas':'las alternativas y posiciones proporcionadas'
   replaceSuccess(`Resuelve la situación táctica ${selected} de ${name} del caso dado justificando la decisión según ${references}.`)
  }
  if(topic.id==='basketball-defense'){
   const shapes=select([['2-1-2','2-1-2'],['2-3','2-3'],['3-2','3-2']]),parts=select([['individual','la defensa individual'],['zonal','la defensa zonal'+(shapes.length?' '+join(shapes):'')]]),selected=parts.length>1&&/\bo\b/.test(text)&&/elegid|seleccion/.test(text)?'la defensa elegida entre '+parts.map(p=>p.replace(/^la defensa /,'')).join(' o '):parts.length?join(parts):'la defensa expresamente elegida'
   evidence=evidence.map(e=>({...e,success:`Compara ${selected} de baloncesto relacionando principios y posiciones con los referentes dados.`,variants:{...e.variants,PERFORMANCE:{...e,...e.variants?.PERFORMANCE,title:'Defensa según la referencia dada',success:`Ejecuta ${selected} adaptada de baloncesto según las señales y condiciones supervisadas proporcionadas.`}}}))
  }
  if(topic.id==='chess-variants'){
   const selected=/mas de dos variantes/.test(text)?'más de dos variantes':/dos variantes/.test(text)?'dos variantes':/una sola variante/.test(text)?'una sola variante':'las variantes expresamente solicitadas'
   replaceSuccess(`Resuelve el problema de ajedrez de la posición dada calculando ${selected} y justificando las jugadas con las reglas proporcionadas.`)
  }
  if(topic.id==='basketball-game'){
   const selected=/3\s*(?:x|contra)\s*3/.test(text)?'baloncesto 3x3':/convencional/.test(text)?'baloncesto convencional':'baloncesto de la variante expresamente dada'
   replaceSuccess(`Juega la situación adaptada de ${selected} aplicando las reglas y decisiones ofensivas y defensivas proporcionadas con los apoyos acordados, sin evaluar ganar.`)
  }
  if(topic.id==='chess-position-advantage'){
   const parts=select([['material','la ventaja material'],['espacio','la ventaja de espacio'],['tiempo','la ventaja de tiempo'],['coordinacion','la ventaja de coordinación de piezas'],['amenazas','la ventaja por creación de amenazas']]),selected=parts.length>1&&/\bo\b/.test(text)&&/elegid|seleccion/.test(text)?'la opción elegida entre '+parts.join(' o '):parts.length?join(parts):'la ventaja expresamente elegida'
   topic={...topic,relation:`la relación entre ${selected} de ajedrez y las evidencias de la posición dada`}
   replaceSuccess(`Analiza ${selected} de la posición de ajedrez dada justificándola con las piezas y evidencias proporcionadas.`)
  }
 }
 if(topic.grade===3){
  const absent='No aporta evidencia del desempeño expresamente solicitado.'
  if(topic.id==='football-conduction'){
   const parts=select([['lineal','el trayecto lineal'],['cambios? de direccion','los cambios de dirección'],['obstaculos','los obstáculos']]),chosen=parts.length?join(parts):'las referencias expresamente dadas'
   topic={...topic,relation:`la relación entre ${chosen} y las decisiones de conducción del balón de fútbol`}
   evidence=evidence.map(e=>({...e,absent,success:`Conduce el balón de fútbol según ${chosen}, siguiendo las señales del trayecto adaptado proporcionado y respetando las condiciones supervisadas y los apoyos permitidos.`}))
  }
  if(topic.id==='orientation-race'){
   const parts=select([['mapas?','el mapa'],['brujulas?','la brújula'],['gps','las referencias GPS'],['balizas','las balizas'],['tarjetas','las tarjetas']]),chosen=parts.length?join(parts):'los recursos expresamente asignados'
   topic={...topic,relation:`la relación entre ${chosen} y las decisiones de la carrera de orientación adaptada solicitada`}
   evidence=evidence.map(e=>({...e,absent,success:`Recorre la carrera de orientación adaptada de la simulación supervisada siguiendo ${chosen} de la tarea proporcionada, con los apoyos permitidos.`,...(e.plan?{plan:{...e.plan,title:'Referencias y decisiones previstas',success:`Planifica la carrera de orientación adaptada del caso proporcionado relacionando ${chosen} con los acuerdos y condiciones dados, sin exigir realizar el recorrido todavía.`}}:{})}))
  }
  if(topic.id==='volleyball-history'||topic.id==='volleyball-rules'){
   const parts=select([['voleibol sentado','voleibol sentado'],['voleibol arena','voleibol arena'],['voleibol convencional','voleibol convencional']])
   if(parts.length){
    const chosen=parts.length>1&&/\bo\b/.test(text)&&/elegid|seleccion/.test(text)?'la variante elegida entre '+parts.join(' o '):join(parts)
    topic={...topic,label:(topic.id==='volleyball-history'?'historia':'reglas')+' de '+chosen,relation:topic.id==='volleyball-history'?`la relación entre hechos, personajes, fechas y fuentes de ${chosen} del ámbito asignado`:`las funciones y condiciones de las reglas de ${chosen} expresamente asignadas`}
    evidence=evidence.map(e=>({...e,absent,success:e.success.replace('de la variante de voleibol expresamente asignada','de '+chosen).replace('de la variante de voleibol elegida','de '+chosen)}))
   }
  }
  if(topic.id==='volleyball-pass'){
   const parts=select([['antebrazos','el pase de antebrazos'],['manos altas','el toque de manos altas']]),chosen=parts.length>1&&/\bo\b/.test(text)&&/elegid|seleccion/.test(text)?'la acción elegida entre '+parts.join(' o '):parts.length?join(parts):'el pase expresamente elegido'
   evidence=evidence.map(e=>({...e,absent,success:`Ejecuta ${chosen} de voleibol según las señales y condiciones supervisadas dadas con los apoyos permitidos.`}))
  }
  if(topic.id==='volleyball-reception'){
   const parts=select([['saque','el saque'],['remate','el remate']]),chosen=parts.length?join(parts):'el envío expresamente elegido'
   evidence=evidence.map(e=>({...e,absent,success:`Recepciona ${chosen} de voleibol según la posición, señales y condiciones supervisadas dadas, con los apoyos permitidos.`}))
  }
  if(topic.id==='volleyball-game'){
   const parts=select([['4 contra 4','4 contra 4'],['6 contra 6','6 contra 6']]),chosen=parts.length>1&&/\bo\b/.test(text)&&/elegid|seleccion/.test(text)?'en la variante elegida de '+parts.join(' o '):parts.length?join(parts):'en la variante expresamente elegida'
   evidence=evidence.map(e=>({...e,absent,success:`Juega el voleibol adaptado ${chosen} en cancha modificada aplicando las reglas, acciones y apoyos proporcionados, sin evaluar ganar.`}))
  }
  if(topic.id==='volleyball-serve'){
   const chosen=/saque de abajo/.test(text)?'saque de abajo':'saque expresamente elegido'
   evidence=evidence.map(e=>({...e,absent,success:`Ejecuta el ${chosen} adaptado de voleibol según las señales y condiciones supervisadas dadas, utilizando los apoyos permitidos.`}))
  }
  if(topic.id==='football-history'||topic.id==='football-game'||topic.id==='football-rules'){
   const parts=select([['futsal','futsal'],['futbol 11','fútbol 11'],['futbol 5(?: en grama)?','fútbol 5 en grama']]),chosen=parts.length>1&&/\bo\b/.test(text)&&/elegid|seleccion/.test(text)?'la variante elegida de '+parts.join(' o '):parts.length?join(parts):'fútbol de la variante expresamente elegida'
   if(topic.id==='football-rules'){
    if(parts.length){
     topic={...topic,label:'reglas de '+chosen,relation:`las funciones y condiciones de las reglas de ${chosen} expresamente asignadas`}
     evidence=evidence.map(e=>({...e,absent,success:e.success.replace('de la variante de fútbol expresamente elegida','de '+chosen),...(e.variants?.VERIFICATION?.success?{variants:{...e.variants,VERIFICATION:{...e.variants.VERIFICATION,success:e.variants.VERIFICATION.success.replace('de fútbol','de '+chosen)}}}:{})}))
    }
   }else evidence=evidence.map(e=>({...e,absent,success:topic.id==='football-history'?`Presenta los hechos históricos de ${chosen} del ámbito expresamente asignado relacionando personajes, fechas y evidencias de las fuentes dadas.`:`Juega la situación adaptada de ${chosen} aplicando las reglas y decisiones técnico tácticas expresamente proporcionadas con los apoyos acordados, sin evaluar ganar.`}))
  }
  if(topic.id==='football-pass'){
   const parts=select([['corta','corta'],['mediana','mediana'],['larga','larga']]),chosen=parts.length?join(parts)+' distancia':'la distancia expresamente elegida'
   evidence=evidence.map(e=>({...e,absent,success:`Ejecuta los pases de fútbol a ${chosen} hacia la referencia señalada y según las condiciones supervisadas dadas, con los apoyos permitidos.`}))
  }
  if(topic.id==='football-shot'){
   const parts=select([['(?:tiro )?directo','tiro directo'],['(?:tiro )?indirecto','tiro indirecto'],['(?:tiro )?de esquina','tiro de esquina'],['penalti','penalti']]),alternative=parts.length>1&&/\bo\b/.test(text)&&/elegid|seleccion/.test(text),chosen=alternative?'el tiro elegido entre '+parts.map(p=>p.replace(/^tiro /,'')).join(' o '):parts.length?'el '+join(parts):'el tiro expresamente elegido'
   evidence=evidence.map(e=>({...e,absent,success:`Analiza ${chosen} del referente de fútbol relacionando decisión y trayectoria con las condiciones y reglas proporcionadas.`,...(e.plan?{plan:{...e.plan,success:e.plan.success.replace('del tiro de fútbol expresamente elegido','de'+(chosen.startsWith('el ')?'l '+chosen.slice(3):' '+chosen))}}:{})}))
  }
  if(topic.id==='chess-opening-types'||topic.id==='chess-opening-game'){
   const parts=select([['abiertas?','abiertas'],['cerradas?','cerradas'],['semiabiertas?','semiabiertas']]),chosen=parts.length?join(parts):'expresamente elegidas'
   const opening=parts.length===1?'la apertura '+parts[0].replace(/s$/,''):parts.length>1&&/\bo\b/.test(text)&&/elegid|seleccion/.test(text)?'la apertura elegida entre '+parts.map(p=>p.replace(/s$/,'')).join(' o '):parts.length?'las aperturas '+chosen:'la apertura expresamente elegida'
   evidence=evidence.map(e=>({...e,absent,success:topic.id==='chess-opening-types'?`Clasifica las aperturas ${chosen} de las posiciones de ajedrez proporcionadas justificando sus diferencias con las jugadas dadas.`:`Juega la partida adaptada de ajedrez con anotación utilizando ${opening} según la posición y reglas dadas, sin exigir otros tipos ni ganar.`}))
  }
  if(topic.id.startsWith('racket-')){
   const parts=select([['badminton','bádminton'],['tenis de mesa','tenis de mesa'],['tenis(?! de mesa)','tenis']]).sort((a,b)=>text.indexOf(normalize(a))-text.indexOf(normalize(b))),chosen=parts.length>1&&/\bo\b/.test(text)&&/elegid|seleccion/.test(text)?'la disciplina elegida entre '+parts.join(' o '):parts.length?join(parts):'la disciplina de raqueta expresamente elegida'
   const render=(value:string)=>value.replaceAll('del deporte de raqueta expresamente elegido','de '+chosen).replaceAll('del deporte de raqueta elegido','de '+chosen)
   evidence=evidence.map(e=>({...e,absent,success:render(e.success),...(e.variants?.PRESENTATION?.success?{variants:{...e.variants,PRESENTATION:{...e.variants.PRESENTATION,success:render(e.variants.PRESENTATION.success)}}}:{})}))
  }
 }
 if(topic.grade===6){
  const choice=(parts:string[])=>parts.length>1&&/\bo\b/.test(text)?'la opción elegida entre '+parts.join(' o '):parts.length?join(parts):'la variante expresamente elegida'
  const scope=choice(select([['internacional','internacional'],['nacional','nacional'],['provincial','provincial'],['local','local'],['comunidad','de la comunidad asignada']]))
  const sport=choice(select([['futsal','futsal'],['futbol 11','fútbol 11'],['futbol 5(?: en grama)?','fútbol 5 en grama'],['futbol arena','fútbol arena'],['futbol con cascabeles','fútbol con cascabeles']]))
  const volleyball=choice(select([['arena','arena'],['grama','grama'],['sala','sala'],['sentado','sentado']]))
  const racket=choice(select([['tenis de mesa','tenis de mesa'],['badminton','bádminton'],['tenis(?! de mesa)','tenis']]))
  const side=choice(select([['derecha','derecha'],['reves','revés']]))
  const trajectory=choice(select([['cruzad[oa]','cruzado'],['rect[oa]','recto'],['diagonal','diagonal']]))
  const style=choice(select([['liftad[oa]','liftado'],['cortad[oa]','cortado'],['plan[oa]','plano']]))
  // Actualiza también las variantes por propósito: de otro modo eclipsan la selección contextual.
  const update=(success:string,relation?:string)=>{
   const render=<T extends PhysicalEvidence>(e:T)=>({...e,success})
   evidence=evidence.map(e=>({...render(e),...(e.plan?{plan:render(e.plan)}:{}),...(e.variants?{variants:Object.fromEntries(Object.entries(e.variants).map(([purpose,v])=>[purpose,render(v)]))}:{})}))
   if(relation)topic={...topic,relation}
  }
  if(topic.id==='distance-running')update(`Realiza la carrera de ${choice(select([['mediana distancia','mediana distancia'],['larga distancia','larga distancia']]))} adaptada siguiendo el ritmo, señales y condiciones supervisadas proporcionadas con los apoyos permitidos, sin asignar distancias ni duración nuevas.`)
  if(topic.id==='orientation-race')update(`Recorre la carrera de orientación adaptada siguiendo ${join(select([['mapa','el mapa'],['senales de rastreo','las señales de rastreo'],['balizas','las balizas'],['tarjetas','las tarjetas']]))||'las referencias expresamente dadas'} según las condiciones supervisadas proporcionadas con los apoyos permitidos.`)
  if(topic.id==='orientation-map'){
   const target=choice(select([['croquis','croquis'],['mapa','mapa']]))+(/o-cad/.test(text)?' con O-CAD':''),product=target.startsWith('la ')?target:'el '+target,relation=`la correspondencia entre símbolos, referencias y ubicaciones ${product.startsWith('el ')?'del '+product.slice(3):'de '+product} de orientación proporcionado`
   update(`Elabora ${product} de orientación relacionando símbolos, referencias y ubicaciones proporcionadas según la guía dada, sin exigir instalar software ni realizar el recorrido.`,relation)
  }
  if(topic.id==='orientation-safety')update(`Planifica las medidas de seguridad del recorrido de orientación ${choice(select([['urbano','urbano'],['rural','rural']]))} justificándolas según los riesgos y protocolos proporcionados, sin exigir realizar una excursión.`)
  if(topic.id==='football-history'){
   const render=<T extends PhysicalEvidence>(e:T,verb:string)=>({...e,success:`${verb} los hechos históricos de ${sport} del ámbito ${scope} relacionando personajes, fechas y evidencias de las fuentes proporcionadas.`})
   evidence=evidence.map(e=>({...render(e,'Presenta'),variants:{...e.variants,RESEARCH:render({...e,...e.variants?.RESEARCH},'Investiga')}}))
  }
  if(topic.id==='football-biography')update(`Investiga los aportes biográficos de futbolistas dominicanos del ámbito ${scope} relacionándolos con las evidencias de las fuentes proporcionadas.`)
  if(topic.id==='football-counterattack')update(`Ejecuta el contraataque de ${sport} ${/sin posesion/.test(text)?'sin posesión del balón':/con posesion/.test(text)?'con posesión del balón':'en la condición de posesión expresamente dada'} de la situación adaptada según posiciones, señales y apoyos proporcionados.`)
  if(topic.id==='football-possession')update(`Planifica la ofensiva de posesión de ${sport} relacionando posiciones y decisiones con las alternativas proporcionadas, sin exigir ejecutar el juego.`)
  if(topic.id==='football-defense'){
   const target=choice(select([['jugador de campo','jugador de campo'],['portero','portero']]))
   evidence=evidence.map(e=>({...e,success:`Analiza la defensa de ${target} de fútbol relacionando posiciones y decisiones con las evidencias del referente proporcionado, sin exigir ejecución.`,variants:{...e.variants,PLAN:{...e,...e.variants?.PLAN,success:`Planifica la defensa de ${target} de fútbol relacionando posiciones y decisiones con las alternativas proporcionadas, sin exigir ejecución.`}}}))
  }
  if(topic.id==='football-systems')update(`Ejecuta el sistema defensivo ${choice(select([['4-4-2','4-4-2'],['4-5-1','4-5-1'],['4-3-3','4-3-3']]))} de ${sport} en la situación adaptada según señales, posiciones y apoyos proporcionados.`)
  if(topic.id==='football-team-plan')update(`Organiza el plan de acciones ${choice(select([['ofensivas','ofensivas'],['defensivas','defensivas']]))} del equipo de fútbol relacionando roles y posiciones con las alternativas proporcionadas, sin exigir ejecutar el juego.`)
  if(topic.id==='football-game')update(`Juega la situación adaptada de ${sport} aplicando las reglas y decisiones técnico tácticas proporcionadas con los apoyos acordados, sin evaluar ganar.`)
  if(topic.id==='football-rules')evidence=evidence.map(e=>({...e,success:`Explica las reglas de ${sport} relacionando sus funciones con los ejemplos proporcionados.`,variants:{...e.variants,VERIFICATION:{...e,...e.variants?.VERIFICATION,success:`Verifica si las decisiones del registro de ${sport} cumplen las reglas proporcionadas justificando cada marca con sus evidencias.`}}}))
  if(topic.id==='volleyball-institutions')update(`Investiga las funciones de las instituciones que regulan y fomentan el voleibol del ámbito ${scope} mediante las fuentes proporcionadas.`)
  if(topic.id==='volleyball-history')update(`Presenta los hechos y personajes históricos del voleibol ${volleyball} del ámbito ${scope} relacionando fechas y evidencias de las fuentes proporcionadas.`)
  if(topic.id==='volleyball-rules')update(`Verifica si las decisiones del registro de voleibol ${volleyball} cumplen las reglas proporcionadas justificando cada marca con sus evidencias.`)
  if(topic.id==='volleyball-modalities')update(`Compara los objetivos y características del voleibol ${volleyball} mediante las evidencias de los referentes proporcionados.`)
  if(topic.id==='volleyball-pass')update(`Ejecuta ${choice(select([['antebrazos','el pase de antebrazos'],['manos altas','el toque de manos altas']]))} adaptado de voleibol según las posiciones, señales y apoyos proporcionados.`)
  if(topic.id==='volleyball-attack')update(`Ejecuta ${choice(select([['pase','el pase en ataque'],['remate','el remate']]))} adaptados de voleibol según posiciones, señales y apoyos proporcionados.`)
  if(topic.id==='volleyball-reception')update(`Ejecuta la recepción ${choice(select([['saque','del saque'],['remate','del remate']]))} adaptada de voleibol según posiciones, señales y apoyos proporcionados.`)
  if(topic.id==='volleyball-alignments')update(`Ejecuta la función de ${choice(select([['atacador','atacador'],['acomodador','acomodador']]))} en la alineación ofensiva ${choice(select([['2-6','2-6'],['2-4','2-4'],['3-3','3-3'],['6-6','6-6']]))} de voleibol según posiciones y señales de la situación adaptada proporcionada.`)
  if(topic.id==='volleyball-game')update(`Juega la situación adaptada de voleibol ${choice(select([['4 contra 4','4 contra 4'],['6 contra 6','6 contra 6']]))} en cancha modificada aplicando las reglas y decisiones proporcionadas con los apoyos acordados, sin evaluar ganar.`)
  if(topic.id==='volleyball-serve')update(`Ejecuta el ${/saque de abajo/.test(text)?'saque de abajo':'saque expresamente elegido'} adaptado de voleibol según referencias, señales y apoyos proporcionados.`)
  if(topic.id==='chess-bishop-ending')update(`Resuelve el problema del final de ${choice(select([['alfiles del mismo color','alfiles del mismo color'],['alfiles de colores opuestos','alfiles de colores opuestos'],['alfil contra caballo','alfil contra caballo']]))} de ajedrez justificando las jugadas con la posición proporcionada.`)
  if(topic.id==='chess-pawn-game')update(`Juega la partida adaptada de ajedrez aplicando el tema ${choice(select([['ofensivo','ofensivo'],['defensivo','defensivo']]))} de la estructura de peones dada según las reglas y posiciones proporcionadas, sin exigir ganar.`)
  if(topic.id==='chess-history')update(`Investiga los hechos históricos del ajedrez del ámbito ${scope} relacionando personajes, fechas y fuentes proporcionadas.`)
  if(topic.id==='racket-institutions')update(`Investiga las funciones de las instituciones que regulan y fomentan ${racket} del ámbito ${scope} mediante las fuentes proporcionadas.`)
  if(topic.id==='racket-rules')update(`Compara las reglas de ${choice(select([['individuales','individuales'],['dobles mixtos','dobles mixtos'],['dobles(?! mixtos)','dobles']]))} de ${racket} mediante las semejanzas y diferencias de los referentes proporcionados.`)
  if(['table-stroke','table-block','table-cut'].includes(topic.id))update(`Ejecuta el ${topic.id==='table-stroke'?'golpeo':topic.id==='table-block'?'bloqueo':'corte'} de ${side} ${trajectory} de tenis de mesa de la tarea adaptada según las señales y apoyos proporcionados.`)
  if(topic.id==='table-serve')update(`Analiza el saque de ${side} ${trajectory}${/efecto/.test(text)?' con efecto':''} de tenis de mesa relacionando trayectoria y decisión con las evidencias proporcionadas, sin exigir ejecución.`)
  if(topic.id==='table-combination')update(`Ejecuta el ejercicio combinado ${choice(select([['1\\s*vs\\s*2','1 vs 2'],['2\\s*vs\\s*2','2 vs 2']]))} por el trayecto ${trajectory} de tenis de mesa según las señales y apoyos proporcionados.`)
  if(topic.id==='racket-game')update(`Juega el ${choice(select([['set','set'],['game','game'],['partido','partido']]))} adaptado de ${racket} aplicando las reglas y decisiones proporcionadas con los apoyos acordados, sin evaluar ganar.`)
  if(topic.id==='badminton-serve')update(`Ejecuta el saque de ${side} ${choice(select([['alto','alto'],['flick','flick'],['drive','drive'],['corto','corto']]))} de bádminton según señales y condiciones supervisadas proporcionadas.`)
  if(topic.id==='badminton-back')update(`Analiza ${choice(select([['globo|clear','el globo o clear'],['dejada|drop','la dejada o drop'],['remate','el remate'],['drive','el drive']]))} del referente de fondo de pista de bádminton relacionando trayectoria y decisión con sus evidencias, sin exigir ejecución.`)
  if(topic.id==='badminton-net')update(`Ejecuta el ${choice(select([['lob','lob'],['net','net']]))} adaptado de bádminton en la red según señales y condiciones supervisadas proporcionadas.`)
  if(topic.id==='tennis-serve')update(`Ejecuta el servicio ${style.replace(/^la opción elegida/,'elegido').replace(/^la variante/,'de la variante')} adaptado de tenis según señales, referencias y apoyos proporcionados.`)
  if(topic.id==='tennis-stroke')update(`Ejecuta el golpe de ${side} ${style} adaptado de tenis según señales y condiciones supervisadas proporcionadas.`)
  if(topic.id==='tennis-volley')update(`Ejecuta la volea de ${side} adaptada de tenis según señales y condiciones supervisadas proporcionadas.`)
  if(topic.id==='racket-tactics')update(`Planifica los movimientos ${choice(select([['ofensivos|ataque','ofensivos'],['defensivos|defensa','defensivos']]))} de ${racket} del caso relacionando posiciones y decisiones con las reglas y alternativas proporcionadas, sin exigir ejecución.`)
 }
 if(topic.grade>=2&&topic.id==='motor-variation'){
  const motions=select([['saltos?','saltos'],['giros?','giros'],['desplazamientos?','desplazamientos']]),changes=select([['direccion','dirección'],['sentido','sentido'],['velocidad','velocidad'],['centro de gravedad','centro de gravedad']])
  evidence=evidence.map(e=>({...e,success:`Combina ${motions.length?join(motions):'los movimientos expresamente dados'} variando ${changes.length?join(changes):'las condiciones expresamente señaladas'} según las señales y apoyos de la tarea adaptada proporcionada.`,partial:'Presenta acciones pertinentes, pero una respuesta no corresponde a las señales o variaciones dadas.',absent:'No aporta evidencia de los movimientos y variaciones expresamente solicitados.'}))
 }
 if([2,6].includes(topic.grade)){
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
  const parts=select([['fuerza rapida','fuerza rápida'],['velocidad de reaccion','velocidad de reacción'],['traslacion','traslación'],['gestual','velocidad gestual'],['flexibilidad','flexibilidad'],['resistencia aerobica','resistencia aeróbica'],['coordinacion','coordinación'],['equilibrio','equilibrio'],['orientacion','orientación'],...(topic.grade===3?[['velocidad maxima','velocidad máxima'],['aciclica','velocidad acíclica'],['resistencia anaerobica','resistencia anaeróbica']] as [string,string][]:[])]),contrast=/diferenci|compar|contrast/.test(text)
  const chosenParts=[4,5,6].includes(topic.grade)?select([['fuerza','fuerza'],['velocidad','velocidad'],['flexibilidad','flexibilidad'],['resistencia','resistencia'],['equilibrio','equilibrio'],['coordinacion','coordinación'],['orientacion','orientación'],['diferenciacion','diferenciación'],['reaccion','reacción'],['adaptacion','adaptación'],['ritmo','ritmo']]):parts
  const target=chosenParts.length?join(chosenParts):'las capacidades físicas expresamente asignadas'
  evidence=evidence.map(e=>({...e,success:`Explica ${contrast?'las diferencias entre':'la función de'} ${target} mediante evidencias de los ejemplos adaptados proporcionados, sin clasificar cuerpos o personas.`,...(!contrast?{sufficient:'La función de la capacidad se sustenta; una relación secundaria con el ejemplo queda poco precisada.',partial:'Reconoce la capacidad pertinente, pero su función no se vincula con la acción del ejemplo dado.'}:{})}))
 }
 if(topic.id==='expressive-situation'&&!/fictici/.test(text))evidence=evidence.map(e=>({...e,success:e.success.replace('circunstancia ficticia','circunstancia')}))
 if(topic.grade>=2&&!/fictici|simulad|simulacion/.test(text)){
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
