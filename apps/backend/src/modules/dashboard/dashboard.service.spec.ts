import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DashboardService } from './dashboard.service'

function mockCache() {
  return { get: vi.fn(), set: vi.fn(), del: vi.fn() }
}

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

describe('DashboardService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates a task and delegates to prisma', async () => {
    const cache = mockCache()
    const data = { title: 'Revisar asistencia', status: 'pending', priority: 'high' }
    mocks.prisma.dashboardTask.create.mockResolvedValue({ id: 'task-1', ...data })

    const result = await new DashboardService(cache).createTask('school-1', 'user-1', data)

    expect(mocks.prisma.dashboardTask.create).toHaveBeenCalledWith({
      data: { schoolId: 'school-1', title: 'Revisar asistencia', status: 'pending', priority: 'high', createdBy: 'user-1', dueDate: null, assignedTo: null },
    })
    expect(cache.del).toHaveBeenCalledWith('dashboard:tasks:school-1')
    expect(result).toEqual({ id: 'task-1', ...data })
  })

  it('updates a task and delegates to prisma', async () => {
    const cache = mockCache()
    mocks.prisma.dashboardTask.findFirst.mockResolvedValue({ id: 'task-1', schoolId: 'school-1' })
    mocks.prisma.dashboardTask.update.mockResolvedValue({ id: 'task-1', status: 'completed' })

    const result = await new DashboardService(cache).updateTask('school-1', 'task-1', { status: 'completed' })

    expect(mocks.prisma.dashboardTask.update).toHaveBeenCalledWith({
      where: { id: 'task-1' },
      data: { status: 'completed' },
    })
    expect(cache.del).toHaveBeenCalledWith('dashboard:tasks:school-1')
    expect(result).toEqual({ id: 'task-1', status: 'completed' })
  })

  it('throws when updating a non-existent task', async () => {
    mocks.prisma.dashboardTask.findFirst.mockResolvedValue(null)

    await expect(
      new DashboardService(mockCache()).updateTask('school-1', 'task-x', { title: 'Nope' }),
    ).rejects.toThrow('Task not found')
  })
})
