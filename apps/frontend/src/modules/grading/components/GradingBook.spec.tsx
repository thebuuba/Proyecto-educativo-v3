import { readActivityDraftsForContext, writeActivityDrafts } from '@/modules/activities/utils/activityDraftStorage'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StrictMode, type ComponentProps } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { GradingActivity, StudentGradeRow } from '@/modules/grading/types'
import { ActivitySavedDialog, GradingBook, activityRubricConfiguration } from './GradingBook'
import { api, ApiError } from '@/services/apiClient'
import { editableFallbackRecommendation, preparationFingerprint, recommendationToFields } from '@/modules/activities/services/instrumentPreparation'
import { primaryEvaluationProfile } from '@aula/shared'

vi.mock('@/modules/grading/components/ActivityDescriptionEditor', () => ({
  ActivityDescriptionEditor: ({ value, onChange }: { value: string; onChange: (value: string) => void }) =>
    <textarea aria-label="Descripción de la actividad" value={value} onChange={event => onChange(event.target.value)} />,
}))


const draftContext = {schoolId:'school',userId:'user',schoolYearId:'year',sectionSubjectId:'subject',academicPeriodId:'period'}
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
    activityDraftContext: draftContext,
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

function seededInstrumentDraft(id: string, type: 'rubrica' | 'lista-cotejo' | 'escala' | 'lista-ponderada' = 'rubrica') {
  const original = editableFallbackRecommendation({ activityTitle: 'Informe de lectura de un cuento',
    description: 'Elaborarán un informe de lectura con resumen, personajes y conclusión.', maxScore: 20,
    instrumentType: type, participationMode: 'INDIVIDUAL', activityType: 'READING_REPORT_WRITING', secondaryLanguageGrade: 1 })
  const proposal = { ...original, catalogVersion: 'test-catalog' }
  const draft = { draftId: id, name: 'Informe de lectura de un cuento', maxScore: '20', competencyBlockId: 'b1',
    competencyBlockWeights: { b1: 1 }, date: '', description: 'Elaborarán un informe de lectura con resumen, personajes y conclusión.',
    studentRole: '', teacherRole: '', instrumentType: type, evaluationTechnique: 'analisis-producciones', pedagogicalActivityType: 'READING_REPORT_WRITING',
    autoDetectedPedagogicalActivityType: true, instrumentCompleted: true,
    instrumentFields: recommendationToFields(proposal, 'Informe de lectura de un cuento'), preparedRecommendation: proposal,
    preparedManuallyEdited: false, resources: [], planningMoment: '', observations: '', activityType: 'individual', teamIds: [] }
  writeActivityDrafts(draftContext, JSON.parse(JSON.stringify({ b1: [{ ...draft, preparedFingerprint: preparationFingerprint(draft) }] })), {courseTitle:'1ro A · Lengua Española',periodShortName:'P1'})
  return { draft, proposal }
}

describe('GradingBook', () => {
  it('redistributes No aplica exactly and blocks an evaluation with every criterion excluded', async () => {
    const onSaveScore = vi.fn().mockResolvedValue(true)
    const activity: GradingActivity = {id:'na',name:'Lista contextual',competencyBlockId:'b1',maxScore:20,instrumentType:'lista-cotejo',instrumentCriteria:{
      'lista-cotejo:meta:criteriaCount':'3','lista-cotejo:meta:noApply':'true',
      'lista-cotejo:criterion:0':'A','lista-cotejo:points:0':'6.67',
      'lista-cotejo:criterion:1':'B','lista-cotejo:points:1':'6.67',
      'lista-cotejo:criterion:2':'C','lista-cotejo:points:2':'6.66',
    }}
    renderBook({activities:[activity],students:gradingStudents,onSaveScore,initialActivityId:'na',initialActivityMode:'evaluate'})
    const user=userEvent.setup()
    for(const criterion of ['A','B','C']) await user.click(screen.getByRole('button',{name:`${criterion}: No aplica`}))
    expect(screen.getByRole('alert')).toHaveTextContent('Todos los criterios')
    expect(screen.getByRole('button',{name:'Guardar y siguiente →'})).toBeDisabled()
    await user.click(screen.getByRole('button',{name:'B: Sí'}))
    await user.click(screen.getByRole('button',{name:'C: No'}))
    await user.click(screen.getByRole('button',{name:'Guardar y siguiente →'}))
    await waitFor(()=>expect(onSaveScore).toHaveBeenCalledOnce())
    expect(onSaveScore.mock.calls[0][3]).toMatchObject({selections:[-1,0,1],criterionScores:[0,10.01,0],applicableMaximums:[0,10.01,9.99]})
    expect(onSaveScore.mock.calls[0][2]).toBe('10.01')
  })
  beforeEach(() => {
    window.localStorage.clear()
  })
  afterEach(() => { vi.restoreAllMocks() })

  it('abre las opciones de cálculo cuando se solicita desde configuración', () => {
    renderBook({ initialConfigOpen: true })
    expect(screen.getByRole('dialog', { name: 'Configurar cálculo' })).toBeInTheDocument()
  })

  it('muestra cinco tarjetas y el instrumento completo sin fecha ni momento de clase', async () => {
    const user = userEvent.setup()
    renderBook({ initialActivityAction: 'create', initialActivityBlockId: 'b1' })
    for (const title of ['1. Bloques de competencias', '2. Actividad', '3. Modalidad', '4. Evaluación', '5. Recursos']) {
      expect(screen.getByText(title)).toBeInTheDocument()
    }
    expect(screen.getByText(/6. Instrumento completo/)).toBeInTheDocument()
    expect(screen.queryByText('Fecha de realización')).not.toBeInTheDocument()
    expect(screen.queryByText('Momento de la clase')).not.toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /Bloque 1/i })).toBeChecked()
    expect(screen.getAllByRole('checkbox', { name: /Bloque [1-4]/i })).toHaveLength(4)
    await user.click(screen.getByRole('checkbox', { name: /Bloque 2/i }))
    expect(screen.getByRole('checkbox', { name: /Bloque 2/i })).toBeChecked()
  })

  it('prepara sin puntaje y redistribuye al escribir 20, 30 y 17.35 sin regenerar el contenido', async () => {
    const post = vi.spyOn(api, 'post').mockRejectedValue(new ApiError(503, 'Servicio no disponible'))
    renderBook({ secondSecondaryLanguage: true, sectionSubjectId: 'second-language-1', initialActivityAction: 'create', initialActivityBlockId: 'b1' })
    const score = screen.getByRole('textbox', { name: /Valor en puntos/ })
    expect(score).toHaveValue('')
    fireEvent.change(screen.getByPlaceholderText('Ej: Exposición oral sobre el cambio climático'), { target: { value: 'La noticia' } })
    fireEvent.change(screen.getByRole('textbox', { name: 'Descripción de la actividad' }), {
      target: { value: 'Los estudiantes redactarán una noticia sobre educación con titular, entrada y cuerpo.' },
    })
    await waitFor(() => expect(screen.getByRole('textbox', { name: 'Criterio 1' })).toHaveValue('Información esencial de la noticia'), { timeout: 8000 })
    expect(screen.getByRole('combobox', { name: 'Tipo de actividad' })).toHaveValue('NEWS_WRITING')
    expect(screen.getByRole('combobox', { name: /Técnica de evaluación/ })).toHaveValue('analisis-producciones')
    expect(screen.getByRole('combobox', { name: 'Tipo de instrumento' })).toHaveValue('rubrica')
    expect(screen.queryByText('Puntaje pendiente')).not.toBeInTheDocument()
    await userEvent.setup().click(screen.getByRole('button', { name: 'Vista previa' }))
    const preview = screen.getByRole('dialog', { name: /Vista previa de rúbrica/ })
    expect(within(preview).queryByText(/\b(?:20|0) puntos\b/)).not.toBeInTheDocument()
    expect(within(preview).getByText(/Puntuación máxima: — pts/)).toBeInTheDocument()
    await userEvent.setup().click(within(preview).getByRole('button', { name: 'Cerrar vista previa' }))
    const criterion = screen.getByRole('textbox', { name: 'Criterio 1' })
    fireEvent.change(criterion, { target: { value: 'Información esencial editada' } })
    const requestCount = post.mock.calls.filter(([path]) => path === '/evaluation-instruments/recommend').length
    for (const total of ['20', '30', '17.35']) {
      fireEvent.change(score, { target: { value: total } })
      await waitFor(() => expect(screen.getByText(`Puntuación máxima total: ${total} / ${total} pts`)).toBeInTheDocument())
      expect(criterion).toHaveValue('Información esencial editada')
    }
    const decimalInput = score as HTMLInputElement
    fireEvent.change(score, { target: { value: '17' } })
    decimalInput.focus()
    decimalInput.setSelectionRange(2, 2)
    await userEvent.setup().type(score, '.35')
    expect(score).toHaveValue('17.35')
    expect(decimalInput.selectionStart).toBe(5)
    expect(score).toHaveFocus()
    expect(screen.getByText('Puntuación máxima total: 17.35 / 17.35 pts')).toBeInTheDocument()
    expect(post.mock.calls.filter(([path]) => path === '/evaluation-instruments/recommend')).toHaveLength(requestCount)
    fireEvent.change(score, { target: { value: '' } })
    expect(score).toHaveValue('')
    expect(criterion).toHaveValue('Información esencial editada')
    expect(screen.queryByText('Puntaje pendiente')).not.toBeInTheDocument()
    await userEvent.setup().click(screen.getByRole('button', { name: 'Guardar' }))
    expect(screen.getByRole('dialog', { name: 'Actividad incompleta' })).toBeInTheDocument()
  }, 15000)

  it('recupera un borrador pendiente sin restaurar el total de una respuesta atrasada', async () => {
    const proposal = editableFallbackRecommendation({ activityTitle: 'La noticia', description: 'Redactarán una noticia sobre educación.',
      maxScore: 20, instrumentType: 'rubrica', participationMode: 'INDIVIDUAL' })
    let finish!: (value: unknown) => void
    const delayed = new Promise(resolve => { finish = resolve })
    vi.spyOn(api, 'post').mockImplementation(path => path === '/evaluation-instruments/recommend'
      ? delayed as never : Promise.reject(new ApiError(503, 'Servicio no disponible')))
    const view = renderBook({ secondSecondaryLanguage: true, sectionSubjectId: 'second-language-1', initialActivityAction: 'create', initialActivityBlockId: 'b1' })
    fireEvent.change(screen.getByPlaceholderText('Ej: Exposición oral sobre el cambio climático'), { target: { value: 'La noticia' } })
    fireEvent.change(screen.getByRole('textbox', { name: 'Descripción de la actividad' }), { target: { value: 'Redactarán una noticia sobre educación.' } })
    await waitFor(() => expect(api.post).toHaveBeenCalledWith('/evaluation-instruments/recommend', expect.anything()), { timeout: 8000 })
    const score = screen.getByRole('textbox', { name: /Valor en puntos/ })
    fireEvent.change(score, { target: { value: '20' } })
    fireEvent.change(score, { target: { value: '' } })
    await act(async () => { finish(proposal); await delayed })
    await waitFor(() => expect(screen.getByRole('textbox', { name: 'Criterio 1' })).toHaveValue('Información esencial'))
    expect(score).toHaveValue('')
    expect(screen.queryByText('Puntaje pendiente')).not.toBeInTheDocument()
    const stored = JSON.parse(JSON.stringify(readActivityDraftsForContext(draftContext)) || '{}')
    expect(stored.b1?.[0]).toEqual(expect.objectContaining({ maxScore: '' }))
    expect(stored.b1?.[0]?.instrumentFields['rubrica:points:0']).toBe('')
    expect(stored.b1?.[0]?.preparedRecommendation.totalScoreUnits).toBe(0)
    const draftId = stored.b1[0].draftId as string
    view.unmount()
    renderBook({ secondSecondaryLanguage: true, sectionSubjectId: 'second-language-1', initialActivityAction: 'create', initialActivityBlockId: 'b1', initialActivityDraftId: draftId })
    expect(screen.getByRole('textbox', { name: /Valor en puntos/ })).toHaveValue('')
    expect(screen.getByRole('textbox', { name: 'Criterio 1' })).toHaveValue('Información esencial')
  }, 15000)

  it('conserva los 20 puntos de un borrador anterior con la huella de preparación antigua', async () => {
    vi.spyOn(api, 'post').mockRejectedValue(new ApiError(503, 'Servicio no disponible'))
    const proposal = editableFallbackRecommendation({ activityTitle: 'La noticia', description: 'Redactar una noticia.',
      maxScore: 20, instrumentType: 'rubrica', participationMode: 'INDIVIDUAL' })
    const draft = { draftId: 'legacy-score', name: 'La noticia', description: 'Redactar una noticia.', maxScore: '20',
      competencyBlockId: 'b1', competencyBlockWeights: { b1: 1 }, activityType: 'individual', teamIds: [],
      instrumentType: 'rubrica', evaluationTechnique: 'analisis-producciones', pedagogicalActivityType: 'NEWS_WRITING',
      instrumentFields: recommendationToFields(proposal, 'La noticia'), instrumentCompleted: true, preparedRecommendation: proposal,
      resources: [], studentRole: '', teacherRole: '', planningMoment: '', observations: '', date: '' }
    const oldFingerprint = JSON.stringify([draft.name, draft.description, draft.maxScore, draft.pedagogicalActivityType,
      draft.activityType, draft.instrumentType, []])
    writeActivityDrafts(draftContext, JSON.parse(JSON.stringify({ b1: [{ ...draft, preparedFingerprint: oldFingerprint }] })), {courseTitle:'1ro A · Lengua Española',periodShortName:'P1'})
    renderBook({ secondSecondaryLanguage: true, sectionSubjectId: 'second-language-1', initialActivityAction: 'create',
      initialActivityBlockId: 'b1', initialActivityDraftId: 'legacy-score' })
    expect(screen.getByRole('textbox', { name: /Valor en puntos/ })).toHaveValue('20')
    expect(screen.getByRole('textbox', { name: 'Criterio 1' })).toHaveValue(proposal.criteria[0].title)
    expect(screen.queryByText(/La actividad cambió. Actualiza el instrumento/)).not.toBeInTheDocument()
  })

  it('guarda y reabre un instrumento editado después de cambiar el total a 30', async () => {
    vi.spyOn(api, 'post').mockRejectedValue(new ApiError(503, 'Servicio no disponible'))
    const proposal = editableFallbackRecommendation({ activityTitle: 'La noticia', description: 'Redactar una noticia.',
      maxScore: 20, instrumentType: 'rubrica', participationMode: 'INDIVIDUAL' })
    const draft = { draftId: 'rescore-save', name: 'La noticia', description: 'Redactar una noticia.', maxScore: '20',
      competencyBlockId: 'b1', competencyBlockWeights: { b1: 1 }, activityType: 'individual', teamIds: [],
      instrumentType: 'rubrica', evaluationTechnique: 'analisis-producciones', pedagogicalActivityType: 'NEWS_WRITING',
      instrumentFields: recommendationToFields(proposal, 'La noticia'), instrumentCompleted: true, preparedRecommendation: proposal,
      resources: [], studentRole: '', teacherRole: '', planningMoment: '', observations: '', date: '' }
    writeActivityDrafts(draftContext, JSON.parse(JSON.stringify({ b1: [{ ...draft,
      preparedFingerprint: preparationFingerprint(draft) }] })), {courseTitle:'1ro A · Lengua Española',periodShortName:'P1'})
    const onAddActivity = vi.fn().mockImplementation(async activity => ({ ...activity, id: 'rescored' }))
    const view = renderBook({ secondSecondaryLanguage: true, sectionSubjectId: 'second-language-1', initialActivityAction: 'create',
      initialActivityBlockId: 'b1', initialActivityDraftId: 'rescore-save', onAddActivity })
    const criterion = screen.getByRole('textbox', { name: 'Criterio 1' })
    fireEvent.change(criterion, { target: { value: 'Criterio editado por docente' } })
    const score = screen.getByRole('textbox', { name: /Valor en puntos/ })
    score.focus()
    fireEvent.change(score, { target: { value: '30' } })
    await waitFor(() => expect(screen.getByText('Puntuación máxima total: 30 / 30 pts')).toBeInTheDocument())
    expect(score).toHaveFocus()
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }))
    const user = userEvent.setup()
    await user.click(within(screen.getByRole('dialog', { name: 'Resumen de la actividad' })).getByRole('button', { name: 'Confirmar y guardar' }))
    await waitFor(() => expect(onAddActivity).toHaveBeenCalledTimes(1))
    const saved = onAddActivity.mock.calls[0][0] as GradingActivity
    expect(saved.maxScore).toBe(30)
    expect(saved.instrumentCriteria?.['rubrica:criterion:0']).toBe('Criterio editado por docente')
    expect(Array.from({ length: Number(saved.instrumentCriteria?.['rubrica:meta:criteriaCount']) }, (_, index) =>
      Math.round(Number(saved.instrumentCriteria?.[`rubrica:points:${index}`]) * 100)).reduce((sum, value) => sum + value, 0)).toBe(3000)
    view.unmount()
    renderBook({ secondSecondaryLanguage: true, sectionSubjectId: 'second-language-1', activities: [{ ...saved, id: 'rescored' }],
      initialActivityId: 'rescored', initialActivityMode: 'edit' })
    expect(screen.getByRole('textbox', { name: /Valor en puntos/ })).toHaveValue('30')
    expect(screen.getByRole('textbox', { name: 'Criterio 1' })).toHaveValue('Criterio editado por docente')
  }, 15000)

  it('recalcula los cuatro formatos al escribir 20, 30 y 17.35 sin perder el foco ni la entrada parcial', async () => {
    vi.spyOn(api, 'post').mockRejectedValue(new ApiError(503, 'Servicio no disponible'))
    renderBook({ secondSecondaryLanguage: true, sectionSubjectId: 'second-language-1', initialActivityAction: 'create', initialActivityBlockId: 'b1' })
    fireEvent.change(screen.getByPlaceholderText('Ej: Exposición oral sobre el cambio climático'), { target: { value: 'La noticia' } })
    fireEvent.change(screen.getByRole('textbox', { name: 'Descripción de la actividad' }), { target: { value: 'Redactarán una noticia sobre educación.' } })
    const user = userEvent.setup()
    const instrument = screen.getByRole('combobox', { name: 'Tipo de instrumento' })
    await waitFor(() => expect(screen.getByRole('textbox', { name: 'Criterio 1' })).toHaveValue('Información esencial de la noticia'), { timeout: 8000 })
    const storedDraft = () => JSON.parse(JSON.stringify(readActivityDraftsForContext(draftContext)) || '{}').b1?.[0]
    const score = screen.getByRole('textbox', { name: /Valor en puntos/ }) as HTMLInputElement
    const totals = (type: string) => {
      const fields = storedDraft().instrumentFields as Record<string, string>
      const count = Number(fields[`${type}:meta:criteriaCount`])
      return Array.from({ length: count }, (_, index) => Math.round(Number(fields[`${type}:points:${index}`]) * 100))
        .reduce((sum, value) => sum + value, 0)
    }
    for (const type of ['lista-cotejo', 'escala', 'lista-ponderada', 'rubrica']) {
      await user.selectOptions(instrument, type)
      await waitFor(() => expect(storedDraft()?.instrumentFields[`${type}:meta:scorePending`]).toBe('true'))
      const firstCriterion = storedDraft()?.instrumentFields[`${type}:criterion:0`]
      expect(firstCriterion).toBeTruthy()
      expect(storedDraft()?.maxScore).toBe('')
      await user.click(screen.getByRole('button', { name: 'Vista previa' }))
      const preview = screen.getByRole('dialog', { name: /Vista previa de/ })
      expect(within(preview).getByText(/Puntuación máxima: — pts/)).toBeInTheDocument()
      await user.click(within(preview).getByRole('button', { name: 'Cerrar vista previa' }))
      score.focus()
      for (const [value, units] of [['20', 2000], ['30', 3000], ['17', 1700], ['17.3', 1730], ['17.35', 1735]] as const) {
        fireEvent.change(score, { target: { value } })
        await waitFor(() => expect(totals(type)).toBe(units))
        expect(score).toHaveFocus()
        expect(score).toHaveValue(value)
        expect(storedDraft()?.instrumentFields[`${type}:criterion:0`]).toBe(firstCriterion)
      }
      fireEvent.change(score, { target: { value: '17.' } })
      expect(score).toHaveValue('17.')
      await waitFor(() => expect(storedDraft()?.instrumentFields[`${type}:meta:scorePending`]).toBe('true'))
      expect(storedDraft()?.preparedRecommendation.totalScoreUnits).toBe(0)
      fireEvent.change(score, { target: { value: '17.35' } })
      await waitFor(() => expect(totals(type)).toBe(1735))
      fireEvent.change(score, { target: { value: '' } })
      await waitFor(() => expect(storedDraft()?.instrumentFields[`${type}:meta:scorePending`]).toBe('true'))
      expect(score).toHaveValue('')
      expect(storedDraft()?.preparedRecommendation.totalScoreUnits).toBe(0)
      expect(storedDraft()?.instrumentFields[`${type}:criterion:0`]).toBe(firstCriterion)
    }
  }, 20000)

  it('preserva pesos relativos y descriptores manuales al actualizar el total sin salir del campo', async () => {
    const { proposal } = seededInstrumentDraft('manual-weights')
    expect(proposal.criteria).toHaveLength(6)
    renderBook({ initialActivityAction: 'create', initialActivityBlockId: 'b1', initialActivityDraftId: 'manual-weights' })
    const firstCriterion = screen.getByRole('textbox', { name: 'Criterio 1' })
    fireEvent.change(firstCriterion, { target: { value: 'Criterio con peso mayor' } })
    for (let index = 0; index < 6; index++) {
      fireEvent.change(screen.getByRole('spinbutton', { name: 'Puntos del criterio ' + (index + 1) }), {
        target: { value: index === 0 ? '10' : '2' },
      })
    }
    const before = readActivityDraftsForContext(draftContext).b1![0].instrumentFields!
    const descriptor = before['rubrica:descriptor:0:4']
    expect(descriptor).toBeTruthy()
    const score = screen.getByRole('textbox', { name: /Valor en puntos/ })
    score.focus()
    fireEvent.change(score, { target: { value: '30' } })
    expect(score).toHaveFocus()
    expect(firstCriterion).toHaveValue('Criterio con peso mayor')
    await waitFor(() => expect(screen.getByRole('spinbutton', { name: 'Puntos del criterio 1' })).toHaveValue(15))
    for (let index = 1; index < 6; index++) {
      expect(screen.getByRole('spinbutton', { name: 'Puntos del criterio ' + (index + 1) })).toHaveValue(3)
    }
    expect(readActivityDraftsForContext(draftContext).b1![0].instrumentFields!['rubrica:descriptor:0:4']).toBe(descriptor)
  })

  it('presenta tres bloques cuando el perfil es de primaria', () => {
    renderBook({ evaluationProfile: primaryEvaluationProfile, initialActivityAction: 'create', initialActivityBlockId: 'b1' })
    expect(screen.getAllByRole('checkbox', { name: /Bloque [1-4]/i })).toHaveLength(3)
    expect(screen.queryByRole('checkbox', { name: /Bloque 4/i })).not.toBeInTheDocument()
  })

  it('aplica las tres sugerencias en sus campos y conserva elecciones manuales independientes', async () => {
    vi.spyOn(api, 'post').mockImplementation(async (path, body) => {
      if (path !== '/evaluation-instruments/interpret') throw new Error('Ruta inesperada')
      const analysis = String((body as { activityTitle: string }).activityTitle).includes('Analizar')
      return { suggestedActivityType: analysis ? 'NEWS_ANALYSIS' : 'NEWS_WRITING',
        suggestedEvaluationTechnique: analysis ? 'observacion-sistematica' : 'analisis-producciones',
        suggestedInstrumentType: analysis ? 'lista-cotejo' : 'rubrica', activityType: analysis ? 'NEWS_ANALYSIS' : 'NEWS_WRITING',
        activityTypes: [], curriculumVersionId: null, curriculumScopeId: null, curriculumCandidates: [], curriculumMatch: 'NONE', message: 'Mensaje interno.' } as never
    })
    const user = userEvent.setup()
    renderBook({ firstSecondaryLanguage: true, sectionSubjectId: 'ss-1', initialActivityAction: 'create', initialActivityBlockId: 'b1' })
    const title = screen.getByPlaceholderText('Ej: Exposición oral sobre el cambio climático')
    const technique = screen.getByRole('combobox', { name: /Técnica de evaluación/ })
    const activity = screen.getByRole('combobox', { name: 'Tipo de actividad' })
    const instrument = screen.getByRole('combobox', { name: 'Tipo de instrumento' })
    fireEvent.change(title, { target: { value: 'Redactar una noticia' } })
    await waitFor(() => expect(instrument).toHaveValue('rubrica'))
    expect(technique).toHaveValue('analisis-producciones')
    expect(activity).toHaveValue('NEWS_WRITING')
    expect(screen.queryByText('Mensaje interno.')).not.toBeInTheDocument()
    await user.selectOptions(instrument, 'escala')
    await waitFor(() => expect(instrument).toHaveValue('escala'))
    fireEvent.change(title, { target: { value: 'Analizar una noticia' } })
    await waitFor(() => expect(activity).toHaveValue('NEWS_ANALYSIS'))
    expect(technique).toHaveValue('observacion-sistematica')
    expect(instrument).toHaveValue('escala')
  })

  it.each([
    ['La noticia', 'Los estudiantes redactarán una noticia sobre una situación de su comunidad, con titular, entrada y cuerpo', 'NEWS_WRITING', 'analisis-producciones', 'rubrica', 'Información esencial de la noticia'],
    ['Lo que ocurre en el mundo', 'Leerán una noticia sobre inmigración, identificarán sus partes y explicarán el hecho con evidencias del texto', 'NEWS_ANALYSIS', 'observacion-sistematica', 'lista-cotejo', 'Explica el propósito informativo y el hecho central de la noticia sobre inmigración'],
    ['Dos versiones de un hecho', 'Compararán dos noticias sobre el mismo acontecimiento y justificarán sus semejanzas y diferencias', 'NEWS_COMPARISON', 'analisis-producciones', 'rubrica', 'Hecho y propósito'],
    ['Nuestro noticiero', 'Presentarán oralmente una noticia sobre educación, explicando qué ocurrió, a quién, dónde, cuándo y cómo', 'NEWSCAST', 'exposicion', 'rubrica', 'Contenido de la noticia presentada'],
    ['Una noticia para debatir', 'Debatirán sobre el hecho presentado en una noticia, argumentando sus posturas con evidencias', 'DEBATE', 'debate', 'rubrica', 'Comprensión del hecho'],
  ])('sugiere %s en 2.º y prepara una alternativa contextual cuando falla el servicio', async (title, description, expectedType, technique, instrument, criterion) => {
    vi.spyOn(api, 'post').mockRejectedValue(new ApiError(503, 'Servicio no disponible'))
    renderBook({ secondSecondaryLanguage: true, sectionSubjectId: 'second-language-1', initialActivityAction: 'create', initialActivityBlockId: 'b1' })
    fireEvent.change(screen.getByPlaceholderText('Ej: Exposición oral sobre el cambio climático'), { target: { value: title } })
    fireEvent.change(screen.getByRole('textbox', { name: 'Descripción de la actividad' }), { target: { value: description } })
    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Tipo de actividad' })).toHaveValue(expectedType))
    expect(screen.getByRole('combobox', { name: /Técnica de evaluación/ })).toHaveValue(technique)
    expect(screen.getByRole('combobox', { name: 'Tipo de instrumento' })).toHaveValue(instrument)
    await waitFor(() => expect(((instrument === 'lista-cotejo' ? screen.getByPlaceholderText('1. Criterio')
      : screen.getByRole('textbox', { name: 'Criterio 1' })) as HTMLTextAreaElement).value).toContain(criterion), { timeout: 8000 })
  }, 12000)

  it('cambia a escala manual en 2.º aunque falle la preparación remota y conserva el formato', async () => {
    vi.spyOn(api, 'post').mockRejectedValue(new ApiError(503, 'Servicio no disponible'))
    renderBook({ secondSecondaryLanguage: true, sectionSubjectId: 'second-language-1', initialActivityAction: 'create', initialActivityBlockId: 'b1' })
    fireEvent.change(screen.getByPlaceholderText('Ej: Exposición oral sobre el cambio climático'), { target: { value: 'La noticia' } })
    const description = screen.getByRole('textbox', { name: 'Descripción de la actividad' })
    fireEvent.change(description, { target: { value: 'Redactarán una noticia sobre educación con titular, entrada y cuerpo.' } })
    const user = userEvent.setup()
    const instrument = screen.getByRole('combobox', { name: 'Tipo de instrumento' })
    await waitFor(() => expect(screen.getByRole('textbox', { name: 'Criterio 1' })).toHaveValue('Información esencial de la noticia'), { timeout: 8000 })
    await user.selectOptions(instrument, 'escala')
    await waitFor(() => expect(instrument).toHaveValue('escala'))
    await waitFor(() => expect((screen.getAllByPlaceholderText('Indicador')[0] as HTMLTextAreaElement).value).toContain('Redacta el hecho noticioso sobre educación'))
    fireEvent.change(description, { target: { value: 'Redactarán una noticia sobre salud con titular, entrada y cuerpo.' } })
    await waitFor(() => expect(instrument).toHaveValue('escala'))
    expect(screen.getByRole('combobox', { name: 'Tipo de actividad' })).toHaveValue('NEWS_WRITING')
  }, 15000)

  it('protege las tres elecciones manuales de 2.º al cambiar la descripción y reactiva la detección', async () => {
    vi.spyOn(api, 'post').mockRejectedValue(new ApiError(503, 'Servicio no disponible'))
    renderBook({ secondSecondaryLanguage: true, sectionSubjectId: 'second-language-1', initialActivityAction: 'create', initialActivityBlockId: 'b1' })
    fireEvent.change(screen.getByPlaceholderText('Ej: Exposición oral sobre el cambio climático'), { target: { value: 'La noticia' } })
    const description = screen.getByRole('textbox', { name: 'Descripción de la actividad' })
    fireEvent.change(description, { target: { value: 'Redactarán una noticia sobre educación.' } })
    const activity = screen.getByRole('combobox', { name: 'Tipo de actividad' })
    const technique = screen.getByRole('combobox', { name: /Técnica de evaluación/ })
    const instrument = screen.getByRole('combobox', { name: 'Tipo de instrumento' })
    await waitFor(() => expect(activity).toHaveValue('NEWS_WRITING'))
    const user = userEvent.setup()
    await user.selectOptions(activity, 'DEBATE')
    await user.selectOptions(technique, 'debate')
    await user.selectOptions(instrument, 'escala')
    fireEvent.change(description, { target: { value: 'Leerán una noticia sobre educación y analizarán su estructura.' } })
    await waitFor(() => expect(activity).toHaveValue('DEBATE'))
    expect(technique).toHaveValue('debate')
    expect(instrument).toHaveValue('escala')
    await user.selectOptions(activity, '')
    await user.selectOptions(technique, '')
    await user.selectOptions(instrument, '')
    await waitFor(() => expect(activity).toHaveValue('NEWS_ANALYSIS'))
    expect(technique).toHaveValue('observacion-sistematica')
    expect(instrument).toHaveValue('lista-cotejo')
  }, 15000)

  it('conserva tipo, técnica e instrumento de 2.º en resumen, guardado y reapertura', async () => {
    vi.spyOn(api, 'post').mockRejectedValue(new ApiError(503, 'Servicio no disponible'))
    const title = 'La noticia'
    const description = 'Redactarán una noticia sobre educación con titular, entrada y cuerpo.'
    writeActivityDrafts(draftContext, JSON.parse(JSON.stringify({ b1: [{
      draftId: 'second-news-draft', name: title, description, maxScore: '20', competencyBlockId: 'b1', competencyBlockWeights: { b1: 1 },
      activityType: 'individual', teamIds: [], instrumentType: '', evaluationTechnique: '', instrumentFields: {}, instrumentCompleted: false,
      resources: [], studentRole: '', teacherRole: '', planningMoment: '', observations: '', date: '',
    }] })), {courseTitle:'1ro A · Lengua Española',periodShortName:'P1'})
    const onAddActivity = vi.fn().mockImplementation(async activity => ({ ...activity, id: 'saved-news' }))
    const view = renderBook({ secondSecondaryLanguage: true, sectionSubjectId: 'second-language-1', initialActivityAction: 'create',
      initialActivityBlockId: 'b1', initialActivityDraftId: 'second-news-draft', onAddActivity })
    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Tipo de actividad' })).toHaveValue('NEWS_WRITING'))
    await waitFor(() => expect(screen.getByRole('textbox', { name: 'Criterio 1' })).toHaveValue('Información esencial de la noticia'))
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Guardar' }))
    const summary = screen.getByRole('dialog', { name: 'Resumen de la actividad' })
    expect(within(summary).getByText('Redacción de noticia')).toBeInTheDocument()
    expect(within(summary).getByText('Análisis de producciones')).toBeInTheDocument()
    await user.click(within(summary).getByRole('button', { name: 'Confirmar y guardar' }))
    await waitFor(() => expect(onAddActivity).toHaveBeenCalledTimes(1))
    const saved = onAddActivity.mock.calls[0][0] as GradingActivity
    expect(saved).toEqual(expect.objectContaining({ pedagogicalActivityType: 'NEWS_WRITING', evaluationTechnique: 'analisis-producciones', instrumentType: 'rubrica' }))
    view.unmount()
    renderBook({ secondSecondaryLanguage: true, sectionSubjectId: 'second-language-1', activities: [{ ...saved, id: 'saved-news' }],
      initialActivityId: 'saved-news', initialActivityMode: 'edit' })
    expect(await screen.findByRole('combobox', { name: 'Tipo de actividad' })).toHaveValue('NEWS_WRITING')
    expect(screen.getByRole('combobox', { name: /Técnica de evaluación/ })).toHaveValue('analisis-producciones')
    expect(screen.getByRole('combobox', { name: 'Tipo de instrumento' })).toHaveValue('rubrica')
  }, 15000)

  it('muestra las tres recomendaciones del catálogo también fuera de Lengua Española de 1.º', async () => {
    vi.spyOn(api, 'post').mockImplementation(async path => {
      if (path !== '/evaluation-instruments/interpret') throw new Error('Ruta inesperada')
      return { suggestedActivityType: 'EXPERIMENT', suggestedEvaluationTechnique: 'observacion-sistematica',
        suggestedInstrumentType: 'rubrica', activityType: 'EXPERIMENT', activityTypes: [], curriculumVersionId: null,
        curriculumScopeId: null, curriculumCandidates: [], curriculumMatch: 'NONE', message: '' } as never
    })
    renderBook({ sectionSubjectId: 'science-1', initialActivityAction: 'create', initialActivityBlockId: 'b1' })
    fireEvent.change(screen.getByPlaceholderText('Ej: Exposición oral sobre el cambio climático'), { target: { value: 'Experimento sobre la germinación' } })
    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Tipo de actividad' })).toHaveValue('EXPERIMENT'))
    expect(screen.getByRole('combobox', { name: /Técnica de evaluación/ })).toHaveValue('observacion-sistematica')
    expect(screen.getByRole('combobox', { name: 'Tipo de instrumento' })).toHaveValue('rubrica')
  })

  it('muestra Informe, Análisis de producciones y Rúbrica para la actividad de la captura en 2.º', async () => {
    vi.spyOn(api, 'post').mockRejectedValue(new ApiError(503, 'Servicio no disponible'))
    renderBook({ sectionSubjectId: 'second-language-1', initialActivityAction: 'create', initialActivityBlockId: 'b1' })
    fireEvent.change(screen.getByPlaceholderText('Ej: Exposición oral sobre el cambio climático'), {
      target: { value: 'Análisis y elaboración de un informe de lectura.' },
    })
    fireEvent.change(screen.getByRole('textbox', { name: 'Descripción de la actividad' }), {
      target: { value: 'Los estudiantes leerán un cuento y elaborarán un informe escrito con resumen, análisis y conclusión.' },
    })
    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Tipo de actividad' })).toHaveValue('REPORT'))
    expect(screen.getByRole('combobox', { name: /Técnica de evaluación/ })).toHaveValue('analisis-producciones')
    expect(screen.getByRole('combobox', { name: 'Tipo de instrumento' })).toHaveValue('rubrica')
    const user = userEvent.setup()
    const activity = screen.getByRole('combobox', { name: 'Tipo de actividad' })
    const technique = screen.getByRole('combobox', { name: /Técnica de evaluación/ })
    const instrument = screen.getByRole('combobox', { name: 'Tipo de instrumento' })
    await user.selectOptions(activity, 'ESSAY')
    await user.selectOptions(technique, 'debate')
    await user.selectOptions(instrument, 'escala')
    fireEvent.change(screen.getByRole('textbox', { name: 'Descripción de la actividad' }), {
      target: { value: 'Los estudiantes elaborarán un informe escrito sobre dos cuentos.' },
    })
    await waitFor(() => expect(activity).toHaveValue('ESSAY'))
    expect(technique).toHaveValue('debate')
    expect(instrument).toHaveValue('escala')
    await user.selectOptions(activity, '')
    await user.selectOptions(technique, '')
    await user.selectOptions(instrument, '')
    await waitFor(() => expect(activity).toHaveValue('REPORT'))
    expect(technique).toHaveValue('analisis-producciones')
    expect(instrument).toHaveValue('rubrica')
  })

  it('muestra y guarda las selecciones del informe aunque la preparación termine antes que la interpretación', async () => {
    const title = 'Informe de lectura de un cuento'
    const description = 'Los estudiantes seleccionarán un cuento corto de su preferencia, realizarán una lectura comprensiva y elaborarán un informe escrito en el que presentarán el título de la obra, su autor, un resumen de los acontecimientos principales, una descripción de los personajes y un análisis de los valores o situaciones sociales presentes en la historia. Finalmente, redactarán una conclusión expresando su interpretación personal del texto'
    const proposal = editableFallbackRecommendation({ activityTitle: title, description, activityType: 'READING_REPORT_WRITING', maxScore: 20, instrumentType: 'rubrica', participationMode: 'INDIVIDUAL' })
    let finishInterpretation!: (value: unknown) => void
    const interpretation = new Promise(resolve => { finishInterpretation = resolve })
    const post = vi.spyOn(api, 'post').mockImplementation(path => path === '/evaluation-instruments/interpret' ? interpretation as never : proposal as never)
    writeActivityDrafts(draftContext, JSON.parse(JSON.stringify({ b1: [{
      draftId: 'report-draft', name: title, description, maxScore: '20', competencyBlockId: 'b1', competencyBlockWeights: { b1: 1 },
      activityType: 'individual', teamIds: [], instrumentType: '', evaluationTechnique: '', instrumentFields: {}, instrumentCompleted: false,
      resources: [], studentRole: '', teacherRole: '', planningMoment: '', observations: '', date: '',
    }] })), {courseTitle:'1ro A · Lengua Española',periodShortName:'P1'})
    const onAddActivity = vi.fn().mockImplementation(async activity => ({ ...activity, id: 'saved-report' }))
    const view = renderBook({ firstSecondaryLanguage: true, sectionSubjectId: 'ss-1', initialActivityAction: 'create', initialActivityBlockId: 'b1', initialActivityDraftId: 'report-draft', onAddActivity })
    await waitFor(() => expect(post.mock.calls.some(([path]) => path === '/evaluation-instruments/recommend')).toBe(true), { timeout: 5000 })
    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Tipo de instrumento' })).toHaveValue('rubrica'))
    await waitFor(() => expect(screen.getByRole('button', { name: 'Generar nuevo instrumento' })).toBeInTheDocument())
    await act(async () => finishInterpretation({ suggestedActivityType: 'READING_REPORT_WRITING', suggestedEvaluationTechnique: 'analisis-producciones',
      suggestedInstrumentType: 'rubrica', activityType: 'READING_REPORT_WRITING', activityTypes: ['READING_REPORT_WRITING'],
      curriculumVersionId: null, curriculumScopeId: null, curriculumCandidates: [], curriculumMatch: 'NONE', message: 'Mensaje interno.' }))
    expect(screen.getByRole('combobox', { name: 'Tipo de actividad' })).toHaveValue('READING_REPORT_WRITING')
    expect(screen.getByRole('combobox', { name: /Técnica de evaluación/ })).toHaveValue('analisis-producciones')
    expect(screen.queryByText('Mensaje interno.')).not.toBeInTheDocument()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Guardar' }))
    const summary = screen.getByRole('dialog', { name: 'Resumen de la actividad' })
    expect(within(summary).getByText('Elaboración de informe de lectura')).toBeInTheDocument()
    expect(within(summary).getByText('Análisis de producciones')).toBeInTheDocument()
    await user.click(within(summary).getByRole('button', { name: 'Confirmar y guardar' }))
    await waitFor(() => expect(onAddActivity).toHaveBeenCalledTimes(1))
    const saved = onAddActivity.mock.calls[0][0] as GradingActivity
    expect(saved).toEqual(expect.objectContaining({ pedagogicalActivityType: 'READING_REPORT_WRITING', evaluationTechnique: 'analisis-producciones', instrumentType: 'rubrica' }))
    view.unmount()
    renderBook({ firstSecondaryLanguage: true, sectionSubjectId: 'ss-1', activities: [{ ...saved, id: 'saved-report' }], initialActivityId: 'saved-report', initialActivityMode: 'edit' })
    expect(await screen.findByRole('combobox', { name: 'Tipo de actividad' })).toHaveValue('READING_REPORT_WRITING')
    expect(screen.getByRole('combobox', { name: /Técnica de evaluación/ })).toHaveValue('analisis-producciones')
  }, 15000)

  it('actualiza los campos automáticos al editar la descripción, respeta elecciones manuales y permite reactivar la detección', async () => {
    const title = 'Informe de lectura de un cuento'
    const post = vi.spyOn(api, 'post').mockImplementation(async (path, body) => {
      if (path !== '/evaluation-instruments/interpret') throw new Error('Ruta inesperada')
      const comparison = String((body as { description: string }).description).includes('Compararán')
      return { suggestedActivityType: comparison ? 'READING_REPORT_COMPARISON' : 'READING_REPORT_WRITING',
        suggestedEvaluationTechnique: 'analisis-producciones', suggestedInstrumentType: 'rubrica',
        activityType: comparison ? 'READING_REPORT_COMPARISON' : 'READING_REPORT_WRITING', activityTypes: [],
        curriculumVersionId: null, curriculumScopeId: null, curriculumCandidates: [], curriculumMatch: 'NONE', message: '' } as never
    })
    writeActivityDrafts(draftContext, JSON.parse(JSON.stringify({ b1: [{
      draftId: 'description-draft', name: title, description: 'Elaborarán un informe de lectura.', maxScore: '',
      competencyBlockId: 'b1', competencyBlockWeights: { b1: 1 }, activityType: 'individual', teamIds: [],
      instrumentType: '', evaluationTechnique: '', instrumentFields: {}, instrumentCompleted: false,
      resources: [], studentRole: '', teacherRole: '', planningMoment: '', observations: '', date: '',
    }] })), {courseTitle:'1ro A · Lengua Española',periodShortName:'P1'})
    const user = userEvent.setup()
    renderBook({ firstSecondaryLanguage: true, sectionSubjectId: 'ss-1', initialActivityAction: 'create', initialActivityBlockId: 'b1', initialActivityDraftId: 'description-draft' })
    const activity = await screen.findByRole('combobox', { name: 'Tipo de actividad' })
    const technique = screen.getByRole('combobox', { name: /Técnica de evaluación/ })
    await waitFor(() => expect(activity).toHaveValue('READING_REPORT_WRITING'))
    const editor = screen.getByRole('textbox', { name: 'Descripción de la actividad' })
    fireEvent.change(editor, { target: { value: 'Compararán dos informes de lectura.' } })
    await waitFor(() => expect(activity).toHaveValue('READING_REPORT_COMPARISON'))
    await user.selectOptions(activity, 'READING_REPORT_ANALYSIS')
    await user.selectOptions(technique, 'debate')
    fireEvent.change(editor, { target: { value: 'Elaborarán un informe de lectura individual.' } })
    await waitFor(() => expect(post.mock.calls.filter(([path]) => path === '/evaluation-instruments/interpret').length).toBeGreaterThanOrEqual(3))
    expect(activity).toHaveValue('READING_REPORT_ANALYSIS')
    expect(technique).toHaveValue('debate')
    await user.selectOptions(activity, '')
    await user.selectOptions(technique, '')
    await waitFor(() => expect(activity).toHaveValue('READING_REPORT_WRITING'))
    expect(technique).toHaveValue('analisis-producciones')
  }, 15000)

  it('mantiene tipo y técnica contextuales si la interpretación remota falla', async () => {
    vi.spyOn(api, 'post').mockRejectedValue(new ApiError(503, 'Servicio no disponible'))
    writeActivityDrafts(draftContext, JSON.parse(JSON.stringify({ b1: [{
      draftId: 'offline-report', name: 'Informe de lectura de un cuento',
      description: 'Los estudiantes realizarán una lectura comprensiva y elaborarán un informe escrito con resumen y conclusión.',
      maxScore: '', competencyBlockId: 'b1', competencyBlockWeights: { b1: 1 }, activityType: 'individual', teamIds: [],
      instrumentType: '', evaluationTechnique: '', instrumentFields: {}, instrumentCompleted: false,
      resources: [], studentRole: '', teacherRole: '', planningMoment: '', observations: '', date: '',
    }] })), {courseTitle:'1ro A · Lengua Española',periodShortName:'P1'})
    renderBook({ firstSecondaryLanguage: true, sectionSubjectId: 'ss-1', initialActivityAction: 'create', initialActivityBlockId: 'b1', initialActivityDraftId: 'offline-report' })
    expect(await screen.findByRole('combobox', { name: 'Tipo de actividad' })).toHaveValue('')
    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Tipo de actividad' })).toHaveValue('READING_REPORT_WRITING'))
    expect(screen.getByRole('combobox', { name: /Técnica de evaluación/ })).toHaveValue('analisis-producciones')
    expect(screen.getByRole('combobox', { name: 'Tipo de instrumento' })).toHaveValue('rubrica')
    expect(screen.queryByText('Servicio no disponible')).not.toBeInTheDocument()
  })

  it('autocompleta los tres selectores al escribir el título y la descripción de la captura, sin puntos ni modalidad', async () => {
    vi.spyOn(api, 'post').mockRejectedValue(new ApiError(503, 'Servicio no disponible'))
    renderBook({ firstSecondaryLanguage: true, sectionSubjectId: 'ss-1', initialActivityAction: 'create', initialActivityBlockId: 'b1' })
    fireEvent.change(screen.getByPlaceholderText('Ej: Exposición oral sobre el cambio climático'), {
      target: { value: 'Análisis y elaboración de un informe de lectura.' },
    })
    fireEvent.change(screen.getByRole('textbox', { name: 'Descripción de la actividad' }), {
      target: { value: 'Los estudiantes seleccionarán un cuento corto, realizarán una lectura comprensiva y elaborarán un informe escrito con resumen, personajes, análisis de valores y una conclusión personal.' },
    })
    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Tipo de actividad' })).toHaveValue('READING_REPORT_WRITING'))
    expect(screen.getByRole('combobox', { name: /Técnica de evaluación/ })).toHaveValue('analisis-producciones')
    expect(screen.getByRole('combobox', { name: 'Tipo de instrumento' })).toHaveValue('rubrica')
    expect(screen.getByRole('textbox', { name: /Valor en puntos/ })).toHaveValue('')
    expect(screen.queryByText('Servicio no disponible')).not.toBeInTheDocument()
  })

  it('ignora una interpretación anterior cuando cambia el título', async () => {
    let resolveFirst!: (value: unknown) => void
    const first = new Promise(resolve => { resolveFirst = resolve })
    const result = (analysis: boolean) => ({ suggestedActivityType: analysis ? 'NEWS_ANALYSIS' : 'NEWS_WRITING',
      suggestedEvaluationTechnique: analysis ? 'observacion-sistematica' : 'analisis-producciones',
      suggestedInstrumentType: analysis ? 'lista-cotejo' : 'rubrica', activityType: analysis ? 'NEWS_ANALYSIS' : 'NEWS_WRITING',
      activityTypes: [], curriculumVersionId: null, curriculumScopeId: null, curriculumCandidates: [], curriculumMatch: 'NONE', message: '' })
    const post = vi.spyOn(api, 'post').mockImplementation((path, body) => {
      if (path !== '/evaluation-instruments/interpret') throw new Error('Ruta inesperada')
      return String((body as { activityTitle: string }).activityTitle).includes('Redactar') ? first as never : Promise.resolve(result(true)) as never
    })
    renderBook({ firstSecondaryLanguage: true, sectionSubjectId: 'ss-1', initialActivityAction: 'create', initialActivityBlockId: 'b1' })
    const title = screen.getByPlaceholderText('Ej: Exposición oral sobre el cambio climático')
    fireEvent.change(title, { target: { value: 'Redactar una noticia' } })
    await waitFor(() => expect(post).toHaveBeenCalledTimes(1))
    fireEvent.change(title, { target: { value: 'Analizar una noticia' } })
    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Tipo de actividad' })).toHaveValue('NEWS_ANALYSIS'))
    await act(async () => { resolveFirst(result(false)); await first })
    expect(screen.getByRole('combobox', { name: 'Tipo de instrumento' })).toHaveValue('lista-cotejo')
  })

  it('cambia el formato del instrumento sin cambiar técnica, actividad ni 17.35 puntos', async () => {
    const original = editableFallbackRecommendation({ activityTitle: 'Redactar una noticia', description: 'Redactar una noticia escolar.',
      activityType: 'NEWS_WRITING', maxScore: 17.35, instrumentType: 'rubrica', participationMode: 'INDIVIDUAL' })
    const draft = { draftId: 'format-draft', name: 'Redactar una noticia', maxScore: '17.35', competencyBlockId: 'b1', competencyBlockWeights: { b1: 1 }, date: '',
      description: 'Redactar una noticia escolar.', studentRole: '', teacherRole: '', instrumentType: 'rubrica', evaluationTechnique: 'analisis-producciones',
      pedagogicalActivityType: 'NEWS_WRITING', instrumentCompleted: true, instrumentFields: recommendationToFields(original, 'Redactar una noticia'),
      preparedRecommendation: original, preparedManuallyEdited: false, resources: [], planningMoment: '', observations: '', activityType: 'individual', teamIds: [] }
    writeActivityDrafts(draftContext, JSON.parse(JSON.stringify({ b1: [{ ...draft, preparedFingerprint: preparationFingerprint(draft) }] })), {courseTitle:'1ro A · Lengua Española',periodShortName:'P1'})
    vi.spyOn(api, 'post').mockImplementation(async path => path === '/evaluation-instruments/interpret'
      ? { suggestedActivityType: 'OTHER', activityType: 'OTHER', activityTypes: [], curriculumVersionId: null,
        curriculumScopeId: null, curriculumCandidates: [], curriculumMatch: 'NONE', message: '' } as never
      : editableFallbackRecommendation({ activityTitle: draft.name, description: draft.description, activityType: 'NEWS_WRITING',
        maxScore: 17.35, instrumentType: 'lista-cotejo', participationMode: 'INDIVIDUAL' }) as never)
    const user = userEvent.setup()
    renderBook({ firstSecondaryLanguage: true, sectionSubjectId: 'ss-1', initialActivityAction: 'create', initialActivityBlockId: 'b1', initialActivityDraftId: 'format-draft' })
    await user.selectOptions(await screen.findByRole('combobox', { name: 'Tipo de instrumento' }), 'lista-cotejo')
    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Tipo de instrumento' })).toHaveValue('lista-cotejo'))
    expect(screen.getByRole('combobox', { name: /Técnica de evaluación/ })).toHaveValue('analisis-producciones')
    expect(screen.getByRole('combobox', { name: 'Tipo de actividad' })).toHaveValue('NEWS_WRITING')
    expect(screen.getByRole('textbox', { name: /Valor en puntos/ })).toHaveValue('17.35')
  })

  it('pide confirmación antes de sustituir criterios editados al cambiar formato', async () => {
    const proposal = editableFallbackRecommendation({ activityTitle: 'Informe de lectura', description: 'Redactar un informe.', maxScore: 20, instrumentType: 'rubrica', participationMode: 'INDIVIDUAL' })
    const fields = recommendationToFields(proposal, 'Informe de lectura')
    fields['rubrica:criterion:0'] = 'Criterio ajustado por la docente'
    const draft = { draftId: 'edited-draft', name: 'Informe de lectura', maxScore: '20', competencyBlockId: 'b1', competencyBlockWeights: { b1: 1 }, date: '',
      description: 'Redactar un informe.', studentRole: '', teacherRole: '', instrumentType: 'rubrica', evaluationTechnique: 'analisis-producciones',
      instrumentCompleted: true, instrumentFields: fields, preparedRecommendation: proposal, preparedManuallyEdited: true,
      resources: [], planningMoment: '', observations: '', activityType: 'individual', teamIds: [] }
    writeActivityDrafts(draftContext, JSON.parse(JSON.stringify({ b1: [{ ...draft, preparedFingerprint: preparationFingerprint(draft) }] })), {courseTitle:'1ro A · Lengua Española',periodShortName:'P1'})
    const user = userEvent.setup()
    renderBook({ sectionSubjectId: 'ss-1', initialActivityAction: 'create', initialActivityBlockId: 'b1', initialActivityDraftId: 'edited-draft' })
    await user.selectOptions(await screen.findByRole('combobox', { name: 'Tipo de instrumento' }), 'escala')
    expect(screen.getByRole('dialog', { name: '¿Reemplazar el instrumento editado?' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Conservar cambios' }))
    expect(screen.getByRole('combobox', { name: 'Tipo de instrumento' })).toHaveValue('rubrica')
    expect(screen.getByRole('textbox', { name: 'Criterio 1' })).toHaveValue('Criterio ajustado por la docente')
  })

  it('abre el resumen sin guardar y confirma una actividad sin fecha con 17.35 puntos', async () => {
    const proposal = editableFallbackRecommendation({ activityTitle: 'Informe de lectura', description: 'Redactar un informe de lectura.', maxScore: 17.35, instrumentType: 'rubrica', participationMode: 'INDIVIDUAL' })
    const draft = { draftId: 'summary-draft', name: 'Informe de lectura', maxScore: '17.35', competencyBlockId: 'b1', competencyBlockWeights: { b1: 1 }, date: '',
      description: 'Redactar un informe de lectura.', studentRole: '', teacherRole: '', instrumentType: 'rubrica', evaluationTechnique: 'analisis-producciones', instrumentCompleted: true,
      instrumentFields: recommendationToFields(proposal, 'Informe de lectura'), preparedRecommendation: proposal, preparedManuallyEdited: false, pedagogicalActivityType: 'READING_REPORT_WRITING', resources: ['Libro'], planningMoment: '', observations: '', activityType: 'individual', teamIds: [] }
    writeActivityDrafts(draftContext, JSON.parse(JSON.stringify({ b1: [{ ...draft, preparedFingerprint: preparationFingerprint(draft) }] })), {courseTitle:'1ro A · Lengua Española',periodShortName:'P1'})
    const onAddActivity = vi.fn().mockImplementation(async activity => ({ ...activity, id: 'saved-summary' }))
    const user = userEvent.setup()
    renderBook({ sectionSubjectId: 'ss-1', initialActivityAction: 'create', initialActivityBlockId: 'b1', initialActivityDraftId: 'summary-draft', onAddActivity })
    expect(await screen.findByDisplayValue('Informe de lectura')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Guardar' }))
    const summary = screen.getByRole('dialog', { name: 'Resumen de la actividad' })
    expect(onAddActivity).not.toHaveBeenCalled()
    expect(within(summary).getByText('17.35 puntos')).toBeInTheDocument()
    await user.click(within(summary).getByRole('button', { name: 'Ver descripción' }))
    expect(screen.getByRole('dialog', { name: 'Descripción de la actividad' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Volver al resumen' }))
    await user.click(screen.getByRole('button', { name: 'Ver instrumento' }))
    expect(screen.getByText(/Solo lectura/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Volver al resumen' }))
    await user.click(screen.getByRole('button', { name: 'Volver a editar' }))
    expect(screen.getByDisplayValue('Informe de lectura')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Guardar' }))
    const confirm = screen.getByRole('button', { name: 'Confirmar y guardar' })
    fireEvent.click(confirm)
    fireEvent.click(confirm)
    await waitFor(() => expect(onAddActivity).toHaveBeenCalledTimes(1))
    expect(onAddActivity.mock.calls[0][0]).toEqual(expect.objectContaining({ maxScore: 17.35, date: '', planningMoment: '' }))
  })

  it('conserva una plantilla editable si falla la preparación automática', async () => {
    vi.spyOn(api, 'post').mockRejectedValue(new ApiError(503, 'Servicio no disponible'))
    writeActivityDrafts(draftContext, JSON.parse(JSON.stringify({ b1: [{
      draftId: 'automatic-fallback', name: 'Informe de lectura', maxScore: '20', competencyBlockId: 'b1', competencyBlockWeights: { b1: 1 },
      date: '', description: 'Redactar un informe de lectura con resumen.', studentRole: '', teacherRole: '', instrumentType: '',
      evaluationTechnique: '', instrumentCompleted: false, instrumentFields: {}, resources: [], planningMoment: '', observations: '',
      activityType: 'individual', teamIds: [],
    }] })), {courseTitle:'1ro A · Lengua Española',periodShortName:'P1'})
    renderBook({ sectionSubjectId: 'ss-1', initialActivityAction: 'create', initialActivityBlockId: 'b1', initialActivityDraftId: 'automatic-fallback' })
    expect(await screen.findByRole('textbox', { name: 'Criterio 1' }, { timeout: 5000 })).toHaveValue('Resumen del texto')
  })

  it('prepara sin calificación ni modalidad y conserva el borrador si falla la regeneración explícita', async () => {
    vi.spyOn(api, 'post').mockRejectedValue(new ApiError(503, 'Servicio no disponible'))
    writeActivityDrafts(draftContext, JSON.parse(JSON.stringify({ b1: [{
      draftId: 'report-no-score', name: 'Informe de lectura de un cuento', maxScore: '', competencyBlockId: 'b1', competencyBlockWeights: { b1: 1 },
      date: '', description: 'Elaborarán un informe de lectura de un cuento con resumen, personajes, análisis de valores y conclusión.',
      studentRole: '', teacherRole: '', instrumentType: '', evaluationTechnique: '', instrumentCompleted: false,
      instrumentFields: {}, resources: [], planningMoment: '', observations: '', activityType: '', teamIds: [],
    }] })), {courseTitle:'1ro A · Lengua Española',periodShortName:'P1'})
    renderBook({ sectionSubjectId: 'ss-1', initialActivityAction: 'create', initialActivityBlockId: 'b1', initialActivityDraftId: 'report-no-score' })
    const criterion = await screen.findByRole('textbox', { name: 'Criterio 1' }, { timeout: 5000 })
    await waitFor(() => expect(criterion).toHaveValue('Resumen del texto'), { timeout: 5000 })
    expect(screen.getByRole('textbox', { name: /Valor en puntos/ })).toHaveValue('')
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Crear desde cero' }))
    await user.click(screen.getByRole('button', { name: 'Cambiar instrumento' }))
    expect(screen.getByRole('textbox', { name: 'Criterio 1' })).toHaveValue('')
    await new Promise(resolve => setTimeout(resolve, 1100))
    expect(screen.getByRole('textbox', { name: 'Criterio 1' })).toHaveValue('')
    await user.click(screen.getByRole('button', { name: 'Generar nuevo instrumento' }))
    expect(await screen.findByText(/No se pudo actualizar el instrumento/)).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Criterio 1' })).toHaveValue('')
  })

  it('añade un criterio del catálogo y solicita confirmación antes de redistribuir puntos manuales', async () => {
    const { proposal } = seededInstrumentDraft('add-contextual')
    const candidate = { ...proposal.criteria[0], id: 'extra', templateId: 'evidence-extra', title: 'Evidencias del cuento',
      description: 'Sustenta el análisis de personajes con ejemplos del cuento.',
      descriptors: proposal.criteria[0].descriptors.map((item, index) => ({ ...item, text: `Evidencia nivel ${index + 1}` })) }
    const candidateTwo = { ...candidate, id: 'extra-two', templateId: 'text-evidence-extra', title: 'Referencias textuales',
      description: 'Selecciona fragmentos concretos y los vincula con sus interpretaciones.' }
    const post = vi.spyOn(api, 'post').mockImplementation(async path => path === '/evaluation-instruments/interpret'
      ? { suggestedActivityType: 'READING_REPORT_WRITING', activityType: 'READING_REPORT_WRITING', activityTypes: [], curriculumVersionId: null,
        curriculumScopeId: null, curriculumCandidates: [], curriculumMatch: 'NONE', message: '' } as never
      : { ...proposal, criteria: [...proposal.criteria, candidate, candidateTwo] } as never)
    const user = userEvent.setup()
    renderBook({ sectionSubjectId: 'ss-1', initialActivityAction: 'create', initialActivityBlockId: 'b1', initialActivityDraftId: 'add-contextual' })
    fireEvent.change(screen.getByRole('textbox', { name: 'Criterio 1' }), { target: { value: 'Criterio editado por la docente' } })
    await user.click(screen.getByRole('button', { name: 'Agregar criterio' }))
    expect(await screen.findByDisplayValue('Evidencias del cuento')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Criterio 1' })).toHaveValue('Criterio editado por la docente')
    expect(post.mock.calls.some(([path, body]) => path === '/evaluation-instruments/recommend'
      && (body as { includeAdditionalCandidates?: boolean }).includeAdditionalCandidates)).toBe(true)
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Puntos del criterio 1' }), { target: { value: '5' } })
    await user.click(screen.getByRole('button', { name: 'Agregar criterio' }))
    expect(await screen.findByRole('dialog', { name: '¿Redistribuir los puntos editados?' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Conservar cambios' }))
    expect(screen.queryByRole('textbox', { name: 'Criterio 8' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Agregar criterio' }))
    await user.click(await screen.findByRole('button', { name: 'Redistribuir y añadir' }))
    expect(await screen.findByRole('textbox', { name: 'Criterio 8' })).toHaveValue('Referencias textuales')
    expect(screen.getByRole('textbox', { name: 'Criterio 1' })).toHaveValue('Criterio editado por la docente')
  })

  it('completa solo celdas vacías de una fila sin redistribuir puntos', async () => {
    const {proposal} = seededInstrumentDraft('complete-one-row')
    vi.spyOn(api,'post').mockResolvedValue(proposal as never)
    const user = userEvent.setup()
    renderBook({sectionSubjectId:'ss-1',initialActivityAction:'create',initialActivityBlockId:'b1',initialActivityDraftId:'complete-one-row'})
    const descriptor = screen.getByRole('textbox',{name:'Inicial del criterio 1'})
    fireEvent.change(descriptor,{target:{value:''}})
    fireEvent.change(screen.getByRole('textbox',{name:'Criterio 2'}),{target:{value:'Mi segundo criterio'}})
    const points = screen.getByRole('spinbutton',{name:'Puntos del criterio 1'})
    const original = (points as HTMLInputElement).value
    await user.click(screen.getAllByRole('button',{name:'Acciones de la fila'})[0])
    await user.click(screen.getByRole('menuitem',{name:'Completar criterio'}))
    await waitFor(()=>expect(descriptor).toHaveValue(proposal.criteria[0].descriptors.at(-1)?.text))
    expect(screen.getByRole('textbox',{name:'Criterio 2'})).toHaveValue('Mi segundo criterio')
    expect(points).toHaveValue(Number(original))
    expect(screen.queryByRole('dialog',{name:'¿Redistribuir los puntos editados?'})).not.toBeInTheDocument()
  })

  it('confirma el quinto nivel y conserva los descriptores manuales anteriores', async () => {
    seededInstrumentDraft('fifth-level')
    const user=userEvent.setup()
    renderBook({sectionSubjectId:'ss-1',initialActivityAction:'create',initialActivityBlockId:'b1',initialActivityDraftId:'fifth-level'})
    fireEvent.change(screen.getByRole('textbox',{name:'Destacado del criterio 1'}),{target:{value:'Mi descriptor destacado'}})
    await user.click(screen.getByRole('button',{name:'Configurar niveles'}))
    await user.click(screen.getByRole('button',{name:'Agregar nivel'}))
    await user.click(screen.getByRole('button',{name:'Aplicar cambios'}))
    expect(await screen.findByRole('dialog',{name:'¿Aplicar cambios de niveles?'})).toBeInTheDocument()
    await user.click(screen.getByRole('button',{name:'Aplicar niveles'}))
    expect(screen.getByRole('textbox',{name:'Destacado del criterio 1'})).toHaveValue('Mi descriptor destacado')
    expect(screen.getByRole('textbox',{name:'Requiere apoyo del criterio 2'})).not.toHaveValue('')
  })

  it.each(['edición','reordenación'])('rechaza completar una fila con respuesta obsoleta por %s',async reason=>{
    const {proposal}=seededInstrumentDraft('complete-obsolete-'+reason)
    let finish!: (value:unknown)=>void
    const delayed=new Promise(resolve=>{finish=resolve})
    const post=vi.spyOn(api,'post').mockReturnValue(delayed as never)
    const user=userEvent.setup()
    renderBook({sectionSubjectId:'ss-1',initialActivityAction:'create',initialActivityBlockId:'b1',initialActivityDraftId:'complete-obsolete-'+reason})
    fireEvent.change(screen.getByRole('textbox',{name:'Inicial del criterio 1'}),{target:{value:''}})
    await user.click(screen.getAllByRole('button',{name:'Acciones de la fila'})[0])
    await user.click(screen.getByRole('menuitem',{name:'Completar criterio'}))
    expect(post).toHaveBeenCalledTimes(1)
    if(reason==='edición') fireEvent.change(screen.getByRole('textbox',{name:'Inicial del criterio 1'}),{target:{value:'Mi descriptor posterior'}})
    else {
      await user.click(screen.getByRole('button',{name:'Completando criterio…'}))
      await user.click(screen.getByRole('menuitem',{name:'Mover abajo'}))
    }
    await act(async()=>{finish(proposal);await delayed})
    expect(screen.getByRole('textbox',{name:reason==='edición'?'Inicial del criterio 1':'Inicial del criterio 2'})).toHaveValue(reason==='edición'?'Mi descriptor posterior':'')
  })

  it('regenera sin cambiar el título y respeta cancelar o confirmar el reemplazo', async () => {
    const { proposal } = seededInstrumentDraft('regenerate-contextual')
    const replacement = { ...proposal, criteria: proposal.criteria.map((item, index) => index === 0
      ? { ...item, title: 'Nuevo criterio de lectura', description: 'Explica un rasgo del cuento con evidencia.' } : item) }
    const post = vi.spyOn(api, 'post').mockImplementation(async path => path === '/evaluation-instruments/interpret'
      ? { suggestedActivityType: 'READING_REPORT_WRITING', activityType: 'READING_REPORT_WRITING', activityTypes: [], curriculumVersionId: null,
        curriculumScopeId: null, curriculumCandidates: [], curriculumMatch: 'NONE', message: '' } as never : replacement as never)
    const user = userEvent.setup()
    renderBook({ sectionSubjectId: 'ss-1', initialActivityAction: 'create', initialActivityBlockId: 'b1', initialActivityDraftId: 'regenerate-contextual' })
    fireEvent.change(screen.getByRole('textbox', { name: 'Criterio 1' }), { target: { value: 'Criterio propio' } })
    await user.click(screen.getByRole('button', { name: 'Generar nuevo instrumento' }))
    expect(screen.getByRole('dialog', { name: '¿Reemplazar el instrumento editado?' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Conservar cambios' }))
    expect(screen.getByRole('textbox', { name: 'Criterio 1' })).toHaveValue('Criterio propio')
    expect(post.mock.calls.filter(([path]) => path === '/evaluation-instruments/recommend')).toHaveLength(0)
    await user.click(screen.getByRole('button', { name: 'Generar nuevo instrumento' }))
    await user.click(screen.getByRole('button', { name: 'Cambiar instrumento' }))
    await waitFor(() => expect(screen.getByRole('textbox', { name: 'Criterio 1' })).toHaveValue('Nuevo criterio de lectura'))
    expect(post.mock.calls.filter(([path]) => path === '/evaluation-instruments/recommend')).toHaveLength(1)
    await user.click(screen.getByRole('button', { name: 'Instrumento preparado' }))
    await waitFor(() => expect(post.mock.calls.filter(([path]) => path === '/evaluation-instruments/recommend')).toHaveLength(2))
  })

  it('persiste un criterio añadido y lo recupera al reabrir el borrador', async () => {
    const { proposal } = seededInstrumentDraft('add-and-reopen')
    const candidate = { ...proposal.criteria[0], id: 'saved-extra', templateId: 'saved-extra', title: 'Referencias textuales',
      description: 'Selecciona fragmentos concretos y los vincula con sus interpretaciones.' }
    vi.spyOn(api, 'post').mockImplementation(async path => path === '/evaluation-instruments/interpret'
      ? { suggestedActivityType: 'READING_REPORT_WRITING', activityType: 'READING_REPORT_WRITING', activityTypes: [], curriculumVersionId: null,
        curriculumScopeId: null, curriculumCandidates: [], curriculumMatch: 'NONE', message: '' } as never
      : { ...proposal, criteria: [...proposal.criteria, candidate] } as never)
    const user = userEvent.setup()
    const view = renderBook({ sectionSubjectId: 'ss-1', initialActivityAction: 'create', initialActivityBlockId: 'b1', initialActivityDraftId: 'add-and-reopen' })
    await user.click(screen.getByRole('button', { name: 'Agregar criterio' }))
    expect(await screen.findByDisplayValue('Referencias textuales')).toBeInTheDocument()
    await waitFor(() => {
      const stored = JSON.parse(JSON.stringify(readActivityDraftsForContext(draftContext)) || '{}')
      expect(stored.b1?.[0]?.instrumentFields['rubrica:criterion:6']).toBe('Referencias textuales')
    })
    view.unmount()
    renderBook({ sectionSubjectId: 'ss-1', initialActivityAction: 'create', initialActivityBlockId: 'b1', initialActivityDraftId: 'add-and-reopen' })
    expect(await screen.findByRole('textbox', { name: 'Criterio 7' })).toHaveValue('Referencias textuales')
  })

  it('guarda y reabre el instrumento con el criterio añadido', async () => {
    const { proposal } = seededInstrumentDraft('add-save-reopen')
    const candidate = { ...proposal.criteria[0], id: 'saved-criterion', templateId: 'saved-criterion', title: 'Referencias textuales',
      description: 'Selecciona fragmentos concretos y los vincula con sus interpretaciones.' }
    vi.spyOn(api, 'post').mockImplementation(async path => path === '/evaluation-instruments/interpret'
      ? { suggestedActivityType: 'READING_REPORT_WRITING', activityType: 'READING_REPORT_WRITING', activityTypes: [], curriculumVersionId: null,
        curriculumScopeId: null, curriculumCandidates: [], curriculumMatch: 'NONE', message: '' } as never
      : { ...proposal, criteria: [...proposal.criteria, candidate] } as never)
    const onAddActivity = vi.fn().mockImplementation(async activity => ({ ...activity, id: 'saved-add' }))
    const user = userEvent.setup()
    const view = renderBook({ sectionSubjectId: 'ss-1', initialActivityAction: 'create', initialActivityBlockId: 'b1', initialActivityDraftId: 'add-save-reopen', onAddActivity })
    await user.click(screen.getByRole('button', { name: 'Agregar criterio' }))
    await screen.findByDisplayValue('Referencias textuales')
    await user.click(screen.getByRole('button', { name: 'Guardar' }))
    await user.click(screen.getByRole('button', { name: 'Confirmar y guardar' }))
    await waitFor(() => expect(onAddActivity).toHaveBeenCalledTimes(1))
    const saved = onAddActivity.mock.calls[0][0] as GradingActivity
    expect(saved.instrumentCriteria).toMatchObject({ 'rubrica:meta:criteriaCount': '7', 'rubrica:criterion:6': 'Referencias textuales' })
    expect(saved.instrumentSnapshot?.criteria.at(-1)?.title).toBe('Referencias textuales')
    view.unmount()
    renderBook({ firstSecondaryLanguage: true, sectionSubjectId: 'ss-1', activities: [{ ...saved, id: 'saved-add' }], initialActivityId: 'saved-add', initialActivityMode: 'edit' })
    expect(await screen.findByRole('textbox', { name: 'Criterio 7' })).toHaveValue('Referencias textuales')
  })

  it('ignora respuesta de catálogo atrasada y bloquea clics repetidos al añadir', async () => {
    const { proposal } = seededInstrumentDraft('add-late-response')
    const candidate = { ...proposal.criteria[0], id: 'late-extra', templateId: 'late-extra', title: 'Referencias textuales',
      description: 'Selecciona fragmentos concretos y los vincula con sus interpretaciones.' }
    let finish!: (value: unknown) => void
    const delayed = new Promise(resolve => { finish = resolve })
    const post = vi.spyOn(api, 'post').mockImplementation(path => path === '/evaluation-instruments/interpret'
      ? Promise.resolve({ suggestedActivityType: 'READING_REPORT_WRITING', activityType: 'READING_REPORT_WRITING', activityTypes: [], curriculumVersionId: null,
        curriculumScopeId: null, curriculumCandidates: [], curriculumMatch: 'NONE', message: '' }) as never
      : delayed as never)
    const user = userEvent.setup()
    renderBook({ sectionSubjectId: 'ss-1', initialActivityAction: 'create', initialActivityBlockId: 'b1', initialActivityDraftId: 'add-late-response' })
    const add = screen.getByRole('button', { name: 'Agregar criterio' })
    await user.click(add)
    fireEvent.click(add)
    const request = post.mock.calls.filter(([path, body]) => path === '/evaluation-instruments/recommend'
      && (body as { includeAdditionalCandidates?: boolean }).includeAdditionalCandidates)
    expect(request).toHaveLength(1)
    fireEvent.change(screen.getByRole('textbox', { name: 'Criterio 1' }), { target: { value: 'Cambio posterior de la docente' } })
    await act(async () => { finish({ ...proposal, criteria: [...proposal.criteria, candidate] }); await delayed })
    expect(screen.getByRole('textbox', { name: 'Criterio 1' })).toHaveValue('Cambio posterior de la docente')
    expect(screen.queryByRole('textbox', { name: 'Criterio 7' })).not.toBeInTheDocument()
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
    writeActivityDrafts(draftContext, JSON.parse(JSON.stringify({
      b1: [{ ...baseDraft, draftId: 'draft-b1', competencyBlockId: 'b1', name: 'Borrador comunicativo' }],
      b2: [{ ...baseDraft, draftId: 'draft-b2', competencyBlockId: 'b2', name: 'Borrador lógico' }],
    })), {courseTitle:'1ro A · Lengua Española',periodShortName:'P1'})
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
    writeActivityDrafts(draftContext, JSON.parse(JSON.stringify({
      b1: [{ draftId: 'draft-requested', competencyBlockId: 'b1', name: 'Exposición pendiente', maxScore: '25', date: '', description: '', studentRole: '', teacherRole: '', instrumentType: '', evaluationTechnique: '', instrumentCompleted: false, instrumentFields: {}, resources: [], planningMoment: '', observations: '', activityType: '', teamIds: [] }],
    })), {courseTitle:'1ro A · Lengua Española',periodShortName:'P1'})

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
    expect(screen.getAllByText(/Explica el sistema solar/).length).toBeGreaterThan(0)
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
