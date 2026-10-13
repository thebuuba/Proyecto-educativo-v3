import { describe, expect, it } from 'vitest'
import { editableFallbackRecommendation, recommendationToFields } from './instrumentPreparation'
import { scoreInstrumentFields } from './instrumentScoring'

describe('informe de lectura de primero compartido con la alternativa', () => {
  for (const format of ['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada'] as const) it(format, () => {
    const result = editableFallbackRecommendation({ activityTitle: 'Actividad', description: 'Lee un cuento y redacta un informe de lectura con resumen, análisis de personajes y conclusión personal.',
      secondaryLanguageGrade: 1, activityType: 'READING_REPORT_WRITING', participationMode: 'INDIVIDUAL', maxScore: 20, instrumentType: format })
    expect(result.criteria.every(row => row.templateId.startsWith('report-'))).toBe(true)
    expect(result.criteria.find(row => row.templateId === 'report-analysis')?.description).toContain('personajes')
    expect(result.criteria.some(row => row.templateId === 'report-conclusion')).toBe(true)
    expect(result.criteria.map(row => row.description).join(' ')).not.toMatch(/sociocultural|costumbres/)
    if (format === 'rubrica' || format === 'escala') expect(result.criteria[0].descriptors[3].text).toBe('No presenta una síntesis reconocible del texto leído.')
    const pending = scoreInstrumentFields(recommendationToFields(result, 'Actividad'), format, null, result)
    expect(pending[`${format}:points:0`]).toBe('')
    pending[`${format}:description:0`] = 'Edición manual de la síntesis.'
    for (const score of [20, 17.35]) {
      const fields = scoreInstrumentFields(pending, format, score, result)
      expect(fields[`${format}:description:0`]).toBe(pending[`${format}:description:0`])
      expect(result.criteria.reduce((sum, _, index) => sum + Math.round(Number(fields[`${format}:points:${index}`]) * 100), 0)).toBe(Math.round(score * 100))
    }
  })
})
