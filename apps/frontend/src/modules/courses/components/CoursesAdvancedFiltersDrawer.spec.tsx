import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import {
  CoursesAdvancedFiltersDrawer,
  type CourseAdvancedFilters,
} from './CoursesAdvancedFiltersDrawer'

const filters: CourseAdvancedFilters = {
  level: 'all',
  cycle: 'all',
  subject: 'all',
  grade: 'all',
  section: 'all',
  showArchived: false,
  onlyWithTeams: false,
  onlyWithoutStudents: false,
  sortBy: 'current',
}

describe('CoursesAdvancedFiltersDrawer', () => {
  it('shows only the teacher-facing filters', () => {
    render(
      <CoursesAdvancedFiltersDrawer
        open
        filters={filters}
        initialFilters={filters}
        levelOptions={[{ value: 'Primaria', label: 'Primaria' }]}
        cycleOptions={[{ value: 'Primer ciclo', label: 'Primer ciclo' }]}
        subjectOptions={[{ value: 'Matemática', label: 'Matemática' }]}
        gradeOptions={[{ value: 'grade-2', label: '2.º' }]}
        sectionOptions={[{ value: 'A', label: 'A' }]}
        resultCount={4}
        onChange={vi.fn()}
        onApply={vi.fn()}
        onReset={vi.fn()}
        onClose={vi.fn()}
      />,
    )

    expect(screen.getByText('Ubicación académica')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Buscar asignatura…')).toBeInTheDocument()
    expect(screen.getByLabelText('Mostrar cursos archivados')).toBeInTheDocument()
    expect(screen.getByLabelText('Mostrar solamente cursos con equipos')).toBeInTheDocument()
    expect(screen.getByLabelText('Mostrar solamente cursos sin estudiantes')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Cantidad de estudiantes' })).not.toBeInTheDocument()
    expect(screen.queryByText('Con docente')).not.toBeInTheDocument()
    expect(screen.queryByText('Sin docente')).not.toBeInTheDocument()
    expect(screen.queryByText('Sin asignatura')).not.toBeInTheDocument()

    const sort = screen.getByLabelText('Ordenar por')
    expect(sort).toHaveTextContent('Orden actual')
    expect(sort).toHaveTextContent('Nombre')
    expect(sort).toHaveTextContent('Grado')
    expect(sort).toHaveTextContent('Cantidad de estudiantes')
    expect(sort).toHaveTextContent('Más recientes')
    expect(sort).toHaveTextContent('Más antiguos')
  })
})
