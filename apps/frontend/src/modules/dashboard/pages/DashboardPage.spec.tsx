import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DashboardPage } from './DashboardPage'

vi.mock('@/modules/auth/hooks/useAuth', () => ({
  useAuth: () => ({ hasRole: () => true }),
}))

vi.mock('@/modules/dashboard/hooks/useDashboard', () => ({
  useDashboard: () => ({
    data: {
      view: 'teacher',
      context: {
        firstName: 'Ada',
        formattedDate: 'miércoles, 2 de septiembre',
        schoolYearName: '2026-2027',
        periodName: 'P1',
      },
      nextClass: null,
      todayAgenda: [],
      weeklyAttendance: {
        average: null,
        trendPercent: null,
        activityCount: 0,
        days: ['LUN', 'MAR', 'MIE', 'JUE', 'VIE'].map((label) => ({
          label,
          value: null,
          isToday: false,
        })),
      },
      periodClosing: {
        name: 'P1',
        daysRemaining: 36,
        rangeLabel: 'Agosto – Octubre · hasta el 30 de octubre',
        percentage: 43,
        courses: [{ id: 'course-1', label: '3.º A', subject: 'Ciencias Físicas', graded: 18, total: 25 }],
      },
      todayAttendance: {
        recordedClasses: 1,
        totalClasses: 5,
        present: 4,
        absent: 1,
        excused: 0,
        late: 0,
      },
      attention: [{ id: 'student-1', name: 'Ana Rodríguez', grade: '4.º A', average: 58, attendance: 62, reasons: ['Asistencia', 'Promedio'], note: 'Promedio bajo el mínimo de aprobación' }],
      planningSummary: { count: 0, entries: [] },
      calendar: { source: 'school', events: [{ id: 'period-1', date: '2026-10-30T00:00:00.000Z', title: 'Cierre de P1', kind: 'Período' }] },
      communications: [{ id: 'notice-1', subject: 'Reunión con familia', status: 'sent', student: 'Ana Rodríguez', relativeTime: 'Hace 1 d' }],
      tasks: [],
      recentActivity: [
        {
          id: 'activity-1',
          kind: 'planning',
          title: 'Actividad de prueba',
          description: 'Descripción',
          relativeTime: 'Hace 1 d',
          path: '/reportes',
        },
      ],
      smartSuggestion: null,
      setupProgress: {
        courseCount: 1,
        studentCount: 1,
        activeEnrollments: 1,
        scheduleEntryCount: 1,
        attendanceCount: 0,
        planningCount: 1,
      },
      journalSummary: {
        activeCount: 2,
        pendingCount: 1,
        recentEntries: [{ id: 'entry-1', title: 'Participó en clase', entryType: 'student_observation', relatedStudent: 'Ana Rodríguez', occurredAt: '2026-09-01T00:00:00.000Z', relativeTime: 'Hace 1 d' }],
      },
    },
    error: null,
    loading: false,
    actionLoading: false,
    addTask: vi.fn(),
    completeTask: vi.fn(),
    refetch: vi.fn(),
  }),
}))

describe('DashboardPage', () => {
  beforeEach(() => {
    localStorage.removeItem('aulabase:home-widgets:v1:local')
    localStorage.removeItem('aulabase:home-widgets:v2:local')
  })

  it('shows the redesigned dashboard with live data and empty states', () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    )

    expect(screen.getByText('Tu agenda')).toBeInTheDocument()
    expect(screen.getByText('No hay clases programadas para hoy.')).toBeInTheDocument()
    expect(screen.getByText('Actividad de prueba')).toBeInTheDocument()
    expect(screen.getByText('Cierre de período')).toBeInTheDocument()
    expect(screen.getByText('Asistencia de hoy')).toBeInTheDocument()
    expect(screen.queryByText('Asistencia semanal')).not.toBeInTheDocument()
    expect(screen.getByText('miércoles, 2 de septiembre')).toBeInTheDocument()
    expect(screen.getByText('Requieren atención')).toBeInTheDocument()
    expect(screen.getByText('Competencias fundamentales')).toBeInTheDocument()
    expect(screen.getByText('Planificación')).toBeInTheDocument()
    expect(screen.getByText('Calendario escolar')).toBeInTheDocument()
    expect(screen.getByText('Avisos y familias')).toBeInTheDocument()
    expect(screen.getByText('Cierre de P1')).toBeInTheDocument()
    expect(screen.getByText('Participó en clase')).toBeInTheDocument()
    expect(screen.getByText('Bitácora docente')).toBeInTheDocument()
    expect(screen.getByText('2 anotaciones · 1 seguimientos pendientes')).toBeInTheDocument()
  })

  it('shows contextual actions with valid destinations', () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: '¿Qué quieres hacer?' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Revisar asistencia/ })).toHaveAttribute('href', '/asistencia')
    expect(screen.getByText('0 de 5 días registrados')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Nueva planificación/ })).toHaveAttribute('href', '/planificaciones?action=nueva')
    expect(screen.getByRole('link', { name: /Anotar en bitácora/ })).toHaveAttribute('href', '/bitacora?action=create')
    expect(screen.getByText('1 seguimiento pendiente')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Mensaje a familia/ })).toHaveAttribute('href', '/estudiantes')
  })

  it('lets the user remove and add widgets and saves the selection', () => {
    render(<MemoryRouter><DashboardPage /></MemoryRouter>)

    fireEvent.click(screen.getByLabelText('Opciones de Inicio'))
    fireEvent.click(screen.getByRole('button', { name: 'Editar widgets' }))

    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText('Agregados')).toBeInTheDocument()
    expect(within(dialog).getByText('Disponibles')).toBeInTheDocument()

    const periodRow = within(dialog).getByText('Cierre de período').closest('div.rounded-xl')
    expect(periodRow).not.toBeNull()
    fireEvent.click(within(periodRow as HTMLElement).getByRole('button', { name: 'Quitar' }))
    expect(screen.queryByText(/cierra en/)).not.toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('aulabase:home-widgets:v2:local') ?? '[]')).not.toContain('period')

    const availablePeriodRow = within(dialog).getByText('Cierre de período').closest('div.rounded-xl')
    fireEvent.click(within(availablePeriodRow as HTMLElement).getByRole('button', { name: 'Agregar' }))
    expect(screen.getByText(/cierra en/)).toBeInTheDocument()
  })

  it('animates cards that move after removing a widget', () => {
    const animate = vi.fn()
    const originalAnimate = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'animate')
    Object.defineProperty(HTMLElement.prototype, 'animate', { configurable: true, value: animate })
    const rect = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      const left = this.dataset.homeWidget === 'today' && document.querySelector('[data-home-widget="period"]') ? 100 : 0
      return { left, top: 0, right: left + 100, bottom: 100, width: 100, height: 100 } as DOMRect
    })
    const frame = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => { callback(0); return 1 })
    try {
      render(<MemoryRouter><DashboardPage /></MemoryRouter>)
      fireEvent.click(screen.getByLabelText('Opciones de Inicio'))
      fireEvent.click(screen.getByRole('button', { name: 'Editar widgets' }))
      const periodRow = within(screen.getByRole('dialog')).getByText('Cierre de período').closest('div.rounded-xl') as HTMLElement
      fireEvent.click(within(periodRow).getByRole('button', { name: 'Quitar' }))
      expect(animate).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ transform: expect.stringContaining('translate(100px') })]), expect.any(Object))
    } finally {
      rect.mockRestore()
      frame.mockRestore()
      if (originalAnimate) Object.defineProperty(HTMLElement.prototype, 'animate', originalAnimate)
      else Reflect.deleteProperty(HTMLElement.prototype, 'animate')
    }
  })

  it('restores the default widgets from the editor', () => {
    render(<MemoryRouter><DashboardPage /></MemoryRouter>)
    fireEvent.click(screen.getByLabelText('Opciones de Inicio'))
    fireEvent.click(screen.getByRole('button', { name: 'Editar widgets' }))
    const dialog = screen.getByRole('dialog')
    const reset = within(dialog).getByRole('button', { name: 'Restablecer diseño predeterminado' })
    expect(reset).toBeDisabled()

    const periodRow = within(dialog).getByText('Cierre de período').closest('div.rounded-xl') as HTMLElement
    fireEvent.click(within(periodRow).getByRole('button', { name: 'Quitar' }))
    expect(reset).toBeEnabled()
    fireEvent.click(reset)

    expect(screen.getByText(/cierra en/)).toBeInTheDocument()
    expect(reset).toBeDisabled()
    expect(JSON.parse(localStorage.getItem('aulabase:home-widgets:v2:local') ?? '[]')).toContain('period')
  })

  it('filters students who require attention by reason', () => {
    render(<MemoryRouter><DashboardPage /></MemoryRouter>)

    const card = screen.getByRole('heading', { name: 'Requieren atención' }).closest('section') as HTMLElement
    expect(within(card).getByText('Ana Rodríguez')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Conducta' }))
    expect(within(card).queryByText('Ana Rodríguez')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Asistencia' }))
    expect(within(card).getByText('Ana Rodríguez')).toBeInTheDocument()
  })
})
