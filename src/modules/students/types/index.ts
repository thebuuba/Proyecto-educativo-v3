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

export type StudentListEnrollmentSummary = {
  id: string
  gradeName: string | null
  sectionName: string | null
}

export type StudentListMetrics = {
  attendancePercentage: number | null
  averageScore: number | null
  pendingCount: number
}

export type StudentListItem = Student & {
  currentEnrollment: StudentListEnrollmentSummary | null
  metrics: StudentListMetrics
}

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
  status?: StudentStatus
}

export type UpdateStudentInput = Partial<CreateStudentInput>

export type CreateEnrollmentInput = {
  studentId: string
  gradeId: string
  sectionId: string
  schoolYearId: string
  enrollmentDate?: string
  status?: EnrollmentStatus
  academicStatus?: 'active' | 'promoted' | 'repeating' | 'withdrawn' | 'transferred' | 'graduated'
  isRepeating?: boolean
  promotionStatus?: string | null
  finalCondition?: string | null
  transferNotes?: string | null
}

export type EnrollmentListItem = {
  id: string
  schoolYearName: string | null
  gradeName: string | null
  sectionName: string | null
  enrollmentDate: string
  status: EnrollmentStatus
}

export type GradeWithSections = {
  id: string
  name: string
  sections: { id: string; name: string }[]
}

export type StudentFilters = {
  status: StudentStatus | 'all'
}
