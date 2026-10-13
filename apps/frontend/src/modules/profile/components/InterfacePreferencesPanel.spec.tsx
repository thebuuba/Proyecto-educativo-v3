import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useReducedMotion } from '@/hooks/useInterfacePreferences'
import { InterfacePreferencesPanel } from './InterfacePreferencesPanel'

beforeEach(() => {
  localStorage.clear()
  vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener() {}, removeEventListener() {} }))
})
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals() })

function MotionConsumer() {
  return <output aria-label="Movimiento efectivo">{useReducedMotion() ? 'reducido' : 'normal'}</output>
}

describe('preferencias de interfaz', () => {
  it('guarda el menú y sincroniza dos paneles abiertos y la próxima visita', () => {
    const { unmount } = render(<><InterfacePreferencesPanel /><InterfacePreferencesPanel /></>)
    fireEvent.click(screen.getAllByRole('checkbox', { name: 'Menú lateral expandido' })[0])
    expect(localStorage.getItem('aulabase:sidebar-expanded')).toBe('true')
    expect(screen.getAllByRole('checkbox', { name: 'Menú lateral expandido' })[1]).toBeChecked()
    unmount()
    render(<InterfacePreferencesPanel />)
    expect(screen.getByRole('checkbox', { name: 'Menú lateral expandido' })).toBeChecked()
  })

  it('reduce movimiento desde el control y mantiene la restricción del sistema operativo', () => {
    render(<><InterfacePreferencesPanel /><MotionConsumer /></>)
    fireEvent.click(screen.getByRole('checkbox', { name: 'Reducir animaciones' }))
    expect(localStorage.getItem('aulabase:reduced-motion')).toBe('true')
    expect(screen.getByLabelText('Movimiento efectivo')).toHaveTextContent('reducido')
    vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener() {}, removeEventListener() {} }))
    fireEvent.click(screen.getByRole('checkbox', { name: 'Reducir animaciones' }))
    expect(screen.getByRole('checkbox', { name: 'Reducir animaciones' })).not.toBeChecked()
    expect(screen.getByLabelText('Movimiento efectivo')).toHaveTextContent('reducido')
  })

  it('actualiza movimiento cuando cambia la preferencia del sistema', () => {
    let reduced = false
    const callbacks = new Set<() => void>()
    vi.stubGlobal('matchMedia', () => ({
      get matches() { return reduced },
      addEventListener: (_: string, callback: () => void) => callbacks.add(callback),
      removeEventListener: (_: string, callback: () => void) => callbacks.delete(callback),
    }))
    render(<MotionConsumer />)
    expect(screen.getByLabelText('Movimiento efectivo')).toHaveTextContent('normal')
    act(() => { reduced = true; callbacks.forEach((callback) => callback()) })
    expect(screen.getByLabelText('Movimiento efectivo')).toHaveTextContent('reducido')
  })

  it('informa un error de almacenamiento sin afirmar que guardó el cambio', () => {
    render(<InterfacePreferencesPanel />)
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked') })
    fireEvent.click(screen.getByRole('checkbox', { name: 'Menú lateral expandido' }))
    expect(screen.getByRole('alert')).toHaveTextContent('No se pudo guardar')
    expect(screen.getByRole('checkbox', { name: 'Menú lateral expandido' })).not.toBeChecked()
  })
})
