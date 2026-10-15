import { afterEach, describe, expect, it, vi } from 'vitest'
import { BillingProviderService, sandboxDestination } from './billing-provider.service'

const { subscription } = vi.hoisted(() => ({ subscription: { findFirst: vi.fn() } }))
vi.mock('@aula/database', () => ({ prisma: { billingSubscription: subscription } }))

describe('sandbox commercial boundaries', () => {
  afterEach(() => { vi.unstubAllEnvs(); vi.resetAllMocks() })
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
  it('renders a payment page only for the reserved transaction of its authenticated owner', async () => {
    vi.stubEnv('BILLING_ENABLED', 'true')
    vi.stubEnv('BILLING_CHECKOUT_ENABLED', 'true')
    vi.stubEnv('BILLING_EVENTS_ENABLED', 'true')
    vi.stubEnv('BILLING_ENVIRONMENT', 'sandbox')
    vi.stubEnv('PADDLE_SANDBOX_CLIENT_TOKEN', `test_${'b'.repeat(27)}`)
    const user = { id: 'owner', schoolId: 'school', roles: ['teacher'], email: 'test@example.invalid' }
    const transaction = `txn_${'a'.repeat(26)}`
    subscription.findFirst.mockResolvedValueOnce(null)
    await expect(new BillingProviderService().checkoutPage(user, transaction, 'nonce')).rejects.toThrow('Intento de pago no disponible')
    expect(subscription.findFirst).toHaveBeenCalledWith({ where: {
      account: { userId: 'owner', status: 'ACTIVE' }, provider: 'PADDLE', environment: 'SANDBOX', status: 'INCOMPLETE',
      metadata: { path: ['checkoutTransactionId'], equals: transaction },
    } })
    subscription.findFirst.mockResolvedValueOnce({ id: 'reserved' })
    await expect(new BillingProviderService().checkoutPage(user, transaction, 'nonce')).resolves.toContain('Paddle.Environment.set("sandbox")')
    await expect(new BillingProviderService().checkoutPage(user, 'arbitrary', 'nonce')).rejects.toThrow()
    expect(subscription.findFirst).toHaveBeenCalledTimes(2)
  })
})
