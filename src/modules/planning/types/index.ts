import type { RecordStatus } from '@/types/domain'

export type PlanningActivities = {
  inicio: string
  desarrollo: string
  cierre: string
}

export type PlanningEntry = {
  id: string
  sectionSubjectId: string
  academicPeriodId: string
  title: string
  sequence: number
  specificCompetence: string
  achievementIndicator: string
  contentConceptual: string
  contentProcedural: string
  contentAttitudinal: string
  strategies: string
  activities: PlanningActivities
  resources: string
  evaluationMethod: string
  durationMinutes: number | null
  plannedDate: string | null
  status: RecordStatus
  createdAt: string
  updatedAt: string
}

export type CreatePlanningEntryInput = {
  sectionSubjectId: string
  academicPeriodId: string
  title: string
  sequence?: number
  specificCompetence?: string
  achievementIndicator?: string
  contentConceptual?: string
  contentProcedural?: string
  contentAttitudinal?: string
  strategies?: string
  activities?: PlanningActivities
  resources?: string
  evaluationMethod?: string
  durationMinutes?: number | null
  plannedDate?: string | null
}

export type UpdatePlanningEntryInput = Partial<CreatePlanningEntryInput>

export type PlanningEntryWithDetails = PlanningEntry & {
  subjectName: string
  sectionName: string
  gradeName: string
  periodName: string
}

export type PlanningFilters = {
  academicPeriodId?: string
  sectionSubjectId?: string
}

export type AcademicPeriodSummary = {
  id: string
  name: string
  sequence: number
  startDate: string
  endDate: string
  status: RecordStatus
}
