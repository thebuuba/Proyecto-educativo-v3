import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SettingsService } from './settings.service'

const mocks = vi.hoisted(() => ({
  prisma: {
    school: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    schoolYear: {
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

describe('SettingsService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('updates the real school profile fields', async () => {
    mocks.prisma.school.findUnique.mockResolvedValue({ id: 'school-1' })
    mocks.prisma.school.update.mockResolvedValue({ id: 'school-1' })

    await new SettingsService().updateSchool('school-1', {
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
  })

  it('sets the current school year in one transaction', async () => {
    mocks.prisma.schoolYear.findFirst.mockResolvedValue({ id: 'year-1' })
    mocks.prisma.schoolYear.updateMany.mockReturnValue('clear-current')
    mocks.prisma.schoolYear.update.mockReturnValue('set-current')
    mocks.prisma.$transaction.mockResolvedValue([{ count: 1 }, { id: 'year-1' }])

    await new SettingsService().setCurrentSchoolYear('school-1', 'year-1')

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
})
