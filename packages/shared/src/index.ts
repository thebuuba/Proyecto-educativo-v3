// Generic API response envelope
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number
  page: number
  limit: number
}

// Enums
export const RecordStatusEnum = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  ARCHIVED: 'ARCHIVED',
} as const

export type RecordStatus = (typeof RecordStatusEnum)[keyof typeof RecordStatusEnum]

export const UserRoleEnum = {
  ADMIN: 'ADMIN',
  DIRECTOR: 'DIRECTOR',
  COORDINATOR: 'COORDINATOR',
  TEACHER: 'TEACHER',
  PARENT: 'PARENT',
} as const

export type UserRole = (typeof UserRoleEnum)[keyof typeof UserRoleEnum]

export const EnrollmentStatusEnum = {
  ACTIVE: 'ACTIVE',
  TRANSFERRED: 'TRANSFERRED',
  WITHDRAWN: 'WITHDRAWN',
  GRADUATED: 'GRADUATED',
} as const

export type EnrollmentStatus = (typeof EnrollmentStatusEnum)[keyof typeof EnrollmentStatusEnum]

export const AttendanceStatusEnum = {
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
  LATE: 'LATE',
  EXCUSED: 'EXCUSED',
} as const

export type AttendanceStatus = (typeof AttendanceStatusEnum)[keyof typeof AttendanceStatusEnum]

export const GradeRecordStatusEnum = {
  DRAFT: 'DRAFT',
  FINAL: 'FINAL',
  APPROVED: 'APPROVED',
} as const

export type GradeRecordStatus = (typeof GradeRecordStatusEnum)[keyof typeof GradeRecordStatusEnum]

export type EntityStatus = 'ACTIVE' | 'INACTIVE'
