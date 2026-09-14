import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({})),
}))

import {
  authSessionStorage,
} from '@/modules/auth/services/supabaseClient'

describe('Supabase session storage', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('keeps sessions across browser restarts and migrates old tab sessions', () => {
    authSessionStorage.setItem('supabase-token', 'persistent')
    expect(localStorage.getItem('supabase-token')).toBe('persistent')
    expect(sessionStorage.getItem('supabase-token')).toBeNull()

    localStorage.removeItem('supabase-token')
    sessionStorage.setItem('supabase-token', 'old-tab-session')
    expect(authSessionStorage.getItem('supabase-token')).toBe('old-tab-session')
    expect(localStorage.getItem('supabase-token')).toBe('old-tab-session')
    expect(sessionStorage.getItem('supabase-token')).toBeNull()

    authSessionStorage.removeItem('supabase-token')
    expect(sessionStorage.getItem('supabase-token')).toBeNull()
  })
})
