import { beforeEach, describe, expect, it, vi } from 'vitest'
vi.mock('@supabase/supabase-js', () => ({ createClient: vi.fn(() => ({})) }))
import { authSessionStorage, clearPersistedSupabaseSession, isRememberSessionEnabled, setRememberSessionEnabled } from './supabaseClient'

describe('consentimiento de persistencia de sesión', () => {
  beforeEach(() => { localStorage.clear(); sessionStorage.clear() })
  it('usa solamente la pestaña por defecto', () => {
    expect(isRememberSessionEnabled()).toBe(false)
    authSessionStorage.setItem('test-token', 'temporary')
    expect(sessionStorage.getItem('test-token')).toBe('temporary')
    expect(localStorage.getItem('test-token')).toBeNull()
    sessionStorage.clear()
    expect(authSessionStorage.getItem('test-token')).toBeNull()
  })
  it('no restaura tokens antiguos persistidos sin consentimiento', () => {
    localStorage.setItem('test-token', 'legacy')
    expect(authSessionStorage.getItem('test-token')).toBeNull()
  })
  it('conserva sesión entre reinicios solo al marcar Recordar', () => {
    setRememberSessionEnabled(true)
    authSessionStorage.setItem('test-token', 'persistent')
    sessionStorage.clear()
    expect(isRememberSessionEnabled()).toBe(true)
    expect(authSessionStorage.getItem('test-token')).toBe('persistent')
  })
  it('al revocar elimina la copia persistente sin perder la sesión actual', () => {
    setRememberSessionEnabled(true)
    authSessionStorage.setItem('test-token', 'session')
    authSessionStorage.setItem('test-verifier', 'pkce')
    setRememberSessionEnabled(false)
    expect(localStorage.getItem('test-token')).toBeNull()
    expect(localStorage.getItem('test-verifier')).toBeNull()
    expect(authSessionStorage.getItem('test-token')).toBe('session')
    expect(authSessionStorage.getItem('test-verifier')).toBe('pkce')
    sessionStorage.clear()
    expect(authSessionStorage.getItem('test-token')).toBeNull()
  })
  it('no asciende automáticamente una sesión de pestaña a persistente', () => {
    authSessionStorage.setItem('test-token', 'session')
    expect(authSessionStorage.getItem('test-token')).toBe('session')
    expect(localStorage.getItem('test-token')).toBeNull()
  })
  it('logout limpia ambas ubicaciones y la preferencia', () => {
    setRememberSessionEnabled(true)
    authSessionStorage.setItem('test-token', 'session')
    clearPersistedSupabaseSession()
    expect(localStorage.getItem('test-token')).toBeNull()
    expect(sessionStorage.getItem('test-token')).toBeNull()
    expect(isRememberSessionEnabled()).toBe(false)
  })
  it('permite abrir el enlace PKCE en otra pestaña sin persistir la sesión', () => {
    const url = import.meta.env.VITE_SUPABASE_URL
    if (!url) throw new Error('VITE_SUPABASE_URL es necesaria para esta prueba.')
    const key = `sb-${new URL(url).hostname.split('.')[0]}-auth-token-code-verifier`
    const clock = vi.spyOn(Date, 'now').mockReturnValue(1000)
    authSessionStorage.setItem(key, 'single-use-verifier')
    authSessionStorage.setItem('test-token', 'tab-only')
    sessionStorage.clear()
    expect(authSessionStorage.getItem(key)).toBe('single-use-verifier')
    expect(authSessionStorage.getItem('test-token')).toBeNull()
    expect(isRememberSessionEnabled()).toBe(false)
    clock.mockReturnValue(1000 + 60 * 60 * 1000 + 1)
    expect(authSessionStorage.getItem(key)).toBeNull()
    expect(localStorage.getItem(key)).toBeNull()
    clock.mockRestore()
  })

})
