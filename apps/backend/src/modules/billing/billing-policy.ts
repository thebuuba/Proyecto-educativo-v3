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
