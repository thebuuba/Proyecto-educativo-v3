import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCourses } from './useCourses'
import type { CourseData } from '@/modules/courses/types'

const mocks = vi.hoisted(() => ({
  appUser: { id: 'user-0', schoolId: 'school-0' },
  getCourseData: vi.fn(),
  deleteSectionSubjectPermanently: vi.fn(),
  createGrade: vi.fn(),
  createSection: vi.fn(),
  createSubject: vi.fn(),
  assignSubjectToSection: vi.fn(),
}))

vi.mock('@/modules/auth/hooks/useAuth', () => ({
  useAuth: () => ({ appUser: mocks.appUser }),
}))

vi.mock('@/modules/courses/services/coursesService', () => ({
  assignSubjectToSection: mocks.assignSubjectToSection,
  createGrade: mocks.createGrade,
  createSection: mocks.createSection,
  createSubject: mocks.createSubject,
  deactivateGrade: vi.fn(),
  deactivateSection: vi.fn(),
  deactivateSectionSubject: vi.fn(),
  getCourseData: mocks.getCourseData,
  deleteSectionSubjectPermanently: mocks.deleteSectionSubjectPermanently,
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
    mocks.deleteSectionSubjectPermanently.mockReset()
    mocks.createGrade.mockReset()
    mocks.createSection.mockReset()
    mocks.createSubject.mockReset()
    mocks.assignSubjectToSection.mockReset()
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

  it('removes a deleted archived assignment without a manual reload', async () => {
    const archivedCourse = { ...makeCourseData(), grades: [{ id: 'grade-1', sections: [{ id: 'section-1', assignments: [{ id: 'archived-1' }] }] }] } as unknown as CourseData
    mocks.getCourseData.mockResolvedValueOnce(archivedCourse).mockResolvedValueOnce(makeCourseData())
    mocks.deleteSectionSubjectPermanently.mockResolvedValue(undefined)
    const hook = renderHook(() => useCourses())
    await waitFor(() => expect(hook.result.current.grades).toHaveLength(1))
    await act(async () => {
      await hook.result.current.permanentlyDeleteSubjectAssignment('archived-1', 'ELIMINAR')
    })
    expect(hook.result.current.grades).toEqual([])
    expect(mocks.deleteSectionSubjectPermanently).toHaveBeenCalledWith('archived-1', 'ELIMINAR')
    expect(mocks.getCourseData).toHaveBeenCalledTimes(2)
    hook.unmount()
  })

  it('keeps the archived assignment visible when the API rejects deletion', async () => {
    const archivedCourse = { ...makeCourseData(), grades: [{ id: 'grade-1', sections: [{ id: 'section-1', assignments: [{ id: 'archived-1' }] }] }] } as unknown as CourseData
    mocks.getCourseData.mockResolvedValue(archivedCourse)
    mocks.deleteSectionSubjectPermanently.mockRejectedValue(new Error('Sin permiso'))
    const hook = renderHook(() => useCourses())
    await waitFor(() => expect(hook.result.current.grades).toHaveLength(1))
    await expect(hook.result.current.permanentlyDeleteSubjectAssignment('archived-1', 'ELIMINAR')).rejects.toThrow('Sin permiso')
    expect(hook.result.current.grades[0].sections[0].assignments).toHaveLength(1)
    hook.unmount()
  })

  it('no confunde con archivado un grado nuevo cuyo endpoint devuelve ACTIVE', async () => {
    mocks.getCourseData.mockResolvedValue(makeCourseData())
    mocks.createGrade.mockResolvedValue({
      id: 'grade-4', name: '4.º', status: 'ACTIVE', academicLevelId: 'primary', academicCycleId: 'primary-second',
    })
    mocks.createSection.mockResolvedValue({ id: 'section-a', gradeId: 'grade-4', name: 'A', assignments: [] })
    mocks.createSubject.mockResolvedValue({ id: 'subject-custom' })
    const hook = renderHook(() => useCourses())
    await waitFor(() => expect(hook.result.current.loading).toBe(false))

    await act(async () => {
      await hook.result.current.createTeacherAssignment({
        academicLevelId: 'primary', academicLevelName: 'Primario', academicCycleId: 'primary-second',
        academicCycleName: 'Segundo ciclo', gradeName: '4.º', gradeSequence: 4, sectionName: 'A',
        subjectCode: 'CUSTOM-sexualidad-humana', subjectName: 'Sexualidad Humana',
      })
    })

    expect(mocks.createSection).toHaveBeenCalledWith({ gradeId: 'grade-4', name: 'A' })
    expect(mocks.assignSubjectToSection).toHaveBeenCalledWith(expect.objectContaining({ gradeId: 'grade-4', sectionId: 'section-a' }))
    hook.unmount()
  })
})
