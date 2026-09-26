import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LoginPage } from './LoginPage'

const mocks = vi.hoisted(() => ({
  login: vi.fn(),
  loginWithProvider: vi.fn(),
  requestMagicLink: vi.fn(),
  requestPasswordReset: vi.fn(),
}))

vi.mock('@/modules/auth/hooks/useAuth', () => ({
  useAuth: () => ({ authError: null, isAuthenticated: false, loading: false, profileRequired: false, login: mocks.login, loginWithProvider: mocks.loginWithProvider }),
}))
vi.mock('@/modules/auth/services/authService', () => ({
  requestMagicLink: mocks.requestMagicLink,
  requestPasswordReset: mocks.requestPasswordReset,
}))

describe('LoginPage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('recupera la cuenta recordada y permite entrar con enlace de correo', async () => {
    localStorage.setItem('aulabase:last-account', JSON.stringify({ email: 'ada@escuela.edu', fullName: 'Ada Pérez', role: 'Docente' }))
    mocks.requestMagicLink.mockResolvedValue(undefined)
    const user = userEvent.setup()

    render(<MemoryRouter><LoginPage /></MemoryRouter>)

    expect(screen.getByRole('button', { name: /Continuar como Ada/ })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Continuar como Ada/ }))
    await user.click(screen.getByRole('button', { name: 'Entrar con un enlace al correo' }))

    expect(mocks.requestMagicLink).toHaveBeenCalledWith('ada@escuela.edu')
    expect(screen.getByText(/Enviamos un enlace de acceso/)).toBeInTheDocument()
  })
})
