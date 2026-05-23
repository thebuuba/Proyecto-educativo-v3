import type { RecordStatus } from '@/types/domain'

export type SchoolProfile = {
  id: string
  name: string
  slug: string
  logoUrl: string | null
  status: RecordStatus
  createdAt: string
  updatedAt: string
}

export type SchoolYearItem = {
  id: string
  name: string
  startDate: string
  endDate: string
  isCurrent: boolean
  status: RecordStatus
  createdAt: string
  updatedAt: string
}

export type UpdateSchoolInput = {
  name?: string
  slug?: string
  logoUrl?: string | null
}

export type CreateSchoolYearInput = {
  name: string
  startDate: string
  endDate: string
  isCurrent?: boolean
}

export type UpdateSchoolYearInput = Partial<CreateSchoolYearInput> & {
  status?: RecordStatus
}
