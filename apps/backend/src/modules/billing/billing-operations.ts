import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common'
import { prisma } from '@aula/database'
import { randomUUID } from 'node:crypto'
import type { AuthenticatedUser } from '../auth/types/authenticated-user'
import type {
  ApproveTransferDto,
  CreateCourtesyDto,
  CreateTransferDto,
  ReasonDto,
  ReportTransferDto,
  SupportDto,
  UpdateSupportDto,
} from './billing.dto'
import { addBillingMonth } from './billing-policy'
import {
  audit,
  authorizedPrice,
  billingAccount,
  billingNow,
  notify,
  publicMoney,
  requireBilling,
  requireCommercialAdmin,
  withBillingOwner,
  type BillingTx,
} from './billing-store'

/** Only the published monthly individual plan exists in the first version. */
const DOCENTE_PLAN_CODE = 'docente-completo'
/** Manual transfers keep an explicit, server-defined validity window. */
const TRANSFER_EXPIRY_DAYS = 7
const ADMIN_DEFAULT_PAGE_SIZE = 20
const ADMIN_MAX_PAGE_SIZE = 100
const ADMIN_MAX_PAGE = 10_000
const ADMIN_MAX_SEARCH = 80
const DOMINICAN_OFFSET_MS = 4 * 3600000

/** Subscription/provider states that still act on the account and can double-charge. */
const UNRESOLVED_SUBSCRIPTIONS = ['INCOMPLETE', 'TRIALING', 'ACTIVE', 'PAST_DUE', 'PAUSED'] as const
/** Card→transfer is only allowed once these never-billed or retrying states are resolved. */
const BLOCKING_SUBSCRIPTIONS = ['INCOMPLETE', 'PAST_DUE', 'PAUSED'] as const
const PAID_COVERAGE_SOURCES = ['SUBSCRIPTION', 'TRANSFER', 'MANUAL_PAYMENT'] as const
const PAID_COVERAGE_PAYMENT_STATUSES = ['SUCCEEDED'] as const
const REVENUE_PAYMENT_STATUSES = ['SUCCEEDED', 'PARTIALLY_REFUNDED'] as const
const REVENUE_HISTORY_STATUSES = [...REVENUE_PAYMENT_STATUSES, 'REFUNDED'] as const

const iso = (value: Date | null | undefined): string | null => (value ? value.toISOString() : null)
const lower = (value: string): string => value.toLowerCase()

function dominicanDay(date: Date): number {
  return new Date(date.getTime() - DOMINICAN_OFFSET_MS).getUTCDate()
}

function readAnchor(metadata: unknown): number | null {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return null
  const value = (metadata as Record<string, unknown>).billingAnchor
  if (typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 31) return value
  return null
}

function bankSetup(env: NodeJS.ProcessEnv = process.env): { instructions: string; accountId: string; configured: boolean } {
  const instructions = env.BILLING_BANK_INSTRUCTIONS?.trim() ?? ''
  const accountId = env.BILLING_BANK_ACCOUNT_ID?.trim() ?? ''
  return { instructions, accountId, configured: Boolean(instructions && accountId) }
}

/** Support categories accepted by the public form, mapped to the persisted enum. */
type SupportCategory = 'PAYMENT' | 'TECHNICAL' | 'SUBSCRIPTION' | 'OTHER'

@Injectable()
export class BillingOperations {
  /** One trial per account, started and measured by the server clock. */
  async startTrial(user: AuthenticatedUser) {
    const config = requireBilling()
    // The commercial trial is a teacher benefit; never grant or alter roles here.
    if (!user.roles.includes('teacher')) throw new ForbiddenException('La prueba comercial está disponible solo para docentes.')
    if (config.trialDays <= 0) throw new ServiceUnavailableException('La prueba gratuita está desactivada.')

    return withBillingOwner(user.id, async (db, now) => {
      const account = await billingAccount(user.id, db)

      const existing = await db.billingTrial.findUnique({ where: { accountId: account.id } })
      if (existing) return this.trialView(existing)

      const paid = await db.billingPayment.findFirst({
        where: { accountId: account.id, status: 'SUCCEEDED', amountMinor: { gt: 0n } },
        select: { id: true },
      })
      if (paid) throw new ConflictException('La cuenta ya registró un pago; la prueba solo aplica a cuentas nuevas.')

      const courtesy = await db.billingCourtesy.findFirst({
        where: {
          accountId: account.id, status: 'ACTIVE', revokedAt: null, startsAt: { lte: now },
          plan: { code: DOCENTE_PLAN_CODE },
          OR: [{ endsAt: null }, { endsAt: { gt: now } }],
        },
        select: { id: true },
      })
      if (courtesy) throw new ConflictException('La cuenta ya tiene una cortesía vigente; no se inicia una prueba.')

      const plan = await db.billingPlan.findFirst({
        where: { code: DOCENTE_PLAN_CODE, status: 'ACTIVE' },
        select: { id: true },
      })
      if (!plan) throw new NotFoundException('El plan docente no está disponible.')

      const endsAt = new Date(now.getTime() + config.trialDays * 86400000)
      const trial = await db.billingTrial.create({
        data: { accountId: account.id, planId: plan.id, status: 'ACTIVE', startsAt: now, endsAt },
      })
      await audit(db, {
        accountId: account.id, actorUserId: user.id, action: 'trial.started',
        entityType: 'billing_trial', entityId: trial.id, metadata: { trialDays: config.trialDays },
      })
      await notify(db, account.id, 'trial_started', `trial-started:${trial.id}`, { endsAt: endsAt.toISOString() })
      return this.trialView(trial)
    })
  }

  /** Manual transfer request. One open request per account and price; the server sets the deadline. */
  async createTransfer(user: AuthenticatedUser, dto: CreateTransferDto) {
    const config = requireBilling()
    if (!config.checkout) throw new ServiceUnavailableException('Las nuevas contrataciones están desactivadas.')
    const bank = bankSetup()
    if (!bank.configured) throw new ServiceUnavailableException('Los datos bancarios todavía no están configurados.')

    return withBillingOwner(user.id, async (db, now) => {
      const account = await billingAccount(user.id, db)
      const price = await authorizedPrice(dto.priceId, 'MANUAL', now, db)

      // An open request that already expired is closed, never returned as reusable.
      await db.billingTransferRequest.updateMany({
        where: { accountId: account.id, priceId: price.id, status: { in: ['PENDING', 'UNDER_REVIEW'] }, expiresAt: { lte: now } },
        data: { status: 'EXPIRED' },
      })
      const open = await db.billingTransferRequest.findFirst({
        where: {
          accountId: account.id, priceId: price.id, status: { in: ['PENDING', 'UNDER_REVIEW'] },
          OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
        },
        orderBy: { createdAt: 'desc' },
      })
      if (open) return { ...this.transferView(open), bankInstructions: bank.instructions }

      const transfer = await db.billingTransferRequest.create({
        data: {
          accountId: account.id, planId: price.planId, priceId: price.id,
          reference: `TRF-${randomUUID().replace(/-/g, '').slice(0, 16).toUpperCase()}`,
          amountMinor: price.amountMinor, currency: price.currency, status: 'PENDING',
          expiresAt: new Date(now.getTime() + TRANSFER_EXPIRY_DAYS * 86400000),
        },
      })
      await audit(db, {
        accountId: account.id, actorUserId: user.id, action: 'transfer.created',
        entityType: 'billing_transfer_request', entityId: transfer.id, metadata: { priceId: price.id },
      })
      return { ...this.transferView(transfer), bankInstructions: bank.instructions }
    })
  }

  /** Reporting a reference never grants coverage; it only moves the request to review. */
  async reportTransfer(user: AuthenticatedUser, id: string, dto: ReportTransferDto) {
    requireBilling()
    return withBillingOwner(user.id, async (db, now) => {
      const account = await billingAccount(user.id, db)
      const transfer = await db.billingTransferRequest.findFirst({ where: { id, accountId: account.id } })
      if (!transfer) throw new NotFoundException('Solicitud de transferencia no encontrada.')

      if ((transfer.status === 'PENDING' || transfer.status === 'UNDER_REVIEW')
        && transfer.expiresAt && transfer.expiresAt.getTime() <= now.getTime()) {
        await db.billingTransferRequest.update({ where: { id: transfer.id }, data: { status: 'EXPIRED' } })
        throw new ConflictException('La solicitud de transferencia venció y no admite reporte.')
      }

      if (transfer.status === 'PENDING') {
        const updated = await db.billingTransferRequest.update({
          where: { id: transfer.id },
          data: { status: 'UNDER_REVIEW', customerReference: dto.bankReference, reportedAt: now },
        })
        await audit(db, {
          accountId: account.id, actorUserId: user.id, action: 'transfer.reported',
          entityType: 'billing_transfer_request', entityId: transfer.id, metadata: { bankReference: dto.bankReference },
        })
        await notify(db, account.id, 'transfer_reported', `transfer-reported:${transfer.id}`, { reference: transfer.reference })
        return this.transferView(updated)
      }
      if (transfer.status === 'UNDER_REVIEW' && transfer.customerReference === dto.bankReference) {
        return this.transferView(transfer)
      }
      throw new ConflictException('La solicitud ya no admite un reporte de referencia.')
    })
  }

  /** Approval is atomic: bank movement + succeeded payment + coverage + request + audit + notice. */
  async approveTransfer(actor: AuthenticatedUser, id: string, dto: ApproveTransferDto) {
    requireBilling()
    // Authorize before any lookup so a non-reviewer cannot probe which requests exist.
    await requireCommercialAdmin(actor.id)
    const found = await prisma.billingTransferRequest.findUnique({
      where: { id }, select: { account: { select: { userId: true } } },
    })
    if (!found) throw new NotFoundException('Solicitud de transferencia no encontrada.')

    const currency = dto.currency.toUpperCase()
    const amountMinor = BigInt(dto.amountMinor)
    const receivedAt = new Date(dto.receivedAt)
    if (!Number.isFinite(receivedAt.getTime())) throw new BadRequestException('Fecha de ingreso inválida.')

    return withBillingOwner(found.account.userId, async (db, now) => {
      const transfer = await db.billingTransferRequest.findFirst({ where: { id } })
      if (!transfer) throw new NotFoundException('Solicitud de transferencia no encontrada.')

      if (transfer.status === 'APPROVED') return this.approvedView(transfer)
      if (transfer.status !== 'PENDING' && transfer.status !== 'UNDER_REVIEW') {
        throw new ConflictException('La solicitud ya no está pendiente de aprobación.')
      }

      if (currency !== transfer.currency) throw new BadRequestException('La moneda del movimiento no coincide con la solicitud.')
      if (amountMinor !== transfer.amountMinor) throw new BadRequestException('El importe recibido no coincide exactamente con la solicitud.')
      if (receivedAt.getTime() < transfer.createdAt.getTime()) throw new BadRequestException('La fecha del ingreso es anterior a la solicitud.')
      if (receivedAt.getTime() > now.getTime()) throw new BadRequestException('La fecha del ingreso no puede ser futura.')
      if (transfer.expiresAt && receivedAt.getTime() > transfer.expiresAt.getTime()) {
        throw new BadRequestException('El ingreso quedó fuera del plazo de la solicitud.')
      }

      await this.assertTransferAllowedBySubscription(db, transfer.accountId)
      // Re-check permission inside the serialized transaction against concurrent revocation.
      await requireCommercialAdmin(actor.id, db)

      const duplicate = await db.billingBankMovement.findFirst({
        where: { currency, bankReference: dto.bankMovementId }, select: { id: true },
      })
      if (duplicate) throw new ConflictException('Ese movimiento bancario ya está registrado.')

      const coverage = await db.billingServicePeriod.findFirst({
        where: {
          accountId: transfer.accountId, source: { in: [...PAID_COVERAGE_SOURCES] }, endsAt: { gt: now },
          payment: { status: { in: [...PAID_COVERAGE_PAYMENT_STATUSES] } },
        },
        orderBy: { endsAt: 'desc' }, select: { startsAt: true, endsAt: true },
      })
      const previousPayment = await db.billingPayment.findFirst({
        where: { accountId: transfer.accountId, status: 'SUCCEEDED', amountMinor: { gt: 0n } },
        orderBy: { paidAt: 'desc' }, select: { metadata: true, paidAt: true },
      })

      // Advance payments keep the already-covered days; the original monthly anchor is preserved.
      const start = coverage ? coverage.endsAt : now
      const anchor = coverage
        ? readAnchor(previousPayment?.metadata) ?? dominicanDay(coverage.startsAt)
        : dominicanDay(now)
      const end = addBillingMonth(start, anchor)

      await db.billingBankMovement.create({
        data: {
          transferRequestId: transfer.id, accountId: transfer.accountId, bankReference: dto.bankMovementId,
          amountMinor, currency, receivedAt, recordedBy: actor.id, reason: dto.reason,
        },
      })
      const payment = await db.billingPayment.create({
        data: {
          accountId: transfer.accountId, planId: transfer.planId, priceId: transfer.priceId,
          source: 'TRANSFER', provider: 'MANUAL', environment: 'SANDBOX',
          amountMinor: transfer.amountMinor, currency: transfer.currency, status: 'SUCCEEDED',
          reference: transfer.reference, paidAt: receivedAt,
          metadata: { billingAnchor: anchor, transferRequestId: transfer.id, bankMovementId: dto.bankMovementId },
        },
      })
      // Internal commercial receipt only; this is not a Dominican fiscal document.
      await db.billingDocument.create({ data: { accountId: transfer.accountId, paymentId: payment.id,
        documentType: 'RECEIPT', number: `REC-${payment.id}`, amountMinor: transfer.amountMinor,
        currency: transfer.currency, environment: 'SANDBOX', issuedAt: now } })
      const period = await db.billingServicePeriod.create({
        data: {
          accountId: transfer.accountId, planId: transfer.planId, paymentId: payment.id, source: 'TRANSFER',
          startsAt: start, endsAt: end, grantedBy: actor.id, note: `transfer:${transfer.reference}`,
        },
      })
      // The active trial converts only now that the bank payment is confirmed.
      const trial = await db.billingTrial.findFirst({
        where: { accountId: transfer.accountId, status: 'ACTIVE', endsAt: { gt: now } }, select: { id: true },
      })
      if (trial) {
        await db.billingTrial.update({ where: { id: trial.id }, data: { status: 'CONVERTED', convertedAt: now, endedAt: now } })
        await notify(db, transfer.accountId, 'trial_converted', `trial-converted:${trial.id}`, { reference: transfer.reference })
      }
      const updated = await db.billingTransferRequest.update({
        where: { id: transfer.id },
        data: { status: 'APPROVED', reviewedBy: actor.id, reviewedAt: now, paymentId: payment.id, servicePeriodId: period.id },
      })
      await audit(db, {
        accountId: transfer.accountId, actorUserId: actor.id, action: 'transfer.approved',
        entityType: 'billing_transfer_request', entityId: transfer.id,
        metadata: { bankMovementId: dto.bankMovementId, amountMinor: dto.amountMinor, currency, receivedAt: receivedAt.toISOString() },
      })
      await notify(db, transfer.accountId, 'transfer_approved', `transfer-approved:${transfer.id}`, { reference: transfer.reference })
      return { ...this.approvedView(updated), coverage: { startsAt: start.toISOString(), endsAt: end.toISOString() } }
    })
  }

  /** Rejection is audited and idempotent. */
  async rejectTransfer(actor: AuthenticatedUser, id: string, dto: ReasonDto) {
    requireBilling()
    await requireCommercialAdmin(actor.id)
    const found = await prisma.billingTransferRequest.findUnique({
      where: { id }, select: { account: { select: { userId: true } } },
    })
    if (!found) throw new NotFoundException('Solicitud de transferencia no encontrada.')

    return withBillingOwner(found.account.userId, async (db, now) => {
      const transfer = await db.billingTransferRequest.findFirst({ where: { id } })
      if (!transfer) throw new NotFoundException('Solicitud de transferencia no encontrada.')
      if (transfer.status === 'REJECTED') return this.transferView(transfer)
      if (transfer.status !== 'PENDING' && transfer.status !== 'UNDER_REVIEW') {
        throw new ConflictException('La solicitud ya no puede rechazarse.')
      }

      await requireCommercialAdmin(actor.id, db)
      const updated = await db.billingTransferRequest.update({
        where: { id: transfer.id },
        data: { status: 'REJECTED', rejectionReason: dto.reason, reviewedBy: actor.id, reviewedAt: now },
      })
      await audit(db, {
        accountId: transfer.accountId, actorUserId: actor.id, action: 'transfer.rejected',
        entityType: 'billing_transfer_request', entityId: transfer.id, metadata: { reason: dto.reason },
      })
      await notify(db, transfer.accountId, 'transfer_rejected', `transfer-rejected:${transfer.id}`, { reference: transfer.reference })
      return this.transferView(updated)
    })
  }

  /** Courtesy creates coverage without a payment; it never cancels a remote renewal by itself. */
  async grantCourtesy(actor: AuthenticatedUser, dto: CreateCourtesyDto) {
    requireBilling()
    await requireCommercialAdmin(actor.id)

    const startsAt = new Date(dto.startsAt)
    const endsAt = dto.endsAt ? new Date(dto.endsAt) : null
    if (!Number.isFinite(startsAt.getTime())) throw new BadRequestException('Fecha de inicio inválida.')
    if (endsAt && !Number.isFinite(endsAt.getTime())) throw new BadRequestException('Fecha de fin inválida.')
    if (endsAt && endsAt.getTime() <= startsAt.getTime()) throw new BadRequestException('La cortesía debe terminar después de iniciar.')

    return withBillingOwner(dto.userId, async (db, now) => {
      const account = await billingAccount(dto.userId, db)
      const plan = await db.billingPlan.findFirst({ where: { id: dto.planId, status: 'ACTIVE' }, select: { id: true } })
      if (!plan) throw new NotFoundException('El plan de la cortesía no está disponible.')

      const renewal = await db.billingSubscription.findFirst({
        where: { accountId: account.id, status: { in: [...UNRESOLVED_SUBSCRIPTIONS] }, cancelAtPeriodEnd: false },
        select: { id: true },
      })
      if (renewal && !dto.acknowledgeActiveRenewal) {
        throw new ConflictException('Existe una renovación activa. Confirma que entiendes que la cortesía no cancela el cobro remoto.')
      }

      await requireCommercialAdmin(actor.id, db)
      const courtesy = await db.billingCourtesy.create({
        data: { accountId: account.id, planId: plan.id, status: 'ACTIVE', startsAt, endsAt, reason: dto.reason, grantedBy: actor.id },
      })
      await audit(db, {
        accountId: account.id, actorUserId: actor.id, action: 'courtesy.granted',
        entityType: 'billing_courtesy', entityId: courtesy.id,
        metadata: { planId: plan.id, endsAt: iso(endsAt), activeRenewal: Boolean(renewal) },
      })
      await notify(db, account.id, 'courtesy_granted', `courtesy-granted:${courtesy.id}`, { endsAt: iso(endsAt) })
      return { ...this.courtesyView(courtesy), activeRenewal: Boolean(renewal) }
    })
  }

  /** Revocation is audited and never creates a charge. */
  async revokeCourtesy(actor: AuthenticatedUser, id: string, dto: ReasonDto) {
    requireBilling()
    await requireCommercialAdmin(actor.id)
    const found = await prisma.billingCourtesy.findUnique({
      where: { id }, select: { account: { select: { userId: true } } },
    })
    if (!found) throw new NotFoundException('Cortesía no encontrada.')

    return withBillingOwner(found.account.userId, async (db, now) => {
      const courtesy = await db.billingCourtesy.findFirst({ where: { id } })
      if (!courtesy) throw new NotFoundException('Cortesía no encontrada.')
      if (courtesy.status === 'REVOKED') return this.courtesyView(courtesy)

      await requireCommercialAdmin(actor.id, db)
      const updated = await db.billingCourtesy.update({
        where: { id: courtesy.id },
        data: { status: 'REVOKED', revokedAt: now, revokedBy: actor.id, revocationReason: dto.reason },
      })
      await audit(db, {
        accountId: courtesy.accountId, actorUserId: actor.id, action: 'courtesy.revoked',
        entityType: 'billing_courtesy', entityId: courtesy.id, metadata: { reason: dto.reason },
      })
      return this.courtesyView(updated)
    })
  }

  /** Support stays available to expired owners; it persists a case and an in-app notice, never a fake email. */
  async createSupport(user: AuthenticatedUser, dto: SupportDto) {
    requireBilling()
    return withBillingOwner(user.id, async (db, now) => {
      const account = await billingAccount(user.id, db)

      let paymentReference: string | null = null
      if (dto.paymentId) {
        const payment = await db.billingPayment.findFirst({
          where: { id: dto.paymentId, accountId: account.id }, select: { reference: true },
        })
        if (!payment) throw new NotFoundException('El pago indicado no pertenece a tu cuenta.')
        paymentReference = payment.reference
      }
      const category = await this.resolveSupportCategory(db, account.id, dto.category)

      const supportCase = await db.billingSupportCase.create({
        data: {
          accountId: account.id, userId: user.id, category, subject: dto.subject,
          description: dto.message, paymentReference, lastMessageAt: now,
          number: this.supportNumber(now), status: 'OPEN',
        },
      })
      await db.billingSupportMessage.create({
        data: { caseId: supportCase.id, authorUserId: user.id, authorType: 'user', body: dto.message },
      })
      await notify(db, account.id, 'support_received', `support-received:${supportCase.id}`, { number: supportCase.number })
      await audit(db, {
        accountId: account.id, actorUserId: user.id, action: 'support.created',
        entityType: 'billing_support_case', entityId: supportCase.id, metadata: { number: supportCase.number, category },
      })
      return this.supportView(supportCase)
    })
  }

  /** Commercial follow-up on a persisted case. */
  async updateSupport(actor: AuthenticatedUser, id: string, dto: UpdateSupportDto) {
    requireBilling()
    await requireCommercialAdmin(actor.id)
    const found = await prisma.billingSupportCase.findUnique({ where: { id }, select: { userId: true, accountId: true } })
    if (!found) throw new NotFoundException('Caso de soporte no encontrado.')

    const status = dto.status.toUpperCase() as 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'
    return withBillingOwner(found.userId, async (db, now) => {
      const supportCase = await db.billingSupportCase.findFirst({ where: { id } })
      if (!supportCase) throw new NotFoundException('Caso de soporte no encontrado.')

      await requireCommercialAdmin(actor.id, db)
      const updated = await db.billingSupportCase.update({
        where: { id: supportCase.id },
        data: {
          status, assignedTo: actor.id, lastMessageAt: now,
          resolvedAt: status === 'RESOLVED' ? now : supportCase.resolvedAt,
        },
      })
      // Public reply to the holder. The DB only accepts user/admin/system as author_type.
      await db.billingSupportMessage.create({
        data: { caseId: supportCase.id, authorUserId: actor.id, authorType: 'admin', body: dto.reason, isInternal: false },
      })
      const accountId = supportCase.accountId ?? found.accountId
      if (accountId) await notify(db, accountId, 'support_updated', `support-updated:${supportCase.id}:${status}`, { status })
      await audit(db, {
        accountId: accountId ?? undefined, actorUserId: actor.id, action: 'support.updated',
        entityType: 'billing_support_case', entityId: supportCase.id, metadata: { status, reason: dto.reason },
      })
      return this.supportView(updated)
    })
  }

  /** Commercial panel. Requires its own permission; school roles never grant it. */
  async adminOverview(actor: AuthenticatedUser, query: { q?: string; page?: string; pageSize?: string } = {}) {
    requireBilling()
    await requireCommercialAdmin(actor.id)

    const page = Math.max(1, Math.min(ADMIN_MAX_PAGE, Number.parseInt(query.page ?? '1', 10) || 1))
    const pageSize = Math.max(1, Math.min(ADMIN_MAX_PAGE_SIZE, Number.parseInt(query.pageSize ?? String(ADMIN_DEFAULT_PAGE_SIZE), 10) || ADMIN_DEFAULT_PAGE_SIZE))
    const q = (query.q ?? '').trim().slice(0, ADMIN_MAX_SEARCH)
    const search = q ? { contains: q, mode: 'insensitive' as const } : undefined
    const skip = (page - 1) * pageSize
    const orderBy = { createdAt: 'desc' as const }
    const accountHolder = { account: { select: { id: true, userId: true, user: { select: { fullName: true, email: true } } } } }

    const now = await billingNow()

    const [subscriptions, transfers, courtesies, cases, failedEvents, auditTrail, grouped, paidAccountRows, trialAccountCount, courtesyAccountRows] = await Promise.all([
      prisma.billingSubscription.findMany({
        take: pageSize, skip, orderBy, include: accountHolder,
        where: q ? { OR: [
          { providerSubscriptionId: search },
          { account: { user: { email: search } } },
          { account: { user: { fullName: search } } },
        ] } : undefined,
      }),
      prisma.billingTransferRequest.findMany({
        take: pageSize, skip, orderBy, include: accountHolder,
        where: q ? { OR: [
          { reference: search },
          { customerReference: search },
          { account: { user: { email: search } } },
          { account: { user: { fullName: search } } },
        ] } : undefined,
      }),
      prisma.billingCourtesy.findMany({
        take: pageSize, skip, orderBy, include: accountHolder,
        where: q ? { OR: [
          { reason: search },
          { account: { user: { email: search } } },
          { account: { user: { fullName: search } } },
        ] } : undefined,
      }),
      prisma.billingSupportCase.findMany({
        take: pageSize, skip, orderBy,
        include: { account: { select: { id: true } }, requester: { select: { fullName: true, email: true } } },
        where: q ? { OR: [
          { number: search },
          { subject: search },
          { requester: { email: search } },
          { requester: { fullName: search } },
        ] } : undefined,
      }),
      prisma.billingEvent.findMany({
        take: pageSize, skip, orderBy,
        where: q ? { status: 'FAILED', OR: [{ providerEventId: search }, { eventType: search }] } : { status: 'FAILED' },
      }),
      prisma.billingAuditLog.findMany({ orderBy: { createdAt: 'desc' }, take: pageSize }),
      prisma.billingPayment.groupBy({
        by: ['currency'], where: { status: { in: [...REVENUE_HISTORY_STATUSES] }, amountMinor: { gt: 0n } },
        _sum: { amountMinor: true, amountRefundedMinor: true }, _count: { _all: true },
      }),
      prisma.billingPayment.findMany({
        where: { status: { in: [...REVENUE_PAYMENT_STATUSES] }, amountMinor: { gt: 0n } },
        distinct: ['accountId'], select: { accountId: true },
      }),
      prisma.billingTrial.count({ where: { status: 'ACTIVE', startsAt: { lte: now }, endsAt: { gt: now } } }),
      prisma.billingCourtesy.findMany({
        where: { status: 'ACTIVE', revokedAt: null, startsAt: { lte: now }, OR: [{ endsAt: null }, { endsAt: { gt: now } }] },
        distinct: ['accountId'], select: { accountId: true },
      }),
    ])

    const holder = (account: { id: string; userId: string; user: { fullName: string; email: string } } | null) => account
      ? { accountId: account.id, userId: account.userId, email: account.user.email, fullName: account.user.fullName }
      : {}

    const metricsByCurrency = (grouped as Array<{
      currency: string; _sum: { amountMinor: bigint | null; amountRefundedMinor: bigint | null }; _count: { _all: number }
    }>).map((row) => {
      const gross = row._sum.amountMinor ?? 0n
      const refunded = row._sum.amountRefundedMinor ?? 0n
      return { currency: row.currency, grossMinor: publicMoney(gross), refundedMinor: publicMoney(refunded), netMinor: publicMoney(gross - refunded), count: row._count._all }
    })

    return {
      page,
      pageSize,
      query: { q },
      counts: {
        paidAccounts: paidAccountRows.length,
        trialAccounts: trialAccountCount,
        courtesyAccounts: courtesyAccountRows.length,
      },
      subscriptions: subscriptions.map((s) => ({
        id: s.id, ...holder(s.account), status: lower(s.status), providerStatus: s.providerStatus,
        cancelAtPeriodEnd: s.cancelAtPeriodEnd, currentPeriodEnd: iso(s.currentPeriodEnd),
      })),
      transfers: transfers.map((t) => ({ ...this.transferView(t), ...holder(t.account) })),
      courtesies: courtesies.map((c) => ({ ...this.courtesyView(c), ...holder(c.account) })),
      cases: cases.map((c) => ({
        ...this.supportView(c), userId: c.userId,
        accountId: c.account?.id ?? null, email: c.requester.email, fullName: c.requester.fullName,
      })),
      failedEvents: failedEvents.map((e) => ({
        id: e.id, provider: lower(e.provider), eventType: e.eventType, attempts: e.attempts,
        lastError: e.lastError, receivedAt: iso(e.receivedAt),
      })),
      audit: auditTrail.map((entry) => ({
        id: entry.id, action: entry.action, entityType: entry.entityType, actorType: entry.actorType,
        entityId: entry.entityId, accountId: entry.accountId, createdAt: iso(entry.createdAt),
      })),
      metrics: { byCurrency: metricsByCurrency },
    }
  }

  private async resolveSupportCategory(db: BillingTx, accountId: string, category: string): Promise<SupportCategory> {
    if (category === 'payment') return 'PAYMENT'
    if (category === 'other') return 'OTHER'
    const subscription = await db.billingSubscription.findFirst({
      where: { accountId, status: { in: [...UNRESOLVED_SUBSCRIPTIONS] } }, select: { id: true },
    })
    return subscription ? 'SUBSCRIPTION' : 'TECHNICAL'
  }

  /** Card→transfer is blocked until the subscription can no longer charge again. */
  private async assertTransferAllowedBySubscription(db: BillingTx, accountId: string): Promise<void> {
    const subscription = await db.billingSubscription.findFirst({
      where: { accountId, status: { in: [...UNRESOLVED_SUBSCRIPTIONS] } },
      select: { id: true, status: true, cancelAtPeriodEnd: true },
    })
    if (!subscription) return
    if ((BLOCKING_SUBSCRIPTIONS as readonly string[]).includes(subscription.status)) {
      throw new ConflictException('Tienes una suscripción con tarjeta sin resolver; no se puede aprobar una transferencia.')
    }
    // ACTIVE / TRIALING: a scheduled cancellation is not enough while charges are unresolved.
    if (!subscription.cancelAtPeriodEnd) {
      throw new ConflictException('La renovación con tarjeta sigue activa; cancélala antes de aprobar la transferencia.')
    }
    const outstanding = await db.billingPayment.findFirst({
      where: { subscriptionId: subscription.id, status: { in: ['PENDING', 'FAILED'] } }, select: { id: true },
    })
    if (outstanding) throw new ConflictException('Existen cobros pendientes o fallidos de la tarjeta; resuélvelos antes de aprobar la transferencia.')
  }

  private supportNumber(now: Date): string {
    const date = `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, '0')}${String(now.getUTCDate()).padStart(2, '0')}`
    return `CAS-${date}-${randomUUID().replace(/-/g, '').toUpperCase()}`
  }

  private trialView(trial: { id: string; planId: string; status: string; startsAt: Date; endsAt: Date }) {
    return { id: trial.id, planId: trial.planId, status: lower(trial.status), startsAt: iso(trial.startsAt), endsAt: iso(trial.endsAt) }
  }

  private transferView(transfer: {
    id: string; reference: string; status: string; amountMinor: bigint; currency: string
    expiresAt: Date | null; reportedAt: Date | null; rejectionReason: string | null; receiptPath?: string | null
  }) {
    return {
      id: transfer.id, reference: transfer.reference, status: lower(transfer.status),
      amountMinor: publicMoney(transfer.amountMinor), currency: transfer.currency,
      expiresAt: iso(transfer.expiresAt), reportedAt: iso(transfer.reportedAt), rejectionReason: transfer.rejectionReason,
      receiptAvailable: Boolean(transfer.receiptPath),
    }
  }

  private approvedView(transfer: {
    id: string; reference: string; status: string; amountMinor: bigint; currency: string
    expiresAt: Date | null; reportedAt: Date | null; rejectionReason: string | null
    paymentId: string | null; servicePeriodId: string | null
  }) {
    return { ...this.transferView(transfer), paymentId: transfer.paymentId, servicePeriodId: transfer.servicePeriodId }
  }

  private courtesyView(courtesy: {
    id: string; planId: string; status: string; startsAt: Date; endsAt: Date | null
    reason: string; revokedAt?: Date | null; revocationReason?: string | null
  }) {
    return {
      id: courtesy.id, planId: courtesy.planId, status: lower(courtesy.status),
      startsAt: iso(courtesy.startsAt), endsAt: iso(courtesy.endsAt), reason: courtesy.reason,
      revokedAt: iso(courtesy.revokedAt ?? null), revocationReason: courtesy.revocationReason ?? null,
    }
  }

  private supportView(supportCase: { id: string; number: string; category: string; status: string; subject: string; createdAt: Date }) {
    return {
      id: supportCase.id, number: supportCase.number, category: lower(supportCase.category),
      status: lower(supportCase.status), subject: supportCase.subject, createdAt: iso(supportCase.createdAt),
    }
  }
}
