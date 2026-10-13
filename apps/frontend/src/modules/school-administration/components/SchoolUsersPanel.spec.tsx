import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '@/services/apiClient'
import { SchoolUsersPanel } from './SchoolUsersPanel'

const rows = [
  { id: 'ana', fullName: 'Ana Pérez', email: 'ana@example.com', status: 'ACTIVE' },
  { id: 'luis', fullName: 'Luis Cruz', email: 'luis@example.com', status: 'INACTIVE' },
]
const response = (data: unknown, status = 200) => new Response(JSON.stringify(status === 200 ? { data } : { message: data }), { status })

describe('SchoolUsersPanel', () => {
  let fetch: ReturnType<typeof vi.fn>
  beforeEach(() => {
    api.clearCache()
    fetch = vi.fn(async (url: string) => {
      if (url === '/api/v1/users') return response(rows)
      if (url === '/api/v1/users/ana') return response({ ...rows[0], avatarUrl: 'https://example.com/ana.png' })
      if (url === '/api/v1/users/ana/roles') return response([{ id: 'teacher', key: 'teacher', name: 'Docente', description: null, status: 'ACTIVE' }])
      throw new Error(`Unexpected request ${url}`)
    })
    vi.stubGlobal('fetch', fetch)
  })
  afterEach(() => vi.unstubAllGlobals())

  it('loads real users and filters by email and status accessibly', async () => {
    const user = userEvent.setup()
    render(<SchoolUsersPanel />)
    expect(await screen.findByText('Ana Pérez')).toBeInTheDocument()
    await user.type(screen.getByLabelText('Buscar usuarios'), 'luis@')
    expect(screen.queryByText('Ana Pérez')).not.toBeInTheDocument()
    expect(screen.getByText('Luis Cruz')).toBeInTheDocument()
    await user.clear(screen.getByLabelText('Buscar usuarios'))
    await user.selectOptions(screen.getByLabelText('Estado de usuario'), 'ACTIVE')
    expect(screen.queryByText('Luis Cruz')).not.toBeInTheDocument()
  })

  it('edits only name/avatar, shows readonly account fields, and blocks closing while saving', async () => {
    const user = userEvent.setup()
    let complete!: (value: Response) => void
    fetch.mockImplementation(async (url: string, options?: RequestInit) => {
      if (options?.method === 'PATCH') return new Promise<Response>(resolve => { complete = resolve })
      if (url.endsWith('/roles')) return response([{ id: 'teacher', key: 'teacher', name: 'Docente', description: null, status: 'ACTIVE' }])
      return response(url.endsWith('/ana') ? { ...rows[0], avatarUrl: 'https://example.com/ana.png' } : rows)
    })
    render(<SchoolUsersPanel />)
    await user.click(await screen.findByRole('button', { name: 'Editar Ana Pérez' }))
    const dialog = await screen.findByRole('dialog', { name: 'Editar usuario' })
    await waitFor(() => expect(within(dialog).getByLabelText('URL de avatar')).toHaveValue('https://example.com/ana.png'))
    expect(within(dialog).getByLabelText('Correo')).toHaveAttribute('readonly')
    expect(within(dialog).getByText('Docente')).toBeInTheDocument()
    expect(within(dialog).queryByRole('combobox')).not.toBeInTheDocument()
    await user.clear(within(dialog).getByLabelText('Nombre completo'))
    expect(within(dialog).getByRole('button', { name: 'Guardar cambios' })).toBeDisabled()
    await user.type(within(dialog).getByLabelText('Nombre completo'), ' Ana Actualizada ')
    await user.clear(within(dialog).getByLabelText('URL de avatar'))
    await user.click(within(dialog).getByRole('button', { name: 'Guardar cambios' }))
    expect(within(dialog).getByRole('button', { name: 'Cerrar' })).toBeDisabled()
    expect(fetch).toHaveBeenCalledWith('/api/v1/users/ana', expect.objectContaining({
      method: 'PATCH', body: JSON.stringify({ fullName: 'Ana Actualizada', avatarUrl: '' }),
    }))
    expect(screen.getByText('Luis Cruz')).toBeInTheDocument()
    await act(async () => complete(response({ ...rows[0], fullName: 'Ana Actualizada', avatarUrl: '' })))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(screen.getByText('Ana Actualizada')).toBeInTheDocument()
  })

  it('retains list and edits after a failed save', async () => {
    const user = userEvent.setup()
    render(<SchoolUsersPanel />)
    await user.click(await screen.findByRole('button', { name: 'Editar Ana Pérez' }))
    const dialog = screen.getByRole('dialog')
    await waitFor(() => expect(within(dialog).getByRole('button', { name: 'Guardar cambios' })).toBeEnabled())
    fetch.mockResolvedValueOnce(response('No se pudo guardar', 400))
    await user.clear(within(dialog).getByLabelText('Nombre completo'))
    await user.type(within(dialog).getByLabelText('Nombre completo'), 'Nombre pendiente')
    await user.click(within(dialog).getByRole('button', { name: 'Guardar cambios' }))
    expect(await within(dialog).findByRole('alert')).toHaveTextContent('No se pudo guardar')
    expect(within(dialog).getByLabelText('Nombre completo')).toHaveValue('Nombre pendiente')
    expect(screen.getByText('Luis Cruz')).toBeInTheDocument()
  })

  it('retries a failed list request and explains empty results', async () => {
    fetch.mockResolvedValueOnce(response('No autorizado', 403)).mockResolvedValueOnce(response([]))
    const user = userEvent.setup()
    render(<SchoolUsersPanel />)
    expect(await screen.findByRole('alert')).toHaveTextContent('No autorizado')
    await user.click(screen.getByRole('button', { name: 'Reintentar' }))
    expect(await screen.findByText('Sin usuarios')).toBeInTheDocument()
  })
})
