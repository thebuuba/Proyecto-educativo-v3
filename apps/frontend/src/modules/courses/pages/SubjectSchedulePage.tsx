import {
  BookOpen,
  CalendarDays,
  Clock3,
  GraduationCap,
  LayoutDashboard,
  Library,
  MapPin,
  Pencil,
  Play,
  SlidersHorizontal,
  UsersRound,
  ClipboardList,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { Badge } from '@/components/ui/Badge'
import { BackIcon } from '@/components/ui/BackIcon'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { getGradingWorkspace } from '@/modules/grading/services/gradingService'
import { getScheduleEntries } from '@/modules/schedule/services/scheduleService'
import type { ScheduleEntry } from '@/modules/schedule/types'
import { COUNTDOWN_THRESHOLD_SECONDS, formatCountdown, getClassClock, getScheduledClassDate, getScheduledClassState, timeToSeconds } from '@/modules/schedule/utils/classTime'
import { cn } from '@/utils/cn'
import { SubjectTabHeader, SubjectStat } from '../components/SubjectTabUI'

type SubjectMeta = {
  gradeName: string
  sectionName: string
  subjectName: string
  schoolYearName: string
  studentCount: number
}
const emptyMeta: SubjectMeta = { gradeName: '', sectionName: '', subjectName: 'Asignatura', schoolYearName: '', studentCount: 0 }
const dayLabels = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const scheduleDateFormatter = new Intl.DateTimeFormat('es-DO', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })

function minutesBetween(start: string, end: string) {
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  return Math.max((eh * 60 + em) - (sh * 60 + sm), 0)
}

function formatTime(value: string) {
  return value.slice(0, 5)
}

export function SubjectSchedulePage({ embedded = false }: { embedded?: boolean }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const subjectId = searchParams.get('subjectId') ?? ''
  const [meta, setMeta] = useState<SubjectMeta>(emptyMeta)
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    if (!subjectId) return
    let active = true
    setLoading(true)
    setError(null)
    Promise.all([
      getGradingWorkspace({ sectionSubjectId: subjectId, includeOptions: true }),
      getScheduleEntries({ sectionSubjectId: subjectId }),
    ])
      .then(([workspace, entries]) => {
        if (!active) return
        const selected = workspace.sectionSubjects.find((item) => item.id === subjectId)
        setMeta({
          gradeName: selected?.gradeName ?? '',
          sectionName: selected?.sectionName ?? '',
          subjectName: selected?.subjectName ?? entries[0]?.subjectName ?? 'Asignatura',
          schoolYearName: selected?.schoolYearName ?? '',
          studentCount: workspace.students.length,
        })
        setSchedule(entries)
      })
      .catch((cause) => { if (active) setError(cause instanceof Error ? cause.message : 'No se pudo cargar el horario de la asignatura.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [subjectId])

  useEffect(() => {
    if (!schedule.length) return
    const interval = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(interval)
  }, [schedule.length])

  const sorted = useMemo(() => [...schedule].sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime)), [schedule])
  const grouped = useMemo(() => [1, 2, 3, 4, 5]
    .map((day) => ({ day, entries: sorted.filter((entry) => entry.dayOfWeek === day) }))
, [sorted])
  const weeklyMinutes = useMemo(() => sorted.reduce((total, entry) => total + minutesBetween(entry.startTime, entry.endTime), 0), [sorted])
  const temporalClass = useMemo(() => getScheduledClassState(sorted, now), [now, sorted])
  const today = getClassClock(now).dayOfWeek
  const summaryClass = useMemo(() => temporalClass?.state === 'current'
    ? getScheduledClassState(sorted, new Date(now.getTime() + (temporalClass.seconds + 1) * 1000))
    : temporalClass, [now, sorted, temporalClass])

  const setTab = (tab: string) => {
    const next = new URLSearchParams(searchParams)
    next.set('tab', tab)
    setSearchParams(next)
  }
  const back = () => {
    const next = new URLSearchParams(searchParams)
    next.delete('subjectId')
    next.delete('tab')
    setSearchParams(next)
  }

  const tabs = [
    { id: 'resumen', label: 'Resumen', Icon: LayoutDashboard },
    { id: 'estudiantes', label: 'Estudiantes', Icon: UsersRound },
    { id: 'equipos', label: 'Equipos', Icon: UsersRound },
    { id: 'actividades', label: 'Actividades', Icon: ClipboardList },
    { id: 'asistencia', label: 'Asistencia', Icon: CalendarDays },
    { id: 'calificaciones', label: 'Calificaciones', Icon: GraduationCap },
    { id: 'horario', label: 'Horario', Icon: CalendarDays },
    { id: 'recursos', label: 'Recursos', Icon: Library },
    { id: 'reportes', label: 'Reportes', Icon: LayoutDashboard },
    { id: 'configuracion', label: 'Configuración', Icon: SlidersHorizontal },
    { id: 'planificaciones', label: 'Planificaciones', Icon: ClipboardList, muted: true, badge: 'Próximamente' },
  ] as const

  if (loading) return <div className="flex min-h-[28rem] items-center justify-center text-sm font-semibold text-muted-foreground">Cargando horario…</div>
  if (error) return <ErrorState message={error} />

  return <div className="course-workspace-shell w-full min-w-0 max-w-full overflow-x-clip space-y-3">
    {!embedded && <><header className="rounded-2xl bg-card shadow-sm">
      <div className="flex min-h-[76px] items-center gap-3 px-4 py-3 sm:px-5">
        <button type="button" onClick={back} className="flex h-10 shrink-0 items-center gap-1.5 rounded-xl border border-border bg-card px-3 text-xs font-extrabold text-primary transition hover:bg-primary/[0.04]"><BackIcon /> Volver</button>
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm"><BookOpen className="size-6" /></span>
        <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h1 className="truncate text-base font-extrabold">{meta.gradeName} {meta.sectionName} – {meta.subjectName}</h1><Badge tone="success">Activa</Badge></div><p className="mt-1 text-[11px] font-semibold text-muted-foreground">{meta.schoolYearName ? `Año escolar ${meta.schoolYearName}` : 'Asignatura activa'}</p></div>
      </div>
    </header>

    <nav className="grid w-full grid-cols-2 gap-1 rounded-2xl bg-card p-1.5 shadow-sm sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6" aria-label="Secciones de la asignatura">
      {tabs.map((tab) => { const active = tab.id === 'horario'; const muted = 'muted' in tab && tab.muted; const badge = 'badge' in tab ? tab.badge : undefined; const Icon = tab.Icon; return <button key={tab.id} type="button" onClick={() => setTab(tab.id)} aria-current={active ? 'page' : undefined} className={cn('relative flex h-10 min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-2 text-sm font-bold text-muted-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring hover:bg-primary/5 hover:text-primary', active && 'bg-primary/[0.055] text-primary after:absolute after:bottom-0 after:left-4 after:right-4 after:h-0.5 after:rounded-t-full after:bg-primary', muted && !active && 'bg-muted/40 text-muted-foreground/70 hover:bg-muted/60 hover:text-muted-foreground')}><Icon className="size-4" aria-hidden="true" />{tab.label}{badge ? <span className="hidden rounded-full bg-muted px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wide text-muted-foreground 2xl:inline">{badge}</span> : null}</button> })}
    </nav></>}

    <section className="subject-schedule space-y-4">
      <SubjectTabHeader title="Horario semanal" description="Cuándo se imparte esta materia durante la semana." context={`${meta.gradeName} ${meta.sectionName} · ${meta.subjectName}`} actions={<Link to="/horario"><Button variant="outline"><Pencil className="size-4" /> Editar horario</Button></Link>} />
      {!sorted.length ? <div className="p-5"><EmptyState title="Esta asignatura todavía no tiene clases programadas." description="El horario se configurará desde el módulo principal de Horario." /></div> : <>
        <div>
          <SubjectClassStatusCard
            temporalClass={temporalClass}
            meta={meta}
            now={now}
            onStart={() => setTab('asistencia')}
          />
        </div>
        <div className="subject-stat-grid subject-stat-grid-three">
          <SubjectStat icon={CalendarDays} label="Clases por semana" value={sorted.length} />
          <SubjectStat icon={Clock3} tone="warning" label="Tiempo semanal" value={`${Math.floor(weeklyMinutes / 60)} h ${weeklyMinutes % 60} min`} />
          <SubjectStat icon={Play} tone="success" label="Próxima clase" value={summaryClass ? `${dayLabels[summaryClass.entry.dayOfWeek].slice(0, 3)} ${formatTime(summaryClass.entry.startTime)}` : '—'} />
        </div>
        <div className="subject-week-grid">{grouped.map(group => <section key={group.day} className={cn('subject-week-day', group.day === today && 'is-today')} aria-labelledby={`schedule-day-${group.day}`}>
          <header><h3 id={`schedule-day-${group.day}`}>{dayLabels[group.day]}</h3><span>{group.day === today ? 'Hoy' : group.entries.length ? `${group.entries.length} ${group.entries.length === 1 ? 'clase' : 'clases'}` : ''}</span></header>
          {group.entries.length ? group.entries.map(entry => <article key={entry.id}><strong>{formatTime(entry.startTime)} – {formatTime(entry.endTime)}</strong><p><Clock3 />{minutesBetween(entry.startTime, entry.endTime)} min</p><p><MapPin />{entry.room || 'Aula sin asignar'}</p></article>) : <div className="subject-week-empty">Sin clase</div>}
        </section>)}</div>
      </>}
    </section>
  </div>
}

function SubjectClassStatusCard({ temporalClass, meta, now, onStart }: {
  temporalClass: ReturnType<typeof getScheduledClassState>
  meta: SubjectMeta
  now: Date
  onStart: () => void
}) {
  if (!temporalClass) return <section className="rounded-2xl border border-border bg-muted/20 px-4 py-3"><p className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">Sin clases próximas</p><p className="mt-1 text-sm text-muted-foreground">No hay más clases programadas para esta asignatura en los próximos días.</p></section>

  const { entry, state, seconds, dayOffset } = temporalClass
  const countdown = state === 'current' || state === 'soon'
  const current = state === 'current'
  const date = scheduleDateFormatter.format(getScheduledClassDate(dayOffset, now))
  const durationSeconds = Math.max(1, timeToSeconds(entry.endTime) - timeToSeconds(entry.startTime))
  const progress = current ? (seconds / durationSeconds) * 100 : 100 - (seconds / COUNTDOWN_THRESHOLD_SECONDS) * 100

  return <section className={cn('rounded-2xl border p-4 shadow-sm', current ? 'border-success/30 bg-success/10' : state === 'soon' ? 'border-warning/40 bg-warning/15' : 'border-border bg-card')} aria-labelledby="subject-class-status">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      {countdown ? <CountdownRing current={current} seconds={seconds} progress={progress} /> : <span className="grid size-[72px] shrink-0 place-items-center rounded-2xl bg-warning/20 text-warning-foreground"><CalendarDays className="size-7" aria-hidden="true" /></span>}
      <div className="min-w-0 flex-1">
        <p className={cn('text-[10px] font-black uppercase tracking-[0.18em]', current ? 'text-success-foreground' : state === 'soon' ? 'text-warning-foreground' : 'text-muted-foreground')}>{current ? 'Clase en curso' : 'Próxima clase'}</p>
        {!countdown ? <p className="mt-1 text-sm font-bold capitalize text-foreground">{date}</p> : null}
        <h3 id="subject-class-status" className="mt-1 break-words text-lg font-extrabold leading-tight text-foreground">{meta.subjectName}</h3>
        <p className="mt-1 text-sm font-semibold text-muted-foreground">{meta.gradeName} {meta.sectionName}</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><Clock3 className="size-3.5" aria-hidden="true" />{formatTime(entry.startTime)} – {formatTime(entry.endTime)}</span>
          <span className="inline-flex items-center gap-1.5"><MapPin className="size-3.5" aria-hidden="true" />{entry.room || 'Aula sin asignar'}</span>
          <span className="inline-flex items-center gap-1.5"><UsersRound className="size-3.5" aria-hidden="true" />{meta.studentCount} estudiantes</span>
        </div>
      </div>
      <Button className="w-full shrink-0 sm:w-auto" onClick={onStart}><Play className="size-4 fill-current" aria-hidden="true" /> Iniciar clase</Button>
    </div>
  </section>
}

function CountdownRing({ current, seconds, progress }: { current: boolean; seconds: number; progress: number }) {
  const circumference = 2 * Math.PI * 31
  const length = Math.max(0, Math.min(100, progress)) / 100 * circumference
  return <div className="relative grid size-20 shrink-0 place-items-center sm:size-[88px]" role="timer" aria-live="off" aria-label={`${current ? 'Termina' : 'Empieza'} en ${formatCountdown(seconds)}`}>
    <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="31" fill="none" stroke="var(--border)" strokeWidth="7" /><circle cx="40" cy="40" r="31" fill="none" stroke={current ? 'var(--success)' : 'var(--warning)'} strokeDasharray={`${length} ${circumference}`} strokeLinecap="round" strokeWidth="7" className="transition-[stroke-dasharray] duration-1000 ease-linear motion-reduce:transition-none" /></svg>
    <span className="text-center"><span className="block whitespace-nowrap text-[8px] font-black uppercase tracking-[0.04em] text-muted-foreground">{current ? 'Termina' : 'Empieza'}</span><strong className="mt-1 block text-base tabular-nums text-foreground">{formatCountdown(seconds)}</strong></span>
  </div>
}
