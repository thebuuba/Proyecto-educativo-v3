import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { primaryEvaluationProfile, secondaryEvaluationProfile, type EvaluationProfile } from '@aula/shared'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'

import type { Activity } from '../../types'
import { ActivityEditorWorkspace } from '../ActivityEditorWorkspace'
import { ActivityDataSections } from './ActivityDataSections'
import { ActivityEditorProfile } from './ActivityEditorProfile'
import { activityToDraft, draftToActivity, newActivityDraft, validateActivityCompletion, type ActivityDraft } from './editorModel'
import { blockAccents } from './editorPresentation'

const historicalFields = {
  date: '2026-09-14', planningMoment: 'desarrollo' as const,
  studentRole: ' Investigar ', teacherRole: ' Acompañar\n',
  evidenceInstructions: ' Entregar el informe ', observations: '\nTrabajo histórico ',
  planningId: 'planning-123', source: 'planning' as const,
  futurePlanningLink: '/planificacion/123', futureInstrumentLink: '/instrumentos/123',
}
const oldActivity: Activity = {
  id: 'old-activity', name: 'Informe anterior', description: '<p>Investigar y explicar.</p>',
  competencyBlockId: 'b2', competencyBlockWeights: { b2: 1 }, maxScore: 10,
  activityType: 'individual', evaluationTechnique: 'analisis-producciones',
  instrumentType: 'lista-cotejo', instrumentCriteria: {
    'lista-cotejo:meta:criteriaCount': '1', 'lista-cotejo:criterion:0': 'Explica',
    'lista-cotejo:points:0': '10',
  }, ...historicalFields,
}

function Form({ initialDraft, profile, onSave }: {
  initialDraft: ActivityDraft; profile?: EvaluationProfile; onSave?: (draft: ActivityDraft) => void
}) {
  const [draft, setDraft] = useState(initialDraft)
  return <ActivityEditorProfile profile={profile}>
    <ActivityDataSections activityDraft={draft} teams={[]} accent={blockAccents[0]}
      highlightTarget={null} onChangeDraft={setDraft} onScoreChange={() => {}}
      requiredFieldError="" interpretation={{
        suggestedActivityType: 'REPORT', activityType: 'REPORT', activityTypes: ['REPORT'],
        curriculumVersionId: 'v1', curriculumScopeId: 'scope', curriculumMatch: 'SUGGESTED',
        message: 'Detección automática', curriculumCandidates: [{
          elementId: 'element', type: 'CONTENT', text: 'Contenido curricular sugerido', sources: [],
        }],
      }} />
    {onSave ? <button onClick={() => onSave(draft)}>Guardar prueba</button> : null}
  </ActivityEditorProfile>
}

describe('restored activity data cards', () => {
  it('focuses the real description content when its pending checkpoint is selected', async () => {
    const { container } = render(<ActivityEditorWorkspace
      initialDraft={{ ...activityToDraft(oldActivity), description: '' }}
      activityDraftContext={{ schoolId: 'focus-school', userId: 'focus-user', schoolYearId: 'focus-year', sectionSubjectId: 'focus-subject', academicPeriodId: 'focus-period' }}
      courseTitle="Curso de prueba" periodShortName="P1" saving={false}
      onAddActivity={async input => ({ ...input, id: 'created' })}
      onUpdateActivity={async input => input}
    />)
    const content = container.querySelector('[data-activity-required="description"] [contenteditable="true"]')
    expect(content).not.toBeNull()
    fireEvent.click(screen.getByRole('button', { name: /Descripción de la actividad/ }))
    await waitFor(() => expect(content).toHaveFocus())
  })

  it('shows five ordered cards without the removed fields or curriculum notices', () => {
    const { container } = render(<Form initialDraft={activityToDraft(oldActivity)} />)
    expect([...container.querySelectorAll('section')].map(section => section.firstElementChild?.textContent))
      .toEqual(['1. Bloques de competencias', '2. Actividad', '3. Modalidad', '4. Evaluación', '5. Recursos(Opcional)'])
    for (const name of [/Fecha/, /Momento de planificación/, /Rol del estudiante/, /Rol del docente/, /Evidencia esperada/, /Observaciones/]) {
      expect(screen.queryByLabelText(name)).not.toBeInTheDocument()
    }
    expect(screen.queryByText('Contenidos para revisar:')).not.toBeInTheDocument()
    expect(screen.queryByText('Contenido curricular sugerido')).not.toBeInTheDocument()
    expect(screen.getByText('Investigar y explicar.')).toBeInTheDocument()
  })

  it.each([0, 2])('retains historical data after a visible edit when evaluatedCount is %i', (evaluatedCount) => {
    let saved: ReturnType<typeof draftToActivity> | undefined
    const original = { ...oldActivity, evaluatedCount }
    render(<Form initialDraft={activityToDraft(original)} onSave={draft => { saved = draftToActivity(draft, original) }} />)
    fireEvent.change(screen.getByLabelText(/Nombre de la actividad/), { target: { value: 'Informe actualizado' } })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar prueba' }))
    expect(saved).toMatchObject({ name: 'Informe actualizado', ...historicalFields })
  })

  it('does not require hidden fields to complete a new activity', () => {
    const draft = { ...activityToDraft(oldActivity), ...newActivityDraft('b2'),
      name: 'Informe', description: '<p>Explicar.</p>', maxScore: '10', activityType: 'individual' as const,
      evaluationTechnique: 'analisis-producciones', instrumentType: 'lista-cotejo',
      instrumentCompleted: true, instrumentFields: oldActivity.instrumentCriteria!,
    }
    expect(validateActivityCompletion(draft)).toEqual([])
    expect(draftToActivity(draft)).toMatchObject({ date: '', planningMoment: '', studentRole: '', teacherRole: '', observations: '' })
    expect(draftToActivity({ ...draft, planningId: 'origin-planning', source: 'planning', planningMoment: 'inicio' }))
      .toMatchObject({ date: '', planningId: 'origin-planning', source: 'planning', planningMoment: 'inicio' })
  })

  it.each([[primaryEvaluationProfile, 3], [secondaryEvaluationProfile, 4]] as const)(
    'keeps the profile blocks and the selected entry block for %s', (profile, count) => {
      render(<Form profile={profile} initialDraft={newActivityDraft('b2')} />)
      const blocks = screen.getAllByRole('checkbox')
      expect(blocks).toHaveLength(count)
      expect(blocks[1]).toBeChecked()
      expect(blocks[1]).toBeDisabled()
      expect(blocks[0]).not.toBeChecked()
    },
  )
})
