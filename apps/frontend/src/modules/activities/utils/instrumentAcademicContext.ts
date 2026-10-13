import type { InstrumentAcademicContext } from '@aula/shared'
import type { SectionSubjectOption } from '../types'

/** Use the same local/global grade convention as the service; never infer from the task. */
export function instrumentAcademicContext(subject?: SectionSubjectOption | null): InstrumentAcademicContext | null {
  if (!subject) return null
  const level = (subject.academicLevelCode || subject.academicLevelName || '').normalize('NFD').replace(/\p{M}/gu,'').toLowerCase()
  const sequence = subject.gradeSequence
  if (!level.startsWith('secundar') || sequence == null) return null
  const grade = sequence >= 7 ? sequence - 6 : sequence
  if (!Number.isInteger(grade) || grade < 1 || grade > 6) return null
  return { level:'SECONDARY', grade, subjectCode: subject.subjectCode ?? '', subjectName: subject.subjectName }
}
