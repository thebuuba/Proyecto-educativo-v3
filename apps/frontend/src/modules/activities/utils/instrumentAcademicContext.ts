import type { InstrumentAcademicContext } from '@aula/shared'
import type { SectionSubjectOption } from '../types'

/** Use the same local/global grade convention as the service; never infer from the task. */
export function instrumentAcademicContext(subject?: SectionSubjectOption | null): InstrumentAcademicContext | null {
  if (!subject) return null
  const level = (subject.academicLevelCode || subject.academicLevelName || '').normalize('NFD').replace(/\p{M}/gu,'').toLowerCase()
  const sequence = subject.gradeSequence
  if ((!level.startsWith('secundar') && !level.startsWith('primar')) || sequence == null) return null
  const secondary=level.startsWith('secundar')
  const grade = secondary && sequence >= 7 ? sequence - 6 : sequence
  if (!Number.isInteger(grade) || grade < 1 || grade > 6) return null
  const subjectName=subject.subjectName.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().trim()
  const subjectCode=subject.subjectCode?.trim().toUpperCase() || (subjectName==='lengua espanola'?'LEN':'')
  return { level:secondary?'SECONDARY':'PRIMARY', grade, subjectCode, subjectName: subject.subjectName }
}
