import { api } from '@/services/apiClient'
import type {
  SchoolProfile,
  SchoolYearItem,
  UpdateSchoolInput,
  CreateSchoolYearInput,
  UpdateSchoolYearInput,
} from '@/modules/settings/types'

export async function getSchoolProfile(_schoolId: string): Promise<SchoolProfile | null> {
  return api.get<SchoolProfile | null>('/settings/school')
}

export async function updateSchoolProfile(_schoolId: string, input: UpdateSchoolInput): Promise<SchoolProfile> {
  return api.patch<SchoolProfile>('/settings/school', input)
}

export async function getSchoolYears(): Promise<SchoolYearItem[]> {
  return api.get<SchoolYearItem[]>('/settings/school-years')
}

export async function createSchoolYear(input: CreateSchoolYearInput): Promise<SchoolYearItem> {
  return api.post<SchoolYearItem>('/settings/school-years', input)
}

export async function updateSchoolYear(id: string, input: UpdateSchoolYearInput): Promise<SchoolYearItem> {
  return api.patch<SchoolYearItem>(`/settings/school-years/${id}`, input)
}

export async function setCurrentSchoolYear(id: string): Promise<void> {
  await api.post(`/settings/school-years/${id}/set-current`)
}
