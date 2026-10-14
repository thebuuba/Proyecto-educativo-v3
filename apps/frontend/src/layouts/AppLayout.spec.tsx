import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom'
import type { ReactNode } from 'react'

import { AppLayout } from './AppLayout'

vi.mock('@/modules/onboarding/GuidedTourProvider', () => ({ GuidedTourProvider: ({ children }: { children: ReactNode }) => children }))
vi.mock('@/components/navigation/Sidebar', () => ({ Sidebar: () => <nav><Link to="/cursos">Cursos</Link><Link to="/cursos?state=active">Filtrar cursos</Link></nav> }))
vi.mock('@/components/navigation/Header', () => ({ Header: () => <header>Encabezado</header> }))

afterEach(() => vi.restoreAllMocks())

describe('posición inicial de las pantallas', () => {
  it('vuelve arriba al cambiar de módulo y conserva la posición al filtrar la misma pantalla', async () => {
    const scroll = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const user = userEvent.setup()
    render(<MemoryRouter initialEntries={['/inicio']}><Routes><Route element={<AppLayout />}>
      <Route path="inicio" element={<h1>Inicio</h1>} />
      <Route path="cursos" element={<h1>Mis cursos</h1>} />
    </Route></Routes></MemoryRouter>)
    scroll.mockClear()
    await user.click(screen.getByRole('link', { name: 'Cursos' }))
    expect(screen.getByRole('heading', { name: 'Mis cursos' })).toBeInTheDocument()
    expect(scroll).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'instant' })
    scroll.mockClear()
    await user.click(screen.getByRole('link', { name: 'Filtrar cursos' }))
    expect(scroll).not.toHaveBeenCalled()
  })
})
