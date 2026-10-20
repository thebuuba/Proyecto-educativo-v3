import { render, screen, waitFor, within, cleanup, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ScheduleEntry, TimeSlot } from '../types'

const mocks = vi.hoisted(() => ({
  canEdit: true,
  slots: [] as TimeSlot[],
  entries: [] as ScheduleEntry[],
  pending: [] as ScheduleEntry[],
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
  refresh: vi.fn(),
}))
vi.mock('@/modules/auth/hooks/useAuth', () => ({
  useAuth: () => ({ hasRole: () => mocks.canEdit }),
}))
vi.mock('../hooks/useSchedule', () => ({
  useSchedule: () => ({
    journeys: [
      {
        id: 'journey',
        name: 'Matutina',
        startTime: '08:00',
        endTime: '12:00',
        kind: 'MORNING',
        status: 'active',
        sequence: 1,
      },
    ],
    timeSlots: mocks.slots,
    entries: mocks.entries,
    pendingEntries: mocks.pending,
    integrityIssues: [],
    sections: [{ id: 'section', name: 'A', gradeName: 'Primero', academicLevelName: 'Secundaria' }],
    schoolYearId: 'year',
    schoolYearName: '2026',
    loading: false,
    error: null,
    createEntry: mocks.create,
    updateEntry: mocks.update,
    removeEntry: mocks.remove,
    refetchAll: mocks.refresh,
  }),
}))
vi.mock('../services/scheduleService', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../services/scheduleService')>()),
  getSectionSubjects: vi.fn().mockResolvedValue([{ id: 'subject', subjectName: 'Matemática' }]),
}))
import { SchedulePage } from './SchedulePage'
const slot = (id: string, day: number): TimeSlot => ({
  id,
  name: 'Período 1',
  startTime: '08:00',
  endTime: '08:45',
  sequence: 1,
  status: 'active',
  dayOfWeek: day,
  blockType: 'CLASS',
  journeyId: 'journey',
})
const entry = (): ScheduleEntry => ({
  id: 'entry',
  schoolYearId: 'year',
  academicPeriodId: null,
  sectionSubjectId: 'subject',
  sectionId: 'section',
  timeSlotId: 'mon',
  dayOfWeek: 1,
  room: '101',
  status: 'active',
  subjectName: 'Matemática',
  gradeName: 'Primero',
  sectionName: 'A',
  academicLevelName: 'Secundaria',
  teacherName: 'Docente',
  timeSlotName: 'Período 1',
  startTime: '08:00',
  endTime: '08:45',
})
beforeEach(() => {
  vi.clearAllMocks()
  mocks.canEdit = true
  mocks.slots = [slot('mon', 1), slot('tue', 2)]
  mocks.entries = []
  mocks.pending = []
  mocks.create.mockResolvedValue({})
  mocks.update.mockResolvedValue({})
  mocks.refresh.mockResolvedValue(undefined)
  Object.defineProperty(navigator, 'onLine', { configurable: true, value: true })
})
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})
describe('horario con panel contextual', () => {
  it('asigna una clase con aula a varios días libres de la misma hora', async () => {
    const user = userEvent.setup()
    render(<SchedulePage />)
    await user.click(screen.getByRole('button', { name: /Lunes, 8:00, período libre/ }))
    await user.click(await screen.findByRole('radio', { name: /Matemática/ }))
    await user.type(screen.getByLabelText(/Aula/), '204')
    await user.click(screen.getByRole('button', { name: 'Mar' }))
    await user.click(screen.getByRole('button', { name: 'Asignar el lunes' }))
    await waitFor(() => expect(mocks.create).toHaveBeenCalledTimes(2))
    expect(mocks.create).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        timeSlotId: 'mon',
        dayOfWeek: 1,
        room: '204',
        sectionSubjectId: 'subject',
      }),
    )
    expect(mocks.create).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ timeSlotId: 'tue', dayOfWeek: 2, room: '204' }),
    )
  })
  it('conserva el formulario y el aula cuando falla el guardado', async () => {
    mocks.create.mockRejectedValue(new Error('Servidor no disponible'))
    const user = userEvent.setup()
    render(<SchedulePage />)
    await user.click(screen.getByRole('button', { name: /Lunes, 8:00, período libre/ }))
    await user.click(await screen.findByRole('radio', { name: /Matemática/ }))
    await user.type(screen.getByLabelText(/Aula/), '204')
    await user.click(screen.getByRole('button', { name: 'Asignar el lunes' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Servidor no disponible')
    expect(screen.getByLabelText(/Aula/)).toHaveValue('204')
  })
  it('muestra detalle en solo lectura y no permite editar', async () => {
    mocks.entries = [entry()]
    mocks.canEdit = false
    const user = userEvent.setup()
    render(<SchedulePage />)
    await user.click(screen.getByRole('button', { name: /Lunes, 8:00, Matemática/ }))
    expect(
      screen.getByText(/Solo lectura: no tienes permiso para modificar clases/),
    ).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Cambiar clase' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Estructura/ }))
    expect(screen.getByRole('button', { name: 'Editar días, jornadas y períodos' })).toBeDisabled()
  })
  it('reubica una clase pendiente a un período elegido y conserva su identidad', async () => {
    mocks.pending = [{ ...entry(), needsPlacement: true, timeSlotId: 'retired' }]
    const user = userEvent.setup()
    render(<SchedulePage />)
    await user.click(screen.getByRole('button', { name: /Reubicar clase/ }))
    await user.selectOptions(screen.getByLabelText('Período de destino'), '2:tue')
    await user.click(screen.getByRole('button', { name: 'Reubicar clase' }))
    await waitFor(() =>
      expect(mocks.update).toHaveBeenCalledWith(
        'entry',
        expect.objectContaining({ timeSlotId: 'tue', dayOfWeek: 2 }),
      ),
    )
  })
  it('cambia a la agenda diaria y conserva el día seleccionado', async () => {
    const user = userEvent.setup()
    render(<SchedulePage />)
    await user.click(screen.getByRole('button', { name: 'Día' }))
    await user.click(screen.getByRole('button', { name: /Mar\s*0 clases/ }))
    expect(screen.getByRole('button', { name: /Martes, 8:00, período libre/ })).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /Lunes, 8:00, período libre/ }),
    ).not.toBeInTheDocument()
  })
  it('muestra conexión real y bloquea nuevas asignaciones al estar desconectado', () => {
    render(<SchedulePage />)
    Object.defineProperty(navigator, 'onLine', { configurable: true, value: false })
    fireEvent(window, new Event('offline'))
    expect(screen.getByText(/Sin conexión. Puedes consultar/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Asignar clase' })).toBeDisabled()
  })
  it('pide confirmación antes de quitar una clase', async () => {
    mocks.entries = [entry()]
    const user = userEvent.setup()
    render(<SchedulePage />)
    await user.click(screen.getByRole('button', { name: /Lunes, 8:00, Matemática/ }))
    await user.click(screen.getByRole('button', { name: 'Quitar del horario' }))
    expect(mocks.remove).not.toHaveBeenCalled()
    await user.click(
      within(screen.getByRole('dialog')).getByRole('button', { name: 'Quitar del horario' }),
    )
    await waitFor(() => expect(mocks.remove).toHaveBeenCalledWith('entry'))
  })
  it('edita la clase y permite vaciar el aula sin enviar campos de creación al PATCH', async () => {
    mocks.entries = [entry()]
    const user = userEvent.setup()
    render(<SchedulePage />)
    await user.click(screen.getByRole('button', { name: /Lunes, 8:00, Matemática/ }))
    await user.click(screen.getByRole('button', { name: 'Cambiar clase' }))
    expect(screen.getByLabelText(/Aula/)).toHaveValue('101')
    await user.clear(screen.getByLabelText(/Aula/))
    await user.click(screen.getByRole('button', { name: 'Guardar cambio' }))
    await waitFor(() =>
      expect(mocks.update).toHaveBeenCalledWith('entry', {
        sectionSubjectId: 'subject',
        sectionId: 'section',
        timeSlotId: 'mon',
        dayOfWeek: 1,
        room: null,
      }),
    )
  })
  it('conserva la cola de revisión aun cuando ya no quedan períodos activos', () => {
    mocks.slots = []
    mocks.pending = [{ ...entry(), needsPlacement: true }]
    render(<SchedulePage />)
    expect(screen.getByRole('heading', { name: 'Requiere revisión' })).toBeInTheDocument()
    expect(screen.getByText(/Sin período · antes Lunes/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Crear mi horario' })).toBeInTheDocument()
  })
  it('abre el período en un diálogo accesible en pantalla pequeña', async () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
    )
    const user = userEvent.setup()
    render(<SchedulePage />)
    await user.click(screen.getByRole('button', { name: /Lun\s*0 clases/ }))
    await user.click(screen.getByRole('button', { name: /Lunes, 8:00, período libre/ }))
    expect(screen.getByRole('dialog', { name: 'Detalle del período' })).toBeInTheDocument()
    expect(
      within(screen.getByRole('dialog')).getByRole('heading', { name: 'Asignar período' }),
    ).toBeInTheDocument()
  })
})
