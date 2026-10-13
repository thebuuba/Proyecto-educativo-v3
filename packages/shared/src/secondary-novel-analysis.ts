import {resolveEvaluationTask} from './evaluation-task-contract'
import type {SecondaryTopicContext} from './secondary-language-topics'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'

// Task-derived adaptation: the complete official novel module is still pending.
export const novelAnalysisModule={id:'novela-analisis-fragmento',grade:5,subjectCode:'LEN',status:'PARTIAL_TASK_DERIVED_ANALYSIS',policy:'STUDIED_TEXT_SEPARATE_FROM_DELIVERED_PRODUCT'}
const row=(id:string,title:string,weight:number,levels:ContextualTopicCriterion['progressionLevels']):ContextualTopicCriterion=>({templateId:`novel-analysis-${id}`,title,weight,observable:levels[0],progressionLevels:levels})

export function secondaryNovelAnalysisCriteria(title:string,description:string,context:SecondaryTopicContext|null|undefined,activity:string,additional=false):ContextualTopicCriterion[] {
  if(context?.level!=='SECONDARY'||context.grade!==5||context.subjectCode.trim().toUpperCase()!=='LEN'||context.optativeExitName) return []
  const contract=resolveEvaluationTask(title,description),task=contract.task
  if(!/\bnovelas?\s+(?:policiacas?|policiales?|detectivescas?)\b/.test(task)) return []
  const analytic=/\b(?:analiz\w*|analisis|interpret\w*|leer\w*|lectura)\b/.test(task)
  // Broad manual labels describe the delivery; they do not turn an analysis into fiction.
  if(!['ANALYSIS','REPORT','WRITTEN_PRODUCTION','ORAL_PRESENTATION','EXPOSITION'].includes(activity)||!analytic||contract.product==='NARRATIVE') return []
  const source=contract.fragment?'fragmento':'texto proporcionado'
  const rows:ContextualTopicCriterion[]=[]
  const elements=new Intl.ListFormat('es').format([/personajes/.test(task)?'los personajes principales y secundarios':null,/ambiente/.test(task)?'el ambiente':null,/conflicto/.test(task)?'el conflicto':null].filter((value):value is string=>Boolean(value)))
  if(elements) rows.push(row('elements','Personajes, ambiente y conflicto',4,[
    `Relaciona ${elements} y explica cómo sus relaciones contribuyen al misterio en el ${source}.`,
    `Reconoce ${elements} y explica su relación con el misterio; queda un vínculo sin desarrollar.`,
    `Identifica elementos del ${source}, pero los enumera sin explicar cómo se relacionan con el conflicto.`,
    `Confunde relaciones entre los elementos y atribuye acciones que contradicen el ${source}.`,
    `No identifica los elementos solicitados ni los relaciona con el conflicto del ${source}.`,
  ]))
  if(/pistas|investigador/.test(task)) rows.push(row('clues','Pistas y actuación del investigador',5,[
    `Explica la relación entre las pistas y las decisiones del investigador, sustentándola con evidencias pertinentes del ${source}.`,
    `Explica las pistas principales y su relación con la investigación; alguna conexión con las decisiones queda poco desarrollada.`,
    `Identifica algunas pistas, pero explica débilmente cómo orientan la investigación.`,
    `Atribuye a las pistas efectos incompatibles con las decisiones del investigador en el ${source}.`,
    `Confunde las pistas o no explica su relación con la investigación.`,
  ]))
  if(/secuencia|acontecimientos|desarrolla.*misterio|resolucion/.test(task)) rows.push(row('sequence','Secuencia y desarrollo del misterio',4,[
    `Relaciona la secuencia de acontecimientos con el desarrollo del misterio y explica la resolución hasta donde permite la información disponible en el ${source}.`,
    `Reconstruye los acontecimientos y el avance del misterio con la información disponible; una relación causal queda sin explicar.`,
    `Ordena algunos acontecimientos, pero resume hechos sin explicar cómo hacen avanzar el misterio.`,
    `Confunde el orden o las causas de los acontecimientos y atribuye una resolución que no se sostiene en la información disponible.`,
    `No reconstruye una secuencia reconocible ni explica el desarrollo del misterio con la información disponible.`,
  ]))
  if(/interpret|justific|evidencia|conclu/.test(task)) rows.push(row('interpretation','Interpretación sustentada en la lectura',5,[
    `Formula una interpretación personal y justifica sus conclusiones explicando cómo las evidencias del ${source} las sostienen.`,
    `Presenta una interpretación apoyada en evidencias pertinentes; una conclusión necesita una conexión más clara con ellas.`,
    `Presenta una opinión y menciona hechos del ${source}, pero explica débilmente cómo sostienen sus conclusiones.`,
    `La interpretación contradice las evidencias aportadas o se apoya en hechos ajenos al ${source}.`,
    `No presenta una interpretación sustentada en evidencias de la lectura.`,
  ]))
  if(/escrito|por escrito|redact/.test(task)) rows.push(row('writing','Claridad y corrección del análisis escrito',2,[
    'Redacta un análisis comprensible, enlaza sus ideas y emplea vocabulario, puntuación y ortografía que permiten distinguir hechos e interpretación.',
    'El análisis permite seguir las ideas y distinguir hechos e interpretación; presenta errores aislados que no alteran el sentido.',
    'El análisis comunica algunas ideas, pero los enlaces ambiguos o los errores dificultan relacionarlas.',
    'La organización de las frases y los errores alteran el sentido de partes centrales del análisis.',
    'No presenta un análisis escrito suficientemente comprensible para reconocer las ideas y sus relaciones.',
  ]))
  if(additional&&contract.fragment&&/interpret|conclu/.test(task)) rows.push(row('limits','Distinción entre hechos e hipótesis',2,[
    'Distingue lo que el fragmento afirma de sus hipótesis e indica qué no puede concluirse con la información disponible.',
    'Diferencia hechos e hipótesis, aunque deja sin aclarar el límite de una afirmación.',
    'Reconoce datos del fragmento, pero presenta algunas hipótesis como hechos confirmados.',
    'Afirma como comprobados hechos que el fragmento no permite conocer.',
    'No distingue información del fragmento de suposiciones sobre la obra.',
  ]))
  return rows
}
