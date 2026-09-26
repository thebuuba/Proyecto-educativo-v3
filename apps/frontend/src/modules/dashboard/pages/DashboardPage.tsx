import {
  ArrowRight,
  AlertTriangle,
  Bell,
  BookMarked,
  CalendarCheck,
  CalendarDays,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Ellipsis,
  Flag,
  GraduationCap,
  MessageCircle,
  NotebookPen,
  Plus,
  RefreshCw,
  Sparkles,
  Target,
  Users,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { flushSync } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'

import { ErrorState, Modal } from '@/components/ui'
import { PageSkeleton } from '@/components/ui/PageSkeleton'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { DashboardHero } from '@/modules/dashboard/components/DashboardHero'
import { useDashboard } from '@/modules/dashboard/hooks/useDashboard'
import { getNextSetupTourStep, startSetupTour } from '@/modules/dashboard/setupTour'
import type {
  DashboardClass,
  DashboardData,
  RecentActivityItem,
} from '@/modules/dashboard/types/dashboard'
import { navigationRoutes } from '@/routes/appRoutes'
import './dashboard-redesign.css'

const activityLabels: Record<RecentActivityItem['kind'], string> = {
  grade: 'Evaluación',
  attendance: 'Asistencia',
  activity: 'Actividad',
  planning: 'Actividad',
  report: 'Reporte',
}
const activityIcons = {
  grade: GraduationCap,
  attendance: CalendarCheck,
  activity: ClipboardCheck,
  planning: ClipboardCheck,
  report: BookMarked,
}
const journalLabels: Record<string, string> = {
  quick_note: 'Nota rápida',
  student_observation: 'Observación de estudiante',
  incident: 'Incidente',
  class_observation: 'Observación de clase',
  pedagogical_idea: 'Idea pedagógica',
  course_observation: 'Observación de curso',
}

const quickPaths = ['/cursos', '/horario', '/asistencia', '/calificaciones', '/actividades', '/planificaciones', '/bitacora', '/reportes']

const widgetOptions = [
  { id: 'class', label: 'Clase del día', detail: 'Clase actual o próxima' },
  { id: 'period', label: 'Cierre de período', detail: 'Avance de calificaciones', route: '/calificaciones' },
  { id: 'today', label: 'Asistencia de hoy', detail: 'Clases y estudiantes registrados', route: '/asistencia' },
  { id: 'weekly', label: 'Asistencia semanal', detail: 'Promedio de la semana', route: '/asistencia' },
  { id: 'evaluations', label: 'Evaluaciones', detail: 'Promedio de calificaciones', route: '/calificaciones' },
  { id: 'actions', label: '¿Qué quieres hacer?', detail: 'Acciones recomendadas' },
  { id: 'shortcuts', label: 'Acceso rápido', detail: 'Enlaces a los módulos del sistema' },
  { id: 'attention', label: 'Requieren atención', detail: 'Estudiantes con alertas reales', route: '/estudiantes' },
  { id: 'competencies', label: 'Competencias fundamentales', detail: 'Logro por competencia cuando haya datos', route: '/calificaciones' },
  { id: 'planning', label: 'Planificación', detail: 'Planes del período', route: '/planificaciones' },
  { id: 'recent', label: 'Actividad reciente', detail: 'Últimos movimientos' },
  { id: 'journal', label: 'Bitácora docente', detail: 'Anotaciones y seguimientos', route: '/bitacora' },
  { id: 'pulse', label: 'Pulso semanal', detail: 'Registro de asistencia', route: '/asistencia' },
  { id: 'agenda', label: 'Tu agenda', detail: 'Clases y tareas del día' },
  { id: 'calendar', label: 'Calendario escolar', detail: 'Fechas de períodos configurados' },
  { id: 'communications', label: 'Avisos y familias', detail: 'Comunicaciones enviadas', route: '/estudiantes' },
] as const
type WidgetId = (typeof widgetOptions)[number]['id']
const newWidgets: WidgetId[] = ['attention', 'competencies', 'planning', 'calendar', 'communications']
const defaultWidgets: WidgetId[] = ['class', 'period', 'today', 'actions', ...newWidgets, 'recent', 'journal', 'agenda']

function readWidgets(key: string): WidgetId[] {
  try {
    const current = localStorage.getItem(key)
    const saved: unknown = JSON.parse(current ?? localStorage.getItem(key.replace(':v2:', ':v1:')) ?? 'null')
    if (Array.isArray(saved)) {
      const selected = saved.filter((id): id is WidgetId => widgetOptions.some((item) => item.id === id))
      return current === null ? [...new Set([...selected, ...newWidgets])] : selected
    }
  } catch { /* Use defaults when storage is unavailable. */ }
  return defaultWidgets
}

function getGreeting() {
  const hour = new Date().getHours()
  return hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches'
}

function ProgressRing({
  value,
  label,
  tone,
}: {
  value: number | null
  label: string
  tone: 'orange' | 'violet'
}) {
  const percent = value === null ? 0 : Math.max(0, Math.min(100, value))
  return (
    <span
      className="home-progress-ring"
      role="img"
      aria-label={`${label}: ${value === null ? 'sin datos' : `${percent}%`}`}
      style={{ background: `conic-gradient(var(--palette-${tone}) ${percent}%, var(--border) 0)` }}
    >
      <span>{value === null ? '—' : `${percent}%`}</span>
    </span>
  )
}

function MetricCard({
  icon: Icon,
  title,
  detail,
  value,
  path,
  tone,
}: {
  icon: typeof CalendarCheck
  title: string
  detail: string
  value: number | null
  path?: string
  tone: 'orange' | 'violet'
}) {
  return (
    <article className="home-metric-card" data-home-widget={tone === 'orange' ? 'weekly' : 'evaluations'}>
      <div className="flex items-start justify-between">
        <span className={`home-metric-icon home-tone-${tone}`}>
          <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
        </span>
        <ProgressRing value={value} label={title} tone={tone} />
      </div>
      <div className="mt-4">
        <h2 className="text-[14px] font-semibold text-foreground">{title}</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">{detail}</p>
      </div>
      {path ? (
        <Link
          to={path}
          className="mt-auto inline-flex items-center gap-1 pt-4 text-xs font-bold text-primary hover:underline"
        >
          Ver detalle <ArrowRight size={14} aria-hidden="true" />
        </Link>
      ) : null}
    </article>
  )
}

function PeriodClosingCard({ data }: { data: DashboardData['periodClosing'] }) {
  return (
    <article className="home-period-card" data-home-widget="period">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="home-widget-eyebrow"><Flag size={12} aria-hidden="true" /> Cierre de período</p>
          <h2 className="mt-1 text-base font-semibold text-foreground">
            {data ? <>{data.name} cierra en <span className="text-primary">{data.daysRemaining} días</span></> : 'Sin período activo'}
          </h2>
          <p className="truncate text-xs text-muted-foreground">{data?.rangeLabel ?? 'Configura el período académico'}</p>
        </div>
        <div className="home-period-ring" role="img" aria-label={`Calificado: ${data?.percentage ?? 0}%`} style={{ background: `conic-gradient(var(--palette-violet) ${data?.percentage ?? 0}%, var(--border) 0)` }}>
          <span><strong>{data?.percentage ?? '—'}{data?.percentage === null || !data ? '' : '%'}</strong><small>CALIFICADO</small></span>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {data?.courses.length ? data.courses.map((course) => (
          <div key={course.id}>
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="min-w-0 truncate text-muted-foreground"><strong className="font-semibold text-foreground">{course.label}</strong> {course.subject}</span>
              <span className="shrink-0 text-muted-foreground">{course.graded}/{course.total}</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-[var(--palette-violet)]" style={{ width: `${course.total ? Math.min(100, course.graded / course.total * 100) : 0}%` }} />
            </div>
          </div>
        )) : <p className="text-xs text-muted-foreground">Aún no hay asignaturas para mostrar.</p>}
      </div>
      <Link to="/calificaciones" className="mt-auto inline-flex items-center gap-1 pt-3 text-xs font-semibold text-primary hover:underline">Ir a calificaciones <ArrowRight size={14} aria-hidden="true" /></Link>
    </article>
  )
}

function TodayAttendanceCard({ data }: { data: DashboardData['todayAttendance'] }) {
  const remaining = Math.max(0, data.totalClasses - data.recordedClasses)
  const statuses = [
    { label: 'Presentes', value: data.present, tone: 'present' },
    { label: 'Ausentes', value: data.absent, tone: 'absent' },
    { label: 'Justificadas', value: data.excused, tone: 'excused' },
    { label: 'Tardanzas', value: data.late, tone: 'late' },
  ]
  return (
    <article className="home-today-card" data-home-widget="today">
      <div className="flex items-center gap-3">
        <span className="home-today-icon"><CalendarCheck size={20} aria-hidden="true" /></span>
        <div>
          <p className="home-widget-eyebrow">Asistencia de hoy</p>
          <h2 className="text-base font-semibold text-foreground">{data.recordedClasses} de {data.totalClasses} clases</h2>
        </div>
      </div>
      <div className="mt-4 flex gap-1" aria-label={`${data.recordedClasses} de ${data.totalClasses} clases registradas`}>
        {Array.from({ length: Math.max(1, data.totalClasses) }, (_, index) => <span key={index} className={`h-1.5 min-w-0 flex-1 rounded-full ${index < data.recordedClasses ? 'bg-success' : 'bg-muted'}`} />)}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {statuses.map((status) => <div key={status.label} className="home-today-status"><span className={`home-today-dot home-today-${status.tone}`} /><strong>{status.value}</strong><span>{status.label}</span></div>)}
      </div>
      <Link to={data.totalClasses ? '/asistencia' : '/horario'} className="mt-auto inline-flex min-h-9 items-center justify-center gap-2 rounded-full bg-primary px-3 text-xs font-semibold text-white shadow-sm hover:bg-primary-hover">
        {data.totalClasses ? remaining ? `Faltan ${remaining} clases por registrar` : 'Ver asistencia de hoy' : 'Ver horario'} <ArrowRight size={14} aria-hidden="true" />
      </Link>
    </article>
  )
}

function AttentionCard({ students }: { students: DashboardData['attention'] }) {
  const [filter, setFilter] = useState('Todos')
  const visible = filter === 'Todos' ? students : students.filter((student) => student.reasons.includes(filter))
  return <section className="home-feature-card" data-home-widget="attention">
    <div className="flex items-center gap-3">
      <span className="home-feature-icon home-attention-icon"><AlertTriangle size={20} aria-hidden="true" /></span>
      <div><h2 className="text-base font-semibold text-foreground">Requieren atención</h2><p className="text-xs text-muted-foreground">{students.length} estudiantes · mínimo de aprobación 70</p></div>
    </div>
    <div className="mt-4 flex flex-wrap gap-1.5" role="group" aria-label="Filtrar estudiantes que requieren atención">
      {['Todos', 'Asistencia', 'Promedio', 'Conducta'].map((item) => <button key={item} type="button" className={`home-attention-filter ${filter === item ? 'is-active' : ''}`} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>)}
    </div>
    {visible.length ? <ul className="mt-3 space-y-1">{visible.map((student) => <li key={student.id}>
      <Link to="/estudiantes" className="home-attention-row">
        <span className="home-student-avatar">{student.name.split(' ').slice(0, 2).map((part) => part[0]).join('')}</span>
        <span className="min-w-0 flex-1"><span className="flex flex-wrap items-center gap-1.5"><strong className="truncate text-sm font-medium text-foreground">{student.name}</strong><small className="text-[10px] text-muted-foreground">{student.grade}</small>{student.reasons.map((reason) => <small key={reason} className={`home-reason home-reason-${reason.toLowerCase()}`}>{reason}</small>)}</span><span className="block truncate text-[11px] text-muted-foreground">{student.note}</span></span>
        <span className="shrink-0 text-right"><strong className="block text-sm font-semibold text-foreground">{student.average ?? '—'}</strong><small className="text-[10px] text-muted-foreground">{student.attendance === null ? 'Sin asist.' : `${student.attendance}% asist.`}</small></span>
        <ChevronRight size={14} className="shrink-0 text-muted-foreground" aria-hidden="true" />
      </Link>
    </li>)}</ul> : <p className="mt-7 text-sm text-muted-foreground">{students.length ? 'No hay estudiantes en esta categoría.' : 'No hay alertas con los registros disponibles.'}</p>}
  </section>
}

const fundamentalCompetencies = ['Comunicativa', 'Pensamiento lógico, creativo y crítico', 'Resolución de problemas', 'Científica y tecnológica', 'Ética y ciudadana', 'Ambiental y de la salud', 'Desarrollo personal y espiritual']

function CompetenciesCard() {
  return <section className="home-feature-card" data-home-widget="competencies">
    <div className="flex items-center gap-3"><span className="home-feature-icon home-competencies-icon"><Target size={21} aria-hidden="true" /></span><div className="min-w-0 flex-1"><h2 className="text-base font-semibold text-foreground">Competencias fundamentales</h2><p className="text-xs text-muted-foreground">Logro de tus cursos · período actual</p></div><span className="rounded-full bg-muted px-2 py-1 text-[10px] font-semibold text-muted-foreground">Sin datos</span></div>
    <ul className="mt-4 space-y-2">{fundamentalCompetencies.map((name) => <li key={name}><div className="flex justify-between gap-2 text-xs"><span className="truncate text-foreground">{name}</span><span className="text-muted-foreground">—</span></div><div className="mt-1 h-1.5 rounded-full bg-muted" /></li>)}</ul>
    <p className="mt-auto rounded-2xl bg-primary-container px-3 py-2 text-xs text-primary">Aún no hay mediciones de logro por competencia fundamental.</p>
  </section>
}

function PlanningCard({ data }: { data: DashboardData['planningSummary'] }) {
  return <section className="home-bottom-card home-planning-card" data-home-widget="planning">
    <div className="flex items-center gap-3"><span className="home-feature-icon home-planning-icon"><NotebookPen size={20} aria-hidden="true" /></span><div><h2 className="text-base font-semibold text-foreground">Planificación</h2><p className="text-xs text-muted-foreground">{data.count} planificaciones del período</p></div></div>
    {data.entries.length ? <ul className="mt-4">{data.entries.map((entry) => <li key={entry.id} className="border-b border-border last:border-0"><Link to={`/planificaciones?sectionSubjectId=${entry.sectionSubjectId}`} className="flex min-h-14 items-center gap-3 py-2"><span className="home-planning-grade">{entry.grade}</span><span className="min-w-0 flex-1"><strong className="block truncate text-[13px] font-medium text-foreground">{entry.subject}</strong><small className="block truncate text-[11px] text-muted-foreground">{entry.title}</small></span><span className="shrink-0 text-[11px] text-muted-foreground">{entry.plannedDate ? new Intl.DateTimeFormat('es-DO', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(entry.plannedDate)) : 'Sin fecha'}</span></Link></li>)}</ul> : <p className="mt-6 text-sm text-muted-foreground">Aún no hay planificaciones para este período.</p>}
    <Link to="/planificaciones" className="mt-auto inline-flex items-center gap-1 pt-4 text-xs font-semibold text-primary hover:underline">Abrir planificación <ArrowRight size={14} aria-hidden="true" /></Link>
  </section>
}

function CalendarCard({ data }: { data: DashboardData['calendar'] }) {
  return <section className="home-side-card" data-home-widget="calendar">
    <div className="flex items-center justify-between gap-2"><h2 className="flex items-center gap-2 text-sm font-semibold text-foreground"><CalendarDays size={17} className="text-primary" aria-hidden="true" />Calendario escolar</h2><span className="rounded-full bg-primary-container px-2 py-1 text-[10px] font-semibold text-primary">{data.source.toLowerCase() === 'minerd' ? 'MINERD' : 'ESCOLAR'}</span></div>
    {data.events.length ? <ul className="mt-4 space-y-3">{data.events.map((event, index) => <li key={event.id} className="flex items-center gap-3"><span className={`home-calendar-date home-calendar-date-${index % 4}`}><strong>{new Intl.DateTimeFormat('es-DO', { day: '2-digit', timeZone: 'UTC' }).format(new Date(event.date))}</strong><small>{new Intl.DateTimeFormat('es-DO', { month: 'short', timeZone: 'UTC' }).format(new Date(event.date)).replace('.', '').toUpperCase()}</small></span><span className="min-w-0"><strong className="block text-[13px] font-medium text-foreground">{event.title}</strong><small className="text-[11px] text-muted-foreground">{event.kind}</small></span></li>)}</ul> : <p className="mt-5 text-xs text-muted-foreground">No hay fechas académicas próximas configuradas.</p>}
    <p className="home-calendar-note">Las efemérides oficiales estarán disponibles cuando se integre el calendario MINERD.</p>
  </section>
}

function CommunicationsCard({ items }: { items: DashboardData['communications'] }) {
  const statusLabels: Record<string, string> = { sent: 'Enviado', draft: 'Borrador', failed: 'Fallido' }
  return <section className="home-side-card" data-home-widget="communications"><div className="flex items-center justify-between gap-2"><h2 className="flex items-center gap-2 text-sm font-semibold text-foreground"><Bell size={17} className="text-primary" aria-hidden="true" />Avisos y familias</h2><span className="rounded-full bg-primary-container px-2 py-1 text-[10px] font-semibold text-primary">{items.length} recientes</span></div>
    {items.length ? <ul className="mt-4 space-y-3">{items.map((item) => <li key={item.id}><Link to="/estudiantes" className="flex gap-3"><span className="home-student-avatar shrink-0">{item.student.split(' ').slice(0, 2).map((part) => part[0]).join('')}</span><span className="min-w-0 flex-1"><span className="flex justify-between gap-2"><strong className="truncate text-xs font-semibold text-foreground">{item.student}</strong><small className="shrink-0 text-[10px] text-muted-foreground">{item.relativeTime}</small></span><small className="block text-[11px] text-muted-foreground">{item.subject}</small><small className="text-[10px] text-primary">{statusLabels[item.status] ?? item.status}</small></span></Link></li>)}</ul> : <p className="mt-5 text-xs text-muted-foreground">Aún no hay comunicaciones enviadas a familias.</p>}
    <p className="mt-4 border-t border-border pt-3 text-[11px] text-muted-foreground">Los avisos recibidos estarán disponibles cuando se habilite la bandeja.</p>
  </section>
}

function Agenda({
  data,
  onStartClass,
  completeTask,
  addTask,
  actionLoading,
}: {
  data: DashboardData
  onStartClass?: (item: DashboardClass) => void
  completeTask: (id: string) => Promise<void>
  addTask: (input: { title: string }) => Promise<void>
  actionLoading: boolean
}) {
  const [tab, setTab] = useState<'today' | 'pending'>('today')
  const [taskTitle, setTaskTitle] = useState('')
  return (
    <aside className="home-agenda" aria-label="Tu agenda" data-home-widget="agenda">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Tu agenda</h2>
          <p className="text-xs text-muted-foreground">
            {data.todayAgenda.length} clases programadas
          </p>
        </div>
        <Link
          to="/horario"
          className="grid size-8 place-items-center rounded-lg bg-muted text-muted-foreground hover:text-primary"
          aria-label="Ver semana"
        >
          <ChevronRight size={17} />
        </Link>
      </div>
      <div className="mt-4 flex gap-2" role="tablist" aria-label="Vista de agenda">
        <button
          role="tab"
          aria-selected={tab === 'today'}
          type="button"
          onClick={() => setTab('today')}
          className={tab === 'today' ? 'home-agenda-tab is-active' : 'home-agenda-tab'}
        >
          Hoy
        </button>
        <button
          role="tab"
          aria-selected={tab === 'pending'}
          type="button"
          onClick={() => setTab('pending')}
          className={tab === 'pending' ? 'home-agenda-tab is-active' : 'home-agenda-tab'}
        >
          Pendientes ({data.tasks.length})
        </button>
      </div>
      {tab === 'today' ? (
        data.todayAgenda.length ? (
          <ol className="home-agenda-list mt-5">
            {data.todayAgenda.map((item) => (
              <li key={item.id} className="home-agenda-entry">
                <div className="home-agenda-time">
                  {item.startTime.slice(0, 5)}
                  {item.status === 'current' ? <span> · Ahora</span> : null}
                </div>
                <div
                  className={
                    item.status === 'current' ? 'home-agenda-class is-current' : 'home-agenda-class'
                  }
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={item.status === 'completed' ? 'line-through' : ''}>
                      {item.subjectName}
                    </h3>
                    <span className="home-agenda-grade">
                      {item.gradeName} {item.sectionName}
                    </span>
                  </div>
                  <p className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-[10px]">
                    <span className="inline-flex items-center gap-1">
                      <Clock size={11} />
                      {item.durationMinutes} min
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users size={11} />
                      {item.studentCount} est.
                    </span>
                    <span>{item.room ?? 'Aula sin asignar'}</span>
                  </p>
                  {item.status === 'current' && onStartClass ? (
                    <button
                      type="button"
                      onClick={() => onStartClass(item)}
                      className="absolute inset-0"
                      aria-label={`Iniciar clase de ${item.subjectName}`}
                    />
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-8 rounded-2xl bg-muted p-5 text-sm text-muted-foreground">
            No hay clases programadas para hoy.
          </p>
        )
      ) : (
        <div className="mt-5 space-y-3">
          {data.tasks.length ? (
            data.tasks.map((task) => (
              <label
                key={task.id}
                className="flex cursor-pointer items-start gap-3 rounded-xl bg-muted/60 p-3 text-sm"
              >
                <input
                  type="checkbox"
                  disabled={actionLoading}
                  onChange={() => void completeTask(task.id)}
                  className="mt-1 accent-primary"
                />
                <span>
                  {task.title}
                  {task.dueDate ? (
                    <small className="mt-1 block text-muted-foreground">{task.dueDate}</small>
                  ) : null}
                </span>
              </label>
            ))
          ) : (
            <p className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">
              No tienes pendientes abiertos.
            </p>
          )}
          <form
            onSubmit={(event) => {
              event.preventDefault()
              if (!taskTitle.trim()) return
              void addTask({ title: taskTitle.trim() })
              setTaskTitle('')
            }}
            className="flex gap-2"
          >
            <input
              value={taskTitle}
              onChange={(event) => setTaskTitle(event.target.value)}
              placeholder="Nueva tarea"
              aria-label="Nueva tarea"
              className="min-w-0 flex-1 rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={actionLoading || !taskTitle.trim()}
              aria-label="Agregar tarea"
              className="grid size-10 place-items-center rounded-xl bg-primary text-white disabled:opacity-50"
            >
              <Plus size={17} />
            </button>
          </form>
        </div>
      )}
    </aside>
  )
}

function RecentTable({ items, showAll }: { items: RecentActivityItem[]; showAll: boolean }) {
  return (
    <section className="home-recent" data-home-widget="recent">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Actividad reciente</h2>
        {showAll ? (
          <Link to="/reportes" className="text-sm font-medium text-primary hover:underline">
            Ver todo
          </Link>
        ) : null}
      </div>
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div className="home-recent-grid home-recent-head">
          <span>Nombre</span>
          <span>Curso</span>
          <span>Tipo</span>
          <span>Fecha</span>
        </div>
        {items.length ? (
          <ul className="px-2 py-2">
            {items.map((item) => {
              const Icon = activityIcons[item.kind]
              return (
                <li key={item.id}>
                  <Link to={item.path} className="home-recent-grid home-recent-row">
                    <span className="flex min-w-0 items-center gap-3">
                      <span className={`home-recent-icon home-recent-${item.kind}`}>
                        <Icon size={16} aria-hidden="true" />
                      </span>
                      <strong className="truncate font-semibold">{item.title}</strong>
                    </span>
                    <span className="truncate text-muted-foreground">{item.description}</span>
                    <span className="text-muted-foreground">{activityLabels[item.kind]}</span>
                    <span className="text-right text-muted-foreground">{item.relativeTime}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="p-6 text-sm text-muted-foreground">
            No hay actividad reciente para mostrar.
          </p>
        )}
      </div>
    </section>
  )
}

function JournalCard({ data }: { data: DashboardData }) {
  const summary = data.journalSummary
  return (
    <section className="home-bottom-card" data-home-widget="journal">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="home-journal-icon grid size-10 place-items-center rounded-full">
            <BookMarked size={19} />
          </span>
          <div>
            <h2 className="text-base font-semibold">Bitácora docente</h2>
            <p className="text-xs text-muted-foreground">
              {summary?.activeCount ?? 0} anotaciones · {summary?.pendingCount ?? 0} seguimientos
              pendientes
            </p>
          </div>
        </div>
        <Link
          to="/bitacora?action=create"
          className="inline-flex min-h-9 items-center gap-1 rounded-full bg-primary px-3 text-xs font-semibold text-white"
        >
          <Plus size={14} />
          Nueva
        </Link>
      </div>
      {summary?.recentEntries.length ? (
        <ul className="mt-4">
          {summary.recentEntries.slice(0, 3).map((entry) => (
            <li key={entry.id} className="border-b border-border py-3 last:border-0">
              <Link to="/bitacora" className="flex items-start justify-between gap-3 text-xs">
                <span className="min-w-0">
                  <strong className="block truncate text-[13px] font-medium text-foreground">
                    {entry.title || journalLabels[entry.entryType] || 'Anotación'}
                  </strong>
                  <small className="text-muted-foreground">
                    {journalLabels[entry.entryType] || 'Bitácora docente'}{entry.relatedStudent ? ` · ${entry.relatedStudent}` : ''}
                  </small>
                </span>
                <span className="shrink-0 text-muted-foreground">{entry.relativeTime}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 text-sm text-muted-foreground">Aún no tienes anotaciones.</p>
      )}
      <Link
        to="/bitacora"
        className="mt-auto inline-flex items-center gap-1 pt-4 text-xs font-semibold text-primary hover:underline"
      >
        Abrir bitácora <ArrowRight size={14} />
      </Link>
    </section>
  )
}

function PulseCard({ data }: { data: DashboardData }) {
  const [dismissed, setDismissed] = useState(false)
  const total = data.weeklyAttendance.days.length
  const recorded = data.weeklyAttendance.days.filter((day) => day.value !== null).length
  const percent = total ? Math.round((recorded / total) * 100) : 0
  if (dismissed) return null
  return (
    <section className="home-bottom-card" data-home-widget="pulse">
      <div className="flex items-center justify-between">
        <h2 className="inline-flex items-center gap-2 text-sm font-semibold">
          <Sparkles size={17} className="text-primary" />
          Pulso semanal <span className="text-primary">{percent}%</span>
        </h2>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Descartar pulso semanal"
          className="grid size-7 place-items-center rounded-lg bg-muted text-muted-foreground"
        >
          <X size={14} />
        </button>
      </div>
      <div className="home-pulse-alert mt-5 flex items-center gap-3 rounded-2xl p-3">
        <span className="home-pulse-icon grid size-9 shrink-0 place-items-center rounded-xl text-white">
          <CalendarCheck size={17} />
        </span>
        <div>
          <p className="text-sm font-bold">
            {recorded ? 'Asistencia en progreso' : 'Aún no has registrado asistencia'}
          </p>
          <p className="text-xs text-muted-foreground">
            {recorded} de {total} días de esta semana
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-3 px-1">
        <p className="flex-1 text-xs text-muted-foreground">
          {data.smartSuggestion?.title ?? 'Revisa tus clases y registra la asistencia.'}
        </p>
        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${Math.max(percent, 6)}%` }}
          />
        </div>
      </div>
      <Link
        to={data.smartSuggestion?.path ?? '/asistencia'}
        className="mt-auto inline-flex min-h-9 items-center justify-center gap-2 rounded-xl bg-primary px-3 pt-0 text-xs font-semibold text-white shadow-sm hover:bg-primary-hover"
      >
        {data.smartSuggestion?.actionLabel ?? 'Registrar asistencia'} <ArrowRight size={14} />
      </Link>
    </section>
  )
}

export function DashboardPage() {
  const navigate = useNavigate()
  const { hasRole, appUser } = useAuth()
  const { data, error, loading, actionLoading, addTask, completeTask, refetch } = useDashboard()
  const widgetStorageKey = `aulabase:home-widgets:v2:${appUser?.id ?? 'local'}`
  const [widgets, setWidgets] = useState<WidgetId[]>(() => readWidgets(widgetStorageKey))
  const [widgetEditorOpen, setWidgetEditorOpen] = useState(false)
  const [addedPaths, setAddedPaths] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('aulabase:home-shortcuts') || '[]') as string[] }
    catch { return [] }
  })
  const nextSetupTourStep = useMemo(
    () => (data?.view === 'management' ? getNextSetupTourStep(data.setupProgress) : null),
    [data],
  )
  useEffect(() => {
    setWidgets(readWidgets(widgetStorageKey))
  }, [widgetStorageKey])
  useEffect(() => {
    if (
      nextSetupTourStep &&
      window.localStorage.getItem('aulabase:interactive-setup-tour-seen:v1') !== 'true'
    ) {
      window.localStorage.setItem('aulabase:interactive-setup-tour-seen:v1', 'true')
      window.setTimeout(() => startSetupTour(nextSetupTourStep), 500)
    }
  }, [nextSetupTourStep])

  const handleStartClass = (item: DashboardClass) => {
    const params = new URLSearchParams({ sectionId: item.sectionId })
    if (item.academicPeriodId) params.set('periodId', item.academicPeriodId)
    navigate(`/asistencia?${params.toString()}`)
  }

  if (loading && !data) return <PageSkeleton />
  if (!data) return <ErrorState message={error ?? 'No se pudieron cargar los datos de inicio.'} />

  const canManage = data.view === 'management' || data.view === 'teacher'
  const canAccess = (path: string) => {
    const route = navigationRoutes.find((item) => item.path === path)
    return Boolean(route && hasRole(route.allowedRoles))
  }
  const availableWidgets = widgetOptions.filter((item) => {
    if (['period', 'today', 'attention', 'competencies', 'planning', 'journal', 'communications'].includes(item.id) && !canManage) return false
    return !('route' in item) || canAccess(item.route)
  })
  const isWidgetVisible = (id: WidgetId) => widgets.includes(id) && availableWidgets.some((item) => item.id === id)
  const defaultSelection = defaultWidgets.filter((id) => availableWidgets.some((item) => item.id === id))
  const isDefaultLayout = widgets.length === defaultSelection.length && defaultSelection.every((id) => widgets.includes(id))
  const setWidgetSelection = (next: WidgetId[]) => {
    const before = new Map([...document.querySelectorAll<HTMLElement>('[data-home-widget]')].map((element) => {
      const rect = element.getBoundingClientRect()
      element.getAnimations?.().forEach((animation) => animation.cancel())
      return [element.dataset.homeWidget, rect] as const
    }))
    flushSync(() => setWidgets(next))
    try { localStorage.setItem(widgetStorageKey, JSON.stringify(next)) } catch { /* Keep the current session usable. */ }
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    requestAnimationFrame(() => {
      document.querySelectorAll<HTMLElement>('[data-home-widget]').forEach((element) => {
        if (typeof element.animate !== 'function') return
        const previous = before.get(element.dataset.homeWidget)
        const current = element.getBoundingClientRect()
        if (previous) {
          const dx = previous.left - current.left
          const dy = previous.top - current.top
          const sx = current.width ? previous.width / current.width : 1
          const sy = current.height ? previous.height / current.height : 1
          if (Math.abs(dx) + Math.abs(dy) < 1 && Math.abs(sx - 1) + Math.abs(sy - 1) < 0.01) return
          element.animate([{ transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, transformOrigin: 'top left' }, { transform: 'translate(0, 0) scale(1)', transformOrigin: 'top left' }], { duration: 320, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' })
        } else {
          element.animate([{ opacity: 0, transform: 'scale(0.96)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 260, easing: 'ease-out' })
        }
      })
    })
  }
  const toggleWidget = (id: WidgetId) => setWidgetSelection(widgets.includes(id) ? widgets.filter((item) => item !== id) : [...widgets, id])
  const attendanceTotal = data.weeklyAttendance.days.length
  const attendanceRecorded = data.weeklyAttendance.days.filter((day) => day.value !== null).length
  const attendancePercent = attendanceTotal
    ? Math.round((attendanceRecorded / attendanceTotal) * 100)
    : 0
  const evaluationPercent = data.teacherAnalytics?.average ?? null
  const attendanceClass = data.nextClass ?? data.todayAgenda.find((item) => item.status !== 'completed')
  const attendanceParams = attendanceClass ? new URLSearchParams({ sectionId: attendanceClass.sectionId }) : null
  if (attendanceParams && attendanceClass?.academicPeriodId) attendanceParams.set('periodId', attendanceClass.academicPeriodId)
  const recommendations = [
    {
      label: attendanceClass ? 'Pasar lista' : 'Revisar asistencia',
      detail: attendanceClass
        ? `${attendanceClass.gradeName} ${attendanceClass.sectionName} · ${attendanceClass.status === 'current' ? 'ahora' : attendanceClass.startTime.slice(0, 5)}`
        : `${attendanceRecorded} de ${attendanceTotal} días registrados`,
      path: `/asistencia${attendanceParams ? `?${attendanceParams}` : ''}`,
      route: '/asistencia',
      icon: CalendarCheck,
      tone: 'attendance',
    },
    {
      label: 'Registrar calificación',
      detail: data.teacherAnalytics?.gradedRecords
        ? `${data.teacherAnalytics.gradedRecords} registradas`
        : 'Sin calificaciones aún',
      path: '/calificaciones',
      route: '/calificaciones',
      icon: GraduationCap,
      tone: 'grading',
    },
    {
      label: 'Nueva planificación',
      detail: data.nextClass
        ? `Para ${data.nextClass.gradeName} ${data.nextClass.sectionName}`
        : 'Prepara tus clases',
      path: '/planificaciones?action=nueva',
      route: '/planificaciones',
      icon: NotebookPen,
      tone: 'planning',
    },
    {
      label: 'Anotar en bitácora',
      detail: data.journalSummary?.pendingCount
        ? `${data.journalSummary.pendingCount} ${data.journalSummary.pendingCount === 1 ? 'seguimiento pendiente' : 'seguimientos pendientes'}`
        : 'Nueva observación',
      path: '/bitacora?action=create',
      route: '/bitacora',
      icon: BookMarked,
      tone: 'journal',
    },
    {
      label: 'Mensaje a familia',
      detail: 'Elige estudiante y tutor',
      path: '/estudiantes',
      route: '/estudiantes',
      icon: MessageCircle,
      tone: 'family',
    },
  ].filter((item) => canAccess(item.route))
  const shortcuts = navigationRoutes.filter((route) => (quickPaths.includes(route.path) || addedPaths.includes(route.path)) && hasRole(route.allowedRoles))
  const availableShortcuts = navigationRoutes.filter((route) => !quickPaths.includes(route.path) && !addedPaths.includes(route.path) && route.path !== '/inicio' && hasRole(route.allowedRoles))

  return (
    <div className="home-dashboard">
      {error ? (
        <p role="alert" className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <div className="home-layout">
        <div className="home-main-column">
          <div className="home-heading">
            <div>
              <h1 className="text-[27px] font-semibold tracking-tight text-foreground">
                {getGreeting()}, <span className="text-primary">{data.context.firstName}</span>
              </h1>
              <p className="text-sm text-muted-foreground">{data.context.formattedDate}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => void refetch()}
                disabled={loading}
                aria-label="Actualizar inicio"
                className="grid size-9 place-items-center rounded-full border border-border bg-card text-muted-foreground"
              >
                <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              </button>
              <span className="rounded-full border border-border bg-card px-3 py-2 text-xs font-semibold">
                {data.context.schoolYearName}
              </span>
              <span className="rounded-full bg-primary-container px-3 py-2 text-xs font-semibold text-primary">
                ● &nbsp;{data.context.periodName} · activo
              </span>
              <details className="home-widget-menu relative">
                <summary aria-label="Opciones de Inicio" className="grid size-9 cursor-pointer list-none place-items-center rounded-full border border-border bg-card text-muted-foreground hover:text-primary">
                  <Ellipsis size={19} aria-hidden="true" />
                </summary>
                <div className="absolute right-0 top-11 z-20 min-w-44 rounded-xl border border-border bg-card p-1 shadow-lg">
                  <button type="button" className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-foreground hover:bg-muted" onClick={(event) => { event.currentTarget.closest('details')?.removeAttribute('open'); setWidgetEditorOpen(true) }}>Editar widgets</button>
                </div>
              </details>
            </div>
          </div>

          {['class', 'period', 'today', 'weekly', 'evaluations'].some((id) => isWidgetVisible(id as WidgetId)) ? <div className="home-top-cards">
            {isWidgetVisible('class') ? <DashboardHero
              nextClass={data.nextClass}
              onStartClass={handleStartClass}
              onViewPlanning={() => navigate('/planificaciones')}
              canManageClass={canAccess('/asistencia')}
              onCountdownEnd={refetch}
            /> : null}
            {isWidgetVisible('period') ? <PeriodClosingCard data={data.periodClosing} /> : null}
            {isWidgetVisible('today') ? <TodayAttendanceCard data={data.todayAttendance} /> : null}
            {isWidgetVisible('weekly') ? <MetricCard
              icon={CalendarCheck}
              title="Asistencia semanal"
              detail={`${attendanceRecorded} / ${attendanceTotal} días con registros`}
              value={attendancePercent}
              tone="orange"
              path={canAccess('/asistencia') ? '/asistencia' : undefined}
            /> : null}
            {isWidgetVisible('evaluations') ? <MetricCard
              icon={GraduationCap}
              title="Evaluaciones"
              detail={`${data.teacherAnalytics?.gradedRecords ?? 0} calificaciones · promedio`}
              value={evaluationPercent}
              tone="violet"
              path={canAccess('/calificaciones') ? '/calificaciones' : undefined}
            /> : null}
          </div> : null}
          {isWidgetVisible('actions') && recommendations.length ? (
            <section className="home-recommendations" data-home-widget="actions">
              <h2 className="text-lg font-semibold text-foreground">¿Qué quieres hacer?</h2>
              <div className="home-recommendation-list">
                {recommendations.map(({ label, detail, path, icon: Icon, tone }) => (
                  <Link key={label} to={path} className="home-recommendation">
                    <span className={`home-recommendation-icon home-recommendation-${tone}`}>
                      <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-foreground">{label}</span>
                      <span className="block truncate text-[11px] text-muted-foreground">{detail}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
          {isWidgetVisible('shortcuts') ? (
            <section className="mt-8" data-home-widget="shortcuts">
              <h2 className="text-lg font-semibold text-foreground">Acceso rápido</h2>
              <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-9">
                {shortcuts.map((item) => {
                  const Icon = item.icon
                  return <Link key={item.path} to={item.path} className="group flex min-w-0 flex-col items-center gap-2 text-center text-xs text-muted-foreground">
                    <span className="grid size-14 place-items-center rounded-2xl bg-card shadow-sm transition-transform group-hover:-translate-y-1 group-focus-visible:-translate-y-1">
                      <Icon className="size-5 text-primary" aria-hidden="true" />
                    </span>
                    <span className="truncate max-w-full">{item.label}</span>
                  </Link>
                })}
                {availableShortcuts.length ? <details className="group relative flex min-w-0 flex-col items-center gap-2 text-center text-xs text-muted-foreground">
                  <summary className="flex cursor-pointer list-none flex-col items-center gap-2"><span className="grid size-14 place-items-center rounded-2xl border border-dashed border-border bg-card"><Plus className="size-5" /></span>Agregar</summary>
                  <div className="absolute right-0 top-20 z-20 min-w-44 rounded-xl border border-border bg-card p-1 shadow-lg">
                    {availableShortcuts.map((item) => <button key={item.path} type="button" className="block w-full rounded-lg px-3 py-2 text-left text-xs hover:bg-muted" onClick={(event) => {
                      const next = [...addedPaths, item.path]
                      setAddedPaths(next)
                      localStorage.setItem('aulabase:home-shortcuts', JSON.stringify(next))
                      event.currentTarget.closest('details')?.removeAttribute('open')
                    }}>{item.label}</button>)}
                  </div>
                </details> : null}
              </div>
            </section>
          ) : null}
          {canManage && (isWidgetVisible('attention') || isWidgetVisible('competencies')) ? <div className="home-insights-grid">
            {isWidgetVisible('attention') ? <AttentionCard students={data.attention ?? []} /> : null}
            {isWidgetVisible('competencies') ? <CompetenciesCard /> : null}
          </div> : null}
          {canManage && (isWidgetVisible('planning') || isWidgetVisible('journal')) ? (
            <div className="home-bottom-grid">
              {isWidgetVisible('planning') ? <PlanningCard data={data.planningSummary ?? { count: 0, entries: [] }} /> : null}
              {isWidgetVisible('journal') ? <JournalCard data={data} /> : null}
            </div>
          ) : null}
          {isWidgetVisible('recent') ? <RecentTable items={data.recentActivity} showAll={canAccess('/reportes')} /> : null}
          {canManage && isWidgetVisible('pulse') ? <div className="home-bottom-grid"><PulseCard data={data} /></div> : null}
        </div>
        {['agenda', 'calendar', 'communications'].some((id) => isWidgetVisible(id as WidgetId)) ? <div className="home-sidebar">
        {isWidgetVisible('agenda') ? <Agenda
          data={data}
          onStartClass={canAccess('/asistencia') ? handleStartClass : undefined}
          completeTask={completeTask}
          addTask={addTask}
          actionLoading={actionLoading}
        /> : null}
        {isWidgetVisible('calendar') ? <CalendarCard data={data.calendar ?? { source: 'school', events: [] }} /> : null}
        {canManage && isWidgetVisible('communications') ? <CommunicationsCard items={data.communications ?? []} /> : null}
        </div> : null}
      </div>
      {widgetEditorOpen ? <Modal title="Editar widgets" description="Elige qué tarjetas aparecen en Inicio." onClose={() => setWidgetEditorOpen(false)}>
        <div className="space-y-6 p-5">
          <div className="flex justify-end">
            <button type="button" onClick={() => setWidgetSelection(defaultSelection)} disabled={isDefaultLayout} className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 text-xs font-medium text-foreground hover:bg-muted disabled:cursor-default disabled:opacity-50 sm:w-auto sm:px-4 sm:text-sm">
              <RefreshCw size={15} aria-hidden="true" /> Restablecer diseño predeterminado
            </button>
          </div>
          {(['Agregados', 'Disponibles'] as const).map((group) => {
            const items = availableWidgets.filter((item) => group === 'Agregados' ? widgets.includes(item.id) : !widgets.includes(item.id))
            return <section key={group}>
              <h3 className="mb-3 text-sm font-semibold text-foreground">{group} <span className="text-muted-foreground">{items.length}</span></h3>
              {items.length ? <div className="grid gap-2 sm:grid-cols-2">{items.map((item) => <div key={item.id} className="flex min-w-0 items-center justify-between gap-2 rounded-xl border border-border bg-card p-3">
                <div className="min-w-0"><p className="truncate text-sm font-medium text-foreground">{item.label}</p><p className="truncate text-xs text-muted-foreground">{item.detail}</p></div>
                <button type="button" onClick={() => toggleWidget(item.id)} className={`shrink-0 rounded-lg px-2 py-1 text-xs font-semibold ${group === 'Agregados' ? 'bg-muted text-muted-foreground hover:text-foreground' : 'bg-primary-container text-primary'}`}>{group === 'Agregados' ? 'Quitar' : 'Agregar'}</button>
              </div>)}</div> : <p className="text-xs text-muted-foreground">{group === 'Agregados' ? 'No hay widgets agregados.' : 'Todos los widgets están agregados.'}</p>}
            </section>
          })}
        </div>
      </Modal> : null}
    </div>
  )
}
