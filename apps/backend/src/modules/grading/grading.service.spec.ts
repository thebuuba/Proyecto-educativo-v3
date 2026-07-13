import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GradingService } from './grading.service'

const mocks = vi.hoisted(() => ({
  prisma: {
    academicPeriod: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      createMany: vi.fn(),
    },
    schoolYear: {
      findFirst: vi.fn(),
    },
    sectionSubject: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
    },
    enrollment: {
      findMany: vi.fn(),
    },
    gradesRecord: {
      findMany: vi.fn(),
    },
    evaluationActivity: {
      findMany: vi.fn(),
    },
  },
}))

vi.mock('@aula/database', () => ({
  prisma: mocks.prisma,
}))

describe('GradingService.getAcademicPeriods', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates the four base grading periods when none exist', async () => {
    const createdPeriods = [
      { id: 'p1', name: 'P1 — Agosto, septiembre y octubre', sequence: 1 },
      { id: 'p2', name: 'P2 — Noviembre, diciembre y enero', sequence: 2 },
      { id: 'p3', name: 'P3 — Febrero, marzo y abril', sequence: 3 },
      { id: 'p4', name: 'P4 — Mayo', sequence: 4 },
    ]
    mocks.prisma.academicPeriod.findMany
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce(createdPeriods)
    mocks.prisma.schoolYear.findFirst.mockResolvedValue({
      id: 'year-1',
      startDate: new Date('2026-08-01T00:00:00.000Z'),
    })

    const result = await new GradingService().getAcademicPeriods('school-1')

    expect(mocks.prisma.academicPeriod.createMany).toHaveBeenCalledWith({
      data: expect.arrayContaining([
        expect.objectContaining({
          schoolId: 'school-1',
          schoolYearId: 'year-1',
          name: 'P1 — Agosto, septiembre y octubre',
          sequence: 1,
        }),
        expect.objectContaining({
          name: 'P4 — Mayo',
          sequence: 4,
        }),
      ]),
      skipDuplicates: true,
    })
    expect(result).toEqual(createdPeriods)
  })
})

describe('GradingService optimized workspaces', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads section subjects with their relations in a single query', async () => {
    mocks.prisma.sectionSubject.findMany.mockResolvedValue([
      {
        id: 'ss-1',
        sectionId: 'section-1',
        schoolYearId: 'year-1',
        subject: { name: 'Matemática' },
        section: { name: 'A' },
        grade: {
          name: '1.º',
          sequence: 1,
          level: 'Primario',
          academicLevel: { name: 'Nivel Primario', sequence: 1 },
        },
        schoolYear: { name: '2026-2027' },
      },
    ])

    const result = await new GradingService().getSectionSubjects('school-1')

    expect(mocks.prisma.sectionSubject.findMany).toHaveBeenCalledTimes(1)
    expect(result).toEqual([
      expect.objectContaining({
        id: 'ss-1',
        subjectName: 'Matemática',
        sectionName: 'A',
        gradeName: '1.º',
        academicLevelName: 'Nivel Primario',
      }),
    ])
  })

  it('returns options, students, records and activities in one workspace', async () => {
    mocks.prisma.sectionSubject.findMany.mockResolvedValue([
      {
        id: 'ss-1',
        sectionId: 'section-1',
        schoolYearId: 'year-1',
        subject: { name: 'Matemática' },
        section: { name: 'A' },
        grade: { name: '1.º', sequence: 1, level: 'Primario', academicLevel: null },
        schoolYear: { name: '2026-2027' },
      },
    ])
    mocks.prisma.academicPeriod.findMany.mockResolvedValue([
      { id: 'period-1', schoolYearId: 'year-1', name: 'P1', sequence: 1 },
    ])
    mocks.prisma.enrollment.findMany.mockResolvedValue([
      {
        id: 'enrollment-1',
        studentId: 'student-1',
        student: { studentCode: '001', firstName: 'Ana', lastName: 'Pérez' },
      },
    ])
    mocks.prisma.gradesRecord.findMany.mockResolvedValue([])
    mocks.prisma.evaluationActivity.findMany.mockResolvedValue([])

    const result = await new GradingService().getWorkspace('school-1')

    expect(result.selectedSectionSubjectId).toBe('ss-1')
    expect(result.selectedAcademicPeriodId).toBe('period-1')
    expect(result.students).toEqual([
      expect.objectContaining({ firstName: 'Ana', lastName: 'Pérez', listNumber: 1 }),
    ])
    expect(mocks.prisma.enrollment.findMany).toHaveBeenCalledTimes(1)
    expect(mocks.prisma.gradesRecord.findMany).toHaveBeenCalledTimes(1)
    expect(mocks.prisma.evaluationActivity.findMany).toHaveBeenCalledTimes(1)
  })

  it('groups annual records and activities without per-period queries', async () => {
    mocks.prisma.sectionSubject.findFirst.mockResolvedValue({ id: 'ss-1', schoolYearId: 'year-1' })
    mocks.prisma.academicPeriod.findMany.mockResolvedValue([
      { id: 'period-1', sequence: 1, name: 'P1' },
      { id: 'period-2', sequence: 2, name: 'P2' },
    ])
    mocks.prisma.gradesRecord.findMany.mockResolvedValue([
      {
        id: 'grade-1',
        enrollmentId: 'enrollment-1',
        academicPeriodId: 'period-1',
        score: 18,
        maxScore: 20,
        weight: 1,
        assessmentName: 'Actividad',
        status: 'DRAFT',
        evaluationActivityId: null,
      },
    ])
    mocks.prisma.evaluationActivity.findMany.mockResolvedValue([])

    const result = await new GradingService().getAnnualWorkspace('school-1', 'ss-1')

    expect(result).toHaveLength(2)
    expect(result[0].gradeRecords).toEqual([
      expect.objectContaining({ id: 'grade-1', score: 18, status: 'draft' }),
    ])
    expect(result[1].gradeRecords).toEqual([])
    expect(mocks.prisma.gradesRecord.findMany).toHaveBeenCalledTimes(1)
    expect(mocks.prisma.evaluationActivity.findMany).toHaveBeenCalledTimes(1)
  })
})
