import { ArrowRight, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import type { WeeklyAttendance } from '@/modules/dashboard/types/dashboard'
import { cn } from '@/utils/cn'

type WeeklyAttendanceCardProps = {
  attendance: WeeklyAttendance
}

export function WeeklyAttendanceCard({ attendance }: WeeklyAttendanceCardProps) {
  return (
    <Card className="min-h-[300px] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">
            Esta semana
          </p>
          <p className="mt-3 text-3xl font-bold text-foreground">
            {attendance.average === null ? '—' : `${attendance.average}%`}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Asistencia promedio</p>
        </div>
        {attendance.trendPercent !== null && (
          <Badge tone={attendance.trendPercent >= 0 ? 'success' : 'warning'}>
            <TrendingUp className="mr-1 size-3" />
            {attendance.trendPercent > 0 ? '+' : ''}
            {attendance.trendPercent}%
          </Badge>
        )}
      </div>

      <div className="mt-12 grid grid-cols-5 gap-3">
        {attendance.days.map((day) => (
          <div key={day.label} className="min-w-0">
            <div className="flex h-20 items-end rounded-lg bg-muted/50 p-1">
              <div
                className={cn(
                  'w-full rounded-md',
                  day.isToday ? 'bg-accent' : 'bg-primary/25',
                )}
                style={{ height: `${Math.max(day.value ?? 0, day.value === null ? 0 : 8)}%` }}
              />
            </div>
            <p
              className={cn(
                'mt-2 text-center text-xs font-bold',
                day.isToday ? 'text-accent' : 'text-muted-foreground',
              )}
            >
              {day.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-7 flex items-center justify-between border-t border-border pt-4">
        <p className="text-sm text-muted-foreground">
          {attendance.activityCount} registros creados
        </p>
        <Link
          to="/reportes"
          className="inline-flex items-center gap-1 text-sm font-bold text-foreground hover:text-accent"
        >
          Ver reporte
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </Card>
  )
}
