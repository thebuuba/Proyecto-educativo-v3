import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CoursesPage } from './CoursesPage'

const mocks = vi.hoisted(() => ({
  refetch: vi.fn(),
  getStudentsByCourse: vi.fn(),
  createStudentInCourse: vi.fn(),
}))

vi.mock('@/modules/auth/hooks/useAuth', () => ({ useAuth: () => ({ hasRole: () => true }) }))
vi.mock('@/modules/courses/hooks/useCourses', () => ({
  useCourses: () => ({
    grades: [{ id: 'grade-1', name: '1.º', status: 'active', academicLevelName: 'Secundario',
      academicCycleName: 'Primer Ciclo', sections: [{ id: 'course-1', name: 'A', status: 'active',
        studentCount: 0, teamCount: 0, assignments: [] }] }],
    catalogs: { levels: [], cycles: [], modalities: [], subjects: [], teachers: [] },
    currentSchoolYear: { id: 'year-1', name: '2026-2027' },
    loading: false, error: null, refetch: mocks.refetch,
  }),
}))
vi.mock('@/modules/students/services/studentsService', async (importOriginal) => ({
  ...await importOriginal<typeof import('@/modules/students/services/studentsService')>(),
  getStudentsByCourse: mocks.getStudentsByCourse,
  createStudentInCourse: mocks.createStudentInCourse,
}))

function renderCourse() {
  render(<MemoryRouter initialEntries={['/cursos?courseId=course-1']}><CoursesPage /></MemoryRouter>)
}

describe('matrícula desde la vista del curso', () => {
  beforeEach(() => {
    mocks.refetch.mockReset().mockResolvedValue(undefined)
    mocks.getStudentsByCourse.mockReset().mockResolvedValue([])
    mocks.createStudentInCourse.mockReset().mockResolvedValue({ id: 'student-1', fullName: 'Ana Pérez' })
  })

  it.each(['Agregar estudiantes', 'Agregar'])('abre %s sobre el curso y reserva el panel para Ver todos', async (triggerName) => {
    const user = userEvent.setup()
    renderCourse()
    const trigger = await screen.findByRole('button', { name: triggerName })
    await user.click(trigger)
    const dialog = screen.getByRole('dialog', { name: 'Agregar estudiantes' })
    expect(screen.getByRole('heading', { name: 'Asignaturas' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Estudiantes de 1.º A' })).not.toBeInTheDocument()
    await user.click(within(dialog).getByRole('button', { name: 'Cancelar' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(trigger).toHaveFocus()
    await user.click(screen.getByRole('button', { name: 'Ver todos' }))
    expect(await screen.findByRole('heading', { name: 'Estudiantes de 1.º A' })).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('actualiza el resumen después de guardar y permanece en el curso', async () => {
    const user = userEvent.setup()
    renderCourse()
    await user.click(await screen.findByRole('button', { name: 'Agregar estudiantes' }))
    const dialog = screen.getByRole('dialog')
    await user.type(within(dialog).getByLabelText('Nombre(s) *'), 'Ana')
    await user.type(within(dialog).getByLabelText('Apellido(s) *'), 'Pérez')
    mocks.getStudentsByCourse.mockResolvedValue([{ id: 'student-1', firstName: 'Ana', lastName: 'Pérez', fullName: 'Ana Pérez', studentCode: 'TEMP-1' }])
    await user.click(within(dialog).getByRole('button', { name: 'Agregar estudiante' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(screen.getByRole('heading', { name: 'Asignaturas' })).toBeInTheDocument()
    expect(await screen.findByText('Ana Pérez')).toBeInTheDocument()
    expect(mocks.refetch).toHaveBeenCalledWith(false)
  })
})
