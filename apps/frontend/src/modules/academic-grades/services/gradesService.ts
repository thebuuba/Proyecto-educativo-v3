/**
 * @file Servicio de Calificaciones
 *
 * Proporciona funciones para obtener secciones-asignaturas,
 * estudiantes, guardar notas y calcular estadísticas.
 */

import { api } from '@/services/apiClient'
import type {
  AcademicPeriodOpt,
  GradeRecordRow,
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
): Promise<{ students: StudentGradeRow[]; gradeRecords: GradeRecordRow[]; sectionId: string; schoolYearId: string }> {
  return api.get<{ students: StudentGradeRow[]; gradeRecords: GradeRecordRow[]; sectionId: string; schoolYearId: string }>(
    `/academic-grades/students?sectionSubjectId=${sectionSubjectId}&academicPeriodId=${academicPeriodId}`
  )
}

export async function getGradeRecords(
  sectionSubjectId: string,
  academicPeriodId: string,
): Promise<GradeRecordRow[]> {
  return api.get<GradeRecordRow[]>(
    `/academic-grades?sectionSubjectId=${sectionSubjectId}&academicPeriodId=${academicPeriodId}`,
  )
}

/** Guarda o actualiza una calificación en la base de datos */
export async function saveGrade(input: SaveGradeInput): Promise<void> {
  await api.post('/academic-grades/save', input)
}

export async function deleteGrade(gradeId: string): Promise<void> {
  await api.delete(`/academic-grades/${gradeId}`)
}

/** Calcula estadísticas de rendimiento a partir de las filas de calificaciones */
export function computeGradeStats(rows: StudentGradeRow[]): GradeSummaryStats {
  return {
    average: null,
    highest: null,
    lowest: null,
    passed: 0,
    failed: 0,
    total: rows.length,
  }
}
