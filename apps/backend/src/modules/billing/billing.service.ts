import { Injectable, NotFoundException } from '@nestjs/common'
import { prisma } from '@aula/database'
import type { AuthenticatedUser } from '../auth/types/authenticated-user'
import { readBillingConfig } from './billing-policy'
import { billingNow, effectiveAccess, publicMoney, requireBilling, requireCommercialAdmin } from './billing-store'

@Injectable()
export class BillingService {
  async overview(user: AuthenticatedUser) {
    const config = readBillingConfig(process.env)
    const empty = {
      enabled: config.enabled, environment: 'sandbox', checkoutEnabled: false, eventsEnabled: config.events,
      access: { allowed: true, reason: 'legacy', until: null } as { allowed: boolean; reason: string; until: string | null },
      trial: null, grants: [], payments: [], documents: [], transfers: [], subscriptions: [], prices: [], cases: [], notices: [],
      commercialAdmin: false, supportEmail: process.env.BILLING_SUPPORT_EMAIL || null,
      bankInstructions: null as string | null, termsVersion: process.env.BILLING_TERMS_VERSION || null,
      serverNow: new Date().toISOString(),
    }
    if (!config.enabled) return empty
    const now = await billingNow()
    const [account, access, admin, cases, prices] = await Promise.all([
      prisma.billingAccount.findUnique({ where: { userId: user.id }, include: {
        trial: true, courtesies: { orderBy: { createdAt: 'desc' }, take: 50 },
        payments: { orderBy: { createdAt: 'desc' }, take: 100 },
        documents: { orderBy: { createdAt: 'desc' }, take: 100 },
        transferRequests: { orderBy: { createdAt: 'desc' }, take: 50 },
        subscriptions: { orderBy: { createdAt: 'desc' }, take: 25 },
        outbox: { where: { channel: 'in_app' }, orderBy: { createdAt: 'desc' }, take: 50 },
      } }),
      effectiveAccess(user.id),
      prisma.billingAdmin.findFirst({ where: { userId: user.id, status: 'ACTIVE', revokedAt: null, user: { status: 'ACTIVE' } }, select: { id: true } }),
      prisma.billingSupportCase.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 50,
        select: { id: true, number: true, category: true, status: true, createdAt: true } }),
      config.checkout ? prisma.billingPrice.findMany({ where: {
        status: 'ACTIVE', isPublic: true, interval: 'MONTHLY', intervalCount: 1,
        plan: { code: 'docente-completo', status: 'ACTIVE', isPublic: true },
        AND: [
          { OR: [{ effectiveFrom: null }, { effectiveFrom: { lte: now } }] },
          { OR: [{ effectiveTo: null }, { effectiveTo: { gt: now } }] },
        ],
      }, include: { plan: { select: { name: true } } }, orderBy: { version: 'desc' }, take: 20 }) : [],
    ])
    return {
      ...empty, access, serverNow: now.toISOString(), commercialAdmin: !!admin,
      checkoutEnabled: config.checkout, trial: account?.trial ? {
        startsAt: account.trial.startsAt, endsAt: account.trial.endsAt, status: account.trial.status.toLowerCase(),
      } : null,
      grants: account?.courtesies.map(c => ({
        id: c.id, startsAt: c.startsAt, endsAt: c.endsAt, status: c.status.toLowerCase(), revokedAt: c.revokedAt,
      })) ?? [],
      payments: account?.payments.map(p => ({ id: p.id, amountMinor: publicMoney(p.amountMinor), currency: p.currency,
        status: p.status.toLowerCase(), createdAt: p.createdAt, paidAt: p.paidAt, source: p.source.toLowerCase() })) ?? [],
      documents: account?.documents.map(d => ({ id: d.id, number: d.number, type: d.documentType.toLowerCase(),
        amountMinor: publicMoney(d.amountMinor), currency: d.currency, issuedAt: d.issuedAt })) ?? [],
      transfers: account?.transferRequests.map(t => ({ id: t.id, status: t.status.toLowerCase(), reference: t.reference,
        amountMinor: publicMoney(t.amountMinor), currency: t.currency, expiresAt: t.expiresAt, rejectionReason: t.rejectionReason, receiptAvailable: !!t.receiptPath })) ?? [],
      subscriptions: account?.subscriptions.map(s => ({ id: s.id, providerStatus: s.providerStatus ?? s.status.toLowerCase(),
        currentPeriodEnd: s.currentPeriodEnd, cancelAtPeriodEnd: s.cancelAtPeriodEnd, mode: s.provider.toLowerCase() })) ?? [],
      prices: prices.filter(p => p.amountMinor > 0n).map(p => ({ id: p.id, label: p.plan.name,
        amountMinor: publicMoney(p.amountMinor), currency: p.currency, interval: p.interval.toLowerCase(), mode: p.provider.toLowerCase() })),
      cases: cases.map(c => ({ ...c, category: c.category.toLowerCase(), status: c.status.toLowerCase() })),
      notices: account?.outbox.map(n => ({ id: n.id, template: n.template, payload: n.payload, createdAt: n.createdAt })) ?? [],
      bankInstructions: config.checkout && process.env.BILLING_BANK_ACCOUNT_ID ? process.env.BILLING_BANK_INSTRUCTIONS || null : null,
    }
  }

  async supportDetail(user: AuthenticatedUser, id: string) {
    requireBilling()
    const support = await prisma.billingSupportCase.findUnique({ where: { id }, select: {
      id: true, userId: true, number: true, subject: true, status: true, category: true, createdAt: true,
    } })
    if (!support) throw new NotFoundException('Caso no disponible.')
    if (support.userId !== user.id) await requireCommercialAdmin(user.id)
    const messages = await prisma.billingSupportMessage.findMany({ where: { caseId: id, isInternal: false },
      select: { id: true, body: true, authorType: true, createdAt: true }, orderBy: { createdAt: 'asc' }, take: 100 })
    return { case: { id: support.id, number: support.number, subject: support.subject, status: support.status.toLowerCase(),
      category: support.category.toLowerCase(), createdAt: support.createdAt }, messages }
  }
}
