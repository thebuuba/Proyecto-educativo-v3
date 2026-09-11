import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

import type { ClassAttendanceHistoryRecord } from '@/modules/attendance/services/attendanceService'
import type { StudentAttendanceRow, UpsertAttendanceInput } from '@/modules/attendance/types'
import type { GradeWithSections } from '@/modules/courses/types'
import { CoursesPage } from './CoursesPage'

const mocks = vi.hoisted(() => ({
  useCourses: vi.fn(),
  getStudentsBySection: vi.fn(),
  getClassAttendanceHistory: vi.fn(),
  getCurrentAcademicPeriodId: vi.fn(),
  upsertAttendance: vi.fn(),
}))

vi.mock('@/modules/auth/hooks/useAuth', () => ({ useAuth: () => ({ hasRole: () => true }) }))
vi.mock('@/modules/courses/hooks/useCourses', () => ({ useCourses: mocks.useCourses }))
vi.mock('@/modules/attendance/services/attendanceService', async (importOriginal) => ({
  ...await importOriginal<typeof import('@/modules/attendance/services/attendanceService')>(),
  getStudentsBySection: mocks.getStudentsBySection,
  getClassAttendanceHistory: mocks.getClassAttendanceHistory,
  getCurrentAcademicPeriodId: mocks.getCurrentAcademicPeriodId,
  upsertAttendance: mocks.upsertAttendance,
}))
vi.mock('@/modules/courses/services/coursesService', async (importOriginal) => ({
  ...await importOriginal<typeof import('@/modules/courses/services/coursesService')>(),
  getCourseTeams: vi.fn().mockResolvedValue([]),
}))
vi.mock('@/modules/planning/services/planningService', async (importOriginal) => ({
  ...await importOriginal<typeof import('@/modules/planning/services/planningService')>(),
  getPlanningEntries: vi.fn().mockResolvedValue([]),
}))
vi.mock('@/modules/grading/services/gradingService', async (importOriginal) => ({
  ...await importOriginal<typeof import('@/modules/grading/services/gradingService')>(),
  getGradingWorkspace: vi.fn().mockResolvedValue({
    students: [], activities: [], gradeRecords: [], academicPeriods: [], selectedAcademicPeriodId: null,
  }),
}))

const students: StudentAttendanceRow[] = [
  { enrollmentId: 'enrollment-1', studentId: 'student-1', studentCode: 'TEMP-1', listNumber: 1, firstName: 'Ana', lastName: 'Pérez', status: null, attendanceId: null },
  { enrollmentId: 'enrollment-2', studentId: 'student-2', studentCode: 'TEMP-2', listNumber: 2, firstName: 'Luis', lastName: 'Díaz', status: null, attendanceId: null },
]

const grade: GradeWithSections = {
  id: 'grade-1', name: '2.º', level: 'Secundario', academicLevelId: null, academicCycleId: null,
  defaultModalityId: null, academicLevelName: 'Secundario', academicCycleName: 'Primer Ciclo',
  defaultModalityName: null, sequence: 2, status: 'active', createdAt: '', updatedAt: '',
  sections: [{
    id: 'section-1', gradeId: 'grade-1', name: 'A', capacity: null, studentCount: 2, teamCount: 0,
    status: 'active', createdAt: '', updatedAt: '',
    assignments: [{
      id: 'assignment-1', sectionId: 'section-1', gradeId: 'grade-1', subjectId: 'science-1',
      subjectCode: 'CN', subjectName: 'Ciencias de la Naturaleza: Ciencias de la Vida',
      teacherId: null, teacherName: null, appearanceColor: null, appearanceIcon: null,
      teamCount: 0, activityCount: 0, lastAttendanceDate: null, averageScore: null,
      lastPlanningDate: null, lastPlanningTitle: null, relatedDataCount: 0, canDelete: true, status: 'active',
    }],
  }],
}

let history: ClassAttendanceHistoryRecord[]

function renderCourse(tab?: string) {
  return render(
    <MemoryRouter initialEntries={[`/cursos?courseId=section-1&subjectId=assignment-1${tab ? `&tab=${tab}` : ''}`]}>
      <CoursesPage />
    </MemoryRouter>,
  )
}

describe('asistencia desde la asignatura en Cursos', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 8, 6, 12))
    history = []
    mocks.useCourses.mockReset().mockReturnValue({
      grades: [grade], catalogs: { levels: [], cycles: [], modalities: [], subjects: [], teachers: [] },
      currentSchoolYear: { id: 'year-1', name: '2026-2027' }, loading: false, error: null,
    })
    mocks.getStudentsBySection.mockReset().mockResolvedValue(students)
    mocks.getCurrentAcademicPeriodId.mockReset().mockResolvedValue('period-1')
    mocks.getClassAttendanceHistory.mockReset().mockImplementation(async () => [...history])
    mocks.upsertAttendance.mockReset().mockImplementation(async (input: UpsertAttendanceInput) => {
      const id = `${input.enrollmentId}-${input.attendanceDate}`
      history = history.filter((record) => record.id !== id)
      history.push({ id, enrollmentId: input.enrollmentId, attendanceDate: input.attendanceDate, status: input.status })
      return { id }
    })
  })

  afterEach(() => vi.useRealTimers())

  it('abre el panel actualizado desde la pestaña habitual y guarda T como tardanza en esa asignatura', async () => {
    const user = userEvent.setup()
    renderCourse()
    await user.click(screen.getByRole('button', { name: 'Asistencia' }))

    expect(await screen.findByText('septiembre de 2026')).toBeInTheDocument()
    expect(screen.getByText('Tardanzas hoy')).toBeInTheDocument()
    expect(screen.queryByText(/Retardo/)).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Pasar lista' }))
    expect(screen.getByRole('button', { name: 'Presente Ana Pérez' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.queryByRole('button', { name: 'R' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Tardanza Ana Pérez' }))
    await user.click(screen.getByRole('button', { name: 'Guardar asistencia' }))

    await waitFor(() => expect(mocks.upsertAttendance).toHaveBeenCalledWith({
      type: 'class', enrollmentId: 'enrollment-1', academicPeriodId: 'period-1',
      sectionSubjectId: 'assignment-1', attendanceDate: '2026-09-06', status: 'late',
    }))
    expect(await screen.findByText('Asistencia guardada correctamente.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Cerrar' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Guardar asistencia' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Pasar lista' }))
    expect(screen.getByRole('button', { name: 'Tardanza Ana Pérez' })).toHaveAttribute('aria-pressed', 'true')
    expect(mocks.getStudentsBySection).toHaveBeenCalledWith('section-1', 'year-1')
  })

  it('el enlace directo a asistencia presenta el mismo contexto y permite cerrar sin cambios', async () => {
    const user = userEvent.setup()
    renderCourse('asistencia')

    expect(await screen.findByText('septiembre de 2026')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '2.º A – Ciencias de la Naturaleza: Ciencias de la Vida' })).toBeInTheDocument()
    expect(screen.getAllByRole('navigation', { name: 'Secciones de la asignatura' })).toHaveLength(1)
    expect(screen.getByText('Tardanzas hoy')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Pasar lista' }))
    await user.click(screen.getByRole('button', { name: 'Cerrar' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Fecha de asistencia')).not.toBeInTheDocument()
    expect(mocks.upsertAttendance).not.toHaveBeenCalled()
  })

  it('protege los cambios al cerrar y permite continuar o descartarlos', async () => {
    const user = userEvent.setup()
    renderCourse('asistencia')
    await user.click(await screen.findByRole('button', { name: 'Pasar lista' }))
    await user.click(screen.getByRole('button', { name: 'Tardanza Ana Pérez' }))
    await user.click(screen.getByRole('button', { name: 'Cerrar' }))
    expect(screen.getByRole('dialog', { name: '¿Descartar los cambios?' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Seguir editando' }))
    expect(screen.getByRole('button', { name: 'Tardanza Ana Pérez' })).toHaveAttribute('aria-pressed', 'true')

    await user.click(screen.getByRole('button', { name: 'Cerrar' }))
    await user.click(screen.getByRole('button', { name: 'Descartar y cerrar' }))
    expect(screen.queryByRole('button', { name: 'Guardar asistencia' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Pasar lista' }))
    expect(screen.getByRole('button', { name: 'Presente Ana Pérez' })).toHaveAttribute('aria-pressed', 'true')
    expect(mocks.upsertAttendance).not.toHaveBeenCalled()
  })

  it('protege el borrador al cambiar de fecha', async () => {
    const user = userEvent.setup()
    renderCourse('asistencia')
    await user.click(await screen.findByRole('button', { name: 'Pasar lista' }))
    await user.click(screen.getByRole('button', { name: 'Tardanza Ana Pérez' }))
    fireEvent.change(screen.getByLabelText('Fecha de asistencia'), { target: { value: '2026-08-06' } })
    await user.click(screen.getByRole('button', { name: 'Seguir editando' }))
    expect(screen.getByLabelText('Fecha de asistencia')).toHaveValue('2026-09-06')
    expect(screen.getByRole('button', { name: 'Tardanza Ana Pérez' })).toHaveAttribute('aria-pressed', 'true')
    fireEvent.change(screen.getByLabelText('Fecha de asistencia'), { target: { value: '2026-08-06' } })
    await user.click(screen.getByRole('button', { name: 'Descartar y cambiar fecha' }))
    expect(screen.getByLabelText('Fecha de asistencia')).toHaveValue('2026-08-06')
    expect(screen.getByText('agosto de 2026')).toBeInTheDocument()
    expect(mocks.upsertAttendance).not.toHaveBeenCalled()
  })

  it('conserva las selecciones después de un error al guardar y permite reintentar', async () => {
    mocks.upsertAttendance.mockRejectedValueOnce(new Error('No se pudo conectar al servidor'))
    const user = userEvent.setup()
    renderCourse('asistencia')
    await user.click(await screen.findByRole('button', { name: 'Pasar lista' }))
    await user.click(screen.getByRole('button', { name: 'Tardanza Ana Pérez' }))
    await user.click(screen.getByRole('button', { name: 'Guardar asistencia' }))
    expect(await screen.findByText('No se pudo conectar al servidor')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tardanza Ana Pérez' })).toHaveAttribute('aria-pressed', 'true')
    await user.click(screen.getByRole('button', { name: 'Guardar asistencia' }))
    expect(await screen.findByText('Asistencia guardada correctamente.')).toBeInTheDocument()
    expect(history.filter((record) => record.status === 'late')).toHaveLength(1)
  })

  it('calcula las tardanzas por estudiante y por mes al revisar listas guardadas', async () => {
    for (let day = 1; day <= 6; day++) {
      for (const [index, student] of students.entries()) {
        history.push({
          id: `september-${index}-${day}`, enrollmentId: student.enrollmentId,
          attendanceDate: `2026-09-0${day}`, status: day <= (index === 0 ? 4 : 2) ? 'late' : 'present',
        }, {
          id: `august-${index}-${day}`, enrollmentId: student.enrollmentId,
          attendanceDate: `2026-08-0${day}`, status: index === 0 ? 'absent' : 'present',
        })
      }
    }
    const user = userEvent.setup()
    renderCourse('asistencia')
    const metric = await screen.findByText('Promedio mensual')
    expect(within(metric.parentElement!).getByText('92%')).toBeInTheDocument()
    expect(within(screen.getByRole('region', { name: 'Últimas listas guardadas' })).getAllByRole('button')).toHaveLength(5)
    await user.click(screen.getByRole('button', { name: 'Pasar lista' }))
    await user.click(screen.getByRole('button', { name: 'Ana Pérez' }))
    expect(screen.getByText(/83\.3%/)).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Fecha de asistencia'), { target: { value: '2026-08-06' } })
    expect(screen.getByText('agosto de 2026')).toBeInTheDocument()
    expect(within(screen.getByText('Promedio mensual').parentElement!).getByText('50%')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ausente Ana Pérez' })).toHaveAttribute('aria-pressed', 'true')
    expect(mocks.upsertAttendance).not.toHaveBeenCalled()
  })
})
