import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { ComponentProps } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { AcademicPeriodSummary } from '@/modules/planning/types'

import { PeriodManager } from './PeriodManager'

const service = vi.hoisted(() => ({ create: vi.fn(), update: vi.fn(), remove: vi.fn() }))
vi.mock('@/modules/planning/services/planningService', () => ({
  createAcademicPeriod: service.create,
  updateAcademicPeriod: service.update,
  deleteAcademicPeriod: service.remove,
}))

const periods: AcademicPeriodSummary[] = [{
  id: 'first-period',
  name: 'Primer trimestre',
  sequence: 1,
  startDate: '2026-08-25T00:00:00.000Z',
  endDate: '2026-11-30T00:00:00.000Z',
  status: 'active',
}]

function renderManager(overrides: Partial<ComponentProps<typeof PeriodManager>> = {}) {
  const props = { schoolYearId: 'year-2026', periods, onClose: vi.fn(), onRefresh: vi.fn(), ...overrides }
  render(<PeriodManager {...props} />)
  return props
}

describe('PeriodManager', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    service.create.mockResolvedValue(undefined)
    service.update.mockResolvedValue(undefined)
    service.remove.mockResolvedValue(undefined)
  })

  it('edita nombre, secuencia y fechas del período elegido sin recrearlo', async () => {
    const { onRefresh } = renderManager()
    fireEvent.click(screen.getByRole('button', { name: 'Editar Primer trimestre' }))
    expect(screen.getByLabelText('Fecha inicio')).toHaveValue('2026-08-25')
    expect(screen.getByLabelText('Fecha fin')).toHaveValue('2026-11-30')
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: '  Trimestre revisado  ' } })
    fireEvent.change(screen.getByLabelText('Secuencia'), { target: { value: '2' } })
    fireEvent.change(screen.getByLabelText('Fecha inicio'), { target: { value: '2026-09-01' } })
    fireEvent.change(screen.getByLabelText('Fecha fin'), { target: { value: '2026-12-15' } })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    await waitFor(() => expect(onRefresh).toHaveBeenCalledTimes(1))
    expect(service.update).toHaveBeenCalledWith('first-period', {
      name: 'Trimestre revisado', sequence: 2, startDate: '2026-09-01', endDate: '2026-12-15',
    })
    expect(service.create).not.toHaveBeenCalled()
    expect(screen.getByLabelText('Nombre')).toHaveValue('')
    expect(screen.getByRole('button', { name: 'Agregar período' })).toBeInTheDocument()
  })

  it.each(['2026-08-25', '2026-08-24'])('rechaza el final %s si no es posterior al inicio', async (endDate) => {
    renderManager()
    fireEvent.click(screen.getByRole('button', { name: 'Editar Primer trimestre' }))
    fireEvent.change(screen.getByLabelText('Fecha fin'), { target: { value: endDate } })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/inicio.*anterior.*fin/i)
    expect(screen.getByLabelText('Nombre')).toHaveValue('Primer trimestre')
    expect(service.update).not.toHaveBeenCalled()
  })

  it('muestra el error de eliminación sin perder períodos ni la edición pendiente', async () => {
    service.remove.mockRejectedValue(new Error('El período tiene evaluaciones asociadas'))
    const { onRefresh } = renderManager()
    fireEvent.click(screen.getByRole('button', { name: 'Editar Primer trimestre' }))
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Borrador conservado' } })
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Primer trimestre' }))
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('El período tiene evaluaciones asociadas')
    expect(screen.getByText('Primer trimestre')).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre')).toHaveValue('Borrador conservado')
    expect(service.remove).toHaveBeenCalledWith('first-period')
    expect(onRefresh).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Eliminar Primer trimestre' })).toBeEnabled()
  })

  it('bloquea el cierre y el doble envío mientras guarda', async () => {
    let resolveSave!: () => void
    service.update.mockImplementation(() => new Promise<void>((resolve) => { resolveSave = resolve }))
    const { onClose } = renderManager()
    fireEvent.click(screen.getByRole('button', { name: 'Editar Primer trimestre' }))
    const form = screen.getByRole('button', { name: 'Guardar cambios' }).closest('form')!
    fireEvent.submit(form)
    fireEvent.submit(form)

    expect(service.update).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: 'Cancelar edición' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Cerrar' })).toBeDisabled()
    expect(screen.getByLabelText('Nombre')).toBeDisabled()
    fireEvent.click(screen.getByRole('dialog').parentElement!)
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
    expect(onClose).not.toHaveBeenCalled()

    await act(async () => resolveSave())
    expect(screen.getByRole('button', { name: 'Cerrar' })).toBeEnabled()
  })

  it('cancelar edición vuelve a crear sin modificar el período original', () => {
    renderManager()
    fireEvent.click(screen.getByRole('button', { name: 'Editar Primer trimestre' }))
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Cambio descartado' } })
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar edición' }))

    expect(screen.getByLabelText('Nombre')).toHaveValue('')
    expect(screen.getByRole('button', { name: 'Agregar período' })).toBeInTheDocument()
    expect(service.update).not.toHaveBeenCalled()
    expect(screen.getByText('Primer trimestre')).toBeInTheDocument()
  })

  it('conserva los cambios para reintentar cuando falla la edición', async () => {
    service.update.mockRejectedValue(new Error('La secuencia ya está en uso'))
    const { onRefresh } = renderManager()
    fireEvent.click(screen.getByRole('button', { name: 'Editar Primer trimestre' }))
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Trimestre revisado' } })
    fireEvent.change(screen.getByLabelText('Secuencia'), { target: { value: '2' } })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('La secuencia ya está en uso')
    expect(screen.getByLabelText('Nombre')).toHaveValue('Trimestre revisado')
    expect(screen.getByLabelText('Secuencia')).toHaveValue(2)
    expect(screen.getByRole('button', { name: 'Guardar cambios' })).toBeEnabled()
    expect(onRefresh).not.toHaveBeenCalled()
  })

  it('mantiene el alta vinculada al año escolar recibido', async () => {
    const { onRefresh } = renderManager()
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: '  Segundo trimestre  ' } })
    fireEvent.change(screen.getByLabelText('Fecha inicio'), { target: { value: '2026-12-01' } })
    fireEvent.change(screen.getByLabelText('Fecha fin'), { target: { value: '2027-03-01' } })
    fireEvent.click(screen.getByRole('button', { name: 'Agregar período' }))

    await waitFor(() => expect(onRefresh).toHaveBeenCalledTimes(1))
    expect(service.create).toHaveBeenCalledWith({
      schoolYearId: 'year-2026', name: 'Segundo trimestre', sequence: 2, startDate: '2026-12-01', endDate: '2027-03-01',
    })
    expect(service.update).not.toHaveBeenCalled()
  })

  it('propone un orden libre al editar el máximo y crear antes de refrescar', async () => {
    const existing = [1, 2, 3].map((sequence) => ({ ...periods[0], id: `period-${sequence}`, name: `Período ${sequence}`, sequence }))
    const { onRefresh } = renderManager({ periods: existing })
    fireEvent.click(screen.getByRole('button', { name: 'Editar Período 3' }))
    fireEvent.change(screen.getByLabelText('Secuencia'), { target: { value: '4' } })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    await waitFor(() => expect(onRefresh).toHaveBeenCalledTimes(1))
    expect(screen.getByLabelText('Secuencia')).toHaveValue(5)
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Período nuevo' } })
    fireEvent.change(screen.getByLabelText('Fecha inicio'), { target: { value: '2027-01-01' } })
    fireEvent.change(screen.getByLabelText('Fecha fin'), { target: { value: '2027-03-01' } })
    fireEvent.click(screen.getByRole('button', { name: 'Agregar período' }))

    await waitFor(() => expect(onRefresh).toHaveBeenCalledTimes(2))
    expect(service.create).toHaveBeenCalledWith({
      schoolYearId: 'year-2026', name: 'Período nuevo', sequence: 5, startDate: '2027-01-01', endDate: '2027-03-01',
    })
    expect(screen.getByLabelText('Secuencia')).toHaveValue(6)
  })

  it('usa el máximo de un listado con huecos también al cancelar una edición', () => {
    const existing = [1, 5].map((sequence) => ({ ...periods[0], id: `period-${sequence}`, name: `Período ${sequence}`, sequence }))
    renderManager({ periods: existing })
    expect(screen.getByLabelText('Secuencia')).toHaveValue(6)
    fireEvent.click(screen.getByRole('button', { name: 'Editar Período 1' }))
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar edición' }))
    expect(screen.getByLabelText('Secuencia')).toHaveValue(6)
  })

  it('recalcula el siguiente orden al eliminar el período de mayor secuencia', async () => {
    const existing = [2, 5].map((sequence) => ({ ...periods[0], id: `period-${sequence}`, name: `Período ${sequence}`, sequence }))
    const { onRefresh } = renderManager({ periods: existing })
    fireEvent.click(screen.getByRole('button', { name: 'Editar Período 5' }))
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Período 5' }))
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }))

    await waitFor(() => expect(onRefresh).toHaveBeenCalledTimes(1))
    expect(screen.getByLabelText('Secuencia')).toHaveValue(3)
    expect(screen.getByRole('button', { name: 'Agregar período' })).toBeInTheDocument()
  })
})
