import { describe, expect, it } from 'vitest'
import { editableFallbackRecommendation, recommendationToFields } from './instrumentPreparation'
import { rememberManualLevelWeights, rememberManualScoreWeights, scoreInstrumentFields, scoreRecommendation, validActivityScore } from './instrumentScoring'

const formats = ['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada'] as const

describe('puntaje pendiente y redistribución del instrumento', () => {
  it('distingue vacío, cero y decimales incompletos de un total confirmado', () => {
    expect(validActivityScore('')).toBeNull()
    expect(validActivityScore('0')).toBeNull()
    expect(validActivityScore('17.')).toBeNull()
    expect(validActivityScore('17.35')).toBe(17.35)
    expect(validActivityScore('20')).toBe(20)
  })

  it.each(formats)('prepara %s sin puntos y cambia 20 → 30 → 17.35 sin tocar contenido', type => {
    const proposal = editableFallbackRecommendation({ activityTitle: 'La noticia', description: 'Redactarán una noticia.',
      maxScore: 20, instrumentType: type, participationMode: 'INDIVIDUAL' })
    const original = recommendationToFields(proposal, 'La noticia')
    const pending = scoreInstrumentFields(original, type, null, proposal)
    expect(pending[`${type}:meta:scorePending`]).toBe('true')
    expect(pending[`${type}:points:0`]).toBe('')
    expect(scoreRecommendation(proposal, pending, null).totalScoreUnits).toBe(0)
    const content = pending[`${type}:criterion:0`]
    let fields = pending
    for (const score of [20, 30, 17.35]) {
      fields = scoreInstrumentFields(fields, type, score, proposal)
      const count = Number(fields[`${type}:meta:criteriaCount`])
      expect(Array.from({ length: count }, (_, index) => Math.round(Number(fields[`${type}:points:${index}`]) * 100))
        .reduce((sum, units) => sum + units, 0)).toBe(Math.round(score * 100))
      expect(fields[`${type}:criterion:0`]).toBe(content)
      expect(scoreRecommendation(proposal, fields, score).totalScoreUnits).toBe(Math.round(score * 100))
    }
    const cleared = scoreInstrumentFields(fields, type, null, proposal)
    expect(cleared[`${type}:criterion:0`]).toBe(content)
    expect(cleared[`${type}:points:0`]).toBe('')
  })

  it('conserva proporciones manuales al cambiar varias veces el total', () => {
    const proposal = editableFallbackRecommendation({ activityTitle: 'La noticia', maxScore: 20,
      instrumentType: 'rubrica', participationMode: 'INDIVIDUAL' })
    const original = scoreInstrumentFields(recommendationToFields(proposal, 'La noticia'), 'rubrica', 20, proposal)
    const edited = rememberManualLevelWeights(rememberManualScoreWeights({ ...original,
      'rubrica:points:0': '8', 'rubrica:points:1': '2',
      'rubrica:criterion:0': 'Criterio propio', 'rubrica:descriptor:0:4': 'Descriptor propio',
      'rubrica:level-points:4': '6', 'rubrica:level-points:3': '4',
    }, 'rubrica'), 'rubrica')
    const direct = scoreInstrumentFields(edited, 'rubrica', 20, proposal)
    const thirty = scoreInstrumentFields(edited, 'rubrica', 30, proposal)
    const twenty = scoreInstrumentFields(thirty, 'rubrica', 20, proposal)
    expect(twenty['rubrica:points:0']).toBe(direct['rubrica:points:0'])
    expect(twenty['rubrica:points:1']).toBe(direct['rubrica:points:1'])
    expect(twenty['rubrica:criterion:0']).toBe('Criterio propio')
    expect(twenty['rubrica:descriptor:0:4']).toBe('Descriptor propio')
    expect(twenty['rubrica:level-points:4']).toBe(direct['rubrica:level-points:4'])
    expect(twenty['rubrica:level-points:3']).toBe(direct['rubrica:level-points:3'])
  })
})
