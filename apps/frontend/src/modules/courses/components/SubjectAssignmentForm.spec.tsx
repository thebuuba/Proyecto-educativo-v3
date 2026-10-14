import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { GradeWithSections, Section, Subject } from '@/modules/courses/types'
import { SubjectAssignmentForm } from './SubjectAssignmentForm'

const math: Subject = { id: 'math-1', name: 'Matemática', code: 'MAT', description: null, credits: null }
const section: Section = { id: 'section-1', gradeId: 'grade-1', name: 'A', capacity: null,
  studentCount: 0, teamCount: 0, status: 'active', createdAt: '', updatedAt: '', assignments: [] }
const grade: GradeWithSections = { id: 'grade-1', name: '2.º', level: 'Secundario', academicLevelId: null,
  academicCycleId: null, defaultModalityId: null, academicLevelName: 'Secundario',
  academicCycleName: 'Primer Ciclo de Secundaria', defaultModalityName: null, sequence: 2,
  status: 'active', createdAt: '', updatedAt: '', sections: [section] }

function renderForm(onCreateSubject = vi.fn().mockResolvedValue({ ...math, id: 'custom-1' })) {
  const onAssign = vi.fn().mockResolvedValue(undefined)
  const onClose = vi.fn()
  render(<SubjectAssignmentForm grade={grade} section={section} catalogs={{ subjects: [math] }}
    schoolYearName="2026-2027" submitting={false} error={null}
    onCreateSubject={onCreateSubject} onAssign={onAssign} onClose={onClose} />)
  return { onCreateSubject, onAssign, onClose }
}

describe('SubjectAssignmentForm', () => {
  it('busca y asigna una materia oficial desde una lista, sin la pestaña duplicada', async () => {
    const user = userEvent.setup()
    const { onAssign, onCreateSubject } = renderForm()
    expect(screen.queryByRole('button', { name: /^Asignatura nueva/ })).not.toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Crear asignatura nueva' })).toHaveLength(1)
    await user.type(screen.getByLabelText('Buscar asignatura'), 'matem')
    await user.click(screen.getByRole('button', { name: 'Matemática' }))
    expect(screen.getByRole('button', { name: 'Matemática' })).toHaveAttribute('aria-pressed', 'true')
    await user.click(screen.getByRole('button', { name: 'Agregar asignatura' }))
    await waitFor(() => expect(onAssign).toHaveBeenCalledWith({ subjectId: 'math-1' }))
    expect(onCreateSubject).not.toHaveBeenCalled()
  })

  it('crea una materia personalizada desde el único acceso y permite volver al catálogo', async () => {
    const user = userEvent.setup()
    const { onCreateSubject, onAssign } = renderForm()
    await user.click(screen.getByRole('button', { name: 'Crear asignatura nueva' }))
    await user.click(screen.getByRole('button', { name: 'Volver a asignaturas existentes' }))
    expect(screen.getByLabelText('Buscar asignatura')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Crear asignatura nueva' }))
    await user.type(screen.getByLabelText(/Nombre de la asignatura/), 'Robótica')
    await user.click(screen.getByRole('button', { name: 'Agregar asignatura' }))
    await waitFor(() => expect(onAssign).toHaveBeenCalledWith({ subjectId: 'custom-1' }))
    expect(onCreateSubject).toHaveBeenCalledWith({ code: 'CUSTOM-robotica', name: 'Robótica', description: 'custom' })
  })

  it('mantiene la validación de materias que ya existen en el currículo', async () => {
    const user = userEvent.setup()
    const { onCreateSubject } = renderForm()
    await user.click(screen.getByRole('button', { name: 'Crear asignatura nueva' }))
    await user.type(screen.getByLabelText(/Nombre de la asignatura/), 'Matemática')
    expect(screen.getByRole('button', { name: 'Agregar asignatura' })).toBeDisabled()
    expect(screen.getByText(/Esta asignatura existe en el catálogo oficial/)).toBeInTheDocument()
    expect(onCreateSubject).not.toHaveBeenCalled()
  })
})
