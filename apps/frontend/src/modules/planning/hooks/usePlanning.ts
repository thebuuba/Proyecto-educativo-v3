/**
 * @file Hook de Planificación
 *
 * Gestiona el estado y las operaciones del módulo de planificación
 * curricular: períodos, entradas, secciones-asignaturas y competencias.
 */

import { useCallback, useEffect, useRef, useState } from 'react'

import { useAuth } from '@/modules/auth/hooks/useAuth'
import {
  archivePlanningEntry,
  createPlanningEntry,
  deletePlanningEntry,
  duplicatePlanningEntry,
  generateAndCreatePlanningEntry,
  getAcademicPeriods,
  getCompetencies,
  getPlanningEntries,
  getTeacherSectionSubjects,
  updatePlanningEntry,
} from '@/modules/planning/services/planningService'
import type {
  AcademicPeriodSummary,
  CompetencyOption,
  CreatePlanningEntryInput,
  PlanningEntryWithDetails,
  PlanningFilters,
} from '@/modules/planning/types'
import { getCurrentSchoolYear } from '@/services/schoolYearService'
import { createScopedTtlCache } from '@/utils/scopedTtlCache'

type PlanningCacheData = {
  periods: AcademicPeriodSummary[]
  activePeriodId: string | null
  entries: PlanningEntryWithDetails[]
  sectionSubjects: { id: string; subjectName: string; sectionName: string; gradeName: string }[]
  competencies: CompetencyOption[]
  schoolYearId: string
}

const planningCache = createScopedTtlCache<PlanningCacheData>(60_000)

/** Hook principal para la gestión de planificaciones */
export function usePlanning() {
  const { appUser } = useAuth()
  const cacheScope = appUser ? `${appUser.id}:${appUser.schoolId}` : null
  const cached = planningCache.read(cacheScope)
  const [periods, setPeriods] = useState<AcademicPeriodSummary[]>(cached?.periods ?? [])
  const [activePeriodId, setActivePeriodId] = useState<string | null>(cached?.activePeriodId ?? null)
  const [entries, setEntries] = useState<PlanningEntryWithDetails[]>(cached?.entries ?? [])
  const [sectionSubjects, setSectionSubjects] = useState<
    { id: string; subjectName: string; sectionName: string; gradeName: string }[]
  >(cached?.sectionSubjects ?? [])
  const [competencies, setCompetencies] = useState<CompetencyOption[]>(cached?.competencies ?? [])
  const [loading, setLoading] = useState(!cached)
  const [error, setError] = useState<string | null>(null)
  const [schoolYearId, setSchoolYearId] = useState<string | null>(cached?.schoolYearId ?? null)
  const loadedContextRef = useRef(
    cached ? `${cached.schoolYearId}:${cached.activePeriodId ?? ''}` : null,
  )

  /** Carga los períodos académicos de un año escolar */
  const fetchPeriods = useCallback(async (yearId: string) => {
    try {
      const data = await getAcademicPeriods(yearId)
      setPeriods(data)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar los trimestres.',
      )
    }
  }, [])

  /** Carga las planificaciones según los filtros */
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

  useEffect(() => {
    async function init() {
      const freshCache = planningCache.read(cacheScope)
      if (freshCache) {
        setPeriods(freshCache.periods)
        setActivePeriodId(freshCache.activePeriodId)
        setEntries(freshCache.entries)
        setSectionSubjects(freshCache.sectionSubjects)
        setCompetencies(freshCache.competencies)
        setSchoolYearId(freshCache.schoolYearId)
        loadedContextRef.current = `${freshCache.schoolYearId}:${freshCache.activePeriodId ?? ''}`
        setError(null)
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      try {
        const currentYear = await getCurrentSchoolYear()
        if (!currentYear) throw new Error('No hay un año escolar activo.')

        const [periodData, sectionSubjectData, competencyData] = await Promise.all([
          getAcademicPeriods(currentYear.id),
          getTeacherSectionSubjects(),
          getCompetencies(),
        ])
        const periodId = periodData[0]?.id ?? null
        const entryData = periodId ? await getPlanningEntries({}) : []

        loadedContextRef.current = `${currentYear.id}:${periodId ?? ''}`
        setSchoolYearId(currentYear.id)
        setPeriods(periodData)
        setActivePeriodId(periodId)
        setEntries(entryData)
        setSectionSubjects(sectionSubjectData)
        setCompetencies(competencyData)
        planningCache.write(cacheScope, {
          periods: periodData,
          activePeriodId: periodId,
          entries: entryData,
          sectionSubjects: sectionSubjectData,
          competencies: competencyData,
          schoolYearId: currentYear.id,
        })
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'No se pudieron cargar las planificaciones.',
        )
      } finally {
        setLoading(false)
      }
    }

    void init()
  }, [cacheScope])

  useEffect(() => {
    if (activePeriodId && schoolYearId) {
      const context = `${schoolYearId}:${activePeriodId}`
      if (loadedContextRef.current === context) return
      loadedContextRef.current = context
      planningCache.clear(cacheScope)
      void fetchEntries({})
    }
  }, [activePeriodId, schoolYearId, cacheScope, fetchEntries])

  /** Crea una nueva planificación y refresca la lista */
  const addEntry = useCallback(
    async (input: CreatePlanningEntryInput) => {
      await createPlanningEntry(input)
      planningCache.clear(cacheScope)
      await fetchEntries({})
    },
    [cacheScope, fetchEntries],
  )

  /** Genera una planificación con IA, la guarda y refresca la lista */
  const generateEntry = useCallback(
    async (input: CreatePlanningEntryInput & {
      subjectName?: string
      sectionName?: string
      gradeName?: string
      fundamentalCompetenceName?: string
    }) => {
      await generateAndCreatePlanningEntry(input)
      planningCache.clear(cacheScope)
      await fetchEntries({})
    },
    [cacheScope, fetchEntries],
  )

  /** Actualiza una planificación existente y refresca la lista */
  const editEntry = useCallback(
    async (id: string, input: CreatePlanningEntryInput) => {
      await updatePlanningEntry(id, input)
      planningCache.clear(cacheScope)
      await fetchEntries({})
    },
    [cacheScope, fetchEntries],
  )

  /** Elimina una planificación y refresca la lista */
  const removeEntry = useCallback(
    async (id: string) => {
      await deletePlanningEntry(id)
      planningCache.clear(cacheScope)
      await fetchEntries({})
    },
    [cacheScope, fetchEntries],
  )

  const duplicateEntry = useCallback(
    async (id: string) => {
      await duplicatePlanningEntry(id)
      planningCache.clear(cacheScope)
      await fetchEntries({})
    },
    [cacheScope, fetchEntries],
  )

  const archiveEntry = useCallback(
    async (id: string) => {
      await archivePlanningEntry(id)
      planningCache.clear(cacheScope)
      await fetchEntries({})
    },
    [cacheScope, fetchEntries],
  )

  const refreshPeriods = useCallback(async () => {
    if (schoolYearId) {
      planningCache.clear(cacheScope)
      await fetchPeriods(schoolYearId)
    }
  }, [cacheScope, schoolYearId, fetchPeriods])

  return {
    schoolYearId,
    periods,
    activePeriodId,
    setActivePeriodId,
    entries,
    sectionSubjects,
    competencies,
    loading,
    error,
    addEntry,
    generateEntry,
    editEntry,
    removeEntry,
    duplicateEntry,
    archiveEntry,
    refreshPeriods,
  }
}
