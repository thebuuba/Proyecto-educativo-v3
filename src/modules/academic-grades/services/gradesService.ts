import { supabase } from '@/services/supabase'
import { THRESHOLD } from '@/constants'
import { assertNoSupabaseError, firstOrNull } from '@/utils/helpers'
import type { GradeRecordStatus } from '@/types/domain'
import type {
  AcademicPeriodOpt,
  GradeSummaryStats,
  SaveGradeInput,
  SectionSubjectOption,
  StudentGradeRow,
} from '@/modules/academic-grades/types'

type SectionSubjectRow = {
  id: string
  subjects: { name: string } | { name: string }[] | null
  sections: {
    name: string
    grades: { name: string } | { name: string }[] | null
  } | {
    name: string
    grades: { name: string } | { name: string }[] | null
  }[] | null
}

type GradeRow = {
  id: string
  enrollment_id: string
  score: number
  max_score: number
  weight: number
  assessment_name: string
  status: GradeRecordStatus
}

type EnrollmentStudentRow = {
  id: string
  student_id: string
  students: {
    student_code: string
    first_name: string
    last_name: string
  } | {
    student_code: string
    first_name: string
    last_name: string
  }[] | null
}

export async function getTeacherSectionSubjects(): Promise<SectionSubjectOption[]> {
  const { data, error } = await supabase
    .from('section_subjects')
    .select(`
      id,
      subjects(name),
      sections!inner(
        name,
        grades(name)
      )
    `)
    .eq('status', 'active')

  assertNoSupabaseError(error, 'No se pudieron cargar las secciones.')

  return ((data ?? []) as SectionSubjectRow[]).map((row) => {
    const subject = firstOrNull(row.subjects)
    const section = firstOrNull(row.sections)
    const grade = section ? firstOrNull(section.grades) : null
    return {
      id: row.id,
      subjectName: subject?.name ?? '—',
      sectionName: section?.name ?? '—',
      gradeName: grade?.name ?? '—',
    }
  })
}

export async function getAcademicPeriods(): Promise<AcademicPeriodOpt[]> {
  const { data, error } = await supabase
    .from('academic_periods')
    .select('id, name, sequence')
    .eq('status', 'active')
    .order('sequence', { ascending: true })

  assertNoSupabaseError(error, 'No se pudieron cargar los trimestres.')
  return (data ?? []) as AcademicPeriodOpt[]
}

export async function getStudentsForGrading(
  sectionSubjectId: string,
  academicPeriodId: string,
): Promise<{ students: StudentGradeRow[]; sectionId: string; schoolYearId: string }> {
  const { data: ssData, error: ssError } = await supabase
    .from('section_subjects')
    .select('section_id, school_year_id')
    .eq('id', sectionSubjectId)
    .single()

  assertNoSupabaseError(ssError, 'No se pudo cargar la sección.')

  if (!ssData) {
    throw new Error('No se encontró la asignación de sección y asignatura.')
  }

  const { data: enrollmentData, error: enrollmentError } = await supabase
    .from('enrollments')
    .select(`
      id,
      student_id,
      students(student_code, first_name, last_name)
    `)
    .eq('section_id', ssData.section_id)
    .eq('school_year_id', ssData.school_year_id)
    .eq('status', 'active')

  assertNoSupabaseError(enrollmentError, 'No se pudieron cargar los estudiantes.')

  const { data: gradeData, error: gradeError } = await supabase
    .from('grades_records')
    .select('id, enrollment_id, score, max_score, weight, assessment_name, status')
    .eq('section_subject_id', sectionSubjectId)
    .eq('academic_period_id', academicPeriodId)

  assertNoSupabaseError(gradeError, 'No se pudieron cargar las calificaciones.')

  const gradesByEnrollment = new Map<string, GradeRow>()
  for (const grade of (gradeData ?? []) as GradeRow[]) {
    gradesByEnrollment.set(grade.enrollment_id, grade)
  }

  const defaultMaxScore = gradeData && (gradeData as GradeRow[]).length > 0
    ? (gradeData as GradeRow[])[0].max_score
    : 10
  const defaultWeight = gradeData && (gradeData as GradeRow[]).length > 0
    ? (gradeData as GradeRow[])[0].weight
    : 1
  const defaultAssessmentName = gradeData && (gradeData as GradeRow[]).length > 0
    ? (gradeData as GradeRow[])[0].assessment_name
    : ''

  return {
    sectionId: ssData.section_id,
    schoolYearId: ssData.school_year_id,
    students: ((enrollmentData ?? []) as EnrollmentStudentRow[])
      .map((row) => {
        const student = firstOrNull(row.students)
        if (!student) return null
        const existing = gradesByEnrollment.get(row.id)
        return {
          enrollmentId: row.id,
          studentId: row.student_id,
          studentCode: student.student_code,
          firstName: student.first_name,
          lastName: student.last_name,
          gradeId: existing?.id ?? null,
          score: existing?.score ?? null,
          maxScore: existing?.max_score ?? defaultMaxScore,
          weight: existing?.weight ?? defaultWeight,
          assessmentName: existing?.assessment_name ?? defaultAssessmentName,
          status: existing?.status ?? null,
        } as StudentGradeRow
      })
      .filter((row): row is StudentGradeRow => row !== null),
  }
}

export async function saveGrade(input: SaveGradeInput): Promise<void> {
  if (input.gradeId) {
    const { error } = await supabase
      .from('grades_records')
      .update({
        score: input.score,
        max_score: input.maxScore,
        weight: input.weight,
        assessment_name: input.assessmentName,
      })
      .eq('id', input.gradeId)

    assertNoSupabaseError(error, 'No se pudo actualizar la calificación.')
  } else {
    const { error } = await supabase
      .from('grades_records')
      .insert({
        enrollment_id: input.enrollmentId,
        section_subject_id: input.sectionSubjectId,
        academic_period_id: input.academicPeriodId,
        section_id: input.sectionId,
        school_year_id: input.schoolYearId,
        score: input.score,
        max_score: input.maxScore,
        weight: input.weight,
        assessment_name: input.assessmentName,
      })

    assertNoSupabaseError(error, 'No se pudo registrar la calificación.')
  }
}

export function computeGradeStats(rows: StudentGradeRow[]): GradeSummaryStats {
  const scores = rows
    .map((r) => (r.score !== null ? (r.score / r.maxScore) * 10 : null))
    .filter((s): s is number => s !== null)

  return {
    average: scores.length > 0
      ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
      : null,
    highest: scores.length > 0 ? Math.round(Math.max(...scores) * 10) / 10 : null,
    lowest: scores.length > 0 ? Math.round(Math.min(...scores) * 10) / 10 : null,
    passed: scores.filter((s) => s >= THRESHOLD.GRADE_LOW).length,
    failed: scores.filter((s) => s < THRESHOLD.GRADE_LOW).length,
    total: rows.length,
  }
}
