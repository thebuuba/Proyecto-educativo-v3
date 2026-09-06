import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

import { EstudiantesTab } from './CoursesPage'

const mocks = vi.hoisted(() => ({
  createJournalEntry: vi.fn(),
  deleteJournalEntry: vi.fn(),
  getJournalEntries: vi.fn(),
  getStudentsBySection: vi.fn(),
  updateJournalEntry: vi.fn(),
}))

vi.mock('@/modules/attendance/services/attendanceService', async (importOriginal) => ({
  ...await importOriginal<typeof import('@/modules/attendance/services/attendanceService')>(),
  getStudentsBySection: mocks.getStudentsBySection,
}))

vi.mock('@/modules/journal/services/journalService', async (importOriginal) => ({
  ...await importOriginal<typeof import('@/modules/journal/services/journalService')>(),
  createJournalEntry: mocks.createJournalEntry,
  deleteJournalEntry: mocks.deleteJournalEntry,
  getJournalEntries: mocks.getJournalEntries,
  updateJournalEntry: mocks.updateJournalEntry,
}))

const student = {
  enrollmentId: 'enrollment-1',
  studentId: 'student-1',
  studentCode: 'TEMP-1',
  listNumber: 1,
  firstName: 'Ana',
  lastName: 'Pérez',
  status: null,
  attendanceId: null,
}

const journalEntry = {
  id: 'journal-1',
  entryType: 'student_observation' as const,
  title: 'Participación destacada',
  content: 'Ana explicó el ciclo de vida con claridad y ayudó a su equipo.',
  occurredAt: '2026-09-06T14:30:00.000Z',
  tags: ['participación', 'seguimiento'],
  requiresFollowUp: false,
  followUpDate: null,
  followUpStatus: 'none' as const,
  status: 'ACTIVE' as const,
  schoolYearId: 'year-1',
  sectionId: 'section-1',
  sectionSubjectId: 'subject-1',
  academicPeriodId: null,
  schoolYear: { id: 'year-1', name: '2026-2027' },
  academicPeriod: null,
  section: { id: 'section-1', name: 'A', grade: { name: '2.º' } },
  sectionSubject: { id: 'subject-1', subject: { id: 'science-1', name: 'Ciencias de la Naturaleza' } },
  students: [{ student: { id: 'student-1', firstName: 'Ana', lastName: 'Pérez', studentCode: 'TEMP-1' } }],
}

function renderStudentsTab() {
  return render(
    <MemoryRouter>
      <EstudiantesTab
        students={[student]}
        loading={false}
        error={null}
        courseId="subject-1"
        sectionId="section-1"
        canEnroll
        gradingStudents={[]}
        activities={[]}
        gradeRecords={[]}
        teams={[]}
        journalCourse={{ id: 'subject-1', sectionId: 'section-1', schoolYearId: 'year-1', gradeName: '2.º', sectionName: 'A', subjectName: 'Ciencias de la Naturaleza' }}
      />
    </MemoryRouter>,
  )
}

describe('estudiantes de una asignatura', () => {
  beforeEach(() => {
    mocks.createJournalEntry.mockReset().mockResolvedValue({})
    mocks.deleteJournalEntry.mockReset().mockResolvedValue({ id: 'journal-1' })
    mocks.getJournalEntries.mockReset().mockResolvedValue([])
    mocks.getStudentsBySection.mockReset().mockResolvedValue([student])
    mocks.updateJournalEntry.mockReset().mockResolvedValue(journalEntry)
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0)
      return 1
    })
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false })))
    Element.prototype.scrollIntoView = vi.fn()
  })

  it('muestra el detalle con desplazamiento suave y crea la observación sin salir de la vista', async () => {
    const user = userEvent.setup()
    mocks.getJournalEntries.mockResolvedValueOnce([]).mockResolvedValueOnce([]).mockResolvedValue([journalEntry])
    mocks.createJournalEntry.mockResolvedValue(journalEntry)
    renderStudentsTab()

    const scrollArea = screen.getByRole('table').parentElement!
    expect(scrollArea).toHaveClass('md:overflow-x-hidden')
    expect(screen.getByRole('table')).toHaveClass('md:min-w-0', 'md:table-fixed')

    await user.click(screen.getByText('Pérez, Ana'))
    await waitFor(() => expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'nearest' }))
    expect(screen.getByText('Pérez, Ana').closest('tr')).toHaveAttribute('aria-expanded', 'true')

    await user.click(screen.getByText('Pérez, Ana'))
    expect(screen.queryByRole('button', { name: 'Agregar observación a bitácora' })).not.toBeInTheDocument()

    await user.click(screen.getByText('Pérez, Ana'))

    await user.click(screen.getByRole('button', { name: 'Agregar observación a bitácora' }))
    expect(screen.getByRole('heading', { name: 'Nueva anotación' })).toBeInTheDocument()
    expect(screen.getByLabelText('Tipo')).toHaveValue('student_observation')
    expect(screen.getByLabelText('Curso')).toHaveValue('section-1')
    expect(screen.getByLabelText('Asignatura')).toHaveValue('subject-1')
    expect((screen.getByLabelText('Fecha y hora') as HTMLInputElement).value).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
    await waitFor(() => expect(mocks.getStudentsBySection).toHaveBeenCalledWith('section-1', 'year-1'))
    const selectedStudent = await within(screen.getByRole('dialog')).findByText('Ana Pérez')
    expect(selectedStudent.closest('label')?.querySelector('input')).toBeChecked()

    await user.type(screen.getByLabelText('Contenido'), 'Mostró una participación destacada.')
    await user.click(screen.getByRole('button', { name: 'Guardar anotación' }))
    await waitFor(() => expect(mocks.createJournalEntry).toHaveBeenCalledWith(expect.objectContaining({
      entryType: 'student_observation',
      sectionId: 'section-1',
      sectionSubjectId: 'subject-1',
      schoolYearId: 'year-1',
      studentIds: ['student-1'],
    })))
    expect(await screen.findByRole('button', { name: 'Ver observación Participación destacada' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Agregar otra observación' })).toBeInTheDocument()
  })

  it('permite consultar, editar y eliminar permanentemente una observación', async () => {
    const user = userEvent.setup()
    mocks.getJournalEntries.mockResolvedValue([journalEntry])
    renderStudentsTab()

    await user.click(screen.getByText('Pérez, Ana'))
    await user.click(await screen.findByRole('button', { name: 'Ver observación Participación destacada' }))
    const detailDialog = screen.getByRole('dialog')
    expect(within(detailDialog).getByText(journalEntry.content)).toBeInTheDocument()
    expect(within(detailDialog).getByText('#participación')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Editar observación' }))
    expect(screen.getByRole('heading', { name: 'Editar anotación' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Guardar anotación' }))
    await waitFor(() => expect(mocks.updateJournalEntry).toHaveBeenCalledWith('journal-1', expect.objectContaining({ studentIds: ['student-1'] })))

    await user.click(await screen.findByRole('button', { name: 'Ver observación Participación destacada' }))
    await user.click(screen.getByRole('button', { name: 'Eliminar' }))
    expect(screen.getByText('Esta observación se borrará de la bitácora y no podrá recuperarse.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Eliminar permanentemente' }))
    await waitFor(() => expect(mocks.deleteJournalEntry).toHaveBeenCalledWith('journal-1'))
  })
})
