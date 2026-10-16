import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, expect, it, vi } from 'vitest'

import { ActivityCreatorPage } from '../pages/ActivityCreatorPage'
import { readActivityDrafts, writeActivityDrafts } from '../utils/activityDraftStorage'
import { newActivityDraft } from './editor/editorModel'

vi.mock('@/modules/auth/hooks/useAuth', () => ({
  useAuth: () => ({ schoolId: 'personal-school', appUser: { id: 'teacher' } }),
}))
vi.mock('@/services/apiClient', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/services/apiClient')>()
  const { secondaryEvaluationProfile } = await import('@aula/shared')
  return {
    ...original,
    api: {
      ...original.api,
      get: vi.fn(async (path: string) => {
        if (path === '/activities/center') return {
          sectionSubjects: [{
            id: 'english', schoolYearId: 'year', gradeName: '6.º', gradeSequence: 6,
            sectionName: 'A', subjectName: 'Inglés', subjectCode: 'ING',
            academicLevelCode: 'secundario', evaluationProfile: secondaryEvaluationProfile,
          }, {
            id: 'french', schoolYearId: 'year', gradeName: '1.º', gradeSequence: 1,
            sectionName: 'A', subjectName: 'Francés', subjectCode: 'FRA',
            academicLevelCode: 'secundario', evaluationProfile: secondaryEvaluationProfile,
          }],
          academicPeriods: [{ id: 'period', schoolYearId: 'year', name: 'P1', sequence: 1 }],
          activities: [],
        }
        if (path === '/activities?sectionSubjectId=english&academicPeriodId=period'
          || path === '/courses/section-subjects/english/teams'
          || path === '/activities?sectionSubjectId=french&academicPeriodId=period'
          || path === '/courses/section-subjects/french/teams') return []
        throw new Error(`Unexpected GET: ${path}`)
      }),
      post: vi.fn(async () => { throw new Error('Sin servicio de preparación en esta prueba') }),
    },
  }
})

const context = {
  schoolId: 'personal-school', userId: 'teacher', schoolYearId: 'year',
  sectionSubjectId: 'english', academicPeriodId: 'period',
}
const strategyLabel = 'Estrategia de enseñanza y aprendizaje'
const activityTitle = 'Una entrevista de trabajo en inglés.'
const activityDescription = 'En parejas, los estudiantes realizarán una entrevista de trabajo simulada en inglés. Uno entrevistará y el otro responderá sobre la experiencia y las capacidades de un personaje ficticio. Luego intercambiarán los roles.'

beforeEach(() => localStorage.clear())

it.each(['english', 'french'].flatMap(subject => ['nuevo', 'histórico'].map(mode => ({ subject, mode }))))(
  'muestra una sola estrategia en el creador $mode de $subject sin asignar puntos',
  async ({ subject, mode }) => {
    const currentContext = { ...context, sectionSubjectId: subject }
    const title = subject === 'french' ? 'Nos presentamos en francés' : activityTitle
    const description = subject === 'french' ? 'En parejas, los estudiantes se saludarán en francés y realizarán un diálogo breve para preguntar y responder su nombre, edad y lugar de residencia. Luego intercambiarán los roles.' : activityDescription
    const params = new URLSearchParams({ sectionSubjectId: subject, academicPeriodId: 'period' })
    if (mode === 'histórico') {
      const draft = { ...newActivityDraft('b2'), draftId: `historical-${subject}-interview`, name: title, description }
      delete draft.teachingStrategyId
      delete draft.teachingStrategyOrigin
      writeActivityDrafts(currentContext, { b2: [draft] }, { courseTitle: subject, periodShortName: 'P1' })
      params.set('activityDraftId', draft.draftId)
    }
    render(
      <MemoryRouter initialEntries={[`/actividades/crear?${params}`]}>
        <Routes>
          <Route path="/actividades/crear" element={<ActivityCreatorPage />} />
        </Routes>
      </MemoryRouter>,
    )

    const name = await screen.findByRole('textbox', { name: /Nombre de la actividad/ })
    await waitFor(() => expect(name).toHaveValue(mode === 'histórico' ? title : ''))
    const strategy = screen.getByRole('combobox', { name: strategyLabel })
    expect(screen.getAllByRole('combobox', { name: strategyLabel })).toHaveLength(1)
    expect(strategy).toBeVisible()
    expect(strategy).toHaveTextContent('Sin estrategia')
    expect(screen.getByRole('textbox', { name: /Valor en puntos/ })).toHaveValue('')

    const activityType = screen.getByRole('combobox', { name: 'Tipo de actividad' })
    const modality = screen.getByText('3. Modalidad')
    expect(activityType.compareDocumentPosition(strategy) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(strategy.compareDocumentPosition(modality) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(strategy.closest('section')).toBe(activityType.closest('section'))

    fireEvent.click(strategy)
    fireEvent.click(within(screen.getByRole('listbox', { name: strategyLabel })).getByRole('option', { name: 'Debate' }))
    expect(strategy).toHaveTextContent('Debate')
    await waitFor(() => expect(readActivityDrafts(currentContext)[0]?.draft).toMatchObject({
      teachingStrategyId: 'DEBATE', teachingStrategyOrigin: 'MANUAL', maxScore: '',
      ...(mode === 'histórico' ? { name: title, description, competencyBlockId: 'b2' } : {}),
    }))
    expect(screen.getAllByRole('combobox', { name: strategyLabel })).toHaveLength(1)
    expect(screen.getByRole('textbox', { name: /Valor en puntos/ })).toHaveValue('')
  },
)
