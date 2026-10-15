export type Coverage = { startsAt: Date; endsAt: Date | null; revokedAt?: Date | null }
export type AccessInput = {
  active: boolean; enforced: boolean; paid?: Coverage[]; trial?: Coverage | null
  grants?: Coverage[]; grace?: Coverage | null; previouslyPaid?: boolean
}
export function evaluateAccess(input: AccessInput, now: Date): { allowed: boolean; reason: string; until: Date | null } {
  if (!input.active) return { allowed: false, reason: 'suspended', until: null }
  const covers = (p: Coverage) => !p.revokedAt && p.startsAt <= now && (!p.endsAt || now < p.endsAt)
  const sources: [string, Coverage[]][] = [
    ['paid', input.paid ?? []], ['courtesy', input.grants ?? []],
    ['trial', input.trial ? [input.trial] : []],
    ['grace', input.previouslyPaid && input.grace ? [input.grace] : []],
  ]
  for (const [reason, periods] of sources) {
    const current = periods.filter(covers).sort((a, b) => (b.endsAt?.getTime() ?? Infinity) - (a.endsAt?.getTime() ?? Infinity))[0]
    if (current) return { allowed: true, reason, until: current.endsAt }
  }
  return { allowed: !input.enforced, reason: input.enforced ? 'expired' : 'legacy', until: null }
}
export function addBillingMonth(start: Date, anchor: number): Date {
  if (!Number.isInteger(anchor) || anchor < 1 || anchor > 31 || !Number.isFinite(start.getTime())) throw new Error('Invalid billing anchor')
  // Dominican local time is UTC-04, without daylight saving. Preserve the original anchor across February.
  const local = new Date(start.getTime() - 4 * 3600000)
  const year = local.getUTCFullYear(), month = local.getUTCMonth() + 1
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  return new Date(Date.UTC(year, month, Math.min(anchor, lastDay), local.getUTCHours() + 4, local.getUTCMinutes(), local.getUTCSeconds(), local.getUTCMilliseconds()))
}
export function readBillingConfig(env: Record<string, string | undefined>) {
  if (env.BILLING_ENVIRONMENT && env.BILLING_ENVIRONMENT !== 'sandbox') throw new Error('Only billing sandbox is supported')
  const duration = (name: string, fallback: number) => {
    const value = env[name] ?? String(fallback)
    if (!/^\d+$/.test(value) || Number(value) > 365) throw new Error(`Invalid ${name}`)
    return Number(value)
  }
  return {
    enabled: env.BILLING_ENABLED === 'true', checkout: env.BILLING_CHECKOUT_ENABLED === 'true',
    events: env.BILLING_EVENTS_ENABLED === 'true', enforce: env.BILLING_ENFORCE_ACCESS === 'true',
    trialDays: duration('BILLING_TRIAL_DAYS', 14), graceDays: duration('BILLING_GRACE_DAYS', 7),
  }
}
