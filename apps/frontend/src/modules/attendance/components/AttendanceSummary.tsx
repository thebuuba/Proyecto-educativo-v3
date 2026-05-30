import { Card, CardContent } from '@/components/ui/Card'
import type { AttendanceStats } from '@/modules/attendance/types'
import { cn } from '@/utils/cn'

type AttendanceSummaryProps = {
  stats: AttendanceStats
  loading: boolean
}

export function AttendanceSummary({ stats, loading }: AttendanceSummaryProps) {
  const percentage = stats.total > 0
    ? Math.round(((stats.present + stats.late) / stats.total) * 100)
    : null

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardContent className="p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-muted-foreground">
            Total
          </p>
          <div className={cn('mt-3', loading && 'animate-pulse')}>
            {loading ? (
              <div className="h-8 w-16 rounded-lg bg-muted" />
            ) : (
              <p className="text-3xl font-bold leading-none text-primary">
                {stats.total}
              </p>
            )}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">estudiantes</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-muted-foreground">
            Presentes
          </p>
          <div className={cn('mt-3', loading && 'animate-pulse')}>
            {loading ? (
              <div className="h-8 w-16 rounded-lg bg-muted" />
            ) : (
              <p className="text-3xl font-bold leading-none text-success">
                {stats.present}
              </p>
            )}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {percentage !== null ? `${percentage}%` : '—'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-muted-foreground">
            Ausentes
          </p>
          <div className={cn('mt-3', loading && 'animate-pulse')}>
            {loading ? (
              <div className="h-8 w-16 rounded-lg bg-muted" />
            ) : (
              <p className="text-3xl font-bold leading-none text-destructive">
                {stats.absent}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-muted-foreground">
            Tardes
          </p>
          <div className={cn('mt-3', loading && 'animate-pulse')}>
            {loading ? (
              <div className="h-8 w-16 rounded-lg bg-muted" />
            ) : (
              <p className="text-3xl font-bold leading-none text-warning">
                {stats.late}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-muted-foreground">
            Justificados
          </p>
          <div className={cn('mt-3', loading && 'animate-pulse')}>
            {loading ? (
              <div className="h-8 w-16 rounded-lg bg-muted" />
            ) : (
              <p className="text-3xl font-bold leading-none text-accent">
                {stats.excused}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
