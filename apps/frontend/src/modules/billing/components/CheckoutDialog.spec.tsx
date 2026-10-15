import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createCheckout } from '@/modules/billing/services/billingService'
import type { BillingOffer, BillingPrice } from '@/modules/billing/types'
import { CheckoutDialog } from './CheckoutDialog'

vi.mock('@/modules/billing/services/billingService', () => ({
  createCheckout: vi.fn(),
}))

const mockedCreateCheckout = vi.mocked(createCheckout)

const price: BillingPrice = {
  id: 'price-paddle',
  label: 'Docente Completo',
  amountMinor: 599,
  currency: 'USD',
  interval: 'month',
  mode: 'paddle',
}

const offer: BillingOffer = {
  amountMinor: 599,
  currency: 'USD',
  interval: 'month',
  intervalCount: 1,
  trial: { interval: 'month', intervalCount: 1, requiresCard: true },
  dopReference: { rate: 61.6788, date: '2026-10-14', sourceUrl: 'https://bancentral.gov.do/' },
}

function renderDialog(overrides: Partial<Parameters<typeof CheckoutDialog>[0]> = {}) {
  return render(
    <CheckoutDialog
      price={price}
      offer={offer}
      trialActive={false}
      environment="sandbox"
      termsVersion="2026-10-01"
      onClose={vi.fn()}
      {...overrides}
    />,
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('CheckoutDialog', () => {
  it('no preselecciona el consentimiento y exige renovación y condiciones', async () => {
    const user = userEvent.setup()
    mockedCreateCheckout.mockResolvedValue({ url: null, status: 'ready' })

    renderDialog()

    const renewal = screen.getByLabelText(/renovación automática/i)
    const conditions = screen.getByLabelText(/acepto las condiciones/i)
    expect(renewal).not.toBeChecked()
    expect(conditions).not.toBeChecked()

    const confirm = screen.getByRole('button', { name: /activar mes gratuito/i })
    expect(confirm).toBeDisabled()

    await user.click(renewal)
    expect(confirm).toBeDisabled()

    await user.click(conditions)
    expect(confirm).toBeEnabled()

    await user.click(confirm)

    expect(createCheckout).toHaveBeenCalledWith({
      priceId: 'price-paddle',
      acceptAutoRenewal: true,
      acceptEarlyEnd: false,
      termsVersion: '2026-10-01',
    })
  })

  it('explica el cargo cero hoy, el primer cobro al mes y la cancelación previa', () => {
    renderDialog()

    expect(screen.getByText(/hoy no se cobra/i)).toBeInTheDocument()
    expect(screen.getByText(/el primer cobro se hará al completar el mes/i)).toBeInTheDocument()
    expect(screen.getAllByText(/US\$5\.99/).length).toBeGreaterThan(0)
    expect(screen.getByText(/si cancelas antes de esa fecha/i)).toBeInTheDocument()
    expect(screen.getByText(/61\.6788/)).toBeInTheDocument()
  })

  it('rechaza una dirección de pago no autorizada sin abandonar la aplicación', async () => {
    const user = userEvent.setup()
    mockedCreateCheckout.mockResolvedValue({
      url: 'https://evil.example.com/checkout',
      status: 'ready',
    })

    renderDialog()

    await user.click(screen.getByLabelText(/renovación automática/i))
    await user.click(screen.getByLabelText(/acepto las condiciones/i))
    await user.click(screen.getByRole('button', { name: /activar mes gratuito/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/no autorizada/i)
  })
})
