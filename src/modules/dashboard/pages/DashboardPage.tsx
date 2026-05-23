import { useNavigate } from 'react-router-dom'

import { ErrorState, LoadingState, PageShell } from '@/components/ui'
import { DashboardHero } from '@/modules/dashboard/components/DashboardHero'
import { DashboardTasks } from '@/modules/dashboard/components/DashboardTasks'
import { RecentActivity } from '@/modules/dashboard/components/RecentActivity'
import { SmartSuggestion } from '@/modules/dashboard/components/SmartSuggestion'
import { TodayAgenda } from '@/modules/dashboard/components/TodayAgenda'
import { WeeklyAttendanceCard } from '@/modules/dashboard/components/WeeklyAttendanceCard'
import { useDashboard } from '@/modules/dashboard/hooks/useDashboard'
import type { DashboardClass } from '@/modules/dashboard/types/dashboard'

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
      <PageShell
        title="Inicio"
        description="Resumen operativo de clases, pendientes y actividad académica."
      >
        <LoadingState message="Cargando inicio..." />
      </PageShell>
    )
  }

  if (!data) {
    return (
      <PageShell
        title="Inicio"
        description="Resumen operativo de clases, pendientes y actividad académica."
      >
        <ErrorState message={error ?? 'No se pudieron cargar los datos de inicio.'} />
      </PageShell>
    )
  }

  return (
    <section className="mx-auto w-full max-w-[1500px] space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-3xl font-bold tracking-normal text-foreground sm:text-4xl">
            Buen día, <span className="text-accent">{data.context.firstName}</span>
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            {data.context.formattedDate}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="inline-flex h-9 items-center rounded-full border border-border bg-card px-4 text-sm font-bold text-foreground shadow-sm">
            {data.context.schoolYearName}
          </span>
          <span className="inline-flex h-9 items-center rounded-full bg-accent/18 px-4 text-sm font-bold text-accent">
            {data.context.periodName}
          </span>
        </div>
      </div>

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

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)]">
        <TodayAgenda items={data.todayAgenda} />

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-1">
          <WeeklyAttendanceCard attendance={data.weeklyAttendance} />
          <DashboardTasks
            tasks={data.tasks}
            loading={actionLoading}
            onAddTask={addTask}
            onCompleteTask={completeTask}
          />
        </div>
      </div>

      <RecentActivity items={data.recentActivity} />
      <SmartSuggestion suggestion={data.smartSuggestion} />
    </section>
  )
}
