import type { ComponentType } from 'react'

export type DashboardContext = {
  firstName: string
  formattedDate: string
  schoolYearName: string
  periodName: string
}

export type DashboardClass = {
  id: string
  subjectName: string
  gradeName: string
  sectionName: string
  startTime: string
  endTime: string
  durationMinutes: number
  room: string | null
  studentCount: number
  dayOfWeek: number
  sectionId: string
  sectionSubjectId: string
  academicPeriodId: string | null
  startsInMinutes: number | null
  status: 'completed' | 'current' | 'upcoming'
}

export type TodayAgendaItem = DashboardClass

export type WeeklyAttendanceDay = {
  label: string
  value: number | null
  isToday: boolean
}

export type WeeklyAttendance = {
  average: number | null
  trendPercent: number | null
  activityCount: number
  days: WeeklyAttendanceDay[]
}

export type DashboardTaskPriority = 'low' | 'normal' | 'high'
export type DashboardTaskStatus = 'pending' | 'completed' | 'archived'

export type DashboardTask = {
  id: string
  title: string
  dueDate: string | null
  status: DashboardTaskStatus
  priority: DashboardTaskPriority
}

export type RecentActivityItem = {
  id: string
  title: string
  description: string
  occurredAt: string
  relativeTime: string
  kind: 'grade' | 'attendance' | 'planning' | 'report'
}

export type SmartSuggestion = {
  title: string
  description: string
  actionLabel: string
  path: string
} | null

export type DashboardData = {
  context: DashboardContext
  nextClass: DashboardClass | null
  todayAgenda: TodayAgendaItem[]
  weeklyAttendance: WeeklyAttendance
  tasks: DashboardTask[]
  recentActivity: RecentActivityItem[]
  smartSuggestion: SmartSuggestion
}

export type CreateDashboardTaskInput = {
  title: string
  dueDate?: string | null
}

export type DashboardTone = 'amber' | 'cyan' | 'emerald' | 'indigo'

export type DashboardStat = {
  label: string
  value: string
  change: string
  trend: string
  tone: DashboardTone
  icon: ComponentType<{ className?: string }>
}

export type ChartDatum = {
  label: string
  value: number
}

export type RecentStudent = {
  id: string
  name: string
  grade: string
  status: 'Activo' | 'Nuevo' | 'Seguimiento'
  average: string
  attendance: string
}

export type AcademicAlert = {
  title: string
  description: string
  severity: 'Alta' | 'Media' | 'Baja'
}

export type QuickAction = {
  label: string
  path: string
  icon: ComponentType<{ className?: string }>
}
