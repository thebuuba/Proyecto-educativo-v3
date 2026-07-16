import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useSchedule } from './useSchedule'

const mocks = vi.hoisted(() => ({
  appUser: { id: 'user-0', schoolId: 'school-0' },
  getCurrentSchoolYear: vi.fn(),
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

vi.mock('@/services/schoolYearService', () => ({
  getCurrentSchoolYear: mocks.getCurrentSchoolYear,
}))

vi.mock('@/modules/schedule/services/scheduleService', () => ({
  createScheduleEntry: mocks.createScheduleEntry,
  createTimeSlot: mocks.createTimeSlot,
  deleteScheduleEntry: mocks.deleteScheduleEntry,
  deleteTimeSlot: mocks.deleteTimeSlot,
  getScheduleEntries: mocks.getScheduleEntries,
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
    mocks.getCurrentSchoolYear.mockResolvedValue({
      id: 'year-1',
      name: '2026-2027',
      isCurrent: true,
    })
  })

  it('loads independent resources in parallel and entries after the group resolves', async () => {
    const slots = deferred<never[]>()
    const sections = deferred<never[]>()
    const teachers = deferred<never[]>()
    const subjects = deferred<never[]>()
    const entries = deferred<never[]>()
    mocks.getTimeSlots.mockReturnValue(slots.promise)
    mocks.getSections.mockReturnValue(sections.promise)
    mocks.getTeachers.mockReturnValue(teachers.promise)
    mocks.getSubjects.mockReturnValue(subjects.promise)
    mocks.getScheduleEntries.mockReturnValue(entries.promise)

    const hook = renderHook(() => useSchedule())

    await waitFor(() => {
      expect(mocks.getTimeSlots).toHaveBeenCalledTimes(1)
      expect(mocks.getSections).toHaveBeenCalledTimes(1)
      expect(mocks.getTeachers).toHaveBeenCalledTimes(1)
      expect(mocks.getSubjects).toHaveBeenCalledTimes(1)
    })
    expect(mocks.getScheduleEntries).not.toHaveBeenCalled()
    expect(hook.result.current.loading).toBe(true)

    await act(async () => {
      slots.resolve([])
      sections.resolve([])
      teachers.resolve([])
      subjects.resolve([])
    })
    await waitFor(() => {
      expect(mocks.getScheduleEntries).toHaveBeenCalledWith({ schoolYearId: 'year-1' })
    })

    await act(async () => {
      entries.resolve([])
    })
    await waitFor(() => expect(hook.result.current.loading).toBe(false))
    hook.unmount()
  })

  it('reuses the complete snapshot on remount while its TTL is fresh', async () => {
    mocks.getTimeSlots.mockResolvedValue([])
    mocks.getSections.mockResolvedValue([])
    mocks.getTeachers.mockResolvedValue([])
    mocks.getSubjects.mockResolvedValue([])
    mocks.getScheduleEntries.mockResolvedValue([])

    const first = renderHook(() => useSchedule())
    await waitFor(() => expect(first.result.current.loading).toBe(false))
    first.unmount()

    const second = renderHook(() => useSchedule())
    expect(second.result.current.loading).toBe(false)
    expect(mocks.getCurrentSchoolYear).toHaveBeenCalledTimes(1)
    expect(mocks.getTimeSlots).toHaveBeenCalledTimes(1)
    expect(mocks.getScheduleEntries).toHaveBeenCalledTimes(1)
    second.unmount()
  })
})
