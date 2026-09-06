import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { CourseStudentsPanel } from './CourseStudentsPanel'

const mocks = vi.hoisted(() => ({
  createStudentInCourse: vi.fn(),
  getStudentsByCourse: vi.fn(),
  restoreStudentToCourse: vi.fn(),
  updateCourseStudentListNumber: vi.fn(),
  updateStudent: vi.fn(),
}))

vi.mock('@/modules/students/services/studentsService', () => ({
  createStudentInCourse: mocks.createStudentInCourse,
  deleteCourseStudentPermanently: vi.fn(),
  getStudentsByCourse: mocks.getStudentsByCourse,
  importStudentsInCourse: vi.fn(),
  previewCourseStudentImport: vi.fn(),
  reorderCourseStudents: vi.fn(),
  restoreStudentToCourse: mocks.restoreStudentToCourse,
  updateCourseStudentListNumber: mocks.updateCourseStudentListNumber,
  updateStudent: mocks.updateStudent,
  withdrawStudentFromCourse: vi.fn(),
}))

const student = {
  id: 'student-1',
  userId: null,
  enrollmentId: 'enrollment-1',
  firstName: 'Ana',
  lastName: 'Pérez',
  fullName: 'Ana Pérez',
  studentCode: 'TEMP-1',
  documentId: null,
  birthDate: '2000-01-01T00:00:00.000Z',
  gender: null,
  address: null,
  listNumber: 1,
  status: 'active' as const,
  createdAt: '2026-09-05T00:00:00.000Z',
  updatedAt: '2026-09-05T00:00:00.000Z',
  canDeletePermanently: true,
}

const secondStudent = {
  ...student,
  id: 'student-2',
  enrollmentId: 'enrollment-2',
  firstName: 'Luis',
  lastName: 'Rojas',
  fullName: 'Luis Rojas',
  studentCode: 'TEMP-2',
  listNumber: 3,
}

describe('CourseStudentsPanel', () => {
  beforeEach(() => {
    mocks.createStudentInCourse.mockReset().mockResolvedValue(student)
    mocks.getStudentsByCourse.mockReset().mockResolvedValue([])
    mocks.restoreStudentToCourse.mockReset().mockResolvedValue(undefined)
    mocks.updateCourseStudentListNumber.mockReset().mockResolvedValue(undefined)
    mocks.updateStudent.mockReset().mockResolvedValue(undefined)
  })

  afterEach(() => vi.useRealTimers())

  it('conserva en la matriz un estudiante agregado antes de cancelar el siguiente registro', async () => {
    const user = userEvent.setup()
    render(<CourseStudentsPanel courseId="course-1" courseName="1.º A" canEnroll canManage initialAction="new" onBack={vi.fn()} />)

    await waitFor(() => expect(mocks.getStudentsByCourse).toHaveBeenCalledTimes(2))
    expect(screen.getByRole('dialog').lastElementChild).toHaveClass('min-w-0', 'overflow-x-clip', 'overflow-y-auto')
    await user.type(screen.getByLabelText('Nombre(s) *'), 'Ana')
    await user.type(screen.getByLabelText('Apellido(s) *'), 'Pérez')
    await user.click(screen.getByLabelText('Agregar otro después de guardar'))
    await user.click(screen.getByRole('button', { name: 'Agregar estudiante' }))

    expect(await screen.findByText('Estudiante agregado. Puedes agregar el siguiente.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getAllByText('Ana Pérez')).toHaveLength(2)
    expect(screen.getByRole('table').parentElement).toHaveClass('h-96', 'overflow-auto')
  })

  it('oculta automáticamente el aviso de éxito', async () => {
    vi.useFakeTimers()
    render(<CourseStudentsPanel courseId="course-1" courseName="1.º A" canEnroll canManage initialAction="new" onBack={vi.fn()} />)
    await act(async () => undefined)

    fireEvent.change(screen.getByLabelText('Nombre(s) *'), { target: { value: 'Ana' } })
    fireEvent.change(screen.getByLabelText('Apellido(s) *'), { target: { value: 'Pérez' } })
    fireEvent.click(screen.getByRole('button', { name: 'Agregar estudiante' }))
    await act(async () => undefined)

    expect(screen.getByRole('status')).toHaveTextContent('Estudiante agregado al curso.')
    act(() => vi.advanceTimersByTime(4_000))
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('cierra el menú de acciones al pulsar fuera', async () => {
    const user = userEvent.setup()
    mocks.getStudentsByCourse.mockImplementation((_courseId, status) => Promise.resolve(status === 'withdrawn' ? [] : [student]))
    render(<CourseStudentsPanel courseId="course-1" courseName="1.º A" canEnroll canManage onBack={vi.fn()} />)

    const actionButton = (await screen.findAllByLabelText('Acciones para Ana Pérez'))[0]
    const menu = actionButton.closest('details')
    await user.click(actionButton)
    expect(menu).toHaveAttribute('open')

    await user.click(screen.getByRole('button', { name: 'Volver al curso' }))
    expect(menu).not.toHaveAttribute('open')
  })

  it('muestra y ejecuta la restauración de un estudiante retirado', async () => {
    const user = userEvent.setup()
    mocks.getStudentsByCourse.mockImplementation((_courseId, status) => Promise.resolve(status === 'withdrawn' ? [student] : []))
    render(<CourseStudentsPanel courseId="course-1" courseName="1.º A" canEnroll canManage onBack={vi.fn()} />)

    await user.click(await screen.findByRole('button', { name: 'Retirados (1)' }))
    const actionButton = (await screen.findAllByLabelText('Acciones para Ana Pérez'))[0]
    const row = actionButton.closest('tr')!
    expect(row).toHaveClass('hover:z-20', 'has-[details[open]]:z-20')
    await user.click(actionButton)

    const menu = within(actionButton.closest('details')!).getByRole('menu')
    expect(menu).toHaveClass('bg-popover', 'opacity-100', 'mt-1')
    await user.click(within(menu).getByRole('button', { name: 'Restaurar al curso' }))
    expect(mocks.restoreStudentToCourse).toHaveBeenCalledWith('course-1', 'student-1')
  })

  it('muestra la ficha del estudiante al pulsar su nombre', async () => {
    const user = userEvent.setup()
    mocks.getStudentsByCourse.mockImplementation((_courseId, status) => Promise.resolve(status === 'withdrawn' ? [] : [student]))
    render(<CourseStudentsPanel courseId="course-1" courseName="1.º A" canEnroll canManage onBack={vi.fn()} />)

    const table = await screen.findByRole('table')
    const row = within(table).getByText('01').closest('tr')!
    expect(row).toHaveClass('cursor-pointer', 'hover:-translate-y-0.5', 'motion-reduce:transform-none')
    await user.click(within(table).getByText('01'))

    const details = within(screen.getByRole('dialog'))
    expect(screen.getByRole('heading', { name: 'Información del estudiante' })).toBeInTheDocument()
    expect(details.getByText('Número de lista').nextElementSibling).toHaveTextContent('01')
    expect(details.getByText('Matrícula').nextElementSibling).toHaveTextContent('Sin matrícula')
    expect(details.getByText('Sexo').nextElementSibling).toHaveTextContent('No especificado')
    expect(details.getByText('Fecha de nacimiento').nextElementSibling).toHaveTextContent('1 de enero de 2000')

    await user.click(screen.getByRole('button', { name: 'Editar información' }))
    expect(screen.getByRole('heading', { name: 'Editar estudiante' })).toBeInTheDocument()
  })

  it('desplaza la lista para mostrar el menú y lo abre hacia arriba en el último estudiante', async () => {
    const user = userEvent.setup()
    mocks.getStudentsByCourse.mockImplementation((_courseId, status) => Promise.resolve(status === 'withdrawn' ? [] : [student, secondStudent]))
    render(<CourseStudentsPanel courseId="course-1" courseName="1.º A" canEnroll canManage onBack={vi.fn()} />)

    const firstAction = (await screen.findAllByLabelText('Acciones para Ana Pérez'))[0]
    const firstDetails = firstAction.closest('details')!
    const firstMenu = within(firstDetails).getByRole('menu')
    const scrollArea = screen.getByRole('table').parentElement!
    const nextRow = firstDetails.closest('tr')!.nextElementSibling as HTMLElement
    Object.defineProperties(scrollArea, {
      scrollHeight: { configurable: true, value: 900 },
      clientHeight: { configurable: true, value: 384 },
      scrollTop: { configurable: true, value: 0, writable: true },
      scrollTo: { configurable: true, value: vi.fn(({ top }: ScrollToOptions) => { if (typeof top === 'number') scrollArea.scrollTop = top }) },
    })
    scrollArea.getBoundingClientRect = vi.fn(() => ({ bottom: 400 } as DOMRect))
    firstMenu.getBoundingClientRect = vi.fn(() => ({ bottom: 450 } as DOMRect))
    nextRow.getBoundingClientRect = vi.fn(() => ({ height: 60 } as DOMRect))

    await user.click(firstAction)
    expect(scrollArea).toHaveClass('scroll-smooth', 'motion-reduce:scroll-auto')
    expect(scrollArea.scrollTo).toHaveBeenCalledWith({ top: 110 })
    expect(scrollArea.scrollTop).toBe(110)

    const lastAction = (await screen.findAllByLabelText('Acciones para Luis Rojas'))[0]
    const lastDetails = lastAction.closest('details')!
    within(lastDetails).getByRole('menu').getBoundingClientRect = vi.fn(() => ({ bottom: 500 } as DOMRect))
    await user.click(lastAction)
    expect(within(lastDetails).getByRole('menu')).toHaveClass('bottom-full', 'mb-1')
  })

  it('pide confirmación antes de intercambiar un número ocupado', async () => {
    const user = userEvent.setup()
    mocks.getStudentsByCourse.mockImplementation((_courseId, status) => Promise.resolve(status === 'withdrawn' ? [] : [student, secondStudent]))
    render(<CourseStudentsPanel courseId="course-1" courseName="1.º A" canEnroll canManage onBack={vi.fn()} />)

    const actionButton = (await screen.findAllByLabelText('Acciones para Luis Rojas'))[0]
    const menu = actionButton.closest('details')
    expect(menu).not.toBeNull()
    await user.click(actionButton)
    await user.click(within(menu!).getByRole('button', { name: 'Editar información y número' }))

    const numberInput = screen.getByLabelText('Número de lista *')
    await user.clear(numberInput)
    await user.type(numberInput, '1')
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    const initialAlert = screen.getByRole('alert')
    expect(initialAlert).toHaveTextContent('El N.º 01 ya pertenece a Ana Pérez.')
    expect(initialAlert).toHaveTextContent('Ana Pérez pasará al N.º 03.')
    expect(initialAlert).toHaveTextContent('Elige una de las dos opciones para continuar.')
    expect(mocks.updateStudent).not.toHaveBeenCalled()
    expect(mocks.updateCourseStudentListNumber).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(screen.getByRole('alert')).not.toBe(initialAlert)
    expect(screen.getByRole('alert')).toHaveClass('attention-conflict-pulse')
    expect(mocks.updateStudent).not.toHaveBeenCalled()
    expect(mocks.updateCourseStudentListNumber).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Intercambiar números' }))
    await waitFor(() => expect(mocks.updateCourseStudentListNumber).toHaveBeenCalledWith('course-1', 'student-2', 1))
    expect(mocks.updateStudent).toHaveBeenCalledWith('student-2', expect.objectContaining({ firstName: 'Luis', lastName: 'Rojas' }))
  })
})
