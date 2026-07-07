/**
 * Servicio del Dashboard: funciones para obtener datos del panel principal,
 * gestionar tareas pendientes y calcular la asistencia semanal.
 */

import { api } from '@/services/apiClient'
import type {
  CreateDashboardTaskInput,
  DashboardData,
  DashboardSetupProgress,
  DashboardTask,
  WeeklyAttendance,
} from '@/modules/dashboard/types/dashboard'
import type { AppUser } from '@/modules/auth/types/auth'
import { getCurrentSchoolYear } from '@/services/schoolYearService'

const weekdayLabels = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE']

const emptySetupProgress: DashboardSetupProgress = {
  courseCount: 0,
  studentCount: 0,
  activeEnrollments: 0,
  scheduleEntryCount: 0,
  attendanceCount: 0,
  planningCount: 0,
}

/** Obtiene los datos completos del dashboard para el usuario actual. */
export async function getDashboardData(appUser: AppUser | null): Promise<DashboardData> {
  const today = new Date()
  const [currentSchoolYear, tasks, setupProgress] = await Promise.all([
    safeBlock(getCurrentSchoolYear(), null),
    safeBlock(api.get<DashboardTask[]>('/dashboard/tasks'), []),
    safeBlock(api.get<DashboardSetupProgress>('/dashboard/stats'), emptySetupProgress),
  ])

  return {
    context: {
      firstName: appUser?.fullName?.split(/\s+/)[0] || 'docente',
      formattedDate: new Intl.DateTimeFormat('es-DO', { weekday: 'long', day: '2-digit', month: 'long' }).format(today),
      schoolYearName: currentSchoolYear?.name ?? 'Sin ano activo',
      periodName: 'Periodo actual',
    },
    nextClass: null,
    todayAgenda: [],
    weeklyAttendance: getEmptyWeeklyAttendance(today),
    tasks: tasks ?? [],
    recentActivity: [],
    smartSuggestion: null,
    setupProgress: setupProgress ?? emptySetupProgress,
  }
}

/** Crea una nueva tarea en el dashboard. */
export async function createDashboardTask(input: CreateDashboardTaskInput, appUserId: string | null): Promise<DashboardTask> {
  if (!input.title.trim()) throw new Error('Escribe un titulo para la tarea.')
  return api.post<DashboardTask>('/dashboard/tasks', { ...input, assignedTo: appUserId })
}

/** Marca una tarea como completada. */
export async function completeDashboardTask(id: string): Promise<void> {
  await api.patch(`/dashboard/tasks/${id}`, { status: 'completed' })
}

/** Ejecuta una promesa y retorna un valor por defecto si falla, sin lanzar error. */
function safeBlock<T>(promise: Promise<T>, fallback?: T): Promise<T | undefined> {
  return promise.catch((err) => {
    console.warn('Dashboard block failed', err)
    return fallback
  })
}

/** Retorna un objeto WeeklyAttendance vacio para la semana actual. */
function getEmptyWeeklyAttendance(today: Date): WeeklyAttendance {
  const weekStart = getWeekStart(today)
  return {
    average: null, trendPercent: null, activityCount: 0,
    days: weekdayLabels.map((label, index) => ({
      label, value: null, isToday: formatDateKey(addDays(weekStart, index)) === formatDateKey(today),
    })),
  }
}

/** Retorna la fecha del inicio de la semana (lunes) para una fecha dada. */
function getWeekStart(date: Date) {
  const start = new Date(date)
  const day = date.getDay() || 7
  start.setDate(start.getDate() - (day - 1))
  start.setHours(0, 0, 0, 0)
  return start
}

/** Suma una cantidad de dias a una fecha y retorna una nueva fecha. */
function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

/** Formatea una fecha como clave YYYY-MM-DD. */
function formatDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
