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
    attendanceDaily: { count: vi.fn(), findMany: vi.fn() },
    attendanceClass: { count: vi.fn(), findMany: vi.fn() },
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
    mocks.prisma.attendanceDaily.findMany.mockResolvedValue([])
    mocks.prisma.attendanceClass.findMany.mockResolvedValue([])
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
    expect(result.weeklyAttendance.activityCount).toBe(0)
  })

  it('accepts a valid DeepSeek dashboard suggestion', async () => {
    const service = new DashboardService({ get: vi.fn((key: string) => key === 'DEEPSEEK_API_KEY' ? 'test-key' : 'test-model') } as never)
    const progress = { studentCount: 1, teacherCount: 1, activeEnrollments: 1, courseCount: 1, scheduleEntryCount: 1, attendanceCount: 1, planningCount: 1 }
    const attendance = { average: 75, trendPercent: -5, activityCount: 4, days: [] }
    mocks.prisma.schoolYear.findMany.mockResolvedValue([])
    vi.spyOn(service, 'getTasks').mockResolvedValue([])
    vi.spyOn(service, 'getStats').mockResolvedValue(progress)
    vi.spyOn(service, 'getWeeklyAttendance').mockResolvedValue(attendance)
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: JSON.stringify({ title: 'Revisa la asistencia.', description: 'El promedio semanal bajó.', actionLabel: 'Revisar', path: '/asistencia' }) } }] }),
    }))

    const result = await service.getWorkspace('school-1')

    expect(result.smartSuggestion?.path).toBe('/asistencia')
    vi.unstubAllGlobals()
  })

  it('calculates weekly attendance and compares it with the previous week', async () => {
    mocks.prisma.attendanceDaily.findMany.mockResolvedValue([
      { attendanceDate: new Date('2026-07-06T00:00:00.000Z'), status: 'PRESENT' },
      { attendanceDate: new Date('2026-07-06T00:00:00.000Z'), status: 'ABSENT' },
      { attendanceDate: new Date('2026-07-13T00:00:00.000Z'), status: 'PRESENT' },
      { attendanceDate: new Date('2026-07-13T00:00:00.000Z'), status: 'ABSENT' },
    ])
    mocks.prisma.attendanceClass.findMany.mockResolvedValue([
      { attendanceDate: new Date('2026-07-14T00:00:00.000Z'), status: 'PRESENT' },
    ])

    const result = await new DashboardService().getWeeklyAttendance(
      'school-1',
      new Date('2026-07-14T12:00:00.000Z'),
    )

    expect(result).toEqual({
      average: 67,
      trendPercent: 17,
      activityCount: 3,
      days: [
        { label: 'LUN', value: 50, isToday: false },
        { label: 'MAR', value: 100, isToday: true },
        { label: 'MIE', value: null, isToday: false },
        { label: 'JUE', value: null, isToday: false },
        { label: 'VIE', value: null, isToday: false },
      ],
    })
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
