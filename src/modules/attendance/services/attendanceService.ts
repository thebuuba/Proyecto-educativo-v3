import { getCurrentSchoolYear } from '@/services/schoolYearService'
import { supabase } from '@/services/supabase'
import { assertNoSupabaseError, firstOrNull } from '@/utils/helpers'
import type { AttendanceStatus } from '@/types/domain'
import type {
  AttendanceStats,
  SectionOption,
  StudentAttendanceRow,
  UpsertAttendanceInput,
} from '@/modules/attendance/types'

type EnrollmentWithStudentRow = {
  id: string
  student_id: string
  students: {
    student_code: string
    first_name: string
    last_name: string
  } | { student_code: string; first_name: string; last_name: string }[] | null
}

export async function getSections(): Promise<SectionOption[]> {
  const { data, error } = await supabase
    .from('sections')
    .select('id, name, grade_id, grades(name)')
    .eq('status', 'active')
    .order('name', { ascending: true })

  assertNoSupabaseError(error, 'No se pudieron cargar las secciones.')

  return ((data ?? []) as {
    id: string
    name: string
    grade_id: string
    grades: { name: string } | { name: string }[] | null
  }[]).map((row) => {
    const grade = firstOrNull(row.grades)
    return {
      id: row.id,
      name: row.name,
      gradeName: grade?.name ?? '',
    }
  })
}

export async function getStudentsBySection(
  sectionId: string,
  schoolYearId: string,
): Promise<StudentAttendanceRow[]> {
  const { data: enrollmentData, error: enrollmentError } = await supabase
    .from('enrollments')
    .select(`
      id,
      student_id,
      students(student_code, first_name, last_name)
    `)
    .eq('section_id', sectionId)
    .eq('school_year_id', schoolYearId)
    .eq('status', 'active')

  assertNoSupabaseError(enrollmentError, 'No se pudieron cargar los estudiantes.')

  return ((enrollmentData ?? []) as EnrollmentWithStudentRow[])
    .map((row) => {
      const student = firstOrNull(row.students)
      if (!student) return null
      return {
        enrollmentId: row.id,
        studentId: row.student_id,
        studentCode: student.student_code,
        firstName: student.first_name,
        lastName: student.last_name,
        status: null as AttendanceStatus | null,
        attendanceId: null as string | null,
      }
    })
    .filter((row): row is StudentAttendanceRow => row !== null)
}

export async function getAttendance(
  sectionId: string,
  date: string,
): Promise<Map<string, { status: AttendanceStatus; attendanceId: string }>> {
  const { data, error } = await supabase
    .from('attendance_daily')
    .select('id, enrollment_id, status')
    .eq('section_id', sectionId)
    .eq('attendance_date', date)

  assertNoSupabaseError(error, 'No se pudo cargar la asistencia.')

  const result = new Map<string, { status: AttendanceStatus; attendanceId: string }>()
  for (const row of (data ?? []) as { id: string; enrollment_id: string; status: AttendanceStatus }[]) {
    result.set(row.enrollment_id, { status: row.status, attendanceId: row.id })
  }
  return result
}

export async function upsertAttendance(
  input: UpsertAttendanceInput,
): Promise<void> {
  if (input.attendanceId) {
    const { error } = await supabase
      .from('attendance_daily')
      .update({ status: input.status })
      .eq('id', input.attendanceId)
    assertNoSupabaseError(error, 'No se pudo actualizar la asistencia.')
  } else {
    const { error } = await supabase
      .from('attendance_daily')
      .insert({
        enrollment_id: input.enrollmentId,
        academic_period_id: input.academicPeriodId,
        section_id: input.sectionId,
        school_year_id: input.schoolYearId,
        attendance_date: input.attendanceDate,
        status: input.status,
      })
    assertNoSupabaseError(error, 'No se pudo registrar la asistencia.')
  }
}

export function computeAttendanceStats(
  rows: StudentAttendanceRow[],
): AttendanceStats {
  const stats: AttendanceStats = {
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
    total: rows.length,
  }

  for (const row of rows) {
    if (row.status === 'present') stats.present++
    else if (row.status === 'absent') stats.absent++
    else if (row.status === 'late') stats.late++
    else if (row.status === 'excused') stats.excused++
  }

  return stats
}

export async function getCurrentSchoolYearId(): Promise<string | null> {
  const year = await getCurrentSchoolYear()
  return year?.id ?? null
}

export async function getCurrentAcademicPeriodId(): Promise<string | null> {
  const today = new Date().toISOString().split('T')[0]
  const { data, error } = await supabase
    .from('academic_periods')
    .select('id')
    .lte('start_date', today)
    .gte('end_date', today)
    .eq('status', 'active')
    .order('start_date', { ascending: false })
    .limit(1)
    .maybeSingle()

  assertNoSupabaseError(error, 'No se pudo cargar el trimestre actual.')
  return data?.id ?? null
}
