/**
 * Componente WeeklyAttendanceCard — Muestra la asistencia semanal o una
 * invitación compacta para crear el primer registro.
 */

import type { CSSProperties } from 'react'
import { ArrowRight, CalendarCheck2, TrendingDown, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/Badge'
import type { WeeklyAttendance } from '@/modules/dashboard/types/dashboard'
import { cn } from '@/utils/cn'

type WeeklyAttendanceCardProps = {
  attendance: WeeklyAttendance
}

type ChartPoint = {
  x: number
  y: number
  value: number
  index: number
}

const CHART_BASELINE = 140
const CHART_TOP = 32

function getSegments(attendance: WeeklyAttendance): ChartPoint[][] {
  const segments: ChartPoint[][] = []
  let current: ChartPoint[] = []

  attendance.days.forEach((day, index) => {
    if (day.value === null) {
      if (current.length > 0) segments.push(current)
      current = []
      return
    }

    const value = Math.max(0, Math.min(100, day.value))
    current.push({
      x: 60 + index * 200,
      y: CHART_BASELINE - (value / 100) * (CHART_BASELINE - CHART_TOP),
      value,
      index,
    })
  })

  if (current.length > 0) segments.push(current)
  return segments
}

function getLinePath(points: ChartPoint[]) {
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`

  return points.slice(1).reduce((path, point, index) => {
    const previous = points[index]
    const midpoint = (previous.x + point.x) / 2
    return `${path} C ${midpoint} ${previous.y}, ${midpoint} ${point.y}, ${point.x} ${point.y}`
  }, `M ${points[0].x} ${points[0].y}`)
}

function getAreaPath(points: ChartPoint[]) {
  if (points.length < 2) return ''
  return `${getLinePath(points)} L ${points.at(-1)?.x} ${CHART_BASELINE} L ${points[0].x} ${CHART_BASELINE} Z`
}

export function WeeklyAttendanceCard({ attendance }: WeeklyAttendanceCardProps) {
  const segments = getSegments(attendance)
  const points = segments.flat()
  const hasData = points.length > 0

  if (!hasData) {
    return (
      <section className="dashboard-warm-shadow flex min-h-32 flex-col gap-5 rounded-[1.375rem] bg-card p-5 sm:flex-row sm:items-center sm:px-6">
        <span
          className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-card text-accent shadow-[inset_0_0_0_1px_var(--border)]"
          role="img"
          aria-label="Aún no hay registros de asistencia esta semana."
        >
          <CalendarCheck2 className="size-5" aria-hidden="true" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-accent">Pulso semanal</p>
          <h3 className="mt-1 text-lg font-extrabold tracking-tight text-primary">
            Aún no has registrado asistencia esta semana
          </h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Tu resumen aparecerá aquí después del primer pase de lista.
          </p>
          <p className="mt-1 text-xs font-medium text-muted-foreground">
            {attendance.activityCount} registros creados
          </p>
        </div>

        <Link
          to="/asistencia"
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground transition-[background-color,transform] duration-200 hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/25 active:translate-y-px"
        >
          Registrar asistencia
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </section>
    )
  }

  const TrendIcon = attendance.trendPercent !== null && attendance.trendPercent < 0
    ? TrendingDown
    : TrendingUp

  return (
    <section className="dashboard-warm-shadow overflow-hidden rounded-3xl border border-border bg-card p-5 sm:p-6">
      <div className="grid gap-5 lg:grid-cols-[12rem_minmax(0,1fr)] lg:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-xl bg-muted text-accent">
              <CalendarCheck2 className="size-4" aria-hidden="true" />
            </span>
            <p className="text-xs font-semibold text-accent">Pulso semanal</p>
          </div>

          <div className="mt-4 flex items-end gap-2">
            <p className="text-4xl font-extrabold tracking-[-0.04em] text-primary tabular-nums">
              {attendance.average}%
            </p>
            <p className="pb-1 text-sm text-muted-foreground">promedio</p>
          </div>

          {attendance.trendPercent !== null && (
            <Badge tone={attendance.trendPercent >= 0 ? 'success' : 'warning'} className="mt-3">
              <TrendIcon className="mr-1 size-3" aria-hidden="true" />
              {attendance.trendPercent > 0 ? '+' : ''}
              {attendance.trendPercent}% vs. anterior
            </Badge>
          )}
        </div>

        <div className="rounded-2xl bg-muted px-2 pb-3 pt-2 sm:px-4">
          <svg
            viewBox="0 0 920 170"
            className="h-auto w-full overflow-visible"
            role="img"
            aria-label={`Asistencia semanal promedio de ${attendance.average ?? 0} por ciento.`}
          >
            <defs>
              <linearGradient id="attendance-area-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.24" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.01" />
              </linearGradient>
            </defs>

            {[CHART_TOP, 86, CHART_BASELINE].map((y) => (
              <line
                key={y}
                x1="60"
                x2="860"
                y1={y}
                y2={y}
                stroke="var(--border)"
                strokeWidth="1"
                strokeDasharray="3 7"
                aria-hidden="true"
              />
            ))}

            {segments.map((segment, segmentIndex) => {
              const linePath = getLinePath(segment)
              const areaPath = getAreaPath(segment)
              return (
                <g key={`${segment[0].index}-${segmentIndex}`}>
                  {areaPath && (
                    <path className="attendance-chart-area" d={areaPath} fill="url(#attendance-area-gradient)" />
                  )}
                  {segment.length > 1 && (
                    <path
                      className="attendance-chart-line"
                      d={linePath}
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      pathLength="1"
                    />
                  )}
                </g>
              )
            })}

            {points.map((point) => (
              <g
                key={point.index}
                className="attendance-chart-point"
                style={{ '--point-delay': `${180 + point.index * 55}ms` } as CSSProperties}
              >
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="6"
                  fill="var(--card)"
                  stroke="var(--accent)"
                  strokeWidth="3"
                />
                <title>{`${attendance.days[point.index].label}: ${point.value}%`}</title>
              </g>
            ))}
          </svg>

          <div className="grid grid-cols-5 px-1">
            {attendance.days.map((day) => (
              <div key={day.label} className="text-center">
                <p className="text-xs font-bold text-primary tabular-nums">{day.value}%</p>
                <p className={cn('mt-1 text-[10px] font-semibold tracking-wide', day.isToday ? 'text-accent' : 'text-muted-foreground')}>
                  {day.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <p className="text-xs text-muted-foreground">{attendance.activityCount} registros creados</p>
        <Link
          to="/reportes"
          className="group inline-flex items-center gap-1.5 rounded-md text-xs font-semibold text-primary transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20"
        >
          Ver reporte
          <ArrowRight className="size-3 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
