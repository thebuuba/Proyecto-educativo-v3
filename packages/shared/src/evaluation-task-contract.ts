import {normalizedTask} from './evaluation-task-text'

/** The studied object and the delivered product are different roles in a task. */
export function resolveEvaluationTask(title:string,description:string) {
  const task=normalizedTask(description || title)
  const analyticProduct=/\b(?:elabor\w*|redact\w*|escrib\w*|prepar\w*|present\w*|entreg\w*)\s+(?:por escrito\s+)?(?:(?:un|una|el|la|su)\s+)?(?:analisis|interpretacion|comentario)(?:\s+(?:escrito|personal|critico|literario))?\b/.test(task)
    || /\bpreguntas\s+para\s+analiz\w*\b/.test(task)
    || /\b(?:analiz\w*|interpret\w*)\b.*\b(?:present\w*|entreg\w*|elabor\w*)\s+(?:(?:un|el|su)\s+)?(?:informe|trabajo escrito)\b/.test(task)
  const writtenExplanation=/\bexplicacion\s+escrita\b|\bexplic\w*\s+por\s+escrito\b/.test(task)
  const report=/\b(?:elabor\w*|redact\w*|escrib\w*|prepar\w*|entreg\w*|hacen|hace|hacer|hagan|haga|hagamos|haced|haz|haran)\s+(?:(?:un|el|su)\s+)?(?:informe|trabajo escrito)\b/.test(task)
  const creation=/\b(?:escrib\w*|redact\w*|cre\w*|elabor\w*)\s+(?:(?:un|una|el|la|su)\s+)?(?:narracion|novela|cuento)\b/.test(task)
  const oral=/\boralmente\b|\b(?:exposicion|presentacion|comentario|produccion)\s+(?:sera\s+)?oral\b|\bexpon(?:dr\w*|er\w*|en|e)\b|\b(?:present\w*|explic\w*)\b.*\bante\s+(?:(?:sus|los)\s+)?(?:companeros|audiencia|publico)\b/.test(task)
  const comparison=/\b(?:compar(?:an|en|ar|aran)|contrast(?:an|en|ar|aran))\b/.test(task)
  const exercises=/\b(?:resuelv(?:en|an|e|a)|resolv\w*|resolver\w*)\b.*\bejercicios?\b/.test(task)
  const action=creation?'WRITTEN_PRODUCTION':analyticProduct?'ANALYSIS':report?'REPORT':writtenExplanation?'ANALYSIS':comparison?'COMPARISON':exercises?'EXERCISE_SET':null
  return {action,product:creation?'NARRATIVE':analyticProduct?'ANALYTICAL_TEXT':report?'REPORT':writtenExplanation?'WRITTEN_EXPLANATION':null,
    oral,fragment:/\bfragmento\b/.test(task),task}
}
