/**
 * @file Hook de Cursos
 *
 * Gestiona el estado de grados, secciones, asignaturas
 * y la asignación docente.
 */

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
} from '@/modules/courses/services/coursesService'
import type {
  AssignSubjectInput,
  CourseCatalogs,
  CreateGradeInput,
  CreateSectionInput,
  CreateSubjectInput,
  GradeWithSections,
  TeacherAssignmentInput,
  UpdateGradeInput,
  UpdateSectionInput,
} from '@/modules/courses/types'

/** Catálogos vacíos por defecto */
const emptyCatalogs: CourseCatalogs = {
  levels: [],
  cycles: [],
  modalities: [],
  subjects: [],
  teachers: [],
}

/** Hook principal para la gestión de cursos y secciones */
export function useCourses() {
  const [grades, setGrades] = useState<GradeWithSections[]>([])
  const [catalogs, setCatalogs] = useState<CourseCatalogs>(emptyCatalogs)
  const [currentSchoolYear, setCurrentSchoolYear] = useState<{ id: string; name: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /** Recarga todos los datos de cursos y catálogos */
  const refetch = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true)
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
      if (showLoading) {
        setGrades([])
        setCatalogs(emptyCatalogs)
        setCurrentSchoolYear(null)
      }
    } finally {
      if (showLoading) setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refetch()
  }, [refetch])

  const addGrade = useCallback(
    async (input: CreateGradeInput) => {
      await createGrade(input)
      void refetch(false)
    },
    [refetch],
  )

  const editGrade = useCallback(
    async (id: string, input: UpdateGradeInput) => {
      await updateGrade(id, input)
      void refetch(false)
    },
    [refetch],
  )

  const removeGrade = useCallback(
    async (id: string) => {
      await deactivateGrade(id)
      void refetch(false)
    },
    [refetch],
  )

  const addSection = useCallback(
    async (input: CreateSectionInput) => {
      await createSection(input)
      void refetch(false)
    },
    [refetch],
  )

  const editSection = useCallback(
    async (id: string, input: UpdateSectionInput) => {
      await updateSection(id, input)
      void refetch(false)
    },
    [refetch],
  )

  const removeSection = useCallback(
    async (id: string) => {
      await deactivateSection(id)
      void refetch(false)
    },
    [refetch],
  )

  const addSubject = useCallback(
    async (input: CreateSubjectInput) => {
      const subject = await createSubject(input)
      void refetch(false)
      return subject
    },
    [refetch],
  )

  const createTeacherAssignment = useCallback(
    async (input: TeacherAssignmentInput) => {
      if (!currentSchoolYear) {
        throw new Error('Activa un año escolar antes de crear una asignación.')
      }

      let grade = grades.find((item) => {
        const sameName = item.name.trim().toLowerCase() === input.gradeName.trim().toLowerCase()
        const sameLevel = (item.academicLevelId ?? null) === input.academicLevelId
        const sameCycle = (item.academicCycleId ?? null) === input.academicCycleId
        return sameName && sameLevel && sameCycle
      })

      if (!grade) {
        const createdGrade = await createGrade({
          name: input.gradeName,
          level: input.academicLevelName,
          academicLevelId: input.academicLevelId,
          academicCycleId: input.academicCycleId,
          sequence: input.gradeSequence,
        })
        grade = { ...createdGrade, sections: [] } as GradeWithSections
      }

      let section = grade.sections.find((item) => item.name.toLowerCase() === input.sectionName.toLowerCase())
      if (!section) {
        section = await createSection({
          gradeId: grade.id,
          name: input.sectionName,
        })
      }

      let subjectId = input.subjectId
      if (!subjectId) {
        const existingSubject = catalogs.subjects.find((subject) => {
          const sameCode = subject.code.toLowerCase() === input.subjectCode.toLowerCase()
          const sameName = subject.name.toLowerCase() === input.subjectName.toLowerCase()
          return sameCode || sameName
        })
        subjectId = existingSubject?.id
      }

      if (!subjectId) {
        const subject = await createSubject({
          code: input.subjectCode,
          name: input.subjectName,
        })
        subjectId = subject.id
      }

      const duplicateAssignment = section.assignments?.some((assignment) => {
        const sameSubject = assignment.subjectId === subjectId
        return sameSubject && assignment.status === 'active'
      })
      if (duplicateAssignment) {
        throw new Error('Esta asignatura ya está asignada a la sección seleccionada.')
      }

      await assignSubjectToSection({
        schoolYearId: currentSchoolYear.id,
        gradeId: grade.id,
        sectionId: section.id,
        subjectId,
        teacherId: null,
      })
      void refetch(false)
    },
    [catalogs.subjects, currentSchoolYear, grades, refetch],
  )

  const assignSubject = useCallback(
    async (input: AssignSubjectInput) => {
      await assignSubjectToSection(input)
      void refetch(false)
    },
    [refetch],
  )

  const removeSubjectAssignment = useCallback(
    async (id: string) => {
      await deactivateSectionSubject(id)
      void refetch(false)
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
    createTeacherAssignment,
    assignSubject,
    removeSubjectAssignment,
  }
}
