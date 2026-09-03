import type {
  MonthlyAttendanceMark,
  MonthlyStudentAttendanceRow,
} from '@/modules/attendance/types'
import {
  formatPercentage,
  markLabels,
} from '@/modules/attendance/utils/monthlyAttendance'
import { cn } from '@/utils/cn'

type WorkedDay = {
  day: number
  date: string
  weekday: number
}

type AttendanceGridProps = {
  rows: MonthlyStudentAttendanceRow[]
  workedDays: WorkedDay[]
  saving: boolean
  onToggle: (enrollmentId: string, date: string, currentMark: MonthlyAttendanceMark) => void
}

const markStyles: Record<Exclude<MonthlyAttendanceMark, null>, string> = {
  P: 'bg-success text-success-foreground shadow-sm',
  A: 'bg-destructive text-destructive-foreground shadow-sm',
  E: 'bg-warning text-warning-foreground shadow-sm',
  R: 'bg-muted-foreground text-background shadow-sm',
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat('es-DO', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(`${value}T00:00:00`))
}

export function AttendanceGrid({
  rows,
  workedDays,
  saving,
  onToggle,
}: AttendanceGridProps) {
  if (rows.length === 0) {
    return (
      <div className="flex min-h-[220px] items-center justify-center rounded-3xl bg-card p-6 text-center text-sm text-muted-foreground shadow-sm">
        Este curso todavía no tiene estudiantes matriculados.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-3xl bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b border-border/70 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-extrabold text-foreground">Registro mensual</h2>
            {saving ? (
              <span className="rounded-full bg-primary/10 px-2 py-1 text-[9px] font-extrabold text-primary">
                Guardando…
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Toca una celda para cambiar su estado. Cada clic avanza al siguiente estado.
          </p>
        </div>
        <AttendanceLegend />
      </div>

      <div className="max-w-full overflow-x-auto">
        <table className="w-full min-w-[54rem] border-separate border-spacing-0 text-sm">
          <thead>
            <tr className="bg-muted/20">
              <th rowSpan={2} className="sticky left-0 z-30 min-w-14 border-b border-r border-border/70 bg-card px-3 py-3 text-center text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">
                #
              </th>
              <th rowSpan={2} className="sticky left-14 z-30 min-w-[14rem] border-b border-r border-border/70 bg-card px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">
                Estudiante
              </th>
              <th colSpan={Math.max(workedDays.length, 1)} className="border-b border-border/70 px-2 py-3 text-center text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">
                Fechas de clase
              </th>
              <th rowSpan={2} className="sticky right-14 z-30 w-14 border-b border-l border-border/70 bg-card px-2 py-3 text-center text-[10px] font-extrabold uppercase text-muted-foreground">
                P
              </th>
              <th rowSpan={2} className="sticky right-0 z-30 w-16 border-b border-l border-border/70 bg-card px-2 py-3 text-center text-[10px] font-extrabold uppercase text-muted-foreground">
                %
              </th>
            </tr>
            <tr className="bg-muted/10">
              {workedDays.length === 0 ? (
                <th className="border-b border-border/70 px-3 py-3 text-center text-xs font-semibold text-muted-foreground">
                  Sin fechas programadas
                </th>
              ) : workedDays.map((workedDay) => (
                <th
                  key={workedDay.date}
                  title={formatShortDate(workedDay.date)}
                  className="min-w-12 border-b border-border/70 px-1 py-2 text-center text-xs font-black text-foreground"
                >
                  {workedDay.day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.enrollmentId} className="group transition-colors hover:bg-primary/[0.018]">
                <td className="sticky left-0 z-20 border-b border-r border-border/60 bg-card px-3 py-3 text-center text-xs font-semibold text-muted-foreground group-hover:bg-[color-mix(in_srgb,var(--palette-blue)_2%,var(--palette-white))]">
                  {row.listNumber}
                </td>
                <td className="sticky left-14 z-20 border-b border-r border-border/60 bg-card px-5 py-3 font-semibold text-foreground group-hover:bg-[color-mix(in_srgb,var(--palette-blue)_2%,var(--palette-white))]">
                  {row.lastName}, {row.firstName}
                </td>
                {workedDays.length === 0 ? (
                  <td className="border-b border-border/60 px-3 py-3 text-center text-xs text-muted-foreground">
                    —
                  </td>
                ) : workedDays.map((workedDay) => {
                  const cell = row.cells[workedDay.date]
                  const mark = cell?.mark ?? null
                  return (
                    <td key={workedDay.date} className="border-b border-border/60 px-1 py-2.5 text-center">
                      <button
                        type="button"
                        disabled={saving}
                        title={`${formatShortDate(workedDay.date)} · ${mark ? markLabels[mark] : 'Sin registrar'}`}
                        className={cn(
                          'mx-auto flex size-9 items-center justify-center rounded-xl text-xs font-extrabold transition hover:-translate-y-0.5 hover:ring-2 hover:ring-ring/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60',
                          mark ? markStyles[mark] : 'bg-muted/80 text-muted-foreground hover:bg-muted',
                        )}
                        onClick={() => onToggle(row.enrollmentId, workedDay.date, mark)}
                      >
                        {mark ?? ''}
                      </button>
                    </td>
                  )
                })}
                <td className="sticky right-14 z-10 border-b border-l border-border/60 bg-card px-2 py-3 text-center font-black text-foreground group-hover:bg-[color-mix(in_srgb,var(--palette-blue)_2%,var(--palette-white))]">
                  {row.presentTotal}
                </td>
                <td className="sticky right-0 z-10 border-b border-l border-border/60 bg-card px-2 py-3 text-center font-black text-primary group-hover:bg-[color-mix(in_srgb,var(--palette-blue)_2%,var(--palette-white))]">
                  {formatPercentage(row.attendancePercentage)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AttendanceLegend() {
  const items: Array<{ mark: MonthlyAttendanceMark; label: string }> = [
    { mark: 'P', label: 'Presente' },
    { mark: 'A', label: 'Ausente' },
    { mark: 'E', label: 'Excusa' },
    { mark: 'R', label: 'Retirado' },
    { mark: null, label: 'Sin registro' },
  ]

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] font-semibold text-muted-foreground">
      {items.map((item) => (
        <span key={item.mark ?? 'empty'} className="inline-flex items-center gap-1.5">
          <span className={cn('flex size-5 items-center justify-center rounded-lg text-[9px] font-extrabold', item.mark ? markStyles[item.mark] : 'bg-muted text-muted-foreground')}>
            {item.mark ?? ''}
          </span>
          {item.label}
        </span>
      ))}
    </div>
  )
}
