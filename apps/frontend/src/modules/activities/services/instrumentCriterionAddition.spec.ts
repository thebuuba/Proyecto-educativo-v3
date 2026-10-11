import { describe, expect, it } from 'vitest'
import { editableFallbackRecommendation, recommendationToFields } from './instrumentPreparation'
import { appendInstrumentCriterion, nextCatalogCriterion } from './instrumentCriterionAddition'
import { scoreInstrumentFields } from './instrumentScoring'

const formats = ['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada'] as const

function fixture(type: (typeof formats)[number], score: number | null) {
  const recommendation = editableFallbackRecommendation({ activityTitle: 'Informe de lectura de un cuento',
    description: 'Elaborarán un informe de lectura con resumen, personajes y conclusión.', maxScore: 20,
    instrumentType: type, participationMode: 'INDIVIDUAL', activityType: 'READING_REPORT_WRITING', secondaryLanguageGrade: 1 })
  const fields = scoreInstrumentFields(recommendationToFields(recommendation, 'Informe de lectura de un cuento'), type, score, recommendation)
  const candidate = { ...recommendation.criteria[0], id: 'additional:evidence', templateId: 'additional:evidence',
    title: 'Evidencias del cuento', description: 'Sustenta el análisis de los personajes con ejemplos del cuento.',
    descriptors: recommendation.criteria[0].descriptors.map((item, index) => ({ ...item, text: `Evidencia diferenciada ${index + 1}` })) }
  return { recommendation, fields, candidate }
}

describe('Añadir criterio desde el catálogo', () => {
  it.each(formats)('incorpora una propuesta completa a %s sin duplicar ni borrar ediciones', type => {
    const { recommendation, fields, candidate } = fixture(type, null)
    const edited = { ...fields, [`${type}:criterion:0`]: 'Criterio de la docente', [`${type}:description:0`]: 'Descripción de la docente',
      ...(type === 'rubrica' ? { 'rubrica:descriptor:0:4': 'Descriptor de la docente' } : {}) }
    const selected = nextCatalogCriterion([recommendation.criteria[0], candidate], edited, type, recommendation.criteria)
    expect(selected?.title).toBe(candidate.title)
    const result = appendInstrumentCriterion(edited, type, null, recommendation, selected)
    const index = recommendation.criteria.length
    expect(result.fields[`${type}:criterion:${index}`]).toBe(['lista-cotejo', 'escala'].includes(type) ? candidate.description : candidate.title)
    expect(result.fields[`${type}:description:${index}`]).toBe(candidate.description)
    expect(result.fields[`${type}:criterion:0`]).toBe('Criterio de la docente')
    expect(result.fields[`${type}:description:0`]).toBe('Descripción de la docente')
    expect(result.fields[`${type}:points:${index}`]).toBe('')
    expect(result.fields[`${type}:meta:scorePending`]).toBe('true')
    expect(result.recommendation?.criteria.at(-1)?.title).toBe(candidate.title)
    if (type === 'rubrica') {
      expect(result.fields['rubrica:descriptor:0:4']).toBe('Descriptor de la docente')
      expect(result.fields[`rubrica:descriptor:${index}:4`]).toBe('Evidencia diferenciada 1')
      expect(result.fields['rubrica:meta:levelCount']).toBe(fields['rubrica:meta:levelCount'])
    }
    if (type === 'lista-ponderada') expect(result.fields[`lista-ponderada:indicator:${index}`]).toBe(candidate.description)
  })

  it.each(formats)('añade una fila vacía a %s cuando se agotan las propuestas', type => {
    const { recommendation, fields } = fixture(type, null)
    const selected = nextCatalogCriterion(recommendation.criteria, fields, type, recommendation.criteria)
    expect(selected).toBeNull()
    const result = appendInstrumentCriterion(fields, type, null, recommendation, selected)
    const index = recommendation.criteria.length
    expect(result.fields[`${type}:criterion:${index}`]).toBe('')
    expect(result.fields[`${type}:description:${index}`]).toBe('')
    expect(result.fields[`${type}:points:${index}`]).toBe('')
    if (type === 'rubrica') expect(result.fields[`rubrica:descriptor:${index}:4`]).toBe('')
    if (type === 'lista-ponderada') expect(result.fields[`lista-ponderada:indicator:${index}`]).toBe('')
  })

  it.each(formats)('descarta equivalentes aunque tengan otro identificador en %s', type => {
    const { fields, candidate, recommendation } = fixture(type, null)
    const usedFields = { ...fields, [`${type}:criterion:0`]: candidate.title,
      [`${type}:description:0`]: candidate.description }
    const equivalent = { ...candidate, id: 'different-id', templateId: 'different-template',
      title: 'Evidencia del cuento', description: 'Sustenta el análisis de personajes con ejemplos pertinentes del cuento.' }
    expect(nextCatalogCriterion([equivalent], usedFields, type, recommendation.criteria)).toBeNull()
  })

  it.each(formats)('redistribuye %s con 20 y 17.35 puntos exactos y proporciones estables', type => {
    for (const total of [20, 17.35]) {
      const { recommendation, fields, candidate } = fixture(type, total)
      const originalPoints = recommendation.criteria.map((_, index) => Number(fields[`${type}:points:${index}`]))
      const result = appendInstrumentCriterion(fields, type, total, recommendation, candidate)
      const values = Array.from({ length: recommendation.criteria.length + 1 }, (_, index) => Number(result.fields[`${type}:points:${index}`]))
      expect(values.reduce((sum, value) => sum + Math.round(value * 100), 0)).toBe(Math.round(total * 100))
      expect(values.every(value => /^\d+(?:\.\d{1,2})?$/.test(String(value)))).toBe(true)
      expect(result.recommendation?.totalScoreUnits).toBe(Math.round(total * 100))
      expect(values[0] / values[1]).toBeCloseTo(originalPoints[0] / originalPoints[1], 1)
    }
  })
})
