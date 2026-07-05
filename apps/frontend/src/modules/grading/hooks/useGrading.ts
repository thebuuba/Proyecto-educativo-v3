import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  deleteGrade,
  getAcademicPeriods,
  getGradeRecords,
  getStudentsForGrading,
  getTeacherSectionSubjects,
  saveGrade,
} from '@/modules/grading/services/gradingService'
import type {
  GradeRecordRow,
  GradingActivity,
  AcademicPeriodOpt,
  SectionSubjectOption,
  StudentGradeRow,
} from '@/modules/grading/types'
import {
  activityRecordName,
  competencyPeriods,
  getActivityIdFromRecordName,
  getRecoveryScores,
  recoveryRecordName,
  sortStudentsForGrades,
  validateScore,
  type CompetencyPeriodId,
} from '@/modules/grading/utils/competencyGrades'

const activitiesStoragePrefix = 'aula-base:grades:activities'

function activitiesStorageKey(sectionSubjectId: string, periodId: string) {
  return `${activitiesStoragePrefix}:${sectionSubjectId}:${periodId}`
}

function readStoredActivities(sectionSubjectId: string, periodId: string) {
  if (!sectionSubjectId || typeof window === 'undefined') return []
  const raw = window.localStorage.getItem(activitiesStorageKey(sectionSubjectId, periodId))
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed as GradingActivity[] : []
  } catch {
    return []
  }
}

function writeStoredActivities(sectionSubjectId: string, periodId: string, activities: GradingActivity[]) {
  window.localStorage.setItem(
    activitiesStorageKey(sectionSubjectId, periodId),
    JSON.stringify(activities),
  )
}

export function useGrading() {
  const [sectionSubjects, setSectionSubjects] = useState<SectionSubjectOption[]>([])
  const [academicPeriods, setAcademicPeriods] = useState<AcademicPeriodOpt[]>([])
  const [selectedSsId, setSelectedSsId] = useState('')
  const [selectedPeriodId, setSelectedPeriodId] = useState<CompetencyPeriodId>('p1')
  const [gradingContext, setGradingContext] = useState<{
    sectionId: string
    schoolYearId: string
  } | null>(null)
  const [students, setStudents] = useState<StudentGradeRow[]>([])
  const [gradeRecords, setGradeRecords] = useState<GradeRecordRow[]>([])
  const [activities, setActivities] = useState<GradingActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedSs = useMemo(
    () => sectionSubjects.find((item) => item.id === selectedSsId) ?? null,
    [sectionSubjects, selectedSsId],
  )
  const selectedPeriod = competencyPeriods.find((period) => period.id === selectedPeriodId) ?? competencyPeriods[0]
  const recoveryScores = useMemo(() => getRecoveryScores(gradeRecords), [gradeRecords])

  const academicPeriodId = useMemo(() => {
    const index = competencyPeriods.findIndex((period) => period.id === selectedPeriodId)
    return selectedPeriodId === 'final'
      ? academicPeriods[0]?.id ?? null
      : academicPeriods[index]?.id ?? null
  }, [academicPeriods, selectedPeriodId])

  const loadInitialData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [ssList, periodList] = await Promise.all([
        getTeacherSectionSubjects(),
        getAcademicPeriods(),
      ])
      setSectionSubjects(ssList)
      setAcademicPeriods(periodList)
      if (periodList.length === 0) {
        setError('No hay períodos académicos activos para guardar calificaciones.')
      }
      if (ssList.length > 0) {
        setSelectedSsId((current) => current || ssList[0].id)
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'No se pudieron cargar los cursos.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadInitialData()
  }, [loadInitialData])

  const loadGrades = useCallback(async () => {
    if (!selectedSsId || !academicPeriodId) {
      setStudents([])
      setGradeRecords([])
      setActivities([])
      return
    }

    setLoading(true)
    setError(null)
    try {
      const result = await getStudentsForGrading(selectedSsId, academicPeriodId)
      setGradingContext({
        sectionId: result.sectionId,
        schoolYearId: result.schoolYearId,
      })
      setStudents(sortStudentsForGrades(result.students))
      setGradeRecords(result.gradeRecords)
      setActivities(readStoredActivities(selectedSsId, selectedPeriodId))
    } catch (error) {
      setError(error instanceof Error ? error.message : 'No se pudieron cargar las calificaciones.')
      setStudents([])
      setGradeRecords([])
      setActivities([])
    } finally {
      setLoading(false)
    }
  }, [academicPeriodId, selectedPeriodId, selectedSsId])

  useEffect(() => {
    void loadGrades()
  }, [loadGrades])

  const loadFinalRecords = useCallback(async () => {
    if (!selectedSsId || !selectedSs) return new Map<CompetencyPeriodId, GradeRecordRow[]>()
    const recordsByPeriod = new Map<CompetencyPeriodId, GradeRecordRow[]>()
    await Promise.all(
      competencyPeriods
        .filter((period) => period.id !== 'final')
        .map(async (period, index) => {
          const periodId = academicPeriods[index]?.id
          const records = periodId ? await getGradeRecords(selectedSsId, periodId) : []
          recordsByPeriod.set(period.id as CompetencyPeriodId, records)
        }),
    )
    return recordsByPeriod
  }, [academicPeriods, selectedSs, selectedSsId])

  const getActivitiesForPeriod = useCallback(
    (periodId: CompetencyPeriodId) => readStoredActivities(selectedSsId, periodId),
    [selectedSsId],
  )

  function addActivity(activity: Omit<GradingActivity, 'id'>) {
    const next: GradingActivity = {
      ...activity,
      id: crypto.randomUUID(),
    }
    const updated = [...activities, next]
    setActivities(updated)
    if (selectedSsId) {
      writeStoredActivities(selectedSsId, selectedPeriodId, updated)
    }
  }

  function updateActivity(activity: GradingActivity) {
    const updated = activities.map((item) => item.id === activity.id ? activity : item)
    setActivities(updated)
    if (selectedSsId) {
      writeStoredActivities(selectedSsId, selectedPeriodId, updated)
    }
  }

  function deleteActivity(activityId: string) {
    const updated = activities.filter((item) => item.id !== activityId)
    setActivities(updated)
    if (selectedSsId) {
      writeStoredActivities(selectedSsId, selectedPeriodId, updated)
    }
  }

  const updateActivityScore = useCallback(
    async (enrollmentId: string, activity: GradingActivity, value: string) => {
      if (!gradingContext || !academicPeriodId) return
      const score = value.trim() === '' ? null : Number(value)
      const existing = gradeRecords.find((record) =>
        record.enrollmentId === enrollmentId &&
        getActivityIdFromRecordName(record.assessmentName) === activity.id
      )
      if (score === null) {
        if (existing) {
          setSaving(true)
          try {
            await deleteGrade(existing.id)
            await loadGrades()
          } catch (error) {
            setError(error instanceof Error ? error.message : 'No se pudo borrar la calificación.')
          } finally {
            setSaving(false)
          }
        }
        return
      }
      const validationError = validateScore(score, activity.maxScore)
      if (validationError) {
        setError(validationError)
        return
      }

      setSaving(true)
      try {
        await saveGrade({
          enrollmentId,
          sectionSubjectId: selectedSsId,
          academicPeriodId,
          sectionId: gradingContext.sectionId,
          schoolYearId: gradingContext.schoolYearId,
          score,
          maxScore: activity.maxScore,
          weight: 1,
          assessmentName: activityRecordName(activity),
          gradeId: existing?.id ?? null,
        })
        await loadGrades()
      } catch (error) {
        setError(error instanceof Error ? error.message : 'No se pudo guardar la calificación.')
      } finally {
        setSaving(false)
      }
    },
    [academicPeriodId, gradeRecords, gradingContext, loadGrades, selectedSsId],
  )

  const updateRecoveryScore = useCallback(
    async (enrollmentId: string, blockId: string, value: string) => {
      if (!gradingContext || !academicPeriodId) return
      const score = value.trim() === '' ? null : Number(value)
      const assessmentName = recoveryRecordName(blockId, selectedPeriodId)
      const existing = gradeRecords.find((record) =>
        record.enrollmentId === enrollmentId &&
        record.assessmentName === assessmentName
      )
      if (score === null) {
        if (existing) {
          setSaving(true)
          try {
            await deleteGrade(existing.id)
            await loadGrades()
          } catch (error) {
            setError(error instanceof Error ? error.message : 'No se pudo borrar la recuperación.')
          } finally {
            setSaving(false)
          }
        }
        return
      }
      const validationError = validateScore(score, 100)
      if (validationError) {
        setError(validationError)
        return
      }

      setSaving(true)
      try {
        await saveGrade({
          enrollmentId,
          sectionSubjectId: selectedSsId,
          academicPeriodId,
          sectionId: gradingContext.sectionId,
          schoolYearId: gradingContext.schoolYearId,
          score,
          maxScore: 100,
          weight: 1,
          assessmentName,
          gradeId: existing?.id ?? null,
        })
        await loadGrades()
      } catch (error) {
        setError(error instanceof Error ? error.message : 'No se pudo guardar la recuperación.')
      } finally {
        setSaving(false)
      }
    },
    [academicPeriodId, gradeRecords, gradingContext, loadGrades, selectedPeriodId, selectedSsId],
  )

  return {
    sectionSubjects,
    selectedSs,
    selectedSsId,
    setSelectedSsId,
    periods: competencyPeriods,
    selectedPeriod,
    selectedPeriodId,
    setSelectedPeriodId,
    students,
    gradeRecords,
    activities,
    recoveryScores,
    loading,
    saving,
    error,
    addActivity,
    updateActivity,
    deleteActivity,
    updateActivityScore,
    updateRecoveryScore,
    refresh: loadGrades,
    loadFinalRecords,
    getActivitiesForPeriod,
  }
}
