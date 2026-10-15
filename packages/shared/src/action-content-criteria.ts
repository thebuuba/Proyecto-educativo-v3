import {resolveEvaluationTask} from './evaluation-task-contract'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'

/** Honest action-level fallback, not thematic curriculum coverage. */
export function actionContentCriteria(activity:string,description:string):ContextualTopicCriterion[] {
  const contract=resolveEvaluationTask('',description)
  if(activity==='EXERCISE_SET'&&/\b(?:suma|resta)\b/.test(contract.task)){
    const operations=[/\bsuma\b/.test(contract.task)?'suma':'',/\bresta\b/.test(contract.task)?'resta':''].filter(Boolean).join(' y ')
    return [
      {templateId:'task-exercise-procedure',title:'Procedimiento de las operaciones solicitadas',weight:4,observable:`Aplica los procedimientos de ${operations} a los datos de los ejercicios solicitados.`,progressionLevels:[
        `Aplica los procedimientos de ${operations} a los datos de los ejercicios solicitados.`,
        `El procedimiento de ${operations} corresponde a los ejercicios; un paso aislado necesita corrección.`,
        `Inicia el procedimiento de ${operations}, pero deja pasos sin completar en los ejercicios.`,
        'Emplea una operación distinta o transforma los datos de modo que cambia el ejercicio.',
        'No aporta un procedimiento reconocible para las operaciones solicitadas.',
      ]},
      {templateId:'task-exercise-results',title:'Resultados de los ejercicios',weight:4,observable:`Obtiene los resultados de ${operations} conservando los datos y signos de cada ejercicio.`,progressionLevels:[
        `Obtiene los resultados de ${operations} conservando los datos y signos de cada ejercicio.`,
        'Los resultados corresponden a los datos; aparece un error aislado de cálculo.',
        'Obtiene parte de los resultados, pero varios cálculos quedan incompletos o contienen errores.',
        'Los errores de cálculo o de signo cambian los resultados de los ejercicios realizados.',
        'No presenta resultados que permitan valorar los ejercicios solicitados.',
      ]},
    ]
  }
  if(activity==='COMPARISON')return [
    {templateId:'task-comparison-relations',title:'Semejanzas y diferencias de los materiales',weight:4,observable:'Contrasta los materiales indicados mediante semejanzas y diferencias referidas a los aspectos de la consigna.',progressionLevels:[
      'Contrasta los materiales indicados mediante semejanzas y diferencias referidas a los aspectos de la consigna.',
      'Establece semejanzas y diferencias pertinentes; una relación necesita precisión.',
      'Describe los materiales por separado y deja sin establecer parte de las relaciones solicitadas.',
      'Las relaciones atribuyen a un material información que corresponde a otro.',
      'No establece semejanzas ni diferencias comprobables entre los materiales indicados.',
    ]},
    {templateId:'task-comparison-evidence',title:'Información que sustenta el contraste',weight:3,observable:'Sustenta el contraste con información identificable en los materiales indicados, sin añadir datos ajenos.',progressionLevels:[
      'Sustenta el contraste con información identificable en los materiales indicados, sin añadir datos ajenos.',
      'La información respalda el contraste principal; una relación entre información y comparación queda por aclarar.',
      'Incluye información pertinente, pero no muestra cómo respalda varias de las relaciones propuestas.',
      'La información citada contradice el contraste o no corresponde a los materiales indicados.',
      'No aporta información de los materiales que permita comprobar el contraste.',
    ]},
  ]
  const analysis=activity==='ANALYSIS'||(['WRITTEN_PRODUCTION','REPORT'].includes(activity)&&contract.product==='ANALYTICAL_TEXT')
  const report=activity==='REPORT'&&!analysis
  if(!analysis&&!report) return []
  if(report&&/\binforme de lectura\b/.test(contract.task))return [
    {templateId:'task-reading-report-summary',title:'Síntesis del texto leído',weight:4,observable:'Resume las ideas principales del texto leído y conserva las relaciones necesarias para comprender su sentido.',progressionLevels:[
      'Resume las ideas principales del texto leído y conserva las relaciones necesarias para comprender su sentido.',
      'El resumen conserva las ideas principales; una relación necesita precisión.',
      'Recupera ideas aisladas, pero omite relaciones necesarias para comprender el texto.',
      'La síntesis cambia información del texto o incorpora datos ajenos.',
      'No presenta una síntesis reconocible del texto leído.',
    ]},
    {templateId:'task-reading-report-interpretation',title:'Interpretación sustentada en el texto',weight:4,observable:'Relaciona su interpretación con información identificable en el texto leído, distinguiéndola de su resumen.',progressionLevels:[
      'Relaciona su interpretación con información identificable en el texto leído, distinguiéndola de su resumen.',
      'La interpretación se relaciona con el texto; una relación con la información necesita aclaración.',
      'Menciona ideas del texto sin establecer cómo sustentan la interpretación.',
      'La interpretación contradice información del texto o la presenta como un hecho diferente.',
      'No presenta una interpretación apoyada en información del texto.',
    ]},
  ]
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
