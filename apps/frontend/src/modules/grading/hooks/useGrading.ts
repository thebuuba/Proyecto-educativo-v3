import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  deleteGrade,
  deleteEvaluationActivity,
  getAcademicPeriods,
  getEvaluationActivities,
  getGradeRecords,
  getStudentsForGrading,
  getTeacherSectionSubjects,
  saveGrade,
  saveEvaluationActivity,
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
  const [activitiesByPeriod, setActivitiesByPeriod] = useState<Map<CompetencyPeriodId, GradingActivity[]>>(new Map())
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
      const [result, activityList] = await Promise.all([
        getStudentsForGrading(selectedSsId, academicPeriodId),
        getEvaluationActivities(selectedSsId, academicPeriodId),
      ])
      setGradingContext({
        sectionId: result.sectionId,
        schoolYearId: result.schoolYearId,
      })
      setStudents(sortStudentsForGrades(result.students))
      setGradeRecords(result.gradeRecords)
      setActivities(activityList)
      setActivitiesByPeriod((current) => new Map(current).set(selectedPeriodId, activityList))
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
          const periodActivities = periodId ? await getEvaluationActivities(selectedSsId, periodId) : []
          recordsByPeriod.set(period.id as CompetencyPeriodId, records)
          setActivitiesByPeriod((current) => new Map(current).set(period.id as CompetencyPeriodId, periodActivities))
        }),
    )
    return recordsByPeriod
  }, [academicPeriods, selectedSs, selectedSsId])

  const getActivitiesForPeriod = useCallback(
    (periodId: CompetencyPeriodId) => periodId === selectedPeriodId
      ? activities
      : activitiesByPeriod.get(periodId) ?? [],
    [activities, activitiesByPeriod, selectedPeriodId],
  )

  async function addActivity(activity: Omit<GradingActivity, 'id'>) {
    if (!selectedSsId || !academicPeriodId || !gradingContext) return
    const created = await saveEvaluationActivity({
      ...activity,
      sectionSubjectId: selectedSsId,
      academicPeriodId,
      schoolYearId: gradingContext.schoolYearId,
    })
    const updated = [...activities, created]
    setActivities(updated)
    setActivitiesByPeriod((current) => new Map(current).set(selectedPeriodId, updated))
  }

  async function updateActivity(activity: GradingActivity) {
    if (!selectedSsId || !academicPeriodId || !gradingContext) return
    const saved = await saveEvaluationActivity({
      ...activity,
      sectionSubjectId: selectedSsId,
      academicPeriodId,
      schoolYearId: gradingContext.schoolYearId,
    })
    const updated = activities.map((item) => item.id === saved.id ? saved : item)
    setActivities(updated)
    setActivitiesByPeriod((current) => new Map(current).set(selectedPeriodId, updated))
  }

  async function deleteActivity(activityId: string) {
    await deleteEvaluationActivity(activityId)
    const updated = activities.filter((item) => item.id !== activityId)
    setActivities(updated)
    setActivitiesByPeriod((current) => new Map(current).set(selectedPeriodId, updated))
  }

  const updateActivityScore = useCallback(
    async (enrollmentId: string, activity: GradingActivity, value: string) => {
      if (!gradingContext || !academicPeriodId) return
      const score = value.trim() === '' ? null : Number(value)
        const existing = gradeRecords.find((record) =>
          record.enrollmentId === enrollmentId &&
          (record.evaluationActivityId === activity.id || getActivityIdFromRecordName(record.assessmentName) === activity.id)
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
          evaluationActivityId: activity.id,
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
