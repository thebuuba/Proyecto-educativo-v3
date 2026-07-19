/**
 * Componente WeeklyAttendanceCard — Muestra la asistencia semanal
 * mediante una gráfica de línea y área animada.
 */

import type { CSSProperties } from 'react'
import { ArrowRight, Sparkles, TrendingDown, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/Badge'
import type { WeeklyAttendance } from '@/modules/dashboard/types/dashboard'
import { cn } from '@/utils/cn'

type WeeklyAttendanceCardProps = {
  /** Datos de asistencia semanal. */
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

/** Tarjeta de asistencia semanal del dashboard. */
export function WeeklyAttendanceCard({ attendance }: WeeklyAttendanceCardProps) {
  const TrendIcon =
    attendance.trendPercent !== null && attendance.trendPercent < 0 ? TrendingDown : TrendingUp
  const segments = getSegments(attendance)
  const points = segments.flat()
  const hasData = points.length > 0
  const chartDescription = hasData
    ? `Asistencia semanal promedio de ${attendance.average ?? 0} por ciento.`
    : 'Aún no hay registros de asistencia esta semana.'

  return (
    <section className="relative isolate overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-28 -z-10 size-72 rounded-full bg-accent/10 blur-3xl"
      />

      <div className="grid gap-5 lg:grid-cols-[13.5rem_minmax(0,1fr)] lg:items-center">
        <div className="flex flex-wrap items-start justify-between gap-4 lg:flex-col lg:justify-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Sparkles className="size-3.5" aria-hidden="true" />
              </span>
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                Pulso semanal
              </p>
            </div>
            <div className="mt-4 flex items-end gap-2">
              <p className="text-4xl font-bold tracking-tight text-foreground">
                {attendance.average === null ? '—' : `${attendance.average}%`}
              </p>
              <p className="pb-1 text-sm text-muted-foreground">promedio</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 lg:items-start">
            <span className="rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              Esta semana
            </span>
            {attendance.trendPercent !== null && (
              <Badge tone={attendance.trendPercent >= 0 ? 'success' : 'warning'}>
                <TrendIcon className="mr-1 size-3" aria-hidden="true" />
                {attendance.trendPercent > 0 ? '+' : ''}
                {attendance.trendPercent}% vs. anterior
              </Badge>
            )}
          </div>
        </div>

        <div className="attendance-chart-surface relative overflow-hidden rounded-xl border border-white/10 px-2 pb-3 pt-3 shadow-lg sm:px-4">
          {!hasData && (
            <div className="pointer-events-none absolute left-6 top-5 z-10 flex items-center gap-2 text-sky-100">
              <span className="attendance-chart-status-dot size-1.5 rounded-full bg-sky-300" />
              <p className="text-xs font-semibold tracking-wide">Esperando el primer registro</p>
            </div>
          )}

          <svg
            viewBox="0 0 920 170"
            className="h-auto w-full overflow-visible"
            role="img"
            aria-label={chartDescription}
          >
            <defs>
              <linearGradient id="attendance-line-gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7dd3fc" />
                <stop offset="55%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#dbeafe" />
              </linearGradient>
              <linearGradient id="attendance-area-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.38" />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.01" />
              </linearGradient>
              <filter id="attendance-point-glow" x="-100%" y="-100%" width="300%" height="300%">
                <feDropShadow
                  dx="0"
                  dy="2"
                  stdDeviation="4"
                  floodColor="#7dd3fc"
                  floodOpacity="0.45"
                />
              </filter>
            </defs>

            {[CHART_TOP, 86, CHART_BASELINE].map((y) => (
              <line
                key={y}
                x1="60"
                x2="860"
                y1={y}
                y2={y}
                stroke="rgba(255,255,255,0.13)"
                strokeWidth="1"
                strokeDasharray="3 7"
                aria-hidden="true"
              />
            ))}

            {!hasData && (
              <line
                x1="60"
                x2="860"
                y1="86"
                y2="86"
                pathLength="1"
                className="attendance-chart-placeholder"
                stroke="url(#attendance-line-gradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                aria-hidden="true"
              />
            )}

            {!hasData &&
              attendance.days.map((day, index) => (
                <circle
                  key={day.label}
                  className="attendance-chart-empty-point"
                  style={{ '--point-delay': `${index * 70}ms` } as CSSProperties}
                  cx={60 + index * 200}
                  cy="86"
                  r="5"
                  fill="#174a84"
                  stroke="#bae6fd"
                  strokeWidth="2"
                  aria-hidden="true"
                />
              ))}

            {segments.map((segment, segmentIndex) => {
              const linePath = getLinePath(segment)
              const areaPath = getAreaPath(segment)
              return (
                <g key={`${segment[0].index}-${segmentIndex}`}>
                  {areaPath && (
                    <path
                      className="attendance-chart-area"
                      d={areaPath}
                      fill="url(#attendance-area-gradient)"
                    />
                  )}
                  {segment.length > 1 && (
                    <path
                      className="attendance-chart-line"
                      d={linePath}
                      fill="none"
                      stroke="url(#attendance-line-gradient)"
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
                filter="url(#attendance-point-glow)"
              >
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="7"
                  fill="#174a84"
                  stroke="#bae6fd"
                  strokeWidth="3"
                />
                <title>{`${attendance.days[point.index].label}: ${point.value}%`}</title>
              </g>
            ))}
          </svg>

          <div className="grid grid-cols-5 px-1">
            {attendance.days.map((day) => (
              <div key={day.label} className="text-center">
                <p className="text-xs font-bold text-white">
                  {day.value === null ? '—' : `${day.value}%`}
                </p>
                <p
                  className={cn(
                    'mt-1 text-[10px] font-semibold tracking-wide',
                    day.isToday ? 'text-white' : 'text-sky-200/80',
                  )}
                >
                  {day.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <p className="text-xs text-muted-foreground">
          {attendance.activityCount} registros creados
        </p>
        <Link
          to="/reportes"
          className="group inline-flex items-center gap-1.5 text-xs font-semibold text-foreground transition-colors duration-200 hover:text-accent active:translate-y-px"
        >
          Ver reporte
          <ArrowRight
            className="size-3 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </section>
  )
}
