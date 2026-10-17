import type { ReactElement } from 'react'
import type { ProfileSettings, ProfilePreferences } from '@aula/shared'
export type ProfileFormValues = Omit<ProfilePreferences, 'publicName' | 'bio' | 'birthDate' | 'country' | 'city' | 'educationLevel'> & {
  publicName: string; bio: string; birthDate: string; country: string; city: string; educationLevel: string
  fullName: string; phone: string; email: string; institution: string; academicIdentifier: ProfileSettings['academicIdentifier']
}
export declare function PersonalInfoForm(props: { values: ProfileFormValues; onChange: (field: string, value: string | string[]) => void }): ReactElement
