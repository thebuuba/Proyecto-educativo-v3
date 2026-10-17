import { ForbiddenException, NotFoundException, ServiceUnavailableException } from '@nestjs/common'
import { prisma, Prisma } from '@aula/database'
import { readBillingConfig } from './billing-policy'

export type BillingTx = Prisma.TransactionClient
export type EffectiveAccess = { allowed: boolean; reason: string; until: string | null; enforced?: boolean }

export function requireBilling() {
  const config = readBillingConfig(process.env)
  if (!config.enabled) throw new ServiceUnavailableException('Suscripciones y pagos todavía no están habilitados.')
  return config
}

export async function requireCommercialAdmin(userId: string, db: BillingTx = prisma) {
  const admin = await db.billingAdmin.findFirst({
    where: { userId, status: 'ACTIVE', revokedAt: null, user: { status: 'ACTIVE' } }, select: { id: true },
  })
  if (!admin) throw new ForbiddenException('Se requiere autorización de administración comercial.')
}

export async function billingAccount(userId: string, db: BillingTx = prisma) {
  const user = await db.appUser.findUnique({ where: { id: userId }, select: { id: true, status: true } })
  if (!user) throw new NotFoundException('Titular no encontrado.')
  if (user.status !== 'ACTIVE') throw new ForbiddenException('La cuenta está suspendida.')
  const account = await db.billingAccount.upsert({ where: { userId }, create: { userId }, update: {} })
  if (account.status !== 'ACTIVE' || !account.sandbox) throw new ForbiddenException('La cuenta comercial no está activa en sandbox.')
  return account
}

export async function billingNow(db: BillingTx = prisma): Promise<Date> {
  const [row] = await db.$queryRaw<{ now: Date }[]>`select transaction_timestamp() as now`
  return row.now
}

/** Serialize per owner, including first creation of an account. Never lock by school. */
export function withBillingOwner<T>(userId: string, operation: (db: BillingTx, now: Date) => Promise<T>): Promise<T> {
  return prisma.$transaction(async db => {
    const rows = await db.$queryRaw<{ id: string }[]>`select id from public.app_users where id = ${userId}::uuid for update`
    if (!rows.length) throw new NotFoundException('Titular no encontrado.')
    return operation(db, await billingNow(db))
  }, { timeout: 20000 })
}

/** The SQL function is also used by restrictive academic and Storage RLS policies. */
export async function effectiveAccess(userId: string, db: BillingTx = prisma): Promise<EffectiveAccess> {
  const [row] = await db.$queryRaw<{ access: EffectiveAccess }[]>`select app_private.billing_effective_access(${userId}::uuid) as access`
  if (!row?.access || typeof row.access.allowed !== 'boolean') throw new ServiceUnavailableException('No se pudo comprobar la cobertura.')
  return row.access
}

export async function audit(db: BillingTx, input: {
  accountId?: string; actorUserId?: string; actorType?: 'user' | 'system' | 'provider'
  action: string; entityType: string; entityId?: string; metadata?: Prisma.InputJsonValue
}) {
  await db.billingAuditLog.create({ data: input })
}

export async function notify(db: BillingTx, accountId: string, template: string, dedupeKey: string, payload: Prisma.InputJsonValue = {}) {
  // Persistent in-app inbox. No email is marked sent without an actual delivery provider.
  const found = await db.billingOutbox.findFirst({ where: { dedupeKey }, select: { id: true } })
  if (!found) await db.billingOutbox.create({ data: { accountId, template, dedupeKey, payload, channel: 'in_app' } })
}

export async function authorizedPrice(priceId: string, provider: 'MANUAL' | 'PADDLE', now: Date, db: BillingTx = prisma) {
  const price = await db.billingPrice.findFirst({ where: {
    id: priceId, provider, status: 'ACTIVE', isPublic: true, interval: 'MONTHLY', intervalCount: 1,
    plan: { code: 'docente-completo', status: 'ACTIVE', isPublic: true },
    AND: [
      { OR: [{ effectiveFrom: null }, { effectiveFrom: { lte: now } }] },
      { OR: [{ effectiveTo: null }, { effectiveTo: { gt: now } }] },
    ],
  }, include: { plan: true } })
  if (!price || price.amountMinor <= 0n || price.amountMinor > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new NotFoundException('Precio mensual autorizado no disponible.')
  }
  return price
}

export function publicMoney(value: bigint): number {
  if (value > BigInt(Number.MAX_SAFE_INTEGER) || value < 0n) throw new ServiceUnavailableException('Importe fuera del rango admitido.')
  return Number(value)
}
