import { useCallback, useEffect, useRef, useState } from 'react'

import {
  createScheduleEntry as createScheduleEntryRecord,
  createTimeSlot as createTimeSlotRecord,
  deleteScheduleEntry as deleteScheduleEntryRecord,
  deleteTimeSlot as deleteTimeSlotRecord,
  getCurrentSchoolYear,
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
  filtersRef.current = filters

  const refetchTimeSlots = useCallback(async () => {
    setError(null)
    try {
      const data = await getTimeSlots()
      setTimeSlots(data)
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : 'No se pudieron cargar los bloques horarios.',
      )
    }
  }, [])

  const refetchEntries = useCallback(async () => {
    setError(null)
    try {
      const currentFilters = filtersRef.current
      const data = await getScheduleEntries({
        ...currentFilters,
        schoolYearId: currentFilters.schoolYearId ?? schoolYearId ?? undefined,
      })
      setEntries(data)
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : 'No se pudieron cargar las entradas de horario.',
      )
    }
  }, [schoolYearId])

  const loadInitialData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const currentYear = await getCurrentSchoolYear()
      const yearId = currentYear?.id ?? null
      setSchoolYearId(yearId)

      const [slots, sects, tchrs, subjs] = await Promise.all([
        getTimeSlots(),
        getSections(),
        getTeachers(),
        getSubjects(),
      ])

      setTimeSlots(slots)
      setSections(sects)
      setTeachers(tchrs)
      setSubjects(subjs)

      const entryData = await getScheduleEntries({ schoolYearId: yearId ?? undefined })
      setEntries(entryData)
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : 'No se pudieron cargar los datos del horario.',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadInitialData()
  }, [loadInitialData])

  const refetchAll = useCallback(async () => {
    await Promise.all([refetchTimeSlots(), refetchEntries()])
  }, [refetchTimeSlots, refetchEntries])

  const createTimeSlot = useCallback(
    async (input: CreateTimeSlotInput) => {
      const record = await createTimeSlotRecord(input)
      await refetchTimeSlots()
      return record
    },
    [refetchTimeSlots],
  )

  const updateTimeSlot = useCallback(
    async (id: string, input: UpdateTimeSlotInput) => {
      const record = await updateTimeSlotRecord(id, input)
      await refetchTimeSlots()
      return record
    },
    [refetchTimeSlots],
  )

  const removeTimeSlot = useCallback(
    async (id: string) => {
      await deleteTimeSlotRecord(id)
      await refetchTimeSlots()
    },
    [refetchTimeSlots],
  )

  const createEntry = useCallback(
    async (input: CreateScheduleEntryInput) => {
      const record = await createScheduleEntryRecord(input)
      await refetchEntries()
      return record
    },
    [refetchEntries],
  )

  const updateEntry = useCallback(
    async (id: string, input: UpdateScheduleEntryInput) => {
      const record = await updateScheduleEntryRecord(id, input)
      await refetchEntries()
      return record
    },
    [refetchEntries],
  )

  const removeEntry = useCallback(
    async (id: string) => {
      await deleteScheduleEntryRecord(id)
      await refetchEntries()
    },
    [refetchEntries],
  )

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
