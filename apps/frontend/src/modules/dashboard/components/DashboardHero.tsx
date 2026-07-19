/**
 * Componente DashboardHero — Comunica el estado del día y la próxima clase.
 */

import { ArrowRight, Clock3, MapPin, Play, UsersRound } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import type { DashboardClass } from '@/modules/dashboard/types/dashboard'

type DashboardHeroProps = {
  /** Siguiente clase del día (puede ser nulo). */
  nextClass: DashboardClass | null
  /** Callback al hacer clic en "Iniciar clase". */
  onStartClass: (item: DashboardClass) => void
  /** Callback al hacer clic en "Ver planificación". */
  onViewPlanning: (item: DashboardClass) => void
}

function getTodayBadge() {
  const today = new Date()
  return {
    isoDate: today.toISOString().slice(0, 10),
    weekday: new Intl.DateTimeFormat('es-DO', { weekday: 'short' })
      .format(today)
      .replace('.', '')
      .toUpperCase(),
    day: new Intl.DateTimeFormat('es-DO', { day: '2-digit' }).format(today),
  }
}

/** Estado principal del día en el dashboard docente. */
export function DashboardHero({
  nextClass,
  onStartClass,
  onViewPlanning,
}: DashboardHeroProps) {
  const date = getTodayBadge()
  const minutes = nextClass?.startsInMinutes ?? null
  const progress = minutes === null ? 0 : Math.max(0, Math.min(100, 100 - (minutes / 90) * 100))

  if (!nextClass) {
    return (
      <section className="dashboard-warm-shadow relative h-full min-h-44 overflow-hidden rounded-3xl border border-border bg-card px-5 py-6 sm:px-7 lg:px-8">
        <div className="dashboard-paper-lines pointer-events-none absolute inset-y-0 right-0 hidden w-[42%] opacity-70 sm:block" aria-hidden="true" />

        <div className="relative flex h-full items-center gap-5 sm:gap-7">
          <time
            dateTime={date.isoDate}
            className="flex size-[5.25rem] shrink-0 flex-col items-center justify-center rounded-2xl border border-border bg-muted text-primary shadow-[inset_0_1px_0_rgba(255,255,255,.8)]"
          >
            <span className="text-[11px] font-bold tracking-[0.18em] text-accent">{date.weekday}</span>
            <span className="mt-0.5 text-4xl font-extrabold leading-none tracking-tight tabular-nums">{date.day}</span>
          </time>

          <div className="min-w-0 max-w-2xl">
            <p className="text-xs font-semibold text-accent">Tu estado de hoy</p>
            <h2 className="mt-1.5 text-3xl font-extrabold leading-tight tracking-[-0.035em] text-primary sm:text-4xl">
              Hoy tienes la agenda libre
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground sm:text-[15px]">
              No hay clases activas. Puedes adelantar una planificación o revisar tus pendientes con calma.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="dashboard-warm-shadow relative h-full overflow-hidden rounded-3xl border border-border bg-card px-5 py-6 sm:px-7 lg:px-8">
      <div className="dashboard-paper-lines pointer-events-none absolute inset-y-0 right-0 hidden w-[38%] opacity-60 sm:block" aria-hidden="true" />

      <div className="relative grid h-full items-center gap-6 lg:grid-cols-[minmax(0,1fr)_11rem]">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-semibold text-accent">
            <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
            {nextClass.status === 'current'
              ? 'Clase en curso'
              : `Próxima clase · empieza en ${minutes ?? 0} min`}
          </div>

          <h2 className="mt-2 text-3xl font-extrabold leading-tight tracking-[-0.035em] text-primary sm:text-4xl">
            {nextClass.subjectName}
          </h2>
          <p className="mt-1 text-base font-semibold text-muted-foreground">
            {nextClass.gradeName} {nextClass.sectionName}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Clock3 className="size-4 text-accent" aria-hidden="true" />
              {nextClass.startTime.slice(0, 5)} · {nextClass.durationMinutes} min
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="size-4 text-accent" aria-hidden="true" />
              {nextClass.room ?? 'Aula sin asignar'}
            </span>
            <span className="inline-flex items-center gap-2">
              <UsersRound className="size-4 text-accent" aria-hidden="true" />
              {nextClass.studentCount} estudiantes
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              className="h-11 rounded-xl bg-primary px-5 text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary-hover"
              onClick={() => onStartClass(nextClass)}
            >
              <Play className="size-4 fill-current" aria-hidden="true" />
              Iniciar clase
            </Button>
            <Button
              variant="ghost"
              className="h-11 rounded-xl px-4 text-primary hover:bg-secondary"
              onClick={() => onViewPlanning(nextClass)}
            >
              Ver planificación
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-muted/90 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.75)]">
          <p className="text-xs font-semibold text-muted-foreground">
            {nextClass.status === 'current' ? 'En curso' : 'Comienza en'}
          </p>
          <p className="mt-1 text-4xl font-extrabold leading-none tracking-tight text-primary tabular-nums">
            {minutes ?? '—'}
            <span className="ml-1 text-base font-semibold text-muted-foreground">min</span>
          </p>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-border" aria-hidden="true">
            <div className="h-full rounded-full bg-accent" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    </section>
  )
}
