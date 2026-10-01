import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '@/services/apiClient'
import { useAuth } from '../hooks/useAuth'
import { AuthProvider } from './AuthProvider'

const mocks = vi.hoisted(() => ({
  getAuthBootstrap: vi.fn(),
  createAulaSession: vi.fn(),
  getOnboardingStatus: vi.fn(),
  refreshSession: vi.fn(),
  onAuthStateChange: vi.fn(),
}))

vi.mock('../services/authService', () => ({
  getAuthBootstrap: mocks.getAuthBootstrap,
  createAulaSession: mocks.createAulaSession,
  getOnboardingStatus: mocks.getOnboardingStatus,
}))
vi.mock('../services/supabaseClient', () => ({
  supabase: { auth: { refreshSession: mocks.refreshSession, onAuthStateChange: mocks.onAuthStateChange } },
}))

function Status() {
  const { isAuthenticated, loading } = useAuth()
  return <span>{loading ? 'cargando' : isAuthenticated ? 'autenticado' : 'sin sesión'}</span>
}

describe('AuthProvider: sesión persistente', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    mocks.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } })
    mocks.getOnboardingStatus.mockResolvedValue({ complete: true })
  })

  it('recrea la cookie del backend desde una sesión Supabase guardada', async () => {
    mocks.getAuthBootstrap.mockRejectedValue(new ApiError(401, 'Unauthorized'))
    mocks.refreshSession.mockResolvedValue({ data: { session: { access_token: 'renewed-token' } }, error: null })
    mocks.createAulaSession.mockResolvedValue({
      user: { id: 'user-1', email: 'ada@escuela.edu' },
      appUser: { id: 'user-1', email: 'ada@escuela.edu', fullName: 'Ada Pérez', avatarUrl: null },
      roles: [], permissions: [],
    })
    render(<AuthProvider><Status /></AuthProvider>)
    await waitFor(() => expect(screen.getByText('autenticado')).toBeInTheDocument())
    expect(mocks.createAulaSession).toHaveBeenCalledWith('renewed-token')
    expect(localStorage.getItem('aulabase:last-account')).toContain('ada@escuela.edu')
  })
})
