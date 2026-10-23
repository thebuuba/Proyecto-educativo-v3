import { describe, expect, it } from 'vitest'
import { editableFallbackRecommendation, recommendationToFields } from './instrumentPreparation'
import { scoreInstrumentFields } from './instrumentScoring'

describe('alternativa contextual de noticia de primero', () => {
  for (const format of ['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada'] as const) {
    it(`conserva la evidencia específica en ${format}`, () => {
      const result = editableFallbackRecommendation({ activityTitle: 'Actividad', description: 'Redacta una noticia con titular, entrada y cuerpo.',
        secondaryLanguageGrade: 1, activityType: 'NEWS_WRITING', participationMode: 'INDIVIDUAL', maxScore: 17.35, instrumentType: format })
      expect(result.criteria[0].templateId).toBe('news-essential')
      expect(result.criteria[0].maxScoreUnits).toBe(434)
      if (format === 'rubrica') expect(result.criteria[0].descriptors[2].text).toBe('Se reconoce el hecho, pero faltan datos de quién, dónde, cuándo o cómo.')
      if (format === 'escala') {
        expect(result.criteria[0].title).toMatch(/quién|hecho|noticia/)
        expect(result.criteria[0].descriptors[2].text).toBe('Se reconoce el hecho, pero faltan datos de quién, dónde, cuándo o cómo.')
      }
      if (format === 'lista-ponderada') expect(result.criteria[0].description).toContain('Parcial (50%): Se reconoce el hecho')
      const fields = recommendationToFields(result, 'Actividad')
      expect(fields[`${format}:description:0`]).toBe(result.criteria[0].description)
    })
    it(`${format}: puntaje pendiente y recálculo conservan una edición manual`, () => {
      const result = editableFallbackRecommendation({ activityTitle: 'Actividad', description: 'Redacta una noticia con titular, entrada y cuerpo.',
        secondaryLanguageGrade: 1, activityType: 'NEWS_WRITING', participationMode: 'INDIVIDUAL', maxScore: 20, instrumentType: format })
      const original = recommendationToFields(result, 'Actividad')
      const pending = scoreInstrumentFields(original, format, null, result)
      expect(pending[`${format}:points:0`]).toBe('')
      pending[`${format}:description:0`] = 'Edición manual: precisar el lugar del hecho.'
      for (const score of [20, 17.35]) {
        const fields = scoreInstrumentFields(pending, format, score, result)
        expect(fields[`${format}:description:0`]).toBe(pending[`${format}:description:0`])
        expect(result.criteria.reduce((sum, _, index) => sum + Math.round(Number(fields[`${format}:points:${index}`]) * 100), 0)).toBe(Math.round(score * 100))
      }
    })
  }
})
