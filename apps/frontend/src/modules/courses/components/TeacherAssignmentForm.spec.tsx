import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { TeacherAssignmentForm } from './TeacherAssignmentForm'
import type { CourseCatalogs } from '@/modules/courses/types'

const catalogs: CourseCatalogs = {
  levels: [],
  cycles: [],
  modalities: [],
  teachers: [],
  subjects: [
    { id: 'lengua', code: 'PRI-LEN', name: 'Lengua Española', description: null, credits: null },
    { id: 'informatica', code: 'CUSTOM-informatica', name: 'Informática', description: 'custom', credits: null },
    { id: 'sexualidad', code: 'CUSTOM-sexualidad', name: 'Sexualidad Humana', description: 'custom', credits: null },
  ],
}

describe('TeacherAssignmentForm', () => {
  it('muestra por defecto solo las asignaturas curriculares del grado seleccionado', () => {
    render(
      <TeacherAssignmentForm
        catalogs={catalogs}
        submitting={false}
        error={null}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />,
    )

    const subjectSelect = screen.getByLabelText('Asignatura')
    expect(subjectSelect).toHaveTextContent('Lengua Española')
    expect(subjectSelect).not.toHaveTextContent('Informática')
    expect(subjectSelect).not.toHaveTextContent('Sexualidad Humana')
    expect(screen.getByRole('button', { name: /crear asignatura personalizada/i })).toBeInTheDocument()
  })
})
