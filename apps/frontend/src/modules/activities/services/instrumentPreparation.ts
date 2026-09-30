import type { InstrumentRecommendation } from '@aula/shared'
import { api } from '@/services/apiClient'

export type ActivityInterpretation = {
  suggestedActivityType: string
  activityType: string
  activityTypes: string[]
  curriculumVersionId: string | null
  curriculumScopeId: string | null
  curriculumCandidates: Array<{ elementId: string; type: string; text: string; sources: Array<{ documentId: string; pdfPage: number; printedPage: string | null }> }>
  curriculumMatch: 'SUGGESTED' | 'NONE'
  message: string
}

export function interpretActivity(input: { sectionSubjectId: string; activityTitle: string; description?: string; pedagogicalActivityType?: string; competencyBlock?: string }, signal?: AbortSignal) {
  return api.post<ActivityInterpretation>('/evaluation-instruments/interpret', input, { signal })
}

export function prepareInstrument(input: { sectionSubjectId: string; activityTitle: string; description?: string; participationMode: 'INDIVIDUAL' | 'GROUP'; pedagogicalActivityType?: string; maxScore: number; competencyBlock?: string; curriculumVersionId?: string; preferredInstrumentType?: string; selectedCurriculumElementIds?: string[] }) {
  return api.post<InstrumentRecommendation>('/evaluation-instruments/recommend', input)
}

export function preparationFingerprint(input: { name: string; description: string; maxScore: string; pedagogicalActivityType?: string; activityType: string; instrumentType: string; selectedCurriculumElementIds?: string[] }) {
  return JSON.stringify([input.name, input.description, input.maxScore, input.pedagogicalActivityType, input.activityType, input.instrumentType, input.selectedCurriculumElementIds ?? []])
}

/** Adapter into the existing four builders; no second instrument editor is created. */
export function recommendationToFields(proposal: InstrumentRecommendation, activityName: string): Record<string, string> {
  const type = proposal.instrumentType
  const fields: Record<string, string> = {
    [`${type}:title`]: `${type === 'rubrica' ? 'Rúbrica' : type === 'escala' ? 'Escala estimativa' : type === 'lista-cotejo' ? 'Lista de cotejo' : 'Lista ponderada'} para ${activityName}`,
    [`${type}:meta:criteriaCount`]: String(proposal.criteria.length),
    [`${type}:meta:prepared`]: 'true',
  }
  if (type === 'rubrica' || type === 'escala') {
    fields[`${type}:meta:levelCount`] = String(proposal.levels.length)
    for (const [index, level] of proposal.levels.entries()) {
      const score = proposal.levels.length - index
      fields[`${type}:level-name:${score}`] = level.label
      fields[`${type}:level-points:${score}`] = String(type === 'rubrica' ? proposal.levels.length - index - 1 : score)
    }
  }
  if (type === 'lista-cotejo') fields['lista-cotejo:meta:pointsMode'] = 'individual'
  if (type === 'lista-ponderada') fields['lista-ponderada:meta:partial'] = 'true'
  for (const [index, criterion] of proposal.criteria.entries()) {
    fields[`${type}:criterion:${index}`] = criterion.title
    fields[`${type}:description:${index}`] = criterion.description
    fields[`${type}:points:${index}`] = String(criterion.maxScoreUnits / 100)
    if (type === 'lista-ponderada') {
      fields[`${type}:indicator:${index}`] = criterion.description
      fields[`${type}:weight:${index}`] = String(Math.round(criterion.maxScoreUnits / proposal.totalScoreUnits * 10000) / 100)
    }
    if (type === 'rubrica') for (const [levelIndex, descriptor] of criterion.descriptors.entries()) {
      fields[`rubrica:descriptor:${index}:${proposal.levels.length - levelIndex}`] = descriptor.text
    }
  }
  if (type === 'lista-ponderada') {
    const weights = proposal.criteria.map(criterion => Math.floor(criterion.maxScoreUnits * 10000 / proposal.totalScoreUnits))
    let remainder = 10000 - weights.reduce((sum, weight) => sum + weight, 0)
    for (let index = 0; remainder > 0; index = (index + 1) % weights.length, remainder--) weights[index]++
    weights.forEach((weight, index) => { fields[`${type}:weight:${index}`] = String(weight / 100) })
  }
  return fields
}

export function alignRecommendationWithFields(proposal: InstrumentRecommendation, fields: Record<string, string>, maxScore: number): InstrumentRecommendation | null {
  const type = proposal.instrumentType
  const count = Number(fields[`${type}:meta:criteriaCount`])
  if (!Number.isInteger(count) || count < 1 || count > 20) return null
  const weightedUnits = type === 'lista-ponderada' ? (() => {
    const weights = Array.from({ length: count }, (_, index) => Number(fields[`${type}:weight:${index}`]))
    if (weights.some(weight => !Number.isFinite(weight) || weight <= 0) || Math.abs(weights.reduce((sum, weight) => sum + weight, 0) - 100) > 0.001) return null
    const raw = weights.map(weight => Math.round(maxScore * 100) * weight / 100)
    const units = raw.map(Math.floor)
    let remainder = Math.round(maxScore * 100) - units.reduce((sum, value) => sum + value, 0)
    const order = raw.map((value, index) => ({ index, fractional: value - units[index] })).sort((a, b) => b.fractional - a.fractional || a.index - b.index)
    for (const item of order) { if (!remainder) break; units[item.index]++; remainder-- }
    return units
  })() : null
  if (type === 'lista-ponderada' && !weightedUnits) return null
  const criteria = Array.from({ length: count }, (_, index) => {
    const prior = proposal.criteria[index]
    const title = fields[`${type}:criterion:${index}`]?.trim() ?? ''
    const scoreUnits = type === 'lista-ponderada'
      ? weightedUnits![index]
      : Math.round(Number(fields[`${type}:points:${index}`]) * 100)
    const description = (fields[`${type}:description:${index}`] ?? (type === 'lista-ponderada' ? fields[`${type}:indicator:${index}`] : prior?.description ?? title))?.trim() ?? ''
    const descriptors = type === 'rubrica'
      ? Array.from({ length: Number(fields['rubrica:meta:levelCount']) || 4 }, (_, levelIndex) => ({
          levelId: `L${Number(fields['rubrica:meta:levelCount']) - levelIndex}`,
          text: fields[`rubrica:descriptor:${index}:${Number(fields['rubrica:meta:levelCount']) - levelIndex}`]?.trim() ?? '',
          scoreUnits: Math.round(scoreUnits * (Number(fields['rubrica:meta:levelCount']) - levelIndex - 1) / (Number(fields['rubrica:meta:levelCount']) - 1)),
        })) : prior?.descriptors ?? []
    const edited = !prior || prior.title !== title || prior.description !== description
    return { id: prior?.id ?? `teacher:${index}`, templateId: prior?.templateId ?? 'teacher', title, description,
      maxScore: scoreUnits / 100, maxScoreUnits: scoreUnits,
      sourceType: edited ? 'ACTIVITY_TEMPLATE' as const : prior.sourceType,
      sourceReferences: edited ? [] : prior.sourceReferences, descriptors }
  })
  if (criteria.some(criterion => !criterion.title || !Number.isInteger(criterion.maxScoreUnits) || criterion.maxScoreUnits <= 0 || criterion.descriptors.some(descriptor => !descriptor.text))) return null
  const totalScoreUnits = criteria.reduce((sum, criterion) => sum + criterion.maxScoreUnits, 0)
  if (totalScoreUnits !== Math.round(maxScore * 100)) return null
  return { ...proposal, criteria, totalScore: maxScore, totalScoreUnits,
    selectedCurriculumElements: [...new Map(criteria.flatMap(criterion => criterion.sourceReferences).map(ref => [ref.elementId, ref])).values()] }
}
