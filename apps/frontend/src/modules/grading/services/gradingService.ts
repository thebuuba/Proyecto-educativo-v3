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
  GradingActivity,
  SaveGradeInput,
  SectionSubjectOption,
  StudentGradeRow,
} from '@/modules/grading/types'

/** Obtiene las secciones-asignaturas asignadas al docente */
export async function getTeacherSectionSubjects(): Promise<SectionSubjectOption[]> {
  return api.get<SectionSubjectOption[]>('/grading/section-subjects')
}

/** Obtiene la lista de períodos académicos disponibles */
export async function getAcademicPeriods(): Promise<AcademicPeriodOpt[]> {
  return api.get<AcademicPeriodOpt[]>('/grading/academic-periods')
}

/** Obtiene los estudiantes con sus calificaciones para una sección-asignatura y período */
export async function getStudentsForGrading(
  sectionSubjectId: string,
  academicPeriodId: string,
): Promise<{ students: StudentGradeRow[]; gradeRecords: GradeRecordRow[]; sectionId: string; schoolYearId: string }> {
  return api.get<{ students: StudentGradeRow[]; gradeRecords: GradeRecordRow[]; sectionId: string; schoolYearId: string }>(
    `/grading/students?sectionSubjectId=${sectionSubjectId}&academicPeriodId=${academicPeriodId}`
  )
}

export async function getGradeRecords(
  sectionSubjectId: string,
  academicPeriodId: string,
): Promise<GradeRecordRow[]> {
  return api.get<GradeRecordRow[]>(
    `/grading?sectionSubjectId=${sectionSubjectId}&academicPeriodId=${academicPeriodId}`,
  )
}

export async function getEvaluationActivities(
  sectionSubjectId: string,
  academicPeriodId: string,
): Promise<GradingActivity[]> {
  return api.get<GradingActivity[]>(
    `/grading/activities?sectionSubjectId=${sectionSubjectId}&academicPeriodId=${academicPeriodId}`,
  )
}

export async function saveEvaluationActivity(
  input: Omit<GradingActivity, 'id'> & {
    id?: string
    sectionSubjectId: string
    academicPeriodId: string
    schoolYearId?: string
  },
): Promise<GradingActivity> {
  return api.post<GradingActivity>('/grading/activities', input)
}

export async function deleteEvaluationActivity(activityId: string): Promise<void> {
  await api.delete(`/grading/activities/${activityId}`)
}

/** Guarda o actualiza una calificación en la base de datos */
export async function saveGrade(input: SaveGradeInput): Promise<void> {
  await api.post('/grading/save', input)
}

export async function deleteGrade(gradeId: string): Promise<void> {
  await api.delete(`/grading/${gradeId}`)
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
