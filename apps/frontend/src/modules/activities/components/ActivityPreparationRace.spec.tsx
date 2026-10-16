import {chooseActivitySelection,activitySelectionName} from './activitySelectionTestUtils'
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { InstrumentAcademicContext, InstrumentRecommendation, InstrumentType } from '@aula/shared'
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

  it('confirmar el formato automático visible lo convierte en elección manual sin regenerar',async()=>{
    const post=vi.spyOn(api,'post').mockImplementation(()=>new Promise(()=>{}))
    mount({instrumentType:'lista-cotejo',autoSelectedInstrumentType:true})
    chooseActivitySelection('Tipo de instrumento','lista-cotejo')
    expect((readActivityDrafts(context)[0]?.draft as ActivityDraft)?.autoSelectedInstrumentType).toBe(false)
    expect(post).not.toHaveBeenCalled()
    await advance(1000)
    expect(post.mock.calls.find(([path])=>path.endsWith('/recommend'))?.[1]).toMatchObject({preferredInstrumentType:'lista-cotejo'})
  })

  it('confirmar actividad y técnica visibles mantiene su prioridad ante la siguiente interpretación',async()=>{
    vi.spyOn(api,'post').mockResolvedValue({...interpretation,suggestedActivityType:'PROJECT',suggestedEvaluationTechnique:'proyecto'} as never)
    mount({pedagogicalActivityType:'REPORT',autoDetectedPedagogicalActivityType:true,evaluationTechnique:'analisis-producciones',autoSelectedEvaluationTechnique:true})
    chooseActivitySelection('Tipo de actividad','REPORT')
    chooseActivitySelection('Técnica de evaluación','analisis-producciones')
    fireEvent.change(screen.getByLabelText('Descripción de la actividad'),{target:{value:'Los estudiantes elaborarán un proyecto de investigación.'}})
    await advance(500)
    expect(readActivityDrafts(context)[0]?.draft).toMatchObject({pedagogicalActivityType:'REPORT',autoDetectedPedagogicalActivityType:false,evaluationTechnique:'analisis-producciones',autoSelectedEvaluationTechnique:false})
  })

  it('volver al tipo automático y conservar instrumento muestra el tipo vigente sin vaciarlo',async()=>{
    const academic={level:'SECONDARY' as const,grade:1,subjectCode:'MAT'}
    const description='Los estudiantes resolverán ejercicios de multiplicación, resta y división.'
    const p=editableFallbackRecommendation({activityTitle:'Operaciones',description,maxScore:20,instrumentType:'lista-cotejo',participationMode:'INDIVIDUAL',academicContext:academic})
    vi.spyOn(api,'post').mockImplementation(()=>new Promise(()=>{}))
    mount({name:'Operaciones',description,pedagogicalActivityType:'ANALYSIS',autoDetectedPedagogicalActivityType:false,instrumentType:'lista-cotejo',preparedRecommendation:p,preparedManuallyEdited:true},academic)
    chooseActivitySelection('Tipo de actividad','')
    fireEvent.click(screen.getByRole('button',{name:'Conservar instrumento'}))
    expect(screen.getByRole('button',{name:'Tipo de actividad'})).toHaveTextContent('Ejercicios')
    expect((readActivityDrafts(context)[0]?.draft as ActivityDraft)?.autoDetectedPedagogicalActivityType).toBe(true)
    expect((readActivityDrafts(context)[0]?.draft as ActivityDraft)?.preparedRecommendation).toEqual(p)
  })

  it('volver a técnica automática con instrumento conservado resuelve la técnica vigente',()=>{
    const academic={level:'SECONDARY' as const,grade:1,subjectCode:'MAT'},description='Resuelve multiplicaciones, restas y divisiones.'
    const p=editableFallbackRecommendation({activityTitle:'Operaciones',description,maxScore:20,instrumentType:'lista-cotejo',participationMode:'INDIVIDUAL',academicContext:academic})
    mount({name:'Operaciones',description,evaluationTechnique:'debate',autoSelectedEvaluationTechnique:false,instrumentType:'lista-cotejo',preparedRecommendation:p,preparedManuallyEdited:true},academic)
    chooseActivitySelection('Técnica de evaluación','')
    expect(screen.getByRole('button',{name:'Técnica de evaluación'})).toHaveTextContent('Análisis de producciones')
    expect((readActivityDrafts(context)[0]?.draft as ActivityDraft)?.preparedRecommendation).toEqual(p)
  })

  it('sustituye temperatura por las operaciones vigentes sin heredar el título anterior',async()=>{
    const academic={level:'SECONDARY' as const,grade:1,subjectCode:'MAT'}
    const temperature='Resuelve un problema de temperatura con multiplicación, resta y división usando los datos proporcionados.'
    const operations='Los estudiantes resolverán ejercicios de multiplicación, resta y división.'
    vi.spyOn(api,'post').mockImplementation(async(path,body)=>{
      if(!path.endsWith('/recommend'))throw new Error('Interpretación redundante')
      const input=body as {activityTitle:string;description:string;maxScore:number;preferredInstrumentType?:InstrumentType;participationMode:'INDIVIDUAL'}
      return editableFallbackRecommendation({...input,instrumentType:input.preferredInstrumentType??'lista-cotejo',academicContext:academic}) as never
    })
    mount({name:'El termómetro y la temperatura',description:temperature,pedagogicalActivityType:'',autoDetectedPedagogicalActivityType:true},academic)
    await advance(500);await advance(2000)
    expect(JSON.stringify((readActivityDrafts(context)[0]?.draft as ActivityDraft)?.preparedRecommendation?.criteria)).toMatch(/temperatura/)
    fireEvent.change(screen.getByLabelText('Descripción de la actividad'),{target:{value:operations}})
    await advance(500);await advance(2000)
    const criteria=(readActivityDrafts(context)[0]?.draft as ActivityDraft)?.preparedRecommendation?.criteria
    expect(criteria?.length).toBeGreaterThan(0)
    expect(JSON.stringify(criteria)).not.toMatch(/temperatura|termómetro/)
    for(const operation of ['multiplic','resta','divisi'])expect(JSON.stringify(criteria)).toMatch(new RegExp(operation))
  })

  it('prepara Francés reconocido con una sola solicitud, sin interpretación curricular redundante', async () => {
    const academic = { level: 'SECONDARY' as const, grade: 1, subjectCode: 'FRA', subjectName: 'Francés' }
    const french = 'En parejas, los estudiantes se saludarán en francés y realizarán un diálogo breve para preguntar y responder su nombre, edad y lugar de residencia. Luego intercambiarán los roles.'
    const result = editableFallbackRecommendation({ activityTitle: 'Nos presentamos en francés', description: french, maxScore: 20, participationMode: 'GROUP', instrumentType: 'rubrica', academicContext: academic })
    const post = vi.spyOn(api, 'post').mockImplementation(async path => (path.endsWith('/interpret') ? interpretation : result) as never)
    mount({ name: 'Nos presentamos en francés', description: french, pedagogicalActivityType: '', autoDetectedPedagogicalActivityType: true }, academic)
    expect(screen.getAllByRole('button', { name: 'Estrategia de enseñanza y aprendizaje' })).toHaveLength(1)
    await advance(500)
    await advance(1000)
    expect(post.mock.calls.map(([path]) => path)).toEqual(['/evaluation-instruments/recommend'])
    expect(screen.getByRole('button', { name: 'Estrategia de enseñanza y aprendizaje' })).toHaveTextContent('Simulación')
    expect(screen.getByLabelText('Criterio 1')).toBeVisible()
    expect(readActivityDrafts(context)[0].draft.maxScore).toBe('')
  })

  it('descarta la respuesta francesa anterior y conserva estrategia y formato manuales al cambiar la descripción', async () => {
    const academic = { level: 'SECONDARY' as const, grade: 1, subjectCode: 'FRA', subjectName: 'Francés' }
    const first = 'En parejas, realicen un diálogo en francés para preguntar y responder nombre, edad y residencia. Luego intercambiarán los roles.'
    const latest = 'En parejas, realicen un diálogo en francés para preguntar y responder solo el nombre.'
    const build = (description: string, instrumentType: InstrumentType) => editableFallbackRecommendation({ activityTitle: 'Diálogo', description, maxScore: 20, participationMode: 'GROUP', instrumentType, academicContext: academic })
    let finish!: (p: InstrumentRecommendation) => void
    const pending = new Promise<InstrumentRecommendation>(resolve => { finish = resolve })
    let requests = 0
    const post = vi.spyOn(api, 'post').mockImplementation(async (_path, body) => {
      const input = body as { description: string; preferredInstrumentType?: InstrumentType }
      return (await (++requests === 1 ? pending : build(input.description, input.preferredInstrumentType ?? 'rubrica'))) as never
    })
    mount({ name: 'Diálogo', description: first, pedagogicalActivityType: '', autoDetectedPedagogicalActivityType: true }, academic)
    await advance(500); await advance(1000)
    expect(requests).toBe(1)
    fireEvent.change(screen.getByLabelText('Descripción de la actividad'), { target: { value: latest } })
    fireEvent.click(screen.getByRole('button', { name: 'Estrategia de enseñanza y aprendizaje' }))
    fireEvent.click(within(screen.getByRole('dialog', { name: 'Estrategia de enseñanza y aprendizaje' })).getByRole('radio', { name: 'Debate' }))
    fireEvent.click(screen.getByRole('button', {name:'Confirmar'}))
    chooseActivitySelection('Tipo de instrumento', 'lista-cotejo')
    await advance(500); await advance(1000)
    await act(async () => { finish(build(first, 'rubrica')) })
    await advance(1000)
    expect(post.mock.calls.at(-1)?.[1]).toMatchObject({ description: latest, preferredInstrumentType: 'lista-cotejo' })
    const draft = readActivityDrafts(context)[0].draft as ActivityDraft
    expect(draft.teachingStrategyId).toBe('DEBATE')
    expect(draft.teachingStrategyOrigin).toBe('MANUAL')
    expect(draft.instrumentType).toBe('lista-cotejo')
    expect(draft.preparedRecommendation?.criteria.map(c => c.description).join(' ')).not.toMatch(/residencia|edad/)
    expect(draft.maxScore).toBe('')
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
    expect(screen.getByRole('button', { name: 'Tipo de instrumento' })).toHaveTextContent(activitySelectionName('lista-cotejo'))
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

  it('keeps automatic preparation silent and a rejected draft recoverable without an automatic error loop', async () => {
    let reject!: (error: Error) => void
    const pending = new Promise<InstrumentRecommendation>((_, failure) => { reject = failure })
    const post = vi.spyOn(api, 'post').mockImplementation(async path => (await (path.endsWith('/interpret') ? interpretation : pending)) as never)
    mount()
    expect(screen.getByRole('button', { name: 'Preparar instrumento' })).toBeEnabled()
    await advance(500)
    await advance(1000)
    expect(screen.queryByText(/Preparando|Instrumento preparado/)).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Instrumento completo/ }).parentElement?.querySelector('[role="status"]')).toBeNull()
    expect(screen.getByRole('button', { name: 'Preparar instrumento' })).toBeDisabled()
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
    chooseActivitySelection('Tipo de instrumento', 'rubrica')
    await advance(1000)
    await act(async () => { finish(proposal) })
    await advance(1000)
    expect(screen.getByRole('button', { name: 'Tipo de instrumento' })).toHaveTextContent(activitySelectionName('rubrica'))
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
    chooseActivitySelection('Tipo de instrumento', 'lista-cotejo')
    await advance(500)
    await advance(1000)
    expect(screen.getByRole('button', { name: 'Tipo de instrumento' })).toHaveTextContent(activitySelectionName('lista-cotejo'))
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
