import {
  ArrowRight,
  BookMarked,
  CalendarCheck,
  ChevronRight,
  ClipboardCheck,
  Clock,
  GraduationCap,
  Plus,
  RefreshCw,
  Sparkles,
  Users,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { ErrorState } from '@/components/ui'
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

const quickPaths = [
  '/cursos',
  '/horario',
  '/asistencia',
  '/calificaciones',
  '/actividades',
  '/planificaciones',
  '/bitacora',
  '/reportes',
]
const activityLabels: Record<RecentActivityItem['kind'], string> = {
  grade: 'Evaluación',
  attendance: 'Asistencia',
  planning: 'Actividad',
  report: 'Reporte',
}
const activityIcons = {
  grade: GraduationCap,
  attendance: CalendarCheck,
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
    <article className="home-metric-card">
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
    <aside className="home-agenda" aria-label="Tu agenda">
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
    <section className="home-recent">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[17px] font-semibold text-foreground">Actividad reciente</h2>
        {showAll ? (
          <Link to="/reportes" className="text-sm font-semibold text-primary hover:underline">
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
          <ul className="px-2 pb-2">
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
    <section className="home-bottom-card">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="home-journal-icon grid size-10 place-items-center rounded-xl">
            <BookMarked size={19} />
          </span>
          <div>
            <h2 className="text-sm font-semibold">Bitácora docente</h2>
            <p className="text-xs text-muted-foreground">
              {summary?.activeCount ?? 0} anotaciones · {summary?.pendingCount ?? 0} seguimientos
              pendientes
            </p>
          </div>
        </div>
        <Link
          to="/bitacora?action=create"
          className="inline-flex min-h-9 items-center gap-1 rounded-xl bg-primary px-3 text-xs font-semibold text-white"
        >
          <Plus size={14} />
          Nueva
        </Link>
      </div>
      {summary?.recentEntries.length ? (
        <ul className="mt-4">
          {summary.recentEntries.slice(0, 3).map((entry) => (
            <li key={entry.id} className="border-b border-border py-2 last:border-0">
              <Link to="/bitacora" className="flex items-start justify-between gap-3 text-xs">
                <span className="min-w-0">
                  <strong className="block truncate text-[13px] text-foreground">
                    {entry.title || journalLabels[entry.entryType] || 'Anotación'}
                  </strong>
                  <small className="text-muted-foreground">
                    {journalLabels[entry.entryType] || 'Bitácora docente'}
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
    <section className="home-bottom-card">
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
  const { hasRole } = useAuth()
  const { data, error, loading, actionLoading, addTask, completeTask, refetch } = useDashboard()
  const [addedPaths, setAddedPaths] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('aulabase:home-shortcuts') || '[]') as string[]
    } catch {
      return []
    }
  })
  const nextSetupTourStep = useMemo(
    () => (data?.view === 'management' ? getNextSetupTourStep(data.setupProgress) : null),
    [data],
  )

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
  const shortcuts = navigationRoutes.filter(
    (route) =>
      (quickPaths.includes(route.path) || addedPaths.includes(route.path)) &&
      hasRole(route.allowedRoles),
  )
  const availableShortcuts = navigationRoutes.filter(
    (route) =>
      !quickPaths.includes(route.path) &&
      !addedPaths.includes(route.path) &&
      route.path !== '/inicio' &&
      hasRole(route.allowedRoles),
  )
  const attendanceTotal = data.weeklyAttendance.days.length
  const attendanceRecorded = data.weeklyAttendance.days.filter((day) => day.value !== null).length
  const attendancePercent = attendanceTotal
    ? Math.round((attendanceRecorded / attendanceTotal) * 100)
    : 0
  const evaluationPercent = data.teacherAnalytics?.average ?? null

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
              {nextSetupTourStep ? (
                <button
                  type="button"
                  onClick={() => startSetupTour(nextSetupTourStep)}
                  className="rounded-full bg-card px-3 py-2 text-xs font-semibold text-primary"
                >
                  Guía inicial
                </button>
              ) : null}
            </div>
          </div>

          <div className="home-top-cards">
            <DashboardHero
              nextClass={data.nextClass}
              onStartClass={handleStartClass}
              onViewPlanning={() => navigate('/planificaciones')}
              canManageClass={canAccess('/asistencia')}
              onCountdownEnd={refetch}
            />
            <MetricCard
              icon={CalendarCheck}
              title="Asistencia semanal"
              detail={`${attendanceRecorded} / ${attendanceTotal} días con registros`}
              value={attendancePercent}
              tone="orange"
              path={canAccess('/asistencia') ? '/asistencia' : undefined}
            />
            <MetricCard
              icon={GraduationCap}
              title="Evaluaciones"
              detail={`${data.teacherAnalytics?.gradedRecords ?? 0} calificaciones · promedio`}
              value={evaluationPercent}
              tone="violet"
              path={canAccess('/calificaciones') ? '/calificaciones' : undefined}
            />
          </div>
          <section className="home-shortcuts">
            <h2 className="text-[17px] font-semibold text-foreground">Acceso rápido</h2>
            <div className="home-shortcut-list">
              {shortcuts.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`home-shortcut home-shortcut-${item.path.slice(1)}`}
                    title={item.label}
                  >
                    <span className="home-shortcut-icon">
                      <span className="home-shortcut-icon-inner">
                        <Icon className="size-[18px]" aria-hidden="true" />
                      </span>
                    </span>
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              <details className="home-shortcut home-shortcut-add">
                <summary>
                  <span className="home-shortcut-icon">
                    <Plus size={20} aria-hidden="true" />
                  </span>
                  <span>Agregar</span>
                </summary>
                <div className="home-shortcut-menu">
                  {availableShortcuts.length ? (
                    availableShortcuts.map((item) => (
                      <button
                        key={item.path}
                        type="button"
                        onClick={(event) => {
                          const next = [...addedPaths, item.path]
                          setAddedPaths(next)
                          localStorage.setItem('aulabase:home-shortcuts', JSON.stringify(next))
                          event.currentTarget.closest('details')?.removeAttribute('open')
                        }}
                      >
                        {item.label}
                      </button>
                    ))
                  ) : (
                    <p>Todos los accesos están visibles.</p>
                  )}
                </div>
              </details>
            </div>
          </section>
          <RecentTable items={data.recentActivity} showAll={canAccess('/reportes')} />
          {canManage ? (
            <div className="home-bottom-grid">
              {canAccess('/bitacora') ? <JournalCard data={data} /> : null}
              {canAccess('/asistencia') ? <PulseCard data={data} /> : null}
            </div>
          ) : null}
        </div>
        <Agenda
          data={data}
          onStartClass={canAccess('/asistencia') ? handleStartClass : undefined}
          completeTask={completeTask}
          addTask={addTask}
          actionLoading={actionLoading}
        />
      </div>
    </div>
  )
}
