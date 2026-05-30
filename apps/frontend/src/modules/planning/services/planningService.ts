import { api } from '@/services/apiClient'
import type { RecordStatus } from '@/types/domain'
import type {
  AcademicPeriodSummary,
  CompetencyOption,
  CreatePlanningEntryInput,
  PlanningEntryWithDetails,
  PlanningFilters,
} from '@/modules/planning/types'

export async function getAcademicPeriods(schoolYearId: string): Promise<AcademicPeriodSummary[]> {
  return api.get<AcademicPeriodSummary[]>(`/planning/academic-periods?schoolYearId=${schoolYearId}`)
}

export async function createAcademicPeriod(input: {
  schoolYearId: string
  name: string
  sequence: number
  startDate: string
  endDate: string
}): Promise<void> {
  await api.post('/planning/academic-periods', input)
}

export async function updateAcademicPeriod(id: string, input: Partial<{
  name: string
  sequence: number
  startDate: string
  endDate: string
  status: RecordStatus
}>): Promise<void> {
  await api.patch(`/planning/academic-periods/${id}`, input)
}

export async function deleteAcademicPeriod(id: string): Promise<void> {
  await api.delete(`/planning/academic-periods/${id}`)
}

export async function getPlanningEntries(filters: PlanningFilters): Promise<PlanningEntryWithDetails[]> {
  const params = new URLSearchParams()
  if (filters.academicPeriodId) params.set('academicPeriodId', filters.academicPeriodId)
  if (filters.sectionSubjectId) params.set('sectionSubjectId', filters.sectionSubjectId)
  return api.get<PlanningEntryWithDetails[]>(`/planning/entries?${params}`)
}

export async function createPlanningEntry(input: CreatePlanningEntryInput): Promise<void> {
  await api.post('/planning/entries', input)
}

export async function updatePlanningEntry(id: string, input: CreatePlanningEntryInput): Promise<void> {
  await api.patch(`/planning/entries/${id}`, input)
}

export async function deletePlanningEntry(id: string): Promise<void> {
  await api.delete(`/planning/entries/${id}`)
}

export async function getCompetencies(): Promise<CompetencyOption[]> {
  return api.get<CompetencyOption[]>('/planning/competencies')
}

export async function getTeacherSectionSubjects(teacherId?: string): Promise<
  { id: string; subjectName: string; sectionName: string; gradeName: string }[]
> {
  const params = teacherId ? `?teacherId=${teacherId}` : ''
  return api.get(`/planning/section-subjects${params}`)
}
