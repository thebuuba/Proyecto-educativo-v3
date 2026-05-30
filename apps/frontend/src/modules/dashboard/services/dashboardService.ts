import { CalendarCheck, ClipboardCheck, FileText, NotebookPen } from 'lucide-react'

import { api } from '@/services/apiClient'
import type {
  CreateDashboardTaskInput,
  DashboardData,
  DashboardTask,
  WeeklyAttendance,
  RecentActivityItem,
} from '@/modules/dashboard/types/dashboard'
import type { AppUser } from '@/modules/auth/types/auth'
import { getCurrentSchoolYear } from '@/services/schoolYearService'

const weekdayLabels = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE']

export async function getDashboardData(appUser: AppUser | null): Promise<DashboardData> {
  const today = new Date()
  const currentSchoolYear = await getCurrentSchoolYear()

  const [] = await Promise.all([
    safeBlock(api.get<{ studentCount: number; teacherCount: number; activeEnrollments: number }>('/dashboard/stats')),
    safeBlock(api.get<DashboardTask[]>('/dashboard/tasks'), []),
  ])

  return {
    context: {
      firstName: appUser?.fullName?.split(/\s+/)[0] || 'docente',
      formattedDate: new Intl.DateTimeFormat('es-DO', { weekday: 'long', day: '2-digit', month: 'long' }).format(today),
      schoolYearName: currentSchoolYear?.name ?? 'Sin año activo',
      periodName: 'Período actual',
    },
    nextClass: null,
    todayAgenda: [],
    weeklyAttendance: getEmptyWeeklyAttendance(today),
    tasks: [],
    recentActivity: [],
    smartSuggestion: null,
  }
}

export async function createDashboardTask(input: CreateDashboardTaskInput, appUserId: string | null): Promise<DashboardTask> {
  if (!input.title.trim()) throw new Error('Escribe un título para la tarea.')
  return api.post<DashboardTask>('/dashboard/tasks', { ...input, assignedTo: appUserId })
}

export async function completeDashboardTask(id: string): Promise<void> {
  await api.patch(`/dashboard/tasks/${id}`, { status: 'completed' })
}

function safeBlock<T>(promise: Promise<T>, fallback?: T): Promise<T | undefined> {
  return promise.catch((err) => {
    console.warn('Dashboard block failed', err)
    return fallback
  })
}

function getEmptyWeeklyAttendance(today: Date): WeeklyAttendance {
  const weekStart = getWeekStart(today)
  return {
    average: null, trendPercent: null, activityCount: 0,
    days: weekdayLabels.map((label, index) => ({
      label, value: null, isToday: formatDateKey(addDays(weekStart, index)) === formatDateKey(today),
    })),
  }
}

function getWeekStart(date: Date) {
  const start = new Date(date)
  const day = date.getDay() || 7
  start.setDate(start.getDate() - (day - 1))
  start.setHours(0, 0, 0, 0)
  return start
}

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function formatDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export const activityIcons = {
  attendance: CalendarCheck,
  grade: ClipboardCheck,
  planning: NotebookPen,
  report: FileText,
} satisfies Record<RecentActivityItem['kind'], typeof CalendarCheck>
