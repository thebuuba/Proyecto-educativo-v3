import { api } from '@/services/apiClient'

export type TourStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED'
export type TourProgress = { tourKey: string; version: number; status: TourStatus; lastStep: number }

export function listTourProgress() {
  return api.get<TourProgress[]>('/onboarding/tours', { forceRefresh: true })
}

export function saveTourProgress(tourKey: string, progress: Omit<TourProgress, 'tourKey'>) {
  return api.put<TourProgress>(`/onboarding/tours/${encodeURIComponent(tourKey)}`, progress)
}
