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

  if (workedDays.length === 0) {
    return (
      <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
        No hay dias trabajados registrados para este curso en el mes seleccionado.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b border-border bg-muted/25 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs text-muted-foreground">
            Haz clic en una celda para cambiar el estado.
          </p>
        </div>
        <AttendanceLegend />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0 text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 z-20 min-w-[15rem] border-b border-r border-border bg-card px-5 py-3 text-left text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Estudiante
              </th>
              {workedDays.map((day) => (
                <th
                  key={day.date}
                  title={formatShortDate(day.date)}
                  className="w-12 border-b border-border bg-card px-1 py-3 text-center text-xs font-bold text-muted-foreground"
                >
                  {day.day}
                </th>
              ))}
              <th className="w-16 border-b border-border bg-card px-2 py-3 text-center text-xs font-bold uppercase text-muted-foreground">
                Total
              </th>
              <th className="w-14 border-b border-border bg-card px-2 py-3 text-center text-xs font-bold uppercase text-muted-foreground">
                %
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.enrollmentId} className="group">
                <td className="sticky left-0 z-10 border-b border-r border-border bg-card px-5 py-3 font-semibold text-foreground group-hover:bg-muted/15">
                  {row.lastName}, {row.firstName}
                </td>
                {workedDays.map((day) => {
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
                <td className="border-b border-border px-2 py-3 text-center font-bold text-primary">
                  {row.presentTotal}
                </td>
                <td className="border-b border-border px-2 py-3 text-center font-bold text-primary">
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
  const items: Array<{ mark: Exclude<MonthlyAttendanceMark, null>; label: string }> = [
    { mark: 'P', label: 'Presente' },
    { mark: 'A', label: 'Ausente' },
    { mark: 'E', label: 'Excusa' },
    { mark: 'R', label: 'Retirado' },
  ]

  return (
    <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-muted-foreground">
      {items.map((item) => (
        <span key={item.mark} className="inline-flex items-center gap-1.5">
          <span className={cn('flex size-6 items-center justify-center rounded-full text-[11px] font-extrabold', markStyles[item.mark])}>
            {item.mark}
          </span>
          {item.label}
        </span>
      ))}
    </div>
  )
}
