import { createHmac, timingSafeEqual } from 'node:crypto'

/**
 * Sandbox-only Paddle Billing adapter.
 *
 * Deliberately avoids the official SDK and any extra dependency: it uses the
 * platform `fetch` and `node:crypto`. It is meant to be consumed from a
 * backend service, never from the browser or an academic module.
 *
 * Hard guarantees:
 * - The API origin is pinned to the Paddle sandbox host. There is no option to
 *   point the adapter at production or any caller-supplied URL.
 * - Live API keys are rejected; only keys carrying the `_sdbx` sandbox marker
 *   are accepted.
 * - Webhook signatures are verified over the original request bytes using
 *   HMAC-SHA256 (ts/h1), a timing-safe comparison and a configurable tolerance.
 * - Errors never echo the API key or webhook secret.
 */

export const PADDLE_SANDBOX_API_ORIGIN = 'https://sandbox-api.paddle.com' as const
export const PADDLE_WEBHOOK_TOLERANCE_SECONDS = 5 as const
export const PADDLE_WEBHOOK_MAX_BYTES = 1_048_576 as const
export const PADDLE_DEFAULT_TIMEOUT_MS = 10_000 as const
/**
 * Paddle caps `per_page` at 200. The adapter intentionally fetches a single page
 * and does not implement cursor pagination, so at most the newest 200 transactions
 * for a customer are visible to reconciliation.
 */
export const PADDLE_LIST_PAGE_SIZE = 200 as const

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

export interface PaddleSandboxErrorOptions {
  status?: number | null
  code?: string | null
  requestId?: string | null
  retryable?: boolean
}

export class PaddleSandboxError extends Error {
  readonly status: number | null
  readonly code: string | null
  readonly requestId: string | null
  readonly retryable: boolean

  constructor(message: string, options: PaddleSandboxErrorOptions = {}) {
    super(message)
    this.name = 'PaddleSandboxError'
    this.status = options.status ?? null
    this.code = options.code ?? null
    this.requestId = options.requestId ?? null
    this.retryable = options.retryable ?? false
  }
}

// ---------------------------------------------------------------------------
// HTTP transport (injectable, so tests never touch the network)
// ---------------------------------------------------------------------------

export type PaddleHttpMethod = 'GET' | 'POST' | 'PATCH'

export interface PaddleHttpRequestInit {
  method: PaddleHttpMethod
  headers: Record<string, string>
  body?: string
  signal?: AbortSignal
}

export interface PaddleHttpResponse {
  status: number
  ok: boolean
  text(): Promise<string>
}

export type PaddleHttpRequest = (url: string, init: PaddleHttpRequestInit) => Promise<PaddleHttpResponse>

const defaultRequest: PaddleHttpRequest = async (url, init) => {
  const response = await fetch(url, {
    method: init.method,
    headers: init.headers,
    body: init.body,
    signal: init.signal,
  })
  return { status: response.status, ok: response.ok, text: () => response.text() }
}

// ---------------------------------------------------------------------------
// Public domain types
// ---------------------------------------------------------------------------

export interface PaddleTransaction {
  id: string
  status: string
  customerId: string | null
  subscriptionId: string | null
  checkoutUrl: string | null
  currencyCode: string | null
  total: string | null
  billedAt: string | null
  /** Provider-owned service window for a subscription charge, when present. */
  billingPeriod: PaddleBillingPeriod | null
  /** Non-authoritative metadata echoed back by the provider (never used as a permission). */
  customData: Record<string, unknown> | null
  /** Price identifiers present in the transaction items. */
  priceIds: string[]
  updatedAt: string | null
}

export interface PaddleBillingPeriod {
  startsAt: string
  endsAt: string
}

export interface PaddleScheduledChange {
  action: string
  effectiveAt: string
}

export interface PaddleSubscription {
  id: string
  status: string
  customerId: string
  nextBilledAt: string | null
  currentBillingPeriod: PaddleBillingPeriod | null
  scheduledChange: PaddleScheduledChange | null
  updatedAt?: string | null
}

export interface PaddlePortalSubscriptionLink {
  id: string
  cancelUrl: string
  updatePaymentMethodUrl: string
  viewUrl: string
}

export interface PaddlePortalSession {
  id: string
  customerId: string
  overviewUrl: string
  subscriptions: PaddlePortalSubscriptionLink[]
}

export interface CreateTransactionInput {
  /** Authorized server-side Paddle customer id (ctm_...). */
  customerId: string
  /** Authorized server-side Paddle price id (pri_...). */
  priceId: string
  quantity?: number
  customData?: Record<string, unknown>
  /** Server-configured application page that includes Paddle.js. */
  checkoutUrl?: string
}

export interface CreateCustomerPortalSessionInput {
  customerId: string
  subscriptionIds?: string[]
}

export interface CancelSubscriptionAtPeriodEndInput {
  subscriptionId: string
}

export interface PaddleSandboxClient {
  createTransaction(input: CreateTransactionInput): Promise<PaddleTransaction>
  createCustomerPortalSession(input: CreateCustomerPortalSessionInput): Promise<PaddlePortalSession>
  cancelSubscriptionAtPeriodEnd(input: CancelSubscriptionAtPeriodEndInput): Promise<PaddleSubscription>
  getTransaction(transactionId: string): Promise<PaddleTransaction>
  getSubscription(subscriptionId: string): Promise<PaddleSubscription>
  /** Lists the newest transactions for a server-authorized customer id. */
  listTransactions(customerId: string): Promise<PaddleTransaction[]>
  verifyWebhook(rawBody: string | Uint8Array, signatureHeader: string | null | undefined): boolean
}

export interface PaddleSandboxClientOptions {
  /** Paddle sandbox API key. Must carry the `_sdbx` marker. */
  apiKey: string
  /** Secret for the webhook destination that signs inbound events. */
  webhookSecret: string
  request?: PaddleHttpRequest
  /** Injectable clock, used for webhook tolerance and testability. */
  clock?: () => Date
  timeoutMs?: number
  webhookToleranceSeconds?: number
  webhookMaxBytes?: number
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

const ID_PATTERNS = {
  customer: /^ctm_[a-z\d]{26}$/,
  price: /^pri_[a-z\d]{26}$/,
  transaction: /^txn_[a-z\d]{26}$/,
  subscription: /^sub_[a-z\d]{26}$/,
} as const

const SANDBOX_KEY_MARKER = '_sdbx'
const LIVE_KEY_PATTERN = /(^|[_-])live([_-]|$)/i

const asString = (value: unknown): string | null => (typeof value === 'string' ? value : null)

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : null

const parseJson = (text: string): Record<string, unknown> | null => {
  if (!text) return null
  try {
    return asRecord(JSON.parse(text))
  } catch {
    return null
  }
}

const redact = (value: string, secrets: readonly string[]): string => {
  let result = value
  for (const secret of secrets) {
    if (secret.length >= 4) result = result.split(secret).join('[redacted]')
  }
  return result
}

const assertSandboxApiKey = (apiKey: string): void => {
  if (!apiKey) throw new PaddleSandboxError('A Paddle sandbox API key is required', { code: 'invalid_configuration' })
  if (LIVE_KEY_PATTERN.test(apiKey)) {
    throw new PaddleSandboxError('Live Paddle API keys are not allowed; only sandbox keys are supported', { code: 'live_key_rejected' })
  }
  if (!apiKey.includes(SANDBOX_KEY_MARKER)) {
    throw new PaddleSandboxError('The Paddle API key is not a sandbox key', { code: 'invalid_configuration' })
  }
}

const assertPaddleId = (value: string, pattern: RegExp, label: string): void => {
  if (typeof value !== 'string' || !pattern.test(value)) {
    throw new PaddleSandboxError(`Invalid Paddle ${label} identifier`, { code: 'invalid_identifier' })
  }
}

// ---------------------------------------------------------------------------
// Webhook signature verification
// ---------------------------------------------------------------------------

export interface VerifyPaddleSignatureInput {
  rawBody: string | Uint8Array
  signatureHeader: string | null | undefined
  secret: string
  now: Date
  toleranceSeconds?: number
  maxBytes?: number
}

interface ParsedSignatureHeader {
  timestamp: number
  hashes: string[]
}

const parseSignatureHeader = (header: string): ParsedSignatureHeader | null => {
  let timestamp: number | null = null
  const hashes: string[] = []
  for (const part of header.split(';')) {
    const segment = part.trim()
    const separator = segment.indexOf('=')
    if (separator <= 0) continue
    const key = segment.slice(0, separator)
    const value = segment.slice(separator + 1)
    if (key === 'ts') {
      if (!/^\d+$/.test(value)) return null
      if (timestamp === null) timestamp = Number(value)
    } else if (key === 'h1') {
      if (value.length > 0) hashes.push(value)
    }
  }
  if (timestamp === null || !Number.isSafeInteger(timestamp) || hashes.length === 0) return null
  return { timestamp, hashes }
}

/**
 * Verify a Paddle webhook signature over the original, untransformed bytes.
 *
 * Paddle signs `${ts}:${rawBody}` with HMAC-SHA256 using the destination secret
 * and sends `Paddle-Signature: ts=...;h1=...` (multiple `h1` during rotation).
 */
export function verifyPaddleSignature(input: VerifyPaddleSignatureInput): boolean {
  const { rawBody, signatureHeader, secret } = input
  if (!secret || !signatureHeader) return false

  const tolerance = input.toleranceSeconds ?? PADDLE_WEBHOOK_TOLERANCE_SECONDS
  const maxBytes = input.maxBytes ?? PADDLE_WEBHOOK_MAX_BYTES
  if (!Number.isFinite(tolerance) || tolerance < 0) return false
  if (!Number.isFinite(maxBytes) || maxBytes <= 0) return false

  const bodyBytes = typeof rawBody === 'string' ? Buffer.from(rawBody, 'utf8') : Buffer.from(rawBody)
  if (bodyBytes.byteLength === 0 || bodyBytes.byteLength > maxBytes) return false

  const parsed = parseSignatureHeader(signatureHeader)
  if (!parsed) return false

  const nowMs = input.now.getTime()
  if (!Number.isFinite(nowMs)) return false
  if (Math.abs(Math.floor(nowMs / 1000) - parsed.timestamp) > tolerance) return false

  const expected = createHmac('sha256', secret)
    .update(Buffer.from(`${parsed.timestamp}:`, 'utf8'))
    .update(bodyBytes)
    .digest()

  return parsed.hashes.some((hash) => {
    const candidate = Buffer.from(hash, 'hex')
    return candidate.length === expected.length && timingSafeEqual(candidate, expected)
  })
}

// ---------------------------------------------------------------------------
// Entity mapping (defensive: never trust shapes, never echo unknown fields)
// ---------------------------------------------------------------------------

const mapTransaction = (data: Record<string, unknown>): PaddleTransaction => {
  const checkout = asRecord(data.checkout)
  const totals = asRecord(asRecord(data.details)?.totals)
  const period = asRecord(data.billing_period)
  const startsAt = period ? asString(period.starts_at) : null
  const endsAt = period ? asString(period.ends_at) : null
  const items = Array.isArray(data.items)
    ? data.items
        .map(asRecord)
        .filter((entry): entry is Record<string, unknown> => entry !== null)
    : []
  return {
    id: asString(data.id) ?? '',
    status: asString(data.status) ?? 'unknown',
    customerId: asString(data.customer_id),
    subscriptionId: asString(data.subscription_id),
    checkoutUrl: checkout ? asString(checkout.url) : null,
    currencyCode: asString(data.currency_code),
    total: totals ? asString(totals.total) : null,
    billedAt: asString(data.billed_at),
    billingPeriod: startsAt && endsAt ? { startsAt, endsAt } : null,
    customData: asRecord(data.custom_data),
    priceIds: items
      .map((item) => asString(item.price_id))
      .filter((priceId): priceId is string => priceId !== null),
    updatedAt: asString(data.updated_at),
  }
}

const mapSubscription = (data: Record<string, unknown>): PaddleSubscription => {
  const period = asRecord(data.current_billing_period)
  const change = asRecord(data.scheduled_change)
  return {
    id: asString(data.id) ?? '',
    status: asString(data.status) ?? 'unknown',
    customerId: asString(data.customer_id) ?? '',
    ...(asString(data.updated_at) ? { updatedAt: asString(data.updated_at) } : {}),
    nextBilledAt: asString(data.next_billed_at),
    currentBillingPeriod:
      period && asString(period.starts_at) && asString(period.ends_at)
        ? { startsAt: asString(period.starts_at) as string, endsAt: asString(period.ends_at) as string }
        : null,
    scheduledChange:
      change && asString(change.action) && asString(change.effective_at)
        ? { action: asString(change.action) as string, effectiveAt: asString(change.effective_at) as string }
        : null,
  }
}

const mapPortalSession = (data: Record<string, unknown>): PaddlePortalSession => {
  const urls = asRecord(data.urls)
  const general = asRecord(urls?.general)
  const rawSubscriptions = Array.isArray(urls?.subscriptions) ? urls.subscriptions : []
  return {
    id: asString(data.id) ?? '',
    customerId: asString(data.customer_id) ?? '',
    overviewUrl: general ? asString(general.overview) ?? '' : '',
    subscriptions: rawSubscriptions
      .map(asRecord)
      .filter((entry): entry is Record<string, unknown> => entry !== null)
      .map((entry) => ({
        id: asString(entry.id) ?? '',
        cancelUrl: asString(entry.cancel_subscription) ?? '',
        updatePaymentMethodUrl: asString(entry.update_subscription_payment_method) ?? '',
        viewUrl: asString(entry.view_subscription) ?? '',
      })),
  }
}

// ---------------------------------------------------------------------------
// Client factory
// ---------------------------------------------------------------------------

export function createPaddleSandboxClient(options: PaddleSandboxClientOptions): PaddleSandboxClient {
  const { apiKey, webhookSecret } = options
  assertSandboxApiKey(apiKey)

  const timeoutMs = options.timeoutMs ?? PADDLE_DEFAULT_TIMEOUT_MS
  if (!Number.isInteger(timeoutMs) || timeoutMs <= 0) {
    throw new PaddleSandboxError('Invalid Paddle sandbox timeout', { code: 'invalid_configuration' })
  }
  const toleranceSeconds = options.webhookToleranceSeconds ?? PADDLE_WEBHOOK_TOLERANCE_SECONDS
  const maxBytes = options.webhookMaxBytes ?? PADDLE_WEBHOOK_MAX_BYTES
  const requestImpl = options.request ?? defaultRequest
  const clock = options.clock ?? (() => new Date())
  const secrets: readonly string[] = [apiKey, webhookSecret]

  const performRequest = async (path: string, method: PaddleHttpMethod, body?: Record<string, unknown>): Promise<Record<string, unknown>> => {
    const url = `${PADDLE_SANDBOX_API_ORIGIN}${path}`
    const controller = new AbortController()
    let timedOut = false
    const timer = setTimeout(() => {
      timedOut = true
      controller.abort()
    }, timeoutMs)

    try {
      const headers: Record<string, string> = { Authorization: `Bearer ${apiKey}`, Accept: 'application/json' }
      if (body !== undefined) headers['Content-Type'] = 'application/json'

      const response = await requestImpl(url, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      })

      const text = await response.text()
      const parsed = parseJson(text)

      if (!response.ok) {
        const errorObject = asRecord(parsed?.error)
        const errorCode = errorObject ? asString(errorObject.code) : null
        const meta = asRecord(parsed?.meta)
        const requestId = meta ? asString(meta.request_id) : null
        throw new PaddleSandboxError(
          redact(`Paddle sandbox request failed (${response.status})${errorCode ? `: ${errorCode}` : ''}`, secrets),
          {
            status: response.status,
            code: errorCode ?? 'http_error',
            requestId,
            retryable: response.status >= 500 || response.status === 429,
          },
        )
      }

      if (!parsed) throw new PaddleSandboxError('Paddle sandbox returned an invalid JSON response', { code: 'invalid_response' })
      return parsed
    } catch (error) {
      if (error instanceof PaddleSandboxError) throw error
      if (timedOut) throw new PaddleSandboxError('Paddle sandbox request timed out', { code: 'timeout', retryable: true })
      const message = error instanceof Error ? error.message : String(error)
      throw new PaddleSandboxError(redact(`Paddle sandbox request failed: ${message}`, secrets), { code: 'network_error', retryable: true })
    } finally {
      clearTimeout(timer)
    }
  }

  const readData = (result: Record<string, unknown>): Record<string, unknown> => asRecord(result.data) ?? {}

  return {
    async createTransaction(input) {
      assertPaddleId(input.customerId, ID_PATTERNS.customer, 'customer')
      assertPaddleId(input.priceId, ID_PATTERNS.price, 'price')
      const quantity = input.quantity ?? 1
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
        throw new PaddleSandboxError('Invalid transaction quantity', { code: 'invalid_identifier' })
      }

      const body: Record<string, unknown> = {
        items: [{ price_id: input.priceId, quantity }],
        customer_id: input.customerId,
      }
      if (input.customData !== undefined) body.custom_data = input.customData
      if (input.checkoutUrl !== undefined) body.checkout = { url: input.checkoutUrl }

      const result = await performRequest('/transactions', 'POST', body)
      return mapTransaction(readData(result))
    },

    async createCustomerPortalSession(input) {
      assertPaddleId(input.customerId, ID_PATTERNS.customer, 'customer')
      const subscriptionIds = input.subscriptionIds ?? []
      if (subscriptionIds.length > 25) {
        throw new PaddleSandboxError('Too many subscription ids for a portal session', { code: 'invalid_identifier' })
      }
      for (const id of subscriptionIds) assertPaddleId(id, ID_PATTERNS.subscription, 'subscription')

      const body: Record<string, unknown> = {}
      if (subscriptionIds.length > 0) body.subscription_ids = subscriptionIds

      const result = await performRequest(`/customers/${input.customerId}/portal-sessions`, 'POST', body)
      return mapPortalSession(readData(result))
    },

    async cancelSubscriptionAtPeriodEnd(input) {
      assertPaddleId(input.subscriptionId, ID_PATTERNS.subscription, 'subscription')
      const result = await performRequest(`/subscriptions/${input.subscriptionId}/cancel`, 'POST', {
        effective_from: 'next_billing_period',
      })
      return mapSubscription(readData(result))
    },

    async getTransaction(transactionId) {
      assertPaddleId(transactionId, ID_PATTERNS.transaction, 'transaction')
      const result = await performRequest(`/transactions/${transactionId}`, 'GET')
      return mapTransaction(readData(result))
    },

    async getSubscription(subscriptionId) {
      assertPaddleId(subscriptionId, ID_PATTERNS.subscription, 'subscription')
      const result = await performRequest(`/subscriptions/${subscriptionId}`, 'GET')
      return mapSubscription(readData(result))
    },

    async listTransactions(customerId) {
      assertPaddleId(customerId, ID_PATTERNS.customer, 'customer')
      // Server-side link only: the customer id is never caller-supplied. Paddle
      // returns the collection under `data`; anything else is treated as empty.
      const result = await performRequest(
        `/transactions?customer_id=${customerId}&per_page=${PADDLE_LIST_PAGE_SIZE}`,
        'GET',
      )
      const entries = Array.isArray(result.data) ? result.data : []
      return entries
        .map(asRecord)
        .filter((entry): entry is Record<string, unknown> => entry !== null)
        .map(mapTransaction)
    },

    verifyWebhook(rawBody, signatureHeader) {
      return verifyPaddleSignature({
        rawBody,
        signatureHeader,
        secret: webhookSecret,
        now: clock(),
        toleranceSeconds,
        maxBytes,
      })
    },
  }
}
