import { describe, expect, it } from 'vitest'

import type { MonthlyAttendanceCell, StudentAttendanceRow } from '@/modules/attendance/types'
import {
  buildMonthlyRows,
  computeMonthlyStats,
  getWorkedDaysForMonth,
} from './monthlyAttendance'

const student: StudentAttendanceRow = {
  enrollmentId: 'enrollment-1',
  studentId: 'student-1',
  studentCode: '001',
  listNumber: 1,
  firstName: 'Ana',
  lastName: 'Martínez',
  status: null,
  attendanceId: null,
}

describe('monthlyAttendance', () => {
  it('does not invent weekdays when a subject has no configured schedule', () => {
    expect(getWorkedDaysForMonth({
      year: 2026,
      month: '09',
      classWeekdays: [],
    })).toEqual([])
  })

  it('shows only the dates dictated by the subject schedule', () => {
    const days = getWorkedDaysForMonth({
      year: 2026,
      month: '09',
      classWeekdays: [2, 3, 5],
    })

    expect(days.map((day) => day.day)).toEqual([
      1, 2, 4,
      8, 9, 11,
      15, 16, 18,
      22, 23, 25,
      29, 30,
    ])
  })

  it('returns every scheduled class date without an artificial monthly limit', () => {
    const days = getWorkedDaysForMonth({
      year: 2026,
      month: '07',
      classWeekdays: [1, 2, 3, 4, 5],
    })

    expect(days).toHaveLength(23)
    expect(days.at(-1)?.date).toBe('2026-07-31')
  })

  it('calculates attendance using only dates with saved records', () => {
    const presentCell: MonthlyAttendanceCell = {
      attendanceId: 'attendance-1',
      status: 'present',
      mark: 'P',
    }
    const attendanceByDate = new Map([
      ['2026-09-01', new Map([['enrollment-1', presentCell]])],
      ['2026-09-02', new Map<string, MonthlyAttendanceCell>()],
      ['2026-09-03', new Map<string, MonthlyAttendanceCell>()],
    ])
    const rows = buildMonthlyRows({
      students: [student],
      workedDays: [
        { date: '2026-09-01' },
        { date: '2026-09-02' },
        { date: '2026-09-03' },
      ],
      attendanceByDate,
    })
    const stats = computeMonthlyStats(rows, 1)

    expect(rows[0].attendancePercentage).toBe(100)
    expect(stats.workedDays).toBe(1)
    expect(stats.averageAttendance).toBe(100)
  })
})
