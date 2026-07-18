import { describe, expect, it, vi } from 'vitest'
import { getSessionToken, SESSION_COOKIE_NAME, setSessionCookie } from './session-cookie'

describe('session cookie', () => {
  it('extracts the Aula Base token among other cookies', () => {
    const request = { headers: { cookie: `theme=dark; ${SESSION_COOKIE_NAME}=signed.jwt.value; locale=es` } }
    expect(getSessionToken(request as never)).toBe('signed.jwt.value')
  })

  it('returns null when the session cookie is absent', () => {
    expect(getSessionToken({ headers: { cookie: 'theme=dark' } } as never)).toBeNull()
    expect(getSessionToken({ headers: {} } as never)).toBeNull()
  })

  it('uses a secure same-site cookie in a production Worker', () => {
    process.env.CLOUDFLARE_WORKER_PRODUCTION = 'true'
    const response = {
      cookie: vi.fn(),
      setHeader: vi.fn(),
    }

    setSessionCookie(response as never, 'signed.jwt.value', true)

    expect(response.cookie).toHaveBeenCalledWith(SESSION_COOKIE_NAME, 'signed.jwt.value', expect.objectContaining({
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 8 * 60 * 60 * 1000,
    }))
    delete process.env.CLOUDFLARE_WORKER_PRODUCTION
  })

  it('uses a browser-session cookie when remember me is disabled', () => {
    const response = { cookie: vi.fn(), setHeader: vi.fn() }

    setSessionCookie(response as never, 'signed.jwt.value')

    expect(response.cookie).toHaveBeenCalledWith(
      SESSION_COOKIE_NAME,
      'signed.jwt.value',
      expect.not.objectContaining({ maxAge: expect.any(Number) }),
    )
  })
})
