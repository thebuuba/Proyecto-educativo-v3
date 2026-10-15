import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import { PricingPage } from './PricingPage'
vi.mock('../components/PromoLayout', () => ({ PromoLayout: ({ children }: { children: ReactNode }) => <main>{children}</main> }))
describe('public individual monthly offering', () => {
  it('shows the approved monthly offer with card and DOP reference, without pending promises', () => {
    render(<MemoryRouter><PricingPage /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: 'Docente Completo' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /anual/i })).not.toBeInTheDocument()
    expect(screen.getAllByText(/US\$7\.99/).length).toBeGreaterThan(0)
    expect(screen.getByText(/primer mes gratis con tarjeta/i)).toBeInTheDocument()
    expect(screen.getByText(/61\.6788/)).toBeInTheDocument()
    expect(screen.getByText(/14 oct 2026/)).toBeInTheDocument()
    expect(screen.queryByText(/pendientes de aprobación/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/14 días/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/sin tarjeta/i)).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /gestionar mi suscripción/i })).toHaveAttribute('href', '/cuenta/suscripcion')
  })
})
