import { beforeEach, describe, expect, it, vi } from 'vitest'

const { get, post, signInWithPassword, signUp, signOut, setSession, clearPersistedSupabaseSession } = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  signInWithPassword: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
  setSession: vi.fn(),
  clearPersistedSupabaseSession: vi.fn(),
}))

vi.mock('@/services/apiClient', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/services/apiClient')>()),
  api: { get, post },
}))
vi.mock('@/modules/auth/services/supabaseClient', () => ({
  isRememberSessionEnabled: () => true,
  clearPersistedSupabaseSession,
  supabase: { auth: { signInWithPassword, signUp, signOut, setSession } },
}))

import { login, logout, register } from '@/modules/auth/services/authService'

describe('registration confirmation', () => {
  beforeEach(() => { vi.clearAllMocks(); localStorage.clear() })

  it('returns confirmation-required without treating a created account as an error', async () => {
    signUp.mockResolvedValue({ data: { session: null }, error: null })
    await expect(register({ fullName: 'Ana Pérez', email: 'ana@example.com', password: 'Clave1234' })).resolves.toBe('confirmation-required')
    expect(signUp).toHaveBeenCalledWith(expect.objectContaining({ options: expect.objectContaining({ emailRedirectTo: expect.stringContaining('/auth/callback') }) }))
    expect(localStorage.getItem('aulabase:registration-name')).toBe('Ana Pérez')
    expect(post).not.toHaveBeenCalled()
  })

  it('continues to setup only when signUp supplies a session', async () => {
    signUp.mockResolvedValue({ data: { session: { access_token: 'test-session' } }, error: null })
    await expect(register({ fullName: 'Ana', email: 'ana@example.com', password: 'Clave1234' })).resolves.toBe('ready')
  })
})

describe('persistent login', () => {
  beforeEach(() => { vi.clearAllMocks(); setSession.mockResolvedValue({ error: null }) })

  it('keeps the renewable Supabase session and creates the AulaBase cookie', async () => {
    signInWithPassword.mockResolvedValue({ data: { session: { access_token: 'supabase-token' } }, error: null })
    post.mockResolvedValue({ user: { id: 'user-1', email: 'teacher@example.com' }, appUser: { id: 'user-1' }, roles: [], permissions: [] })
    get.mockResolvedValue({ appUser: { id: 'user-1' }, roles: [{ key: 'teacher' }], permissions: [{ key: 'courses.read' }], onboardingComplete: true })

    const session = await login({ email: 'teacher@example.com', password: 'secret' })

    expect(signInWithPassword).toHaveBeenCalledWith({ email: 'teacher@example.com', password: 'secret' })
    expect(post).toHaveBeenCalledWith('/auth/session', undefined, expect.objectContaining({
      headers: expect.objectContaining({ Authorization: 'Bearer supabase-token', 'X-Remember-Session': 'true' }),
    }))
    expect(session.permissions).toEqual([{ key: 'courses.read' }])
  })

  it('uses the backend login when the browser cannot reach Supabase directly', async () => {
    const backendSession = {
      user: { id: 'user-1', email: 'teacher@example.com' },
      appUser: { id: 'user-1' },
      roles: [],
      permissions: [],
    }
    signInWithPassword.mockResolvedValue({
      data: { session: null },
      error: { message: 'Failed to fetch' },
    })
    post.mockResolvedValue(backendSession)

    await expect(login({ email: 'teacher@example.com', password: 'secret' })).resolves.toEqual(backendSession)
    expect(post).toHaveBeenCalledWith('/auth/login', {
      email: 'teacher@example.com',
      password: 'secret',
    }, { clearResponseCache: true })
  })
})

describe('logout', () => {
  it('borra el token renovable local incluso si Supabase falla', async () => {
    post.mockResolvedValue({ success: true })
    signOut.mockRejectedValue(new Error('sin conexión'))
    await expect(logout()).resolves.toBeUndefined()
    expect(clearPersistedSupabaseSession).toHaveBeenCalled()
  })

  it('mantiene la sesión provisional sin crear acceso AulaBase si el backend pide verificación', async () => {
    signInWithPassword.mockResolvedValue({ data: { session: null }, error: { message: 'Failed to fetch' } })
    post.mockResolvedValue({ verificationRequired: 'email', supabaseSession: { accessToken: 'token', refreshToken: 'refresh' } })
    await expect(login({ email: 'ada@escuela.edu', password: 'secret' })).rejects.toMatchObject({ status: 409, method: 'email' })
    expect(setSession).toHaveBeenCalledWith({ access_token: 'token', refresh_token: 'refresh' })
  })
})
