/**
 * Módulo de Estudiantes — Tipos y constantes para la gestión de estudiantes.
 * Define las estructuras de datos para estudiantes, matrículas, tutores y filtros.
 */

import type { EnrollmentStatus, RecordStatus } from '@/types/domain'

/** Estado de un estudiante (activo, inactivo, archivado). */
export type StudentStatus = RecordStatus

/** Datos base de un estudiante. */
export type Student = {
  id: string
  /** Identificador del usuario asociado (puede ser nulo). */
  userId: string | null
  /** Código único del estudiante. */
  studentCode: string
  /** Primer nombre del estudiante. */
  firstName: string
  /** Apellido del estudiante. */
  lastName: string
  /** Número de documento de identidad (puede ser nulo). */
  documentId: string | null
  /** Fecha de nacimiento. */
  birthDate: string
  /** Género del estudiante (puede ser nulo). */
  gender: string | null
  /** Dirección del estudiante (puede ser nulo). */
  address: string | null
  /** Estado del estudiante. */
  status: StudentStatus
  /** Fecha de creación del registro. */
  createdAt: string
  /** Fecha de la última actualización. */
  updatedAt: string
}

/** Resumen de la matrícula actual del estudiante para listados. */
export type StudentListEnrollmentSummary = {
  id: string
  gradeName: string | null
  sectionName: string | null
}

/** Métricas académicas del estudiante para listados. */
export type StudentListMetrics = {
  /** Porcentaje de asistencia (puede ser nulo). */
  attendancePercentage: number | null
  /** Calificación promedio (puede ser nulo). */
  averageScore: number | null
  /** Cantidad de tareas pendientes. */
  pendingCount: number
}

/** Estudiante en listados con datos de matrícula, métricas y visualización. */
export type StudentListItem = Student & {
  currentEnrollment: StudentListEnrollmentSummary | null
  metrics: StudentListMetrics
  displayEmail: string
  displayAvatarSeed: string
  riskReason: string | null
}

/** Resumen de una matrícula del estudiante. */
export type StudentEnrollmentSummary = {
  id: string
  enrollmentDate: string
  status: EnrollmentStatus
  schoolYearName: string | null
  gradeName: string | null
  sectionName: string | null
}

/** Información resumida de un tutor del estudiante. */
export type StudentGuardianSummary = {
  id: string
  fullName: string
  phone: string | null
  email: string | null
  relationship: string
  isPrimary: boolean
  canPickUp: boolean
}

/** Detalle completo del estudiante con matrícula actual y tutores. */
export type StudentDetail = Student & {
  currentEnrollment: StudentEnrollmentSummary | null
  guardians: StudentGuardianSummary[]
}

/** Datos para crear un nuevo estudiante. */
export type CreateStudentInput = {
  studentCode: string
  firstName: string
  lastName: string
  documentId?: string
  birthDate: string
  gender?: string
  address?: string
  status?: StudentStatus
}

/** Datos para actualizar un estudiante (todos los campos son opcionales). */
export type UpdateStudentInput = Partial<CreateStudentInput>

/** Datos para crear una nueva matrícula. */
export type CreateEnrollmentInput = {
  studentId: string
  gradeId: string
  sectionId: string
  schoolYearId: string
  enrollmentDate?: string
  status?: EnrollmentStatus
  academicStatus?: 'active' | 'promoted' | 'repeating' | 'withdrawn' | 'transferred' | 'graduated'
  isRepeating?: boolean
  promotionStatus?: string | null
  finalCondition?: string | null
  transferNotes?: string | null
}

/** Elemento de la lista de matrículas del estudiante. */
export type EnrollmentListItem = {
  id: string
  schoolYearName: string | null
  gradeName: string | null
  sectionName: string | null
  enrollmentDate: string
  status: EnrollmentStatus
}

/** Grado con sus secciones disponibles. */
export type GradeWithSections = {
  id: string
  name: string
  sections: { id: string; name: string }[]
}

/** Filtros para la lista de estudiantes. */
export type StudentFilters = {
  status: StudentStatus | 'all'
}
