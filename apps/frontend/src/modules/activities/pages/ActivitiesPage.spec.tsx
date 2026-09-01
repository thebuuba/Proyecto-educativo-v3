import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import { ActivitiesPage } from './ActivitiesPage'

vi.mock('@/modules/grading/services/gradingService', () => ({
  getActivityCenter: vi.fn().mockResolvedValue({
    sectionSubjects: [{ id: 'ss-1', sectionId: 'section-1', schoolYearId: 'year-1', gradeName: '2.º', sectionName: 'A', subjectName: 'Ciencias' }],
    academicPeriods: [{ id: 'period-1', schoolYearId: 'year-1', name: 'P1 — Agosto, septiembre y octubre', sequence: 1 }],
    activities: [{ id: 'activity-1', name: 'Práctica de laboratorio', competencyBlockId: 'b2', maxScore: 25, sectionSubjectId: 'ss-1', academicPeriodId: 'period-1', courseId: 'section-1', courseLabel: '2.º A', subjectName: 'Ciencias', periodName: 'P1 — Agosto, septiembre y octubre', evaluatedCount: 4, studentCount: 25 }],
  }),
}))

describe('ActivitiesPage', () => {
  it('shows global activity context and only the action appropriate to its state', async () => {
    render(<MemoryRouter><ActivitiesPage /></MemoryRouter>)

    expect(await screen.findByText('Práctica de laboratorio')).toBeInTheDocument()
    expect(screen.getAllByText('2.º A')).not.toHaveLength(0)
    expect(screen.getAllByText('Ciencias')).not.toHaveLength(0)
    expect(screen.getByRole('link', { name: 'Evaluar / calificar' })).toHaveAttribute('href', expect.stringContaining('activityMode=evaluate'))
    expect(screen.queryByRole('link', { name: 'Ver resultados' })).not.toBeInTheDocument()
  })
})
