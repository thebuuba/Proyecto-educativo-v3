import { describe, expect, it } from 'vitest'
import { isRecoveryRoute } from './billing-access'

describe('expired accounts retain only explicit recovery routes', () => {
  it.each(['/api/v1/auth/me', '/api/v1/billing/support', '/api/v1/profile', '/api/v1/onboarding', '/api/v1/school-administration'])('allows %s', path => {
    expect(isRecoveryRoute(path)).toBe(true)
  })
  it.each(['/api/v1/billing-escape', '/api/v1/profile-other', '/api/v1/students', '/api/v1/reports/download', '/api/v1/resources', '/api/v1/activities', '/api/v1/grading'])('requires coverage for %s', path => {
    expect(isRecoveryRoute(path)).toBe(false)
  })
})
