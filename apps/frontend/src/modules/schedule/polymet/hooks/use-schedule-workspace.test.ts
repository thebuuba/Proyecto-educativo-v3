import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useScheduleWorkspace } from './use-schedule-workspace'
import type { ScheduleDataSource } from '../lib/schedule-data-source'
import type { ScheduleWorkspace } from '../lib/schedule-types'
const workspace: ScheduleWorkspace = { currentSchoolYear: null, entries: [], timeSlots: [], sections: [], teachers: [], subjects: [] }
function deferred<T>() { let resolve!: (value: T) => void; const promise = new Promise<T>(done => { resolve = done }); return { promise, resolve } }
function source(): ScheduleDataSource { return { getWorkspace: vi.fn().mockResolvedValue(workspace), getAssignableClasses: vi.fn().mockResolvedValue([]), saveStructure: vi.fn().mockResolvedValue({ saved: true }), deleteStructure: vi.fn(), createEntry: vi.fn(), updateEntry: vi.fn(), deleteEntry: vi.fn() } }
describe('schedule workspace session', () => {
  it('keeps the loaded schedule and rejects writes while the browser is offline', async () => {
    const dataSource = source()
    const { result } = renderHook(() => useScheduleWorkspace(dataSource))
    await waitFor(() => expect(result.current.status).toBe('ready'))
    const online = vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false)
    try {
      let outcome
      await act(async () => { outcome = await result.current.saveStructure({ journeys: [], blocks: [] }) })
      expect(outcome).toMatchObject({ ok: false, message: expect.stringMatching(/conexión/i) })
      expect(dataSource.saveStructure).not.toHaveBeenCalled()
      expect(result.current.workspace).toEqual(workspace)
      expect(result.current.pending.size).toBe(0)
    } finally { online.mockRestore() }
  })
  it('ignores late workspace and assignable responses from a previous source', async () => {
    const old = source(), current = source()
    const late = deferred<ScheduleWorkspace>(), lateOptions = deferred<Awaited<ReturnType<ScheduleDataSource['getAssignableClasses']>>>()
    vi.mocked(old.getWorkspace).mockReturnValue(late.promise)
    vi.mocked(old.getAssignableClasses).mockReturnValue(lateOptions.promise)
    const { result, rerender } = renderHook(({ dataSource }) => useScheduleWorkspace(dataSource), { initialProps: { dataSource: old } })
    rerender({ dataSource: current })
    await waitFor(() => expect(result.current.status).toBe('ready'))
    await act(async () => { late.resolve({ ...workspace, sections: [{ id: 'private', name: 'A', gradeName: '1', academicLevelName: 'Old school' }] }); lateOptions.resolve([{ sectionSubjectId: 'old', sectionId: 'old', subjectName: 'Old', gradeName: '1', sectionName: 'A', academicLevelName: 'Old' }]) })
    expect(result.current.workspace).toEqual(workspace)
    expect(result.current.assignables).toEqual([])
  })
  it('keeps data and reports failed refresh after a mutation instead of claiming success', async () => {
    const dataSource = source()
    const { result } = renderHook(() => useScheduleWorkspace(dataSource))
    await waitFor(() => expect(result.current.status).toBe('ready'))
    vi.mocked(dataSource.getWorkspace).mockRejectedValueOnce(new Error('Offline'))
    let outcome
    await act(async () => { outcome = await result.current.saveStructure({ journeys: [], blocks: [] }) })
    expect(outcome).toMatchObject({ ok: false })
    expect(result.current.status).toBe('error')
    expect(result.current.workspace).toEqual(workspace)
    expect(result.current.refreshing).toBe(false)
  })
  it('does not refresh the old source when its mutation completes after session change', async () => {
    const old = source(), current = source(), mutation = deferred<{ saved: true }>()
    vi.mocked(old.saveStructure).mockReturnValue(mutation.promise)
    const { result, rerender } = renderHook(({ dataSource }) => useScheduleWorkspace(dataSource), { initialProps: { dataSource: old } })
    await waitFor(() => expect(result.current.status).toBe('ready'))
    let pending: ReturnType<typeof result.current.saveStructure>
    act(() => { pending = result.current.saveStructure({ journeys: [], blocks: [] }) })
    rerender({ dataSource: current })
    await waitFor(() => expect(result.current.status).toBe('ready'))
    await act(async () => { mutation.resolve({ saved: true }); await pending })
    expect(old.getWorkspace).toHaveBeenCalledTimes(1)
    expect(result.current.pending.size).toBe(0)
  })
})
