import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from './apiClient'

describe('api client session transport', () => {
  beforeEach(() => {
    localStorage.setItem('auth_token', 'legacy-token-that-must-not-be-used')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ data: { ok: true } }),
    }))
  })

  it('sends a legacy bearer token only during backend migration', async () => {
    await api.get('/profile')

    expect(fetch).toHaveBeenCalledWith('/api/v1/profile', expect.objectContaining({
      credentials: 'include',
      headers: expect.objectContaining({ Authorization: 'Bearer legacy-token-that-must-not-be-used' }),
    }))
  })

  it('uses only the HttpOnly cookie once no legacy token exists', async () => {
    localStorage.removeItem('auth_token')
    await api.get('/profile')

    expect(fetch).toHaveBeenCalledWith('/api/v1/profile', expect.objectContaining({
      credentials: 'include',
      headers: expect.not.objectContaining({ Authorization: expect.anything() }),
    }))
  })

  it('uses cookie credentials for state-changing requests', async () => {
    await api.post('/auth/logout')

    expect(fetch).toHaveBeenCalledWith('/api/v1/auth/logout', expect.objectContaining({
      method: 'POST',
      credentials: 'include',
    }))
  })
})
