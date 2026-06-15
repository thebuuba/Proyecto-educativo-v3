/**
 * @file Módulo de Calificaciones — Tipos y constantes
 *
 * Define las estructuras para la gestión de notas, evaluaciones
 * y estadísticas de rendimiento académico.
 */

import type { GradeRecordStatus } from '@/types/domain'

/** Opción de sección-asignatura para seleccionar en formularios */
export type SectionSubjectOption = {
  id: string
  subjectName: string
  sectionName: string
  gradeName: string
}

/** Opción de período académico para seleccionar en formularios */
export type AcademicPeriodOpt = {
  id: string
  name: string
  sequence: number
}

/** Fila de calificación de un estudiante en una evaluación */
export type StudentGradeRow = {
  enrollmentId: string
  studentId: string
  studentCode: string
  firstName: string
  lastName: string
  gradeId: string | null
  score: number | null
  maxScore: number
  weight: number
  assessmentName: string
  status: GradeRecordStatus | null
}

/** Filtros para consultar calificaciones */
export type GradeFilters = {
  sectionSubjectId: string
  academicPeriodId: string
}

/** Estadísticas resumidas del rendimiento de un grupo */
export type GradeSummaryStats = {
  average: number | null
  highest: number | null
  lowest: number | null
  passed: number
  failed: number
  total: number
}

/** Datos necesarios para guardar una calificación */
export type SaveGradeInput = {
  enrollmentId: string
  sectionSubjectId: string
  academicPeriodId: string
  sectionId: string
  schoolYearId: string
  score: number
  maxScore: number
  weight: number
  assessmentName: string
  gradeId?: string | null
}
