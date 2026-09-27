import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '@/services/apiClient'

const mocks = vi.hoisted(() => ({
  saveScheduleStructure: vi.fn(),
  refetchAll: vi.fn(),
  journeys: [
    {
      id: '11111111-1111-4111-8111-111111111111',
      name: 'Matutina',
      kind: 'MORNING',
      startTime: '07:30',
      endTime: '12:00',
      sequence: 1,
      status: 'active',
    },
  ],
  timeSlots: [
    {
      id: '22222222-2222-4222-8222-222222222222',
      name: 'Clase 1',
      startTime: '07:30',
      endTime: '08:10',
      sequence: 1,
      status: 'active',
      dayOfWeek: 1,
      blockType: 'CLASS',
      journeyId: '11111111-1111-4111-8111-111111111111',
    },
  ],
  entries: [],
  sections: [],
}))

vi.mock('@/modules/schedule/services/scheduleService', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/modules/schedule/services/scheduleService')>()
  return {
    ...actual,
    getSectionSubjects: vi.fn().mockResolvedValue([]),
    saveScheduleStructure: mocks.saveScheduleStructure,
  }
})

vi.mock('@/modules/schedule/hooks/useSchedule', () => ({
  useSchedule: () => ({
    journeys: mocks.journeys,
    timeSlots: mocks.timeSlots,
    entries: mocks.entries,
    sections: mocks.sections,
    schoolYearId: '33333333-3333-4333-8333-333333333333',
    loading: false,
    error: null,
    createEntry: vi.fn(),
    removeEntry: vi.fn(),
    refetchAll: mocks.refetchAll,
  }),
}))

import { SchedulePage } from './SchedulePage'

afterEach(() => vi.restoreAllMocks())

describe('guardado desde SchedulePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.timeSlots.splice(1)
    mocks.refetchAll.mockResolvedValue(undefined)
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  it('mantiene el wizard, muestra un solo error y permite reintentar hasta abrir asignación', async () => {
    const user = userEvent.setup()
    mocks.saveScheduleStructure.mockRejectedValueOnce(new ApiError(500, 'Error interno'))
    mocks.saveScheduleStructure.mockResolvedValueOnce({ saved: true })
    render(<SchedulePage />)

    await user.click(screen.getByRole('button', { name: 'Editar estructura' }))
    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    await user.click(screen.getByRole('button', { name: 'Guardar y asignar clases' }))

    expect(await screen.findAllByText(/No pudimos guardar el horario en este momento/i)).toHaveLength(1)
    expect(screen.getByText('Asigna tus clases')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Reintentar' }))

    await waitFor(() => expect(mocks.saveScheduleStructure).toHaveBeenCalledTimes(2))
    expect(mocks.refetchAll).toHaveBeenCalledTimes(1)
    expect(await screen.findAllByLabelText('Asignar clase a Clase 1')).not.toHaveLength(0)
    expect(mocks.saveScheduleStructure.mock.calls[0][0].journeys[0]).not.toHaveProperty('status')
  })

  it('muestra la clasificación del espacio derivado y nunca ofrece asignarle una clase', async () => {
    mocks.timeSlots.push({
      id: '44444444-4444-4444-8444-444444444444',
      name: 'Almuerzo',
      startTime: '12:00',
      endTime: '13:00',
      sequence: 10_000,
      status: 'active',
      dayOfWeek: 1,
      blockType: 'LUNCH',
      blockSource: 'INTER_JOURNEY_GAP',
      sourceKey: 'morning:afternoon',
      journeyId: '11111111-1111-4111-8111-111111111111',
    } as never)

    const user = userEvent.setup()
    render(<SchedulePage />)
    expect(screen.getAllByText('Almuerzo').length).toBeGreaterThan(0)
    await user.click(screen.getByRole('button', { name: 'Asignar clases' }))
    expect(screen.queryByLabelText('Asignar clase a Almuerzo')).not.toBeInTheDocument()

    mocks.timeSlots.pop()
  })

  it('explica el error de validación y lleva el foco a la jornada afectada', async () => {
    mocks.saveScheduleStructure.mockRejectedValueOnce(
      new ApiError(400, 'La jornada Matutina debe terminar después de iniciar.'),
    )
    const user = userEvent.setup()
    render(<SchedulePage />)

    await user.click(screen.getByRole('button', { name: 'Editar estructura' }))
    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    await user.click(screen.getByRole('button', { name: 'Guardar y asignar clases' }))

    expect(await screen.findByText(/Revisa: La jornada Matutina debe terminar/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Ir al error' }))
    expect(screen.getByText('¿En qué jornadas trabajas?')).toBeInTheDocument()
    await waitFor(() => expect(document.activeElement).toHaveAttribute('data-schedule-review', 'Matutina'))
  })
})
