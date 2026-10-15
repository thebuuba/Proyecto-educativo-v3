import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import { PricingPage } from './PricingPage'
vi.mock('../components/PromoLayout', () => ({ PromoLayout: ({ children }: { children: ReactNode }) => <main>{children}</main> }))
describe('public individual monthly offering', () => {
  it('shows only the agreed plan without offering annual or institutional purchases', () => {
    render(<MemoryRouter><PricingPage /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: 'Docente Completo' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /anual/i })).not.toBeInTheDocument()
    expect(screen.getByText(/importe y moneda pendientes de aprobación/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /gestionar mi suscripción/i })).toHaveAttribute('href', '/cuenta/suscripcion')
  })
})
