import type { InstrumentAcademicContext } from './secondary-science'
import type { InstrumentRecommendation, InstrumentType } from './instrument-recommendation'
import type { ContextualTopicCriterion } from './secondary-topic-criteria'
import { withoutResources } from './evaluation-task-text'
import { artGradeOneTopics } from './secondary-art-grade-1'
import { artGradeTwoTopics } from './secondary-art-grade-2'

type ArtEvidenceText = {
  title: string
  success: string
  sufficient?: string
  partial: string
  error: string
  absent?: string
}
type ArtEvidence = ArtEvidenceText & {
  id: string
  when?: string
  plan?: ArtEvidenceText
  performance?: ArtEvidenceText
}
export type ArtTopic = {
  id: string
  grade: number
  label: string
  match: string
  relation: string
  pdfPages: number[]
  sourceRecordIds: string[]
  evidence: ArtEvidence[]
}
type ArtMode =
  | 'ANALYSIS'
  | 'COMPARISON'
  | 'PRODUCTION'
  | 'PERFORMANCE'
  | 'PLAN'
  | 'REPORT'
  | 'REFLECTION'
  | 'OBSERVATION'
  | 'VERIFICATION'
type ArtAction = { text: string; topics: ArtTopic[]; mode: ArtMode }
export type CommonArtTask = {
  grade: number
  text: string
  topics: ArtTopic[]
  actions: ArtAction[]
  mode: ArtMode
  activityType: string
  technique: string
}
export const commonArtModules = [
  {
    id: 'educacion-artistica-comun-1',
    grade: 1,
    topics: artGradeOneTopics,
    policy: 'REQUESTED_ARTISTIC_EVIDENCE_V1',
  },
  {
    id: 'educacion-artistica-comun-2',
    grade: 2,
    topics: artGradeTwoTopics,
    policy: 'REQUESTED_ARTISTIC_EVIDENCE_V1',
  },
]
const normalize = (value: string) => value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
const endings = '(?:a|an|ar|ara|aran|ando|e|en)'
const actionVerbs = `(?:analiz|analic|explic|expliqu|identific|identifiqu|diferenci|compar|contrast|cre|realiz|construy|estiliz|disen|adapt|organiz|elabor|utiliz|interpret|represent|argument|valor|explor|registr|verific|comprueb|marc|investig|improvis|present)${endings}|constru(?:ye|yen|ir|ira|iran|yendo)|comp(?:on|one|onen|oner|ondra|ondran|onga|ongan|oniendo)|prop(?:on|one|onen|oner|ondra|ondran|onga|ongan|oniendo)`
function requestedArtText(value: string) {
  return normalize(
    withoutResources(
      value
        .replace(/<\/(?:p|li|div)>|<br\s*\/?\s*>/gi, '. ')
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;|&#160;/g, ' '),
    ),
  )
    .replace(
      new RegExp(
        `\\b(?:no|sin)\\b[^.;\\n]*?(?=[.;\\n]|\\s+(?:pero|y)\\s+(?:${actionVerbs})\\b|$)`,
        'g',
      ),
      '',
    )
    .trim()
}

function selectedTopics(text: string, available: ArtTopic[]) {
  let topics = available.filter(
    (topic) =>
      text.includes(normalize(topic.label)) || new RegExp(`\\b(?:${topic.match})\\b`).test(text),
  )
  const contains = (id: string) => topics.some((topic) => topic.id === id)
  if (contains('recorder')) topics = topics.filter((topic) => topic.id !== 'vocal-technique')
  if (contains('character-motifs')) topics = topics.filter(topic => topic.id !== 'musical-story')
  if (contains('musical-research') || contains('musical-fragment') || contains('scenic-model')) topics = topics.filter(topic => topic.id !== 'musical-theatre')
  if (contains('artistic-argument')) topics = topics.filter(topic => topic.id !== 'painting')
  if (contains('music-function')) topics = topics.filter(topic => topic.id !== 'operatic-genres')
  if (contains('diary-binding')) topics = topics.filter((topic) => topic.id !== 'diary')
  if (contains('drawing') && !/compar|diferenci/.test(text))
    topics = topics.filter((topic) => topic.id !== 'dimensions')
  if (
    (contains('stylization') || contains('light-shadow')) &&
    !/puntos?|lineas?|planos de color/.test(text)
  )
    topics = topics.filter((topic) => topic.id !== 'drawing')
  return topics
}

function modeFor(text: string, topics: ArtTopic[]): ArtMode {
  const firstAction = text.match(new RegExp(`\\b(?:${actionVerbs})\\b`))?.[0] ?? ''
  if (/^(?:verific|comprueb|marc)/.test(firstAction) && /requisitos|cumpl/.test(text))
    return 'VERIFICATION'
  if (/^(?:compar|contrast|diferenci)/.test(firstAction)) return 'COMPARISON'
  if (/^investig/.test(firstAction)) return 'REPORT'
  if (/^explor/.test(firstAction) && topics.some(topic => topic.id === 'expression-exploration')) return 'PERFORMANCE'
  if (/^(?:analiz|analic|explic|expliqu|identifi|argument|valor)/.test(firstAction))
    return 'ANALYSIS'
  if (/^construye e interpreta\b/.test(text) && topics.some((topic) => topic.id === 'character'))
    return 'PERFORMANCE'
  if (
    topics.some((topic) => ['group-agreements', 'art-safety'].includes(topic.id)) &&
    /regularidad|frecuencia/.test(text)
  )
    return 'OBSERVATION'
  if (/propuesta coreografica|propon recorridos|explora[a-z]* las posibilidades|plan de/.test(text))
    return 'PLAN'
  if (topics.some((topic) => topic.id === 'portfolio')) return 'REPORT'
  if (topics.some((topic) => topic.id === 'diary')) return 'REFLECTION'
  if (/^(?:improvis|present)/.test(firstAction)) return 'PERFORMANCE'
  if (
    /^(?:interpret|represent)/.test(firstAction) &&
    /voz|himno|flauta|instrumental|danza|personaje|situacion ficticia|vocalmente|pieza musical/.test(text)
  )
    return 'PERFORMANCE'
  return 'PRODUCTION'
}

export function resolveCommonArtTask(
  title: string,
  description: string,
  context?: InstrumentAcademicContext | null,
  providedTopics?: ArtTopic[],
): CommonArtTask | null {
  if (
    context?.level !== 'SECONDARY' ||
    context.subjectCode.trim().toUpperCase() !== 'ART' ||
    context.optativeExitName
  )
    return null
  const module = commonArtModules.find((item) => item.grade === context.grade)
  if (!module) return null
  const text = requestedArtText(description || title)
  if (!new RegExp(`\\b(?:${actionVerbs})\\b`).test(text)) return null
  const available = (providedTopics ?? module.topics).filter(
    (topic) => topic.grade === context.grade,
  )
  const clauses = text
    .split(new RegExp(`[.;\\n]+|\\s+(?:y|luego|despues)\\s+(?=(?:${actionVerbs})\\b)`))
    .map((part) => part.trim())
    .filter(Boolean)
  const actions: ArtAction[] = []
  for (const clause of clauses) {
    const own = selectedTopics(clause, available)
    const previous = actions.at(-1)
    const hasAction = new RegExp(`\\b(?:${actionVerbs})\\b`).test(clause)
    if (
      !own.length ||
      (previous && !hasAction) ||
      (previous &&
        own.every((topic) => previous.topics.some((prior) => prior.id === topic.id)) &&
        /^(?:explica|relaciona|distingue|registra|registren|registran|es una propuesta|se trata de una propuesta)\b/.test(
          clause,
        ))
    ) {
      if (previous) {
        previous.text += '. ' + clause
        previous.mode = modeFor(previous.text, previous.topics)
      }
      continue
    }
    actions.push({ text: clause, topics: own, mode: modeFor(clause, own) })
  }
  if (!actions.length) return null
  const topics = [
    ...new Map(
      actions.flatMap((action) => action.topics).map((topic) => [topic.id, topic]),
    ).values(),
  ]
  const mode = actions[0].mode
  const researching = mode === 'REPORT' && topics.some(topic => topic.id === 'musical-research')
  const activityType = researching ? 'RESEARCH' : (
    {
      ANALYSIS: 'ANALYSIS',
      COMPARISON: 'COMPARISON',
      PRODUCTION: 'ARTISTIC_PRODUCTION',
      PERFORMANCE: 'PERFORMANCE',
      PLAN: 'PROJECT',
      REPORT: 'PORTFOLIO',
      REFLECTION: 'WRITTEN_PRODUCTION',
      OBSERVATION: 'OBSERVATION',
      VERIFICATION: 'ANALYSIS',
    } as const
  )[mode]
  const technique =
    mode === 'OBSERVATION' || mode === 'PERFORMANCE'
      ? 'observacion-sistematica'
      : mode === 'REPORT' && !researching
        ? 'portafolio'
        : 'analisis-producciones'
  return { grade: context.grade!, text, topics, actions, mode, activityType, technique }
}

function criterion(
  topic: ArtTopic,
  mode: ArtMode,
  evidence: ArtEvidence,
): ContextualTopicCriterion {
  const progress: ContextualTopicCriterion['progressionLevels'] = [
    evidence.success,
    evidence.sufficient ??
      `La evidencia permite reconocer el desempeño de ${topic.label}, aunque una relación secundaria queda sin precisar.`,
    evidence.partial,
    evidence.error,
    evidence.absent ?? `No aporta evidencia del desempeño solicitado sobre ${topic.label}.`,
  ]
  return {
    templateId: `art-${topic.grade}-${topic.id}-${mode.toLowerCase()}-${evidence.id}`,
    title: evidence.title,
    observable: evidence.success,
    progressionLevels: progress,
    weight: 4,
  }
}

function contextualArtTopic(topic: ArtTopic, text: string): ArtTopic {
  let result = topic
  if (topic.grade === 2 && topic.id === 'art-technology' && !/mensaje|para comunicar|idea ficticia/.test(text)) result = {
    ...result,
    evidence: result.evidence.map(evidence => ({
      ...evidence,
      success: evidence.success.replace('a las decisiones y al mensaje acordados', 'a las decisiones artísticas solicitadas'),
      sufficient: evidence.sufficient?.replace('al mensaje principal', 'a las decisiones principales').replace('sin impedir su comunicación', 'sin impedir el resultado previsto'),
      partial: evidence.partial.replace('con el mensaje o con', 'con'),
    })),
  }
  if (topic.grade === 2 && topic.id === 'shared-elements') {
    const elements = ['armonia','movimiento','matices','intensidad','volumen','contraste','composicion','ritmo'].filter(element => new RegExp(`\\b${element}\\b`).test(text))
    if (elements.length) {
      const labels = elements.map(element => element === 'armonia' ? 'armonía' : element === 'composicion' ? 'composición' : element)
      // Conservar el orden de la consigna permite referir sus elementos sin añadir los vecinos.
      labels.sort((a,b) => text.indexOf(normalize(a))-text.indexOf(normalize(b)))
      const selected = labels.length === 1 ? labels[0] : labels.slice(0,-1).join(', ')+' y '+labels.at(-1)
      result = { ...result, label: `${selected} entre lenguajes artísticos`, relation: `la función de ${selected} en los lenguajes artísticos de los ejemplos dados, relacionando sus recursos sin equiparar literalmente medios visuales y sonoros` }
    }
  }
  if (topic.grade === 2 && topic.id === 'operatic-genres' && /audicion/.test(text) && !/contexto|exponentes|compositor|interpretes/.test(text)) result = {
    ...result,
    label: 'rasgos de la audición operística',
    relation: 'los rasgos vocales y musicales que permiten reconocer el género en la audición proporcionada, vinculando cada identificación con evidencias escuchadas',
  }
  if (topic.grade === 2 && topic.id === 'painting' && !/mensaje|para comunicar|idea ficticia/.test(text)) result = {
    ...result,
    evidence: result.evidence.map(evidence => ({
      ...evidence,
      success: evidence.success.replace('contribuya al mensaje acordado', 'sea reconocible en la obra'),
      sufficient: evidence.sufficient?.replace('El mensaje y la técnica se reconocen', 'La organización visual y la técnica se reconocen'),
      partial: evidence.partial.replace('para el mensaje', 'para la organización de la obra'),
    })),
  }
  const brief = text.replace(/[.\s]+$/, '') === `explica ${normalize(topic.label)}`
  if (brief && topic.grade === 2) result = {
    ...result,
    relation: result.relation
      .replace(/\bexpresamente\s+(?=examinad|dad|proporcionad|comparad|elegid|usad|solicitad|trabajad)/g, '')
      .replace('en el caso examinado', 'con ejemplos de objetos o prácticas')
      .replace('conservando las adaptaciones dadas', 'reconociendo posibilidades de adaptación del movimiento'),
  }
  if (brief) {
    result = {
      ...result,
      relation: result.relation
        .replace(/\b(?:dad[oa]s?|proporcionad[oa]s?|examinad[oa]s?)\b/g, '')
        .replace(/en una visita o registro/g, '')
        .replace(/\s+/g, ' ')
        .replace(/\s+,/g, ',')
        .trim(),
    }
    if (topic.id === 'recorder')
      result = {
        ...result,
        relation: result.relation.replace(', vinculando cada recurso con el fragmento', ''),
      }
    if (topic.id === 'art-technology')
      result = {
        ...result,
        relation:
          'la función de los recursos tecnológicos en la organización y expresión artísticas, relacionando ejemplos de herramientas con sus propósitos',
      }
    if (topic.id === 'group-agreements')
      result = {
        ...result,
        relation:
          'las funciones de los roles y acuerdos concretos en la creación artística grupal y cómo se reconoce su cumplimiento mediante acciones observables',
      }
  }
  if (brief || /\bexplica\b.*\b(?:funcion|concepto|que es|para que sirve)\b/.test(text)) {
    if (topic.id === 'diary')
      result = {
        ...result,
        relation:
          'la función del diario artístico para relacionar decisiones, técnicas y cambios del proceso con ejemplos de trabajos, distinguiendo la reflexión sobre la práctica de la revelación de intimidad',
      }
    if (topic.id === 'portfolio')
      result = {
        ...result,
        relation:
          'la función del portafolio o informe creativo para organizar propuestas artísticas y relacionar ejemplos, técnicas y terminología, diferenciando el producto de presentación de la investigación',
      }
  }
  if (topic.id === 'melody') {
    const parts = [
      ['motivos?', 'motivos'],
      ['frases?', 'frases'],
      ['semifrases?', 'semifrases'],
    ]
      .filter(([match]) => new RegExp(`\\b(?:${match})\\b`).test(text))
      .map(([, label]) => label)
    if (parts.length) {
      const selected =
        parts.length === 1 ? parts[0] : parts.slice(0, -1).join(', ') + ' y ' + parts.at(-1)
      result = {
        ...result,
        label: `estructura melódica de ${selected}`,
        relation: `la función y las relaciones de ${selected} en la melodía examinada, identificando ejemplos audibles y sus vínculos en la estructura`,
      }
    }
  }
  if (topic.id === 'textile') {
    const parts = [
      ['forma', 'forma'],
      ['color', 'color'],
      ['uniones?', 'uniones'],
    ]
      .filter(([match]) => new RegExp(`\\b(?:${match})\\b`).test(text))
      .map(([, label]) => label)
    if (parts.length && parts.length < 3) {
      const selected = parts.join(' y ')
      result = {
        ...result,
        label: 'diseño textil',
        relation: `las relaciones de ${selected} con la función del diseño textil examinado, distinguiendo las condiciones de uso y las preferencias personales`,
        evidence: result.evidence.map((evidence) => ({
          ...evidence,
          success: evidence.success.replace(
            'la forma, color y uniones',
            'los elementos expresamente solicitados',
          ),
          sufficient: evidence.sufficient?.replace('de forma, color o unión', 'del diseño'),
        })),
      }
    }
  }
  if (topic.id === 'graphic-design' && !brief) {
    const parts = [
      ['textos?|tipografia', 'los textos'],
      ['imagen(?:es)?', 'las imágenes'],
      ['espacios?', 'los espacios'],
    ]
      .filter(([match]) => new RegExp(`\\b(?:${match})\\b`).test(text))
      .map(([, label]) => label)
    const selected = parts.length
      ? parts.length === 1
        ? parts[0]
        : parts.slice(0, -1).join(', ') + ' y ' + parts.at(-1)
      : 'los recursos gráficos elegidos'
    result = {
      ...result,
      relation: `la organización y función de ${selected} en la pieza gráfica examinada, relacionándolas con su mensaje y legibilidad`,
      evidence: result.evidence.map((evidence) => ({
        ...evidence,
        success: `Organiza ${selected} para que el mensaje de la pieza gráfica sea reconocible y legible según su función.`,
        error: evidence.error.replace('a texto e imagen', 'a los recursos gráficos'),
      })),
    }
  }
  if (topic.id !== 'drawing') return result
  const elements = [
    ['puntos?', 'el punto'],
    ['lineas?', 'la línea'],
    ['planos', 'los planos'],
    ['volumen', 'el volumen'],
  ]
    .filter(([match]) => new RegExp(`\\b(?:${match})\\b`).test(text))
    .map(([, label]) => label)
  if (!elements.length) return result
  const selected =
    elements.length === 1 ? elements[0] : elements.slice(0, -1).join(', ') + ' y ' + elements.at(-1)
  const ofSelected = selected.startsWith('el ') ? 'del ' + selected.slice(3) : 'de ' + selected
  return {
    ...result,
    label: `dibujo con ${selected}`,
    relation: `la función ${ofSelected} en el dibujo, vinculando los recursos con las relaciones visuales solicitadas`,
    evidence: result.evidence.map((evidence) =>
      evidence.id === 'visual-elements'
        ? {
            ...evidence,
            success: `Relaciona ${selected} en el dibujo con su organización visual, haciendo reconocibles sus funciones en la obra.`,
          }
        : evidence,
    ),
  }
}

export function commonArtCriteria(task: CommonArtTask): ContextualTopicCriterion[] {
  const rows = task.actions.flatMap((action) => {
    const requested = action.topics.flatMap((originalTopic) => {
      const topic = contextualArtTopic(originalTopic, action.text)
      if (action.mode === 'VERIFICATION') {
        const terms =
          topic.id === 'drawing'
            ? [
                ['puntos?', 'puntos'],
                ['lineas?', 'líneas'],
                ['planos', 'planos'],
              ]
                .filter(([match]) => new RegExp(`\\b(?:${match})\\b`).test(action.text))
                .map(([, label]) => label)
            : topic.grade === 2 && topic.id === 'painting'
              ? [['tecnica', 'técnica'], ['soporte', 'soporte']].filter(([match]) => new RegExp(`\\b${match}\\b`).test(action.text)).map(([,label]) => label)
              : []
        return (terms.length ? terms : ['los requisitos expresamente dados']).map((term, index) =>
          criterion(topic, action.mode, {
            id: `requirement-${index}`,
            title: `Verificación de ${term}`,
            success: `Identifica correctamente si el ${topic.grade === 2 && topic.id === 'painting' ? 'producto' : 'dibujo o producto'} proporcionado cumple el requisito de ${term} expresamente pedido.`,
            sufficient: `La respuesta identifica el cumplimiento de ${term}, aunque una marca secundaria queda poco clara sin cambiar el resultado reconocible.`,
            partial: `La respuesta sobre el requisito de ${term} es ambigua y no permite determinar con claridad el cumplimiento observado.`,
            error: `La respuesta atribuye al producto un cumplimiento de ${term} incompatible con lo que contiene.`,
          }),
        )
      }
      if (action.mode === 'ANALYSIS' || action.mode === 'COMPARISON') {
        if (topic.grade === 2 && /^argument[a-z]*\b/.test(action.text)) {
          const decision = /alternativa de conservacion/.test(action.text)
          const target = topic.id === 'artistic-argument' ? 'la elección de los elementos artísticos de la obra' : `una afirmación sobre ${topic.label}`
          return [criterion(topic, action.mode, {
            id: 'argument', title: topic.id === 'artistic-argument' ? 'Razones de la elección artística' : `Argumentación de ${topic.label}`,
            success: decision
              ? `Justifica la alternativa de conservación elegida para el patrimonio del caso con razones y evidencias vinculadas con su significado, función y condiciones dadas.`
              : `Sostiene ${target} con razones vinculadas con los criterios dados y con evidencias reconocibles de la obra o del caso examinado.`,
            sufficient: decision
              ? 'La alternativa se sostiene en razones y evidencias del caso patrimonial; una relación secundaria con sus condiciones queda poco precisada sin cambiar la justificación central.'
              : 'La afirmación se sostiene con razones y evidencias pertinentes; una relación secundaria con los criterios dados queda poco precisada.',
            partial: decision
              ? 'Propone una alternativa pertinente, pero una razón no se vincula con las evidencias o las condiciones del caso patrimonial.'
              : 'Presenta una afirmación y razones, pero una de ellas no se relaciona con los criterios o las evidencias de la obra.',
            error: decision
              ? 'La alternativa contradice las evidencias o las condiciones del caso patrimonial, o se presenta sin razones que la sostengan.'
              : 'Las razones contradicen la obra o el caso, o sustituyen las evidencias por juicios sobre las personas.',
          })]
        }
        const comparison = action.mode === 'COMPARISON'
        return [
          criterion(topic, action.mode, {
            id: comparison ? 'contrast' : 'interpretation',
            title: `${comparison ? 'Contraste' : 'Comprensión'} de ${topic.label}`,
            success: `${comparison ? 'Contrasta los ejemplos dados explicando' : 'Explica'} ${topic.relation}.`,
            sufficient: `${comparison ? 'Establece un contraste' : 'Explica las relaciones centrales'} de ${topic.label} con ejemplos pertinentes; una relación secundaria queda sin precisar, sin alterar el sentido principal.`,
            partial: `Reconoce elementos pertinentes de ${topic.label}, pero una relación no se sustenta en los ejemplos examinados.`,
            error: `Atribuye a los ejemplos elementos ausentes o relaciones incompatibles con ${topic.label}.`,
          }),
        ]
      }
      const requested = topic.evidence.filter(
        (evidence) => !evidence.when || new RegExp(evidence.when).test(action.text),
      )
      return (requested.length ? requested : topic.evidence.slice(0, 1)).map((originalEvidence) => {
        const evidence = {
          ...originalEvidence,
          ...(action.mode === 'PLAN'
            ? originalEvidence.plan
            : action.mode === 'PERFORMANCE'
              ? originalEvidence.performance
              : undefined),
        }
        if (action.mode === 'OBSERVATION' && topic.id === 'group-agreements') {
          const row = criterion(topic, action.mode, evidence)
          row.progressionLevels = [
            'Cumple las acciones concretas de su rol y los acuerdos en todas las oportunidades observadas de creación artística.',
            'Cumple las acciones concretas de su rol y los acuerdos en casi todas las oportunidades observadas de creación artística.',
            'Cumple las acciones concretas de su rol y los acuerdos en algunas oportunidades observadas de creación artística.',
            'Cumple las acciones concretas de su rol y los acuerdos en pocas oportunidades observadas de creación artística.',
            'No cumple las acciones concretas de su rol y los acuerdos en las oportunidades observadas de creación artística.',
          ]
          row.observable = row.progressionLevels[0]
          return row
        }
        return criterion(topic, action.mode, evidence)
      })
    })
    if (
      ['PRODUCTION', 'PERFORMANCE', 'PLAN'].includes(action.mode) &&
      /para comunicar|mensaje|intencion comunicativa/.test(action.text) &&
      !requested.some((row) => /mensaje|comunicativ/.test(normalize(row.observable)))
    ) {
      requested.push(
        criterion(action.topics[0], action.mode, {
          id: 'communicative-intention',
          title: 'Relación entre recursos y mensaje',
          success:
            'Relaciona las decisiones y recursos expresivos de la obra con la idea ficticia o mensaje expresamente acordado, haciendo reconocible su sentido comunicativo.',
          sufficient:
            'La idea o mensaje acordado se reconoce en los recursos expresivos de la obra; una elección secundaria deja una ambigüedad sin cambiar el sentido principal.',
          partial:
            'La obra permite reconocer parte del mensaje, pero un recurso expresivo no se relaciona con la idea acordada.',
          error:
            'Los recursos expresivos no permiten reconocer el mensaje acordado o comunican una relación incompatible con él.',
          absent:
            'No aporta evidencia de la relación entre los recursos expresivos y el mensaje acordado.',
        }),
      )
    }
    return requested
  })
  return rows.filter(
    (row, index) => rows.findIndex((other) => other.templateId === row.templateId) === index,
  )
}

export function commonArtSelections(task: CommonArtTask) {
  const suggestedInstrumentType: InstrumentType =
    /credito parcial|ponderada|pesos por|puntos por/.test(task.text)
      ? 'lista-ponderada'
      : task.mode === 'OBSERVATION'
        ? 'escala'
        : task.mode === 'VERIFICATION'
          ? 'lista-cotejo'
          : 'rubrica'
  return { suggestedInstrumentType, suggestedEvaluationTechnique: task.technique }
}

export function adaptArtScale(
  proposal: InstrumentRecommendation,
  task: CommonArtTask,
): InstrumentRecommendation {
  if (proposal.instrumentType !== 'escala') return proposal
  const indexes = proposal.levels.length === 4 ? [0, 1, 2, 4] : [0, 1, 2, 3, 4]
  const labels =
    task.mode === 'OBSERVATION'
      ? ['Siempre', 'Casi siempre', 'A veces', 'Casi nunca', 'Nunca']
      : ['Completo', 'Suficiente', 'Parcial', 'Incipiente', 'Aún no logrado']
  return {
    ...proposal,
    levels: proposal.levels.map((level, index) => ({ ...level, label: labels[indexes[index]] })),
    criteria: proposal.criteria.map((row) => ({
      ...row,
      descriptors: row.descriptors.map((descriptor, index) => ({
        ...descriptor,
        text: row.progressionLevels?.[indexes[index]] ?? descriptor.text,
      })),
    })),
  }
}
