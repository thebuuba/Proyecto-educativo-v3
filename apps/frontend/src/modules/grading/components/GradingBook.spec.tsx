import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { describe, expect, it, vi } from 'vitest'

import type { GradingActivity, StudentGradeRow } from '@/modules/grading/types'
import { GradingBook } from './GradingBook'

const students: StudentGradeRow[] = [
  {
    enrollmentId: 'enrollment-1',
    studentId: 'student-1',
    studentCode: 'EST-001',
    listNumber: 1,
    firstName: 'Ana',
    lastName: 'Pérez',
  },
]

const activities: GradingActivity[] = [
  {
    id: 'activity-1',
    name: 'Debate del ecosistema',
    competencyBlockId: 'b1',
    maxScore: 25,
    description: '**Propósito:** argumentar con evidencia.',
    instrumentType: 'Rúbrica',
  },
]

function renderBook(overrides: Partial<ComponentProps<typeof GradingBook>> = {}) {
  const props: ComponentProps<typeof GradingBook> = {
    students,
    activities,
    records: [],
    recoveryScores: {},
    periodName: 'P1 — Agosto, septiembre y octubre',
    periodShortName: 'P1',
    recoveryLabel: 'RP1',
    courseTitle: '1ro A · Lengua Española',
    saving: false,
    cellSaveStates: {},
    onAddActivity: vi.fn().mockResolvedValue(undefined),
    onUpdateActivity: vi.fn().mockResolvedValue(undefined),
    onDeleteActivity: vi.fn().mockResolvedValue(undefined),
    onSaveScore: vi.fn().mockResolvedValue(undefined),
    onSaveRecovery: vi.fn().mockResolvedValue(undefined),
    loadFinalRecords: vi.fn().mockResolvedValue(new Map()),
    getActivitiesForPeriod: vi.fn().mockReturnValue([]),
    ...overrides,
  }
  return render(<GradingBook {...props} />)
}

describe('GradingBook', () => {
  it('convierte todos los tabs del bloque y de la actividad en vistas navegables', async () => {
    const user = userEvent.setup()
    renderBook()

    const blocksTab = screen.getByRole('tab', { name: 'Bloques' })
    const periodTab = screen.getByRole('tab', { name: 'Período' })
    const annualTab = screen.getByRole('tab', { name: 'Matriz anual' })
    const finalTab = screen.getByRole('tab', { name: 'Resumen final' })
    expect(blocksTab).toHaveAttribute('aria-selected', 'true')

    await user.click(periodTab)
    expect(screen.getByRole('heading', { name: 'P1 — Agosto, septiembre y octubre' })).toBeInTheDocument()

    periodTab.focus()
    await user.keyboard('{ArrowRight}')
    expect(annualTab).toHaveAttribute('aria-selected', 'true')
    expect(await screen.findByRole('heading', { name: 'Registro anual de competencias' })).toBeInTheDocument()

    await user.click(finalTab)
    expect(await screen.findByText('Resultado anual')).toBeInTheDocument()

    await user.click(blocksTab)
    expect(screen.getByRole('heading', { name: 'Bloques de competencias' })).toBeInTheDocument()

    await user.click(screen.getAllByRole('button', { name: 'Ver bloque' })[0])

    const matrixTab = screen.getByRole('tab', { name: 'Matriz de calificaciones' })
    const activitiesTab = screen.getByRole('tab', { name: 'Actividades' })
    const studentsTab = screen.getByRole('tab', { name: 'Estudiantes' })
    const statsTab = screen.getByRole('tab', { name: 'Estadísticas del bloque' })
    expect(matrixTab).toHaveAttribute('aria-selected', 'true')

    await user.click(activitiesTab)
    expect(screen.getByRole('heading', { name: 'Actividades del bloque' })).toBeInTheDocument()

    activitiesTab.focus()
    await user.keyboard('{ArrowRight}')
    expect(studentsTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('heading', { name: 'Estudiantes del bloque' })).toBeInTheDocument()

    await user.click(statsTab)
    expect(screen.getByRole('heading', { name: 'Estadísticas del bloque' })).toBeInTheDocument()

    await user.click(activitiesTab)
    await user.click(screen.getByRole('button', { name: /Debate del ecosistema/ }))
    expect(screen.getAllByText('Propósito: argumentar con evidencia.')).toHaveLength(2)
    expect(screen.queryByText(/\*\*Propósito/)).not.toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Información' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Calificaciones' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Evidencias / Observaciones' })).toBeInTheDocument()
  })

  it('muestra un error anual recuperable y permite reintentar', async () => {
    const user = userEvent.setup()
    const loadFinalRecords = vi.fn()
      .mockRejectedValueOnce(new Error('Servicio temporalmente no disponible'))
      .mockResolvedValueOnce(new Map())
    renderBook({ initialView: 'annual', loadFinalRecords })

    expect(await screen.findByRole('alert')).toHaveTextContent('Servicio temporalmente no disponible')
    await user.click(screen.getByRole('button', { name: 'Reintentar' }))

    await waitFor(() => expect(loadFinalRecords).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument())
    expect(screen.getByRole('heading', { name: 'Registro anual de competencias' })).toBeInTheDocument()
  })
})
