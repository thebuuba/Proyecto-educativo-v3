import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { CourseStudent } from '../types'
import { StudentsTable } from './StudentsTable'

const student: CourseStudent = {
  id: 'student-1',
  userId: null,
  studentCode: 'TEMP-123',
  firstName: 'Ana',
  lastName: 'Pérez',
  fullName: 'Ana Pérez',
  documentId: null,
  birthDate: '2010-01-01',
  gender: null,
  address: null,
  status: 'active',
  createdAt: '',
  updatedAt: '',
  enrollmentId: 'enrollment-1',
  listNumber: 1,
}

describe('StudentsTable', () => {
  it('permite consultar el expediente y usar las acciones secundarias desde su desplegable', async () => {
    const user = userEvent.setup()
    const onView = vi.fn()
    const onTransfer = vi.fn()
    render(
      <StudentsTable
        students={[student]}
        canCreateEnrollment
        canEditStudent
        onView={onView}
        onTransfer={onTransfer}
        onEdit={vi.fn()}
        onDeactivate={vi.fn()}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Ver expediente de Ana Pérez' }))
    expect(onView).toHaveBeenCalledWith(student)
    const toggle = screen.getByLabelText('Acciones para Ana Pérez')
    const disclosure = toggle.closest('details')!
    expect(disclosure).not.toHaveAttribute('open')
    await user.click(toggle)
    expect(disclosure).toHaveAttribute('open')
    await user.click(within(disclosure).getByRole('button', { name: 'Trasladar' }))
    expect(onTransfer).toHaveBeenCalledWith(student)
    expect(disclosure).not.toHaveAttribute('open')
  })

  it('conserva el número de lista al ordenar o buscar y oculta las acciones sin permiso', async () => {
    const user = userEvent.setup()
    const other = { ...student, id: 'student-2', fullName: 'Zoe Gómez', studentCode: 'MAT-002' }
    render(
      <StudentsTable
        students={[other, student]}
        canCreateEnrollment={false}
        canEditStudent={false}
        onView={vi.fn()}
        onTransfer={vi.fn()}
        onEdit={vi.fn()}
        onDeactivate={vi.fn()}
      />,
    )
    await user.selectOptions(screen.getByRole('combobox', { name: 'Ordenar' }), 'name')
    const anaRow = screen
      .getByRole('button', { name: 'Ver expediente de Ana Pérez' })
      .closest('tr')!
    expect(within(anaRow).getByText('02')).toBeInTheDocument()
    expect(screen.queryByLabelText('Acciones para Ana Pérez')).not.toBeInTheDocument()
    await user.type(screen.getByRole('searchbox', { name: 'Buscar estudiante' }), 'MAT-002')
    expect(screen.queryByText('Ana Pérez')).not.toBeInTheDocument()
    expect(screen.getByText('Zoe Gómez')).toBeInTheDocument()
  })
})
