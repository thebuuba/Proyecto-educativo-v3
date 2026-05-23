import { useCallback, useEffect, useState } from 'react'

import {
  assignSubjectToSection,
  createGrade,
  createSection,
  createSubject,
  deactivateGrade,
  deactivateSection,
  deactivateSectionSubject,
  getCourseData,
  updateGrade,
  updateSection,
} from '@/modules/grades-sections/services/gradesSectionsService'
import type {
  AssignSubjectInput,
  CourseCatalogs,
  CreateGradeInput,
  CreateSectionInput,
  CreateSubjectInput,
  GradeWithSections,
  UpdateGradeInput,
  UpdateSectionInput,
} from '@/modules/grades-sections/types'

const emptyCatalogs: CourseCatalogs = {
  levels: [],
  cycles: [],
  modalities: [],
  subjects: [],
  teachers: [],
}

export function useGradesSections() {
  const [grades, setGrades] = useState<GradeWithSections[]>([])
  const [catalogs, setCatalogs] = useState<CourseCatalogs>(emptyCatalogs)
  const [currentSchoolYear, setCurrentSchoolYear] = useState<{ id: string; name: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getCourseData()
      setGrades(data.grades)
      setCatalogs(data.catalogs)
      setCurrentSchoolYear(data.currentSchoolYear)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar los grados y secciones.',
      )
      setGrades([])
      setCatalogs(emptyCatalogs)
      setCurrentSchoolYear(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refetch()
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
      await deactivateGrade(id)
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
      await deactivateSection(id)
      await refetch()
    },
    [refetch],
  )

  const addSubject = useCallback(
    async (input: CreateSubjectInput) => {
      const subject = await createSubject(input)
      await refetch()
      return subject
    },
    [refetch],
  )

  const assignSubject = useCallback(
    async (input: AssignSubjectInput) => {
      await assignSubjectToSection(input)
      await refetch()
    },
    [refetch],
  )

  const removeSubjectAssignment = useCallback(
    async (id: string) => {
      await deactivateSectionSubject(id)
      await refetch()
    },
    [refetch],
  )

  return {
    grades,
    catalogs,
    currentSchoolYear,
    loading,
    error,
    refetch,
    addGrade,
    editGrade,
    removeGrade,
    addSection,
    editSection,
    removeSection,
    addSubject,
    assignSubject,
    removeSubjectAssignment,
  }
}
