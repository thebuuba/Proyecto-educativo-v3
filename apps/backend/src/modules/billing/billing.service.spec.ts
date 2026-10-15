import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SUBSCRIPTION_OFFER } from '@aula/shared'
import { BillingService } from './billing.service'
import type { AuthenticatedUser } from '../auth/types/authenticated-user'

const mocks = vi.hoisted(() => {
  const delegate = () => ({
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
  })

  return {
    db: {
      billingAccount: delegate(),
      billingAdmin: delegate(),
      billingSupportCase: delegate(),
      billingPrice: delegate(),
    },
    now: new Date('2026-10-15T14:00:00Z'),
    billingNow: vi.fn(),
    effectiveAccess: vi.fn(),
  }
})

vi.mock('@aula/database', () => ({ prisma: mocks.db, Prisma: {} }))

vi.mock('./billing-store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./billing-store')>()
  return { ...actual, billingNow: mocks.billingNow, effectiveAccess: mocks.effectiveAccess }
})

const user: AuthenticatedUser = { id: 'user-1', schoolId: 'school-1', roles: ['teacher'], email: 'test@example.invalid' }

describe('BillingService.overview', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    delete process.env.BILLING_ENVIRONMENT
    process.env.BILLING_ENABLED = 'false'
    process.env.BILLING_CHECKOUT_ENABLED = 'false'
    process.env.BILLING_EVENTS_ENABLED = 'false'
    mocks.billingNow.mockResolvedValue(mocks.now)
    mocks.effectiveAccess.mockResolvedValue({ allowed: true, reason: 'legacy', until: null })
  })

  it('always exposes the approved offer, even before the module is enabled', async () => {
    const result = await new BillingService().overview(user)

    expect(result.offer).toEqual(SUBSCRIPTION_OFFER)
    expect(result.enabled).toBe(false)
    expect(mocks.db.billingAccount.findUnique).not.toHaveBeenCalled()
  })

  it('only lists card-authorized Paddle prices with a positive amount', async () => {
    process.env.BILLING_ENABLED = 'true'
    process.env.BILLING_CHECKOUT_ENABLED = 'true'
    mocks.db.billingAccount.findUnique.mockResolvedValue(null)
    mocks.db.billingAdmin.findFirst.mockResolvedValue(null)
    mocks.db.billingSupportCase.findMany.mockResolvedValue([])
    mocks.db.billingPrice.findMany.mockResolvedValue([
      { id: 'price-1', plan: { name: 'Docente' }, amountMinor: 599n, currency: 'USD', interval: 'MONTHLY', provider: 'PADDLE' },
      { id: 'price-2', plan: { name: 'Cortesía' }, amountMinor: 0n, currency: 'USD', interval: 'MONTHLY', provider: 'PADDLE' },
    ])

    const result = await new BillingService().overview(user)

    expect(result.offer).toEqual(SUBSCRIPTION_OFFER)
    expect(mocks.db.billingPrice.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ provider: 'PADDLE' }),
    }))
    expect(result.prices).toEqual([{ id: 'price-1', label: 'Docente', amountMinor: 599, currency: 'USD', interval: 'monthly', mode: 'paddle' }])
  })
})
