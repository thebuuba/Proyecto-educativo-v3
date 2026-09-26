import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CreateSchoolDialog } from './CreateSchoolDialog'

const mocks = vi.hoisted(() => ({ post: vi.fn(), getSession: vi.fn() }))
vi.mock('@/services/apiClient', () => ({ api: { post: mocks.post } }))
vi.mock('@/modules/auth/services/supabaseClient', () => ({ supabase: { auth: { getSession: mocks.getSession } } }))

function fillForm() {
  fireEvent.change(screen.getByLabelText('Tipo de centro'), { target: { value: 'private' } })
  fireEvent.change(screen.getByLabelText(/Ubicación del centro/), { target: { value: 'La Vega, Centro' } })
  fireEvent.click(screen.getByRole('button', { name: 'Guardar y seleccionar' }))
}

describe('CreateSchoolDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.getSession.mockResolvedValue({ data: { session: { access_token: 'test-session' } }, error: null })
  })

  it('saves and selects a new shared school using the authenticated session', async () => {
    const school = { id: 'new', name: 'Colegio Nuevo', district: 'La Vega, Centro' }
    mocks.post.mockResolvedValue({ school, created: true })
    const onSelect = vi.fn()
    render(<CreateSchoolDialog initialName="Colegio Nuevo" onSelect={onSelect} onClose={vi.fn()} />)
    fillForm()
    await waitFor(() => expect(onSelect).toHaveBeenCalledWith(school))
    expect(mocks.post).toHaveBeenCalledWith('/schools', { name: 'Colegio Nuevo', sector: 'private', district: 'La Vega, Centro' }, { headers: { Authorization: 'Bearer test-session' } })
  })

  it('lets the teacher review an existing match before selecting it', async () => {
    const school = { id: 'existing', name: 'Nombre oficial', district: 'La Vega' }
    mocks.post.mockResolvedValue({ school, created: false })
    const onSelect = vi.fn()
    render(<CreateSchoolDialog initialName="Colegio Nuevo" onSelect={onSelect} onClose={vi.fn()} />)
    fillForm()
    expect(await screen.findByText('Nombre oficial')).toBeInTheDocument()
    expect(onSelect).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'Usar este centro' }))
    expect(onSelect).toHaveBeenCalledWith(school)
  })

  it('keeps the form available to retry after a server error', async () => {
    mocks.post.mockRejectedValue(new Error('No se pudo guardar'))
    render(<CreateSchoolDialog initialName="Colegio Nuevo" onSelect={vi.fn()} onClose={vi.fn()} />)
    fillForm()
    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo guardar')
    expect(screen.getByLabelText('Nombre del centro')).toHaveValue('Colegio Nuevo')
    expect(screen.getByRole('button', { name: 'Guardar y seleccionar' })).toBeEnabled()
  })
})
