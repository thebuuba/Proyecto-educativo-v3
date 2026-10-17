import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ProfileSettings } from '@aula/shared'
import { ProfileSettingsPage } from './profile-settings-page'

const mocks = vi.hoisted(() => ({ get: vi.fn(), update: vi.fn(), upload: vi.fn(), remove: vi.fn(), refreshAuth: vi.fn(), auth: { appUser: { id: 'user' } as {id: string} | null } }))
vi.mock('../services/profileSettingsService', () => ({ getOwnProfileSettings: mocks.get, updateOwnProfileSettings: mocks.update, uploadOwnAvatar: mocks.upload, removeOwnAvatar: mocks.remove }))
vi.mock('@/modules/auth/hooks/useAuth', () => ({ useAuth: () => ({ ...mocks.auth, refreshAuth: mocks.refreshAuth }) }))
const profile: ProfileSettings = {
  id: 'user', fullName: 'Ana Pérez', email: 'ana@example.com', phone: null, avatarUrl: null,
  createdAt: '2026-01-01T00:30:00Z', roles: ['teacher'], institution: 'Escuela real', academicIdentifier: {label: 'Código docente', value: 'DOC-7'},
  preferences: { publicName: null, bio: null, birthDate: '1999-04-18', country: null, city: null, educationLevel: null, language: 'es', timezone: 'America/La_Paz', interests: [] },
  stats: [{ id: 'courses', label: 'Cursos asignados', value: 3 }, {id:'hours', label:'Horas registradas', value:null}, {id:'certs',label:'Certificados',value:null}], completeness: 20,
}
const mount = () => render(<MemoryRouter><ProfileSettingsPage /></MemoryRouter>)
describe('perfil conectado', () => {
  beforeEach(() => { vi.clearAllMocks(); mocks.auth.appUser = {id:'user'}; mocks.get.mockResolvedValue(profile); mocks.refreshAuth.mockResolvedValue(undefined) })
  it('loads real fields and unknown metrics without sample identity or false verification', async () => {
    mount()
    expect(await screen.findByLabelText('Nombre completo')).toHaveValue('Ana Pérez')
    expect(screen.getByLabelText('Fecha de nacimiento')).toHaveValue('1999-04-18')
    expect(screen.getByLabelText('Institución educativa')).toHaveValue('Escuela real')
    expect(screen.getByLabelText('Correo electrónico')).toHaveAttribute('readonly')
    expect(screen.queryByText('Verificado')).not.toBeInTheDocument()
    expect(screen.queryByText(/Ilham|Valencia|248/)).not.toBeInTheDocument()
    expect(screen.getByText(/Miembro desde dic 2025/)).toBeInTheDocument()
  })
  it('persists changes once and reloads confirmed data', async () => {
    const user = userEvent.setup(); mount()
    const input = await screen.findByLabelText('Nombre completo')
    await user.clear(input); await user.type(input, 'Ana Real')
    mocks.update.mockResolvedValue({...profile, fullName:'Ana Real'})
    await user.click(screen.getByRole('button',{name:'Guardar'}))
    expect(await screen.findByText('Cambios guardados correctamente')).toBeInTheDocument()
    expect(mocks.update).toHaveBeenCalledTimes(1)
    expect(mocks.update).toHaveBeenCalledWith(expect.objectContaining({fullName:'Ana Real'}))
    expect(mocks.refreshAuth).toHaveBeenCalled()
  })
  it('keeps a failed draft and discards it explicitly', async () => {
    const user = userEvent.setup(); mount()
    await user.type(await screen.findByLabelText('Ciudad'), 'La Paz')
    mocks.update.mockRejectedValue(new Error('No se pudo guardar'))
    await user.click(screen.getByRole('button',{name:'Guardar'}))
    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo guardar')
    expect(screen.getByLabelText('Ciudad')).toHaveValue('La Paz')
    await user.click(screen.getByRole('button',{name:'Descartar'}))
    expect(screen.getByLabelText('Ciudad')).toHaveValue('')
  })
  it('ignores a late response from a previous account', async () => {
    let complete!: (p: ProfileSettings) => void
    mocks.get.mockImplementationOnce(() => new Promise(resolve => { complete = resolve }))
    const view = mount()
    mocks.auth.appUser = {id:'second'}
    mocks.get.mockResolvedValue({...profile,id:'second',fullName:'Otra cuenta'})
    view.rerender(<MemoryRouter><ProfileSettingsPage /></MemoryRouter>)
    expect(await screen.findByLabelText('Nombre completo')).toHaveValue('Otra cuenta')
    await act(async () => complete(profile))
    expect(screen.getByLabelText('Nombre completo')).toHaveValue('Otra cuenta')
  })
  it('uploads and removes photos only after server confirmation while preserving the draft', async () => {
    const user = userEvent.setup(); mount()
    await user.type(await screen.findByLabelText('Ciudad'),'Santo Domingo')
    mocks.upload.mockResolvedValue({...profile,avatarUrl:'/api/v1/profile/avatar?v=test'})
    await user.upload(screen.getByLabelText('Archivo de foto'),new File([new Uint8Array([137,80,78,71])],'foto.png',{type:'image/png'}))
    await waitFor(() => expect(mocks.upload).toHaveBeenCalledTimes(1))
    expect(screen.getByLabelText('Ciudad')).toHaveValue('Santo Domingo')
    mocks.remove.mockRejectedValue(new Error('No se pudo quitar'))
    await user.click(screen.getByRole('button',{name:'Quitar'}))
    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo quitar')
  })
})
