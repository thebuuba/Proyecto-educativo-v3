import { BadRequestException, ConflictException, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common'
import { prisma, type Prisma } from '@aula/database'
import { randomUUID } from 'node:crypto'
import type { AuthenticatedUser } from '../auth/types/authenticated-user'
import type { CheckoutDto } from './billing.dto'
import { audit, authorizedPrice, billingAccount, billingNow, requireBilling, withBillingOwner } from './billing-store'
import { createPaddleSandboxClient, PADDLE_SANDBOX_API_ORIGIN } from './paddle-sandbox'

const acting = ['INCOMPLETE', 'TRIALING', 'ACTIVE', 'PAST_DUE', 'PAUSED'] as const
const metadata = (value: Prisma.JsonValue): Prisma.JsonObject => value && typeof value === 'object' && !Array.isArray(value) ? value : {}

export function sandboxDestination(value: string): string {
  let url: URL
  try { url = new URL(value) } catch { throw new ServiceUnavailableException('Destino sandbox no válido.') }
  if (url.protocol !== 'https:' || url.username || url.password || url.port || ![
    'sandbox-checkout.paddle.com', 'sandbox-buy.paddle.com', 'sandbox-customer-portal.paddle.com', 'sandbox-api.paddle.com',
  ].includes(url.hostname)) throw new ServiceUnavailableException('El proveedor no devolvió un destino sandbox autorizado.')
  return url.toString()
}

function sandboxClient() {
  try {
    return createPaddleSandboxClient({ apiKey: process.env.PADDLE_SANDBOX_API_KEY ?? '', webhookSecret: process.env.PADDLE_SANDBOX_WEBHOOK_SECRET ?? '' })
  } catch { throw new ServiceUnavailableException('La pasarela sandbox no está configurada.') }
}

async function providerCustomer(accountId: string, user: AuthenticatedUser): Promise<string> {
  const found = await prisma.billingProviderCustomer.findUnique({
    where: { accountId_provider_environment: { accountId, provider: 'PADDLE', environment: 'SANDBOX' } },
  })
  if (found) return found.providerCustomerId
  sandboxClient() // Reject any live key before making an external request.
  const headers = { Authorization: `Bearer ${process.env.PADDLE_SANDBOX_API_KEY}`, 'Content-Type': 'application/json' }
  const request = async (path: string, body?: object) => {
    const response = await fetch(`${PADDLE_SANDBOX_API_ORIGIN}${path}`, {
      method: body ? 'POST' : 'GET', headers, body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(10000), redirect: 'error',
    })
    if (!response.ok) throw new ServiceUnavailableException('No se pudo vincular el cliente sandbox. Solicita revisión comercial.')
    return response.json() as Promise<{ data: { id: string; custom_data?: { aulaBaseAccountId?: string }; status?: string }[] | { id: string; custom_data?: { aulaBaseAccountId?: string } } }>
  }
  // A retry after a lost response must verify our immutable account binding, never trust email alone.
  const existing = await request(`/customers?email=${encodeURIComponent(user.email)}&per_page=200`)
  const customers = Array.isArray(existing.data) ? existing.data : []
  const own = customers.filter(c => c.custom_data?.aulaBaseAccountId === accountId)
  if (own.length > 1 || (customers.length && !own.length)) throw new ConflictException('El cliente sandbox requiere conciliación de titularidad.')
  const created = own[0] ?? (await request('/customers', { email: user.email, custom_data: { aulaBaseAccountId: accountId } })).data
  if (Array.isArray(created) || !/^ctm_[a-z\d]{26}$/.test(created.id) || created.custom_data?.aulaBaseAccountId !== accountId) {
    throw new ServiceUnavailableException('El proveedor no confirmó la titularidad del cliente.')
  }
  const linked = await prisma.billingProviderCustomer.upsert({
    where: { accountId_provider_environment: { accountId, provider: 'PADDLE', environment: 'SANDBOX' } },
    create: { accountId, provider: 'PADDLE', environment: 'SANDBOX', providerCustomerId: created.id }, update: {},
  })
  return linked.providerCustomerId
}

@Injectable()
export class BillingProviderService {
  async checkout(user: AuthenticatedUser, dto: CheckoutDto): Promise<{ url: string | null; status: string }> {
    const config = requireBilling()
    if (!config.checkout) throw new ServiceUnavailableException('Las nuevas contrataciones están desactivadas.')
    if (!config.events || !process.env.PADDLE_SANDBOX_WEBHOOK_SECRET) throw new ServiceUnavailableException('Configura la recepción fiable de eventos sandbox antes de iniciar una contratación automática.')
    if (!process.env.BILLING_TERMS_VERSION || dto.termsVersion !== process.env.BILLING_TERMS_VERSION) {
      throw new BadRequestException('Revisa y acepta las condiciones vigentes del servidor.')
    }
    const client = sandboxClient()
    // Persist the reservation before the remote mutation. A timeout never permits a second charge attempt.
    const reserved = await withBillingOwner(user.id, async (db, now) => {
      const account = await billingAccount(user.id, db)
      const existing = await db.billingSubscription.findFirst({ where: { accountId: account.id, status: { in: [...acting] } } })
      if (existing) return { subscription: existing, created: false, accountId: account.id, providerPriceId: '' }
      const price = await authorizedPrice(dto.priceId, 'PADDLE', now, db)
      if (!price.providerPriceId) throw new ServiceUnavailableException('El precio sandbox no está configurado.')
      const trial = await db.billingTrial.findUnique({ where: { accountId: account.id } })
      if (trial?.status === 'ACTIVE' && trial.endsAt > now && !dto.acceptEarlyEnd) {
        throw new BadRequestException('Puedes continuar la prueba o aceptar explícitamente terminarla al confirmar el pago.')
      }
      const manualCoverage = await db.billingServicePeriod.findFirst({ where: {
        accountId: account.id, endsAt: { gt: now }, source: { in: ['TRANSFER', 'MANUAL_PAYMENT'] },
        payment: { status: 'SUCCEEDED' },
      } })
      if (manualCoverage) throw new ConflictException('Conserva tu cobertura por transferencia. El cambio a tarjeta requiere revisión para evitar doble cobro.')
      const courtesy = await db.billingCourtesy.findFirst({ where: { accountId: account.id, status: 'ACTIVE', revokedAt: null,
        startsAt: { lte: now }, OR: [{ endsAt: null }, { endsAt: { gt: now } }] } })
      if (courtesy) throw new ConflictException('Tienes una cortesía vigente. Solicita revisión antes de activar cobros.')
      const subscription = await db.billingSubscription.create({ data: {
        accountId: account.id, planId: price.planId, priceId: price.id, provider: 'PADDLE', environment: 'SANDBOX',
        metadata: { checkoutOperationId: randomUUID(), checkoutState: 'creating', termsVersion: dto.termsVersion,
          acceptedAt: now.toISOString(), acceptEarlyEnd: dto.acceptEarlyEnd },
      } })
      await audit(db, { accountId: account.id, actorUserId: user.id, action: 'checkout_reserved', entityType: 'subscription', entityId: subscription.id,
        metadata: { termsVersion: dto.termsVersion, acceptEarlyEnd: dto.acceptEarlyEnd } })
      return { subscription, created: true, accountId: account.id, providerPriceId: price.providerPriceId }
    })
    if (!reserved.created) {
      const state = metadata(reserved.subscription.metadata)
      if (reserved.subscription.status !== 'INCOMPLETE') throw new ConflictException('Ya existe una suscripción. Usa el portal para gestionarla.')
      return { url: typeof state.checkoutUrl === 'string' ? sandboxDestination(state.checkoutUrl) : null,
        status: typeof state.checkoutUrl === 'string' ? 'pending' : 'verifying' }
    }
    const state = metadata(reserved.subscription.metadata)
    try {
      const customerId = await providerCustomer(reserved.accountId, user)
      const remote = await client.createTransaction({ customerId, priceId: reserved.providerPriceId,
        customData: { checkoutOperationId: state.checkoutOperationId } })
      if (remote.customerId !== customerId || !/^txn_[a-z\d]{26}$/.test(remote.id)) throw new ServiceUnavailableException('La transacción sandbox no corresponde al titular.')
      const checkoutUrl = remote.checkoutUrl ? sandboxDestination(remote.checkoutUrl) : null
      await withBillingOwner(user.id, async (db) => {
        const latest = await db.billingSubscription.findUniqueOrThrow({ where: { id: reserved.subscription.id } })
        await db.billingSubscription.update({ where: { id: latest.id }, data: { metadata: {
          ...metadata(latest.metadata), checkoutState: 'ready', checkoutTransactionId: remote.id, checkoutUrl,
        } } })
      })
      return { url: checkoutUrl, status: 'pending' }
    } catch {
      // Keep the durable incomplete reservation, including after ambiguous network failure.
      await withBillingOwner(user.id, async db => {
        const latest = await db.billingSubscription.findUniqueOrThrow({ where: { id: reserved.subscription.id } })
        await db.billingSubscription.update({ where: { id: latest.id }, data: { metadata: { ...metadata(latest.metadata), checkoutState: 'needs_reconciliation' } } })
      })
      throw new ServiceUnavailableException('El intento quedó pendiente de verificación sandbox. No se creará otro automáticamente; contacta soporte.')
    }
  }

  async portal(user: AuthenticatedUser) {
    requireBilling()
    const account = await prisma.billingAccount.findUnique({ where: { userId: user.id } })
    if (!account || account.status !== 'ACTIVE') throw new NotFoundException('Cuenta comercial no disponible.')
    const customer = await prisma.billingProviderCustomer.findUnique({ where: {
      accountId_provider_environment: { accountId: account.id, provider: 'PADDLE', environment: 'SANDBOX' },
    } })
    if (!customer) throw new NotFoundException('No tienes un cliente sandbox vinculado.')
    const result = await sandboxClient().createCustomerPortalSession({ customerId: customer.providerCustomerId })
    if (result.customerId !== customer.providerCustomerId) throw new ServiceUnavailableException('El portal no corresponde al titular.')
    return { url: sandboxDestination(result.overviewUrl) }
  }

  async cancelRenewal(user: AuthenticatedUser) {
    requireBilling()
    const account = await prisma.billingAccount.findUnique({ where: { userId: user.id } })
    if (!account || account.status !== 'ACTIVE') throw new NotFoundException('Cuenta comercial no disponible.')
    const local = await prisma.billingSubscription.findFirst({ where: {
      accountId: account.id, provider: 'PADDLE', environment: 'SANDBOX', status: { in: ['ACTIVE', 'PAST_DUE', 'TRIALING'] },
    } })
    if (!local?.providerSubscriptionId) throw new NotFoundException('No hay una renovación sandbox activa.')
    const customer = await prisma.billingProviderCustomer.findUnique({ where: {
      accountId_provider_environment: { accountId: account.id, provider: 'PADDLE', environment: 'SANDBOX' },
    } })
    const client = sandboxClient()
    const before = await client.getSubscription(local.providerSubscriptionId)
    if (before.customerId !== customer?.providerCustomerId) throw new ConflictException('Revisa la titularidad de la suscripción.')
    const remote = before.scheduledChange?.action === 'cancel' ? before : await client.cancelSubscriptionAtPeriodEnd({ subscriptionId: local.providerSubscriptionId })
    if (remote.customerId !== customer.providerCustomerId || remote.scheduledChange?.action !== 'cancel') {
      throw new ServiceUnavailableException('El proveedor todavía no confirmó la cancelación programada.')
    }
    return withBillingOwner(user.id, async (db, now) => {
      await db.billingSubscription.update({ where: { id: local.id }, data: { cancelAtPeriodEnd: true, canceledAt: now } })
      await audit(db, { accountId: account.id, actorUserId: user.id, action: 'renewal_cancellation_confirmed', entityType: 'subscription', entityId: local.id,
        metadata: { effectiveAt: remote.scheduledChange!.effectiveAt } })
      return { status: 'scheduled', effectiveAt: remote.scheduledChange!.effectiveAt, coveragePreserved: true }
    })
  }
}
