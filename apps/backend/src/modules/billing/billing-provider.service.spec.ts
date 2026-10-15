import { afterEach, describe, expect, it, vi } from 'vitest'
import { BillingProviderService, sandboxDestination } from './billing-provider.service'

describe('sandbox commercial boundaries', () => {
  afterEach(() => vi.unstubAllEnvs())
  it('rejects non-sandbox, deceptive, credential-bearing and non-HTTPS destinations', () => {
    for (const url of ['https://checkout.paddle.com/pay', 'https://sandbox-checkout.paddle.com.evil.invalid', 'http://sandbox-checkout.paddle.com', 'https://user:pass@sandbox-checkout.paddle.com']) {
      expect(() => sandboxDestination(url)).toThrow()
    }
    expect(sandboxDestination('https://sandbox-checkout.paddle.com/pay')).toBe('https://sandbox-checkout.paddle.com/pay')
  })
  it('does not initiate a checkout while installation or new contracting is disabled', async () => {
    vi.stubEnv('BILLING_ENABLED', 'false')
    await expect(new BillingProviderService().checkout({ id: 'x', schoolId: 's', roles: ['teacher'], email: 'test@example.invalid' }, {
      priceId: 'x', acceptEarlyEnd: false, termsVersion: 'unapproved',
    })).rejects.toThrow()
  })
})
