import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ReportsPage } from './ReportsPage'

const mocks = vi.hoisted(() => ({
  getReportSummary: vi.fn(),
  createReportExport: vi.fn(),
}))

vi.mock('@/modules/auth/hooks/useAuth', () => ({
  useAuth: () => ({ schoolId: 'school-1' }),
}))

vi.mock('@/modules/reports/services/reportExportService', () => ({
  getReportSummary: mocks.getReportSummary,
  createReportExport: mocks.createReportExport,
}))

describe('ReportsPage', () => {
  beforeEach(() => {
    mocks.getReportSummary.mockResolvedValue({
      schoolYearName: '2026-2027',
      totals: { students: 0, attendanceRate: null, academicAverage: null, promoted: 0 },
      attendanceByMonth: [],
      performanceByGrade: [],
      promotion: { promoted: 0, pending: 0, retained: 0 },
      generatedAt: '2026-08-16T12:00:00.000Z',
    })
  })

  it('concentrates exports in a single actions menu', async () => {
    const user = userEvent.setup()
    render(<ReportsPage />)

    expect(screen.queryByText('Reportes que sí cuentan la historia')).not.toBeInTheDocument()
    expect(screen.queryByRole('dialog', { name: 'Exportar reportes' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /acciones/i }))

    expect(screen.getByRole('dialog', { name: 'Exportar reportes' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Reporte' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Formato' })).toBeInTheDocument()
  })
})
