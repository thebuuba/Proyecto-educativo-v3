import { useCallback, useEffect, useRef, useState } from 'react'

import { deleteActivity, getActivities, saveActivity } from '@/modules/activities/services/activitiesService'
import type { Activity, SaveActivityInput } from '@/modules/activities/types'

type ActivityFilters = { sectionSubjectId?: string; academicPeriodId?: string; scopeKey?: string }
const initialState = (key: string, loading: boolean) => ({ key, activities: [] as Activity[], loading, saving: false, loadError: null as string | null, mutationError: null as string | null })

export function useActivities({ sectionSubjectId, academicPeriodId, scopeKey }: ActivityFilters = {}) {
  const key = JSON.stringify([scopeKey, sectionSubjectId, academicPeriodId])
  const valid = Boolean(sectionSubjectId && academicPeriodId)
  const currentKey = useRef(key)
  currentKey.current = key
  const request = useRef(0)
  const pendingLoad = useRef<{ key: string; updates: Array<(activities: Activity[]) => Activity[]> } | null>(null)
  const mounted = useRef(true)
  const [state, setState] = useState(() => initialState(key, valid))
  const current = state.key === key ? state : initialState(key, valid)

  const reload = useCallback(async () => {
    const version = ++request.current
    pendingLoad.current = null
    const active = () => mounted.current && currentKey.current === key && request.current === version
    if (!sectionSubjectId || !academicPeriodId) {
      setState(initialState(key, false))
      return []
    }
    setState(previous => ({ ...(previous.key === key ? previous : initialState(key, true)), loading: true, loadError: null }))
    const updates: Array<(activities: Activity[]) => Activity[]> = []
    pendingLoad.current = { key, updates }
    try {
      const activities = await getActivities({ sectionSubjectId, academicPeriodId })
      const reconciled = updates.reduce((current, update) => update(current), activities)
      if (active()) setState(previous => ({ ...previous, activities: reconciled, loading: false }))
      return reconciled
    } catch (reason) {
      if (active()) setState(previous => ({ ...previous, loading: false, loadError: reason instanceof Error ? reason.message : 'No se pudieron cargar las actividades.' }))
      throw reason
    } finally {
      if (active()) pendingLoad.current = null
    }
  }, [academicPeriodId, key, sectionSubjectId])

  useEffect(() => {
    mounted.current = true
    void reload().catch(() => undefined)
    return () => { mounted.current = false; request.current += 1; pendingLoad.current = null }
  }, [reload])

  async function mutate<T>(operation: () => Promise<T>, update: (activities: Activity[], value: T) => Activity[]) {
    const active = () => mounted.current && currentKey.current === key
    setState(previous => ({ ...(previous.key === key ? previous : initialState(key, valid)), saving: true, mutationError: null }))
    try {
      const value = await operation()
      if (active()) {
        if (pendingLoad.current?.key === key) pendingLoad.current.updates.push(activities => update(activities, value))
        setState(previous => ({ ...previous, activities: update(previous.activities, value) }))
      }
      return value
    } catch (reason) {
      if (active()) setState(previous => ({ ...previous, mutationError: reason instanceof Error ? reason.message : 'No se pudo guardar el cambio de la actividad.' }))
      throw reason
    } finally {
      if (active()) setState(previous => ({ ...previous, saving: false }))
    }
  }

  const persist = (input: SaveActivityInput) => mutate(() => saveActivity(input), (activities, saved) =>
    activities.some(activity => activity.id === saved.id)
      ? activities.map(activity => activity.id === saved.id ? saved : activity)
      : [...activities, saved])
  const remove = (activityId: string) => mutate(() => deleteActivity(activityId), activities => activities.filter(activity => activity.id !== activityId))

  return { ...current, error: current.loadError, reload, saveActivity: persist, deleteActivity: remove }
}
