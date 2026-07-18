import { beforeEach, describe, expect, it, vi } from 'vitest'
import { __test__clearAttendanceCache, AttendanceService } from './attendance.service'

const mocks = vi.hoisted(() => ({
  prisma: {
    academicPeriod: {
      findFirst: vi.fn(),
      createMany: vi.fn(),
    },
    schoolYear: {
      findFirst: vi.fn(),
    },
    attendanceClass: {
      findMany: vi.fn(),
    },
  },
}))

vi.mock('@aula/database', () => ({
  prisma: mocks.prisma,
}))

describe('AttendanceService.getCurrentPeriod', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    __test__clearAttendanceCache()
  })

  it('creates base periods when attendance needs a current period', async () => {
    mocks.prisma.academicPeriod.findFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: 'p1', sequence: 1 })
    mocks.prisma.schoolYear.findFirst.mockResolvedValue({
      id: 'year-1',
      startDate: new Date('2026-08-01T00:00:00.000Z'),
    })

    const result = await new AttendanceService().getCurrentPeriod('school-1')

    expect(mocks.prisma.academicPeriod.createMany).toHaveBeenCalled()
    expect(result).toEqual({ id: 'p1', sequence: 1 })
  })

  it('deduplicates current-period loads without sharing data between schools', async () => {
    mocks.prisma.academicPeriod.findFirst.mockImplementation(({ where }) =>
      Promise.resolve({ id: `period-${where.schoolId}`, sequence: 1 }),
    )
    const service = new AttendanceService()

    const [first, duplicate] = await Promise.all([
      service.getCurrentPeriod('school-1'),
      service.getCurrentPeriod('school-1'),
    ])
    const secondSchool = await service.getCurrentPeriod('school-2')

    expect(first).toEqual({ id: 'period-school-1', sequence: 1 })
    expect(duplicate).toEqual(first)
    expect(secondSchool).toEqual({ id: 'period-school-2', sequence: 1 })
    expect(mocks.prisma.academicPeriod.findFirst).toHaveBeenCalledTimes(2)
  })
})

describe('AttendanceService.findClassAttendanceRange', () => {
  beforeEach(() => vi.clearAllMocks())

  it('loads a whole month with one bounded database query', async () => {
    mocks.prisma.attendanceClass.findMany.mockResolvedValue([])

    await new AttendanceService().findClassAttendanceRange(
      'school-1',
      'subject-1',
      '2026-09-01',
      '2026-09-30',
    )

    expect(mocks.prisma.attendanceClass.findMany).toHaveBeenCalledTimes(1)
    expect(mocks.prisma.attendanceClass.findMany).toHaveBeenCalledWith({
      where: {
        schoolId: 'school-1',
        sectionSubjectId: 'subject-1',
        attendanceDate: {
          gte: new Date('2026-09-01T00:00:00.000Z'),
          lte: new Date('2026-09-30T00:00:00.000Z'),
        },
      },
      orderBy: { attendanceDate: 'asc' },
    })
  })

  it('rejects missing or oversized ranges', () => {
    const service = new AttendanceService()
    expect(() => service.findClassAttendanceRange('school-1', '', '2026-09-01', '2026-09-30')).toThrow()
    expect(() => service.findClassAttendanceRange('school-1', 'subject-1', '2026-01-01', '2026-03-01')).toThrow()
    expect(mocks.prisma.attendanceClass.findMany).not.toHaveBeenCalled()
  })
})
