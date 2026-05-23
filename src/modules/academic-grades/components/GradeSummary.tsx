import { Card, CardContent } from '@/components/ui/Card'
import type { GradeSummaryStats } from '@/modules/academic-grades/types'
import { cn } from '@/utils/cn'

type GradeSummaryProps = {
  stats: GradeSummaryStats
  loading: boolean
}

export function GradeSummary({ stats, loading }: GradeSummaryProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardContent className="p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-muted-foreground">
            Promedio
          </p>
          <div className={cn('mt-3', loading && 'animate-pulse')}>
            {loading ? (
              <div className="h-8 w-16 rounded-lg bg-muted" />
            ) : (
              <p className="text-3xl font-bold leading-none text-primary">
                {stats.average !== null ? stats.average.toFixed(1) : '—'}
              </p>
            )}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">sobre 10</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-muted-foreground">
            Nota más alta
          </p>
          <div className={cn('mt-3', loading && 'animate-pulse')}>
            {loading ? (
              <div className="h-8 w-16 rounded-lg bg-muted" />
            ) : (
              <p className="text-3xl font-bold leading-none text-success">
                {stats.highest !== null ? stats.highest.toFixed(1) : '—'}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-muted-foreground">
            Nota más baja
          </p>
          <div className={cn('mt-3', loading && 'animate-pulse')}>
            {loading ? (
              <div className="h-8 w-16 rounded-lg bg-muted" />
            ) : (
              <p className="text-3xl font-bold leading-none text-destructive">
                {stats.lowest !== null ? stats.lowest.toFixed(1) : '—'}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-muted-foreground">
            Aprobados
          </p>
          <div className={cn('mt-3', loading && 'animate-pulse')}>
            {loading ? (
              <div className="h-8 w-16 rounded-lg bg-muted" />
            ) : (
              <p className="text-3xl font-bold leading-none text-success">
                {stats.passed}
              </p>
            )}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {stats.total > 0
              ? `${Math.round((stats.passed / stats.total) * 100)}%`
              : '—'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-muted-foreground">
            Reprobados
          </p>
          <div className={cn('mt-3', loading && 'animate-pulse')}>
            {loading ? (
              <div className="h-8 w-16 rounded-lg bg-muted" />
            ) : (
              <p className="text-3xl font-bold leading-none text-destructive">
                {stats.failed}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
