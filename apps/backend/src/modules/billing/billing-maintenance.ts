import { Injectable } from '@nestjs/common'
import { prisma } from '@aula/database'
import type { AuthenticatedUser } from '../auth/types/authenticated-user'
import { readBillingConfig } from './billing-policy'
import { billingNow, billingAccount, notify, requireCommercialAdmin, withBillingOwner } from './billing-store'
import { BillingEventsService } from './billing-events.service'

@Injectable()
export class BillingMaintenance {
  constructor(private readonly events: BillingEventsService) {}

  async run(actor: AuthenticatedUser) {
    await requireCommercialAdmin(actor.id)
    const config = readBillingConfig(process.env), now = await billingNow()
    const results = { retried: 0, reconciled: 0, noticesChecked: 0, failed: 0 }
    if (config.events) {
      const due = await prisma.billingEvent.findMany({ where: { OR: [
        { status: 'RECEIVED' },
        { status: 'FAILED', nextRetryAt: { lte: now } },
        { status: 'PROCESSING', updatedAt: { lt: new Date(now.getTime() - 300000) } },
      ] }, orderBy: { receivedAt: 'asc' }, take: 20, select: { id: true } })
      for (const event of due) {
        try { await this.events.retry(actor, event.id); results.retried++ } catch { results.failed++ }
      }
      const subscriptions = await prisma.billingSubscription.findMany({ where: { provider: 'PADDLE', environment: 'SANDBOX',
        status: { in: ['INCOMPLETE', 'ACTIVE', 'PAST_DUE', 'TRIALING', 'PAUSED'] } },
        orderBy: { updatedAt: 'asc' }, take: 20, select: { id: true } })
      for (const subscription of subscriptions) {
        try { await this.events.reconcile(actor, subscription.id); results.reconciled++ } catch { results.failed++ }
      }
    }
    if (config.enabled) {
      const horizon = new Date(now.getTime() + 3 * 86400000)
      const accounts = await prisma.billingAccount.findMany({ where: { status: 'ACTIVE', OR: [
        { trial: { status: 'ACTIVE', endsAt: { lte: horizon } } },
        { servicePeriods: { some: { endsAt: { gte: now, lte: horizon } } } },
        { courtesies: { some: { status: 'ACTIVE', endsAt: { gte: now, lte: horizon } } } },
      ] }, orderBy: { updatedAt: 'asc' }, take: 100, select: { userId: true } })
      for (const owner of accounts) {
        await withBillingOwner(owner.userId, async (db, clock) => {
          const account = await billingAccount(owner.userId, db)
          const trial = await db.billingTrial.findUnique({ where: { accountId: account.id } })
          if (trial?.status === 'ACTIVE' && trial.endsAt <= horizon) {
            await notify(db, account.id, trial.endsAt <= clock ? 'trial_expired' : 'trial_ending', `trial-ending:${trial.id}:${trial.endsAt <= clock ? 'expired' : 'soon'}`, { endsAt: trial.endsAt.toISOString() })
          }
          const periods = await db.billingServicePeriod.findMany({ where: { accountId: account.id, endsAt: { gte: clock, lte: horizon } } })
          for (const period of periods) await notify(db, account.id, period.source === 'GRACE' ? 'grace_ending' : 'coverage_ending', `coverage-ending:${period.id}`, { endsAt: period.endsAt.toISOString() })
          const grants = await db.billingCourtesy.findMany({ where: { accountId: account.id, status: 'ACTIVE', endsAt: { gte: clock, lte: horizon } } })
          for (const grant of grants) await notify(db, account.id, 'courtesy_ending', `courtesy-ending:${grant.id}`, { endsAt: grant.endsAt!.toISOString() })
          await db.billingAccount.update({ where: { id: account.id }, data: { updatedAt: clock } })
        }).catch(() => { results.failed++ })
        results.noticesChecked++
      }
    }
    return results
  }

  async scheduled() {
    const id = process.env.BILLING_MAINTENANCE_ACTOR_ID
    if (!id) return { configured: false }
    const actor = await prisma.appUser.findUnique({ where: { id }, select: { id: true, email: true, schoolId: true, status: true } })
    if (!actor || actor.status !== 'ACTIVE') return { configured: false }
    return { configured: true, ...await this.run({ ...actor, roles: [] }) }
  }
}
