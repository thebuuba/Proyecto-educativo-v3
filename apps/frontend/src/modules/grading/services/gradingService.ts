/**
 * @file Servicio de Calificaciones
 *
 * Proporciona funciones para obtener secciones-asignaturas,
 * estudiantes, guardar notas y calcular estadísticas.
 */

import { api, API_CACHE_TAGS, API_CACHE_TTL } from '@/services/apiClient'
import type {
  AcademicPeriodOpt,
  AnnualGradingPeriod,
  GradeRecordRow,
  GradeSummaryStats,
  GradingActivity,
  GradingWorkspace,
  SaveGradeInput,
  SectionSubjectOption,
  StudentGradeRow,
} from '@/modules/grading/types'

export async function getGradingWorkspace(input?: {
  sectionSubjectId?: string
  academicPeriodId?: string
  includeOptions?: boolean
}): Promise<GradingWorkspace> {
  const params = new URLSearchParams()
  if (input?.sectionSubjectId) params.set('sectionSubjectId', input.sectionSubjectId)
  if (input?.academicPeriodId) params.set('academicPeriodId', input.academicPeriodId)
  if (input?.includeOptions === false) params.set('includeOptions', 'false')
  const query = params.size > 0 ? `?${params.toString()}` : ''
  return api.get<GradingWorkspace>(`/grading/workspace${query}`)
}

export async function getAnnualGradingWorkspace(
  sectionSubjectId: string,
): Promise<AnnualGradingPeriod[]> {
  const params = new URLSearchParams({ sectionSubjectId })
  return api.get<AnnualGradingPeriod[]>(`/grading/annual?${params.toString()}`)
}

/** Obtiene las secciones-asignaturas asignadas al docente */
export async function getTeacherSectionSubjects(): Promise<SectionSubjectOption[]> {
  return api.get<SectionSubjectOption[]>('/grading/section-subjects', {
    cacheTtlMs: API_CACHE_TTL.options,
    cacheTags: [API_CACHE_TAGS.courseOptions],
  })
}

/** Obtiene la lista de períodos académicos disponibles */
export async function getAcademicPeriods(): Promise<AcademicPeriodOpt[]> {
  return api.get<AcademicPeriodOpt[]>('/grading/academic-periods', {
    cacheTtlMs: API_CACHE_TTL.options,
    cacheTags: [API_CACHE_TAGS.academicPeriods],
  })
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
export async function saveGrade(input: SaveGradeInput): Promise<GradeRecordRow> {
  return api.post<GradeRecordRow>('/grading/save', input)
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
