import { rawFirstGradeNewsCriteria } from './secondary-topics/language/news-grade-1-core'
import { secondGradeNewsCriteria } from './secondary-news-grade-two'
import { normalizedTask } from './secondary-language-topics'
import type { ContextualTopicCriterion } from './secondary-topic-criteria'

type LowerEvidence = [string, string, string, string]
export function isFirstGradeNewsActivity(activity: string) {
  return ['NEWS_WRITING', 'NEWS_ANALYSIS', 'NEWS_COMPARISON', 'NEWSCAST', 'REPORT', 'DEBATE', 'EXPOSITION', 'ORAL_PRESENTATION', 'ANALYSIS', 'OBSERVATION', 'COMPARISON', 'WRITTEN_PRODUCTION'].includes(activity)
}
const evidence: Record<string, LowerEvidence[]> = {
  NEWS_WRITING: [
    ['El hecho y sus datos principales se comprenden; falta precisar un dato secundario.', 'Se reconoce el hecho, pero faltan datos de quién, dónde, cuándo o cómo.', 'Los datos se contradicen y alteran el hecho que se pretende informar.', 'No presenta un hecho noticioso reconocible.'],
    ['Titular, entrada y cuerpo son reconocibles; una parte repite información.', 'Presenta titular y datos, pero la entrada o el desarrollo quedan incompletos.', 'Confunde la función del titular con la entrada o el cuerpo.', 'No organiza el escrito como una noticia.'],
    ['El orden permite seguir el hecho; un enlace temporal necesita precisión.', 'Relaciona algunos datos, pero los saltos de orden dificultan seguir el hecho.', 'Los conectores sitúan los hechos en un orden contradictorio.', 'No se reconoce una secuencia entre los datos de la noticia.'],
    ['El vocabulario y los verbos comunican el hecho con una imprecisión menor.', 'El vocabulario o los tiempos verbales vuelven ambigua parte de la información.', 'El registro o los verbos cambian el sentido de los hechos.', 'El lenguaje no permite comprender el hecho informado.'],
    ['La revisión corrige la mayoría de los errores que afectan la lectura.', 'Corrige algunos errores, pero conserva problemas de puntuación u ortografía que dificultan pasajes.', 'Los errores conservados impiden relacionar datos importantes.', 'La versión presentada no permite leer una noticia comprensible.'],
  ],
  NEWS_ANALYSIS: [
    ['Reconoce la intención informativa y el hecho con una imprecisión menor.', 'Identifica el tema, pero no explica qué hecho se informa.', 'Confunde la información del hecho con una opinión ajena al texto.', 'No identifica el hecho ni el propósito informativo de la noticia.'],
    ['Distingue titular, entrada y cuerpo; una delimitación necesita precisión.', 'Identifica algunas partes, pero confunde sus límites o funciones.', 'Atribuye al titular información del cuerpo y no diferencia las partes.', 'No identifica las partes presentes de la noticia.'],
    ['Localiza la mayoría de los datos disponibles con una atribución imprecisa.', 'Localiza algunos datos, pero omite o confunde otros presentes en la noticia.', 'Asigna datos a personas, lugares o momentos distintos de los informados.', 'No localiza datos que respondan las preguntas de la noticia.'],
    ['Explica la información principal; una inferencia necesita apoyo más preciso.', 'Explica datos aislados sin relacionarlos con el sentido principal.', 'La inferencia contradice la información de la noticia.', 'No presenta una interpretación reconocible de la información.'],
    ['Los datos citados apoyan las respuestas; una relación queda implícita.', 'Señala un dato o fragmento, pero no explica qué respuesta apoya.', 'Usa un fragmento que contradice su respuesta o inventa datos.', 'No aporta datos ni fragmentos de la noticia para sustentar sus respuestas.'],
  ],
  NEWS_COMPARISON: [
    ['Identifica los hechos y propósitos de ambas noticias; uno queda poco preciso.', 'Identifica el hecho o propósito de una noticia y deja el otro incompleto.', 'Confunde los hechos o atribuye a una noticia el propósito de la otra.', 'No identifica los hechos de las noticias comparadas.'],
    ['Relaciona semejanzas y diferencias; una relación necesita precisión.', 'Enumera datos de las noticias sin desarrollar su semejanza o diferencia.', 'Afirma semejanzas o diferencias que contradicen los datos de ambas noticias.', 'No establece una comparación entre las noticias.'],
    ['Contrasta titular, entrada y cuerpo; una función queda poco desarrollada.', 'Reconoce partes de ambos textos, pero no explica cómo se organizan de manera semejante o distinta.', 'Confunde las partes o sus funciones al contrastar los textos.', 'No aporta un contraste de las estructuras de las noticias.'],
    ['Usa datos de ambas noticias; una relación con el contraste necesita precisión.', 'Apoya el contraste con datos de una sola noticia o sin explicar su relación.', 'Los datos citados contradicen el contraste formulado.', 'No aporta datos de las noticias para sustentar la comparación.'],
    ['La conclusión retoma el contraste; una relación necesita desarrollo.', 'La conclusión menciona una diferencia sin relacionarla con lo comparado.', 'La conclusión contradice las semejanzas o diferencias expuestas.', 'No presenta una conclusión de la comparación.'],
  ],
  NEWSCAST: [
    ['Comunica el hecho y sus datos principales con una imprecisión menor.', 'Presenta datos aislados y omite información necesaria para comprender el hecho.', 'La información presentada contradice el hecho de la noticia.', 'No comunica un hecho noticioso reconocible.'],
    ['Comunica titular y la mayoría de los datos disponibles; uno necesita precisión.', 'Comunica el titular y algunos datos, dejando preguntas importantes sin responder.', 'Confunde quién, dónde o cuándo ocurrió el hecho.', 'No comunica datos que permitan reconocer qué ocurrió.'],
    ['La secuencia enlaza las intervenciones; una transición necesita precisión.', 'Se reconocen algunas noticias, pero las intervenciones quedan desconectadas.', 'El orden de las intervenciones confunde las noticias presentadas.', 'No hay una secuencia que permita seguir el noticiero.'],
    ['La comunicación o los apoyos acordados permiten comprender los datos, con una pausa imprecisa.', 'Se comprenden algunos datos, pero el ritmo o las pausas dificultan otros.', 'La expresión altera la relación entre datos importantes.', 'No comunica información comprensible mediante la presentación o los apoyos acordados.'],
    ['Explica su noticia y se reconoce su aportación; un dato necesita precisión.', 'Repite datos de su noticia sin explicar su relación con el hecho.', 'Su explicación confunde el hecho o los datos de la noticia asignada.', 'No se identifica una aportación sobre su noticia en la presentación.'],
  ],
  DEBATE: [
    ['Explica el hecho; una distinción entre dato y opinión necesita precisión.', 'Menciona el tema sin precisar el hecho o distingue solo algunos datos de las opiniones.', 'Presenta opiniones como hechos de la noticia.', 'No identifica el hecho sobre el que se debate.'],
    ['Los datos apoyan su postura; una relación necesita desarrollo.', 'Expresa una postura y cita datos sin explicar cómo la apoyan.', 'Defiende su postura con datos ajenos o contrarios a la noticia.', 'No aporta datos de la noticia para defender una postura.'],
    ['Responde al argumento contrario; una relación con el hecho necesita precisión.', 'Repite su postura sin atender una parte del argumento contrario.', 'La réplica tergiversa la postura contraria o se aparta del hecho.', 'No ofrece una respuesta a las otras posturas.'],
    ['La intervención se comprende; una transición entre razones necesita precisión.', 'Comunica razones aisladas y cuesta seguir su relación con la postura.', 'El orden o vocabulario cambia el sentido de su argumento.', 'No comunica una intervención que permita reconocer su postura.'],
    ['Respeta las reglas y turnos, con una intervención que necesita ajuste.', 'Interviene, pero algunas interrupciones dificultan el intercambio.', 'Las interrupciones reiteradas impiden seguir los argumentos de otros.', 'No hay participación observable en el intercambio acordado.'],
  ],
}

export function firstGradeNewsCriteria(activityType: string, description: string): ContextualTopicCriterion[] {
  if (activityType === 'REPORT') return secondGradeNewsCriteria('REPORT', description)
  const mode = ['EXPOSITION', 'ORAL_PRESENTATION'].includes(activityType) ? 'NEWSCAST'
    : ['ANALYSIS', 'OBSERVATION'].includes(activityType) ? 'NEWS_ANALYSIS'
      : activityType === 'COMPARISON' ? 'NEWS_COMPARISON' : evidence[activityType] ? activityType : 'NEWS_WRITING'
  const raw = rawFirstGradeNewsCriteria(mode, description)
  if (mode === 'NEWSCAST' && !/\b(?:equipos?|grupos?)\b/.test(normalizedTask(description))) {
    raw[4] = { ...raw[4], title: 'Explicación de la noticia presentada', observable: 'Explica con sus palabras la información de la noticia que presenta.' }
  }
  const criteria = raw.map((criterion, index) => ({ ...criterion,
    progressionLevels: [criterion.observable, ...evidence[mode][index]] as ContextualTopicCriterion['progressionLevels'],
  }))
  const task = normalizedTask(description)
  if (mode === 'NEWS_ANALYSIS') {
    const focus = [
      /\b(?:proposito|funcion|intencion)\b/.test(task) ? 'news-purpose' : '',
      /\b(?:partes|estructura|titular|entrada|copete|cuerpo)\b/.test(task) ? 'news-structure' : '',
      /\b(?:datos|preguntas|interrogantes|quien|donde|cuando|como)\b/.test(task) ? 'news-questions' : '',
      /\b(?:inferencias|interpretacion|sentido)\b/.test(task) ? 'news-interpretation' : '',
    ].filter(Boolean)
    if (focus.length) return criteria.filter(criterion => focus.includes(criterion.templateId) || criterion.templateId === 'news-evidence')
  }
  return criteria
}

export const firstGradeNewsModule = {
  id: 'lengua-secundaria-1-la-noticia', grade: 1, subjectCode: 'LEN',
  source: { topicElementId: '55a6ecd4-e9db-5e12-9e15-50f0f179f1b4', pdfPages: [69, 70], printedPages: [68, 69],
    procedureElementIds: ['d60a8e8d-d000-5b43-897d-e0eb48136a1c', '1e8cd77f-d712-535e-b108-203a914fb39c', 'd112b7bd-aa6c-5d0a-9980-83e7c8ef5334', 'bfbe299c-6c2d-599b-88d3-d70b46524187', '52fef8d7-627e-5de8-85ea-95a5ddc97c3d', '71c8091f-c16b-5568-a567-fefeeb6ab5a6'] },
  adaptation: 'Evidencias evaluativas de Aula Base; no texto ni instrumentos oficiales del MINERD.',
  criteriaByActivity: Object.fromEntries(['NEWS_WRITING', 'NEWS_ANALYSIS', 'NEWS_COMPARISON', 'NEWSCAST', 'REPORT', 'DEBATE'].map(activity => [activity, firstGradeNewsCriteria(activity, activity === 'NEWSCAST' ? 'en equipos' : '')])),
}
