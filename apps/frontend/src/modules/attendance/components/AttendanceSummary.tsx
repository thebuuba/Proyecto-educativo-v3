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
  { key: 'totalStudents', label: 'Estudiantes', helper: 'matriculados', icon: UserCheck, iconClassName: 'bg-primary/10 text-primary' },
  { key: 'workedDays', label: 'Días trabajados', helper: 'registrados', icon: CalendarCheck, iconClassName: 'bg-success/14 text-foreground' },
  { key: 'averageAttendance', label: 'Promedio', helper: 'asistencia', icon: TrendingUp, iconClassName: 'bg-primary/10 text-primary' },
  { key: 'absences', label: 'Ausencias', helper: 'registradas', icon: UserX, iconClassName: 'bg-destructive/12 text-foreground' },
] as const

export function AttendanceSummary({ stats, loading }: AttendanceSummaryProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const value = stats[item.key]
        const Icon = item.icon
        return (
          <Card key={item.key} className="rounded-2xl border-0 bg-card shadow-sm">
            <CardContent className="flex min-h-[88px] items-center gap-3 p-3.5 sm:p-4">
              <div className={cn('flex size-10 shrink-0 items-center justify-center rounded-xl', item.iconClassName)}>
                <Icon className="size-[18px]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">
                  {item.label}
                </p>
                <div className={cn('mt-1 flex items-baseline gap-2', loading && 'animate-pulse')}>
                  {loading ? (
                    <div className="h-6 w-12 rounded-lg bg-muted" />
                  ) : (
                    <p className="text-xl font-black leading-none tracking-tight text-foreground">
                      {item.key === 'averageAttendance'
                        ? formatPercentage(value)
                        : value ?? 0}
                    </p>
                  )}
                  <span className="truncate text-[11px] text-muted-foreground">{item.helper}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
