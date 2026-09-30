import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { ActivityCreator } from './ActivityCreator'

vi.mock('@/modules/activities/services/activitiesService', () => ({
  getActivityCenter: vi.fn().mockResolvedValue({
    sectionSubjects: [{ id: 'ss-1', schoolYearId: 'year-1', gradeName: '2.º', sectionName: 'A', subjectName: 'Ciencias' }],
    academicPeriods: [{ id: 'period-1', schoolYearId: 'year-1', name: 'P1', sequence: 1 }],
    activities: [],
  }),
  getActivities: vi.fn().mockResolvedValue([]),
  saveActivity: vi.fn(),
  deleteActivity: vi.fn(),
}))

vi.mock('@/modules/courses/services/coursesService', () => ({ getCourseTeams: vi.fn().mockResolvedValue([]) }))

vi.mock('@/modules/grading/components/GradingBook', () => ({
  GradingBook: (props: { initialActivityAction?: string; originReturnLabel?: string; onReturnToOrigin: () => void }) => <div>
    <span>{props.initialActivityAction}</span>
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
    expect(screen.getByTestId('location')).toHaveTextContent('/actividades/crear')
    expect(screen.getByTestId('location')).not.toHaveTextContent('/calificaciones')
    fireEvent.click(screen.getByRole('button', { name: 'Volver a Estudiantes' }))
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/cursos?courseId=course-1&subjectId=ss-1&tab=estudiantes'))
  })
})
