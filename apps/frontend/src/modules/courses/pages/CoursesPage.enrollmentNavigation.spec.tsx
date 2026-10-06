import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import { CoursesPage } from './CoursesPage'

const mocks = vi.hoisted(() => ({
  getStudentsByCourse: vi.fn().mockResolvedValue([]),
  courseData: {
    grades: [{ id: 'grade-1', name: '1.º', status: 'active', order: 1,
      academicLevelName: 'Secundaria', academicCycleName: 'Primer ciclo',
      sections: [{ id: 'section-1', name: 'A', status: 'active', studentCount: 0, assignments: [] }],
    }],
    catalogs: {}, currentSchoolYear: { id: 'year-1', name: '2026-2027' },
    loading: false, error: null, refetch: vi.fn(),
  },
}))

vi.mock('@/modules/auth/hooks/useAuth', () => ({ useAuth: () => ({ hasRole: () => true }) }))
vi.mock('@/modules/courses/hooks/useCourses', () => ({ useCourses: () => mocks.courseData }))
vi.mock('@/modules/students/services/studentsService', async (original) => ({
  ...await original<typeof import('@/modules/students/services/studentsService')>(),
  getStudentsByCourse: mocks.getStudentsByCourse,
}))

function Location() {
  const location = useLocation()
  return <output aria-label="Ruta actual">{location.pathname}{location.search}</output>
}

describe('matrícula desde el curso', () => {
  it.each([
    ['new', 'Uno por uno'],
    ['import', 'Agregar varios'],
  ])('abre la acción %s en el curso y permite volver a sus asignaturas', async (action, tab) => {
    const user = userEvent.setup()
    render(<MemoryRouter initialEntries={[`/cursos?courseId=section-1&studentView=students&studentAction=${action}`]}>
      <CoursesPage /><Location />
    </MemoryRouter>)
    expect(await screen.findByRole('heading', { name: 'Agregar estudiantes' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: tab })).toHaveAttribute('aria-selected', 'true')
    expect(mocks.getStudentsByCourse).toHaveBeenCalledWith('section-1')
    expect(screen.getByLabelText('Ruta actual')).toHaveTextContent('/cursos?courseId=section-1')
    await user.click(screen.getByRole('button', { name: /cerrar/i }))
    await user.click(screen.getByRole('button', { name: /volver/i }))
    expect(screen.queryByRole('heading', { name: 'Agregar estudiantes' })).not.toBeInTheDocument()
    expect(screen.getByLabelText('Ruta actual')).toHaveTextContent('/cursos?courseId=section-1')
  })
})
