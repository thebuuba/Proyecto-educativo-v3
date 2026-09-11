import type { AttendanceStatus } from '@/types/domain'
import type {
  MonthlyAttendanceCell,
  MonthlyAttendanceMark,
  MonthlyAttendanceStats,
  MonthlyStudentAttendanceRow,
  StudentAttendanceRow,
} from '@/modules/attendance/types'

export const schoolYearMonths = [
  { value: '08', label: 'Agosto' },
  { value: '09', label: 'Septiembre' },
  { value: '10', label: 'Octubre' },
  { value: '11', label: 'Noviembre' },
  { value: '12', label: 'Diciembre' },
  { value: '01', label: 'Enero' },
  { value: '02', label: 'Febrero' },
  { value: '03', label: 'Marzo' },
  { value: '04', label: 'Abril' },
  { value: '05', label: 'Mayo' },
]

export const markCycle: MonthlyAttendanceMark[] = [null, 'P', 'A', 'E', 'T']

export const markLabels: Record<Exclude<MonthlyAttendanceMark, null>, string> = {
  P: 'Presente',
  A: 'Ausente',
  E: 'Excusa',
  T: 'Tardanza',
  R: 'Tardanza',
}

export function getInitialSchoolMonth() {
  const month = String(new Date().getMonth() + 1).padStart(2, '0')
  return schoolYearMonths.some((item) => item.value === month) ? month : '09'
}

export function getCalendarYearForSchoolMonth(month: string, schoolYearName?: string) {
  const startYear = Number(schoolYearName?.match(/\d{4}/)?.[0] ?? new Date().getFullYear())
  return Number(month) >= 8 ? startYear : startYear + 1
}

export function formatDateKey(year: number, month: string, day: number) {
  return `${year}-${month}-${String(day).padStart(2, '0')}`
}

export function getWorkedDaysForMonth(input: {
  year: number
  month: string
  classWeekdays: number[]
}) {
  const monthIndex = Number(input.month) - 1
  const lastDay = new Date(input.year, monthIndex + 1, 0).getDate()
  const weekdays = input.classWeekdays
  const days: Array<{ day: number; date: string; weekday: number }> = []

  for (let day = 1; day <= lastDay; day++) {
    const date = new Date(input.year, monthIndex, day)
    const weekday = date.getDay() === 0 ? 7 : date.getDay()
    if (weekdays.includes(weekday)) {
      days.push({ day, date: formatDateKey(input.year, input.month, day), weekday })
    }
  }

  return days
}

export function statusToMark(status: AttendanceStatus | null, notes?: string | null): MonthlyAttendanceMark {
  const normalizedStatus = typeof status === 'string' ? status.toLowerCase() : status
  if (normalizedStatus === 'present') return 'P'
  if (normalizedStatus === 'absent') return 'A'
  if (normalizedStatus === 'late') return 'T'
  if (normalizedStatus === 'excused') return notes === 'retired' ? 'T' : 'E'
  return null
}

export function markToStatus(mark: MonthlyAttendanceMark): AttendanceStatus | null {
  if (mark === 'P') return 'present'
  if (mark === 'A') return 'absent'
  if (mark === 'E') return 'excused'
  if (mark === 'T' || mark === 'R') return 'late'
  return null
}

export function getNextMark(current: MonthlyAttendanceMark) {
  const normalizedCurrent = current === 'R' ? 'T' : current
  const index = markCycle.indexOf(normalizedCurrent)
  return markCycle[(index + 1) % markCycle.length]
}

export function sortStudentsForRoster(students: StudentAttendanceRow[]) {
  return [...students].sort((first, second) => {
    const firstNumber = first.listNumber ?? Number.MAX_SAFE_INTEGER
    const secondNumber = second.listNumber ?? Number.MAX_SAFE_INTEGER
    if (firstNumber !== secondNumber) return firstNumber - secondNumber
    const lastName = first.lastName.localeCompare(second.lastName, 'es')
    if (lastName !== 0) return lastName
    return first.firstName.localeCompare(second.firstName, 'es')
  })
}

export function attendancePercentageFromMarks(marks: MonthlyAttendanceMark[]) {
  const recordedMarks = marks.filter((mark): mark is Exclude<MonthlyAttendanceMark, null> => Boolean(mark))
  if (!recordedMarks.length) return null

  const absences = recordedMarks.filter((mark) => mark === 'A').length
  const tardanzas = recordedMarks.filter((mark) => mark === 'T' || mark === 'R').length
  const equivalentAbsences = absences + Math.floor(tardanzas / 3)
  const attendedClasses = Math.max(0, recordedMarks.length - equivalentAbsences)

  return (attendedClasses / recordedMarks.length) * 100
}

export function buildMonthlyRows(input: {
  students: StudentAttendanceRow[]
  workedDays: Array<{ date: string }>
  attendanceByDate: Map<string, Map<string, MonthlyAttendanceCell>>
}) {
  const recordedDates = new Set(
    Array.from(input.attendanceByDate.entries())
      .filter(([, attendance]) => attendance.size > 0)
      .map(([date]) => date),
  )

  return sortStudentsForRoster(input.students).map<MonthlyStudentAttendanceRow>((student, index) => {
    const cells: Record<string, MonthlyAttendanceCell> = {}
    const recordedMarks: MonthlyAttendanceMark[] = []
    let presentTotal = 0

    input.workedDays.forEach((day) => {
      const cell = input.attendanceByDate.get(day.date)?.get(student.enrollmentId) ?? {
        attendanceId: null,
        status: null,
        mark: null,
      }
      cells[day.date] = cell
      if (recordedDates.has(day.date) && cell.mark) recordedMarks.push(cell.mark)
      if (cell.mark === 'P' || cell.mark === 'E') presentTotal += 1
    })

    return {
      ...student,
      listNumber: student.listNumber ?? index + 1,
      cells,
      presentTotal,
      attendancePercentage: attendancePercentageFromMarks(recordedMarks),
    }
  })
}

export function computeMonthlyStats(rows: MonthlyStudentAttendanceRow[], workedDays: number): MonthlyAttendanceStats {
  let absences = 0
  let excuses = 0
  let attendanceSum = 0
  let rowsWithAttendance = 0

  rows.forEach((row) => {
    if (row.attendancePercentage !== null) {
      attendanceSum += row.attendancePercentage
      rowsWithAttendance += 1
    }
    Object.values(row.cells).forEach((cell) => {
      if (cell.mark === 'A') absences += 1
      if (cell.mark === 'E') excuses += 1
    })
  })

  return {
    totalStudents: rows.length,
    workedDays,
    averageAttendance: rowsWithAttendance > 0 ? attendanceSum / rowsWithAttendance : null,
    absences,
    excuses,
  }
}

export function formatPercentage(value: number | null) {
  if (value === null) return '-'
  return `${Number.isInteger(value) ? value : Number(value.toFixed(1))}%`
}
