import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

import { SubjectActivitiesTab } from './CoursesPage'

describe('actividades de una asignatura', () => {
  it('abre el detalle al pulsar la fila sin interferir con sus acciones', async () => {
    const user = userEvent.setup()
    const onActivityChange = vi.fn()

    render(
      <MemoryRouter>
        <SubjectActivitiesTab
          activities={[{ id: 'activity-1', name: 'Exposición', competencyBlockId: 'b1', maxScore: 30, activityType: 'individual' }]}
          activityId={null}
          academicPeriods={[{ id: 'period-1', name: 'P1 — Agosto', sequence: 1 }]}
          selectedAcademicPeriodId="period-1"
          records={[]}
          students={[]}
          teams={[]}
          assignmentId="subject-1"
          courseId="course-1"
          courseLabel="2.º A"
          subjectName="Ciencias de la Naturaleza"
          onCreate={vi.fn()}
          onActivityChange={onActivityChange}
        />
      </MemoryRouter>,
    )

    const row = screen.getByRole('row', { name: 'Abrir actividad Exposición' })
    expect(row).toHaveClass('cursor-pointer')
    await user.click(row)
    expect(onActivityChange).toHaveBeenLastCalledWith('activity-1')

    onActivityChange.mockClear()
    await user.click(screen.getByRole('link', { name: 'Editar Exposición' }))
    expect(onActivityChange).not.toHaveBeenCalled()
  })
})
