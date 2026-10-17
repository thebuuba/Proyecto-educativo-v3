import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { ProfilePage } from './ProfilePage'

vi.mock('@/modules/auth/hooks/useAuth', () => ({ useAuth: () => ({ appUser: null }) }))

function CurrentLocation() {
  const { pathname, search } = useLocation()
  return <p>{pathname}{search}</p>
}

afterEach(cleanup)

describe('acceso al perfil', () => {
  it('redirige la ruta antigua al nuevo perfil de Ajustes', () => {
    render(<MemoryRouter initialEntries={['/perfil']}><Routes>
      <Route path="/perfil" element={<ProfilePage />} />
      <Route path="/configuracion" element={<CurrentLocation />} />
    </Routes></MemoryRouter>)
    expect(screen.getByText('/configuracion?tab=cuenta')).toBeInTheDocument()
    expect(screen.queryByText('URL de avatar')).not.toBeInTheDocument()
  })
})
