import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AttendanceService } from './attendance.service'

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
})
