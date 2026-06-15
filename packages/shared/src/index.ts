/**
 * @fileoverview Tipos y utilidades compartidas entre frontend y backend.
 */

/**
 * @description Envoltorio genérico de respuesta API.
 * @template T - Tipo de los datos contenidos en la respuesta.
 */
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

/**
 * @description Respuesta API paginada. Extiende ApiResponse con metadatos de paginación.
 * @template T - Tipo de los elementos en la lista paginada.
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number
  page: number
  limit: number
}

/** @description Valores posibles para el estado de un registro (activo, inactivo, archivado). */
export const RecordStatusEnum = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived',
} as const

export type RecordStatus = (typeof RecordStatusEnum)[keyof typeof RecordStatusEnum]

/** @description Roles de usuario del sistema (admin, director, coordinador, profesor, padre). */
export const UserRoleEnum = {
  ADMIN: 'admin',
  DIRECTOR: 'director',
  COORDINATOR: 'coordinator',
  TEACHER: 'teacher',
  PARENT: 'parent',
} as const

export type UserRole = (typeof UserRoleEnum)[keyof typeof UserRoleEnum]

/** @description Estados de matrícula de un estudiante (activo, transferido, retirado, completado). */
export const EnrollmentStatusEnum = {
  ACTIVE: 'active',
  TRANSFERRED: 'transferred',
  WITHDRAWN: 'withdrawn',
  COMPLETED: 'completed',
} as const

export type EnrollmentStatus = (typeof EnrollmentStatusEnum)[keyof typeof EnrollmentStatusEnum]

/** @description Estados de asistencia (presente, ausente, tarde, justificado). */
export const AttendanceStatusEnum = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  EXCUSED: 'excused',
} as const

export type AttendanceStatus = (typeof AttendanceStatusEnum)[keyof typeof AttendanceStatusEnum]

/** @description Estados de un registro de calificaciones (borrador, publicado, anulado). */
export const GradeRecordStatusEnum = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  VOIDED: 'voided',
} as const

export type GradeRecordStatus = (typeof GradeRecordStatusEnum)[keyof typeof GradeRecordStatusEnum]

/** @description Estado booleano simplificado de una entidad: activo o inactivo. */
export type EntityStatus = 'active' | 'inactive'
