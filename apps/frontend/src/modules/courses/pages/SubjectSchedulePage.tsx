import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Clock3,
  GraduationCap,
  LayoutDashboard,
  Library,
  MapPin,
  Pencil,
  SlidersHorizontal,
  UsersRound,
  ClipboardList,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { getGradingWorkspace } from '@/modules/grading/services/gradingService'
import { getScheduleEntries } from '@/modules/schedule/services/scheduleService'
import type { ScheduleEntry } from '@/modules/schedule/types'
import { cn } from '@/utils/cn'

type SubjectMeta = {
  gradeName: string
  sectionName: string
  subjectName: string
  schoolYearName: string
}

const emptyMeta: SubjectMeta = { gradeName: '', sectionName: '', subjectName: 'Asignatura', schoolYearName: '' }
const dayLabels = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

function minutesBetween(start: string, end: string) {
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  return Math.max((eh * 60 + em) - (sh * 60 + sm), 0)
}

function formatTime(value: string) {
  return value.slice(0, 5)
}

export function SubjectSchedulePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const subjectId = searchParams.get('subjectId') ?? ''
  const [meta, setMeta] = useState<SubjectMeta>(emptyMeta)
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        })
        setSchedule(entries)
      })
      .catch((cause) => { if (active) setError(cause instanceof Error ? cause.message : 'No se pudo cargar el horario de la asignatura.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [subjectId])

  const sorted = useMemo(() => [...schedule].sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime)), [schedule])
  const grouped = useMemo(() => [1, 2, 3, 4, 5]
    .map((day) => ({ day, entries: sorted.filter((entry) => entry.dayOfWeek === day) }))
    .filter((group) => group.entries.length), [sorted])
  const weeklyMinutes = useMemo(() => sorted.reduce((total, entry) => total + minutesBetween(entry.startTime, entry.endTime), 0), [sorted])
  const today = new Date().getDay()
  const todayEntries = sorted.filter((entry) => entry.dayOfWeek === today)
  const nextClass = useMemo(() => {
    if (!sorted.length) return null
    const now = new Date()
    const nowMinutes = now.getHours() * 60 + now.getMinutes()
    const upcomingToday = sorted.find((entry) => entry.dayOfWeek === today && Number(entry.endTime.slice(0, 2)) * 60 + Number(entry.endTime.slice(3, 5)) >= nowMinutes)
    if (upcomingToday) return { entry: upcomingToday, offset: 0 }
    for (let offset = 1; offset <= 7; offset += 1) {
      const day = (today + offset) % 7
      const entry = sorted.find((item) => item.dayOfWeek === day)
      if (entry) return { entry, offset }
    }
    return null
  }, [sorted, today])

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

  return <div className="space-y-3">
    <header className="rounded-2xl bg-card shadow-sm">
      <div className="flex min-h-[76px] items-center gap-3 px-4 py-3 sm:px-5">
        <button type="button" onClick={back} className="flex h-10 shrink-0 items-center gap-1.5 rounded-xl border border-border bg-card px-3 text-xs font-extrabold text-primary transition hover:bg-primary/[0.04]"><ArrowLeft className="size-4" /> Volver</button>
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm"><BookOpen className="size-6" /></span>
        <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h1 className="truncate text-base font-extrabold">{meta.gradeName} {meta.sectionName} – {meta.subjectName}</h1><Badge tone="success">Activa</Badge></div><p className="mt-1 text-[11px] font-semibold text-muted-foreground">{meta.schoolYearName ? `Año escolar ${meta.schoolYearName}` : 'Asignatura activa'}</p></div>
      </div>
    </header>

    <nav className="grid w-full grid-cols-2 gap-1 rounded-2xl bg-card p-1.5 shadow-sm sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6" aria-label="Secciones de la asignatura">
      {tabs.map((tab) => { const active = tab.id === 'horario'; const muted = 'muted' in tab && tab.muted; const badge = 'badge' in tab ? tab.badge : undefined; const Icon = tab.Icon; return <button key={tab.id} type="button" onClick={() => setTab(tab.id)} aria-current={active ? 'page' : undefined} className={cn('relative flex h-10 min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-2 text-sm font-bold text-muted-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring hover:bg-primary/5 hover:text-primary', active && 'bg-primary/[0.055] text-primary after:absolute after:bottom-0 after:left-4 after:right-4 after:h-0.5 after:rounded-t-full after:bg-primary', muted && !active && 'bg-muted/40 text-muted-foreground/70 hover:bg-muted/60 hover:text-muted-foreground')}><Icon className="size-4" aria-hidden="true" />{tab.label}{badge ? <span className="hidden rounded-full bg-muted px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wide text-muted-foreground 2xl:inline">{badge}</span> : null}</button> })}
    </nav>

    <section className="overflow-hidden rounded-3xl bg-card shadow-sm">
      <div className="flex flex-col gap-4 border-b border-border px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-primary">Horario de la asignatura</p><h2 className="mt-1 text-xl font-extrabold text-foreground">Horario semanal</h2><p className="mt-1 text-sm text-muted-foreground">Consulta cuándo se imparte esta asignatura durante la semana.</p></div>
        <Link to="/horario"><Button variant="outline"><Pencil className="size-4" aria-hidden="true" /> Editar horario</Button></Link>
      </div>

      {!sorted.length ? <div className="p-5"><EmptyState title="Esta asignatura todavía no tiene clases programadas." description="El horario se configurará desde el módulo principal de Horario." /></div> : <>
        <div className="grid gap-3 p-5 md:grid-cols-3">
          <SummaryCard icon={<CalendarDays className="size-5" aria-hidden="true" />} label="Clases por semana" value={`${sorted.length}`} helper="clases programadas" />
          <SummaryCard icon={<Clock3 className="size-5" aria-hidden="true" />} label="Tiempo semanal" value={`${weeklyMinutes} min`} helper="de clases" />
          <SummaryCard icon={<CalendarDays className="size-5" aria-hidden="true" />} label="Próxima clase" value={nextClass ? dayLabels[nextClass.entry.dayOfWeek] : '—'} helper={nextClass ? `${formatTime(nextClass.entry.startTime)} – ${formatTime(nextClass.entry.endTime)}` : 'Sin clases programadas'} emphasis />
        </div>

        <div className="border-t border-border px-5 py-5">
          <div className="mb-4 flex items-end justify-between gap-3"><div><h3 className="text-sm font-extrabold">Semana de clases</h3><p className="mt-1 text-xs text-muted-foreground">Cada tarjeta representa un encuentro habitual de esta asignatura.</p></div>{todayEntries.length ? <span className="rounded-full bg-primary/8 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-primary">{todayEntries.length === 1 ? 'Clase hoy' : `${todayEntries.length} clases hoy`}</span> : null}</div>
          <div className="space-y-5">{grouped.map((group) => <section key={group.day} aria-labelledby={`schedule-day-${group.day}`}>
            <h4 id={`schedule-day-${group.day}`} className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-foreground">{dayLabels[group.day]}</h4>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{group.entries.map((entry) => {
              const isToday = entry.dayOfWeek === today
              const duration = minutesBetween(entry.startTime, entry.endTime)
              return <article key={entry.id} className={cn('relative overflow-hidden rounded-2xl border bg-card p-4 shadow-sm transition-[transform,box-shadow,border-color] duration-200 motion-reduce:transform-none motion-reduce:transition-none hover:-translate-y-0.5 hover:shadow-md', isToday ? 'border-primary/30 ring-1 ring-primary/10' : 'border-border')}>
                <div className={cn('absolute inset-x-0 top-0 h-1', isToday ? 'bg-primary' : 'bg-primary/20')} />
                <div className="flex items-start justify-between gap-3"><div className="min-w-0"><div className="flex items-center gap-2">{isToday ? <span className="rounded-full bg-primary/8 px-2 py-0.5 text-[9px] font-black uppercase text-primary">Hoy</span> : null}</div><p className="mt-2 text-xl font-black tracking-tight text-foreground">{formatTime(entry.startTime)} – {formatTime(entry.endTime)}</p><p className="mt-1 text-xs font-semibold text-muted-foreground">{duration} min</p></div><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/[0.07] text-primary"><Clock3 className="size-5" aria-hidden="true" /></span></div>
                <div className="mt-4 border-t border-border pt-3"><p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Aula</p><p className="mt-1 inline-flex min-w-0 items-center gap-1.5 text-sm font-semibold text-foreground"><MapPin className="size-3.5 shrink-0 text-primary" aria-hidden="true" /><span className="break-words">{entry.room || 'Sin asignar'}</span></p></div>
              </article>
            })}</div>
          </section>)}</div>
        </div>

        {nextClass ? <div className="border-t border-border bg-muted/[0.18] px-5 py-5"><div className="flex flex-col gap-3 rounded-2xl border border-primary/15 bg-primary/[0.035] p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground"><CalendarDays className="size-5" /></span><div><p className="text-[10px] font-black uppercase tracking-[0.15em] text-primary">Próxima clase</p><p className="mt-1 font-extrabold">{nextClass.offset === 0 ? 'Hoy' : dayLabels[nextClass.entry.dayOfWeek]}, {formatTime(nextClass.entry.startTime)} – {formatTime(nextClass.entry.endTime)}</p><p className="mt-0.5 text-xs text-muted-foreground">{meta.subjectName}{nextClass.entry.room ? ` · ${nextClass.entry.room}` : ''}</p></div></div><span className="text-xs font-bold text-muted-foreground">{minutesBetween(nextClass.entry.startTime, nextClass.entry.endTime)} minutos</span></div></div> : null}
      </>}
    </section>
  </div>
}

function SummaryCard({ icon, label, value, helper, emphasis = false }: { icon: React.ReactNode; label: string; value: string; helper: string; emphasis?: boolean }) {
  return <div className={cn('rounded-2xl border p-4', emphasis ? 'border-primary/20 bg-primary/[0.035]' : 'border-border bg-card')}><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-[0.13em] text-muted-foreground">{label}</p><p className={cn('mt-1 text-2xl font-black tracking-tight', emphasis && 'text-primary')}>{value}</p><p className="mt-1 text-xs text-muted-foreground">{helper}</p></div><span className="grid size-10 place-items-center rounded-xl bg-primary/[0.07] text-primary">{icon}</span></div></div>
}
