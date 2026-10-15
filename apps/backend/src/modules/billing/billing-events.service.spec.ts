import { createHash, createHmac } from 'node:crypto'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { AuthenticatedUser } from '../auth/types/authenticated-user'

// ---------------------------------------------------------------------------
// Synthetic boundary. No real database and no real network are ever used.
// ---------------------------------------------------------------------------

const { db, paddle, allMocks } = vi.hoisted(() => {
  const db = {
    $queryRaw: vi.fn(),
    $transaction: vi.fn(),
    billingEvent: { findUnique: vi.fn(), upsert: vi.fn(), update: vi.fn() },
    billingAuditLog: { create: vi.fn() },
    billingPayment: { findFirst: vi.fn(), create: vi.fn(), update: vi.fn() },
    billingDocument: { findFirst: vi.fn(), create: vi.fn() },
    billingServicePeriod: { findFirst: vi.fn(), create: vi.fn() },
    billingSubscription: { findFirst: vi.fn(), findUnique: vi.fn(), update: vi.fn() },
    billingProviderCustomer: { findFirst: vi.fn() },
    billingTrial: { updateMany: vi.fn() },
    billingAdmin: { findFirst: vi.fn() },
    billingOutbox: { findFirst: vi.fn(), create: vi.fn() },
  }
  const paddle = { getTransaction: vi.fn(), getSubscription: vi.fn(), listTransactions: vi.fn() }
  const allMocks = [
    db.$queryRaw, db.$transaction,
    ...Object.values(db.billingEvent), ...Object.values(db.billingAuditLog), ...Object.values(db.billingPayment),
    ...Object.values(db.billingDocument),
    ...Object.values(db.billingServicePeriod), ...Object.values(db.billingSubscription),
    ...Object.values(db.billingProviderCustomer), ...Object.values(db.billingTrial),
    ...Object.values(db.billingAdmin), ...Object.values(db.billingOutbox),
    ...Object.values(paddle),
  ] as Array<{ mockReset: () => void }>
  return { db, paddle, allMocks }
})

vi.mock('@aula/database', () => ({ prisma: db, Prisma: {} }))
vi.mock('./paddle-sandbox', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./paddle-sandbox')>()
  return { ...actual, createPaddleSandboxClient: vi.fn(() => paddle) }
})

import { BillingEventsService } from './billing-events.service'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const SECRET = 'pdl_ntfset_TESTONLY_webhook_secret'
const KEY = 'pdl_sdbx_apikey_TESTONLY_000000000000000000000'
const NOW = new Date('2026-10-15T14:00:00Z')
const NOW_TS = Math.floor(NOW.getTime() / 1000)
const PERIOD = { startsAt: '2026-10-01T04:00:00Z', endsAt: '2026-11-01T04:00:00Z' }

const actor: AuthenticatedUser = { id: 'user-1', email: 'admin@example.com', schoolId: 'school-1', roles: ['ADMIN'] }

const sign = (body: string, secret = SECRET) =>
  `ts=${NOW_TS};h1=${createHmac('sha256', secret).update(`${NOW_TS}:${body}`).digest('hex')}`

const hash = (body: string) => createHash('sha256').update(body).digest('hex')

const envelope = (eventType: string, data: Record<string, unknown>) =>
  JSON.stringify({ event_id: 'evt_1', event_type: eventType, occurred_at: '2026-10-15T13:59:59Z', data })

const lockRow = (eventType: string, data: Record<string, unknown>, status = 'received', updatedAt: Date = NOW) => ({
  id: 'evt-row-1',
  status,
  updated_at: updatedAt,
  event_type: eventType,
  payload: { event_id: 'evt_1', event_type: eventType, occurred_at: '2026-10-15T13:59:59Z', data },
})

const persistedEvent = (eventType: string, body: string) => ({ id: 'evt-row-1', eventType, status: 'RECEIVED', payloadHash: hash(body) })

const accountLink = {
  accountId: 'acc-1',
  providerCustomerId: 'ctm_x',
  account: { userId: 'user-1', status: 'ACTIVE', sandbox: true },
}

const subscription = () => ({
  id: 'sub-local',
  accountId: 'acc-1',
  planId: 'plan-1',
  priceId: 'price-1',
  providerSubscriptionId: 'sub_x',
  status: 'INCOMPLETE',
  currentPeriodEnd: null as Date | null,
  cancelAtPeriodEnd: false,
  metadata: {} as Record<string, unknown>,
  price: { providerPriceId: 'pri_x', currency: 'USD', amountMinor: 1500n },
  plan: { graceDays: 99 },
})

const service = new BillingEventsService()

let lockRows: ReturnType<typeof lockRow>[]

beforeEach(() => {
  vi.clearAllMocks()
  allMocks.forEach((mock) => mock.mockReset())
  lockRows = []
  process.env.BILLING_EVENTS_ENABLED = 'true'
  process.env.PADDLE_SANDBOX_WEBHOOK_SECRET = SECRET
  process.env.PADDLE_SANDBOX_API_KEY = KEY
  delete process.env.BILLING_ENVIRONMENT
  delete process.env.BILLING_ENABLED
  delete process.env.BILLING_CHECKOUT_ENABLED
  delete process.env.BILLING_GRACE_DAYS

  db.$queryRaw.mockImplementation(async (strings: TemplateStringsArray) => {
    const sql = Array.isArray(strings) ? strings.join(' ') : String(strings)
    if (sql.includes('transaction_timestamp')) return [{ now: NOW }]
    if (sql.includes('app_users')) return [{ id: 'user-1' }]
    if (sql.includes('billing_events')) return lockRows.length ? [lockRows.shift()] : []
    return []
  })
  db.$transaction.mockImplementation(async (callback: (tx: unknown) => Promise<unknown>) => callback(db))
  db.billingEvent.findUnique.mockResolvedValue(null)
  db.billingEvent.update.mockResolvedValue({})
  db.billingAdmin.findFirst.mockResolvedValue({ id: 'admin-1' })
  paddle.listTransactions.mockResolvedValue([])
})

// ---------------------------------------------------------------------------
// receive: flags and signature
// ---------------------------------------------------------------------------

describe('receive: server flags and signature', () => {
  it('rejects every event while the events flag is disabled, without persisting', async () => {
    process.env.BILLING_EVENTS_ENABLED = 'false'
    const body = envelope('unknown.event', {})
    const result = await service.receive(Buffer.from(body), sign(body))

    expect(result).toMatchObject({ accepted: false, status: 'rejected', reason: 'events_disabled' })
    expect(db.billingEvent.findUnique).not.toHaveBeenCalled()
  })

  it('processes events when checkout and the whole module are disabled', async () => {
    process.env.BILLING_CHECKOUT_ENABLED = 'false'
    process.env.BILLING_ENABLED = 'false'
    const body = envelope('unknown.event', {})
    db.billingEvent.upsert.mockResolvedValue(persistedEvent('unknown.event', body))
    lockRows.push(lockRow('unknown.event', {}))

    const result = await service.receive(Buffer.from(body), sign(body))

    expect(result).toMatchObject({ accepted: true, status: 'ignored' })
    expect(db.$transaction).toHaveBeenCalledTimes(1)
  })

  it('rejects an invalid signature and never persists the payload', async () => {
    const body = envelope('unknown.event', {})
    const result = await service.receive(Buffer.from(body), sign(body, 'the-wrong-secret'))

    expect(result).toMatchObject({ accepted: false, status: 'rejected', reason: 'invalid_signature' })
    expect(db.billingEvent.findUnique).not.toHaveBeenCalled()
  })

  it('rejects malformed envelopes and oversized bodies', async () => {
    const malformed = '{"event_id":"evt_1"}'
    expect(await service.receive(Buffer.from(malformed), sign(malformed))).toMatchObject({ reason: 'invalid_envelope' })
    expect(await service.receive(Buffer.alloc(0), sign(''))).toMatchObject({ reason: 'invalid_size' })
  })
})

// ---------------------------------------------------------------------------
// receive: durable deduplication
// ---------------------------------------------------------------------------

describe('receive: durable deduplication', () => {
  it('acknowledges an already processed identical event without reprocessing it', async () => {
    const body = envelope('unknown.event', {})
    db.billingEvent.findUnique.mockResolvedValue({ ...persistedEvent('unknown.event', body), status: 'PROCESSED' })
    db.billingEvent.upsert.mockResolvedValue({ ...persistedEvent('unknown.event', body), status: 'PROCESSED' })

    const result = await service.receive(Buffer.from(body), sign(body))

    expect(result).toMatchObject({ accepted: true, status: 'duplicate', duplicate: true })
    expect(db.$transaction).not.toHaveBeenCalled()
  })

  it('rejects a reused event id whose payload changed and audits the mismatch', async () => {
    const body = envelope('unknown.event', {})
    db.billingEvent.findUnique.mockResolvedValue({ ...persistedEvent('unknown.event', body), payloadHash: 'different' })

    const result = await service.receive(Buffer.from(body), sign(body))

    expect(result).toMatchObject({ accepted: false, status: 'rejected', reason: 'payload_mismatch' })
    expect(db.billingEvent.upsert).not.toHaveBeenCalled()
    expect(db.billingAuditLog.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ action: 'provider_event.payload_mismatch' }),
    }))
  })

  it('detects a different payload even when a concurrent upsert wins without P2002 (bug 8)', async () => {
    const body = envelope('unknown.event', {})
    // A concurrent writer stored the same event id with different content; upsert updates it.
    db.billingEvent.upsert.mockResolvedValue({ ...persistedEvent('unknown.event', body), payloadHash: 'other-content' })

    const result = await service.receive(Buffer.from(body), sign(body))

    expect(result).toMatchObject({ accepted: false, status: 'rejected', reason: 'payload_mismatch' })
    expect(db.billingAuditLog.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ action: 'provider_event.payload_mismatch' }),
    }))
    expect(db.$transaction).not.toHaveBeenCalled()
  })

  it('resolves a unique-constraint race as a duplicate', async () => {
    const body = envelope('unknown.event', {})
    db.billingEvent.upsert.mockRejectedValueOnce(Object.assign(new Error('unique'), { code: 'P2002' }))
    db.billingEvent.findUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ ...persistedEvent('unknown.event', body), status: 'RECEIVED' })

    const result = await service.receive(Buffer.from(body), sign(body))

    expect(result).toMatchObject({ accepted: true, status: 'duplicate', duplicate: true })
    expect(db.$transaction).not.toHaveBeenCalled()
  })
})

// ---------------------------------------------------------------------------
// receive: processing
// ---------------------------------------------------------------------------

describe('receive: processing', () => {
  it('ignores unknown signed events without granting anything', async () => {
    const body = envelope('subscription.mystery', { id: 'sub_x' })
    db.billingEvent.upsert.mockResolvedValue(persistedEvent('subscription.mystery', body))
    lockRows.push(lockRow('subscription.mystery', { id: 'sub_x' }))

    const result = await service.receive(Buffer.from(body), sign(body))

    expect(result).toMatchObject({ accepted: true, status: 'ignored' })
    expect(db.billingServicePeriod.create).not.toHaveBeenCalled()
  })

  it('writes the confirmation and all effects inside the event transaction (bug 1)', async () => {
    const body = envelope('transaction.completed', { id: 'txn_1', customer_id: 'ctm_x' })
    db.billingEvent.upsert.mockResolvedValue(persistedEvent('transaction.completed', body))
    lockRows.push(lockRow('transaction.completed', { id: 'txn_1', customer_id: 'ctm_x' }))
    db.billingProviderCustomer.findFirst.mockResolvedValue(accountLink)
    db.billingSubscription.findFirst.mockResolvedValue(subscription())
    db.billingPayment.findFirst.mockResolvedValue(null)
    db.billingPayment.create.mockResolvedValue({ id: 'pay-1', accountId: 'acc-1', amountMinor: 1500n, metadata: {} })
    db.billingServicePeriod.findFirst.mockResolvedValue(null)
    db.billingOutbox.findFirst.mockResolvedValue(null)
    paddle.getTransaction.mockResolvedValue({
      id: 'txn_1', status: 'completed', customerId: 'ctm_x', subscriptionId: 'sub_x',
      priceIds: ['pri_x'], currencyCode: 'USD', total: '1500', billingPeriod: PERIOD, customData: null, billedAt: null,
    })
    paddle.getSubscription.mockResolvedValue({
      id: 'sub_x', status: 'active', customerId: 'ctm_x', nextBilledAt: PERIOD.endsAt,
      currentBillingPeriod: PERIOD, scheduledChange: null,
    })

    const result = await service.receive(Buffer.from(body), sign(body))

    expect(result).toMatchObject({ accepted: true, status: 'processed' })
    expect(db.$transaction).toHaveBeenCalledTimes(1)
    expect(db.billingPayment.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ amountMinor: 1500n, currency: 'USD', providerPaymentId: 'txn_1' }),
    }))
    expect(db.billingServicePeriod.create).toHaveBeenCalledTimes(1)
    expect(db.billingTrial.updateMany).toHaveBeenCalledTimes(1)
    expect(db.billingOutbox.create).toHaveBeenCalledTimes(1)
  })

  it('uses the provider subscription status, never the transaction status (bug 3)', async () => {
    const body = envelope('transaction.completed', { id: 'txn_1', customer_id: 'ctm_x' })
    db.billingEvent.upsert.mockResolvedValue(persistedEvent('transaction.completed', body))
    lockRows.push(lockRow('transaction.completed', { id: 'txn_1', customer_id: 'ctm_x' }))
    db.billingProviderCustomer.findFirst.mockResolvedValue(accountLink)
    db.billingSubscription.findFirst.mockResolvedValue(subscription())
    db.billingPayment.findFirst.mockResolvedValue(null)
    db.billingPayment.create.mockResolvedValue({ id: 'pay-1', accountId: 'acc-1', amountMinor: 1500n, metadata: {} })
    db.billingServicePeriod.findFirst.mockResolvedValue(null)
    db.billingOutbox.findFirst.mockResolvedValue(null)
    paddle.getTransaction.mockResolvedValue({
      id: 'txn_1', status: 'completed', customerId: 'ctm_x', subscriptionId: 'sub_x',
      priceIds: ['pri_x'], currencyCode: 'USD', total: '1500', billingPeriod: PERIOD, customData: null, billedAt: null,
    })
    paddle.getSubscription.mockResolvedValue({
      id: 'sub_x', status: 'active', customerId: 'ctm_x', nextBilledAt: PERIOD.endsAt,
      currentBillingPeriod: PERIOD, scheduledChange: null,
    })

    await service.receive(Buffer.from(body), sign(body))

    expect(paddle.getSubscription).toHaveBeenCalledWith('sub_x')
    const update = db.billingSubscription.update.mock.calls.at(-1)?.[0]
    expect(update.data.status).toBe('ACTIVE')
    expect(update.data.status).not.toBe('UNKNOWN')
  })

  it('records a real payment but no invented coverage when the transaction has no period (bug 5)', async () => {
    const body = envelope('transaction.completed', { id: 'txn_1', customer_id: 'ctm_x' })
    db.billingEvent.upsert.mockResolvedValue(persistedEvent('transaction.completed', body))
    lockRows.push(lockRow('transaction.completed', { id: 'txn_1', customer_id: 'ctm_x' }))
    db.billingProviderCustomer.findFirst.mockResolvedValue(accountLink)
    db.billingSubscription.findFirst.mockResolvedValue(subscription())
    db.billingPayment.findFirst.mockResolvedValue(null)
    db.billingPayment.create.mockResolvedValue({ id: 'pay-1', accountId: 'acc-1', amountMinor: 1500n, metadata: {} })
    db.billingOutbox.findFirst.mockResolvedValue(null)
    paddle.getTransaction.mockResolvedValue({
      id: 'txn_1', status: 'completed', customerId: 'ctm_x', subscriptionId: 'sub_x',
      priceIds: ['pri_x'], currencyCode: 'USD', total: '1500', billingPeriod: null, customData: null, billedAt: null,
    })
    paddle.getSubscription.mockResolvedValue({
      id: 'sub_x', status: 'active', customerId: 'ctm_x', nextBilledAt: null, currentBillingPeriod: PERIOD, scheduledChange: null,
    })

    const result = await service.receive(Buffer.from(body), sign(body))

    expect(result).toMatchObject({ accepted: true, status: 'failed', reason: 'coverage_period_missing' })
    expect(db.billingPayment.create).toHaveBeenCalledTimes(1)
    expect(db.billingServicePeriod.create).not.toHaveBeenCalled()
    expect(db.billingTrial.updateMany).not.toHaveBeenCalled()
    expect(db.billingEvent.update).toHaveBeenLastCalledWith(expect.objectContaining({
      data: expect.objectContaining({ status: 'FAILED' }),
    }))
  })

  it('never credits an amount different from the authorized server price (bug 6)', async () => {
    const body = envelope('transaction.completed', { id: 'txn_1', customer_id: 'ctm_x' })
    db.billingEvent.upsert.mockResolvedValue(persistedEvent('transaction.completed', body))
    lockRows.push(lockRow('transaction.completed', { id: 'txn_1', customer_id: 'ctm_x' }))
    db.billingProviderCustomer.findFirst.mockResolvedValue(accountLink)
    db.billingSubscription.findFirst.mockResolvedValue(subscription())
    db.billingOutbox.findFirst.mockResolvedValue(null)
    paddle.getTransaction.mockResolvedValue({
      id: 'txn_1', status: 'completed', customerId: 'ctm_x', subscriptionId: 'sub_x',
      priceIds: ['pri_x'], currencyCode: 'USD', total: '999', billingPeriod: PERIOD, customData: null, billedAt: null,
    })

    const result = await service.receive(Buffer.from(body), sign(body))

    expect(result).toMatchObject({ accepted: true, status: 'processed' })
    expect(db.billingPayment.create).not.toHaveBeenCalled()
    expect(db.billingAuditLog.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ action: 'billing.payment.amount_mismatch' }),
    }))
  })

  it('stores a recoverable failure with attempts after a retryable HTTP error', async () => {
    const body = envelope('transaction.completed', { id: 'txn_1', customer_id: 'ctm_x' })
    db.billingEvent.upsert.mockResolvedValue(persistedEvent('transaction.completed', body))
    lockRows.push(lockRow('transaction.completed', { id: 'txn_1', customer_id: 'ctm_x' }))
    db.billingProviderCustomer.findFirst.mockResolvedValue(accountLink)
    paddle.getTransaction.mockRejectedValue(Object.assign(new Error(`secret ${SECRET}`), { name: 'PaddleSandboxError', code: 'timeout', retryable: true }))

    const result = await service.receive(Buffer.from(body), sign(body))

    expect(result).toMatchObject({ accepted: true, status: 'failed' })
    const failure = db.billingEvent.update.mock.calls.at(-1)?.[0]
    expect(failure.data.status).toBe('FAILED')
    expect(failure.data.attempts).toEqual({ increment: 1 })
    expect(failure.data.lastError).not.toContain(SECRET)
    expect(failure.data.nextRetryAt).toBeInstanceOf(Date)
  })
})

// ---------------------------------------------------------------------------
// payment_failed: grace
// ---------------------------------------------------------------------------

describe('payment_failed: grace', () => {
  it('does not start grace for a transaction that is not really past_due (bug 4)', async () => {
    const body = envelope('transaction.payment_failed', { id: 'txn_1', customer_id: 'ctm_x' })
    db.billingEvent.upsert.mockResolvedValue(persistedEvent('transaction.payment_failed', body))
    lockRows.push(lockRow('transaction.payment_failed', { id: 'txn_1', customer_id: 'ctm_x' }))
    db.billingProviderCustomer.findFirst.mockResolvedValue(accountLink)
    db.billingSubscription.findFirst.mockResolvedValue(subscription())
    paddle.getTransaction.mockResolvedValue({
      id: 'txn_1', status: 'ready', customerId: 'ctm_x', subscriptionId: 'sub_x',
      priceIds: ['pri_x'], currencyCode: 'USD', total: '1500', billingPeriod: PERIOD, customData: null, billedAt: null,
    })

    const result = await service.receive(Buffer.from(body), sign(body))

    expect(result).toMatchObject({ accepted: true, status: 'processed' })
    expect(db.billingServicePeriod.create).not.toHaveBeenCalled()
  })

  it('starts a single grace window from the failed period using BILLING_GRACE_DAYS (bug 4)', async () => {
    process.env.BILLING_GRACE_DAYS = '5'
    const body = envelope('transaction.payment_failed', { id: 'txn_1', customer_id: 'ctm_x' })
    db.billingEvent.upsert.mockResolvedValue(persistedEvent('transaction.payment_failed', body))
    lockRows.push(lockRow('transaction.payment_failed', { id: 'txn_1', customer_id: 'ctm_x' }))
    db.billingProviderCustomer.findFirst.mockResolvedValue(accountLink)
    db.billingSubscription.findFirst.mockResolvedValue(subscription())
    // prior successful payment, then no payment for this transaction
    db.billingPayment.findFirst.mockResolvedValueOnce({ id: 'pay-0' }).mockResolvedValueOnce(null)
    db.billingServicePeriod.findFirst.mockResolvedValue(null)
    db.billingOutbox.findFirst.mockResolvedValue(null)
    paddle.getTransaction.mockResolvedValue({
      id: 'txn_1', status: 'past_due', customerId: 'ctm_x', subscriptionId: 'sub_x',
      priceIds: ['pri_x'], currencyCode: 'USD', total: '1500',
      billingPeriod: { startsAt: '2026-10-01T04:00:00Z', endsAt: '2026-11-01T04:00:00Z' }, customData: null, billedAt: null,
    })

    await service.receive(Buffer.from(body), sign(body))

    const created = db.billingServicePeriod.create.mock.calls.at(-1)?.[0]?.data
    expect(created.source).toBe('GRACE')
    expect(created.note).toBe('renewal:txn_1')
    expect((created.startsAt as Date).toISOString()).toBe('2026-10-01T04:00:00.000Z')
    expect((created.endsAt as Date).toISOString()).toBe('2026-10-06T04:00:00.000Z')
  })

  it('never starts grace when the failed transaction was already paid', async () => {
    const body = envelope('transaction.payment_failed', { id: 'txn_1', customer_id: 'ctm_x' })
    db.billingEvent.upsert.mockResolvedValue(persistedEvent('transaction.payment_failed', body))
    lockRows.push(lockRow('transaction.payment_failed', { id: 'txn_1', customer_id: 'ctm_x' }))
    db.billingProviderCustomer.findFirst.mockResolvedValue(accountLink)
    db.billingSubscription.findFirst.mockResolvedValue(subscription())
    db.billingPayment.findFirst.mockResolvedValueOnce({ id: 'pay-0' }).mockResolvedValueOnce({ id: 'pay-1' })
    paddle.getTransaction.mockResolvedValue({
      id: 'txn_1', status: 'past_due', customerId: 'ctm_x', subscriptionId: 'sub_x',
      priceIds: ['pri_x'], currencyCode: 'USD', total: '1500', billingPeriod: PERIOD, customData: null, billedAt: null,
    })

    await service.receive(Buffer.from(body), sign(body))

    expect(db.billingServicePeriod.create).not.toHaveBeenCalled()
  })
})

// ---------------------------------------------------------------------------
// refunds and disputes
// ---------------------------------------------------------------------------

describe('refunds and disputes', () => {
  const adjustmentBody = (payload: Record<string, unknown>) => envelope('adjustment.created', payload)

  it('does not change a payment for a pending refund adjustment (bug 7)', async () => {
    const body = adjustmentBody({ action: 'refund', status: 'pending_approval', id: 'adj_1', transaction_id: 'txn_1', totals: { total: '500' } })
    db.billingEvent.upsert.mockResolvedValue(persistedEvent('adjustment.created', body))
    lockRows.push(lockRow('adjustment.created', { action: 'refund', status: 'pending_approval', id: 'adj_1', transaction_id: 'txn_1', totals: { total: '500' } }))
    db.billingPayment.findFirst.mockResolvedValue({ id: 'pay-1', accountId: 'acc-1', amountMinor: 1500n, amountRefundedMinor: 0n, status: 'SUCCEEDED', metadata: {} })

    await service.receive(Buffer.from(body), sign(body))

    expect(db.billingPayment.update).not.toHaveBeenCalled()
    expect(db.billingAuditLog.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ action: 'billing.refund.pending_review' }),
    }))
  })

  it('records an approved partial refund as PARTIALLY_REFUNDED (bug 7)', async () => {
    const body = adjustmentBody({ action: 'refund', status: 'approved', id: 'adj_1', transaction_id: 'txn_1', totals: { total: '500' } })
    db.billingEvent.upsert.mockResolvedValue(persistedEvent('adjustment.created', body))
    lockRows.push(lockRow('adjustment.created', { action: 'refund', status: 'approved', id: 'adj_1', transaction_id: 'txn_1', totals: { total: '500' } }))
    db.billingPayment.findFirst.mockResolvedValue({ id: 'pay-1', accountId: 'acc-1', amountMinor: 1500n, amountRefundedMinor: 0n, status: 'SUCCEEDED', metadata: {} })
    db.billingOutbox.findFirst.mockResolvedValue(null)

    await service.receive(Buffer.from(body), sign(body))

    const update = db.billingPayment.update.mock.calls.at(-1)?.[0]
    expect(update.data.status).toBe('PARTIALLY_REFUNDED')
    expect(update.data.amountRefundedMinor).toBe(500n)
    expect(update.data.metadata.adjustmentRefunds).toEqual({ adj_1: '500' })
  })

  it('does not double count a repeated adjustment id (bug 7)', async () => {
    const body = adjustmentBody({ action: 'refund', status: 'approved', id: 'adj_1', transaction_id: 'txn_1', totals: { total: '500' } })
    db.billingEvent.upsert.mockResolvedValue(persistedEvent('adjustment.created', body))
    lockRows.push(lockRow('adjustment.created', { action: 'refund', status: 'approved', id: 'adj_1', transaction_id: 'txn_1', totals: { total: '500' } }))
    db.billingPayment.findFirst.mockResolvedValue({ id: 'pay-1', accountId: 'acc-1', amountMinor: 1500n, amountRefundedMinor: 500n, status: 'PARTIALLY_REFUNDED', metadata: { adjustmentRefunds: { adj_1: '500' } } })

    await service.receive(Buffer.from(body), sign(body))

    expect(db.billingPayment.update).not.toHaveBeenCalled()
  })

  it('flags an open dispute conservatively and ignores a resolved one', async () => {
    const openBody = envelope('dispute.created', { id: 'dsp_1', status: 'open', transaction_id: 'txn_1' })
    db.billingEvent.upsert.mockResolvedValue(persistedEvent('dispute.created', openBody))
    lockRows.push(lockRow('dispute.created', { id: 'dsp_1', status: 'open', transaction_id: 'txn_1' }))
    db.billingPayment.findFirst.mockResolvedValue({ id: 'pay-1', accountId: 'acc-1', amountMinor: 1500n, amountRefundedMinor: 0n, status: 'SUCCEEDED', metadata: {} })
    db.billingOutbox.findFirst.mockResolvedValue(null)

    await service.receive(Buffer.from(openBody), sign(openBody))
    expect(db.billingPayment.update).toHaveBeenLastCalledWith(expect.objectContaining({ data: { status: 'DISPUTED' } }))

    vi.clearAllMocks()
    lockRows = []
    const wonBody = envelope('dispute.updated', { id: 'dsp_1', status: 'won', transaction_id: 'txn_1' })
    db.billingEvent.upsert.mockResolvedValue(persistedEvent('dispute.updated', wonBody))
    lockRows.push(lockRow('dispute.updated', { id: 'dsp_1', status: 'won', transaction_id: 'txn_1' }))
    db.billingPayment.findFirst.mockResolvedValue({ id: 'pay-1', accountId: 'acc-1', amountMinor: 1500n, amountRefundedMinor: 0n, status: 'DISPUTED', metadata: {} })

    await service.receive(Buffer.from(wonBody), sign(wonBody))
    expect(db.billingPayment.update).not.toHaveBeenCalled()
  })
})

// ---------------------------------------------------------------------------
// retry
// ---------------------------------------------------------------------------

describe('retry', () => {
  it('requires an active commercial administrator', async () => {
    db.billingAdmin.findFirst.mockResolvedValue(null)
    await expect(service.retry(actor, 'evt-row-1')).rejects.toMatchObject({ status: 403 })
  })

  it('recovers a FAILED event delivered as lower-case status from PostgreSQL (bug 2)', async () => {
    db.billingEvent.update.mockResolvedValue({})
    lockRows.push(lockRow('unknown.event', {}, 'failed'))

    const result = await service.retry(actor, 'evt-row-1')

    expect(result).toMatchObject({ accepted: true, status: 'ignored' })
    expect(db.billingEvent.update).toHaveBeenLastCalledWith(expect.objectContaining({
      data: expect.objectContaining({ status: 'IGNORED' }),
    }))
  })

  it('refuses to recover an event that is still being processed', async () => {
    lockRows.push(lockRow('unknown.event', {}, 'processing', NOW))

    await expect(service.retry(actor, 'evt-row-1')).rejects.toMatchObject({ status: 409 })
    expect(db.billingEvent.update).not.toHaveBeenCalled()
  })

  it('refuses to recover a terminal event', async () => {
    lockRows.push(lockRow('unknown.event', {}, 'processed'))

    await expect(service.retry(actor, 'evt-row-1')).rejects.toMatchObject({ status: 409 })
  })
})

// ---------------------------------------------------------------------------
// reconcile
// ---------------------------------------------------------------------------

describe('reconcile', () => {
  it('reads the current provider state, updates local state and audits it without creating money', async () => {
    db.billingSubscription.findUnique.mockResolvedValue({
      id: 'sub-local', accountId: 'acc-1', providerSubscriptionId: 'sub_x', planId: 'plan-1', priceId: 'price-1',
      provider: 'PADDLE', environment: 'SANDBOX', status: 'INCOMPLETE', cancelAtPeriodEnd: false, metadata: {},
    })
    db.billingProviderCustomer.findFirst.mockResolvedValue({ providerCustomerId: 'ctm_x' })
    paddle.getSubscription.mockResolvedValue({
      id: 'sub_x', status: 'active', customerId: 'ctm_x', nextBilledAt: PERIOD.endsAt,
      currentBillingPeriod: PERIOD, scheduledChange: null,
    })

    const result = await service.reconcile(actor, 'sub-local')

    expect(result).toMatchObject({ subscriptionId: 'sub-local', status: 'ACTIVE', providerStatus: 'active' })
    expect(db.billingSubscription.update).toHaveBeenCalledTimes(1)
    expect(db.billingPayment.create).not.toHaveBeenCalled()
    expect(db.billingAuditLog.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ action: 'billing.reconcile' }),
    }))
  })

  it('refuses reconciliation for a subscription with no provider identifier', async () => {
    db.billingSubscription.findUnique.mockResolvedValue({ id: 'sub-local', accountId: 'acc-1', providerSubscriptionId: null })
    await expect(service.reconcile(actor, 'sub-local')).rejects.toMatchObject({ status: 409 })
    expect(paddle.getSubscription).not.toHaveBeenCalled()
  })

  const reconciledSubscription = {
    id: 'sub-local', accountId: 'acc-1', providerSubscriptionId: 'sub_x', planId: 'plan-1', priceId: 'price-1',
    provider: 'PADDLE', environment: 'SANDBOX', status: 'INCOMPLETE', cancelAtPeriodEnd: false, metadata: {},
  }

  const completedTransaction = {
    id: 'txn_1', status: 'completed', customerId: 'ctm_x', subscriptionId: 'sub_x',
    priceIds: ['pri_x'], currencyCode: 'USD', total: '1500', billingPeriod: PERIOD,
    customData: null, billedAt: null, updatedAt: '2026-10-01T04:00:05Z', checkoutUrl: null,
  }

  const mockProviderSubscription = () =>
    paddle.getSubscription.mockResolvedValue({
      id: 'sub_x', status: 'active', customerId: 'ctm_x', nextBilledAt: PERIOD.endsAt,
      currentBillingPeriod: PERIOD, scheduledChange: null,
    })

  it('recovers a completed transaction that never arrived as a webhook (lost payment)', async () => {
    db.billingSubscription.findUnique.mockResolvedValue(reconciledSubscription)
    db.billingProviderCustomer.findFirst.mockResolvedValue(accountLink)
    mockProviderSubscription()
    paddle.listTransactions.mockResolvedValue([completedTransaction])
    db.billingEvent.upsert.mockResolvedValue({ id: 'rec-row-1', eventType: 'transaction.completed', status: 'RECEIVED', payloadHash: null })
    lockRows.push(lockRow('transaction.completed', { id: 'txn_1', customer_id: 'ctm_x' }))
    db.billingSubscription.findFirst.mockResolvedValue(subscription())
    db.billingPayment.findFirst.mockResolvedValue(null)
    db.billingPayment.create.mockResolvedValue({ id: 'pay-1', accountId: 'acc-1', amountMinor: 1500n, metadata: {} })
    db.billingServicePeriod.findFirst.mockResolvedValue(null)
    db.billingOutbox.findFirst.mockResolvedValue(null)
    paddle.getTransaction.mockResolvedValue(completedTransaction)

    const result = await service.reconcile(actor, 'sub-local')

    expect(paddle.listTransactions).toHaveBeenCalledWith('ctm_x')
    expect(result.recovered).toEqual([expect.objectContaining({ transactionId: 'txn_1', status: 'processed' })])
    expect(db.billingPayment.create).toHaveBeenCalledTimes(1)
    expect(db.billingServicePeriod.create).toHaveBeenCalledTimes(1)
    // Internal recovery is stored durably but never faked as a signed webhook.
    expect(db.billingEvent.upsert).toHaveBeenCalledWith(expect.objectContaining({
      create: expect.objectContaining({ signatureValid: false, providerEventId: 'reconciliation:txn_1:2026-10-01T04:00:05Z' }),
    }))
    expect(db.billingAuditLog.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ action: 'billing.reconcile.recovered', actorUserId: 'user-1' }),
    }))
  })

  it('does not double-credit when the reconciliation event was already processed', async () => {
    db.billingSubscription.findUnique.mockResolvedValue(reconciledSubscription)
    db.billingProviderCustomer.findFirst.mockResolvedValue(accountLink)
    mockProviderSubscription()
    paddle.listTransactions.mockResolvedValue([completedTransaction])
    db.billingEvent.upsert.mockResolvedValue({ id: 'rec-row-1', eventType: 'transaction.completed', status: 'PROCESSED', payloadHash: null })
    lockRows.push(lockRow('transaction.completed', { id: 'txn_1', customer_id: 'ctm_x' }, 'processed'))

    const result = await service.reconcile(actor, 'sub-local')

    expect(result.recovered).toEqual([expect.objectContaining({ status: 'duplicate' })])
    expect(db.billingPayment.create).not.toHaveBeenCalled()
    expect(db.billingServicePeriod.create).not.toHaveBeenCalled()
    expect(paddle.getTransaction).not.toHaveBeenCalled()
  })

  it('never credits a completed transaction that belongs to another operation', async () => {
    db.billingSubscription.findUnique.mockResolvedValue(reconciledSubscription)
    db.billingProviderCustomer.findFirst.mockResolvedValue(accountLink)
    mockProviderSubscription()
    paddle.listTransactions.mockResolvedValue([
      { ...completedTransaction, subscriptionId: null, customData: { checkoutOperationId: 'other-op' } },
    ])
    db.billingEvent.upsert.mockResolvedValue({ id: 'rec-row-1', eventType: 'transaction.completed', status: 'RECEIVED', payloadHash: null })
    lockRows.push(lockRow('transaction.completed', { id: 'txn_1', customer_id: 'ctm_x' }))
    db.billingSubscription.findFirst.mockResolvedValue(null)
    paddle.getTransaction.mockResolvedValue({ ...completedTransaction, subscriptionId: null, customData: { checkoutOperationId: 'other-op' } })

    const result = await service.reconcile(actor, 'sub-local')

    expect(result.recovered).toEqual([])
    expect(db.billingPayment.create).not.toHaveBeenCalled()
    expect(db.billingServicePeriod.create).not.toHaveBeenCalled()
  })

  it('never credits a transaction whose subscription belongs to another account', async () => {
    db.billingSubscription.findUnique.mockResolvedValue(reconciledSubscription)
    db.billingProviderCustomer.findFirst.mockResolvedValue(accountLink)
    mockProviderSubscription()
    paddle.listTransactions.mockResolvedValue([completedTransaction])
    db.billingEvent.upsert.mockResolvedValue({ id: 'rec-row-1', eventType: 'transaction.completed', status: 'RECEIVED', payloadHash: null })
    lockRows.push(lockRow('transaction.completed', { id: 'txn_1', customer_id: 'ctm_x' }))
    db.billingSubscription.findFirst.mockResolvedValue({ ...subscription(), accountId: 'acc-other' })
    paddle.getTransaction.mockResolvedValue(completedTransaction)

    const result = await service.reconcile(actor, 'sub-local')

    expect(result.recovered).toEqual([expect.objectContaining({ status: 'failed' })])
    expect(db.billingPayment.create).not.toHaveBeenCalled()
  })

  it('never reprocesses a reconciliation event whose stored payload changed', async () => {
    db.billingSubscription.findUnique.mockResolvedValue(reconciledSubscription)
    db.billingProviderCustomer.findFirst.mockResolvedValue(accountLink)
    mockProviderSubscription()
    paddle.listTransactions.mockResolvedValue([completedTransaction])
    db.billingEvent.upsert.mockResolvedValue({ id: 'rec-row-1', eventType: 'transaction.completed', status: 'RECEIVED', payloadHash: 'different' })

    const result = await service.reconcile(actor, 'sub-local')

    expect(result.recovered).toEqual([])
    expect(db.billingPayment.create).not.toHaveBeenCalled()
    expect(paddle.getTransaction).not.toHaveBeenCalled()
  })

  it('never credits an unknown provider state', async () => {
    db.billingSubscription.findUnique.mockResolvedValue(reconciledSubscription)
    db.billingProviderCustomer.findFirst.mockResolvedValue(accountLink)
    mockProviderSubscription()
    paddle.listTransactions.mockResolvedValue([{ ...completedTransaction, status: 'ready' }])

    const result = await service.reconcile(actor, 'sub-local')

    expect(result.recovered).toEqual([])
    expect(db.billingEvent.upsert).not.toHaveBeenCalled()
  })
})
