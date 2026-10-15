import { ConflictException, HttpException, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common'
import { createHash } from 'node:crypto'
import { prisma } from '@aula/database'
import type { Prisma } from '@aula/database'
import type { AuthenticatedUser } from '../auth/types/authenticated-user'
import { readBillingConfig } from './billing-policy'
import { audit, billingNow, notify, requireCommercialAdmin } from './billing-store'
import {
  PADDLE_WEBHOOK_MAX_BYTES,
  PaddleSandboxError,
  createPaddleSandboxClient,
  verifyPaddleSignature,
  type PaddleBillingPeriod,
  type PaddleSandboxClient,
  type PaddleSubscription,
  type PaddleTransaction,
} from './paddle-sandbox'

/**
 * Sandbox-only provider event intake and reconciliation.
 *
 * Safety rules enforced here:
 * - The `events` switch is independent from `checkout` and from the module-wide
 *   `enabled` switch; `requireBilling()` is never used to receive events.
 * - Signatures are verified over the original bytes with the webhook secret and
 *   the database server clock; invalid signatures are never persisted.
 * - Events are stored durably before acknowledgement and deduplicated by the
 *   provider key plus a sha256 of the raw body.
 * - Processing runs inside a transaction that locks the event row and the owner
 *   (`app_users`, event -> owner order), so effects plus the terminal status are
 *   atomic. A crash or a second delivery cannot leave partial commercial state.
 * - The webhook body is never trusted for money or ownership: the provider is
 *   re-read, the customer must be mapped and the subscription/price must belong
 *   to that account before any coverage is written.
 * - Transaction status is never used as a subscription status, and unknown
 *   signed states never grant access.
 *
 * Known limits (no schema or migration may be changed from this task):
 * - `billing_events` has no `occurred_at` column: the provider timestamp lives in
 *   the stored `payload` envelope and stale-delivery protection relies on
 *   `BillingSubscription.metadata.providerUpdatedAt`.
 * - Partial refunds are tracked inside `BillingPayment.metadata.adjustmentRefunds`
 *   because no dedicated refund table exists; the amount is capped by the payment.
 * - `receive`/`retry`/`reconcile` are not yet exposed through a controller/module.
 */

const PROVIDER = 'PADDLE' as const
const ENVIRONMENT = 'SANDBOX' as const
const RETRY_DELAY_MS = 5 * 60 * 1000
const LEASE_MS = 5 * 60 * 1000
const TX_TIMEOUT_MS = 30_000

export type BillingEventOutcome = 'processed' | 'ignored' | 'failed' | 'duplicate' | 'rejected'

export interface BillingEventReceiveResult {
  accepted: boolean
  status: BillingEventOutcome
  eventId?: string
  reason?: string
  duplicate?: boolean
}

type Db = Prisma.TransactionClient
type SubscriptionWithPrice = Prisma.BillingSubscriptionGetPayload<{ include: { price: true; plan: true } }>
type ProcessingOutcome = 'processed' | 'ignored' | 'incomplete'

// ---------------------------------------------------------------------------
// Pure helpers
// ---------------------------------------------------------------------------

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : null

const asString = (value: unknown): string | null => (typeof value === 'string' ? value : null)

const asMetadata = (value: unknown): Record<string, unknown> => asRecord(value) ?? {}

const parseDate = (value: string | null | undefined): Date | null => {
  if (!value) return null
  const date = new Date(value)
  return Number.isFinite(date.getTime()) ? date : null
}

const parseMinor = (value: string | null): bigint | null => {
  if (!value || !/^\d+$/.test(value)) return null
  try {
    const amount = BigInt(value)
    return amount >= 0n ? amount : null
  } catch {
    return null
  }
}

const sha256 = (bytes: Buffer): string => createHash('sha256').update(bytes).digest('hex')

const isUniqueViolation = (error: unknown): boolean =>
  typeof error === 'object' && error !== null && (error as { code?: unknown }).code === 'P2002'

const isRetryable = (error: unknown): boolean => {
  if (error instanceof PaddleSandboxError) return error.retryable
  if (typeof error === 'object' && error !== null) {
    const candidate = error as { name?: unknown; retryable?: unknown }
    if (candidate.name === 'PaddleSandboxError') return candidate.retryable !== false
  }
  return true
}

/** A stable, secret-free description. Never echoes provider messages or tokens. */
const genericMessage = (error: unknown): string => {
  if (typeof error === 'object' && error !== null) {
    const code = (error as { code?: unknown }).code
    if (typeof code === 'string' && /^[a-z0-9_]{1,40}$/i.test(code)) return `processing_failed:${code}`
  }
  return 'processing_failed'
}

const EVENT_STATUS = {
  received: 'RECEIVED',
  processing: 'PROCESSING',
  processed: 'PROCESSED',
  failed: 'FAILED',
  ignored: 'IGNORED',
} as const

/** PostgreSQL stores the enum in lower case; never compare raw values to upper case. */
const normalizeEventStatus = (raw: string): keyof typeof EVENT_STATUS_MAP => {
  const upper = (raw ?? '').toUpperCase()
  return (EVENT_STATUS_MAP[upper] ?? 'FAILED')
}

const EVENT_STATUS_MAP: Record<string, 'RECEIVED' | 'PROCESSING' | 'PROCESSED' | 'FAILED' | 'IGNORED'> = {
  RECEIVED: 'RECEIVED',
  PROCESSING: 'PROCESSING',
  PROCESSED: 'PROCESSED',
  FAILED: 'FAILED',
  IGNORED: 'IGNORED',
}

const KNOWN_SUBSCRIPTION_EVENTS = new Set([
  'subscription.created',
  'subscription.updated',
  'subscription.activated',
  'subscription.canceled',
  'subscription.past_due',
  'subscription.trialing',
  'subscription.paused',
  'subscription.resumed',
])

const PROVIDER_STATUS: Record<string, 'ACTIVE' | 'TRIALING' | 'PAST_DUE' | 'PAUSED' | 'CANCELED' | 'EXPIRED' | 'INCOMPLETE' | 'UNKNOWN'> = {
  active: 'ACTIVE',
  trialing: 'TRIALING',
  past_due: 'PAST_DUE',
  paused: 'PAUSED',
  canceled: 'CANCELED',
  canceling: 'CANCELED',
  expired: 'EXPIRED',
  incomplete: 'INCOMPLETE',
}

/** Maps a provider SUBSCRIPTION status. Never grants access for unknown states. */
const mapSubscriptionStatus = (providerStatus: string) => PROVIDER_STATUS[providerStatus] ?? 'UNKNOWN'

const OPEN_DISPUTE_STATUSES = new Set(['open', 'under_review', 'pending'])

/**
 * Provider transaction statuses that are safe to reprocess during reconciliation.
 * Anything else (draft, ready, billed, canceled) never represents settled money.
 */
const RECONCILIATION_EVENT_TYPES: Record<string, string> = {
  completed: 'transaction.completed',
  past_due: 'transaction.payment_failed',
}

interface BillingEnvelope {
  eventId: string
  eventType: string
  payload: Prisma.InputJsonValue
  data: Record<string, unknown>
}

const parseEnvelope = (bytes: Buffer): BillingEnvelope | null => {
  let parsed: unknown
  try {
    parsed = JSON.parse(bytes.toString('utf8'))
  } catch {
    return null
  }
  const record = asRecord(parsed)
  if (!record) return null
  const eventId = asString(record.event_id)
  const eventType = asString(record.event_type)
  const occurredAt = parseDate(asString(record.occurred_at))
  const data = asRecord(record.data)
  if (!eventId || eventId.length > 200 || !eventType || !occurredAt || !data) return null
  return { eventId, eventType, payload: record as unknown as Prisma.InputJsonValue, data }
}

interface LockedEvent {
  id: string
  status: keyof typeof EVENT_STATUS_MAP
  updated_at: Date
  event_type: string
  payload: unknown
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

@Injectable()
export class BillingEventsService {
  /** Verifies the raw bytes and persists the event durably before acknowledging it. */
  async receive(rawBody: Buffer, signature: string): Promise<BillingEventReceiveResult> {
    const config = readBillingConfig(process.env)
    // Independent from checkout and from requireBilling().enabled.
    if (!config.events) return { accepted: false, status: 'rejected', reason: 'events_disabled' }

    const secret = process.env.PADDLE_SANDBOX_WEBHOOK_SECRET
    if (!secret) return { accepted: false, status: 'rejected', reason: 'not_configured' }

    const bytes = Buffer.isBuffer(rawBody) ? rawBody : Buffer.from(rawBody ?? '')
    if (bytes.byteLength === 0 || bytes.byteLength > PADDLE_WEBHOOK_MAX_BYTES) {
      return { accepted: false, status: 'rejected', reason: 'invalid_size' }
    }

    const now = await billingNow(prisma)
    if (!verifyPaddleSignature({ rawBody: bytes, signatureHeader: signature, secret, now })) {
      return { accepted: false, status: 'rejected', reason: 'invalid_signature' }
    }

    const envelope = parseEnvelope(bytes)
    if (!envelope) return { accepted: false, status: 'rejected', reason: 'invalid_envelope' }

    const payloadHash = sha256(bytes)
    const key = { provider: PROVIDER, environment: ENVIRONMENT, providerEventId: envelope.eventId }
    const existing = await prisma.billingEvent.findUnique({ where: { provider_environment_providerEventId: key } })
    if (existing && existing.payloadHash !== payloadHash) {
      await this.auditMismatch(existing.id, envelope.eventId)
      return { accepted: false, status: 'rejected', reason: 'payload_mismatch' }
    }

    let event
    try {
      event = await prisma.billingEvent.upsert({
        where: { provider_environment_providerEventId: key },
        create: {
          provider: PROVIDER,
          environment: ENVIRONMENT,
          providerEventId: envelope.eventId,
          eventType: envelope.eventType,
          status: 'RECEIVED',
          payload: envelope.payload,
          payloadHash,
          signatureValid: true,
          attempts: 0,
        },
        update: { signatureValid: true },
      })
    } catch (error) {
      if (!isUniqueViolation(error)) throw error
      const raced = await prisma.billingEvent.findUnique({ where: { provider_environment_providerEventId: key } })
      if (!raced) return { accepted: false, status: 'rejected', reason: 'race_unresolved' }
      if (raced.payloadHash !== payloadHash) {
        await this.auditMismatch(raced.id, envelope.eventId)
        return { accepted: false, status: 'rejected', reason: 'payload_mismatch' }
      }
      return { accepted: true, status: 'duplicate', duplicate: true, eventId: raced.id }
    }

    // A concurrent upsert can win without raising P2002: always compare the stored hash.
    if (event.payloadHash !== payloadHash) {
      await this.auditMismatch(event.id, envelope.eventId)
      return { accepted: false, status: 'rejected', reason: 'payload_mismatch' }
    }

    if (existing && (existing.status === 'PROCESSED' || existing.status === 'IGNORED' || existing.status === 'PROCESSING')) {
      return { accepted: true, status: 'duplicate', duplicate: true, eventId: event.id }
    }

    return this.processEvent(event.id, now, false)
  }

  /** Commercial admin recovery of a stuck, failed or not-yet-processed event. */
  async retry(actor: AuthenticatedUser, eventId: string): Promise<BillingEventReceiveResult> {
    await requireCommercialAdmin(actor.id)
    const now = await billingNow(prisma)
    return this.processEvent(eventId, now, true)
  }

  /** Provider truth for a local subscription; never runs a charge or invents a payment. */
  async reconcile(actor: AuthenticatedUser, subscriptionId: string) {
    await requireCommercialAdmin(actor.id)
    const now = await billingNow(prisma)

    const subscription = await prisma.billingSubscription.findUnique({
      where: { id: subscriptionId },
      include: { price: true, plan: true },
    })
    if (!subscription) throw new NotFoundException('Suscripción no encontrada.')
    const operationId = asString(asMetadata(subscription.metadata).checkoutOperationId)
    if ((!subscription.providerSubscriptionId && !operationId) || subscription.provider !== PROVIDER || subscription.environment !== ENVIRONMENT) {
      throw new ConflictException('La suscripción no tiene un identificador del proveedor.')
    }

    const link = await prisma.billingProviderCustomer.findFirst({ where: { accountId: subscription.accountId, provider: PROVIDER, environment: ENVIRONMENT } })
    if (!link) throw new ConflictException('La cuenta no tiene una vinculación sandbox verificable.')
    const provided = subscription.providerSubscriptionId ? await this.createPaddleClient().getSubscription(subscription.providerSubscriptionId) : null
    if (provided && (provided.id !== subscription.providerSubscriptionId || provided.customerId !== link.providerCustomerId)) {
      throw new ConflictException('La identidad del proveedor no corresponde a la cuenta comercial.')
    }
    await prisma.$transaction(async (tx) => {
      await this.lockAccount(tx, subscription.accountId)
      await requireCommercialAdmin(actor.id, tx)
      const current = await tx.billingSubscription.findUnique({ where: { id: subscription.id }, include: { price: true, plan: true } })
      if (!current) throw new NotFoundException('Suscripción no encontrada.')
      if (provided) await this.applyProviderSubscription(tx, current, provided, now)
      await audit(tx, {
        accountId: subscription.accountId,
        actorUserId: actor.id,
        actorType: 'user',
        action: 'billing.reconcile',
        entityType: 'billing_subscription',
        entityId: subscription.id,
        metadata: { providerStatus: provided?.status ?? 'incomplete' },
      })
    }, { timeout: TX_TIMEOUT_MS })

    // Recover transactions the provider already settled but whose webhook never
    // arrived. Only the server-side mapped customer id is used.
    const recovered = await this.recoverCustomerTransactions(actor, subscription, link.providerCustomerId, now)
    const latest = provided ? null : await prisma.billingSubscription.findUnique({ where: { id: subscription.id } })

    return {
      subscriptionId: subscription.id,
      status: provided ? mapSubscriptionStatus(provided.status) : latest?.status ?? subscription.status,
      providerStatus: provided?.status ?? latest?.providerStatus ?? 'incomplete',
      currentPeriodEnd: provided?.currentBillingPeriod?.endsAt ?? latest?.currentPeriodEnd?.toISOString() ?? null,
      recovered,
    }
  }

  /**
   * Turns missed provider transactions into durable internal events and runs them
   * through the same atomic pipeline, so ownership, price and amount checks are
   * never bypassed. Never creates a charge and never trusts a caller-supplied id.
   */
  private async recoverCustomerTransactions(
    actor: AuthenticatedUser,
    subscription: SubscriptionWithPrice,
    customerId: string,
    now: Date,
  ): Promise<Array<{ transactionId: string; eventType: string; eventId: string; status: BillingEventOutcome }>> {
    const accountId = subscription.accountId
    const transactions = await this.createPaddleClient().listTransactions(customerId)
    const recovered: Array<{ transactionId: string; eventType: string; eventId: string; status: BillingEventOutcome }> = []

    for (const transaction of transactions) {
      if (transaction.customerId !== customerId) continue
      const operationId = asString(asMetadata(subscription.metadata).checkoutOperationId)
      const sameSubscription = !!subscription.providerSubscriptionId && transaction.subscriptionId === subscription.providerSubscriptionId
      const sameOperation = !!operationId && asString(transaction.customData?.checkoutOperationId) === operationId
      if (!sameSubscription && !sameOperation) continue
      const eventType = RECONCILIATION_EVENT_TYPES[transaction.status]
      if (!eventType || !transaction.id) continue

      // Stable per provider state: re-running reconcile without a change is a no-op.
      const providerEventId = `reconciliation:${transaction.id}:${transaction.updatedAt ?? transaction.status}`
      const envelope = {
        event_id: providerEventId,
        event_type: eventType,
        occurred_at: transaction.updatedAt ?? transaction.billedAt ?? subscription.createdAt?.toISOString() ?? '1970-01-01T00:00:00Z',
        source: 'reconciliation',
        data: { id: transaction.id, customer_id: customerId },
      }
      const payload = envelope as unknown as Prisma.InputJsonValue
      const payloadHash = sha256(Buffer.from(JSON.stringify(envelope)))
      const key = { provider: PROVIDER, environment: ENVIRONMENT, providerEventId }

      let event
      try {
        event = await prisma.billingEvent.upsert({
          where: { provider_environment_providerEventId: key },
          create: {
            provider: PROVIDER,
            environment: ENVIRONMENT,
            providerEventId,
            eventType,
            status: 'RECEIVED',
            payload,
            payloadHash,
            // Internal recovery is never presented as a verified provider signature.
            signatureValid: false,
            attempts: 0,
          },
          update: {},
        })
      } catch (error) {
        // A concurrent reconcile created the same event; never duplicate its effects.
        if (!isUniqueViolation(error)) throw error
        continue
      }

      // Never reprocess an event whose stored payload was replaced by another writer.
      if (event.payloadHash !== null && event.payloadHash !== payloadHash) continue

      const result = await this.processEvent(event.id, now, false)
      if (result.status !== 'duplicate') {
        await audit(prisma, {
          accountId,
          actorUserId: actor.id,
          actorType: 'user',
          action: 'billing.reconcile.recovered',
          entityType: 'billing_event',
          entityId: event.id,
          metadata: { transactionId: transaction.id, eventType, status: result.status },
        })
      }
      recovered.push({ transactionId: transaction.id, eventType, eventId: event.id, status: result.status })
    }

    return recovered
  }

  // -----------------------------------------------------------------------
  // Atomic processing
  // -----------------------------------------------------------------------

  private async processEvent(eventId: string, now: Date, requireRecoverable: boolean): Promise<BillingEventReceiveResult> {
    try {
      return await prisma.$transaction(async (tx) => {
        const rows = await tx.$queryRaw<LockedEvent[]>`
          select id, status, updated_at, event_type, payload from public.billing_events where id = ${eventId}::uuid for update`
        if (!rows.length) throw new NotFoundException('Evento no encontrado.')
        const row = rows[0]
        // PostgreSQL returns the enum in lower case; normalize before comparing.
        const status = normalizeEventStatus(row.status)

        if (status === 'PROCESSED' || status === 'IGNORED') {
          if (requireRecoverable) throw new ConflictException('El evento ya fue procesado y no se puede reintentar.')
          return { accepted: true, status: 'duplicate', duplicate: true, eventId } satisfies BillingEventReceiveResult
        }
        if (status === 'PROCESSING' && now.getTime() - new Date(row.updated_at).getTime() < LEASE_MS) {
          if (requireRecoverable) throw new ConflictException('El evento todavía se está procesando.')
          return { accepted: true, status: 'duplicate', duplicate: true, eventId } satisfies BillingEventReceiveResult
        }

        const payload = asRecord(row.payload)
        const data = asRecord(payload?.data) ?? {}
        const occurredAt = parseDate(asString(payload?.occurred_at)) ?? row.updated_at ?? now

        // Consistent lock order: event row first (above), then its owner when identifiable.
        const customerId = asString(data.customer_id)
        if (customerId) {
          const link = await tx.billingProviderCustomer.findFirst({
            where: { provider: PROVIDER, environment: ENVIRONMENT, providerCustomerId: customerId },
            select: { account: { select: { userId: true } } },
          })
          if (link?.account?.userId) {
            await tx.$queryRaw`select id from public.app_users where id = ${link.account.userId}::uuid for update`
          }
        }

        await tx.billingEvent.update({
          where: { id: eventId },
          data: { status: 'PROCESSING', attempts: { increment: 1 }, nextRetryAt: null },
        })

        // Remote reads (never mutations) are allowed inside the transaction.
        const outcome = await this.dispatch(tx, row.event_type, data, occurredAt, now)

        if (outcome === 'incomplete') {
          // Real effects already committed (e.g. a confirmed payment) but coverage is
          // not invented; keep the event recoverable instead of terminal.
          await tx.billingEvent.update({
            where: { id: eventId },
            data: { status: 'FAILED', lastError: 'coverage_period_missing', nextRetryAt: new Date(now.getTime() + RETRY_DELAY_MS) },
          })
          return { accepted: true, status: 'failed', eventId, reason: 'coverage_period_missing' } satisfies BillingEventReceiveResult
        }

        await tx.billingEvent.update({
          where: { id: eventId },
          data: {
            status: outcome === 'ignored' ? 'IGNORED' : 'PROCESSED',
            processedAt: now,
            lastError: null,
            nextRetryAt: null,
          },
        })
        return { accepted: true, status: outcome, eventId } satisfies BillingEventReceiveResult
      }, { timeout: TX_TIMEOUT_MS })
    } catch (error) {
      // Conflicts are control flow, not processing failures.
      if (error instanceof HttpException) throw error
      // The effects above rolled back with the transaction; persist the failure separately.
      await prisma.billingEvent.update({
        where: { id: eventId },
        data: {
          status: 'FAILED',
          attempts: { increment: 1 },
          lastError: genericMessage(error),
          nextRetryAt: isRetryable(error) ? new Date(now.getTime() + RETRY_DELAY_MS) : null,
        },
      })
      return { accepted: true, status: 'failed', eventId, reason: 'processing_failed' }
    }
  }

  private async dispatch(
    tx: Db,
    eventType: string,
    data: Record<string, unknown>,
    occurredAt: Date,
    now: Date,
  ): Promise<ProcessingOutcome> {
    switch (eventType) {
      case 'transaction.completed':
        return this.onTransactionCompleted(tx, data, occurredAt, now)
      case 'transaction.payment_failed':
        return this.onPaymentFailed(tx, data)
      case 'transaction.refunded':
        return this.onTransactionRefunded(tx, data)
      case 'adjustment.created':
      case 'adjustment.updated':
        return this.onAdjustment(tx, data)
      case 'dispute.created':
      case 'dispute.updated':
        return this.onDispute(tx, data)
      default:
        if (KNOWN_SUBSCRIPTION_EVENTS.has(eventType)) return this.onSubscriptionChanged(tx, data, occurredAt)
        // Unknown signed states never grant access or mutate commercial records.
        return 'ignored'
    }
  }

  // -----------------------------------------------------------------------
  // Event handlers (all effects go through the provided transaction client)
  // -----------------------------------------------------------------------

  private async onTransactionCompleted(tx: Db, data: Record<string, unknown>, occurredAt: Date, now: Date): Promise<ProcessingOutcome> {
    const transactionId = asString(data.id)
    if (!transactionId) throw new Error('missing_transaction_id')

    // Never trust the body: re-read the transaction from the provider.
    const provider = await this.createPaddleClient().getTransaction(transactionId)
    if (provider.status !== 'completed') return 'processed'

    const accountId = await this.resolveAccountId(tx, provider.customerId)
    if (!accountId) throw new Error('unmapped_customer')

    const subscription = await this.resolveSubscription(tx, accountId, provider)
    if (!subscription || !subscription.providerSubscriptionId) throw new Error('unmapped_subscription')

    const price = subscription.price
    if (!price.providerPriceId || !provider.priceIds.includes(price.providerPriceId)) throw new Error('price_mismatch')
    if (!provider.currencyCode || provider.currencyCode !== price.currency) throw new Error('currency_mismatch')

    const amount = parseMinor(provider.total)
    if (amount === null) throw new Error('invalid_amount')
    // A zero-amount invoice is not money received.
    if (amount === 0n) return 'processed'

    if (amount !== price.amountMinor) {
      // Never credit an amount other than the server-authorized sandbox price.
      await audit(tx, {
        accountId,
        actorType: 'provider',
        action: 'billing.payment.amount_mismatch',
        entityType: 'billing_subscription',
        entityId: subscription.id,
        metadata: { transactionId: provider.id, amount: amount.toString(), expected: price.amountMinor.toString() },
      })
      await notify(tx, accountId, 'payment_review_required', `review:${provider.id}`, { transactionId: provider.id })
      return 'processed'
    }

    // Current subscription state from the provider, with a verified identity.
    const current = await this.createPaddleClient().getSubscription(subscription.providerSubscriptionId)
    if (current.id !== subscription.providerSubscriptionId || current.customerId !== provider.customerId) {
      throw new Error('subscription_identity_mismatch')
    }

    // Idempotent payment by provider id; a transaction is real money even before coverage exists.
    let payment = await tx.billingPayment.findFirst({
      where: { provider: PROVIDER, environment: ENVIRONMENT, providerPaymentId: provider.id },
    })
    if (!payment) {
      const checkoutOperationId = asString((provider.customData ?? {}).checkoutOperationId)
      payment = await tx.billingPayment.create({
        data: {
          accountId,
          subscriptionId: subscription.id,
          planId: subscription.planId,
          priceId: subscription.priceId,
          source: 'PROVIDER',
          provider: PROVIDER,
          environment: ENVIRONMENT,
          providerPaymentId: provider.id,
          amountMinor: amount,
          currency: price.currency,
          status: 'SUCCEEDED',
          paidAt: parseDate(provider.billedAt) ?? occurredAt,
          idempotencyKey: `paddle:${provider.id}`,
          metadata: checkoutOperationId
            ? { transactionId: provider.id, checkoutOperationId }
            : { transactionId: provider.id },
        },
      })
      await audit(tx, {
        accountId,
        actorType: 'provider',
        action: 'billing.payment.succeeded',
        entityType: 'billing_payment',
        entityId: payment.id,
        metadata: { transactionId: provider.id },
      })
      await notify(tx, accountId, 'payment_received', `payment:${provider.id}`, { transactionId: provider.id })
    }

    const receipt = await tx.billingDocument.findFirst({ where: { paymentId: payment.id, documentType: 'RECEIPT' } })
    if (!receipt) {
      await tx.billingDocument.create({ data: {
        accountId, paymentId: payment.id, documentType: 'RECEIPT', number: `REC-${payment.id}`,
        amountMinor: amount, currency: price.currency, environment: ENVIRONMENT, issuedAt: now,
      } })
    }

    // Subscription state must come from the provider subscription, never from the transaction.
    await this.applyProviderSubscription(tx, subscription, current, occurredAt)

    // Coverage must be attributed to the transaction's own provider period. If it is
    // missing, do not invent coverage and keep the event recoverable.
    if (!provider.billingPeriod) return 'incomplete'
    const startsAt = parseDate(provider.billingPeriod.startsAt)
    const endsAt = parseDate(provider.billingPeriod.endsAt)
    if (!startsAt || !endsAt || endsAt <= startsAt) return 'incomplete'

    // One coverage period per payment.
    const existingPeriod = await tx.billingServicePeriod.findFirst({ where: { paymentId: payment.id }, select: { id: true } })
    if (!existingPeriod) {
      await tx.billingServicePeriod.create({
        data: {
          accountId,
          planId: subscription.planId,
          paymentId: payment.id,
          source: 'SUBSCRIPTION',
          startsAt,
          endsAt,
          note: `paddle:${provider.id}`,
        },
      })
    }

    // The free trial only ends on a confirmed, positive, covered payment.
    await tx.billingTrial.updateMany({
      where: { accountId, status: 'ACTIVE' },
      data: { status: 'CONVERTED', convertedAt: now, endedAt: now },
    })
    return 'processed'
  }

  private async onPaymentFailed(tx: Db, data: Record<string, unknown>): Promise<ProcessingOutcome> {
    const transactionId = asString(data.id)
    if (!transactionId) throw new Error('missing_transaction_id')

    const provider = await this.createPaddleClient().getTransaction(transactionId)
    // Grace requires a real failed-renewal state, not any payment_failed delivery.
    if (provider.status !== 'past_due') return 'processed'

    const accountId = await this.resolveAccountId(tx, provider.customerId)
    if (!accountId) throw new Error('unmapped_customer')

    const subscription = await this.resolveSubscription(tx, accountId, provider)
    if (!subscription) throw new Error('unmapped_subscription')
    // The failure must belong to the mapped subscription.
    if (!provider.subscriptionId || provider.subscriptionId !== subscription.providerSubscriptionId) return 'processed'

    // Only a client with prior successful payment can receive grace.
    const priorPaid = await tx.billingPayment.findFirst({
      where: { subscriptionId: subscription.id, status: 'SUCCEEDED', amountMinor: { gt: 0n } },
      select: { id: true },
    })
    if (!priorPaid) return 'processed'

    // No grace when this very transaction was already paid.
    const paidTransaction = await tx.billingPayment.findFirst({
      where: { provider: PROVIDER, environment: ENVIRONMENT, providerPaymentId: provider.id, status: 'SUCCEEDED' },
      select: { id: true },
    })
    if (paidTransaction) return 'processed'

    // Grace is derived from the confirmed failed period on the transaction itself.
    if (!provider.billingPeriod) return 'incomplete'
    // A failed renewal invoices the upcoming month. Grace starts when that month
    // starts (the previous paid coverage expires), not one unpaid month later.
    const failedStart = parseDate(provider.billingPeriod.startsAt)
    if (!failedStart) return 'incomplete'

    // No grace when a later paid period already covers the account.
    const laterPeriod = await tx.billingServicePeriod.findFirst({
      where: { accountId, source: 'SUBSCRIPTION', endsAt: { gt: failedStart }, payment: { status: 'SUCCEEDED' } },
      select: { id: true },
    })
    if (laterPeriod) return 'processed'

    const note = `renewal:${provider.id}`
    // The DB partial index agrees, but a pre-check avoids poisoning the transaction.
    const existingGrace = await tx.billingServicePeriod.findFirst({
      where: { accountId, source: 'GRACE', note },
      select: { id: true },
    })
    if (existingGrace) return 'processed'

    const graceDays = readBillingConfig(process.env).graceDays
    if (graceDays === 0) return 'processed'
    const endsAt = new Date(failedStart.getTime() + graceDays * 86_400_000)
    await tx.billingServicePeriod.create({
      data: { accountId, planId: subscription.planId, source: 'GRACE', startsAt: failedStart, endsAt, note },
    })
    await audit(tx, {
      accountId,
      actorType: 'provider',
      action: 'billing.grace.started',
      entityType: 'billing_subscription',
      entityId: subscription.id,
      metadata: { transactionId: provider.id, note },
    })
    await notify(tx, accountId, 'grace_started', note, { transactionId: provider.id })
    return 'processed'
  }

  private async onTransactionRefunded(tx: Db, data: Record<string, unknown>): Promise<ProcessingOutcome> {
    const providerPaymentId = asString(data.id)
    if (!providerPaymentId) return 'processed'
    const payment = await tx.billingPayment.findFirst({
      where: { provider: PROVIDER, environment: ENVIRONMENT, providerPaymentId },
    })
    if (!payment) return 'processed'
    // Conservative and non-reactivatable: only downgrade a still-successful payment.
    if (payment.status !== 'SUCCEEDED') return 'processed'
    await tx.billingPayment.update({
      where: { id: payment.id },
      data: { status: 'REFUNDED', amountRefundedMinor: payment.amountMinor },
    })
    await audit(tx, {
      accountId: payment.accountId,
      actorType: 'provider',
      action: 'billing.refund.recorded',
      entityType: 'billing_payment',
      entityId: payment.id,
      metadata: { providerPaymentId },
    })
    await notify(tx, payment.accountId, 'payment_refunded', `refund:${providerPaymentId}`, { providerPaymentId })
    return 'processed'
  }

  private async onAdjustment(tx: Db, data: Record<string, unknown>): Promise<ProcessingOutcome> {
    // Only approved refund adjustments change a payment; pending ones are reviewed.
    if (asString(data.action) !== 'refund') return 'processed'
    const adjustmentId = asString(data.id)
    const providerPaymentId = asString(data.transaction_id)
    if (!adjustmentId || !providerPaymentId) return 'processed'

    let payment = await tx.billingPayment.findFirst({
      where: { provider: PROVIDER, environment: ENVIRONMENT, providerPaymentId },
    })
    if (!payment) return 'processed'
    // Different event IDs can refund the same payment concurrently. Serialize on
    // the verified owner and re-read after the lock, including when the envelope
    // has no customer_id (as adjustment notifications may legitimately omit it).
    await this.lockAccount(tx, payment.accountId)
    payment = await tx.billingPayment.findFirst({ where: { id: payment.id } })
    if (!payment) throw new Error('payment_disappeared')

    const status = asString(data.status)
    if (status !== 'approved') {
      await audit(tx, {
        accountId: payment.accountId,
        actorType: 'provider',
        action: 'billing.refund.pending_review',
        entityType: 'billing_payment',
        entityId: payment.id,
        metadata: { adjustmentId, status: status ?? 'unknown' },
      })
      return 'processed'
    }

    const totals = asRecord(data.totals)
    const amount = parseMinor(asString(totals?.total) ?? asString(data.total))
    if (amount === null || amount <= 0n) return 'processed'

    const metadata = asMetadata(payment.metadata)
    const refunds = asMetadata(metadata.adjustmentRefunds)
    // Repeated deliveries of the same adjustment must not double count.
    if (adjustmentId in refunds) return 'processed'

    const sum = payment.amountRefundedMinor + amount
    const capped = sum > payment.amountMinor ? payment.amountMinor : sum
    const nextRefunds: Record<string, string> = {}
    for (const [id, value] of Object.entries(refunds)) nextRefunds[id] = String(value)
    nextRefunds[adjustmentId] = amount.toString()
    await tx.billingPayment.update({
      where: { id: payment.id },
      data: {
        amountRefundedMinor: capped,
        status: capped >= payment.amountMinor ? 'REFUNDED' : 'PARTIALLY_REFUNDED',
        metadata: { ...metadata, adjustmentRefunds: nextRefunds } as Prisma.InputJsonValue,
      },
    })
    await audit(tx, {
      accountId: payment.accountId,
      actorType: 'provider',
      action: 'billing.refund.recorded',
      entityType: 'billing_payment',
      entityId: payment.id,
      metadata: { adjustmentId, amount: amount.toString(), refundedMinor: capped.toString() },
    })
    await notify(tx, payment.accountId, 'payment_refunded', `refund:${adjustmentId}`, { adjustmentId })
    return 'processed'
  }

  private async onDispute(tx: Db, data: Record<string, unknown>): Promise<ProcessingOutcome> {
    const status = asString(data.status)
    // Only an open dispute flags the payment; never reactivate it from old events.
    if (status && !OPEN_DISPUTE_STATUSES.has(status)) return 'processed'
    const providerPaymentId = asString(data.transaction_id)
    if (!providerPaymentId) return 'processed'
    const payment = await tx.billingPayment.findFirst({
      where: { provider: PROVIDER, environment: ENVIRONMENT, providerPaymentId },
    })
    if (!payment || payment.status === 'DISPUTED') return 'processed'
    await tx.billingPayment.update({ where: { id: payment.id }, data: { status: 'DISPUTED' } })
    await audit(tx, {
      accountId: payment.accountId,
      actorType: 'provider',
      action: 'billing.dispute.recorded',
      entityType: 'billing_payment',
      entityId: payment.id,
      metadata: { providerPaymentId, status: status ?? 'unknown' },
    })
    await notify(tx, payment.accountId, 'payment_disputed', `dispute:${payment.id}`, { providerPaymentId })
    return 'processed'
  }

  private async onSubscriptionChanged(tx: Db, data: Record<string, unknown>, occurredAt: Date): Promise<ProcessingOutcome> {
    const providerSubscriptionId = asString(data.id)
    if (!providerSubscriptionId) return 'processed'
    const subscription = await tx.billingSubscription.findFirst({
      where: { provider: PROVIDER, environment: ENVIRONMENT, providerSubscriptionId },
      include: { price: true, plan: true },
    })
    if (!subscription) return 'processed'
    // Always read the current provider state so stale deliveries cannot restore old states.
    const provided = await this.createPaddleClient().getSubscription(providerSubscriptionId)
    if (provided.id !== providerSubscriptionId) throw new Error('subscription_identity_mismatch')
    const link = await tx.billingProviderCustomer.findFirst({
      where: { accountId: subscription.accountId, provider: PROVIDER, environment: ENVIRONMENT },
      select: { providerCustomerId: true },
    })
    if (link && provided.customerId !== link.providerCustomerId) throw new Error('customer_mismatch')

    const wasCanceled = subscription.status === 'CANCELED'
    await this.applyProviderSubscription(tx, subscription, provided, occurredAt)
    if (mapSubscriptionStatus(provided.status) === 'CANCELED' && !wasCanceled) {
      await audit(tx, {
        accountId: subscription.accountId,
        actorType: 'provider',
        action: 'billing.subscription.canceled',
        entityType: 'billing_subscription',
        entityId: subscription.id,
        metadata: { providerSubscriptionId },
      })
      await notify(tx, subscription.accountId, 'subscription_canceled', `canceled:${providerSubscriptionId}`, {})
    }
    return 'processed'
  }

  // -----------------------------------------------------------------------
  // Ownership and state helpers (all accept the transaction client)
  // -----------------------------------------------------------------------

  private async resolveAccountId(tx: Db, customerId: string | null): Promise<string | null> {
    // An account id from the payload is never accepted without a mapped sandbox customer.
    if (!customerId) return null
    const link = await tx.billingProviderCustomer.findFirst({
      where: { provider: PROVIDER, environment: ENVIRONMENT, providerCustomerId: customerId },
      include: { account: { select: { status: true, sandbox: true } } },
    })
    if (!link || link.account.status !== 'ACTIVE' || !link.account.sandbox) return null
    await this.lockAccount(tx, link.accountId)
    return link.accountId
  }

  private async lockAccount(tx: Db, accountId: string) {
    await tx.$queryRaw`select u.id from public.app_users u
      join public.billing_accounts a on a.user_id = u.id
      where a.id = ${accountId}::uuid for update of u`
  }

  private async resolveSubscription(tx: Db, accountId: string, transaction: PaddleTransaction): Promise<SubscriptionWithPrice | null> {
    const checkoutOperationId = asString((transaction.customData ?? {}).checkoutOperationId)

    if (transaction.subscriptionId) {
      const linked = await tx.billingSubscription.findFirst({
        where: { provider: PROVIDER, environment: ENVIRONMENT, providerSubscriptionId: transaction.subscriptionId },
        include: { price: true, plan: true },
      })
      if (linked) {
        if (linked.accountId !== accountId) throw new Error('subscription_owner_mismatch')
        return linked
      }
    }

    // First payment: link the incomplete subscription through a non-authoritative operation id.
    if (checkoutOperationId) {
      const pending = await tx.billingSubscription.findFirst({
        where: {
          accountId,
          status: 'INCOMPLETE',
          provider: PROVIDER,
          environment: ENVIRONMENT,
          metadata: { path: ['checkoutOperationId'], equals: checkoutOperationId },
        },
        include: { price: true, plan: true },
      })
      if (pending) {
        if (transaction.subscriptionId) {
          await tx.billingSubscription.update({
            where: { id: pending.id },
            data: { providerSubscriptionId: transaction.subscriptionId },
          })
          pending.providerSubscriptionId = transaction.subscriptionId
        }
        return pending
      }
    }

    return null
  }

  private isStale(metadata: unknown, occurredAt: Date): boolean {
    const stored = parseDate(asString(asMetadata(metadata).providerUpdatedAt))
    return stored !== null && occurredAt.getTime() <= stored.getTime()
  }

  private async applyProviderSubscription(tx: Db, subscription: SubscriptionWithPrice, provided: PaddleSubscription, occurredAt: Date) {
    const version = parseDate(provided.updatedAt) ?? occurredAt
    if (this.isStale(subscription.metadata, version)) return
    const period = provided.currentBillingPeriod
    const status = mapSubscriptionStatus(provided.status)
    if (status === 'UNKNOWN') throw new Error('unknown_subscription_status')
    await tx.billingSubscription.update({
      where: { id: subscription.id },
      data: {
        providerStatus: provided.status,
        status,
        ...(period
          ? { currentPeriodStart: parseDate(period.startsAt) ?? undefined, currentPeriodEnd: parseDate(period.endsAt) ?? undefined }
          : {}),
        cancelAtPeriodEnd: provided.scheduledChange?.action === 'cancel',
        ...(status === 'CANCELED' ? { canceledAt: occurredAt, endedAt: occurredAt } : {}),
        metadata: { ...asMetadata(subscription.metadata), providerUpdatedAt: version.toISOString(), nextBilledAt: provided.nextBilledAt,
          scheduledChange: provided.scheduledChange ? { action: provided.scheduledChange.action, effectiveAt: provided.scheduledChange.effectiveAt } : null },
      },
    })
  }

  private async auditMismatch(eventId: string, providerEventId: string) {
    await prisma.billingAuditLog.create({
      data: {
        actorType: 'provider',
        action: 'provider_event.payload_mismatch',
        entityType: 'billing_event',
        entityId: eventId,
        metadata: { providerEventId },
      },
    })
  }

  private createPaddleClient(): PaddleSandboxClient {
    const apiKey = process.env.PADDLE_SANDBOX_API_KEY
    const webhookSecret = process.env.PADDLE_SANDBOX_WEBHOOK_SECRET
    if (!apiKey || !webhookSecret) {
      throw new ServiceUnavailableException('La integración con Paddle no está configurada.')
    }
    return createPaddleSandboxClient({ apiKey, webhookSecret })
  }
}

// ---------------------------------------------------------------------------
// Defensive: keep a reference to the raw enum map so a future schema change is
// caught at compile time instead of silently comparing raw lower-case values.
// ---------------------------------------------------------------------------

export type BillingEventStatusName = (typeof EVENT_STATUS)[keyof typeof EVENT_STATUS]
