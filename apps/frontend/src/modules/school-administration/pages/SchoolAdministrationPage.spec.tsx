import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SchoolAdministrationPage } from './SchoolAdministrationPage'

const state = vi.hoisted(() => {
  const baseProfile = {
    id: 'school-1',
    name: 'Centro Aula',
    slug: 'centro-aula',
    sector: 'public',
    schoolShift: 'extended',
    primaryModality: 'general',
    enabledSubsystems: ['regular'],
    officialExportsEnabled: false,
    updatedAt: '2026-01-01',
  }
  return {
    baseProfile,
    profile: baseProfile as typeof baseProfile | null,
    schoolYears: [
      {
        id: 'future',
        name: '2027-2028',
        startDate: '2027-08-25',
        endDate: '2028-06-20',
        isCurrent: false,
        status: 'active',
      },
      {
        id: 'current',
        name: '2026-2027',
        startDate: '2026-08-25',
        endDate: '2027-06-20',
        isCurrent: true,
        status: 'active',
      },
    ],
    academicPeriods: [] as {
      id: string
      name: string
      sequence: number
      startDate: string
      endDate: string
    }[],
    loading: false,
    error: null as string | null,
    refetch: vi.fn(),
    saveProfile: vi.fn(),
    addSchoolYear: vi.fn(),
    editSchoolYear: vi.fn(),
    activateSchoolYear: vi.fn(),
  }
})

vi.mock('@/modules/settings-reference/services/profileSettingsService', () => ({ getOwnProfileSettings: vi.fn().mockResolvedValue({
  id: 'user-1', fullName: 'Ana P?rez', email: 'ana@example.test', phone: null, avatarUrl: null,
  createdAt: '2026-01-01T00:00:00Z', roles: ['teacher'], institution: 'Centro Aula', academicIdentifier: null,
  preferences: { publicName:null, bio:null, birthDate:null, country:null, city:null, educationLevel:null, language:'es', timezone:'UTC', interests:[] },
  stats: [], completeness: 10,
}), updateOwnProfileSettings: vi.fn(), uploadOwnAvatar: vi.fn(), removeOwnAvatar: vi.fn() }))

const auth = vi.hoisted(() => ({ canManage: true }))
vi.mock('@/modules/billing/hooks/useBilling', () => ({useBilling: () => ({loading:false,error:null,refetch:vi.fn(),overview:{enabled:true,environment:'sandbox',access:{allowed:false,reason:'none',until:null},payments:[],documents:[],subscriptions:[],prices:[]}})}))
vi.mock('@/modules/auth/services/supabaseClient', () => ({supabase:{auth:{mfa:{listFactors:vi.fn().mockResolvedValue({data:{all:[]},error:null})}}}}))

vi.mock('@/modules/school-administration/hooks/useSchoolAdministration', () => ({
  useSchoolAdministration: () => state,
}))
vi.mock('@/modules/auth/hooks/useAuth', () => ({
  useAuth: () => ({
    appUser: {
      id: 'user-1',
      schoolId: 'school-1',
      fullName: 'Ana Pérez',
      email: 'ana@example.test',
      status: 'active',
    },
    roles: [],
    hasRole: () => auth.canManage,
    refreshAuth: vi.fn(),
  }),
}))
vi.mock('@/modules/billing/pages/BillingPage', () => ({
  BillingPage: ({ embedded }: { embedded?: boolean } = {}) => (
    <div data-testid="billing-page">
      {embedded ? 'Suscripción integrada (embedded)' : 'Suscripción integrada'}
    </div>
  ),
}))
vi.mock('@/services/apiClient', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/services/apiClient')>()),
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

describe('panel de ajustes con el diseño de referencia', () => {
  it('mantiene el borrador administrativo al recorrer los ajustes personales', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/configuracion?tab=centro']}>
        <SchoolAdministrationPage />
      </MemoryRouter>,
    )
    await user.clear(screen.getByLabelText(/Nombre de la institución/))
    await user.type(screen.getByLabelText(/Nombre de la institución/), 'Borrador del centro')
    await user.click(screen.getByRole('button', { name: 'Suscripción y pagos' }))
    expect(screen.getByRole('heading', { name: 'Planes de suscripción' })).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Centro educativo' }))
    expect(screen.getByLabelText(/Nombre de la institución/)).toHaveValue('Borrador del centro')
  })

  it('conserva el acceso antiguo al calendario', () => {
    render(
      <MemoryRouter initialEntries={['/configuracion#anos-escolares']}>
        <SchoolAdministrationPage />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: 'Años escolares y calendario' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Calendario' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(screen.getByText('2026-2027 activo')).toBeInTheDocument()
  })

  it('abre los cinco enlaces personales de la referencia y restringe administración', async () => {
    auth.canManage = false
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/configuracion']}>
        <SchoolAdministrationPage />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: 'Pagos y suscripciones' })).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Perfil' }))
    expect(await screen.findByLabelText('Nombre completo', { exact: true })).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Seguridad' }))
    expect(screen.getByRole('heading', { name: 'Dispositivos conectados' })).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Notificaciones' }))
    expect(screen.getByRole('heading', { name: 'Qué quieres recibir' })).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Privacidad' }))
    expect(screen.getByRole('button', { name: 'Eliminar mi cuenta' })).toBeDisabled()
    expect(screen.queryByRole('link', { name: 'Centro educativo' })).not.toBeInTheDocument()
  })

  it('conserva la gestión conectada de los pagos al abrirla expresamente', async () => {
    state.loading = true
    state.profile = null
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/configuracion?tab=suscripcion']}>
        <SchoolAdministrationPage />
      </MemoryRouter>,
    )
    expect(screen.queryByTestId('billing-page')).not.toBeInTheDocument()
    await user.click(screen.getByText('Gestionar los pagos de mi cuenta de AulaBase'))
    expect(await screen.findByTestId('billing-page')).toHaveTextContent(
      'Suscripción integrada (embedded)',
    )
  })
})
