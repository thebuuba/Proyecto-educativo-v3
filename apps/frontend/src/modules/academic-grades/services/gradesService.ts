/**
 * @file Servicio de Calificaciones
 *
 * Proporciona funciones para obtener secciones-asignaturas,
 * estudiantes, guardar notas y calcular estadísticas.
 */

import { api } from '@/services/apiClient'
import { THRESHOLD } from '@/constants'
import type {
  AcademicPeriodOpt,
  GradeSummaryStats,
  SaveGradeInput,
  SectionSubjectOption,
  StudentGradeRow,
} from '@/modules/academic-grades/types'

/** Obtiene las secciones-asignaturas asignadas al docente */
export async function getTeacherSectionSubjects(): Promise<SectionSubjectOption[]> {
  return api.get<SectionSubjectOption[]>('/academic-grades/section-subjects')
}

/** Obtiene la lista de períodos académicos disponibles */
export async function getAcademicPeriods(): Promise<AcademicPeriodOpt[]> {
  return api.get<AcademicPeriodOpt[]>('/academic-grades/academic-periods')
}

/** Obtiene los estudiantes con sus calificaciones para una sección-asignatura y período */
export async function getStudentsForGrading(
  sectionSubjectId: string,
  academicPeriodId: string,
): Promise<{ students: StudentGradeRow[]; sectionId: string; schoolYearId: string }> {
  return api.get<{ students: StudentGradeRow[]; sectionId: string; schoolYearId: string }>(
    `/academic-grades/students?sectionSubjectId=${sectionSubjectId}&academicPeriodId=${academicPeriodId}`
  )
}

/** Guarda o actualiza una calificación en la base de datos */
export async function saveGrade(input: SaveGradeInput): Promise<void> {
  await api.post('/academic-grades/save', input)
}

/** Calcula estadísticas de rendimiento a partir de las filas de calificaciones */
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
