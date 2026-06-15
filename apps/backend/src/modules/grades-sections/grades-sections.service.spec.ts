import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GradesSectionsService } from './grades-sections.service'

const mocks = vi.hoisted(() => ({
  prisma: {
    grade: { findMany: vi.fn() },
    section: { findMany: vi.fn() },
    sectionSubject: { findMany: vi.fn() },
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
}))

describe('GradesSectionsService.getCourseData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
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
    mocks.prisma.subject.findMany.mockResolvedValue([{ id: 'subject-1', code: 'MAT', name: 'Matemática', description: null, credits: null }])
    mocks.prisma.drAcademicLevel.findMany.mockResolvedValue([{ id: 'level-1', code: 'PRI', name: 'Primaria', sequence: 1 }])
    mocks.prisma.drAcademicCycle.findMany.mockResolvedValue([{ id: 'cycle-1', levelId: 'level-1', code: 'C1', name: 'Primer ciclo', sequence: 1, gradeSequenceFrom: 1, gradeSequenceTo: 3 }])
    mocks.prisma.drModality.findMany.mockResolvedValue([{ id: 'mod-1', code: 'GEN', name: 'General', appliesFromGradeSequence: null, appliesToGradeSequence: null }])
    mocks.prisma.teacher.findMany.mockResolvedValue([{ id: 'teacher-1', firstName: 'Ana', lastName: 'Pérez', email: 'ana@test.local' }])
    mocks.prisma.schoolYear.findFirst.mockResolvedValue({ id: 'year-1', name: '2026-2027' })
  })

  it('returns the frontend course-data shape', async () => {
    const result = await new GradesSectionsService().getCourseData('school-1')

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
})
