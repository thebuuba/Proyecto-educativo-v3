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
  subjectName?: string
  courseName?: string
  monthName?: string
  saving: boolean
  onToggle: (enrollmentId: string, date: string, currentMark: MonthlyAttendanceMark) => void
}

const markClasses: Record<Exclude<MonthlyAttendanceMark, null>, string> = {
  P: 'text-success',
  A: 'text-destructive',
  E: 'text-accent-foreground',
  R: 'text-warning-foreground',
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
  subjectName = 'Registro de asistencia',
  courseName = '',
  monthName = '',
  saving,
  onToggle,
}: AttendanceGridProps) {
  if (rows.length === 0) {
    return (
      <div className="flex min-h-[220px] items-center justify-center rounded-lg border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
        Este curso todavía no tiene estudiantes matriculados.
      </div>
    )
  }

  if (workedDays.length === 0) {
    return (
      <div className="flex min-h-[220px] items-center justify-center rounded-lg border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
        No hay días trabajados registrados para este curso en el mes seleccionado.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="border-b border-border bg-muted/35 px-5 py-4">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">
          Registro mensual por días trabajados
        </p>
        <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-xl font-bold text-primary">{subjectName}</h3>
            <p className="text-sm text-muted-foreground">{courseName}</p>
          </div>
          <p className="text-sm font-bold text-foreground">{monthName}</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0 text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 z-20 w-14 border-b border-r border-border bg-muted px-3 py-3 text-center text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                #
              </th>
              <th className="sticky left-14 z-20 min-w-[14rem] border-b border-r border-border bg-muted px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Estudiante
              </th>
              <th
                colSpan={workedDays.length + 2}
                className="border-b border-border bg-muted px-3 py-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground"
              >
                Días trabajados
              </th>
            </tr>
            <tr>
              <th className="sticky left-0 z-20 w-14 border-b border-r border-border bg-muted px-3 py-2 text-center text-xs font-bold text-muted-foreground">
                No.
              </th>
              <th className="sticky left-14 z-20 min-w-[14rem] border-b border-r border-border bg-muted px-4 py-2 text-left text-xs font-bold text-muted-foreground">
                Nombre
              </th>
              {workedDays.map((day, index) => (
                <th
                  key={day.date}
                  title={formatShortDate(day.date)}
                  className="w-12 border-b border-r border-border bg-muted/55 px-2 py-2 text-center text-xs font-bold text-primary"
                >
                  D{index + 1}
                  <span className="block text-[10px] font-medium text-muted-foreground">
                    {day.day}
                  </span>
                </th>
              ))}
              <th className="w-12 border-b border-r border-border bg-muted/55 px-2 py-2 text-center text-xs font-bold uppercase text-muted-foreground">
                T
              </th>
              <th className="w-16 border-b border-border bg-muted/55 px-2 py-2 text-center text-xs font-bold uppercase text-muted-foreground">
                %
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.enrollmentId} className="group hover:bg-muted/20">
                <td className="sticky left-0 z-10 border-b border-r border-border bg-card px-3 py-2 text-center font-semibold text-muted-foreground group-hover:bg-muted/20">
                  {row.listNumber}
                </td>
                <td className="sticky left-14 z-10 border-b border-r border-border bg-card px-4 py-2 font-medium text-foreground group-hover:bg-muted/20">
                  {row.lastName}, {row.firstName}
                </td>
                {workedDays.map((day) => {
                  const cell = row.cells[day.date]
                  const mark = cell?.mark ?? null
                  return (
                    <td key={day.date} className="border-b border-r border-border p-1 text-center">
                      <button
                        type="button"
                        disabled={saving}
                        title={`${formatShortDate(day.date)} · ${mark ? markLabels[mark] : 'Sin registrar'}`}
                        className={cn(
                          'mx-auto flex size-8 items-center justify-center rounded-md border border-transparent text-xs font-bold transition hover:border-accent hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-60',
                          mark && markClasses[mark],
                        )}
                        onClick={() => onToggle(row.enrollmentId, day.date, mark)}
                      >
                        {mark ?? ''}
                      </button>
                    </td>
                  )
                })}
                <td className="border-b border-r border-border px-2 py-2 text-center font-bold text-primary">
                  {row.presentTotal}
                </td>
                <td className="border-b border-border px-2 py-2 text-center font-bold text-primary">
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
