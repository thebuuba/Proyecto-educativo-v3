import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
function ProfileDraft() {
  const { loading, refreshAuth } = useAuth()
  return loading ? <span>Cargando cuenta</span> : <div><input aria-label="Borrador" defaultValue="" /><button onClick={() => void refreshAuth({ background: true })}>Actualizar identidad</button></div>
}

describe('AuthProvider: sesión persistente', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    mocks.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } })
    mocks.getOnboardingStatus.mockResolvedValue({ complete: true })
  })

  it('refreshes identity in the background without unmounting an unsaved form', async () => {
    const session = { appUser: {id:'user-1',fullName:'Ana',email:'ana@example.com',avatarUrl:null},roles:[],permissions:[],onboardingComplete:true }
    mocks.getAuthBootstrap.mockResolvedValueOnce(session)
    let complete!: (value: typeof session) => void
    mocks.getAuthBootstrap.mockImplementationOnce(() => new Promise(resolve => { complete = resolve }))
    const user = userEvent.setup()
    render(<AuthProvider><ProfileDraft /></AuthProvider>)
    await user.type(await screen.findByLabelText('Borrador'),'Sin guardar')
    await user.click(screen.getByRole('button',{name:'Actualizar identidad'}))
    expect(screen.getByLabelText('Borrador')).toHaveValue('Sin guardar')
    await act(async () => complete({...session,appUser:{...session.appUser,fullName:'Ana Real'}}))
    expect(screen.getByLabelText('Borrador')).toHaveValue('Sin guardar')
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
