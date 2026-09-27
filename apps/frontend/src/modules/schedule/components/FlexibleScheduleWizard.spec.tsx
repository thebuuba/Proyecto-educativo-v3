import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { FlexibleScheduleWizard } from './FlexibleScheduleWizard'
import type { TimeSlot } from '@/modules/schedule/types'

const journey = { id: 'morning', name: 'Matutina', kind: 'MORNING' as const, startTime: '07:30', endTime: '12:00', sequence: 1 }
const base = [
  { name: 'Período 1', startTime: '07:30', endTime: '08:10', sequence: 1, blockType: 'CLASS' as const },
  { name: 'Período 2', startTime: '08:10', endTime: '08:50', sequence: 2, blockType: 'CLASS' as const },
]
const slots: TimeSlot[] = [1, 5].flatMap((dayOfWeek) => base.map((block) => ({ ...block, id: `${dayOfWeek}-${block.sequence}`, status: 'active', dayOfWeek, journeyId: journey.id })))

async function renderPeriods(initialSlots = slots) {
  const user = userEvent.setup()
  render(<FlexibleScheduleWizard initialJourneys={[journey]} initialSlots={initialSlots} submitting={false} error={null} onComplete={vi.fn()} />)
  await user.click(screen.getByRole('button', { name: /continuar/i }))
  await user.click(screen.getByRole('button', { name: /continuar/i }))
  return user
}

function fridayRow() {
  const label = screen.getByText('Viernes')
  const row = label.closest('div')
  if (!row) throw new Error('No se encontró la fila de viernes')
  return row
}

describe('personalización diaria del horario', () => {
  it('muestra días heredados con Personalizar y sin Editar', async () => {
    await renderPeriods()
    expect(within(fridayRow()).getByText('Usa estructura base')).toBeInTheDocument()
    expect(within(fridayRow()).getByRole('button', { name: 'Personalizar' })).toBeInTheDocument()
    expect(within(fridayRow()).queryByRole('button', { name: /editar/i })).not.toBeInTheDocument()
  })

  it('abre directamente una copia editable de la base y cancelar no crea override', async () => {
    const user = await renderPeriods()
    await user.click(within(fridayRow()).getByRole('button', { name: 'Personalizar' }))
    expect(screen.getByText('Viernes · Horario personalizado')).toBeInTheDocument()
    expect(screen.getAllByDisplayValue('Período 2')).toHaveLength(2)
    await user.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(within(fridayRow()).getByText('Usa estructura base')).toBeInTheDocument()
    expect(within(fridayRow()).queryByRole('button', { name: /editar/i })).not.toBeInTheDocument()
  })

  it('guarda el override, permite editarlo y no cambia la estructura base', async () => {
    const user = await renderPeriods()
    await user.click(within(fridayRow()).getByRole('button', { name: 'Personalizar' }))
    await user.click(screen.getAllByRole('button', { name: 'Eliminar bloque' }).at(-1)!)
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(within(fridayRow()).getByText('Personalizado')).toBeInTheDocument()
    expect(within(fridayRow()).getByRole('button', { name: 'Editar' })).toBeInTheDocument()
    expect(screen.getAllByDisplayValue('Período 2')).toHaveLength(1)
    await user.click(within(fridayRow()).getByRole('button', { name: 'Editar' }))
    expect(screen.getAllByLabelText('Nombre del bloque')).toHaveLength(3)
    expect(screen.getAllByDisplayValue('Período 2')).toHaveLength(1)
  })

  it('valida el borrador antes de guardarlo', async () => {
    const user = await renderPeriods()
    await user.click(within(fridayRow()).getByRole('button', { name: 'Personalizar' }))
    fireEvent.change(screen.getAllByLabelText('Fin').at(-1)!, { target: { value: '07:00' } })
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(screen.getByRole('alert')).toHaveTextContent('debe terminar después de iniciar')
    expect(screen.getByText('Viernes · Horario personalizado')).toBeInTheDocument()
  })

  it('restaura la base únicamente después de confirmar', async () => {
    const personalized = slots.map((slot) => slot.dayOfWeek === 5 && slot.sequence === 2 ? { ...slot, name: 'Viernes corto' } : slot)
    const user = await renderPeriods(personalized)
    await user.click(within(fridayRow()).getByRole('button', { name: 'Usar estructura base' }))
    expect(screen.getByRole('heading', { name: 'Usar estructura base' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Restaurar estructura base' }))
    expect(within(fridayRow()).getByText('Usa estructura base')).toBeInTheDocument()
    expect(within(fridayRow()).getByRole('button', { name: 'Personalizar' })).toBeInTheDocument()
  })
})
