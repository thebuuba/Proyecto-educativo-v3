/**
 * @file Hook de Horario
 *
 * Gestiona el estado del horario docente: bloques horarios,
 * entradas, filtros y datos auxiliares (secciones, docentes).
 */

import { useCallback, useEffect, useRef, useState } from 'react'

import { useAuth } from '@/modules/auth/hooks/useAuth'
import {
  createScheduleEntry as createScheduleEntryRecord,
  createTimeSlot as createTimeSlotRecord,
  deleteScheduleEntry as deleteScheduleEntryRecord,
  deleteTimeSlot as deleteTimeSlotRecord,
  getScheduleEntries,
  getScheduleWorkspace,
  getTimeSlots,
  updateScheduleEntry as updateScheduleEntryRecord,
  updateTimeSlot as updateTimeSlotRecord,
} from '@/modules/schedule/services/scheduleService'
import type {
  CreateScheduleEntryInput,
  CreateTimeSlotInput,
  ScheduleEntry,
  ScheduleFilters,
  SectionOption,
  SubjectOption,
  TeacherOption,
  TimeSlot,
  UpdateScheduleEntryInput,
  UpdateTimeSlotInput,
} from '@/modules/schedule/types'
import { createScopedTtlCache } from '@/utils/scopedTtlCache'

type ScheduleCacheData = {
  timeSlots: TimeSlot[]
  entries: ScheduleEntry[]
  sections: SectionOption[]
  teachers: TeacherOption[]
  subjects: SubjectOption[]
  schoolYearId: string | null
}

const scheduleCache = createScopedTtlCache<ScheduleCacheData>(60_000)

/** Hook principal para la gestión del horario */
export function useSchedule() {
  const { appUser } = useAuth()
  const cacheScope = appUser ? `${appUser.id}:${appUser.schoolId}` : null
  const cached = scheduleCache.read(cacheScope)
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(cached?.timeSlots ?? [])
  const [entries, setEntries] = useState<ScheduleEntry[]>(cached?.entries ?? [])
  const [loading, setLoading] = useState(!cached)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ScheduleFilters>({})
  const [schoolYearId, setSchoolYearId] = useState<string | null>(cached?.schoolYearId ?? null)

  const [sections, setSections] = useState<SectionOption[]>(cached?.sections ?? [])
  const [teachers, setTeachers] = useState<TeacherOption[]>(cached?.teachers ?? [])
  const [subjects, setSubjects] = useState<SubjectOption[]>(cached?.subjects ?? [])

  const filtersRef = useRef(filters)
  const schoolYearIdRef = useRef(schoolYearId)
  const initialLoadDone = useRef(false)

  useEffect(() => {
    filtersRef.current = filters
  }, [filters])

  useEffect(() => {
    schoolYearIdRef.current = schoolYearId
  }, [schoolYearId])

  /** Recarga los bloques horarios desde el servidor */
  const refetchTimeSlots = useCallback(async () => {
    setError(null)
    try {
      const data = await getTimeSlots()
      setTimeSlots(data)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar los bloques horarios.',
      )
    }
  }, [])

  /** Recarga las entradas del horario desde el servidor */
  const refetchEntries = useCallback(async () => {
    setError(null)
    try {
      const currentFilters = filtersRef.current
      const data = await getScheduleEntries({
        ...currentFilters,
        schoolYearId: currentFilters.schoolYearId ?? schoolYearIdRef.current ?? undefined,
      })
      setEntries(data)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar las entradas de horario.',
      )
    }
  }, [])

  /** Carga los datos iniciales: año escolar, bloques, secciones, docentes, asignaturas */
  const loadInitialData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const workspace = await getScheduleWorkspace()
      const yearId = workspace.currentSchoolYear?.id ?? null
      schoolYearIdRef.current = yearId
      setSchoolYearId(yearId)

      const slots = workspace.timeSlots
      const sects = workspace.sections
      const tchrs = workspace.teachers
      const subjs = workspace.subjects
      const entryData = workspace.entries

      setTimeSlots(slots)
      setSections(sects)
      setTeachers(tchrs)
      setSubjects(subjs)
      setEntries(entryData)
      scheduleCache.write(cacheScope, {
        timeSlots: slots,
        entries: entryData,
        sections: sects,
        teachers: tchrs,
        subjects: subjs,
        schoolYearId: yearId,
      })
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar los datos del horario.',
      )
    } finally {
      setLoading(false)
    }
  }, [cacheScope])

  useEffect(() => {
    const freshCache = scheduleCache.read(cacheScope)
    if (freshCache) {
      setTimeSlots(freshCache.timeSlots)
      setEntries(freshCache.entries)
      setSections(freshCache.sections)
      setTeachers(freshCache.teachers)
      setSubjects(freshCache.subjects)
      setSchoolYearId(freshCache.schoolYearId)
      setError(null)
      setLoading(false)
      return
    }
    void loadInitialData()
  }, [cacheScope, loadInitialData])

  /** Recarga todos los datos (bloques y entradas) */
  const refetchAll = useCallback(async () => {
    scheduleCache.clear(cacheScope)
    await refetchTimeSlots()
    await refetchEntries()
  }, [cacheScope, refetchTimeSlots, refetchEntries])

  /** Crea un nuevo bloque horario y refresca la lista */
  const createTimeSlot = useCallback(
    async (input: CreateTimeSlotInput) => {
      const record = await createTimeSlotRecord(input)
      scheduleCache.clear(cacheScope)
      await refetchTimeSlots()
      return record
    },
    [cacheScope, refetchTimeSlots],
  )

  /** Actualiza un bloque horario y refresca la lista */
  const updateTimeSlot = useCallback(
    async (id: string, input: UpdateTimeSlotInput) => {
      const record = await updateTimeSlotRecord(id, input)
      scheduleCache.clear(cacheScope)
      await refetchTimeSlots()
      return record
    },
    [cacheScope, refetchTimeSlots],
  )

  /** Elimina un bloque horario y refresca la lista */
  const removeTimeSlot = useCallback(
    async (id: string) => {
      await deleteTimeSlotRecord(id)
      scheduleCache.clear(cacheScope)
      await refetchTimeSlots()
    },
    [cacheScope, refetchTimeSlots],
  )

  /** Crea una nueva entrada en el horario y refresca */
  const createEntry = useCallback(
    async (input: CreateScheduleEntryInput) => {
      const record = await createScheduleEntryRecord(input)
      scheduleCache.clear(cacheScope)
      await refetchEntries()
      return record
    },
    [cacheScope, refetchEntries],
  )

  /** Actualiza una entrada de horario y refresca */
  const updateEntry = useCallback(
    async (id: string, input: UpdateScheduleEntryInput) => {
      const record = await updateScheduleEntryRecord(id, input)
      scheduleCache.clear(cacheScope)
      await refetchEntries()
      return record
    },
    [cacheScope, refetchEntries],
  )

  /** Elimina una entrada de horario y refresca */
  const removeEntry = useCallback(
    async (id: string) => {
      await deleteScheduleEntryRecord(id)
      scheduleCache.clear(cacheScope)
      await refetchEntries()
    },
    [cacheScope, refetchEntries],
  )

  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true
      return
    }
    void refetchEntries()
  }, [filters, refetchEntries])

  /** Actualiza los filtros del horario */
  const updateFilters = useCallback(
    (newFilters: ScheduleFilters) => {
      setFilters(newFilters)
    },
    [],
  )

  return {
    timeSlots,
    entries,
    sections,
    teachers,
    subjects,
    schoolYearId,
    loading,
    error,
    filters,
    createTimeSlot,
    updateTimeSlot,
    removeTimeSlot,
    createEntry,
    updateEntry,
    removeEntry,
    refetchAll,
    updateFilters,
  }
}
