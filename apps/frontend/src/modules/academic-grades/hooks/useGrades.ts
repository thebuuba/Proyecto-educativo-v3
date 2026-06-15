/**
 * @file Hook de Calificaciones
 *
 * Gestiona el estado y las operaciones del módulo de calificaciones:
 * selección de sección-asignatura, carga de estudiantes, guardado
 * de notas y cálculo de estadísticas.
 */

import { useCallback, useEffect, useState } from 'react'

import {
  computeGradeStats,
  getAcademicPeriods,
  getStudentsForGrading,
  getTeacherSectionSubjects,
  saveGrade,
} from '@/modules/academic-grades/services/gradesService'
import type {
  AcademicPeriodOpt,
  GradeSummaryStats,
  SectionSubjectOption,
  StudentGradeRow,
} from '@/modules/academic-grades/types'

/** Hook principal para la gestión de calificaciones */
export function useGrades() {
  const [sectionSubjects, setSectionSubjects] = useState<SectionSubjectOption[]>([])
  const [periods, setPeriods] = useState<AcademicPeriodOpt[]>([])
  const [selectedSsId, setSelectedSsId] = useState('')
  const [selectedPeriodId, setSelectedPeriodId] = useState('')
  const [gradingContext, setGradingContext] = useState<{
    sectionId: string
    schoolYearId: string
  } | null>(null)
  const [students, setStudents] = useState<StudentGradeRow[]>([])
  const [stats, setStats] = useState<GradeSummaryStats>({
    average: null,
    highest: null,
    lowest: null,
    passed: 0,
    failed: 0,
    total: 0,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /** Carga las secciones-asignaturas y los períodos académicos */
  const loadInitialData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const [ssList, periodList] = await Promise.all([
        getTeacherSectionSubjects(),
        getAcademicPeriods(),
      ])
      setSectionSubjects(ssList)
      setPeriods(periodList)

      if (ssList.length > 0 && !selectedSsId) {
        setSelectedSsId(ssList[0].id)
      }
      if (periodList.length > 0 && !selectedPeriodId) {
        setSelectedPeriodId(periodList[0].id)
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar los datos.',
      )
    } finally {
      setLoading(false)
    }
  }, [selectedSsId, selectedPeriodId])

  useEffect(() => {
    void loadInitialData()
  }, [loadInitialData])

  /** Carga los estudiantes y sus calificaciones para la selección actual */
  const loadStudents = useCallback(async () => {
    if (!selectedSsId || !selectedPeriodId) return

    setLoading(true)
    setError(null)

    try {
      const result = await getStudentsForGrading(selectedSsId, selectedPeriodId)
      setGradingContext({
        sectionId: result.sectionId,
        schoolYearId: result.schoolYearId,
      })
      setStudents(result.students)
      setStats(computeGradeStats(result.students))
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar los estudiantes.',
      )
      setStudents([])
    } finally {
      setLoading(false)
    }
  }, [selectedSsId, selectedPeriodId])

  useEffect(() => {
    if (!selectedSsId || !selectedPeriodId) return

    void loadStudents()
  }, [selectedSsId, selectedPeriodId, loadStudents])

  /** Actualiza la calificación de un estudiante y la persiste */
  const updateScore = useCallback(
    async (
      enrollmentId: string,
      data: { score: number; maxScore: number; weight: number; assessmentName: string },
    ) => {
      setSaving(true)

      try {
        const student = students.find((s) => s.enrollmentId === enrollmentId)
        if (!gradingContext) {
          throw new Error('No se pudo determinar el año escolar y la sección.')
        }

        await saveGrade({
          enrollmentId,
          sectionSubjectId: selectedSsId,
          academicPeriodId: selectedPeriodId,
          sectionId: gradingContext.sectionId,
          schoolYearId: gradingContext.schoolYearId,
          ...data,
          gradeId: student?.gradeId ?? null,
        })

        const updated = students.map((s) =>
          s.enrollmentId === enrollmentId
            ? {
                ...s,
                score: data.score,
                maxScore: data.maxScore,
                weight: data.weight,
                assessmentName: data.assessmentName,
                status: (s.status ?? 'draft') as typeof s.status,
              }
            : s,
        )
        setStudents(updated)
        setStats(computeGradeStats(updated))
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'No se pudo guardar la calificación.',
        )
      } finally {
        setSaving(false)
      }
    },
    [gradingContext, selectedPeriodId, selectedSsId, students],
  )

  return {
    sectionSubjects,
    periods,
    selectedSsId,
    setSelectedSsId,
    selectedPeriodId,
    setSelectedPeriodId,
    students,
    stats,
    loading,
    saving,
    error,
    updateScore,
    refresh: loadStudents,
  }
}
