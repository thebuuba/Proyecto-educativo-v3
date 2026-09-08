import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

import type { ScheduleEntry } from '@/modules/schedule/types'
import { CoursesPage } from './CoursesPage'

const mocks = vi.hoisted(() => ({
  getGradingWorkspace: vi.fn(),
  getScheduleEntries: vi.fn(),
}))

vi.mock('@/modules/grading/services/gradingService', () => ({ getGradingWorkspace: mocks.getGradingWorkspace }))
vi.mock('@/modules/schedule/services/scheduleService', () => ({ getScheduleEntries: mocks.getScheduleEntries }))

const entry = (id: string, dayOfWeek: number, startTime: string, endTime: string, room: string | null): ScheduleEntry => ({
  id, dayOfWeek, startTime, endTime, room,
  schoolYearId: 'year-1', academicPeriodId: null, sectionSubjectId: 'assignment-1', sectionId: 'section-1', timeSlotId: `slot-${id}`,
  status: 'active', subjectName: 'Ciencias de la Vida', teacherName: 'Docente', gradeName: '2.º', academicLevelName: 'Secundario', sectionName: 'A', timeSlotName: id,
})

function renderPage() {
  return render(<MemoryRouter initialEntries={['/cursos?courseId=section-1&subjectId=assignment-1&tab=horario']}><CoursesPage /></MemoryRouter>)
}

describe('horario dentro de una asignatura', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 8, 7, 9, 0))
    mocks.getGradingWorkspace.mockResolvedValue({ students: Array.from({ length: 25 }), sectionSubjects: [{ id: 'assignment-1', gradeName: '2.º', sectionName: 'A', subjectName: 'Ciencias de la Vida', schoolYearName: '2026-2027' }] })
  })

  afterEach(() => vi.useRealTimers())

  it('muestra el resumen real y agrupa las sesiones de lunes a viernes sin tabla antigua', async () => {
    mocks.getScheduleEntries.mockResolvedValue([
      entry('thu', 4, '11:20:00', '12:00:00', null),
      entry('tue-2', 2, '12:00:00', '12:40:00', 'Laboratorio'),
      entry('tue-1', 2, '10:00:00', '10:40:00', null),
    ])
    renderPage()

    expect(await screen.findByRole('heading', { name: 'Horario semanal' })).toBeInTheDocument()
    expect(screen.getByText('3', { selector: 'p' })).toBeInTheDocument()
    expect(screen.getByText('120 min')).toBeInTheDocument()
    expect(screen.getAllByText('Sin asignar')).toHaveLength(2)
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(screen.getByText('25 estudiantes')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Iniciar clase' })).toBeInTheDocument()

    const tuesday = screen.getByRole('heading', { name: 'Martes' })
    const thursday = screen.getByRole('heading', { name: 'Jueves' })
    expect(tuesday.compareDocumentPosition(thursday) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('presenta un estado vacío informativo sin inventar sesiones', async () => {
    mocks.getScheduleEntries.mockResolvedValue([])
    renderPage()

    expect(await screen.findByText('Esta asignatura todavía no tiene clases programadas.')).toBeInTheDocument()
    expect(screen.getByText('El horario se configurará desde el módulo principal de Horario.')).toBeInTheDocument()
  })
})
