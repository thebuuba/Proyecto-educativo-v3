import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DashboardService } from './dashboard.service'

function deferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise
  })
  return { promise, resolve }
}

const mocks = vi.hoisted(() => ({
  prisma: {
    student: { count: vi.fn() },
    teacher: { count: vi.fn() },
    enrollment: { count: vi.fn() },
    grade: { count: vi.fn() },
    section: { count: vi.fn() },
    sectionSubject: { count: vi.fn() },
    scheduleEntry: { count: vi.fn() },
    attendanceDaily: { count: vi.fn() },
    attendanceClass: { count: vi.fn() },
    planningEntry: { count: vi.fn() },
    schoolYear: { findMany: vi.fn() },
    dashboardTask: {
      create: vi.fn(),
      findMany: vi.fn(),
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

  it('starts every stats count before waiting for any result', async () => {
    const countMocks = [
      mocks.prisma.student.count,
      mocks.prisma.teacher.count,
      mocks.prisma.enrollment.count,
      mocks.prisma.grade.count,
      mocks.prisma.section.count,
      mocks.prisma.sectionSubject.count,
      mocks.prisma.scheduleEntry.count,
      mocks.prisma.attendanceDaily.count,
      mocks.prisma.attendanceClass.count,
      mocks.prisma.planningEntry.count,
    ]
    const gates = countMocks.map(() => deferred<number>())
    countMocks.forEach((count, index) => count.mockReturnValue(gates[index].promise))

    const resultPromise = new DashboardService().getStats('school-1')
    await Promise.resolve()

    countMocks.forEach((count) => expect(count).toHaveBeenCalledTimes(1))
    gates.forEach((gate, index) => gate.resolve(index + 1))

    const result = await resultPromise
    expect(result).toEqual({
      studentCount: 1,
      teacherCount: 2,
      activeEnrollments: 3,
      courseCount: 6,
      scheduleEntryCount: 7,
      attendanceCount: 17,
      planningCount: 10,
    })
  })

  it('creates a task and delegates to prisma', async () => {
    const data = { title: 'Revisar asistencia', status: 'pending', priority: 'high' }
    mocks.prisma.dashboardTask.create.mockResolvedValue({ id: 'task-1', ...data })

    const result = await new DashboardService().createTask('school-1', 'user-1', data)

    expect(mocks.prisma.dashboardTask.create).toHaveBeenCalledWith({
      data: { schoolId: 'school-1', title: 'Revisar asistencia', status: 'pending', priority: 'high', createdBy: 'user-1', dueDate: null, assignedTo: null },
    })
    expect(result).toEqual({ id: 'task-1', ...data })
  })

  it('returns the complete dashboard workspace in one service call', async () => {
    mocks.prisma.schoolYear.findMany.mockResolvedValue([
      { id: 'year-old', isCurrent: false },
      { id: 'year-current', isCurrent: true },
    ])
    mocks.prisma.dashboardTask.findMany.mockResolvedValue([{ id: 'task-1' }])
    const counts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    ;[
      mocks.prisma.student.count,
      mocks.prisma.teacher.count,
      mocks.prisma.enrollment.count,
      mocks.prisma.grade.count,
      mocks.prisma.section.count,
      mocks.prisma.sectionSubject.count,
      mocks.prisma.scheduleEntry.count,
      mocks.prisma.attendanceDaily.count,
      mocks.prisma.attendanceClass.count,
      mocks.prisma.planningEntry.count,
    ].forEach((count, index) => count.mockResolvedValue(counts[index]))

    const result = await new DashboardService().getWorkspace('school-1')

    expect(result.currentSchoolYear).toEqual({ id: 'year-current', isCurrent: true })
    expect(result.tasks).toEqual([{ id: 'task-1' }])
    expect(result.setupProgress.studentCount).toBe(1)
  })

  it('updates a task and delegates to prisma', async () => {
    mocks.prisma.dashboardTask.findFirst.mockResolvedValue({ id: 'task-1', schoolId: 'school-1' })
    mocks.prisma.dashboardTask.update.mockResolvedValue({ id: 'task-1', status: 'completed' })

    const result = await new DashboardService().updateTask('school-1', 'task-1', { status: 'completed' })

    expect(mocks.prisma.dashboardTask.update).toHaveBeenCalledWith({
      where: { id: 'task-1' },
      data: { status: 'completed' },
    })
    expect(result).toEqual({ id: 'task-1', status: 'completed' })
  })

  it('throws when updating a non-existent task', async () => {
    mocks.prisma.dashboardTask.findFirst.mockResolvedValue(null)

    await expect(
      new DashboardService().updateTask('school-1', 'task-x', { title: 'Nope' }),
    ).rejects.toThrow('Task not found')
  })
})
