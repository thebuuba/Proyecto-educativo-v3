/**
 * Página principal del Dashboard — Muestra el resumen del día con la agenda,
 * asistencia semanal, tareas pendientes, actividad reciente y sugerencias.
 */

import { useNavigate } from 'react-router-dom'

import { ErrorState, LoadingState } from '@/components/ui'
import { DashboardHero } from '@/modules/dashboard/components/DashboardHero'
import { DashboardTasks } from '@/modules/dashboard/components/DashboardTasks'
import { RecentActivity } from '@/modules/dashboard/components/RecentActivity'
import { SmartSuggestion } from '@/modules/dashboard/components/SmartSuggestion'
import { TodayAgenda } from '@/modules/dashboard/components/TodayAgenda'
import { WeeklyAttendanceCard } from '@/modules/dashboard/components/WeeklyAttendanceCard'
import { useDashboard } from '@/modules/dashboard/hooks/useDashboard'
import type { DashboardClass } from '@/modules/dashboard/types/dashboard'

/** Retorna un saludo según la hora del día. */
function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Buenos días'
  if (hour < 18) return 'Buenas tardes'
  return 'Buenas noches'
}

/** Formatea la fecha actual en formato legible en español. */
function formatTodayDate() {
  return new Intl.DateTimeFormat('es-DO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())
}

/** Página principal del dashboard del docente. */
export function DashboardPage() {
  const navigate = useNavigate()
  const {
    data,
    error,
    loading,
    actionLoading,
    addTask,
    completeTask,
  } = useDashboard()

  const handleStartClass = (item: DashboardClass) => {
    const params = new URLSearchParams({
      sectionId: item.sectionId,
    })

    if (item.academicPeriodId) {
      params.set('periodId', item.academicPeriodId)
    }

    navigate(`/asistencia?${params.toString()}`)
  }

  const handleViewPlanning = (item: DashboardClass) => {
    const params = new URLSearchParams({
      sectionSubjectId: item.sectionSubjectId,
    })

    if (item.academicPeriodId) {
      params.set('periodId', item.academicPeriodId)
    }

    navigate(`/planificaciones?${params.toString()}`)
  }

  if (loading) {
    return (
      <div className="px-6 lg:px-10 py-8 max-w-[1400px] mx-auto">
        <LoadingState message="Cargando inicio..." />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="px-6 lg:px-10 py-8 max-w-[1400px] mx-auto">
        <ErrorState message={error ?? 'No se pudieron cargar los datos de inicio.'} />
      </div>
    )
  }

  return (
    <div className="px-6 lg:px-10 py-8 max-w-[1400px] mx-auto space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-baseline gap-3 flex-wrap">
          <h1 className="text-2xl lg:text-[28px] font-bold tracking-tight text-foreground">
            {getGreeting()},
            {' '}
            <span className="text-accent">{data.context.firstName}</span>
          </h1>
          <span className="text-sm text-muted-foreground">
            · {formatTodayDate()}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex h-7 items-center rounded-full border border-border bg-card px-3 font-semibold text-muted-foreground">
            {data.context.schoolYearName}
          </span>
          <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-accent/12 px-3 font-semibold text-accent">
            <span className="size-1.5 rounded-full bg-accent animate-pulse" />
            {data.context.periodName} · activo
          </span>
        </div>
      </header>

      {error && (
        <div className="rounded-xl border border-destructive/25 bg-destructive/10 p-4 text-sm font-medium text-destructive">
          {error}
        </div>
      )}

      <DashboardHero
        nextClass={data.nextClass}
        onStartClass={handleStartClass}
        onViewPlanning={handleViewPlanning}
      />

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <TodayAgenda items={data.todayAgenda} />
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <WeeklyAttendanceCard attendance={data.weeklyAttendance} />
            <DashboardTasks
              tasks={data.tasks}
              loading={actionLoading}
              onAddTask={addTask}
              onCompleteTask={completeTask}
            />
          </div>
          <RecentActivity items={data.recentActivity} />
        </div>
      </div>

      <SmartSuggestion suggestion={data.smartSuggestion} />
    </div>
  )
}
