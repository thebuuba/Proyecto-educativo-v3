import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ActivityDraftsPanel } from './ActivityDraftsPanel'

const auth = vi.hoisted(() => ({ schoolId: 'school1', appUser: { id: 'user1' } }))
vi.mock('@/modules/auth/hooks/useAuth', () => ({ useAuth: () => auth }))

function seed(userId: string, name: string) {
  const context = { schoolId: 'school1', userId, schoolYearId: 'year1', sectionSubjectId: 'ss1', academicPeriodId: 'p1' }
  window.localStorage.setItem(`grading-activity-drafts:v2:["school1","${userId}","year1","ss1","p1"]`, JSON.stringify({ context, courseTitle: 'Ciencias', periodShortName: 'P1', drafts: { b1: [{ draftId: userId, name }] } }))
}
const panel = () => <MemoryRouter><ActivityDraftsPanel resolveHref={() => '/actividades/crear'} /></MemoryRouter>

describe('ActivityDraftsPanel account recovery', () => {
  beforeEach(() => { window.localStorage.clear(); auth.appUser.id = 'user1' })

  it('shows only the current account and immediately removes the previous account dialog', () => {
    seed('user1', 'Cuenta anterior')
    seed('user2', 'Cuenta actual')
    const mounted = render(panel())
    expect(screen.queryByText('Cuenta actual')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar borrador Cuenta anterior' }))
    auth.appUser.id = 'user2'
    mounted.rerender(panel())
    expect(screen.queryByText('Cuenta anterior')).not.toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByText('Cuenta actual')).toBeInTheDocument()
  })

  it('reports denied reads and retries after storage becomes available', () => {
    seed('user1', 'Borrador recuperado')
    const denied = vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => { throw new Error('Acceso denegado') })
    render(panel())
    expect(screen.getByRole('alert')).toHaveTextContent('Acceso denegado')
    denied.mockRestore()
    fireEvent.click(screen.getByRole('button', { name: 'Reintentar borradores' }))
    expect(screen.getByText('Borrador recuperado')).toBeInTheDocument()
  })

  it('renders valid drafts with corrupt labels alongside a valid sibling envelope', () => {
    seed('user1', 'Hermano válido')
    const context = { schoolId: 'school1', userId: 'user1', schoolYearId: 'year1', sectionSubjectId: 'ss2', academicPeriodId: 'p1' }
    window.localStorage.setItem('grading-activity-drafts:v2:["school1","user1","year1","ss2","p1"]', JSON.stringify({ context, courseTitle: { bad: true }, periodShortName: { bad: true }, drafts: { b1: [{ draftId: 'corrupt-labels', name: 'Borrador visible' }] } }))
    render(panel())
    expect(screen.getByText('Borrador visible')).toBeInTheDocument()
    expect(screen.getByText('Hermano válido')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Continuar' })).toHaveLength(2)
  })
})
