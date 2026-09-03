import { BarChart3, CheckSquare, Edit3, Eye, GraduationCap, Plus, Search } from 'lucide-react'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import {
  FeedbackBanner,
  FilterBar,
  PageHero,
  ProgressIndicator,
  StatusBadge,
  type SemanticTone,
} from '@/components/ui/SemanticUI'
import { getActivityCenter } from '@/modules/grading/services/gradingService'
import type { ActivityCenterWorkspace, GlobalActivity } from '@/modules/grading/types'
import { competencyBlocks } from '@/modules/grading/utils/competencyGrades'

type ActivityState = 'pending' | 'partial' | 'graded'
const emptyWorkspace: ActivityCenterWorkspace = { sectionSubjects: [], academicPeriods: [], activities: [] }

export function ActivitiesPage() {
  const [workspace, setWorkspace] = useState(emptyWorkspace)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [courseId, setCourseId] = useState('all')
  const [subjectId, setSubjectId] = useState('all')
  const [periodId, setPeriodId] = useState('all')
  const [blockId, setBlockId] = useState('all')
  const [status, setStatus] = useState<'all' | ActivityState>('all')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    let active = true
    getActivityCenter()
      .then((data) => { if (active) setWorkspace(data) })
      .catch((reason) => { if (active) setError(reason instanceof Error ? reason.message : 'No se pudieron cargar las actividades.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const courses = useMemo(() => Array.from(new Map(workspace.sectionSubjects.map((item) => [
    item.sectionId ?? item.id,
    { id: item.sectionId ?? item.id, label: `${item.gradeName} ${item.sectionName}` },
  ])).values()), [workspace.sectionSubjects])
  const subjects = workspace.sectionSubjects.filter((item) => courseId === 'all' || item.sectionId === courseId)
  const visible = workspace.activities.filter((activity) => {
    const text = `${activity.name} ${activity.courseLabel} ${activity.subjectName}`.toLocaleLowerCase('es')
    return (!query.trim() || text.includes(query.trim().toLocaleLowerCase('es')))
      && (courseId === 'all' || activity.courseId === courseId)
      && (subjectId === 'all' || activity.sectionSubjectId === subjectId)
      && (periodId === 'all' || activity.academicPeriodId === periodId)
      && (blockId === 'all' || activity.competencyBlockId === blockId)
      && (status === 'all' || activityState(activity) === status)
  })

  const statusCounts = useMemo(() => ({
    all: workspace.activities.length,
    pending: workspace.activities.filter((activity) => activityState(activity) === 'pending').length,
    partial: workspace.activities.filter((activity) => activityState(activity) === 'partial').length,
    graded: workspace.activities.filter((activity) => activityState(activity) === 'graded').length,
  }), [workspace.activities])

  return <section className="w-full min-w-0 space-y-4 pb-8">
    <PageHero
      title="Actividades"
      description="Gestiona, evalúa y consulta las actividades de tus cursos desde un mismo lugar."
      icon={CheckSquare}
      tone="warning"
      actions={<Button onClick={() => setCreating(true)}><Plus className="size-4" /> Crear actividad</Button>}
    >
      <div className="flex flex-wrap gap-2">
        <StatusBadge tone="warning">{statusCounts.pending} pendientes</StatusBadge>
        <StatusBadge tone="info">{statusCounts.partial} en evaluación</StatusBadge>
        <StatusBadge tone="success">{statusCounts.graded} calificadas</StatusBadge>
      </div>
    </PageHero>

    <FilterBar>
      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-[minmax(18rem,1.6fr)_repeat(4,minmax(9rem,1fr))]">
        <label className="relative self-end">
          <span className="sr-only">Buscar actividad</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} className="h-11 pl-9" placeholder="Buscar actividad..." />
        </label>
        <Filter label="Curso" value={courseId} onChange={(value) => { setCourseId(value); setSubjectId('all') }}>
          <option value="all">Todos</option>{courses.map((course) => <option key={course.id} value={course.id}>{course.label}</option>)}
        </Filter>
        <Filter label="Asignatura" value={subjectId} onChange={setSubjectId}>
          <option value="all">Todas</option>{subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.subjectName}</option>)}
        </Filter>
        <Filter label="Período" value={periodId} onChange={setPeriodId}>
          <option value="all">Todos</option>{workspace.academicPeriods.map((period) => <option key={period.id} value={period.id}>{period.name}</option>)}
        </Filter>
        <Filter label="Bloque" value={blockId} onChange={setBlockId}>
          <option value="all">Todos</option>{competencyBlocks.map((block) => <option key={block.id} value={block.id}>{block.shortName}</option>)}
        </Filter>
      </div>

      <div className="mt-3 flex flex-col gap-3 border-t border-border/60 pt-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-0.5">
          <StatusFilter active={status === 'all'} label="Todas" count={statusCounts.all} tone="neutral" onClick={() => setStatus('all')} />
          <StatusFilter active={status === 'pending'} label="Pendientes" count={statusCounts.pending} tone="warning" onClick={() => setStatus('pending')} />
          <StatusFilter active={status === 'partial'} label="En evaluación" count={statusCounts.partial} tone="info" onClick={() => setStatus('partial')} />
          <StatusFilter active={status === 'graded'} label="Calificadas" count={statusCounts.graded} tone="success" onClick={() => setStatus('graded')} />
        </div>
        {!loading ? <p className="shrink-0 text-xs font-semibold text-muted-foreground">{visible.length} de {workspace.activities.length} actividades</p> : null}
      </div>
    </FilterBar>

    {error ? (
      <FeedbackBanner role="alert" tone="danger">{error}</FeedbackBanner>
    ) : loading ? (
      <div role="status" className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => <div key={index} className="h-56 animate-pulse rounded-3xl bg-card/70" />)}
      </div>
    ) : !visible.length ? (
      <EmptyState title="No hay actividades" description={workspace.activities.length ? 'Prueba con otros filtros.' : 'Crea la primera actividad para comenzar.'} icon={CheckSquare} tone="warning" />
    ) : (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((activity) => <ActivityCard key={activity.id} activity={activity} />)}
      </div>
    )}

    {creating ? <CreateActivityDialog workspace={workspace} onClose={() => setCreating(false)} /> : null}
  </section>
}

function ActivityCard({ activity }: { activity: GlobalActivity }) {
  const state = activityState(activity)
  const block = competencyBlocks.find((item) => item.id === activity.competencyBlockId)
  const primaryMode = state === 'graded' ? 'results' : 'evaluate'
  const primaryLabel = state === 'graded' ? 'Ver resultados' : 'Evaluar / calificar'
  const progress = activity.studentCount > 0 ? Math.min(100, Math.round((activity.evaluatedCount / activity.studentCount) * 100)) : 0
  const tone = activityTone(state)

  return <article className="group flex min-h-[15rem] flex-col rounded-3xl bg-card p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
    <div className="flex items-start gap-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h2 className="line-clamp-2 text-[15px] font-extrabold leading-snug text-foreground">{activity.name}</h2>
          <ActivityBadge state={state} />
        </div>
        <p className="mt-1 text-xs font-extrabold text-primary-variant">{activity.courseLabel}</p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{activity.subjectName}</p>
      </div>
    </div>

    <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-muted-foreground">
      <span className="rounded-full bg-muted/70 px-2.5 py-1 text-foreground">{activity.periodName.split('—')[0]?.trim()}</span>
      <span className="rounded-full bg-muted/70 px-2.5 py-1 text-foreground">{block?.shortName ?? 'Sin bloque'}</span>
      <span className="ml-auto rounded-full bg-primary/10 px-2.5 py-1 font-extrabold text-foreground">{activity.maxScore} pts</span>
    </div>

    <div className="mt-4">
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="font-semibold text-muted-foreground">{activity.evaluatedCount} de {activity.studentCount} evaluados</span>
        <span className="font-extrabold text-foreground">{progress}%</span>
      </div>
      <ProgressIndicator value={progress} tone={tone} className="mt-2" />
    </div>

    <div className="mt-auto flex items-center gap-3 pt-5">
      <Link to={activityHref(activity, 'view')} className="inline-flex h-9 items-center gap-1.5 text-xs font-extrabold text-muted-foreground transition hover:text-foreground">
        <Eye className="size-4" /> Ver
      </Link>
      {state === 'pending' ? (
        <Link to={activityHref(activity, 'edit')} aria-label={`Editar ${activity.name}`} className="inline-flex h-9 items-center gap-1.5 text-xs font-extrabold text-muted-foreground transition hover:text-foreground">
          <Edit3 className="size-4" /> Editar
        </Link>
      ) : null}
      <Link to={activityHref(activity, primaryMode)} className="ml-auto inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-3.5 text-xs font-extrabold text-primary-foreground shadow-sm transition hover:bg-primary-hover">
        {state === 'graded' ? <BarChart3 className="size-4" /> : <GraduationCap className="size-4" />}
        {primaryLabel}
      </Link>
    </div>
  </article>
}

function CreateActivityDialog({ workspace, onClose }: { workspace: ActivityCenterWorkspace; onClose: () => void }) {
  const navigate = useNavigate()
  const [courseId, setCourseId] = useState('')
  const [sectionSubjectId, setSectionSubjectId] = useState('')
  const selectedSubject = workspace.sectionSubjects.find((item) => item.id === sectionSubjectId)
  const periods = workspace.academicPeriods.filter((item) => !selectedSubject?.schoolYearId || item.schoolYearId === selectedSubject.schoolYearId)
  const [academicPeriodId, setAcademicPeriodId] = useState('')
  const [competencyBlockId, setCompetencyBlockId] = useState('')
  const courses = Array.from(new Map(workspace.sectionSubjects.map((item) => [item.sectionId ?? item.id, `${item.gradeName} ${item.sectionName}`])).entries())
  const subjects = workspace.sectionSubjects.filter((item) => item.sectionId === courseId)
  const ready = sectionSubjectId && academicPeriodId && competencyBlockId

  return <Modal title="Crear actividad" description="Selecciona el contexto académico; el formulario existente completará la actividad y su instrumento." onClose={onClose} className="max-w-xl" contentClassName="p-5">
    <div className="grid gap-4 sm:grid-cols-2">
      <Filter label="Curso" value={courseId} onChange={(value) => { setCourseId(value); setSectionSubjectId(''); setAcademicPeriodId('') }}><option value="">Selecciona un curso</option>{courses.map(([id, label]) => <option key={id} value={id}>{label}</option>)}</Filter>
      <Filter label="Asignatura" value={sectionSubjectId} onChange={(value) => { setSectionSubjectId(value); setAcademicPeriodId('') }}><option value="">Selecciona una asignatura</option>{subjects.map((item) => <option key={item.id} value={item.id}>{item.subjectName}</option>)}</Filter>
      <Filter label="Período" value={academicPeriodId} onChange={setAcademicPeriodId}><option value="">Selecciona un período</option>{periods.map((period) => <option key={period.id} value={period.id}>{period.name}</option>)}</Filter>
      <Filter label="Bloque de competencias" value={competencyBlockId} onChange={setCompetencyBlockId}><option value="">Selecciona un bloque</option>{competencyBlocks.map((block) => <option key={block.id} value={block.id}>{block.shortName} · {block.name}</option>)}</Filter>
    </div>
    <div className="mt-5 flex justify-end gap-2 border-t border-border pt-4">
      <Button variant="outline" onClick={onClose}>Cancelar</Button>
      <Button disabled={!ready} onClick={() => navigate(`/calificaciones?${new URLSearchParams({ sectionSubjectId, academicPeriodId, action: 'create-activity', competencyBlockId, origin: 'activities' }).toString()}`)}><Plus className="size-4" /> Continuar</Button>
    </div>
  </Modal>
}

function Filter({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: ReactNode }) {
  return <label className="grid min-w-0 gap-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-muted-foreground">
    {label}
    <select value={value} onChange={(event) => onChange(event.target.value)} className="h-11 min-w-0 rounded-xl border border-border bg-card px-3 text-sm font-bold normal-case tracking-normal text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      {children}
    </select>
  </label>
}

function StatusFilter({ active, label, count, tone, onClick }: { active: boolean; label: string; count: number; tone: SemanticTone; onClick: () => void }) {
  return <button onClick={onClick} className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-extrabold transition ${active ? 'border-primary/25 bg-primary/10 text-foreground' : 'border-border bg-card text-muted-foreground hover:bg-muted'}`}>
    <span className="inline-flex items-center gap-1.5"><StatusBadge tone={tone} dot className="h-5 bg-transparent px-0">{label}</StatusBadge><span className="opacity-60">{count}</span></span>
  </button>
}

function activityState(activity: GlobalActivity): ActivityState {
  return activity.evaluatedCount === 0 ? 'pending' : activity.studentCount > 0 && activity.evaluatedCount >= activity.studentCount ? 'graded' : 'partial'
}

function activityTone(state: ActivityState): SemanticTone {
  return state === 'graded' ? 'success' : state === 'partial' ? 'info' : 'warning'
}

function ActivityBadge({ state }: { state: ActivityState }) {
  const label = state === 'graded' ? 'Calificada' : state === 'partial' ? 'En evaluación' : 'Pendiente'
  return <StatusBadge tone={activityTone(state)}>{label}</StatusBadge>
}

function activityHref(activity: GlobalActivity, mode: 'view' | 'edit' | 'evaluate' | 'results') {
  return `/calificaciones?${new URLSearchParams({ sectionSubjectId: activity.sectionSubjectId, academicPeriodId: activity.academicPeriodId, activityId: activity.id, activityMode: mode, origin: 'activities' }).toString()}`
}
