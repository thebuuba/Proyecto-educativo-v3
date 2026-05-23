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

export function useGrades() {
  const [sectionSubjects, setSectionSubjects] = useState<SectionSubjectOption[]>([])
  const [periods, setPeriods] = useState<AcademicPeriodOpt[]>([])
  const [selectedSsId, setSelectedSsId] = useState('')
  const [selectedPeriodId, setSelectedPeriodId] = useState('')
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
    const timeoutId = window.setTimeout(() => {
      void loadInitialData()
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [loadInitialData])

  const loadStudents = useCallback(async () => {
    if (!selectedSsId || !selectedPeriodId) return

    setLoading(true)
    setError(null)

    try {
      const rows = await getStudentsForGrading(selectedSsId, selectedPeriodId)
      setStudents(rows)
      setStats(computeGradeStats(rows))
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

    const timeoutId = window.setTimeout(() => {
      void loadStudents()
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [selectedSsId, selectedPeriodId, loadStudents])

  const updateScore = useCallback(
    async (
      enrollmentId: string,
      data: { score: number; maxScore: number; weight: number; assessmentName: string },
    ) => {
      setSaving(true)

      try {
        const student = students.find((s) => s.enrollmentId === enrollmentId)
        await saveGrade({
          enrollmentId,
          sectionSubjectId: selectedSsId,
          academicPeriodId: selectedPeriodId,
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
    [selectedPeriodId, selectedSsId, students],
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
