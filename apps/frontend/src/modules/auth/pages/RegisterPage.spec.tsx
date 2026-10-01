import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RegisterPage } from './RegisterPage'
import { ConfirmEmailPage } from './ConfirmEmailPage'

const register = vi.hoisted(() => vi.fn())
vi.mock('@/modules/auth/hooks/useAuth', () => ({
  useAuth: () => ({ register, loginWithProvider: vi.fn(), isAuthenticated: false, profileRequired: false, onboardingComplete: false }),
}))

function renderPage() {
  return render(<MemoryRouter initialEntries={['/registro']}><Routes>
    <Route path="/registro" element={<RegisterPage />} />
    <Route path="/registro/confirma-correo" element={<ConfirmEmailPage />} />
    <Route path="/onboarding" element={<p>Configuración del centro</p>} />
  </Routes></MemoryRouter>)
}

function fillForm() {
  fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ana' } })
  fireEvent.change(screen.getByLabelText('Apellidos'), { target: { value: 'Pérez' } })
  fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'ana@example.com' } })
  fireEvent.change(screen.getByLabelText('Contraseña', { exact: true }), { target: { value: 'Clave1234' } })
  fireEvent.click(screen.getByRole('checkbox', { name: /Acepto los/ }))
}

describe('RegisterPage', () => {
  beforeEach(() => { register.mockReset(); sessionStorage.clear() })

  it('does not create an account with invalid fields or without consent', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))
    expect(register).not.toHaveBeenCalled()
    expect(screen.getByText(/Acepta los Términos/)).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre')).toHaveAttribute('aria-invalid', 'true')
  })

  it('opens confirmation with the actual email and no simulated verification', async () => {
    register.mockResolvedValue('confirmation-required')
    renderPage(); fillForm()
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))
    expect(await screen.findByRole('heading', { name: 'Revisa tu correo' })).toBeInTheDocument()
    expect(register).toHaveBeenCalledWith({ email: 'ana@example.com', password: 'Clave1234', fullName: 'Ana Pérez' })
    expect(screen.getByText('ana@example.com')).toBeInTheDocument()
    expect(screen.queryByText(/Simular/)).not.toBeInTheDocument()
  })

  it('continues directly to setup for an active session', async () => {
    register.mockResolvedValue('ready')
    renderPage(); fillForm()
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))
    expect(await screen.findByText('Configuración del centro')).toBeInTheDocument()
  })

  it('preserves entered fields when the registration fails', async () => {
    register.mockRejectedValue(new Error('Error temporal'))
    renderPage(); fillForm()
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Error temporal'))
    expect(screen.getByLabelText('Correo electrónico')).toHaveValue('ana@example.com')
    expect(screen.getByRole('button', { name: 'Crear cuenta' })).toBeEnabled()
  })
})
