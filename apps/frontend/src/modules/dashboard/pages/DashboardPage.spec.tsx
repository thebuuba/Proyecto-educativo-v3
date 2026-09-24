import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
        recentEntries: [],
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
  beforeEach(() => localStorage.removeItem('aulabase:home-shortcuts'))

  it('shows the redesigned dashboard with live data and empty states', () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    )

    expect(screen.getByText('Tu agenda')).toBeInTheDocument()
    expect(screen.getByText('No hay clases programadas para hoy.')).toBeInTheDocument()
    expect(screen.getByText('Actividad de prueba')).toBeInTheDocument()
    expect(screen.getByText('Asistencia semanal')).toBeInTheDocument()
    expect(screen.getByText('miércoles, 2 de septiembre')).toBeInTheDocument()
    expect(screen.getByText('Aún no has registrado asistencia')).toBeInTheDocument()
    expect(screen.getByText('Bitácora docente')).toBeInTheDocument()
    expect(screen.getByText('2 anotaciones · 1 seguimientos pendientes')).toBeInTheDocument()
  })

  it('lets the teacher open pending tasks and add a quick link', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('tab', { name: 'Pendientes (0)' }))
    expect(screen.getByText('No tienes pendientes abiertos.')).toBeInTheDocument()

    await user.click(screen.getByText('Agregar'))
    await user.click(screen.getByRole('button', { name: 'Estudiantes' }))
    expect(screen.getByRole('link', { name: 'Estudiantes' })).toHaveAttribute(
      'href',
      '/estudiantes',
    )
  })
})
