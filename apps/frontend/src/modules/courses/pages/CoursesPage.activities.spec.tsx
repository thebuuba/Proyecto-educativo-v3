import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { activityDraftStorageKey } from '@/modules/activities/utils/activityDraftStorage'

import { SubjectActivitiesTab } from './CoursesPage'

vi.mock('@/modules/auth/hooks/useAuth', () => ({
  useAuth: () => ({ schoolId: 'school-1', appUser: { id: 'user-1' } }),
}))

function RouteProbe() {
  const location = useLocation()
  return <output data-testid="draft-route">{location.pathname + location.search}</output>
}

describe('actividades de una asignatura', () => {
  beforeEach(() => localStorage.clear())
  it('recupera el borrador de la cuenta, año y asignatura sin depender de Actividades global', async () => {
    const user = userEvent.setup()
    const context = {
      schoolId: 'school-1',
      userId: 'user-1',
      schoolYearId: 'year-1',
      sectionSubjectId: 'subject-1',
      academicPeriodId: 'period-original',
    }
    const original = JSON.stringify({
      context,
      courseTitle: '6.º A · Sociales',
      periodShortName: 'P1',
      drafts: { b3: [{ draftId: 'draft-1', name: 'Borrador conservado' }] },
    })
    localStorage.setItem(activityDraftStorageKey(context), original)
    for (const [change, name] of [
      [{ userId: 'other-user' }, 'Otra cuenta'],
      [{ schoolYearId: 'other-year' }, 'Otro año'],
      [{ sectionSubjectId: 'other-subject' }, 'Otra asignatura'],
    ] as const) {
      const other = { ...context, ...change }
      localStorage.setItem(
        activityDraftStorageKey(other),
        JSON.stringify({ context: other, drafts: { b3: [{ draftId: name, name }] } }),
      )
    }
    render(
      <MemoryRouter>
        <SubjectActivitiesTab
          activities={[]}
          activityId={null}
          academicPeriods={[{ id: 'period-current', name: 'P2', sequence: 2 }]}
          selectedAcademicPeriodId="period-current"
          records={[]}
          students={[]}
          teams={[]}
          assignmentId="subject-1"
          schoolYearId="year-1"
          courseId="course-1"
          courseLabel="6.º A"
          subjectName="Sociales"
          onCreate={vi.fn()}
          onActivityChange={vi.fn()}
        />
        <RouteProbe />
      </MemoryRouter>,
    )
    expect(screen.getByText('Borrador conservado')).toBeInTheDocument()
    for (const name of ['Otra cuenta', 'Otro año', 'Otra asignatura'])
      expect(screen.queryByText(name)).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /^Continuar$/ }))
    const route = new URL(screen.getByTestId('draft-route').textContent!, 'http://localhost')
    expect(route.pathname).toBe('/actividades/crear')
    expect(Object.fromEntries(route.searchParams)).toMatchObject({
      sectionSubjectId: 'subject-1',
      academicPeriodId: 'period-original',
      competencyBlockId: 'b3',
      activityDraftId: 'draft-1',
      returnCourseId: 'course-1',
      returnSubjectId: 'subject-1',
      returnTab: 'actividades',
    })
    expect(localStorage.getItem(activityDraftStorageKey(context))).toBe(original)
    expect(localStorage.length).toBe(4)
  })
  it('abre el detalle al pulsar la fila sin interferir con sus acciones', async () => {
    const user = userEvent.setup()
    const onActivityChange = vi.fn()

    render(
      <MemoryRouter>
        <SubjectActivitiesTab
          activities={[
            {
              id: 'activity-1',
              name: 'Exposición',
              competencyBlockId: 'b1',
              maxScore: 30,
              activityType: 'individual',
            },
          ]}
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
