import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import { DashboardPage } from './DashboardPage'

vi.mock('@/modules/dashboard/hooks/useDashboard', () => ({
  useDashboard: () => ({
    data: {
      context: { firstName: 'Ada', formattedDate: '', schoolYearName: '2026-2027', periodName: 'P1' },
      nextClass: null,
      todayAgenda: [],
      weeklyAttendance: {
        average: null,
        trendPercent: null,
        activityCount: 0,
        days: ['LUN', 'MAR', 'MIE', 'JUE', 'VIE'].map((label) => ({ label, value: null, isToday: false })),
      },
      tasks: [],
      recentActivity: [],
      smartSuggestion: null,
      setupProgress: {
        courseCount: 1,
        studentCount: 1,
        activeEnrollments: 1,
        scheduleEntryCount: 1,
        attendanceCount: 0,
        planningCount: 1,
      },
    },
    error: null,
    loading: false,
    actionLoading: false,
    addTask: vi.fn(),
    completeTask: vi.fn(),
  }),
}))

describe('DashboardPage', () => {
  it('shows the weekly attendance chart before the first record is created', () => {
    render(<MemoryRouter><DashboardPage /></MemoryRouter>)

    expect(screen.getByText('Pulso semanal')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Aún no hay registros de asistencia esta semana.' })).toBeInTheDocument()
    expect(screen.getByText('Aún no has registrado asistencia esta semana')).toBeInTheDocument()
    expect(screen.getByText('0 registros creados')).toBeInTheDocument()
  })
})
