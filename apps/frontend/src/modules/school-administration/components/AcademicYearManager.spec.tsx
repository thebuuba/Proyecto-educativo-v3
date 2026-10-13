import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { ComponentProps } from 'react'
import { describe, expect, it, vi } from 'vitest'

import type { SchoolYearItem } from '@/modules/school-administration/types'

import { AcademicYearManager } from './AcademicYearManager'

const schoolYears: SchoolYearItem[] = [
  {
    id: 'next-year',
    name: 'Año 2027-2028',
    startDate: '2027-08-25T00:00:00.000Z',
    endDate: '2028-06-20T00:00:00.000Z',
    periodScheme: 'quarter',
    periodCount: 4,
    calendarSource: 'manual',
    instructionalDays: null,
    studentWeeks: null,
    teacherWeeks: null,
    isCurrent: false,
    status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'current-year',
    name: 'Año 2026-2027',
    startDate: '2026-08-25',
    endDate: '2027-06-20',
    periodScheme: 'quarter',
    periodCount: 4,
    calendarSource: 'manual',
    instructionalDays: null,
    studentWeeks: null,
    teacherWeeks: null,
    isCurrent: true,
    status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
]

function renderManager(overrides: Partial<ComponentProps<typeof AcademicYearManager>> = {}) {
  const props = {
    schoolYears,
    onAdd: vi.fn().mockResolvedValue(undefined),
    onEdit: vi.fn().mockResolvedValue(undefined),
    onActivate: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  }
  render(<AcademicYearManager {...props} />)
  return props
}

describe('AcademicYearManager', () => {
  it('edita el año elegido normalizando fechas ISO sin cambiar su activación', async () => {
    const { onEdit, onAdd, onActivate } = renderManager()
    fireEvent.click(screen.getByRole('button', { name: 'Editar Año 2027-2028' }))

    expect(screen.getByLabelText(/Fecha inicio/)).toHaveValue('2027-08-25')
    expect(screen.getByLabelText(/Fecha fin/)).toHaveValue('2028-06-20')
    fireEvent.change(screen.getByLabelText(/Nombre/), { target: { value: '  Calendario revisado  ' } })
    fireEvent.change(screen.getByLabelText(/Fecha inicio/), { target: { value: '2027-09-01' } })
    fireEvent.change(screen.getByLabelText(/Fecha fin/), { target: { value: '2028-06-30' } })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(onEdit).toHaveBeenCalledWith('next-year', {
      name: 'Calendario revisado', startDate: '2027-09-01', endDate: '2028-06-30',
    })
    expect(onAdd).not.toHaveBeenCalled()
    expect(onActivate).not.toHaveBeenCalled()
  })

  it.each(['2027-08-25', '2027-08-24'])('rechaza la fecha final %s cuando no es posterior al inicio', async (endDate) => {
    const { onEdit } = renderManager()
    fireEvent.click(screen.getByRole('button', { name: 'Editar Año 2027-2028' }))
    fireEvent.change(screen.getByLabelText(/Fecha fin/), { target: { value: endDate } })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/inicio.*anterior.*fin/i)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(onEdit).not.toHaveBeenCalled()
  })

  it('muestra el error de activación conservando el listado y permite reintentar', async () => {
    const onActivate = vi.fn().mockRejectedValueOnce(new Error('No se pudo activar el calendario')).mockResolvedValue(undefined)
    renderManager({ onActivate })
    fireEvent.click(screen.getByRole('button', { name: 'Activar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo activar el calendario')
    expect(screen.getByText('Año 2027-2028')).toBeInTheDocument()
    expect(screen.getByText('Año 2026-2027')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Activar' })).toBeEnabled()
    expect(onActivate).toHaveBeenCalledWith('next-year')

    fireEvent.click(screen.getByRole('button', { name: 'Activar' }))
    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument())
  })

  it('bloquea el cierre y el doble envío mientras guarda una edición', async () => {
    let resolveSave!: () => void
    const onEdit = vi.fn(() => new Promise<void>((resolve) => { resolveSave = resolve }))
    renderManager({ onEdit })
    fireEvent.click(screen.getByRole('button', { name: 'Editar Año 2027-2028' }))
    const form = screen.getByRole('button', { name: 'Guardar cambios' }).closest('form')!
    fireEvent.submit(form)
    fireEvent.submit(form)

    expect(onEdit).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Cerrar' })).toBeDisabled()
    expect(screen.getByLabelText(/Nombre/)).toBeDisabled()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await act(async () => resolveSave())
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('conserva los valores de edición después de un error de guardado', async () => {
    const onEdit = vi.fn().mockRejectedValue(new Error('El calendario está en uso'))
    renderManager({ onEdit })
    fireEvent.click(screen.getByRole('button', { name: 'Editar Año 2027-2028' }))
    fireEvent.change(screen.getByLabelText(/Nombre/), { target: { value: 'Nombre revisado' } })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('El calendario está en uso')
    expect(screen.getByLabelText(/Nombre/)).toHaveValue('Nombre revisado')
    expect(screen.getByRole('button', { name: 'Guardar cambios' })).toBeEnabled()
  })

  it('mantiene la creación independiente de la edición', async () => {
    const { onAdd, onEdit } = renderManager()
    fireEvent.click(screen.getByRole('button', { name: 'Nuevo' }))
    fireEvent.change(screen.getByLabelText(/Nombre/), { target: { value: '  Año nuevo  ' } })
    fireEvent.change(screen.getByLabelText(/Fecha inicio/), { target: { value: '2028-08-25' } })
    fireEvent.change(screen.getByLabelText(/Fecha fin/), { target: { value: '2029-06-20' } })
    fireEvent.click(screen.getByRole('button', { name: 'Crear año escolar' }))

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(onAdd).toHaveBeenCalledWith({ name: 'Año nuevo', startDate: '2028-08-25', endDate: '2029-06-20' })
    expect(onEdit).not.toHaveBeenCalled()
  })
})
