import { useCallback, useEffect, useState } from 'react'

import { deleteActivity, getActivities, saveActivity } from '@/modules/activities/services/activitiesService'
import type { Activity, SaveActivityInput } from '@/modules/activities/types'

export function useActivities(filters: { sectionSubjectId?: string; academicPeriodId?: string } = {}) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(Boolean(filters.sectionSubjectId && filters.academicPeriodId))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    if (!filters.sectionSubjectId || !filters.academicPeriodId) {
      setActivities([])
      setLoading(false)
      return []
    }
    setLoading(true)
    setError(null)
    try {
      const result = await getActivities(filters)
      setActivities(result)
      return result
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No se pudieron cargar las actividades.')
      throw reason
    } finally {
      setLoading(false)
    }
  }, [filters.academicPeriodId, filters.sectionSubjectId])

  useEffect(() => { void reload().catch(() => undefined) }, [reload])

  async function persist(input: SaveActivityInput) {
    setSaving(true)
    setError(null)
    try {
      const saved = await saveActivity(input)
      setActivities((current) => input.id
        ? current.map((activity) => activity.id === saved.id ? saved : activity)
        : [...current, saved])
      return saved
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No se pudo guardar la actividad.')
      throw reason
    } finally {
      setSaving(false)
    }
  }

  async function remove(activityId: string) {
    setSaving(true)
    setError(null)
    try {
      await deleteActivity(activityId)
      setActivities((current) => current.filter((activity) => activity.id !== activityId))
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No se pudo eliminar la actividad.')
      throw reason
    } finally {
      setSaving(false)
    }
  }

  return { activities, loading, saving, error, reload, saveActivity: persist, deleteActivity: remove }
}
