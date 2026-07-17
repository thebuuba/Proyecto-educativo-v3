import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { StudentAttendanceRow } from '@/modules/attendance/types'
import type { CourseTeam } from '@/modules/courses/types'
import { CourseTeamsPanel } from './CourseTeamsPanel'

const getCourseTeams = vi.fn()

vi.mock('@/modules/courses/services/coursesService', () => ({
  getCourseTeams: (...args: unknown[]) => getCourseTeams(...args),
  createCourseTeam: vi.fn(),
  updateCourseTeam: vi.fn(),
  archiveCourseTeam: vi.fn(),
}))

const students: StudentAttendanceRow[] = [
  { enrollmentId: 'enrollment-1', studentId: 'student-1', studentCode: '001', firstName: 'Ana', lastName: 'Pérez', status: null, attendanceId: null },
  { enrollmentId: 'enrollment-2', studentId: 'student-2', studentCode: '002', firstName: 'Luis', lastName: 'Díaz', status: null, attendanceId: null },
  { enrollmentId: 'enrollment-3', studentId: 'student-3', studentCode: '003', firstName: 'Marta', lastName: 'Rojas', status: null, attendanceId: null },
]

const teams: CourseTeam[] = [
  {
    id: 'team-1', sectionId: 'section-1', sectionSubjectId: 'subject-1', schoolYearId: 'year-1',
    name: 'Equipo Newton', color: '#16a34a', icon: 'users', description: 'Investigación científica',
    teamType: 'permanent', startsAt: null, endsAt: null, orderPosition: 0,
    members: [{ id: 'member-1', enrollmentId: 'enrollment-1', role: 'Coordinador', enrollment: { id: 'enrollment-1', student: { id: 'student-1', studentCode: '001', firstName: 'Ana', lastName: 'Pérez' } } }],
  },
  {
    id: 'team-2', sectionId: 'section-1', sectionSubjectId: 'subject-1', schoolYearId: 'year-1',
    name: 'Equipo Tesla', color: '#f97316', icon: 'users', description: '',
    teamType: 'temporary', startsAt: null, endsAt: '2026-07-30', orderPosition: 1, members: [],
  },
]

describe('panel de equipos del curso', () => {
  beforeEach(() => getCourseTeams.mockResolvedValue(teams))

  it('presenta el resumen real y los estudiantes pendientes', async () => {
    render(<CourseTeamsPanel sectionSubjectId="subject-1" students={students} canManage />)

    expect(await screen.findByText('Equipo Newton')).toBeInTheDocument()
    expect(screen.getByText('Equipos de trabajo')).toBeInTheDocument()
    expect(screen.queryByText('1 / 3')).not.toBeInTheDocument()
    expect(screen.getByText('Estudiantes sin equipo').closest('.rounded-2xl')).toHaveTextContent('2')
    expect(screen.getByText('Luis Díaz')).toBeInTheDocument()
    expect(screen.getByText('Marta Rojas')).toBeInTheDocument()
  })

  it('filtra por tipo y permite localizar un equipo por estudiante', async () => {
    const user = userEvent.setup()
    render(<CourseTeamsPanel sectionSubjectId="subject-1" students={students} canManage />)
    await screen.findByText('Equipo Newton')

    await user.click(screen.getByRole('button', { name: 'Temporales' }))
    expect(screen.queryByText('Equipo Newton')).not.toBeInTheDocument()
    expect(screen.getByText('Equipo Tesla')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Todos' }))
    await user.type(screen.getByPlaceholderText('Buscar equipo o estudiante…'), 'Ana')
    await waitFor(() => expect(screen.getByText('Equipo Newton')).toBeInTheDocument())
    expect(screen.queryByText('Equipo Tesla')).not.toBeInTheDocument()
  })

  it('abre la creación como una pantalla interna y permite seleccionar integrantes', async () => {
    const user = userEvent.setup()
    render(<CourseTeamsPanel sectionSubjectId="subject-1" students={students} canManage />)
    await screen.findByText('Equipo Newton')

    await user.click(screen.getByRole('button', { name: 'Crear equipo' }))

    expect(screen.getByRole('heading', { name: 'Crear equipo' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Volver a equipos' })).toBeInTheDocument()
    expect(screen.getByText('Información del equipo')).toBeInTheDocument()
    expect(screen.getByText('Seleccionar integrantes')).toBeInTheDocument()

    await user.click(screen.getByRole('checkbox', { name: /Ana Pérez/ }))
    expect(screen.getByText('1 estudiante seleccionado')).toBeInTheDocument()
  })

  it('muestra el estado inicial y abre la guía rápida completa', async () => {
    getCourseTeams.mockResolvedValueOnce([])
    const user = userEvent.setup()
    render(<CourseTeamsPanel sectionSubjectId="subject-1" students={students} canManage />)

    expect(await screen.findByText('Aún no tienes equipos creados')).toBeInTheDocument()
    expect(screen.getByText('Organiza mejor tu clase')).toBeInTheDocument()
    expect(screen.queryByText('Acciones rápidas')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Todos' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Ver guía rápida' }))
    const guide = screen.getByRole('dialog', { name: 'Guía rápida de equipos' })
    expect(guide).toHaveTextContent('Crear equipo')
    expect(guide).toHaveTextContent('Agregar estudiantes')
    expect(guide).toHaveTextContent('Crear actividad grupal')
    expect(guide).toHaveTextContent('Evaluar')
    expect(guide).toHaveTextContent('Calificaciones')
  })
})
