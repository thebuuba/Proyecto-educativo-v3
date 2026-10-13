import { describe, expect, it } from 'vitest'
import { editableFallbackRecommendation, recommendationToFields } from './instrumentPreparation'
import { scoreInstrumentFields } from './instrumentScoring'

describe('alternativa contextual de guía turística de primero', () => {
  for (const [activityType, description] of [
    ['TOURIST_GUIDE_ANALYSIS', 'Analiza las guías turísticas y explica cómo orientan al visitante.'],
    ['TOURIST_GUIDE_COMPARISON', 'Compara dos guías turísticas y sustenta su conclusión.'],
    ['TOURIST_GUIDE_PRESENTATION', 'Presenta las guías turísticas de dos lugares.'],
  ]) for (const format of ['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada'] as const) it(`${activityType} plural en ${format}`, () => {
    const result = editableFallbackRecommendation({ activityTitle: 'Actividad', description, secondaryLanguageGrade: 1, activityType,
      participationMode: 'INDIVIDUAL', maxScore: 17.35, instrumentType: format })
    expect(result.criteria.every(row => row.templateId.startsWith('guide-'))).toBe(true)
  })
  it('conserva la guía como tema principal aunque se mencione una noticia', () => {
    const result = editableFallbackRecommendation({ activityTitle: 'Actividad', description: 'Redacta un informe sobre una guía turística. Menciona una noticia como contraste.',
      secondaryLanguageGrade: 1, activityType: 'REPORT', participationMode: 'INDIVIDUAL', maxScore: 20, instrumentType: 'rubrica' })
    expect(result.criteria.every(row => row.templateId.startsWith('guide-'))).toBe(true)
  })
  for (const format of ['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada'] as const) it(format, () => {
    const result = editableFallbackRecommendation({ activityTitle: 'Actividad', description: 'Elabora una guía turística de dos lugares con un mapa o fotografías.',
      secondaryLanguageGrade: 1, activityType: 'TOURIST_GUIDE_CREATION', participationMode: 'INDIVIDUAL', maxScore: 20, instrumentType: format })
    expect(result.criteria.every(row => row.templateId.startsWith('guide-'))).toBe(true)
    expect(result.criteria.find(row => row.templateId === 'guide-visual')?.description).toContain('alternativas solicitadas')
    if (format === 'rubrica' || format === 'escala') expect(result.criteria[0].descriptors[3].text).toBe('No aporta información reconocible de los lugares de la guía.')
    if (format === 'lista-ponderada') expect(result.criteria[0].description).toContain('Parcial (50%):')
    const pending = scoreInstrumentFields(recommendationToFields(result, 'Actividad'), format, null, result)
    expect(pending[`${format}:points:0`]).toBe('')
    pending[`${format}:description:0`] = 'Precisión manual del lugar seleccionado.'
    for (const score of [20, 17.35]) {
      const fields = scoreInstrumentFields(pending, format, score, result)
      expect(fields[`${format}:description:0`]).toBe(pending[`${format}:description:0`])
      expect(result.criteria.reduce((sum, _, index) => sum + Math.round(Number(fields[`${format}:points:${index}`]) * 100), 0)).toBe(Math.round(score * 100))
    }
  })
})
