export const PROFILE_INTERESTS = ['Diseño UX', 'Data Science', 'Python', 'Marketing digital', 'Idiomas', 'Matemáticas', 'Desarrollo web', 'Fotografía', 'Finanzas', 'Oratoria'] as const
export const PROFILE_COUNTRIES = [
  { value: 'do', label: 'República Dominicana' }, { value: 'bo', label: 'Bolivia' },
  { value: 'es', label: 'España' }, { value: 'mx', label: 'México' }, { value: 'ar', label: 'Argentina' },
  { value: 'co', label: 'Colombia' }, { value: 'cl', label: 'Chile' }, { value: 'pe', label: 'Perú' },
] as const
export const PROFILE_LEVELS = [
  { value: 'secondary', label: 'Secundaria' }, { value: 'highschool', label: 'Bachillerato' },
  { value: 'vocational', label: 'Formación profesional' }, { value: 'university', label: 'Universidad' },
  { value: 'postgraduate', label: 'Posgrado' }, { value: 'professional', label: 'Profesional en activo' },
] as const

export type ProfilePreferences = {
  publicName: string | null; bio: string | null; birthDate: string | null; country: string | null
  city: string | null; educationLevel: string | null; language: 'es'; timezone: string; interests: string[]
}
export type ProfileMetric = { id: string; label: string; value: number | null }
export type ProfileSettings = {
  id: string; fullName: string; email: string; phone: string | null; avatarUrl: string | null
  createdAt: string; roles: string[]; institution: string
  academicIdentifier: { label: string; value: string } | null
  preferences: ProfilePreferences; stats: ProfileMetric[]; completeness: number
}
export type UpdateProfileSettingsInput = {
  fullName?: string; phone?: string | null; preferences?: Partial<ProfilePreferences>
}
