import { useCallback, useEffect, useState } from 'react'

import {
  createPlanningEntry,
  deletePlanningEntry,
  getAcademicPeriods,
  getPlanningEntries,
  getTeacherSectionSubjects,
  updatePlanningEntry,
} from '@/modules/planning/services/planningService'
import type {
  AcademicPeriodSummary,
  CreatePlanningEntryInput,
  PlanningEntryWithDetails,
  PlanningFilters,
} from '@/modules/planning/types'
import { getCurrentSchoolYear } from '@/services/schoolYearService'

export function usePlanning() {
  const [periods, setPeriods] = useState<AcademicPeriodSummary[]>([])
  const [activePeriodId, setActivePeriodId] = useState<string | null>(null)
  const [entries, setEntries] = useState<PlanningEntryWithDetails[]>([])
  const [sectionSubjects, setSectionSubjects] = useState<
    { id: string; subjectName: string; sectionName: string; gradeName: string }[]
  >([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [schoolYearId, setSchoolYearId] = useState<string | null>(null)

  const fetchPeriods = useCallback(async (yearId: string) => {
    try {
      const data = await getAcademicPeriods(yearId)
      setPeriods(data)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar los períodos.',
      )
    }
  }, [])

  const fetchEntries = useCallback(
    async (filters: PlanningFilters) => {
      setLoading(true)
      setError(null)

      try {
        const data = await getPlanningEntries(filters)
        setEntries(data)
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'No se pudieron cargar las planificaciones.',
        )
        setEntries([])
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  const fetchSectionSubjects = useCallback(async () => {
    try {
      const data = await getTeacherSectionSubjects()
      setSectionSubjects(data)
    } catch (error) {
      console.error('Error al cargar secciones del docente:', error)
    }
  }, [])

  useEffect(() => {
    async function init() {
      const currentYear = await getCurrentSchoolYear()
      if (!currentYear) {
        setError('No hay un año escolar activo.')
        setLoading(false)
        return
      }

      setSchoolYearId(currentYear.id)
      await Promise.all([fetchPeriods(currentYear.id), fetchSectionSubjects()])
    }

    void init()
  }, [fetchPeriods, fetchSectionSubjects])

  useEffect(() => {
    if (periods.length > 0 && !activePeriodId) {
      setActivePeriodId(periods[0].id)
    }
    if (schoolYearId && periods.length === 0) {
      setLoading(false)
    }
  }, [periods, activePeriodId, schoolYearId])

  useEffect(() => {
    if (activePeriodId && schoolYearId) {
      void fetchEntries({ academicPeriodId: activePeriodId })
    }
  }, [activePeriodId, schoolYearId, fetchEntries])

  const addEntry = useCallback(
    async (input: CreatePlanningEntryInput) => {
      await createPlanningEntry(input)
      await fetchEntries({ academicPeriodId: input.academicPeriodId })
    },
    [fetchEntries],
  )

  const editEntry = useCallback(
    async (id: string, input: CreatePlanningEntryInput) => {
      await updatePlanningEntry(id, input)
      await fetchEntries({ academicPeriodId: input.academicPeriodId })
    },
    [fetchEntries],
  )

  const removeEntry = useCallback(
    async (id: string, periodId: string) => {
      await deletePlanningEntry(id)
      await fetchEntries({ academicPeriodId: periodId })
    },
    [fetchEntries],
  )

  const refreshPeriods = useCallback(async () => {
    if (schoolYearId) {
      await fetchPeriods(schoolYearId)
    }
  }, [schoolYearId, fetchPeriods])

  return {
    schoolYearId,
    periods,
    activePeriodId,
    setActivePeriodId,
    entries,
    sectionSubjects,
    loading,
    error,
    addEntry,
    editEntry,
    removeEntry,
    refreshPeriods,
  }
}
