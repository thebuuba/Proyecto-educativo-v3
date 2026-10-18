import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useBilling } from '@/modules/billing/hooks/useBilling'
import * as billingService from '@/modules/billing/services/billingService'
import type { BillingOverview, BillingPrice } from '@/modules/billing/types'
import { BillingSettingsPage } from './billing-settings-page'

vi.mock('@/modules/billing/hooks/useBilling', () => ({ useBilling: vi.fn() }))
vi.mock('@/modules/auth/hooks/useAuth', () => ({ useAuth: () => ({ appUser: null }) }))
vi.mock('@/modules/billing/services/billingService', async (original) => ({
  ...(await original<typeof billingService>()),
  createTransfer: vi.fn(),
  cancelRenewal: vi.fn(),
  openPortal: vi.fn(),
  createCheckout: vi.fn(),
}))

const price: BillingPrice = {
  id: 'card-authorized',
  label: 'Docente',
  amountMinor: 799,
  currency: 'USD',
  interval: 'month',
  mode: 'paddle',
}
const transferPrice: BillingPrice = { ...price, id: 'transfer-authorized', mode: 'manual' }
const refetch = vi.fn().mockResolvedValue(undefined)

function overview(changes: Partial<BillingOverview> = {}): BillingOverview {
  return {
    enabled: true,
    environment: 'sandbox',
    checkoutEnabled: true,
    eventsEnabled: true,
    access: { allowed: false, reason: 'none', until: null },
    trial: null,
    grants: [],
    payments: [],
    documents: [],
    transfers: [],
    subscriptions: [],
    prices: [price],
    offer: null,
    cases: [],
    notices: [],
    commercialAdmin: false,
    supportEmail: null,
    bankInstructions: null,
    termsVersion: '2026-10-01',
    serverNow: '2026-10-18T12:00:00Z',
    ...changes,
  }
}

function show(data = overview(), error: string | null = null) {
  vi.mocked(useBilling).mockReturnValue({ overview: data, loading: false, error, refetch })
  return render(
    <MemoryRouter>
      <BillingSettingsPage />
    </MemoryRouter>,
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('gestión de pagos integrada en Configuración', () => {
  it('conserva los registros, importes y cancelación programada publicados por el servidor', () => {
    show(
      overview({
        subscriptions: [
          {
            id: 'subscription-real',
            mode: 'paddle',
            providerStatus: 'active',
            currentPeriodEnd: '2026-11-15',
            cancelAtPeriodEnd: true,
          },
        ],
        documents: [
          {
            id: 'document-real',
            number: 'REC-REAL-1',
            type: 'receipt',
            issuedAt: '2026-10-15',
            amountMinor: 1234,
            currency: 'USD',
          },
        ],
        payments: [
          {
            id: 'payment-real',
            status: 'completed',
            createdAt: '2026-10-15',
            amountMinor: 1234,
            currency: 'USD',
          },
        ],
        prices: [{ ...price, label: 'Plan del servidor' }],
      }),
    )
    expect(screen.getByText('REC-REAL-1')).toBeInTheDocument()
    expect(screen.getAllByText('Pago payment-real').length).toBeGreaterThan(0)
    expect(screen.getByText('Plan del servidor')).toBeInTheDocument()
    expect(screen.getAllByText(/12\.34/).length).toBeGreaterThan(0)
    expect(screen.queryByText(/€/)).not.toBeInTheDocument()
    expect(screen.getByText('Cancelación programada al final del período')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Exportar documentos' })).toBeEnabled()
    fireEvent.click(screen.getByRole('button', { name: 'Detalles' }))
    expect(screen.getByText('Fin de cobertura')).toBeInTheDocument()
    expect(screen.queryByText('Próximo cobro')).not.toBeInTheDocument()
  })

  it('muestra el error de consulta sin reutilizar registros obsoletos ni permitir exportarlos', () => {
    show(
      overview({
        documents: [
          {
            id: 'document-real',
            number: 'REC-REAL-1',
            type: 'receipt',
            issuedAt: '2026-10-15',
            amountMinor: 1234,
            currency: 'USD',
          },
        ],
      }),
      'No se pudo consultar el servicio',
    )
    expect(screen.getByRole('alert')).toHaveTextContent('No se pudo consultar el servicio')
    expect(screen.queryByText('REC-REAL-1')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Exportar documentos' })).toBeDisabled()
  })

  it('conserva el estado real de renovación si el proveedor rechaza la cancelación', async () => {
    vi.mocked(billingService.cancelRenewal).mockRejectedValueOnce(
      new Error('El proveedor no respondió'),
    )
    show(
      overview({
        subscriptions: [
          {
            id: 'subscription-real',
            mode: 'paddle',
            providerStatus: 'active',
            currentPeriodEnd: '2026-11-15',
            cancelAtPeriodEnd: false,
          },
        ],
      }),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar renovación' }))
    expect(billingService.cancelRenewal).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'Sí, cancelar' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('El proveedor no respondió')
    expect(billingService.cancelRenewal).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('switch', { name: 'Renovación automática' })).toBeChecked()
  })
  it('abre el checkout autorizado desde la tarjeta sin iniciar un cobro ni aceptar condiciones', () => {
    show()
    fireEvent.click(screen.getByRole('button', { name: 'Activar mes gratuito' }))
    const dialog = screen.getByRole('dialog', { name: 'Activar mes gratuito' })
    expect(
      within(dialog)
        .getAllByRole('checkbox')
        .every((input) => !(input as HTMLInputElement).checked),
    ).toBe(true)
    expect(billingService.createCheckout).not.toHaveBeenCalled()
    expect(
      screen.queryByText('Gestionar los pagos de mi cuenta de AulaBase'),
    ).not.toBeInTheDocument()
  })

  it.each([
    { enabled: false },
    { checkoutEnabled: false },
    { eventsEnabled: false },
    { termsVersion: null },
    { prices: [{ ...price, amountMinor: 123 }] },
  ])('no ofrece checkout cuando el servidor no lo autoriza: %j', (changes) => {
    show(overview(changes))
    expect(screen.queryByRole('button', { name: 'Activar mes gratuito' })).not.toBeInTheDocument()
    expect(billingService.createCheckout).not.toHaveBeenCalled()
  })

  it('solicita la transferencia seleccionada desde su tarjeta y actualiza los datos', async () => {
    vi.mocked(billingService.createTransfer).mockResolvedValue({} as never)
    show(overview({ prices: [transferPrice], bankInstructions: 'Cuenta autorizada por AulaBase' }))
    fireEvent.click(screen.getByRole('button', { name: 'Solicitar transferencia' }))
    await waitFor(() =>
      expect(billingService.createTransfer).toHaveBeenCalledWith('transfer-authorized'),
    )
    await waitFor(() => expect(refetch).toHaveBeenCalledTimes(1))
    expect(await screen.findByRole('status')).toHaveTextContent('Solicitud de transferencia creada')
  })

  it('no solicita transferencias sin instrucciones bancarias', () => {
    show(overview({ prices: [transferPrice], bankInstructions: null }))
    expect(
      screen.queryByRole('button', { name: 'Solicitar transferencia' }),
    ).not.toBeInTheDocument()
    expect(billingService.createTransfer).not.toHaveBeenCalled()
  })

  it('confirma la cancelación antes de detener una renovación sin retirar cobertura', async () => {
    vi.mocked(billingService.cancelRenewal).mockResolvedValue({} as never)
    show(
      overview({
        subscriptions: [
          {
            id: 'subscription',
            mode: 'paddle',
            providerStatus: 'active',
            cancelAtPeriodEnd: false,
            currentPeriodEnd: '2026-11-18T12:00:00Z',
          },
        ],
      }),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar renovación' }))
    expect(billingService.cancelRenewal).not.toHaveBeenCalled()
    expect(screen.getByRole('dialog')).toHaveTextContent('La cobertura actual seguirá vigente')
    fireEvent.click(screen.getByRole('button', { name: 'Sí, cancelar' }))
    await waitFor(() => expect(billingService.cancelRenewal).toHaveBeenCalledTimes(1))
    expect(refetch).toHaveBeenCalledTimes(1)
  })

  it('rechaza un destino de portal que no pertenece al proveedor autorizado', async () => {
    vi.mocked(billingService.openPortal).mockResolvedValue({
      url: 'https://example.test/no-autorizado',
    })
    show(
      overview({
        subscriptions: [
          {
            id: 'subscription',
            mode: 'paddle',
            providerStatus: 'active',
            cancelAtPeriodEnd: false,
            currentPeriodEnd: null,
          },
        ],
      }),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Gestionar método de pago' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('dirección de portal no autorizada')
    expect(billingService.openPortal).toHaveBeenCalledTimes(1)
  })
})
