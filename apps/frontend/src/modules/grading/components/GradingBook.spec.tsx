import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StrictMode, type ComponentProps } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { GradingActivity, StudentGradeRow } from '@/modules/grading/types'
import { ActivitySavedDialog, GradingBook } from './GradingBook'

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

function renderBook(overrides: Partial<ComponentProps<typeof GradingBook>> = {}, options?: { strict?: boolean }) {
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
  const book = <GradingBook {...props} />
  return render(options?.strict ? <StrictMode>{book}</StrictMode> : book)
}

describe('GradingBook', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('ofrece acciones contextuales después de crear una actividad', async () => {
    const user = userEvent.setup()
    const onGrade = vi.fn()
    const onReturn = vi.fn()
    const onView = vi.fn()
    const onCreateAnother = vi.fn()
    render(
      <ActivitySavedDialog
        completion={{ kind: 'created', activity: activities[0], updated: false }}
        returnLabel="Volver a la asignatura"
        onClose={vi.fn()}
        onCreateAnother={onCreateAnother}
        onGrade={onGrade}
        onReturn={onReturn}
        onView={onView}
      />,
    )

    expect(screen.getByRole('dialog', { name: 'Actividad creada correctamente' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Calificar ahora' }))
    await user.click(screen.getByRole('button', { name: 'Volver a la asignatura' }))
    await user.click(screen.getByRole('button', { name: 'Ver actividad' }))
    await user.click(screen.getByRole('button', { name: 'Crear otra actividad' }))

    expect(onGrade).toHaveBeenCalledOnce()
    expect(onReturn).toHaveBeenCalledOnce()
    expect(onView).toHaveBeenCalledOnce()
    expect(onCreateAnother).toHaveBeenCalledOnce()
  })

  it('abre el selector de bloque y mantiene accesibles los borradores', async () => {
    const user = userEvent.setup()
    renderBook({ initialActivityAction: 'create' })

    expect(screen.getByRole('heading', { name: 'Actividades' })).toBeInTheDocument()
    expect(screen.getByText('Elige el bloque de competencias para tu nueva actividad.')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Crear actividad' })).toHaveLength(4)
    expect(screen.getByText('Sin borradores pendientes')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Borradores' }))
    expect(screen.getByRole('heading', { name: 'Borradores de actividades' })).toBeInTheDocument()
    expect(screen.getByText('Aún no tienes borradores')).toBeInTheDocument()
    expect(screen.queryByPlaceholderText('Buscar borradores...')).not.toBeInTheDocument()
  })

  it('abre directamente el creador cuando el acceso ya incluye un bloque', () => {
    const { container } = renderBook({ initialActivityAction: 'create', initialActivityBlockId: 'b3' }, { strict: true })

    expect(screen.getByRole('heading', { name: 'Crear actividad' })).toBeInTheDocument()
    expect(container.querySelector('[data-competency-block-id="b3"]')).toBeInTheDocument()
    expect(screen.getAllByText('Ética y Ciudadana y Desarrollo Personal y Espiritual')).toHaveLength(2)
    expect(screen.queryByText('Elige el bloque de competencias para tu nueva actividad.')).not.toBeInTheDocument()
  })

  it('usa un único filtro de bloque para los borradores', async () => {
    const user = userEvent.setup()
    const baseDraft = {
      maxScore: '',
      date: '',
      description: '',
      studentRole: '',
      teacherRole: '',
      instrumentType: '',
      evaluationTechnique: '',
      instrumentCompleted: false,
      instrumentFields: {},
      resources: [],
      planningMoment: '',
      observations: '',
      activityType: '',
      updatedAt: '2026-07-18T12:00:00.000Z',
    }
    window.localStorage.setItem('grading-activity-drafts:1ro A · Lengua Española:P1', JSON.stringify({
      b1: [{ ...baseDraft, draftId: 'draft-b1', competencyBlockId: 'b1', name: 'Borrador comunicativo' }],
      b2: [{ ...baseDraft, draftId: 'draft-b2', competencyBlockId: 'b2', name: 'Borrador lógico' }],
    }))
    renderBook({ initialActivityAction: 'create' })

    await screen.findByText('Borradores pendientes')
    await user.click(screen.getByRole('button', { name: 'Borradores' }))

    expect(screen.getAllByRole('combobox')).toHaveLength(3)
    await user.click(screen.getByRole('button', { name: /Bloque 1/ }))
    expect(screen.getByText('Borrador comunicativo')).toBeInTheDocument()
    expect(screen.queryByText('Borrador lógico')).not.toBeInTheDocument()
  })

  it('mantiene el Bloque 4 sin sustituirlo por el Bloque 2', () => {
    const { container } = renderBook({ initialActivityAction: 'create', initialActivityBlockId: 'b4' }, { strict: true })

    expect(container.querySelector('[data-competency-block-id="b4"]')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Científica y Tecnológica y Ambiental y de la Salud' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Pensamiento Lógico, Creativo y Crítico y Resolución de Problemas' })).not.toBeInTheDocument()
  })

  it('explica el estado pendiente sin mostrar una puntuación vacía', () => {
    renderBook()

    expect(screen.getByText('Pendiente de calificar')).toBeInTheDocument()
    expect(screen.getAllByText('Aún sin actividades')).toHaveLength(3)
    expect(screen.queryByText('— puntos obtenidos de 100')).not.toBeInTheDocument()
  })

  it('mantiene accesibles las vistas principales y de resultados', async () => {
    const user = userEvent.setup()
    renderBook()

    const blocksTab = screen.getByRole('button', { name: 'Bloques' })
    const periodTab = screen.getByRole('button', { name: 'Período' })
    const annualTab = screen.getByRole('button', { name: 'Matriz anual' })
    const finalTab = screen.getByRole('button', { name: 'Resumen final' })
    const tabIndicator = document.querySelector<HTMLElement>('.grading-tab-indicator')
    expect(blocksTab).toHaveAttribute('aria-current', 'page')
    expect(tabIndicator).toHaveStyle({ transform: 'translateX(0%)' })

    await user.click(periodTab)
    expect(periodTab).toHaveAttribute('aria-current', 'page')
    expect(screen.getByText('Pendiente de calificar')).toBeInTheDocument()

    await user.click(annualTab)
    expect(await screen.findByRole('heading', { name: 'Registro anual de competencias' })).toBeInTheDocument()

    await user.click(finalTab)
    expect(await screen.findByText('Aún no hay resultado anual')).toBeInTheDocument()
    expect(tabIndicator).toHaveStyle({ transform: 'translateX(300%)' })

    await user.click(blocksTab)
    expect(blocksTab).toHaveAttribute('aria-current', 'page')

    await user.click(screen.getByRole('button', { name: /Abrir bloque 1:/ }))

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
    await user.click(screen.getByRole('button', { name: 'Calificar' }))
    expect(screen.getByRole('button', { name: 'Evaluación' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Resultados' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Detalles' }))
    expect(screen.getAllByText('Propósito: argumentar con evidencia.')).toHaveLength(2)
    expect(screen.queryByText(/\*\*Propósito/)).not.toBeInTheDocument()
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

  it('distingue una nota pendiente de una nota cero en la matriz anual', async () => {
    renderBook({
      initialView: 'annual',
      getActivitiesForPeriod: vi.fn().mockReturnValue(activities),
    })

    expect(await screen.findByRole('heading', { name: 'Registro anual de competencias' })).toBeInTheDocument()
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })
})
