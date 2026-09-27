import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { FlexibleScheduleWizard } from './FlexibleScheduleWizard'
import type { SaveScheduleStructureInput, TimeSlot } from '@/modules/schedule/types'

const journey = { id: 'morning', name: 'Matutina', kind: 'MORNING' as const, startTime: '07:30', endTime: '12:00', sequence: 1 }
const base = [
  { name: 'Período 1', startTime: '07:30', endTime: '08:10', sequence: 1, blockType: 'CLASS' as const },
  { name: 'Período 2', startTime: '08:10', endTime: '08:50', sequence: 2, blockType: 'CLASS' as const },
]
const slots: TimeSlot[] = [1, 5].flatMap((dayOfWeek) => base.map((block) => ({ ...block, id: `${dayOfWeek}-${block.sequence}`, status: 'active', dayOfWeek, journeyId: journey.id })))

async function renderPeriods(initialSlots = slots) {
  const user = userEvent.setup()
  const onComplete = vi.fn<(input: SaveScheduleStructureInput) => void>()
  render(<FlexibleScheduleWizard initialJourneys={[journey]} initialSlots={initialSlots} submitting={false} error={null} onComplete={onComplete} />)
  await user.click(screen.getByRole('button', { name: /continuar/i }))
  await user.click(screen.getByRole('button', { name: /continuar/i }))
  return { user, onComplete }
}

async function openFridayPeriod2(user: ReturnType<typeof userEvent.setup>) {
  const summary = screen.getByLabelText('Acciones de Período 2 en Viernes')
  await user.click(summary)
  return summary.parentElement as HTMLElement
}

describe('cuadrícula semanal de períodos', () => {
  it('muestra el horario semanal sin exponer aplicar ni personalizar', async () => {
    await renderPeriods()
    expect(screen.getAllByText('Lun').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Vie').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Período 1').length).toBeGreaterThanOrEqual(3)
    expect(screen.queryByText('Aplicar esta estructura a')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Personalizar' })).not.toBeInTheDocument()
  })

  it('añade un período y un recreo a todos los días de la jornada', async () => {
    const { user } = await renderPeriods()
    await user.click(screen.getByRole('button', { name: 'Añadir período' }))
    expect(screen.getAllByText('Período 3').length).toBeGreaterThanOrEqual(3)
    await user.click(screen.getByRole('button', { name: 'Añadir recreo' }))
    expect(screen.getAllByText('Recreo').length).toBeGreaterThanOrEqual(3)
  })

  it('elimina un período solo del viernes y permite restaurar el horario habitual', async () => {
    const { user } = await renderPeriods()
    const actions = await openFridayPeriod2(user)
    await user.click(within(actions).getByRole('button', { name: 'Eliminar de este día' }))
    expect(screen.getAllByText('● Ajustado').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Período 2').length).toBeGreaterThan(0)
    await user.click(screen.getByRole('button', { name: 'Restaurar' }))
    expect(screen.queryByText('● Ajustado')).not.toBeInTheDocument()
  })

  it('edita una celda directamente y valida horarios inválidos', async () => {
    const { user } = await renderPeriods()
    const actions = await openFridayPeriod2(user)
    await user.click(within(actions).getByRole('button', { name: 'Editar' }))
    expect(screen.getByRole('heading', { name: 'Viernes · Editar bloque' })).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Fin'), { target: { value: '07:00' } })
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(screen.getByRole('alert')).toHaveTextContent('debe terminar después de iniciar')
    fireEvent.change(screen.getByLabelText('Fin'), { target: { value: '08:40' } })
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(screen.getAllByText('● Ajustado').length).toBeGreaterThan(0)
    expect(screen.getAllByText('08:10–08:40').length).toBeGreaterThan(0)
  })

  it('reconstruye al recargar las diferencias guardadas por día', async () => {
    const personalized = slots.map((slot) => slot.dayOfWeek === 5 && slot.sequence === 2 ? { ...slot, endTime: '08:40' } : slot)
    await renderPeriods(personalized)
    expect(screen.getAllByText('● Ajustado').length).toBeGreaterThan(0)
    expect(screen.getAllByText('08:10–08:40').length).toBeGreaterThan(0)
  })

  it('mantiene independientes las configuraciones Matutina y Vespertina', async () => {
    const afternoon = { id: 'afternoon', name: 'Vespertina', kind: 'AFTERNOON' as const, startTime: '13:00', endTime: '16:00', sequence: 2 }
    const afternoonSlots: TimeSlot[] = [1, 5].flatMap((dayOfWeek) => base.map((block) => ({ ...block, id: `a-${dayOfWeek}-${block.sequence}`, startTime: block.sequence === 1 ? '13:00' : '13:35', endTime: block.sequence === 1 ? '13:35' : '14:10', status: 'active', dayOfWeek, journeyId: afternoon.id })))
    const user = userEvent.setup()
    render(<FlexibleScheduleWizard initialJourneys={[journey, afternoon]} initialSlots={[...slots, ...afternoonSlots]} submitting={false} error={null} onComplete={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /continuar/i }))
    await user.click(screen.getByRole('button', { name: /continuar/i }))
    const morningSection = screen.getByText('Matutina').closest('section')!
    const afternoonSection = screen.getByText('Vespertina').closest('section')!
    fireEvent.change(within(afternoonSection).getAllByRole('spinbutton')[0], { target: { value: '35' } })
    expect(within(morningSection).getAllByRole('spinbutton')[0]).toHaveValue(40)
    expect(within(afternoonSection).getAllByRole('spinbutton')[0]).toHaveValue(35)
    await user.click(within(morningSection).getByRole('button', { name: 'Añadir recreo' }))
    expect(within(morningSection).getAllByText('Recreo').length).toBeGreaterThan(0)
    expect(within(afternoonSection).queryByText('Recreo')).not.toBeInTheDocument()
  })
})
