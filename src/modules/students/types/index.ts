import type { EnrollmentStatus, RecordStatus } from '@/types/domain'

export type StudentStatus = RecordStatus

export type Student = {
  id: string
  userId: string | null
  studentCode: string
  firstName: string
  lastName: string
  documentId: string | null
  birthDate: string
  gender: string | null
  address: string | null
  status: StudentStatus
  createdAt: string
  updatedAt: string
}

export type StudentListItem = Student

export type StudentEnrollmentSummary = {
  id: string
  enrollmentDate: string
  status: EnrollmentStatus
  schoolYearName: string | null
  gradeName: string | null
  sectionName: string | null
}

export type StudentGuardianSummary = {
  id: string
  fullName: string
  phone: string | null
  email: string | null
  relationship: string
  isPrimary: boolean
  canPickUp: boolean
}

export type StudentDetail = Student & {
  currentEnrollment: StudentEnrollmentSummary | null
  guardians: StudentGuardianSummary[]
}

export type CreateStudentInput = {
  studentCode: string
  firstName: string
  lastName: string
  documentId?: string
  birthDate: string
  gender?: string
  address?: string
  status: StudentStatus
}

export type UpdateStudentInput = Partial<CreateStudentInput>

export type StudentFilters = {
  status: StudentStatus | 'all'
}
