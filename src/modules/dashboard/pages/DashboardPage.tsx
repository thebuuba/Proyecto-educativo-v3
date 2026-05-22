import { PageShell } from '@/components/ui/PageShell'
import { AcademicAlerts } from '@/modules/dashboard/components/AcademicAlerts'
import { BarChart } from '@/modules/dashboard/components/BarChart'
import { ChartPanel } from '@/modules/dashboard/components/ChartPanel'
import { LineChart } from '@/modules/dashboard/components/LineChart'
import { QuickActions } from '@/modules/dashboard/components/QuickActions'
import { RecentStudentsTable } from '@/modules/dashboard/components/RecentStudentsTable'
import { StatCard } from '@/modules/dashboard/components/StatCard'
import {
  academicAlerts,
  attendanceData,
  dashboardStats,
  performanceData,
  quickActions,
  recentStudents,
} from '@/modules/dashboard/data/dashboardData'

export function DashboardPage() {
  return (
    <PageShell
      title="Dashboard"
      description="Vista general del sistema académico y accesos principales."
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <div className="grid gap-6 2xl:grid-cols-2">
              <ChartPanel
                title="Asistencia semanal"
                description="Porcentaje de asistencia registrada por día"
                value="92.6%"
              >
                <BarChart data={attendanceData} />
              </ChartPanel>

              <ChartPanel
                title="Rendimiento académico"
                description="Promedio general por mes académico"
                value="87.4"
              >
                <LineChart data={performanceData} />
              </ChartPanel>
            </div>

            <RecentStudentsTable students={recentStudents} />
          </div>

          <aside className="space-y-6">
            <AcademicAlerts alerts={academicAlerts} />
            <QuickActions actions={quickActions} />
          </aside>
        </div>
      </div>
    </PageShell>
  )
}
