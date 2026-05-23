import type { AttendanceStatus } from '@/types/domain'

export type AttendanceFilters = {
  sectionId: string
  date: string
  academicPeriodId?: string
}

export type StudentAttendanceRow = {
  enrollmentId: string
  studentId: string
  studentCode: string
  firstName: string
  lastName: string
  status: AttendanceStatus | null
  attendanceId: string | null
}

export type AttendanceStats = {
  present: number
  absent: number
  late: number
  excused: number
  total: number
}

export type SectionOption = {
  id: string
  name: string
  gradeName: string
}

export type UpsertAttendanceInput = {
  enrollmentId: string
  academicPeriodId: string
  sectionId: string
  schoolYearId: string
  attendanceDate: string
  status: AttendanceStatus
  attendanceId?: string | null
}
