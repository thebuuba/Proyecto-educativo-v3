import { BadRequestException } from '@nestjs/common'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DashboardService } from './dashboard.service'

const mocks = vi.hoisted(() => ({
  prisma: {
    dashboardTask: {
      create: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
  },
}))

vi.mock('@aula/database', () => ({
  prisma: mocks.prisma,
}))

describe('DashboardService task validation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rejects invalid dashboard task status before hitting the database', async () => {
    await expect(
      new DashboardService().createTask('school-1', 'user-1', {
        title: 'Revisar',
        status: 'done',
      }),
    ).rejects.toBeInstanceOf(BadRequestException)

    expect(mocks.prisma.dashboardTask.create).not.toHaveBeenCalled()
  })

  it('rejects invalid dashboard task priority before updating', async () => {
    mocks.prisma.dashboardTask.findFirst.mockResolvedValue({ id: 'task-1' })

    await expect(
      new DashboardService().updateTask('school-1', 'task-1', {
        priority: 'urgent',
      }),
    ).rejects.toBeInstanceOf(BadRequestException)

    expect(mocks.prisma.dashboardTask.update).not.toHaveBeenCalled()
  })
})
