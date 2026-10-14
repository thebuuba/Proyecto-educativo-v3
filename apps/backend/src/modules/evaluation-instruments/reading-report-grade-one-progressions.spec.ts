import { describe, expect, it } from 'vitest'
import { recommend } from './recommendation-engine'
import type { AcademicContext } from './curriculum-context'
const context: AcademicContext = { level: 'SECONDARY', cycle: 1, grade: 1, subjectCode: 'LEN', subjectName: 'Lengua Española', modalityCode: 'academic', optativeExitName: null }

describe('informe de lectura de primero: progresión y enfoque solicitado', () => {
  for (const [activity, description] of [
    ['READING_REPORT_WRITING', 'Lee un cuento y redacta un informe de lectura con resumen, análisis de personajes y conclusión.'],
    ['READING_REPORT_ANALYSIS', 'Analiza un informe de lectura e identifica su resumen, análisis y conclusión.'],
    ['READING_REPORT_COMPARISON', 'Compara dos informes de lectura y sustenta las diferencias entre sus interpretaciones.'],
    ['READING_REPORT_PRESENTATION', 'Presenta oralmente el informe de lectura del cuento leído.'],
  ]) for (const format of ['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada'] as const) for (const maxScore of [20, 17.35]) it(`${activity} ${format} ${maxScore}`, () => {
    const result = recommend({ activityTitle: 'Actividad', description, pedagogicalActivityType: activity, participationMode: 'INDIVIDUAL', maxScore, preferredInstrumentType: format }, context, null, [], 'NO_MAPPING', null)
    expect(result.criteria.every(row => row.templateId.startsWith('report-'))).toBe(true)
    expect(result.totalScoreUnits).toBe(Math.round(maxScore * 100))
    if (format === 'rubrica' || format === 'escala') for (const row of result.criteria) {
      expect(row.descriptors[2].text.startsWith(row.description.replace(/[.!?]+$/, ''))).toBe(false)
      expect(row.descriptors[3].text).not.toContain('No aporta evidencia suficiente para valorar')
    }
    if (format === 'lista-ponderada') expect(result.criteria.every(row => row.description.includes('Parcial (50%):'))).toBe(true)
    if (format === 'lista-cotejo' || format === 'escala') expect(result.criteria.every(row => row.title === row.description)).toBe(true)
  })
  it('evalúa los personajes pedidos y no impone patrones socioculturales', () => {
    const result = recommend({ activityTitle: 'Actividad', description: 'Redacta un informe de lectura sobre el cuento leído con resumen, análisis de personajes y conclusión personal.',
      participationMode: 'INDIVIDUAL', maxScore: 20 }, context, null, [], 'NO_MAPPING', null)
    expect(result.criteria.some(row => /personajes/i.test(row.description))).toBe(true)
    expect(result.criteria.map(row => row.description).join(' ')).not.toMatch(/sociocultural|costumbres|estilos de vida/)
  })
  it('no convierte el resto de la consigna en el nombre del texto leído', () => {
    const result = recommend({ activityTitle: 'Actividad', description: 'Lee un cuento y redacta un informe de lectura con introducción, resumen y análisis.', participationMode: 'INDIVIDUAL', maxScore: 20 }, context, null, [], 'NO_MAPPING', null)
    expect(result.criteria[0].title).not.toContain('redacta')
    expect(result.criteria[0].description).not.toContain('cuento y redacta')
  })
})
