import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { secondaryEvaluationProfile } from '@aula/shared'
import { ActivityEditorWorkspace } from './ActivityEditorWorkspace'
import { activityToDraft, draftToActivity, newActivityDraft } from './editor/editorModel'
import {
  editableFallbackRecommendation,
  preparationFingerprint,
  recommendationToFields,
} from '../services/instrumentPreparation'
import { activityDraftStorageKey, readActivityDrafts } from '../utils/activityDraftStorage'
import { api } from '@/services/apiClient'

vi.mock('@/modules/grading/components/ActivityDescriptionEditor', () => ({
  ActivityDescriptionEditor: ({
    value,
    onChange,
  }: {
    value: string
    onChange: (value: string) => void
  }) => (
    <textarea
      aria-label="Descripción de la actividad"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  ),
}))
const context = {
  schoolId: 'school',
  userId: 'app-user',
  schoolYearId: 'year',
  sectionSubjectId: 'subject',
  academicPeriodId: 'period',
}
function readyDraft() {
  const draft = {
    ...newActivityDraft('b1'),
    name: 'Informe',
    description: 'Elaborar un informe con evidencia.',
    maxScore: '20',
    activityType: 'individual' as const,
    evaluationTechnique: 'analisis-producciones',
    instrumentType: 'lista-cotejo',
    instrumentCompleted: true,
    preparedManuallyEdited: true,
  }
  const proposal = editableFallbackRecommendation({
    activityTitle: draft.name,
    description: draft.description,
    maxScore: 20,
    instrumentType: 'lista-cotejo',
    participationMode: 'INDIVIDUAL',
  })
  return {
    ...draft,
    instrumentFields: recommendationToFields(proposal, draft.name),
    preparedRecommendation: proposal,
    preparedFingerprint: preparationFingerprint(draft),
  }
}
function props() {
  return {
    activityDraftContext: context,
    courseTitle: 'Curso',
    periodShortName: 'P1',
    saving: false,
    onAddActivity: vi.fn(async (input) => ({ ...input, id: 'saved' })),
    onUpdateActivity: vi.fn(async (input) => input),
  }
}

describe('independent activity editor', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })
  it('prepares after selecting a type and moving immediately to Instrument despite automatic field initialization', async () => {
    const draft = {
      ...newActivityDraft('b1'),
      name: 'Informe',
      description: 'Analizar un texto.',
      maxScore: '20',
      activityType: 'individual' as const,
      evaluationTechnique: 'analisis-producciones',
      pedagogicalActivityType: 'REPORT',
    }
    const proposal = editableFallbackRecommendation({
      activityTitle: draft.name,
      description: draft.description,
      maxScore: 20,
      instrumentType: 'lista-cotejo',
      participationMode: 'INDIVIDUAL',
    })
    vi.spyOn(api, 'post').mockImplementation(async (path) => {
      if (path.endsWith('/recommend')) return proposal as never
      throw new Error('Sin interpretación remota')
    })
    render(<ActivityEditorWorkspace {...props()} initialDraft={draft} sectionSubjectId="subject" />)
    fireEvent.change(screen.getByRole('combobox', { name: 'Tipo de instrumento' }), {
      target: { value: 'lista-cotejo' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Continuar al instrumento' }))
    await waitFor(
      () =>
        expect(screen.getByPlaceholderText('1. Criterio')).toHaveValue(proposal.criteria[0].title),
      { timeout: 5000 },
    )
    expect(readActivityDrafts(context)[0].draft.instrumentCompleted).toBe(true)
  }, 10000)
  it('does not replace a manual edit made after the preparation request starts', async () => {
    const draft = {
      ...newActivityDraft('b1'),
      name: 'Informe',
      description: 'Analizar un texto.',
      maxScore: '20',
      activityType: 'individual' as const,
      evaluationTechnique: 'analisis-producciones',
      pedagogicalActivityType: 'REPORT',
    }
    const proposal = editableFallbackRecommendation({
      activityTitle: draft.name,
      description: draft.description,
      maxScore: 20,
      instrumentType: 'lista-cotejo',
      participationMode: 'INDIVIDUAL',
    })
    let finish!: (value: typeof proposal) => void
    const pending = new Promise<typeof proposal>((resolve) => {
      finish = resolve
    })
    const post = vi.spyOn(api, 'post').mockImplementation(async (path) => {
      if (path.endsWith('/recommend')) return (await pending) as never
      throw new Error('Sin interpretación remota')
    })
    render(<ActivityEditorWorkspace {...props()} initialDraft={draft} sectionSubjectId="subject" />)
    fireEvent.change(screen.getByRole('combobox', { name: 'Tipo de instrumento' }), {
      target: { value: 'lista-cotejo' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Continuar al instrumento' }))
    await waitFor(
      () => expect(post.mock.calls.some(([path]) => path.endsWith('/recommend'))).toBe(true),
      { timeout: 5000 },
    )
    fireEvent.change(screen.getByPlaceholderText('1. Criterio'), {
      target: { value: 'Mi criterio manual' },
    })
    await act(async () => {
      finish(proposal)
      await pending
    })
    expect(screen.getByPlaceholderText('1. Criterio')).toHaveValue('Mi criterio manual')
    expect(
      readActivityDrafts(context)[0].draft.instrumentFields?.['lista-cotejo:criterion:0'],
    ).toBe('Mi criterio manual')
  }, 10000)
  it('sets and clears optional date and planning moment visibly, including graded edits', async () => {
    const input = props()
    const activity = { ...draftToActivity(readyDraft()), id: 'dated', evaluatedCount: 1 }
    const first = render(<ActivityEditorWorkspace {...input} activity={activity} />)
    fireEvent.change(screen.getByLabelText('Fecha (opcional)'), { target: { value: '2026-10-14' } })
    fireEvent.change(screen.getByLabelText('Momento de planificación (opcional)'), {
      target: { value: 'cierre' },
    })
    fireEvent.click(screen.getByRole('button', { name: '3. Revisar y guardar' }))
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar y guardar' }))
    await screen.findByText('Actividad actualizada')
    const dated = input.onUpdateActivity.mock.calls[0][0]
    expect(dated).toMatchObject({ date: '2026-10-14', planningMoment: 'cierre' })
    first.unmount()
    render(<ActivityEditorWorkspace {...input} activity={dated} />)
    fireEvent.change(screen.getByLabelText('Fecha (opcional)'), { target: { value: '' } })
    fireEvent.change(screen.getByLabelText('Momento de planificación (opcional)'), {
      target: { value: '' },
    })
    fireEvent.click(screen.getByRole('button', { name: '3. Revisar y guardar' }))
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar y guardar' }))
    await screen.findByText('Actividad actualizada')
    expect(input.onUpdateActivity.mock.calls[1][0]).toMatchObject({ date: '', planningMoment: '' })
  })
  it('confirms starting from scratch before overwriting manually edited and autosaved fields', async () => {
    const draft = readyDraft()
    render(<ActivityEditorWorkspace {...props()} initialDraft={draft} />)
    fireEvent.change(screen.getByRole('textbox', { name: 'Rol del docente' }), {
      target: { value: 'Guiar' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Continuar al instrumento' }))
    const storedBefore = readActivityDrafts(context)[0].draft.instrumentFields
    fireEvent.click(screen.getByRole('button', { name: 'Crear desde cero' }))
    expect(screen.getByRole('dialog')).toHaveTextContent('Reemplazar')
    expect(readActivityDrafts(context)[0].draft.instrumentFields).toEqual(storedBefore)
    fireEvent.click(screen.getByRole('button', { name: 'Conservar cambios' }))
    expect(readActivityDrafts(context)[0].draft.instrumentFields).toEqual(storedBefore)
    fireEvent.click(screen.getByRole('button', { name: 'Crear desde cero' }))
    fireEvent.click(screen.getByRole('button', { name: 'Cambiar instrumento' }))
    await waitFor(() =>
      expect(readActivityDrafts(context)[0].draft).toMatchObject({ manualInstrumentBlank: true }),
    )
    expect(readActivityDrafts(context)[0].draft.instrumentFields).not.toEqual(storedBefore)
  })
  it('keeps a versioned ungraded instrument after reviewing a title correction', async () => {
    const input = props()
    const draft = readyDraft()
    const activity = {
      ...draftToActivity(draft),
      id: 'versioned',
      evaluatedCount: 0,
      instrumentSnapshot: { ...draft.preparedRecommendation, catalogVersion: 'evaluation-2026.7' },
      instrumentSnapshotId: 'snapshot',
      instrumentSnapshotVersion: 2,
    }
    render(<ActivityEditorWorkspace {...input} activity={activity} />)
    fireEvent.change(screen.getByRole('textbox', { name: /Nombre de la actividad/ }), {
      target: { value: 'Informe corregido' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Continuar al instrumento' }))
    fireEvent.click(screen.getByRole('button', { name: 'Conservar instrumento actual' }))
    fireEvent.click(screen.getByRole('button', { name: '3. Revisar y guardar' }))
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar y guardar' }))
    await screen.findByText('Actividad actualizada')
    const saved = input.onUpdateActivity.mock.calls[0][0]
    expect(saved).toMatchObject({
      name: 'Informe corregido',
      instrumentCriteria: activity.instrumentCriteria,
    })
    expect(saved.instrumentSnapshot?.criteria.map((row: { id: string }) => row.id)).toEqual(
      activity.instrumentSnapshot.criteria.map((row) => row.id),
    )
  })
  it('preserves fields and the same creation ID when save fails, then removes only that draft on success', async () => {
    const input = props(),
      draft = readyDraft()
    input.onAddActivity.mockRejectedValueOnce(new Error('Sin conexión'))
    render(<ActivityEditorWorkspace {...input} initialDraft={draft} />)
    fireEvent.change(screen.getByRole('textbox', { name: 'Rol del docente' }), {
      target: { value: 'Orientar' },
    })
    await waitFor(() => expect(readActivityDrafts(context)).toHaveLength(1))
    fireEvent.click(screen.getByRole('button', { name: 'Continuar al instrumento' }))
    fireEvent.click(screen.getByRole('button', { name: 'Revisar y guardar' }))
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar y guardar' }))
    await waitFor(() => expect(input.onAddActivity).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(screen.getByRole('dialog')).toHaveTextContent('Sin conexión'))
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar y guardar' }))
    await screen.findByText('Actividad creada')
    expect(input.onAddActivity.mock.calls[0][0].creationId).toBe(draft.creationId)
    expect(input.onAddActivity.mock.calls[1][0].creationId).toBe(draft.creationId)
    expect(input.onAddActivity.mock.calls[1][0].teacherRole).toBe('Orientar')
    expect(readActivityDrafts(context)).toHaveLength(0)
  })
  it('reports denied storage and preserves the editable state without claiming autosave', async () => {
    const failing = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Quota')
    })
    render(<ActivityEditorWorkspace {...props()} />)
    fireEvent.change(screen.getByPlaceholderText('Ej: Exposición oral sobre el cambio climático'), {
      target: { value: 'Conservar' },
    })
    expect(
      screen.getByPlaceholderText('Ej: Exposición oral sobre el cambio climático'),
    ).toHaveValue('Conservar')
    expect(screen.queryByText('Borrador autoguardado')).not.toBeInTheDocument()
    expect(screen.getAllByText(/guardar.*borrador|almacenamiento/i).length).toBeGreaterThan(0)
    failing.mockRestore()
  })
  it('keeps profile contexts independent between simultaneous primary and secondary editors', () => {
    const primary = {
      ...secondaryEvaluationProfile,
      blocks: secondaryEvaluationProfile.blocks.slice(0, 3),
    }
    render(
      <div>
        <div data-testid="primary">
          <ActivityEditorWorkspace {...props()} evaluationProfile={primary} />
        </div>
        <div data-testid="secondary">
          <ActivityEditorWorkspace {...props()} evaluationProfile={secondaryEvaluationProfile} />
        </div>
      </div>,
    )
    expect(
      within(screen.getByTestId('primary')).getAllByRole('checkbox', { name: /Bloque/ }),
    ).toHaveLength(3)
    expect(
      within(screen.getByTestId('secondary')).getAllByRole('checkbox', { name: /Bloque/ }),
    ).toHaveLength(4)
  })
  it('restores scoped IDs and does not expose a legacy label draft', async () => {
    localStorage.setItem(
      'grading-activity-drafts:Curso:P1',
      JSON.stringify({ b1: [{ ...readyDraft(), name: 'Otro usuario' }] }),
    )
    const draft = readyDraft()
    localStorage.setItem(
      activityDraftStorageKey(context),
      JSON.stringify({
        context,
        courseTitle: 'Nombre anterior',
        periodShortName: 'Antiguo',
        drafts: { b1: [draft] },
      }),
    )
    render(<ActivityEditorWorkspace {...props()} initialActivityDraftId={draft.draftId} />)
    await waitFor(() =>
      expect(
        screen.getByPlaceholderText('Ej: Exposición oral sobre el cambio climático'),
      ).toHaveValue('Informe'),
    )
    expect(screen.queryByDisplayValue('Otro usuario')).not.toBeInTheDocument()
  })
  it('allows metadata edits with grades and retains the original structural definition', () => {
    const activity = {
      ...draftToActivity(readyDraft()),
      id: 'original',
      evaluatedCount: 2,
      evidenceInstructions: 'Entregar PDF',
      planningId: 'plan',
      source: 'planning' as const,
    }
    const draft = activityToDraft(activity)
    expect(draft.preparedFingerprint).toBe(preparationFingerprint(draft))
    const saved = draftToActivity({ ...draft, name: 'Nuevo título', maxScore: '99' }, activity)
    expect(saved).toMatchObject({
      name: 'Nuevo título',
      maxScore: 20,
      evidenceInstructions: 'Entregar PDF',
      planningId: 'plan',
      source: 'planning',
    })
    render(<ActivityEditorWorkspace {...props()} activity={activity} />)
    expect(screen.getByRole('textbox', { name: /Valor en puntos/ })).toBeDisabled()
    expect(screen.getByRole('textbox', { name: /Nombre de la actividad/ })).not.toBeDisabled()
  })

  it('duplicates a graded activity into a fresh editable draft and creates rather than updates', async () => {
    const input = props()
    const activity = { ...draftToActivity(readyDraft()), id: 'graded', evaluatedCount: 2 }
    render(<ActivityEditorWorkspace {...input} activity={activity} />)
    fireEvent.click(
      screen.getByRole('button', { name: 'Duplicar actividad para editar su estructura' }),
    )
    expect(screen.getByRole('textbox', { name: /Nombre de la actividad/ })).toHaveValue(
      'Informe copia',
    )
    expect(screen.getByRole('textbox', { name: /Valor en puntos/ })).not.toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: '3. Revisar y guardar' }))
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar y guardar' }))
    await screen.findByText('Actividad creada')
    expect(input.onUpdateActivity).not.toHaveBeenCalled()
    expect(input.onAddActivity).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Informe copia',
        creationId: expect.any(String),
        instrumentCriteria: activity.instrumentCriteria,
      }),
    )
    expect(input.onAddActivity.mock.calls[0][0]).not.toHaveProperty('id')
  })
})
