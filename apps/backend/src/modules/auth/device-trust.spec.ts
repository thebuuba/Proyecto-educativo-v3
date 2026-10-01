import { describe, expect, it } from 'vitest'
import { beforeEach, vi } from 'vitest'
import { ConflictException } from '@nestjs/common'
import { decideDeviceVerification, requireRecentOnboardingProof, requireTrustedDevice } from './device-trust'

const db = vi.hoisted(() => ({ findUnique: vi.fn(), create: vi.fn(), update: vi.fn() }))
vi.mock('@aula/database', () => ({ prisma: { trustedAuthDevice: db } }))

const now = 1_760_000_000

describe('decideDeviceVerification', () => {
  it('permite un dispositivo conocido aunque cambie solo la IP', () => {
    expect(decideDeviceVerification({ trusted: true, browserChanged: false, networkChanged: true, hasTotp: false, aal: 'aal1', amr: [], now })).toBe('allow')
  })

  it('pide verificación ante navegador e IP nuevos', () => {
    expect(decideDeviceVerification({ trusted: true, browserChanged: true, networkChanged: true, hasTotp: false, aal: 'aal1', amr: [], now })).toBe('email')
    expect(decideDeviceVerification({ trusted: false, browserChanged: false, networkChanged: false, hasTotp: true, aal: 'aal1', amr: [], now })).toBe('totp')
  })

  it('acepta solo una verificación reciente del método requerido', () => {
    const base = { trusted: false, browserChanged: false, networkChanged: false, now }
    expect(decideDeviceVerification({ ...base, hasTotp: false, aal: 'aal1', amr: [{ method: 'magiclink', timestamp: now - 60 }] })).toBe('allow')
    expect(decideDeviceVerification({ ...base, hasTotp: false, aal: 'aal1', amr: [{ method: 'magiclink', timestamp: now - 601 }] })).toBe('email')
    expect(decideDeviceVerification({ ...base, hasTotp: true, aal: 'aal2', amr: [{ method: 'totp', timestamp: now - 60 }] })).toBe('allow')
    expect(decideDeviceVerification({ ...base, hasTotp: true, aal: 'aal2', amr: [{ method: 'totp', timestamp: now - 601 }] })).toBe('totp')
  })
})

function token(method: string, timestamp: number) {
  return `header.${Buffer.from(JSON.stringify({ sub: 'auth-user', session_id: 'session-1', aal: 'aal1', amr: [{ method, timestamp }] })).toString('base64url')}.signature`
}

describe('requireTrustedDevice', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.SUPABASE_URL = 'https://example.supabase.co'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'server-key'
    process.env.JWT_SECRET = 'test-secret'
    db.findUnique.mockResolvedValue(null)
    db.create.mockResolvedValue({ id: 'device-1' })
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [] }))
  })

  it('no entrega cookie sin una verificación reciente en navegador nuevo', async () => {
    const request = { headers: {}, get: () => 'Mozilla/5.0 Chrome/100 Windows', ip: '10.0.0.1' }
    const response = { cookie: vi.fn() }
    await expect(requireTrustedDevice(request as never, response as never, 'app-user', 'auth-user', token('password', Math.floor(Date.now() / 1000))))
      .rejects.toBeInstanceOf(ConflictException)
    expect(response.cookie).not.toHaveBeenCalled()
    expect(db.create).not.toHaveBeenCalled()
  })

  it('registra el dispositivo tras enlace de correo reciente', async () => {
    const request = { headers: {}, get: () => 'Mozilla/5.0 Chrome/100 Windows', ip: '10.0.0.1' }
    const response = { cookie: vi.fn() }
    await requireTrustedDevice(request as never, response as never, 'app-user', 'auth-user', token('magiclink', Math.floor(Date.now() / 1000)))
    expect(db.create).toHaveBeenCalledWith({ data: expect.objectContaining({ userId: 'app-user', tokenHash: expect.any(String) }) })
    expect(response.cookie).toHaveBeenCalledWith('aulabase_device', expect.any(String), expect.objectContaining({ httpOnly: true, sameSite: 'lax' }))
  })
})

describe('requireRecentOnboardingProof', () => {
  it('impide escrituras de onboarding con una sesión antigua', () => {
    expect(() => requireRecentOnboardingProof(token('password', Math.floor(Date.now() / 1000)), 'auth-user')).toThrow(ConflictException)
    expect(() => requireRecentOnboardingProof(token('magiclink', Math.floor(Date.now() / 1000)), 'auth-user')).not.toThrow()
  })
})
