import { describe, expect, it } from 'vitest'
import { addBillingMonth, readBillingConfig } from './billing-policy'

describe('monthly bank coverage in America/Santo_Domingo', () => {
  it.each([
    ['2027-01-31T04:00:00Z', 31, '2027-02-28T04:00:00.000Z'],
    ['2027-02-28T04:00:00Z', 31, '2027-03-31T04:00:00.000Z'],
    ['2028-01-30T16:25:00Z', 30, '2028-02-29T16:25:00.000Z'],
    ['2026-12-31T04:00:00Z', 31, '2027-01-31T04:00:00.000Z'],
  ])('%s preserves original anchor %s', (start, anchor, end) => {
    expect(addBillingMonth(new Date(start), anchor).toISOString()).toBe(end)
  })
})

describe('server billing configuration', () => {
  it('defaults all switches off and rejects accidental live environments', () => {
    expect(readBillingConfig({})).toMatchObject({ enabled: false, checkout: false, events: false, enforce: false })
    expect(() => readBillingConfig({ BILLING_ENVIRONMENT: 'production' })).toThrow()
  })
  it('keeps processing events independent of new checkout and validates durations', () => {
    expect(readBillingConfig({ BILLING_EVENTS_ENABLED: 'true' }).events).toBe(true)
    expect(() => readBillingConfig({ BILLING_TRIAL_DAYS: '-1' })).toThrow()
    expect(() => readBillingConfig({ BILLING_GRACE_DAYS: '7x' })).toThrow()
  })
})
