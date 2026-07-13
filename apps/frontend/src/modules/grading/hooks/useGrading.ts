import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  deleteGrade,
  deleteEvaluationActivity,
  getAnnualGradingWorkspace,
  getGradingWorkspace,
  saveGrade,
  saveEvaluationActivity,
} from '@/modules/grading/services/gradingService'
import type {
  AcademicPeriodOpt,
  GradeCellSaveState,
  GradeRecordRow,
  GradingActivity,
  GradingWorkspace,
  SectionSubjectOption,
  StudentGradeRow,
} from '@/modules/grading/types'
import {
  activityGradeCellKey,
  activityRecordName,
  competencyPeriods,
  getActivityIdFromRecordName,
  getRecoveryScores,
  recoveryGradeCellKey,
  recoveryRecordName,
  scoreNeedsPersistence,
  sortStudentsForGrades,
  validateScore,
  type CompetencyPeriodId,
} from '@/modules/grading/utils/competencyGrades'

type AnnualCacheEntry = {
  recordsByPeriod: Map<CompetencyPeriodId, GradeRecordRow[]>
  activitiesByPeriod: Map<CompetencyPeriodId, GradingActivity[]>
}

function activityRecordMatches(record: GradeRecordRow, enrollmentId: string, activityId: string) {
  return record.enrollmentId === enrollmentId && (
    record.evaluationActivityId === activityId ||
    getActivityIdFromRecordName(record.assessmentName) === activityId
  )
}

function periodIdForIndex(index: number): CompetencyPeriodId {
  const period = competencyPeriods[index]
  return period && period.id !== 'final' ? period.id : 'p1'
}

export function useGrading() {
  const [sectionSubjects, setSectionSubjects] = useState<SectionSubjectOption[]>([])
  const [academicPeriods, setAcademicPeriods] = useState<AcademicPeriodOpt[]>([])
  const [selectedSsId, setSelectedSsIdState] = useState('')
  const [selectedPeriodId, setSelectedPeriodIdState] = useState<CompetencyPeriodId>('p1')
  const [gradingContext, setGradingContext] = useState<{
    sectionId: string
    schoolYearId: string
  } | null>(null)
  const [students, setStudents] = useState<StudentGradeRow[]>([])
  const [gradeRecords, setGradeRecords] = useState<GradeRecordRow[]>([])
  const [activities, setActivities] = useState<GradingActivity[]>([])
  const [activitiesByPeriod, setActivitiesByPeriod] = useState<Map<CompetencyPeriodId, GradingActivity[]>>(new Map())
  const [cellSaveStates, setCellSaveStates] = useState<Record<string, GradeCellSaveState>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const workspaceRequestRef = useRef(0)
  const activeSectionSubjectRef = useRef('')
  const annualCacheRef = useRef(new Map<string, AnnualCacheEntry>())
  const annualInFlightRef = useRef(new Map<string, Promise<AnnualCacheEntry>>())

  const selectedSs = useMemo(
    () => sectionSubjects.find((item) => item.id === selectedSsId) ?? null,
    [sectionSubjects, selectedSsId],
  )
  const selectedPeriod = competencyPeriods.find((period) => period.id === selectedPeriodId) ?? competencyPeriods[0]
  const recoveryScores = useMemo(() => getRecoveryScores(gradeRecords), [gradeRecords])

  const academicPeriodId = useMemo(() => {
    if (selectedPeriodId === 'final') return null
    const index = competencyPeriods.findIndex((period) => period.id === selectedPeriodId)
    return academicPeriods[index]?.id ?? null
  }, [academicPeriods, selectedPeriodId])

  const applyWorkspace = useCallback((
    workspace: GradingWorkspace,
    viewPeriodId: CompetencyPeriodId,
    dataPeriodId: CompetencyPeriodId,
  ) => {
    if (workspace.sectionSubjects.length > 0) setSectionSubjects(workspace.sectionSubjects)
    if (workspace.academicPeriods.length > 0) setAcademicPeriods(workspace.academicPeriods)
    const nextSectionSubjectId = workspace.selectedSectionSubjectId ?? ''
    activeSectionSubjectRef.current = nextSectionSubjectId
    setSelectedSsIdState(nextSectionSubjectId)
    setSelectedPeriodIdState(viewPeriodId)
    setGradingContext(workspace.context)
    setStudents(sortStudentsForGrades(workspace.students))
    setGradeRecords(workspace.gradeRecords)
    setActivities(workspace.activities)
    setActivitiesByPeriod((current) => new Map(current).set(dataPeriodId, workspace.activities))
  }, [])

  const loadInitialData = useCallback(async () => {
    const requestId = ++workspaceRequestRef.current
    setLoading(true)
    setError(null)
    try {
      const workspace = await getGradingWorkspace()
      if (requestId !== workspaceRequestRef.current) return
      const periodIndex = workspace.academicPeriods.findIndex(
        (period) => period.id === workspace.selectedAcademicPeriodId,
      )
      const logicalPeriodId = periodIdForIndex(periodIndex)
      applyWorkspace(workspace, logicalPeriodId, logicalPeriodId)
      if (workspace.academicPeriods.length === 0) {
        setError('No hay períodos académicos activos para guardar calificaciones.')
      }
    } catch (loadError) {
      if (requestId === workspaceRequestRef.current) {
        setError(loadError instanceof Error ? loadError.message : 'No se pudieron cargar los cursos.')
      }
    } finally {
      if (requestId === workspaceRequestRef.current) setLoading(false)
    }
  }, [applyWorkspace])

  useEffect(() => {
    void loadInitialData()
  }, [loadInitialData])

  const loadPeriodWorkspace = useCallback(async (
    sectionSubjectId: string,
    periodId: CompetencyPeriodId,
    nextAcademicPeriodId: string,
  ) => {
    const requestId = ++workspaceRequestRef.current
    setLoading(true)
    setError(null)
    try {
      const workspace = await getGradingWorkspace({
        sectionSubjectId,
        academicPeriodId: nextAcademicPeriodId,
        includeOptions: false,
      })
      if (requestId === workspaceRequestRef.current) {
        applyWorkspace(workspace, periodId, periodId)
      }
    } catch (loadError) {
      if (requestId === workspaceRequestRef.current) {
        setError(loadError instanceof Error ? loadError.message : 'No se pudieron cargar las calificaciones.')
      }
    } finally {
      if (requestId === workspaceRequestRef.current) setLoading(false)
    }
  }, [applyWorkspace])

  const setSelectedPeriodId = useCallback((periodId: CompetencyPeriodId) => {
    setSelectedPeriodIdState(periodId)
    setError(null)
    if (periodId === 'final') return
    const index = competencyPeriods.findIndex((period) => period.id === periodId)
    const nextAcademicPeriodId = academicPeriods[index]?.id
    if (!selectedSsId || !nextAcademicPeriodId) return
    void loadPeriodWorkspace(selectedSsId, periodId, nextAcademicPeriodId)
  }, [academicPeriods, loadPeriodWorkspace, selectedSsId])

  const setSelectedSsId = useCallback((sectionSubjectId: string) => {
    if (!sectionSubjectId || sectionSubjectId === selectedSsId) return
    const requestId = ++workspaceRequestRef.current
    const requestedView = selectedPeriodId
    const requestedIndex = requestedView === 'final'
      ? 0
      : competencyPeriods.findIndex((period) => period.id === requestedView)
    const requestedAcademicPeriodId = academicPeriods[requestedIndex]?.id
    setSelectedSsIdState(sectionSubjectId)
    setLoading(true)
    setError(null)
    void getGradingWorkspace({
      sectionSubjectId,
      academicPeriodId: requestedAcademicPeriodId,
      includeOptions: true,
    }).then((workspace) => {
      if (requestId !== workspaceRequestRef.current) return
      const dataPeriodIndex = workspace.academicPeriods.findIndex(
        (period) => period.id === workspace.selectedAcademicPeriodId,
      )
      const dataPeriodId = periodIdForIndex(dataPeriodIndex)
      applyWorkspace(
        workspace,
        requestedView === 'final' ? 'final' : dataPeriodId,
        dataPeriodId,
      )
    }).catch((loadError: unknown) => {
      if (requestId === workspaceRequestRef.current) {
        setError(loadError instanceof Error ? loadError.message : 'No se pudo cambiar de curso.')
      }
    }).finally(() => {
      if (requestId === workspaceRequestRef.current) setLoading(false)
    })
  }, [academicPeriods, applyWorkspace, selectedPeriodId, selectedSsId])

  const invalidateAnnualCache = useCallback((sectionSubjectId = selectedSsId) => {
    if (!sectionSubjectId) return
    annualCacheRef.current.delete(sectionSubjectId)
    annualInFlightRef.current.delete(sectionSubjectId)
  }, [selectedSsId])

  const loadFinalRecords = useCallback(async (force = false) => {
    if (!selectedSsId) return new Map<CompetencyPeriodId, GradeRecordRow[]>()
    if (force) invalidateAnnualCache(selectedSsId)
    const cached = annualCacheRef.current.get(selectedSsId)
    if (cached) return cached.recordsByPeriod

    let request = annualInFlightRef.current.get(selectedSsId)
    if (!request) {
      request = getAnnualGradingWorkspace(selectedSsId).then((periods) => {
        const recordsByPeriod = new Map<CompetencyPeriodId, GradeRecordRow[]>()
        const nextActivitiesByPeriod = new Map<CompetencyPeriodId, GradingActivity[]>()
        periods.forEach((period) => {
          const logicalPeriodId = periodIdForIndex(period.sequence - 1)
          recordsByPeriod.set(logicalPeriodId, period.gradeRecords)
          nextActivitiesByPeriod.set(logicalPeriodId, period.activities)
        })
        const entry = { recordsByPeriod, activitiesByPeriod: nextActivitiesByPeriod }
        annualCacheRef.current.set(selectedSsId, entry)
        setActivitiesByPeriod((current) => {
          const next = new Map(current)
          nextActivitiesByPeriod.forEach((periodActivities, periodId) => {
            next.set(periodId, periodActivities)
          })
          return next
        })
        return entry
      }).finally(() => {
        annualInFlightRef.current.delete(selectedSsId)
      })
      annualInFlightRef.current.set(selectedSsId, request)
    }
    return (await request).recordsByPeriod
  }, [invalidateAnnualCache, selectedSsId])

  const getActivitiesForPeriod = useCallback(
    (periodId: CompetencyPeriodId) => periodId === selectedPeriodId
      ? activities
      : activitiesByPeriod.get(periodId) ?? [],
    [activities, activitiesByPeriod, selectedPeriodId],
  )

  async function addActivity(activity: Omit<GradingActivity, 'id'>) {
    if (!selectedSsId || !academicPeriodId || !gradingContext) return
    setSaving(true)
    setError(null)
    try {
      const created = await saveEvaluationActivity({
        ...activity,
        sectionSubjectId: selectedSsId,
        academicPeriodId,
        schoolYearId: gradingContext.schoolYearId,
      })
      setActivities((current) => {
        const updated = [...current, created]
        setActivitiesByPeriod((byPeriod) => new Map(byPeriod).set(selectedPeriodId, updated))
        return updated
      })
      invalidateAnnualCache()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'No se pudo crear la actividad.')
      throw saveError
    } finally {
      setSaving(false)
    }
  }

  async function updateActivity(activity: GradingActivity) {
    if (!selectedSsId || !academicPeriodId || !gradingContext) return
    setSaving(true)
    setError(null)
    try {
      const saved = await saveEvaluationActivity({
        ...activity,
        sectionSubjectId: selectedSsId,
        academicPeriodId,
        schoolYearId: gradingContext.schoolYearId,
      })
      setActivities((current) => {
        const updated = current.map((item) => item.id === saved.id ? saved : item)
        setActivitiesByPeriod((byPeriod) => new Map(byPeriod).set(selectedPeriodId, updated))
        return updated
      })
      invalidateAnnualCache()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'No se pudo actualizar la actividad.')
      throw saveError
    } finally {
      setSaving(false)
    }
  }

  async function deleteActivity(activityId: string) {
    setSaving(true)
    setError(null)
    try {
      await deleteEvaluationActivity(activityId)
      setActivities((current) => {
        const updated = current.filter((item) => item.id !== activityId)
        setActivitiesByPeriod((byPeriod) => new Map(byPeriod).set(selectedPeriodId, updated))
        return updated
      })
      invalidateAnnualCache()
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'No se pudo eliminar la actividad.')
      throw deleteError
    } finally {
      setSaving(false)
    }
  }

  const setCellSaveState = useCallback((key: string, state: GradeCellSaveState) => {
    setCellSaveStates((current) => ({ ...current, [key]: state }))
  }, [])

  const updateActivityScore = useCallback(
    async (enrollmentId: string, activity: GradingActivity, value: string) => {
      if (!gradingContext || !academicPeriodId) return
      const score = value.trim() === '' ? null : Number(value)
      const existing = gradeRecords.find((record) => activityRecordMatches(record, enrollmentId, activity.id))
      const cellKey = activityGradeCellKey(enrollmentId, activity.id)
      if (!scoreNeedsPersistence(existing?.score, score)) return
      if (score !== null) {
        const validationError = validateScore(score, activity.maxScore)
        if (validationError) {
          setError(validationError)
          setCellSaveState(cellKey, 'error')
          return
        }
      }

      const sectionSubjectAtSave = selectedSsId
      setError(null)
      setCellSaveState(cellKey, 'saving')
      if (score === null && existing) {
        setGradeRecords((current) => current.filter((record) => record.id !== existing.id))
        try {
          await deleteGrade(existing.id)
          invalidateAnnualCache(sectionSubjectAtSave)
          setCellSaveState(cellKey, 'saved')
        } catch (deleteError) {
          if (activeSectionSubjectRef.current === sectionSubjectAtSave) {
            setGradeRecords((current) => current.some((record) => record.id === existing.id)
              ? current
              : [...current, existing])
          }
          setError(deleteError instanceof Error ? deleteError.message : 'No se pudo borrar la calificación.')
          setCellSaveState(cellKey, 'error')
        }
        return
      }

      if (score === null) return
      const optimisticId = existing?.id ?? `optimistic:${cellKey}`
      const optimistic: GradeRecordRow = {
        id: optimisticId,
        enrollmentId,
        score,
        maxScore: activity.maxScore,
        weight: 1,
        assessmentName: activityRecordName(activity),
        status: existing?.status ?? 'draft',
        evaluationActivityId: activity.id,
      }
      setGradeRecords((current) => existing
        ? current.map((record) => record.id === existing.id ? optimistic : record)
        : [...current, optimistic])
      try {
        const saved = await saveGrade({
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
        if (activeSectionSubjectRef.current === sectionSubjectAtSave) {
          setGradeRecords((current) => current.map((record) => record.id === optimisticId ? saved : record))
        }
        invalidateAnnualCache(sectionSubjectAtSave)
        setCellSaveState(cellKey, 'saved')
      } catch (saveError) {
        if (activeSectionSubjectRef.current === sectionSubjectAtSave) {
          setGradeRecords((current) => existing
            ? current.map((record) => record.id === optimisticId ? existing : record)
            : current.filter((record) => record.id !== optimisticId))
        }
        setError(saveError instanceof Error ? saveError.message : 'No se pudo guardar la calificación.')
        setCellSaveState(cellKey, 'error')
      }
    },
    [academicPeriodId, gradeRecords, gradingContext, invalidateAnnualCache, selectedSsId, setCellSaveState],
  )

  const updateRecoveryScore = useCallback(
    async (enrollmentId: string, blockId: string, value: string) => {
      if (!gradingContext || !academicPeriodId) return
      const score = value.trim() === '' ? null : Number(value)
      const assessmentName = recoveryRecordName(blockId, selectedPeriodId)
      const existing = gradeRecords.find((record) =>
        record.enrollmentId === enrollmentId && record.assessmentName === assessmentName
      )
      const cellKey = recoveryGradeCellKey(enrollmentId, blockId)
      if (!scoreNeedsPersistence(existing?.score, score)) return
      if (score !== null) {
        const validationError = validateScore(score, 100)
        if (validationError) {
          setError(validationError)
          setCellSaveState(cellKey, 'error')
          return
        }
      }

      const sectionSubjectAtSave = selectedSsId
      setError(null)
      setCellSaveState(cellKey, 'saving')
      if (score === null && existing) {
        setGradeRecords((current) => current.filter((record) => record.id !== existing.id))
        try {
          await deleteGrade(existing.id)
          invalidateAnnualCache(sectionSubjectAtSave)
          setCellSaveState(cellKey, 'saved')
        } catch (deleteError) {
          if (activeSectionSubjectRef.current === sectionSubjectAtSave) {
            setGradeRecords((current) => current.some((record) => record.id === existing.id)
              ? current
              : [...current, existing])
          }
          setError(deleteError instanceof Error ? deleteError.message : 'No se pudo borrar la recuperación.')
          setCellSaveState(cellKey, 'error')
        }
        return
      }

      if (score === null) return
      const optimisticId = existing?.id ?? `optimistic:${cellKey}`
      const optimistic: GradeRecordRow = {
        id: optimisticId,
        enrollmentId,
        score,
        maxScore: 100,
        weight: 1,
        assessmentName,
        status: existing?.status ?? 'draft',
        evaluationActivityId: null,
      }
      setGradeRecords((current) => existing
        ? current.map((record) => record.id === existing.id ? optimistic : record)
        : [...current, optimistic])
      try {
        const saved = await saveGrade({
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
        if (activeSectionSubjectRef.current === sectionSubjectAtSave) {
          setGradeRecords((current) => current.map((record) => record.id === optimisticId ? saved : record))
        }
        invalidateAnnualCache(sectionSubjectAtSave)
        setCellSaveState(cellKey, 'saved')
      } catch (saveError) {
        if (activeSectionSubjectRef.current === sectionSubjectAtSave) {
          setGradeRecords((current) => existing
            ? current.map((record) => record.id === optimisticId ? existing : record)
            : current.filter((record) => record.id !== optimisticId))
        }
        setError(saveError instanceof Error ? saveError.message : 'No se pudo guardar la recuperación.')
        setCellSaveState(cellKey, 'error')
      }
    },
    [academicPeriodId, gradeRecords, gradingContext, invalidateAnnualCache, selectedPeriodId, selectedSsId, setCellSaveState],
  )

  const refresh = useCallback(() => {
    if (!selectedSsId || !academicPeriodId || selectedPeriodId === 'final') return Promise.resolve()
    return loadPeriodWorkspace(selectedSsId, selectedPeriodId, academicPeriodId)
  }, [academicPeriodId, loadPeriodWorkspace, selectedPeriodId, selectedSsId])

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
    cellSaveStates,
    error,
    addActivity,
    updateActivity,
    deleteActivity,
    updateActivityScore,
    updateRecoveryScore,
    refresh,
    loadFinalRecords,
    getActivitiesForPeriod,
  }
}
