import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getActivities, getActivityCenter, saveActivity } from '../services/activitiesService'
import { getCourseTeams } from '@/modules/courses/services/coursesService'
import { ActivityCreator } from './ActivityCreator'
const auth = vi.hoisted(() => ({ schoolId: 'school1', appUser: { id: 'user1' } }))

vi.mock('@/modules/activities/services/activitiesService', () => ({
  getActivityCenter: vi.fn().mockResolvedValue({
    sectionSubjects: [{ id: 'ss-1', schoolYearId: 'year-1', gradeName: '2.º', sectionName: 'A', subjectName: 'Ciencias', academicLevelCode: 'primario', evaluationProfile: { id: 'primary-official', academicLevelCode: 'primario', expectedBlockTotal: 100, requiredPeriodCount: 4, blocks: [{ id: 'b1' }, { id: 'b2' }, { id: 'b3' }] } }],
    academicPeriods: [{ id: 'period-1', schoolYearId: 'year-1', name: 'P1', sequence: 1 }],
    activities: [],
  }),
  getActivities: vi.fn().mockResolvedValue([]),
  saveActivity: vi.fn(),
  deleteActivity: vi.fn(),
}))

vi.mock('@/modules/courses/services/coursesService', () => ({ getCourseTeams: vi.fn().mockResolvedValue([]) }))
vi.mock('@/modules/auth/hooks/useAuth', () => ({ useAuth: () => auth }))

vi.mock('@/modules/activities/components/ActivityEditorWorkspace', () => ({
  ActivityEditorWorkspace: (props: { initialActivityAction?: string; activity?: {id:string}; originReturnLabel?: string; onReturnToOrigin: () => void; onAddActivity: (input: object) => Promise<unknown>; onUpdateActivity: (input: object) => Promise<unknown>; evaluationProfile?: { blocks: Array<{ id: string }> } }) => {
    const [name, setName] = useState('')
    return <div>
    <input aria-label="Nombre" value={name} onChange={event => setName(event.target.value)} />
    <button onClick={() => void (props.activity?.id ? props.onUpdateActivity : props.onAddActivity)({ name, maxScore: 10, competencyBlockId: 'b1', ...(props.activity ? {id:props.activity.id} : {}) }).catch(() => undefined)}>Guardar</button>
    <span>create</span>
    <span data-testid="profile-blocks">{props.evaluationProfile?.blocks.map((block) => block.id).join(',')}</span>
    <button onClick={props.onReturnToOrigin}>{props.originReturnLabel}</button>
  </div> },
}))

function Location() { return <span data-testid="location">{useLocation().pathname}{useLocation().search}</span> }

describe('ActivityCreator', () => {
  beforeEach(() => { auth.appUser.id = 'user1'; vi.mocked(saveActivity).mockReset(); vi.mocked(getActivities).mockResolvedValue([]); vi.mocked(getCourseTeams).mockResolvedValue([]) })
  const mountCreator = (query = 'sectionSubjectId=ss-1&academicPeriodId=period-1') => render(<MemoryRouter initialEntries={[`/actividades/crear?${query}`]}><ActivityCreator /></MemoryRouter>)

  it('solicita solo contexto y carga las actividades una vez por su asignatura y período', async () => {
    vi.mocked(getActivityCenter).mockClear()
    vi.mocked(getActivities).mockClear()
    mountCreator()
    await screen.findByRole('textbox', { name: 'Nombre' })
    expect(getActivityCenter).toHaveBeenCalledWith({ contextOnly: true })
    await waitFor(() => expect(getActivities).toHaveBeenCalledWith({ sectionSubjectId: 'ss-1', academicPeriodId: 'period-1' }))
    expect(getActivities).toHaveBeenCalledTimes(1)
  })

  it('preserves editor values after failed save and reuses creation ID only until success', async () => {
    const sent: Array<{ creationId?: string }> = []
    vi.mocked(saveActivity).mockImplementation(async input => {
      sent.push(input)
      if (sent.length === 1) throw new Error('Sin conexión')
      return { ...input, id: `saved-${sent.length}` }
    })
    mountCreator()
    const name = await screen.findByRole('textbox', { name: 'Nombre' })
    fireEvent.change(name, { target: { value: 'Mi actividad' } })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }))
    await screen.findByText(/Sin conexión/)
    expect(screen.getByRole('textbox', { name: 'Nombre' })).toHaveValue('Mi actividad')
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }))
    await waitFor(() => expect(sent).toHaveLength(2))
    expect(sent[0].creationId).toMatch(/^[0-9a-f-]{36}$/)
    expect(sent[1].creationId).toBe(sent[0].creationId)
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }))
    await waitFor(() => expect(sent).toHaveLength(3))
    expect(sent[2].creationId).not.toBe(sent[0].creationId)
  })

  it('settles an unknown academic period instead of showing a permanent skeleton', async () => {
    mountCreator('sectionSubjectId=ss-1&academicPeriodId=missing')
    expect(await screen.findByText(/período.*no.*disponible/i)).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('settles a context with no academic periods', async () => {
    vi.mocked(getActivityCenter).mockResolvedValueOnce({ sectionSubjects: [{ id: 'ss-1', schoolYearId: 'year-1', gradeName: '2.º', sectionName: 'A', subjectName: 'Ciencias' }], academicPeriods: [], activities: [] })
    mountCreator('sectionSubjectId=ss-1')
    expect(await screen.findByText(/período.*no.*disponible/i)).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('retries context load failures explicitly', async () => {
    vi.mocked(getActivityCenter).mockRejectedValueOnce(new Error('Contexto sin conexión'))
    mountCreator()
    expect(await screen.findByText(/Contexto sin conexión/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Reintentar contexto' }))
    expect(await screen.findByRole('textbox', { name: 'Nombre' })).toBeInTheDocument()
  })

  it('preserves an edited activity when update fails, including its existing ID', async () => {
    vi.mocked(getActivities).mockResolvedValue([{ id: 'edit1', name: 'Original', competencyBlockId: 'b1', maxScore: 10 }])
    vi.mocked(saveActivity).mockRejectedValueOnce(new Error('Edición sin conexión'))
    mountCreator('sectionSubjectId=ss-1&academicPeriodId=period-1&activityId=edit1')
    fireEvent.change(await screen.findByRole('textbox', { name: 'Nombre' }), { target: { value: 'Editada' } })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }))
    await screen.findByText(/Edición sin conexión/)
    expect(screen.getByRole('textbox', { name: 'Nombre' })).toHaveValue('Editada')
    expect(vi.mocked(saveActivity).mock.calls[0][0]).toMatchObject({ id: 'edit1', name: 'Editada' })
    expect(vi.mocked(saveActivity).mock.calls[0][0].creationId).toBeUndefined()
  })

  it('immediately clears the previous editor when the app account changes', async () => {
    const mounted = mountCreator()
    fireEvent.change(await screen.findByRole('textbox', { name: 'Nombre' }), { target: { value: 'Cuenta anterior' } })
    auth.appUser.id = 'user2'
    mounted.rerender(<MemoryRouter initialEntries={['/actividades/crear?sectionSubjectId=ss-1&academicPeriodId=period-1']}><ActivityCreator /></MemoryRouter>)
    expect(screen.queryByDisplayValue('Cuenta anterior')).not.toBeInTheDocument()
    expect(await screen.findByRole('textbox', { name: 'Nombre' })).toHaveValue('')
  })

  it('shows and retries team failures without discarding editor values', async () => {
    vi.mocked(getCourseTeams).mockRejectedValueOnce(new Error('Equipos sin conexión'))
    mountCreator()
    const name = await screen.findByRole('textbox', { name: 'Nombre' })
    fireEvent.change(name, { target: { value: 'Trabajo grupal' } })
    expect(await screen.findByText('Equipos sin conexión')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Reintentar.*equipos/i }))
    await waitFor(() => expect(screen.queryByText('Equipos sin conexión')).not.toBeInTheDocument())
    expect(name).toHaveValue('Trabajo grupal')
  })
  it('abre el creador fuera de Evaluación y restaura Estudiantes como origen', async () => {
    render(<MemoryRouter initialEntries={['/actividades/crear?sectionSubjectId=ss-1&academicPeriodId=period-1&competencyBlockId=b2&returnCourseId=course-1&returnSubjectId=ss-1&returnTab=estudiantes']}>
      <Routes>
        <Route path="*" element={<><ActivityCreator /><Location /></>} />
      </Routes>
    </MemoryRouter>)

    expect(await screen.findByText('create')).toBeInTheDocument()
    expect(screen.getByTestId('profile-blocks')).toHaveTextContent('b1,b2,b3')
    expect(screen.getByTestId('profile-blocks')).not.toHaveTextContent('b4')
    expect(screen.getByTestId('location')).toHaveTextContent('/actividades/crear')
    expect(screen.getByTestId('location')).not.toHaveTextContent('/calificaciones')
    fireEvent.click(screen.getByRole('button', { name: 'Volver a Estudiantes' }))
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/cursos?courseId=course-1&subjectId=ss-1&tab=estudiantes'))
  })
})
