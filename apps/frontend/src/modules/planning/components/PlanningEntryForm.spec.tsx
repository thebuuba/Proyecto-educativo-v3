import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { PlanningEntryForm } from './PlanningEntryForm'

const mocks = vi.hoisted(() => ({
  generatePlanningEntry: vi.fn(),
  getEvaluationActivities: vi.fn().mockResolvedValue([]),
}))

vi.mock('@/modules/auth/hooks/useAuth', () => ({
  useAuth: () => ({ appUser: { fullName: 'Docente de prueba' } }),
}))

vi.mock('@/modules/grading/services/gradingService', () => ({
  getEvaluationActivities: mocks.getEvaluationActivities,
}))

vi.mock('@/modules/planning/services/planningService', () => ({
  generatePlanningEntry: mocks.generatePlanningEntry,
}))

describe('PlanningEntryForm', () => {
  it('advances manually without invoking the optional AI', () => {
    vi.stubGlobal('scrollTo', vi.fn())

    render(
      <PlanningEntryForm
        sectionSubjects={[{
          id: 'section-subject-1',
          subjectName: 'Lengua Española',
          sectionName: 'A',
          gradeName: '1.º',
          level: 'Secundaria',
          gradeSequence: 1,
        }]}
        periods={[{
          id: 'period-1',
          name: 'P1',
          sequence: 1,
          status: 'active',
          startDate: '2026-08-01',
          endDate: '2026-10-31',
        }]}
        competencies={[]}
        initial={{
          sectionSubjectId: 'section-subject-1',
          academicPeriodId: 'period-1',
          entry: {
            sectionSubjectId: 'section-subject-1',
            academicPeriodId: 'period-1',
            curricularArea: 'Lengua Española',
            title: 'La noticia',
            topic: 'Función y estructura',
            transversalAxis: 'Ciudadanía y Convivencia',
            plannedDate: '2026-08-04',
          },
        }}
        submitting={false}
        error={null}
        onSubmit={vi.fn()}
        onGenerateAndCreate={vi.fn()}
        onClose={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))

    expect(screen.getByText(/parte 2 de 3/i, { selector: 'p' })).toBeInTheDocument()
    expect(mocks.generatePlanningEntry).not.toHaveBeenCalled()
    expect(screen.queryByText(/la ia devolvió/i)).not.toBeInTheDocument()
  })
})
