import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({})),
}))

import {
  authSessionStorage,
  setRememberSession,
} from '@/modules/auth/services/supabaseClient'

describe('Supabase session storage', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('keeps remembered sessions across browser restarts and other sessions per tab', () => {
    setRememberSession(true)
    authSessionStorage.setItem('supabase-token', 'persistent')
    expect(localStorage.getItem('supabase-token')).toBe('persistent')
    expect(sessionStorage.getItem('supabase-token')).toBeNull()

    setRememberSession(false)
    authSessionStorage.setItem('supabase-token', 'tab-only')
    expect(sessionStorage.getItem('supabase-token')).toBe('tab-only')
    expect(localStorage.getItem('supabase-token')).toBeNull()

    authSessionStorage.removeItem('supabase-token')
    expect(sessionStorage.getItem('supabase-token')).toBeNull()
  })
})
