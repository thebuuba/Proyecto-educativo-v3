import type {InstrumentAcademicContext} from './secondary-science'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'
import type {InstrumentType,InstrumentRecommendation} from './instrument-recommendation'
import {socialGradeOneTopics,type SocialTopic} from './secondary-social-grade-1'
import {withoutResources} from './evaluation-task-text'

export const commonSocialModules=[{id:'ciencias-sociales-comun-1',grade:1,topics:socialGradeOneTopics,policy:'REQUESTED_SOCIAL_EVIDENCE_V1'}]
const normalize=(s:string)=>s.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase()
const verbs='(?:analiz[a-z]*|analic[a-z]*|interpret[a-z]*|explic[a-z]*|expliqu[a-z]*|compar[a-z]*|contrast[a-z]*|identific[a-z]*|identifiqu[a-z]*|describ[a-z]*|ubic[a-z]*|ubiqu[a-z]*|localiz[a-z]*|orden[a-z]*|elabor[a-z]*|constru[a-z]*|redact[a-z]*|investig[a-z]*|consult[a-z]*|debat[a-z]*|argument[a-z]*|justific[a-z]*|justifiqu[a-z]*|propon[a-z]*|propong[a-z]*|present[a-z]*|expon[a-z]*|registr[a-z]*|represent[a-z]*|simul[a-z]*)'
/** Preserve clause boundaries: a negative requirement cannot suppress a later positive action. */
function requestedText(value:string){
 return normalize(withoutResources(value.replace(/<\/(?:p|li|div)>|<br\s*\/?\s*>/gi,'. ').replace(/<[^>]*>/g,' ').replace(/&nbsp;|&#160;/g,' ')))
  .replace(new RegExp(`\\b(?:no|sin)\\b[^.;\\n]*?(?=[.;\\n]|\\s+(?:y|pero)\\s+${verbs}\\b|$)`,'g'),'')
  .replace(/\b(?:pueden|podran)\s+(?:usar|utilizar|apoyarse)[^.;\n]*/g,'').trim()
}
type SocialAction={text:string;topics:SocialTopic[]}
export type CommonSocialTask={grade:number;actions:SocialAction[];activityType:string;technique:string}
const has=(text:string,action:string)=>new RegExp(`\\b(?:${action})[a-z]*\\b`).test(text)
const compares=(text:string)=>has(text,'compar|contrast|distingu')
const oral=(text:string)=>/\boralmente\b|\bexpon[a-z]*\b|\bexposicion\b/.test(text)
function matches(text:string){
 const selected=socialGradeOneTopics.filter(t=>text.includes(normalize(t.label))||new RegExp(`\\b(?:${t.match})\\b`).test(text))
 const thematic=selected.some(t=>!['cartography','orientation','scale','gps','geography'].includes(t.id))
 // A map can be a delivery medium for historical content, rather than the studied topic.
 return thematic&&has(text,'elabor|represent|constru|ubic|ubiqu|localiz')?selected.filter(t=>t.id!=='cartography'):selected
}
function splitActions(text:string){
 return text.split(new RegExp(`(?:[.;\\n]+\\s*|\\s+(?:y|e|luego|despues)\\s+)(?=(?:(?:los estudiantes|cada estudiante)\\s+)?${verbs}\\b)`)).filter(Boolean)
}
export function resolveCommonSocialTask(title:string,description:string,context?:InstrumentAcademicContext|null):CommonSocialTask|null{
 if(context?.level!=='SECONDARY'||context.grade!==1||context.optativeExitName||context.subjectCode.trim().toUpperCase()!=='SOC')return null
 const text=requestedText(description||title),selected=matches(text)
 if(!selected.length||!new RegExp(`\\b${verbs}\\b`).test(text))return null
 let previous:SocialTopic[]=selected
 const actions=splitActions(text).map(text=>{const own=matches(text);if(own.length)previous=own;return{text,topics:own.length?own:previous}})
 const activityType=has(text,'debat')?'DEBATE':oral(text)?'ORAL_PRESENTATION':has(text,'investig|consult')?'RESEARCH':/linea de tiempo/.test(text)?'PROJECT':has(text,'simul')?'PERFORMANCE':compares(text)?'COMPARISON':/\b(?:elabor[a-z]*|redact[a-z]*)\b[^.;]*\binforme\b/.test(text)?'REPORT':'ANALYSIS'
 const technique=activityType==='DEBATE'?'debate':activityType==='ORAL_PRESENTATION'?'presentacion':activityType==='PERFORMANCE'?'observacion-sistematica':'analisis-producciones'
 return{grade:1,actions,activityType,technique}
}
type Levels=ContextualTopicCriterion['progressionLevels']
function criterion(topic:SocialTopic,key:string,title:string,success:string,partial:string,error:string,weight=3):ContextualTopicCriterion{
 const progressionLevels:Levels=[success,`${success} Una precisión secundaria queda incompleta, sin alterar la relación principal.`,partial,error,`No aporta evidencia del desempeño solicitado sobre ${topic.label}.`]
 return{templateId:`soc-${topic.grade}-${topic.id}-${key}`,title,observable:success,progressionLevels,weight}
}
function actionCriteria(action:SocialAction):ContextualTopicCriterion[]{
 const {text,topics}=action
 const alternatives=text.split(/\s+o\s+(?:bien\s+)?(?=(?:una?\s+)?(?:mapa|linea de tiempo|cuadro|informe)\b)/)
 if(alternatives.length>1){
  const branches=alternatives.map((part,i)=>actionCriteria({text:i?text.slice(0,text.search(new RegExp(`\\b${verbs}\\b`))+text.match(new RegExp(`\\b${verbs}\\b`))![0].length)+' '+part:part,topics}))
  const levels=[0,1,2,3,4].map(i=>`En la alternativa elegida: ${branches.map(b=>b.map(c=>c.progressionLevels[i]).join(' ')).join(' O BIEN: ')}`) as Levels
  return[{templateId:`soc-1-${topics[0].id}-alternative`,title:'Producto alternativo solicitado',observable:levels[0],progressionLevels:levels,weight:4}]
 }
 const rows:ContextualTopicCriterion[]=[]
 for(const topic of topics){
  const add=(key:string,title:string,success:string,partial:string,error:string,weight=3)=>rows.push(criterion(topic,key,title,success,partial,error,weight))
  const label=topic.label,analyzes=has(text,'analiz|analic|interpret'),explains=has(text,'explic|expliqu|describ'),comparison=compares(text)
  const mapping=/mapas?|planos?/.test(text)&&has(text,'ubic|ubiqu|localiz|represent|elabor|constru'),chronology=/linea de tiempo|cronolog|secuencia temporal/.test(text)
  if(chronology)add('sequence',`Secuencia temporal de ${label}`,`Ordena los hechos indicados de ${label} en una secuencia cronológica consistente con los períodos o fechas proporcionados, sin confundir simultaneidad con sucesión.`,`Ordena parte de los hechos de ${label}, pero una ubicación temporal no corresponde a la información indicada.`,`La secuencia de ${label} invierte hechos o atribuye fechas incompatibles con los datos del caso.`,4)
  if(mapping&&topic.id!=='orientation')add('location',`Ubicación de ${label}`,`Ubica los lugares indicados de ${label} en la representación solicitada con referencias espaciales consistentes con los datos disponibles.`,`Ubica parte de los lugares, pero una referencia espacial impide reconocer la posición solicitada.`,`Las posiciones representadas no corresponden a los lugares o referencias indicados.`,4)
  if(topic.id==='orientation'&&mapping)add('orientation','Uso de referencias de orientación','Utiliza los puntos cardinales o coordenadas solicitados para expresar la posición de los lugares y mantiene la misma referencia al compararlos.','Utiliza la referencia de orientación, pero una dirección o coordenada resulta inconsistente.','Invierte las direcciones o interpreta las coordenadas con una referencia incompatible.',3)
  if(analyzes&&/causas?|factores|motivos/.test(text))add('causes',`Causas de ${label}`,`Explica los factores solicitados de ${label} relacionando las condiciones del contexto con los hechos y distinguiendo evidencia de una suposición.`,`Menciona factores de ${label}, pero no explica una relación causal necesaria.`,`Presenta como causa de ${label} un hecho posterior o una afirmación sin relación con el caso.`,4)
  if(analyzes&&/consecuencias?|repercusiones|efectos|impacto/.test(text))add('consequences',`Consecuencias de ${label}`,`Explica los efectos solicitados de ${label} indicando qué cambia y para qué actores o espacios, con respaldo en la información disponible.`,`Menciona efectos de ${label}, pero deja sin explicar qué cambia o quiénes se ven afectados.`,`Confunde las consecuencias de ${label} con sus antecedentes o atribuye efectos incompatibles con los hechos.`,4)
  if(comparison)add('comparison',`Comparación de ${label}`,`Compara los casos solicitados de ${label} mediante dimensiones comunes, distinguiendo semejanzas y diferencias respaldadas por sus contextos.`,`Describe los casos de ${label}, pero usa dimensiones diferentes o deja una diferencia sin respaldo.`,`Atribuye a los casos de ${label} semejanzas o diferencias que contradicen la información examinada.`,4)
  if(analyzes&&/perspectivas|posturas|autores|interpretaciones/.test(text))add('perspectives',`Perspectivas sobre ${label}`,`Interpreta las perspectivas de los autores indicados sobre ${label}, diferenciando sus afirmaciones y contextos.`,`Reconoce las perspectivas de ${label}, pero atribuye sin precisión una afirmación a su autor o contexto.`,`Confunde las posturas de los autores o sustituye su interpretación por una afirmación ajena a las fuentes.`,4)
  const specific=chronology||mapping||comparison||analyzes&&/causas?|factores|motivos|consecuencias?|repercusiones|efectos|impacto|perspectivas|posturas|autores|interpretaciones/.test(text)
  if((analyzes||explains)&&!specific)add('interpretation',`Comprensión de ${label}`,`Explica ${topic.relation} utilizando los hechos o conceptos solicitados y diferenciando la información del caso de su interpretación.`,`Reconoce información pertinente de ${label}, pero una relación del caso queda sin explicar.`,`La explicación de ${label} confunde los hechos, conceptos o contexto que se deben interpretar.`,4)
  if(has(text,'identific|identifiqu')&&!specific)add('identification',`Identificación de ${label}`,`Identifica los hechos, conceptos o elementos solicitados de ${label} con características compatibles con ${topic.relation}.`,`Identifica parte de los elementos solicitados, pero una característica no permite distinguirlos.`,`Asigna nombres o características incompatibles con los elementos que se deben identificar.`,3)
  if(has(text,'investig|consult'))add('sources',`Fuentes sobre ${label}`,`Selecciona información pertinente sobre ${label} y hace reconocible su procedencia, valorando autoría, contexto y respaldo para el propósito solicitado.`,`La información es pertinente, pero una fuente no puede identificarse o su respaldo no se explica.`,`Utiliza información sin procedencia reconocible o incompatible con el objeto de investigación.`,4)
  if(analyzes&&/fuentes/.test(text))add('source-evidence',`Evidencias de las fuentes sobre ${label}`,`Relaciona sus interpretaciones de ${label} con evidencias localizables en las fuentes indicadas y distingue lo que afirman de sus propias inferencias.`,`Usa información de las fuentes, pero una inferencia sobre ${label} queda sin evidencia localizable.`,`Atribuye a las fuentes afirmaciones ausentes o interpreta evidencias incompatibles con su contexto.`,4)
  if(has(text,'argument|justific|justifiqu|debat'))add('argument',`Argumentación sobre ${label}`,`Sostiene una afirmación sobre ${label} mediante razones y evidencias pertinentes al caso, separando hechos y valoraciones sin exigir una postura predeterminada.`,`Presenta una afirmación sobre ${label}, pero una razón no se vincula con la evidencia utilizada.`,`Sustituye el argumento por afirmaciones sin respaldo o por una postura impuesta ajena al análisis.`,4)
  if(has(text,'propon|propong'))add('proposal',`Propuesta sobre ${label}`,`Propone una respuesta al problema indicado de ${label} y explica cómo sus acciones atienden las condiciones y derechos de las personas implicadas.`,`La propuesta atiende parte del problema, pero una acción no se relaciona con sus condiciones.`,`La propuesta no responde al problema indicado o desconoce los derechos examinados.`,4)
  if(oral(text))add('oral',`Explicación oral de ${label}`,`Presenta oralmente el contenido solicitado de ${label} con relaciones comprensibles entre las ideas y referencias al caso, sin valorar acento o rasgos personales.`,`La presentación permite reconocer el contenido, pero una relación entre las ideas queda poco clara.`,`La presentación no permite reconocer las relaciones solicitadas del contenido.`,3)
  if(has(text,'simul'))add('simulation',`Acciones en la simulación de ${label}`,`Realiza las acciones del rol indicado de ${label} conforme a las reglas de la situación simulada y las condiciones de seguridad solicitadas.`,`Realiza parte de las acciones del rol, pero una decisión no corresponde a las reglas indicadas.`,`Las acciones de la simulación no corresponden al rol o a las reglas de seguridad indicadas.`,4)
  if(!rows.some(r=>r.templateId.startsWith(`soc-1-${topic.id}-`)))add('representation',`Representación de ${label}`,`Organiza la información de ${label} en el producto solicitado conservando las relaciones entre los hechos, conceptos y espacios indicados.`,`El producto presenta información pertinente, pero una relación solicitada queda incompleta.`,`El producto altera las relaciones solicitadas o no presenta el contenido del caso.`,4)
 }
 return rows
}
export function commonSocialCriteria(task:CommonSocialTask):ContextualTopicCriterion[]{
 const rows=task.actions.flatMap(actionCriteria)
 return rows.filter((r,i)=>rows.findIndex(o=>o.templateId===r.templateId)===i)
}
export function commonSocialSelections(task:CommonSocialTask,description:string){
 const text=requestedText(description)
 const progressiveQuality=has(text,'analiz|analic|interpret|explic|expliqu|compar|contrast|argument|justific|justifiqu|debat|investig|propon|propong')||['ORAL_PRESENTATION','REPORT'].includes(task.activityType)
 const suggestedInstrumentType:InstrumentType=/credito parcial|ponderada|pesos por|puntos por/.test(text)?'lista-ponderada':/frecuencia|regularidad/.test(text)&&has(text,'observ|registr')?'escala':progressiveQuality?'rubrica':'lista-cotejo'
 return{suggestedInstrumentType,suggestedEvaluationTechnique:task.technique}
}
export function adaptSocialScale(proposal:InstrumentRecommendation):InstrumentRecommendation{
 if(proposal.instrumentType!=='escala')return proposal
 const indexes=proposal.levels.length===4?[0,1,2,4]:[0,1,2,3,4]
 const labels=['Completo','Suficiente','Parcial','Incipiente','Aún no logrado']
 return{...proposal,levels:proposal.levels.map((l,i)=>({...l,label:labels[indexes[i]]})),criteria:proposal.criteria.map(c=>({...c,descriptors:c.descriptors.map((d,i)=>({...d,text:c.progressionLevels?.[indexes[i]]??d.text}))}))}
}
