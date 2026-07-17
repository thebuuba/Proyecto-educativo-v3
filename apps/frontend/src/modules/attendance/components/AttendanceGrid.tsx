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
      <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
        Este curso todavia no tiene estudiantes matriculados.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b border-border bg-muted/25 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs text-muted-foreground">
            Las columnas corresponden a las fechas de clase. Haz clic en una celda para cambiar el estado.
          </p>
        </div>
        <AttendanceLegend />
      </div>

      <div className="max-w-full overflow-x-auto">
        <table className="min-w-[54rem] border-separate border-spacing-0 text-sm">
          <thead>
            <tr>
              <th rowSpan={2} className="sticky left-0 z-30 min-w-14 border-b border-r border-border bg-card px-3 py-3 text-center text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                #
              </th>
              <th rowSpan={2} className="sticky left-14 z-30 min-w-[14rem] border-b border-r border-border bg-card px-5 py-3 text-left text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Estudiante
              </th>
              <th colSpan={Math.max(workedDays.length, 1)} className="border-b border-border bg-card px-2 py-3 text-center text-[11px] font-black uppercase tracking-[0.14em] text-muted-foreground">
                Fechas de clase
              </th>
              <th rowSpan={2} className="sticky right-14 z-30 w-14 border-b border-l border-border bg-card px-2 py-3 text-center text-xs font-bold uppercase text-muted-foreground">
                T
              </th>
              <th rowSpan={2} className="sticky right-0 z-30 w-14 border-b border-l border-border bg-card px-2 py-3 text-center text-xs font-bold uppercase text-muted-foreground">
                %
              </th>
            </tr>
            <tr>
              {workedDays.length === 0 ? (
                <th
                  className="border-b border-border bg-muted/25 px-3 py-3 text-center text-xs font-semibold text-muted-foreground"
                >
                  Sin fechas programadas
                </th>
              ) : workedDays.map((workedDay) => (
                <th
                  key={workedDay.date}
                  title={formatShortDate(workedDay.date)}
                  className="min-w-12 border-b border-border bg-card px-1 py-2 text-center text-xs font-black text-primary"
                >
                  {workedDay.day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.enrollmentId} className="group">
                <td className="sticky left-0 z-20 border-b border-r border-border bg-card px-3 py-3 text-center font-semibold text-muted-foreground group-hover:bg-muted/15">
                  {row.listNumber}
                </td>
                <td className="sticky left-14 z-20 border-b border-r border-border bg-card px-5 py-3 font-semibold text-foreground group-hover:bg-muted/15">
                  {row.lastName}, {row.firstName}
                </td>
                {workedDays.length === 0 ? (
                  <td className="border-b border-border bg-muted/15 px-3 py-3 text-center text-xs text-muted-foreground">
                    —
                  </td>
                ) : workedDays.map((workedDay) => {
                  const day = workedDay
                  const cell = row.cells[day.date]
                  const mark = cell?.mark ?? null
                  return (
                    <td key={day.date} className="border-b border-border px-1 py-2 text-center">
                      <button
                        type="button"
                        disabled={saving}
                        title={`${formatShortDate(day.date)} · ${mark ? markLabels[mark] : 'Sin registrar'}`}
                        className={cn(
                          'mx-auto flex size-8 items-center justify-center rounded-xl text-xs font-extrabold transition hover:ring-2 hover:ring-ring/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60',
                          mark ? markStyles[mark] : 'bg-muted text-muted-foreground hover:bg-muted/80',
                        )}
                        onClick={() => onToggle(row.enrollmentId, day.date, mark)}
                      >
                        {mark ?? ''}
                      </button>
                    </td>
                  )
                })}
                <td className="sticky right-14 z-10 border-b border-l border-border bg-card px-2 py-3 text-center font-bold text-primary group-hover:bg-muted/15">
                  {row.presentTotal}
                </td>
                <td className="sticky right-0 z-10 border-b border-l border-border bg-card px-2 py-3 text-center font-bold text-primary group-hover:bg-muted/15">
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
    { mark: null, label: 'Vacio' },
  ]

  return (
    <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-muted-foreground">
      {items.map((item) => (
        <span key={item.mark ?? 'empty'} className="inline-flex items-center gap-1.5">
          <span className={cn('flex size-6 items-center justify-center rounded-full text-[11px] font-extrabold', item.mark ? markStyles[item.mark] : 'bg-muted text-muted-foreground')}>
            {item.mark ?? ''}
          </span>
          {item.label}
        </span>
      ))}
    </div>
  )
}
