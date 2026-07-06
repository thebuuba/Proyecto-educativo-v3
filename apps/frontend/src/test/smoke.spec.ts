import { describe, it, expect } from 'vitest'

import { getOAuthCallbackPath } from '@/App'

describe('smoke', () => {
  it('works', () => {
    expect(1 + 1).toBe(2)
  })

  it('routes OAuth codes to the callback page', () => {
    expect(getOAuthCallbackPath('/', '?code=abc', '')).toBe('/auth/callback?code=abc')
    expect(getOAuthCallbackPath('/auth/callback', '?code=abc', '')).toBeNull()
  })
})
