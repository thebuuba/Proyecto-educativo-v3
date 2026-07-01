/**
 * @file Servicio de Planificación
 *
 * Proporciona funciones CRUD para períodos académicos,
 * entradas de planificación y datos auxiliares.
 */

import { api } from '@/services/apiClient'
import type { RecordStatus } from '@/types/domain'
import type {
  AcademicPeriodSummary,
  CompetencyOption,
  CreatePlanningEntryInput,
  GeneratedPlanningEntry,
  PlanningEntryWithDetails,
  PlanningFilters,
} from '@/modules/planning/types'

/** Obtiene los períodos académicos de un año escolar */
export async function getAcademicPeriods(schoolYearId: string): Promise<AcademicPeriodSummary[]> {
  return api.get<AcademicPeriodSummary[]>(`/planning/academic-periods?schoolYearId=${schoolYearId}`)
}

/** Crea un nuevo período académico */
export async function createAcademicPeriod(input: {
  schoolYearId: string
  name: string
  sequence: number
  startDate: string
  endDate: string
}): Promise<void> {
  await api.post('/planning/academic-periods', input)
}

/** Actualiza un período académico existente */
export async function updateAcademicPeriod(id: string, input: Partial<{
  name: string
  sequence: number
  startDate: string
  endDate: string
  status: RecordStatus
}>): Promise<void> {
  await api.patch(`/planning/academic-periods/${id}`, input)
}

/** Elimina un período académico */
export async function deleteAcademicPeriod(id: string): Promise<void> {
  await api.delete(`/planning/academic-periods/${id}`)
}

/** Obtiene las planificaciones según los filtros especificados */
export async function getPlanningEntries(filters: PlanningFilters): Promise<PlanningEntryWithDetails[]> {
  const params = new URLSearchParams()
  if (filters.academicPeriodId) params.set('academicPeriodId', filters.academicPeriodId)
  if (filters.sectionSubjectId) params.set('sectionSubjectId', filters.sectionSubjectId)
  return api.get<PlanningEntryWithDetails[]>(`/planning/entries?${params}`)
}

/** Crea una nueva entrada de planificación */
export async function createPlanningEntry(input: CreatePlanningEntryInput): Promise<void> {
  await api.post('/planning/entries', input)
}

/** Actualiza una entrada de planificación existente */
export async function updatePlanningEntry(id: string, input: CreatePlanningEntryInput): Promise<void> {
  await api.patch(`/planning/entries/${id}`, input)
}

/** Genera una planificación completa con IA */
export async function generatePlanningEntry(input: Partial<CreatePlanningEntryInput> & {
  subjectName?: string
  sectionName?: string
  gradeName?: string
  fundamentalCompetenceName?: string
}): Promise<GeneratedPlanningEntry> {
  return api.post<GeneratedPlanningEntry>('/planning/entries/generate', input)
}

/** Genera y guarda una planificación completa con IA */
export async function generateAndCreatePlanningEntry(input: Partial<CreatePlanningEntryInput> & {
  subjectName?: string
  sectionName?: string
  gradeName?: string
  fundamentalCompetenceName?: string
}): Promise<void> {
  await api.post('/planning/entries/generate-and-create', input)
}

/** Elimina una entrada de planificación */
export async function deletePlanningEntry(id: string): Promise<void> {
  await api.delete(`/planning/entries/${id}`)
}

export async function duplicatePlanningEntry(id: string): Promise<void> {
  await api.post(`/planning/entries/${id}/duplicate`)
}

export async function archivePlanningEntry(id: string): Promise<void> {
  await api.patch(`/planning/entries/${id}/archive`)
}

/** Obtiene las competencias fundamentales disponibles */
export async function getCompetencies(): Promise<CompetencyOption[]> {
  return api.get<CompetencyOption[]>('/planning/competencies')
}

/** Obtiene las secciones-asignaturas asignadas al docente */
export async function getTeacherSectionSubjects(teacherId?: string): Promise<
  { id: string; subjectName: string; sectionName: string; gradeName: string }[]
> {
  const params = teacherId ? `?teacherId=${teacherId}` : ''
  return api.get(`/planning/section-subjects${params}`)
}
