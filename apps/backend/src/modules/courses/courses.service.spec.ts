import { beforeEach, describe, expect, it, vi } from 'vitest'
import { __test__clearCoursesCache, CoursesService } from './courses.service'

const mocks = vi.hoisted(() => ({
  prisma: {
    grade: { findMany: vi.fn(), findFirst: vi.fn(), create: vi.fn(), update: vi.fn(), upsert: vi.fn() },
    section: { findMany: vi.fn(), findFirst: vi.fn(), upsert: vi.fn() },
    sectionSubject: { findMany: vi.fn(), upsert: vi.fn() },
    enrollment: { groupBy: vi.fn() },
    subject: { findMany: vi.fn() },
    drAcademicLevel: { findMany: vi.fn() },
    drAcademicCycle: { findMany: vi.fn() },
    drModality: { findMany: vi.fn() },
    teacher: { findMany: vi.fn() },
    schoolYear: { findFirst: vi.fn() },
  },
}))

vi.mock('@aula/database', () => ({
  prisma: mocks.prisma,
  RecordStatus: {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
  },
}))

describe('CoursesService.getCourseData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    __test__clearCoursesCache()
    mocks.prisma.grade.findMany.mockResolvedValue([
      {
        id: 'grade-1',
        name: '1ro',
        level: null,
        academicLevelId: 'level-1',
        academicCycleId: 'cycle-1',
        defaultModalityId: 'mod-1',
        sequence: 1,
        status: 'ACTIVE',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-02T00:00:00.000Z'),
      },
    ])
    mocks.prisma.section.findMany.mockResolvedValue([
      {
        id: 'section-1',
        gradeId: 'grade-1',
        name: 'A',
        capacity: 30,
        status: 'ACTIVE',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-02T00:00:00.000Z'),
      },
    ])
    mocks.prisma.sectionSubject.findMany.mockResolvedValue([
      {
        id: 'ss-1',
        sectionId: 'section-1',
        gradeId: 'grade-1',
        subjectId: 'subject-1',
        teacherId: 'teacher-1',
        status: 'ACTIVE',
      },
    ])
    mocks.prisma.enrollment.groupBy.mockResolvedValue([
      { sectionId: 'section-1', _count: { id: 12 } },
    ])
    mocks.prisma.subject.findMany.mockResolvedValue([{ id: 'subject-1', code: 'MAT', name: 'Matemática', description: null, credits: null }])
    mocks.prisma.drAcademicLevel.findMany.mockResolvedValue([{ id: 'level-1', code: 'PRI', name: 'Primaria', sequence: 1 }])
    mocks.prisma.drAcademicCycle.findMany.mockResolvedValue([{ id: 'cycle-1', levelId: 'level-1', code: 'C1', name: 'Primer ciclo', sequence: 1, gradeSequenceFrom: 1, gradeSequenceTo: 3 }])
    mocks.prisma.drModality.findMany.mockResolvedValue([{ id: 'mod-1', code: 'GEN', name: 'General', appliesFromGradeSequence: null, appliesToGradeSequence: null }])
    mocks.prisma.teacher.findMany.mockResolvedValue([{ id: 'teacher-1', firstName: 'Ana', lastName: 'Pérez', email: 'ana@test.local' }])
    mocks.prisma.schoolYear.findFirst.mockResolvedValue({ id: 'year-1', name: '2026-2027' })
  })

  it('returns the frontend course-data shape', async () => {
    const result = await new CoursesService().getCourseData('school-1')

    expect(result.currentSchoolYear).toEqual({ id: 'year-1', name: '2026-2027' })
    expect(result.catalogs.levels[0].name).toBe('Primaria')
    expect(result.grades[0]).toMatchObject({
      id: 'grade-1',
      academicLevelName: 'Primaria',
      academicCycleName: 'Primer ciclo',
      defaultModalityName: 'General',
      status: 'active',
      sections: [
        {
          id: 'section-1',
          studentCount: 12,
          assignments: [
            {
              id: 'ss-1',
              subjectName: 'Matemática',
              teacherName: 'Ana Pérez',
              status: 'active',
            },
          ],
        },
      ],
    })
  })

  it('invalidates cached course data after a mutation', async () => {
    const service = new CoursesService()
    mocks.prisma.grade.upsert.mockResolvedValue({ id: 'grade-2', name: '2do', status: 'ACTIVE' })

    await service.getCourseData('school-1')
    await service.getCourseData('school-1')
    expect(mocks.prisma.grade.findMany).toHaveBeenCalledTimes(1)

    await service.createGrade('school-1', { name: '2do' })
    await service.getCourseData('school-1')

    expect(mocks.prisma.grade.findMany).toHaveBeenCalledTimes(2)
  })
})

describe('CoursesService write idempotency', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    __test__clearCoursesCache()
  })

  it('creates grades by school, name, level and cycle instead of merging levels', async () => {
    mocks.prisma.grade.findFirst.mockResolvedValue(null)
    mocks.prisma.grade.create.mockResolvedValue({ id: 'grade-1', name: '1.º', status: 'ACTIVE' })

    const result = await new CoursesService().createGrade('school-1', {
      name: '1.º',
      level: 'Secundario',
      academicLevelId: 'level-1',
      academicCycleId: 'cycle-1',
      sequence: 1,
    })

    expect(result).toEqual({ id: 'grade-1', name: '1.º', status: 'ACTIVE' })
    expect(mocks.prisma.grade.findFirst).toHaveBeenCalledWith({
      where: {
        schoolId: 'school-1',
        name: '1.º',
        academicLevelId: 'level-1',
        academicCycleId: 'cycle-1',
      },
    })
    expect(mocks.prisma.grade.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        schoolId: 'school-1',
        name: '1.º',
        academicLevelId: 'level-1',
        academicCycleId: 'cycle-1',
      }),
    }))
  })

  it('upserts sections by grade and name after validating the grade', async () => {
    mocks.prisma.grade.findFirst.mockResolvedValue({ id: 'grade-1', schoolId: 'school-1' })
    mocks.prisma.section.upsert.mockResolvedValue({ id: 'section-1', name: 'A', status: 'ACTIVE' })

    const result = await new CoursesService().createSection('school-1', {
      gradeId: 'grade-1',
      name: 'A',
    })

    expect(result).toEqual({ id: 'section-1', name: 'A', status: 'ACTIVE' })
    expect(mocks.prisma.section.upsert).toHaveBeenCalledWith(expect.objectContaining({
      where: { gradeId_name: { gradeId: 'grade-1', name: 'A' } },
      update: expect.objectContaining({ status: 'ACTIVE' }),
    }))
  })
})
