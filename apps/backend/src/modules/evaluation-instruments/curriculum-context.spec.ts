import { describe, expect, it } from 'vitest'
import { discipline, type AcademicContext } from './curriculum-context'
import { recommend } from './recommendation-engine'

describe('official secondary subject identities', () => {
  it.each([
    ['Ciencias de la Naturaleza', 'science'], ['Ciencias Sociales', 'social'], ['Matemática', 'math'],
    ['Lengua Española', 'language'], ['Lenguas Extranjeras Inglés', 'language'], ['Lenguas Extranjeras Francés', 'language'],
    ['Educación Artística', 'art'], ['Educación Física', 'motor'], ['Formación Integral Humana y Religiosa', 'fihr'],
  ])('classifies the official name %s', (areaName, expected) => {
    expect(discipline({ id: 'scope', versionId: 'version', cycle: 1, grade: 1, areaName,
      subjectName: areaName, modalityName: null, optativeExitName: null }, null)).toBe(expected)
  })
  it('uses social evidence rather than natural science dimensions for Social Sciences', () => {
    const context: AcademicContext = { level: 'SECONDARY', cycle: 1, grade: 1, subjectCode: 'SOC',
      subjectName: 'Ciencias Sociales', modalityCode: 'academic', optativeExitName: null }
    const result = recommend({ activityTitle: 'Migraciones', description: 'Analiza las causas y consecuencias de las migraciones.',
      participationMode: 'INDIVIDUAL', maxScore: 20 }, context, null, [], 'NO_MAPPING', null)
    expect(result.criteria.map(criterion => criterion.templateId)).toContain('social-context')
    expect(result.criteria.map(criterion => criterion.templateId)).not.toContain('science-content')
  })
})
