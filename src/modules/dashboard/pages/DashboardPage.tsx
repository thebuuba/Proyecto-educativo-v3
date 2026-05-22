import { ErrorState, LoadingState, PageShell } from '@/components/ui'
import { AcademicAlerts } from '@/modules/dashboard/components/AcademicAlerts'
import { BarChart } from '@/modules/dashboard/components/BarChart'
import { ChartPanel } from '@/modules/dashboard/components/ChartPanel'
import { LineChart } from '@/modules/dashboard/components/LineChart'
import { QuickActions } from '@/modules/dashboard/components/QuickActions'
import { RecentStudentsTable } from '@/modules/dashboard/components/RecentStudentsTable'
import { StatCard } from '@/modules/dashboard/components/StatCard'
import { useDashboard } from '@/modules/dashboard/hooks/useDashboard'

export function DashboardPage() {
  const { data, error, loading } = useDashboard()

  if (loading) {
    return (
      <PageShell
        title="Dashboard"
        description="Vista general del sistema académico y accesos principales."
      >
        <LoadingState message="Cargando dashboard..." />
      </PageShell>
    )
  }

  if (error) {
    return (
      <PageShell
        title="Dashboard"
        description="Vista general del sistema académico y accesos principales."
      >
        <ErrorState message={error} />
      </PageShell>
    )
  }

  if (!data) {
    return (
      <PageShell
        title="Dashboard"
        description="Vista general del sistema académico y accesos principales."
      >
        <ErrorState message="No se pudieron cargar los datos del dashboard." />
      </PageShell>
    )
  }

  const attendanceValue =
    data.stats.find((stat) => stat.label === 'Asistencia promedio')?.value ?? '—'
  const performanceValue =
    data.stats.find((stat) => stat.label === 'Promedio académico')?.value ?? '—'

  return (
    <PageShell
      title="Dashboard"
      description="Vista general del sistema académico y accesos principales."
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {data.stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <div className="grid gap-6 2xl:grid-cols-2">
              <ChartPanel
                title="Asistencia semanal"
                description="Porcentaje de asistencia registrada por día"
                value={attendanceValue}
              >
                <BarChart data={data.attendanceData} />
              </ChartPanel>

              <ChartPanel
                title="Rendimiento académico"
                description="Promedio general por mes académico"
                value={performanceValue}
              >
                <LineChart data={data.performanceData} />
              </ChartPanel>
            </div>

            <RecentStudentsTable students={data.recentStudents} />
          </div>

          <aside className="space-y-6">
            <AcademicAlerts alerts={data.alerts} />
            <QuickActions actions={data.quickActions} />
          </aside>
        </div>
      </div>
    </PageShell>
  )
}
