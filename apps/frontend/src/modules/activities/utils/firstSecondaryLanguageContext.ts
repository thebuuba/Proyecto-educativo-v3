import type { SectionSubjectOption } from '@/modules/activities/types'

export function isFirstSecondaryLanguage(sectionSubject?: SectionSubjectOption | null): boolean {
  if (!sectionSubject) return false
  const normalize = (value?: string | null) => (value ?? '').normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim()
  const level = normalize(sectionSubject.academicLevelCode || sectionSubject.academicLevelName)
  const subject = normalize(sectionSubject.subjectName)
  const grade = normalize(sectionSubject.gradeName)
  return level.startsWith('secundar')
    && (sectionSubject.gradeSequence === 1 || sectionSubject.gradeSequence === 7 || /^(?:1\b|1ro\b|1er\b|primero\b)/.test(grade))
    && (normalize(sectionSubject.subjectCode) === 'len' || subject === 'lengua espanola')
}
