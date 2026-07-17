import { describe, expect, it } from 'vitest'

import { ApiError } from '@/services/apiClient'
import { shouldReportBootstrapFailure } from './bootstrapFailure'

describe('bootstrap failure reporting', () => {
  it('does not persist transient network failures on the login screen', () => {
    expect(shouldReportBootstrapFailure(new TypeError('Failed to fetch'))).toBe(false)
  })

  it('does not present backend startup failures as profile errors', () => {
    expect(shouldReportBootstrapFailure(new ApiError(500, 'Proxy error'))).toBe(false)
    expect(shouldReportBootstrapFailure(new ApiError(503, 'Service unavailable'))).toBe(false)
  })

  it('keeps actionable client failures visible', () => {
    expect(shouldReportBootstrapFailure(new ApiError(403, 'Forbidden'))).toBe(true)
  })
})
