import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useSchedule } from './useSchedule'

const mocks = vi.hoisted(() => ({
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

describe('useSchedule initial load', () => {
  beforeEach(() => {
    Object.values(mocks).forEach((mock) => mock.mockReset())
    mocks.getCurrentSchoolYear.mockResolvedValue({
      id: 'year-1',
      name: '2026-2027',
      isCurrent: true,
    })
  })

  it('loads independent schedule resources in parallel after resolving the school year', async () => {
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
      expect(mocks.getScheduleEntries).toHaveBeenCalledWith({ schoolYearId: 'year-1' })
    })
    expect(hook.result.current.loading).toBe(true)

    await act(async () => {
      slots.resolve([])
      sections.resolve([])
      teachers.resolve([])
      subjects.resolve([])
      entries.resolve([])
    })
    await waitFor(() => expect(hook.result.current.loading).toBe(false))
    hook.unmount()
  })
})
