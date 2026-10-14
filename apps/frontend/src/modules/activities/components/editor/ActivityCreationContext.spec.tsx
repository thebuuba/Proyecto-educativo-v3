import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { secondaryEvaluationProfile, type InstrumentRecommendation } from '@aula/shared'
import { api } from '@/services/apiClient'
import { ActivityCreationView } from './ActivityCreationView'
import { newActivityDraft, type ActivityDraft } from './editorModel'
import { editableFallbackRecommendation, preparationFingerprint, recommendationToFields } from '../../services/instrumentPreparation'

vi.mock('@/modules/grading/components/ActivityDescriptionEditor', () => ({
  ActivityDescriptionEditor: ({ value, onChange }: { value: string; onChange: (value: string) => void }) =>
    <textarea aria-label="Descripción de la actividad" value={value} onChange={event => onChange(event.target.value)} />,
}))

function draft(): ActivityDraft {
  const proposal = editableFallbackRecommendation({ activityTitle: 'Actividad', description: 'Analizar los datos.',
    maxScore: 20, instrumentType: 'rubrica', participationMode: 'INDIVIDUAL' })
  const current: ActivityDraft = { ...newActivityDraft('b1'), name: 'Actividad', description: 'Analizar los datos en equipos.', maxScore: '20',
    activityType: 'individual', pedagogicalActivityType: 'ANALYSIS', evaluationTechnique: 'analisis-producciones',
    evidenceInstructions: 'Entregar conclusiones justificadas.', studentRole: 'Observar y colaborar.', resources: ['Cuaderno'],
    observations: 'Valorar la justificación de las conclusiones.', planningMoment: 'cierre',
    instrumentType: 'rubrica', instrumentCompleted: true, instrumentFields: recommendationToFields(proposal, 'Actividad'),
    preparedRecommendation: { ...proposal, catalogVersion: 'evaluation-2026.20' } }
  return { ...current, preparedFingerprint: preparationFingerprint(current) }
}

function editorProps(activityDraft = draft()) {
  return { activityDraft, teams: [], hasDraft: true, block: secondaryEvaluationProfile.blocks[0], editingActivityId: 'saved',
    sectionSubjectId: 'subject', onBack: vi.fn(), onChangeDraft: vi.fn(), onSaveActivity: vi.fn(), onSaveDraft: vi.fn(), saving: false }
}
const expectedContext = { evaluationTechnique: 'analisis-producciones', evidenceInstructions: 'Entregar conclusiones justificadas.',
  resources: ['Cuaderno'], evaluationPriorities: ['Valorar la justificación de las conclusiones.'],
  organizationMode: 'GROUP', participationMode: 'INDIVIDUAL', planningMoment: 'cierre' }

beforeEach(() => { vi.restoreAllMocks(); localStorage.clear() })

describe('contexto del editor modular para preparar instrumentos', () => {
  it('envía la evidencia dedicada y distingue organización de participación en la interpretación', async () => {
    const post = vi.spyOn(api, 'post').mockResolvedValue({ curriculumCandidates: [] } as never)
    render(<ActivityCreationView {...editorProps({ ...draft(), preparedManuallyEdited: true })} editingActivityId={null} />)
    await waitFor(() => expect(post.mock.calls.find(([path]) => path.endsWith('/interpret'))?.[1]).toMatchObject(expectedContext))
  })

  it.each(['prepare', 'additional'] as const)('envía el contexto completo para %s', async request => {
    const original = draft()
    const post = vi.spyOn(api, 'post').mockResolvedValue(original.preparedRecommendation as never)
    render(<ActivityCreationView {...editorProps(original)} />)
    fireEvent.click(screen.getByRole('button', { name: request === 'prepare' ? 'Generar nuevo instrumento' : 'Agregar criterio' }))
    await waitFor(() => expect(post.mock.calls.find(([path]) => path.endsWith('/recommend'))?.[1]).toMatchObject(expectedContext))
    if (request === 'additional') expect(post.mock.calls.find(([path]) => path.endsWith('/recommend'))?.[1]).toMatchObject({ includeAdditionalCandidates: true })
  })

  it('ajusta sólo la copia enviada a los límites del servicio y conserva el borrador completo', async () => {
    const original = { ...draft(), resources: [...Array.from({ length: 20 }, (_, index) => `Recurso ${index}`), 'Otro recurso'],
      observations: 'P'.repeat(301), evidenceInstructions: 'E'.repeat(2001), evaluationTechnique: 'T'.repeat(101) }
    original.resources[0] = '  ' + 'R'.repeat(151) + '  '
    const props = editorProps({ ...original, preparedFingerprint: preparationFingerprint(original) })
    const post = vi.spyOn(api, 'post').mockResolvedValue(original.preparedRecommendation as never)
    render(<ActivityCreationView {...props} />)
    fireEvent.click(screen.getByRole('button', { name: 'Generar nuevo instrumento' }))
    await waitFor(() => expect(post).toHaveBeenCalledTimes(1))
    const sent = post.mock.calls[0][1] as { resources: string[]; evaluationPriorities: string[]; evidenceInstructions: string; evaluationTechnique: string }
    expect(sent.resources).toHaveLength(20)
    expect(sent.resources[0]).toBe('R'.repeat(150))
    expect(sent.evaluationPriorities).toEqual(['P'.repeat(300)])
    expect(sent.evidenceInstructions).toHaveLength(2000)
    expect(sent.evaluationTechnique).toHaveLength(100)
    expect(props.activityDraft.resources).toHaveLength(21)
    expect(props.activityDraft.observations).toHaveLength(301)
    expect(props.activityDraft.evidenceInstructions).toHaveLength(2001)
  })

  it.each([
    { evidenceInstructions: 'Entregar un mapa conceptual.' }, { evaluationTechnique: 'debate' }, { resources: ['Pizarra'] },
    { observations: 'Valorar precisión.' }, { planningMoment: 'inicio' }, { teamIds: ['team'] },
  ])('descarta la preparación tardía después de cambiar %j', async change => {
    const original = draft()
    let finish!: (proposal: InstrumentRecommendation) => void
    const pending = new Promise<InstrumentRecommendation>(resolve => { finish = resolve })
    const post = vi.spyOn(api, 'post').mockImplementation(async () => await pending as never)
    const props = editorProps(original)
    const view = render(<ActivityCreationView {...props} />)
    fireEvent.click(screen.getByRole('button', { name: 'Generar nuevo instrumento' }))
    await waitFor(() => expect(post).toHaveBeenCalledTimes(1))
    view.rerender(<ActivityCreationView {...props} activityDraft={{ ...original, ...change }} />)
    props.onChangeDraft.mockClear()
    await act(async () => { finish(original.preparedRecommendation!); await pending })
    expect(props.onChangeDraft.mock.calls.some(([value]) => !value.preparedManuallyEdited && value.preparedRecommendation)).toBe(false)
  })

  it('descarta una interpretación tardía cuando cambia la evidencia', async () => {
    let finish!: (value: unknown) => void
    const pending = new Promise(resolve => { finish = resolve })
    const post = vi.spyOn(api, 'post').mockImplementation(async () => await pending as never)
    const original = { ...draft(), preparedRecommendation: undefined, manualInstrumentBlank: true, evaluationTechnique: '', pedagogicalActivityType: '' }
    const props = { ...editorProps(original), editingActivityId: null }
    const view = render(<ActivityCreationView {...props} />)
    await waitFor(() => expect(post).toHaveBeenCalledTimes(1))
    view.rerender(<ActivityCreationView {...props} activityDraft={{ ...original, evidenceInstructions: 'Una nueva evidencia.' }} />)
    props.onChangeDraft.mockClear()
    await act(async () => { finish({ suggestedActivityType: 'DEBATE', suggestedEvaluationTechnique: 'debate', curriculumCandidates: [] }); await pending })
    expect(props.onChangeDraft.mock.calls.some(([value]) => value.evaluationTechnique === 'debate')).toBe(false)
  })

  it('prepara la alternativa local desde la evidencia dedicada sin inventar apoyos visuales', async () => {
    vi.spyOn(api, 'post').mockRejectedValue(new Error('offline'))
    const original = { ...draft(), description: 'Aplicar lo aprendido.', evidenceInstructions: 'Entregar un mapa conceptual.',
      pedagogicalActivityType: 'OTHER', autoDetectedPedagogicalActivityType: true, evaluationTechnique: '', resources: ['Diapositivas'] }
    const props = editorProps({ ...original, preparedFingerprint: preparationFingerprint(original) })
    render(<ActivityCreationView {...props} />)
    fireEvent.change(screen.getByRole('combobox', { name: 'Tipo de instrumento' }), { target: { value: 'escala' } })
    await screen.findByText(/Revisa el instrumento alternativo antes de guardar/)
    const recovered = props.onChangeDraft.mock.calls.find(([value]) => value.preparedRecommendation?.instrumentType === 'escala')?.[0]
    expect(recovered?.preparedRecommendation?.activityType).toBe('CONCEPT_MAP')
    expect(recovered?.preparedRecommendation?.criteria).toHaveLength(4)
    expect(JSON.stringify(recovered?.preparedRecommendation?.criteria)).not.toMatch(/recursos visuales|diapositivas/i)
  })
})
