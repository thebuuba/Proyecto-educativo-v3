import type { InstrumentRecommendation, RecommendationCriterion } from '@aula/shared'
import { distributeUnits, scoreInstrumentFields, scoreRecommendation } from './instrumentScoring'

type InstrumentType = InstrumentRecommendation['instrumentType']

function words(value: string) {
  return new Set(value.toLocaleLowerCase('es-DO').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .split(/[^a-z0-9]+/).filter(word => word.length > 3 && !['para', 'sobre', 'entre', 'texto', 'criterio'].includes(word)))
}

function equivalent(left: string, right: string) {
  const a = words(left); const b = words(right)
  if (!a.size || !b.size) return false
  const shared = [...a].filter(word => b.has(word)).length
  return shared / Math.min(a.size, b.size) >= 0.75
}

export function nextCatalogCriterion(candidates: RecommendationCriterion[], fields: Record<string, string>,
  type: InstrumentType, used: RecommendationCriterion[] = []): RecommendationCriterion | null {
  const count = Number(fields[`${type}:meta:criteriaCount`]) || 0
  const titles = Array.from({ length: count }, (_, index) => fields[`${type}:criterion:${index}`] || '')
  const descriptions = Array.from({ length: count }, (_, index) => fields[`${type}:description:${index}`]
    || fields[`${type}:indicator:${index}`] || '')
  return candidates.find(candidate => candidate.title.trim() && candidate.description.trim()
    && !used.some(item => item.templateId === candidate.templateId
      && (equivalent(item.title, candidate.title) || equivalent(item.description, candidate.description)))
    && !titles.some(title => equivalent(title, candidate.title))
    && !descriptions.some(description => equivalent(description, candidate.description))) ?? null
}

export function appendInstrumentCriterion(fields: Record<string, string>, type: InstrumentType, score: number | null,
  proposal: InstrumentRecommendation | undefined, criterion: RecommendationCriterion | null) {
  const count = Number(fields[`${type}:meta:criteriaCount`]) || 0
  const next: Record<string, string> = { ...fields, [`${type}:meta:criteriaCount`]: String(count + 1),
    [`${type}:criterion:${count}`]: criterion ? ['lista-cotejo', 'escala'].includes(type) ? criterion.description : criterion.title : '',
    [`${type}:description:${count}`]: criterion?.description ?? '' }
  if (type === 'lista-ponderada') next[`${type}:indicator:${count}`] = criterion?.description ?? ''
  if (type === 'rubrica') {
    const levels = Number(fields['rubrica:meta:levelCount']) || 4
    for (let index = 0; index < levels; index++) {
      const source = criterion?.descriptors[Math.round(index * Math.max(0, (criterion.descriptors.length - 1)) / Math.max(1, levels - 1))]
      next[`rubrica:descriptor:${count}:${levels - index}`] = source?.text ?? ''
    }
  }
  const previous: number[] = (() => { try { return JSON.parse(fields[`${type}:meta:scoreWeights`] || '[]') } catch { return [] } })()
  const basis = previous.length === count ? previous : Array.from({ length: count }, (_, index) => Number(fields[`${type}:points:${index}`]) || 1)
  next[`${type}:meta:scoreWeights`] = JSON.stringify([...basis, basis.reduce((a, b) => a + b, 0) / Math.max(1, count) || 1])
  if (type === 'lista-ponderada') {
    const oldWeights = Array.from({ length: count }, (_, index) => Number(fields[`${type}:weight:${index}`]) || 1)
    const units = distributeUnits(10000, [...oldWeights, oldWeights.reduce((a, b) => a + b, 0) / Math.max(1, count) || 1])
    units.forEach((value, index) => { next[`${type}:weight:${index}`] = String(value / 100) })
  }
  const prepared = proposal ? { ...proposal, criteria: [...proposal.criteria, criterion ?? {
    id: `manual:${count}`, templateId: 'manual', title: '', description: '', maxScore: 0, maxScoreUnits: 0,
    sourceType: 'TEACHER_REUSED' as const, sourceReferences: [], descriptors: [],
  }] } : undefined
  const scored = scoreInstrumentFields(next, type, score, prepared)
  return { fields: scored, recommendation: prepared ? scoreRecommendation(prepared, scored, score) : undefined }
}
