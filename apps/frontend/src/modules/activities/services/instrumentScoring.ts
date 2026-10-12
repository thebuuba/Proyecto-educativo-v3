import type { InstrumentRecommendation } from '@aula/shared'
import { distributeScoreUnits, INSTRUMENT_MAX_CRITERIA, INSTRUMENT_MIN_LEVELS, INSTRUMENT_MAX_LEVELS } from '@aula/shared'
import { alignRecommendationWithFields } from './instrumentPreparation'

export function validActivityScore(value: string): number | null {
  if (!/^\d+(?:\.\d{1,2})?$/.test(value.trim())) return null
  const score = Number(value)
  return score > 0 && score <= 10000 ? score : null
}

export const distributeUnits = distributeScoreUnits

function count(fields: Record<string, string>, type: string) {
  const value = Number(fields[`${type}:meta:criteriaCount`]) || Object.keys(fields).filter(key => key.startsWith(`${type}:criterion:`)).length
  return Number.isInteger(value) && value > 0 && value <= INSTRUMENT_MAX_CRITERIA ? value : 0
}

function numericWeights(value: string | undefined): number[] {
  try {
    const weights: unknown = JSON.parse(value || '[]')
    return Array.isArray(weights) && weights.every(weight => typeof weight === 'number' && Number.isFinite(weight) && weight >= 0) ? weights : []
  } catch { return [] }
}

function validLevelCount(fields: Record<string, string>, type: string) {
  const value = Number(fields[`${type}:meta:levelCount`] ?? 4)
  return Number.isInteger(value) && value >= INSTRUMENT_MIN_LEVELS && value <= INSTRUMENT_MAX_LEVELS ? value : 0
}

/** Keep a stable relative basis across repeated changes of the activity total. */
export function rememberManualScoreWeights(fields: Record<string, string>, type: string): Record<string, string> {
  if (!type || type === 'lista-ponderada' || fields[`${type}:meta:scorePending`] === 'true') return fields
  const weights = Array.from({ length: count(fields, type) }, (_, index) => Number(fields[`${type}:points:${index}`]))
  if (weights.some(value => !Number.isFinite(value) || value < 0) || weights.every(value => value === 0)) return fields
  return { ...fields, [`${type}:meta:scoreWeights`]: JSON.stringify(weights) }
}

export function rememberManualLevelWeights(fields: Record<string, string>, type: string): Record<string, string> {
  if (!['rubrica', 'escala'].includes(type) || fields[`${type}:meta:scorePending`] === 'true') return fields
  const length = validLevelCount(fields, type)
  if (!length) return fields
  const weights = Array.from({ length }, (_, index) => Number(fields[`${type}:level-points:${length - index}`]))
  if (weights.some(value => !Number.isFinite(value) || value < 0) || weights.every(value => value === 0)) return fields
  return { ...fields, [`${type}:meta:levelScoreWeights`]: JSON.stringify(weights) }
}

export function scoreInstrumentFields(fields: Record<string, string>, type: string, score: number | null, proposal?: InstrumentRecommendation): Record<string, string> {
  if (!type) return fields
  if (score !== null && validActivityScore(String(score)) === null) score = null
  const next = { ...fields }
  const length = count(fields, type)
  if (!length) return next
  if (['rubrica', 'escala'].includes(type) && !validLevelCount(fields, type)) return next
  if (!next[`${type}:meta:scoreWeights`]) {
    const original = proposal?.criteria.map(criterion => criterion.maxScoreUnits) ?? []
    next[`${type}:meta:scoreWeights`] = JSON.stringify(original.length === length ? original : Array.from({ length }, () => 1))
  }
  if (type === 'rubrica' || type === 'escala') {
    const levelCount = validLevelCount(fields, type)
    if (!next[`${type}:meta:levelScoreWeights`]) next[`${type}:meta:levelScoreWeights`] = JSON.stringify(
      Array.from({ length: levelCount }, (_, index) => {
        const raw = fields[`${type}:level-points:${levelCount - index}`]
        return raw !== undefined && raw !== '' && Number.isFinite(Number(raw)) && Number(raw) >= 0 ? Number(raw) : (type === 'rubrica' ? levelCount - index - 1 : levelCount - index)
      }))
  }
  if (score === null) {
    next[`${type}:meta:scorePending`] = 'true'
    for (let index = 0; index < length; index++) next[`${type}:points:${index}`] = ''
    return next
  }
  let basis = numericWeights(next[`${type}:meta:scoreWeights`])
  if (basis.length !== length) basis = Array.from({ length }, (_, index) => fields[`${type}:points:${index}`] === undefined ? 1 : Number(fields[`${type}:points:${index}`]))
  const weights = type === 'lista-ponderada'
    ? Array.from({ length }, (_, index) => Number(fields[`${type}:weight:${index}`])) : basis
  distributeUnits(Math.round(score * 100), weights).forEach((units, index) => { next[`${type}:points:${index}`] = String(units / 100) })
  if (type === 'rubrica' || type === 'escala') {
    const levelCount = validLevelCount(fields, type)
    let levels = numericWeights(next[`${type}:meta:levelScoreWeights`])
    if (levels.length !== levelCount) levels = Array.from({ length: levelCount }, (_, index) => Number(fields[`${type}:level-points:${levelCount - index}`]))
    if (levels.some(value => !Number.isFinite(value) || value < 0) || !levels.some(value => value > 0)) levels = Array.from({ length: levelCount }, (_, index) => levelCount - index - 1)
    // Level points are relative weights; rounding against criterion zero destroys their proportions.
    levels.forEach((weight, index) => {
      next[`${type}:level-points:${levelCount - index}`] = String(weight)
    })
  }
  next[`${type}:meta:scorePending`] = 'false'
  return next
}

export function scoreRecommendation(proposal: InstrumentRecommendation, fields: Record<string, string>, score: number | null): InstrumentRecommendation {
  if (score !== null) {
    const aligned = alignRecommendationWithFields(proposal, fields, score)
    if (aligned) return aligned
  }
  const type = proposal.instrumentType
  const criteria = proposal.criteria.map((criterion, index) => {
    const raw = Number(fields[`${type}:points:${index}`])
    const units = score === null || !Number.isFinite(raw) || raw < 0 ? 0 : Math.round(raw * 100)
    return { ...criterion, maxScore: units / 100, maxScoreUnits: units,
      descriptors: criterion.descriptors.map((descriptor, levelIndex) => ({ ...descriptor,
        scoreUnits: criterion.maxScoreUnits ? Math.round(units * descriptor.scoreUnits / criterion.maxScoreUnits)
          : Math.round(units * (proposal.levels[levelIndex]?.proportion ?? 0)) })) }
  })
  return { ...proposal, criteria, totalScore: score ?? 0, totalScoreUnits: score === null ? 0 : Math.round(score * 100) }
}
