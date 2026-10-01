import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

import { EmptyState } from '@/components/ui/EmptyState'
import { FeedbackBanner } from '@/components/ui/SemanticUI'
import { GradingBook } from '@/modules/grading/components/GradingBook'
import { getCourseTeams } from '@/modules/courses/services/coursesService'
import type { CourseTeam } from '@/modules/courses/types'
import { getActivityCenter } from '@/modules/activities/services/activitiesService'
import { useActivities } from '@/modules/activities/hooks/useActivities'
import type { Activity, ActivityCenterWorkspace, ActivityCreatorOrigin } from '@/modules/activities/types'
import type { CompetencyPeriodId } from '@/modules/grading/utils/competencyGrades'

type CreatorLocationState = { activityCreatorOrigin?: ActivityCreatorOrigin }

const emptyWorkspace: ActivityCenterWorkspace = { sectionSubjects: [], academicPeriods: [], activities: [] }

export function ActivityCreator() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const sectionSubjectId = searchParams.get('sectionSubjectId') ?? ''
  const requestedAcademicPeriodId = searchParams.get('academicPeriodId') ?? ''
  const activityId = searchParams.get('activityId') ?? undefined
  const draftId = searchParams.get('activityDraftId') ?? undefined
  const competencyBlockId = searchParams.get('competencyBlockId') ?? undefined
  const [workspace, setWorkspace] = useState(emptyWorkspace)
  const [workspaceError, setWorkspaceError] = useState<string | null>(null)
  const [teams, setTeams] = useState<CourseTeam[]>([])

  useEffect(() => {
    let active = true
    getActivityCenter()
      .then((result) => { if (active) setWorkspace(result) })
      .catch((reason) => { if (active) setWorkspaceError(reason instanceof Error ? reason.message : 'No se pudo cargar el contexto de la actividad.') })
    return () => { active = false }
  }, [])

  useEffect(() => {
    let active = true
    if (!sectionSubjectId) return
    getCourseTeams(sectionSubjectId)
      .then((result) => { if (active) setTeams(result) })
      .catch(() => { if (active) setTeams([]) })
    return () => { active = false }
  }, [sectionSubjectId])

  const sectionSubject = workspace.sectionSubjects.find((item) => item.id === sectionSubjectId)
  const academicPeriod = workspace.academicPeriods.find((item) => item.id === requestedAcademicPeriodId)
    ?? workspace.academicPeriods.find((item) => !sectionSubject?.schoolYearId || item.schoolYearId === sectionSubject.schoolYearId)
  const academicPeriodId = academicPeriod?.id ?? ''
  const origin = resolveOrigin(location.state as CreatorLocationState | null, searchParams)
  const domain = useActivities({ sectionSubjectId, academicPeriodId })
  const courseTitle = sectionSubject
    ? `${sectionSubject.gradeName} ${sectionSubject.sectionName} · ${sectionSubject.subjectName}`
    : 'Actividad'

  const activities = domain.activities
  const selectedActivity = activityId ? activities.find((activity) => activity.id === activityId) : undefined
  const blockId = competencyBlockId ?? selectedActivity?.competencyBlockId
  const periodId = useMemo<CompetencyPeriodId>(() => {
    const sequence = academicPeriod?.sequence ?? 1
    return (`p${Math.min(4, Math.max(1, sequence))}`) as CompetencyPeriodId
  }, [academicPeriod?.sequence])

  async function persist(activity: Omit<Activity, 'id'> | Activity) {
    if (!academicPeriodId || !sectionSubjectId) throw new Error('Falta el contexto académico de la actividad.')
    return domain.saveActivity({
      ...activity,
      ...(activityId || 'id' in activity ? { id: 'id' in activity ? activity.id : activityId } : {}),
      sectionSubjectId,
      academicPeriodId,
      schoolYearId: sectionSubject?.schoolYearId,
    })
  }

  function gradeActivity(activity: Activity) {
    navigate(`/calificaciones?${new URLSearchParams({ sectionSubjectId, academicPeriodId, activityId: activity.id, activityMode: 'evaluate' }).toString()}`)
  }

  function viewActivity(activity: Activity) {
    navigate(`/actividades?${new URLSearchParams({ activitySaved: activity.id, activitySavedMode: activityId ? 'updated' : 'created' }).toString()}`)
  }

  if (workspaceError || domain.error) return <FeedbackBanner tone="danger">{workspaceError ?? domain.error}</FeedbackBanner>
  if (!sectionSubjectId) return <EmptyState title="Falta la asignatura" description="Vuelve al contexto anterior y selecciona una asignatura antes de crear la actividad." />
  if (!academicPeriod) return <div role="status" className="min-h-64 animate-pulse rounded-3xl bg-card/70" />

  return (
    <section className="activities-creator-workspace w-full">
      <GradingBook
        evaluationProfile={sectionSubject?.evaluationProfile}
        sectionSubjectId={sectionSubjectId}
        students={[]}
        teams={teams}
        activities={activities}
        records={[]}
        recoveryScores={{}}
        periodName={academicPeriod.name}
        periodShortName={academicPeriod.name.split('—')[0]?.trim() ?? academicPeriod.name}
        recoveryLabel="Recuperación"
        courseTitle={courseTitle}
        saving={domain.saving}
        cellSaveStates={{}}
        initialActivityAction="create"
        initialActivityBlockId={blockId as Parameters<typeof GradingBook>[0]['initialActivityBlockId']}
        initialActivityDraftId={draftId}
        initialActivityId={activityId}
        initialActivityMode={activityId ? 'edit' : undefined}
        originReturnLabel={origin.label}
        onReturnToOrigin={() => navigate(origin.returnTo)}
        onAddActivity={persist}
        onUpdateActivity={persist}
        onDeleteActivity={(id) => { void domain.deleteActivity(id) }}
        onSaveScore={async () => false}
        onSaveRecovery={() => undefined}
        loadFinalRecords={async () => new Map()}
        getActivitiesForPeriod={(requested) => requested === periodId ? activities : []}
        onGradeCreatedActivity={gradeActivity}
        onViewCreatedActivity={viewActivity}
      />
    </section>
  )
}

function resolveOrigin(state: CreatorLocationState | null, params: URLSearchParams): ActivityCreatorOrigin {
  if (state?.activityCreatorOrigin) return state.activityCreatorOrigin
  const courseId = params.get('returnCourseId')
  const subjectId = params.get('returnSubjectId')
  const tab = params.get('returnTab')
  if (courseId && subjectId) {
    const returnTo = `/cursos?${new URLSearchParams({ courseId, subjectId, ...(tab ? { tab } : {}) }).toString()}`
    return { kind: tab === 'estudiantes' ? 'subject-students' : 'subject-activities', label: tab === 'estudiantes' ? 'Volver a Estudiantes' : 'Volver a actividades', returnTo }
  }
  return { kind: 'activities', label: 'Volver a Actividades', returnTo: '/actividades' }
}
