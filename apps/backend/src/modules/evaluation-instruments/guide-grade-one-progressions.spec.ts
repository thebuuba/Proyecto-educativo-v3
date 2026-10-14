import { describe, expect, it } from 'vitest'
import { recommend } from './recommendation-engine'
import type { AcademicContext } from './curriculum-context'
import { editableAuthoredRecommendation, firstGradeGuideCriteria, detectSecondaryLanguageActivity } from '@aula/shared'
const context: AcademicContext = { level: 'SECONDARY', cycle: 1, grade: 1, subjectCode: 'LEN', subjectName: 'Lengua Española', modalityCode: 'academic', optativeExitName: null }
describe('guía turística de primero: evidencia progresiva y requisitos', () => {
  it('explicar la información analizada no convierte el análisis en exposición oral', () => {
    expect(detectSecondaryLanguageActivity('Actividad', 'Analizarán guías turísticas, identificarán sus partes y explicarán cómo orientan al visitante.', context)).toBe('TOURIST_GUIDE_ANALYSIS')
    expect(detectSecondaryLanguageActivity('Actividad', 'Leerán una guía turística y la presentarán oralmente ante sus compañeros.', context)).toBe('TOURIST_GUIDE_PRESENTATION')
  })
  it('partes presentes describe el material y no ordena una presentación', () => {
    expect(detectSecondaryLanguageActivity('Actividad', 'Analizarán guías turísticas, identificarán las partes presentes y explicarán su información.', context)).toBe('TOURIST_GUIDE_ANALYSIS')
  })
  it('un informe sobre la guía no exige crear otra guía turística', () => {
    const description = 'Redacta un informe sobre una guía turística, analiza su información y formula una conclusión.'
    expect(detectSecondaryLanguageActivity('Actividad', description, context)).toBe('REPORT')
    const result = recommend({ activityTitle: 'Actividad', description, participationMode: 'INDIVIDUAL', maxScore: 20 }, context, null, [], 'NO_MAPPING', null)
    expect(result.criteria.some(row => row.title.includes('informe'))).toBe(true)
    expect(result.criteria.map(row => row.description).join(' ')).not.toContain('antes de publicar la guía')
  })
  it('una noticia citada dentro de un informe sobre guía no sustituye el tema principal', () => {
    const description = 'Redacta un informe sobre una guía turística y analiza cómo informa a los visitantes. Menciona una noticia como contraste.'
    const result = recommend({ activityTitle: 'Actividad', description, pedagogicalActivityType: 'REPORT', participationMode: 'INDIVIDUAL', maxScore: 20 }, context, null, [], 'NO_MAPPING', null)
    expect(result.criteria.every(row => row.templateId.startsWith('guide-'))).toBe(true)
  })
  it.each(['un cuento policíaco', 'un caligrama', 'un afiche'])('el informe sobre %s no impone crear el texto analizado', topic => {
    const description = `Redacta un informe sobre ${topic}, analiza su contenido y formula una conclusión.`
    expect(detectSecondaryLanguageActivity('Actividad', description, context)).toBe('REPORT')
    const result = recommend({ activityTitle: 'Actividad', description, participationMode: 'INDIVIDUAL', maxScore: 20 }, context, null, [], 'NO_MAPPING', null)
    expect(result.criteria.every(row => /^(detective|calligram|poster)-/.test(row.templateId))).toBe(true)
    expect(result.criteria.some(row => /report-organization$/.test(row.templateId))).toBe(true)
    expect(result.criteria.map(row=>row.description).join(' ')).not.toMatch(/Crea |Redacta un cuento|Compone |Diseña un afiche/)
  })
  for (const [activity, description] of [
    ['TOURIST_GUIDE_CREATION', 'Elabora una guía turística de dos lugares con un mapa o fotografías.'],
    ['TOURIST_GUIDE_ANALYSIS', 'Analiza una guía turística y explica cómo orienta al visitante.'],
    ['TOURIST_GUIDE_COMPARISON', 'Compara dos guías turísticas y sustenta cuál orienta mejor al visitante.'],
    ['TOURIST_GUIDE_PRESENTATION', 'Presenta una guía turística de dos lugares.'],
  ]) for (const format of ['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada'] as const) for (const maxScore of [20, 17.35]) {
    it(`${activity} ${format} ${maxScore}`, () => {
      const result = recommend({ activityTitle: 'Actividad', description, pedagogicalActivityType: activity, participationMode: 'INDIVIDUAL', maxScore, preferredInstrumentType: format }, context, null, [], 'NO_MAPPING', null)
      expect(result.totalScoreUnits).toBe(Math.round(maxScore * 100))
      expect(result.criteria.every(row => row.templateId.startsWith('guide-'))).toBe(true)
      if (format === 'rubrica' || format === 'escala') for (const criterion of result.criteria) {
        expect(criterion.descriptors[2].text.startsWith(criterion.description.replace(/[.!?]+$/, ''))).toBe(false)
        expect(criterion.descriptors[3].text).not.toContain('No aporta evidencia suficiente para valorar')
      }
      if (format === 'lista-ponderada') expect(result.criteria.every(row => row.description.includes('Parcial (50%):'))).toBe(true)
      if (format === 'lista-cotejo' || format === 'escala') expect(result.criteria.every(row => row.title === row.description)).toBe(true)
    })
  }
  it('respeta el mapa como alternativa a las fotografías', () => {
    const result = recommend({ activityTitle: 'Actividad', description: 'Elabora una guía turística de dos lugares con un mapa o fotografías.', participationMode: 'INDIVIDUAL', maxScore: 20 }, context, null, [], 'NO_MAPPING', null)
    expect(result.criteria.map(row => row.description).join(' ')).not.toContain('imágenes solicitadas')
  })
  it('no exige responder preguntas en una presentación que no las solicita', () => {
    const result = recommend({ activityTitle: 'Actividad', description: 'Presenta una guía turística de dos lugares.', participationMode: 'INDIVIDUAL', maxScore: 20 }, context, null, [], 'NO_MAPPING', null)
    expect(result.criteria.map(row => row.description).join(' ')).not.toContain('responde preguntas')
  })
  it.each(['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada'] as const)('servicio y alternativa comparten contenido y distribución exacta: %s', format => {
    const description = 'Elabora una guía turística de dos lugares con un mapa o fotografías.'
    const input = { activityTitle: 'Actividad', description, participationMode: 'INDIVIDUAL' as const, maxScore: 17.35,
      pedagogicalActivityType: 'TOURIST_GUIDE_CREATION', preferredInstrumentType: format }
    const service = recommend(input, context, null, [], 'NO_MAPPING', null)
    const local = editableAuthoredRecommendation(firstGradeGuideCriteria('TOURIST_GUIDE_CREATION', description),
      { ...input, instrumentType: format }, 'TOURIST_GUIDE_CREATION', 'lengua-secundaria-1-guia-turistica')
    const content = (result: typeof service) => result.criteria.map(row => ({ title: row.title, description: row.description,
      maxScoreUnits: row.maxScoreUnits, descriptors: row.descriptors.map(descriptor => descriptor.text) }))
    expect(content(service)).toEqual(content(local))
  })
})
