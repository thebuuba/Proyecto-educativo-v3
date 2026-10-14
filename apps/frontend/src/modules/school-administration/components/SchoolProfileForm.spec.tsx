import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SchoolProfileForm } from './SchoolProfileForm'
import type { SchoolProfile } from '../types'

const profile: SchoolProfile = {
  id: 'school-1', name: 'Centro Aula', slug: 'centro-aula', logoUrl: null, sector: 'public',
  centerCode: '01234', schoolShift: 'morning,afternoon' as SchoolProfile['schoolShift'], primaryModality: 'academic',
  enabledSubsystems: ['regular', 'programa-existente'], officialExportsEnabled: false, status: 'active',
  createdAt: '2026-01-01', updatedAt: '2026-01-01',
}

describe('configuración del centro', () => {
  it('carga los datos recibidos después de montar y guarda la oferta existente sin perder valores', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn().mockResolvedValue(undefined)
    const { rerender } = render(<SchoolProfileForm profile={null} onSave={onSave} />)
    rerender(<SchoolProfileForm profile={profile} onSave={onSave} />)
    expect(screen.getByLabelText(/Nombre de la institución/)).toHaveValue('Centro Aula')
    expect(screen.getByRole('checkbox', { name: 'Matutina' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Vespertina' })).toBeChecked()
    await user.type(screen.getByLabelText('Logo del centro'), 'https://example.com/logo.png')
    await user.click(screen.getByRole('checkbox', { name: 'Jóvenes y adultos' }))
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(onSave).toHaveBeenCalledWith({
      name: 'Centro Aula', slug: 'centro-aula', logoUrl: 'https://example.com/logo.png', sector: 'public',
      centerCode: '01234', schoolShift: 'morning,afternoon', primaryModality: 'academic',
      enabledSubsystems: ['regular', 'programa-existente', 'adultos'], officialExportsEnabled: false,
    })
    expect(await screen.findByRole('status')).toHaveTextContent('Configuración del centro guardada')
  })

  it('muestra el error del servidor y conserva lo escrito', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn().mockRejectedValue(new Error('No se pudo guardar el centro'))
    render(<SchoolProfileForm profile={profile} onSave={onSave} />)
    const name = screen.getByLabelText(/Nombre de la institución/)
    await user.clear(name)
    await user.type(name, 'Nuevo nombre')
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo guardar el centro')
    expect(name).toHaveValue('Nuevo nombre')
  })

  it('conserva el borrador al recargar el mismo centro y lo reinicia al cambiar de centro', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    const { rerender } = render(<SchoolProfileForm profile={profile} onSave={onSave} />)
    const name = screen.getByLabelText(/Nombre de la institución/)
    await user.clear(name)
    await user.type(name, 'Nombre en edición')
    rerender(<SchoolProfileForm profile={{ ...profile, name: 'Nombre actualizado', updatedAt: '2026-02-01' }} onSave={onSave} />)
    expect(name).toHaveValue('Nombre en edición')
    rerender(<SchoolProfileForm profile={{ ...profile, id: 'school-2', name: 'Otro centro' }} onSave={onSave} />)
    expect(name).toHaveValue('Otro centro')
  })
})
