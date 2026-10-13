import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { CourseStudentsPanel } from './CourseStudentsPanel'
import type { CourseImportPreview } from '@/modules/students/types'

const mocks = vi.hoisted(() => ({
  createStudentInCourse: vi.fn(),
  importStudentsInCourse: vi.fn(),
  previewCourseStudentImport: vi.fn(),
  getStudentsByCourse: vi.fn(),
  restoreStudentToCourse: vi.fn(),
  updateCourseStudentListNumber: vi.fn(),
  updateStudent: vi.fn(),
}))

vi.mock('@/modules/students/services/studentsService', () => ({
  createStudentInCourse: mocks.createStudentInCourse,
  deleteCourseStudentPermanently: vi.fn(),
  getStudentsByCourse: mocks.getStudentsByCourse,
  importStudentsInCourse: mocks.importStudentsInCourse,
  previewCourseStudentImport: mocks.previewCourseStudentImport,
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
    mocks.importStudentsInCourse.mockReset()
    mocks.previewCourseStudentImport.mockReset()
    mocks.getStudentsByCourse.mockReset().mockResolvedValue([])
    mocks.restoreStudentToCourse.mockReset().mockResolvedValue(undefined)
    mocks.updateCourseStudentListNumber.mockReset().mockResolvedValue(undefined)
    mocks.updateStudent.mockReset().mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it.each(['Cancelar', 'Cerrar', 'Escape', 'Exterior'])(
    'mantiene el modal durante la salida al usar %s y devuelve el foco',
    async (action) => {
      vi.useFakeTimers()
      render(
        <CourseStudentsPanel
          courseId="course-1"
          courseName="1.º A"
          canEnroll
          canManage
          initialAction="new"
          onBack={vi.fn()}
        />,
      )
      await act(async () => undefined)
      const dialog = screen.getByRole('dialog', { name: 'Agregar estudiantes' })
      if (action === 'Escape') fireEvent.keyDown(dialog, { key: 'Escape' })
      else if (action === 'Exterior') fireEvent.click(dialog.parentElement!)
      else fireEvent.click(within(dialog).getByRole('button', { name: action }))
      expect(dialog).toBeInTheDocument()
      act(() => vi.advanceTimersByTime(159))
      expect(dialog).toBeInTheDocument()
      act(() => vi.advanceTimersByTime(1))
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(
        screen.getAllByRole('button', { name: 'Agregar estudiantes' })[0],
      ).toHaveFocus()
    },
  )

  it('cierra sin esperar la animación si el usuario prefiere movimiento reducido', async () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }))
    render(
      <CourseStudentsPanel
        courseId="course-1"
        courseName="1.º A"
        canEnroll
        canManage
        initialAction="new"
        onBack={vi.fn()}
      />,
    )
    await act(async () => undefined)
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(
      screen.getAllByRole('button', { name: 'Agregar estudiantes' })[0],
    ).toHaveFocus()
  })

  it('permite cambiar las pestañas con flechas y conserva el foco dentro del formulario de lista', async () => {
    const user = userEvent.setup()
    render(
      <CourseStudentsPanel
        courseId="course-1"
        courseName="1.º A"
        canEnroll
        canManage
        initialAction="new"
        onBack={vi.fn()}
      />,
    )
    await user.click(screen.getByRole('tab', { name: 'Uno por uno' }))
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Agregar varios' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getByLabelText('Pega una lista (un estudiante por línea)')).toBeInTheDocument()
    screen.getByRole('button', { name: 'Generar vista previa' }).focus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Cerrar' })).toHaveFocus()
  })

  it('espera el guardado antes de iniciar la salida y retiene el teclado mientras guarda', async () => {
    vi.useFakeTimers()
    let completeSave!: (value: typeof student) => void
    mocks.createStudentInCourse.mockReturnValue(
      new Promise((resolve) => {
        completeSave = resolve
      }),
    )
    render(
      <CourseStudentsPanel
        courseId="course-1"
        courseName="1.º A"
        canEnroll
        canManage
        initialAction="new"
        onBack={vi.fn()}
      />,
    )
    await act(async () => undefined)
    fireEvent.change(screen.getByLabelText('Nombre(s) *'), { target: { value: 'Ana' } })
    fireEvent.change(screen.getByLabelText('Apellido(s) *'), { target: { value: 'Pérez' } })
    fireEvent.click(screen.getByRole('button', { name: 'Agregar estudiante' }))
    const dialog = screen.getByRole('dialog', { name: 'Agregar estudiantes' })
    expect(within(dialog).getByRole('button', { name: 'Cerrar' })).toBeDisabled()
    expect(within(dialog).getByRole('button', { name: 'Cancelar' })).toBeDisabled()
    expect(dialog).toHaveFocus()
    const tabKey = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true, bubbles: true })
    dialog.dispatchEvent(tabKey)
    expect(tabKey.defaultPrevented).toBe(true)
    fireEvent.keyDown(dialog, { key: 'Escape' })
    expect(dialog).toBeInTheDocument()
    await act(async () => completeSave(student))
    expect(dialog).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(160))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Estudiante agregado al curso.')
  })

  it('mantiene Shift+Tab dentro del modal cuando termina la vista previa', async () => {
    const user = userEvent.setup()
    let completePreview!: (value: CourseImportPreview) => void
    mocks.previewCourseStudentImport.mockReturnValue(new Promise((resolve) => { completePreview = resolve }))
    render(<CourseStudentsPanel courseId="course-1" courseName="1.º A" canEnroll canManage initialAction="import" onBack={vi.fn()} />)
    await user.type(screen.getByLabelText('Pega una lista (un estudiante por línea)'), 'Luis Rojas')
    await user.click(screen.getByRole('button', { name: 'Generar vista previa' }))
    const dialog = screen.getByRole('dialog', { name: 'Agregar estudiantes' })
    await act(async () => completePreview({
      rows: [{ rowNumber: 1, fullName: 'Luis Rojas', duplicate: false, errors: [] }],
      detectedStudents: 1, detectedCodes: 0, duplicates: 0, errors: 0,
    }))
    expect(dialog).toHaveFocus()
    await user.tab({ shift: true })
    expect(within(dialog).getByRole('button', { name: 'Agregar 1 estudiante' })).toHaveFocus()
    await user.tab()
    expect(within(dialog).getByRole('button', { name: 'Cerrar' })).toHaveFocus()
  })

  it('agrega otro con el botón secundario y finaliza el siguiente registro con Enter', async () => {
    const user = userEvent.setup()
    render(
      <CourseStudentsPanel
        courseId="course-1"
        courseName="1.º A"
        canEnroll
        canManage
        initialAction="new"
        onBack={vi.fn()}
      />,
    )

    await waitFor(() => expect(mocks.getStudentsByCourse).toHaveBeenCalledTimes(2))
    expect(screen.getByRole('dialog').lastElementChild).toHaveClass(
      'min-w-0',
      'overflow-x-clip',
      'overflow-y-auto',
    )
    await user.type(screen.getByLabelText('Nombre(s) *'), 'Ana')
    await user.type(screen.getByLabelText('Apellido(s) *'), 'Pérez')
    expect(screen.queryByText('Datos del estudiante')).not.toBeInTheDocument()
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Agregar y añadir otro' }))

    expect(
      await screen.findByText('Estudiante agregado. Puedes agregar el siguiente.'),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre(s) *')).toHaveValue('')
    expect(screen.getByLabelText('Apellido(s) *')).toHaveValue('')
    expect(screen.getByLabelText('Nombre(s) *')).toHaveFocus()
    mocks.createStudentInCourse.mockResolvedValueOnce(secondStudent)
    mocks.getStudentsByCourse.mockImplementation((_courseId, status) => Promise.resolve(status === 'withdrawn' ? [] : [student, secondStudent]))
    await user.type(screen.getByLabelText('Nombre(s) *'), 'Luis')
    await user.type(screen.getByLabelText('Apellido(s) *'), 'Rojas{Enter}')

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(screen.getAllByText('Ana Pérez')).toHaveLength(2)
    expect(screen.getAllByText('Luis Rojas')).toHaveLength(2)
    expect(mocks.createStudentInCourse).toHaveBeenCalledTimes(2)
    expect(screen.getByRole('table').parentElement).toHaveClass('h-96', 'overflow-auto')
  })

  it('conserva la revisión de duplicados y agrega únicamente las filas incluidas', async () => {
    const user = userEvent.setup()
    mocks.previewCourseStudentImport.mockResolvedValue({
      rows: [
        { rowNumber: 1, fullName: 'Ana Pérez', studentCode: 'A001', duplicate: true, errors: [] },
        { rowNumber: 2, fullName: 'Luis Rojas', studentCode: 'A002', duplicate: false, errors: [] },
      ],
      detectedStudents: 2,
      detectedCodes: 2,
      duplicates: 1,
      errors: 0,
    })
    mocks.importStudentsInCourse.mockResolvedValue({ imported: 1 })
    render(
      <CourseStudentsPanel
        courseId="course-1"
        courseName="1.º A"
        canEnroll
        canManage
        initialAction="import"
        onBack={vi.fn()}
      />,
    )
    await user.type(
      screen.getByLabelText('Pega una lista (un estudiante por línea)'),
      'A001 - Ana Pérez\nA002 - Luis Rojas',
    )
    await user.click(screen.getByRole('button', { name: 'Generar vista previa' }))
    expect(await screen.findByRole('button', { name: 'Agregar 2 estudiantes' })).toBeDisabled()
    expect(screen.getByText('Posible duplicado')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Omitir' }))
    await user.click(screen.getByRole('button', { name: 'Agregar 1 estudiante' }))
    expect(mocks.importStudentsInCourse).toHaveBeenCalledWith('course-1', [
      { studentCode: 'A002', fullName: 'Luis Rojas' },
    ])
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(screen.getByRole('status')).toHaveTextContent('1 estudiante agregado.')
  })

  it('oculta automáticamente el aviso de éxito', async () => {
    vi.useFakeTimers()
    render(
      <CourseStudentsPanel
        courseId="course-1"
        courseName="1.º A"
        canEnroll
        canManage
        initialAction="new"
        onBack={vi.fn()}
      />,
    )
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
    mocks.getStudentsByCourse.mockImplementation((_courseId, status) =>
      Promise.resolve(status === 'withdrawn' ? [] : [student]),
    )
    render(
      <CourseStudentsPanel
        courseId="course-1"
        courseName="1.º A"
        canEnroll
        canManage
        onBack={vi.fn()}
      />,
    )

    const actionButton = (await screen.findAllByLabelText('Acciones para Ana Pérez'))[0]
    const menu = actionButton.closest('details')
    await user.click(actionButton)
    expect(menu).toHaveAttribute('open')

    await user.click(screen.getByRole('button', { name: 'Volver al curso' }))
    expect(menu).not.toHaveAttribute('open')
  })

  it('muestra y ejecuta la restauración de un estudiante retirado', async () => {
    const user = userEvent.setup()
    mocks.getStudentsByCourse.mockImplementation((_courseId, status) =>
      Promise.resolve(status === 'withdrawn' ? [student] : []),
    )
    render(
      <CourseStudentsPanel
        courseId="course-1"
        courseName="1.º A"
        canEnroll
        canManage
        onBack={vi.fn()}
      />,
    )

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
    mocks.getStudentsByCourse.mockImplementation((_courseId, status) =>
      Promise.resolve(status === 'withdrawn' ? [] : [student]),
    )
    render(
      <CourseStudentsPanel
        courseId="course-1"
        courseName="1.º A"
        canEnroll
        canManage
        onBack={vi.fn()}
      />,
    )

    const table = await screen.findByRole('table')
    const row = within(table).getByText('01').closest('tr')!
    expect(row).toHaveClass('cursor-pointer', 'hover:bg-primary/[0.035]', 'hover:shadow-sm')
    await user.click(within(table).getByText('01'))

    const details = within(screen.getByRole('dialog'))
    expect(screen.getByRole('heading', { name: 'Información del estudiante' })).toBeInTheDocument()
    expect(details.getByText('Número de lista').nextElementSibling).toHaveTextContent('01')
    expect(details.getByText('Matrícula').nextElementSibling).toHaveTextContent('Sin matrícula')
    expect(details.getByText('Sexo').nextElementSibling).toHaveTextContent('No especificado')
    expect(details.getByText('Fecha de nacimiento').nextElementSibling).toHaveTextContent(
      '1 de enero de 2000',
    )

    await user.click(screen.getByRole('button', { name: 'Editar información' }))
    expect(screen.getByRole('heading', { name: 'Editar estudiante' })).toBeInTheDocument()
  })

  it('desplaza la lista para mostrar el menú y lo abre hacia arriba en el último estudiante', async () => {
    const user = userEvent.setup()
    mocks.getStudentsByCourse.mockImplementation((_courseId, status) =>
      Promise.resolve(status === 'withdrawn' ? [] : [student, secondStudent]),
    )
    render(
      <CourseStudentsPanel
        courseId="course-1"
        courseName="1.º A"
        canEnroll
        canManage
        onBack={vi.fn()}
      />,
    )

    const firstAction = (await screen.findAllByLabelText('Acciones para Ana Pérez'))[0]
    const firstDetails = firstAction.closest('details')!
    const firstMenu = within(firstDetails).getByRole('menu')
    const scrollArea = screen.getByRole('table').parentElement!
    const nextRow = firstDetails.closest('tr')!.nextElementSibling as HTMLElement
    Object.defineProperties(scrollArea, {
      scrollHeight: { configurable: true, value: 900 },
      clientHeight: { configurable: true, value: 384 },
      scrollTop: { configurable: true, value: 0, writable: true },
      scrollTo: {
        configurable: true,
        value: vi.fn(({ top }: ScrollToOptions) => {
          if (typeof top === 'number') scrollArea.scrollTop = top
        }),
      },
    })
    scrollArea.getBoundingClientRect = vi.fn(() => ({ bottom: 400 }) as DOMRect)
    firstMenu.getBoundingClientRect = vi.fn(() => ({ bottom: 450 }) as DOMRect)
    nextRow.getBoundingClientRect = vi.fn(() => ({ height: 60 }) as DOMRect)

    await user.click(firstAction)
    expect(scrollArea).toHaveClass('scroll-smooth', 'motion-reduce:scroll-auto')
    expect(scrollArea.scrollTo).toHaveBeenCalledWith({ top: 110 })
    expect(scrollArea.scrollTop).toBe(110)

    const lastAction = (await screen.findAllByLabelText('Acciones para Luis Rojas'))[0]
    const lastDetails = lastAction.closest('details')!
    within(lastDetails).getByRole('menu').getBoundingClientRect = vi.fn(
      () => ({ bottom: 500 }) as DOMRect,
    )
    await user.click(lastAction)
    expect(within(lastDetails).getByRole('menu')).toHaveClass('bottom-full', 'mb-1')
  })

  it('pide confirmación antes de intercambiar un número ocupado', async () => {
    const user = userEvent.setup()
    mocks.getStudentsByCourse.mockImplementation((_courseId, status) =>
      Promise.resolve(status === 'withdrawn' ? [] : [student, secondStudent]),
    )
    render(
      <CourseStudentsPanel
        courseId="course-1"
        courseName="1.º A"
        canEnroll
        canManage
        onBack={vi.fn()}
      />,
    )

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
    await waitFor(() =>
      expect(mocks.updateCourseStudentListNumber).toHaveBeenCalledWith('course-1', 'student-2', 1),
    )
    expect(mocks.updateStudent).toHaveBeenCalledWith(
      'student-2',
      expect.objectContaining({ firstName: 'Luis', lastName: 'Rojas' }),
    )
  })
})
