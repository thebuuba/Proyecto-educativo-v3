import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ProfilePage } from './ProfilePage'

const auth = vi.hoisted(() => ({ appUser: null as null | { id: string; fullName: string; email: string; phone: string; avatarUrl: string; schoolId: string; status: string }, roles: [], refreshAuth: vi.fn() }))
vi.mock('@/modules/auth/hooks/useAuth', () => ({ useAuth: () => auth }))
afterEach(() => { cleanup(); auth.appUser = null })

describe('perfil en configuración', () => {
  it('carga los datos que llegan después del primer render y conserva las ediciones en un refresco', () => {
    const { rerender } = render(<ProfilePage embedded />)
    auth.appUser = { id: 'user-1', fullName: 'Ana Pérez', email: 'ana@aula.test', phone: '555', avatarUrl: '', schoolId: 'uuid-interno', status: 'active' }
    rerender(<ProfilePage embedded />)
    expect(screen.getByRole('textbox', { name: 'Nombre completo' })).toHaveValue('Ana Pérez')
    fireEvent.change(screen.getByRole('textbox', { name: 'Nombre completo' }), { target: { value: 'Ana editada' } })
    auth.appUser = { ...auth.appUser, fullName: 'Ana actualizada' }
    rerender(<ProfilePage embedded />)
    expect(screen.getByRole('textbox', { name: 'Nombre completo' })).toHaveValue('Ana editada')
    expect(screen.getByRole('heading', { name: 'Preferencias de interfaz' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Perfil' })).not.toBeInTheDocument()
    expect(screen.queryByText('uuid-interno')).not.toBeInTheDocument()
  })
})
