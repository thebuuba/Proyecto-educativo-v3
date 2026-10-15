import { afterEach, describe, expect, it, vi } from 'vitest'
import { checkoutBaseUrl, checkoutClientToken, checkoutPageHtml, checkoutPath } from './billing-checkout-page'

afterEach(() => vi.unstubAllEnvs())
const transaction = `txn_${'a'.repeat(26)}`
const token = `test_${'b'.repeat(27)}`

describe('sandbox checkout payment page', () => {
  it('requires a sandbox client token before allowing checkout', () => {
    for (const value of ['', `live_${'b'.repeat(27)}`, 'test_<script>']) {
      vi.stubEnv('PADDLE_SANDBOX_CLIENT_TOKEN', value)
      expect(() => checkoutClientToken()).toThrow()
    }
    vi.stubEnv('PADDLE_SANDBOX_CLIENT_TOKEN', token)
    expect(checkoutClientToken()).toBe(token)
  })
  it('pins payment links to the application and permits HTTP only on loopback', () => {
    vi.stubEnv('FRONTEND_URL', 'https://staging.example.invalid')
    expect(checkoutBaseUrl()).toBe('https://staging.example.invalid/api/v1/billing/checkout-page')
    vi.stubEnv('FRONTEND_URL', 'http://localhost:5173')
    expect(checkoutBaseUrl()).toBe('http://localhost:5173/api/v1/billing/checkout-page')
    for (const value of ['', 'http://example.invalid', 'https://user:pass@example.invalid', 'https://example.invalid/?next=evil']) {
      vi.stubEnv('FRONTEND_URL', value)
      expect(() => checkoutBaseUrl()).toThrow()
    }
  })
  it('rejects arbitrary transaction identifiers and creates only a local route', () => {
    expect(checkoutPath(transaction)).toBe(`/api/v1/billing/checkout-page?_ptxn=${transaction}`)
    expect(() => checkoutPath('txn_<script>')).toThrow()
  })
  it('initializes Paddle.js in sandbox and never embeds private credentials', () => {
    const html = checkoutPageHtml(token, 'safe-nonce')
    expect(html).toContain('https://cdn.paddle.com/paddle/v2/paddle.js')
    expect(html).toContain('Paddle.Environment.set("sandbox")')
    expect(html).toContain(`token: "${token}"`)
    expect(html).toContain('nonce="safe-nonce"')
    expect(html).toContain('/cuenta/suscripcion')
    expect(html).not.toContain('apiKey')
    expect(html).not.toContain('checkout.completed')
  })
  it('only offers card as a payment method in the sandbox checkout', () => {
    const html = checkoutPageHtml(token, 'safe-nonce')
    expect(html).toContain('allowedPaymentMethods')
    expect(html).toContain('["card"]')
    expect(html).not.toMatch(/paypal|apple_pay|google_pay/i)
  })
})
