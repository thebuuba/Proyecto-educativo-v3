import {
  Archive,
  ArrowDown,
  ArrowLeft,
  ArrowDownAZ,
  Atom,
  BarChart3,
  BookOpen,
  BookOpenCheck,
  Calculator,
  CalendarDays,
  CalendarRange,
  Check,
  CheckSquare,
  ChevronDown,
  ClipboardList,
  Clock3,
  Eye,
  Edit3,
  FlaskConical,
  GraduationCap,
  Globe2,
  History,
  LayoutDashboard,
  ListPlus,
  Lightbulb,
  Microscope,
  MoreVertical,
  Palette,
  Plus,
  Puzzle,
  Rocket,
  Search,
  Star,
  RotateCcw,
  Trash2,
  UserRoundPlus,
  Users,
  UsersRound,
  Telescope,
  Trophy,
  X,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Modal } from '@/components/ui/Modal'
import {
  archiveCourseTeam,
  createCourseTeam,
  deleteCourseTeamPermanently,
  getCourseTeams,
  restoreCourseTeam,
  updateCourseTeam,
} from '@/modules/courses/services/coursesService'
import type { CourseTeam, CourseTeamInput } from '@/modules/courses/types'
import type { StudentAttendanceRow } from '@/modules/attendance/types'
import { cn } from '@/utils/cn'

const colors = ['#5b35e5', '#2563eb', '#0ea5a8', '#16a34a', '#f59e0b', '#e83e73', '#ef4444']
const moreColors = ['#0891b2', '#0284c7', '#4f46e5', '#7c3aed', '#9333ea', '#c026d3', '#db2777', '#e11d48', '#ea580c', '#ca8a04', '#65a30d', '#059669']
const iconOptions = [
  { id: 'flask', label: 'Laboratorio', category: 'Ciencia' },
  { id: 'telescope', label: 'Telescopio', category: 'Ciencia' },
  { id: 'atom', label: 'Átomo', category: 'Ciencia' },
  { id: 'microscope', label: 'Microscopio', category: 'Ciencia' },
  { id: 'calculator', label: 'Matemática', category: 'Educación' },
  { id: 'book', label: 'Libro', category: 'Educación' },
  { id: 'puzzle', label: 'Rompecabezas', category: 'Educación' },
  { id: 'users', label: 'Personas', category: 'General' },
  { id: 'star', label: 'Estrella', category: 'General' },
  { id: 'lightbulb', label: 'Bombilla', category: 'General' },
  { id: 'trophy', label: 'Trofeo', category: 'General' },
  { id: 'rocket', label: 'Cohete', category: 'Tecnología' },
  { id: 'globe', label: 'Planeta', category: 'Tecnología' },
] as const
const teamIcons = iconOptions.slice(0, 7).map(({ id }) => id)
const roles = ['Coordinador', 'Secretario', 'Investigador', 'Expositor', 'Diseñador']

export function CourseTeamsPanel({
  sectionSubjectId,
  students,
  canManage,
  onSummaryChange,
  activities = [],
  context,
  initialTeamId = null,
  onTeamChange,
}: {
  sectionSubjectId: string | null
  students: StudentAttendanceRow[]
  canManage: boolean
  onSummaryChange?: (summary: { teams: number; assignedStudents: number }) => void
  activities?: Array<{ id: string; name: string; date?: string; competencyBlockId?: string; teamIds?: string[] }>
  context?: { courseLabel: string; subjectName: string; schoolYearName?: string }
  initialTeamId?: string | null
  onTeamChange?: (teamId: string | null) => void
}) {
  const [teams, setTeams] = useState<CourseTeam[]>([])
  const [archivedTeams, setArchivedTeams] = useState<CourseTeam[]>([])
  const [showArchived, setShowArchived] = useState(false)
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
  const [deleteTarget, setDeleteTarget] = useState<CourseTeam | null>(null)
  const [assigningStudent, setAssigningStudent] = useState<StudentAttendanceRow | null>(null)
  const [prefillEnrollmentId, setPrefillEnrollmentId] = useState<string | null>(null)
  const [batchOpen, setBatchOpen] = useState(false)
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(initialTeamId)

  useEffect(() => setSelectedTeamId(initialTeamId), [initialTeamId])

  const loadTeams = useCallback(async () => {
    if (!sectionSubjectId) {
      setTeams([])
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const [active, archived] = await Promise.all([
        getCourseTeams(sectionSubjectId),
        getCourseTeams(sectionSubjectId, true),
      ])
      setTeams(active)
      setArchivedTeams(archived)
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

  const visibleTeams = showArchived ? archivedTeams : teams
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('es')
    const result = visibleTeams.filter((team) => {
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
  }, [filter, query, sort, visibleTeams])

  const assigned = useMemo(() => new Set(
    teams.filter((team) => team.teamType === 'permanent')
      .flatMap((team) => team.members.map((member) => member.enrollmentId)),
  ), [teams])
  const unassignedStudents = students.filter((student) => !assigned.has(student.enrollmentId))
  const permanentTeams = teams.filter((team) => team.teamType === 'permanent').length
  const temporaryTeams = teams.length - permanentTeams
  const selectedTeam = [...teams, ...archivedTeams].find((team) => team.id === selectedTeamId) ?? null
  const openTeam = (team: CourseTeam) => {
    setSelectedTeamId(team.id)
    onTeamChange?.(team.id)
  }

  useEffect(() => {
    if (!loading && !error) onSummaryChange?.({ teams: teams.length, assignedStudents: assigned.size })
  }, [assigned, error, loading, onSummaryChange, teams.length])

  if (!sectionSubjectId) {
    return <PanelMessage text="Selecciona una asignatura para organizar sus equipos de trabajo." />
  }

  if (editing) {
    return <TeamEditorScreen team={editing === 'new' ? null : editing} teams={teams} students={students} activities={activities} initialEnrollmentId={editing === 'new' ? prefillEnrollmentId : null} onClose={() => { setEditing(null); setPrefillEnrollmentId(null) }} onSave={async (input) => {
      if (editing === 'new') await createCourseTeam(sectionSubjectId, input)
      else await updateCourseTeam(editing.id, input)
      setEditing(null)
      setPrefillEnrollmentId(null)
      await loadTeams()
    }} />
  }

  if (selectedTeam) {
    return <TeamDetailView
      team={selectedTeam}
      activities={activities.filter((activity) => activity.teamIds?.includes(selectedTeam.id))}
      context={context}
      canManage={canManage}
      onBack={() => { setSelectedTeamId(null); onTeamChange?.(null) }}
      onEdit={() => setEditing(selectedTeam)}
      onArchive={async () => { await archiveCourseTeam(selectedTeam.id); setSelectedTeamId(null); onTeamChange?.(null); await loadTeams() }}
      onDelete={async () => { await deleteCourseTeamPermanently(selectedTeam.id, selectedTeam.name); setSelectedTeamId(null); onTeamChange?.(null); await loadTeams() }}
      onRestore={async () => { await restoreCourseTeam(selectedTeam.id); setSelectedTeamId(null); onTeamChange?.(null); await loadTeams() }}
    />
  }

  return (
    <section className="space-y-4">
      {!loading && (teams.length > 0 || archivedTeams.length > 0) ? <>
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0"><h2 className="text-xl font-extrabold tracking-tight">{showArchived ? 'Equipos archivados' : 'Equipos de trabajo'}</h2><p className="mt-0.5 text-xs text-muted-foreground">{showArchived ? `${archivedTeams.length} archivados` : `${permanentTeams} permanentes · ${temporaryTeams} temporales`}</p></div>
        <div className="flex flex-wrap gap-2">
          <button type="button" aria-pressed={showArchived} onClick={() => { setShowArchived((current) => !current); setFilter('all'); setQuery('') }} className={cn('inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-extrabold transition', showArchived ? 'border-primary bg-primary/8 text-primary' : 'border-border bg-card hover:border-primary/40')}><Archive className="size-4" /> {showArchived ? 'Volver a activos' : `Archivados (${archivedTeams.length})`}</button>
          {canManage && !showArchived ? <button type="button" onClick={() => setEditing('new')} className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-extrabold text-primary-foreground shadow-md shadow-primary/20 transition hover:bg-primary-hover"><UserRoundPlus className="size-4" /> Crear equipo</button> : null}
        </div>
      </header>

      {!showArchived ? <div className="rounded-xl border border-border/80 bg-card p-2.5 shadow-[0_4px_16px_rgba(15,23,42,0.05)]">
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
                className={cn('rounded-lg px-3.5 py-2 text-xs font-extrabold transition-all', filter === value ? 'bg-primary text-primary-foreground shadow-md shadow-primary/15' : 'text-slate-500 hover:bg-white hover:text-primary hover:shadow-sm')}
              >
                {label}
              </button>
            ))}
          </div>
          <div ref={sortMenuRef} className="relative shrink-0">
            <button type="button" aria-haspopup="listbox" aria-expanded={sortOpen} onClick={() => setSortOpen((current) => !current)} className={cn('flex h-11 min-w-48 items-center gap-3 rounded-xl border bg-white px-3.5 text-left transition', sortOpen ? 'border-primary ring-4 ring-primary/10' : 'border-slate-200 hover:border-slate-300 hover:shadow-sm')}>
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary/8 text-primary"><ArrowDownAZ className="size-4" /></span><span className="min-w-0 flex-1"><span className="block text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground">Ordenar por</span><span className="block truncate text-xs font-extrabold">{sort === 'current' ? 'Orden actual' : sort === 'name' ? 'Nombre A-Z' : 'Más integrantes'}</span></span><ChevronDown className={cn('size-4 text-muted-foreground transition-transform', sortOpen && 'rotate-180')} />
            </button>
            {sortOpen ? <div role="listbox" aria-label="Ordenar equipos" className="absolute right-0 top-[calc(100%+0.5rem)] z-30 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_18px_45px_rgba(15,23,42,0.16)]">{([['current', 'Orden actual', 'Mantiene la organización'], ['name', 'Nombre A-Z', 'Orden alfabético'], ['members', 'Más integrantes', 'Mayor cantidad primero']] as const).map(([value, label, detail]) => <button key={value} type="button" role="option" aria-selected={sort === value} onClick={() => { setSort(value); setSortOpen(false) }} className={cn('flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-slate-50', sort === value && 'bg-primary/5')}><span className={cn('flex size-5 items-center justify-center rounded-full border', sort === value ? 'border-primary bg-primary text-primary-foreground' : 'border-slate-200')}>{sort === value ? <Check className="size-3" /> : null}</span><span><span className="block text-xs font-extrabold">{label}</span><span className="block text-[10px] text-muted-foreground">{detail}</span></span></button>)}</div> : null}
          </div>
        </div>
      </div> : null}
      </> : null}

      {error ? <PanelMessage text={error} destructive /> : loading ? (
        <PanelMessage text="Cargando equipos…" />
      ) : filtered.length ? (
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
          {filtered.map((team) => (
            <article
              key={team.id}
              onClick={() => openTeam(team)}
              className="relative cursor-pointer overflow-visible rounded-2xl border border-border bg-card shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
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
                    <div className="relative" onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
                      <button type="button" onClick={() => setMenuTeamId((current) => current === team.id ? null : team.id)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted" aria-label={`Opciones de ${team.name}`}><MoreVertical className="size-4" /></button>
                      {menuTeamId === team.id ? <div className="absolute right-0 top-8 z-20 w-56 rounded-xl border border-border bg-card p-1.5 shadow-xl">{showArchived ? <><button type="button" onClick={async () => { await restoreCourseTeam(team.id); setMenuTeamId(null); await loadTeams() }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold hover:bg-muted"><RotateCcw className="size-3.5" /> Restaurar equipo</button><button type="button" onClick={() => { setDeleteTarget(team); setMenuTeamId(null) }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-destructive hover:bg-destructive/10"><Trash2 className="size-3.5" /> Eliminar permanentemente</button></> : <><button type="button" onClick={() => { setEditing(team); setMenuTeamId(null) }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold hover:bg-muted"><Edit3 className="size-3.5" /> Editar equipo</button><button type="button" onClick={() => { setEditing(team); setMenuTeamId(null) }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold hover:bg-muted"><Users className="size-3.5" /> Administrar integrantes</button><button type="button" onClick={() => { setEditing(team); setMenuTeamId(null) }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold hover:bg-muted"><Palette className="size-3.5" /> Personalizar apariencia</button><div className="my-1 border-t border-border" /><button type="button" onClick={() => { setArchiveTarget(team); setMenuTeamId(null) }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold hover:bg-muted"><Archive className="size-3.5" /> Archivar equipo</button>{team.canDelete ? <><div className="my-1 border-t border-border" /><button type="button" onClick={() => { setDeleteTarget(team); setMenuTeamId(null) }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-destructive hover:bg-destructive/10"><Trash2 className="size-3.5" /> Eliminar equipo</button></> : null}</>}</div> : null}
                    </div>
                  ) : null}
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold"><Users className="size-4 text-muted-foreground" /> {team.members.length} integrantes</div>
                {team.description ? <p className="mt-3 line-clamp-2 min-h-9 text-xs leading-5 text-muted-foreground">{team.description}</p> : <p className="mt-3 min-h-9 text-xs leading-5 text-muted-foreground">Equipo de trabajo de la asignatura.</p>}
                {team.endsAt ? <div className="mt-3 rounded-lg px-3 py-2 text-xs font-semibold" style={{ backgroundColor: `${team.color}0D`, color: team.color }}><CalendarRange className="mr-1.5 inline size-3.5" />Hasta {new Date(team.endsAt).toLocaleDateString('es-DO')}</div> : null}
                {(team.activityCount ?? 0) > 0 ? <div className="mt-3 space-y-1 text-[10px] font-semibold text-muted-foreground"><p>{team.activityCount} {team.activityCount === 1 ? 'actividad' : 'actividades'}</p>{team.lastActivity ? <p title={team.lastActivity.name}>Última: <span className="font-bold text-foreground">{team.lastActivity.name}</span></p> : null}</div> : null}
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
              <button type="button" onClick={(event) => { event.stopPropagation(); openTeam(team) }} className="flex w-full items-center justify-center gap-2 rounded-b-2xl border-t border-border px-4 py-3 text-xs font-extrabold transition hover:bg-muted" style={{ color: team.color }}><Eye className="size-3.5" /> Ver equipo</button>
            </article>
          ))}
        </div>
      ) : visibleTeams.length || showArchived ? (
        <div className="rounded-2xl border border-slate-200 bg-card px-6 py-12 text-center shadow-sm"><span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/8 text-primary">{showArchived ? <Archive className="size-6" /> : <Search className="size-6" />}</span><h3 className="mt-4 text-lg font-extrabold">{showArchived ? 'No hay equipos archivados' : 'No encontramos coincidencias'}</h3><p className="mt-2 text-sm text-muted-foreground">{showArchived ? 'Los equipos que archives aparecerán aquí.' : 'Prueba con otro nombre, estudiante o tipo de equipo.'}</p></div>
      ) : (
        <EmptyTeamsState canManage={canManage} onCreate={() => setEditing('new')} onOpenGuide={() => setGuideOpen(true)} />
      )}

      {!loading && !error && teams.length > 0 && !showArchived ? (
        <div className="grid gap-4 xl:grid-cols-[1fr_1.15fr]">
          <div className="rounded-2xl border border-slate-200 bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600"><GraduationCap className="size-4" /></span><div><h3 className="text-sm font-extrabold">Estudiantes sin equipo</h3><p className="text-[10px] text-muted-foreground">Pendientes de asignación permanente</p></div></div><span className="flex min-w-8 items-center justify-center rounded-full bg-orange-50 px-2.5 py-1 text-xs font-extrabold text-orange-600">{unassignedStudents.length}</span></div>
            {unassignedStudents.length ? <div className="mt-4 flex flex-wrap gap-2.5 border-t border-slate-100 pt-4">{unassignedStudents.slice(0, 8).map((student) => <button type="button" key={student.enrollmentId} onClick={() => setAssigningStudent(student)} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-100 bg-slate-50/80 py-1.5 pl-1.5 pr-3 text-xs font-bold transition hover:border-primary/20 hover:bg-primary/[0.03]"><span className="flex size-7 items-center justify-center rounded-full bg-white text-[10px] font-extrabold text-primary shadow-sm">{student.firstName.charAt(0)}{student.lastName.charAt(0)}</span>{student.firstName} {student.lastName}</button>)}{unassignedStudents.length > 8 ? <span className="self-center text-xs font-bold text-primary">+{unassignedStudents.length - 8} más</span> : null}</div> : <p className="mt-4 border-t border-slate-100 pt-4 text-sm text-muted-foreground">Todos los estudiantes pertenecen a un equipo permanente.</p>}
          </div>
          {canManage ? <div className="rounded-2xl border border-slate-200 bg-card p-5 shadow-sm"><div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-primary"><ListPlus className="size-4" /></span><div><h3 className="text-sm font-extrabold">Acciones rápidas</h3><p className="text-[10px] text-muted-foreground">Organiza el curso en menos pasos</p></div></div><div className="mt-4 grid gap-2.5 border-t border-slate-100 pt-4 sm:grid-cols-2">
            <QuickAction icon={<Users className="size-4" />} title="Distribuir estudiantes" detail="Asignar a equipos permanentes" onClick={() => unassignedStudents[0] && setAssigningStudent(unassignedStudents[0])} disabled={!unassignedStudents.length || !permanentTeams} />
            <QuickAction icon={<ListPlus className="size-4" />} title="Crear varios equipos" detail="Distribución aleatoria simple" onClick={() => setBatchOpen(true)} />
          </div></div> : null}
        </div>
      ) : null}

      {archiveTarget ? (
        <ConfirmDialog
          title="Archivar equipo"
          description="Este equipo dejará de aparecer entre los equipos activos, pero conservará toda su información y podrás restaurarlo desde Archivados."
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
      {deleteTarget ? <StrongDeleteTeamDialog team={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={async () => { await deleteCourseTeamPermanently(deleteTarget.id, deleteTarget.name); setDeleteTarget(null); await loadTeams() }} /> : null}
      {assigningStudent ? <AssignStudentDialog student={assigningStudent} teams={teams.filter((team) => team.teamType === 'permanent')} onClose={() => setAssigningStudent(null)} onCreate={() => { setPrefillEnrollmentId(assigningStudent.enrollmentId); setAssigningStudent(null); setEditing('new') }} onAssign={async (team) => { await updateCourseTeam(team.id, { members: [...team.members.map(({ enrollmentId, role }) => ({ enrollmentId, role: role ?? undefined })), { enrollmentId: assigningStudent.enrollmentId }] }); setAssigningStudent(null); await loadTeams() }} /> : null}
      {batchOpen ? <BatchCreateTeamsDialog students={unassignedStudents} onClose={() => setBatchOpen(false)} onCreate={async (inputs) => { await Promise.all(inputs.map((input) => createCourseTeam(sectionSubjectId, input))); setBatchOpen(false); await loadTeams() }} /> : null}
      {guideOpen ? <TeamQuickGuide onClose={() => setGuideOpen(false)} /> : null}
    </section>
  )
}

type TeamDetailActivity = {
  id: string
  name: string
  date?: string
  competencyBlockId?: string
  teamIds?: string[]
}

type TeamDetailTab = 'summary' | 'members' | 'activities' | 'history'

function TeamDetailView({
  team,
  activities,
  context,
  canManage,
  onBack,
  onEdit,
  onArchive,
  onDelete,
  onRestore,
}: {
  team: CourseTeam
  activities: TeamDetailActivity[]
  context?: { courseLabel: string; subjectName: string; schoolYearName?: string }
  canManage: boolean
  onBack: () => void
  onEdit: () => void
  onArchive: () => Promise<void>
  onDelete: () => Promise<void>
  onRestore: () => Promise<void>
}) {
  const [tab, setTab] = useState<TeamDetailTab>('summary')
  const [archiveOpen, setArchiveOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [restoring, setRestoring] = useState(false)
  const archived = team.status === 'INACTIVE'
  const datedActivities = [...activities].sort((left, right) => (right.date ?? '').localeCompare(left.date ?? ''))
  const currentMembers = team.members.filter((member) => member.status !== 'INACTIVE')
  const contextLabel = context
    ? [context.courseLabel, context.subjectName, context.schoolYearName ? `Año escolar ${context.schoolYearName}` : null].filter(Boolean).join(' · ')
    : null
  const tabs: Array<{ id: TeamDetailTab; label: string; icon: ReactNode }> = [
    { id: 'summary', label: 'Resumen', icon: <LayoutDashboard className="size-4" /> },
    { id: 'members', label: 'Integrantes', icon: <Users className="size-4" /> },
    { id: 'activities', label: 'Actividades', icon: <CheckSquare className="size-4" /> },
    { id: 'history', label: 'Historial', icon: <History className="size-4" /> },
  ]

  const membersPanel = (
    <TeamDetailCard title={`Integrantes del equipo (${currentMembers.length})`} action={canManage && !archived ? <button type="button" onClick={onEdit} className="inline-flex h-9 items-center gap-2 rounded-xl border border-primary/20 px-3 text-xs font-extrabold text-primary transition hover:bg-primary/[0.04]"><Plus className="size-4" /> Agregar integrante</button> : null}>
      {currentMembers.length ? <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">{currentMembers.map(({ id, role, enrollment }) => {
        const { student } = enrollment
        return <div key={id} className="rounded-xl border border-border bg-card p-3 text-center shadow-sm"><span className="mx-auto flex size-11 items-center justify-center rounded-full text-sm font-extrabold" style={{ backgroundColor: `${team.color}18`, color: team.color }}>{student.firstName.charAt(0)}{student.lastName.charAt(0)}</span><strong className="mt-2 block text-xs leading-5">{student.firstName}<br />{student.lastName}</strong>{role ? <span className="mt-1 block text-[10px] text-muted-foreground">{role}</span> : null}</div>
      })}</div> : <TeamDetailEmpty icon={<Users className="size-5" />} text="Este equipo todavía no tiene integrantes activos." />}
    </TeamDetailCard>
  )

  const activitiesPanel = (
    <TeamDetailCard title="Actividades del equipo">
      {datedActivities.length ? <div className="divide-y divide-border overflow-hidden rounded-xl border border-border">{datedActivities.map((activity) => <div key={activity.id} className="flex flex-col gap-2 bg-card px-4 py-3 sm:flex-row sm:items-center"><span className="flex size-9 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${team.color}12`, color: team.color }}><CheckSquare className="size-4" /></span><div className="min-w-0 flex-1"><strong className="block truncate text-sm">{activity.name}</strong>{activity.competencyBlockId ? <span className="mt-0.5 block text-[10px] text-muted-foreground">Bloque vinculado</span> : null}</div><span className="text-xs font-semibold text-muted-foreground">{formatTeamDate(activity.date)}</span></div>)}</div> : <TeamDetailEmpty icon={<CheckSquare className="size-5" />} text="No hay actividades vinculadas a este equipo." />}
    </TeamDetailCard>
  )

  const historyPanel = (
    <TeamDetailCard title="Historial del equipo">
      <div className="relative ml-3 border-l border-border pl-6">
        <TeamHistoryItem color={team.color} icon={<Plus className="size-3.5" />} title="Equipo creado" detail={`Se creó ${team.name}`} date={team.createdAt} />
        {team.members.filter((member) => member.joinedAt).map((member) => <TeamHistoryItem key={member.id} color={team.color} icon={<Users className="size-3.5" />} title="Integrante agregado" detail={`Se agregó a ${member.enrollment.student.firstName} ${member.enrollment.student.lastName}`} date={member.joinedAt} />)}
        {datedActivities.map((activity) => <TeamHistoryItem key={activity.id} color={team.color} icon={<CalendarDays className="size-3.5" />} title="Actividad asignada" detail={activity.name} date={activity.date} />)}
      </div>
    </TeamDetailCard>
  )

  return <section className="space-y-4" aria-labelledby="team-detail-title">
    <header className="overflow-visible rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center">
        <button type="button" onClick={onBack} className="inline-flex h-10 shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-border px-3 text-xs font-extrabold text-primary transition hover:bg-primary/[0.04]"><ArrowLeft className="size-4" /> Volver a equipos</button>
        <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl" style={{ backgroundColor: `${team.color}18`, color: team.color }}><TeamIcon name={team.icon} className="size-7" /></span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2"><h2 id="team-detail-title" className="text-xl font-extrabold tracking-tight">{team.name}</h2><span className="rounded-full px-2.5 py-1 text-[10px] font-extrabold" style={{ backgroundColor: `${team.color}14`, color: team.color }}>{team.teamType === 'permanent' ? 'Permanente' : 'Temporal'}</span><span className={cn('rounded-full px-2.5 py-1 text-[10px] font-extrabold', archived ? 'bg-slate-100 text-slate-600' : 'bg-emerald-50 text-emerald-700')}>{archived ? 'Archivado' : 'Activo'}</span></div>
          <p className="mt-1 text-sm text-muted-foreground">{team.description || 'Sin descripción.'}</p>
          {contextLabel ? <p className="mt-2 text-xs font-semibold text-muted-foreground">{contextLabel}</p> : null}
        </div>
        {canManage ? <div className="flex shrink-0 gap-2">{archived ? <button type="button" disabled={restoring} onClick={async () => { setRestoring(true); try { await onRestore() } finally { setRestoring(false) } }} className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-3 text-xs font-extrabold transition hover:bg-muted disabled:opacity-50"><RotateCcw className="size-4" /> {restoring ? 'Restaurando…' : 'Restaurar'}</button> : <button type="button" onClick={onEdit} className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-3 text-xs font-extrabold transition hover:bg-muted"><Edit3 className="size-4" /> Editar equipo</button>}<details className="group relative"><summary aria-label={`Más acciones para ${team.name}`} className="flex size-10 cursor-pointer list-none items-center justify-center rounded-xl border border-border transition hover:bg-muted [&::-webkit-details-marker]:hidden"><MoreVertical className="size-4" /></summary><div className="absolute right-0 top-12 z-30 w-56 rounded-xl border border-border bg-card p-1.5 shadow-xl">{!archived ? <><button type="button" onClick={onEdit} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold hover:bg-muted"><Users className="size-3.5" /> Administrar integrantes</button><button type="button" onClick={() => setArchiveOpen(true)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold hover:bg-muted"><Archive className="size-3.5" /> Archivar equipo</button></> : null}{team.canDelete ? <button type="button" onClick={() => setDeleteOpen(true)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-destructive hover:bg-destructive/10"><Trash2 className="size-3.5" /> Eliminar equipo</button> : null}</div></details></div> : null}
      </div>
      <nav className="grid grid-cols-2 border-t border-border px-3 sm:flex" aria-label="Secciones del equipo">{tabs.map((item) => <button key={item.id} type="button" aria-current={tab === item.id ? 'page' : undefined} onClick={() => setTab(item.id)} className={cn('relative flex h-12 items-center justify-center gap-2 px-4 text-xs font-extrabold transition', tab === item.id ? 'text-primary after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary' : 'text-muted-foreground hover:text-foreground')}>{item.icon}{item.label}</button>)}</nav>
    </header>

    {tab === 'summary' ? <div className="grid gap-4 xl:grid-cols-[17rem_minmax(0,1fr)_21rem]">
      <div className="space-y-4"><TeamDetailCard title="Resumen del equipo"><div className="space-y-4"><TeamStat icon={<Users className="size-4" />} color={team.color} value={currentMembers.length} label="Integrantes" /><TeamStat icon={<CheckSquare className="size-4" />} color={team.color} value={datedActivities.length} label="Actividades vinculadas" /></div></TeamDetailCard><TeamDetailCard title="Información general"><dl className="space-y-3 text-xs"><TeamDefinition label="Tipo de equipo" value={team.teamType === 'permanent' ? 'Permanente' : 'Temporal'} /><TeamDefinition label="Fecha de creación" value={formatTeamDate(team.createdAt)} /><TeamDefinition label="Vigencia" value={team.endsAt ? `Hasta ${formatTeamDate(team.endsAt)}` : 'Sin fecha límite'} /><TeamDefinition label="Descripción" value={team.description || 'Sin descripción'} /></dl><div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs font-bold"><span>Color e icono</span><span className="flex size-8 items-center justify-center rounded-xl" style={{ backgroundColor: `${team.color}18`, color: team.color }}><TeamIcon name={team.icon} className="size-4" /></span></div></TeamDetailCard></div>
      <div className="space-y-4">{membersPanel}{activitiesPanel}</div>
      {historyPanel}
    </div> : tab === 'members' ? membersPanel : tab === 'activities' ? activitiesPanel : historyPanel}

    {archiveOpen ? <ConfirmDialog title="Archivar equipo" description="El equipo dejará de aparecer entre los activos, pero conservará su información y podrás restaurarlo." confirmLabel="Archivar" destructive onClose={() => setArchiveOpen(false)} onConfirm={onArchive} /> : null}
    {deleteOpen ? <StrongDeleteTeamDialog team={team} onClose={() => setDeleteOpen(false)} onConfirm={onDelete} /> : null}
  </section>
}

function TeamDetailCard({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return <section className="rounded-2xl border border-border bg-card p-4 shadow-sm"><header className="mb-4 flex items-center justify-between gap-3"><h3 className="text-sm font-extrabold">{title}</h3>{action}</header>{children}</section>
}

function TeamDetailEmpty({ icon, text }: { icon: ReactNode; text: string }) {
  return <div className="flex min-h-32 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-4 text-center"><span className="flex size-10 items-center justify-center rounded-xl bg-primary/8 text-primary">{icon}</span><p className="mt-3 text-xs text-muted-foreground">{text}</p></div>
}

function TeamStat({ icon, color, value, label }: { icon: ReactNode; color: string; value: number; label: string }) {
  return <div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-xl" style={{ backgroundColor: `${color}14`, color }}>{icon}</span><span><strong className="block text-lg leading-none tabular-nums">{value}</strong><span className="mt-1 block text-xs text-muted-foreground">{label}</span></span></div>
}

function TeamDefinition({ label, value }: { label: string; value: string }) {
  return <div className="flex items-start justify-between gap-3"><dt className="font-bold text-foreground">{label}</dt><dd className="max-w-40 text-right leading-5 text-muted-foreground">{value}</dd></div>
}

function TeamHistoryItem({ color, icon, title, detail, date }: { color: string; icon: ReactNode; title: string; detail: string; date?: string | null }) {
  return <div className="relative pb-6 last:pb-0"><span className="absolute -left-[2.15rem] flex size-7 items-center justify-center rounded-full border-4 border-card" style={{ backgroundColor: `${color}18`, color }}>{icon}</span><div className="flex items-start justify-between gap-3"><div><strong className="block text-xs">{title}</strong><span className="mt-1 block text-xs leading-5 text-muted-foreground">{detail}</span></div><time className="shrink-0 text-[10px] font-semibold text-muted-foreground">{formatTeamDate(date)}</time></div></div>
}

function formatTeamDate(value?: string | null) {
  if (!value) return 'Sin fecha registrada'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Sin fecha registrada' : date.toLocaleDateString('es-DO', { day: 'numeric', month: 'short', year: 'numeric' })
}

function DialogShell({ title, description, onClose, children }: { title: string; description: string; onClose: () => void; children: ReactNode }) {
  return <Modal title={title} description={description} onClose={onClose} className="max-w-lg rounded-2xl">{children}</Modal>
}

function StrongDeleteTeamDialog({ team, onClose, onConfirm }: { team: CourseTeam; onClose: () => void; onConfirm: () => Promise<void> }) {
  const [confirmation, setConfirmation] = useState('')
  const [deleting, setDeleting] = useState(false)
  return <DialogShell title="Eliminar equipo permanentemente" description="Esta acción no se puede deshacer. Las actividades conservarán su registro histórico, pero el equipo y sus integrantes guardados se eliminarán." onClose={onClose}><div className="space-y-4 p-5"><label className="block text-sm font-bold">Escribe <strong>{team.name}</strong> para confirmar<input autoFocus value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-border bg-card px-3 outline-none focus:border-destructive focus:ring-4 focus:ring-destructive/10" /></label><div className="flex justify-end gap-3"><button type="button" onClick={onClose} disabled={deleting} className="h-11 rounded-xl border border-border px-4 text-sm font-bold">Cancelar</button><button type="button" disabled={deleting || confirmation !== team.name} onClick={async () => { setDeleting(true); try { await onConfirm() } finally { setDeleting(false) } }} className="h-11 rounded-xl bg-destructive px-4 text-sm font-bold text-destructive-foreground disabled:cursor-not-allowed disabled:opacity-50">{deleting ? 'Eliminando…' : 'Eliminar permanentemente'}</button></div></div></DialogShell>
}

function AssignStudentDialog({ student, teams, onClose, onCreate, onAssign }: { student: StudentAttendanceRow; teams: CourseTeam[]; onClose: () => void; onCreate: () => void; onAssign: (team: CourseTeam) => Promise<void> }) {
  const [savingId, setSavingId] = useState<string | null>(null)
  return <DialogShell title={`Asignar a ${student.firstName} ${student.lastName}`} description="Selecciona un equipo permanente existente o crea uno nuevo." onClose={onClose}><div className="space-y-2 p-5">{teams.map((team) => <button key={team.id} type="button" disabled={Boolean(savingId)} onClick={async () => { setSavingId(team.id); try { await onAssign(team) } finally { setSavingId(null) } }} className="flex min-h-12 w-full items-center gap-3 rounded-xl border border-border px-3 text-left transition hover:border-primary/30 hover:bg-primary/[0.03]"><span className="grid size-9 place-items-center rounded-xl" style={{ backgroundColor: `${team.color}18`, color: team.color }}><TeamIcon name={team.icon} className="size-4" /></span><span className="flex-1 text-sm font-bold">{team.name}</span><span className="text-xs text-muted-foreground">{savingId === team.id ? 'Asignando…' : `${team.members.length} integrantes`}</span></button>)}<button type="button" onClick={onCreate} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-primary/40 text-sm font-extrabold text-primary hover:bg-primary/[0.04]"><UserRoundPlus className="size-4" /> Crear nuevo equipo con este estudiante</button></div></DialogShell>
}

function BatchCreateTeamsDialog({ students, onClose, onCreate }: { students: StudentAttendanceRow[]; onClose: () => void; onCreate: (inputs: CourseTeamInput[]) => Promise<void> }) {
  const [teamCount, setTeamCount] = useState(2)
  const [memberCount, setMemberCount] = useState(4)
  const [saving, setSaving] = useState(false)
  return <DialogShell title="Crear varios equipos" description="Genera equipos permanentes con una distribución aleatoria simple; luego podrás ajustar sus integrantes." onClose={onClose}><div className="space-y-4 p-5"><div className="grid gap-3 sm:grid-cols-2"><label className="text-sm font-bold">Cantidad de equipos<input type="number" min={1} max={12} value={teamCount} onChange={(event) => setTeamCount(Math.max(1, Math.min(12, Number(event.target.value))))} className="mt-2 h-11 w-full rounded-xl border border-border px-3" /></label><label className="text-sm font-bold">Integrantes aproximados<input type="number" min={1} max={20} value={memberCount} onChange={(event) => setMemberCount(Math.max(1, Math.min(20, Number(event.target.value))))} className="mt-2 h-11 w-full rounded-xl border border-border px-3" /></label></div><p className="rounded-xl bg-muted/60 p-3 text-xs text-muted-foreground">Se distribuirán hasta {Math.min(students.length, teamCount * memberCount)} de {students.length} estudiantes sin equipo.</p><div className="flex justify-end gap-3"><button type="button" onClick={onClose} disabled={saving} className="h-11 rounded-xl border border-border px-4 text-sm font-bold">Cancelar</button><button type="button" disabled={saving} onClick={async () => { setSaving(true); const shuffled = [...students].sort(() => Math.random() - 0.5).slice(0, teamCount * memberCount); const inputs = Array.from({ length: teamCount }, (_, index) => ({ name: `Equipo ${index + 1}`, color: colors[index % colors.length], icon: teamIcons[index % teamIcons.length], description: '', teamType: 'permanent' as const, validityType: 'undefined' as const, members: shuffled.filter((_, studentIndex) => studentIndex % teamCount === index).map(({ enrollmentId }) => ({ enrollmentId })) })); try { await onCreate(inputs) } finally { setSaving(false) } }} className="h-11 rounded-xl bg-primary px-4 text-sm font-extrabold text-primary-foreground">{saving ? 'Creando…' : 'Crear equipos'}</button></div></div></DialogShell>
}
function EmptyTeamsState({ canManage, onCreate, onOpenGuide }: { canManage: boolean; onCreate: () => void; onOpenGuide: () => void }) {
  return <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-5 pb-4 pt-8 shadow-sm sm:px-8">
    <div className="pointer-events-none absolute left-1/2 top-8 size-32 -translate-x-1/2 rounded-full bg-primary/[0.035] blur-2xl" />
    <div className="relative text-center">
      <div className="relative mx-auto flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 text-primary shadow-inner"><UsersRound className="size-10" /><span className="absolute -left-5 top-3 size-2 rounded-full border-2 border-emerald-400 bg-white" /><span className="absolute -right-5 top-5 size-2 rotate-45 border-2 border-violet-400 bg-white" /><span className="absolute -right-8 -top-1 text-sm font-black text-orange-400">△</span><span className="absolute -left-8 -top-1 text-sm text-blue-300">✦</span></div>
      <h3 className="mt-5 text-lg font-extrabold tracking-tight">Aún no tienes equipos creados</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Crea tu primer equipo y comienza a organizar a tus estudiantes<br className="hidden sm:block" /> para proyectos, actividades y evaluaciones colaborativas.</p>
      {canManage ? <button type="button" onClick={onCreate} className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-extrabold text-primary-foreground shadow-md shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary-hover"><UserRoundPlus className="size-4" /> Crear primer equipo</button> : null}
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
    { icon: <UsersRound className="size-6" />, title: 'Qué es un equipo', detail: 'Un grupo de estudiantes propio de esta asignatura.', tone: 'bg-cyan-50 text-cyan-600' },
    { icon: <Clock3 className="size-6" />, title: 'Permanente o temporal', detail: 'Reutiliza un equipo estable o limita su vigencia.', tone: 'bg-violet-50 text-violet-600' },
    { icon: <UsersRound className="size-6" />, title: 'Crear equipo', detail: 'Define su nombre, color y tipo.', tone: 'bg-blue-50 text-blue-600' },
    { icon: <UserRoundPlus className="size-6" />, title: 'Agregar estudiantes', detail: 'Selecciona a quienes lo integrarán.', tone: 'bg-emerald-50 text-emerald-600' },
    { icon: <BookOpenCheck className="size-6" />, title: 'Crear actividad grupal', detail: 'Asigna una actividad al equipo.', tone: 'bg-violet-50 text-violet-600' },
    { icon: <Star className="size-6" />, title: 'Evaluar', detail: 'Registra el desempeño colaborativo.', tone: 'bg-amber-50 text-amber-600' },
    { icon: <BarChart3 className="size-6" />, title: 'Calificaciones', detail: 'Consulta los resultados obtenidos.', tone: 'bg-cyan-50 text-cyan-600' },
    { icon: <Archive className="size-6" />, title: 'Archivar', detail: 'Retíralo de los activos sin perder su historial.', tone: 'bg-slate-100 text-slate-600' },
  ]
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><section role="dialog" aria-modal="true" aria-labelledby="team-guide-title" className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl border border-white/60 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.28)]"><header className="flex items-start justify-between border-b border-slate-100 px-6 py-5"><div><span className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary/8 text-primary"><Lightbulb className="size-5" /></span><h2 id="team-guide-title" className="text-xl font-extrabold">Guía rápida de equipos</h2><p className="mt-1 text-xs text-muted-foreground">Del equipo a las calificaciones, paso a paso.</p></div><button type="button" onClick={onClose} aria-label="Cerrar guía rápida" className="rounded-xl p-2 text-muted-foreground transition hover:bg-slate-100 hover:text-foreground"><X className="size-5" /></button></header><div className="px-6 py-5">{steps.map((step, index) => <div key={step.title}><div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5"><span className={cn('flex size-12 shrink-0 items-center justify-center rounded-2xl', step.tone)}>{step.icon}</span><span><span className="block text-sm font-extrabold">{step.title}</span><span className="mt-0.5 block text-xs text-muted-foreground">{step.detail}</span></span><span className="ml-auto flex size-6 items-center justify-center rounded-full bg-white text-[10px] font-extrabold text-primary shadow-sm">{index + 1}</span></div>{index < steps.length - 1 ? <div className="flex h-7 items-center justify-center text-slate-300"><ArrowDown className="size-4" /></div> : null}</div>)}</div><footer className="border-t border-slate-100 bg-slate-50/70 px-6 py-4"><button type="button" onClick={onClose} className="h-11 w-full rounded-xl bg-primary text-sm font-extrabold text-primary-foreground shadow-md shadow-primary/20 transition hover:bg-primary-hover">Entendido</button></footer></section></div>
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
        <footer className="flex justify-end gap-3 border-t border-border bg-card px-6 py-4"><button type="button" onClick={onClose} className="h-11 rounded-xl border border-border px-5 font-bold">Cancelar</button><button type="button" disabled={saving} onClick={() => void submit()} className="h-11 rounded-xl bg-primary px-6 font-bold text-primary-foreground shadow disabled:opacity-60">{saving ? 'Guardando…' : team ? 'Guardar cambios' : 'Crear equipo'}</button></footer>
      </aside>
    </div>
  )
}

function TeamEditorScreen({ team, teams, students, activities, initialEnrollmentId, onClose, onSave }: {
  team: CourseTeam | null
  teams: CourseTeam[]
  students: StudentAttendanceRow[]
  activities: Array<{ id: string; name: string }>
  initialEnrollmentId: string | null
  onClose: () => void
  onSave: (input: CourseTeamInput) => Promise<void>
}) {
  const [name, setName] = useState(team?.name ?? '')
  const [teamType, setTeamType] = useState<'permanent' | 'temporary'>(team?.teamType ?? 'permanent')
  const [color, setColor] = useState(team?.color ?? colors[3])
  const [icon, setIcon] = useState(team?.icon ?? 'flask')
  const [description, setDescription] = useState(team?.description ?? '')
  const [endsAt, setEndsAt] = useState(team?.endsAt?.slice(0, 10) ?? '')
  const [validity, setValidity] = useState<'activity' | 'date' | 'period' | 'project' | 'undefined'>(team?.validityType ?? (team?.endsAt ? 'date' : 'undefined'))
  const [validityReferenceId, setValidityReferenceId] = useState(team?.validityReferenceId ?? '')
  const [validityPeriod, setValidityPeriod] = useState(team?.validityPeriod ?? 'P1')
  const [selected, setSelected] = useState<Record<string, string>>(() => ({ ...Object.fromEntries(team?.members.map((member) => [member.enrollmentId, member.role ?? '']) ?? []), ...(initialEnrollmentId ? { [initialEnrollmentId]: '' } : {}) }))
  const [query, setQuery] = useState('')
  const [studentFilter, setStudentFilter] = useState<'all' | 'selected' | 'available'>('all')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showMoreColors, setShowMoreColors] = useState(false)
  const [showIconPicker, setShowIconPicker] = useState(false)
  const [conflictTarget, setConflictTarget] = useState<{ enrollmentId: string; team: CourseTeam } | null>(null)

  const visibleStudents = students.filter((student) => {
    const matchesQuery = `${student.firstName} ${student.lastName} ${student.studentCode}`.toLocaleLowerCase('es').includes(query.toLocaleLowerCase('es'))
    const isSelected = Object.hasOwn(selected, student.enrollmentId)
    return matchesQuery && (studentFilter === 'all' || (studentFilter === 'selected' ? isSelected : !isSelected))
  })
  const selectedCount = Object.keys(selected).length

  function toggleStudent(enrollmentId: string) {
    if (!Object.hasOwn(selected, enrollmentId) && teamType === 'permanent') {
      const existingTeam = teams.find((candidate) => candidate.id !== team?.id && candidate.teamType === 'permanent' && candidate.members.some((member) => member.enrollmentId === enrollmentId))
      if (existingTeam) {
        setConflictTarget({ enrollmentId, team: existingTeam })
        return
      }
    }
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
        validityType: teamType === 'temporary' ? validity : 'undefined',
        validityReferenceId: teamType === 'temporary' && (validity === 'activity' || validity === 'project') ? validityReferenceId || null : null,
        validityPeriod: teamType === 'temporary' && validity === 'period' ? validityPeriod : null,
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
              <div><p className="text-xs font-extrabold">Color del equipo</p><div className="mt-2 flex flex-wrap gap-2">{colors.map((value) => <button key={value} type="button" aria-label={`Usar color ${value}`} aria-pressed={color === value} onClick={() => setColor(value)} className="flex size-9 items-center justify-center rounded-xl border-2 border-white shadow ring-1 ring-slate-200 transition hover:scale-105" style={{ backgroundColor: value, boxShadow: color === value ? `0 0 0 2px white, 0 0 0 4px ${value}` : undefined }}>{color === value ? <Check className="size-4 text-white" /> : null}</button>)}<button type="button" onClick={() => setShowMoreColors((current) => !current)} aria-expanded={showMoreColors} className="inline-flex h-9 items-center gap-1 rounded-xl border border-dashed border-slate-300 px-2.5 text-[10px] font-extrabold text-muted-foreground hover:border-primary hover:text-primary"><Plus className="size-3" /> Más colores</button></div>{showMoreColors ? <div className="mt-3 flex flex-wrap gap-2 rounded-xl bg-muted/40 p-3">{moreColors.map((value) => <button key={value} type="button" aria-label={`Usar color ${value}`} aria-pressed={color === value} onClick={() => setColor(value)} className="grid size-9 place-items-center rounded-xl ring-1 ring-black/10" style={{ backgroundColor: value }}>{color === value ? <Check className="size-4 text-white" /> : null}</button>)}<label className="grid size-9 cursor-pointer place-items-center rounded-xl border border-dashed border-slate-300" title="Color personalizado"><Palette className="size-4" /><input type="color" value={color} onChange={(event) => setColor(event.target.value)} className="sr-only" /></label></div> : null}</div>
            </div>
            <div className="mt-5 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div><p className="text-xs font-extrabold">Icono del equipo</p><div className="mt-2 flex flex-wrap gap-2">{teamIcons.map((value) => <button key={value} type="button" aria-label={`Usar icono ${value}`} aria-pressed={icon === value} onClick={() => setIcon(value)} className={cn('flex size-11 items-center justify-center rounded-xl border transition hover:-translate-y-0.5', icon === value ? 'border-current shadow-sm' : 'border-slate-200 text-slate-500 hover:border-slate-300')} style={icon === value ? { backgroundColor: `${color}12`, color } : undefined}><TeamIcon name={value} className="size-5" /></button>)}<button type="button" onClick={() => setShowIconPicker(true)} className="inline-flex h-11 items-center gap-1 rounded-xl border border-dashed border-slate-300 px-3 text-[10px] font-extrabold text-muted-foreground hover:border-primary hover:text-primary">••• Más iconos</button></div></div>
              <div><p className="text-xs font-extrabold">Tipo de equipo</p><div className="mt-2 space-y-3">{(['permanent', 'temporary'] as const).map((value) => <label key={value} className="flex cursor-pointer items-start gap-3"><input type="radio" name="team-type" checked={teamType === value} onChange={() => setTeamType(value)} className="mt-0.5 size-4 accent-primary" /><span><span className="block text-xs font-extrabold">{value === 'permanent' ? 'Permanente' : 'Temporal'}</span><span className="mt-0.5 block text-[10px] leading-4 text-muted-foreground">{value === 'permanent' ? 'Equipo estable y reutilizable en distintas actividades durante el curso.' : 'Equipo creado para una actividad, proyecto o período específico.'}</span></span></label>)}</div></div>
            </div>
            <label className="mt-5 block text-xs font-extrabold">Descripción <span className="font-normal text-muted-foreground">(opcional)</span><div className="relative mt-2"><textarea value={description} onChange={(event) => setDescription(event.target.value)} maxLength={200} rows={4} placeholder="Describe el propósito o características de este equipo..." className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3.5 pb-7 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10" /><span className="absolute bottom-3 right-3 text-[10px] font-semibold text-muted-foreground">{description.length} / 200</span></div></label>
          </div>

          {teamType === 'temporary' ? <div className="rounded-2xl border border-slate-200 bg-card p-5 shadow-sm"><h3 className="text-sm font-extrabold">Vigencia del equipo</h3><div className="mt-4 space-y-3">{([['activity', 'Solo para una actividad específica'], ['date', 'Hasta una fecha'], ['period', 'Durante un período'], ['project', 'Hasta finalizar un proyecto'], ['undefined', 'Sin fecha definida']] as const).map(([value, label]) => <label key={value} className="grid cursor-pointer gap-2 rounded-xl border border-transparent p-2 transition hover:bg-muted/40 sm:grid-cols-[minmax(0,1fr)_15rem]"><span className="flex items-start gap-3"><input type="radio" name="team-validity" checked={validity === value} onChange={() => setValidity(value)} className="mt-0.5 size-4 accent-primary" /><span className="text-xs font-extrabold">{label}</span></span>{validity === value && value === 'date' ? <input type="date" value={endsAt} onChange={(event) => setEndsAt(event.target.value)} className="h-10 rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-primary" /> : null}{validity === value && value === 'period' ? <select value={validityPeriod} onChange={(event) => setValidityPeriod(event.target.value as typeof validityPeriod)} className="h-10 rounded-xl border border-slate-200 bg-card px-3 text-xs font-bold">{['P1', 'P2', 'P3', 'P4'].map((period) => <option key={period}>{period}</option>)}</select> : null}{validity === value && (value === 'activity' || value === 'project') ? <select value={validityReferenceId} onChange={(event) => setValidityReferenceId(event.target.value)} className="h-10 rounded-xl border border-slate-200 bg-card px-3 text-xs font-bold"><option value="">Seleccionar {value === 'activity' ? 'actividad' : 'proyecto'}</option>{activities.map((activity) => <option key={activity.id} value={activity.id}>{activity.name}</option>)}</select> : null}</label>)}</div></div> : null}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-card shadow-sm xl:sticky xl:top-4">
          <div className="p-5"><h3 className="text-sm font-extrabold">Seleccionar integrantes</h3><p className="mt-1 text-xs text-muted-foreground">Busca y selecciona los estudiantes que formarán parte de este equipo.</p><div className="mt-4 grid gap-2 sm:grid-cols-[1fr_12rem]"><div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar estudiante..." className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-xs outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" /></div><select value={studentFilter} onChange={(event) => setStudentFilter(event.target.value as typeof studentFilter)} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold outline-none"><option value="all">Todos los estudiantes</option><option value="selected">Seleccionados</option><option value="available">Sin seleccionar</option></select></div><div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-extrabold text-emerald-700"><Users className="size-4" /> {students.length} estudiantes disponibles</div></div>
          <div className="max-h-[29rem] divide-y divide-slate-100 overflow-y-auto border-y border-slate-100 px-2">{visibleStudents.map((student, index) => { const isSelected = Object.hasOwn(selected, student.enrollmentId); return <label key={student.enrollmentId} className={cn('flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition hover:bg-slate-50', isSelected && 'bg-primary/[0.035]')}><input type="checkbox" checked={isSelected} onChange={() => toggleStudent(student.enrollmentId)} className="size-4 rounded accent-primary" /><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/8 text-[10px] font-extrabold text-primary">{student.firstName.charAt(0)}{student.lastName.charAt(0)}</span><span className="min-w-0 flex-1 truncate text-xs font-bold">{student.firstName} {student.lastName}</span><span className="text-[10px] font-semibold text-muted-foreground">{student.listNumber ? String(student.listNumber).padStart(2, '0') : String(index + 1).padStart(2, '0')}</span></label> })}{!visibleStudents.length ? <p className="px-4 py-12 text-center text-xs text-muted-foreground">No hay estudiantes que coincidan con este filtro.</p> : null}</div>
          <div className="flex items-center justify-between gap-3 bg-slate-50/70 px-5 py-3"><span className="text-xs font-extrabold text-primary">{selectedCount} {selectedCount === 1 ? 'estudiante seleccionado' : 'estudiantes seleccionados'} de {students.length}</span>{selectedCount ? <button type="button" onClick={() => setSelected({})} className="text-[10px] font-extrabold text-destructive hover:underline">Limpiar selección</button> : null}</div>
        </div>
      </div>

      {error ? <p className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm font-semibold text-destructive">{error}</p> : null}
      <footer className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between"><button type="button" onClick={onClose} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-extrabold text-muted-foreground transition hover:bg-muted"><ArrowLeft className="size-4" /> Cancelar</button><button type="button" disabled={saving} onClick={() => void submit()} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-extrabold text-primary-foreground shadow-md shadow-primary/20 transition hover:bg-primary-hover disabled:opacity-60"><UserRoundPlus className="size-4" /> {saving ? 'Guardando...' : team ? 'Guardar cambios' : 'Crear equipo'}</button></footer>
      {showIconPicker ? <IconPicker selected={icon} color={color} onSelect={(value) => { setIcon(value); setShowIconPicker(false) }} onClose={() => setShowIconPicker(false)} /> : null}
      {conflictTarget ? <ConfirmDialog title="Mover estudiante" description={`Este estudiante ya pertenece al equipo “${conflictTarget.team.name}”. Solo puede estar en un equipo permanente activo dentro de esta asignatura.`} confirmLabel="Mover al nuevo equipo" onClose={() => setConflictTarget(null)} onConfirm={() => { setSelected((current) => ({ ...current, [conflictTarget.enrollmentId]: '' })); setConflictTarget(null) }} /> : null}
    </section>
  )
}

function IconPicker({ selected, color, onSelect, onClose }: { selected: string; color: string; onSelect: (icon: string) => void; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Todos')
  const categories = ['Todos', ...new Set(iconOptions.map((option) => option.category))]
  const normalized = query.trim().toLocaleLowerCase('es')
  const options = iconOptions.filter((option) => (category === 'Todos' || option.category === category) && (!normalized || `${option.label} ${option.category}`.toLocaleLowerCase('es').includes(normalized)))
  return <DialogShell title="Más iconos" description="Busca por nombre o explora una categoría." onClose={onClose}><div className="space-y-4 p-5"><div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar icono…" className="h-11 w-full rounded-xl border border-border pl-10 pr-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" /></div><div className="flex flex-wrap gap-2">{categories.map((value) => <button key={value} type="button" aria-pressed={category === value} onClick={() => setCategory(value)} className={cn('rounded-full px-3 py-1.5 text-xs font-bold transition', category === value ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground')}>{value}</button>)}</div><div className="grid grid-cols-3 gap-2 sm:grid-cols-4">{options.map((option) => <button key={option.id} type="button" onClick={() => onSelect(option.id)} aria-pressed={selected === option.id} className={cn('flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl border text-xs font-bold transition hover:border-primary/40', selected === option.id ? 'border-current shadow-sm' : 'border-border')} style={selected === option.id ? { backgroundColor: `${color}12`, color } : undefined}><TeamIcon name={option.id} className="size-5" />{option.label}</button>)}</div></div></DialogShell>
}

function TeamIcon({ name, className }: { name: string; className?: string }) {
  if (name === 'flask') return <FlaskConical className={className} />
  if (name === 'telescope') return <Telescope className={className} />
  if (name === 'atom') return <Atom className={className} />
  if (name === 'microscope') return <Microscope className={className} />
  if (name === 'calculator') return <Calculator className={className} />
  if (name === 'book') return <BookOpen className={className} />
  if (name === 'puzzle') return <Puzzle className={className} />
  if (name === 'star') return <Star className={className} />
  if (name === 'lightbulb') return <Lightbulb className={className} />
  if (name === 'trophy') return <Trophy className={className} />
  if (name === 'rocket') return <Rocket className={className} />
  if (name === 'globe') return <Globe2 className={className} />
  return <UsersRound className={className} />
}

function QuickAction({ icon, title, detail, onClick, disabled = false }: { icon: ReactNode; title: string; detail: string; onClick?: () => void; disabled?: boolean }) {
  return <button type="button" onClick={onClick} disabled={disabled} className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-left transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:bg-white hover:shadow-md disabled:cursor-not-allowed disabled:border-dashed disabled:bg-slate-50/40 disabled:opacity-55 disabled:hover:translate-y-0 disabled:hover:shadow-none"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground group-disabled:bg-slate-100 group-disabled:text-slate-400">{icon}</span><span className="min-w-0"><span className="block truncate text-xs font-extrabold">{title}</span><span className="block truncate text-[10px] text-muted-foreground">{detail}</span></span></button>
}

function PanelMessage({ text, destructive = false }: { text: string; destructive?: boolean }) {
  return <div className={cn('rounded-2xl border border-dashed p-12 text-center text-sm font-semibold', destructive ? 'border-destructive/30 bg-destructive/5 text-destructive' : 'border-border bg-card text-muted-foreground')}>{text}</div>
}
