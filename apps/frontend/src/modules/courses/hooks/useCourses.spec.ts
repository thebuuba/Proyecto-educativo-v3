import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCourses } from './useCourses'

const mocks = vi.hoisted(() => ({
  appUser: { id: 'user-0', schoolId: 'school-0' },
  getCourseData: vi.fn(),
}))

vi.mock('@/modules/auth/hooks/useAuth', () => ({
  useAuth: () => ({ appUser: mocks.appUser }),
}))

vi.mock('@/modules/courses/services/coursesService', () => ({
  assignSubjectToSection: vi.fn(),
  createGrade: vi.fn(),
  createSection: vi.fn(),
  createSubject: vi.fn(),
  deactivateGrade: vi.fn(),
  deactivateSection: vi.fn(),
  deactivateSectionSubject: vi.fn(),
  getCourseData: mocks.getCourseData,
  updateGrade: vi.fn(),
  updateSection: vi.fn(),
}))

let userSequence = 0

function makeCourseData() {
  return {
    grades: [],
    catalogs: {
      levels: [],
      cycles: [],
      modalities: [],
      subjects: [],
      teachers: [],
    },
    currentSchoolYear: { id: 'year-1', name: '2026-2027' },
  }
}

describe('useCourses cache', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    userSequence += 1
    mocks.appUser = { id: `user-${userSequence}`, schoolId: 'school-1' }
    mocks.getCourseData.mockReset()
  })

  it('reuses course data on remount while its TTL is fresh', async () => {
    const courseData = makeCourseData()
    mocks.getCourseData.mockResolvedValue(courseData)

    const first = renderHook(() => useCourses())
    await waitFor(() => expect(first.result.current.loading).toBe(false))
    first.unmount()

    const second = renderHook(() => useCourses())
    expect(second.result.current.loading).toBe(false)
    expect(second.result.current.currentSchoolYear).toEqual(courseData.currentSchoolYear)
    expect(mocks.getCourseData).toHaveBeenCalledTimes(1)
    second.unmount()
  })

  it('releases loading when the initial request fails', async () => {
    mocks.getCourseData.mockRejectedValue(new Error('Falló el catálogo de cursos'))

    const hook = renderHook(() => useCourses())

    await waitFor(() => expect(hook.result.current.loading).toBe(false))
    expect(hook.result.current.error).toBe('Falló el catálogo de cursos')
    hook.unmount()
  })

  it('refetches after the course cache TTL expires', async () => {
    const now = vi.spyOn(Date, 'now').mockReturnValue(1_000)
    mocks.getCourseData.mockResolvedValue(makeCourseData())

    const first = renderHook(() => useCourses())
    await waitFor(() => expect(first.result.current.loading).toBe(false))
    first.unmount()

    now.mockReturnValue(61_000)
    const second = renderHook(() => useCourses())
    await waitFor(() => expect(second.result.current.loading).toBe(false))

    expect(mocks.getCourseData).toHaveBeenCalledTimes(2)
    second.unmount()
  })
})
