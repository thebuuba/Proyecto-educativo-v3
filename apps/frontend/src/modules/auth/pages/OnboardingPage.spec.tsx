import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { OnboardingPage, resolveCurrentSchoolYear } from './OnboardingPage'
import type { SchoolResult } from '@/modules/auth/components/SchoolSearchInput'

const completeOnboarding = vi.hoisted(() => vi.fn())
const school = vi.hoisted(() => ({
  id: 'school-directory-id',
  name: 'Católico Cardenal Beras',
  slug: 'catolico-cardenal-beras',
  sector: 'public',
  district: 'Distrito Educativo 06-01',
  centerCode: '01234',
  niveles: ['primary', 'secondary'],
  tandas: ['morning', 'afternoon'],
  modalidades: ['regular'],
  schoolYearName: '2026-2027',
  schoolYearStartDate: '2026-07-01',
  schoolYearEndDate: '2027-06-30',
}))

vi.mock('@/modules/auth/hooks/useAuth', () => ({
  useAuth: () => ({ appUser: null, completeOnboarding, isAuthenticated: false, loading: false, profileRequired: true, onboardingComplete: false }),
}))
vi.mock('@/modules/auth/services/supabaseClient', () => ({ supabase: { auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) } } }))
vi.mock('@/modules/auth/components/SchoolSearchInput', () => ({
  SchoolSearchInput: ({ onSelect, error }: { onSelect: (school: SchoolResult) => void; error?: string }) => <div><button type="button" onClick={() => onSelect(school)}>Seleccionar centro de prueba</button>{error ? <p>{error}</p> : null}</div>,
}))

function renderPage() {
  return render(<MemoryRouter initialEntries={['/onboarding']}><OnboardingPage /></MemoryRouter>)
}

function reachConfirmation() {
  fireEvent.click(screen.getByRole('button', { name: 'Seleccionar centro de prueba' }))
  fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))
  fireEvent.click(screen.getByRole('button', { name: 'Secundaria' }))
  fireEvent.click(screen.getByRole('button', { name: 'Matutina' }))
  fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))
}

describe('OnboardingPage', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('aulabase:registration-name', 'Alexauris Diaz Diaz')
    completeOnboarding.mockReset().mockResolvedValue({})
  })

  it('preloads the registration name instead of asking for an empty field', () => {
    renderPage()
    expect(screen.getByText('Alexauris Diaz Diaz')).toBeInTheDocument()
    expect(screen.queryByPlaceholderText('Tu nombre completo')).not.toBeInTheDocument()
  })

  it('resolves the current school year dynamically and exposes no future year in the normal flow', () => {
    const current = resolveCurrentSchoolYear(new Date('2026-09-25T12:00:00'))
    expect(current.name).toBe('2026-2027')
    renderPage()
    expect(screen.getByText(current.name.replace('-', '–'))).toBeInTheDocument()
    expect(screen.queryByText('2027–2028')).not.toBeInTheDocument()
  })

  it('shows the previous year only through the advanced historical action', () => {
    renderPage()
    expect(screen.queryByText('2025–2026')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /¿necesitas trabajar/i }))
    expect(screen.getByRole('button', { name: '2025–2026' })).toBeInTheDocument()
  })

  it('requires selecting a real center result and then confirms its unique identity', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))
    expect(screen.getByText(/selecciona un centro de la lista/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Seleccionar centro de prueba' }))
    expect(screen.getByText('Centro seleccionado')).toBeInTheDocument()
    expect(screen.getByText(/código 01234/i)).toBeInTheDocument()
  })

  it('separates center offer from teacher context and only shows valid options', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Seleccionar centro de prueba' }))
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))
    expect(screen.getByText('Oferta del centro')).toBeInTheDocument()
    expect(screen.getByText('Tu espacio de trabajo')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Nocturna' })).not.toBeInTheDocument()
    expect(screen.getAllByText('Educación regular')).toHaveLength(2)
  })

  it('builds a confirmation summary and preserves data when returning', () => {
    renderPage()
    reachConfirmation()
    expect(screen.getByText('Revisa tu configuración')).toBeInTheDocument()
    expect(screen.getAllByText('Alexauris Diaz Diaz').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Católico Cardenal Beras').length).toBeGreaterThan(0)
    fireEvent.click(screen.getByRole('button', { name: /volver y editar/i }))
    expect(screen.getByRole('button', { name: 'Secundaria' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('submits the directory school id and teacher context only from step 3', async () => {
    renderPage()
    expect(screen.queryByRole('button', { name: 'Entrar a AulaBase' })).not.toBeInTheDocument()
    reachConfirmation()
    fireEvent.click(screen.getByRole('button', { name: 'Entrar a AulaBase' }))
    await waitFor(() => expect(completeOnboarding).toHaveBeenCalledWith(expect.objectContaining({
      school: { id: 'school-directory-id', name: 'Católico Cardenal Beras' },
      teacherContext: { levels: ['secondary'], shifts: ['morning'], modalities: ['regular'] },
    })))
  })

  it('shows a save error and allows retrying without losing the summary', async () => {
    completeOnboarding.mockRejectedValueOnce(new Error('Error temporal')).mockResolvedValueOnce({})
    renderPage()
    reachConfirmation()
    fireEvent.click(screen.getByRole('button', { name: 'Entrar a AulaBase' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Error temporal')
    expect(screen.getByText('Revisa tu configuración')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Entrar a AulaBase' }))
    await waitFor(() => expect(completeOnboarding).toHaveBeenCalledTimes(2))
  })
})
