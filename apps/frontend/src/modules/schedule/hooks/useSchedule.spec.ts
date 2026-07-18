import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { ScheduleWorkspace } from '@/modules/schedule/services/scheduleService'
import { useSchedule } from './useSchedule'

const mocks = vi.hoisted(() => ({
  appUser: { id: 'user-0', schoolId: 'school-0' },
  getScheduleWorkspace: vi.fn(),
  getTimeSlots: vi.fn(),
  getSections: vi.fn(),
  getTeachers: vi.fn(),
  getSubjects: vi.fn(),
  getScheduleEntries: vi.fn(),
  createScheduleEntry: vi.fn(),
  createTimeSlot: vi.fn(),
  deleteScheduleEntry: vi.fn(),
  deleteTimeSlot: vi.fn(),
  updateScheduleEntry: vi.fn(),
  updateTimeSlot: vi.fn(),
}))

vi.mock('@/modules/auth/hooks/useAuth', () => ({
  useAuth: () => ({ appUser: mocks.appUser }),
}))

vi.mock('@/modules/schedule/services/scheduleService', () => ({
  createScheduleEntry: mocks.createScheduleEntry,
  createTimeSlot: mocks.createTimeSlot,
  deleteScheduleEntry: mocks.deleteScheduleEntry,
  deleteTimeSlot: mocks.deleteTimeSlot,
  getScheduleEntries: mocks.getScheduleEntries,
  getScheduleWorkspace: mocks.getScheduleWorkspace,
  getSections: mocks.getSections,
  getSubjects: mocks.getSubjects,
  getTeachers: mocks.getTeachers,
  getTimeSlots: mocks.getTimeSlots,
  updateScheduleEntry: mocks.updateScheduleEntry,
  updateTimeSlot: mocks.updateTimeSlot,
}))

function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((next) => {
    resolve = next
  })
  return { promise, resolve }
}

let userSequence = 0

describe('useSchedule initial load', () => {
  beforeEach(() => {
    Object.entries(mocks).forEach(([key, mock]) => {
      if (key !== 'appUser') (mock as ReturnType<typeof vi.fn>).mockReset()
    })
    userSequence += 1
    mocks.appUser = { id: `user-${userSequence}`, schoolId: 'school-1' }
  })

  it('loads the initial schedule through one workspace request', async () => {
    const workspace = deferred<ScheduleWorkspace>()
    mocks.getScheduleWorkspace.mockReturnValue(workspace.promise)

    const hook = renderHook(() => useSchedule())

    await waitFor(() => expect(mocks.getScheduleWorkspace).toHaveBeenCalledTimes(1))
    expect(hook.result.current.loading).toBe(true)

    await act(async () => {
      workspace.resolve({
        currentSchoolYear: { id: 'year-1', name: '2026-2027', isCurrent: true },
        timeSlots: [], sections: [], teachers: [], subjects: [], entries: [],
      })
    })
    await waitFor(() => expect(hook.result.current.loading).toBe(false))
    expect(hook.result.current.schoolYearId).toBe('year-1')
    hook.unmount()
  })

  it('reuses the complete snapshot on remount while its TTL is fresh', async () => {
    mocks.getScheduleWorkspace.mockResolvedValue({
      currentSchoolYear: { id: 'year-1', name: '2026-2027', isCurrent: true },
      timeSlots: [], sections: [], teachers: [], subjects: [], entries: [],
    })

    const first = renderHook(() => useSchedule())
    await waitFor(() => expect(first.result.current.loading).toBe(false))
    first.unmount()

    const second = renderHook(() => useSchedule())
    expect(second.result.current.loading).toBe(false)
    expect(mocks.getScheduleWorkspace).toHaveBeenCalledTimes(1)
    second.unmount()
  })
})
