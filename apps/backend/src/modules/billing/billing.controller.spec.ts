import { describe, expect, it, vi } from 'vitest'
import { BillingController } from './billing.controller'

describe('checkout HTTP headers', () => {
  it('allows the official Paddle stylesheet while keeping the payment page private', async () => {
    const provider = { checkoutPage: vi.fn().mockResolvedValue('<html>Sandbox</html>') }
    const response = { setHeader: vi.fn(), type: vi.fn(), send: vi.fn() }
    response.type.mockReturnValue(response)
    const controller = new BillingController({} as never, {} as never, provider as never, {} as never)
    await controller.checkoutPage({id:'owner',schoolId:'school',email:'test@example.invalid',roles:['teacher']}, `txn_${'a'.repeat(26)}`, response as never)
    expect(response.setHeader).toHaveBeenCalledWith('Cache-Control', 'private, no-store, max-age=0')
    const policy = response.setHeader.mock.calls.find(([name]) => name === 'Content-Security-Policy')?.[1] as string
    expect(policy).toContain("style-src 'unsafe-inline' https://cdn.paddle.com")
    expect(policy).toMatch(/style-src[^;]*https:\/\/sandbox-cdn.paddle.com/)
    expect(policy).toMatch(/script-src 'nonce-[a-zA-Z0-9_-]+' https:\/\/cdn.paddle.com/)
    expect(policy).toContain("frame-ancestors 'none'")
    expect(response.send).toHaveBeenCalledWith('<html>Sandbox</html>')
  })
})
