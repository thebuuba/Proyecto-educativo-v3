import { useState } from 'react'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Sidebar } from './Sidebar'

const auth = vi.hoisted(() => ({ role: 'teacher', logout: vi.fn() }))
vi.mock('@/modules/auth/hooks/useAuth', () => ({
  useAuth: () => ({
    appUser: null,
    hasRole: (roles: string[]) => roles.includes(auth.role),
    logout: auth.logout,
  }),
}))

function Navigation() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)}>Abrir navegación</button>
      <Sidebar isOpen={open} isExpanded={false} onClose={() => setOpen(false)} />
    </>
  )
}

describe('Sidebar', () => {
  let viewport: EventTarget & { matches: boolean }

  beforeEach(() => {
    auth.role = 'teacher'
    vi.clearAllMocks()
    viewport = Object.assign(new EventTarget(), { matches: false })
    vi.stubGlobal('matchMedia', () => viewport)
  })

  afterEach(() => vi.unstubAllGlobals())

  it('permite cerrar el menú móvil con Escape y devuelve el foco al botón de apertura', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>,
    )
    const opener = screen.getByRole('button', { name: 'Abrir navegación' })
    await user.click(opener)
    expect(screen.getByRole('button', { name: 'Cerrar navegación' })).toHaveFocus()
    await user.tab({ shift: true })
    await user.tab({ shift: true })
    expect(screen.getByRole('button', { name: 'Cerrar sesión' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('link', { name: 'Aula Base, inicio' })).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(opener).toHaveFocus()
  })

  it('cierra el menú móvil al pasar a escritorio para evitar reabrirlo sin foco', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>,
    )
    const opener = screen.getByRole('button', { name: 'Abrir navegación' })
    await user.click(opener)
    act(() => {
      viewport.matches = true
      viewport.dispatchEvent(new Event('change'))
    })
    expect(opener).toHaveFocus()
  })

  it('conserva la selección en páginas internas y respeta los permisos de administración', () => {
    render(
      <MemoryRouter initialEntries={['/cursos/grupo-1']}>
        <Navigation />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: 'Cursos' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Configuración' })).toHaveAttribute('href', '/perfil')
    expect(screen.queryByRole('link', { name: 'Ajustes' })).not.toBeInTheDocument()
  })

  it('ofrece un único acceso a configuración para administradores', () => {
    auth.role = 'admin'
    render(<MemoryRouter initialEntries={['/configuracion']}><Navigation /></MemoryRouter>)
    const configuration = screen.getByRole('link', { name: 'Configuración' })
    expect(configuration).toHaveAttribute('href', '/configuracion')
    expect(configuration).toHaveAttribute('aria-current', 'page')
    expect(screen.queryByRole('link', { name: 'Ajustes' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Administración escolar' })).not.toBeInTheDocument()
  })
})
