import {
  Archive,
  CalendarRange,
  Check,
  Edit3,
  Plus,
  Search,
  ShieldCheck,
  UsersRound,
  X,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

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
const roles = ['Coordinador', 'Secretario', 'Investigador', 'Expositor', 'Diseñador']

export function CourseTeamsPanel({
  sectionSubjectId,
  students,
  canManage,
}: {
  sectionSubjectId: string | null
  students: StudentAttendanceRow[]
  canManage: boolean
}) {
  const [teams, setTeams] = useState<CourseTeam[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [type, setType] = useState<'all' | 'permanent' | 'temporary'>('all')
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

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('es')
    return teams.filter((team) => {
      const matchesType = type === 'all' || team.teamType === type
      const matchesQuery = !normalized || team.name.toLocaleLowerCase('es').includes(normalized)
        || team.members.some(({ enrollment }) =>
          `${enrollment.student.firstName} ${enrollment.student.lastName}`.toLocaleLowerCase('es').includes(normalized))
      return matchesType && matchesQuery
    })
  }, [query, teams, type])

  const assigned = new Set(
    teams.filter((team) => team.teamType === 'permanent')
      .flatMap((team) => team.members.map((member) => member.enrollmentId)),
  )

  if (!sectionSubjectId) {
    return <PanelMessage text="Selecciona una asignatura para organizar sus equipos de trabajo." />
  }

  return (
    <section className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat value={teams.length} label="Equipos" icon={<UsersRound className="size-5" />} />
        <Stat value={assigned.size} label="Estudiantes asignados" icon={<Check className="size-5" />} />
        <Stat value={Math.max(students.length - assigned.size, 0)} label="Sin equipo permanente" icon={<ShieldCheck className="size-5" />} />
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar equipo o estudiante…"
              className="h-10 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </div>
          <div className="flex items-center gap-2">
            {(['all', 'permanent', 'temporary'] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setType(value)}
                className={cn('rounded-lg px-3 py-2 text-xs font-bold transition', type === value ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:text-foreground')}
              >
                {value === 'all' ? 'Todos' : value === 'permanent' ? 'Permanentes' : 'Temporales'}
              </button>
            ))}
            {canManage ? (
              <button type="button" onClick={() => setEditing('new')} className="ml-1 inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white shadow-sm hover:bg-primary/90">
                <Plus className="size-4" /> Crear equipo
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {error ? <PanelMessage text={error} destructive /> : loading ? (
        <PanelMessage text="Cargando equipos…" />
      ) : filtered.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((team) => (
            <article key={team.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="h-2" style={{ backgroundColor: team.color }} />
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl text-white" style={{ backgroundColor: team.color }}>
                      <UsersRound className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-extrabold text-foreground">{team.name}</h3>
                      <p className="text-xs font-semibold text-muted-foreground">{team.teamType === 'permanent' ? 'Equipo permanente' : 'Equipo temporal'}</p>
                    </div>
                  </div>
                  {canManage ? (
                    <div className="flex gap-1">
                      <button type="button" onClick={() => setEditing(team)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-primary" aria-label={`Editar ${team.name}`}><Edit3 className="size-4" /></button>
                      <button type="button" onClick={() => setArchiveTarget(team)} className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" aria-label={`Archivar ${team.name}`}><Archive className="size-4" /></button>
                    </div>
                  ) : null}
                </div>
                {team.description ? <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">{team.description}</p> : null}
                <div className="mt-4 flex -space-x-2">
                  {team.members.slice(0, 6).map(({ id, enrollment }) => (
                    <span key={id} title={`${enrollment.student.firstName} ${enrollment.student.lastName}`} className="flex size-8 items-center justify-center rounded-full border-2 border-card text-[10px] font-extrabold text-white" style={{ backgroundColor: team.color }}>
                      {enrollment.student.firstName.charAt(0)}{enrollment.student.lastName.charAt(0)}
                    </span>
                  ))}
                  {team.members.length > 6 ? <span className="flex size-8 items-center justify-center rounded-full border-2 border-card bg-muted text-[10px] font-bold">+{team.members.length - 6}</span> : null}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs font-semibold text-muted-foreground">
                  <span>{team.members.length} integrantes</span>
                  {team.endsAt ? <span className="inline-flex items-center gap-1"><CalendarRange className="size-3.5" /> Hasta {new Date(team.endsAt).toLocaleDateString('es-DO')}</span> : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><UsersRound className="size-7" /></span>
          <h3 className="mt-4 font-extrabold">{teams.length ? 'No hay coincidencias' : 'Aún no hay equipos'}</h3>
          <p className="mt-1 text-sm text-muted-foreground">Organiza la clase en equipos permanentes o temporales.</p>
          {canManage && !teams.length ? <button type="button" onClick={() => setEditing('new')} className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white">Crear primer equipo</button> : null}
        </div>
      )}

      {editing ? (
        <TeamEditor
          team={editing === 'new' ? null : editing}
          students={students}
          onClose={() => setEditing(null)}
          onSave={async (input) => {
            if (editing === 'new') await createCourseTeam(sectionSubjectId, input)
            else await updateCourseTeam(editing.id, input)
            setEditing(null)
            await loadTeams()
          }}
        />
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
    </section>
  )
}

function TeamEditor({ team, students, onClose, onSave }: {
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

function Stat({ value, label, icon }: { value: number; label: string; icon: ReactNode }) {
  return <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm"><span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">{icon}</span><div><p className="text-2xl font-extrabold tabular-nums">{value}</p><p className="text-xs font-semibold text-muted-foreground">{label}</p></div></div>
}

function PanelMessage({ text, destructive = false }: { text: string; destructive?: boolean }) {
  return <div className={cn('rounded-2xl border border-dashed p-12 text-center text-sm font-semibold', destructive ? 'border-destructive/30 bg-destructive/5 text-destructive' : 'border-border bg-card text-muted-foreground')}>{text}</div>
}
