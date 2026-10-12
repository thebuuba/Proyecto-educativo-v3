import { secondaryEvaluationProfile, type EvaluationProfile } from '@aula/shared'
import { createContext, useContext, type ReactNode } from 'react'

const ProfileContext = createContext<EvaluationProfile>(secondaryEvaluationProfile)
export function ActivityEditorProfile({
  profile,
  children,
}: {
  profile?: EvaluationProfile
  children: ReactNode
}) {
  return (
    <ProfileContext.Provider value={profile ?? secondaryEvaluationProfile}>
      {children}
    </ProfileContext.Provider>
  )
}
export function useActivityEditorProfile() {
  return useContext(ProfileContext)
}
