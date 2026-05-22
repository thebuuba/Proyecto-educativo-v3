import { useCallback, useEffect, useRef, useState } from 'react'

import {
  createStudent as createStudentRecord,
  deactivateStudent as deactivateStudentRecord,
  getStudents,
  updateStudent as updateStudentRecord,
} from '@/modules/students/services/studentsService'
import type {
  CreateStudentInput,
  StudentFilters,
  StudentListItem,
  UpdateStudentInput,
} from '@/modules/students/types'

const defaultFilters: StudentFilters = {
  status: 'active',
}

function useDebouncedSearch(delay = 300) {
  const [raw, setRaw] = useState('')
  const [debounced, setDebounced] = useState('')
  const timerRef = useRef<ReturnType<typeof window.setTimeout> | undefined>(undefined)

  useEffect(() => {
    timerRef.current = window.setTimeout(() => {
      setDebounced(raw)
    }, delay)

    return () => {
      window.clearTimeout(timerRef.current)
    }
  }, [raw, delay])

  return { search: raw, debouncedSearch: debounced, setSearch: setRaw }
}

export function useStudents() {
  const [students, setStudents] = useState<StudentListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<StudentFilters>(defaultFilters)
  const { search, debouncedSearch, setSearch } = useDebouncedSearch()

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getStudents({ search: debouncedSearch, filters })
      setStudents(data)
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : 'No se pudieron cargar los estudiantes.',
      )
      setStudents([])
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, filters])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void refetch()
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [refetch])

  const createStudent = useCallback(
    async (input: CreateStudentInput) => {
      const createdStudent = await createStudentRecord(input)
      await refetch()
      return createdStudent
    },
    [refetch],
  )

  const updateStudent = useCallback(
    async (id: string, input: UpdateStudentInput) => {
      const updatedStudent = await updateStudentRecord(id, input)
      await refetch()
      return updatedStudent
    },
    [refetch],
  )

  const deactivateStudent = useCallback(
    async (id: string) => {
      const updatedStudent = await deactivateStudentRecord(id)
      await refetch()
      return updatedStudent
    },
    [refetch],
  )

  return {
    students,
    loading,
    error,
    search,
    filters,
    setSearch,
    setFilters,
    refetch,
    createStudent,
    updateStudent,
    deactivateStudent,
  }
}
