/**
 * Servicio del Dashboard: funciones para obtener datos del panel principal,
 * gestionar tareas pendientes y calcular la asistencia semanal.
 */

import { api, API_CACHE_TAGS, API_CACHE_TTL } from '@/services/apiClient'
import type {
  CreateDashboardTaskInput,
  DashboardData,
  DashboardSetupProgress,
  DashboardTask,
  SmartSuggestion,
  WeeklyAttendance,
} from '@/modules/dashboard/types/dashboard'
import type { AppUser } from '@/modules/auth/types/auth'
import type { SchoolYearSummary } from '@/services/schoolYearService'

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
  const workspace = await safeBlock(api.get<{
    currentSchoolYear: SchoolYearSummary | null
    tasks: DashboardTask[]
    setupProgress: DashboardSetupProgress
    weeklyAttendance: WeeklyAttendance
    smartSuggestion: SmartSuggestion
  }>('/dashboard/workspace', {
    cacheTtlMs: API_CACHE_TTL.sessionList,
    cacheTags: [API_CACHE_TAGS.dashboard, API_CACHE_TAGS.schoolYears],
  }), null)
  const currentSchoolYear = workspace?.currentSchoolYear ?? null
  const tasks = workspace?.tasks ?? []
  const setupProgress = workspace?.setupProgress ?? emptySetupProgress

  return {
    context: {
      firstName: appUser?.fullName?.split(/\s+/)[0] || 'docente',
      formattedDate: new Intl.DateTimeFormat('es-DO', { weekday: 'long', day: '2-digit', month: 'long' }).format(today),
      schoolYearName: currentSchoolYear?.name ?? 'Sin ano activo',
      periodName: 'Periodo actual',
    },
    nextClass: null,
    todayAgenda: [],
    weeklyAttendance: workspace?.weeklyAttendance ?? getEmptyWeeklyAttendance(today),
    tasks: tasks ?? [],
    recentActivity: [],
    smartSuggestion: workspace?.smartSuggestion ?? getSmartSuggestion(setupProgress, workspace?.weeklyAttendance ?? null),
    setupProgress: setupProgress ?? emptySetupProgress,
  }
}

export function getSmartSuggestion(
  progress: DashboardSetupProgress,
  attendance: WeeklyAttendance | null,
): SmartSuggestion {
  if (progress.courseCount === 0) return { title: 'Crea tu primer curso.', description: 'Es el punto de partida para organizar el resto del trabajo.', actionLabel: 'Crear curso', path: '/cursos' }
  if (progress.studentCount === 0 && progress.activeEnrollments === 0) return { title: 'Agrega tus estudiantes.', description: 'Así podrás registrar asistencia y calificaciones.', actionLabel: 'Agregar estudiantes', path: '/estudiantes' }
  if (progress.scheduleEntryCount === 0) return { title: 'Configura el horario.', description: 'Inicio podrá mostrarte tus próximas clases.', actionLabel: 'Crear horario', path: '/horario' }
  if (progress.planningCount === 0) return { title: 'Prepara tu primera planificación.', description: 'DeepSeek puede ayudarte a generar el borrador.', actionLabel: 'Planificar', path: '/planificaciones' }
  if (!attendance?.activityCount) return { title: 'Aún no hay asistencia esta semana.', description: 'Registra la primera para dar seguimiento al grupo.', actionLabel: 'Registrar asistencia', path: '/asistencia' }
  if (attendance.average !== null && attendance.average < 80) return { title: `La asistencia semanal está en ${attendance.average} %.`, description: 'Conviene revisar las ausencias antes de que termine la semana.', actionLabel: 'Revisar asistencia', path: '/asistencia' }
  return null
}

/** Crea una nueva tarea en el dashboard. */
export async function createDashboardTask(input: CreateDashboardTaskInput, appUserId: string | null): Promise<DashboardTask> {
  if (!input.title.trim()) throw new Error('Escribe un titulo para la tarea.')
  return api.post<DashboardTask>('/dashboard/tasks', { ...input, assignedTo: appUserId }, {
    invalidateCacheTags: [API_CACHE_TAGS.dashboard],
  })
}

/** Marca una tarea como completada. */
export async function completeDashboardTask(id: string): Promise<void> {
  await api.patch(`/dashboard/tasks/${id}`, { status: 'completed' }, {
    invalidateCacheTags: [API_CACHE_TAGS.dashboard],
  })
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
