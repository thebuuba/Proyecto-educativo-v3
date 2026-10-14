import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { Modal } from './Modal'

describe('cierre exterior de Modal', () => {
  it('mantiene abierto el diálogo que aparece al cambiar un selector', async () => {
    const user = userEvent.setup()
    function OpeningDialog() {
      const [open, setOpen] = useState(false)
      return <>
        <select aria-label="Formato" onChange={() => setOpen(true)}>
          <option value="rubrica">Rúbrica</option>
          <option value="escala">Escala</option>
        </select>
        {open ? <Modal title="Confirmar formato" onClose={() => setOpen(false)}>Confirmación</Modal> : null}
      </>
    }
    render(<OpeningDialog />)
    await user.selectOptions(screen.getByRole('combobox', { name: 'Formato' }), 'escala')
    expect(screen.getByRole('dialog', { name: 'Confirmar formato' })).toBeInTheDocument()
  })

  it('cierra al pulsar fuera y no al interactuar con el contenido', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Modal title="Prueba" onClose={onClose}><button>Acción interior</button></Modal>)
    await user.click(screen.getByRole('button', { name: 'Acción interior' }))
    expect(onClose).not.toHaveBeenCalled()
    await user.click(screen.getByRole('dialog').parentElement!)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('respeta el bloqueo de cierre durante una operación', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const { rerender } = render(<Modal title="Guardando" closeDisabled onClose={onClose}>Contenido</Modal>)
    await user.click(screen.getByRole('dialog').parentElement!)
    expect(onClose).not.toHaveBeenCalled()
    rerender(<Modal title="Guardando" onClose={onClose}>Contenido</Modal>)
    await user.click(screen.getByRole('dialog').parentElement!)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('cierra solo el diálogo superior y consume el clic exterior', async () => {
    const user = userEvent.setup()
    const closeParent = vi.fn()
    const backgroundAction = vi.fn()
    function NestedDialogs() {
      const [childOpen, setChildOpen] = useState(true)
      return <>
        <button onClick={backgroundAction}>Acción del fondo</button>
        <Modal title="Principal" onClose={closeParent}>Principal</Modal>
        {childOpen ? <Modal title="Superior" onClose={() => setChildOpen(false)}>Superior</Modal> : null}
      </>
    }
    render(<NestedDialogs />)
    await user.click(screen.getByRole('button', { name: 'Acción del fondo' }))
    expect(screen.queryByRole('dialog', { name: 'Superior' })).not.toBeInTheDocument()
    expect(screen.getByRole('dialog', { name: 'Principal' })).toBeInTheDocument()
    expect(closeParent).not.toHaveBeenCalled()
    expect(backgroundAction).not.toHaveBeenCalled()
  })

  it('no confunde un arrastre iniciado dentro con un clic exterior', () => {
    const onClose = vi.fn()
    render(<Modal title="Prueba" onClose={onClose}><input aria-label="Campo" /></Modal>)
    const overlay = screen.getByRole('dialog').parentElement!
    fireEvent.pointerDown(screen.getByLabelText('Campo'))
    fireEvent.pointerUp(overlay)
    fireEvent.click(overlay)
    expect(onClose).not.toHaveBeenCalled()
    fireEvent.pointerDown(overlay)
    fireEvent.click(overlay)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('no cierra el modal padre si el selector superior desaparece al comenzar el clic', () => {
    const closeParent = vi.fn()
    const backgroundAction = vi.fn()
    function DialogWithPopover() {
      const [popoverOpen, setPopoverOpen] = useState(true)
      return <div onPointerDownCapture={() => setPopoverOpen(false)} onClick={backgroundAction}>
        <Modal title="Principal" onClose={closeParent}>Principal</Modal>
        {popoverOpen ? <div role="dialog" aria-label="Selector horario">Selector</div> : null}
      </div>
    }
    render(<DialogWithPopover />)
    const overlay = screen.getByRole('dialog', { name: 'Principal' }).parentElement!
    fireEvent.pointerDown(overlay)
    expect(screen.queryByRole('dialog', { name: 'Selector horario' })).not.toBeInTheDocument()
    fireEvent.click(overlay)
    expect(closeParent).not.toHaveBeenCalled()
    expect(backgroundAction).not.toHaveBeenCalled()
  })
})
