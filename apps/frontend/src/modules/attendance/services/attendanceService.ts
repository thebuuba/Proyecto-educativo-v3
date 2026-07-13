/**
 * @file Servicio de Asistencia
 *
 * Proporciona funciones para obtener secciones, estudiantes,
 * registrar asistencia y calcular estadísticas.
 */

import { api, API_CACHE_TAGS, API_CACHE_TTL } from '@/services/apiClient'
import type { AttendanceStatus } from '@/types/domain'
import type {
  AttendanceStats,
  MonthlyAttendanceCell,
  SectionOption,
  StudentAttendanceRow,
  UpsertAttendanceInput,
} from '@/modules/attendance/types'
import { statusToMark } from '@/modules/attendance/utils/monthlyAttendance'
import { getCurrentSchoolYear } from '@/services/schoolYearService'
import type { EnrollmentCourse } from '@/modules/students/types'

/** Obtiene la lista de secciones disponibles para el docente */
export async function getSections(): Promise<SectionOption[]> {
  return api.get<SectionOption[]>('/schedule/sections', {
    cacheTtlMs: API_CACHE_TTL.options,
    cacheTags: [API_CACHE_TAGS.courseOptions],
  })
}

export async function getAttendanceCourses(): Promise<EnrollmentCourse[]> {
  return api.get<EnrollmentCourse[]>('/attendance/courses', {
    cacheTtlMs: API_CACHE_TTL.sessionList,
    cacheTags: [
      API_CACHE_TAGS.courseOptions,
      API_CACHE_TAGS.enrollmentOptions,
      API_CACHE_TAGS.schoolYears,
    ],
  })
}

/** Obtiene los estudiantes inscritos en una sección para un año escolar */
export async function getStudentsBySection(
  sectionId: string,
  schoolYearId: string,
): Promise<StudentAttendanceRow[]> {
  return api.get<StudentAttendanceRow[]>(`/attendance/students?sectionId=${sectionId}&schoolYearId=${schoolYearId}`)
}

/** Obtiene el mapa de asistencia (estado + id) para una sección y fecha */
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

export async function getClassAttendanceForMonth(
  sectionSubjectId: string,
  dates: string[],
): Promise<Map<string, Map<string, MonthlyAttendanceCell>>> {
  const result = new Map<string, Map<string, MonthlyAttendanceCell>>()

  await Promise.all(
    dates.map(async (date) => {
      const records = await api.get<Array<{
        id: string
        enrollmentId: string
        status: AttendanceStatus
        notes?: string | null
      }>>(`/attendance?sectionSubjectId=${sectionSubjectId}&date=${date}`)
      const dailyMap = new Map<string, MonthlyAttendanceCell>()
      records.forEach((record) => {
        dailyMap.set(record.enrollmentId, {
          attendanceId: record.id,
          status: record.status,
          mark: statusToMark(record.status, record.notes),
        })
      })
      result.set(date, dailyMap)
    }),
  )

  return result
}

/** Crea o actualiza un registro de asistencia (upsert) */
export async function upsertAttendance(input: UpsertAttendanceInput): Promise<{ id: string }> {
  return api.post<{ id: string }>('/attendance/upsert', input)
}

export async function deleteAttendance(attendanceId: string, type: 'daily' | 'class'): Promise<void> {
  await api.delete(`/attendance/${attendanceId}?type=${type}`)
}

/** Calcula las estadísticas de asistencia a partir de las filas de estudiantes */
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

/** Obtiene el identificador del año escolar actual */
export async function getCurrentSchoolYearId(): Promise<string | null> {
  const year = await getCurrentSchoolYear()
  return year?.id ?? null
}

/** Obtiene el identificador del período académico activo */
export async function getCurrentAcademicPeriodId(): Promise<string | null> {
  const period = await api.get<{ id: string } | null>('/attendance/current-period', {
    cacheTtlMs: API_CACHE_TTL.sessionList,
    cacheTags: [API_CACHE_TAGS.academicPeriods],
  })
  return period?.id ?? null
}
