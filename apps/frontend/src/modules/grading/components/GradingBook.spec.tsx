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
  afterEach(() => { vi.restoreAllMocks() })

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

  it('muestra y guarda las selecciones del informe aunque la preparación termine antes que la interpretación', async () => {
    const title = 'Informe de lectura de un cuento'
    const description = 'Los estudiantes seleccionarán un cuento corto de su preferencia, realizarán una lectura comprensiva y elaborarán un informe escrito en el que presentarán el título de la obra, su autor, un resumen de los acontecimientos principales, una descripción de los personajes y un análisis de los valores o situaciones sociales presentes en la historia. Finalmente, redactarán una conclusión expresando su interpretación personal del texto'
    const proposal = editableFallbackRecommendation({ activityTitle: title, description, activityType: 'READING_REPORT_WRITING', maxScore: 20, instrumentType: 'rubrica', participationMode: 'INDIVIDUAL' })
    let finishInterpretation!: (value: unknown) => void
    const interpretation = new Promise(resolve => { finishInterpretation = resolve })
    const post = vi.spyOn(api, 'post').mockImplementation(path => path === '/evaluation-instruments/interpret' ? interpretation as never : proposal as never)
    window.localStorage.setItem('grading-activity-drafts:1ro A · Lengua Española:P1', JSON.stringify({ b1: [{
      draftId: 'report-draft', name: title, description, maxScore: '20', competencyBlockId: 'b1', competencyBlockWeights: { b1: 1 },
      activityType: 'individual', teamIds: [], instrumentType: '', evaluationTechnique: '', instrumentFields: {}, instrumentCompleted: false,
      resources: [], studentRole: '', teacherRole: '', planningMoment: '', observations: '', date: '',
    }] }))
    const onAddActivity = vi.fn().mockImplementation(async activity => ({ ...activity, id: 'saved-report' }))
    const view = renderBook({ firstSecondaryLanguage: true, sectionSubjectId: 'ss-1', initialActivityAction: 'create', initialActivityBlockId: 'b1', initialActivityDraftId: 'report-draft', onAddActivity })
    await waitFor(() => expect(post.mock.calls.some(([path]) => path === '/evaluation-instruments/recommend')).toBe(true), { timeout: 5000 })
    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Tipo de instrumento' })).toHaveValue('rubrica'))
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
    window.localStorage.setItem('grading-activity-drafts:1ro A · Lengua Española:P1', JSON.stringify({ b1: [{
      draftId: 'description-draft', name: title, description: 'Elaborarán un informe de lectura.', maxScore: '',
      competencyBlockId: 'b1', competencyBlockWeights: { b1: 1 }, activityType: 'individual', teamIds: [],
      instrumentType: '', evaluationTechnique: '', instrumentFields: {}, instrumentCompleted: false,
      resources: [], studentRole: '', teacherRole: '', planningMoment: '', observations: '', date: '',
    }] }))
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
    window.localStorage.setItem('grading-activity-drafts:1ro A · Lengua Española:P1', JSON.stringify({ b1: [{
      draftId: 'offline-report', name: 'Informe de lectura de un cuento',
      description: 'Los estudiantes realizarán una lectura comprensiva y elaborarán un informe escrito con resumen y conclusión.',
      maxScore: '', competencyBlockId: 'b1', competencyBlockWeights: { b1: 1 }, activityType: 'individual', teamIds: [],
      instrumentType: '', evaluationTechnique: '', instrumentFields: {}, instrumentCompleted: false,
      resources: [], studentRole: '', teacherRole: '', planningMoment: '', observations: '', date: '',
    }] }))
    renderBook({ firstSecondaryLanguage: true, sectionSubjectId: 'ss-1', initialActivityAction: 'create', initialActivityBlockId: 'b1', initialActivityDraftId: 'offline-report' })
    expect(await screen.findByRole('combobox', { name: 'Tipo de actividad' })).toHaveValue('')
    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Tipo de actividad' })).toHaveValue('READING_REPORT_WRITING'))
    expect(screen.getByRole('combobox', { name: /Técnica de evaluación/ })).toHaveValue('analisis-producciones')
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
    window.localStorage.setItem('grading-activity-drafts:1ro A · Lengua Española:P1', JSON.stringify({ b1: [{ ...draft, preparedFingerprint: preparationFingerprint(draft) }] }))
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
    expect(screen.getByRole('spinbutton', { name: /Valor en puntos/ })).toHaveValue(17.35)
  })

  it('pide confirmación antes de sustituir criterios editados al cambiar formato', async () => {
    const proposal = editableFallbackRecommendation({ activityTitle: 'Informe de lectura', description: 'Redactar un informe.', maxScore: 20, instrumentType: 'rubrica', participationMode: 'INDIVIDUAL' })
    const fields = recommendationToFields(proposal, 'Informe de lectura')
    fields['rubrica:criterion:0'] = 'Criterio ajustado por la docente'
    const draft = { draftId: 'edited-draft', name: 'Informe de lectura', maxScore: '20', competencyBlockId: 'b1', competencyBlockWeights: { b1: 1 }, date: '',
      description: 'Redactar un informe.', studentRole: '', teacherRole: '', instrumentType: 'rubrica', evaluationTechnique: 'analisis-producciones',
      instrumentCompleted: true, instrumentFields: fields, preparedRecommendation: proposal, preparedManuallyEdited: true,
      resources: [], planningMoment: '', observations: '', activityType: 'individual', teamIds: [] }
    window.localStorage.setItem('grading-activity-drafts:1ro A · Lengua Española:P1', JSON.stringify({ b1: [{ ...draft, preparedFingerprint: preparationFingerprint(draft) }] }))
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
    window.localStorage.setItem('grading-activity-drafts:1ro A · Lengua Española:P1', JSON.stringify({ b1: [{ ...draft, preparedFingerprint: preparationFingerprint(draft) }] }))
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
    expect(onAddActivity.mock.calls[0][0]).toEqual(expect.objectContaining({ maxScore: 17.35, date: undefined, planningMoment: '' }))
  })

  it('conserva una plantilla editable si falla la preparación automática', async () => {
    vi.spyOn(api, 'post').mockRejectedValue(new ApiError(503, 'Servicio no disponible'))
    window.localStorage.setItem('grading-activity-drafts:1ro A · Lengua Española:P1', JSON.stringify({ b1: [{
      draftId: 'automatic-fallback', name: 'Informe de lectura', maxScore: '20', competencyBlockId: 'b1', competencyBlockWeights: { b1: 1 },
      date: '', description: 'Redactar un informe de lectura con resumen.', studentRole: '', teacherRole: '', instrumentType: '',
      evaluationTechnique: '', instrumentCompleted: false, instrumentFields: {}, resources: [], planningMoment: '', observations: '',
      activityType: 'individual', teamIds: [],
    }] }))
    renderBook({ sectionSubjectId: 'ss-1', initialActivityAction: 'create', initialActivityBlockId: 'b1', initialActivityDraftId: 'automatic-fallback' })
    expect(await screen.findByRole('textbox', { name: 'Criterio 1' }, { timeout: 5000 })).toHaveValue('Resumen del texto')
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
