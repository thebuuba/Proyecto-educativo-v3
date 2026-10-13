import { normalize } from '../../curriculum-context'
import type { AuthoredCriterion } from './types'

export function secondGradeNewsCriteria(activityType: string, description: string): AuthoredCriterion[] {
  const task = normalize(description)
  const topic = description.match(/noticias?\s+sobre\s+([^,.;]+)/i)?.[1]?.replace(/\s+(?:y|para)\s+(?:explic|identific|justific|analiz|present|redact)\w*.*$/i, '').trim()
  const subject = topic ? ` sobre ${topic}` : ''
  const item = (templateId: string, title: string, observable: string, weight: number, progression: [string, string, string]): AuthoredCriterion =>
    ({ templateId, title, observable, weight, progression })
  if (activityType === 'REPORT') return [
    item('news-report-purpose', 'Propósito del informe sobre la noticia', `Presenta el hecho de la noticia${subject} y explica el propósito de su informe.`, 4,
      ['Presenta el hecho y el propósito, aunque deja un detalle sin precisar.', 'Menciona el hecho sin explicar el propósito del informe.', 'No identifica aún el hecho ni el propósito del informe.']),
    item('news-report-analysis', 'Análisis de la información noticiosa', 'Explica la información principal y distingue datos de interpretaciones propias.', 5,
      ['Explica la información principal con una distinción parcial entre dato e interpretación.', 'Recoge datos aislados sin analizarlos.', 'No aporta todavía un análisis reconocible de la noticia.']),
    item('news-report-evidence', 'Evidencias de la noticia', 'Sustenta el análisis con datos o fragmentos pertinentes de la noticia, sin inventar hechos.', 4,
      ['Apoya la mayor parte del análisis con evidencias pertinentes.', 'Incluye una referencia que no sustenta claramente su análisis.', 'No presenta evidencias verificables de la noticia.']),
    item('news-report-structure', 'Organización del informe', 'Organiza introducción, desarrollo y conclusión en una secuencia comprensible.', 4,
      ['Organiza las secciones principales, aunque una necesita mayor desarrollo.', 'Presenta secciones incompletas o desordenadas.', 'No organiza todavía el informe en partes reconocibles.']),
    item('news-report-review', 'Claridad y revisión del informe', 'Revisa la coherencia, puntuación, ortografía y precisión del informe.', 3,
      ['Corrige la mayoría de los errores; quedan detalles menores.', 'Conserva errores que dificultan partes del informe.', 'No revisa los errores que impiden comprender el informe.']),
  ]
  if (activityType === 'DEBATE') return [
    item('news-debate-fact', 'Comprensión del hecho noticioso', `Explica el hecho debatido${subject} y distingue información de opiniones.`, 4,
      ['Explica el hecho principal, aunque confunde un dato con una opinión.', 'Menciona el tema sin precisar el hecho debatido.', 'No identifica el hecho de la noticia.']),
    item('news-debate-arguments', 'Argumentos sobre la noticia', 'Defiende su postura con razones relacionadas con el hecho presentado.', 5,
      ['Sostiene su postura con razones pertinentes, aunque alguna queda poco desarrollada.', 'Expresa una postura sin desarrollar razones suficientes.', 'No formula una postura argumentada.']),
    item('news-debate-evidence', 'Uso de evidencias', 'Apoya sus argumentos con información verificable de la noticia, sin inventar datos.', 5,
      ['Usa datos pertinentes para apoyar la mayoría de sus argumentos.', 'Alude a la noticia sin relacionar el dato con su argumento.', 'No aporta evidencia de la noticia.']),
    item('news-debate-response', 'Respuesta a otras posturas', 'Escucha otras posturas y responde a sus argumentos sin apartarse del hecho debatido.', 3,
      ['Responde a una postura distinta, aunque su réplica queda incompleta.', 'Repite su postura sin atender el argumento contrario.', 'No responde a las otras posturas.']),
    item('news-debate-participation', 'Participación y claridad', 'Interviene con orden, tono adecuado y respeto por los turnos.', 3,
      ['Interviene con claridad y respeta la mayoría de los turnos.', 'Interviene sin orden o interrumpe el intercambio.', 'No participa de forma que permita valorar su postura.']),
  ]
  if (activityType === 'NEWSCAST') return [
    item('news-oral-content', 'Contenido de la noticia presentada', `Comunica el hecho principal${subject} sin añadir información no sustentada.`, 5,
      ['Comunica el hecho principal, aunque omite un dato relevante.', 'Presenta datos aislados que dificultan comprender el hecho.', 'No comunica el hecho central de la noticia.']),
    item('news-oral-questions', 'Interrogantes de la noticia', 'Explica qué ocurrió, a quién, dónde, cuándo y cómo, según la información disponible.', 5,
      ['Responde la mayoría de las preguntas con datos de la noticia.', 'Responde solo algunas preguntas o confunde sus datos.', 'No responde las preguntas fundamentales.']),
    item('news-oral-organization', 'Organización de la presentación', 'Ordena titular, entrada y desarrollo en una secuencia comprensible para la audiencia.', 4,
      ['Presenta una secuencia clara, aunque una transición necesita precisión.', 'Altera el orden y dificulta seguir la noticia.', 'No organiza la presentación de la noticia.']),
    item('news-oral-clarity', 'Claridad oral', 'Usa dicción, ritmo, pausas y volumen que permiten comprender la noticia.', 3,
      ['Se comprende la mayor parte, con leves problemas de ritmo o volumen.', 'La dicción o el volumen impiden comprender fragmentos importantes.', 'La presentación no permite comprender el contenido.']),
    item('news-oral-command', 'Dominio del contenido', 'Explica la noticia con sus palabras y responde preguntas sobre el hecho presentado.', 3,
      ['Explica el hecho con sus palabras y responde la mayoría de las preguntas.', 'Depende de la lectura y responde solo preguntas simples.', 'No demuestra comprensión del hecho presentado.']),
  ]
  if (activityType === 'NEWS_COMPARISON') return [
    item('news-comparison-facts', 'Hecho y propósito de ambas noticias', `Identifica el hecho y el propósito informativo de cada noticia${subject}.`, 4,
      ['Identifica los hechos principales, aunque precisa poco un propósito.', 'Reconoce el hecho de una noticia y confunde el de la otra.', 'No identifica los hechos comparados.']),
    item('news-comparison-data', 'Semejanzas y diferencias', 'Compara datos y enfoques de ambas noticias sin confundirlos.', 5,
      ['Establece semejanzas y diferencias principales con una omisión menor.', 'Enumera datos sin establecer una comparación clara.', 'No distingue semejanzas ni diferencias.']),
    item('news-comparison-structure', 'Estructura periodística', 'Contrasta el titular, la entrada y el cuerpo de los dos textos.', 4,
      ['Contrasta las partes principales, aunque omite una diferencia.', 'Identifica partes de un solo texto o las confunde.', 'No reconoce la estructura de las noticias.']),
    item('news-comparison-evidence', 'Evidencias de ambos textos', 'Justifica la comparación con información concreta de las dos noticias.', 4,
      ['Usa evidencias de ambas noticias, aunque una relación queda poco explicada.', 'Se apoya en una sola noticia o en ejemplos generales.', 'No aporta evidencias de los textos.']),
    item('news-comparison-conclusion', 'Conclusión comparativa', 'Formula una conclusión coherente con las semejanzas y diferencias identificadas.', 3,
      ['La conclusión se relaciona con la comparación, aunque omite un hallazgo.', 'La conclusión expresa una opinión sin relación clara con la comparación.', 'No formula una conclusión comparativa.']),
  ]
  if (activityType === 'NEWS_ANALYSIS') return [
    item('news-analysis-purpose', 'Intención comunicativa de la noticia', `Explica el propósito informativo y el hecho central de la noticia${subject}.`, 4,
      ['Explica el propósito y el hecho, aunque deja un detalle sin precisar.', 'Menciona el tema sin distinguir el hecho del propósito.', 'No reconoce el propósito informativo de la noticia.']),
    item('news-analysis-questions', 'Interrogantes fundamentales', 'Localiza qué ocurrió, a quién, dónde, cuándo y cómo, según el texto.', 5,
      ['Localiza la mayoría de las respuestas en el texto.', 'Identifica algunas respuestas, pero confunde datos importantes.', 'No localiza las respuestas fundamentales.']),
    item('news-analysis-structure', 'Estructura y marcas del texto', 'Identifica titular, entrada y cuerpo, y usa las marcas paratextuales presentes para anticipar el contenido.', 4,
      ['Reconoce las partes principales, aunque aprovecha poco las marcas presentes.', 'Confunde las partes o interpreta las marcas sin apoyo textual.', 'No reconoce la estructura de la noticia.']),
    item('news-analysis-interpretation', 'Interpretación de la información', 'Explica la información principal e infiere significados a partir del contexto.', 4,
      ['Explica la idea principal con una inferencia parcialmente sustentada.', 'Repite datos aislados sin reconstruir el sentido del texto.', 'No explica la información central de la noticia.']),
    item('news-analysis-evidence', 'Evidencias de la noticia', 'Justifica sus respuestas con datos o fragmentos pertinentes del texto.', 3,
      ['Apoya la mayor parte de sus respuestas con el texto.', 'Cita un dato sin relacionarlo claramente con su respuesta.', 'No sustenta sus respuestas en la noticia.']),
  ]
  const grammarRequested = /coordinad|subordinad|sinonim|pluscuamperfect|preterito perfecto/.test(task)
  return [
    item('news-writing-facts', 'Información esencial de la noticia', `Redacta el hecho noticioso${subject} y responde qué ocurrió, a quién, dónde, cuándo y cómo, según la información disponible.`, 5,
      ['Incluye el hecho y la mayoría de los datos fundamentales.', 'Presenta datos aislados o confunde una respuesta fundamental.', 'No comunica el hecho ni sus datos esenciales.']),
    item('news-writing-structure', 'Titular, entrada y cuerpo', 'Organiza un titular pertinente, una entrada informativa y un cuerpo que desarrolla el hecho.', 5,
      ['Presenta las tres partes, aunque una necesita mayor desarrollo.', 'Omite una parte o mezcla los datos de entrada y cuerpo.', 'No organiza la noticia en partes reconocibles.']),
    item('news-writing-cohesion', 'Secuencia y cohesión', 'Ordena las oraciones y los párrafos para que la información avance con claridad.', 4,
      ['La secuencia es comprensible, aunque hay una transición imprecisa.', 'El orden de las oraciones dificulta seguir parte del hecho.', 'No construye una secuencia comprensible.']),
    item('news-writing-language', 'Precisión del lenguaje periodístico', grammarRequested
      ? 'Emplea vocabulario preciso y las formas gramaticales solicitadas en la consigna, sin alterar el hecho.'
      : 'Emplea vocabulario preciso y un registro informativo adecuado al hecho narrado.', 3,
      ['El lenguaje comunica el hecho con una imprecisión menor.', 'La imprecisión del vocabulario altera parte de la información.', 'El lenguaje no permite comprender el hecho narrado.']),
    item('news-writing-review', 'Revisión de la noticia', 'Revisa la claridad, puntuación y ortografía antes de presentar la versión final.', 3,
      ['Corrige la mayoría de los errores, aunque quedan detalles menores.', 'Conserva errores que dificultan partes de la noticia.', 'No revisa los errores que impiden comprender la noticia.']),
  ]
}
