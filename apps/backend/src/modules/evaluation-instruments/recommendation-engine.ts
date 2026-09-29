import type { CurriculumReference, InstrumentRecommendation, RecommendationCriterion } from '@aula/shared'
import { type EvaluationCatalog, evaluationCatalogV1 } from './catalog-v1'
import { type AcademicContext, type ScopeCandidate, discipline, normalize } from './curriculum-context'

export interface RecommendationInput {
  activityTitle: string; description?: string; participationMode: 'INDIVIDUAL' | 'GROUP'
  pedagogicalActivityType?: string; maxScore: number; competencyBlock?: string; levelCount?: 4 | 5
  preferredInstrumentType?: 'rubrica' | 'lista-cotejo' | 'escala' | 'lista-ponderada'
  selectedCurriculumElementIds?: string[]
}
export interface RankedElement extends CurriculumReference { normalizedText: string }
const stopWords = new Set('a al algo ante bajo con contra cual cuando de del desde durante e el ella en entre es esa ese esta este hay hasta la las le les lo los mas mi muy o para pero por que quien se segun ser si sin sobre su sus un una unos unas y'.split(' '))
// Conservative plural stems; no semantic synonym guessing or cross-scope retrieval.
export const tokens = (text: string) => [...new Set(normalize(text).split(' ').filter(t => t.length > 2 && !stopWords.has(t)).map(t => t.length > 5 ? t.replace(/(?:es|s)$/, '').replace(/[oa]$/, '') : t))]
/** Bounded Damerau-Levenshtein. Two-token prefix gate blocks unrelated words. */
function editDistance(left: string, right: string, limit: number) {
  if (Math.abs(left.length - right.length) > limit) return limit + 1
  const matrix = Array.from({ length: left.length + 1 }, () => new Array<number>(right.length + 1).fill(0))
  for (let i = 0; i <= left.length; i++) matrix[i][0] = i
  for (let j = 0; j <= right.length; j++) matrix[0][j] = j
  for (let i = 1; i <= left.length; i++) for (let j = 1; j <= right.length; j++) {
    matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + (left[i - 1] === right[j - 1] ? 0 : 1))
    if (i > 1 && j > 1 && left[i - 1] === right[j - 2] && left[i - 2] === right[j - 1]) matrix[i][j] = Math.min(matrix[i][j], matrix[i - 2][j - 2] + 1)
  }
  return matrix[left.length][right.length]
}
export function similarToken(query: string, candidate: string) {
  if (query === candidate) return true
  if (query.length < 5 || candidate.length < 5 || query.slice(0, 2) !== candidate.slice(0, 2)) return false
  const limit = Math.min(query.length, candidate.length) >= 8 ? 2 : 1
  return editDistance(query, candidate, limit) <= limit
}
const overlap = (query: string[], text: string) => { const values = tokens(text); return query.filter(t => values.some(candidate => similarToken(t, candidate))).length }
const typeWeights: Record<string, number> = { SPECIFIC_COMPETENCY: 12, EVALUATION_CRITERION: 14, ACHIEVEMENT_INDICATOR: 16, CONCEPT: 10, PROCEDURE: 12, ATTITUDE_VALUE: 3 }
const blockTerms: Record<string, string> = { b1: 'comunica comunicacion oral escrita', b2: 'pensamiento razonamiento problemas creativo critico', b3: 'etica ciudadana personal espiritual', b4: 'cientifica tecnologica ambiental salud' }
const boilerplate = tokens('actividad exposición presentación oral experimento experimentación práctica laboratorio producción escrita resolución problemas ejercicios artística observación clasificación estudiantes estudiante realizar mediante sobre tema')
export function topicTerms(title: string, description = '') {
  const fromTitle = tokens(title).filter(t => !boilerplate.includes(t) && !/^\d+$/.test(t))
  const fromDescription = tokens(description).filter(t => !boilerplate.includes(t) && !/^\d+$/.test(t))
  return fromTitle.length >= 2 ? fromTitle : [...new Set([...fromTitle, ...fromDescription])].slice(0, 8)
}
export function detectActivityType(title: string, description: string, catalog: EvaluationCatalog = evaluationCatalogV1) {
  const find = (value: string) => {
    const text = normalize(value)
    const words = tokens(text)
    const matched = (trigger: string) => text.includes(trigger) || tokens(trigger).every(part => words.some(word => similarToken(word, part)))
    return catalog.activityTypes.filter(a => a.triggers.some(matched))
      .sort((a, b) => Math.max(...b.triggers.filter(matched).map(t => t.length)) - Math.max(...a.triggers.filter(matched).map(t => t.length)))[0]
  }
  // The title names the evidence; a description can mention another activity as context.
  return find(title) ?? find(description) ?? catalog.activityTypes.find(a => a.id === 'OTHER')!
}
export function rankCurriculum(title: string, description: string, activityType: string, competencyBlock: string | undefined,
  scope: ScopeCandidate | null, elements: RankedElement[], catalog: EvaluationCatalog = evaluationCatalogV1) {
  const activity = catalog.activityTypes.find(a => a.id === activityType) ?? catalog.activityTypes.find(a => a.id === 'OTHER')!
  const topic = topicTerms(title, description)
  const detail = tokens(description)
  const attitudeRelevant = /convivencia|cooperaci|valores|respeto|solidaridad|seguridad/.test(normalize(`${title} ${description}`))
  return elements.filter(e => scope && e.scopeId === scope.id && e.versionId === scope.versionId && e.type in typeWeights && (e.type !== 'ATTITUDE_VALUE' || attitudeRelevant))
    .map(element => {
      const matches = overlap(topic, element.normalizedText)
      const topicCoverage = topic.length ? matches / topic.length : 0
      const block = ['SPECIFIC_COMPETENCY', 'EVALUATION_CRITERION', 'ACHIEVEMENT_INDICATOR'].includes(element.type)
        ? overlap(tokens(blockTerms[competencyBlock ?? ''] ?? ''), element.normalizedText) : 0
      const procedure = element.type === 'PROCEDURE' ? overlap(tokens(activity.triggers.join(' ')), element.normalizedText) : 0
      const detailMatches = overlap(detail, element.normalizedText)
      return { element, score: matches ? Math.round(100 * topicCoverage + typeWeights[element.type] + Math.min(block, 3) * 2 + Math.min(procedure, 2) * 3 + Math.min(detailMatches, 4) * 2) : 0,
        topicCoverage, reasons: [`topicTokens=${matches}/${topic.length}`, `typeWeight=${typeWeights[element.type]}`, `blockMatches=${block}`, `procedureMatches=${procedure}`] }
    }).filter(r => r.score > 0).sort((a, b) => b.score - a.score || a.element.elementId.localeCompare(b.element.elementId))
}

/** Integer hundredths are the scoring authority; numeric fields are display conveniences. */
export function distributeScore(maxScore: number, weights: number[]) {
  const units = Math.round(maxScore * 100)
  if (!Number.isFinite(maxScore) || maxScore <= 0 || maxScore > 10000 || Math.abs(units / 100 - maxScore) > 1e-9 || !weights.length || weights.some(w => !Number.isInteger(w) || w <= 0)) throw new Error('Puntuación inválida: use hasta dos decimales y pesos enteros positivos.')
  // Prefer whole or half points when the activity total permits it.
  const sum = weights.reduce((a, b) => a + b, 0)
  const smallest = Math.min(...weights)
  const quantum = units % 100 === 0 && units * smallest >= sum * 100 ? 100
    : units % 50 === 0 && units * smallest >= sum * 50 ? 50 : 1
  const slots = units / quantum
  const results = weights.map(w => Math.floor(slots * w / sum))
  const order = weights.map((w, index) => ({ index, remainder: slots * w % sum })).sort((a, b) => b.remainder - a.remainder || a.index - b.index)
  let remaining = slots - results.reduce((a, b) => a + b, 0)
  for (const { index } of order) { if (!remaining) break; results[index]++; remaining-- }
  return results.map(value => value * quantum)
}

function teacherTopic(title: string) {
  const match = title.match(/(?:sobre|de|del|con)\s+(.+)$/i)
  return (match?.[1] ?? title).trim().replace(/[.!?]+$/, '').toLocaleLowerCase('es-DO')
}

function learningDimensions(description: string, topic: string) {
  const text = description.replace(/\s+/g, ' ').trim()
  const dimensions: Array<{ title: string; observable: string }> = []
  const formation = text.match(/(?:explicar(?:[áa]n)?|describir(?:[áa]n)?)\s+c[oó]mo\s+se\s+([\p{L}]+)(?:\s+([^,.;]+?))?(?=\s+(?:e|y)\s+(?:identificar|describir|diferenciar|explicar)|[,.;]|$)/iu)
  if (formation) { const subject = formation[2]?.trim() || topic; dimensions.push({ title: `Comprensión de cómo se ${formation[1]} ${subject}`, observable: `Explica cómo se ${formation[1]} ${subject}` }) }
  const parts = text.match(/identificar(?:[áa]n)?\s+(sus|las|los)\s+([^,.;]+?)(?=\s+(?:e|y)\s+(?:describir|explicar|diferenciar)|[,.;]|$)/iu)
  if (parts) dimensions.push({ title: `Identificación de ${parts[2]} de ${topic}`, observable: `Identifica ${parts[2]} de ${topic}` })
  const processes = text.match(/identificar(?:[áa]n)?\s+si\s+ocurre\s+([^.;]+?)(?=,\s*(?:registrar|explicar)|[.;]|$)/iu)
  if (processes) dimensions.push({ title: `Identificación de ${processes[1]}`, observable: `Identifica ${processes[1]}` })
  const explain = text.match(/explicar(?:[áa]n)?\s+con\s+sus\s+propias\s+palabras\s+([^.;]+)/iu)
  if (explain) dimensions.push({ title: `Explicación de ${explain[1]}`, observable: `Explica con sus propias palabras ${explain[1]}` })
  // These grammatical cues come from the teacher's text, not from an inferred syllabus.
  // A broader clause may contain several cues ("qué son..., cómo se forman..., sus partes...").
  const formationCue = text.match(/c[oó]mo\s+se\s+([\p{L}]+)(?:\s+((?:el|la|los|las)\s+[\p{L}]+))?/iu)
  if (formationCue && !dimensions.some(item => normalize(item.observable).includes(normalize(`como se ${formationCue[1]}`)))) {
    const subject = formationCue[2] ?? topic
    dimensions.push({ title: `Comprensión de cómo se ${formationCue[1]} ${subject}`, observable: `Explica cómo se ${formationCue[1]} ${subject}` })
  }
  if (/\b(?:sus|las|los)\s+(?:principales\s+)?partes\b/iu.test(text) && !dimensions.some(item => /partes/iu.test(item.title))) {
    dimensions.push({ title: `Identificación de las partes de ${topic}`, observable: `Identifica las partes principales de ${topic}` })
  }
  const types = text.match(/\b(?:diferentes\s+)?tipos\s+de\s+([\p{L}]+(?:\s+de\s+[\p{L}]+)?)/iu)
  if (types && !dimensions.some(item => normalize(item.title).includes(normalize(types[1])))) {
    dimensions.push({ title: `Distinción de tipos de ${types[1]}`, observable: `Distingue los tipos de ${types[1]} descritos en la actividad` })
  }
  if (/\briesgos?\b/iu.test(text) && !dimensions.some(item => /riesgos?/iu.test(item.title))) {
    dimensions.push({ title: `Análisis de riesgos de ${topic}`, observable: `Explica los riesgos de ${topic} indicados en la actividad` })
  }
  return dimensions.slice(0, 2).map(item => ({ title: item.title.replace(/\s+/g, ' ').trim(), observable: `${item.observable.replace(/\s+/g, ' ').trim().replace(/[.!?]+$/, '')}.` }))
}

function contextualDescriptors(observable: string, indexes: number[], title: string, templateId: string) {
  const action = observable.trim().replace(/[.!?]+$/, '')
  const content = ['science-content', 'math-comprehension', 'language-content', 'social-context'].includes(templateId)
  return indexes.map(index => index === 0 ? `${action}; ${content ? 'abarca todos los aspectos indicados y establece relaciones correctas' : 'mantiene el desempeño durante toda la actividad de forma autónoma'}.`
    : index === 1 ? `${action}; cubre los aspectos principales sin errores relevantes.`
      : index === 2 ? `${action}, aunque omite algún aspecto o presenta imprecisiones.`
        : index === 3 ? `${action} solo en parte; necesita apoyo para completar la evidencia.`
          : `No aporta evidencia suficiente para valorar ${title.toLocaleLowerCase('es-DO')}.`)
}

export function recommend(input: RecommendationInput, context: AcademicContext | null, scope: ScopeCandidate | null,
  elements: RankedElement[], mappingStatus: string, curriculumStatus: string | null, catalog: EvaluationCatalog = evaluationCatalogV1): InstrumentRecommendation {
  const text = normalize(`${input.activityTitle} ${input.description ?? ''}`)
  const explicit = input.pedagogicalActivityType ? catalog.activityTypes.find(a => a.id === input.pedagogicalActivityType) : undefined
  if (input.pedagogicalActivityType && !explicit) throw new Error('Tipo pedagógico desconocido.')
  const detectedByCatalog = detectActivityType(input.activityTitle, input.description ?? '', catalog)
  const detected = detectedByCatalog.id === 'OTHER' && /observ(?:ar|an|aran|arán).*(?:registr|tabla)/.test(text)
    ? catalog.activityTypes.find(entry => entry.id === 'OBSERVATION')! : detectedByCatalog
  const activity = explicit ?? detected
  const band = context?.level === 'PRIMARY' ? context.cycle === 1 ? 'PRIMARY_FIRST' : 'PRIMARY_SECOND' : 'SECONDARY'
  const area = discipline(scope, context)
  const attitudeRelevant = /convivencia|cooperaci|valores|respeto|solidaridad|seguridad/.test(text)
  // Keep content/genre words (poema, ensayo, pintura). Strip only pedagogical boilerplate.
  const ranking = rankCurriculum(input.activityTitle, input.description ?? '', activity.id, input.competencyBlock, scope, elements, catalog)
  const explicitIds = input.selectedCurriculumElementIds
  const manuallySelected = explicitIds?.map(id => elements.find(e => e.elementId === id && e.scopeId === scope?.id && e.versionId === scope?.versionId)).filter((e): e is RankedElement => Boolean(e)) ?? []
  if (explicitIds && manuallySelected.length !== explicitIds.length) throw new Error('Elemento curricular ajeno al ámbito.')
  const topCoverage = ranking[0]?.topicCoverage ?? 0
  const confidence = explicitIds?.length ? 'HIGH' : !scope || topCoverage < 0.6 ? 'LOW' : topCoverage >= 0.85 ? 'HIGH' : 'MEDIUM'
  // Diverse evidence candidates, bounded independently of criterion count.
  const selected = explicitIds ? manuallySelected.map(element => ({ element, topicCoverage: 1, score: 100, reasons: ['teacher-selection'] }))
    : confidence === 'LOW' ? [] : ranking.filter(r => r.topicCoverage >= 0.6).filter((r, i, all) => all.slice(0, i).filter(p => p.element.type === r.element.type).length < 2).slice(0, 12)
  const selectedRefs = selected.map(({ element: { normalizedText: _text, ...reference } }) => reference)
  const count = band === 'PRIMARY_FIRST' ? (input.maxScore <= 10 ? 3 : 4) : band === 'PRIMARY_SECOND' ? 5 : activity.family === 'SCIENTIFIC' ? 6 : 5
  const topic = teacherTopic(input.activityTitle)
  const dimensions = area === 'science' ? learningDimensions(input.description ?? '', topic) : []
  const visualResources = /imagenes|recursos visuales|laminas|diapositivas/.test(text)
  const allCandidates = catalog.criterionTemplates.filter(t => (t.area === area || t.area === '*') && t.bands.includes(band)
    && (area === '*' || !t.families.length || t.families.includes(activity.family)) && t.evidence.some(e => activity.evidence.includes(e))
    && (!t.attitude || attitudeRelevant) && (!t.requires || t.requires.some(word => text.includes(normalize(word)))))
    .map(t => ({ template: t, score: t.weight + (t.area === area && area !== '*' ? 10 : 0)
      + (activity.family === 'ORAL' && ['organization', 'communication'].includes(t.id) ? 17 : 0)
      + (activity.family === 'SCIENTIFIC' && ['science-procedure', 'science-data', 'science-interpretation', 'science-conclusion', 'science-safety'].includes(t.id) ? 12 : 0)
      + overlap(tokens(t.keywords.join(' ')), text)
      + Math.min(2, selected.reduce((sum, r) => sum + overlap(tokens(t.keywords.join(' ')), r.element.normalizedText), 0)) }))
    .sort((a, b) => b.score - a.score || a.template.id.localeCompare(b.template.id))
  const byId = (id: string) => allCandidates.find(candidate => candidate.template.id === id)
  const priorityIds = area === 'science' && activity.family === 'ORAL' && dimensions.length
    ? dimensions.length > 1 ? ['science-content', 'science-content', 'science-accuracy', 'organization', visualResources ? 'instructions' : 'communication']
      : ['science-content', 'science-accuracy', 'communication', 'organization', 'instructions']
    : area === 'science' && activity.family === 'OBSERVATIONAL' && dimensions.length > 1
      ? ['science-content', 'science-content', 'science-data', 'science-accuracy', 'science-interpretation'] : []
  const prioritized = priorityIds.map(byId).filter((candidate): candidate is (typeof allCandidates)[number] => Boolean(candidate))
  const candidates = [...prioritized, ...allCandidates.filter(candidate => !prioritized.includes(candidate))].slice(0, count)
  const scores = distributeScore(input.maxScore, candidates.map((candidate, index) => priorityIds.length && dimensions.length > 1 && candidates.length === 5
    ? [5, 4, 4, 4, 3][index] : candidate.template.weight))
  const rule = catalog.recommendationRules.filter(r => (!r.families.length || r.families.includes(activity.family)) && (!r.band || r.band === band)
    && (!r.maxScore || input.maxScore <= r.maxScore) && (!r.evidence || r.evidence.every(e => activity.evidence.includes(e))))
    .sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id))[0]
  const levelCount = input.levelCount ?? 4
  const chosenInstrument = input.preferredInstrumentType ?? rule.instrument
  const template = catalog.instrumentTemplates.find(t => t.id === chosenInstrument)!
  const levels = template.descriptors ? catalog.descriptorPatterns.scales[levelCount].map((label, index) => ({ id: `L${levelCount - index}`, label, proportion: (levelCount - index - 1) / (levelCount - 1) })) : []
  const criteria: RecommendationCriterion[] = candidates.map(({ template: criterion }, index) => {
    const relevant = selected.filter(r => overlap(tokens(criterion.keywords.join(' ')), r.element.normalizedText) > 0)
    const literal = relevant.find(r => r.element.type === 'EVALUATION_CRITERION' && r.topicCoverage >= 0.5)
    const isContentCriterion = ['science-content', 'math-comprehension', 'language-content', 'art-intention', 'fihr-comprehension', 'social-context'].includes(criterion.id)
    const content = (isContentCriterion ? selected : relevant).find(r => r.element.type === 'CONCEPT' && r.element.text.length <= 160)
      ?? relevant.find(r => ['PROCEDURE', 'ACHIEVEMENT_INDICATOR', 'SPECIFIC_COMPETENCY'].includes(r.element.type) && r.element.text.length <= 300)
    // Literal extraction stays literal. Contextualized descriptions quote retrieved terms, never new claims.
    const reference = literal?.element ?? content?.element
    const observable = band === 'PRIMARY_FIRST' ? criterion.simple : criterion.observable
    const dimension = criterion.id === 'science-content' ? dimensions[candidates.slice(0, index).filter(candidate => candidate.template.id === 'science-content').length]
      ?? (topic !== input.activityTitle ? { title: `Comprensión de ${topic}`, observable: `Explica las ideas principales de ${topic}.` } : undefined) : undefined
    const contextual = dimension?.observable ?? (criterion.id === 'instructions' && visualResources && activity.family === 'ORAL' ? `Utiliza imágenes o recursos visuales para apoyar la explicación de ${topic}.` : null) ?? (criterion.id === 'science-accuracy' && /vocabulario cientifico/.test(text) ? `Emplea vocabulario científico adecuado al explicar ${topic}.` : null) ?? (criterion.id === 'organization' && activity.family === 'ORAL' ? `Organiza y comunica las ideas sobre ${topic} en una secuencia comprensible.` : null) ?? (criterion.id === 'organization' && area === 'science' && ['PROJECT_BASED', 'WRITTEN'].includes(activity.family) && topic !== input.activityTitle ? `Organiza las ideas y evidencias sobre ${topic} en una secuencia comprensible.` : null) ?? (topic !== input.activityTitle && criterion.id === 'art-intention' ? `Expresa ${topic} mediante decisiones visuales reconocibles.` : null) ?? (topic !== input.activityTitle && criterion.id === 'art-composition' && /pintura/.test(text) ? `Organiza los elementos de la pintura para comunicar ${topic}.` : null) ?? (topic !== input.activityTitle && criterion.id === 'social-context' ? `Ubica ${topic} en tiempo, lugar y contexto.` : null) ?? (topic !== input.activityTitle && criterion.id === 'social-causes' && /causas|consecuencias/.test(text) ? `Explica causas y consecuencias de ${topic} con evidencia.` : null) ?? (topic && topic !== input.activityTitle && ['science-accuracy', 'organization', 'communication', 'math-comprehension', 'math-procedure', 'math-reasoning', 'math-accuracy', 'math-interpretation', 'language-content', 'language-structure', 'language-coherence'].includes(criterion.id)
      ? `${observable.replace(/[.!?]+$/, '')} ${area === 'language' ? `en la producción de ${topic}` : `al abordar ${topic}`}.` : null)
    const description = contextual ?? (literal ? literal.element.text : content ? `${observable} Relacionado con ${content.element.text}.` : observable)
    const sourceType = contextual || content ? 'CONTEXTUALIZED' : literal ? 'CURRICULUM_DERIVED' : 'ACTIVITY_TEMPLATE'
    const sourceReferences = !contextual && reference ? selectedRefs.filter(r => r.elementId === reference.elementId) : []
    const patterns = band === 'PRIMARY_FIRST' ? catalog.descriptorPatterns.simple : catalog.descriptorPatterns.regular
    const patternIndexes = levelCount === 4 ? [0, 1, 3, 4] : [0, 1, 2, 3, 4]
    const title = dimension?.title ?? (criterion.id === 'instructions' && visualResources && activity.family === 'ORAL' ? 'Uso de recursos de apoyo' : topic && topic !== input.activityTitle && criterion.id === 'science-accuracy' ? `Precisión científica sobre ${topic}` : criterion.id === 'organization' && activity.family === 'ORAL' ? 'Organización y comunicación de la exposición' : criterion.id === 'organization' && area === 'science' && ['PROJECT_BASED', 'WRITTEN'].includes(activity.family) ? `Organización de la evidencia sobre ${topic}` : criterion.id === 'art-intention' && topic !== input.activityTitle ? `Intención expresiva sobre ${topic}` : criterion.id === 'art-composition' && /pintura/.test(text) ? 'Composición de la pintura' : criterion.id === 'social-context' && topic !== input.activityTitle ? `Contexto de ${topic}` : criterion.id === 'social-causes' && /causas|consecuencias/.test(text) ? `Causas y consecuencias de ${topic}` : area === 'language' && criterion.id === 'language-structure' && /cuento/.test(text) ? 'Estructura narrativa del cuento' : criterion.title)
    const texts = contextual ? contextualDescriptors(description, patternIndexes, title, criterion.id) : patternIndexes.map(i => `${observable} ${patterns[i]}`)
    return { id: `proposal:${catalog.version}:${scope?.id ?? 'fallback'}:${criterion.id}:${index}`, templateId: criterion.id,
      title, description, maxScore: scores[index] / 100, maxScoreUnits: scores[index], sourceType, sourceReferences,
      descriptors: levels.map((level, i) => ({ levelId: level.id, text: texts[i], scoreUnits: Math.round(scores[index] * level.proportion) })) }
  })
  const result: InstrumentRecommendation = { kind: 'RECOMMENDATION', catalogVersion: catalog.version, instrumentType: chosenInstrument, confidence,
    activityType: activity.id, evidenceTypes: [...new Set([...activity.evidence, ...criteria.filter(c => catalog.criterionTemplates.find(t => t.id === c.templateId)?.attitude).map(() => 'ATTITUDE' as const)])],
    participationMode: input.participationMode, curriculumVersionId: scope?.versionId ?? null, curriculumScopeId: scope?.id ?? null,
    selectedCurriculumElements: selectedRefs, criteria, levels, totalScore: input.maxScore, totalScoreUnits: scores.reduce((a, b) => a + b, 0), scoreUnit: 0.01,
    internalTrace: { mappingStatus, reasons: [`band=${band}`, `discipline=${area}`, 'No se consultan otros ámbitos; coincidencia temática no equivale a aprobación curricular.'],
      ruleId: input.preferredInstrumentType ? `${rule.id}:TEACHER_OVERRIDE` : rule.id, activityTypeOrigin: explicit ? 'EXPLICIT' : detected.id !== 'OTHER' ? 'DETECTED' : 'DEFAULT',
      ranking: ranking.slice(0, 24).map(r => ({ elementId: r.element.elementId, score: r.score, topicCoverage: r.topicCoverage, reasons: r.reasons })),
      curriculumStatus, lowCurriculumConfidence: confidence === 'LOW', consideredTypes: Object.keys(typeWeights) } }
  assertValidRecommendation(result)
  return result
}

export function assertValidRecommendation(result: InstrumentRecommendation) {
  if (!result.criteria.length) throw new Error('Recomendación inválida: no contiene criterios.')
  if (!Number.isInteger(result.totalScoreUnits) || result.totalScoreUnits <= 0 || !Number.isFinite(result.totalScore)) throw new Error('Recomendación inválida: puntuación total no válida.')
  const scoreTotal = result.criteria.reduce((total, criterion) => total + criterion.maxScoreUnits, 0)
  if (scoreTotal !== result.totalScoreUnits) throw new Error('Recomendación inválida: los criterios no suman la puntuación total.')
  for (const criterion of result.criteria) {
    if (!criterion.title.trim() || !criterion.description.trim()) throw new Error('Recomendación inválida: criterio vacío.')
    if (!Number.isInteger(criterion.maxScoreUnits) || criterion.maxScoreUnits <= 0 || !Number.isFinite(criterion.maxScore)) throw new Error('Recomendación inválida: puntuación de criterio no válida.')
    if ((result.instrumentType === 'rubrica' || result.instrumentType === 'escala') && (criterion.descriptors.length !== result.levels.length || criterion.descriptors.some(item => !item.text.trim()))) throw new Error('Recomendación inválida: descriptor de desempeño vacío o incompleto.')
  }
}
