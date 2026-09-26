import { beforeEach, describe, expect, it, vi } from 'vitest'

const { get, post, signInWithPassword } = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  signInWithPassword: vi.fn(),
}))

vi.mock('@/services/apiClient', () => ({ api: { get, post } }))
vi.mock('@/modules/auth/services/supabaseClient', () => ({
  isRememberSessionEnabled: () => true,
  supabase: { auth: { signInWithPassword } },
}))

import { login } from '@/modules/auth/services/authService'

describe('persistent login', () => {
  beforeEach(() => vi.clearAllMocks())

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
