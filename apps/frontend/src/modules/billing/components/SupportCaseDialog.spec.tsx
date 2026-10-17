import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { SupportCaseDialog } from '@/modules/billing/components/SupportCaseDialog'
import * as billingService from '@/modules/billing/services/billingService'

vi.mock('@/modules/billing/services/billingService', () => ({
  getSupportDetail: vi.fn(),
}))

const mocked = vi.mocked(billingService)

beforeEach(() => {
  vi.resetAllMocks()
})

describe('SupportCaseDialog', () => {
  it('muestra los mensajes públicos reales del caso', async () => {
    mocked.getSupportDetail.mockResolvedValue({
      case: {
        id: 'case-1',
        number: 'CAS-1',
        category: 'payment',
        status: 'open',
        createdAt: '2026-10-15T12:00:00.000Z',
      },
      messages: [
        { id: 'm-1', body: 'Escribí mi duda', authorType: 'user', createdAt: '2026-10-15T12:05:00.000Z' },
        { id: 'm-2', body: 'Ya lo revisamos', authorType: 'admin', createdAt: '2026-10-15T13:00:00.000Z' },
      ],
    })

    render(<SupportCaseDialog caseId="case-1" number="CAS-1" onClose={() => undefined} />)

    expect(await screen.findByText('Escribí mi duda')).toBeInTheDocument()
    expect(screen.getByText('Ya lo revisamos')).toBeInTheDocument()
    expect(screen.getByText('Soporte')).toBeInTheDocument()
  })

  it('informa el error del servidor sin inventar respuestas', async () => {
    mocked.getSupportDetail.mockRejectedValue(new Error('Caso no disponible.'))

    render(<SupportCaseDialog caseId="case-1" number="CAS-1" onClose={() => undefined} />)

    expect(await screen.findByRole('alert')).toHaveTextContent('Caso no disponible.')
    expect(screen.queryByText(/ya lo revisamos/i)).not.toBeInTheDocument()
  })
})
