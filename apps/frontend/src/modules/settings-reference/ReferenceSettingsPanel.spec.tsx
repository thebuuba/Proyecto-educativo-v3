import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { ReferenceSettingsPanel } from './ReferenceSettingsPanel'

vi.mock('@/modules/auth/hooks/useAuth', () => ({ useAuth: () => ({ appUser: {id:'user-1'}, roles: [], refreshAuth: vi.fn() }) }))

vi.mock('./services/profileSettingsService', () => ({ getOwnProfileSettings: vi.fn().mockResolvedValue({
  id: 'user-1', fullName: 'Ana P?rez', email: 'ana@example.test', phone: null, avatarUrl: null,
  createdAt: '2026-01-01T00:00:00Z', roles: ['teacher'], institution: 'Centro Aula', academicIdentifier: null,
  preferences: { publicName:null, bio:null, birthDate:null, country:null, city:null, educationLevel:null, language:'es', timezone:'UTC', interests:[] },
  stats: [], completeness: 10,
}), updateOwnProfileSettings: vi.fn(), uploadOwnAvatar: vi.fn(), removeOwnAvatar: vi.fn() }))

describe('copia completa del diseño de ajustes', () => {
  it('conserva planes, indicadores, facturas, métodos, preferencias y actividad', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <ReferenceSettingsPanel section="suscripcion" />
      </MemoryRouter>,
    )
    for (const name of [
      'Pagos y suscripciones',
      'Historial de facturas',
      'Planes de suscripción',
      'Métodos de pago',
      'Preferencias de suscripción',
      'Actividad',
    ]) {
      expect(screen.getByRole('heading', { name })).toBeInTheDocument()
    }
    expect(screen.getByText('Cursos activos')).toBeInTheDocument()
    expect(screen.getByText('Certificados')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Fallidas/ }))
    expect(screen.getByText('FAC-2025-0541')).toBeInTheDocument()
    expect(screen.queryByText('FAC-2025-0612')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Descartar aviso' }))
    expect(screen.queryByText(/No pudimos procesar tu pago/)).not.toBeInTheDocument()
  })

  it('conserva los campos del perfil y las selecciones académicas de la referencia', async () => {
    render(
      <MemoryRouter>
        <ReferenceSettingsPanel section="cuenta" />
      </MemoryRouter>,
    )
    await screen.findByLabelText('Nombre completo')
    for (const name of [
      'Nombre completo',
      'Nombre público',
      'Correo electrónico',
      'Teléfono',
      'Fecha de nacimiento',
      'Ciudad',
      'Biografía',
    ]) {
      expect(screen.getByLabelText(name, { exact: true })).toBeInTheDocument()
    }
    expect(screen.getByRole('heading', { name: 'Perfil académico' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Diseño UX' })).toBeEnabled()
    for (const name of ['País', 'Nivel educativo', 'Idioma de la plataforma', 'Zona horaria']) {
      expect(screen.getByRole('combobox', { name })).toBeInTheDocument()
    }
  })

  it('mantiene la matriz de canales y permite cambiar las selecciones del prototipo', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <ReferenceSettingsPanel section="notificaciones" />
      </MemoryRouter>,
    )
    const control = screen.getByRole('switch', { name: 'Clases en vivo por Email' })
    expect(control).toBeChecked()
    await user.click(control)
    expect(control).not.toBeChecked()
    expect(screen.getByRole('heading', { name: 'Modo no molestar' })).toBeInTheDocument()
    expect(
      within(screen.getByRole('navigation', { name: 'Secciones de ajustes' })).getAllByRole('link'),
    ).toHaveLength(5)
  })
})
