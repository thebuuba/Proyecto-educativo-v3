import { describe, expect, it } from 'vitest'
import { recommend } from './recommendation-engine'
import type { AcademicContext } from './curriculum-context'
import { detectSecondaryLanguageActivity } from '@aula/shared'

const context: AcademicContext = { level: 'SECONDARY', cycle: 1, grade: 1, subjectCode: 'LEN', subjectName: 'Lengua Española', modalityCode: 'academic', optativeExitName: null }
const activities = [
  ['NEWS_WRITING', 'Redacta una noticia de la comunidad con titular, entrada y cuerpo.'],
  ['NEWS_ANALYSIS', 'Analiza la noticia y localiza sus partes y datos.'],
  ['NEWS_COMPARISON', 'Compara dos noticias y justifica semejanzas y diferencias.'],
  ['NEWSCAST', 'Presenta una noticia en un noticiero con sus datos principales.'],
  ['DEBATE', 'Debate sobre una noticia y sustenta tu postura con sus datos.'],
] as const
describe('noticia de primero: evidencia progresiva y formatos', () => {
  it('detecta el informe sobre la noticia desde la consigna, sin elección manual', () => {
    expect(detectSecondaryLanguageActivity('Actividad', 'Redacta un informe sobre una noticia y explica sus datos y fuentes.', context)).toBe('REPORT')
  })
  it('un título de noticia no convierte ejercicios eléctricos en redacción periodística', () => {
    const result = recommend({ activityTitle: 'La noticia', description: 'Resolverán ejercicios de voltaje y resistencia.',
      pedagogicalActivityType: 'EXERCISE_SET', participationMode: 'INDIVIDUAL', maxScore: 20 }, context, null, [], 'NO_MAPPING', null)
    expect(result.criteria.some(row => row.templateId.startsWith('news-'))).toBe(false)
  })
  for (const [activity, description] of activities) for (const format of ['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada'] as const) for (const maxScore of [20, 17.35]) {
    it(`${activity} ${format} ${maxScore}`, () => {
      const result = recommend({ activityTitle: 'Actividad de aprendizaje', description, pedagogicalActivityType: activity,
        participationMode: 'INDIVIDUAL', maxScore, preferredInstrumentType: format }, context, null, [], 'NO_MAPPING', null)
      expect(result.criteria.every(row => row.templateId.startsWith('news-'))).toBe(true)
      expect(result.totalScoreUnits).toBe(Math.round(maxScore * 100))
      for (const criterion of result.criteria) {
        if (format === 'rubrica' || format === 'escala') {
          expect(criterion.descriptors[2].text.startsWith(criterion.description.replace(/[.!?]+$/, ''))).toBe(false)
          expect(new Set(criterion.descriptors.map(row => row.text)).size).toBe(4)
          expect(criterion.descriptors[3].text).not.toContain('No aporta evidencia suficiente para valorar')
        }
        if (format === 'lista-cotejo' || format === 'escala') expect(criterion.title).toBe(criterion.description)
        if (format === 'lista-ponderada') expect(criterion.description).toContain('Parcial (50%):')
      }
    })
  }
  it('un informe sobre una noticia no exige redactar una noticia nueva', () => {
    const result = recommend({ activityTitle: 'Actividad', description: 'Redacta un informe sobre una noticia y explica sus datos y fuentes.',
      pedagogicalActivityType: 'REPORT', participationMode: 'INDIVIDUAL', maxScore: 20 }, context, null, [], 'NO_MAPPING', null)
    expect(result.criteria.some(row => /informe/i.test(row.title))).toBe(true)
    expect(result.criteria.map(row => row.description).join(' ')).not.toContain('Redacta un hecho noticioso')
  })
})
