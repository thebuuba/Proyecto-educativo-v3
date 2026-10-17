import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ReceiptAccessButton } from '@/modules/billing/components/ReceiptAccessButton'
import * as billingService from '@/modules/billing/services/billingService'

vi.mock('@/modules/billing/services/billingService', () => ({
  getTransferReceipt: vi.fn(),
}))

const mocked = vi.mocked(billingService)

beforeEach(() => {
  vi.resetAllMocks()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('ReceiptAccessButton', () => {
  it('abre solo un enlace firmado del almacenamiento privado', async () => {
    const user = userEvent.setup()
    const popup = { opener: window, location: { replace: vi.fn() }, close: vi.fn() }
    const open = vi.spyOn(window, 'open').mockReturnValue(popup as unknown as Window)
    const url = 'https://test.supabase.co/storage/v1/object/sign/billing-receipts/a/b?token=x'
    mocked.getTransferReceipt.mockImplementation(async () => {
      expect(open).toHaveBeenCalledWith('about:blank', '_blank')
      expect(popup.opener).toBeNull()
      return { url, expiresIn: 60 }
    })

    render(<ReceiptAccessButton transferId="tr-1" />)
    await user.click(screen.getByRole('button', { name: /ver comprobante/i }))

    expect(open).toHaveBeenCalledWith('about:blank', '_blank')
    expect(popup.opener).toBeNull()
    expect(popup.location.replace).toHaveBeenCalledWith(url)
  })

  it('no abre una dirección no autorizada y avisa', async () => {
    const user = userEvent.setup()
    const popup = { opener: window, location: { replace: vi.fn() }, close: vi.fn() }
    vi.spyOn(window, 'open').mockReturnValue(popup as unknown as Window)
    mocked.getTransferReceipt.mockResolvedValue({
      url: 'https://evil.example.com/storage/v1/object/sign/x',
      expiresIn: 60,
    })

    render(<ReceiptAccessButton transferId="tr-1" />)
    await user.click(screen.getByRole('button', { name: /ver comprobante/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/no autorizada/i)
    expect(popup.close).toHaveBeenCalled()
    expect(popup.location.replace).not.toHaveBeenCalled()
  })

  it('muestra el error del servidor sin abrir nada', async () => {
    const user = userEvent.setup()
    const popup = { opener: window, location: { replace: vi.fn() }, close: vi.fn() }
    vi.spyOn(window, 'open').mockReturnValue(popup as unknown as Window)
    mocked.getTransferReceipt.mockRejectedValue(new Error('Comprobante no disponible.'))

    render(<ReceiptAccessButton transferId="tr-1" />)
    await user.click(screen.getByRole('button', { name: /ver comprobante/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Comprobante no disponible.')
    expect(popup.close).toHaveBeenCalled()
    expect(popup.location.replace).not.toHaveBeenCalled()
  })

  it('abre la pestaña antes de esperar la respuesta y avisa si el navegador la bloquea', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'open').mockReturnValue(null)
    render(<ReceiptAccessButton transferId="tr-1" />)
    await user.click(screen.getByRole('button', { name: /ver comprobante/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent(/permite.*ventanas/i)
    expect(mocked.getTransferReceipt).not.toHaveBeenCalled()
  })
})
