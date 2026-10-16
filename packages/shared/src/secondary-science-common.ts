import type {InstrumentAcademicContext} from './secondary-science'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'
import type {InstrumentType,InstrumentRecommendation} from './instrument-recommendation'
import type {CommonScienceTopic} from './secondary-science-common-types'
import {commonScienceGradeOneTopics} from './secondary-science-grade-1'

export const commonScienceTopicsByGrade:Record<number,CommonScienceTopic[]>={1:commonScienceGradeOneTopics}
export const commonScienceModules=Object.entries(commonScienceTopicsByGrade).map(([grade,topics])=>({id:`ciencias-naturaleza-comun-${grade}`,grade:Number(grade),topics,policy:'REQUESTED_SCIENTIFIC_ACTIONS_V1'}))
const normalize=(s:string)=>s.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase()
const actionVerb='(?:explic\\w*|describ\\w*|observ\\w*|registr\\w*|identific\\w*|senal\\w*|rotul\\w*|clasific\\w*|compar\\w*|contrast\\w*|analiz\\w*|interpret\\w*|calcul\\w*|resuel\\w*|resolv\\w*|resolver\\w*|formul\\w*|plante\\w*|realiz\\w*|ejecut\\w*|investig\\w*|consult\\w*|dibuj\\w*|represent\\w*|constru\\w*|elabor\\w*|redact\\w*|escrib\\w*|debat\\w*|argument\\w*|expon\\w*|present\\w*|recolect\\w*|recog\\w*|mid\\w*|medir\\w*|verific\\w*|comprob\\w*)'
export function scienceRequirementText(value:string){
 return normalize(value.replace(/<\/(?:p|li|div)>|<br\s*\/?\s*>/gi,'. ').replace(/<[^>]*>/g,' ').replace(/&nbsp;|&#160;/g,' '))
  .replace(/\b(?:expliqu|clasifiqu|identifiqu|verifiqu|justifiqu)(?:e|en)\b/g,word=>word.replace('qu','c'))
  .replace(/\b(?:realic|analic|organiz)(?:e|en)\b/g,word=>word.replace('ic','iz'))
  .replace(/\b(?:recursos?|ejemplos?)\s*:[^.;\n]*/g,'')
  .replace(/\b(?:como recurso|como ejemplo|por ejemplo)[^.;\n]*/g,'')
  .replace(/\b(?:podran|pueden|puede|podra)\s+(?:utiliz\w*|usar\w*|apoy\w*)[^.;\n]*/g,'')
  .replace(new RegExp(`\\b(?:no\\s+(?:(?:se|deben?|es necesario|hay que)\\s+)?|sin\\s+)${actionVerb}[^.;\\n]*`,'g'),'').trim()
}
type Action={text:string;topics:CommonScienceTopic[]}
export type CommonScienceTask={grade:number;actions:Action[];activityType:string;technique:string}
const explanation=(text:string)=>/\bexplic\w*\b/.test(text)
const cognitiveBefore=(text:string,action:RegExp)=>{
 const operation=text.search(action),cognitive=text.search(/\b(?:explic\w*|describ\w*|analiz\w*|interpret\w*)\b/)
 return operation>=0&&cognitive>=0&&cognitive<operation
}
const computes=(text:string)=>/\b(?:calcul\w*|resuel\w*|resolv\w*|resolver\w*)\b/.test(text)&&!cognitiveBefore(text,/\b(?:calcul\w*|resuel\w*|resolv\w*|resolver\w*)\b/)
const investigates=(text:string)=>/\b(?:investig(?:a|an|ar|ue|uen|aran|ando)|consult\w*)\b|\bproyecto de investigacion\b/.test(text)
const compares=(text:string)=>/\b(?:compar\w*|contrast(?:a|an|ar|e|en|aran|ando))\b/.test(text)
const contrastsHypothesis=(text:string)=>compares(text)&&/hipotesis/.test(text)
const procedure=(text:string)=>!cognitiveBefore(text,/\b(?:realiz\w*|ejecut\w*|desarroll\w*)\b/)&&/\b(?:realiz\w*|ejecut\w*|desarroll\w*)\b(?:(?!\b(?:exposicion|informe|presentacion|sobre)\b)[^.;])*\b(?:practica|experimento|experiencia experimental)\b/.test(text)
const represents=(text:string)=>/\b(?:dibuj\w*|represent\w*|constru\w*|elabor\w*)\b/.test(text)&&/\bdibujo\b|\bmaqueta\b|\bmodelo\b|\besquema\b|\bdibuj\w*\b|\brepresent\w*\b(?!\s+para\b)/.test(text)
export function resolveCommonScienceTask(title:string,description:string,context?:InstrumentAcademicContext|null):CommonScienceTask|null{
 if(context?.level!=='SECONDARY'||context.optativeExitName)return null
 const codes=['NAT-TU','NAT-VIDA','NAT-FISICAS','NAT-BIO','NAT-QUI','NAT-FIS'],code=context.subjectCode.trim().toUpperCase()
 if(code!=='NAT'&&code!==codes[context.grade-1])return null
 const topics=commonScienceTopicsByGrade[context.grade];if(!topics)return null
 const text=scienceRequirementText(description.trim()||title)
 const find=(part:string)=>topics.filter(t=>new RegExp(`\\b(?:${t.match})\\b`).test(part)&&(!t.exclude||!new RegExp(t.exclude).test(part)))
 // A nonempty description never inherits a former title's scientific subject.
 const selected=find(text);if(!selected.length)return null
 const split=new RegExp(`(?:[.;\\n]\\s*|\\s+(?:y|e|luego|despues)\\s+)(?=(?:(?:los estudiantes|cada estudiante)\\s+)?${actionVerb}\\b)`,'g')
 let previous=selected
 const actions=text.split(split).filter(Boolean).map(part=>{const own=find(part);previous=own.length?own:previous;return{text:part,topics:previous}})
 const activityType=actions.some(a=>procedure(a.text))?'LAB_PRACTICE':/\b(?:redact\w*|elabor\w*|escrib\w*)\b.*\binforme\b/.test(text)?'REPORT':investigates(text)?'RESEARCH':/\b(?:debat\w*|debate)\b/.test(text)?'DEBATE':/\b(?:expon\w*|exposicion|presentacion oral)\b/.test(text)?'ORAL_PRESENTATION':actions.some(a=>computes(a.text))?'EXERCISE_SET':/\b(?:elabor\w*|desarroll\w*)\b.*\bproyecto\b/.test(text)?'PROJECT':/\b(?:observ\w*|registr\w*)\b/.test(text)&&!explanation(text)?'OBSERVATION':actions.some(a=>compares(a.text)&&!contrastsHypothesis(a.text))?'COMPARISON':'ANALYSIS'
 const technique=activityType==='LAB_PRACTICE'||activityType==='OBSERVATION'?'observacion-sistematica':activityType==='DEBATE'?'debate':activityType==='ORAL_PRESENTATION'?'presentacion':activityType==='RESEARCH'||activityType==='PROJECT'?'proyecto':'analisis-producciones'
 return{grade:context.grade,actions,activityType,technique}
}
type Levels=ContextualTopicCriterion['progressionLevels']
/** Each row has an observable success condition and distinct, non-personal progression. */
function row(t:CommonScienceTopic,key:string,title:string,success:string,partial:string,error:string,weight=3):ContextualTopicCriterion{
 const progressionLevels:Levels=[success,`${success} Presenta una imprecisión puntual que no cambia la relación principal.`,partial,error,`No aporta evidencia verificable del desempeño solicitado sobre ${t.label}.`]
 return{templateId:`nat-${t.grade}-${t.id}-${key}`,title,observable:success,progressionLevels,weight}
}
function actionCriteria({text,topics}:Action):ContextualTopicCriterion[]{
 const alternatives=text.split(new RegExp(`\\s+(?:o bien|o)\\s+(?=${actionVerb}\\b)`))
 if(alternatives.length>1){
  const branches=alternatives.map(text=>{
   const own=topics.filter(t=>new RegExp(`\\b(?:${t.match})\\b`).test(text))
   return actionCriteria({text,topics:own.length?own:topics})
  })
  const progressionLevels=[0,1,2,3,4].map(level=>`En la alternativa elegida: ${branches.map(rows=>rows.map(r=>r.progressionLevels[level]).join(' ')).join(' O BIEN: ')}`) as Levels
  return[{templateId:`nat-${topics[0].grade}-${topics[0].id}-alternative`,title:'Alternativa científica solicitada',observable:progressionLevels[0],progressionLevels,weight:4}]
 }
 const rows:ContextualTopicCriterion[]=[]
 for(const t of topics){
  const add=(key:string,title:string,success:string,partial:string,error:string,weight=3)=>rows.push(row(t,key,title,success,partial,error,weight))
  const label=t.label,relation=t.relation
  const executing=procedure(text),data=/\b(?:analiz\w*|interpret\w*)\b/.test(text)&&/datos|tabla|grafico|observaciones|resultados/.test(text)
  const hypothesizes=/\b(?:formul\w*|plante\w*)\b.*\bhipotesis\b/.test(text)
  const question=/\b(?:formul\w*|plante\w*)\b.*\bpreguntas?\b/.test(text)
  const report=/\b(?:redact\w*|elabor\w*|escrib\w*)\b.*\binforme\b/.test(text)
  const representation=represents(text)&&!cognitiveBefore(text,/\b(?:dibuj\w*|represent\w*|constru\w*|elabor\w*)\b/)
  const alternative=representation&&/\bdibujo\s+o\s+(?:una?\s+)?maqueta\b|\bmaqueta\s+o\s+(?:una?\s+)?dibujo\b/.test(text)
  if(explanation(text))add('explanation',`Explicación de ${label}`,`Explica ${relation} con afirmaciones científicamente compatibles con la información disponible.`,`Explica parte de ${label}, pero deja sin relacionar un elemento necesario para entender el fenómeno.`,`La explicación de ${label} contradice la relación científica estudiada.`,4)
  if(compares(text)&&!contrastsHypothesis(text))add('comparison',`Comparación de ${label}`,`Compara los casos solicitados de ${label} mediante características científicas comunes, distinguiendo semejanzas y diferencias respaldadas por la información disponible.`,`Describe los casos de ${label}, pero compara con características distintas o deja sin justificar una diferencia.`,`Atribuye semejanzas o diferencias a ${label} que contradicen las características examinadas.`)
  if(contrastsHypothesis(text))add('hypothesis-evidence',`Contraste de hipótesis sobre ${label}`,`Contrasta la hipótesis de ${label} con las evidencias registradas y determina qué respaldan, contradicen o dejan sin resolver, reconociendo resultados inesperados y limitaciones sin exigir su confirmación.`,`Relaciona parte de las evidencias de ${label} con la hipótesis, pero deja una inferencia sin respaldo.`,`Sostiene o rechaza la hipótesis de ${label} sin atender a las evidencias disponibles o cambia las observaciones para ajustarlas a lo esperado.`,4)
  if(/\b(?:identific\w*|senal\w*|rotul\w*)\b/.test(text))add('identification',`Identificación de ${label}`,`Identifica los elementos solicitados de ${label} por sus características observables o las referencias proporcionadas.`,`Identifica parte de los elementos de ${label}, pero confunde una característica que permite distinguirlos.`,`Asigna nombres o características incompatibles con los elementos solicitados de ${label}.`)
  if(/\bclasific\w*\b/.test(text))add('classification',`Clasificación de ${label}`,`Agrupa los elementos solicitados de ${label} aplicando de forma consistente la característica científica que define cada categoría.`,`Clasifica parte de ${label}, pero cambia de característica entre categorías.`,`La clasificación de ${label} contradice las características de los elementos.`)
  if(representation)add('representation',`Representación de ${label}`,`${alternative?'En la alternativa elegida, dibujo o maqueta, representa':'Representa'} los elementos solicitados de ${label} y sus relaciones científicas, conservando ${relation}; los rótulos o referencias permiten reconocerlos sin valorar destreza artística.`,`La representación permite reconocer parte de ${label}, pero omite o confunde una relación solicitada.`,`La representación de ${label} altera la ubicación o relación científica de los elementos solicitados.`,4)
  if(data)add('data-interpretation',`Interpretación de datos de ${label}`,`Interpreta los datos proporcionados de ${label}, relacionando las variaciones o diferencias con ${relation}, y limita las inferencias a la información disponible.`,`Reconoce datos de ${label}, pero una inferencia no queda respaldada por la información proporcionada.`,`La interpretación contradice los datos proporcionados de ${label} o inventa observaciones.`,4)
  if(!data&&/\b(?:analiz\w*|interpret\w*)\b/.test(text))add('analysis',`Análisis de ${label}`,`Analiza la información proporcionada de ${label} y relaciona sus evidencias con ${relation}, distinguiendo lo que permite sostener de lo que queda sin determinar.`,`Reconoce información sobre ${label}, pero no conecta una evidencia necesaria con la relación estudiada.`,`El análisis de ${label} contradice la información proporcionada o le atribuye evidencias ausentes.`,4)
  if(!representation&&/^\s*(?:constru\w*|elabor\w*)\b/.test(text)&&/higrometro|filtro/.test(text))add('construction',`Funcionamiento del dispositivo de ${label}`,`Construye el dispositivo solicitado de ${label} conforme al diseño indicado y comprueba su respuesta en las condiciones propuestas, reconociendo ${relation}.`,`El dispositivo de ${label} conserva parte del diseño, pero una conexión o disposición impide relacionar su respuesta con el propósito indicado.`,`El dispositivo de ${label} no permite observar la respuesta prevista por el diseño indicado.`,4)
  if(/\b(?:elabor\w*|desarroll\w*)\b.*\bproyecto\b/.test(text))add('project',`Coherencia del proyecto de ${label}`,`El producto del proyecto relaciona su propósito de ${label}, la evidencia solicitada y la propuesta presentada, atendiendo a ${relation} sin atribuir acciones no realizadas.`,`El proyecto de ${label} presenta un producto, pero no vincula una decisión con la evidencia solicitada.`,`El producto del proyecto de ${label} no responde a su propósito o se apoya en evidencias inventadas.`,4)
  if(computes(text)){
   add('calculation',`Procedimiento de cálculo de ${label}`,`Relaciona los datos y la incógnita de ${label} mediante ${relation} y realiza las operaciones solicitadas sin inventar valores ausentes.`,`Utiliza parte de los datos de ${label}, pero un paso no mantiene la relación necesaria para resolver la incógnita.`,`El procedimiento emplea una relación incompatible con los datos o la incógnita de ${label}.`,4)
   add('result',`Resultado de ${label}`,`Presenta un resultado coherente con las operaciones de ${label} y conserva las magnitudes y unidades que corresponden a los datos del enunciado.`,`El resultado de ${label} conserva parte del procedimiento, pero una operación o unidad impide interpretarlo por completo.`,`El resultado de ${label} contradice el procedimiento o confunde magnitudes.`,2)
  }
  if(hypothesizes)add('hypothesis',`Hipótesis sobre ${label}`,`Formula una hipótesis contrastable sobre ${label}, relacionando las condiciones y el posible efecto de forma compatible con ${relation}; se evalúa su planteamiento, sin exigir que se confirme.`,`La hipótesis sobre ${label} propone una relación, pero no permite reconocer qué evidencia la contrastaría.`,`La afirmación sobre ${label} no es contrastable o no responde al fenómeno planteado.`)
  if(question)add('question',`Pregunta sobre ${label}`,`Formula una pregunta investigable sobre ${label} que delimita el fenómeno y la evidencia necesaria para responderla.`,`La pregunta se relaciona con ${label}, pero no delimita qué se pretende conocer.`,`La pregunta no se relaciona con el fenómeno de ${label} solicitado.`)
  if(executing){
   add('experiment-procedure',`Procedimiento de la práctica de ${label}`,`Ejecuta el procedimiento indicado para estudiar ${label}, manteniendo las condiciones especificadas y registrando cambios o incidencias que afectan la comparación.`,`Ejecuta parte del procedimiento de ${label}, pero omite una condición indicada que dificulta comparar observaciones.`,`Cambia condiciones esenciales de la práctica de ${label} sin registrarlas, impidiendo relacionar el procedimiento con las observaciones.`,4)
   add('experiment-record',`Registro de observaciones de ${label}`,`Registra fielmente las observaciones de la práctica de ${label}, incluidos resultados inesperados, distinguiendo lo observado de su interpretación, sin inventar resultados.`,`Registra observaciones de ${label}, pero omite información necesaria para relacionarlas con el procedimiento realizado.`,`El registro de ${label} no corresponde al procedimiento observado o sustituye los resultados por lo que esperaba obtener.`)
   // Safety only for an actual practice; no new materials or hazardous instructions.
   add('safety',`Seguridad durante la práctica de ${label}`,`Aplica las precauciones indicadas para la práctica de ${label} y comunica las incidencias observadas antes de continuar cuando exista un riesgo.`,`Aplica parte de las precauciones indicadas en la práctica de ${label}, pero necesita corregir una condición de riesgo.`,`Mantiene una condición de riesgo identificada en la práctica de ${label} sin aplicar la precaución indicada.`,2)
  }
  if(/\b(?:observ\w*|registr\w*|describ\w*)\b/.test(text)&&!executing&&!data)add('observation',`Observación de ${label}`,`Describe o registra las características observadas de ${label}, diferenciándolas de inferencias y manteniendo las condiciones expresamente solicitadas.`,`Registra parte de las características de ${label}, pero mezcla una inferencia con lo observado.`,`El registro de ${label} contradice la evidencia observada o aporta datos inventados.`)
  if(investigates(text)&&!/^\s*(?:explic\w*|describ\w*)\b/.test(text))add('research',`Investigación de ${label}`,`Selecciona información verificable que responde a la investigación solicitada sobre ${label}, identifica su procedencia y distingue afirmaciones respaldadas de información insuficiente.`,`Reúne información de ${label}, pero una afirmación relevante carece de procedencia o respaldo verificable.`,`La información presentada sobre ${label} no responde a la investigación o contradice las fuentes examinadas.`,4)
  if(report)add('report',`Informe sobre ${label}`,`Organiza el informe solicitado de ${label} enlazando propósito, evidencia disponible e interpretación, distinguiendo procedimientos propios de datos o experiencias proporcionados.`,`El informe de ${label} presenta evidencia, pero no permite relacionar una interpretación con su procedencia.`,`El informe de ${label} atribuye procedimientos o resultados no realizados ni proporcionados.`,4)
  if(/\b(?:debat\w*|argument\w*)\b/.test(text))add('argument',`Argumentación sobre ${label}`,`Sustenta la postura solicitada sobre ${label} con evidencias pertinentes y distingue sus alcances de afirmaciones que la información disponible no permite sostener.`,`Presenta una postura sobre ${label}, pero parte de sus razones carece de respaldo pertinente.`,`La postura sobre ${label} se apoya en afirmaciones incompatibles con las evidencias examinadas.`,4)
  if(/\b(?:expon\w*|presentacion oral|exposicion)\b/.test(text))add('oral',`Comunicación científica de ${label}`,`Comunica oralmente ${relation} en una secuencia comprensible y utiliza los términos científicos necesarios o los apoyos de acceso acordados.`,`Comunica ideas sobre ${label}, pero una relación queda ambigua por su organización o por el uso de términos.`,`La comunicación de ${label} no permite reconocer la relación científica solicitada.`)
  if(!rows.some(r=>r.templateId.startsWith(`nat-${t.grade}-${t.id}-`)))add('content',`Relaciones de ${label}`,`Presenta evidencia de ${relation} pertinente al producto solicitado y científicamente compatible con la información disponible.`,`Presenta parte de ${label}, pero omite una relación necesaria para entender la evidencia.`,`La evidencia de ${label} contradice la relación científica estudiada.`)
 }
 return rows
}
export function commonScienceCriteria(task:CommonScienceTask){
 const actions=task.actions.map(a=>({...a,topics:a.topics.flatMap(t=>{
  const facets=t.facets?.filter(f=>new RegExp(f.match).test(a.text))
  return facets?.length?facets.map(f=>({...t,id:`${t.id}-${f.id}`,label:f.label,relation:f.relation,facets:undefined})):[t]
 })}))
 const rows=actions.flatMap(actionCriteria)
 return rows.filter((r,i)=>rows.findIndex(o=>o.templateId===r.templateId)===i)
  .filter(r=>!r.templateId.endsWith('-observation')||!rows.some(o=>o.templateId===r.templateId.replace(/-observation$/,'-experiment-record')))
}
export function commonScienceSelections(task:CommonScienceTask,description:string){
 const text=scienceRequirementText(description)
 const suggestedInstrumentType:InstrumentType=/credito parcial|ponder\w*|puntos por|pesos por/.test(text)?'lista-ponderada':/frecuencia|regularidad/.test(text)&&task.actions.some(a=>procedure(a.text)||/observ\w*|registr\w*/.test(a.text))?'escala':task.actions.some(a=>explanation(a.text)||/compar\w*|analiz\w*|interpret\w*|hipotesis|argument\w*|investig\w*/.test(a.text))?'rubrica':'lista-cotejo'
 return{suggestedInstrumentType,suggestedEvaluationTechnique:task.technique}
}
export function adaptScienceScale(proposal:InstrumentRecommendation,description:string):InstrumentRecommendation{
 if(proposal.instrumentType!=='escala')return proposal
 const text=scienceRequirementText(description),frequency=/frecuencia|regularidad/.test(text)&&/observ\w*|registr\w*/.test(text)
 const indexes=proposal.levels.length===4?[0,1,2,4]:[0,1,2,3,4]
 const labels=frequency?['Siempre','Frecuentemente','A veces','Rara vez','Todavía no']:['Completo','Suficiente','Parcial','Incipiente','Aún no logrado']
 const descriptors=['En todas las oportunidades observadas.','En la mayoría de las oportunidades observadas.','En algunas oportunidades observadas.','En pocas oportunidades observadas.','En ninguna oportunidad observada.']
 return{...proposal,levels:proposal.levels.map((l,i)=>({...l,label:labels[indexes[i]]})),criteria:proposal.criteria.map(c=>({...c,descriptors:c.descriptors.map((d,i)=>({...d,text:frequency?descriptors[indexes[i]]:c.progressionLevels?.[indexes[i]]??d.text}))}))}
}
