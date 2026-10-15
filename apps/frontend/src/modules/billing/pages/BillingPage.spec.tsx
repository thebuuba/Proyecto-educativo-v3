import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as billingService from '@/modules/billing/services/billingService'
import type { BillingOverview, BillingPrice } from '@/modules/billing/types'
import { BillingPage } from './BillingPage'

vi.mock('@/modules/billing/services/billingService', () => ({
  getBillingOverview: vi.fn(),
  createTransfer: vi.fn(),
  reportTransfer: vi.fn(),
  createCheckout: vi.fn(),
  openPortal: vi.fn(),
  cancelRenewal: vi.fn(),
  createSupportCase: vi.fn(),
  getAdminOverview: vi.fn(),
  getAdminCatalog: vi.fn(),
  createCourtesy: vi.fn(),
  revokeCourtesy: vi.fn(),
  approveTransfer: vi.fn(),
  rejectTransfer: vi.fn(),
  updateSupportCase: vi.fn(),
  retryFailedEvent: vi.fn(),
  uploadTransferReceipt: vi.fn(),
  getTransferReceipt: vi.fn(),
  getSupportDetail: vi.fn(),
}))

const mocked = vi.mocked(billingService)

const offerPrice: BillingPrice = {
  id: 'price-paddle',
  label: 'Docente Completo',
  amountMinor: 799,
  currency: 'USD',
  interval: 'month',
  mode: 'paddle',
}

function makeOverview(overrides: Partial<BillingOverview> = {}): BillingOverview {
  return {
    enabled: true,
    environment: 'sandbox',
    checkoutEnabled: false,
    eventsEnabled: true,
    access: { allowed: false, reason: 'none', until: null },
    trial: null,
    grants: [],
    payments: [],
    documents: [],
    transfers: [],
    subscriptions: [],
    prices: [],
    offer: null,
    cases: [],
    notices: [],
    commercialAdmin: false,
    supportEmail: 'soporte@aulabase.test',
    bankInstructions: null,
    termsVersion: '2026-10-01',
    serverNow: '2026-10-15T12:00:00.000Z',
    ...overrides,
  }
}

function renderPage(initialEntries: string[] = ['/']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <BillingPage />
    </MemoryRouter>,
  )
}

beforeEach(() => {
  vi.resetAllMocks()
})

describe('BillingPage', () => {
  it('distingue el precio aprobado de los métodos de pago aún no habilitados', async () => {
    mocked.getBillingOverview.mockResolvedValue(makeOverview({ prices: [], checkoutEnabled: false }))
    renderPage()
    expect(await screen.findByText('Sin formas de pago habilitadas')).toBeInTheDocument()
    expect(screen.getAllByText(/US\$7\.99/).length).toBeGreaterThan(0)
    expect(screen.queryByText('Sin precios publicados')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /activar mes gratuito/i })).not.toBeInTheDocument()
  })
  it('muestra el estado no configurado sin operaciones ni soporte', async () => {
    mocked.getBillingOverview.mockResolvedValue(
      makeOverview({ enabled: false, supportEmail: null }),
    )

    renderPage()

    expect(await screen.findByText(/las operaciones de suscripción están desactivadas/i)).toBeInTheDocument()
    expect(
      await screen.findByText(/el canal de soporte aún no está configurado/i),
    ).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /activar mes gratuito/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /enviar solicitud de soporte/i })).not.toBeInTheDocument()
  })

  it('registra un caso de soporte y solo entonces muestra su número', async () => {
    const user = userEvent.setup()
    mocked.getBillingOverview.mockResolvedValue(makeOverview())
    mocked.createSupportCase.mockResolvedValue({
      id: 'case-1',
      number: 'CASO-2026-0142',
      category: 'payment',
      status: 'open',
      createdAt: '2026-10-15T12:00:00.000Z',
    })

    renderPage()

    await user.type(await screen.findByLabelText('Asunto'), 'No veo mi pago')
    await user.type(screen.getByLabelText('Mensaje'), 'Transferí ayer y aún no aparece.')
    await user.click(screen.getByRole('button', { name: /enviar solicitud de soporte/i }))

    expect(await screen.findByText(/CASO-2026-0142/)).toBeInTheDocument()
    expect(mocked.createSupportCase).toHaveBeenCalledWith({
      category: 'payment',
      subject: 'No veo mi pago',
      message: 'Transferí ayer y aún no aparece.',
    })
    expect(
      screen.getByText(/no incluyas números completos de tarjeta, CVV, contraseñas ni datos de estudiantes/i),
    ).toBeInTheDocument()
  })

  it('muestra el error del servidor y no finge un caso creado', async () => {
    const user = userEvent.setup()
    mocked.getBillingOverview.mockResolvedValue(makeOverview())
    mocked.createSupportCase.mockRejectedValue(
      new Error('El servidor no pudo registrar el caso.'),
    )

    renderPage()

    await user.type(await screen.findByLabelText('Asunto'), 'Problema de acceso')
    await user.type(screen.getByLabelText('Mensaje'), 'No puedo entrar a mi cuenta.')
    await user.click(screen.getByRole('button', { name: /enviar solicitud de soporte/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent('El servidor no pudo registrar el caso.')
    expect(screen.queryByText(/número de caso/i)).not.toBeInTheDocument()
  })

  it('muestra la oferta aprobada con un mes con tarjeta y sin promesas de 14 días', async () => {
    mocked.getBillingOverview.mockResolvedValue(makeOverview({ offer: null, prices: [] }))

    renderPage()

    await screen.findByText(/cobertura efectiva/i)
    expect(screen.getAllByText(/US\$7\.99/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/mes gratuito/i).length).toBeGreaterThan(0)
    expect(screen.queryByText(/14 días/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/sin tarjeta/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/sin cobro/i)).not.toBeInTheDocument()
  })

  it('muestra la referencia DOP con tasa, fecha y salvedad bancaria', async () => {
    mocked.getBillingOverview.mockResolvedValue(makeOverview())

    renderPage()

    expect(await screen.findByText(/61\.6788/)).toBeInTheDocument()
    expect(screen.getByText(/14 oct 2026/)).toBeInTheDocument()
    expect(screen.getByText(/banco/i)).toBeInTheDocument()
    expect(screen.getByText(/impuestos/i)).toBeInTheDocument()
  })

  it('no inicia la prueba ni el checkout al montar', async () => {
    mocked.getBillingOverview.mockResolvedValue(
      makeOverview({ checkoutEnabled: true, prices: [offerPrice] }),
    )

    renderPage()

    await screen.findByText(/cobertura efectiva/i)
    expect(mocked.createCheckout).not.toHaveBeenCalled()

    await userEvent.setup().click(screen.getAllByRole('button', { name: /activar mes gratuito/i })[0])

    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    expect(mocked.createCheckout).not.toHaveBeenCalled()
  })

  it('no permite activar el mes con tarjeta si el servidor no publica la versión de condiciones', async () => {
    mocked.getBillingOverview.mockResolvedValue(
      makeOverview({ checkoutEnabled: true, termsVersion: null, prices: [offerPrice] }),
    )

    renderPage()

    await screen.findByText(/cobertura efectiva/i)
    expect(screen.queryByRole('button', { name: /activar mes gratuito/i })).not.toBeInTheDocument()
    expect(screen.getAllByText(/la activación con tarjeta no está disponible/i).length).toBeGreaterThan(0)
    expect(mocked.createCheckout).not.toHaveBeenCalled()
  })

  it('muestra indisponibilidad honesta cuando la oferta no está configurada', async () => {
    mocked.getBillingOverview.mockResolvedValue(
      makeOverview({ checkoutEnabled: false, eventsEnabled: false, prices: [] }),
    )

    renderPage()

    await screen.findByText(/cobertura efectiva/i)
    expect(screen.getAllByText(/la activación con tarjeta no está disponible/i).length).toBeGreaterThan(0)
    expect(screen.queryByRole('button', { name: /activar mes gratuito/i })).not.toBeInTheDocument()
  })

  it('no ofrece tarjeta para un precio manual', async () => {
    mocked.getBillingOverview.mockResolvedValue(
      makeOverview({
        checkoutEnabled: true,
        bankInstructions: 'Banco de ejemplo · Cuenta 000-0000000',
        prices: [
          {
            id: 'price-manual',
            label: 'Docente Completo',
            amountMinor: 250000,
            currency: 'DOP',
            interval: 'monthly',
            mode: 'manual',
          },
        ],
      }),
    )

    renderPage()

    expect(await screen.findByRole('button', { name: /solicitar transferencia/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /activar mes gratuito/i })).not.toBeInTheDocument()
  })

  it('permite pedir soporte estando vencido y sin correo configurado si el módulo está activo', async () => {
    const user = userEvent.setup()
    mocked.getBillingOverview.mockResolvedValue(
      makeOverview({
        supportEmail: null,
        access: { allowed: false, reason: 'expired', until: null },
      }),
    )
    mocked.createSupportCase.mockResolvedValue({
      id: 'case-1',
      number: 'CAS-2026-0001',
      category: 'payment',
      status: 'open',
      createdAt: '2026-10-15T12:00:00.000Z',
    })

    renderPage()

    await user.type(await screen.findByLabelText('Asunto'), 'Quiero retomar mi plan')
    await user.type(screen.getByLabelText('Mensaje'), 'Mi cobertura venció y quiero volver a pagar.')
    await user.click(screen.getByRole('button', { name: /enviar solicitud de soporte/i }))

    expect(await screen.findByText(/CAS-2026-0001/)).toBeInTheDocument()
  })

  it('no ofrece reportar una transferencia vencida', async () => {
    mocked.getBillingOverview.mockResolvedValue(
      makeOverview({
        transfers: [
          { id: 'tr-1', status: 'expired', reference: null, amountMinor: 250000, currency: 'DOP' },
        ],
      }),
    )

    renderPage()

    expect(await screen.findByText('expired')).toBeInTheDocument()
    expect(screen.queryByLabelText('Referencia bancaria')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^enviar$/i })).not.toBeInTheDocument()
  })

  it('muestra documentos y avisos reales sin afirmar un correo enviado', async () => {
    mocked.getBillingOverview.mockResolvedValue(
      makeOverview({
        documents: [
          {
            id: 'doc-1',
            number: 'FAC-1',
            type: 'invoice',
            amountMinor: 250000,
            currency: 'DOP',
            issuedAt: '2026-10-15T12:00:00.000Z',
          },
        ],
        notices: [
          {
            id: 'n-1',
            template: 'transfer_reported',
            payload: { reference: 'REF-9' },
            createdAt: '2026-10-15T12:30:00.000Z',
          },
        ],
      }),
    )

    renderPage()

    expect(await screen.findByText('FAC-1')).toBeInTheDocument()
    expect(screen.getByText(/reportamos tu transferencia/i)).toBeInTheDocument()
    expect(screen.getByText(/un aviso interno no confirma un correo/i)).toBeInTheDocument()
  })

  it('nunca muestra el panel comercial sin autorización', async () => {
    mocked.getBillingOverview.mockResolvedValue(makeOverview({ commercialAdmin: false }))

    renderPage()

    await screen.findByText(/cobertura efectiva/i)
    expect(screen.queryByText(/panel comercial/i)).not.toBeInTheDocument()
    expect(mocked.getAdminOverview).not.toHaveBeenCalled()
  })

  it('muestra el panel comercial cuando la cuenta tiene autorización', async () => {
    mocked.getBillingOverview.mockResolvedValue(makeOverview({ commercialAdmin: true }))

    renderPage()

    expect(await screen.findByText(/panel comercial/i)).toBeInTheDocument()
    expect(mocked.getAdminOverview).toHaveBeenCalled()
  })

  it('en modo integrado oculta la cabecera duplicada y conserva actualizar y soporte', async () => {
    mocked.getBillingOverview.mockResolvedValue(makeOverview())

    render(
      <MemoryRouter>
        <BillingPage embedded />
      </MemoryRouter>,
    )

    expect(await screen.findByText(/cobertura efectiva/i)).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { level: 1, name: /suscripción y pagos/i }),
    ).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /actualizar/i })).toBeInTheDocument()
    expect(screen.getByText('Soporte')).toBeInTheDocument()
  })

  it('conserva las fechas históricas de la prueba sin iniciar operaciones', async () => {
    mocked.getBillingOverview.mockResolvedValue(
      makeOverview({
        trial: { startsAt: '2026-10-01T00:00:00.000Z', endsAt: '2026-10-15T00:00:00.000Z' },
      }),
    )

    renderPage()

    expect(await screen.findByText(/inició el/i)).toBeInTheDocument()
    expect(screen.getByText(/finaliza el/i)).toBeInTheDocument()
    expect(mocked.createCheckout).not.toHaveBeenCalled()
  })

  it('muestra la bienvenida sin iniciar operaciones y solo abre el diálogo al pulsar', async () => {
    mocked.getBillingOverview.mockResolvedValue(
      makeOverview({
        checkoutEnabled: true,
        prices: [offerPrice],
        access: { allowed: true, reason: 'legacy', until: null },
      }),
    )

    renderPage(['/?bienvenida=1'])

    expect(await screen.findByText(/bienvenido a aulabase/i)).toBeInTheDocument()
    expect(mocked.createCheckout).not.toHaveBeenCalled()

    await userEvent.setup().click(screen.getAllByRole('button', { name: /activar mes gratuito/i })[0])

    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    expect(mocked.createCheckout).not.toHaveBeenCalled()
  })

  it('oculta la invitación de bienvenida si ya tiene prueba activa', async () => {
    mocked.getBillingOverview.mockResolvedValue(
      makeOverview({
        trial: { startsAt: '2026-10-01T00:00:00.000Z', endsAt: '2026-10-15T00:00:00.000Z' },
      }),
    )

    renderPage(['/?bienvenida=1'])

    await screen.findByText(/cobertura efectiva/i)
    expect(screen.queryByText(/bienvenido a aulabase/i)).not.toBeInTheDocument()
  })

  it('oculta la invitación de bienvenida si ya tiene cobertura vigente', async () => {
    mocked.getBillingOverview.mockResolvedValue(
      makeOverview({
        access: { allowed: true, reason: 'paid', until: '2026-11-15T00:00:00.000Z' },
      }),
    )

    renderPage(['/?bienvenida=1'])

    await screen.findByText(/cobertura efectiva/i)
    expect(screen.queryByText(/bienvenido a aulabase/i)).not.toBeInTheDocument()
  })

  it('indica con honestidad que la activación no está disponible si el módulo está apagado', async () => {
    mocked.getBillingOverview.mockResolvedValue(
      makeOverview({ enabled: false, access: { allowed: true, reason: 'legacy', until: null } }),
    )

    renderPage(['/?bienvenida=1'])

    expect(await screen.findAllByText(/la activación con tarjeta no está disponible/i)).not.toHaveLength(0)
    expect(screen.queryByRole('button', { name: /activar mes gratuito/i })).not.toBeInTheDocument()
    expect(mocked.createCheckout).not.toHaveBeenCalled()
  })

  it('no repite el verde de un pago confirmado sin consentimiento', async () => {
    const user = userEvent.setup()
    mocked.getBillingOverview.mockResolvedValue(
      makeOverview({ checkoutEnabled: true, prices: [offerPrice] }),
    )
    mocked.createCheckout.mockResolvedValue({ url: null, status: 'ready' })

    renderPage()

    await user.click((await screen.findAllByRole('button', { name: /activar mes gratuito/i }))[0])
    const dialog = await screen.findByRole('dialog')
    expect(dialog).toBeInTheDocument()

    // Sin marcar el consentimiento el diálogo no permite continuar.
    expect(within(dialog).getByRole('button', { name: /activar mes gratuito/i })).toBeDisabled()
    await waitFor(() => expect(mocked.createCheckout).not.toHaveBeenCalled())
  })
})
