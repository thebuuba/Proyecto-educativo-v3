import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { FlexibleScheduleWizard } from './FlexibleScheduleWizard'
import type { ScheduleEntry, TimeSlot } from '../types'

const journey = { id: 'morning', name: 'Matutina', kind: 'MORNING' as const, startTime: '07:30', endTime: '12:00', sequence: 1 }
const slots: TimeSlot[] = [1, 2].map(dayOfWeek => ({ id: `slot-${dayOfWeek}`, name: 'Clase 1', startTime: '07:30', endTime: '08:10', sequence: 1, status: 'active', dayOfWeek, journeyId: 'morning', blockType: 'CLASS' }))
const entries = slots.map(slot => ({ id: `entry-${slot.id}`, timeSlotId: slot.id, dayOfWeek: slot.dayOfWeek, status: 'active' })) as ScheduleEntry[]
function setup() {
  const save = vi.fn()
  render(<FlexibleScheduleWizard mode="polymet" initialJourneys={[journey]} initialSlots={slots} existingEntries={entries} submitting={false} error={null} onComplete={save} onCancel={vi.fn()} renderPreview={input => <div data-testid="preview">{input.blocks.length} bloques</div>} />)
  return { user: userEvent.setup(), save }
}
describe('constructor de horario Polymet', () => {
  it('aplica presets semanales y permite ajustar los días mediante checkboxes', async () => {
    const { user } = setup()
    await user.click(screen.getByRole('button', { name: 'Laborables + sábado' }))
    expect(screen.getByRole('checkbox', { name: 'Sábado' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Domingo' })).not.toBeChecked()
    await user.click(screen.getByRole('button', { name: /^Laborables$/ }))
    expect(screen.getByRole('checkbox', { name: 'Viernes' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Sábado' })).not.toBeChecked()
    await user.click(screen.getByRole('checkbox', { name: 'Viernes' }))
    expect(screen.getByRole('checkbox', { name: 'Viernes' })).not.toBeChecked()
  }, 15000)
  it('al quitar el primer período conserva la identidad del segundo', async () => {
    const save = vi.fn()
    const user = userEvent.setup()
    const twoSlots = [slots[0], { ...slots[0], id: 'second', name: 'Clase 2', sequence: 2, startTime: '08:10', endTime: '08:50' }]
    render(<FlexibleScheduleWizard mode="polymet" initialJourneys={[journey]} initialSlots={twoSlots} existingEntries={[entries[0]]} submitting={false} error={null} onComplete={save} />)
    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    const firstBlock = screen.getByText('Clase 1').closest('article')!
    await user.click(within(firstBlock).getByText('Acciones'))
    await user.click(within(firstBlock).getByRole('button', { name: 'Eliminar solo este día' }))
    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    expect(screen.getByText('1 clase pendiente de reubicar')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(save.mock.calls[0][0].blocks[0].id).toBe('second')
  }, 15000)
  it('mantiene la vista previa en todos los pasos y guarda la estructura', async () => {
    const { user, save } = setup()
    expect(screen.getByRole('heading', { name: 'Editar estructura' })).toBeInTheDocument()
    for (let step = 0; step < 3; step++) {
      expect(screen.getByTestId('preview')).toHaveTextContent('2 bloques')
      await user.click(screen.getByRole('button', { name: 'Continuar' }))
    }
    expect(screen.getByText('2 clases conservadas')).toBeInTheDocument()
    expect(screen.getByText('0 clases pendientes de reubicar')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(save.mock.calls[0][0].blocks).toHaveLength(2)
  }, 15000)
  it('permite días propios por jornada y conserva las clases retiradas como pendientes', async () => {
    const { user, save } = setup()
    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    await user.click(screen.getByRole('checkbox', { name: 'Martes en Matutina' }))
    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    expect(screen.getByRole('combobox', { name: 'Ajustar día de Matutina' })).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    expect(screen.getByText('1 clase conservada')).toBeInTheDocument()
    expect(screen.getByText('1 clase pendiente de reubicar')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(save.mock.calls[0][0].blocks.map((block: TimeSlot) => block.dayOfWeek)).toEqual([1])
  }, 15000)
  it('al convertir una clase en descanso informa el efecto sin borrar la asignación', async () => {
    const { user, save } = setup()
    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    await user.click(screen.getByRole('button', { name: 'Editar Clase 1 solo este día' }))
    const editor = screen.getByRole('dialog')
    fireEvent.change(within(editor).getByLabelText('Tipo'), { target: { value: 'BREAK' } })
    await user.click(within(editor).getByRole('button', { name: 'Guardar cambios' }))
    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    expect(screen.getByText('1 clase pendiente de reubicar')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(save.mock.calls[0][0].blocks.find((block: TimeSlot) => block.id === 'slot-1').blockType).toBe('BREAK')
    expect(entries).toHaveLength(2)
  }, 15000)
})
