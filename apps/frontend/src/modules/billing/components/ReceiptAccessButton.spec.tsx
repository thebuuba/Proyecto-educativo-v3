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
    const open = vi.spyOn(window, 'open').mockReturnValue(null)
    const url = 'https://test.supabase.co/storage/v1/object/sign/billing-receipts/a/b?token=x'
    mocked.getTransferReceipt.mockResolvedValue({ url, expiresIn: 60 })

    render(<ReceiptAccessButton transferId="tr-1" />)
    await user.click(screen.getByRole('button', { name: /ver comprobante/i }))

    expect(open).toHaveBeenCalledWith(url, '_blank', 'noopener,noreferrer')
  })

  it('no abre una dirección no autorizada y avisa', async () => {
    const user = userEvent.setup()
    const open = vi.spyOn(window, 'open').mockReturnValue(null)
    mocked.getTransferReceipt.mockResolvedValue({
      url: 'https://evil.example.com/storage/v1/object/sign/x',
      expiresIn: 60,
    })

    render(<ReceiptAccessButton transferId="tr-1" />)
    await user.click(screen.getByRole('button', { name: /ver comprobante/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/no autorizada/i)
    expect(open).not.toHaveBeenCalled()
  })

  it('muestra el error del servidor sin abrir nada', async () => {
    const user = userEvent.setup()
    const open = vi.spyOn(window, 'open').mockReturnValue(null)
    mocked.getTransferReceipt.mockRejectedValue(new Error('Comprobante no disponible.'))

    render(<ReceiptAccessButton transferId="tr-1" />)
    await user.click(screen.getByRole('button', { name: /ver comprobante/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Comprobante no disponible.')
    expect(open).not.toHaveBeenCalled()
  })
})
