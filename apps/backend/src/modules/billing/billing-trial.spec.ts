import { describe, expect, it } from 'vitest'
import type { PaddlePrice, PaddleSubscription } from './paddle-sandbox'
import { TRIAL_POLICY, assertTrialPrice, checkTrialPrice, checkTrialSubscription } from './billing-trial'

const PRICE_ID = 'pri_01h00000000000000000000000'
const SUB_ID = 'sub_01h00000000000000000000000'
const CUSTOMER = 'ctm_01h00000000000000000000000'
const TRIAL = { startsAt: '2026-10-15T14:00:00Z', endsAt: '2026-11-15T14:00:00Z' }

const approvedPrice = (overrides: Partial<PaddlePrice> = {}): PaddlePrice => ({
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
  ...overrides,
})

const trialingSubscription = (overrides: Partial<PaddleSubscription> = {}): PaddleSubscription => ({
  id: SUB_ID,
  status: 'trialing',
  customerId: CUSTOMER,
  nextBilledAt: TRIAL.endsAt,
  currentBillingPeriod: null,
  scheduledChange: null,
  collectionMode: 'automatic',
  trialDates: TRIAL,
  items: [{ status: 'trialing', priceId: PRICE_ID, trialDates: TRIAL, nextBilledAt: TRIAL.endsAt, recurring: true }],
  ...overrides,
})

describe('trial policy', () => {
  it('names the approved card trial policy', () => {
    expect(TRIAL_POLICY).toBe('card-month-v1')
  })
})

describe('checkTrialPrice', () => {
  it('accepts the approved monthly USD price with a card-required free trial', () => {
    expect(checkTrialPrice(approvedPrice())).toEqual({ ok: true })
    expect(() => assertTrialPrice(approvedPrice())).not.toThrow()
  })

  it('fails closed for any deviation from the approved offer', () => {
    const cases: Array<Partial<PaddlePrice>> = [
      { unitPriceAmount: '1200' },
      { currencyCode: 'DOP' },
      { billingInterval: 'year' },
      { billingFrequency: 1, billingInterval: 'year' },
      { taxMode: 'account_setting' },
      { taxMode: 'external' },
      { unitPriceOverrides: [{ country: 'US' }] },
      { trialInterval: null },
      { trialFrequency: 2 },
      { requiresPaymentMethod: false },
      { requiresPaymentMethod: null },
    ]
    for (const deviation of cases) {
      expect(checkTrialPrice(approvedPrice(deviation))).toMatchObject({ ok: false })
    }
  })

  it('throws a closed service error when asserted', () => {
    expect(() => assertTrialPrice(approvedPrice({ taxMode: 'external' }))).toThrow(/precio/i)
  })
})

describe('checkTrialSubscription', () => {
  it('accepts a trialing, card-collected subscription with official trial dates', () => {
    const result = checkTrialSubscription(trialingSubscription(), PRICE_ID)

    expect(result).toMatchObject({ ok: true })
    if (result.ok) {
      expect(result.grant.startsAt.toISOString()).toBe('2026-10-15T14:00:00.000Z')
      expect(result.grant.endsAt.toISOString()).toBe('2026-11-15T14:00:00.000Z')
      expect(result.grant.nextBilledAt?.toISOString()).toBe('2026-11-15T14:00:00.000Z')
    }
  })

  it('never authorizes trials that do not match the reserved price, item or method', () => {
    expect(checkTrialSubscription(trialingSubscription({ status: 'active' }), PRICE_ID)).toMatchObject({ ok: false, reason: 'not_trialing' })
    expect(checkTrialSubscription(trialingSubscription(), null)).toMatchObject({ ok: false, reason: 'missing_price' })
    expect(checkTrialSubscription(trialingSubscription(), 'pri_other')).toMatchObject({ ok: false, reason: 'price_not_on_subscription' })
    expect(checkTrialSubscription(trialingSubscription({
      items: [{ status: 'active', priceId: PRICE_ID, trialDates: TRIAL, nextBilledAt: TRIAL.endsAt, recurring: true }],
    }), PRICE_ID)).toMatchObject({ ok: false, reason: 'item_not_trialing' })
    expect(checkTrialSubscription(trialingSubscription({ collectionMode: 'manual' }), PRICE_ID)).toMatchObject({ ok: false, reason: 'collection_mode_not_automatic' })
    expect(checkTrialSubscription(trialingSubscription({ collectionMode: null }), PRICE_ID)).toMatchObject({ ok: false, reason: 'collection_mode_not_automatic' })
  })

  it('never authorizes trials with invalid or missing official dates', () => {
    expect(checkTrialSubscription(trialingSubscription({
      trialDates: null,
      items: [{ status: 'trialing', priceId: PRICE_ID, trialDates: null, nextBilledAt: TRIAL.endsAt, recurring: true }],
    }), PRICE_ID)).toMatchObject({ ok: false, reason: 'invalid_trial_dates' })
    expect(checkTrialSubscription(trialingSubscription({
      trialDates: { startsAt: '2026-11-15T14:00:00Z', endsAt: '2026-10-15T14:00:00Z' },
      items: [{ status: 'trialing', priceId: PRICE_ID, trialDates: { startsAt: '2026-11-15T14:00:00Z', endsAt: '2026-10-15T14:00:00Z' }, nextBilledAt: TRIAL.endsAt, recurring: true }],
    }), PRICE_ID)).toMatchObject({ ok: false, reason: 'invalid_trial_dates' })
    expect(checkTrialSubscription(trialingSubscription({ nextBilledAt: null }), PRICE_ID)).toMatchObject({ ok: false, reason: 'missing_next_billed_at' })
  })

  it('never authorizes a non-recurring item as a trial', () => {
    expect(checkTrialSubscription(trialingSubscription({
      items: [{ status: 'trialing', priceId: PRICE_ID, trialDates: TRIAL, nextBilledAt: TRIAL.endsAt, recurring: false }],
    }), PRICE_ID)).toMatchObject({ ok: false, reason: 'item_not_recurring' })
  })
})
