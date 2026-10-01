import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LoginPage } from './LoginPage'
import { ApiError } from '@/services/apiClient'

const mocks = vi.hoisted(() => ({
  login: vi.fn(),
  loginWithProvider: vi.fn(),
  requestMagicLink: vi.fn(),
  requestPasswordReset: vi.fn(),
  createAulaSession: vi.fn(),
  refreshAuth: vi.fn(),
  getUser: vi.fn(),
  getSession: vi.fn(),
  listFactors: vi.fn(),
  challengeAndVerify: vi.fn(),
}))

vi.mock('@/modules/auth/hooks/useAuth', () => ({
  useAuth: () => ({ authError: null, isAuthenticated: false, loading: false, profileRequired: false, login: mocks.login, loginWithProvider: mocks.loginWithProvider, refreshAuth: mocks.refreshAuth }),
}))
vi.mock('@/modules/auth/services/authService', () => ({
  requestMagicLink: mocks.requestMagicLink,
  requestPasswordReset: mocks.requestPasswordReset,
  createAulaSession: mocks.createAulaSession,
}))
vi.mock('@/modules/auth/services/supabaseClient', () => ({
  supabase: { auth: { getUser: mocks.getUser, getSession: mocks.getSession, mfa: { listFactors: mocks.listFactors, challengeAndVerify: mocks.challengeAndVerify } } },
}))

describe('LoginPage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    mocks.getUser.mockResolvedValue({ data: { user: null } })
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

  it('muestra una cuenta recordada aunque el perfil no tenga nombre', async () => {
    localStorage.setItem('aulabase:last-account', JSON.stringify({ email: 'ada@escuela.edu' }))
    render(<MemoryRouter><LoginPage /></MemoryRouter>)
    expect(screen.getByRole('button', { name: /Continuar como ada@escuela.edu/ })).toBeInTheDocument()
  })

  it('solicita verificación por correo si el backend detecta un navegador nuevo', async () => {
    mocks.login.mockRejectedValue(new ApiError(409, 'VERIFICATION_REQUIRED', 'email'))
    mocks.requestMagicLink.mockResolvedValue(undefined)
    const user = userEvent.setup()
    render(<MemoryRouter><LoginPage /></MemoryRouter>)
    await user.type(screen.getByLabelText('Correo electrónico'), 'ada@escuela.edu')
    await user.type(screen.getByLabelText('Contraseña'), 'clave-secreta')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))
    await user.click(await screen.findByRole('button', { name: 'Enviar enlace de verificación' }))
    expect(mocks.requestMagicLink).toHaveBeenCalledWith('ada@escuela.edu')
  })

  it('completa TOTP antes de reintentar la sesión', async () => {
    mocks.login.mockRejectedValue(new ApiError(409, 'VERIFICATION_REQUIRED', 'totp'))
    mocks.listFactors.mockResolvedValue({ data: { totp: [{ id: 'factor-1' }] }, error: null })
    mocks.challengeAndVerify.mockResolvedValue({ error: null })
    mocks.getSession.mockResolvedValue({ data: { session: { access_token: 'aal2-token' } } })
    mocks.createAulaSession.mockResolvedValue({})
    const user = userEvent.setup()
    render(<MemoryRouter><LoginPage /></MemoryRouter>)
    await user.type(screen.getByLabelText('Correo electrónico'), 'ada@escuela.edu')
    await user.type(screen.getByLabelText('Contraseña'), 'clave-secreta')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))
    await user.type(await screen.findByLabelText('Código de verificación'), '123456')
    await user.click(screen.getByRole('button', { name: 'Verificar' }))
    expect(mocks.challengeAndVerify).toHaveBeenCalledWith({ factorId: 'factor-1', code: '123456' })
    expect(mocks.createAulaSession).toHaveBeenCalledWith('aal2-token')
    expect(mocks.refreshAuth).toHaveBeenCalled()
  })
})
