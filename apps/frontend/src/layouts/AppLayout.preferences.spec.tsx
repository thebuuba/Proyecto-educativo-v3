import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import type { ReactNode } from 'react'

import { AppLayout } from './AppLayout'
import { InterfacePreferencesPanel } from '@/modules/profile/components/InterfacePreferencesPanel'

vi.mock('@/modules/onboarding/GuidedTourProvider', () => ({ GuidedTourProvider: ({ children }: { children: ReactNode }) => children }))
vi.mock('@/components/navigation/Sidebar', () => ({ Sidebar: () => <nav>Menú</nav> }))
vi.mock('@/components/navigation/Header', () => ({ Header: ({ onToggleSidebar }: { onToggleSidebar: () => void }) => <button onClick={onToggleSidebar}>Alternar menú</button> }))

beforeEach(() => {
  localStorage.clear()
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener() {}, removeEventListener() {} }))
})
afterEach(() => {
  cleanup()
  delete document.documentElement.dataset.reducedMotion
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function renderLayout(preferences = false) {
  return render(<MemoryRouter><Routes><Route element={<AppLayout />}><Route path="/" element={<><h1>Inicio</h1>{preferences ? <InterfacePreferencesPanel /> : null}</>} /></Route></Routes></MemoryRouter>)
}

describe('preferencias aplicadas al layout', () => {
  it('aplica el control al layout y refleja el botón del encabezado en el panel', () => {
    const { container } = renderLayout(true)
    fireEvent.click(screen.getByRole('checkbox', { name: 'Menú lateral expandido' }))
    expect(container.querySelector('.sidebar-workspace')).toHaveClass('lg:pl-[256px]')
    fireEvent.click(screen.getByRole('button', { name: 'Alternar menú' }))
    expect(container.querySelector('.sidebar-workspace')).toHaveClass('lg:pl-20')
    expect(screen.getByRole('checkbox', { name: 'Menú lateral expandido' })).not.toBeChecked()
    expect(localStorage.getItem('aulabase:sidebar-expanded')).toBe('false')
    fireEvent.click(screen.getByRole('checkbox', { name: 'Reducir animaciones' }))
    expect(document.documentElement).toHaveAttribute('data-reduced-motion', 'true')
  })

  it('sincroniza el ancho del menú cuando otra pestaña cambia la preferencia', () => {
    const { container } = renderLayout()
    expect(container.querySelector('.sidebar-workspace')).toHaveClass('lg:pl-20')
    act(() => {
      localStorage.setItem('aulabase:sidebar-expanded', 'true')
      window.dispatchEvent(new StorageEvent('storage', { key: 'aulabase:sidebar-expanded', newValue: 'true', storageArea: localStorage }))
    })
    expect(container.querySelector('.sidebar-workspace')).toHaveClass('lg:pl-[256px]')
  })

  it('aplica una preferencia de movimiento guardada y la actualización entre pestañas', () => {
    localStorage.setItem('aulabase:reduced-motion', 'true')
    renderLayout()
    expect(document.documentElement).toHaveAttribute('data-reduced-motion', 'true')
    act(() => {
      localStorage.removeItem('aulabase:reduced-motion')
      window.dispatchEvent(new StorageEvent('storage', { key: null, storageArea: localStorage }))
    })
    expect(document.documentElement).toHaveAttribute('data-reduced-motion', 'false')
    expect(screen.getByRole('heading', { name: 'Inicio' })).toBeInTheDocument()
  })
})
