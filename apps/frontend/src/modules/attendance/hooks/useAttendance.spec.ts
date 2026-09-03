import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useAttendance } from './useAttendance'

const mocks = vi.hoisted(() => ({
  getAttendanceWorkspace: vi.fn(),
  getClassAttendanceForMonth: vi.fn(),
  getScheduleEntries: vi.fn(),
  getStudentsBySection: vi.fn(),
}))

vi.mock('@/modules/attendance/services/attendanceService', () => ({
  computeAttendanceStats: () => ({ present: 0, absent: 0, late: 0, excused: 0, total: 0 }),
  deleteAttendance: vi.fn(),
  getAttendanceWorkspace: mocks.getAttendanceWorkspace,
  getClassAttendanceForMonth: mocks.getClassAttendanceForMonth,
  getStudentsBySection: mocks.getStudentsBySection,
  upsertAttendance: vi.fn(),
}))

vi.mock('@/modules/schedule/services/scheduleService', () => ({
  getScheduleEntries: mocks.getScheduleEntries,
}))

describe('useAttendance workspace freshness', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  beforeEach(() => {
    vi.restoreAllMocks()
    mocks.getAttendanceWorkspace.mockReset()
    mocks.getClassAttendanceForMonth.mockReset()
    mocks.getScheduleEntries.mockReset()
    mocks.getStudentsBySection.mockReset()
  })

  it('reloads the workspace on remount so enrollment changes are visible', async () => {
    mocks.getAttendanceWorkspace
      .mockResolvedValueOnce({ courses: [], academicPeriodId: 'period-1' })
      .mockResolvedValueOnce({ courses: [], academicPeriodId: 'period-2' })

    const first = renderHook(() => useAttendance())
    await waitFor(() => expect(first.result.current.loading).toBe(false))
    first.unmount()

    const second = renderHook(() => useAttendance())
    await waitFor(() => expect(second.result.current.loading).toBe(false))
    expect(mocks.getAttendanceWorkspace).toHaveBeenCalledTimes(2)
    second.unmount()
  })

  it('releases loading when the initial course request fails', async () => {
    mocks.getAttendanceWorkspace.mockRejectedValue(new Error('Falló el catálogo de asistencia'))

    const hook = renderHook(() => useAttendance())

    await waitFor(() => expect(hook.result.current.loading).toBe(false))
    expect(hook.result.current.error).toBe('Falló el catálogo de asistencia')
    hook.unmount()
  })

  it('requests and uses the exact schedule of the selected subject', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-09-01T12:00:00Z'))

    mocks.getAttendanceWorkspace.mockResolvedValue({ courses: [{
      id: 'section-subject-1',
      gradeId: 'grade-1',
      sectionId: 'section-1',
      subjectId: 'subject-1',
      schoolYearId: 'year-1',
      gradeName: '1.º',
      gradeSequence: 1,
      academicLevelName: 'Secundaria',
      sectionName: 'A',
      area: 'Ciencias de la Naturaleza',
      subjectName: 'Ciencias de la Tierra y del Universo',
      shift: 'Matutina',
      schoolYearName: '2026-2027',
      studentCount: 0,
      label: '1.º A - Ciencias de la Tierra y del Universo',
    }], academicPeriodId: 'period-1' })
    mocks.getStudentsBySection.mockResolvedValue([])
    mocks.getScheduleEntries.mockResolvedValue([
      { dayOfWeek: 2 },
      { dayOfWeek: 3 },
      { dayOfWeek: 5 },
    ])
    mocks.getClassAttendanceForMonth.mockResolvedValue(new Map())

    const hook = renderHook(() => useAttendance())

    await waitFor(() => expect(mocks.getScheduleEntries).toHaveBeenCalledWith({
      sectionId: 'section-1',
      sectionSubjectId: 'section-subject-1',
      schoolYearId: 'year-1',
    }))
    await waitFor(() => expect(hook.result.current.workedDays.map((day) => day.day)).toEqual([
      1, 2, 4,
      8, 9, 11,
      15, 16, 18,
      22, 23, 25,
      29, 30,
    ]))
    hook.unmount()
  })
})
