import type { InstrumentType } from './instrument-recommendation'

export const INSTRUMENT_TYPES = ['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada'] as const
export const INSTRUMENT_MAX_CRITERIA = 20
export class InstrumentCapacityError extends RangeError {
  readonly criterionCount: number
  constructor(criterionCount: number) {
    super(`La consigna requiere ${criterionCount} criterios y el instrumento admite hasta ${INSTRUMENT_MAX_CRITERIA}. Divide la actividad o acota sus requisitos para generar un instrumento completo. Se conservaron tus cambios.`)
    this.name = 'InstrumentCapacityError'
    this.criterionCount = criterionCount
  }
}
export function assertInstrumentCapacity(criterionCount: number) {
  if (criterionCount > INSTRUMENT_MAX_CRITERIA) throw new InstrumentCapacityError(criterionCount)
}
export const INSTRUMENT_MIN_LEVELS = 2
export const INSTRUMENT_MAX_LEVELS = 6
export const INSTRUMENT_NO_APPLY_SELECTION = -1
export type InstrumentEvaluationConfiguration = {
  criteria: { id?: string; title: string; description: string; maximum: number; descriptors?: string[] }[]
  levels: { label: string; points: number }[]
  noApply: boolean
  maxScore: number
}
export type InstrumentEvaluationResult = { score: number; criterionScores: number[]; applicableMaximums: number[] }

/** Largest remainder in integer cents; scaling weights prevents overflow in their sum. */
export function distributeScoreUnits(totalUnits: number, weights: number[]): number[] {
  if (!Number.isSafeInteger(totalUnits) || totalUnits < 0) throw new RangeError('El total debe ser un entero seguro no negativo.')
  if (!weights.length) return []
  const safe = weights.map(weight => Number.isFinite(weight) && weight > 0 ? weight : 0)
  const largest = Math.max(...safe)
  const basis = largest > 0 ? safe.map(weight => weight / largest) : safe.map(() => 1)
  const divisor = basis.reduce((sum, weight) => sum + weight, 0)
  const shares = basis.map(weight => totalUnits * (weight / divisor))
  const units = shares.map(Math.floor)
  const remainder = totalUnits - units.reduce((sum, amount) => sum + amount, 0)
  const order = shares.map((share, index) => ({ index, fraction: share - units[index] }))
    .sort((a, b) => b.fraction - a.fraction || a.index - b.index)
  for (let index = 0; index < remainder; index++) units[order[index % order.length].index]++
  return units
}

function decimal(value: string | undefined): number | null {
  if (typeof value !== 'string' || !/^\d+(?:\.\d{1,2})?$/.test(value.trim())) return null
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

function relativePoints(value: string | undefined): number {
  if (typeof value !== 'string' || !/^\d+(?:\.\d+)?$/.test(value.trim())) return NaN
  return Number(value)
}

function inferredCount(fields: Record<string, string>, type: string) {
  const declared = fields[`${type}:meta:criteriaCount`]
  if (declared !== undefined) return Number(declared)
  const indices = Object.keys(fields).filter(key => key.startsWith(`${type}:criterion:`))
    .map(key => Number(key.split(':').at(-1))).filter(Number.isInteger)
  return indices.length ? Math.max(...indices) + 1 : 0
}

function levelsFor(type: InstrumentType, fields: Record<string, string>) {
  if (type === 'lista-cotejo') return [
    { label: fields[`${type}:meta:yesLabel`] ?? 'Sí', points: 1 },
    { label: fields[`${type}:meta:noLabel`] ?? 'No', points: 0 },
  ]
  if (type === 'lista-ponderada') return [
    { label: fields[`${type}:meta:yesLabel`] ?? 'Sí', points: 100 },
    ...(fields[`${type}:meta:partial`] !== 'false' ? [{ label: fields[`${type}:meta:partialLabel`] ?? 'Parcial', points: decimal(fields[`${type}:meta:partialValue`] ?? '50') ?? NaN }] : []),
    { label: fields[`${type}:meta:noLabel`] ?? 'No', points: 0 },
  ]
  const count = Number(fields[`${type}:meta:levelCount`] ?? 4)
  if (!Number.isInteger(count) || count < INSTRUMENT_MIN_LEVELS || count > INSTRUMENT_MAX_LEVELS) return []
  return Array.from({ length: count }, (_, index) => ({
    label: fields[`${type}:level-name:${count - index}`] ?? '',
    points: relativePoints(fields[`${type}:level-points:${count - index}`]),
  }))
}

/** Shared trust-boundary validation, including manual instruments and legacy field maps. */
export function validateInstrumentDefinition(type: string, fields: Record<string, string>, maxScore: number): string[] {
  const issues: string[] = []
  if (!INSTRUMENT_TYPES.includes(type as InstrumentType)) return ['Tipo de instrumento no válido.']
  if (!fields || typeof fields !== 'object' || Array.isArray(fields) || Object.values(fields).some(value => typeof value !== 'string')) return ['Los campos del instrumento deben ser cadenas.']
  if (!Number.isFinite(maxScore) || maxScore < 0.01 || maxScore > 10000 || Math.abs(maxScore * 100 - Math.round(maxScore * 100)) > 1e-7) issues.push('El máximo debe estar entre 0.01 y 10000 con hasta dos decimales.')
  const count = inferredCount(fields, type)
  if (!Number.isInteger(count) || count < 1 || count > INSTRUMENT_MAX_CRITERIA) return [...issues, 'Se requieren entre 1 y 20 criterios.']
  if (fields[`${type}:meta:scorePending`] === 'true') issues.push('Confirma el puntaje del instrumento.')
  let totalUnits = 0
  const identities = new Set<string>()
  for (let index = 0; index < count; index++) {
    const identity = fields[`${type}:criterion-id:${index}`]
    if (identity !== undefined) {
      if (!identity.trim() || identities.has(identity)) issues.push('Las identidades de los criterios deben ser únicas.')
      identities.add(identity)
    }
    if (!fields[`${type}:criterion:${index}`]?.trim()) issues.push(`Completa el criterio ${index + 1}.`)
    const value = decimal(fields[`${type}:${type === 'lista-ponderada' ? 'weight' : 'points'}:${index}`])
    if (value === null || value > (type === 'lista-ponderada' ? 100 : 10000)) issues.push(`Puntaje o peso no válido en el criterio ${index + 1}.`)
    else totalUnits += Math.round(value * 100)
    if (type === 'lista-ponderada' && !fields[`${type}:indicator:${index}`]?.trim()) issues.push(`Completa el indicador ${index + 1}.`)
  }
  if (totalUnits !== (type === 'lista-ponderada' ? 10000 : Math.round(maxScore * 100))) issues.push('La distribución debe coincidir exactamente con el total.')
  const levels = levelsFor(type as InstrumentType, fields)
  if (levels.length < INSTRUMENT_MIN_LEVELS || levels.length > INSTRUMENT_MAX_LEVELS) issues.push('Se requieren entre 2 y 6 niveles.')
  const names = levels.map(level => level.label.trim().toLocaleLowerCase('es'))
  if (names.some(name => !name) || new Set(names).size !== names.length) issues.push('Los niveles necesitan etiquetas distintas y completas.')
  if (levels.some(level => !Number.isFinite(level.points) || level.points < 0 || level.points > 10000)
    || levels[0]?.points <= 0 || levels.some((level, index) => index > 0 && level.points > levels[index - 1].points)) issues.push('Los puntos de los niveles deben ser descendentes y tener un máximo positivo.')
  if (type === 'lista-ponderada' && levels.length === 3 && (levels[1].points <= 0 || levels[1].points >= 100)) issues.push('El valor parcial debe estar entre 0 y 100.')
  for (const flag of ['noApply', 'partial']) if (fields[`${type}:meta:${flag}`] !== undefined && !['true', 'false'].includes(fields[`${type}:meta:${flag}`])) issues.push(`Configuración ${flag} no válida.`)
  if (type === 'rubrica') for (let row = 0; row < count; row++) for (let level = 1; level <= levels.length; level++) {
    if (!fields[`rubrica:descriptor:${row}:${level}`]?.trim()) issues.push(`Completa el descriptor del criterio ${row + 1}, nivel ${level}.`)
  }
  if (type === 'escala') for (let row = 0; row < count; row++) {
    const authored = Array.from({length:levels.length},(_,index)=>fields[`escala:descriptor:${row}:${index+1}`]).some(value=>value !== undefined)
    if (authored) for (let level = 1; level <= levels.length; level++) if (!fields[`escala:descriptor:${row}:${level}`]?.trim()) issues.push(`Completa el descriptor del indicador ${row + 1}, nivel ${level}.`)
  }
  return issues
}

/** Consumers validate before saving; malformed historical definitions safely return an empty configuration. */
export function instrumentEvaluationConfiguration(type: string, fields: Record<string, string>, maxScore: number): InstrumentEvaluationConfiguration {
  if (validateInstrumentDefinition(type, fields, maxScore).length) return { criteria: [], levels: [], noApply: false, maxScore }
  const count = inferredCount(fields, type)
  const levels = levelsFor(type as InstrumentType, fields).map(level => ({ ...level, label: level.label.trim() }))
  const maxima = type === 'lista-ponderada' ? distributeScoreUnits(Math.round(maxScore * 100), Array.from({ length: count }, (_, index) => Number(fields[`${type}:weight:${index}`])))
    : Array.from({ length: count }, (_, index) => Math.round(Number(fields[`${type}:points:${index}`]) * 100))
  return { maxScore, noApply: ['lista-cotejo', 'escala'].includes(type) && fields[`${type}:meta:noApply`] === 'true', levels,
    criteria: maxima.map((maximum, index) => ({ id: fields[`${type}:criterion-id:${index}`], title: fields[`${type}:criterion:${index}`].trim(),
      description: (type === 'lista-ponderada' ? fields[`${type}:indicator:${index}`] : fields[`${type}:description:${index}`] ?? fields[`${type}:criterion:${index}`]).trim(),
      maximum: maximum / 100,
      ...(type === 'rubrica' ? { descriptors: levels.map((_, levelIndex) => fields[`rubrica:descriptor:${index}:${levels.length - levelIndex}`].trim()) } : {}),
      ...(type === 'escala' && levels.every((_, levelIndex) => fields[`escala:descriptor:${index}:${levels.length - levelIndex}`]?.trim())
        ? { descriptors: levels.map((_, levelIndex) => fields[`escala:descriptor:${index}:${levels.length - levelIndex}`].trim()) } : {}),
    })) }
}

/** Selections are zero-based level indices, or -1 for No aplica. Missing/invalid evidence returns null. */
export function instrumentEvaluationResult(configuration: InstrumentEvaluationConfiguration, selections: number[]): InstrumentEvaluationResult | null {
  const { criteria, levels, maxScore, noApply } = configuration
  if (!criteria.length || criteria.length > INSTRUMENT_MAX_CRITERIA || levels.length < INSTRUMENT_MIN_LEVELS || levels.length > INSTRUMENT_MAX_LEVELS
    || selections.length !== criteria.length || !Number.isFinite(maxScore) || maxScore < 0.01 || maxScore > 10000
    || Math.abs(maxScore * 100 - Math.round(maxScore * 100)) > 1e-7) return null
  const top = Math.max(...levels.map(level => level.points))
  if (!Number.isFinite(top) || top <= 0 || levels.some(level => !Number.isFinite(level.points) || level.points < 0)
    || criteria.some(criterion => !Number.isFinite(criterion.maximum) || criterion.maximum < 0)) return null
  for (let index = 0; index < criteria.length; index++) {
    const selection = selections[index]
    if (!Number.isInteger(selection) || (selection === -1 ? !noApply : selection < 0 || selection >= levels.length)) return null
  }
  const weights = criteria.map((criterion, index) => selections[index] === -1 ? 0 : Math.round(criterion.maximum * 100))
  if (!weights.some(weight => weight > 0)) return null
  const maxima = distributeScoreUnits(Math.round(maxScore * 100), weights)
  const earned = maxima.map((maximum, index) => selections[index] === -1 ? 0 : maximum * (levels[selections[index]].points / top))
  const scoreUnits = Math.round(earned.reduce((sum, value) => sum + value, 0))
  const scores = earned.map(Math.floor)
  const remainder = scoreUnits - scores.reduce((sum, value) => sum + value, 0)
  const order = earned.map((value, index) => ({ index, fraction: value - scores[index] }))
    .sort((a, b) => b.fraction - a.fraction || a.index - b.index)
  // Round the original earned shares, so a fully achieved criterion never exceeds its maximum.
  for (let index = 0; index < remainder; index++) scores[order[index].index]++
  return { score: scoreUnits / 100, criterionScores: scores.map(value => value / 100), applicableMaximums: maxima.map(value => value / 100) }
}

export function calculateInstrumentEvaluation(configuration: InstrumentEvaluationConfiguration, selections: number[]): number | null {
  return instrumentEvaluationResult(configuration, selections)?.score ?? null
}
