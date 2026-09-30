/**
 * @fileoverview Tipos y utilidades compartidas entre frontend y backend.
 */

/**
 * @description Envoltorio genérico de respuesta API.
 * @template T - Tipo de los datos contenidos en la respuesta.
 */
export type * from './instrument-recommendation'
export const competencyBlockIds = ['b1', 'b2', 'b3', 'b4'] as const
export type CompetencyBlockId = (typeof competencyBlockIds)[number]
export type EvaluationProfileId = 'primary-official' | 'secondary-official'
export type CompetencyBlockDefinition = { id: CompetencyBlockId; shortName: string; name: string }
export type EvaluationProfile = {
  id: EvaluationProfileId
  academicLevelCode: 'primario' | 'secundario'
  expectedBlockTotal: number
  requiredPeriodCount: number
  blocks: readonly CompetencyBlockDefinition[]
}
const communicativeBlock = { id: 'b1', shortName: 'Bloque 1', name: 'Competencia Comunicativa' } as const
export const primaryEvaluationProfile: EvaluationProfile = {
  id: 'primary-official', academicLevelCode: 'primario', expectedBlockTotal: 100, requiredPeriodCount: 4,
  blocks: [communicativeBlock,
    { id: 'b2', shortName: 'Bloque 2', name: 'Pensamiento Lógico, Creativo y Crítico, Resolución de Problemas y Científica y Tecnológica' },
    { id: 'b3', shortName: 'Bloque 3', name: 'Ética y Ciudadana, Desarrollo Personal y Espiritual y Ambiental y de la Salud' }],
}
export const secondaryEvaluationProfile: EvaluationProfile = {
  id: 'secondary-official', academicLevelCode: 'secundario', expectedBlockTotal: 100, requiredPeriodCount: 4,
  blocks: [communicativeBlock,
    { id: 'b2', shortName: 'Bloque 2', name: 'Pensamiento Lógico, Creativo y Crítico y Resolución de Problemas' },
    { id: 'b3', shortName: 'Bloque 3', name: 'Ética y Ciudadana y Desarrollo Personal y Espiritual' },
    { id: 'b4', shortName: 'Bloque 4', name: 'Científica y Tecnológica y Ambiental y de la Salud' }],
}
export function resolveEvaluationProfile(academicLevelCode?: string | null): EvaluationProfile {
  const normalized = academicLevelCode?.trim().toLowerCase()
  return normalized === 'primario' || normalized === 'primaria' ? primaryEvaluationProfile : secondaryEvaluationProfile
}
export function isBlockInEvaluationProfile(profile: EvaluationProfile, blockId: string): blockId is CompetencyBlockId {
  return profile.blocks.some((block) => block.id === blockId)
}

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

export function splitFullName(fullName: string, lastNameFallback = 'Sin apellido') {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  const firstName = parts.shift() || fullName.trim()
  const lastName = parts.join(' ') || lastNameFallback
  return { firstName, lastName }
}

/** Suma días lectivos de lunes a viernes a una fecha ISO (YYYY-MM-DD). */
export function addWeekdays(startDate: string, offset: number) {
  const date = new Date(`${startDate}T12:00:00Z`)
  let remaining = Math.max(0, Math.trunc(offset))
  while (remaining > 0) {
    date.setUTCDate(date.getUTCDate() + 1)
    const weekday = date.getUTCDay()
    if (weekday !== 0 && weekday !== 6) remaining -= 1
  }
  return date.toISOString().slice(0, 10)
}
