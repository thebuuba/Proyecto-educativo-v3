import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import { Header } from './Header'

vi.mock('@/modules/auth/hooks/useAuth', () => ({
  useAuth: () => ({ appUser: null, roles: [] }),
}))
vi.mock('@/services/schoolYearService', () => ({
  getCurrentSchoolYear: vi.fn().mockResolvedValue(null),
}))
vi.mock('@/services/apiClient', () => ({
  api: { get: vi.fn().mockResolvedValue([]) },
  API_CACHE_TTL: { sessionList: 60_000 },
  API_CACHE_TAGS: { academicPeriods: 'periods' },
}))

describe('Búsqueda de la cabecera', () => {
  it.each(['/inicio', '/cursos', '/calificaciones', '/planificaciones'])(
    'mantiene el mismo texto y el atajo en %s',
    async (route) => {
      const user = userEvent.setup()
      render(
        <MemoryRouter initialEntries={[route]}>
          <Header onOpenSidebar={vi.fn()} onToggleSidebar={vi.fn()} isSidebarExpanded />
        </MemoryRouter>,
      )
      const search = screen.getByRole('searchbox', {
        name: 'Buscar estudiantes, cursos, actividades',
      })
      expect(search).toHaveAttribute('placeholder', 'Buscar estudiantes, cursos, actividades...')
      expect(screen.queryByText('Ctrl + K')).not.toBeInTheDocument()
      await user.keyboard('{Control>}k{/Control}')
      expect(search).toHaveFocus()
    },
  )

  it('conserva el filtrado de Cursos desde la barra compartida', async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()
    window.addEventListener('courses:search', onSearch)
    try {
      render(
        <MemoryRouter initialEntries={['/cursos']}>
          <Header onOpenSidebar={vi.fn()} onToggleSidebar={vi.fn()} isSidebarExpanded />
        </MemoryRouter>,
      )
      await user.type(
        screen.getByRole('searchbox', { name: 'Buscar estudiantes, cursos, actividades' }),
        'Biología',
      )
      expect(onSearch).toHaveBeenLastCalledWith(expect.objectContaining({ detail: 'Biología' }))
    } finally {
      window.removeEventListener('courses:search', onSearch)
    }
  })
})
