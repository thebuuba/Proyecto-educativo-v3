import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { ActivityCreator } from './ActivityCreator'

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
  GradingBook: (props: { initialActivityAction?: string; originReturnLabel?: string; onReturnToOrigin: () => void; evaluationProfile?: { blocks: Array<{ id: string }> } }) => <div>
    <span>{props.initialActivityAction}</span>
    <span data-testid="profile-blocks">{props.evaluationProfile?.blocks.map((block) => block.id).join(',')}</span>
    <button onClick={props.onReturnToOrigin}>{props.originReturnLabel}</button>
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
})
