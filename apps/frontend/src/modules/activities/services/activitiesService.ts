import { api } from '@/services/apiClient'
import type {
  Activity,
  ActivityCenterWorkspace,
  SaveActivityInput,
} from '@/modules/activities/types'

export function getActivityCenter(options?: { contextOnly?: boolean }): Promise<ActivityCenterWorkspace> {
  return api.get<ActivityCenterWorkspace>(options?.contextOnly ? '/activities/center?contextOnly=true' : '/activities/center')
}

export function getActivities(
  input: {
    sectionSubjectId?: string
    academicPeriodId?: string
    planningEntryId?: string
  } = {},
): Promise<Activity[]> {
  const params = new URLSearchParams()
  if (input.sectionSubjectId) params.set('sectionSubjectId', input.sectionSubjectId)
  if (input.academicPeriodId) params.set('academicPeriodId', input.academicPeriodId)
  if (input.planningEntryId) params.set('planningEntryId', input.planningEntryId)
  return api.get<Activity[]>(`/activities${params.size ? `?${params.toString()}` : ''}`)
}

export function saveActivity(input: SaveActivityInput): Promise<Activity> {
  // Activity is a read model. Pick the HTTP write contract explicitly for every caller.
  const body = {
    id: input.id,
    creationId: input.id ? undefined : input.creationId,
    sectionSubjectId: input.sectionSubjectId,
    academicPeriodId: input.academicPeriodId,
    schoolYearId: input.schoolYearId,
    planningEntryId: input.planningId,
    instrumentId: input.instrumentId,
    competencyBlockId: input.competencyBlockId,
    competencyBlockWeights: input.competencyBlockWeights,
    name: input.name,
    maxScore: input.maxScore,
    date: input.date,
    description: input.description,
    studentRole: input.studentRole,
    teacherRole: input.teacherRole,
    instrumentType: input.instrumentType,
    instrumentCriteria: input.instrumentCriteria,
    pedagogicalActivityType: input.pedagogicalActivityType,
    teachingStrategyId: input.teachingStrategyId,
    teachingStrategyOrigin: input.teachingStrategyOrigin,
    instrumentSnapshot: input.instrumentSnapshot,
    evaluationTechnique: input.evaluationTechnique,
    observations: input.observations,
    resources: input.resources,
    evidenceInstructions: input.evidenceInstructions,
    activityType: input.activityType,
    teamIds: input.teamIds,
    planningMoment: input.planningMoment,
    source: input.source,
  }
  return api.post<Activity>('/activities', body)
}

export async function deleteActivity(activityId: string): Promise<void> {
  await api.delete(`/activities/${activityId}`)
}

export function linkActivityToPlanning(
  activityId: string,
  input: { planningEntryId: string | null; planningMoment?: string },
) {
  return api.post<Activity>(`/activities/${activityId}/link-planning`, input)
}
