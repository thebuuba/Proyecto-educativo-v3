/**
 * Página principal del Dashboard — Muestra el resumen del día con la agenda,
 * asistencia semanal, tareas pendientes, actividad reciente y sugerencias.
 */

import { RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { ErrorState } from '@/components/ui'
import { PageSkeleton } from '@/components/ui/PageSkeleton'
import { DashboardHero } from '@/modules/dashboard/components/DashboardHero'
import { DashboardTasks } from '@/modules/dashboard/components/DashboardTasks'
import { BarChart } from '@/modules/dashboard/components/BarChart'
import { ChartPanel } from '@/modules/dashboard/components/ChartPanel'
import { InitialSetupChecklist } from '@/modules/dashboard/components/InitialSetupChecklist'
import { LineChart } from '@/modules/dashboard/components/LineChart'
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
    refetch,
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

  if (loading && !data) {
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
  const hasWeeklyAttendance = data.weeklyAttendance.activityCount > 0 || data.weeklyAttendance.average !== null
  const canManageOperations = data.view === 'management' || data.view === 'teacher'
  const hasTasks = canManageOperations
  const hasRecentActivity = data.recentActivity.length > 0
  const hasOperationalBlocks = hasAgenda || hasWeeklyAttendance || hasTasks || hasRecentActivity

  return (
    <div className="w-full min-w-0 space-y-6">
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
          <button
            type="button"
            onClick={() => void refetch()}
            disabled={loading}
            className="inline-flex size-7 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
            aria-label="Actualizar inicio"
            title="Actualizar inicio"
          >
            <RefreshCw className={`size-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
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

      <div className="dashboard-enter" style={{ animationDuration: '520ms' }}>
        <DashboardHero
          nextClass={data.nextClass}
          onStartClass={handleStartClass}
          onViewPlanning={handleViewPlanning}
          canManageClass={canManageOperations}
        />
      </div>

      {data.view === 'management' ? (
        <div className="dashboard-enter" style={{ animationDelay: '60ms', animationDuration: '460ms' }}>
          <InitialSetupChecklist progress={data.setupProgress} />
        </div>
      ) : null}

      {data.view === 'teacher' && data.teacherAnalytics ? (
        <section className="grid gap-6 lg:grid-cols-2" aria-label="Resumen académico del docente">
          <ChartPanel
            title="Rendimiento por período"
            description={`${data.teacherAnalytics.gradedRecords} calificaciones publicadas`}
            value={data.teacherAnalytics.average === null ? '—' : `${data.teacherAnalytics.average}%`}
          >
            <LineChart data={data.teacherAnalytics.performanceByPeriod} />
          </ChartPanel>
          <ChartPanel
            title="Promedio por asignatura"
            description="Resultados de tus cursos en el año escolar actual"
            value={data.teacherAnalytics.performanceBySubject.length ? `${data.teacherAnalytics.performanceBySubject.length} asignaturas` : '—'}
          >
            <BarChart data={data.teacherAnalytics.performanceBySubject} />
          </ChartPanel>
        </section>
      ) : null}

      {hasOperationalBlocks ? (
        <div className="grid lg:grid-cols-12 gap-6">
          {hasAgenda ? (
            <div className="dashboard-enter lg:col-span-5" style={{ animationDelay: '80ms', animationDuration: '440ms' }}>
              <TodayAgenda items={data.todayAgenda} />
            </div>
          ) : null}

          <div className={[hasAgenda ? 'lg:col-span-7' : 'lg:col-span-12', 'space-y-6'].join(' ')}>
            {hasWeeklyAttendance || hasTasks ? (
              <div className="grid md:grid-cols-2 gap-6">
                {hasWeeklyAttendance ? (
                  <div className="dashboard-enter" style={{ animationDelay: '140ms', animationDuration: '380ms' }}>
                    <WeeklyAttendanceCard attendance={data.weeklyAttendance} />
                  </div>
                ) : null}
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
            ) : null}
            {hasRecentActivity ? (
              <div className="dashboard-enter" style={{ animationDelay: '220ms', animationDuration: '300ms' }}>
                <RecentActivity items={data.recentActivity} />
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="dashboard-enter" style={{ animationDelay: '240ms', animationDuration: '280ms' }}>
        <SmartSuggestion suggestion={data.smartSuggestion} />
      </div>
    </div>
  )
}
