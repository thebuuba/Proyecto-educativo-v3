import { useCallback, useEffect, useRef, useState } from 'react'

import { useDebouncedSearch } from '@/hooks/useDebouncedSearch'
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
const PAGE_SIZE = 50

export function useStudents() {
  const [students, setStudents] = useState<StudentListItem[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<StudentFilters>(defaultFilters)
  const { search, debouncedSearch, setSearch } = useDebouncedSearch()
  const mountedRef = useRef(false)
  const pageRef = useRef(page)

  useEffect(() => {
    pageRef.current = page
  }, [page])

  const refetch = useCallback(
    async (targetPage?: number) => {
      const p = targetPage ?? pageRef.current

      setLoading(true)
      setError(null)

      try {
        const { data, count } = await getStudents({
          search: debouncedSearch,
          filters,
          page: p,
          pageSize: PAGE_SIZE,
        })
        setStudents(data)
        setTotalCount(count)
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'No se pudieron cargar los estudiantes.',
        )
        setStudents([])
        setTotalCount(0)
      } finally {
        setLoading(false)
      }
    },
    [debouncedSearch, filters],
  )

  useEffect(() => {
    setPage(1)

    if (mountedRef.current) {
      void refetch(1)
    } else {
      mountedRef.current = true
      refetch(1).catch(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, filters])

  const goToPage = useCallback(
    (newPage: number) => {
      setPage(newPage)
      void refetch(newPage)
    },
    [refetch],
  )

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
    totalCount,
    page,
    pageSize: PAGE_SIZE,
    loading,
    error,
    search,
    filters,
    setSearch,
    setFilters,
    goToPage,
    refetch,
    createStudent,
    updateStudent,
    deactivateStudent,
  }
}
