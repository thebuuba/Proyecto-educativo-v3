import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { StudentsPage } from './StudentsPage'

const mocks = vi.hoisted(() => ({
  appUser: { id: 'user-0', schoolId: 'school-0' },
  getEnrollmentCourses: vi.fn(),
}))

vi.mock('@/modules/auth/hooks/useAuth', () => ({
  useAuth: () => ({
    appUser: mocks.appUser,
    hasPermission: () => false,
    hasRole: () => false,
  }),
}))

vi.mock('@/modules/students/services/studentsService', () => ({
  createStudentInCourse: vi.fn(),
  getEnrollmentCourses: mocks.getEnrollmentCourses,
  getStudentsByCourse: vi.fn(),
  importStudentsInCourse: vi.fn(),
  previewCourseStudentImport: vi.fn(),
  transferStudentToCourse: vi.fn(),
  updateStudent: vi.fn(),
  withdrawStudentFromCourse: vi.fn(),
}))

let userSequence = 0

function renderPage() {
  return render(
    <MemoryRouter>
      <StudentsPage />
    </MemoryRouter>,
  )
}

describe('StudentsPage course cache', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    userSequence += 1
    mocks.appUser = { id: `user-${userSequence}`, schoolId: 'school-1' }
    mocks.getEnrollmentCourses.mockReset()
  })

  it('hydrates enrollment courses from cache before refetching on remount', async () => {
    mocks.getEnrollmentCourses.mockResolvedValue([])

    const first = renderPage()
    await screen.findByText('Primero debes crear un curso')
    first.unmount()

    const second = renderPage()
    expect(screen.queryByText('Cargando cursos...')).not.toBeInTheDocument()
    await waitFor(() => expect(mocks.getEnrollmentCourses).toHaveBeenCalledTimes(1))
    second.unmount()
  })

  it('refetches enrollment courses after the cache TTL expires', async () => {
    const now = vi.spyOn(Date, 'now').mockReturnValue(1_000)
    mocks.getEnrollmentCourses.mockResolvedValue([])

    const first = renderPage()
    await screen.findByText('Primero debes crear un curso')
    first.unmount()

    now.mockReturnValue(61_000)
    const second = renderPage()
    await screen.findByText('Primero debes crear un curso')

    expect(mocks.getEnrollmentCourses).toHaveBeenCalledTimes(2)
    second.unmount()
  })
})
