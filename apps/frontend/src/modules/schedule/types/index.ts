export type TimeSlot = {
  id: string
  name: string
  startTime: string
  endTime: string
  sequence: number
  status: string
}

export type CreateTimeSlotInput = {
  name: string
  startTime: string
  endTime: string
  sequence: number
}

export type UpdateTimeSlotInput = Partial<CreateTimeSlotInput>

export type ScheduleEntry = {
  id: string
  schoolYearId: string
  academicPeriodId: string | null
  sectionSubjectId: string
  sectionId: string
  timeSlotId: string
  dayOfWeek: number
  room: string | null
  status: string
  subjectName: string
  teacherName: string
  gradeName: string
  sectionName: string
  timeSlotName: string
  startTime: string
  endTime: string
}

export type ScheduleCalendarEntry = {
  id: string
  dayOfWeek: number
  room: string | null
  subjectName: string
  gradeName: string | null
  sectionName: string | null
  startTime: string
  endTime: string
  studentCount: number
  tone: 'accent' | 'primary' | 'success' | 'muted'
}

export type ScheduleSummary = {
  entries: ScheduleCalendarEntry[]
  totalClasses: number
  totalHours: number
  sectionCount: number
  weeklyLoad: Array<{
    dayLabel: string
    dayOfWeek: number
    hours: number
  }>
}

export type CreateScheduleEntryInput = {
  schoolYearId: string
  academicPeriodId?: string | null
  sectionSubjectId: string
  sectionId: string
  timeSlotId: string
  dayOfWeek: number
  room?: string | null
}

export type UpdateScheduleEntryInput = Partial<CreateScheduleEntryInput>

export type ScheduleFilters = {
  schoolYearId?: string
  academicPeriodId?: string
  sectionId?: string
  teacherId?: string
  gradeId?: string
}

export type ScheduleGridEntry = {
  timeSlotId: string
  timeSlotName: string
  startTime: string
  endTime: string
  entries: (ScheduleEntry | null)[] // one per day (1-7), null = free period
}

export type SectionOption = {
  id: string
  name: string
  gradeName: string
}

export type TeacherOption = {
  id: string
  firstName: string
  lastName: string
}

export type SubjectOption = {
  id: string
  name: string
  code: string
}
