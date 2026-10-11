import type { InstrumentRecommendation } from '@aula/shared'

export function validActivityScore(value: string): number | null {
  if (!/^\d+(?:\.\d{1,2})?$/.test(value.trim())) return null
  const score = Number(value)
  return score > 0 && score <= 10000 ? score : null
}

function distributeUnits(total: number, weights: number[]): number[] {
  const safe = weights.map(value => Number.isFinite(value) && value > 0 ? value : 0)
  const sum = safe.reduce((value, weight) => value + weight, 0)
  const basis = sum > 0 ? safe : safe.map(() => 1)
  const divisor = basis.reduce((value, weight) => value + weight, 0)
  const shares = basis.map(weight => total * weight / divisor)
  const units = shares.map(Math.floor)
  let remainder = total - units.reduce((value, amount) => value + amount, 0)
  shares.map((share, index) => ({ index, fraction: share - units[index] }))
    .sort((a, b) => b.fraction - a.fraction || a.index - b.index)
    .forEach(item => { if (remainder > 0) { units[item.index]++; remainder-- } })
  return units
}

function count(fields: Record<string, string>, type: string) {
  return Number(fields[`${type}:meta:criteriaCount`]) || Object.keys(fields).filter(key => key.startsWith(`${type}:criterion:`)).length
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
  const length = Number(fields[`${type}:meta:levelCount`]) || 4
  const weights = Array.from({ length }, (_, index) => Number(fields[`${type}:level-points:${length - index}`]))
  if (weights.some(value => !Number.isFinite(value) || value < 0) || weights.every(value => value === 0)) return fields
  return { ...fields, [`${type}:meta:levelScoreWeights`]: JSON.stringify(weights) }
}

export function scoreInstrumentFields(fields: Record<string, string>, type: string, score: number | null, proposal?: InstrumentRecommendation): Record<string, string> {
  if (!type) return fields
  const next = { ...fields }
  const length = count(fields, type)
  if (!length) return next
  if (!next[`${type}:meta:scoreWeights`]) {
    const original = proposal?.criteria.map(criterion => criterion.maxScoreUnits) ?? []
    next[`${type}:meta:scoreWeights`] = JSON.stringify(original.length === length ? original : Array.from({ length }, () => 1))
  }
  if (type === 'rubrica' || type === 'escala') {
    const levelCount = Number(fields[`${type}:meta:levelCount`]) || 4
    if (!next[`${type}:meta:levelScoreWeights`]) next[`${type}:meta:levelScoreWeights`] = JSON.stringify(
      Array.from({ length: levelCount }, (_, index) => Number(fields[`${type}:level-points:${levelCount - index}`]) || (type === 'rubrica' ? levelCount - index - 1 : levelCount - index)))
  }
  if (score === null) {
    next[`${type}:meta:scorePending`] = 'true'
    for (let index = 0; index < length; index++) next[`${type}:points:${index}`] = ''
    return next
  }
  let basis: number[] = []
  try { basis = JSON.parse(next[`${type}:meta:scoreWeights`]) as number[] } catch { /* use equal weights */ }
  if (basis.length !== length) basis = Array.from({ length }, (_, index) => Number(fields[`${type}:points:${index}`]) || 1)
  const weights = type === 'lista-ponderada'
    ? Array.from({ length }, (_, index) => Number(fields[`${type}:weight:${index}`])) : basis
  distributeUnits(Math.round(score * 100), weights).forEach((units, index) => { next[`${type}:points:${index}`] = String(units / 100) })
  if (type === 'rubrica' || type === 'escala') {
    const levelCount = Number(fields[`${type}:meta:levelCount`]) || 4
    let levels: number[] = []
    try { levels = JSON.parse(next[`${type}:meta:levelScoreWeights`]) as number[] } catch { /* use level order */ }
    if (levels.length !== levelCount) levels = Array.from({ length: levelCount }, (_, index) => levelCount - index - 1)
    const top = Math.max(...levels, 1)
    const criterionMaximum = Number(next[`${type}:points:0`])
    levels.forEach((weight, index) => {
      next[`${type}:level-points:${levelCount - index}`] = String(Math.round(criterionMaximum * weight / top * 100) / 100)
    })
  }
  next[`${type}:meta:scorePending`] = 'false'
  return next
}

export function scoreRecommendation(proposal: InstrumentRecommendation, fields: Record<string, string>, score: number | null): InstrumentRecommendation {
  const type = proposal.instrumentType
  const criteria = proposal.criteria.map((criterion, index) => {
    const units = score === null ? 0 : Math.round(Number(fields[`${type}:points:${index}`]) * 100)
    return { ...criterion, maxScore: units / 100, maxScoreUnits: units,
      descriptors: criterion.descriptors.map((descriptor, levelIndex) => ({ ...descriptor,
        scoreUnits: criterion.maxScoreUnits ? Math.round(units * descriptor.scoreUnits / criterion.maxScoreUnits)
          : Math.round(units * (proposal.levels[levelIndex]?.proportion ?? 0)) })) }
  })
  return { ...proposal, criteria, totalScore: score ?? 0, totalScoreUnits: score === null ? 0 : Math.round(score * 100) }
}
