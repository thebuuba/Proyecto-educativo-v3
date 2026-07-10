import { describe, it, expect } from 'vitest'

import { getOAuthCallbackPath } from '@/utils/oauthCallback'
import { shouldSearchSchoolQuery } from '@/modules/auth/utils/schoolSearch'

describe('smoke', () => {
  it('works', () => {
    expect(1 + 1).toBe(2)
  })

  it('routes OAuth codes to the callback page', () => {
    expect(getOAuthCallbackPath('/', '?code=abc', '')).toBe('/auth/callback?code=abc')
    expect(getOAuthCallbackPath('/auth/callback', '?code=abc', '')).toBeNull()
  })

  it('does not reopen school search after selecting a school', () => {
    expect(shouldSearchSchoolQuery('AMERICA URBINO', 'AMERICA URBINO')).toBe(false)
    expect(shouldSearchSchoolQuery('AMERICA', null)).toBe(true)
  })
})
