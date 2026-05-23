import { useCallback, useEffect, useState } from 'react'

import {
  createGrade,
  createSection,
  deleteGrade,
  deleteSection,
  getGrades,
  updateGrade,
  updateSection,
} from '@/modules/grades-sections/services/gradesSectionsService'
import type {
  CreateGradeInput,
  CreateSectionInput,
  GradeWithSections,
  UpdateGradeInput,
  UpdateSectionInput,
} from '@/modules/grades-sections/types'

export function useGradesSections() {
  const [grades, setGrades] = useState<GradeWithSections[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getGrades()
      setGrades(data)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar los grados y secciones.',
      )
      setGrades([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void refetch()
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [refetch])

  const addGrade = useCallback(
    async (input: CreateGradeInput) => {
      await createGrade(input)
      await refetch()
    },
    [refetch],
  )

  const editGrade = useCallback(
    async (id: string, input: UpdateGradeInput) => {
      await updateGrade(id, input)
      await refetch()
    },
    [refetch],
  )

  const removeGrade = useCallback(
    async (id: string) => {
      await deleteGrade(id)
      await refetch()
    },
    [refetch],
  )

  const addSection = useCallback(
    async (input: CreateSectionInput) => {
      await createSection(input)
      await refetch()
    },
    [refetch],
  )

  const editSection = useCallback(
    async (id: string, input: UpdateSectionInput) => {
      await updateSection(id, input)
      await refetch()
    },
    [refetch],
  )

  const removeSection = useCallback(
    async (id: string) => {
      await deleteSection(id)
      await refetch()
    },
    [refetch],
  )

  return {
    grades,
    loading,
    error,
    refetch,
    addGrade,
    editGrade,
    removeGrade,
    addSection,
    editSection,
    removeSection,
  }
}
