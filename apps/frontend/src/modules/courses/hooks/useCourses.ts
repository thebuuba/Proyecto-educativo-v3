/**
 * @file Hook de Cursos
 *
 * Gestiona el estado de grados, secciones, asignaturas
 * y la asignación docente.
 */

import { useCallback, useEffect, useState } from 'react'

import { useAuth } from '@/modules/auth/hooks/useAuth'
import {
  assignSubjectToSection,
  createGrade,
  createSection,
  createSubject,
  deactivateGrade,
  deactivateSection,
  deactivateSectionSubject,
  deleteSectionSubjectPermanently,
  getCourseData,
  restoreSectionSubject,
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
import { createScopedTtlCache } from '@/utils/scopedTtlCache'

/** Catálogos vacíos por defecto */
const emptyCatalogs: CourseCatalogs = {
  levels: [],
  cycles: [],
  modalities: [],
  subjects: [],
  teachers: [],
}

type CoursesCacheData = {
  grades: GradeWithSections[]
  catalogs: CourseCatalogs
  currentSchoolYear: { id: string; name: string } | null
}

const coursesCache = createScopedTtlCache<CoursesCacheData>(60_000)

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
}

/** Hook principal para la gestión de cursos y secciones */
export function useCourses() {
  const { appUser } = useAuth()
  const cacheScope = appUser ? `${appUser.id}:${appUser.schoolId}` : null
  const cached = coursesCache.read(cacheScope)
  const [grades, setGrades] = useState<GradeWithSections[]>(cached?.grades ?? [])
  const [catalogs, setCatalogs] = useState<CourseCatalogs>(cached?.catalogs ?? emptyCatalogs)
  const [currentSchoolYear, setCurrentSchoolYear] = useState<{ id: string; name: string } | null>(
    cached?.currentSchoolYear ?? null,
  )
  const [loading, setLoading] = useState(!cached)
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
      coursesCache.write(cacheScope, data)
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
  }, [cacheScope])

  useEffect(() => {
    const freshCache = coursesCache.read(cacheScope)
    if (freshCache) {
      setGrades(freshCache.grades)
      setCatalogs(freshCache.catalogs)
      setCurrentSchoolYear(freshCache.currentSchoolYear)
      setError(null)
      setLoading(false)
      return
    }
    void refetch()
  }, [cacheScope, refetch])

  const addGrade = useCallback(
    async (input: CreateGradeInput) => {
      await createGrade(input)
      coursesCache.clear(cacheScope)
      void refetch(false)
    },
    [cacheScope, refetch],
  )

  const editGrade = useCallback(
    async (id: string, input: UpdateGradeInput) => {
      await updateGrade(id, input)
      coursesCache.clear(cacheScope)
      void refetch(false)
    },
    [cacheScope, refetch],
  )

  const removeGrade = useCallback(
    async (id: string) => {
      await deactivateGrade(id)
      coursesCache.clear(cacheScope)
      void refetch(false)
    },
    [cacheScope, refetch],
  )

  const addSection = useCallback(
    async (input: CreateSectionInput) => {
      await createSection(input)
      coursesCache.clear(cacheScope)
      void refetch(false)
    },
    [cacheScope, refetch],
  )

  const editSection = useCallback(
    async (id: string, input: UpdateSectionInput) => {
      await updateSection(id, input)
      coursesCache.clear(cacheScope)
      void refetch(false)
    },
    [cacheScope, refetch],
  )

  const removeSection = useCallback(
    async (id: string) => {
      await deactivateSection(id)
      coursesCache.clear(cacheScope)
      void refetch(false)
    },
    [cacheScope, refetch],
  )

  const addSubject = useCallback(
    async (input: CreateSubjectInput) => {
      const subject = await createSubject(input)
      coursesCache.clear(cacheScope)
      void refetch(false)
      return subject
    },
    [cacheScope, refetch],
  )

  const createTeacherAssignment = useCallback(
    async (input: TeacherAssignmentInput) => {
      if (!currentSchoolYear) {
        throw new Error('Activa un año escolar antes de crear una asignación.')
      }

      let grade = grades.find((item) => {
        const sameName = item.name.trim().toLowerCase() === input.gradeName.trim().toLowerCase()
        const sameLevel =
          (item.academicLevelId && input.academicLevelId)
            ? item.academicLevelId === input.academicLevelId
            : normalizeText(item.academicLevelName ?? item.level ?? '') === normalizeText(input.academicLevelName)
        const sameCycle =
          (item.academicCycleId && input.academicCycleId)
            ? item.academicCycleId === input.academicCycleId
            : normalizeText(item.academicCycleName ?? '') === normalizeText(input.academicCycleName)
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
        coursesCache.clear(cacheScope)
        grade = { ...createdGrade, sections: [] } as GradeWithSections
      }

      let section = grade.sections.find((item) => item.name.toLowerCase() === input.sectionName.toLowerCase())
      if (!section) {
        section = await createSection({
          gradeId: grade.id,
          name: input.sectionName,
        })
        coursesCache.clear(cacheScope)
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
        coursesCache.clear(cacheScope)
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
      coursesCache.clear(cacheScope)
      void refetch(false)
    },
    [cacheScope, catalogs.subjects, currentSchoolYear, grades, refetch],
  )

  const assignSubject = useCallback(
    async (input: AssignSubjectInput) => {
      await assignSubjectToSection(input)
      coursesCache.clear(cacheScope)
      void refetch(false)
    },
    [cacheScope, refetch],
  )

  const removeSubjectAssignment = useCallback(
    async (id: string) => {
      await deactivateSectionSubject(id)
      coursesCache.clear(cacheScope)
      void refetch(false)
    },
    [cacheScope, refetch],
  )

  const restoreSubjectAssignment = useCallback(
    async (id: string) => {
      await restoreSectionSubject(id)
      await refetch(false)
    },
    [refetch],
  )

  const permanentlyDeleteSubjectAssignment = useCallback(
    async (id: string) => {
      await deleteSectionSubjectPermanently(id)
      await refetch(false)
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
    restoreSubjectAssignment,
    permanentlyDeleteSubjectAssignment,
  }
}
