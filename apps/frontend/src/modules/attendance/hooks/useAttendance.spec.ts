import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAttendance } from './useAttendance'

const mocks = vi.hoisted(() => ({
  appUser: { id: 'user-0', schoolId: 'school-0' },
  getAttendanceCourses: vi.fn(),
  getClassAttendanceForMonth: vi.fn(),
  getCurrentAcademicPeriodId: vi.fn(),
  getScheduleEntries: vi.fn(),
  getStudentsBySection: vi.fn(),
}))

vi.mock('@/modules/auth/hooks/useAuth', () => ({
  useAuth: () => ({ appUser: mocks.appUser }),
}))

vi.mock('@/modules/attendance/services/attendanceService', () => ({
  computeAttendanceStats: () => ({ present: 0, absent: 0, late: 0, excused: 0, total: 0 }),
  deleteAttendance: vi.fn(),
  getAttendanceCourses: mocks.getAttendanceCourses,
  getClassAttendanceForMonth: mocks.getClassAttendanceForMonth,
  getCurrentAcademicPeriodId: mocks.getCurrentAcademicPeriodId,
  getStudentsBySection: mocks.getStudentsBySection,
  upsertAttendance: vi.fn(),
}))

vi.mock('@/modules/schedule/services/scheduleService', () => ({
  getScheduleEntries: mocks.getScheduleEntries,
}))

let userSequence = 0

describe('useAttendance course cache', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    userSequence += 1
    mocks.appUser = { id: `user-${userSequence}`, schoolId: 'school-1' }
    mocks.getAttendanceCourses.mockReset()
    mocks.getClassAttendanceForMonth.mockReset()
    mocks.getCurrentAcademicPeriodId.mockReset()
    mocks.getScheduleEntries.mockReset()
    mocks.getStudentsBySection.mockReset()
  })

  it('reuses courses and the period on remount while the TTL is fresh', async () => {
    mocks.getAttendanceCourses.mockResolvedValue([])
    mocks.getCurrentAcademicPeriodId.mockResolvedValue('period-1')

    const first = renderHook(() => useAttendance())
    await waitFor(() => expect(first.result.current.loading).toBe(false))
    first.unmount()

    const second = renderHook(() => useAttendance())
    expect(second.result.current.loading).toBe(false)
    expect(second.result.current.courses).toEqual([])
    expect(mocks.getAttendanceCourses).toHaveBeenCalledTimes(1)
    expect(mocks.getCurrentAcademicPeriodId).toHaveBeenCalledTimes(1)
    second.unmount()
  })

  it('releases loading when the initial course request fails', async () => {
    mocks.getAttendanceCourses.mockRejectedValue(new Error('Falló el catálogo de asistencia'))
    mocks.getCurrentAcademicPeriodId.mockResolvedValue('period-1')

    const hook = renderHook(() => useAttendance())

    await waitFor(() => expect(hook.result.current.loading).toBe(false))
    expect(hook.result.current.error).toBe('Falló el catálogo de asistencia')
    hook.unmount()
  })

  it('refetches courses and period after the cache TTL expires', async () => {
    const now = vi.spyOn(Date, 'now').mockReturnValue(1_000)
    mocks.getAttendanceCourses.mockResolvedValue([])
    mocks.getCurrentAcademicPeriodId.mockResolvedValue('period-1')

    const first = renderHook(() => useAttendance())
    await waitFor(() => expect(first.result.current.loading).toBe(false))
    first.unmount()

    now.mockReturnValue(61_000)
    const second = renderHook(() => useAttendance())
    await waitFor(() => expect(second.result.current.loading).toBe(false))

    expect(mocks.getAttendanceCourses).toHaveBeenCalledTimes(2)
    expect(mocks.getCurrentAcademicPeriodId).toHaveBeenCalledTimes(2)
    second.unmount()
  })

  it('requests and uses the exact schedule of the selected subject', async () => {
    mocks.getAttendanceCourses.mockResolvedValue([{
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
    }])
    mocks.getCurrentAcademicPeriodId.mockResolvedValue('period-1')
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
