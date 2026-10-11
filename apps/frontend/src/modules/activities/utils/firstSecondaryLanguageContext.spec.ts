import { describe, expect, it } from 'vitest'
import { isFirstSecondaryLanguage } from './firstSecondaryLanguageContext'

describe('contexto de Lengua Española de 1.º de secundaria', () => {
  const subject = { id: 'ss-1', academicLevelCode: 'secundario', gradeSequence: 1,
    gradeName: '1.º', sectionName: 'A', subjectCode: 'LEN', subjectName: 'Lengua Española' }

  it('reconoce metadatos oficiales y nombres equivalentes cuando faltan códigos', () => {
    expect(isFirstSecondaryLanguage(subject)).toBe(true)
    expect(isFirstSecondaryLanguage({ ...subject, academicLevelCode: null, academicLevelName: 'Secundaria', gradeSequence: null, subjectCode: undefined })).toBe(true)
  })

  it('no activa las opciones contextuales en otros grados o áreas', () => {
    expect(isFirstSecondaryLanguage({ ...subject, gradeSequence: 2, gradeName: '2.º' })).toBe(false)
    expect(isFirstSecondaryLanguage({ ...subject, academicLevelCode: 'primario' })).toBe(false)
    expect(isFirstSecondaryLanguage({ ...subject, subjectCode: 'MAT', subjectName: 'Matemática' })).toBe(false)
  })
})
