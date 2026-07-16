import { beforeEach, describe, expect, it, vi } from 'vitest'
import { optionCache, optionCacheKeys } from '../../common/cache/option-cache'
import { __test__clearCoursesCache, CoursesService } from './courses.service'
import { GradingService } from '../grading/grading.service'
import { ScheduleService } from '../schedule/schedule.service'

const mocks = vi.hoisted(() => ({
  prisma: {
    grade: { findMany: vi.fn(), findFirst: vi.fn(), create: vi.fn(), update: vi.fn(), upsert: vi.fn() },
    section: { findMany: vi.fn(), findFirst: vi.fn(), upsert: vi.fn() },
    sectionSubject: { findMany: vi.fn(), upsert: vi.fn() },
    enrollment: { groupBy: vi.fn() },
    courseTeam: { groupBy: vi.fn() },
    evaluationActivity: { groupBy: vi.fn() },
    attendanceClass: { findMany: vi.fn() },
    gradesRecord: { groupBy: vi.fn() },
    planningEntry: { findMany: vi.fn() },
    subject: { findMany: vi.fn(), upsert: vi.fn() },
    drAcademicLevel: { findMany: vi.fn() },
    drAcademicCycle: { findMany: vi.fn() },
    drModality: { findMany: vi.fn() },
    teacher: { findMany: vi.fn() },
    schoolYear: { findFirst: vi.fn(), create: vi.fn() },
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
      {
        id: 'ss-archived',
        sectionId: 'section-1',
        gradeId: 'grade-1',
        subjectId: 'subject-2',
        teacherId: null,
        status: 'INACTIVE',
      },
    ])
    mocks.prisma.enrollment.groupBy.mockResolvedValue([
      { sectionId: 'section-1', _count: { id: 12 } },
    ])
    mocks.prisma.courseTeam.groupBy.mockResolvedValue([
      { sectionSubjectId: 'ss-1', _count: { id: 2 } },
    ])
    mocks.prisma.evaluationActivity.groupBy.mockResolvedValue([
      { sectionSubjectId: 'ss-1', _count: { id: 3 } },
    ])
    mocks.prisma.attendanceClass.findMany.mockResolvedValue([
      { sectionSubjectId: 'ss-1', attendanceDate: new Date('2026-07-15T00:00:00.000Z') },
    ])
    mocks.prisma.gradesRecord.groupBy.mockResolvedValue([
      { sectionSubjectId: 'ss-1', _avg: { score: 88.5 } },
    ])
    mocks.prisma.planningEntry.findMany.mockResolvedValue([
      { sectionSubjectId: 'ss-1', plannedDate: new Date('2026-07-20T00:00:00.000Z'), createdAt: new Date('2026-07-10T00:00:00.000Z'), title: 'Sistema solar' },
    ])
    mocks.prisma.subject.findMany.mockResolvedValue([
      { id: 'subject-1', code: 'MAT', name: 'Matemática', description: null, credits: null },
      { id: 'subject-2', code: 'ART', name: 'Educación Artística', description: null, credits: null },
    ])
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
          teamCount: 2,
          assignments: [
            {
              id: 'ss-1',
              subjectName: 'Matemática',
              teacherName: 'Ana Pérez',
              teamCount: 2,
              activityCount: 3,
              averageScore: 88.5,
              lastPlanningTitle: 'Sistema solar',
              status: 'active',
            },
            {
              id: 'ss-archived',
              subjectName: 'Educación Artística',
              status: 'inactive',
            },
          ],
        },
      ],
    })
    expect(mocks.prisma.sectionSubject.findMany).toHaveBeenCalledWith({
      where: { schoolId: 'school-1', schoolYearId: 'year-1' },
    })
  })

  it('reloads course data on sequential requests', async () => {
    const service = new CoursesService()
    mocks.prisma.grade.upsert.mockResolvedValue({ id: 'grade-2', name: '2do', status: 'ACTIVE' })

    await service.getCourseData('school-1')
    await service.getCourseData('school-1')
    expect(mocks.prisma.grade.findMany).toHaveBeenCalledTimes(2)

    await service.createGrade('school-1', { name: '2do' })
    await service.getCourseData('school-1')

    expect(mocks.prisma.grade.findMany).toHaveBeenCalledTimes(3)
  })

  it('invalidates grading and schedule options after a course mutation', async () => {
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
    mocks.prisma.subject.findMany.mockResolvedValue([
      { id: 'subject-1', name: 'Matemática', status: 'ACTIVE' },
    ])
    mocks.prisma.subject.upsert.mockResolvedValue({
      id: 'subject-2',
      name: 'Ciencias',
      code: 'CIE',
      status: 'ACTIVE',
    })
    const grading = new GradingService()
    const schedule = new ScheduleService()

    await grading.getSectionSubjects('school-1')
    await schedule.getSubjects('school-1')
    await grading.getSectionSubjects('school-1')
    await schedule.getSubjects('school-1')
    expect(mocks.prisma.sectionSubject.findMany).toHaveBeenCalledTimes(2)
    expect(mocks.prisma.subject.findMany).toHaveBeenCalledTimes(2)

    await new CoursesService().createSubject('school-1', {
      name: 'Ciencias',
      code: 'CIE',
    })
    await grading.getSectionSubjects('school-1')
    await schedule.getSubjects('school-1')

    expect(mocks.prisma.sectionSubject.findMany).toHaveBeenCalledTimes(3)
    expect(mocks.prisma.subject.findMany).toHaveBeenCalledTimes(3)
  })

  it('invalidates dependent options when course data creates the default school year', async () => {
    const enrollmentLoader = vi.fn().mockResolvedValue('enrollments-without-year')
    const gradingLoader = vi.fn().mockResolvedValue('periods-without-year')
    const attendanceLoader = vi.fn().mockResolvedValue('current-period-without-year')
    const dependentOptions = [
      [optionCacheKeys.students.enrollmentCourses('school-1'), enrollmentLoader],
      [optionCacheKeys.grading.academicPeriods('school-1'), gradingLoader],
      [optionCacheKeys.attendance.currentPeriod('school-1'), attendanceLoader],
    ] as const
    await Promise.all(dependentOptions.map(([key, loader]) => optionCache.withCache(key, loader)))
    mocks.prisma.schoolYear.findFirst.mockResolvedValue(null)
    mocks.prisma.schoolYear.create.mockResolvedValue({ id: 'year-default', name: '2026-2027' })
    const service = new CoursesService()

    await service.getCourseData('school-1')
    await service.getCourseData('school-1')
    await Promise.all(dependentOptions.map(([key, loader]) => optionCache.withCache(key, loader)))

    for (const [, loader] of dependentOptions) {
      expect(loader).toHaveBeenCalledTimes(2)
    }
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
