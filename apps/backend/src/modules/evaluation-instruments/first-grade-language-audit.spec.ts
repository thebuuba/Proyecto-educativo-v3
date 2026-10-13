import { describe, expect, it } from 'vitest'
import { recommend } from './recommendation-engine'
import type { AcademicContext } from './curriculum-context'

const context: AcademicContext = { level: 'SECONDARY', cycle: 1, grade: 1, subjectCode: 'LEN', subjectName: 'Lengua Española', modalityCode: 'academic', optativeExitName: null }
describe('re-audit of existing first grade language modules', () => {
  it.each([
    ['NEWS_ANALYSIS', 'Presentarán un noticiero con noticias de la comunidad.', 'Identificación de sus partes'],
    ['NEWS_COMPARISON', 'Leerán y analizarán una noticia de la comunidad.', 'Comparación de la información'],
    ['NEWS_WRITING', 'Analizarán una noticia y presentarán un noticiero.', 'Titular, entrada y cuerpo'],
  ])('keeps criteria for the teacher-selected %s', (activity, description, criterion) => {
    const result = recommend({ activityTitle: 'La noticia', description, pedagogicalActivityType: activity,
      participationMode: 'INDIVIDUAL', maxScore: 20 }, context, null, [], 'NO_MAPPING', null)
    expect(result.activityType).toBe(activity)
    expect(result.criteria.map(row => row.title)).toContain(criterion)
  })
})
