import { beforeEach, describe, expect, it, vi } from 'vitest'
import { StudentsService } from './students.service'

const mocks = vi.hoisted(() => ({
  prisma: {
    $transaction: vi.fn(),
    sectionSubject: { findFirst: vi.fn(), findMany: vi.fn() },
    grade: { findMany: vi.fn() },
    section: { findMany: vi.fn() },
    subject: { findMany: vi.fn() },
    schoolYear: { findMany: vi.fn() },
    enrollment: {
      groupBy: vi.fn(),
      create: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
    student: { create: vi.fn(), findFirst: vi.fn(), findMany: vi.fn() },
    studentGuardian: { findMany: vi.fn() },
    guardianNotification: { createMany: vi.fn() },
  },
}))

vi.mock('@aula/database', () => ({
  prisma: mocks.prisma,
  Prisma: { PrismaClientKnownRequestError: class {} },
}))

function createService() {
  return new StudentsService()
}

function mockCourse() {
  mocks.prisma.sectionSubject.findFirst.mockResolvedValue({
    id: 'course-1',
    schoolId: 'school-1',
    schoolYearId: 'year-1',
    gradeId: 'grade-1',
    sectionId: 'section-1',
    subjectId: 'subject-1',
    status: 'ACTIVE',
  })
}

describe('StudentsService course enrollment', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    mocks.prisma.$transaction.mockImplementation((callback) =>
      callback({
        student: { create: mocks.prisma.student.create },
        enrollment: { create: mocks.prisma.enrollment.create },
      }),
    )
    mocks.prisma.grade.findMany.mockResolvedValue([
      { id: 'grade-1', name: '3ro Secundaria', level: 'Nivel Secundario' },
    ])
    mocks.prisma.section.findMany.mockResolvedValue([
      { id: 'section-1', name: 'A' },
    ])
    mocks.prisma.subject.findMany.mockResolvedValue([
      { id: 'subject-1', name: 'Lengua Española', code: 'LEN' },
    ])
    mocks.prisma.schoolYear.findMany.mockResolvedValue([
      { id: 'year-1', name: '2026-2027' },
    ])
  })

  it('lists courses available for enrollment with student counts', async () => {
    mocks.prisma.sectionSubject.findMany.mockResolvedValue([
      {
        id: 'course-1',
        schoolYearId: 'year-1',
        gradeId: 'grade-1',
        sectionId: 'section-1',
        subjectId: 'subject-1',
        status: 'ACTIVE',
        grade: {
          id: 'grade-1',
          name: '3ro Secundaria',
          level: 'Nivel Secundario',
        },
        section: { id: 'section-1', name: 'A' },
        subject: { id: 'subject-1', name: 'Lengua Española', code: 'LEN' },
        schoolYear: { id: 'year-1', name: '2026-2027' },
      },
    ])
    mocks.prisma.enrollment.groupBy.mockResolvedValue([
      { schoolYearId: 'year-1', gradeId: 'grade-1', sectionId: 'section-1', _count: { id: 2 } },
    ])

    const result = await createService().getEnrollmentCourses('school-1')

    expect(result).toEqual([
      expect.objectContaining({
        id: 'course-1',
        label: '3ro Secundaria A - Lengua Española - 2026-2027',
        studentCount: 2,
      }),
    ])
  })

  it('lists students by course with enrollment ids', async () => {
    mockCourse()
    mocks.prisma.enrollment.findMany.mockResolvedValue([
      { id: 'enrollment-1', studentId: 'student-1' },
    ])
    mocks.prisma.student.findMany.mockResolvedValue([
      {
        id: 'student-1',
        studentCode: '2026001',
        firstName: 'Juan',
        lastName: 'Pérez',
        status: 'ACTIVE',
      },
    ])

    const result = await createService().getStudentsByCourse(
      'school-1',
      'course-1',
    )

    expect(result).toEqual([
      expect.objectContaining({
        id: 'student-1',
        enrollmentId: 'enrollment-1',
        fullName: 'Juan Pérez',
        status: 'active',
      }),
    ])
  })

  it('rejects duplicate student code inside the same course', async () => {
    mockCourse()
    mocks.prisma.student.findFirst.mockResolvedValue({
      id: 'student-1',
      studentCode: '2026001',
    })
    mocks.prisma.enrollment.findFirst.mockResolvedValue({ id: 'enrollment-1' })

    await expect(
      createService().createStudentInCourse('school-1', 'course-1', {
        studentCode: '2026001',
        fullName: 'Juan Pérez',
      }),
    ).rejects.toThrow(
      'Ya existe un estudiante con esta matrícula en este curso.',
    )
  })

  it('creates a student and enrollment in a course', async () => {
    mockCourse()
    mocks.prisma.student.findFirst.mockResolvedValue(null)
    mocks.prisma.student.create.mockResolvedValue({
      id: 'student-1',
      studentCode: '2026001',
      firstName: 'Ana',
      lastName: 'Gómez',
      status: 'ACTIVE',
    })
    mocks.prisma.enrollment.create.mockResolvedValue({ id: 'enrollment-1' })

    const result = await createService().createStudentInCourse(
      'school-1',
      'course-1',
      {
        studentCode: '2026001',
        fullName: 'Ana Gómez',
      },
    )

    expect(mocks.prisma.student.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        schoolId: 'school-1',
        studentCode: '2026001',
        firstName: 'Ana',
        lastName: 'Gómez',
      }),
    })
    expect(mocks.prisma.enrollment.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        schoolId: 'school-1',
        studentId: 'student-1',
        schoolYearId: 'year-1',
        gradeId: 'grade-1',
        sectionId: 'section-1',
        status: 'ACTIVE',
      }),
    })
    expect(result).toEqual(
      expect.objectContaining({ id: 'student-1', fullName: 'Ana Gómez' }),
    )
  })

  it('reuses an existing student code when the student is not enrolled in the course year', async () => {
    mockCourse()
    mocks.prisma.student.findFirst.mockResolvedValue({
      id: 'student-1',
      studentCode: '2026001',
      firstName: 'Ana',
      lastName: 'Gómez',
      status: 'ACTIVE',
    })
    mocks.prisma.enrollment.findFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
    mocks.prisma.enrollment.create.mockResolvedValue({ id: 'enrollment-1' })

    const result = await createService().createStudentInCourse(
      'school-1',
      'course-1',
      {
        studentCode: '2026001',
        fullName: 'Ana Gómez',
      },
    )

    expect(mocks.prisma.student.create).not.toHaveBeenCalled()
    expect(mocks.prisma.enrollment.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        schoolId: 'school-1',
        studentId: 'student-1',
        schoolYearId: 'year-1',
        gradeId: 'grade-1',
        sectionId: 'section-1',
      }),
    })
    expect(result).toEqual(
      expect.objectContaining({ id: 'student-1', fullName: 'Ana Gómez' }),
    )
  })

  it('previews course import with duplicates and row errors', async () => {
    mockCourse()
    mocks.prisma.student.findFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: 'student-1' })
      .mockResolvedValueOnce(null)
    mocks.prisma.enrollment.findFirst.mockResolvedValueOnce({
      id: 'enrollment-1',
    })

    const result = await createService().previewCourseImport(
      'school-1',
      'course-1',
      [
        { studentCode: '2026001', fullName: 'Ana Gómez' },
        { studentCode: '2026001', fullName: 'Ana Gómez' },
        { studentCode: '2026002', fullName: 'Luis Pérez' },
        { studentCode: '2026003', fullName: '' },
      ],
    )

    expect(result.detectedStudents).toBe(3)
    expect(result.detectedCodes).toBe(4)
    expect(result.duplicates).toBe(2)
    expect(result.errors).toBe(2)
    expect(result.rows[1]).toEqual(expect.objectContaining({ duplicate: true }))
    expect(result.rows[2].errors).toContain('Ya existe en este curso.')
    expect(result.rows[3].errors).toContain('Nombre requerido.')
  })

  it('imports only valid preview rows into the course', async () => {
    mockCourse()
    mocks.prisma.student.findFirst.mockResolvedValue(null)
    mocks.prisma.enrollment.findFirst.mockResolvedValue(null)
    mocks.prisma.student.create.mockResolvedValue({
      id: 'student-1',
      studentCode: '2026001',
      firstName: 'Ana',
      lastName: 'Gómez',
    })
    mocks.prisma.enrollment.create.mockResolvedValue({ id: 'enrollment-1' })

    const result = await createService().importStudentsInCourse(
      'school-1',
      'course-1',
      [
        { studentCode: '2026001', fullName: 'Ana Gómez' },
        { studentCode: '2026002', fullName: '' },
      ],
    )

    expect(result).toEqual({ imported: 1, errors: [] })
    expect(mocks.prisma.student.create).toHaveBeenCalledTimes(1)
  })

  it('does not import duplicate rows from the same paste payload', async () => {
    mockCourse()
    mocks.prisma.student.findFirst.mockResolvedValue(null)
    mocks.prisma.enrollment.findFirst.mockResolvedValue(null)
    mocks.prisma.student.create.mockResolvedValue({
      id: 'student-1',
      studentCode: '2026001',
      firstName: 'Ana',
      lastName: 'Gómez',
    })
    mocks.prisma.enrollment.create.mockResolvedValue({ id: 'enrollment-1' })

    const result = await createService().importStudentsInCourse(
      'school-1',
      'course-1',
      [
        { studentCode: '2026001', fullName: 'Ana Gómez' },
        { studentCode: '2026001', fullName: 'Ana Gómez' },
      ],
    )

    expect(result).toEqual({ imported: 1, errors: [] })
    expect(mocks.prisma.student.create).toHaveBeenCalledTimes(1)
  })

  it('withdraws a student from the selected course enrollment', async () => {
    mockCourse()
    mocks.prisma.enrollment.findFirst.mockResolvedValue({
      id: 'enrollment-1',
      studentId: 'student-1',
    })
    mocks.prisma.enrollment.update.mockResolvedValue({
      id: 'enrollment-1',
      status: 'WITHDRAWN',
      academicStatus: 'withdrawn',
    })

    const result = await createService().withdrawStudentFromCourse(
      'school-1',
      'course-1',
      'student-1',
    )

    expect(mocks.prisma.enrollment.update).toHaveBeenCalledWith({
      where: { id: 'enrollment-1' },
      data: {
        status: 'WITHDRAWN',
        academicStatus: 'withdrawn',
      },
    })
    expect(result).toEqual(expect.objectContaining({ status: 'WITHDRAWN' }))
  })

  it('moves a student enrollment to the target course when transferred', async () => {
    mocks.prisma.sectionSubject.findFirst
      .mockResolvedValueOnce({
        id: 'course-1',
        schoolId: 'school-1',
        schoolYearId: 'year-1',
        gradeId: 'grade-1',
        sectionId: 'section-1',
        subjectId: 'subject-1',
        status: 'ACTIVE',
      })
      .mockResolvedValueOnce({
        id: 'course-2',
        schoolId: 'school-1',
        schoolYearId: 'year-1',
        gradeId: 'grade-2',
        sectionId: 'section-2',
        subjectId: 'subject-2',
        status: 'ACTIVE',
      })
    mocks.prisma.enrollment.findFirst
      .mockResolvedValueOnce({ id: 'enrollment-1', studentId: 'student-1' })
      .mockResolvedValueOnce(null)
    mocks.prisma.enrollment.update.mockResolvedValue({
      id: 'enrollment-1',
      gradeId: 'grade-2',
      sectionId: 'section-2',
      academicStatus: 'transferred',
    })

    await createService().transferStudentToCourse(
      'school-1',
      'course-1',
      'student-1',
      'course-2',
    )

    expect(mocks.prisma.enrollment.update).toHaveBeenCalledWith({
      where: { id: 'enrollment-1' },
      data: expect.objectContaining({
        schoolYearId: 'year-1',
        gradeId: 'grade-2',
        sectionId: 'section-2',
        status: 'ACTIVE',
        academicStatus: 'transferred',
      }),
    })
  })
})

describe('StudentsService.notifyGuardians', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    mocks.prisma.student.findFirst.mockResolvedValue({ id: 'student-1' })
    mocks.prisma.studentGuardian.findMany.mockResolvedValue([
      { guardianId: 'guardian-1' },
      { guardianId: 'guardian-2' },
    ])
    mocks.prisma.guardianNotification.createMany.mockResolvedValue({
      count: 2,
    })
  })

  it('persists one guardian notification per guardian link', async () => {
    const result = await createService().notifyGuardians(
      'school-1',
      'student-1',
      'user-1',
      {
        subject: 'Aviso',
        message: 'Mensaje',
      },
    )

    expect(mocks.prisma.guardianNotification.createMany).toHaveBeenCalledWith({
      data: [
        {
          schoolId: 'school-1',
          studentId: 'student-1',
          guardianId: 'guardian-1',
          createdBy: 'user-1',
          subject: 'Aviso',
          message: 'Mensaje',
          status: 'queued',
        },
        {
          schoolId: 'school-1',
          studentId: 'student-1',
          guardianId: 'guardian-2',
          createdBy: 'user-1',
          subject: 'Aviso',
          message: 'Mensaje',
          status: 'queued',
        },
      ],
    })
    expect(result.notified).toBe(2)
  })
})
