import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import { PromoPage } from './PromoPage'

vi.mock('@/modules/auth/hooks/useAuth', () => ({ useAuth: () => ({ isAuthenticated: false }) }))
vi.mock('../components/PromoLayout', () => ({ PromoLayout: ({ children }: { children: ReactNode }) => <main>{children}</main> }))
vi.mock('../components/ProductDemo', () => ({ ProductDemo: () => null }))

describe('recorrido comercial desde la portada', () => {
  it('explica precio, tarjeta y comienzo de la prueba antes del registro', () => {
    render(<MemoryRouter><PromoPage /></MemoryRouter>)
    expect(screen.getAllByText(/US\$7\.99/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/RD\$492\.81/).length).toBeGreaterThan(0)
    expect(screen.getByRole('link', { name: /ver precios y condiciones/i })).toHaveAttribute('href', '/precios')
    for (const link of screen.getAllByRole('link', { name: /^crear mi cuenta$/i })) expect(link).toHaveAttribute('href', '/registro')
    expect(screen.getByText(/la prueba comienza al completar el checkout con tarjeta/i)).toBeInTheDocument()
    expect(screen.queryByText(/importes están en proceso de definición/i)).not.toBeInTheDocument()
  })
})
