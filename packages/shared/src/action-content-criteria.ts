import {resolveEvaluationTask} from './evaluation-task-contract'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'

/** Honest action-level fallback, not thematic curriculum coverage. */
export function actionContentCriteria(activity:string,description:string):ContextualTopicCriterion[] {
  const contract=resolveEvaluationTask('',description)
  const analysis=activity==='ANALYSIS'||(['WRITTEN_PRODUCTION','REPORT'].includes(activity)&&contract.product==='ANALYTICAL_TEXT')
  const report=activity==='REPORT'&&!analysis
  if(!analysis&&!report) return []
  const prefix=analysis?'task-analysis':'task-report'
  const make=(id:string,title:string,weight:number,levels:ContextualTopicCriterion['progressionLevels']):ContextualTopicCriterion=>({templateId:`${prefix}-${id}`,title,weight,observable:levels[0],progressionLevels:levels})
  return [
    make('focus',analysis?'Identificación de los aspectos analizados':'Propósito y procedimiento de la investigación',4,analysis?[
      'Identifica los aspectos solicitados y diferencia la información pertinente de la que no responde al análisis.',
      'Identifica los aspectos principales; una selección incluye información poco pertinente.',
      'Recupera información aislada, pero omite aspectos necesarios para el análisis.',
      'Confunde los aspectos solicitados con información ajena al problema o material.',
      'No identifica información que permita abordar los aspectos solicitados.',
    ]:[
      'Expone la pregunta o propósito del informe y describe el procedimiento empleado para obtener la información.',
      'Expone el propósito y el procedimiento; un paso queda sin precisar.',
      'Menciona el propósito, pero omite pasos necesarios para comprender cómo obtuvo la información.',
      'El procedimiento descrito no permite responder al propósito planteado.',
      'No permite reconocer el propósito ni el procedimiento utilizado.',
    ]),
    make('reasoning',analysis?'Explicación de relaciones':'Análisis de resultados',5,analysis?[
      'Explica las relaciones entre los aspectos analizados y justifica cómo llega a su interpretación o explicación.',
      'Explica las relaciones principales; una conexión del razonamiento queda sin desarrollar.',
      'Enumera aspectos sin explicar suficientemente sus relaciones.',
      'Presenta relaciones que contradicen la información disponible.',
      'No explica relaciones entre los aspectos analizados.',
    ]:[
      'Relaciona los resultados obtenidos con la pregunta investigada y distingue los datos de su interpretación.',
      'Relaciona los resultados principales con la pregunta; una interpretación queda sin justificar.',
      'Presenta resultados, pero explica débilmente qué aportan a la pregunta.',
      'La interpretación contradice los resultados que presenta.',
      'No comunica resultados que permitan valorar la investigación.',
    ]),
    make('support','Sustento de las conclusiones',4,[
      'Vincula sus conclusiones con datos, ejemplos o información pertinente del material disponible.',
      'Sustenta las conclusiones principales; una conexión con la información necesita aclaración.',
      'Menciona información, pero no explica cómo respalda sus conclusiones.',
      'Las conclusiones contradicen la información aportada.',
      'No aporta información que permita sostener sus conclusiones.',
    ]),
    make('communication','Claridad de la explicación',2,[
      'Comunica las ideas en una secuencia comprensible y usa términos que permiten seguir el razonamiento.',
      'Se comprende la explicación; una expresión o transición queda ambigua.',
      'Se entienden ideas aisladas, pero faltan vínculos para seguir la explicación.',
      'La secuencia o el vocabulario alteran el sentido de las ideas principales.',
      'No comunica una explicación que permita reconocer el razonamiento.',
    ]),
  ]
}
