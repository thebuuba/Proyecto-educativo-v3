import { describe, expect, it } from 'vitest'
import { discipline, resolveScope, type AcademicContext } from './curriculum-context'
import { recommend } from './recommendation-engine'

describe('official secondary subject identities', () => {
  for (const modalityCode of ['technical_professional', 'arts']) {
    for (const grade of [4, 5, 6]) {
      it.each([
        ['LEN', 'Lengua Española'], ['MAT', 'Matemática'], ['SOC', 'Ciencias Sociales'], ['NAT', 'Ciencias de la Naturaleza'],
        ['ART', 'Educación Artística'], ['EFI', 'Educación Física'], ['FHR', 'Formación Integral Humana y Religiosa'], ['ING', 'Inglés'], ['FRA', 'Francés'],
      ])(`resolves only the common academic component of ${modalityCode} grade ${grade}: %s`, (subjectCode, subjectName) => {
        const context: AcademicContext = { level: 'SECONDARY', cycle: 2, grade, subjectCode, subjectName, modalityCode, optativeExitName: null }
        const common = { id: 'common', versionId: 'version', cycle: 2, grade, areaName: subjectName, subjectName, modalityName: null, optativeExitName: null }
        const result = resolveScope(context, [common, { ...common, id: 'exit', optativeExitName: 'Humanidades y Lenguas Modernas' }])
        expect(result.scope?.id).toBe('common')
      })
    }
    it(`rejects an academic exit in ${modalityCode}`, () => {
      expect(resolveScope({ level: 'SECONDARY', cycle: 2, grade: 4, subjectCode: 'OPT-HLM-LEN-4', subjectName: 'Apreciación y Producción Literarias',
        modalityCode, optativeExitName: 'Humanidades y Lenguas Modernas' }, []).status).toBe('UNSUPPORTED_MODALITY')
    })
    it(`does not extend ${modalityCode} to the first cycle`, () => {
      expect(resolveScope({ level: 'SECONDARY', cycle: 1, grade: 2, subjectCode: 'LEN', subjectName: 'Lengua Española',
        modalityCode, optativeExitName: null }, []).status).toBe('UNSUPPORTED_MODALITY')
    })
  }
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
