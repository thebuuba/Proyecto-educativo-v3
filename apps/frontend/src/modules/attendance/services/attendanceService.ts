import { api } from '@/services/apiClient'
import type { AttendanceStatus } from '@/types/domain'
import type {
  AttendanceStats,
  SectionOption,
  StudentAttendanceRow,
  UpsertAttendanceInput,
} from '@/modules/attendance/types'
import { getCurrentSchoolYear } from '@/services/schoolYearService'

export async function getSections(): Promise<SectionOption[]> {
  return api.get<SectionOption[]>('/grades-sections/grades')
}

export async function getStudentsBySection(
  sectionId: string,
  schoolYearId: string,
): Promise<StudentAttendanceRow[]> {
  return api.get<StudentAttendanceRow[]>(`/attendance/students?sectionId=${sectionId}&schoolYearId=${schoolYearId}`)
}

export async function getAttendance(
  sectionId: string,
  date: string,
): Promise<Map<string, { status: AttendanceStatus; attendanceId: string }>> {
  const records = await api.get<Array<{ id: string; enrollmentId: string; status: AttendanceStatus }>>(
    `/attendance/daily?sectionId=${sectionId}&date=${date}`
  )
  const result = new Map<string, { status: AttendanceStatus; attendanceId: string }>()
  for (const row of records) {
    result.set(row.enrollmentId, { status: row.status, attendanceId: row.id })
  }
  return result
}

export async function upsertAttendance(input: UpsertAttendanceInput): Promise<void> {
  await api.post('/attendance/upsert', input)
}

export function computeAttendanceStats(rows: StudentAttendanceRow[]): AttendanceStats {
  const stats: AttendanceStats = { present: 0, absent: 0, late: 0, excused: 0, total: rows.length }
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
  return api.get<string | null>('/attendance/current-period')
}
