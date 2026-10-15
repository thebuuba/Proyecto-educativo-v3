import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { InstrumentAcademicContext, InstrumentRecommendation } from '@aula/shared'
import { api, ApiError } from '@/services/apiClient'
import { ActivityEditorWorkspace } from './ActivityEditorWorkspace'
import { newActivityDraft, type ActivityDraft } from './editor/editorModel'
import { editableFallbackRecommendation } from '../services/instrumentPreparation'
import { readActivityDrafts } from '../utils/activityDraftStorage'

vi.mock('@/modules/grading/components/ActivityDescriptionEditor', () => ({
  ActivityDescriptionEditor: ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
    <textarea aria-label="Descripción de la actividad" value={value} onChange={event => onChange(event.target.value)} />
  ),
}))

const context = { schoolId: 'school', userId: 'user', schoolYearId: 'year', sectionSubjectId: 'subject', academicPeriodId: 'period' }
const interpretation = {
  suggestedActivityType: 'REPORT', activityType: 'REPORT', activityTypes: ['REPORT'],
  suggestedEvaluationTechnique: 'analisis-producciones', suggestedInstrumentType: 'lista-cotejo',
  curriculumVersionId: null, curriculumScopeId: null, curriculumCandidates: [], curriculumMatch: 'NONE', message: '',
}
const description = 'Elaborar un informe con evidencia.'
const updatedDescription = 'Elaborar un informe con evidencia y explicar las conclusiones.'
const proposal = editableFallbackRecommendation({ activityTitle: 'Informe', description: updatedDescription, maxScore: 20, instrumentType: 'lista-cotejo', participationMode: 'INDIVIDUAL' })
proposal.criteria[0] = { ...proposal.criteria[0], title: 'Criterio actualizado' }

function mount(initial: Partial<ActivityDraft> = {}, academicContext?: InstrumentAcademicContext) {
  render(<ActivityEditorWorkspace
    initialDraft={{ ...newActivityDraft('b1'), name: 'Informe', description, pedagogicalActivityType: 'REPORT', ...initial }}
    activityDraftContext={context} sectionSubjectId="subject" courseTitle="Curso" periodShortName="P1" saving={false}
    instrumentAcademicContext={academicContext}
    onAddActivity={async activity => ({ ...activity, id: 'saved' })} onUpdateActivity={async activity => activity}
  />)
}

async function advance(ms: number) {
  await act(async () => { await vi.advanceTimersByTimeAsync(ms) })
}

describe('automatic instrument preparation request lifecycle', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    localStorage.clear()
  })
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it.each(['resolved', 'rejected'])('prepares the latest draft when a %s stale request outlasts the next debounce', async outcome => {
    let resolve!: (value: InstrumentRecommendation) => void
    let reject!: (error: Error) => void
    const pending = new Promise<InstrumentRecommendation>((success, failure) => { resolve = success; reject = failure })
    let requests = 0
    const post = vi.spyOn(api, 'post').mockImplementation(async path => {
      if (path.endsWith('/interpret')) return interpretation as never
      return (await (++requests === 1 ? pending : proposal)) as never
    })
    mount()
    await advance(500)
    await advance(1000)
    expect(requests).toBe(1)
    expect(screen.getByRole('combobox', { name: 'Tipo de instrumento' })).toHaveValue('lista-cotejo')
    fireEvent.change(screen.getByLabelText('Descripción de la actividad'), { target: { value: updatedDescription } })
    await advance(500)
    await advance(1000)
    await act(async () => {
      if (outcome === 'resolved') resolve(proposal)
      else reject(new ApiError(503, 'Servicio no disponible'))
    })
    await advance(1000)
    expect(screen.getByRole('region', { name: 'Instrumento y estado de criterios' })).toBeVisible()
    expect(screen.getByLabelText('Criterio 1')).toHaveValue('Criterio actualizado')
    expect(post.mock.calls.filter(([path]) => path.endsWith('/recommend')).at(-1)?.[1]).toMatchObject({ description: updatedDescription })
    const draft = readActivityDrafts(context)[0].draft as ActivityDraft
    expect(draft.maxScore).toBe('')
    expect(draft.preparedRecommendation?.totalScoreUnits).toBe(0)
    expect(draft.instrumentFields['lista-cotejo:meta:scorePending']).toBe('true')
  })

  it('shows initial preparation and keeps a rejected draft recoverable without an automatic error loop', async () => {
    let reject!: (error: Error) => void
    const pending = new Promise<InstrumentRecommendation>((_, failure) => { reject = failure })
    const post = vi.spyOn(api, 'post').mockImplementation(async path => (await (path.endsWith('/interpret') ? interpretation : pending)) as never)
    mount()
    expect(screen.getByRole('button', { name: 'Preparar instrumento' })).toBeEnabled()
    await advance(500)
    await advance(1000)
    expect(screen.getByText('Preparando el instrumento de evaluación…')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Preparando…' })).toBeDisabled()
    await act(async () => { reject(new ApiError(400, 'Revisa la consigna antes de continuar.')) })
    await advance(5000)
    expect(screen.getByText('Revisa la consigna antes de continuar.')).toBeVisible()
    expect(post.mock.calls.filter(([path]) => path.endsWith('/recommend'))).toHaveLength(1)
    expect(screen.getByLabelText('Descripción de la actividad')).toHaveValue(description)
    post.mockImplementation(async path => (path.endsWith('/interpret') ? interpretation : proposal) as never)
    fireEvent.click(screen.getByRole('button', { name: 'Generar nuevo instrumento' }))
    await advance(0)
    expect(screen.getByLabelText('Criterio 1')).toHaveValue('Criterio actualizado')
  })

  it('preserves a manual instrument choice made while the old request is still pending', async () => {
    let finish!: (value: InstrumentRecommendation) => void
    const pending = new Promise<InstrumentRecommendation>(resolve => { finish = resolve })
    const rubric = editableFallbackRecommendation({ activityTitle: 'Informe', description, maxScore: 20, instrumentType: 'rubrica', participationMode: 'INDIVIDUAL' })
    rubric.criteria[0] = { ...rubric.criteria[0], title: 'Criterio de la rúbrica elegida' }
    let requests = 0
    const post = vi.spyOn(api, 'post').mockImplementation(async path => {
      if (path.endsWith('/interpret')) return interpretation as never
      return (await (++requests === 1 ? pending : rubric)) as never
    })
    mount()
    await advance(500)
    await advance(1000)
    fireEvent.change(screen.getByRole('combobox', { name: 'Tipo de instrumento' }), { target: { value: 'rubrica' } })
    await advance(1000)
    await act(async () => { finish(proposal) })
    await advance(1000)
    expect(screen.getByRole('combobox', { name: 'Tipo de instrumento' })).toHaveValue('rubrica')
    expect(screen.getByLabelText('Criterio 1')).toHaveValue('Criterio de la rúbrica elegida')
    expect(post.mock.calls.filter(([path]) => path.endsWith('/recommend')).at(-1)?.[1]).toMatchObject({ preferredInstrumentType: 'rubrica' })
    expect((readActivityDrafts(context)[0].draft as ActivityDraft).autoSelectedInstrumentType).toBe(false)
  })

  it('allows starting a manual instrument while the initial service request is pending and ignores its late response', async () => {
    let finish!: (value: InstrumentRecommendation) => void
    const pending = new Promise<InstrumentRecommendation>(resolve => { finish = resolve })
    vi.spyOn(api, 'post').mockImplementation(async path => (await (path.endsWith('/interpret') ? interpretation : pending)) as never)
    mount()
    await advance(500)
    await advance(1000)
    fireEvent.click(screen.getByRole('button', { name: 'Crear desde cero' }))
    expect(screen.getByRole('region', { name: 'Instrumento y estado de criterios' })).toBeVisible()
    fireEvent.change(screen.getByLabelText('Criterio 1'), { target: { value: 'Mi criterio manual conservado' } })
    await act(async () => { finish(proposal) })
    await advance(2000)
    expect(screen.getByLabelText('Criterio 1')).toHaveValue('Mi criterio manual conservado')
    expect((readActivityDrafts(context)[0].draft as ActivityDraft).maxScore).toBe('')
  })

  it('prepares the sixth grade English job interview with only title and description when the service fails', async () => {
    vi.spyOn(api, 'post').mockRejectedValue(new ApiError(503, 'Servicio no disponible'))
    mount({
      name: 'Una entrevista de trabajo en inglés.',
      description: 'En parejas, los estudiantes realizarán una entrevista de trabajo simulada en inglés. Uno entrevistará y el otro responderá sobre la experiencia y las capacidades de un personaje ficticio. Luego intercambiarán los roles.',
      pedagogicalActivityType: '',
    }, { level: 'SECONDARY', grade: 6, subjectCode: 'ING' })
    await advance(500)
    await advance(1000)
    expect(screen.getByRole('region', { name: 'Instrumento y estado de criterios' })).toBeVisible()
    expect(screen.getByLabelText('Criterio 1')).not.toHaveValue('')
    const draft = readActivityDrafts(context)[0].draft as ActivityDraft
    expect(draft.preparedRecommendation?.criteria.some(criterion => criterion.title === 'Respuestas relacionadas con el perfil de la entrevista simulada')).toBe(true)
    expect(draft.maxScore).toBe('')
    expect(draft.preparedRecommendation?.totalScoreUnits).toBe(0)
  })

  it('preserves an explicitly selected checklist for the sixth grade English job interview when the service fails', async () => {
    vi.spyOn(api, 'post').mockRejectedValue(new ApiError(503, 'Servicio no disponible'))
    mount({
      name: 'Una entrevista de trabajo en inglés.',
      description: 'En parejas, los estudiantes realizarán una entrevista de trabajo simulada en inglés. Uno entrevistará y el otro responderá sobre la experiencia y las capacidades de un personaje ficticio. Luego intercambiarán los roles.',
      pedagogicalActivityType: '',
    }, { level: 'SECONDARY', grade: 6, subjectCode: 'ING' })
    fireEvent.change(screen.getByRole('combobox', { name: 'Tipo de instrumento' }), { target: { value: 'lista-cotejo' } })
    await advance(500)
    await advance(1000)
    expect(screen.getByRole('combobox', { name: 'Tipo de instrumento' })).toHaveValue('lista-cotejo')
    expect(screen.getByRole('region', { name: 'Instrumento y estado de criterios' })).toBeVisible()
    expect(screen.getByLabelText('Criterio 1')).not.toHaveValue('')
    const draft = readActivityDrafts(context)[0].draft as ActivityDraft
    expect(draft.preparedRecommendation?.instrumentType).toBe('lista-cotejo')
    expect(draft.autoSelectedInstrumentType).toBe(false)
    expect(draft.preparedRecommendation?.criteria.some(criterion => criterion.title === 'Responde en inglés a las preguntas de la entrevista de trabajo simulada, relacionando la experiencia y capacidades solicitadas con los datos de la ficha del personaje ficticio.')).toBe(true)
    expect(draft.maxScore).toBe('')
    expect(draft.instrumentFields['lista-cotejo:meta:scorePending']).toBe('true')
    expect(draft.preparedRecommendation?.totalScoreUnits).toBe(0)
  })
})
