import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SchoolAdministrationPage } from './SchoolAdministrationPage'

const state = vi.hoisted(() => {
  const baseProfile = {
    id: 'school-1', name: 'Centro Aula', slug: 'centro-aula', sector: 'public', schoolShift: 'extended',
    primaryModality: 'general', enabledSubsystems: ['regular'], officialExportsEnabled: false, updatedAt: '2026-01-01',
  }
  return {
    baseProfile,
    profile: baseProfile as typeof baseProfile | null,
    schoolYears: [
      { id: 'future', name: '2027-2028', startDate: '2027-08-25', endDate: '2028-06-20', isCurrent: false, status: 'active' },
      { id: 'current', name: '2026-2027', startDate: '2026-08-25', endDate: '2027-06-20', isCurrent: true, status: 'active' },
    ],
    academicPeriods: [] as { id: string; name: string; sequence: number; startDate: string; endDate: string }[],
    loading: false, error: null as string | null,
    refetch: vi.fn(), saveProfile: vi.fn(), addSchoolYear: vi.fn(), editSchoolYear: vi.fn(), activateSchoolYear: vi.fn(),
  }
})

const auth = vi.hoisted(() => ({ canManage: true }))

vi.mock('@/modules/school-administration/hooks/useSchoolAdministration', () => ({ useSchoolAdministration: () => state }))
vi.mock('@/modules/auth/hooks/useAuth', () => ({ useAuth: () => ({
  appUser: { id: 'user-1', schoolId: 'school-1', fullName: 'Ana Pérez', email: 'ana@example.test', status: 'active' },
  roles: [], hasRole: () => auth.canManage, refreshAuth: vi.fn(),
}) }))
vi.mock('@/modules/billing/pages/BillingPage', () => ({
  BillingPage: ({ embedded }: { embedded?: boolean } = {}) => (
    <div data-testid="billing-page">{embedded ? 'Suscripción integrada (embedded)' : 'Suscripción integrada'}</div>
  ),
}))
vi.mock('@/services/apiClient', async (importOriginal) => ({
  ...await importOriginal<typeof import('@/services/apiClient')>(),
  api: { get: vi.fn().mockResolvedValue([]), patch: vi.fn(), post: vi.fn() },
}))

beforeEach(() => {
  auth.canManage = true
  state.profile = { ...state.baseProfile }
  state.loading = false
  state.error = null
  vi.clearAllMocks()
})

afterEach(() => {
  auth.canManage = true
  state.profile = { ...state.baseProfile }
  state.loading = false
  state.error = null
})

describe('panel general de configuración', () => {
  it('reúne centro, usuarios, cuenta y accesos funcionales sin perder el formulario al cambiar de categoría', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter initialEntries={['/configuracion']}><SchoolAdministrationPage /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: 'Configuración' })).toBeInTheDocument()
    const name = screen.getByLabelText(/Nombre de la institución/)
    await user.clear(name)
    await user.type(name, 'Nombre en edición')
    await user.click(screen.getByRole('button', { name: 'Módulos' }))
    expect(screen.getByRole('link', { name: 'Configurar Inicio' })).toHaveAttribute('href', '/inicio?ajustes=widgets')
    expect(screen.getByRole('link', { name: 'Configurar Evaluación' })).toHaveAttribute('href', '/calificaciones?ajustes=calculo')
    await user.click(screen.getByRole('button', { name: 'Centro educativo' }))
    expect(screen.getByLabelText(/Nombre de la institución/)).toHaveValue('Nombre en edición')
    await user.click(screen.getByRole('button', { name: 'Cuenta e interfaz' }))
    expect(screen.getByLabelText('Nombre completo')).toHaveValue('Ana Pérez')
    expect(screen.getByRole('heading', { name: 'Preferencias de interfaz' })).toBeInTheDocument()
  })

  it('conserva el acceso antiguo al calendario y señala el año realmente activo', () => {
    render(<MemoryRouter initialEntries={['/configuracion#anos-escolares']}><SchoolAdministrationPage /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: 'Años escolares y calendario' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Calendario' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByText('2026-2027 activo')).toBeInTheDocument()
    expect(screen.queryByText('2027-2028 activo')).not.toBeInTheDocument()
  })

  it('abre la categoría de suscripción e inserta la página integrada', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter initialEntries={['/configuracion']}><SchoolAdministrationPage /></MemoryRouter>)
    await user.click(screen.getByRole('button', { name: 'Suscripción y pagos' }))
    expect(await screen.findByTestId('billing-page')).toHaveTextContent('Suscripción integrada (embedded)')
  })

  it('conserva el borrador del centro al entrar y volver de suscripción', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter initialEntries={['/configuracion']}><SchoolAdministrationPage /></MemoryRouter>)
    await user.clear(screen.getByLabelText(/Nombre de la institución/))
    await user.type(screen.getByLabelText(/Nombre de la institución/), 'Borrador')
    await user.click(screen.getByRole('button', {name:'Suscripción y pagos'}))
    expect(await screen.findByTestId('billing-page')).toBeInTheDocument()
    await user.click(screen.getByRole('button', {name:'Centro educativo'}))
    expect(screen.getByLabelText(/Nombre de la institución/)).toHaveValue('Borrador')
  })

  it('mantiene la suscripción operativa aunque los datos del centro estén cargando o fallen', async () => {
    state.loading = true
    state.profile = null
    state.error = 'No se pudieron cargar los datos de configuración.'
    render(
      <MemoryRouter initialEntries={['/configuracion?tab=suscripcion']}>
        <SchoolAdministrationPage />
      </MemoryRouter>,
    )
    expect(await screen.findByTestId('billing-page')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent('No se pudieron cargar los datos de configuración.')
    expect(screen.queryByText('Cargando configuración...')).not.toBeInTheDocument()
  })

  it('limita las categorías administrativas a los administradores y ofrece la suscripción al titular', async () => {
    auth.canManage = false
    render(<MemoryRouter initialEntries={['/configuracion']}><SchoolAdministrationPage /></MemoryRouter>)
    expect(await screen.findByTestId('billing-page')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Suscripción y pagos' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Centro educativo' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Calendario' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Usuarios' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Módulos' })).not.toBeInTheDocument()
  })
})
