import {chooseActivitySelection,activitySelectionName} from '@/modules/activities/components/activitySelectionTestUtils'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { beforeEach, expect, it, vi } from 'vitest'
import { PlanningPage } from './PlanningPage'
import { ActivityCreator } from '@/modules/activities/components/ActivityCreator'
import {
  readActivityDrafts,
  writeActivityDrafts,
} from '@/modules/activities/utils/activityDraftStorage'
import {
  editableFallbackRecommendation,
  preparationFingerprint,
  recommendationToFields,
} from '@/modules/activities/services/instrumentPreparation'
import { api } from '@/services/apiClient'

vi.mock('@/modules/auth/hooks/useAuth', () => ({
  useAuth: () => ({ schoolId: 'school', appUser: { id: 'user', schoolId: 'school' } }),
}))
vi.mock('@/modules/courses/services/coursesService', () => ({
  getCourseTeams: vi.fn().mockResolvedValue([]),
}))
vi.mock('@/services/apiClient', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/services/apiClient')>()
  const profile = (await import('@aula/shared')).secondaryEvaluationProfile
  return {
    ...original,
    api: {
      ...original.api,
      get: vi.fn(async (path: string) =>
        path === '/activities/center?contextOnly=true'
          ? {
              activities: [],
              sectionSubjects: [
                {
                  id: 'subject',
                  schoolYearId: 'year',
                  gradeName: '1',
                  sectionName: 'A',
                  subjectName: 'Lengua',
                  evaluationProfile: profile,
                },
              ],
              academicPeriods: [{ id: 'period', schoolYearId: 'year', name: 'P1', sequence: 1 }],
            }
          : [],
      ),
      post: vi.fn(async (path: string, input: object) => {
        if (path.startsWith('/evaluation-instruments/')) throw new Error('Usar alternativa local')
        return { ...input, id: 'saved' }
      }),
    },
  }
})
vi.mock('@/modules/grading/components/ActivityDescriptionEditor', () => ({
  ActivityDescriptionEditor: ({
    value,
    onChange,
  }: {
    value: string
    onChange: (value: string) => void
  }) => (
    <textarea
      aria-label="Descripción"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  ),
}))
vi.mock('@/modules/planning/hooks/usePlanning', () => ({
  usePlanning: () => ({
    schoolYearId: 'year',
    schoolName: 'Escuela',
    loading: false,
    error: null,
    periods: [{ id: 'period', name: 'P1' }],
    activePeriodId: 'period',
    setActivePeriodId: vi.fn(),
    sectionSubjects: [{ id: 'subject', subjectName: 'Lengua', gradeName: '1', sectionName: 'A' }],
    competencies: [],
    entries: [
      {
        id: 'plan-1',
        title: 'Plan lector',
        sectionSubjectId: 'subject',
        academicPeriodId: 'period',
        status: 'active',
        gradeName: '1',
        sectionName: 'A',
        subjectName: 'Lengua',
        periodName: 'P1',
        activities: { inicio: '', desarrollo: '', cierre: '' },
      },
    ],
  }),
}))

function Probe() {
  const location = useLocation(),
    navigate = useNavigate()
  return (
    <>
      <span data-testid="route">
        {location.pathname}
        {location.search}
      </span>
      <button
        onClick={() => {
          const entry = readActivityDrafts({ schoolId: 'school', userId: 'user' })[0]
          navigate(
            `/actividades/crear?sectionSubjectId=subject&academicPeriodId=period&activityDraftId=${entry.draft.draftId}`,
          )
        }}
      >
        Recuperar borrador
      </button>
    </>
  )
}

beforeEach(() => {
  localStorage.clear()
  vi.mocked(api.post).mockClear()
})
it('creates from a real planning card and recovers its link and return destination with the scoped draft', async () => {
  render(
    <MemoryRouter initialEntries={['/planificaciones?tab=planificaciones']}>
      <Probe />
      <Routes>
        <Route path="/planificaciones" element={<PlanningPage />} />
        <Route path="/actividades/crear" element={<ActivityCreator />} />
      </Routes>
    </MemoryRouter>,
  )
  fireEvent.click(screen.getByRole('button', { name: 'Crear actividad' }))
  await screen.findByRole('textbox', { name: /Nombre de la actividad/ })
  expect(screen.getByTestId('route')).toHaveTextContent(
    'sectionSubjectId=subject&academicPeriodId=period&planningEntryId=plan-1',
  )
  fireEvent.change(screen.getByRole('textbox', { name: /Nombre de la actividad/ }), {
    target: { value: 'Actividad vinculada' },
  })
  await waitFor(() =>
    expect(readActivityDrafts({ schoolId: 'school', userId: 'user' })).toHaveLength(1),
  )
  expect(readActivityDrafts({ schoolId: 'school', userId: 'user' })[0].draft).toMatchObject({
    planningId: 'plan-1',
    source: 'planning',
  })
  fireEvent.click(screen.getByRole('button', { name: 'Volver a Planificación' }))
  expect(screen.getByTestId('route')).toHaveTextContent(
    '/planificaciones?tab=planificaciones&entryId=plan-1&academicPeriodId=period',
  )
  // Resume a completed local draft: retain the actual origin/link written through the editor.
  const stored = readActivityDrafts({ schoolId: 'school', userId: 'user' })[0]
  const completed = {
    ...stored.draft,
    name: 'Actividad vinculada',
    description: 'Analizar el texto.',
    teachingStrategyId: 'DEBATE',
    teachingStrategyOrigin: 'MANUAL' as const,
    maxScore: '20',
    activityType: 'individual',
    evaluationTechnique: 'analisis-producciones',
    instrumentType: 'lista-cotejo',
    instrumentCompleted: true,
    preparedManuallyEdited: true,
  }
  const proposal = editableFallbackRecommendation({
    activityTitle: completed.name,
    description: completed.description,
    maxScore: 20,
    instrumentType: 'lista-cotejo',
    participationMode: 'INDIVIDUAL',
  })
  writeActivityDrafts(
    stored.context,
    {
      b1: [
        {
          ...completed,
          instrumentFields: recommendationToFields(proposal, completed.name),
          preparedRecommendation: proposal,
          preparedFingerprint: preparationFingerprint(completed),
        },
      ],
    },
    stored,
  )
  fireEvent.click(screen.getByRole('button', { name: 'Recuperar borrador' }))
  await waitFor(() =>
    expect(screen.getByRole('textbox', { name: /Nombre de la actividad/ })).toHaveValue(
      'Actividad vinculada',
    ),
  )
  fireEvent.click(screen.getByRole('button', { name: 'Guardar' }))
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar y guardar' }))
  await screen.findByText('Actividad creada')
  expect(api.post).toHaveBeenCalledWith(
    '/activities',
    expect.objectContaining({
      planningEntryId: 'plan-1',
      source: 'planning',
      teachingStrategyId: 'DEBATE',
      teachingStrategyOrigin: 'MANUAL',
      sectionSubjectId: 'subject',
      academicPeriodId: 'period',
    }),
  )
  expect(readActivityDrafts(stored.context)).toHaveLength(0)
  const firstPayload = vi
    .mocked(api.post)
    .mock.calls.find(([path]) => path === '/activities')?.[1] as { creationId: string }
  fireEvent.click(screen.getByRole('button', { name: 'Crear otra' }))
  expect(screen.getByRole('textbox', { name: /Nombre de la actividad/ })).toHaveValue('')
  expect(screen.getByRole('textbox', { name: 'Descripción' })).toHaveValue('')
  expect(screen.getByRole('button', { name: 'Tipo de instrumento' })).toHaveTextContent(activitySelectionName(''))
  expect(screen.getByRole('button', { name: 'Volver a Planificación' })).toBeInTheDocument()
  fireEvent.change(screen.getByRole('textbox', { name: /Nombre de la actividad/ }), {
    target: { value: 'Segundo informe' },
  })
  fireEvent.change(screen.getByRole('textbox', { name: 'Descripción' }), {
    target: { value: 'Analizar otra lectura y elaborar un informe.' },
  })
  fireEvent.change(screen.getByRole('textbox', { name: /Valor en puntos/ }), {
    target: { value: '20' },
  })
  fireEvent.click(screen.getByRole('button', { name: /^Individual/ }))
  chooseActivitySelection('Tipo de actividad', 'REPORT')
  chooseActivitySelection('Técnica de evaluación', 'analisis-producciones')
  chooseActivitySelection('Tipo de instrumento', 'lista-cotejo')
  await waitFor(
    () =>
      expect(readActivityDrafts(stored.context)[0].draft).toMatchObject({
        instrumentCompleted: true,
      }),
    { timeout: 5000 },
  )
  fireEvent.click(screen.getByRole('button', { name: 'Guardar' }))
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar y guardar' }))
  await screen.findByText('Actividad creada')
  const writes = vi.mocked(api.post).mock.calls.filter(([path]) => path === '/activities')
  expect(writes).toHaveLength(2)
  expect(writes[1][1]).toMatchObject({
    planningEntryId: 'plan-1',
    source: 'planning',
    name: 'Segundo informe',
    sectionSubjectId: 'subject',
    academicPeriodId: 'period',
  })
  expect((writes[1][1] as { creationId: string }).creationId).not.toBe(firstPayload.creationId)
  fireEvent.click(screen.getByRole('button', { name: 'Volver a Planificación' }))
  expect(screen.getByTestId('route')).toHaveTextContent('entryId=plan-1')
}, 15000)
