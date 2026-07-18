import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { usePlanning } from './usePlanning'

const mocks = vi.hoisted(() => ({
  appUser: { id: 'user-0', schoolId: 'school-0' },
  getPlanningWorkspace: vi.fn(),
  getAcademicPeriods: vi.fn(),
  getTeacherSectionSubjects: vi.fn(),
  getCompetencies: vi.fn(),
  getPlanningEntries: vi.fn(),
}))

vi.mock('@/modules/auth/hooks/useAuth', () => ({
  useAuth: () => ({ appUser: mocks.appUser }),
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
  getPlanningWorkspace: mocks.getPlanningWorkspace,
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
  })

  it('releases loading and exposes an error when initialization fails', async () => {
    mocks.getPlanningWorkspace.mockRejectedValue(new Error('Falló la carga de períodos'))

    const hook = renderHook(() => usePlanning())

    await waitFor(() => expect(hook.result.current.loading).toBe(false))
    expect(hook.result.current.error).toBe('Falló la carga de períodos')
    expect(mocks.getPlanningEntries).not.toHaveBeenCalled()
    hook.unmount()
  })

  it('reuses the complete snapshot on remount while its TTL is fresh', async () => {
    mocks.getPlanningWorkspace.mockResolvedValue({
      currentSchoolYear: { id: 'year-1', name: '2026-2027', isCurrent: true },
      periods: [{ id: 'period-1' }], activePeriodId: 'period-1', entries: [],
      sectionSubjects: [], competencies: [],
    })

    const first = renderHook(() => usePlanning())
    await waitFor(() => expect(first.result.current.loading).toBe(false))
    first.unmount()

    const second = renderHook(() => usePlanning())
    expect(second.result.current.loading).toBe(false)
    expect(second.result.current.activePeriodId).toBe('period-1')
    expect(mocks.getPlanningWorkspace).toHaveBeenCalledTimes(1)
    second.unmount()
  })
})
