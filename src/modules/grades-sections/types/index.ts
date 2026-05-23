import type { RecordStatus } from '@/types/domain'

export type Grade = {
  id: string
  name: string
  level: string | null
  sequence: number | null
  status: RecordStatus
  createdAt: string
  updatedAt: string
}

export type Section = {
  id: string
  gradeId: string
  name: string
  capacity: number | null
  status: RecordStatus
  createdAt: string
  updatedAt: string
}

export type GradeWithSections = Grade & {
  sections: Section[]
}

export type CreateGradeInput = {
  name: string
  level?: string
  sequence?: number | null
}

export type UpdateGradeInput = Partial<CreateGradeInput> & {
  status?: RecordStatus
}

export type CreateSectionInput = {
  gradeId: string
  name: string
  capacity?: number | null
}

export type UpdateSectionInput = Partial<Omit<CreateSectionInput, 'gradeId'>> & {
  status?: RecordStatus
}
