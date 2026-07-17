import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

import type { SectionSubjectAssignment } from '@/modules/courses/types'
import { ActivityBlockPickerDialog, buildCompactGradeRows, buildSubjectAttendanceHref, CourseSubjectCard, SubjectAppearanceDialog, SubjectHeaderPortal } from './CoursesPage'

function assignment(canDelete: boolean): SectionSubjectAssignment {
  return {
    id: 'assignment-1',
    sectionId: 'section-1',
    gradeId: 'grade-1',
    subjectId: 'subject-1',
    subjectCode: 'MAT',
    subjectName: 'Matemática',
    teacherId: null,
    teacherName: null,
    appearanceColor: null,
    appearanceIcon: null,
    teamCount: 0,
    activityCount: 0,
    lastAttendanceDate: null,
    averageScore: null,
    lastPlanningDate: null,
    lastPlanningTitle: null,
    relatedDataCount: canDelete ? 0 : 1,
    canDelete,
    status: 'active',
  }
}

function renderCard(canDelete: boolean) {
  const onOpen = vi.fn()
  const onCustomize = vi.fn()
  const onArchive = vi.fn()
  const onDelete = vi.fn()
  render(
    <CourseSubjectCard
      assignment={assignment(canDelete)}
      studentCount={5}
      canManage
      onOpen={onOpen}
      onCustomize={onCustomize}
      onArchive={onArchive}
      onDelete={onDelete}
    />,
  )
  return { onOpen, onCustomize, onArchive, onDelete }
}

describe('menú administrativo de una asignatura activa', () => {
  it('distingue sin evaluar de una calificación real de cero', () => {
    const student = {
      enrollmentId: 'enrollment-1',
      studentId: 'student-1',
      studentCode: 'TEMP-1',
      listNumber: 3,
      firstName: 'Ana',
      lastName: 'Pérez',
    }

    expect(buildCompactGradeRows([student], [], [])[0]).toMatchObject({
      listNumber: 3,
      average: null,
      status: 'Sin evaluar',
    })

    const activity = { id: 'activity-1', name: 'Exposición', competencyBlockId: 'b1', maxScore: 20 }
    const record = {
      id: 'record-1',
      enrollmentId: 'enrollment-1',
      score: 16,
      maxScore: 20,
      weight: 1,
      assessmentName: 'Exposición',
      status: null,
      evaluationActivityId: 'activity-1',
    }
    expect(buildCompactGradeRows([student], [activity], [record])[0]).toMatchObject({
      average: 80,
      status: 'Calificado',
      blockAverages: { b1: 80 },
    })
  })

  it('nunca coloca el encabezado de la asignatura dentro del contenido como alternativa', () => {
    const view = render(<SubjectHeaderPortal target={null}><div>Encabezado superior</div></SubjectHeaderPortal>)

    expect(screen.queryByText('Encabezado superior')).not.toBeInTheDocument()

    const target = document.createElement('div')
    document.body.appendChild(target)
    view.rerender(<SubjectHeaderPortal target={target}><div>Encabezado superior</div></SubjectHeaderPortal>)
    expect(target).toHaveTextContent('Encabezado superior')
    target.remove()
  })

  it('conserva la asignatura y la ruta de retorno al abrir asistencia', () => {
    const destination = new URL(buildSubjectAttendanceHref('assignment-1', 'course-1'), 'http://localhost')

    expect(destination.pathname).toBe('/asistencia')
    expect(destination.searchParams.get('sectionSubjectId')).toBe('assignment-1')
    expect(destination.searchParams.get('origin')).toBe('subject')
    expect(destination.searchParams.get('returnCourseId')).toBe('course-1')
    expect(destination.searchParams.get('returnSubjectId')).toBe('assignment-1')
  })

  it('ofrece los cuatro bloques y conserva el contexto al crear una actividad', () => {
    render(
      <MemoryRouter>
        <ActivityBlockPickerDialog
          assignmentId="assignment-1"
          courseId="course-1"
          courseName="2.º A"
          subjectName="Ciencias de la Naturaleza"
          onClose={vi.fn()}
        />
      </MemoryRouter>,
    )

    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(4)
    expect(links.map((link) => link.getAttribute('data-competency-block-id'))).toEqual(['b1', 'b2', 'b3', 'b4'])
    expect(links.map((link) => new URL(link.getAttribute('href')!, 'http://localhost').searchParams.get('competencyBlockId'))).toEqual(['b1', 'b2', 'b3', 'b4'])
    expect(links[1]).toHaveClass('hover:border-emerald-300')
    expect(links[3]).toHaveClass('hover:border-violet-300')
    const destination = new URL(links[0].getAttribute('href')!, 'http://localhost')
    expect(destination.pathname).toBe('/calificaciones')
    expect(destination.searchParams.get('sectionSubjectId')).toBe('assignment-1')
    expect(destination.searchParams.get('competencyBlockId')).toBe('b1')
    expect(destination.searchParams.get('returnCourseId')).toBe('course-1')
    expect(destination.searchParams.get('returnSubjectId')).toBe('assignment-1')
  })

  it('abre la asignatura al pulsar cualquier zona de la tarjeta o usar Enter', async () => {
    const user = userEvent.setup()
    const { onOpen } = renderCard(false)
    const card = screen.getByRole('link', { name: 'Entrar a la asignatura Matemática' })

    await user.click(screen.getByText('Docente'))
    expect(onOpen).toHaveBeenLastCalledWith('resumen')

    card.focus()
    await user.keyboard('{Enter}')
    expect(onOpen).toHaveBeenCalledTimes(2)
  })

  it('no abre la asignatura al utilizar el menú de tres puntos', async () => {
    const user = userEvent.setup()
    const { onOpen, onCustomize } = renderCard(false)

    await user.click(screen.getByRole('button', { name: 'Más opciones de Matemática' }))
    await user.click(screen.getByRole('menuitem', { name: 'Personalizar apariencia' }))

    expect(onCustomize).toHaveBeenCalledOnce()
    expect(onOpen).not.toHaveBeenCalled()
  })

  it('muestra solo apariencia y archivado cuando contiene información', async () => {
    const user = userEvent.setup()
    renderCard(false)

    await user.click(screen.getByRole('button', { name: 'Más opciones de Matemática' }))

    expect(screen.getAllByRole('menuitem').map((item) => item.textContent)).toEqual([
      'Personalizar apariencia',
      'Archivar asignatura',
    ])
    expect(screen.queryByText('Administrar equipos')).not.toBeInTheDocument()
    expect(screen.queryByText('Eliminar asignatura')).not.toBeInTheDocument()
  })

  it('agrega eliminar únicamente cuando el backend la marca como vacía y cierra con Escape', async () => {
    const user = userEvent.setup()
    renderCard(true)
    const trigger = screen.getByRole('button', { name: 'Más opciones de Matemática' })

    await user.click(trigger)
    expect(screen.getAllByRole('menuitem').map((item) => item.textContent)).toEqual([
      'Personalizar apariencia',
      'Archivar asignatura',
      'Eliminar asignatura',
    ])

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })
})

describe('banco de iconos de asignaturas', () => {
  it('muestra primero el currículo y permite buscar y guardar un icono especializado', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    render(<SubjectAppearanceDialog assignment={assignment(false)} onSave={onSave} onClose={vi.fn()} />)

    expect(screen.getByText('Asignaturas del currículo dominicano')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Usar icono Matemática' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Usar icono Informática' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Banco de iconos por áreas/i }))
    await user.type(screen.getByPlaceholderText('Buscar: robótica, derecho, medicina...'), 'robótica')
    await user.click(screen.getByRole('button', { name: 'Usar icono Robótica' }))
    await user.click(screen.getByRole('button', { name: 'Guardar apariencia' }))

    expect(onSave).toHaveBeenCalledWith({ color: null, icon: 'bot' })
  })

  it('permite guardar un color hexadecimal personalizado', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    render(<SubjectAppearanceDialog assignment={assignment(false)} onSave={onSave} onClose={vi.fn()} />)

    const hexInput = screen.getByLabelText('Código hexadecimal')
    await user.clear(hexInput)
    await user.type(hexInput, '#12ABCD')
    await user.click(screen.getByRole('button', { name: 'Guardar apariencia' }))

    expect(onSave).toHaveBeenCalledWith({ color: '#12ABCD', icon: null })
  })
})
