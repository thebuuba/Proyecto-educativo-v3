import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GradingService } from './grading.service'

const mocks = vi.hoisted(() => ({
  prisma: {
    academicPeriod: {
      findMany: vi.fn(),
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
