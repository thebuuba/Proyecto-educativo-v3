import { BarChart3, CheckSquare, Edit3, Eye, GraduationCap, Plus, Search } from 'lucide-react'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { getActivityCenter } from '@/modules/grading/services/gradingService'
import type { ActivityCenterWorkspace, GlobalActivity } from '@/modules/grading/types'
import { competencyBlocks } from '@/modules/grading/utils/competencyGrades'
import { cn } from '@/utils/cn'

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

  return <section className="w-full min-w-0 space-y-5">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary"><CheckSquare className="size-5" /></span><div><h1 className="text-2xl font-extrabold tracking-tight">Actividades</h1><p className="mt-1 text-sm text-muted-foreground">Gestiona las actividades de tus cursos y asignaturas desde un solo lugar.</p></div></div></div>
      <Button className="h-11 px-5" onClick={() => setCreating(true)}><Plus className="size-4" /> Crear actividad</Button>
    </header>

    <div className="grid gap-2 rounded-2xl border border-border bg-card p-3 shadow-sm md:grid-cols-2 xl:grid-cols-[minmax(15rem,1.5fr)_repeat(5,minmax(9rem,1fr))]">
      <label className="relative self-end"><span className="sr-only">Buscar actividad</span><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} className="h-11 pl-9" placeholder="Buscar actividad..." /></label>
      <Filter label="Curso" value={courseId} onChange={(value) => { setCourseId(value); setSubjectId('all') }}><option value="all">Todos</option>{courses.map((course) => <option key={course.id} value={course.id}>{course.label}</option>)}</Filter>
      <Filter label="Asignatura" value={subjectId} onChange={setSubjectId}><option value="all">Todas</option>{subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.subjectName}</option>)}</Filter>
      <Filter label="Período" value={periodId} onChange={setPeriodId}><option value="all">Todos</option>{workspace.academicPeriods.map((period) => <option key={period.id} value={period.id}>{period.name}</option>)}</Filter>
      <Filter label="Bloque" value={blockId} onChange={setBlockId}><option value="all">Todos</option>{competencyBlocks.map((block) => <option key={block.id} value={block.id}>{block.shortName}</option>)}</Filter>
      <Filter label="Estado" value={status} onChange={(value) => setStatus(value as typeof status)}><option value="all">Todos</option><option value="pending">Pendientes</option><option value="partial">En evaluación</option><option value="graded">Calificadas</option></Filter>
    </div>

    {error ? <div role="alert" className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-semibold text-destructive">{error}</div> : loading ? <div role="status" className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div key={index} className="h-52 animate-pulse rounded-2xl bg-muted/60" />)}</div> : !visible.length ? <EmptyState title="No hay actividades" description={workspace.activities.length ? 'Prueba con otros filtros.' : 'Crea la primera actividad para comenzar.'} /> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{visible.map((activity) => <ActivityCard key={activity.id} activity={activity} />)}</div>}

    {!loading ? <p className="text-xs text-muted-foreground">Mostrando {visible.length} de {workspace.activities.length} actividades</p> : null}
    {creating ? <CreateActivityDialog workspace={workspace} onClose={() => setCreating(false)} /> : null}
  </section>
}

function ActivityCard({ activity }: { activity: GlobalActivity }) {
  const state = activityState(activity)
  const block = competencyBlocks.find((item) => item.id === activity.competencyBlockId)
  const primaryMode = state === 'graded' ? 'results' : 'evaluate'
  const primaryLabel = state === 'graded' ? 'Ver resultados' : 'Evaluar / calificar'
  return <article className="flex min-h-56 flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-primary/25 hover:shadow-md">
    <div className="flex items-start gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-600"><CheckSquare className="size-5" /></span><div className="min-w-0 flex-1"><h2 className="line-clamp-2 font-extrabold">{activity.name}</h2><p className="mt-1 text-xs font-bold text-primary">{activity.courseLabel}</p><p className="mt-0.5 truncate text-xs text-muted-foreground">{activity.subjectName}</p></div><ActivityBadge state={state} /></div>
    <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-muted/30 p-3 text-xs"><span><strong className="block">{activity.periodName.split('—')[0]?.trim()}</strong><span className="text-muted-foreground">{block?.shortName ?? 'Sin bloque'}</span></span><span className="text-right"><strong className="block">{activity.maxScore} puntos</strong><span className="text-muted-foreground">{activity.evaluatedCount} / {activity.studentCount} evaluados</span></span></div>
    <div className="mt-auto flex items-center justify-end gap-2 pt-4"><Link to={activityHref(activity, 'view')} className="inline-flex h-11 items-center gap-2 rounded-xl border border-border px-3 text-xs font-extrabold hover:bg-muted"><Eye className="size-4" /> Ver</Link>{state === 'pending' ? <Link to={activityHref(activity, 'edit')} aria-label={`Editar ${activity.name}`} className="grid size-11 place-items-center rounded-xl border border-border hover:bg-muted"><Edit3 className="size-4" /></Link> : null}<Link to={activityHref(activity, primaryMode)} className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-3 text-xs font-extrabold text-primary-foreground"><span className="sr-only sm:not-sr-only">{primaryLabel}</span>{state === 'graded' ? <BarChart3 className="size-4" /> : <GraduationCap className="size-4" />}</Link></div>
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
  return <Modal title="Crear actividad" description="Selecciona el contexto académico; el formulario existente completará la actividad y su instrumento." onClose={onClose} className="max-w-xl" contentClassName="p-5"><div className="grid gap-4 sm:grid-cols-2"><Filter label="Curso" value={courseId} onChange={(value) => { setCourseId(value); setSectionSubjectId(''); setAcademicPeriodId('') }}><option value="">Selecciona un curso</option>{courses.map(([id, label]) => <option key={id} value={id}>{label}</option>)}</Filter><Filter label="Asignatura" value={sectionSubjectId} onChange={(value) => { setSectionSubjectId(value); setAcademicPeriodId('') }}><option value="">Selecciona una asignatura</option>{subjects.map((item) => <option key={item.id} value={item.id}>{item.subjectName}</option>)}</Filter><Filter label="Período" value={academicPeriodId} onChange={setAcademicPeriodId}><option value="">Selecciona un período</option>{periods.map((period) => <option key={period.id} value={period.id}>{period.name}</option>)}</Filter><Filter label="Bloque de competencias" value={competencyBlockId} onChange={setCompetencyBlockId}><option value="">Selecciona un bloque</option>{competencyBlocks.map((block) => <option key={block.id} value={block.id}>{block.shortName} · {block.name}</option>)}</Filter></div><div className="mt-5 flex justify-end gap-2 border-t border-border pt-4"><Button variant="outline" onClick={onClose}>Cancelar</Button><Button disabled={!ready} onClick={() => navigate(`/calificaciones?${new URLSearchParams({ sectionSubjectId, academicPeriodId, action: 'create-activity', competencyBlockId, origin: 'activities' }).toString()}`)}><Plus className="size-4" /> Continuar</Button></div></Modal>
}

function Filter({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: ReactNode }) { return <label className="grid min-w-0 gap-1 text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground">{label}<select value={value} onChange={(event) => onChange(event.target.value)} className="h-11 min-w-0 rounded-xl border border-border bg-card px-3 text-sm font-bold normal-case tracking-normal text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{children}</select></label> }
function activityState(activity: GlobalActivity): ActivityState { return activity.evaluatedCount === 0 ? 'pending' : activity.studentCount > 0 && activity.evaluatedCount >= activity.studentCount ? 'graded' : 'partial' }
function ActivityBadge({ state }: { state: ActivityState }) { const label = state === 'graded' ? 'Calificada' : state === 'partial' ? 'En evaluación' : 'Pendiente'; return <span className={cn('shrink-0 rounded-full px-2.5 py-1 text-[10px] font-extrabold', state === 'graded' ? 'bg-emerald-50 text-emerald-700' : state === 'partial' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600')}>{label}</span> }
function activityHref(activity: GlobalActivity, mode: 'view' | 'edit' | 'evaluate' | 'results') { return `/calificaciones?${new URLSearchParams({ sectionSubjectId: activity.sectionSubjectId, academicPeriodId: activity.academicPeriodId, activityId: activity.id, activityMode: mode, origin: 'activities' }).toString()}` }
