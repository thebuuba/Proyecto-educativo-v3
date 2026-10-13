import { rawFirstGradeReadingReportCriteria } from './secondary-topics/language/reading-report-grade-1-core'
import { normalizedTask } from './secondary-language-topics'
import type { ContextualTopicCriterion } from './secondary-topic-criteria'

type LowerEvidence = [string, string, string, string]
const evidence: Record<string, LowerEvidence[]> = {
  READING_REPORT_WRITING: [
    ['El resumen conserva las ideas principales; omite un detalle secundario.', 'Recupera hechos o ideas aislados, pero omite relaciones necesarias para comprender el texto.', 'El resumen altera hechos importantes o añade datos que no pertenecen al texto.', 'No presenta una síntesis reconocible del texto leído.'],
    ['La interpretación se relaciona con el texto; un ejemplo necesita mayor explicación.', 'Propone una interpretación y menciona ejemplos sin explicar cómo la apoyan.', 'La interpretación contradice las acciones o información del texto.', 'No presenta una interpretación sustentada del texto.'],
    ['Las partes del informe son reconocibles; una sección necesita desarrollo.', 'El resumen o análisis se presentan, pero faltan partes necesarias para relacionarlos.', 'La organización confunde el resumen con la interpretación o contradice la conclusión.', 'No organiza un informe de lectura reconocible.'],
    ['La relación entre resumen y análisis se comprende; un enlace necesita precisión.', 'Presenta ideas aisladas y los conectores no aclaran su relación.', 'Las formas verbales o conectores cambian el sentido de los hechos o la interpretación.', 'No se reconoce una relación comprensible entre las ideas del informe.'],
    ['La versión final permite comprender el informe, con errores menores.', 'Conserva problemas de claridad, puntuación u ortografía que dificultan algunos pasajes.', 'Los errores de la versión final cambian datos importantes del texto o la interpretación.', 'La versión final no permite comprender el contenido del informe.'],
  ],
  READING_REPORT_ANALYSIS: [
    ['Explica el propósito y reconoce la obra abordada con una imprecisión menor.', 'Identifica la obra o el propósito, pero no explica su relación con el informe.', 'Atribuye al informe un propósito o una obra que no le corresponden.', 'No identifica el propósito ni el texto abordado por el informe.'],
    ['Localiza las partes presentes; una delimitación necesita precisión.', 'Identifica algunas partes, pero confunde sus funciones en el informe.', 'Atribuye contenido del resumen al análisis o de la conclusión a otra sección.', 'No identifica partes reconocibles del informe.'],
    ['Reconoce las ideas principales recuperadas por el resumen; un dato necesita precisión.', 'Identifica algunos hechos del resumen sin relacionarlos con las ideas centrales.', 'Confunde opiniones del análisis con acontecimientos recuperados por el resumen.', 'No reconoce información del resumen del informe.'],
    ['Explica la interpretación del informe; una relación con el texto necesita precisión.', 'Menciona una interpretación sin explicar cómo se sustenta en el informe.', 'La explicación atribuye al informe una interpretación ausente o contraria a sus datos.', 'No explica una interpretación reconocible del informe analizado.'],
    ['Los datos del informe apoyan la respuesta; una relación queda implícita.', 'Cita información del informe sin explicar qué respuesta sustenta.', 'La información citada contradice su respuesta o no aparece en el informe.', 'No aporta información del informe para sustentar sus respuestas.'],
  ],
  READING_REPORT_COMPARISON: [
    ['Contrasta propósitos y obras abordadas con una imprecisión menor.', 'Identifica el propósito o texto de un informe sin contrastarlo con el otro.', 'Confunde las obras o propósitos de los informes comparados.', 'No reconoce los textos ni propósitos que compara.'],
    ['Contrasta la organización de ambos informes; una diferencia necesita precisión.', 'Identifica partes de ambos informes sin explicar cómo se organizan de manera semejante o distinta.', 'Confunde las partes y formula un contraste incompatible con los informes.', 'No compara la organización de los informes.'],
    ['Relaciona semejanzas y diferencias entre interpretaciones; una necesita desarrollo.', 'Enumera interpretaciones de los informes sin explicar una semejanza o diferencia.', 'El contraste atribuye a un informe una interpretación del otro o una interpretación ausente.', 'No compara interpretaciones de los informes.'],
    ['Usa información de ambos informes; una relación con el contraste necesita precisión.', 'Usa datos de un solo informe o cita ambos sin explicar su relación con el contraste.', 'Los datos citados contradicen la comparación formulada.', 'No aporta información de los informes para sustentar el contraste.'],
    ['La conclusión retoma el contraste; una justificación necesita desarrollo.', 'Propone una conclusión general sin relacionarla con las interpretaciones comparadas.', 'La conclusión contradice el contraste entre los informes.', 'No formula una conclusión de la comparación.'],
  ],
  READING_REPORT_PRESENTATION: [
    ['Comunica las ideas principales del texto con una omisión menor.', 'Comunica hechos aislados sin relacionarlos con el sentido principal del texto.', 'La síntesis oral altera acontecimientos o añade datos ajenos al texto.', 'No comunica una síntesis reconocible del texto leído.'],
    ['Explica la interpretación del texto; un ejemplo necesita mayor relación con su idea.', 'Menciona una interpretación y ejemplos sin explicar cómo se relacionan.', 'La explicación contradice las acciones o información del texto.', 'No comunica una interpretación sustentada del texto.'],
    ['Se reconocen introducción, desarrollo y conclusión; una transición necesita precisión.', 'Comunica ideas aisladas y no se reconoce una de las partes de la exposición.', 'El orden confunde hechos del texto con interpretaciones o conclusiones.', 'No se reconoce una secuencia de exposición del informe.'],
    ['La comunicación o el apoyo acordado permite comprender las ideas; una pausa necesita ajuste.', 'Se comprenden ideas aisladas, pero el ritmo o las pausas dificultan relacionarlas.', 'La expresión cambia el sentido de ideas importantes del informe.', 'No comunica información comprensible mediante la exposición o el apoyo acordado.'],
    ['Explica con sus palabras el texto y su interpretación con una imprecisión menor.', 'Repite información sin explicar su relación con la interpretación presentada.', 'Su explicación confunde hechos e interpretaciones del informe.', 'No ofrece una explicación reconocible del contenido que presenta.'],
  ],
}

export function firstGradeReadingReportCriteria(activityType: string, description: string): ContextualTopicCriterion[] {
  const mode = ['ORAL_PRESENTATION', 'EXPOSITION'].includes(activityType) ? 'READING_REPORT_PRESENTATION'
    : activityType === 'ANALYSIS' ? 'READING_REPORT_ANALYSIS' : activityType === 'COMPARISON' ? 'READING_REPORT_COMPARISON'
      : evidence[activityType] ? activityType : 'READING_REPORT_WRITING'
  const task = normalizedTask(description)
  const raw = rawFirstGradeReadingReportCriteria(mode, description)
  const characters = /\bpersonajes\b/.test(task)
  const social = /sociocultural|costumbres|estilos de vida|valores|comportamientos/.test(task)
  const analysis = raw.find(row => row.templateId === 'report-analysis')!
  const focus = characters ? 'las acciones, motivaciones y características de los personajes' : social ? 'los patrones socioculturales presentes en el texto' : 'el sentido y las relaciones entre ideas del texto'
  analysis.title = mode === 'READING_REPORT_COMPARISON' ? 'Comparación de interpretaciones'
    : mode === 'READING_REPORT_ANALYSIS' ? characters ? 'Interpretación del análisis de personajes' : social ? 'Interpretación del análisis sociocultural' : 'Interpretación del informe de lectura'
      : characters ? 'Análisis de los personajes' : social ? 'Análisis sociocultural' : 'Interpretación del texto leído'
  analysis.observable = mode === 'READING_REPORT_ANALYSIS' ? `Explica cómo el informe interpreta ${focus}, apoyándose en información del informe.`
    : mode === 'READING_REPORT_COMPARISON' ? `Contrasta cómo los informes interpretan ${focus}, mediante información de ambos.`
      : `Interpreta ${focus} y sustenta su explicación con ejemplos pertinentes del texto leído.`
  if (mode === 'READING_REPORT_WRITING') raw[4] = { ...raw[4], observable: 'Presenta una versión final legible, con claridad, puntuación y ortografía que permiten comprender el informe.' }
  if (mode === 'READING_REPORT_WRITING' && !/seleccion|omision|generaliz|reconstruc/.test(task)) raw[0] = { ...raw[0], observable: 'Sintetiza las ideas principales del texto leído y conserva sus relaciones sin alterar su sentido.' }
  if (mode === 'READING_REPORT_PRESENTATION' && !/\bpreguntas\b/.test(task)) raw[4] = { ...raw[4], title: 'Explicación del contenido presentado', observable: 'Explica con sus palabras las ideas del texto y la interpretación que presenta.' }
  let criteria: ContextualTopicCriterion[] = raw.map((row, index) => ({ ...row,
    progressionLevels: [row.observable, ...evidence[mode][index]] as ContextualTopicCriterion['progressionLevels'],
  }))
  if (characters && (mode === 'READING_REPORT_WRITING' || mode === 'READING_REPORT_PRESENTATION')) {
    criteria.find(row => row.templateId === 'report-analysis')!.progressionLevels = [analysis.observable,
      'Relaciona acciones y motivaciones de los personajes con ejemplos del texto; una relación necesita precisión.',
      'Describe personajes o menciona sus acciones sin relacionarlos con sus motivaciones ni con ejemplos del texto.',
      'Atribuye a los personajes acciones o motivaciones que contradicen los hechos del texto.',
      'No aporta una interpretación sobre las acciones o motivaciones de los personajes.']
  }
  if (mode === 'READING_REPORT_WRITING' && /\bconclusion\b/.test(task)) criteria.push({ templateId: 'report-conclusion', title: 'Conclusión sustentada del informe', weight: 3,
    observable: /\bsin analisis\b/.test(task) ? 'Formula una conclusión coherente con las ideas del texto leído y la apoya con referencias pertinentes al texto.' : 'Formula una conclusión o interpretación personal coherente con el texto y la sustenta mediante el análisis realizado.',
    progressionLevels: ['La conclusión se apoya en ideas y ejemplos del texto leído.',
      'La conclusión retoma la interpretación; una relación con el análisis necesita desarrollo.',
      'Propone una opinión sobre el texto sin relacionarla con los ejemplos analizados.',
      'La conclusión contradice los hechos o interpretaciones expuestos en el informe.',
      'No presenta una conclusión relacionada con el texto leído.'] })
  if (/\bsin analisis\b/.test(task)) criteria = criteria.filter(row => row.templateId !== 'report-analysis')
  return criteria
}

export const firstGradeReadingReportModule = {
  id: 'lengua-secundaria-1-informe-de-lectura', grade: 1, subjectCode: 'LEN',
  source: { topicElementId: '1d01bb28-c0b4-51ff-8123-dd7c7cd6f694', pdfPages: [71, 72], printedPages: [70, 71],
    procedureElementIds: ['92a9d148-7590-5e13-a3f6-28094453c2a8', 'fb146520-8892-5a1d-a107-7c3ca7de00d4', 'f539e8fd-f625-5294-96fb-285546e10b49', '5b1e7ea8-a3e7-589a-9701-792813138f20', 'f44cf502-e335-5fcd-b2c1-d58e5c21b85c'] },
  adaptation: 'Criterios de Aula Base; no instrumentos oficiales del MINERD.', optionalEvidence: ['report-conclusion'],
  criteriaByActivity: Object.fromEntries(Object.keys(evidence).map(activity => [activity, firstGradeReadingReportCriteria(activity, '')])),
}
