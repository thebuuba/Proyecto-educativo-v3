import { createHmac } from 'node:crypto'
import { describe, expect, it, vi } from 'vitest'
import {
  PADDLE_SANDBOX_API_ORIGIN,
  PaddleSandboxError,
  createPaddleSandboxClient,
  verifyPaddleSignature,
  type PaddleHttpRequest,
  type PaddleHttpRequestInit,
  type PaddleHttpResponse,
} from './paddle-sandbox'

// ---------------------------------------------------------------------------
// Synthetic helpers. No real network is ever used.
// ---------------------------------------------------------------------------

const SANDBOX_KEY = 'pdl_sdbx_apikey_01abc_TESTONLY_000000000000000000000'
const WEBHOOK_SECRET = 'pdl_ntfset_TESTONLY_webhook_secret'
const NOW = new Date('2026-10-15T14:00:00Z')
const NOW_TS = Math.floor(NOW.getTime() / 1000)

const sign = (ts: number | string, body: string, secret: string) =>
  createHmac('sha256', secret).update(`${ts}:${body}`).digest('hex')

const jsonResponse = (status: number, body: unknown): PaddleHttpResponse => ({
  ok: status >= 200 && status < 300,
  status,
  text: async () => JSON.stringify(body),
})

type RecordedCall = { url: string; init: PaddleHttpRequestInit }

const recordingRequest = (response: PaddleHttpResponse) => {
  const calls: RecordedCall[] = []
  const request: PaddleHttpRequest = async (url, init) => {
    calls.push({ url, init })
    return response
  }
  return { calls, request }
}

const okClient = (response: PaddleHttpResponse) => {
  const { calls, request } = recordingRequest(response)
  const client = createPaddleSandboxClient({
    apiKey: SANDBOX_KEY,
    webhookSecret: WEBHOOK_SECRET,
    request,
    clock: () => NOW,
  })
  return { calls, client }
}

// ---------------------------------------------------------------------------
// Environment guard
// ---------------------------------------------------------------------------

describe('sandbox-only environment', () => {
  it('pins the API origin to the Paddle sandbox host', () => {
    expect(PADDLE_SANDBOX_API_ORIGIN).toBe('https://sandbox-api.paddle.com')
  })

  it('rejects live API keys and keys without the sandbox marker', () => {
    const base = { webhookSecret: WEBHOOK_SECRET }
    expect(() => createPaddleSandboxClient({ ...base, apiKey: 'pdl_live_apikey_01abc' })).toThrow(PaddleSandboxError)
    expect(() => createPaddleSandboxClient({ ...base, apiKey: 'pdl_apikey_01abc' })).toThrow()
    expect(() => createPaddleSandboxClient({ ...base, apiKey: '' })).toThrow()
  })

})

// ---------------------------------------------------------------------------
// Webhook signature verification
// ---------------------------------------------------------------------------

describe('webhook signature verification', () => {
  const body = '{"event_id":"evt_1","event_type":"transaction.completed","data":{"id":"txn_1"}}'

  it('accepts a valid signature over the original bytes', () => {
    const header = `ts=${NOW_TS};h1=${sign(NOW_TS, body, WEBHOOK_SECRET)}`
    expect(verifyPaddleSignature({ rawBody: body, signatureHeader: header, secret: WEBHOOK_SECRET, now: NOW })).toBe(true)
  })

  it('rejects a tampered body, an unknown secret and malformed headers', () => {
    const header = `ts=${NOW_TS};h1=${sign(NOW_TS, body, WEBHOOK_SECRET)}`
    expect(verifyPaddleSignature({ rawBody: body + ' ', signatureHeader: header, secret: WEBHOOK_SECRET, now: NOW })).toBe(false)
    expect(verifyPaddleSignature({ rawBody: body, signatureHeader: header, secret: 'other', now: NOW })).toBe(false)
    expect(verifyPaddleSignature({ rawBody: body, signatureHeader: `h1=deadbeef`, secret: WEBHOOK_SECRET, now: NOW })).toBe(false)
    expect(verifyPaddleSignature({ rawBody: body, signatureHeader: `ts=abc;h1=deadbeef`, secret: WEBHOOK_SECRET, now: NOW })).toBe(false)
    expect(verifyPaddleSignature({ rawBody: body, signatureHeader: null, secret: WEBHOOK_SECRET, now: NOW })).toBe(false)
  })

  it('applies a configurable five-second tolerance in both directions', () => {
    const signAt = (ts: number) => `ts=${ts};h1=${sign(ts, body, WEBHOOK_SECRET)}`
    expect(verifyPaddleSignature({ rawBody: body, signatureHeader: signAt(NOW_TS - 5), secret: WEBHOOK_SECRET, now: NOW })).toBe(true)
    expect(verifyPaddleSignature({ rawBody: body, signatureHeader: signAt(NOW_TS - 6), secret: WEBHOOK_SECRET, now: NOW })).toBe(false)
    expect(verifyPaddleSignature({ rawBody: body, signatureHeader: signAt(NOW_TS + 6), secret: WEBHOOK_SECRET, now: NOW })).toBe(false)
    expect(verifyPaddleSignature({ rawBody: body, signatureHeader: signAt(NOW_TS - 30), secret: WEBHOOK_SECRET, now: NOW, toleranceSeconds: 60 })).toBe(true)
  })

  it('accepts any matching h1 during secret rotation and ignores extra fields', () => {
    const valid = sign(NOW_TS, body, WEBHOOK_SECRET)
    const header = `ts=${NOW_TS};foo=bar;h1=${'a'.repeat(64)};h1=${valid}`
    expect(verifyPaddleSignature({ rawBody: body, signatureHeader: header, secret: WEBHOOK_SECRET, now: NOW })).toBe(true)
  })

  it('treats the body as raw bytes, preserving whitespace and unicode', () => {
    const unicode = '{"name":"María José — 教育","pad":  "yes"}'
    const header = `ts=${NOW_TS};h1=${sign(NOW_TS, unicode, WEBHOOK_SECRET)}`
    expect(verifyPaddleSignature({ rawBody: Buffer.from(unicode, 'utf8'), signatureHeader: header, secret: WEBHOOK_SECRET, now: NOW })).toBe(true)
  })

  it('rejects payloads larger than the configured limit', () => {
    const big = body.repeat(10)
    const header = `ts=${NOW_TS};h1=${sign(NOW_TS, big, WEBHOOK_SECRET)}`
    expect(verifyPaddleSignature({ rawBody: big, signatureHeader: header, secret: WEBHOOK_SECRET, now: NOW, maxBytes: 32 })).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// Remote operations
// ---------------------------------------------------------------------------

describe('remote operations', () => {
  it('allows authenticated cancellation/read APIs without enabling webhook verification', async () => {
    const { request } = recordingRequest(jsonResponse(200, { data: { id: 'sub_01h00000000000000000000000', status: 'active' } }))
    const client = createPaddleSandboxClient({ apiKey: SANDBOX_KEY, webhookSecret: '', request })
    expect((await client.getSubscription('sub_01h00000000000000000000000')).status).toBe('active')
    expect(client.verifyWebhook('{}', 'ts=1;h1=abc')).toBe(false)
  })
  it('retains the provider subscription version instead of relying on delivery order', async () => {
    const { client } = okClient(jsonResponse(200, { data: { id: 'sub_01h00000000000000000000000', status: 'active', updated_at: '2026-10-15T13:00:00Z' } }))
    expect((await client.getSubscription('sub_01h00000000000000000000000')).updatedAt).toBe('2026-10-15T13:00:00Z')
  })
  it('creates a transaction with server-supplied price and customer only', async () => {
    const transaction = {
      data: {
        id: 'txn_01h00000000000000000000000',
        status: 'ready',
        customer_id: 'ctm_01h00000000000000000000000',
        subscription_id: null,
        currency_code: 'USD',
        billed_at: null,
        checkout: { url: 'https://sandbox-api.paddle.com/checkout?_ptxn=txn_01h' },
        details: { totals: { total: '1500' } },
      },
    }
    const { calls, client } = okClient(jsonResponse(201, transaction))
    const result = await client.createTransaction({
      customerId: 'ctm_01h00000000000000000000000',
      priceId: 'pri_01h00000000000000000000000',
      quantity: 2,
      customData: { userId: 'user_1' },
    })

    expect(calls).toHaveLength(1)
    expect(calls[0].url).toBe(`${PADDLE_SANDBOX_API_ORIGIN}/transactions`)
    expect(calls[0].init.method).toBe('POST')
    expect(calls[0].init.headers.Authorization).toBe(`Bearer ${SANDBOX_KEY}`)
    const sent = JSON.parse(calls[0].init.body ?? '{}')
    expect(sent).toEqual({
      items: [{ price_id: 'pri_01h00000000000000000000000', quantity: 2 }],
      customer_id: 'ctm_01h00000000000000000000000',
      custom_data: { userId: 'user_1' },
    })
    // No caller-controlled checkout/return URLs ever leave the server.
    expect(sent.checkout).toBeUndefined()
    expect(sent.return_url).toBeUndefined()

    expect(result).toEqual({
      id: 'txn_01h00000000000000000000000',
      status: 'ready',
      customerId: 'ctm_01h00000000000000000000000',
      subscriptionId: null,
      checkoutUrl: 'https://sandbox-api.paddle.com/checkout?_ptxn=txn_01h',
      currencyCode: 'USD',
      total: '1500',
      billedAt: null,
      billingPeriod: null,
      customData: null,
      priceIds: [],
      updatedAt: null,
    })
  })

  it('maps the provider-owned period, custom data, price ids and update time defensively', async () => {
    const transaction = {
      data: {
        id: 'txn_01h00000000000000000000000',
        status: 'completed',
        customer_id: 'ctm_01h00000000000000000000000',
        subscription_id: 'sub_01h00000000000000000000000',
        currency_code: 'USD',
        billed_at: '2026-10-01T04:00:00Z',
        updated_at: '2026-10-01T04:00:05Z',
        billing_period: { starts_at: '2026-10-01T04:00:00Z', ends_at: '2026-11-01T04:00:00Z' },
        custom_data: { checkoutOperationId: 'op-1' },
        items: [{ price_id: 'pri_01h00000000000000000000000', quantity: 1 }, { quantity: 1 }, 'nope'],
        details: { totals: { total: '1500' } },
      },
    }
    const { client } = okClient(jsonResponse(200, transaction))
    const result = await client.getTransaction('txn_01h00000000000000000000000')

    expect(result.billingPeriod).toEqual({ startsAt: '2026-10-01T04:00:00Z', endsAt: '2026-11-01T04:00:00Z' })
    expect(result.customData).toEqual({ checkoutOperationId: 'op-1' })
    expect(result.priceIds).toEqual(['pri_01h00000000000000000000000'])
    expect(result.updatedAt).toBe('2026-10-01T04:00:05Z')
  })

  it('rejects malformed Paddle identifiers before any request', async () => {
    const { calls, client } = okClient(jsonResponse(201, { data: {} }))
    await expect(client.createTransaction({ customerId: 'user@example.com', priceId: 'pri_x' })).rejects.toBeInstanceOf(PaddleSandboxError)
    expect(calls).toHaveLength(0)
  })

  it('creates a customer portal session and maps deep links', async () => {
    const portal = {
      data: {
        id: 'cpls_01h00000000000000000000000',
        customer_id: 'ctm_01h00000000000000000000000',
        urls: {
          general: { overview: 'https://customer-portal.paddle.com/cpl_1?action=overview' },
          subscriptions: [
            {
              id: 'sub_01h00000000000000000000000',
              cancel_subscription: 'https://customer-portal.paddle.com/cpl_1?action=cancel_subscription',
              update_subscription_payment_method: 'https://customer-portal.paddle.com/cpl_1?action=update_subscription_payment_method',
              view_subscription: 'https://customer-portal.paddle.com/cpl_1?action=view_subscription',
            },
          ],
        },
      },
    }
    const { calls, client } = okClient(jsonResponse(201, portal))
    const result = await client.createCustomerPortalSession({
      customerId: 'ctm_01h00000000000000000000000',
      subscriptionIds: ['sub_01h00000000000000000000000'],
    })

    expect(calls[0].url).toBe(`${PADDLE_SANDBOX_API_ORIGIN}/customers/ctm_01h00000000000000000000000/portal-sessions`)
    expect(JSON.parse(calls[0].init.body ?? '{}')).toEqual({ subscription_ids: ['sub_01h00000000000000000000000'] })
    expect(result.overviewUrl).toBe('https://customer-portal.paddle.com/cpl_1?action=overview')
    expect(result.subscriptions[0]).toEqual({
      id: 'sub_01h00000000000000000000000',
      cancelUrl: 'https://customer-portal.paddle.com/cpl_1?action=cancel_subscription',
      updatePaymentMethodUrl: 'https://customer-portal.paddle.com/cpl_1?action=update_subscription_payment_method',
      viewUrl: 'https://customer-portal.paddle.com/cpl_1?action=view_subscription',
    })
  })

  it('cancels the renewal at the end of the period and maps the scheduled change', async () => {
    const subscription = {
      data: {
        id: 'sub_01h00000000000000000000000',
        status: 'active',
        customer_id: 'ctm_01h00000000000000000000000',
        next_billed_at: '2026-11-01T04:00:00Z',
        current_billing_period: { starts_at: '2026-10-01T04:00:00Z', ends_at: '2026-11-01T04:00:00Z' },
        scheduled_change: { action: 'cancel', effective_at: '2026-11-01T04:00:00Z' },
      },
    }
    const { calls, client } = okClient(jsonResponse(200, subscription))
    const result = await client.cancelSubscriptionAtPeriodEnd({ subscriptionId: 'sub_01h00000000000000000000000' })

    expect(calls[0].url).toBe(`${PADDLE_SANDBOX_API_ORIGIN}/subscriptions/sub_01h00000000000000000000000/cancel`)
    expect(JSON.parse(calls[0].init.body ?? '{}')).toEqual({ effective_from: 'next_billing_period' })
    expect(result).toEqual({
      id: 'sub_01h00000000000000000000000',
      status: 'active',
      customerId: 'ctm_01h00000000000000000000000',
      nextBilledAt: '2026-11-01T04:00:00Z',
      currentBillingPeriod: { startsAt: '2026-10-01T04:00:00Z', endsAt: '2026-11-01T04:00:00Z' },
      scheduledChange: { action: 'cancel', effectiveAt: '2026-11-01T04:00:00Z' },
    })
  })

  it('reads transactions and subscriptions for reconciliation', async () => {
    const { calls, client } = okClient(
      jsonResponse(200, { data: { id: 'txn_01h00000000000000000000000', status: 'completed', customer_id: 'ctm_01h00000000000000000000000', subscription_id: 'sub_01h00000000000000000000000' } }),
    )
    const transaction = await client.getTransaction('txn_01h00000000000000000000000')
    expect(calls[0].url).toBe(`${PADDLE_SANDBOX_API_ORIGIN}/transactions/txn_01h00000000000000000000000`)
    expect(calls[0].init.method).toBe('GET')
    expect(transaction.subscriptionId).toBe('sub_01h00000000000000000000000')

    const sub = await client.getSubscription('sub_01h00000000000000000000000')
    expect(calls[1].url).toBe(`${PADDLE_SANDBOX_API_ORIGIN}/subscriptions/sub_01h00000000000000000000000`)
    expect(sub.id).toBe('txn_01h00000000000000000000000')
  })

  it('lists newest transactions for a server-authorized customer and maps them', async () => {
    const { calls, client } = okClient(
      jsonResponse(200, {
        data: [
          {
            id: 'txn_01h00000000000000000000000',
            status: 'completed',
            customer_id: 'ctm_01h00000000000000000000000',
            subscription_id: 'sub_01h00000000000000000000000',
            updated_at: '2026-10-01T04:00:05Z',
            billing_period: { starts_at: '2026-10-01T04:00:00Z', ends_at: '2026-11-01T04:00:00Z' },
            details: { totals: { total: '1500' } },
          },
          'not-an-object',
        ],
      }),
    )

    const transactions = await client.listTransactions('ctm_01h00000000000000000000000')

    expect(calls).toHaveLength(1)
    expect(calls[0].url).toBe(`${PADDLE_SANDBOX_API_ORIGIN}/transactions?customer_id=ctm_01h00000000000000000000000&per_page=200`)
    expect(calls[0].init.method).toBe('GET')
    expect(transactions).toHaveLength(1)
    expect(transactions[0]).toMatchObject({
      id: 'txn_01h00000000000000000000000',
      status: 'completed',
      customerId: 'ctm_01h00000000000000000000000',
      subscriptionId: 'sub_01h00000000000000000000000',
      total: '1500',
      updatedAt: '2026-10-01T04:00:05Z',
    })
  })

  it('rejects a malformed customer id before listing transactions', async () => {
    const { calls, client } = okClient(jsonResponse(200, { data: [] }))
    await expect(client.listTransactions('user@example.com')).rejects.toBeInstanceOf(PaddleSandboxError)
    expect(calls).toHaveLength(0)
  })

  it('only ever talks to the sandbox origin', async () => {
    const { calls, client } = okClient(jsonResponse(200, { data: { id: 'sub_01h00000000000000000000000', status: 'active', customer_id: 'ctm_01h00000000000000000000000' } }))
    await client.getSubscription('sub_01h00000000000000000000000')
    await client.getTransaction('txn_01h00000000000000000000000').catch(() => undefined)
    expect(calls.every((call) => call.url.startsWith(PADDLE_SANDBOX_API_ORIGIN))).toBe(true)
    expect(calls.every((call) => !call.url.includes('api.paddle.com') || call.url.startsWith(PADDLE_SANDBOX_API_ORIGIN))).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Failure handling
// ---------------------------------------------------------------------------

describe('failure handling', () => {
  it('surfaces a sanitized error without leaking the API key or secret', async () => {
    const leaked = `Unauthorized: Bearer ${SANDBOX_KEY} secret ${WEBHOOK_SECRET}`
    const { client } = okClient(jsonResponse(401, { error: { code: 'unauthorized', detail: leaked }, meta: { request_id: 'req_1' } }))
    await expect(client.getTransaction('txn_01h00000000000000000000000')).rejects.toMatchObject({
      name: 'PaddleSandboxError',
      status: 401,
      code: 'unauthorized',
    })
    try {
      await client.getTransaction('txn_01h00000000000000000000000')
    } catch (error) {
      const message = (error as Error).message
      expect(message).not.toContain(SANDBOX_KEY)
      expect(message).not.toContain(WEBHOOK_SECRET)
      expect(message).not.toContain('Bearer')
    }
  })

  it('aborts requests that exceed the timeout without echoing secrets', async () => {
    const request: PaddleHttpRequest = (_url, init) =>
      new Promise((_resolve, reject) => {
        init.signal?.addEventListener('abort', () => {
          const error = new Error('aborted')
          error.name = 'AbortError'
          reject(error)
        })
      })
    const client = createPaddleSandboxClient({ apiKey: SANDBOX_KEY, webhookSecret: WEBHOOK_SECRET, request, timeoutMs: 5 })
    await expect(client.getTransaction('txn_01h00000000000000000000000')).rejects.toMatchObject({ code: 'timeout' })
  })

  it('maps network failures and invalid JSON without leaking internals', async () => {
    const networkClient = createPaddleSandboxClient({
      apiKey: SANDBOX_KEY,
      webhookSecret: WEBHOOK_SECRET,
      request: async () => {
        throw new Error(`socket error using ${SANDBOX_KEY}`)
      },
    })
    await expect(networkClient.getTransaction('txn_01h00000000000000000000000')).rejects.toMatchObject({ code: 'network_error' })

    const badJson = createPaddleSandboxClient({ apiKey: SANDBOX_KEY, webhookSecret: WEBHOOK_SECRET, request: async () => ({ ok: true, status: 200, text: async () => 'not json' }) })
    await expect(badJson.getTransaction('txn_01h00000000000000000000000')).rejects.toMatchObject({ code: 'invalid_response' })
  })

  it('verifies webhooks through the configured secret and clock', () => {
    const body = '{"event_id":"evt_1"}'
    const { client } = okClient(jsonResponse(200, {}))
    const header = `ts=${NOW_TS};h1=${sign(NOW_TS, body, WEBHOOK_SECRET)}`
    expect(client.verifyWebhook(body, header)).toBe(true)
    expect(client.verifyWebhook(body, `ts=${NOW_TS};h1=${'0'.repeat(64)}`)).toBe(false)
  })
})

// Keep vi imported for future timer-based tests without changing test discovery.
void vi
