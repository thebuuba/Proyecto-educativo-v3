import { api } from '@/services/apiClient'
import type { Activity, ActivityCenterWorkspace, SaveActivityInput } from '@/modules/activities/types'

export function getActivityCenter(): Promise<ActivityCenterWorkspace> {
  return api.get<ActivityCenterWorkspace>('/activities/center')
}

export function getActivities(input: {
  sectionSubjectId?: string
  academicPeriodId?: string
  planningEntryId?: string
} = {}): Promise<Activity[]> {
  const params = new URLSearchParams()
  if (input.sectionSubjectId) params.set('sectionSubjectId', input.sectionSubjectId)
  if (input.academicPeriodId) params.set('academicPeriodId', input.academicPeriodId)
  if (input.planningEntryId) params.set('planningEntryId', input.planningEntryId)
  return api.get<Activity[]>(`/activities${params.size ? `?${params.toString()}` : ''}`)
}

export function saveActivity(input: SaveActivityInput): Promise<Activity> {
  return api.post<Activity>('/activities', input)
}

export async function deleteActivity(activityId: string): Promise<void> {
  await api.delete(`/activities/${activityId}`)
}

export function linkActivityToPlanning(activityId: string, input: { planningEntryId: string | null; planningMoment?: string }) {
  return api.post<Activity>(`/activities/${activityId}/link-planning`, input)
}
