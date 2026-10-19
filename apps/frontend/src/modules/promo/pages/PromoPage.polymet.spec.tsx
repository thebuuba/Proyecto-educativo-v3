import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { PromoPage } from './PromoPage'

vi.mock('@/modules/auth/hooks/useAuth', () => ({ useAuth: () => ({ isAuthenticated: false }) }))

beforeEach(() => { vi.spyOn(window, 'scrollTo').mockImplementation(() => {}) })
afterEach(() => { vi.restoreAllMocks() })

describe('portada de Polymet integrada en AulaBase', () => {
  it('amplía la captura, permite cerrar con Escape y devuelve el foco', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><PromoPage /></MemoryRouter>)
    const trigger = screen.getByRole('button', { name: 'Ampliar captura del Inicio de AulaBase' })
    await user.click(trigger)
    const dialog = screen.getByRole('dialog', { name: 'Inicio de AulaBase' })
    expect(within(dialog).getByRole('img', { name: /vista ampliada/i })).toHaveAttribute('width', '1905')
    expect(within(dialog).getByRole('button', { name: 'Cerrar' })).toHaveFocus()
    expect(document.body.style.overflow).toBe('hidden')
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog', { name: 'Inicio de AulaBase' })).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
    expect(document.body.style.overflow).not.toBe('hidden')
  })

  it('vuelve al inicio al pulsar el logotipo desde una sección', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter initialEntries={['/#precio']}><PromoPage /></MemoryRouter>)
    await user.click(screen.getByRole('link', { name: 'Aula Base, inicio' }))
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
  })

  it('permite consultar los módulos sin salir de la portada', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><PromoPage /></MemoryRouter>)
    expect(screen.getByRole('heading', { level: 1, name: /tu aula, sin papeleo/i })).toBeVisible()
    await user.click(screen.getByRole('tab', { name: 'Horario' }))
    expect(screen.getByRole('tab', { name: 'Horario' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('heading', { name: 'Tu horario de clases, siempre visible' })).toBeVisible()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Diario y recursos' })).toHaveFocus()
    expect(screen.getByRole('heading', { name: 'Tu diario docente y tus recursos' })).toBeVisible()
  })

  it('dirige el registro y el inicio de sesión al sistema real', () => {
    render(<MemoryRouter><PromoPage /></MemoryRouter>)
    const header = screen.getByRole('banner')
    expect(within(header).getByRole('link', { name: 'Iniciar sesión' })).toHaveAttribute('href', '/login')
    expect(within(header).getByRole('link', { name: 'Probar gratis' })).toHaveAttribute('href', '/registro')
    expect(screen.getByRole('img', { name: /pantalla de inicio real de AulaBase/i })).toBeVisible()
    expect(screen.getByText(/captura del sistema real con datos de ejemplo/i)).toBeVisible()
  })

  it('permite cerrar el menú móvil con un control visible y devuelve el foco', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><PromoPage /></MemoryRouter>)
    const trigger = screen.getByRole('button', { name: 'Abrir menú' })
    await user.click(trigger)
    const dialog = screen.getByRole('dialog', { name: 'Menú' })
    const close = within(dialog).getByRole('button', { name: 'Cerrar menú' })
    expect(close).toHaveFocus()
    await user.click(close)
    expect(screen.queryByRole('dialog', { name: 'Menú' })).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('muestra una respuesta a la vez y permite cerrarla desde el teclado', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><PromoPage /></MemoryRouter>)
    const price = screen.getByRole('button', { name: '¿Cuánto cuesta Aula Base?' })
    const card = screen.getByRole('button', { name: '¿Necesito tarjeta para el mes gratis?' })
    expect(price).toHaveAttribute('aria-expanded', 'true')
    await user.click(card)
    expect(price).toHaveAttribute('aria-expanded', 'false')
    expect(card).toHaveAttribute('aria-expanded', 'true')
    await user.keyboard('{Enter}')
    expect(card).toHaveAttribute('aria-expanded', 'false')
  })
})
