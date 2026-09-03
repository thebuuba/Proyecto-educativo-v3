import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { AppUser } from '@/modules/auth/types/auth'
import type { DashboardData, DashboardInsights, DashboardTask } from '@/modules/dashboard/types/dashboard'
import { useDashboard } from './useDashboard'

const mocks = vi.hoisted(() => ({
  appUser: null as AppUser | null,
  getDashboardData: vi.fn(),
  getDashboardInsights: vi.fn(),
  createDashboardTask: vi.fn(),
  completeDashboardTask: vi.fn(),
}))

vi.mock('@/modules/auth/hooks/useAuth', () => ({
  useAuth: () => ({ appUser: mocks.appUser }),
}))

vi.mock('@/modules/dashboard/services/dashboardService', () => ({
  getDashboardData: mocks.getDashboardData,
  getDashboardInsights: mocks.getDashboardInsights,
  createDashboardTask: mocks.createDashboardTask,
  completeDashboardTask: mocks.completeDashboardTask,
}))

let userSequence = 0

function makeUser(suffix = String(++userSequence)): AppUser {
  return {
    id: `user-${suffix}`,
    authUserId: `auth-${suffix}`,
    schoolId: `school-${suffix}`,
    fullName: `Usuario ${suffix}`,
    email: `${suffix}@example.com`,
    phone: null,
    avatarUrl: null,
    lastLoginAt: null,
    status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  }
}

function makeTask(id: string): DashboardTask {
  return {
    id,
    title: `Tarea ${id}`,
    dueDate: null,
    status: 'pending',
    priority: 'normal',
  }
}

function makeDashboard(name: string, tasks: DashboardTask[] = []): DashboardData {
  return {
    view: 'teacher',
    context: {
      firstName: name,
      formattedDate: 'lunes, 13 de julio',
      schoolYearName: '2026-2027',
      periodName: 'P1',
    },
    nextClass: null,
    todayAgenda: [],
    weeklyAttendance: {
      average: null,
      trendPercent: null,
      activityCount: 0,
      days: [],
    },
    tasks,
    recentActivity: [],
    smartSuggestion: null,
    teacherAnalytics: null,
    setupProgress: {
      courseCount: 0,
      studentCount: 0,
      activeEnrollments: 0,
      scheduleEntryCount: 0,
      attendanceCount: 0,
      planningCount: 0,
    },
  }
}

function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((next) => {
    resolve = next
  })
  return { promise, resolve }
}

describe('useDashboard cache', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    mocks.getDashboardData.mockReset()
    mocks.getDashboardInsights.mockReset()
    mocks.getDashboardInsights.mockResolvedValue({ recentActivity: [], teacherAnalytics: null })
    mocks.createDashboardTask.mockReset()
    mocks.completeDashboardTask.mockReset()
    mocks.appUser = makeUser()
  })

  it('does not refetch on remount while the scoped cache is fresh', async () => {
    const dashboard = makeDashboard('Ada')
    mocks.getDashboardData.mockResolvedValue(dashboard)

    const first = renderHook(() => useDashboard())
    await waitFor(() => expect(first.result.current.loading).toBe(false))
    first.unmount()

    const second = renderHook(() => useDashboard())
    await waitFor(() => expect(second.result.current.loading).toBe(false))

    expect(second.result.current.data).toEqual(dashboard)
    expect(mocks.getDashboardData).toHaveBeenCalledTimes(1)
    second.unmount()
  })

  it('shows the main cards before secondary insights finish', async () => {
    const insights = deferred<DashboardInsights>()
    mocks.getDashboardData.mockResolvedValue(makeDashboard('Ada'))
    mocks.getDashboardInsights.mockReturnValue(insights.promise)

    const hook = renderHook(() => useDashboard())
    await waitFor(() => expect(hook.result.current.loading).toBe(false))
    expect(hook.result.current.data?.context.firstName).toBe('Ada')
    expect(hook.result.current.data?.teacherAnalytics).toBeNull()

    insights.resolve({
      recentActivity: [],
      teacherAnalytics: { average: 90, gradedRecords: 2, performanceByPeriod: [], performanceBySubject: [] },
    })
    await waitFor(() => expect(hook.result.current.data?.teacherAnalytics?.average).toBe(90))
    hook.unmount()
  })

  it('refetches after the TTL and when refresh is requested manually', async () => {
    const now = vi.spyOn(Date, 'now').mockReturnValue(1_000)
    mocks.getDashboardData
      .mockResolvedValueOnce(makeDashboard('Primero'))
      .mockResolvedValueOnce(makeDashboard('Vencido'))
      .mockResolvedValueOnce(makeDashboard('Manual'))

    const first = renderHook(() => useDashboard())
    await waitFor(() => expect(first.result.current.loading).toBe(false))
    first.unmount()

    now.mockReturnValue(61_001)
    const second = renderHook(() => useDashboard())
    await waitFor(() => expect(second.result.current.data?.context.firstName).toBe('Vencido'))

    await act(async () => {
      await second.result.current.refetch()
    })

    expect(second.result.current.data?.context.firstName).toBe('Manual')
    expect(mocks.getDashboardData).toHaveBeenCalledTimes(3)
    second.unmount()
  })

  it('does not reuse cache across users or schools', async () => {
    let resolveSecond!: (data: DashboardData) => void
    mocks.getDashboardData
      .mockResolvedValueOnce(makeDashboard('Colegio A'))
      .mockImplementationOnce(() => new Promise<DashboardData>((resolve) => {
        resolveSecond = resolve
      }))

    const hook = renderHook(() => useDashboard())
    await waitFor(() => expect(hook.result.current.loading).toBe(false))

    mocks.appUser = makeUser()
    hook.rerender()

    expect(hook.result.current.data).toBeNull()
    expect(hook.result.current.loading).toBe(true)
    await act(async () => {
      resolveSecond(makeDashboard('Colegio B'))
    })
    await waitFor(() => expect(hook.result.current.loading).toBe(false))

    expect(hook.result.current.data?.context.firstName).toBe('Colegio B')
    expect(mocks.getDashboardData).toHaveBeenCalledTimes(2)
    hook.unmount()
  })

  it('keeps cached tasks coherent after create and complete mutations', async () => {
    const oldTask = makeTask('old')
    const newTask = makeTask('new')
    mocks.getDashboardData.mockResolvedValue(makeDashboard('Ada', [oldTask]))
    mocks.createDashboardTask.mockResolvedValue(newTask)
    mocks.completeDashboardTask.mockResolvedValue(undefined)

    const first = renderHook(() => useDashboard())
    await waitFor(() => expect(first.result.current.loading).toBe(false))

    await act(async () => {
      await first.result.current.addTask({ title: newTask.title })
      await first.result.current.completeTask(oldTask.id)
    })
    expect(first.result.current.data?.tasks).toEqual([newTask])
    first.unmount()

    const second = renderHook(() => useDashboard())
    await waitFor(() => expect(second.result.current.loading).toBe(false))

    expect(second.result.current.data?.tasks).toEqual([newTask])
    expect(mocks.getDashboardData).toHaveBeenCalledTimes(1)
    second.unmount()
  })

  it('ignores task responses that arrive after the active user changes', async () => {
    const delayedTask = deferred<DashboardTask>()
    mocks.getDashboardData
      .mockResolvedValueOnce(makeDashboard('Colegio A'))
      .mockResolvedValueOnce(makeDashboard('Colegio B'))
    mocks.createDashboardTask.mockReturnValue(delayedTask.promise)

    const hook = renderHook(() => useDashboard())
    await waitFor(() => expect(hook.result.current.data?.context.firstName).toBe('Colegio A'))

    let pendingTask!: Promise<void>
    act(() => {
      pendingTask = hook.result.current.addTask({ title: 'Tarea del colegio A' })
    })

    mocks.appUser = makeUser()
    hook.rerender()
    await waitFor(() => expect(hook.result.current.data?.context.firstName).toBe('Colegio B'))
    expect(hook.result.current.actionLoading).toBe(false)

    delayedTask.resolve(makeTask('old-scope'))
    await act(async () => {
      await pendingTask
    })

    expect(hook.result.current.data?.tasks).toEqual([])
    expect(hook.result.current.actionLoading).toBe(false)
    hook.unmount()
  })
})
