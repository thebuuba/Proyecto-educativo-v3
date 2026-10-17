import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { TeachingStrategyField } from './TeachingStrategyField'
import { newActivityDraft } from './editorModel'

describe('Selección mediante diálogo del creador', () => {
  it('abre con teclado, enfoca la búsqueda, recorre opciones y descarta por Escape', async () => {
    const user = userEvent.setup(),
      onChange = vi.fn()
    render(
      <TeachingStrategyField draft={newActivityDraft('b1')} context={{}} onChange={onChange} />,
    )
    const trigger = screen.getByRole('button', { name: 'Estrategia de enseñanza y aprendizaje' })
    trigger.focus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('searchbox')).toHaveFocus()
    await user.type(screen.getByRole('searchbox'), 'debate')
    await user.tab()
    expect(screen.getByRole('radio', { name: 'Seleccionar automáticamente' })).toHaveFocus()
    await user.keyboard('{ArrowUp}')
    expect(screen.getByRole('radio', { name: 'Debate' })).toHaveFocus()
    expect(screen.getByRole('radio', { name: 'Debate' })).toBeChecked()
    await user.keyboard('{Escape}')
    expect(onChange).not.toHaveBeenCalled()
    expect(trigger).toHaveFocus()
  })
  it('solo confirma la elección provisional y devuelve el foco al control', () => {
    const onChange = vi.fn(),
      draft = {
        ...newActivityDraft('b1'),
        teachingStrategyId: 'CASE_STUDY',
        teachingStrategyOrigin: 'AUTO' as const,
      }
    render(<TeachingStrategyField draft={draft} context={{}} onChange={onChange} />)
    const trigger = screen.getByRole('button', { name: 'Estrategia de enseñanza y aprendizaje' })
    trigger.focus()
    fireEvent.click(trigger)
    const dialog = screen.getByRole('dialog', { name: 'Estrategia de enseñanza y aprendizaje' })
    fireEvent.click(within(dialog).getByRole('radio', { name: 'Debate' }))
    expect(onChange).not.toHaveBeenCalled()
    fireEvent.click(within(dialog).getByRole('button', { name: 'Confirmar' }))
    expect(onChange).toHaveBeenCalledOnce()
    expect(onChange.mock.calls[0][0]).toMatchObject({
      teachingStrategyId: 'DEBATE',
      teachingStrategyOrigin: 'MANUAL',
    })
    expect(trigger).toHaveFocus()
  })
  it.each(['Cancelar', 'Escape', 'Cerrar'])(
    '%s descarta la opción y la búsqueda sin cambiar el borrador',
    (action) => {
      const onChange = vi.fn()
      render(
        <TeachingStrategyField draft={newActivityDraft('b1')} context={{}} onChange={onChange} />,
      )
      const trigger = screen.getByRole('button', { name: 'Estrategia de enseñanza y aprendizaje' })
      trigger.focus()
      fireEvent.click(trigger)
      const dialog = screen.getByRole('dialog', { name: 'Estrategia de enseñanza y aprendizaje' })
      fireEvent.change(within(dialog).getByRole('searchbox'), { target: { value: 'debate' } })
      fireEvent.click(within(dialog).getByRole('radio', { name: 'Debate' }))
      if (action === 'Escape') fireEvent.keyDown(dialog, { key: 'Escape' })
      else fireEvent.click(within(dialog).getByRole('button', { name: action }))
      expect(onChange).not.toHaveBeenCalled()
      expect(trigger).toHaveFocus()
      fireEvent.click(trigger)
      expect(screen.getByRole('searchbox')).toHaveValue('')
    },
  )
  it('una actualización automática no reemplaza la selección provisional y confirma sobre el borrador vigente', () => {
    const onChange = vi.fn(),
      draft = {
        ...newActivityDraft('b1'),
        teachingStrategyId: 'CASE_STUDY',
        teachingStrategyOrigin: 'AUTO' as const,
      }
    const { rerender } = render(
      <TeachingStrategyField draft={draft} context={{}} onChange={onChange} />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Estrategia de enseñanza y aprendizaje' }))
    fireEvent.click(screen.getByRole('radio', { name: 'Debate' }))
    rerender(
      <TeachingStrategyField
        draft={{ ...draft, name: 'Descripción vigente', teachingStrategyId: 'SIMULATION' }}
        context={{}}
        onChange={onChange}
      />,
    )
    expect(screen.getByRole('radio', { name: 'Debate' })).toBeChecked()
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }))
    expect(onChange.mock.calls[0][0]).toMatchObject({
      name: 'Descripción vigente',
      teachingStrategyId: 'DEBATE',
      teachingStrategyOrigin: 'MANUAL',
    })
  })
})
