import { api } from '@/services/apiClient'

export type SchoolYearSummary = {
  id: string
  name: string
  isCurrent: boolean
}

export async function getCurrentSchoolYear(): Promise<SchoolYearSummary | null> {
  const years = await api.get<SchoolYearSummary[]>('/settings/school-years')
  return years.find((y) => y.isCurrent) ?? years[0] ?? null
}
