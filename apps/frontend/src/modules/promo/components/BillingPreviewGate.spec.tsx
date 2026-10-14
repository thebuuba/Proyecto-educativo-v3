import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { billingPreviewAllowed } from '@/config/billing-preview'
import { BillingPreviewGate } from './BillingPreviewGate'

vi.mock('@/config/billing-preview', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/config/billing-preview')>()),
  billingPreviewEnabled: false,
}))

describe('simulaciones de facturación', () => {
  it('ni una bandera activada permite simular pagos en producción', () => {
    expect(billingPreviewAllowed(false, 'true')).toBe(false)
    expect(billingPreviewAllowed(true, undefined)).toBe(false)
    expect(billingPreviewAllowed(true, 'true')).toBe(true)
  })
  it('redirige un supuesto pago aprobado a la página informativa', () => {
    render(<MemoryRouter initialEntries={['/contratar/estado/aprobado']}><Routes>
      <Route path="/contratar/estado/:estado" element={<BillingPreviewGate><p>Pago aprobado</p></BillingPreviewGate>} />
      <Route path="/precios" element={<p>Información de planes</p>} />
    </Routes></MemoryRouter>)
    expect(screen.getByText('Información de planes')).toBeInTheDocument()
    expect(screen.queryByText('Pago aprobado')).not.toBeInTheDocument()
  })
})
