import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { FeedbackBanner } from '@/components/ui/SemanticUI'
import { ActivityEditorWorkspace } from './ActivityEditorWorkspace'
import { getCourseTeams } from '@/modules/courses/services/coursesService'
import type { CourseTeam } from '@/modules/courses/types'
import { getActivityCenter } from '@/modules/activities/services/activitiesService'
import { useActivities } from '@/modules/activities/hooks/useActivities'
import type { Activity, ActivityCenterWorkspace, ActivityCreatorOrigin } from '@/modules/activities/types'
import { isFirstSecondaryLanguage, isSecondSecondaryLanguage } from '@/modules/activities/utils/firstSecondaryLanguageContext'
import { instrumentAcademicContext } from '@/modules/activities/utils/instrumentAcademicContext'
import { useAuth } from '@/modules/auth/hooks/useAuth'

type CreatorLocationState = { activityCreatorOrigin?: ActivityCreatorOrigin }

const emptyWorkspace: ActivityCenterWorkspace = { sectionSubjects: [], academicPeriods: [], activities: [] }

export function ActivityCreator() {
  const { schoolId, appUser } = useAuth()
  const [params] = useSearchParams()
  if (!schoolId || !appUser?.id) return <FeedbackBanner tone="warning">Falta el contexto de tu cuenta. Vuelve a iniciar sesión para continuar.</FeedbackBanner>
  return <ScopedActivityCreator key={JSON.stringify([schoolId, appUser.id, params.get('sectionSubjectId'), params.get('academicPeriodId'), params.get('activityId'), params.get('activityDraftId'), params.get('planningEntryId')])} schoolId={schoolId} userId={appUser.id} />
}

function ScopedActivityCreator({ schoolId, userId }: { schoolId: string; userId: string }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const sectionSubjectId = searchParams.get('sectionSubjectId') ?? ''
  const requestedAcademicPeriodId = searchParams.get('academicPeriodId') ?? ''
  const activityId = searchParams.get('activityId') ?? undefined
  const draftId = searchParams.get('activityDraftId') ?? undefined
  const planningEntryId = searchParams.get('planningEntryId') ?? undefined
  const competencyBlockId = searchParams.get('competencyBlockId') ?? undefined
  const [workspace, setWorkspace] = useState(emptyWorkspace)
  const [workspaceError, setWorkspaceError] = useState<string | null>(null)
  const [workspaceLoading, setWorkspaceLoading] = useState(true)
  const [workspaceRetry, setWorkspaceRetry] = useState(0)
  const [teams, setTeams] = useState<CourseTeam[]>([])
  const [teamsLoading, setTeamsLoading] = useState(true)
  const [teamsError, setTeamsError] = useState<string | null>(null)
  const [teamsRetry, setTeamsRetry] = useState(0)
  const creationId = useRef<string | undefined>(undefined)

  useEffect(() => {
    let active = true
    setWorkspaceLoading(true)
    setWorkspaceError(null)
    getActivityCenter()
      .then((result) => { if (active) setWorkspace(result) })
      .catch((reason) => { if (active) setWorkspaceError(reason instanceof Error ? reason.message : 'No se pudo cargar el contexto de la actividad.') })
      .finally(() => { if (active) setWorkspaceLoading(false) })
    return () => { active = false }
  }, [workspaceRetry])

  useEffect(() => {
    let active = true
    setTeams([])
    setTeamsError(null)
    setTeamsLoading(Boolean(sectionSubjectId))
    if (!sectionSubjectId) return
    getCourseTeams(sectionSubjectId)
      .then((result) => { if (active) setTeams(result) })
      .catch((reason) => { if (active) setTeamsError(reason instanceof Error ? reason.message : 'No se pudieron cargar los equipos.') })
      .finally(() => { if (active) setTeamsLoading(false) })
    return () => { active = false }
  }, [sectionSubjectId, teamsRetry])

  const sectionSubject = workspace.sectionSubjects.find((item) => item.id === sectionSubjectId)
  const academicPeriod = workspace.academicPeriods.find((item) =>
    (!requestedAcademicPeriodId || item.id === requestedAcademicPeriodId)
    && (!sectionSubject?.schoolYearId || item.schoolYearId === sectionSubject.schoolYearId))
  const academicPeriodId = academicPeriod?.id ?? ''
  const origin = resolveOrigin(location.state as CreatorLocationState | null, searchParams)
  const domain = useActivities({ sectionSubjectId: sectionSubject?.id, academicPeriodId, scopeKey: JSON.stringify([schoolId, userId]) })
  const courseTitle = sectionSubject
    ? `${sectionSubject.gradeName} ${sectionSubject.sectionName} · ${sectionSubject.subjectName}`
    : 'Actividad'

  const activities = domain.activities
  const selectedActivity = activityId ? activities.find((activity) => activity.id === activityId) : undefined
  const blockId = competencyBlockId ?? selectedActivity?.competencyBlockId

  async function persist(activity: (Omit<Activity, 'id'> | Activity) & { creationId?: string }) {
    if (!academicPeriodId || !sectionSubjectId) throw new Error('Falta el contexto académico de la actividad.')
    if (activity.activityType === 'group' && (teamsLoading || teamsError)) throw new Error('Reintenta la carga de equipos antes de guardar una actividad grupal.')
    const editing = 'id' in activity
    if (!editing) creationId.current ??= activity.creationId ?? crypto.randomUUID()
    const saved = await domain.saveActivity({
      ...activity,
      ...(!editing ? { creationId: activity.creationId ?? creationId.current } : {}),
      ...('id' in activity ? { id: activity.id } : {}),
      sectionSubjectId,
      academicPeriodId,
      schoolYearId: sectionSubject?.schoolYearId,
    })
    if (!editing) creationId.current = undefined
    return saved
  }

  function gradeActivity(activity: Activity) {
    navigate(`/calificaciones?${new URLSearchParams({ sectionSubjectId, academicPeriodId, activityId: activity.id, activityMode: 'evaluate' }).toString()}`)
  }

  function viewActivity(activity: Activity) {
    navigate(`/actividades?${new URLSearchParams({ activitySaved: activity.id, activitySavedMode: activityId ? 'updated' : 'created' }).toString()}`)
  }

  if (!sectionSubjectId) return <EmptyState title="Falta la asignatura" description="Vuelve al contexto anterior y selecciona una asignatura antes de crear la actividad." />
  if (workspaceError && !workspace.sectionSubjects.length) return <FeedbackBanner role="alert" tone="danger">{workspaceError}<Button variant="outline" onClick={() => setWorkspaceRetry(value => value + 1)}>Reintentar contexto</Button></FeedbackBanner>
  if (workspaceLoading && !workspace.sectionSubjects.length) return <div role="status" aria-label="Cargando contexto académico" className="min-h-64 animate-pulse rounded-3xl bg-card/70" />
  if (!sectionSubject || !academicPeriod) return <EmptyState title={!sectionSubject ? 'La asignatura no está disponible' : 'El período no está disponible'} description="Vuelve al contexto anterior y selecciona un contexto académico válido." action={<Button variant="outline" onClick={() => navigate(origin.returnTo)}>{origin.label}</Button>} />
  if (activityId && domain.loading && !selectedActivity) return <div role="status" aria-label="Cargando actividad" className="min-h-64 animate-pulse rounded-3xl bg-card/70" />
  if (activityId && !domain.loading && !selectedActivity && !domain.loadError) return <EmptyState title="La actividad no está disponible" description="No existe una actividad con ese identificador en este contexto." action={<Button variant="outline" onClick={() => navigate(origin.returnTo)}>{origin.label}</Button>} />

  return (
    <section className="activities-creator-workspace w-full">
      {workspaceError ? <FeedbackBanner role="alert" tone="danger">{workspaceError}<Button variant="outline" onClick={() => setWorkspaceRetry(value => value + 1)}>Reintentar contexto</Button></FeedbackBanner> : null}
      {domain.loadError ? <FeedbackBanner role="alert" tone="danger">{domain.loadError}<Button variant="outline" onClick={() => void domain.reload().catch(() => undefined)}>Reintentar actividades</Button></FeedbackBanner> : null}
      {domain.mutationError ? <FeedbackBanner role="alert" tone="danger">{domain.mutationError} Los valores se conservan. Vuelve a guardar para reintentar.</FeedbackBanner> : null}
      {teamsError ? <FeedbackBanner role="alert" tone="danger">{teamsError}<Button variant="outline" onClick={() => setTeamsRetry(value => value + 1)}>Reintentar equipos</Button></FeedbackBanner> : null}
      {teamsLoading ? <p role="status" className="text-sm text-muted-foreground">Cargando equipos…</p> : null}
      {(!activityId || selectedActivity) ? <ActivityEditorWorkspace
        firstSecondaryLanguage={isFirstSecondaryLanguage(sectionSubject)}
        secondSecondaryLanguage={isSecondSecondaryLanguage(sectionSubject)}
        instrumentAcademicContext={instrumentAcademicContext(sectionSubject)}
        evaluationProfile={sectionSubject?.evaluationProfile}
        sectionSubjectId={sectionSubjectId}
        activity={selectedActivity}
        activityDraftContext={{ schoolId, userId, schoolYearId: sectionSubject.schoolYearId ?? '', sectionSubjectId, academicPeriodId }}
        teams={teams}
        periodShortName={academicPeriod.name.split('—')[0]?.trim() ?? academicPeriod.name}
        courseTitle={courseTitle}
        saving={domain.saving}
        initialActivityBlockId={blockId as Parameters<typeof ActivityEditorWorkspace>[0]['initialActivityBlockId']}
        initialActivityDraftId={draftId}
        planningEntryId={planningEntryId}
        creatorOrigin={origin}
        originReturnLabel={origin.label}
        onReturnToOrigin={(draftOrigin) => navigate(draftOrigin?.returnTo ?? origin.returnTo)}
        onAddActivity={persist}
        onUpdateActivity={persist}
        onGradeCreatedActivity={gradeActivity}
        onViewCreatedActivity={viewActivity}
      /> : null}
    </section>
  )
}

function resolveOrigin(state: CreatorLocationState | null, params: URLSearchParams): ActivityCreatorOrigin {
  if (state?.activityCreatorOrigin) return state.activityCreatorOrigin
  const planningEntryId = params.get('planningEntryId')
  if (planningEntryId) return { kind: 'planning', label: 'Volver a Planificación', returnTo: `/planificaciones?${new URLSearchParams({ tab: 'planificaciones', entryId: planningEntryId, academicPeriodId: params.get('academicPeriodId') ?? '' })}` }
  const courseId = params.get('returnCourseId')
  const subjectId = params.get('returnSubjectId')
  const tab = params.get('returnTab')
  if (courseId && subjectId) {
    const returnTo = `/cursos?${new URLSearchParams({ courseId, subjectId, ...(tab ? { tab } : {}) }).toString()}`
    return { kind: tab === 'estudiantes' ? 'subject-students' : 'subject-activities', label: tab === 'estudiantes' ? 'Volver a Estudiantes' : 'Volver a actividades', returnTo }
  }
  return { kind: 'activities', label: 'Volver a Actividades', returnTo: '/actividades' }
}
