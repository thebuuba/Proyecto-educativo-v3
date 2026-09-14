import { createContext, useContext } from 'react'
import type { TourProgress } from './onboardingService'
import type { TourDefinition } from './tourCatalog'

export type GuidedToursValue = {
  availableTours: TourDefinition[]
  progress: Record<string, TourProgress>
  startTour: (tour: TourDefinition, step?: number) => void
  replayTour: (tour: TourDefinition) => void
}

export const GuidedToursContext = createContext<GuidedToursValue | null>(null)

export function useGuidedTours() {
  const value = useContext(GuidedToursContext)
  if (!value) throw new Error('useGuidedTours must be used inside GuidedTourProvider')
  return value
}
