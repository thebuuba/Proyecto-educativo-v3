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
  listNumber?: number | null
  firstName: string
  lastName: string
  status: AttendanceStatus | null
  attendanceId: string | null
}

export type MonthlyAttendanceMark = 'P' | 'A' | 'E' | 'R' | null

export type MonthlyAttendanceCell = {
  attendanceId: string | null
  status: AttendanceStatus | null
  mark: MonthlyAttendanceMark
}

export type MonthlyStudentAttendanceRow = Omit<StudentAttendanceRow, 'status' | 'attendanceId'> & {
  cells: Record<string, MonthlyAttendanceCell>
  presentTotal: number
  attendancePercentage: number | null
}

export type AttendanceStats = {
  present: number
  absent: number
  late: number
  excused: number
  total: number
}

export type MonthlyAttendanceStats = {
  totalStudents: number
  workedDays: number
  averageAttendance: number | null
  absences: number
  excuses: number
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
  sectionSubjectId?: string
  attendanceDate: string
  status: AttendanceStatus
  notes?: string | null
  attendanceId?: string | null
  type?: 'daily' | 'class'
}
