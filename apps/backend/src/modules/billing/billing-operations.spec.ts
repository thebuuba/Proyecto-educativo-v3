import { beforeEach, describe, expect, it, vi } from 'vitest'
import { addBillingMonth } from './billing-policy'
import { BillingOperations } from './billing-operations'
import type { AuthenticatedUser } from '../auth/types/authenticated-user'

const mocks = vi.hoisted(() => {
  const delegate = () => ({
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
    upsert: vi.fn(),
    count: vi.fn(),
    groupBy: vi.fn(),
  })

  const db = {
    billingTrial: delegate(),
    billingPlan: delegate(),
    billingServicePeriod: delegate(),
    billingCourtesy: delegate(),
    billingPayment: delegate(),
    billingDocument: delegate(),
    billingTransferRequest: delegate(),
    billingBankMovement: delegate(),
    billingBankAccount: delegate(),
    billingSubscription: delegate(),
    billingSupportCase: delegate(),
    billingSupportMessage: delegate(),
    billingOutbox: delegate(),
    billingAuditLog: delegate(),
    billingEvent: delegate(),
    appUser: delegate(),
    billingAccount: delegate(),
    billingAdmin: delegate(),
    billingPrice: delegate(),
  }

  return {
    db,
    now: new Date('2026-10-15T14:00:00Z'),
    requireBilling: vi.fn(),
    billingAccount: vi.fn(),
    billingNow: vi.fn(),
    withBillingOwner: vi.fn(),
    requireCommercialAdmin: vi.fn(),
    audit: vi.fn(),
    notify: vi.fn(),
    authorizedPrice: vi.fn(),
  }
})

vi.mock('@aula/database', () => ({ prisma: mocks.db, Prisma: {} }))

vi.mock('./billing-store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./billing-store')>()
  return {
    ...actual,
    requireBilling: mocks.requireBilling,
    billingAccount: mocks.billingAccount,
    billingNow: mocks.billingNow,
    withBillingOwner: mocks.withBillingOwner,
    requireCommercialAdmin: mocks.requireCommercialAdmin,
    audit: mocks.audit,
    notify: mocks.notify,
    authorizedPrice: mocks.authorizedPrice,
  }
})

const config = { enabled: true, checkout: true, events: false, enforce: false, trialDays: 14, graceDays: 7 }
const user: AuthenticatedUser = { id: 'user-1', email: 'teacher@example.com', schoolId: 'school-1', roles: ['teacher'] }
const admin: AuthenticatedUser = { id: 'admin-1', email: 'admin@example.com', schoolId: 'school-1', roles: ['admin'] }

const transferFixture = (overrides: Record<string, unknown> = {}) => ({
  id: 'tr-1',
  accountId: 'acct-1',
  planId: 'plan-1',
  priceId: 'price-1',
  reference: 'TRF-1',
  customerReference: null,
  amountMinor: 50000n,
  currency: 'DOP',
  status: 'UNDER_REVIEW',
  receiptPath: null,
  reportedAt: mocks.now,
  createdAt: new Date('2026-10-14T00:00:00Z'),
  expiresAt: new Date('2026-10-20T00:00:00Z'),
  reviewedBy: null,
  reviewedAt: null,
  rejectionReason: null,
  paymentId: null,
  servicePeriodId: null,
  ...overrides,
})

describe('BillingOperations', () => {
  const operations = new BillingOperations()

  beforeEach(() => {
    vi.clearAllMocks()
    mocks.requireBilling.mockReturnValue(config)
    mocks.requireCommercialAdmin.mockResolvedValue(undefined)
    mocks.billingNow.mockResolvedValue(mocks.now)
    mocks.billingAccount.mockResolvedValue({ id: 'acct-1', userId: 'user-1', status: 'ACTIVE', sandbox: true, currency: null })
    mocks.withBillingOwner.mockImplementation(async (_userId: string, operation: (db: unknown, now: Date) => Promise<unknown>) =>
      operation(mocks.db, mocks.now),
    )
    process.env.BILLING_BANK_INSTRUCTIONS = 'Banco Popular, cuenta de Aula Base'
    process.env.BILLING_BANK_ACCOUNT_ID = 'bank-1'
  })

  describe('startTrial', () => {
    it('inicia la prueba con los días del servidor y el plan docente sin precio', async () => {
      mocks.db.billingTrial.findUnique.mockResolvedValue(null)
      mocks.db.billingPayment.findFirst.mockResolvedValue(null)
      mocks.db.billingCourtesy.findFirst.mockResolvedValue(null)
      mocks.db.billingPlan.findFirst.mockResolvedValue({ id: 'plan-1' })
      mocks.db.billingTrial.create.mockImplementation(async ({ data }: { data: Record<string, unknown> }) => ({ id: 'trial-1', ...data }))

      const result = await operations.startTrial(user)

      expect(result).toMatchObject({ id: 'trial-1', planId: 'plan-1', status: 'active' })
      const created = mocks.db.billingTrial.create.mock.calls[0][0].data
      expect((created.endsAt as Date).getTime() - (created.startsAt as Date).getTime()).toBe(14 * 86400000)
      expect(mocks.db.billingPlan.findFirst).toHaveBeenCalledWith({ where: { code: 'docente-completo', status: 'ACTIVE' }, select: { id: true } })
      expect(mocks.authorizedPrice).not.toHaveBeenCalled()
      expect(mocks.audit).toHaveBeenCalledWith(mocks.db, expect.objectContaining({ action: 'trial.started' }))
    })

    it('devuelve la prueba original en un reintento sin reiniciarla', async () => {
      mocks.db.billingTrial.findUnique.mockResolvedValue({
        id: 'trial-1', planId: 'plan-1', status: 'EXPIRED',
        startsAt: new Date('2026-01-01T00:00:00Z'), endsAt: new Date('2026-01-15T00:00:00Z'),
      })

      const result = await operations.startTrial(user)

      expect(result).toMatchObject({ id: 'trial-1', status: 'expired' })
      expect(mocks.db.billingTrial.create).not.toHaveBeenCalled()
    })

    it('no es elegible si ya pagó antes', async () => {
      mocks.db.billingTrial.findUnique.mockResolvedValue(null)
      mocks.db.billingPayment.findFirst.mockResolvedValue({ id: 'pay-1' })

      await expect(operations.startTrial(user)).rejects.toThrow(/pago/i)
      expect(mocks.db.billingTrial.create).not.toHaveBeenCalled()
    })

    it('no es elegible con una cortesía activa', async () => {
      mocks.db.billingTrial.findUnique.mockResolvedValue(null)
      mocks.db.billingPayment.findFirst.mockResolvedValue(null)
      mocks.db.billingCourtesy.findFirst.mockResolvedValue({ id: 'c-1' })

      await expect(operations.startTrial(user)).rejects.toThrow(/cortes/i)
      expect(mocks.db.billingTrial.create).not.toHaveBeenCalled()
    })

    it('limita la vigencia de la cortesía al plan docente y al presente', async () => {
      mocks.db.billingTrial.findUnique.mockResolvedValue(null)
      mocks.db.billingPayment.findFirst.mockResolvedValue(null)
      mocks.db.billingCourtesy.findFirst.mockResolvedValue({ id: 'c-1' })

      await expect(operations.startTrial(user)).rejects.toThrow()

      const args = mocks.db.billingCourtesy.findFirst.mock.calls[0][0]
      expect(args.where).toMatchObject({
        accountId: 'acct-1', status: 'ACTIVE', revokedAt: null, startsAt: { lte: mocks.now },
        plan: { code: 'docente-completo' },
      })
    })

    it('no ofrece la prueba comercial a quien no es docente ni altera roles', async () => {
      const student: AuthenticatedUser = { id: 'user-3', email: 'student@example.com', schoolId: 'school-1', roles: ['student'] }

      await expect(operations.startTrial(student)).rejects.toThrow(/docentes/i)
      expect(mocks.withBillingOwner).not.toHaveBeenCalled()
    })

    it('no inicia prueba si la prueba gratuita está desactivada', async () => {
      mocks.requireBilling.mockReturnValue({ ...config, trialDays: 0 })

      await expect(operations.startTrial(user)).rejects.toThrow(/desactivada/i)
      expect(mocks.withBillingOwner).not.toHaveBeenCalled()
    })
  })

  describe('createTransfer', () => {
    it('rechaza la transferencia si la contratación está desactivada', async () => {
      mocks.requireBilling.mockReturnValue({ ...config, checkout: false })

      await expect(operations.createTransfer(user, { priceId: 'price-1' })).rejects.toThrow()
      expect(mocks.db.billingTransferRequest.create).not.toHaveBeenCalled()
    })

    it('rechaza si faltan los datos bancarios configurados', async () => {
      delete process.env.BILLING_BANK_INSTRUCTIONS

      await expect(operations.createTransfer(user, { priceId: 'price-1' })).rejects.toThrow()
      expect(mocks.db.billingTransferRequest.create).not.toHaveBeenCalled()
    })

    it('reutiliza la solicitud abierta por cuenta y precio (idempotente)', async () => {
      mocks.authorizedPrice.mockResolvedValue({ id: 'price-1', planId: 'plan-1', amountMinor: 50000n, currency: 'DOP' })
      mocks.db.billingTransferRequest.findFirst.mockResolvedValue(transferFixture({ status: 'PENDING', reportedAt: null }))

      const result = await operations.createTransfer(user, { priceId: 'price-1' })

      expect(result).toMatchObject({ id: 'tr-1', status: 'pending', amountMinor: 50000, currency: 'DOP' })
      expect(mocks.db.billingTransferRequest.create).not.toHaveBeenCalled()
    })

    it('cierra la solicitud vencida y emite una nueva en lugar de reutilizarla', async () => {
      mocks.authorizedPrice.mockResolvedValue({ id: 'price-1', planId: 'plan-1', amountMinor: 50000n, currency: 'DOP' })
      mocks.db.billingTransferRequest.findFirst.mockResolvedValue(null)
      mocks.db.billingTransferRequest.create.mockImplementation(async ({ data }: { data: Record<string, unknown> }) => ({ id: 'tr-2', ...data }))

      await operations.createTransfer(user, { priceId: 'price-1' })

      expect(mocks.db.billingTransferRequest.updateMany).toHaveBeenCalledWith({
        where: { accountId: 'acct-1', priceId: 'price-1', status: { in: ['PENDING', 'UNDER_REVIEW'] }, expiresAt: { lte: mocks.now } },
        data: { status: 'EXPIRED' },
      })
      const openArgs = mocks.db.billingTransferRequest.findFirst.mock.calls[0][0]
      expect(openArgs.where).toMatchObject({ OR: [{ expiresAt: null }, { expiresAt: { gt: mocks.now } }] })
      expect(mocks.db.billingTransferRequest.create).toHaveBeenCalledTimes(1)
    })

    it('crea la solicitud con precio MANUAL autorizado y plazo explícito', async () => {
      mocks.authorizedPrice.mockResolvedValue({ id: 'price-1', planId: 'plan-1', amountMinor: 50000n, currency: 'DOP' })
      mocks.db.billingTransferRequest.findFirst.mockResolvedValue(null)
      mocks.db.billingTransferRequest.create.mockImplementation(async ({ data }: { data: Record<string, unknown> }) => ({ id: 'tr-1', ...data }))

      const result = await operations.createTransfer(user, { priceId: 'price-1' })

      expect(mocks.authorizedPrice).toHaveBeenCalledWith('price-1', 'MANUAL', mocks.now, mocks.db)
      const data = mocks.db.billingTransferRequest.create.mock.calls[0][0].data
      expect(data.status).toBe('PENDING')
      expect(data.amountMinor).toBe(50000n)
      expect((data.expiresAt as Date).getTime()).toBe(mocks.now.getTime() + 7 * 86400000)
      expect(result).toMatchObject({ status: 'pending', bankInstructions: expect.any(String) })
    })
  })

  describe('reportTransfer', () => {
    it('mueve una solicitud propia pendiente a revisión sin conceder cobertura', async () => {
      mocks.db.billingTransferRequest.findFirst.mockResolvedValue(transferFixture({ status: 'PENDING', reportedAt: null }))
      mocks.db.billingTransferRequest.update.mockImplementation(async ({ data }: { data: Record<string, unknown> }) =>
        transferFixture({ status: data.status, customerReference: data.customerReference, reportedAt: data.reportedAt }),
      )

      const result = await operations.reportTransfer(user, 'tr-1', { bankReference: 'REF-999' })

      expect(result.status).toBe('under_review')
      expect(mocks.db.billingServicePeriod.create).not.toHaveBeenCalled()
      expect(mocks.db.billingPayment.create).not.toHaveBeenCalled()
      expect(mocks.audit).toHaveBeenCalledWith(mocks.db, expect.objectContaining({ action: 'transfer.reported' }))
    })

    it('no permite reportar solicitudes de otro titular', async () => {
      mocks.db.billingTransferRequest.findFirst.mockResolvedValue(null)

      await expect(operations.reportTransfer(user, 'tr-9', { bankReference: 'REF-999' })).rejects.toThrow()
      expect(mocks.db.billingTransferRequest.update).not.toHaveBeenCalled()
    })

    it('marca como vencida y rechaza el reporte de una solicitud expirada', async () => {
      mocks.db.billingTransferRequest.findFirst.mockResolvedValue(transferFixture({
        status: 'PENDING', reportedAt: null, expiresAt: new Date('2026-10-01T00:00:00Z'),
      }))

      await expect(operations.reportTransfer(user, 'tr-1', { bankReference: 'REF-999' })).rejects.toThrow(/venc/i)
      expect(mocks.db.billingTransferRequest.update).toHaveBeenCalledWith({ where: { id: 'tr-1' }, data: { status: 'EXPIRED' } })
    })
  })

  describe('approveTransfer', () => {
    const dto = {
      bankMovementId: 'MOV-123',
      amountMinor: 50000,
      currency: 'DOP',
      receivedAt: '2026-10-15T13:00:00.000Z',
      reason: 'Ingreso verificado directamente en el banco',
    }

    beforeEach(() => {
      mocks.db.billingTransferRequest.findUnique.mockResolvedValue({ account: { userId: 'owner-1' } })
      mocks.db.billingTransferRequest.findFirst.mockResolvedValue(transferFixture())
      mocks.db.billingSubscription.findFirst.mockResolvedValue(null)
      mocks.db.billingBankMovement.findFirst.mockResolvedValue(null)
      mocks.db.billingPayment.findFirst.mockResolvedValue(null)
      mocks.db.billingServicePeriod.findFirst.mockResolvedValue(null)
      mocks.db.billingBankMovement.create.mockResolvedValue({ id: 'mov-1' })
      mocks.db.billingPayment.create.mockImplementation(async ({ data }: { data: Record<string, unknown> }) => ({ id: 'pay-2', ...data }))
      mocks.db.billingServicePeriod.create.mockImplementation(async ({ data }: { data: Record<string, unknown> }) => ({ id: 'sp-1', ...data }))
      mocks.db.billingTransferRequest.update.mockImplementation(async ({ data }: { data: Record<string, unknown> }) =>
        transferFixture({ status: data.status, paymentId: data.paymentId, servicePeriodId: data.servicePeriodId }),
      )
    })

    it('exige autorización comercial separada', async () => {
      await operations.approveTransfer(admin, 'tr-1', dto)

      expect(mocks.requireCommercialAdmin).toHaveBeenCalledWith(admin.id)
    })

    it('aprueba de forma atómica movimiento, pago, período, solicitud, auditoría y aviso', async () => {
      const result = await operations.approveTransfer(admin, 'tr-1', dto)

      expect(mocks.withBillingOwner).toHaveBeenCalledWith('owner-1', expect.any(Function))
      expect(mocks.db.billingPayment.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ status: 'SUCCEEDED', source: 'TRANSFER', amountMinor: 50000n, currency: 'DOP' }),
      }))
      expect(mocks.db.billingServicePeriod.create).toHaveBeenCalledTimes(1)
      expect(mocks.db.billingTransferRequest.update).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ status: 'APPROVED', paymentId: 'pay-2', servicePeriodId: 'sp-1' }),
      }))
      expect(mocks.audit).toHaveBeenCalledWith(mocks.db, expect.objectContaining({ action: 'transfer.approved' }))
      expect(mocks.notify).toHaveBeenCalled()
      expect(result).toMatchObject({ status: 'approved', paymentId: 'pay-2', servicePeriodId: 'sp-1' })
    })

    it('rechaza una discrepancia de importe sin aprobar automáticamente', async () => {
      await expect(operations.approveTransfer(admin, 'tr-1', { ...dto, amountMinor: 49000 })).rejects.toThrow()
      expect(mocks.db.billingPayment.create).not.toHaveBeenCalled()
      expect(mocks.db.billingBankMovement.create).not.toHaveBeenCalled()
    })

    it('rechaza una moneda distinta', async () => {
      await expect(operations.approveTransfer(admin, 'tr-1', { ...dto, currency: 'USD' })).rejects.toThrow()
      expect(mocks.db.billingPayment.create).not.toHaveBeenCalled()
    })

    it('rechaza un pago tardío fuera del plazo', async () => {
      await expect(operations.approveTransfer(admin, 'tr-1', { ...dto, receivedAt: '2026-10-25T03:00:00.000Z' })).rejects.toThrow()
      expect(mocks.db.billingPayment.create).not.toHaveBeenCalled()
    })

    it('rechaza un movimiento bancario ya registrado', async () => {
      mocks.db.billingBankMovement.findFirst.mockResolvedValue({ id: 'mov-existing' })

      await expect(operations.approveTransfer(admin, 'tr-1', dto)).rejects.toThrow()
      expect(mocks.db.billingBankMovement.create).not.toHaveBeenCalled()
    })

    it('no aprueba mientras exista una renovación con tarjeta sin cancelar', async () => {
      mocks.db.billingSubscription.findFirst.mockResolvedValue({ id: 'sub-1', status: 'ACTIVE', cancelAtPeriodEnd: false })

      await expect(operations.approveTransfer(admin, 'tr-1', dto)).rejects.toThrow()
      expect(mocks.db.billingPayment.create).not.toHaveBeenCalled()
    })

    it('autoriza antes de consultar para no filtrar la existencia de solicitudes', async () => {
      mocks.requireCommercialAdmin.mockRejectedValue(new Error('forbidden'))

      await expect(operations.approveTransfer(admin, 'tr-1', dto)).rejects.toThrow()
      expect(mocks.db.billingTransferRequest.findUnique).not.toHaveBeenCalled()
    })

    it('bloquea estados de tarjeta no resueltos aunque no haya renovación programada', async () => {
      mocks.db.billingSubscription.findFirst.mockResolvedValue({ id: 'sub-1', status: 'PAST_DUE', cancelAtPeriodEnd: true })

      await expect(operations.approveTransfer(admin, 'tr-1', dto)).rejects.toThrow()
      expect(mocks.db.billingPayment.create).not.toHaveBeenCalled()
    })

    it('exige cancelación programada y sin cobros pendientes antes de aprobar', async () => {
      mocks.db.billingSubscription.findFirst.mockResolvedValue({ id: 'sub-1', status: 'ACTIVE', cancelAtPeriodEnd: true })
      mocks.db.billingPayment.findFirst.mockResolvedValue({ id: 'pay-pending' })

      await expect(operations.approveTransfer(admin, 'tr-1', dto)).rejects.toThrow(/pendientes|fallidos/i)
      expect(mocks.db.billingPayment.create).not.toHaveBeenCalled()
    })

    it('rechaza un ingreso anterior a la propia solicitud', async () => {
      await expect(operations.approveTransfer(admin, 'tr-1', { ...dto, receivedAt: '2026-10-13T00:00:00.000Z' })).rejects.toThrow()
      expect(mocks.db.billingPayment.create).not.toHaveBeenCalled()
    })

    it('revalida el permiso comercial dentro de la transacción', async () => {
      await operations.approveTransfer(admin, 'tr-1', dto)

      expect(mocks.requireCommercialAdmin).toHaveBeenCalledWith(admin.id, mocks.db)
    })

    it('convierte la prueba activa solo al confirmar el pago', async () => {
      mocks.db.billingTrial.findFirst.mockResolvedValue({ id: 'trial-1' })
      mocks.db.billingTrial.update.mockResolvedValue({ id: 'trial-1', status: 'CONVERTED' })

      await operations.approveTransfer(admin, 'tr-1', dto)

      expect(mocks.db.billingTrial.update).toHaveBeenCalledWith({
        where: { id: 'trial-1' }, data: { status: 'CONVERTED', convertedAt: mocks.now, endedAt: mocks.now },
      })
      expect(mocks.notify).toHaveBeenCalledWith(mocks.db, 'acct-1', 'trial_converted', 'trial-converted:trial-1', expect.any(Object))
    })

    it('devuelve la aprobación original en un reintento (replay)', async () => {
      mocks.db.billingTransferRequest.findFirst.mockResolvedValue(transferFixture({ status: 'APPROVED', paymentId: 'pay-2', servicePeriodId: 'sp-1' }))

      const result = await operations.approveTransfer(admin, 'tr-1', dto)

      expect(mocks.db.billingPayment.create).not.toHaveBeenCalled()
      expect(result).toMatchObject({ status: 'approved', paymentId: 'pay-2' })
    })

    it('conserva los días anticipados y el ancla mensual original', async () => {
      const previous = { startsAt: new Date('2026-10-01T04:00:00Z'), endsAt: new Date('2026-11-01T04:00:00Z') }
      mocks.db.billingServicePeriod.findFirst.mockResolvedValue(previous)
      mocks.db.billingPayment.findFirst.mockResolvedValue({ metadata: { billingAnchor: 1 }, paidAt: new Date('2026-10-01T04:00:00Z') })

      await operations.approveTransfer(admin, 'tr-1', dto)

      const period = mocks.db.billingServicePeriod.create.mock.calls[0][0].data
      expect(period.startsAt).toEqual(previous.endsAt)
      expect(period.endsAt).toEqual(addBillingMonth(previous.endsAt, 1))
      const payment = mocks.db.billingPayment.create.mock.calls[0][0].data
      expect(payment.metadata.billingAnchor).toBe(1)
    })

    it('reinicia el ancla cuando se reactiva tras un vencimiento para no cobrar un mes por un día', async () => {
      const clock = new Date('2027-01-31T04:00:00Z')
      mocks.withBillingOwner.mockImplementation(async (_id, operation) => operation(mocks.db, clock))
      mocks.db.billingTransferRequest.findUnique.mockResolvedValue({ account: { userId: user.id } })
      const transfer = transferFixture({ createdAt: new Date('2027-01-30T04:00:00Z'), expiresAt: new Date('2027-02-02T04:00:00Z') })
      mocks.db.billingTransferRequest.findFirst.mockResolvedValue(transfer)
      mocks.db.billingSubscription.findFirst.mockResolvedValue(null)
      mocks.db.billingBankMovement.findFirst.mockResolvedValue(null)
      mocks.db.billingServicePeriod.findFirst.mockResolvedValue(null)
      mocks.db.billingPayment.findFirst.mockResolvedValue({ metadata: { billingAnchor: 1 }, paidAt: new Date('2026-12-01T04:00:00Z') })
      mocks.db.billingPayment.create.mockResolvedValue({ id: 'pay-1' })
      mocks.db.billingServicePeriod.create.mockResolvedValue({ id: 'period-1' })
      mocks.db.billingTransferRequest.update.mockResolvedValue({ ...transfer, status: 'APPROVED', paymentId: 'pay-1', servicePeriodId: 'period-1' })
      await operations.approveTransfer(admin, transfer.id, { bankMovementId: 'late-reactivation', amountMinor: 50000, currency: 'DOP', receivedAt: clock.toISOString(), reason: 'Ingreso sintético confirmado' })
      const period = mocks.db.billingServicePeriod.create.mock.calls.at(-1)?.[0].data
      expect(period.endsAt.toISOString()).toBe('2027-02-28T04:00:00.000Z')
      expect(mocks.db.billingPayment.create.mock.calls.at(-1)?.[0].data.metadata.billingAnchor).toBe(31)
    })
  })

  describe('rejectTransfer', () => {
    it('rechaza, audita y es idempotente', async () => {
      mocks.db.billingTransferRequest.findUnique.mockResolvedValue({ account: { userId: 'owner-1' } })
      mocks.db.billingTransferRequest.findFirst.mockResolvedValue(transferFixture({ status: 'REJECTED', rejectionReason: 'Comprobante ilegible' }))

      const result = await operations.rejectTransfer(admin, 'tr-1', { reason: 'Comprobante ilegible' })

      expect(result.status).toBe('rejected')
      expect(mocks.db.billingTransferRequest.update).not.toHaveBeenCalled()
    })

    it('registra el rechazo de una solicitud abierta con auditoría', async () => {
      mocks.db.billingTransferRequest.findUnique.mockResolvedValue({ account: { userId: 'owner-1' } })
      mocks.db.billingTransferRequest.findFirst.mockResolvedValue(transferFixture({ status: 'PENDING' }))
      mocks.db.billingTransferRequest.update.mockImplementation(async ({ data }: { data: Record<string, unknown> }) =>
        transferFixture({ status: data.status, rejectionReason: data.rejectionReason }),
      )

      const result = await operations.rejectTransfer(admin, 'tr-1', { reason: 'Importe no recibido en banco' })

      expect(result.status).toBe('rejected')
      expect(mocks.audit).toHaveBeenCalledWith(mocks.db, expect.objectContaining({ action: 'transfer.rejected' }))
    })

    it('autoriza antes de consultar y revalida dentro de la transacción', async () => {
      mocks.db.billingTransferRequest.findFirst.mockResolvedValue(transferFixture({ status: 'PENDING' }))
      mocks.db.billingTransferRequest.update.mockImplementation(async ({ data }: { data: Record<string, unknown> }) =>
        transferFixture({ status: data.status }),
      )

      await operations.rejectTransfer(admin, 'tr-1', { reason: 'Importe no recibido en banco' })

      expect(mocks.requireCommercialAdmin).toHaveBeenNthCalledWith(1, admin.id)
      expect(mocks.requireCommercialAdmin).toHaveBeenNthCalledWith(2, admin.id, mocks.db)
    })
  })

  describe('grantCourtesy', () => {
    const courtesy = {
      userId: 'user-2',
      planId: 'plan-1',
      startsAt: '2026-10-16T00:00:00.000Z',
      endsAt: '2026-11-16T00:00:00.000Z',
      reason: 'Compensación por incidencia verificada',
      acknowledgeActiveRenewal: false,
    }

    beforeEach(() => {
      mocks.billingAccount.mockResolvedValue({ id: 'acct-2', userId: 'user-2', status: 'ACTIVE', sandbox: true, currency: null })
      mocks.db.billingPlan.findFirst.mockResolvedValue({ id: 'plan-1', status: 'ACTIVE' })
      mocks.db.billingCourtesy.create.mockImplementation(async ({ data }: { data: Record<string, unknown> }) => ({ id: 'c-1', ...data }))
    })

    it('exige reconocer una renovación activa y avisa sin cancelarla remotamente', async () => {
      mocks.db.billingSubscription.findFirst.mockResolvedValue({ id: 'sub-1', status: 'ACTIVE', cancelAtPeriodEnd: false })

      await expect(operations.grantCourtesy(admin, courtesy)).rejects.toThrow(/renovaci/i)
      expect(mocks.db.billingCourtesy.create).not.toHaveBeenCalled()
    })

    it('concede la cortesía sin crear pago y avisa de la renovación activa', async () => {
      mocks.db.billingSubscription.findFirst.mockResolvedValue({ id: 'sub-1', status: 'ACTIVE', cancelAtPeriodEnd: false })

      const result = await operations.grantCourtesy(admin, { ...courtesy, acknowledgeActiveRenewal: true })

      expect(result).toMatchObject({ id: 'c-1', status: 'active', activeRenewal: true })
      expect(mocks.db.billingPayment.create).not.toHaveBeenCalled()
      expect(mocks.audit).toHaveBeenCalledWith(mocks.db, expect.objectContaining({ action: 'courtesy.granted' }))
    })

    it('revalida el permiso comercial dentro de la transacción', async () => {
      mocks.db.billingSubscription.findFirst.mockResolvedValue(null)

      await operations.grantCourtesy(admin, courtesy)

      expect(mocks.requireCommercialAdmin).toHaveBeenNthCalledWith(2, admin.id, mocks.db)
    })

    it('rechaza fechas inconsistentes', async () => {
      mocks.db.billingSubscription.findFirst.mockResolvedValue(null)

      await expect(operations.grantCourtesy(admin, { ...courtesy, endsAt: '2026-10-15T00:00:00.000Z' })).rejects.toThrow()
      expect(mocks.db.billingCourtesy.create).not.toHaveBeenCalled()
    })
  })

  describe('revokeCourtesy', () => {
    it('revoca con auditoría, sin cargos, e idempotente', async () => {
      mocks.db.billingCourtesy.findUnique.mockResolvedValue({ account: { userId: 'owner-1' } })
      mocks.db.billingCourtesy.findFirst.mockResolvedValue({
        id: 'c-1', planId: 'plan-1', status: 'REVOKED', startsAt: new Date('2026-10-01T00:00:00Z'),
        endsAt: null, reason: 'x', revokedAt: mocks.now, revocationReason: 'Motivo suficientemente largo',
      })

      const result = await operations.revokeCourtesy(admin, 'c-1', { reason: 'Motivo suficientemente largo' })

      expect(result.status).toBe('revoked')
      expect(mocks.db.billingCourtesy.update).not.toHaveBeenCalled()
      expect(mocks.db.billingPayment.create).not.toHaveBeenCalled()
    })
  })

  describe('createSupport', () => {
    beforeEach(() => {
      mocks.db.billingSupportCase.create.mockImplementation(async ({ data }: { data: Record<string, unknown> }) => ({ id: 'case-1', ...data }))
      mocks.db.billingSupportMessage.create.mockResolvedValue({ id: 'msg-1' })
    })

    it('persiste el caso, el mensaje, el aviso in_app y la auditoría sin fingir correo', async () => {
      mocks.db.billingSubscription.findFirst.mockResolvedValue(null)

      const result = await operations.createSupport(user, {
        category: 'access', subject: 'No puedo entrar al panel', message: 'Aunque pago, no puedo abrir el panel docente.',
      })

      expect(result).toMatchObject({ id: 'case-1', status: 'open', category: 'technical', number: expect.stringMatching(/^CAS-/) })
      expect(mocks.db.billingSupportMessage.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ authorUserId: user.id }) }))
      expect(mocks.notify).toHaveBeenCalledWith(mocks.db, 'acct-1', 'support_received', expect.any(String), expect.any(Object))
      expect(mocks.audit).toHaveBeenCalledWith(mocks.db, expect.objectContaining({ action: 'support.created' }))
    })

    it('clasifica como suscripción el acceso con una suscripción vigente', async () => {
      mocks.db.billingSubscription.findFirst.mockResolvedValue({ id: 'sub-1' })

      const result = await operations.createSupport(user, {
        category: 'access', subject: 'No puedo entrar al panel', message: 'Aunque pago, no puedo abrir el panel docente.',
      })

      expect(result).toMatchObject({ category: 'subscription' })
    })

    it('genera el número con el reloj de la transacción y un sufijo único completo', async () => {
      mocks.db.billingSubscription.findFirst.mockResolvedValue(null)

      await operations.createSupport(user, {
        category: 'other', subject: 'Consulta general', message: 'Necesito información sobre los planes disponibles.',
      })

      const number = mocks.db.billingSupportCase.create.mock.calls[0][0].data.number as string
      expect(number).toMatch(/^CAS-20261015-[0-9A-F]{32}$/)
    })

    it('solo acepta un pago propio', async () => {
      mocks.db.billingPayment.findFirst.mockResolvedValue(null)

      await expect(operations.createSupport(user, {
        category: 'payment', subject: 'Duda de mi pago', message: 'Quiero revisar un pago que no reconozco.', paymentId: 'pay-x',
      })).rejects.toThrow()
      expect(mocks.db.billingSupportCase.create).not.toHaveBeenCalled()
    })
  })

  describe('updateSupport', () => {
    const dto = { status: 'in_progress' as const, reason: 'Revisando el estado del panel docente.' }

    beforeEach(() => {
      mocks.db.billingSupportCase.findUnique.mockResolvedValue({ userId: 'owner-1', accountId: 'acct-1' })
      mocks.db.billingSupportCase.findFirst.mockResolvedValue({
        id: 'case-1', accountId: 'acct-1', number: 'CAS-1', category: 'PAYMENT', status: 'OPEN',
        subject: 'Duda de pago', createdAt: mocks.now, resolvedAt: null,
      })
      mocks.db.billingSupportCase.update.mockImplementation(async ({ data }: { data: Record<string, unknown> }) => ({
        id: 'case-1', number: 'CAS-1', category: 'PAYMENT', subject: 'Duda de pago', createdAt: mocks.now,
        status: data.status,
      }))
      mocks.db.billingSupportMessage.create.mockResolvedValue({ id: 'msg-2' })
    })

    it('responde al titular como admin público, audita el motivo y notifica', async () => {
      const result = await operations.updateSupport(admin, 'case-1', dto)

      expect(mocks.requireCommercialAdmin).toHaveBeenNthCalledWith(1, admin.id)
      expect(mocks.requireCommercialAdmin).toHaveBeenNthCalledWith(2, admin.id, mocks.db)
      expect(mocks.db.billingSupportMessage.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ caseId: 'case-1', authorType: 'admin', isInternal: false, body: dto.reason }),
      }))
      expect(mocks.audit).toHaveBeenCalledWith(mocks.db, expect.objectContaining({
        action: 'support.updated', metadata: expect.objectContaining({ reason: dto.reason }),
      }))
      expect(mocks.notify).toHaveBeenCalledWith(mocks.db, 'acct-1', 'support_updated', expect.any(String), { status: 'IN_PROGRESS' })
      expect(result).toMatchObject({ status: 'in_progress' })
    })

    it('autoriza antes de consultar para no filtrar la existencia del caso', async () => {
      mocks.requireCommercialAdmin.mockRejectedValue(new Error('forbidden'))

      await expect(operations.updateSupport(admin, 'case-1', dto)).rejects.toThrow()
      expect(mocks.db.billingSupportCase.findUnique).not.toHaveBeenCalled()
    })
  })

  describe('adminOverview', () => {
    beforeEach(() => {
      mocks.db.billingSubscription.findMany.mockResolvedValue([])
      mocks.db.billingTransferRequest.findMany.mockResolvedValue([])
      mocks.db.billingCourtesy.findMany.mockResolvedValue([])
      mocks.db.billingSupportCase.findMany.mockResolvedValue([])
      mocks.db.billingEvent.findMany.mockResolvedValue([])
      mocks.db.billingAuditLog.findMany.mockResolvedValue([])
      mocks.db.billingPayment.findMany.mockResolvedValue([])
      mocks.db.billingTrial.count.mockResolvedValue(0)
      mocks.db.billingPayment.groupBy.mockResolvedValue([
        { currency: 'DOP', _sum: { amountMinor: 150000n, amountRefundedMinor: 20000n }, _count: { _all: 3 } },
      ])
    })

    it('exige un permiso comercial separado de los roles escolares', async () => {
      mocks.requireCommercialAdmin.mockRejectedValue(new Error('forbidden'))

      await expect(operations.adminOverview(user, {})).rejects.toThrow()
      expect(mocks.db.billingSubscription.findMany).not.toHaveBeenCalled()
    })

    it('pagina, limita la búsqueda y separa bruto, reembolsado y neto por moneda', async () => {
      const result = await operations.adminOverview(admin, { q: 'ref', page: '2' })

      expect(mocks.requireCommercialAdmin).toHaveBeenCalledWith(admin.id)
      expect(mocks.db.billingTransferRequest.findMany).toHaveBeenCalledWith(expect.objectContaining({ skip: 20, take: 20 }))
      const groupArgs = mocks.db.billingPayment.groupBy.mock.calls[0][0]
      expect(groupArgs.where).toMatchObject({ status: { in: ['SUCCEEDED', 'PARTIALLY_REFUNDED', 'REFUNDED'] } })
      expect(result.metrics.byCurrency).toEqual([
        { currency: 'DOP', grossMinor: 150000, refundedMinor: 20000, netMinor: 130000, count: 3 },
      ])
      expect(result).toMatchObject({ page: 2, pageSize: 20, query: { q: 'ref' } })
    })

    it('respeta pageSize acotado y expone conteos de cuentas de pago, prueba y cortesía', async () => {
      mocks.db.billingPayment.findMany.mockResolvedValue([{ accountId: 'a1' }, { accountId: 'a2' }])
      mocks.db.billingTrial.count.mockResolvedValue(4)
      mocks.db.billingCourtesy.findMany.mockResolvedValue([{
        id: 'c-1', planId: 'plan-1', status: 'ACTIVE', startsAt: mocks.now, endsAt: null, reason: 'Compensación',
        revokedAt: null, revocationReason: null, accountId: 'a3',
        account: { id: 'acct-3', userId: 'user-3', user: { fullName: 'Luis', email: 'luis@aula.test' } },
      }])

      const result = await operations.adminOverview(admin, { pageSize: '500' })

      expect(mocks.db.billingTransferRequest.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 100 }))
      expect(result.pageSize).toBe(100)
      expect(result.counts).toEqual({ paidAccounts: 2, trialAccounts: 4, courtesyAccounts: 1 })
      expect(mocks.db.billingTrial.count).toHaveBeenCalledWith({ where: { status: 'ACTIVE', startsAt: { lte: mocks.now }, endsAt: { gt: mocks.now } } })
    })

    it('incluye la identidad del titular en las listas y busca por correo o nombre', async () => {
      mocks.db.billingSubscription.findMany.mockResolvedValue([{
        id: 'sub-1', accountId: 'acct-9', status: 'ACTIVE', providerStatus: 'active', cancelAtPeriodEnd: false,
        currentPeriodEnd: mocks.now, account: { id: 'acct-9', userId: 'user-9', user: { fullName: 'Ana Pérez', email: 'ana@aula.test' } },
      }])

      const result = await operations.adminOverview(admin, { q: 'ana@aula' })

      const subsArgs = mocks.db.billingSubscription.findMany.mock.calls[0][0]
      expect(subsArgs.include).toMatchObject({ account: { select: { id: true, userId: true, user: { select: { fullName: true, email: true } } } } })
      expect(subsArgs.where.OR).toEqual(expect.arrayContaining([{ account: { user: { email: { contains: 'ana@aula', mode: 'insensitive' } } } }]))
      expect(result.subscriptions[0]).toMatchObject({ id: 'sub-1', accountId: 'acct-9', userId: 'user-9', email: 'ana@aula.test', fullName: 'Ana Pérez' })
    })
  })
})
