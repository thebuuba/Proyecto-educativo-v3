import { CalendarCheck, TrendingUp, UserCheck, UserX } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/Card'
import type { MonthlyAttendanceStats } from '@/modules/attendance/types'
import { formatPercentage } from '@/modules/attendance/utils/monthlyAttendance'
import { cn } from '@/utils/cn'

type AttendanceSummaryProps = {
  stats: MonthlyAttendanceStats
  loading: boolean
}

const items = [
  { key: 'totalStudents', label: 'Estudiantes', helper: 'matriculados', icon: UserCheck, iconClassName: 'bg-success/12 text-success' },
  { key: 'workedDays', label: 'Días trabajados', helper: 'del mes', icon: CalendarCheck, iconClassName: 'bg-success/12 text-success' },
  { key: 'averageAttendance', label: 'Promedio', helper: 'asistencia', icon: TrendingUp, iconClassName: 'bg-success/12 text-success' },
  { key: 'absences', label: 'Ausencias', helper: 'registradas', icon: UserX, iconClassName: 'bg-warning/14 text-warning' },
] as const

export function AttendanceSummary({ stats, loading }: AttendanceSummaryProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => {
        const value = stats[item.key]
        const Icon = item.icon
        return (
          <Card key={item.key} className="rounded-xl">
            <CardContent className="flex items-center gap-4 p-4">
              <div className={cn('flex size-11 shrink-0 items-center justify-center rounded-xl', item.iconClassName)}>
                <Icon className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  {item.label}
                </p>
                <div className={cn('mt-1', loading && 'animate-pulse')}>
                  {loading ? (
                    <div className="h-7 w-14 rounded-lg bg-muted" />
                  ) : (
                    <p className="text-2xl font-bold leading-none text-primary">
                      {item.key === 'averageAttendance'
                        ? formatPercentage(value)
                        : value ?? 0}
                    </p>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.key === 'workedDays' ? 'registrados' : item.helper}
                </p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
