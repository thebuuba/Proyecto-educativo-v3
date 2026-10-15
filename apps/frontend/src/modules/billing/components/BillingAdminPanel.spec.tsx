import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { BillingAdminPanel } from '@/modules/billing/components/BillingAdminPanel'
import * as billingService from '@/modules/billing/services/billingService'
import type { BillingAdminCatalog, BillingAdminOverview } from '@/modules/billing/types'

vi.mock('@/modules/billing/services/billingService', () => ({
  getAdminOverview: vi.fn(),
  getAdminCatalog: vi.fn(),
  createCourtesy: vi.fn(),
  revokeCourtesy: vi.fn(),
  approveTransfer: vi.fn(),
  rejectTransfer: vi.fn(),
  updateSupportCase: vi.fn(),
  retryFailedEvent: vi.fn(),
  getTransferReceipt: vi.fn(),
  getSupportDetail: vi.fn(),
}))

const mocked = vi.mocked(billingService)

function makeOverview(overrides: Partial<BillingAdminOverview> = {}): BillingAdminOverview {
  return {
    page: 1,
    pageSize: 20,
    subscriptions: [],
    transfers: [],
    courtesies: [],
    cases: [],
    failedEvents: [],
    audit: [],
    metrics: null,
    counts: null,
    ...overrides,
  }
}

const catalog: BillingAdminCatalog = {
  plans: [{ id: 'plan-1', name: 'Docente Completo' }],
  configuration: {},
}

beforeEach(() => {
  vi.resetAllMocks()
  mocked.getAdminOverview.mockResolvedValue(makeOverview())
  mocked.getAdminCatalog.mockResolvedValue(catalog)
})

describe('BillingAdminPanel', () => {
  it('no se muestra ni consulta datos sin autorización comercial', () => {
    render(<BillingAdminPanel commercialAdmin={false} />)
    expect(screen.queryByText(/panel comercial/i)).not.toBeInTheDocument()
    expect(mocked.getAdminOverview).not.toHaveBeenCalled()
  })

  it('tolera respuestas vacías y muestra las secciones reales', async () => {
    render(<BillingAdminPanel commercialAdmin />)
    expect(await screen.findByText(/panel comercial/i)).toBeInTheDocument()
    expect(await screen.findByText(/sin suscripciones/i)).toBeInTheDocument()
    expect(screen.getByText(/sin solicitudes de transferencia/i)).toBeInTheDocument()
    expect(screen.getByText(/sin cortesías/i)).toBeInTheDocument()
  })

  it('muestra datos reales de transferencias y casos', async () => {
    mocked.getAdminOverview.mockResolvedValue(
      makeOverview({
        transfers: [{ id: 'tr-1', reference: 'REF-9', status: 'pending', amountMinor: 250000, currency: 'DOP' }],
        cases: [{ id: 'case-1', number: 'CAS-1', category: 'payment', status: 'open', createdAt: '2026-10-15T12:00:00Z' }],
      }),
    )
    render(<BillingAdminPanel commercialAdmin />)
    expect(await screen.findByText('REF-9')).toBeInTheDocument()
    expect(screen.getByText('CAS-1')).toBeInTheDocument()
  })

  it('exige motivo, titular y confirmación de renovación para conceder una cortesía', async () => {
    const user = userEvent.setup()
    render(<BillingAdminPanel commercialAdmin />)

    await user.click(await screen.findByRole('button', { name: /nueva cortesía/i }))

    const submit = screen.getByRole('button', { name: /conceder cortesía/i })
    expect(submit).toBeDisabled()

    await user.type(screen.getByLabelText('Usuario destinatario'), '11111111-1111-4111-8111-111111111111')
    await user.type(screen.getByLabelText('Motivo de la cortesía'), 'motivo')
    expect(submit).toBeDisabled()

    await user.type(screen.getByLabelText('Motivo de la cortesía'), ' suficiente para auditoría')
    expect(submit).toBeDisabled()

    await user.click(screen.getByRole('checkbox'))
    expect(submit).toBeEnabled()
  })

  it('ofrece aprobar y rechazar una transferencia en revisión', async () => {
    mocked.getAdminOverview.mockResolvedValue(
      makeOverview({
        transfers: [
          {
            id: 'tr-2',
            reference: 'REF-2',
            status: 'under_review',
            amountMinor: 250000,
            currency: 'DOP',
            receiptAvailable: true,
          },
        ],
      }),
    )
    render(<BillingAdminPanel commercialAdmin />)

    expect(await screen.findByRole('button', { name: /confirmar ingreso/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /rechazar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /ver comprobante/i })).toBeInTheDocument()
  })

  it('muestra métricas reales y conteos sin inventar ceros', async () => {
    mocked.getAdminOverview.mockResolvedValue(
      makeOverview({
        metrics: {
          byCurrency: [{ currency: 'USD', grossMinor: 5000, refundedMinor: 1000, netMinor: 4000, count: 2 }],
        },
        counts: { paidAccounts: 3, trialAccounts: 1, courtesyAccounts: 0 },
      }),
    )
    render(<BillingAdminPanel commercialAdmin />)

    expect(await screen.findByText(/moneda USD/i)).toBeInTheDocument()
    expect(screen.getByText('Bruto')).toBeInTheDocument()
    expect(screen.getByText('Devoluciones')).toBeInTheDocument()
    expect(screen.getByText('Neto')).toBeInTheDocument()
    expect(screen.getByText('Con pago')).toBeInTheDocument()
  })

  it('no muestra ceros cuando el servidor no publica métricas', async () => {
    render(<BillingAdminPanel commercialAdmin />)
    expect(await screen.findByText(/no publicó métricas de ingresos/i)).toBeInTheDocument()
    expect(screen.queryByText(/moneda USD/i)).not.toBeInTheDocument()
  })

  it('busca enviando la consulta y la página al servidor', async () => {
    const user = userEvent.setup()
    render(<BillingAdminPanel commercialAdmin />)
    await screen.findByText(/panel comercial/i)

    await user.type(screen.getByLabelText('Buscar en el panel comercial'), 'REF-9')
    await user.click(screen.getByRole('button', { name: /^buscar$/i }))

    expect(mocked.getAdminOverview).toHaveBeenLastCalledWith({ q: 'REF-9', page: 1 })
  })
})
