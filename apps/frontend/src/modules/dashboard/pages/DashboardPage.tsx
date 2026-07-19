/**
 * Página principal del Dashboard — Muestra el resumen del día con la agenda,
 * asistencia semanal, tareas pendientes, actividad reciente y sugerencias.
 */

import { useNavigate } from 'react-router-dom'

import { ErrorState } from '@/components/ui'
import { PageSkeleton } from '@/components/ui/PageSkeleton'
import { DashboardHero } from '@/modules/dashboard/components/DashboardHero'
import { DashboardTasks } from '@/modules/dashboard/components/DashboardTasks'
import { InitialSetupChecklist } from '@/modules/dashboard/components/InitialSetupChecklist'
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
      <div className="w-full min-w-0">
        <PageSkeleton />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="w-full min-w-0">
        <ErrorState message={error ?? 'No se pudieron cargar los datos de inicio.'} />
      </div>
    )
  }

  const hasAgenda = data.todayAgenda.length > 0
  const hasTasks = data.tasks.length > 0
  const hasRecentActivity = data.recentActivity.length > 0

  return (
    <div className="teacher-dashboard mx-auto w-full min-w-0 max-w-[1440px] space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-baseline gap-3 flex-wrap">
          <h1 className="text-2xl lg:text-[28px] font-bold tracking-tight text-foreground">
            {getGreeting()},
            {' '}
            <span className="text-accent">{data.context.firstName}</span>
          </h1>
          <span className="text-sm text-muted-foreground">
            <span className="hidden sm:inline">· </span>
            {formatTodayDate()}
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

      <div className="dashboard-priority-grid grid gap-5">
        <div className="dashboard-day-status dashboard-enter" style={{ animationDuration: '420ms' }}>
          <DashboardHero
            nextClass={data.nextClass}
            onStartClass={handleStartClass}
            onViewPlanning={handleViewPlanning}
          />
        </div>

        <div className="dashboard-setup-slot dashboard-enter" style={{ animationDelay: '50ms', animationDuration: '380ms' }}>
          <InitialSetupChecklist progress={data.setupProgress} />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        {hasAgenda ? (
          <div className="dashboard-enter lg:col-span-5" style={{ animationDelay: '80ms', animationDuration: '440ms' }}>
            <TodayAgenda items={data.todayAgenda} />
          </div>
        ) : null}

        <div className={[hasAgenda ? 'lg:col-span-7' : 'lg:col-span-12', 'space-y-5'].join(' ')}>
          <div className={['grid gap-5', hasTasks ? 'md:grid-cols-2' : ''].join(' ')}>
            <div className="dashboard-enter" style={{ animationDelay: '140ms', animationDuration: '380ms' }}>
              <WeeklyAttendanceCard attendance={data.weeklyAttendance} />
            </div>
            {hasTasks ? (
              <div className="dashboard-enter" style={{ animationDelay: '180ms', animationDuration: '340ms' }}>
                <DashboardTasks
                  tasks={data.tasks}
                  loading={actionLoading}
                  onAddTask={addTask}
                  onCompleteTask={completeTask}
                />
              </div>
            ) : null}
          </div>
          {hasRecentActivity ? (
            <div className="dashboard-enter" style={{ animationDelay: '220ms', animationDuration: '300ms' }}>
              <RecentActivity items={data.recentActivity} />
            </div>
          ) : null}
        </div>
      </div>

      <div className="dashboard-enter" style={{ animationDelay: '240ms', animationDuration: '280ms' }}>
        <SmartSuggestion suggestion={data.smartSuggestion} />
      </div>
    </div>
  )
}
