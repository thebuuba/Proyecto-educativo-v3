import { fireEvent, render, screen, waitFor } from '@testing-library/react'
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
  it('keeps manual navigation and the generate-and-save flow from 8dc19ae', async () => {
    vi.stubGlobal('scrollTo', vi.fn())
    const onGenerateAndCreate = vi.fn().mockResolvedValue(undefined)

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
            durationMinutes: 90,
          },
        }}
        submitting={false}
        error={null}
        onSubmit={vi.fn()}
        onGenerateAndCreate={onGenerateAndCreate}
        onClose={vi.fn()}
      />,
    )

    expect(screen.getByRole('heading', { name: /datos generales/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/centro educativo/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/área curricular/i)).toBeInTheDocument()
    const unitSelect = screen.getByLabelText(/unidad de aprendizaje/i)
    const topicSelect = screen.getByLabelText(/tema o subtema/i)
    expect(unitSelect).toHaveValue('La noticia')
    expect(topicSelect).toHaveValue('Función y estructura')

    fireEvent.change(unitSelect, { target: { value: 'La guía turística' } })
    expect(topicSelect).toHaveValue('')
    expect(screen.getByRole('option', { name: 'Información gráfica.' })).toBeInTheDocument()
    fireEvent.change(topicSelect, { target: { value: 'Información gráfica.' } })

    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))

    expect(screen.getByText(/parte 2 de 3/i, { selector: 'p' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /secuencia curricular/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/competencias específicas/i)).toBeInTheDocument()
    expect(mocks.generatePlanningEntry).not.toHaveBeenCalled()
    expect(screen.queryByText(/la ia devolvió/i)).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /secuencia didáctica/i }))
    expect(screen.getByLabelText(/situación de aprendizaje/i)).toBeInTheDocument()
    expect(screen.getByText(/inicio/i, { selector: 'h3' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /generar con ia y guardar/i }))

    await waitFor(() => expect(onGenerateAndCreate).toHaveBeenCalledOnce())
    expect(onGenerateAndCreate).toHaveBeenCalledWith(expect.objectContaining({
      planningType: 'DAILY',
      academicPeriodId: 'period-1',
      sectionSubjectId: 'section-subject-1',
    }))
  })
})
