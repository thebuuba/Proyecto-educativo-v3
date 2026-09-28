import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StrictMode, type ComponentProps } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { GradingActivity, StudentGradeRow } from '@/modules/grading/types'
import { ActivitySavedDialog, GradingBook, activityRubricConfiguration } from './GradingBook'
import { api } from '@/services/apiClient'
import type { InstrumentRecommendation } from '@aula/shared'

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

const gradingStudents: StudentGradeRow[] = [
  students[0],
  { enrollmentId: 'enrollment-2', studentId: 'student-2', studentCode: 'EST-002', listNumber: 2, firstName: 'Luis', lastName: 'Gómez' },
  { enrollmentId: 'enrollment-3', studentId: 'student-3', studentCode: 'EST-003', listNumber: 3, firstName: 'María', lastName: 'Santos' },
]

const activities: GradingActivity[] = [
  {
    id: 'activity-1',
    name: 'Debate del ecosistema',
    competencyBlockId: 'b1',
    maxScore: 25,
    description: '**Propósito:** argumentar con evidencia.',
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
    onSaveScore: vi.fn().mockResolvedValue(true),
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

  it('usa los criterios reales de una lista de cotejo al evaluar', () => {
    const configuration = activityRubricConfiguration({
      ...activities[0],
      instrumentType: 'lista-cotejo',
      instrumentCriteria: {
        'lista-cotejo:meta:criteriaCount': '2',
        'lista-cotejo:criterion:0': 'Presenta evidencia verificable',
        'lista-cotejo:points:0': '15',
        'lista-cotejo:criterion:1': 'Explica la conclusion',
        'lista-cotejo:points:1': '10',
        'lista-cotejo:meta:yesLabel': 'Cumple',
        'lista-cotejo:meta:noLabel': 'Aun no',
      },
    })

    expect(configuration.criteria).toEqual([
      expect.objectContaining({ title: 'Presenta evidencia verificable', maximum: 15 }),
      expect.objectContaining({ title: 'Explica la conclusion', maximum: 10 }),
    ])
    expect(configuration.levels.map((level) => level.label)).toEqual(['Cumple', 'Aun no'])
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

  it('abre el selector de bloque sin mostrar borradores dentro de Evaluación', () => {
    renderBook({ initialActivityAction: 'create' })

    expect(screen.getByRole('heading', { name: 'Actividades' })).toBeInTheDocument()
    expect(screen.getByText('Elige el bloque de competencias para tu nueva actividad.')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Crear actividad' })).toHaveLength(4)
    expect(screen.queryByText(/borradores pendientes/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Borradores' })).not.toBeInTheDocument()
    expect(screen.queryByPlaceholderText('Buscar borradores...')).not.toBeInTheDocument()
  })

  it('abre el creador y permite sumar otros bloques de competencias', async () => {
    const user = userEvent.setup()
    const { container } = renderBook({ initialActivityAction: 'create', initialActivityBlockId: 'b3' }, { strict: true })

    expect(screen.getByRole('heading', { name: 'Crear actividad' })).toBeInTheDocument()
    expect(container.querySelector('[data-competency-block-id="b3"]')).toBeInTheDocument()
    expect(screen.getAllByText('Ética y Ciudadana y Desarrollo Personal y Espiritual')).toHaveLength(3)
    expect(screen.queryByText('Elige el bloque de competencias para tu nueva actividad.')).not.toBeInTheDocument()

    const primaryBlock = screen.getByRole('checkbox', { name: /Bloque 3/i })
    expect(primaryBlock).toBeChecked()
    expect(primaryBlock).toBeDisabled()
    await user.click(screen.getByRole('checkbox', { name: /Bloque 2/i }))
    expect(screen.getByText('¿Cómo se distribuye la calificación?')).toBeInTheDocument()
  })

  it('abre directamente la matriz preparada y permite editar sus celdas', async () => {
    const proposal: InstrumentRecommendation = { kind: 'RECOMMENDATION', catalogVersion: 'evaluation-2026.1',
      instrumentType: 'rubrica', confidence: 'LOW', activityType: 'OTHER', evidenceTypes: ['PERFORMANCE'],
      participationMode: 'INDIVIDUAL', curriculumVersionId: null, curriculumScopeId: null, selectedCurriculumElements: [],
      criteria: [{ id: 'c1', title: 'Comunicación', description: 'Explica con claridad.', maxScore: 20, maxScoreUnits: 2000,
        sourceType: 'ACTIVITY_TEMPLATE', sourceReferences: [], templateId: 'communication',
        descriptors: [{ levelId: 'L4', text: 'Explica con mucha claridad.', scoreUnits: 2000 }, { levelId: 'L3', text: 'Explica con claridad.', scoreUnits: 1333 },
          { levelId: 'L2', text: 'Explica parcialmente.', scoreUnits: 667 }, { levelId: 'L1', text: 'Requiere ayuda.', scoreUnits: 0 }] }],
      levels: [{ id: 'L4', label: 'Excelente', proportion: 1 }, { id: 'L3', label: 'Bien', proportion: 2 / 3 },
        { id: 'L2', label: 'En proceso', proportion: 1 / 3 }, { id: 'L1', label: 'Inicio', proportion: 0 }],
      totalScore: 20, totalScoreUnits: 2000, scoreUnit: 0.01,
      internalTrace: { mappingStatus: 'NO_PUBLISHED_VERSION', reasons: [], ruleId: 'x', activityTypeOrigin: 'DETECTED', ranking: [],
        curriculumStatus: null, lowCurriculumConfidence: true, consideredTypes: [] } }
    const post = vi.spyOn(api, 'post').mockImplementation(async path => path.includes('/interpret') ? {
      suggestedActivityType: 'OTHER', activityType: 'OTHER', activityTypes: ['OTHER'], curriculumVersionId: null,
      curriculumScopeId: null, curriculumCandidates: [], curriculumMatch: 'NONE', message: 'Sin referente literal.',
    } as never : proposal as never)
    const user = userEvent.setup()
    renderBook({ sectionSubjectId: 'ss-1', initialActivityAction: 'create', initialActivityBlockId: 'b1' })
    await user.type(screen.getByPlaceholderText('Ej: Exposición oral sobre el cambio climático'), 'Actividad 1')
    await user.type(screen.getByPlaceholderText('20'), '20')
    await user.click(screen.getByRole('button', { name: /Individual/ }))
    await user.click(screen.getByRole('button', { name: 'Continuar al instrumento' }))
    await waitFor(() => expect(screen.getByText(/Instrumento preparado:/)).toBeInTheDocument())
    expect(screen.getByText(/1 criterios · 4 niveles · 20 puntos/)).toBeInTheDocument()
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(document.querySelector('.prepared-instrument-basic .rubric-editor-table')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Configuración avanzada' }))
    expect(document.querySelector('.prepared-instrument-basic')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Ocultar configuración avanzada' }))
    expect(screen.getByRole('textbox', { name: 'Excelente del criterio 1' })).toHaveValue('Explica con mucha claridad.')
    expect(screen.getByRole('spinbutton', { name: 'Puntos del criterio 1' })).toHaveValue(20)
    expect(screen.getByText(/Preparado según el tipo de actividad y la asignatura/)).toBeInTheDocument()
    await user.clear(screen.getByRole('textbox', { name: 'Criterio 1' }))
    await user.type(screen.getByRole('textbox', { name: 'Criterio 1' }), 'Comprensión del tema')
    expect(screen.getByRole('textbox', { name: 'Criterio 1' })).toHaveValue('Comprensión del tema')
    await user.clear(screen.getByRole('textbox', { name: 'Excelente del criterio 1' }))
    await user.type(screen.getByRole('textbox', { name: 'Excelente del criterio 1' }), 'Explica el tema con precisión.')
    await user.click(screen.getByRole('button', { name: 'Continuar a revisión' }))
    await user.click(screen.getByRole('button', { name: 'Ver rúbrica completo' }))
    expect(screen.getByText('Explica el tema con precisión.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Cerrar vista previa' }))
    expect(post).toHaveBeenCalledWith('/evaluation-instruments/recommend', expect.objectContaining({ activityTitle: 'Actividad 1', maxScore: 20, preferredInstrumentType: undefined, pedagogicalActivityType: undefined }))
    await user.click(screen.getByRole('button', { name: /Datos de la actividad/ }))
    await user.clear(screen.getByPlaceholderText('Ej: Exposición oral sobre el cambio climático'))
    await user.type(screen.getByPlaceholderText('Ej: Exposición oral sobre el cambio climático'), 'Exposición sobre el sistema respiratorio')
    await user.click(screen.getByRole('button', { name: 'Continuar al instrumento' }))
    await user.click(screen.getByRole('button', { name: 'Regenerar con los nuevos datos' }))
    await waitFor(() => expect(post.mock.calls.filter(([path]) => path === '/evaluation-instruments/recommend')).toHaveLength(2))
    expect(post.mock.calls.filter(([path]) => path === '/evaluation-instruments/recommend')[1][1]).toEqual(expect.objectContaining({
      activityTitle: 'Exposición sobre el sistema respiratorio', pedagogicalActivityType: undefined, preferredInstrumentType: undefined,
    }))
    post.mockRestore()
  })

  it('mantiene disponible el constructor manual si falla la recomendación', async () => {
    const post = vi.spyOn(api, 'post').mockRejectedValue(new Error('Sin conexión de prueba'))
    const user = userEvent.setup()
    renderBook({ sectionSubjectId: 'ss-1', initialActivityAction: 'create', initialActivityBlockId: 'b1' })
    await user.type(screen.getByPlaceholderText('Ej: Exposición oral sobre el cambio climático'), 'Exposición de prueba')
    await user.type(screen.getByPlaceholderText('20'), '20')
    await user.click(screen.getByRole('button', { name: /Individual/ }))
    await user.click(screen.getByRole('button', { name: 'Continuar al instrumento' }))
    await waitFor(() => expect(screen.getByText('Sin conexión de prueba')).toBeInTheDocument())
    expect(screen.getByText(/No pudimos preparar el instrumento automáticamente/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Intentar de nuevo' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Crear manualmente' })).toBeInTheDocument()
    expect(screen.getByText(/Si prefieres continuar manualmente/)).toBeInTheDocument()
    await user.selectOptions(screen.getByLabelText(/Si prefieres continuar manualmente/), 'lista-cotejo')
    expect(screen.getByText(/Construye el instrumento que utilizarás/)).toBeInTheDocument()
    post.mockRestore()
  })

  it.each(['Continuar al instrumento', 'tab'])('muestra y enfoca el valor faltante desde %s', async (action) => {
    const user = userEvent.setup()
    const scroll = vi.fn()
    const prior = Element.prototype.scrollIntoView
    Element.prototype.scrollIntoView = scroll
    try {
      renderBook({ sectionSubjectId: 'ss-1', initialActivityAction: 'create', initialActivityBlockId: 'b1' })
      await user.type(screen.getByPlaceholderText('Ej: Exposición oral sobre el cambio climático'), 'Actividad de prueba')
      await user.click(action === 'tab' ? screen.getByRole('button', { name: /Instrumento de evaluación/ }) : screen.getByRole('button', { name: 'Continuar al instrumento' }))
      expect(screen.getByRole('alert')).toHaveTextContent('Indica el valor de la actividad para preparar el instrumento.')
      const value = screen.getByRole('spinbutton', { name: /Valor en puntos/ })
      await waitFor(() => expect(value).toHaveFocus())
      expect(value).toHaveAttribute('aria-invalid', 'true')
      expect(scroll).toHaveBeenCalled()
    } finally { Element.prototype.scrollIntoView = prior }
  })

  it('explica la falta de asignatura en vez de dejar Instrumento vacío', async () => {
    const user = userEvent.setup()
    renderBook({ initialActivityAction: 'create', initialActivityBlockId: 'b4' })
    await user.type(screen.getByPlaceholderText('Ej: Exposición oral sobre el cambio climático'), 'Actividad 1')
    await user.type(screen.getByPlaceholderText('20'), '20')
    await user.click(screen.getByRole('button', { name: /Individual/ }))
    await user.click(screen.getByRole('button', { name: 'Continuar al instrumento' }))
    expect(screen.getByText(/No se pudo identificar la asignatura/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Crear manualmente' })).toBeInTheDocument()
  })

  it('no expone borradores guardados dentro del hub de Evaluación', () => {
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

    expect(screen.queryByText('Borrador comunicativo')).not.toBeInTheDocument()
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
    expect(screen.getByRole('heading', { name: 'P1' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'C1' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'C4' })).toBeInTheDocument()

    await user.click(annualTab)
    expect(await screen.findByRole('heading', { name: 'Registro anual de competencias' })).toBeInTheDocument()

    await user.click(finalTab)
    expect(await screen.findByText('Aún no hay resultado anual')).toBeInTheDocument()
    expect(tabIndicator).toHaveStyle({ transform: 'translateX(300%)' })

    await user.click(blocksTab)
    expect(blocksTab).toHaveAttribute('aria-current', 'page')

    await user.click(screen.getByRole('button', { name: /Abrir bloque 1:/ }))

    const matrixTab = screen.getByRole('tab', { name: 'Calificaciones' })
    const activitiesTab = screen.getByRole('tab', { name: 'Actividades' })
    const studentsTab = screen.getByRole('tab', { name: 'Estudiantes' })
    const statsTab = screen.getByRole('tab', { name: 'Análisis' })
    expect(matrixTab).toHaveAttribute('aria-selected', 'true')

    await user.click(activitiesTab)
    expect(screen.getByRole('heading', { name: 'Actividades del bloque' })).toBeInTheDocument()

    activitiesTab.focus()
    await user.keyboard('{ArrowRight}')
    expect(studentsTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('heading', { name: 'Estudiantes del bloque' })).toBeInTheDocument()

    await user.click(statsTab)
    expect(screen.getByRole('heading', { name: 'Análisis del bloque' })).toBeInTheDocument()

    await user.click(activitiesTab)
    await user.click(screen.getByRole('button', { name: 'Calificar' }))
    expect(screen.getByRole('button', { name: 'Evaluación' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Resultados' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Detalles' }))
    expect(screen.getAllByText('Propósito: argumentar con evidencia.')).toHaveLength(2)
    expect(screen.queryByText(/\*\*Propósito/)).not.toBeInTheDocument()
  })

  it('restaura el borrador solicitado desde Actividades', async () => {
    window.localStorage.setItem('grading-activity-drafts:1ro A · Lengua Española:P1', JSON.stringify({
      b1: [{ draftId: 'draft-requested', competencyBlockId: 'b1', name: 'Exposición pendiente', maxScore: '25', date: '', description: '', studentRole: '', teacherRole: '', instrumentType: '', evaluationTechnique: '', instrumentCompleted: false, instrumentFields: {}, resources: [], planningMoment: '', observations: '', activityType: '', teamIds: [] }],
    }))

    renderBook({ initialActivityAction: 'create', initialActivityBlockId: 'b1', initialActivityDraftId: 'draft-requested' })

    expect(await screen.findByDisplayValue('Exposición pendiente')).toBeInTheDocument()
  })

  it('reutiliza el modal de actividad con una acción visible para calificar', async () => {
    const user = userEvent.setup()
    renderBook()

    await user.click(screen.getByRole('button', { name: /Abrir bloque 1:/ }))
    await user.click(screen.getByRole('tab', { name: 'Actividades' }))
    await user.click(screen.getByRole('button', { name: /Ver información de Debate del ecosistema/ }))

    const dialog = screen.getByRole('dialog', { name: 'Detalle de la actividad' })
    expect(dialog).toBeInTheDocument()
    expect(within(dialog).getByRole('button', { name: 'Calificar' })).toBeVisible()
  })

  it('permite calificar una lista completa con Enter, cero y vacío sin solicitudes duplicadas', async () => {
    const user = userEvent.setup()
    const onSaveScore = vi.fn()
    renderBook({
      students: gradingStudents,
      initialActivityId: 'activity-1',
      initialActivityMode: 'evaluate',
      onSaveScore,
      records: [
        { id: 'grade-1', enrollmentId: 'enrollment-1', score: 18, maxScore: 25, weight: 1, assessmentName: 'Actividad', status: 'draft', evaluationActivityId: 'activity-1' },
        { id: 'grade-2', enrollmentId: 'enrollment-2', score: 15, maxScore: 25, weight: 1, assessmentName: 'Actividad', status: 'draft', evaluationActivityId: 'activity-1' },
      ],
    })

    const ana = screen.getByRole('spinbutton', { name: /Nota de Ana Pérez/ })
    const luis = screen.getByRole('spinbutton', { name: /Nota de Luis Gómez/ })
    const maria = screen.getByRole('spinbutton', { name: /Nota de María Santos/ })
    expect(screen.getByText('2 evaluados')).toBeInTheDocument()
    expect(screen.getByText('1 pendientes')).toBeInTheDocument()
    expect(screen.getByText('Promedio 16.5')).toBeInTheDocument()

    await user.clear(ana)
    await user.type(ana, '16{Enter}')
    expect(luis).toHaveFocus()
    expect(onSaveScore).toHaveBeenCalledWith('enrollment-1', activities[0], '16', null)

    await user.clear(luis)
    await user.tab()
    expect(onSaveScore).toHaveBeenCalledWith('enrollment-2', activities[0], '', null)

    await user.type(maria, '0')
    await user.tab()
    expect(onSaveScore).toHaveBeenCalledWith('enrollment-3', activities[0], '0', null)
    expect(onSaveScore).toHaveBeenCalledTimes(3)
  })

  it('muestra un error local de guardado con opción clara de reintento', () => {
    renderBook({
      initialActivityId: 'activity-1',
      initialActivityMode: 'evaluate',
      cellSaveStates: { 'enrollment-1:activity:activity-1': 'error' },
    })

    expect(screen.getByText('Error al guardar · Reintenta')).toBeInTheDocument()
    expect(screen.getByRole('spinbutton', { name: /Nota de Ana Pérez/ })).toHaveAttribute('aria-invalid', 'true')
  })

  it('abre directamente el instrumento, persiste la observación y avanza al guardar', async () => {
    const user = userEvent.setup()
    const onSaveScore = vi.fn().mockResolvedValue(true)
    const rubricActivity: GradingActivity = {
      ...activities[0],
      instrumentType: 'rubrica',
      instrumentCriteria: {
        'rubrica:meta:criteriaCount': '1',
        'rubrica:meta:levelCount': '2',
        'rubrica:criterion:0': 'Explica el sistema solar',
        'rubrica:descriptor:0:2': 'Explica con precisión y evidencia.',
        'rubrica:descriptor:0:1': 'Explica parcialmente.',
        'rubrica:points:0': '25',
        'rubrica:level-name:2': 'Excelente',
        'rubrica:level-name:1': 'En proceso',
        'rubrica:level-points:2': '5',
        'rubrica:level-points:1': '2',
      },
    }
    renderBook({ activities: [rubricActivity], students: gradingStudents, initialActivityId: rubricActivity.id, initialActivityMode: 'evaluate', onSaveScore })

    expect(screen.queryByText('Entrada rápida de notas')).not.toBeInTheDocument()
    expect(screen.getByText(/Explica el sistema solar/)).toBeInTheDocument()
    expect(screen.getAllByText('Explica con precisión y evidencia.').length).toBeGreaterThan(0)
    expect(screen.getByText('Explica parcialmente.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Explica el sistema solar: Excelente' }))
    await user.type(screen.getByRole('textbox', { name: 'Observación (opcional)' }), 'Buen dominio del tema')
    await user.click(screen.getByRole('button', { name: 'Guardar y siguiente →' }))

    await waitFor(() => expect(onSaveScore).toHaveBeenCalledWith('enrollment-1', rubricActivity, '25', expect.objectContaining({ observation: 'Buen dominio del tema' })))
    expect(screen.getByRole('combobox')).toHaveValue('1')
    expect(screen.getByRole('button', { name: 'Guardar y siguiente →' })).toBeInTheDocument()
    expect(screen.queryByText('Guardando…')).not.toBeInTheDocument()
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
