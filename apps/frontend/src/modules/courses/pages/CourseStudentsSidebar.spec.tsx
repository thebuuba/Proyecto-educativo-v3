import { act, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CourseStudentsSidebar } from './CoursesPageBase'
import type { CourseStudent } from '@/modules/students/types'

const mocks = vi.hoisted(() => ({
  getStudentsByCourse: vi.fn(),
  appUser: { id: 'user-1', schoolId: 'school-1' },
}))
vi.mock('@/modules/auth/hooks/useAuth', () => ({ useAuth: () => ({ appUser: mocks.appUser }) }))
vi.mock('@/modules/students/services/studentsService', async (importOriginal) => ({
  ...await importOriginal<typeof import('@/modules/students/services/studentsService')>(),
  getStudentsByCourse: mocks.getStudentsByCourse,
}))

const student: CourseStudent = {
  id: 'student-1', userId: null, enrollmentId: 'enrollment-1', firstName: 'Ana', lastName: 'Pérez',
  fullName: 'Ana Pérez', studentCode: 'TEMP-1', documentId: null, birthDate: '2000-01-01T00:00:00.000Z',
  gender: null, address: null, listNumber: 1, status: 'active',
  createdAt: '2026-09-05T00:00:00.000Z', updatedAt: '2026-09-05T00:00:00.000Z',
}
const props = { courseId: 'course-1', courseName: '1.º A', revision: 0, canEnroll: true, onView: vi.fn(), onAdd: vi.fn() }
let userSequence = 0

describe('tarjeta de estudiantes del curso', () => {
  beforeEach(() => {
    mocks.appUser.id = `user-${++userSequence}`
    mocks.getStudentsByCourse.mockReset().mockResolvedValue([student])
  })

  it('mantiene la lista y el total mientras actualiza después de cerrar el modal', async () => {
    const { rerender } = render(<CourseStudentsSidebar {...props} />)
    await screen.findByText('Ana Pérez')
    let finish!: (rows: CourseStudent[]) => void
    mocks.getStudentsByCourse.mockImplementationOnce(() => new Promise<CourseStudent[]>((resolve) => { finish = resolve }))
    rerender(<CourseStudentsSidebar {...props} revision={1} />)
    expect(screen.getByText('Ana Pérez')).toBeInTheDocument()
    expect(screen.getByText(/1 comparten/)).toBeInTheDocument()
    expect(screen.queryByText('Cargando estudiantes...')).not.toBeInTheDocument()
    await act(async () => finish([student, { ...student, id: 'student-2', fullName: 'Luis Rojas' }]))
    expect(screen.getByText('Luis Rojas')).toBeInTheDocument()
    expect(screen.getByText(/2 comparten/)).toBeInTheDocument()
  })

  it('muestra la última lista inmediatamente al volver y la conserva si falla la actualización', async () => {
    const { unmount } = render(<CourseStudentsSidebar {...props} />)
    await screen.findByText('Ana Pérez')
    unmount()
    let fail!: (error: Error) => void
    mocks.getStudentsByCourse.mockImplementationOnce(() => new Promise<CourseStudent[]>((_, reject) => { fail = reject }))
    render(<CourseStudentsSidebar {...props} />)
    expect(screen.getByText('Ana Pérez')).toBeInTheDocument()
    expect(screen.queryByText('Cargando estudiantes...')).not.toBeInTheDocument()
    await act(async () => fail(new Error('Sin conexión')))
    expect(screen.getByText('Ana Pérez')).toBeInTheDocument()
    expect(screen.getByText(/1 comparten/)).toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it.each(['curso', 'usuario'])('no muestra estudiantes de otro %s', async (change) => {
    const { rerender } = render(<CourseStudentsSidebar {...props} />)
    await screen.findByText('Ana Pérez')
    mocks.getStudentsByCourse.mockImplementationOnce(() => new Promise(() => {}))
    if (change === 'usuario') mocks.appUser.id = 'another-user'
    rerender(<CourseStudentsSidebar {...props} courseId={change === 'curso' ? 'course-2' : props.courseId} />)
    expect(screen.queryByText('Ana Pérez')).not.toBeInTheDocument()
    expect(screen.getByText('Cargando estudiantes...')).toBeInTheDocument()
  })
})
