/**
 * @fileoverview Tipos y utilidades compartidas entre frontend y backend.
 */

/**
 * @description Envoltorio genérico de respuesta API.
 * @template T - Tipo de los datos contenidos en la respuesta.
 */
export type * from './instrument-recommendation'
export type FirstSecondaryLanguageContext = { level: 'PRIMARY' | 'SECONDARY'; grade: number; subjectCode: string }

/** Deterministic classification shared by the service and its local editable fallback. */
export function detectFirstSecondaryLanguageActivity(title: string, description: string, context: FirstSecondaryLanguageContext | null): string | null {
  if (context?.level !== 'SECONDARY' || context.grade !== 1 || context.subjectCode.toUpperCase() !== 'LEN') return null
  const normalize = (value: string) => value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
  const titleText = normalize(title)
  const task = normalize(description)
  const both = `${titleText} ${task}`
  const module = /informe(?:s)? de lectura/.test(both) ? 'READING_REPORT'
    : /cuento(?:s)? (?:policiacos?|detectivescos?)/.test(both) ? 'DETECTIVE_STORY'
      : /caligramas?|(?:versos|palabras).*formando (?:la )?silueta/.test(both) ? 'CALLIGRAM'
        : /guias? turisticas?/.test(both) ? 'TOURIST_GUIDE'
          : /afiches?/.test(both) ? 'POSTER'
            : /noticias?|noticiero/.test(both) ? 'NEWS' : null
  if (!module) return null
  const action = (value: string) => {
    const writing = /\b(?:redact\w*|escrib\w*|elabor\w*|cre(?:ar\w*|an|a|acion)|disen\w*|produc(?:ir\w*|iran|en|cion)|compon\w*)\b/.test(value)
    const comparing = /\b(?:compar\w*|contrast\w*)\b/.test(value)
    const presenting = /\b(?:present\w*|expon\w*|explic\w*)\b/.test(value)
    const analyzing = /\b(?:analiz\w*|identific\w*|interpret\w*|leer\w*|leeran|lectura)\b/.test(value)
    if (module === 'NEWS' && /\bnoticiero\b/.test(value)) return 'NEWSCAST'
    if (module === 'DETECTIVE_STORY' && /\b(?:narrar\w*|narracion|narraran|contar|contaran)\b/.test(value)) return 'DETECTIVE_STORY_NARRATION'
    if (module === 'CALLIGRAM' && /\b(?:recit\w*|declam\w*)\b/.test(value)) return 'CALLIGRAM_RECITATION'
    if (comparing) return `${module}_COMPARISON`
    if (writing) return module === 'NEWS' ? 'NEWS_WRITING' : `${module}_CREATION`.replace('READING_REPORT_CREATION', 'READING_REPORT_WRITING').replace('DETECTIVE_STORY_CREATION', 'DETECTIVE_STORY_WRITING')
    if (presenting) return module === 'NEWS' ? 'NEWSCAST' : module === 'DETECTIVE_STORY' ? 'DETECTIVE_STORY_ANALYSIS_PRESENTATION' : module === 'CALLIGRAM' ? 'CALLIGRAM_EXPLANATION' : `${module}_PRESENTATION`
    if (analyzing) return `${module}_ANALYSIS`
    return null
  }
  return action(task) ?? action(titleText)
}
export function firstSecondaryLanguageTechnique(activityType: string): string {
  return activityType.endsWith('_ANALYSIS') ? 'observacion-sistematica'
    : activityType.endsWith('_COMPARISON') || activityType.endsWith('_WRITING') || activityType.endsWith('_CREATION')
      ? 'analisis-producciones' : activityType === 'CALLIGRAM_RECITATION' || activityType === 'DETECTIVE_STORY_NARRATION'
        ? 'presentacion' : 'exposicion'
}
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
