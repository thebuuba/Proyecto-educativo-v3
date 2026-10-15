import { describe, expect, it } from 'vitest'
import { addBillingMonth, evaluateAccess, readBillingConfig } from './billing-policy'

const now = new Date('2026-10-15T14:00:00Z')
const period = { startsAt: new Date('2026-10-01T04:00:00Z'), endsAt: new Date('2026-11-01T04:00:00Z') }

describe('commercial access', () => {
  it('preserves legacy access with enforcement off, but never bypasses suspension', () => {
    expect(evaluateAccess({ active: true, enforced: false }, now).reason).toBe('legacy')
    expect(evaluateAccess({ active: false, enforced: false, paid: [period] }, now).allowed).toBe(false)
  })
  it('isolates two teachers independently of their school', () => {
    expect(evaluateAccess({ active: true, enforced: true, paid: [period] }, now).reason).toBe('paid')
    expect(evaluateAccess({ active: true, enforced: true }, now).reason).toBe('expired')
  })
  it('uses inclusive starts and exclusive ends for all coverage', () => {
    expect(evaluateAccess({ active: true, enforced: true, trial: period }, period.startsAt).allowed).toBe(true)
    expect(evaluateAccess({ active: true, enforced: true, trial: period }, period.endsAt).allowed).toBe(false)
  })
  it('never grants grace without prior payment and does not derive grace from now', () => {
    expect(evaluateAccess({ active: true, enforced: true, grace: period }, now).allowed).toBe(false)
    expect(evaluateAccess({ active: true, enforced: true, previouslyPaid: true, grace: period }, now).reason).toBe('grace')
    expect(evaluateAccess({ active: true, enforced: true, previouslyPaid: true, grace: period }, period.endsAt).allowed).toBe(false)
  })
  it('honors permanent, future, expired and revoked courtesy grants', () => {
    const base = { active: true, enforced: true }
    expect(evaluateAccess({ ...base, grants: [{ startsAt: period.startsAt, endsAt: null }] }, now).reason).toBe('courtesy')
    expect(evaluateAccess({ ...base, grants: [{ ...period, revokedAt: now }] }, now).allowed).toBe(false)
    expect(evaluateAccess({ ...base, grants: [{ startsAt: period.endsAt, endsAt: null }] }, now).allowed).toBe(false)
    expect(evaluateAccess({ ...base, grants: [period] }, period.endsAt).allowed).toBe(false)
  })
})

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
