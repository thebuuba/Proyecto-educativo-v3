import { ConflictException } from '@nestjs/common'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthController } from './auth.controller'

const trust = vi.hoisted(() => ({ requireTrustedDevice: vi.fn(), requireRecentOnboardingProof: vi.fn(), isDeviceTrustEnabled: vi.fn() }))
vi.mock('./device-trust', () => trust)
vi.mock('./supabase-user', () => ({ getSupabaseUserFromToken: vi.fn().mockResolvedValue({ id: 'auth-user' }) }))
vi.mock('@aula/database', () => ({ prisma: { appUser: { findUnique: vi.fn().mockResolvedValue({ id: 'app-user' }) } } }))

describe('AuthController: emisión de sesión', () => {
  const session = { token: 'app-token', appUser: { id: 'app-user', authUserId: 'auth-user' }, user: { id: 'app-user' }, roles: [], permissions: [] }
  const authService = {
    createSessionFromSupabaseToken: vi.fn(),
    loginWithToken: vi.fn(),
    completeOnboarding: vi.fn(),
  }
  const request = { headers: {} }
  const response = { cookie: vi.fn(), setHeader: vi.fn() }

  beforeEach(() => {
    vi.clearAllMocks()
    trust.isDeviceTrustEnabled.mockReturnValue(true)
    authService.createSessionFromSupabaseToken.mockResolvedValue(session)
    authService.completeOnboarding.mockResolvedValue(session)
    authService.loginWithToken.mockResolvedValue({ session, authUserId: 'auth-user', accessToken: 'supabase-token', refreshToken: 'refresh-token' })
  })

  it('verifica el dispositivo antes de entregar la cookie en /auth/session', async () => {
    trust.requireTrustedDevice.mockRejectedValue(new Error('challenge'))
    const controller = new AuthController(authService as never)
    await expect(controller.createSession('Bearer supabase-token', 'true', request as never, response as never)).rejects.toThrow('challenge')
    expect(response.cookie).not.toHaveBeenCalled()
  })

  it('aplica la misma regla al login alternativo y onboarding', async () => {
    trust.requireTrustedDevice.mockRejectedValue(new Error('challenge'))
    const controller = new AuthController(authService as never)
    await expect(controller.login({ email: 'a@b.co', password: 'secret' }, request as never, response as never)).rejects.toThrow('challenge')
    await expect(controller.completeOnboarding('Bearer supabase-token', {} as never, request as never, response as never)).rejects.toThrow('challenge')
    expect(response.cookie).not.toHaveBeenCalled()
  })

  it('devuelve solo una sesión provisional de Supabase cuando el login alternativo exige verificación', async () => {
    trust.requireTrustedDevice.mockRejectedValue(new ConflictException({ message: 'VERIFICATION_REQUIRED', code: 'VERIFICATION_REQUIRED', method: 'email' }))
    const result = await new AuthController(authService as never).login({ email: 'a@b.co', password: 'secret' }, request as never, response as never)
    expect(result).toEqual({ verificationRequired: 'email', supabaseSession: { accessToken: 'supabase-token', refreshToken: 'refresh-token' } })
    expect(response.cookie).not.toHaveBeenCalled()
  })

  it('no permite el registro alternativo que emitiría cookie sin verificar', async () => {
    const controller = new AuthController(authService as never)
    await expect(controller.register({} as never, response as never)).rejects.toThrow('Usa el registro web')
    expect(response.cookie).not.toHaveBeenCalled()
  })
})
