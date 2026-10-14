import { afterEach, describe, expect, it, vi } from 'vitest'
import { updateOwnProfile } from './profileService'

describe('updateOwnProfile', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('sends personal fields to the authenticated profile endpoint without a target ID', async () => {
    const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ data: { id: 'self', phone: '123' } }), { status: 200 }))
    vi.stubGlobal('fetch', fetch)
    await expect(updateOwnProfile('untrusted-id', {
      fullName: ' Ana ', phone: ' 123 ', avatarUrl: '',
      email: 'other@example.com', status: 'ARCHIVED', roles: ['admin'],
    } as never)).resolves.toHaveProperty('phone', '123')
    expect(fetch).toHaveBeenCalledWith('/api/v1/profile', expect.objectContaining({
      method: 'PATCH', credentials: 'include',
      body: JSON.stringify({ fullName: 'Ana', phone: '123', avatarUrl: null }),
    }))
  })
})
