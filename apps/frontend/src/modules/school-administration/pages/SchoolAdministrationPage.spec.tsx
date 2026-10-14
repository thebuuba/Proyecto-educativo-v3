import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { SchoolAdministrationPage } from './SchoolAdministrationPage'

const state = vi.hoisted(() => ({
  profile: { id: 'school-1', name: 'Centro Aula', slug: 'centro-aula', sector: 'public', schoolShift: 'extended',
    primaryModality: 'general', enabledSubsystems: ['regular'], officialExportsEnabled: false, updatedAt: '2026-01-01' },
  schoolYears: [
    { id: 'future', name: '2027-2028', startDate: '2027-08-25', endDate: '2028-06-20', isCurrent: false, status: 'active' },
    { id: 'current', name: '2026-2027', startDate: '2026-08-25', endDate: '2027-06-20', isCurrent: true, status: 'active' },
  ],
  academicPeriods: [], loading: false, error: null,
  refetch: vi.fn(), saveProfile: vi.fn(), addSchoolYear: vi.fn(), editSchoolYear: vi.fn(), activateSchoolYear: vi.fn(),
}))
vi.mock('@/modules/school-administration/hooks/useSchoolAdministration', () => ({ useSchoolAdministration: () => state }))
vi.mock('@/modules/auth/hooks/useAuth', () => ({ useAuth: () => ({
  appUser: { id: 'user-1', schoolId: 'school-1', fullName: 'Ana Pérez', email: 'ana@example.test', status: 'active' },
  roles: [], hasRole: () => true, refreshAuth: vi.fn(),
}) }))
vi.mock('@/services/apiClient', async (importOriginal) => ({
  ...await importOriginal<typeof import('@/services/apiClient')>(),
  api: { get: vi.fn().mockResolvedValue([]), patch: vi.fn(), post: vi.fn() },
}))

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
})
