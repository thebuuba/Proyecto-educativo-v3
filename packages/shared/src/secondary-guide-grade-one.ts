import { rawFirstGradeGuideCriteria } from './secondary-topics/language/guide-grade-1-core'
import { normalizedTask } from './secondary-language-topics'
import type { ContextualTopicCriterion } from './secondary-topic-criteria'

type LowerEvidence = [string, string, string, string]
const evidence: Record<string, LowerEvidence[]> = {
  TOURIST_GUIDE_CREATION: [
    ['La información permite reconocer los lugares y sus atractivos; un dato necesita precisión.', 'Describe algunos lugares o atractivos, pero omite información necesaria para orientar la visita.', 'Atribuye a los lugares características o datos que no les corresponden.', 'No aporta información reconocible de los lugares de la guía.'],
    ['Portada, información y cierre se reconocen; una parte queda poco desarrollada.', 'Presenta información de los lugares, pero la portada o el cierre quedan incompletos.', 'La organización confunde las partes de la guía y dificulta localizar los lugares.', 'No presenta una estructura reconocible de guía turística.'],
    ['Las descripciones permiten reconocer los atractivos; una expresión necesita precisión.', 'Nombra lugares y algunas características sin explicar su atractivo para el visitante.', 'El vocabulario o las formas verbales alteran las características de los lugares.', 'No describe características que orienten al visitante sobre los lugares.'],
    ['La secuencia permite localizar la información; una relación con el propósito queda poco clara.', 'La información se distribuye parcialmente y cuesta relacionar cada dato con su lugar.', 'La distribución sitúa datos bajo lugares equivocados.', 'La información no permite reconocer una secuencia de orientación para el visitante.'],
    ['La revisión corrige la mayoría de los problemas de lectura de la guía.', 'Corrige algunos errores, pero conserva problemas que dificultan datos de la guía.', 'La versión conserva errores que cambian datos importantes de los lugares.', 'La versión presentada no permite leer información comprensible de los lugares.'],
  ],
  TOURIST_GUIDE_ANALYSIS: [
    ['Explica la intención de orientar al visitante; una relación con los datos necesita precisión.', 'Reconoce que la guía informa sobre lugares, pero no explica cómo orienta la visita.', 'Confunde el propósito de la guía con una intención ajena a su información.', 'No identifica el propósito de orientación de la guía.'],
    ['Distingue las partes presentes; una delimitación necesita precisión.', 'Identifica algunas partes, pero confunde su función en la guía.', 'Atribuye información a una parte distinta de la que aparece en la guía.', 'No identifica partes reconocibles de la guía analizada.'],
    ['Relaciona los recursos presentes con la orientación; un ejemplo necesita explicación.', 'Menciona vocabulario o recursos sin explicar cómo ayudan al visitante.', 'Atribuye al recurso un efecto que contradice la información de la guía.', 'No identifica un recurso presente ni su relación con la orientación.'],
    ['Reconstruye la información principal de los lugares con una imprecisión menor.', 'Recupera datos aislados sin relacionarlos con los lugares descritos.', 'Interpreta los datos de manera contraria a la información de la guía.', 'No reconstruye información reconocible de los lugares de la guía.'],
    ['Los datos citados apoyan la respuesta; una relación queda implícita.', 'Señala información de la guía, pero no explica qué respuesta apoya.', 'Usa un dato contrario a su respuesta o atribuye a la guía información ausente.', 'No aporta datos de la guía para sustentar sus respuestas.'],
  ],
  TOURIST_GUIDE_COMPARISON: [
    ['Relaciona propósitos y públicos de ambas guías; una diferencia necesita precisión.', 'Identifica el propósito o público de una guía y deja la otra sin contraste.', 'Confunde los públicos o propósitos de las guías comparadas.', 'No aporta un contraste de propósito ni destinatarios.'],
    ['Contrasta datos y atractivos de ambas guías; una relación necesita desarrollo.', 'Enumera datos de ambas guías sin explicar una semejanza o diferencia.', 'El contraste atribuye a una guía información de la otra o datos ausentes.', 'No compara la información de las guías.'],
    ['Compara las partes presentes; una diferencia de organización necesita precisión.', 'Identifica partes de las guías sin contrastar cómo se organizan.', 'Confunde partes y funciones y formula un contraste incompatible con las guías.', 'No aporta un contraste de la estructura de las guías.'],
    ['Contrasta recursos presentes y su efecto; un ejemplo necesita precisión.', 'Menciona recursos de las guías sin relacionarlos con la orientación del visitante.', 'La comparación atribuye a los recursos efectos que contradicen las guías.', 'No compara recursos presentes en las guías.'],
    ['La conclusión retoma el contraste con una justificación poco desarrollada.', 'Propone una conclusión general sin relacionarla con los datos comparados.', 'La conclusión contradice la información contrastada de las guías.', 'No presenta una conclusión de la comparación.'],
  ],
  TOURIST_GUIDE_PRESENTATION: [
    ['Comunica información de los lugares y atractivos con una imprecisión menor.', 'Comunica algunos datos, pero omite información necesaria para reconocer los lugares.', 'Presenta datos que contradicen las características de los lugares.', 'No comunica información reconocible de los lugares de la guía.'],
    ['Las descripciones orientan al visitante; una expresión necesita precisión.', 'Menciona atractivos sin explicar por qué son pertinentes para el público de la guía.', 'Las expresiones atribuyen atractivos que no corresponden a los lugares.', 'No comunica características que orienten al visitante.'],
    ['La secuencia permite seguir la presentación; una transición necesita precisión.', 'La presentación contiene datos aislados y cuesta asociarlos con cada lugar.', 'El orden mezcla datos de lugares distintos y cambia su sentido.', 'No se reconoce una secuencia entre los datos presentados.'],
    ['La comunicación o el apoyo acordado permite comprender los datos; una pausa necesita ajuste.', 'Se comprenden algunos datos, pero el ritmo o las pausas dificultan otros importantes.', 'La forma de comunicar altera las relaciones entre los datos de los lugares.', 'No comunica información comprensible mediante la presentación o el apoyo acordado.'],
    ['Explica con sus palabras los lugares presentados; un dato necesita precisión.', 'Repite datos de los lugares sin explicar su significado para la visita.', 'Su explicación confunde características o información de los lugares.', 'No ofrece una explicación reconocible de los lugares que presenta.'],
  ],
}

export function isFirstGradeGuideActivity(activity: string) {
  return ['TOURIST_GUIDE_CREATION', 'TOURIST_GUIDE_ANALYSIS', 'TOURIST_GUIDE_COMPARISON', 'TOURIST_GUIDE_PRESENTATION', 'WRITTEN_PRODUCTION', 'ANALYSIS', 'COMPARISON', 'ORAL_PRESENTATION', 'EXPOSITION', 'REPORT'].includes(activity)
}

export function firstGradeGuideCriteria(activityType: string, description: string): ContextualTopicCriterion[] {
  const mode = activityType === 'REPORT' ? 'TOURIST_GUIDE_ANALYSIS' : ['ORAL_PRESENTATION', 'EXPOSITION'].includes(activityType) ? 'TOURIST_GUIDE_PRESENTATION'
    : activityType === 'ANALYSIS' ? 'TOURIST_GUIDE_ANALYSIS' : activityType === 'COMPARISON' ? 'TOURIST_GUIDE_COMPARISON'
      : evidence[activityType] ? activityType : 'TOURIST_GUIDE_CREATION'
  const raw = rawFirstGradeGuideCriteria(mode, description)
  const task = normalizedTask(description)
  if (mode === 'TOURIST_GUIDE_CREATION') {
    raw[1] = { ...raw[1], observable: raw[1].observable.replace(', e integra las imágenes solicitadas', /\bsin (?:imagenes|fotografias|recursos visuales)\b/.test(task)
      ? '' : ', e integra el recurso visual solicitado o la alternativa elegida cuando la consigna permite optar') }
  }
  if (mode === 'TOURIST_GUIDE_PRESENTATION' && !/\bpreguntas\b/.test(task)) {
    raw[4] = { ...raw[4], observable: 'Explica con sus palabras la información de los lugares que presenta.' }
  }
  if (mode === 'TOURIST_GUIDE_COMPARISON') raw[2] = { ...raw[2], observable: 'Contrasta la organización de las partes que están presentes en las guías comparadas.' }
  const criteria: ContextualTopicCriterion[] = raw.map((criterion, index) => ({ ...criterion,
    progressionLevels: [criterion.observable, ...evidence[mode][index]] as ContextualTopicCriterion['progressionLevels'],
  }))
  if (mode === 'TOURIST_GUIDE_CREATION' && raw[1].observable.includes('recurso visual solicitado')) {
    const alternative = /\b(?:mapas?|fotografias|imagenes|dibujos)\b.*\bo\b.*\b(?:mapas?|fotografias|imagenes|dibujos)\b/.test(task)
    const medium = alternative ? 'el recurso visual elegido entre las alternativas solicitadas'
      : /\bmapas?\b/.test(task) ? 'el mapa solicitado' : 'la información visual solicitada'
    const observable = `Relaciona ${medium} con los lugares de la guía para apoyar la información al visitante.`
    criteria.push({ templateId: 'guide-visual', title: 'Información visual de los lugares', observable, weight: 3,
      progressionLevels: [observable,
        'El recurso visual corresponde a los lugares; una relación con su descripción necesita precisión.',
        'El recurso visual representa algunos lugares, pero no permite relacionar todos con la información de la guía.',
        'El recurso visual corresponde a lugares distintos o contradice la información de la guía.',
        'No presenta información visual que corresponda al recurso solicitado o a la alternativa elegida.'] })
  }
  if (activityType === 'REPORT') criteria.push({ templateId: 'guide-report-structure', title: 'Organización del informe sobre la guía', weight: 4,
    observable: 'Organiza el informe con introducción, análisis de la guía y conclusión sustentada en la información de sus lugares.',
    progressionLevels: ['Introducción, análisis y conclusión se relacionan con datos de la guía turística.',
      'Se reconocen las secciones del informe; una relación entre análisis y conclusión necesita precisión.',
      'Recopila datos de la guía, pero el análisis o la conclusión quedan incompletos.',
      'La conclusión contradice los datos analizados o sustituye el informe por una guía nueva.',
      'No presenta un informe reconocible sobre la guía turística.'] })
  return criteria
}

export const firstGradeGuideModule = {
  id: 'lengua-secundaria-1-guia-turistica', grade: 1, subjectCode: 'LEN',
  source: { topicElementId: '56301465-88e2-54cc-a5db-627c7266844c', pdfPages: [70, 71], printedPages: [69, 70],
    procedureElementIds: ['833e9c25-f412-5ae4-97b0-ad42b238df99', '6d928034-270a-5523-a99d-11285a2fa97f', '22c218f1-fd39-5932-bcb6-2ac8dbb8ab38', '8279a299-b455-5cde-a067-e4b6318a57ce', 'e6cd5a0e-b4b9-5d20-8aa4-a329c4650b9e', 'ca82323b-bfd6-5d20-a808-8056a89e048b', '1c750991-a5d0-57b3-ab7d-987ff7696cd9', 'c48372c9-5df0-5a1d-b905-7de155ae1af8'] },
  adaptation: 'Evidencias evaluativas de Aula Base; no instrumentos oficiales del MINERD.',
  optionalEvidence: ['guide-visual'],
  criteriaByActivity: Object.fromEntries([...Object.keys(evidence), 'REPORT'].map(activity => [activity, firstGradeGuideCriteria(activity, '')])),
}
