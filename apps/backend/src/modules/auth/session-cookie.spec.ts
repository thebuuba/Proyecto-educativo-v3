import { describe, expect, it } from 'vitest'
import { getSessionToken, SESSION_COOKIE_NAME } from './session-cookie'

describe('session cookie', () => {
  it('extracts the Aula Base token among other cookies', () => {
    const request = { headers: { cookie: `theme=dark; ${SESSION_COOKIE_NAME}=signed.jwt.value; locale=es` } }
    expect(getSessionToken(request as never)).toBe('signed.jwt.value')
  })

  it('returns null when the session cookie is absent', () => {
    expect(getSessionToken({ headers: { cookie: 'theme=dark' } } as never)).toBeNull()
    expect(getSessionToken({ headers: {} } as never)).toBeNull()
  })
})
