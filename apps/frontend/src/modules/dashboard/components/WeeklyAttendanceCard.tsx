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

const CHART_BASELINE = 150
const CHART_TOP = 18

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
      x: 32 + index * 214,
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
      <section className="dashboard-warm-shadow flex min-h-32 flex-col gap-5 rounded-[1.375rem] bg-card p-5 text-card-foreground sm:flex-row sm:items-center sm:px-6">
        <span
          className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary"
          role="img"
          aria-label="Aún no hay registros de asistencia esta semana."
        >
          <CalendarCheck2 className="size-5" aria-hidden="true" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-primary">Asistencia semanal</p>
          <h3 className="mt-1 text-lg font-extrabold tracking-tight text-foreground">
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
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors duration-200 hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/25"
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
    <section className="dashboard-warm-shadow overflow-hidden rounded-3xl bg-card p-5 text-card-foreground sm:p-6">
      <div className="grid gap-5 sm:grid-cols-[9.5rem_minmax(0,1fr)] sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CalendarCheck2 className="size-4" aria-hidden="true" />
            </span>
            <p className="text-xs font-semibold text-primary">Asistencia semanal</p>
          </div>

          <div className="mt-4 flex items-end gap-2">
            <p className="text-3xl font-extrabold tracking-[-0.04em] text-primary tabular-nums sm:text-[34px]">
              {attendance.average}%
            </p>
            <p className="pb-1 text-xs text-muted-foreground">promedio</p>
          </div>

          {attendance.trendPercent !== null && (
            <Badge tone={attendance.trendPercent >= 0 ? 'success' : 'warning'} className="mt-3">
              <TrendIcon className="mr-1 size-3" aria-hidden="true" />
              {attendance.trendPercent > 0 ? '+' : ''}
              {attendance.trendPercent}% vs. anterior
            </Badge>
          )}
        </div>

        <div className="min-w-0 overflow-hidden rounded-2xl bg-card px-1 pb-1 pt-1">
          <svg
            viewBox="0 0 920 178"
            className="h-auto w-full overflow-visible"
            role="img"
            aria-label={`Asistencia semanal promedio de ${attendance.average ?? 0} por ciento.`}
          >
            <defs>
              <linearGradient id="attendance-area-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.18" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.035" />
              </linearGradient>
            </defs>

            {segments.map((segment, segmentIndex) => {
              const linePath = getLinePath(segment)
              const areaPath = getAreaPath(segment)
              return (
                <g key={`${segment[0].index}-${segmentIndex}`}>
                  {areaPath && (
                    <path
                      className="weekly-attendance-area"
                      d={areaPath}
                      fill="url(#attendance-area-gradient)"
                    />
                  )}
                  {segment.length > 1 && (
                    <path
                      className="weekly-attendance-line"
                      d={linePath}
                      fill="none"
                      stroke="var(--primary)"
                      strokeWidth="2.75"
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
                className="weekly-attendance-point"
                style={{ '--point-delay': `${220 + point.index * 65}ms` } as CSSProperties}
              >
                <circle cx={point.x} cy={point.y} r="4.2" fill="var(--primary)" />
                <title>{`${attendance.days[point.index].label}: ${point.value}%`}</title>
              </g>
            ))}
          </svg>

          <div className="grid grid-cols-5 gap-1 px-1 pb-1">
            {attendance.days.map((day) => (
              <div key={day.label} className="min-w-0 text-center">
                <p
                  className={cn(
                    'text-xs font-medium tracking-wide',
                    day.isToday ? 'text-primary' : 'text-muted-foreground',
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
        <p className="text-xs text-muted-foreground">{attendance.activityCount} registros creados</p>
        <Link
          to="/reportes"
          className="group inline-flex items-center gap-1.5 rounded-md text-xs font-semibold text-primary transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20"
        >
          Ver reporte
          <ArrowRight className="size-3 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>

      <style>
        {`
          .weekly-attendance-line {
            stroke-dasharray: 1;
            stroke-dashoffset: 1;
            animation: weekly-attendance-draw 900ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
          }

          .weekly-attendance-area {
            opacity: 0;
            transform: translateY(8px);
            transform-origin: center bottom;
            animation: weekly-attendance-fill 650ms ease-out 120ms forwards;
          }

          .weekly-attendance-point {
            opacity: 0;
            transform: translateY(5px) scale(0.85);
            transform-box: fill-box;
            transform-origin: center;
            animation: weekly-attendance-point 360ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
            animation-delay: var(--point-delay);
          }

          @keyframes weekly-attendance-draw {
            to { stroke-dashoffset: 0; }
          }

          @keyframes weekly-attendance-fill {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes weekly-attendance-point {
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .weekly-attendance-line,
            .weekly-attendance-area,
            .weekly-attendance-point {
              animation: none !important;
              opacity: 1 !important;
              transform: none !important;
              stroke-dashoffset: 0 !important;
            }
          }
        `}
      </style>
    </section>
  )
}
