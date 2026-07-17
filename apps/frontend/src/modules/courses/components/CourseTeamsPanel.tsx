import {
  Archive,
  ArrowDown,
  ArrowLeft,
  ArrowDownAZ,
  Atom,
  BarChart3,
  BookOpenCheck,
  CalendarRange,
  Check,
  ChevronDown,
  ClipboardList,
  Clock3,
  Eye,
  Edit3,
  FlaskConical,
  GraduationCap,
  ListPlus,
  Lightbulb,
  MoreVertical,
  Search,
  Star,
  Upload,
  UserRoundPlus,
  Users,
  UsersRound,
  Telescope,
  Trophy,
  X,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import {
  archiveCourseTeam,
  createCourseTeam,
  getCourseTeams,
  updateCourseTeam,
} from '@/modules/courses/services/coursesService'
import type { CourseTeam, CourseTeamInput } from '@/modules/courses/types'
import type { StudentAttendanceRow } from '@/modules/attendance/types'
import { cn } from '@/utils/cn'

const colors = ['#5b35e5', '#2563eb', '#0ea5a8', '#16a34a', '#f59e0b', '#e83e73', '#ef4444']
const teamIcons = ['flask', 'telescope', 'atom', 'users', 'star', 'lightbulb', 'trophy'] as const
const roles = ['Coordinador', 'Secretario', 'Investigador', 'Expositor', 'Diseñador']

export function CourseTeamsPanel({
  sectionSubjectId,
  students,
  canManage,
  onSummaryChange,
}: {
  sectionSubjectId: string | null
  students: StudentAttendanceRow[]
  canManage: boolean
  onSummaryChange?: (summary: { teams: number; assignedStudents: number }) => void
}) {
  const [teams, setTeams] = useState<CourseTeam[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'permanent' | 'temporary' | 'with-members' | 'empty'>('all')
  const [sort, setSort] = useState<'current' | 'name' | 'members'>('current')
  const [sortOpen, setSortOpen] = useState(false)
  const sortMenuRef = useRef<HTMLDivElement>(null)
  const [menuTeamId, setMenuTeamId] = useState<string | null>(null)
  const [guideOpen, setGuideOpen] = useState(false)
  const [editing, setEditing] = useState<CourseTeam | 'new' | null>(null)
  const [archiveTarget, setArchiveTarget] = useState<CourseTeam | null>(null)

  const loadTeams = useCallback(async () => {
    if (!sectionSubjectId) {
      setTeams([])
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      setTeams(await getCourseTeams(sectionSubjectId))
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudieron cargar los equipos.')
    } finally {
      setLoading(false)
    }
  }, [sectionSubjectId])

  useEffect(() => {
    void loadTeams()
  }, [loadTeams])

  useEffect(() => {
    if (!sortOpen) return
    const close = (event: PointerEvent) => {
      if (!sortMenuRef.current?.contains(event.target as Node)) setSortOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSortOpen(false)
    }
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', close)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [sortOpen])

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('es')
    const result = teams.filter((team) => {
      const matchesType = filter === 'all'
        || (filter === 'permanent' && team.teamType === 'permanent')
        || (filter === 'temporary' && team.teamType === 'temporary')
        || (filter === 'with-members' && team.members.length > 0)
        || (filter === 'empty' && team.members.length === 0)
      const matchesQuery = !normalized || team.name.toLocaleLowerCase('es').includes(normalized)
        || team.members.some(({ enrollment }) =>
          `${enrollment.student.firstName} ${enrollment.student.lastName}`.toLocaleLowerCase('es').includes(normalized))
      return matchesType && matchesQuery
    })
    if (sort === 'name') return result.sort((a, b) => a.name.localeCompare(b.name, 'es'))
    if (sort === 'members') return result.sort((a, b) => b.members.length - a.members.length)
    return result
  }, [filter, query, sort, teams])

  const assigned = useMemo(() => new Set(
    teams.filter((team) => team.teamType === 'permanent')
      .flatMap((team) => team.members.map((member) => member.enrollmentId)),
  ), [teams])
  const unassignedStudents = students.filter((student) => !assigned.has(student.enrollmentId))
  const permanentTeams = teams.filter((team) => team.teamType === 'permanent').length
  const temporaryTeams = teams.length - permanentTeams

  useEffect(() => {
    if (!loading && !error) onSummaryChange?.({ teams: teams.length, assignedStudents: assigned.size })
  }, [assigned, error, loading, onSummaryChange, teams.length])

  if (!sectionSubjectId) {
    return <PanelMessage text="Selecciona una asignatura para organizar sus equipos de trabajo." />
  }

  if (editing) {
    return <TeamEditorScreen team={editing === 'new' ? null : editing} students={students} onClose={() => setEditing(null)} onSave={async (input) => {
      if (editing === 'new') await createCourseTeam(sectionSubjectId, input)
      else await updateCourseTeam(editing.id, input)
      setEditing(null)
      await loadTeams()
    }} />
  }

  return (
    <section className="space-y-4">
      {!loading && teams.length > 0 ? <>
      <header className="flex items-center justify-between gap-4">
        <div className="min-w-0"><h2 className="text-xl font-extrabold tracking-tight">Equipos de trabajo</h2><p className="mt-0.5 text-xs text-muted-foreground">{permanentTeams} permanentes · {temporaryTeams} temporales</p></div>
        {canManage ? <button type="button" onClick={() => setEditing('new')} className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-extrabold text-white shadow-md shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90"><UserRoundPlus className="size-4" /> Crear equipo</button> : null}
      </header>

      <div className="rounded-xl border border-border/80 bg-card p-2.5 shadow-[0_4px_16px_rgba(15,23,42,0.05)]">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="relative min-w-0 xl:w-[25rem]">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar equipo o estudiante…"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5 rounded-xl bg-slate-50/80 p-1">
            {([['all', 'Todos'], ['permanent', 'Permanentes'], ['temporary', 'Temporales'], ['with-members', 'Con integrantes'], ['empty', 'Sin integrantes']] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={cn('rounded-lg px-3.5 py-2 text-xs font-extrabold transition-all', filter === value ? 'bg-primary text-white shadow-md shadow-primary/15' : 'text-slate-500 hover:bg-white hover:text-primary hover:shadow-sm')}
              >
                {label}
              </button>
            ))}
          </div>
          <div ref={sortMenuRef} className="relative shrink-0">
            <button type="button" aria-haspopup="listbox" aria-expanded={sortOpen} onClick={() => setSortOpen((current) => !current)} className={cn('flex h-11 min-w-48 items-center gap-3 rounded-xl border bg-white px-3.5 text-left transition', sortOpen ? 'border-primary ring-4 ring-primary/10' : 'border-slate-200 hover:border-slate-300 hover:shadow-sm')}>
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary/8 text-primary"><ArrowDownAZ className="size-4" /></span><span className="min-w-0 flex-1"><span className="block text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground">Ordenar por</span><span className="block truncate text-xs font-extrabold">{sort === 'current' ? 'Orden actual' : sort === 'name' ? 'Nombre A-Z' : 'Más integrantes'}</span></span><ChevronDown className={cn('size-4 text-muted-foreground transition-transform', sortOpen && 'rotate-180')} />
            </button>
            {sortOpen ? <div role="listbox" aria-label="Ordenar equipos" className="absolute right-0 top-[calc(100%+0.5rem)] z-30 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_18px_45px_rgba(15,23,42,0.16)]">{([['current', 'Orden actual', 'Mantiene la organización'], ['name', 'Nombre A-Z', 'Orden alfabético'], ['members', 'Más integrantes', 'Mayor cantidad primero']] as const).map(([value, label, detail]) => <button key={value} type="button" role="option" aria-selected={sort === value} onClick={() => { setSort(value); setSortOpen(false) }} className={cn('flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-slate-50', sort === value && 'bg-primary/5')}><span className={cn('flex size-5 items-center justify-center rounded-full border', sort === value ? 'border-primary bg-primary text-white' : 'border-slate-200')}>{sort === value ? <Check className="size-3" /> : null}</span><span><span className="block text-xs font-extrabold">{label}</span><span className="block text-[10px] text-muted-foreground">{detail}</span></span></button>)}</div> : null}
          </div>
        </div>
      </div>
      </> : null}

      {error ? <PanelMessage text={error} destructive /> : loading ? (
        <PanelMessage text="Cargando equipos…" />
      ) : filtered.length ? (
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
          {filtered.map((team) => (
            <article key={team.id} className="relative overflow-visible rounded-2xl border border-border bg-card shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
              <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl" style={{ backgroundColor: team.color }} />
              <div className="p-4 pt-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${team.color}18`, color: team.color }}>
                      <TeamIcon name={team.icon} className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-extrabold text-foreground">{team.name}</h3>
                      <span className="mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-extrabold" style={{ backgroundColor: `${team.color}14`, color: team.color }}>{team.teamType === 'permanent' ? 'Permanente' : 'Temporal'}</span>
                    </div>
                  </div>
                  {canManage ? (
                    <div className="relative">
                      <button type="button" onClick={() => setMenuTeamId((current) => current === team.id ? null : team.id)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted" aria-label={`Opciones de ${team.name}`}><MoreVertical className="size-4" /></button>
                      {menuTeamId === team.id ? <div className="absolute right-0 top-8 z-20 w-44 rounded-xl border border-border bg-card p-1.5 shadow-xl"><button type="button" onClick={() => { setEditing(team); setMenuTeamId(null) }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold hover:bg-muted"><Edit3 className="size-3.5" /> Editar equipo</button><button type="button" onClick={() => { setArchiveTarget(team); setMenuTeamId(null) }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-destructive hover:bg-destructive/10"><Archive className="size-3.5" /> Archivar equipo</button></div> : null}
                    </div>
                  ) : null}
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold"><Users className="size-4 text-muted-foreground" /> {team.members.length} integrantes</div>
                {team.description ? <p className="mt-3 line-clamp-2 min-h-9 text-xs leading-5 text-muted-foreground">{team.description}</p> : <p className="mt-3 min-h-9 text-xs leading-5 text-muted-foreground">Equipo de trabajo de la asignatura.</p>}
                {team.endsAt ? <div className="mt-3 rounded-lg px-3 py-2 text-xs font-semibold" style={{ backgroundColor: `${team.color}0D`, color: team.color }}><CalendarRange className="mr-1.5 inline size-3.5" />Hasta {new Date(team.endsAt).toLocaleDateString('es-DO')}</div> : null}
                <p className="mt-4 text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground">Integrantes</p>
                <div className="mt-2 flex min-h-8 -space-x-2">
                  {team.members.slice(0, 6).map(({ id, enrollment }) => (
                    <span key={id} title={`${enrollment.student.firstName} ${enrollment.student.lastName}`} className="flex size-8 items-center justify-center rounded-full border-2 border-card text-[10px] font-extrabold text-white" style={{ backgroundColor: team.color }}>
                      {enrollment.student.firstName.charAt(0)}{enrollment.student.lastName.charAt(0)}
                    </span>
                  ))}
                  {team.members.length > 6 ? <span className="flex size-8 items-center justify-center rounded-full border-2 border-card bg-muted text-[10px] font-bold">+{team.members.length - 6}</span> : null}
                  {!team.members.length ? <span className="text-xs text-muted-foreground">Sin estudiantes asignados</span> : null}
                </div>
              </div>
              <button type="button" onClick={() => canManage && setEditing(team)} disabled={!canManage} className="flex w-full items-center justify-center gap-2 rounded-b-2xl border-t border-border px-4 py-3 text-xs font-extrabold transition hover:bg-muted disabled:cursor-default" style={{ color: team.color }}><Eye className="size-3.5" /> Ver equipo</button>
            </article>
          ))}
        </div>
      ) : teams.length ? (
        <div className="rounded-2xl border border-slate-200 bg-card px-6 py-12 text-center shadow-sm"><span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/8 text-primary"><Search className="size-6" /></span><h3 className="mt-4 text-lg font-extrabold">No encontramos coincidencias</h3><p className="mt-2 text-sm text-muted-foreground">Prueba con otro nombre, estudiante o tipo de equipo.</p></div>
      ) : (
        <EmptyTeamsState canManage={canManage} onCreate={() => setEditing('new')} onOpenGuide={() => setGuideOpen(true)} />
      )}

      {!loading && !error && teams.length > 0 ? (
        <div className="grid gap-4 xl:grid-cols-[1fr_1.15fr]">
          <div className="rounded-2xl border border-slate-200 bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600"><GraduationCap className="size-4" /></span><div><h3 className="text-sm font-extrabold">Estudiantes sin equipo</h3><p className="text-[10px] text-muted-foreground">Pendientes de asignación permanente</p></div></div><span className="flex min-w-8 items-center justify-center rounded-full bg-orange-50 px-2.5 py-1 text-xs font-extrabold text-orange-600">{unassignedStudents.length}</span></div>
            {unassignedStudents.length ? <div className="mt-4 flex flex-wrap gap-2.5 border-t border-slate-100 pt-4">{unassignedStudents.slice(0, 8).map((student) => <span key={student.enrollmentId} className="inline-flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50/80 py-1.5 pl-1.5 pr-3 text-xs font-bold transition hover:border-primary/20 hover:bg-primary/[0.03]"><span className="flex size-7 items-center justify-center rounded-full bg-white text-[10px] font-extrabold text-primary shadow-sm">{student.firstName.charAt(0)}{student.lastName.charAt(0)}</span>{student.firstName} {student.lastName}</span>)}{unassignedStudents.length > 8 ? <span className="self-center text-xs font-bold text-primary">+{unassignedStudents.length - 8} más</span> : null}</div> : <p className="mt-4 border-t border-slate-100 pt-4 text-sm text-muted-foreground">Todos los estudiantes pertenecen a un equipo permanente.</p>}
          </div>
          {canManage ? <div className="rounded-2xl border border-slate-200 bg-card p-5 shadow-sm"><div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-primary"><ListPlus className="size-4" /></span><div><h3 className="text-sm font-extrabold">Acciones rápidas</h3><p className="text-[10px] text-muted-foreground">Organiza el curso en menos pasos</p></div></div><div className="mt-4 grid gap-2.5 border-t border-slate-100 pt-4 sm:grid-cols-3">
            <QuickAction icon={<UserRoundPlus className="size-4" />} title="Asignar estudiantes" detail="Editar un equipo" onClick={() => teams[0] && setEditing(teams[0])} disabled={!teams.length} />
            <QuickAction icon={<ListPlus className="size-4" />} title="Crear desde lista" detail="Seleccionar integrantes" onClick={() => setEditing('new')} />
            <QuickAction icon={<Upload className="size-4" />} title="Importar equipos" detail="Próximamente" disabled />
          </div></div> : null}
        </div>
      ) : null}

      {archiveTarget ? (
        <ConfirmDialog
          title="Archivar equipo"
          description={`El equipo “${archiveTarget.name}” dejará de estar activo, pero se conservará su historial.`}
          confirmLabel="Archivar"
          destructive
          onClose={() => setArchiveTarget(null)}
          onConfirm={async () => {
            await archiveCourseTeam(archiveTarget.id)
            setArchiveTarget(null)
            await loadTeams()
          }}
        />
      ) : null}
      {guideOpen ? <TeamQuickGuide onClose={() => setGuideOpen(false)} /> : null}
    </section>
  )
}

function EmptyTeamsState({ canManage, onCreate, onOpenGuide }: { canManage: boolean; onCreate: () => void; onOpenGuide: () => void }) {
  return <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-5 pb-4 pt-8 shadow-sm sm:px-8">
    <div className="pointer-events-none absolute left-1/2 top-8 size-32 -translate-x-1/2 rounded-full bg-primary/[0.035] blur-2xl" />
    <div className="relative text-center">
      <div className="relative mx-auto flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 text-primary shadow-inner"><UsersRound className="size-10" /><span className="absolute -left-5 top-3 size-2 rounded-full border-2 border-emerald-400 bg-white" /><span className="absolute -right-5 top-5 size-2 rotate-45 border-2 border-violet-400 bg-white" /><span className="absolute -right-8 -top-1 text-sm font-black text-orange-400">△</span><span className="absolute -left-8 -top-1 text-sm text-blue-300">✦</span></div>
      <h3 className="mt-5 text-lg font-extrabold tracking-tight">Aún no tienes equipos creados</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Crea tu primer equipo y comienza a organizar a tus estudiantes<br className="hidden sm:block" /> para proyectos, actividades y evaluaciones colaborativas.</p>
      {canManage ? <button type="button" onClick={onCreate} className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-extrabold text-white shadow-md shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90"><UserRoundPlus className="size-4" /> Crear primer equipo</button> : null}
    </div>

    <div className="relative mx-auto mt-8 grid max-w-6xl gap-3 md:grid-cols-3">
      <EmptyBenefit icon={<ClipboardList className="size-5" />} tone="emerald" title="Organiza mejor tu clase" text="Agrupa estudiantes para trabajar en proyectos y actividades colaborativas." />
      <EmptyBenefit icon={<Clock3 className="size-5" />} tone="violet" title="Ahorra tiempo" text="Reutiliza los mismos equipos en diferentes actividades durante el año escolar." />
      <EmptyBenefit icon={<GraduationCap className="size-5" />} tone="orange" title="Evalúa por equipos" text="Asigna actividades y registra calificaciones grupales fácilmente." />
    </div>

    <div className="relative mt-5 flex flex-col gap-3 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50/90 to-indigo-50/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"><p className="flex items-start gap-2 text-xs leading-5 text-blue-700"><Lightbulb className="mt-0.5 size-4 shrink-0" /><span><strong>Consejo:</strong> Puedes crear equipos permanentes que duren todo el año o temporales para actividades específicas.</span></p><button type="button" onClick={onOpenGuide} className="inline-flex shrink-0 items-center gap-2 self-end text-xs font-extrabold text-primary transition hover:gap-3 sm:self-auto">Ver guía rápida <ArrowLeft className="size-3.5 rotate-180" /></button></div>
  </div>
}

function EmptyBenefit({ icon, tone, title, text }: { icon: ReactNode; tone: 'emerald' | 'violet' | 'orange'; title: string; text: string }) {
  const tones = { emerald: 'bg-emerald-50 text-emerald-600', violet: 'bg-violet-50 text-violet-600', orange: 'bg-orange-50 text-orange-600' }
  return <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><span className={cn('flex size-10 shrink-0 items-center justify-center rounded-xl', tones[tone])}>{icon}</span><span><strong className="block text-xs font-extrabold">{title}</strong><span className="mt-1 block text-[10px] leading-4 text-muted-foreground">{text}</span></span></div>
}

function TeamQuickGuide({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  const steps = [
    { icon: <UsersRound className="size-6" />, title: 'Crear equipo', detail: 'Define su nombre, color y tipo.', tone: 'bg-blue-50 text-blue-600' },
    { icon: <UserRoundPlus className="size-6" />, title: 'Agregar estudiantes', detail: 'Selecciona a quienes lo integrarán.', tone: 'bg-emerald-50 text-emerald-600' },
    { icon: <BookOpenCheck className="size-6" />, title: 'Crear actividad grupal', detail: 'Asigna una actividad al equipo.', tone: 'bg-violet-50 text-violet-600' },
    { icon: <Star className="size-6" />, title: 'Evaluar', detail: 'Registra el desempeño colaborativo.', tone: 'bg-amber-50 text-amber-600' },
    { icon: <BarChart3 className="size-6" />, title: 'Calificaciones', detail: 'Consulta los resultados obtenidos.', tone: 'bg-cyan-50 text-cyan-600' },
  ]
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><section role="dialog" aria-modal="true" aria-labelledby="team-guide-title" className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl border border-white/60 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.28)]"><header className="flex items-start justify-between border-b border-slate-100 px-6 py-5"><div><span className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary/8 text-primary"><Lightbulb className="size-5" /></span><h2 id="team-guide-title" className="text-xl font-extrabold">Guía rápida de equipos</h2><p className="mt-1 text-xs text-muted-foreground">Del equipo a las calificaciones, paso a paso.</p></div><button type="button" onClick={onClose} aria-label="Cerrar guía rápida" className="rounded-xl p-2 text-muted-foreground transition hover:bg-slate-100 hover:text-foreground"><X className="size-5" /></button></header><div className="px-6 py-5">{steps.map((step, index) => <div key={step.title}><div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5"><span className={cn('flex size-12 shrink-0 items-center justify-center rounded-2xl', step.tone)}>{step.icon}</span><span><span className="block text-sm font-extrabold">{step.title}</span><span className="mt-0.5 block text-xs text-muted-foreground">{step.detail}</span></span><span className="ml-auto flex size-6 items-center justify-center rounded-full bg-white text-[10px] font-extrabold text-primary shadow-sm">{index + 1}</span></div>{index < steps.length - 1 ? <div className="flex h-7 items-center justify-center text-slate-300"><ArrowDown className="size-4" /></div> : null}</div>)}</div><footer className="border-t border-slate-100 bg-slate-50/70 px-6 py-4"><button type="button" onClick={onClose} className="h-11 w-full rounded-xl bg-primary text-sm font-extrabold text-white shadow-md shadow-primary/20 transition hover:bg-primary/90">Entendido</button></footer></section></div>
}

export function TeamEditor({ team, students, onClose, onSave }: {
  team: CourseTeam | null
  students: StudentAttendanceRow[]
  onClose: () => void
  onSave: (input: CourseTeamInput) => Promise<void>
}) {
  const [name, setName] = useState(team?.name ?? '')
  const [teamType, setTeamType] = useState<'permanent' | 'temporary'>(team?.teamType ?? 'permanent')
  const [color, setColor] = useState(team?.color ?? colors[0])
  const [description, setDescription] = useState(team?.description ?? '')
  const [endsAt, setEndsAt] = useState(team?.endsAt?.slice(0, 10) ?? '')
  const [selected, setSelected] = useState<Record<string, string>>(() => Object.fromEntries(team?.members.map((member) => [member.enrollmentId, member.role ?? '']) ?? []))
  const [query, setQuery] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const available = students.filter((student) => `${student.firstName} ${student.lastName} ${student.studentCode}`.toLocaleLowerCase('es').includes(query.toLocaleLowerCase('es')))

  async function submit() {
    if (!name.trim()) {
      setError('Escribe el nombre del equipo.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await onSave({
        name: name.trim(), color, icon: 'users', description: description.trim(), teamType,
        endsAt: teamType === 'temporary' && endsAt ? endsAt : null,
        members: Object.entries(selected).map(([enrollmentId, role]) => ({ enrollmentId, role: role || undefined })),
      })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo guardar el equipo.')
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/45 backdrop-blur-[2px]" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <aside className="flex h-full w-full max-w-3xl flex-col bg-background shadow-2xl">
        <header className="flex items-start justify-between border-b border-border px-6 py-5">
          <div><h2 className="text-xl font-extrabold">{team ? 'Editar equipo' : 'Crear equipo'}</h2><p className="mt-1 text-sm text-muted-foreground">Organiza integrantes, identidad y vigencia del equipo.</p></div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><X className="size-5" /></button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_16rem]">
            <div className="space-y-5">
              <label className="block text-sm font-bold">Nombre del equipo<input value={name} onChange={(event) => setName(event.target.value)} maxLength={120} className="mt-2 h-11 w-full rounded-xl border border-border bg-card px-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" /></label>
              <div><p className="text-sm font-bold">Tipo de equipo</p><div className="mt-2 grid grid-cols-2 gap-2">{(['permanent', 'temporary'] as const).map((value) => <button key={value} type="button" onClick={() => setTeamType(value)} className={cn('rounded-xl border p-3 text-left text-sm font-bold', teamType === value ? 'border-primary bg-primary/8 text-primary' : 'border-border bg-card')}>{value === 'permanent' ? 'Permanente' : 'Temporal'}<span className="mt-1 block text-xs font-normal text-muted-foreground">{value === 'permanent' ? 'Base estable del curso' : 'Para una actividad o período'}</span></button>)}</div></div>
              {teamType === 'temporary' ? <label className="block text-sm font-bold">Fecha de finalización<input type="date" value={endsAt} onChange={(event) => setEndsAt(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-border bg-card px-3" /></label> : null}
              <div><p className="text-sm font-bold">Color</p><div className="mt-2 flex gap-2">{colors.map((value) => <button key={value} type="button" onClick={() => setColor(value)} className="flex size-9 items-center justify-center rounded-full ring-offset-2" style={{ backgroundColor: value, boxShadow: color === value ? `0 0 0 3px white, 0 0 0 5px ${value}` : undefined }}>{color === value ? <Check className="size-4 text-white" /> : null}</button>)}</div></div>
              <label className="block text-sm font-bold">Descripción <span className="font-normal text-muted-foreground">(opcional)</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} maxLength={500} rows={3} className="mt-2 w-full resize-none rounded-xl border border-border bg-card p-3 outline-none focus:border-primary" /></label>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-2xl text-white shadow" style={{ backgroundColor: color }}><UsersRound className="size-8" /></div>
              <h3 className="mt-3 truncate font-extrabold">{name || 'Nuevo equipo'}</h3><p className="text-xs font-semibold text-muted-foreground">{teamType === 'permanent' ? 'Permanente' : 'Temporal'}</p><p className="mt-3 text-sm font-bold">{Object.keys(selected).length} integrantes</p>
            </div>
          </div>

          <div className="mt-7 border-t border-border pt-6">
            <div className="flex items-end justify-between gap-4"><div><h3 className="font-extrabold">Agregar integrantes</h3><p className="text-sm text-muted-foreground">Selecciona estudiantes y asigna un rol opcional.</p></div><span className="text-xs font-bold text-primary">{Object.keys(selected).length} seleccionados</span></div>
            <div className="relative mt-4"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar estudiantes…" className="h-10 w-full rounded-xl border border-border pl-9 pr-3 text-sm" /></div>
            <div className="mt-3 divide-y divide-border overflow-hidden rounded-xl border border-border">
              {available.map((student) => {
                const isSelected = Object.hasOwn(selected, student.enrollmentId)
                return <div key={student.enrollmentId} className={cn('flex flex-col gap-3 p-3 sm:flex-row sm:items-center', isSelected && 'bg-primary/5')}><label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3"><input type="checkbox" checked={isSelected} onChange={() => setSelected((current) => { const next = { ...current }; if (Object.hasOwn(next, student.enrollmentId)) delete next[student.enrollmentId]; else next[student.enrollmentId] = ''; return next })} className="size-4 accent-primary" /><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-extrabold text-primary">{student.firstName.charAt(0)}{student.lastName.charAt(0)}</span><span className="truncate text-sm font-bold">{student.firstName} {student.lastName}<span className="block text-xs font-normal text-muted-foreground">{student.studentCode}</span></span></label>{isSelected ? <select value={selected[student.enrollmentId]} onChange={(event) => setSelected((current) => ({ ...current, [student.enrollmentId]: event.target.value }))} className="h-9 rounded-lg border border-border bg-card px-2 text-xs font-semibold"><option value="">Sin rol</option>{roles.map((role) => <option key={role}>{role}</option>)}</select> : null}</div>
              })}
            </div>
          </div>
          {error ? <p className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm font-semibold text-destructive">{error}</p> : null}
        </div>
        <footer className="flex justify-end gap-3 border-t border-border bg-card px-6 py-4"><button type="button" onClick={onClose} className="h-11 rounded-xl border border-border px-5 font-bold">Cancelar</button><button type="button" disabled={saving} onClick={() => void submit()} className="h-11 rounded-xl bg-primary px-6 font-bold text-white shadow disabled:opacity-60">{saving ? 'Guardando…' : team ? 'Guardar cambios' : 'Crear equipo'}</button></footer>
      </aside>
    </div>
  )
}

function TeamEditorScreen({ team, students, onClose, onSave }: {
  team: CourseTeam | null
  students: StudentAttendanceRow[]
  onClose: () => void
  onSave: (input: CourseTeamInput) => Promise<void>
}) {
  const [name, setName] = useState(team?.name ?? '')
  const [teamType, setTeamType] = useState<'permanent' | 'temporary'>(team?.teamType ?? 'permanent')
  const [color, setColor] = useState(team?.color ?? colors[3])
  const [icon, setIcon] = useState(team?.icon ?? 'flask')
  const [description, setDescription] = useState(team?.description ?? '')
  const [endsAt, setEndsAt] = useState(team?.endsAt?.slice(0, 10) ?? '')
  const [validity, setValidity] = useState<'activity' | 'date'>(team?.endsAt ? 'date' : 'activity')
  const [selected, setSelected] = useState<Record<string, string>>(() => Object.fromEntries(team?.members.map((member) => [member.enrollmentId, member.role ?? '']) ?? []))
  const [query, setQuery] = useState('')
  const [studentFilter, setStudentFilter] = useState<'all' | 'selected' | 'available'>('all')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const visibleStudents = students.filter((student) => {
    const matchesQuery = `${student.firstName} ${student.lastName} ${student.studentCode}`.toLocaleLowerCase('es').includes(query.toLocaleLowerCase('es'))
    const isSelected = Object.hasOwn(selected, student.enrollmentId)
    return matchesQuery && (studentFilter === 'all' || (studentFilter === 'selected' ? isSelected : !isSelected))
  })
  const selectedCount = Object.keys(selected).length

  function toggleStudent(enrollmentId: string) {
    setSelected((current) => {
      const next = { ...current }
      if (Object.hasOwn(next, enrollmentId)) delete next[enrollmentId]
      else next[enrollmentId] = ''
      return next
    })
  }

  async function submit() {
    if (!name.trim()) {
      setError('Escribe el nombre del equipo.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await onSave({
        name: name.trim(), color, icon, description: description.trim(), teamType,
        endsAt: teamType === 'temporary' && validity === 'date' && endsAt ? endsAt : null,
        members: Object.entries(selected).map(([enrollmentId, role]) => ({ enrollmentId, role: role || undefined })),
      })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo guardar el equipo.')
      setSaving(false)
    }
  }

  return (
    <section className="space-y-5 pb-2">
      <button type="button" onClick={onClose} className="inline-flex items-center gap-2 text-sm font-extrabold text-primary transition hover:-translate-x-0.5"><ArrowLeft className="size-4" /> Volver a equipos</button>
      <header><h2 className="text-2xl font-extrabold tracking-tight">{team ? 'Editar equipo' : 'Crear equipo'}</h2><p className="mt-1 text-sm text-muted-foreground">Configura los detalles del equipo y selecciona a los estudiantes que lo integrarán.</p></header>

      <div className="grid items-start gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-card p-5 shadow-sm">
            <h3 className="text-sm font-extrabold">Información del equipo</h3>
            <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_auto]">
              <label className="block text-xs font-extrabold">Nombre del equipo <span className="text-destructive">*</span><input value={name} onChange={(event) => setName(event.target.value)} maxLength={120} placeholder="Ej. Equipo Newton" className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10" /></label>
              <div><p className="text-xs font-extrabold">Color del equipo</p><div className="mt-2 flex flex-wrap gap-2">{colors.map((value) => <button key={value} type="button" aria-label={`Usar color ${value}`} onClick={() => setColor(value)} className="flex size-9 items-center justify-center rounded-xl border-2 border-white shadow ring-1 ring-slate-200 transition hover:scale-105" style={{ backgroundColor: value, boxShadow: color === value ? `0 0 0 2px white, 0 0 0 4px ${value}` : undefined }}>{color === value ? <Check className="size-4 text-white" /> : null}</button>)}</div></div>
            </div>
            <div className="mt-5 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div><p className="text-xs font-extrabold">Icono del equipo</p><div className="mt-2 flex flex-wrap gap-2">{teamIcons.map((value) => <button key={value} type="button" aria-label={`Usar icono ${value}`} onClick={() => setIcon(value)} className={cn('flex size-11 items-center justify-center rounded-xl border transition hover:-translate-y-0.5', icon === value ? 'border-current shadow-sm' : 'border-slate-200 text-slate-500 hover:border-slate-300')} style={icon === value ? { backgroundColor: `${color}12`, color } : undefined}><TeamIcon name={value} className="size-5" /></button>)}<button type="button" disabled title="Más iconos próximamente" className="flex size-11 items-center justify-center rounded-xl border border-dashed border-slate-200 text-slate-400">•••</button></div></div>
              <div><p className="text-xs font-extrabold">Tipo de equipo</p><div className="mt-2 space-y-3">{(['permanent', 'temporary'] as const).map((value) => <label key={value} className="flex cursor-pointer items-start gap-3"><input type="radio" name="team-type" checked={teamType === value} onChange={() => setTeamType(value)} className="mt-0.5 size-4 accent-primary" /><span><span className="block text-xs font-extrabold">{value === 'permanent' ? 'Permanente' : 'Temporal'}</span><span className="mt-0.5 block text-[10px] leading-4 text-muted-foreground">{value === 'permanent' ? 'Permanecerá durante todo el año escolar.' : 'Tendrá una vigencia limitada.'}</span></span></label>)}</div></div>
            </div>
            <label className="mt-5 block text-xs font-extrabold">Descripción <span className="font-normal text-muted-foreground">(opcional)</span><div className="relative mt-2"><textarea value={description} onChange={(event) => setDescription(event.target.value)} maxLength={200} rows={4} placeholder="Describe el propósito o características de este equipo..." className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3.5 pb-7 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10" /><span className="absolute bottom-3 right-3 text-[10px] font-semibold text-muted-foreground">{description.length} / 200</span></div></label>
          </div>

          {teamType === 'temporary' ? <div className="rounded-2xl border border-slate-200 bg-card p-5 shadow-sm"><h3 className="text-sm font-extrabold">Define la vigencia del equipo</h3><div className="mt-4 space-y-4"><label className="flex cursor-pointer items-start gap-3"><input type="radio" checked={validity === 'activity'} onChange={() => setValidity('activity')} className="mt-0.5 size-4 accent-primary" /><span><span className="block text-xs font-extrabold">Solo para una actividad específica</span><span className="text-[10px] text-muted-foreground">El equipo se usará únicamente en una actividad.</span></span></label><label className="grid cursor-pointer gap-3 sm:grid-cols-[1fr_15rem]"><span className="flex items-start gap-3"><input type="radio" checked={validity === 'date'} onChange={() => setValidity('date')} className="mt-0.5 size-4 accent-primary" /><span><span className="block text-xs font-extrabold">Hasta una fecha específica</span><span className="text-[10px] text-muted-foreground">El equipo estará activo hasta una fecha determinada.</span></span></span><input type="date" value={endsAt} onChange={(event) => { setEndsAt(event.target.value); setValidity('date') }} className="h-10 rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-primary" /></label><div className="grid gap-3 opacity-50 sm:grid-cols-[1fr_15rem]"><span className="flex items-start gap-3"><input type="radio" disabled className="mt-0.5 size-4" /><span><span className="block text-xs font-extrabold">Hasta finalizar un proyecto</span><span className="text-[10px] text-muted-foreground">Disponible al integrar proyectos con equipos.</span></span></span><button type="button" disabled className="h-10 rounded-xl border border-dashed border-slate-200 text-xs font-bold">Próximamente</button></div></div></div> : null}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-card shadow-sm xl:sticky xl:top-4">
          <div className="p-5"><h3 className="text-sm font-extrabold">Seleccionar integrantes</h3><p className="mt-1 text-xs text-muted-foreground">Busca y selecciona los estudiantes que formarán parte de este equipo.</p><div className="mt-4 grid gap-2 sm:grid-cols-[1fr_12rem]"><div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar estudiante..." className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-xs outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" /></div><select value={studentFilter} onChange={(event) => setStudentFilter(event.target.value as typeof studentFilter)} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold outline-none"><option value="all">Todos los estudiantes</option><option value="selected">Seleccionados</option><option value="available">Sin seleccionar</option></select></div><div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-extrabold text-emerald-700"><Users className="size-4" /> {students.length} estudiantes disponibles</div></div>
          <div className="max-h-[29rem] divide-y divide-slate-100 overflow-y-auto border-y border-slate-100 px-2">{visibleStudents.map((student, index) => { const isSelected = Object.hasOwn(selected, student.enrollmentId); return <label key={student.enrollmentId} className={cn('flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition hover:bg-slate-50', isSelected && 'bg-primary/[0.035]')}><input type="checkbox" checked={isSelected} onChange={() => toggleStudent(student.enrollmentId)} className="size-4 rounded accent-primary" /><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/8 text-[10px] font-extrabold text-primary">{student.firstName.charAt(0)}{student.lastName.charAt(0)}</span><span className="min-w-0 flex-1 truncate text-xs font-bold">{student.firstName} {student.lastName}</span><span className="text-[10px] font-semibold text-muted-foreground">{student.listNumber ? String(student.listNumber).padStart(2, '0') : String(index + 1).padStart(2, '0')}</span></label> })}{!visibleStudents.length ? <p className="px-4 py-12 text-center text-xs text-muted-foreground">No hay estudiantes que coincidan con este filtro.</p> : null}</div>
          <div className="flex items-center justify-between gap-3 bg-slate-50/70 px-5 py-3"><span className="text-xs font-extrabold text-primary">{selectedCount} {selectedCount === 1 ? 'estudiante seleccionado' : 'estudiantes seleccionados'}</span>{selectedCount ? <button type="button" onClick={() => setSelected({})} className="text-[10px] font-extrabold text-destructive hover:underline">Limpiar selección</button> : null}</div>
        </div>
      </div>

      {error ? <p className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm font-semibold text-destructive">{error}</p> : null}
      <footer className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between"><button type="button" onClick={onClose} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-extrabold text-muted-foreground transition hover:bg-muted"><ArrowLeft className="size-4" /> Cancelar</button><div className="flex gap-3"><button type="button" disabled title="Los borradores estarán disponibles próximamente" className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-extrabold text-muted-foreground opacity-55">Guardar borrador</button><button type="button" disabled={saving} onClick={() => void submit()} className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-extrabold text-white shadow-md shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90 disabled:opacity-60 sm:flex-none"><UserRoundPlus className="size-4" /> {saving ? 'Guardando...' : team ? 'Guardar cambios' : 'Crear equipo'}</button></div></footer>
    </section>
  )
}

function TeamIcon({ name, className }: { name: string; className?: string }) {
  if (name === 'flask') return <FlaskConical className={className} />
  if (name === 'telescope') return <Telescope className={className} />
  if (name === 'atom') return <Atom className={className} />
  if (name === 'star') return <Star className={className} />
  if (name === 'lightbulb') return <Lightbulb className={className} />
  if (name === 'trophy') return <Trophy className={className} />
  return <UsersRound className={className} />
}

function QuickAction({ icon, title, detail, onClick, disabled = false }: { icon: ReactNode; title: string; detail: string; onClick?: () => void; disabled?: boolean }) {
  return <button type="button" onClick={onClick} disabled={disabled} className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-left transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:bg-white hover:shadow-md disabled:cursor-not-allowed disabled:border-dashed disabled:bg-slate-50/40 disabled:opacity-55 disabled:hover:translate-y-0 disabled:hover:shadow-none"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary transition group-hover:bg-primary group-hover:text-white group-disabled:bg-slate-100 group-disabled:text-slate-400">{icon}</span><span className="min-w-0"><span className="block truncate text-xs font-extrabold">{title}</span><span className="block truncate text-[10px] text-muted-foreground">{detail}</span></span></button>
}

function PanelMessage({ text, destructive = false }: { text: string; destructive?: boolean }) {
  return <div className={cn('rounded-2xl border border-dashed p-12 text-center text-sm font-semibold', destructive ? 'border-destructive/30 bg-destructive/5 text-destructive' : 'border-border bg-card text-muted-foreground')}>{text}</div>
}
