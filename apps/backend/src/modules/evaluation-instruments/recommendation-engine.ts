import type { CurriculumReference, InstrumentRecommendation, RecommendationCriterion } from '@aula/shared'
import { type EvaluationCatalog, evaluationCatalogV1 } from './catalog-v1'
import { type AcademicContext, type ScopeCandidate, discipline, normalize } from './curriculum-context'

export interface RecommendationInput {
  activityTitle: string; description?: string; participationMode: 'INDIVIDUAL' | 'GROUP'
  pedagogicalActivityType?: string; maxScore: number; competencyBlock?: string; levelCount?: 4 | 5
}
export interface RankedElement extends CurriculumReference { normalizedText: string }
const stopWords = new Set('a al algo ante bajo con contra cual cuando de del desde durante e el ella en entre es esa ese esta este hay hasta la las le les lo los mas mi muy o para pero por que quien se segun ser si sin sobre su sus un una unos unas y'.split(' '))
// Conservative plural stems; no semantic synonym guessing or cross-scope retrieval.
export const tokens = (text: string) => [...new Set(normalize(text).split(' ').filter(t => t.length > 2 && !stopWords.has(t)).map(t => t.length > 5 ? t.replace(/(?:es|s)$/, '').replace(/[oa]$/, '') : t))]
const overlap = (query: string[], text: string) => { const values = new Set(tokens(text)); return query.filter(t => values.has(t)).length }
const typeWeights: Record<string, number> = { SPECIFIC_COMPETENCY: 12, EVALUATION_CRITERION: 14, ACHIEVEMENT_INDICATOR: 16, CONCEPT: 10, PROCEDURE: 12, ATTITUDE_VALUE: 3 }
const blockTerms: Record<string, string> = { b1: 'comunica comunicacion oral escrita', b2: 'pensamiento razonamiento problemas creativo critico', b3: 'etica ciudadana personal espiritual', b4: 'cientifica tecnologica ambiental salud' }

/** Integer hundredths are the scoring authority; numeric fields are display conveniences. */
export function distributeScore(maxScore: number, weights: number[]) {
  const units = Math.round(maxScore * 100)
  if (!Number.isFinite(maxScore) || maxScore <= 0 || maxScore > 10000 || Math.abs(units / 100 - maxScore) > 1e-9 || !weights.length || weights.some(w => !Number.isInteger(w) || w <= 0)) throw new Error('Puntuación inválida: use hasta dos decimales y pesos enteros positivos.')
  const sum = weights.reduce((a, b) => a + b, 0)
  const results = weights.map(w => Math.floor(units * w / sum))
  const order = weights.map((w, index) => ({ index, remainder: units * w % sum })).sort((a, b) => b.remainder - a.remainder || a.index - b.index)
  let remaining = units - results.reduce((a, b) => a + b, 0)
  for (const { index } of order) { if (!remaining) break; results[index]++; remaining-- }
  return results
}

export function recommend(input: RecommendationInput, context: AcademicContext | null, scope: ScopeCandidate | null,
  elements: RankedElement[], mappingStatus: string, curriculumStatus: string | null, catalog: EvaluationCatalog = evaluationCatalogV1): InstrumentRecommendation {
  const text = normalize(`${input.activityTitle} ${input.description ?? ''}`)
  const explicit = input.pedagogicalActivityType ? catalog.activityTypes.find(a => a.id === input.pedagogicalActivityType) : undefined
  if (input.pedagogicalActivityType && !explicit) throw new Error('Tipo pedagógico desconocido.')
  const detected = catalog.activityTypes.filter(a => a.triggers.some(t => text.includes(t)))
    .sort((a, b) => Math.max(...b.triggers.filter(t => text.includes(t)).map(t => t.length)) - Math.max(...a.triggers.filter(t => text.includes(t)).map(t => t.length)))[0]
  const activity = explicit ?? detected ?? catalog.activityTypes.find(a => a.id === 'OTHER')!
  const band = context?.level === 'PRIMARY' ? context.cycle === 1 ? 'PRIMARY_FIRST' : 'PRIMARY_SECOND' : 'SECONDARY'
  const area = discipline(scope, context)
  // Keep content/genre words (poema, ensayo, pintura). Strip only pedagogical boilerplate.
  const boilerplate = tokens('exposición presentación oral experimento experimentación práctica laboratorio producción escrita resolución problemas ejercicios artística observación clasificación')
  const topic = tokens(input.activityTitle).filter(t => !boilerplate.includes(t))
  const detail = tokens(input.description ?? '')
  const attitudeRelevant = /convivencia|cooperaci|valores|respeto|solidaridad|seguridad/.test(text)
  // Defense in depth: even accidentally supplied foreign elements are discarded before scoring.
  const eligible = elements.filter(e => scope && e.scopeId === scope.id && e.versionId === scope.versionId && e.type in typeWeights && (e.type !== 'ATTITUDE_VALUE' || attitudeRelevant))
  const ranking = eligible.map(element => {
    const matches = overlap(topic, element.normalizedText)
    const topicCoverage = topic.length ? matches / topic.length : 0
    const block = ['SPECIFIC_COMPETENCY', 'EVALUATION_CRITERION', 'ACHIEVEMENT_INDICATOR'].includes(element.type)
      ? overlap(tokens(blockTerms[input.competencyBlock ?? ''] ?? ''), element.normalizedText) : 0
    const procedure = element.type === 'PROCEDURE' ? overlap(tokens(activity.triggers.join(' ')), element.normalizedText) : 0
    const detailMatches = overlap(detail, element.normalizedText)
    return { element, score: matches ? Math.round(100 * topicCoverage + typeWeights[element.type] + Math.min(block, 3) * 2 + Math.min(procedure, 2) * 3 + Math.min(detailMatches, 4) * 2) : 0,
      topicCoverage, reasons: [`topicTokens=${matches}/${topic.length}`, `typeWeight=${typeWeights[element.type]}`, `blockMatches=${block}`, `procedureMatches=${procedure}`] }
  }).filter(r => r.score > 0).sort((a, b) => b.score - a.score || a.element.elementId.localeCompare(b.element.elementId))
  const topCoverage = ranking[0]?.topicCoverage ?? 0
  const confidence = !scope || topCoverage < 0.6 ? 'LOW' : topCoverage >= 0.85 ? 'HIGH' : 'MEDIUM'
  // Diverse evidence candidates, bounded independently of criterion count.
  const selected = confidence === 'LOW' ? [] : ranking.filter(r => r.topicCoverage >= 0.6).filter((r, i, all) => all.slice(0, i).filter(p => p.element.type === r.element.type).length < 2).slice(0, 12)
  const selectedRefs = selected.map(({ element: { normalizedText: _text, ...reference } }) => reference)
  const count = band === 'PRIMARY_FIRST' ? (input.maxScore <= 10 ? 3 : 4) : band === 'PRIMARY_SECOND' ? 5 : activity.family === 'SCIENTIFIC' ? 6 : 5
  const candidates = catalog.criterionTemplates.filter(t => (t.area === area || t.area === '*') && t.bands.includes(band)
    && (area === '*' || !t.families.length || t.families.includes(activity.family)) && t.evidence.some(e => activity.evidence.includes(e))
    && (!t.attitude || attitudeRelevant) && (!t.requires || t.requires.some(word => text.includes(normalize(word)))))
    .map(t => ({ template: t, score: t.weight + (t.area === area && area !== '*' ? 10 : 0)
      + (activity.family === 'ORAL' && ['organization', 'communication'].includes(t.id) ? 17 : 0)
      + (activity.family === 'SCIENTIFIC' && ['science-procedure', 'science-data', 'science-interpretation', 'science-conclusion', 'science-safety'].includes(t.id) ? 12 : 0)
      + overlap(tokens(t.keywords.join(' ')), text)
      + Math.min(2, selected.reduce((sum, r) => sum + overlap(tokens(t.keywords.join(' ')), r.element.normalizedText), 0)) }))
    .sort((a, b) => b.score - a.score || a.template.id.localeCompare(b.template.id)).slice(0, count)
  const scores = distributeScore(input.maxScore, candidates.map(c => c.template.weight))
  const rule = catalog.recommendationRules.filter(r => (!r.families.length || r.families.includes(activity.family)) && (!r.band || r.band === band)
    && (!r.maxScore || input.maxScore <= r.maxScore) && (!r.evidence || r.evidence.every(e => activity.evidence.includes(e))))
    .sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id))[0]
  const levelCount = input.levelCount ?? 4
  const template = catalog.instrumentTemplates.find(t => t.id === rule.instrument)!
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
    const description = literal ? literal.element.text : content ? `${observable} Contenido de referencia: «${content.element.text}».` : observable
    const sourceType = literal ? 'CURRICULUM_DERIVED' : content ? 'CONTEXTUALIZED' : 'ACTIVITY_TEMPLATE'
    const sourceReferences = reference ? selectedRefs.filter(r => r.elementId === reference.elementId) : []
    const patterns = band === 'PRIMARY_FIRST' ? catalog.descriptorPatterns.simple : catalog.descriptorPatterns.regular
    const patternIndexes = levelCount === 4 ? [0, 1, 3, 4] : [0, 1, 2, 3, 4]
    return { id: `proposal:${catalog.version}:${scope?.id ?? 'fallback'}:${criterion.id}`, templateId: criterion.id,
      title: criterion.title, description, maxScore: scores[index] / 100, maxScoreUnits: scores[index], sourceType, sourceReferences,
      descriptors: levels.map((level, i) => ({ levelId: level.id, text: `${observable} ${patterns[patternIndexes[i]]}${content?.element.type === 'CONCEPT' ? ` Referente: «${content.element.text}».` : ''}`, scoreUnits: Math.round(scores[index] * level.proportion) })) }
  })
  return { kind: 'RECOMMENDATION', catalogVersion: catalog.version, instrumentType: rule.instrument, confidence,
    activityType: activity.id, evidenceTypes: [...new Set([...activity.evidence, ...criteria.filter(c => catalog.criterionTemplates.find(t => t.id === c.templateId)?.attitude).map(() => 'ATTITUDE' as const)])],
    participationMode: input.participationMode, curriculumVersionId: scope?.versionId ?? null, curriculumScopeId: scope?.id ?? null,
    selectedCurriculumElements: selectedRefs, criteria, levels, totalScore: input.maxScore, totalScoreUnits: scores.reduce((a, b) => a + b, 0), scoreUnit: 0.01,
    internalTrace: { mappingStatus, reasons: [`band=${band}`, `discipline=${area}`, 'No se consultan otros ámbitos; coincidencia temática no equivale a aprobación curricular.'],
      ruleId: rule.id, activityTypeOrigin: explicit ? 'EXPLICIT' : detected ? 'DETECTED' : 'DEFAULT',
      ranking: ranking.slice(0, 24).map(r => ({ elementId: r.element.elementId, score: r.score, topicCoverage: r.topicCoverage, reasons: r.reasons })),
      curriculumStatus, lowCurriculumConfidence: confidence === 'LOW', consideredTypes: Object.keys(typeWeights) } }
}
