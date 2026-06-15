/**
 * Módulo Dashboard — Tipos y constantes para el panel de inicio.
 * Define las estructuras de datos para el contexto, clases, tareas,
 * actividad reciente, sugerencias, estadísticas y gráficos.
 */

import type { ComponentType } from 'react'

/** Contexto del dashboard con datos del usuario y período actual. */
export type DashboardContext = {
  /** Nombre de pila del docente. */
  firstName: string
  /** Fecha actual formateada. */
  formattedDate: string
  /** Nombre del año escolar activo. */
  schoolYearName: string
  /** Nombre del período académico actual. */
  periodName: string
}

/** Clase del día en el horario del docente. */
export type DashboardClass = {
  /** Identificador único de la clase. */
  id: string
  /** Nombre de la materia. */
  subjectName: string
  /** Nombre del grado. */
  gradeName: string
  /** Nombre de la sección. */
  sectionName: string
  /** Hora de inicio (HH:mm). */
  startTime: string
  /** Hora de fin (HH:mm). */
  endTime: string
  /** Duración en minutos. */
  durationMinutes: number
  /** Aula asignada (puede ser nulo). */
  room: string | null
  /** Cantidad de estudiantes. */
  studentCount: number
  /** Día de la semana (0-6). */
  dayOfWeek: number
  /** Identificador de la sección. */
  sectionId: string
  /** Identificador de la materia-sección. */
  sectionSubjectId: string
  /** Identificador del período académico (puede ser nulo). */
  academicPeriodId: string | null
  /** Minutos restantes para que inicie (puede ser nulo). */
  startsInMinutes: number | null
  /** Estado de la clase: completada, en curso o próxima. */
  status: 'completed' | 'current' | 'upcoming'
}

/** Elemento de la agenda del día (misma estructura que DashboardClass). */
export type TodayAgendaItem = DashboardClass

/** Día individual de la asistencia semanal. */
export type WeeklyAttendanceDay = {
  /** Etiqueta del día (ej: LUN, MAR). */
  label: string
  /** Valor de asistencia del día (puede ser nulo). */
  value: number | null
  /** Indica si es el día actual. */
  isToday: boolean
}

/** Resumen de asistencia semanal. */
export type WeeklyAttendance = {
  /** Promedio de asistencia de la semana (puede ser nulo). */
  average: number | null
  /** Cambio porcentual respecto a la semana anterior (puede ser nulo). */
  trendPercent: number | null
  /** Cantidad de registros de actividad. */
  activityCount: number
  /** Lista de días con sus valores de asistencia. */
  days: WeeklyAttendanceDay[]
}

/** Prioridad de una tarea del dashboard. */
export type DashboardTaskPriority = 'low' | 'normal' | 'high'
/** Estado de una tarea del dashboard. */
export type DashboardTaskStatus = 'pending' | 'completed' | 'archived'

/** Tarea pendiente del dashboard. */
export type DashboardTask = {
  id: string
  /** Título de la tarea. */
  title: string
  /** Fecha de vencimiento (puede ser nulo). */
  dueDate: string | null
  /** Estado de la tarea. */
  status: DashboardTaskStatus
  /** Prioridad de la tarea. */
  priority: DashboardTaskPriority
}

/** Elemento de actividad reciente. */
export type RecentActivityItem = {
  id: string
  /** Título de la actividad. */
  title: string
  /** Descripción de la actividad. */
  description: string
  /** Fecha y hora en que ocurrió. */
  occurredAt: string
  /** Descripción relativa del tiempo transcurrido. */
  relativeTime: string
  /** Tipo de actividad. */
  kind: 'grade' | 'attendance' | 'planning' | 'report'
}

/** Sugerencia inteligente mostrada en el dashboard (puede ser nulo). */
export type SmartSuggestion = {
  title: string
  description: string
  actionLabel: string
  path: string
} | null

/** Datos completos del dashboard. */
export type DashboardData = {
  context: DashboardContext
  nextClass: DashboardClass | null
  todayAgenda: TodayAgendaItem[]
  weeklyAttendance: WeeklyAttendance
  tasks: DashboardTask[]
  recentActivity: RecentActivityItem[]
  smartSuggestion: SmartSuggestion
}

/** Entrada para crear una nueva tarea en el dashboard. */
export type CreateDashboardTaskInput = {
  title: string
  dueDate?: string | null
}

/** Tonos de color disponibles para las tarjetas de estadísticas. */
export type DashboardTone = 'amber' | 'cyan' | 'emerald' | 'indigo'

/** Tarjeta de estadística del dashboard. */
export type DashboardStat = {
  label: string
  value: string
  change: string
  trend: string
  tone: DashboardTone
  icon: ComponentType<{ className?: string }>
}

/** Dato individual para un gráfico. */
export type ChartDatum = {
  label: string
  value: number
}

/** Estudiante mostrado en la tabla de estudiantes recientes. */
export type RecentStudent = {
  id: string
  name: string
  grade: string
  status: 'Activo' | 'Nuevo' | 'Seguimiento'
  average: string
  attendance: string
}

/** Alerta académica del dashboard. */
export type AcademicAlert = {
  title: string
  description: string
  severity: 'Alta' | 'Media' | 'Baja'
}

/** Acción rápida del dashboard con enlace de navegación. */
export type QuickAction = {
  label: string
  path: string
  icon: ComponentType<{ className?: string }>
}
