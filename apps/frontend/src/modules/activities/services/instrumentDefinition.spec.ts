import { describe, expect, it } from 'vitest'
import * as definition from '@aula/shared'

const fields = {
  'escala:meta:criteriaCount': '2', 'escala:meta:levelCount': '3', 'escala:meta:noApply': 'true',
  'escala:criterion:0': 'Primero', 'escala:criterion:1': 'Segundo',
  'escala:points:0': '0.01', 'escala:points:1': '0',
  'escala:level-name:3': 'Completo', 'escala:level-name:2': 'Parcial', 'escala:level-name:1': 'Pendiente',
  'escala:level-points:3': '10', 'escala:level-points:2': '5', 'escala:level-points:1': '0',
}

describe('canonical instrument definition', () => {
  it('rejects sparse evidence of the expected length', () => {
    const config = definition.instrumentEvaluationConfiguration('escala', fields, 0.01)
    expect(definition.instrumentEvaluationResult(config, new Array<number>(2))).toBeNull()
    const partial = new Array<number>(2)
    partial[1] = 0
    expect(definition.instrumentEvaluationResult(config, partial)).toBeNull()
  })
  it('computes finite ratios before multiplying very large accepted relative values', () => {
    const config = { criteria: [{ title: 'C', description: 'D', maximum: 1 }],
      levels: [{ label: 'Full', points: Number.MAX_VALUE }, { label: 'Half', points: Number.MAX_VALUE / 2 }], maxScore: 1, noApply: false }
    expect(definition.instrumentEvaluationResult(config, [1])).toEqual({ score: 0.5, criterionScores: [0.5], applicableMaximums: [1] })
  })
  it('distributes exact cents with zeros, tiny totals and invalid numbers', () => {
    expect(definition.distributeScoreUnits(1, [0, 1, 1])).toEqual([0, 1, 0])
    expect(definition.distributeScoreUnits(1735, [33.33, 33.33, 33.34]).reduce((a, b) => a + b)).toBe(1735)
    expect(definition.distributeScoreUnits(100, [Number.MAX_VALUE, Number.MAX_VALUE])).toEqual([50, 50])
    expect(definition.distributeScoreUnits(0, [])).toEqual([])
    expect(() => definition.distributeScoreUnits(Infinity, [1])).toThrow(RangeError)
  })
  it('validates zero allocations, limits and numeric input at the trust boundary', () => {
    expect(definition.validateInstrumentDefinition('escala', fields, 0.01)).toEqual([])
    expect(definition.validateInstrumentDefinition('escala', { ...fields, 'escala:points:0': '' }, 0.01).length).toBeGreaterThan(0)
    expect(definition.validateInstrumentDefinition('escala', { ...fields, 'escala:meta:levelCount': '7' }, 0.01).length).toBeGreaterThan(0)
    expect(definition.validateInstrumentDefinition('unknown', fields, 0.01).length).toBeGreaterThan(0)
    expect(definition.validateInstrumentDefinition('escala', fields, NaN).length).toBeGreaterThan(0)
  })
  it('excludes No aplica from denominator and returns no grade for all excluded', () => {
    const normal = { ...fields, 'escala:points:0': '4', 'escala:points:1': '6' }
    const config = definition.instrumentEvaluationConfiguration('escala', normal, 10)
    expect(config.noApply).toBe(true)
    expect(definition.calculateInstrumentEvaluation(config, [-1, 1])).toBe(5)
    expect(definition.calculateInstrumentEvaluation(config, [-1, -1])).toBeNull()
    expect(definition.calculateInstrumentEvaluation(config, [0])).toBeNull()
    expect(definition.calculateInstrumentEvaluation({ ...config, noApply: false }, [-1, 0])).toBeNull()
    expect(definition.calculateInstrumentEvaluation(config, [0, 0])).toBe(10)
    expect(definition.calculateInstrumentEvaluation(config, [2, 2])).toBe(0)
  })
  it('uses exact weighted cents and custom partial labels', () => {
    const weighted = { 'lista-ponderada:meta:criteriaCount': '3', 'lista-ponderada:meta:partialValue': '25',
      'lista-ponderada:meta:partialLabel': 'Incompleto',
      ...Object.fromEntries([0, 1, 2].flatMap(index => [
        [`lista-ponderada:criterion:${index}`, `Criterio ${index}`],
        [`lista-ponderada:indicator:${index}`, `Indicador ${index}`],
        [`lista-ponderada:weight:${index}`, index === 2 ? '33.34' : '33.33'],
      ])) }
    expect(definition.validateInstrumentDefinition('lista-ponderada', weighted, 0.01)).toEqual([])
    const config = definition.instrumentEvaluationConfiguration('lista-ponderada', weighted, 0.01)
    expect(config.criteria.map(item => item.maximum)).toEqual([0, 0, 0.01])
    expect(config.levels[1]).toEqual({ label: 'Incompleto', points: 25 })
  })
  it('keeps criterion breakdowns equal to the grade and effective maximum', () => {
    const normal = { ...fields, 'escala:points:0': '4', 'escala:points:1': '6' }
    const config = definition.instrumentEvaluationConfiguration('escala', normal, 10)
    expect(definition.instrumentEvaluationResult(config, [-1, 1])).toEqual({ score: 5, criterionScores: [0, 5], applicableMaximums: [0, 10] })
    const small = definition.instrumentEvaluationConfiguration('escala', fields, 0.01)
    expect(definition.instrumentEvaluationResult(small, [0, 0])).toEqual({ score: 0.01, criterionScores: [0.01, 0], applicableMaximums: [0.01, 0] })
    expect(definition.instrumentEvaluationResult(small, [-1, 0])).toBeNull()
  })
  it('rejects duplicate persisted identities', () => {
    expect(definition.validateInstrumentDefinition('escala', { ...fields, 'escala:criterion-id:0': 'same', 'escala:criterion-id:1': 'same' }, 0.01).length).toBeGreaterThan(0)
  })
  it('returns null for invalid calculation maxima instead of throwing', () => {
    const config = definition.instrumentEvaluationConfiguration('escala', fields, 0.01)
    expect(definition.instrumentEvaluationResult({ ...config, maxScore: Number.MAX_VALUE }, [0, 0])).toBeNull()
  })
  it.each([2, 6])('supports twenty criteria and %s relative levels at one cent', count => {
    const full = { 'escala:meta:criteriaCount': '20', 'escala:meta:levelCount': String(count),
      ...Object.fromEntries(Array.from({ length: 20 }, (_, index) => [
        [`escala:criterion:${index}`, `Indicador ${index + 1}`], [`escala:points:${index}`, index === 0 ? '0.01' : '0'],
      ]).flat()),
      ...Object.fromEntries(Array.from({ length: count }, (_, index) => [
        [`escala:level-name:${count - index}`, `Nivel ${count - index}`], [`escala:level-points:${count - index}`, String(count - index - 1)],
      ]).flat()) }
    expect(definition.validateInstrumentDefinition('escala', full, 0.01)).toEqual([])
    const config = definition.instrumentEvaluationConfiguration('escala', full, 0.01)
    expect(definition.instrumentEvaluationResult(config, Array.from({ length: 20 }, () => 0))?.score).toBe(0.01)
  })
  it('never gives a fully achieved criterion an extra cent above its maximum', () => {
    const config = { criteria: Array.from({ length: 11 }, (_, index) => ({ title: 'C', description: 'D', maximum: index === 0 ? 10 : 0.01 })),
      levels: [{ label: 'Completo', points: 100 }, { label: 'Parcial', points: 5.1 }], maxScore: 10.1, noApply: false }
    const result = definition.instrumentEvaluationResult(config, [0, ...Array.from({ length: 10 }, () => 1)])
    expect(result?.score).toBe(10.01)
    expect(result?.criterionScores[0]).toBe(10)
    expect(result?.criterionScores.reduce((sum, value) => sum + Math.round(value * 100), 0)).toBe(1001)
  })
  it('rounds the aggregate once for fractional partial awards', () => {
    const config = { criteria: [6.67, 6.66, 6.67].map(maximum => ({ title: 'C', description: 'D', maximum })),
      levels: [{ label: 'Yes', points: 100 }, { label: 'Partial', points: 50 }, { label: 'No', points: 0 }], maxScore: 20, noApply: true }
    const result = definition.instrumentEvaluationResult(config, [1, 1, 1])
    expect(result).toEqual({ score: 10, criterionScores: [3.34, 3.33, 3.33], applicableMaximums: [6.67, 6.66, 6.67] })
    const excluded = definition.instrumentEvaluationResult(config, [-1, 1, 1])
    expect(excluded?.score).toBe(10)
    expect(excluded?.criterionScores[0]).toBe(0)
    expect(excluded?.applicableMaximums[0]).toBe(0)
  })
})
