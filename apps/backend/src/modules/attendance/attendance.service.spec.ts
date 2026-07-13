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
