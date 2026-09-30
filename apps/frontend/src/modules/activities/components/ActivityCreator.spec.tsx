import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { ActivityCreator } from './ActivityCreator'
import type { Activity } from '@/modules/activities/types'

vi.mock('@/modules/activities/services/activitiesService', () => ({
  getActivityCenter: vi.fn().mockResolvedValue({
    sectionSubjects: [{ id: 'ss-1', schoolYearId: 'year-1', gradeName: '2.º', sectionName: 'A', subjectName: 'Ciencias', academicLevelCode: 'primario', evaluationProfile: { id: 'primary-official', academicLevelCode: 'primario', expectedBlockTotal: 100, requiredPeriodCount: 4, blocks: [{ id: 'b1' }, { id: 'b2' }, { id: 'b3' }] } }],
    academicPeriods: [{ id: 'period-1', schoolYearId: 'year-1', name: 'P1', sequence: 1 }],
    activities: [],
  }),
  getActivities: vi.fn().mockResolvedValue([]),
  saveActivity: vi.fn(),
  deleteActivity: vi.fn(),
}))

vi.mock('@/modules/courses/services/coursesService', () => ({ getCourseTeams: vi.fn().mockResolvedValue([]) }))

vi.mock('@/modules/grading/components/GradingBook', () => ({
  GradingBook: (props: { initialActivityAction?: string; originReturnLabel?: string; onReturnToOrigin: () => void; onGradeCreatedActivity: (activity: Activity) => void; evaluationProfile?: { blocks: Array<{ id: string }> } }) => <div>
    <span>{props.initialActivityAction}</span>
    <span data-testid="profile-blocks">{props.evaluationProfile?.blocks.map((block) => block.id).join(',')}</span>
    <button onClick={props.onReturnToOrigin}>{props.originReturnLabel}</button>
    <button onClick={() => props.onGradeCreatedActivity({ id: 'persisted-activity', name: 'Actividad nueva', maxScore: 20, competencyBlockId: 'b1' })}>Calificar guardada</button>
  </div>,
}))

function Location() { return <span data-testid="location">{useLocation().pathname}{useLocation().search}</span> }

describe('ActivityCreator', () => {
  it('abre el creador fuera de Evaluación y restaura Estudiantes como origen', async () => {
    render(<MemoryRouter initialEntries={['/actividades/crear?sectionSubjectId=ss-1&academicPeriodId=period-1&competencyBlockId=b2&returnCourseId=course-1&returnSubjectId=ss-1&returnTab=estudiantes']}>
      <Routes>
        <Route path="*" element={<><ActivityCreator /><Location /></>} />
      </Routes>
    </MemoryRouter>)

    expect(await screen.findByText('create')).toBeInTheDocument()
    expect(screen.getByTestId('profile-blocks')).toHaveTextContent('b1,b2,b3')
    expect(screen.getByTestId('profile-blocks')).not.toHaveTextContent('b4')
    expect(screen.getByTestId('location')).toHaveTextContent('/actividades/crear')
    expect(screen.getByTestId('location')).not.toHaveTextContent('/calificaciones')
    fireEvent.click(screen.getByRole('button', { name: 'Volver a Estudiantes' }))
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/cursos?courseId=course-1&subjectId=ss-1&tab=estudiantes'))
  })
  it('lleva la actividad persistida a calificación y conserva el regreso a la asignatura', async () => {
    render(<MemoryRouter initialEntries={['/actividades/crear?sectionSubjectId=ss-1&academicPeriodId=period-1&returnCourseId=course-1&returnSubjectId=ss-1&returnTab=actividades']}>
      <Routes><Route path="*" element={<><ActivityCreator /><Location /></>} /></Routes>
    </MemoryRouter>)

    await screen.findByText('create')
    fireEvent.click(screen.getByRole('button', { name: 'Calificar guardada' }))

    await waitFor(() => {
      const location = screen.getByTestId('location').textContent ?? ''
      expect(location).toContain('/calificaciones?')
      expect(location).toContain('activityId=persisted-activity')
      expect(location).toContain('activityMode=evaluate')
      expect(location).toContain('origin=subject')
      expect(location).toContain('returnCourseId=course-1')
      expect(location).toContain('returnSubjectId=ss-1')
      expect(location).toContain('returnTab=actividades')
      expect(location).toContain('returnTo=%2Fcursos%3FcourseId%3Dcourse-1%26subjectId%3Dss-1%26tab%3Dactividades')
    })
  })

  it('conserva Actividades global como origen de la calificación', async () => {
    render(<MemoryRouter initialEntries={[{ pathname: '/actividades/crear', search: '?sectionSubjectId=ss-1&academicPeriodId=period-1', state: { activityCreatorOrigin: { kind: 'activities', label: 'Volver a Actividades', returnTo: '/actividades' } } }]}>
      <Routes><Route path="*" element={<><ActivityCreator /><Location /></>} /></Routes>
    </MemoryRouter>)

    await screen.findByText('create')
    fireEvent.click(screen.getByRole('button', { name: 'Calificar guardada' }))
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent(/\/calificaciones\?.*origin=activities/))
  })
})
