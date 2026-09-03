/**
 * Página principal del Dashboard — Muestra el resumen del día con la agenda,
 * asistencia semanal, tareas pendientes, actividad reciente y sugerencias.
 */

import { RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { ErrorState } from '@/components/ui'
import { PageSkeleton } from '@/components/ui/PageSkeleton'
import { BarChart } from '@/modules/dashboard/components/BarChart'
import { ChartPanel } from '@/modules/dashboard/components/ChartPanel'
import {
  DashboardEditableGrid,
  type DashboardGridWidget,
} from '@/modules/dashboard/components/DashboardEditableGrid'
import { DashboardHero } from '@/modules/dashboard/components/DashboardHero'
import { DashboardTasks } from '@/modules/dashboard/components/DashboardTasks'
import { InitialSetupChecklist } from '@/modules/dashboard/components/InitialSetupChecklist'
import { JournalSummaryCard } from '@/modules/dashboard/components/JournalSummaryCard'
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
  const hasWeeklyAttendance = data.weeklyAttendance.days.length > 0
  const canManageOperations = data.view === 'management' || data.view === 'teacher'
  const hasTasks = canManageOperations
  const hasOperationalBlocks = hasAgenda || hasWeeklyAttendance || hasTasks || canManageOperations
  const journalSummary = data.journalSummary ?? {
    activeCount: 0,
    pendingCount: 0,
    recentEntries: [],
  }

  const managementWidgets: DashboardGridWidget[] = data.view === 'management'
    ? [
        {
          id: 'setup',
          label: 'Preparación inicial',
          content: <InitialSetupChecklist progress={data.setupProgress} />,
          layout: { x: 0, y: 0, w: 9, h: 3, minW: 5, minH: 3, maxW: 12 },
        },
        {
          id: 'next-class',
          label: 'Próxima clase',
          content: (
            <DashboardHero
              nextClass={data.nextClass}
              onStartClass={handleStartClass}
              onViewPlanning={handleViewPlanning}
              canManageClass={canManageOperations}
              onCountdownEnd={refetch}
            />
          ),
          layout: { x: 9, y: 0, w: 3, h: 5, minW: 3, minH: 4, maxW: 5, maxH: 7 },
        },
        ...(hasAgenda
          ? [{
              id: 'agenda',
              label: 'Agenda de hoy',
              content: <TodayAgenda items={data.todayAgenda} />,
              layout: { x: 0, y: 3, w: 5, h: 10, minW: 4, minH: 6, maxW: 8, maxH: 14 },
            } satisfies DashboardGridWidget]
          : []),
        ...(hasWeeklyAttendance
          ? [{
              id: 'attendance',
              label: 'Pulso semanal',
              content: <WeeklyAttendanceCard attendance={data.weeklyAttendance} />,
              layout: { x: 5, y: 3, w: 4, h: 3, minW: 3, minH: 3, maxW: 7, maxH: 6 },
            } satisfies DashboardGridWidget]
          : []),
        {
          id: 'tasks',
          label: 'Pendientes',
          content: (
            <DashboardTasks
              tasks={data.tasks}
              loading={actionLoading}
              onAddTask={addTask}
              onCompleteTask={completeTask}
            />
          ),
          layout: { x: 5, y: 6, w: 4, h: 3, minW: 3, minH: 3, maxW: 7, maxH: 7 },
        },
        {
          id: 'recent',
          label: 'Actividad reciente',
          content: <RecentActivity items={data.recentActivity} />,
          layout: { x: 9, y: 5, w: 3, h: 4, minW: 3, minH: 3, maxW: 7, maxH: 8 },
        },
        {
          id: 'journal',
          label: 'Bitácora docente',
          content: <JournalSummaryCard summary={journalSummary} />,
          layout: { x: 5, y: 9, w: 7, h: 4, minW: 4, minH: 3, maxW: 12, maxH: 8 },
        },
        ...(data.smartSuggestion
          ? [{
              id: 'suggestion',
              label: 'Sugerencia inteligente',
              content: <SmartSuggestion suggestion={data.smartSuggestion} />,
              layout: { x: 0, y: 13, w: 12, h: 2, minW: 5, minH: 2, maxW: 12, maxH: 4 },
            } satisfies DashboardGridWidget]
          : []),
      ]
    : []

  return (
    <div className="w-full min-w-0 space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-baseline gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-[28px]">
            {getGreeting()},
            {' '}
            <span className="text-accent">{data.context.firstName}</span>
          </h1>
          <span className="text-sm text-muted-foreground">
            · {data.context.formattedDate}
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
            <span className="size-1.5 animate-pulse rounded-full bg-accent" />
            {data.context.periodName} · activo
          </span>
        </div>
      </header>

      {error && (
        <div className="rounded-xl border border-destructive/25 bg-destructive/10 p-4 text-sm font-medium text-destructive">
          {error}
        </div>
      )}

      {data.view === 'management' ? (
        <DashboardEditableGrid
          widgets={managementWidgets}
          storageKey="aulabase:dashboard-layout:management:v1"
        />
      ) : (
        <>
          <div className="dashboard-enter" style={{ animationDuration: '520ms' }}>
            <DashboardHero
              nextClass={data.nextClass}
              onStartClass={handleStartClass}
              onViewPlanning={handleViewPlanning}
              canManageClass={canManageOperations}
              onCountdownEnd={refetch}
            />
          </div>

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
            <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
              {hasAgenda ? (
                <div className="dashboard-enter lg:col-span-5 lg:self-start" style={{ animationDelay: '80ms', animationDuration: '440ms' }}>
                  <TodayAgenda items={data.todayAgenda} />
                </div>
              ) : null}

              <div className={[hasAgenda ? 'lg:col-span-7' : 'lg:col-span-12', 'space-y-6'].join(' ')}>
                {hasWeeklyAttendance || hasTasks ? (
                  <div className="grid gap-6 md:grid-cols-2 md:items-start">
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

                {canManageOperations ? (
                  <div className="dashboard-enter" style={{ animationDelay: '220ms', animationDuration: '300ms' }}>
                    <RecentActivity items={data.recentActivity} />
                  </div>
                ) : null}

                {canManageOperations ? (
                  <div className="dashboard-enter" style={{ animationDelay: '230ms', animationDuration: '300ms' }}>
                    <JournalSummaryCard summary={journalSummary} />
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="dashboard-enter" style={{ animationDelay: '240ms', animationDuration: '280ms' }}>
            <SmartSuggestion suggestion={data.smartSuggestion} />
          </div>
        </>
      )}
    </div>
  )
}
