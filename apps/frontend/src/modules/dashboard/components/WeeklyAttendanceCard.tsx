import { ArrowRight, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import type { WeeklyAttendance } from '@/modules/dashboard/types/dashboard'
import { cn } from '@/utils/cn'

type WeeklyAttendanceCardProps = {
  attendance: WeeklyAttendance
}

function getMaxValue(days: WeeklyAttendance['days']) {
  return Math.max(...days.map((d) => d.value ?? 0), 1)
}

export function WeeklyAttendanceCard({ attendance }: WeeklyAttendanceCardProps) {
  const maxValue = getMaxValue(attendance.days)

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm" style={{ boxShadow: '0 1px 2px rgba(26,31,58,0.04)' }}>
      <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground">Pulso semanal</p>
      <p className="mt-2 text-3xl font-bold text-foreground">
        {attendance.average === null ? '—' : `${attendance.average}%`}
      </p>
      <p className="text-sm text-muted-foreground">Asistencia promedio</p>

      {attendance.trendPercent !== null && (
        <Badge tone={attendance.trendPercent >= 0 ? 'success' : 'warning'} className="mt-2">
          <TrendingUp className="mr-1 size-3" />
          {attendance.trendPercent > 0 ? '+' : ''}
          {attendance.trendPercent}%
        </Badge>
      )}

      <div className="mt-8 grid grid-cols-5 gap-2">
        {attendance.days.map((day) => (
          <div key={day.label} className="min-w-0">
            <div className="flex h-24 items-end rounded-lg bg-muted/50 p-1">
              <div
                className={cn(
                  'w-full rounded-md',
                  day.isToday ? 'bg-accent' : 'bg-primary/25',
                )}
                style={{ height: `${((day.value ?? 0) / maxValue) * 100}%` }}
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

      <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
        <p className="text-xs text-muted-foreground">{attendance.activityCount} registros creados</p>
        <Link
          to="/reportes"
          className="text-xs font-semibold text-foreground hover:text-accent transition-colors"
        >
          Ver reporte <ArrowRight className="inline size-3" />
        </Link>
      </div>
    </div>
  )
}
