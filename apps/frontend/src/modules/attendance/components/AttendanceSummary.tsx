import { Card, CardContent } from '@/components/ui/Card'
import type { MonthlyAttendanceStats } from '@/modules/attendance/types'
import { formatPercentage } from '@/modules/attendance/utils/monthlyAttendance'
import { cn } from '@/utils/cn'

type AttendanceSummaryProps = {
  stats: MonthlyAttendanceStats
  loading: boolean
}

const items = [
  { key: 'totalStudents', label: 'Total estudiantes', helper: 'matriculados' },
  { key: 'workedDays', label: 'Días trabajados', helper: 'del mes' },
  { key: 'averageAttendance', label: 'Promedio', helper: 'asistencia' },
  { key: 'absences', label: 'Ausencias', helper: 'registradas' },
  { key: 'excuses', label: 'Excusas', helper: 'registradas' },
] as const

export function AttendanceSummary({ stats, loading }: AttendanceSummaryProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {items.map((item) => {
        const value = stats[item.key]
        return (
          <Card key={item.key}>
            <CardContent className="p-4 sm:p-5">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
                {item.label}
              </p>
              <div className={cn('mt-3', loading && 'animate-pulse')}>
                {loading ? (
                  <div className="h-8 w-16 rounded-lg bg-muted" />
                ) : (
                  <p className="text-3xl font-bold leading-none text-primary">
                    {item.key === 'averageAttendance'
                      ? formatPercentage(value)
                      : value ?? 0}
                  </p>
                )}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{item.helper}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
