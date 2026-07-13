import { beforeEach, describe, expect, it, vi } from 'vitest'
import { optionCache, optionCacheKeys } from '../../common/cache/option-cache'
import { SchoolAdministrationService } from './school-administration.service'

function mockCache() {
  return { get: vi.fn(), set: vi.fn(), del: vi.fn() }
}

const mocks = vi.hoisted(() => ({
  prisma: {
    school: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    schoolYear: {
      create: vi.fn(),
      findFirst: vi.fn(),
      updateMany: vi.fn(),
      update: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}))

vi.mock('@aula/database', () => ({
  prisma: mocks.prisma,
}))

describe('SchoolAdministrationService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    optionCache.clear()
  })

  it('updates the real school profile fields', async () => {
    const cache = mockCache()
    mocks.prisma.school.findUnique.mockResolvedValue({ id: 'school-1' })
    mocks.prisma.school.update.mockResolvedValue({ id: 'school-1' })

    await new SchoolAdministrationService(cache).updateSchool('school-1', {
      name: 'Centro',
      slug: 'centro',
      sector: 'public',
      centerCode: '12345',
      schoolShift: 'extended',
      primaryModality: 'academic',
      enabledSubsystems: ['regular'],
      officialExportsEnabled: false,
    })

    expect(mocks.prisma.school.update).toHaveBeenCalledWith({
      where: { id: 'school-1' },
      data: {
        name: 'Centro',
        slug: 'centro',
        sector: 'public',
        centerCode: '12345',
        schoolShift: 'extended',
        primaryModality: 'academic',
        enabledSubsystems: ['regular'],
        officialExportsEnabled: false,
      },
    })
    expect(cache.del).toHaveBeenCalledWith('school:school-1')
  })

  it('sets the current school year in one transaction', async () => {
    mocks.prisma.schoolYear.findFirst.mockResolvedValue({ id: 'year-1' })
    mocks.prisma.schoolYear.updateMany.mockReturnValue('clear-current')
    mocks.prisma.schoolYear.update.mockReturnValue('set-current')
    mocks.prisma.$transaction.mockResolvedValue([{ count: 1 }, { id: 'year-1' }])

    await new SchoolAdministrationService(mockCache()).setCurrentSchoolYear('school-1', 'year-1')

    expect(mocks.prisma.schoolYear.updateMany).toHaveBeenCalledWith({
        where: { schoolId: 'school-1', isCurrent: true },
        data: { isCurrent: false },
      })
    expect(mocks.prisma.schoolYear.update).toHaveBeenCalledWith({
        where: { id: 'year-1' },
        data: { isCurrent: true },
      })
    expect(mocks.prisma.$transaction).toHaveBeenCalledWith(['clear-current', 'set-current'])
  })

  it('invalidates options that depend on the school year after an update', async () => {
    const courseDataLoader = vi.fn().mockResolvedValue('course-data')
    const enrollmentCoursesLoader = vi.fn().mockResolvedValue('enrollment-courses')
    const gradingPeriodsLoader = vi.fn().mockResolvedValue('grading-periods')
    const attendancePeriodLoader = vi.fn().mockResolvedValue('attendance-period')
    const keysAndLoaders = [
      [optionCacheKeys.courses.courseData('school-1'), courseDataLoader],
      [optionCacheKeys.students.enrollmentCourses('school-1'), enrollmentCoursesLoader],
      [optionCacheKeys.grading.academicPeriods('school-1'), gradingPeriodsLoader],
      [optionCacheKeys.attendance.currentPeriod('school-1'), attendancePeriodLoader],
    ] as const
    await Promise.all(keysAndLoaders.map(([key, loader]) => optionCache.withCache(key, loader)))
    mocks.prisma.schoolYear.findFirst.mockResolvedValue({ id: 'year-1' })
    mocks.prisma.schoolYear.update.mockResolvedValue({ id: 'year-1', name: '2027-2028' })

    await new SchoolAdministrationService(mockCache()).updateSchoolYear(
      'school-1',
      'year-1',
      { name: '2027-2028' },
    )
    await Promise.all(keysAndLoaders.map(([key, loader]) => optionCache.withCache(key, loader)))

    for (const [, loader] of keysAndLoaders) {
      expect(loader).toHaveBeenCalledTimes(2)
    }
  })
})
