/**
 * @file Módulo de Asistencia — Tipos y constantes
 *
 * Define las estructuras de datos utilizadas para el registro
 * y consulta de asistencia de estudiantes.
 */

import type { AttendanceStatus } from '@/types/domain'

/** Filtros para consultar registros de asistencia */
export type AttendanceFilters = {
  sectionId: string
  date: string
  academicPeriodId?: string
}

/** Representa una fila de asistencia de un estudiante en una fecha determinada */
export type StudentAttendanceRow = {
  enrollmentId: string
  studentId: string
  studentCode: string
  firstName: string
  lastName: string
  status: AttendanceStatus | null
  attendanceId: string | null
}

/** Estadísticas resumidas de asistencia para un grupo */
export type AttendanceStats = {
  present: number
  absent: number
  late: number
  excused: number
  total: number
}

/** Opción de selección de sección en el formulario de asistencia */
export type SectionOption = {
  id: string
  name: string
  gradeName: string
}

/** Datos necesarios para crear o actualizar un registro de asistencia */
export type UpsertAttendanceInput = {
  enrollmentId: string
  academicPeriodId: string
  sectionId: string
  schoolYearId: string
  attendanceDate: string
  status: AttendanceStatus
  attendanceId?: string | null
}
