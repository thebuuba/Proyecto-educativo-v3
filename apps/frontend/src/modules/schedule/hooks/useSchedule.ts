/**
 * @file Hook de Horario
 *
 * Gestiona el estado del horario docente: bloques horarios,
 * entradas, filtros y datos auxiliares (secciones, docentes).
 */

import { useCallback, useEffect, useRef, useState } from 'react'

import { getCurrentSchoolYear } from '@/services/schoolYearService'
import {
  createScheduleEntry as createScheduleEntryRecord,
  createTimeSlot as createTimeSlotRecord,
  deleteScheduleEntry as deleteScheduleEntryRecord,
  deleteTimeSlot as deleteTimeSlotRecord,
  getScheduleEntries,
  getSections,
  getSubjects,
  getTeachers,
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

/** Hook principal para la gestión del horario */
export function useSchedule() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [entries, setEntries] = useState<ScheduleEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ScheduleFilters>({})
  const [schoolYearId, setSchoolYearId] = useState<string | null>(null)

  const [sections, setSections] = useState<SectionOption[]>([])
  const [teachers, setTeachers] = useState<TeacherOption[]>([])
  const [subjects, setSubjects] = useState<SubjectOption[]>([])

  const filtersRef = useRef(filters)
  const initialLoadDone = useRef(false)

  useEffect(() => {
    filtersRef.current = filters
  }, [filters])

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
        schoolYearId: currentFilters.schoolYearId ?? schoolYearId ?? undefined,
      })
      setEntries(data)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar las entradas de horario.',
      )
    }
  }, [schoolYearId])

  /** Carga los datos iniciales: año escolar, bloques, secciones, docentes, asignaturas */
  const loadInitialData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const currentYear = await getCurrentSchoolYear()
      const yearId = currentYear?.id ?? null
      setSchoolYearId(yearId)

      const slots = await getTimeSlots()
      const sects = await getSections()
      const tchrs = await getTeachers()
      const subjs = await getSubjects()

      setTimeSlots(slots)
      setSections(sects)
      setTeachers(tchrs)
      setSubjects(subjs)

      const entryData = await getScheduleEntries({ schoolYearId: yearId ?? undefined })
      setEntries(entryData)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar los datos del horario.',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadInitialData()
  }, [loadInitialData])

  /** Recarga todos los datos (bloques y entradas) */
  const refetchAll = useCallback(async () => {
    await refetchTimeSlots()
    await refetchEntries()
  }, [refetchTimeSlots, refetchEntries])

  /** Crea un nuevo bloque horario y refresca la lista */
  const createTimeSlot = useCallback(
    async (input: CreateTimeSlotInput) => {
      const record = await createTimeSlotRecord(input)
      await refetchTimeSlots()
      return record
    },
    [refetchTimeSlots],
  )

  /** Actualiza un bloque horario y refresca la lista */
  const updateTimeSlot = useCallback(
    async (id: string, input: UpdateTimeSlotInput) => {
      const record = await updateTimeSlotRecord(id, input)
      await refetchTimeSlots()
      return record
    },
    [refetchTimeSlots],
  )

  /** Elimina un bloque horario y refresca la lista */
  const removeTimeSlot = useCallback(
    async (id: string) => {
      await deleteTimeSlotRecord(id)
      await refetchTimeSlots()
    },
    [refetchTimeSlots],
  )

  /** Crea una nueva entrada en el horario y refresca */
  const createEntry = useCallback(
    async (input: CreateScheduleEntryInput) => {
      const record = await createScheduleEntryRecord(input)
      await refetchEntries()
      return record
    },
    [refetchEntries],
  )

  /** Actualiza una entrada de horario y refresca */
  const updateEntry = useCallback(
    async (id: string, input: UpdateScheduleEntryInput) => {
      const record = await updateScheduleEntryRecord(id, input)
      await refetchEntries()
      return record
    },
    [refetchEntries],
  )

  /** Elimina una entrada de horario y refresca */
  const removeEntry = useCallback(
    async (id: string) => {
      await deleteScheduleEntryRecord(id)
      await refetchEntries()
    },
    [refetchEntries],
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
