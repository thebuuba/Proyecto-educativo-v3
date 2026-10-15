import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { AuthenticatedUser } from '../auth/types/authenticated-user'

const { db, paddle, store, page } = vi.hoisted(() => {
  const db = {
    billingSubscription: { findFirst: vi.fn(), create: vi.fn(), findUniqueOrThrow: vi.fn(), update: vi.fn() },
    billingTrial: { findUnique: vi.fn() },
    billingPayment: { findFirst: vi.fn() },
    billingServicePeriod: { findFirst: vi.fn() },
    billingCourtesy: { findFirst: vi.fn() },
    billingProviderCustomer: { findUnique: vi.fn(), upsert: vi.fn() },
  }
  const paddle = { getPrice: vi.fn(), createTransaction: vi.fn() }
  const store = {
    requireBilling: vi.fn(),
    billingAccount: vi.fn(),
    billingNow: vi.fn(),
    withBillingOwner: vi.fn(),
    authorizedPrice: vi.fn(),
    audit: vi.fn(),
  }
  const page = {
    checkoutBaseUrl: vi.fn(() => 'https://app.invalid/api/v1/billing/checkout-page'),
    checkoutClientToken: vi.fn(() => `test_${'b'.repeat(27)}`),
    checkoutPath: vi.fn((txn: string) => `/api/v1/billing/checkout-page?_ptxn=${txn}`),
    checkoutPageHtml: vi.fn(() => '<html></html>'),
  }
  return { db, paddle, store, page }
})

vi.mock('@aula/database', () => ({ prisma: db, Prisma: {} }))
vi.mock('./billing-store', () => store)
vi.mock('./billing-checkout-page', () => page)
vi.mock('./paddle-sandbox', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./paddle-sandbox')>()
  return { ...actual, createPaddleSandboxClient: vi.fn(() => paddle) }
})

import { BillingProviderService } from './billing-provider.service'

const NOW = new Date('2026-10-15T14:00:00Z')
const PRICE_ID = 'pri_01h00000000000000000000000'
const TXN_ID = `txn_${'a'.repeat(26)}`
const user: AuthenticatedUser = { id: 'user-1', email: 'teacher@example.com', schoolId: 'school-1', roles: ['teacher'] }

const approvedPrice = {
  id: PRICE_ID,
  unitPriceAmount: '599',
  currencyCode: 'USD',
  billingInterval: 'month',
  billingFrequency: 1,
  trialInterval: 'month',
  trialFrequency: 1,
  taxMode: 'internal',
  requiresPaymentMethod: true,
  unitPriceOverrides: [],
}

const dto = { priceId: 'price-1', acceptAutoRenewal: true, acceptEarlyEnd: false, termsVersion: 'v1' }

const reservation = (metadata: Record<string, unknown>) => ({
  id: 'sub-local', status: 'INCOMPLETE', manager: null, metadata,
})

describe('BillingProviderService.checkout', () => {
  const service = new BillingProviderService()

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.BILLING_ENABLED = 'true'
    process.env.BILLING_CHECKOUT_ENABLED = 'true'
    process.env.BILLING_EVENTS_ENABLED = 'true'
    process.env.PADDLE_SANDBOX_WEBHOOK_SECRET = 'pdl_ntfset_TESTONLY'
    process.env.BILLING_TERMS_VERSION = 'v1'

    store.requireBilling.mockReturnValue({ enabled: true, checkout: true, events: true, enforce: false, trialDays: 14, graceDays: 7 })
    store.billingAccount.mockResolvedValue({ id: 'acct-1', userId: 'user-1', status: 'ACTIVE', sandbox: true })
    store.authorizedPrice.mockResolvedValue({
      id: 'price-1', planId: 'plan-1', providerPriceId: PRICE_ID, amountMinor: 599n, currency: 'USD', interval: 'MONTHLY', intervalCount: 1,
    })
    store.billingNow.mockResolvedValue(NOW)
    store.audit.mockResolvedValue(undefined)
    store.withBillingOwner.mockImplementation(async (_userId: string, op: (db: unknown, now: Date) => Promise<unknown>) => op(db, NOW))
    db.billingSubscription.findFirst.mockResolvedValue(null)
    db.billingTrial.findUnique.mockResolvedValue(null)
    db.billingPayment.findFirst.mockResolvedValue(null)
    db.billingServicePeriod.findFirst.mockResolvedValue(null)
    db.billingCourtesy.findFirst.mockResolvedValue(null)
    db.billingSubscription.create.mockImplementation(async ({ data }: { data: { metadata: Record<string, unknown> } }) => reservation(data.metadata))
    db.billingProviderCustomer.findUnique.mockResolvedValue({ providerCustomerId: 'ctm_01h00000000000000000000000' })
    db.billingSubscription.findUniqueOrThrow.mockResolvedValue({ id: 'sub-local', metadata: {} })
    db.billingSubscription.update.mockResolvedValue({})
    paddle.getPrice.mockResolvedValue(approvedPrice)
    paddle.createTransaction.mockResolvedValue({ id: TXN_ID, customerId: 'ctm_01h00000000000000000000000' })
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    delete process.env.BILLING_TERMS_VERSION
  })

  it('requires explicit auto-renewal consent before reserving anything', async () => {
    await expect(service.checkout(user, { ...dto, acceptAutoRenewal: false })).rejects.toThrow(/renovaci/i)
    expect(store.withBillingOwner).not.toHaveBeenCalled()
    expect(db.billingSubscription.create).not.toHaveBeenCalled()
    expect(paddle.createTransaction).not.toHaveBeenCalled()
  })

  it('never resumes a pending checkout belonging to a different price or old trial policy', async () => {
    db.billingSubscription.findFirst.mockResolvedValue({id:'old',priceId:'old-price',status:'INCOMPLETE',metadata:{checkoutTransactionId:TXN_ID}})
    await expect(service.checkout(user,dto)).rejects.toThrow(/pendiente|revisión/i)
    expect(paddle.createTransaction).not.toHaveBeenCalled()
  })

  it('validates the remote catalog price before creating the transaction', async () => {
    paddle.getPrice.mockResolvedValue({ ...approvedPrice, unitPriceAmount: '1200' })

    await expect(service.checkout(user, dto)).rejects.toThrow(/precio/i)
    expect(paddle.getPrice).toHaveBeenCalledWith(PRICE_ID)
    expect(db.billingSubscription.create).not.toHaveBeenCalled()
    expect(paddle.createTransaction).not.toHaveBeenCalled()
  })

  it('rejects a cardless remote price that would allow a trial without a payment method', async () => {
    paddle.getPrice.mockResolvedValue({ ...approvedPrice, requiresPaymentMethod: false })

    await expect(service.checkout(user, dto)).rejects.toThrow(/precio/i)
    expect(db.billingSubscription.create).not.toHaveBeenCalled()
  })

  it('records the approved trial policy, consent and price, then returns the reserved transaction', async () => {
    const result = await service.checkout(user, dto)

    expect(paddle.getPrice).toHaveBeenCalledWith(PRICE_ID)
    const data = db.billingSubscription.create.mock.calls[0][0].data
    expect(data.metadata).toMatchObject({
      trialPolicy: 'card-month-v1', trialEligible: true, termsVersion: 'v1', acceptAutoRenewal: true,
      price: { amountMinor: '599', currency: 'USD', providerPriceId: PRICE_ID },
    })
    // The trial period belongs to the price, never to the transaction request.
    const sent = paddle.createTransaction.mock.calls[0][0]
    expect(sent).not.toHaveProperty('trialPeriod')
    expect(sent.trial_period).toBeUndefined()
    expect(result).toEqual({ url: `/api/v1/billing/checkout-page?_ptxn=${TXN_ID}`, status: 'pending' })
  })

  it('never sends a used account back to the remote price that would grant another trial', async () => {
    db.billingTrial.findUnique.mockResolvedValue({ id: 'trial-1', status: 'EXPIRED' })

    await expect(service.checkout(user, dto)).rejects.toThrow(/prueba/i)
    expect(db.billingSubscription.create).not.toHaveBeenCalled()
    expect(paddle.createTransaction).not.toHaveBeenCalled()
  })

  it('rejects an old paid account and a mismatched local quote before creating a new remote trial', async () => {
    db.billingPayment.findFirst.mockResolvedValue({id:'paid-before'})
    await expect(service.checkout(user,dto)).rejects.toThrow(/pago|pagado/i)
    expect(paddle.createTransaction).not.toHaveBeenCalled()
    db.billingPayment.findFirst.mockResolvedValue(null)
    store.authorizedPrice.mockResolvedValue({id:'price-1',planId:'plan-1',providerPriceId:PRICE_ID,amountMinor:600n,currency:'USD'})
    await expect(service.checkout(user,dto)).rejects.toThrow(/precio|oferta/i)
    expect(db.billingSubscription.create).not.toHaveBeenCalled()
  })
})
