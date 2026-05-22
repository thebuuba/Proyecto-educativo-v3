export type RecordStatus = 'active' | 'inactive' | 'archived'

export type EnrollmentStatus =
  | 'active'
  | 'transferred'
  | 'withdrawn'
  | 'completed'

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'

export type GradeRecordStatus = 'draft' | 'published' | 'voided'

export type UserRole =
  | 'admin'
  | 'director'
  | 'coordinator'
  | 'teacher'
  | 'student'
  | 'guardian'
  | 'viewer'

export type BaseEntity = {
  id: string
  schoolId: string
  status: RecordStatus
  createdAt: string
  updatedAt: string
}

export type School = BaseEntity & {
  name: string
  slug: string
  logoUrl: string | null
}

export type Student = BaseEntity & {
  userId?: string
  studentCode: string
  firstName: string
  lastName: string
  documentId?: string
  birthDate: string
  gender?: string
  guardianName?: string
  guardianPhone?: string
  guardianEmail?: string
  address?: string
}

export type Teacher = BaseEntity & {
  userId?: string
  employeeCode: string
  firstName: string
  lastName: string
  documentId?: string
  birthDate?: string
  gender?: string
  phone?: string
  email?: string
  hireDate?: string
  address?: string
}

export type Subject = BaseEntity & {
  code: string
  name: string
  description?: string
  credits?: number
}

export type Grade = BaseEntity & {
  name: string
  level?: string
  sequence?: number
}

export type Section = BaseEntity & {
  gradeId: string
  name: string
  capacity?: number
}

export type AcademicYear = BaseEntity & {
  name: string
  startDate: string
  endDate: string
  isCurrent: boolean
}

export type AcademicPeriod = BaseEntity & {
  academicYearId: string
  name: string
  sequence: number
  startDate: string
  endDate: string
}

export type Enrollment = {
  id: string
  studentId: string
  academicYearId: string
  gradeId: string
  sectionId: string
  enrollmentDate: string
  status: EnrollmentStatus
  createdAt: string
  updatedAt: string
}

export type AttendanceRecord = {
  id: string
  enrollmentId: string
  academicPeriodId?: string
  sectionSubjectId?: string
  attendanceDate: string
  status: AttendanceStatus
  notes?: string
  recordedBy?: string
  createdAt: string
  updatedAt: string
}

export type GradeRecord = {
  id: string
  enrollmentId: string
  sectionSubjectId: string
  academicPeriodId: string
  assessmentName: string
  score: number
  maxScore: number
  weight: number
  recoveryScore?: number
  effectiveScore?: number
  status: GradeRecordStatus
  recordedBy?: string
  createdAt: string
  updatedAt: string
}
