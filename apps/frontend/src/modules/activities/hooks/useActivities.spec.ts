import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { deleteActivity, getActivities, saveActivity } from '../services/activitiesService'
import type { Activity } from '../types'
import { useActivities } from './useActivities'

vi.mock('../services/activitiesService', () => ({ getActivities: vi.fn(), saveActivity: vi.fn(), deleteActivity: vi.fn() }))
const activity: Activity = { id: 'a1', name: 'Práctica', competencyBlockId: 'b1', maxScore: 10 }
const input = { ...activity, sectionSubjectId: 'ss1', academicPeriodId: 'p1' }

describe('useActivities recovery', () => {
  beforeEach(() => { vi.resetAllMocks(); vi.mocked(getActivities).mockResolvedValue([activity]) })

  it('keeps loaded data and separates save errors from load errors', async () => {
    const { result } = renderHook(() => useActivities({ sectionSubjectId: 'ss1', academicPeriodId: 'p1' }))
    await waitFor(() => expect(result.current.loading).toBe(false))
    vi.mocked(saveActivity).mockRejectedValue(new Error('Sin conexión'))
    await act(async () => { await result.current.saveActivity(input).catch(() => undefined) })
    expect(result.current.activities).toEqual([activity])
    expect(result.current.loadError).toBeNull()
    expect(result.current.mutationError).toBe('Sin conexión')
    expect(result.current.saving).toBe(false)
  })

  it('ignores a previous context response arriving after the current response', async () => {
    let completePrevious!: (value: Activity[]) => void
    vi.mocked(getActivities).mockImplementationOnce(() => new Promise(resolve => { completePrevious = resolve }))
    const { result, rerender } = renderHook(({ subject }) => useActivities({ sectionSubjectId: subject, academicPeriodId: 'p1' }), { initialProps: { subject: 'ss1' } })
    const current = { ...activity, id: 'current' }
    vi.mocked(getActivities).mockResolvedValue([current])
    rerender({ subject: 'ss2' })
    await waitFor(() => expect(result.current.activities).toEqual([current]))
    await act(async () => completePrevious([activity]))
    expect(result.current.activities).toEqual([current])
  })

  it('invalidates pending loads when the academic context disappears', async () => {
    let complete!: (value: Activity[]) => void
    vi.mocked(getActivities).mockImplementationOnce(() => new Promise(resolve => { complete = resolve }))
    const { result, rerender } = renderHook(({ subject }) => useActivities({ sectionSubjectId: subject, academicPeriodId: 'p1' }), { initialProps: { subject: 'ss1' } })
    rerender({ subject: '' })
    await act(async () => complete([activity]))
    expect(result.current.activities).toEqual([])
    expect(result.current.loading).toBe(false)
  })

  it('reconciles an early creation with the pending list instead of dropping existing activities', async () => {
    let complete!: (value: Activity[]) => void
    vi.mocked(getActivities).mockImplementationOnce(() => new Promise(resolve => { complete = resolve }))
    const created = { ...activity, id: 'created', name: 'Nueva' }
    vi.mocked(saveActivity).mockResolvedValue(created)
    const { result } = renderHook(() => useActivities({ sectionSubjectId: 'ss1', academicPeriodId: 'p1' }))
    await act(async () => { await result.current.saveActivity({ ...input, id: undefined }) })
    expect(result.current.activities).toEqual([created])
    expect(result.current.loading).toBe(true)
    await act(async () => complete([activity]))
    expect(result.current.activities).toEqual([activity, created])
    expect(result.current.loading).toBe(false)
    expect(result.current.loadError).toBeNull()
  })

  it('keeps successful deletion applied when an older pending list arrives', async () => {
    let complete!: (value: Activity[]) => void
    vi.mocked(getActivities).mockImplementationOnce(() => new Promise(resolve => { complete = resolve }))
    vi.mocked(deleteActivity).mockResolvedValue(undefined)
    const sibling = { ...activity, id: 'sibling' }
    const { result } = renderHook(() => useActivities({ sectionSubjectId: 'ss1', academicPeriodId: 'p1' }))
    await act(async () => { await result.current.deleteActivity(activity.id) })
    await act(async () => complete([activity, sibling]))
    expect(result.current.activities).toEqual([sibling])
    expect(result.current.loading).toBe(false)
  })
})
