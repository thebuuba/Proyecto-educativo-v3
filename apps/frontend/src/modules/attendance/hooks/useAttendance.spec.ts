import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAttendance } from './useAttendance'

const mocks = vi.hoisted(() => ({
  appUser: { id: 'user-0', schoolId: 'school-0' },
  getAttendanceCourses: vi.fn(),
  getCurrentAcademicPeriodId: vi.fn(),
}))

vi.mock('@/modules/auth/hooks/useAuth', () => ({
  useAuth: () => ({ appUser: mocks.appUser }),
}))

vi.mock('@/modules/attendance/services/attendanceService', () => ({
  computeAttendanceStats: () => ({ present: 0, absent: 0, late: 0, excused: 0, total: 0 }),
  deleteAttendance: vi.fn(),
  getAttendanceCourses: mocks.getAttendanceCourses,
  getClassAttendanceForMonth: vi.fn(),
  getCurrentAcademicPeriodId: mocks.getCurrentAcademicPeriodId,
  getStudentsBySection: vi.fn(),
  upsertAttendance: vi.fn(),
}))

vi.mock('@/modules/schedule/services/scheduleService', () => ({
  getScheduleEntries: vi.fn(),
}))

let userSequence = 0

describe('useAttendance course cache', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    userSequence += 1
    mocks.appUser = { id: `user-${userSequence}`, schoolId: 'school-1' }
    mocks.getAttendanceCourses.mockReset()
    mocks.getCurrentAcademicPeriodId.mockReset()
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
})
