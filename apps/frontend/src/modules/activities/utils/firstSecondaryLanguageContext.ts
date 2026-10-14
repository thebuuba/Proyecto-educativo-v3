import type { SectionSubjectOption } from '@/modules/activities/types'

export function isSecondaryLanguageGrade(sectionSubject: SectionSubjectOption | null | undefined, expectedGrade: 1 | 2): boolean {
  if (!sectionSubject) return false
  const normalize = (value?: string | null) => (value ?? '').normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim()
  const level = normalize(sectionSubject.academicLevelCode || sectionSubject.academicLevelName)
  const subject = normalize(sectionSubject.subjectName)
  const grade = normalize(sectionSubject.gradeName)
  return level.startsWith('secundar')
    && (sectionSubject.gradeSequence === expectedGrade || sectionSubject.gradeSequence === expectedGrade + 6
      || (expectedGrade === 1 ? /^(?:1\b|1ro\b|1er\b|primero\b)/ : /^(?:2\b|2do\b|segundo\b)/).test(grade))
    && (normalize(sectionSubject.subjectCode) === 'len' || subject === 'lengua espanola')
}
export function isFirstSecondaryLanguage(sectionSubject?: SectionSubjectOption | null): boolean {
  return isSecondaryLanguageGrade(sectionSubject, 1)
}
export function isSecondSecondaryLanguage(sectionSubject?: SectionSubjectOption | null): boolean {
  return isSecondaryLanguageGrade(sectionSubject, 2)
}
