import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { usePlanning } from './usePlanning'

const mocks = vi.hoisted(() => ({
  appUser: { id: 'user-0', schoolId: 'school-0' },
  getCurrentSchoolYear: vi.fn(),
  getAcademicPeriods: vi.fn(),
  getTeacherSectionSubjects: vi.fn(),
  getCompetencies: vi.fn(),
  getPlanningEntries: vi.fn(),
}))

vi.mock('@/modules/auth/hooks/useAuth', () => ({
  useAuth: () => ({ appUser: mocks.appUser }),
}))

vi.mock('@/services/schoolYearService', () => ({
  getCurrentSchoolYear: mocks.getCurrentSchoolYear,
}))

vi.mock('@/modules/planning/services/planningService', () => ({
  archivePlanningEntry: vi.fn(),
  createPlanningEntry: vi.fn(),
  deletePlanningEntry: vi.fn(),
  duplicatePlanningEntry: vi.fn(),
  generateAndCreatePlanningEntry: vi.fn(),
  getAcademicPeriods: mocks.getAcademicPeriods,
  getCompetencies: mocks.getCompetencies,
  getPlanningEntries: mocks.getPlanningEntries,
  getTeacherSectionSubjects: mocks.getTeacherSectionSubjects,
  updatePlanningEntry: vi.fn(),
}))

let userSequence = 0

describe('usePlanning initial load', () => {
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
    mocks.getTeacherSectionSubjects.mockResolvedValue([])
    mocks.getCompetencies.mockResolvedValue([])
  })

  it('releases loading and exposes an error when initialization fails', async () => {
    mocks.getAcademicPeriods.mockRejectedValue(new Error('Falló la carga de períodos'))

    const hook = renderHook(() => usePlanning())

    await waitFor(() => expect(hook.result.current.loading).toBe(false))
    expect(hook.result.current.error).toBe('Falló la carga de períodos')
    expect(mocks.getPlanningEntries).not.toHaveBeenCalled()
    hook.unmount()
  })

  it('reuses the complete snapshot on remount while its TTL is fresh', async () => {
    mocks.getAcademicPeriods.mockResolvedValue([{ id: 'period-1' }])
    mocks.getPlanningEntries.mockResolvedValue([])

    const first = renderHook(() => usePlanning())
    await waitFor(() => expect(first.result.current.loading).toBe(false))
    first.unmount()

    const second = renderHook(() => usePlanning())
    expect(second.result.current.loading).toBe(false)
    expect(second.result.current.activePeriodId).toBe('period-1')
    expect(mocks.getCurrentSchoolYear).toHaveBeenCalledTimes(1)
    expect(mocks.getAcademicPeriods).toHaveBeenCalledTimes(1)
    expect(mocks.getPlanningEntries).toHaveBeenCalledTimes(1)
    second.unmount()
  })
})
