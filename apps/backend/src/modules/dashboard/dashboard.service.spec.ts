import { beforeEach, describe, expect, it, vi } from 'vitest'
import { buildTeacherAnalytics, calculateAttendanceRate, DashboardService, resolveDashboardView } from './dashboard.service'

function mockCache() {
  return { get: vi.fn(), set: vi.fn(), del: vi.fn() }
}

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
    dashboardTask: {
      create: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    appUser: { findFirst: vi.fn() },
  },
}))

vi.mock('@aula/database', () => ({
  prisma: mocks.prisma,
}))

describe('DashboardService', () => {
  const teacher = { id: 'user-1', email: 'teacher@example.com', schoolId: 'school-1', roles: ['teacher'] }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('starts every stats count before waiting for any result', async () => {
    const cache = mockCache()
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

    const resultPromise = new DashboardService(cache).getStats('school-1')
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
    expect(cache.set).toHaveBeenCalledWith('dashboard:stats:school-1', result, 30_000)
  })

  it('creates a task and delegates to prisma', async () => {
    const cache = mockCache()
    const data = { title: 'Revisar asistencia', status: 'pending', priority: 'high' }
    mocks.prisma.dashboardTask.create.mockResolvedValue({ id: 'task-1', ...data })

    const result = await new DashboardService(cache).createTask(teacher, data)

    expect(mocks.prisma.dashboardTask.create).toHaveBeenCalledWith({
      data: { schoolId: 'school-1', title: 'Revisar asistencia', status: 'pending', priority: 'high', createdBy: 'user-1', dueDate: null, assignedTo: 'user-1' },
    })
    expect(result).toEqual({ id: 'task-1', ...data })
  })

  it('updates a task and delegates to prisma', async () => {
    const cache = mockCache()
    mocks.prisma.dashboardTask.findFirst.mockResolvedValue({ id: 'task-1', schoolId: 'school-1' })
    mocks.prisma.dashboardTask.update.mockResolvedValue({ id: 'task-1', status: 'completed' })

    const result = await new DashboardService(cache).updateTask(teacher, 'task-1', { status: 'completed' })

    expect(mocks.prisma.dashboardTask.findFirst).toHaveBeenCalledWith({
      where: { id: 'task-1', schoolId: 'school-1', OR: [{ assignedTo: 'user-1' }, { createdBy: 'user-1' }] },
    })

    expect(mocks.prisma.dashboardTask.update).toHaveBeenCalledWith({
      where: { id: 'task-1' },
      data: { status: 'completed' },
    })
    expect(result).toEqual({ id: 'task-1', status: 'completed' })
  })

  it('throws when updating a non-existent task', async () => {
    mocks.prisma.dashboardTask.findFirst.mockResolvedValue(null)

    await expect(
      new DashboardService(mockCache()).updateTask(teacher, 'task-x', { title: 'Nope' }),
    ).rejects.toThrow('Task not found')
  })

  it('returns only pending tasks owned or created by the user', async () => {
    mocks.prisma.dashboardTask.findMany.mockResolvedValue([])

    await new DashboardService(mockCache()).getTasks(teacher)

    expect(mocks.prisma.dashboardTask.findMany).toHaveBeenCalledWith({
      where: { schoolId: 'school-1', status: 'pending', OR: [{ assignedTo: 'user-1' }, { createdBy: 'user-1' }] },
      orderBy: { createdAt: 'desc' },
      take: 8,
    })
  })

  it('calculates attendance without penalizing excused absences', () => {
    const date = new Date('2026-07-16T00:00:00.000Z')
    expect(calculateAttendanceRate([
      { attendanceDate: date, status: 'PRESENT' },
      { attendanceDate: date, status: 'LATE' },
      { attendanceDate: date, status: 'ABSENT' },
      { attendanceDate: date, status: 'EXCUSED' },
    ])).toBe(67)
    expect(resolveDashboardView(['student', 'admin'])).toBe('management')
  })

  it('groups teacher grades by period and subject', () => {
    const record = (score: number, period: string, sequence: number, subject: string) => ({
      score,
      maxScore: 100,
      academicPeriod: { name: period, sequence },
      sectionSubject: { subject: { name: subject } },
    })

    expect(buildTeacherAnalytics([
      record(80, 'P1', 1, 'Matemática'),
      record(100, 'P1', 1, 'Matemática'),
      record(70, 'P2', 2, 'Lengua Española'),
    ])).toEqual({
      average: 83,
      gradedRecords: 3,
      performanceByPeriod: [{ label: 'P1', value: 90 }, { label: 'P2', value: 70 }],
      performanceBySubject: [{ label: 'Matemática', value: 90 }, { label: 'Lengua Española', value: 70 }],
    })
  })
})
