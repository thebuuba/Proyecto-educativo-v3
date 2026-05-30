import { ArrowRight, Clock3, MapPin, Play, UsersRound } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import type { DashboardClass } from '@/modules/dashboard/types/dashboard'

type DashboardHeroProps = {
  nextClass: DashboardClass | null
  onStartClass: (item: DashboardClass) => void
  onViewPlanning: (item: DashboardClass) => void
}

export function DashboardHero({
  nextClass,
  onStartClass,
  onViewPlanning,
}: DashboardHeroProps) {
  const minutes = nextClass?.startsInMinutes ?? null
  const progress = minutes === null ? 0 : Math.max(0, Math.min(100, 100 - (minutes / 90) * 100))

  return (
    <section className="relative overflow-hidden rounded-[28px] bg-primary px-6 py-8 text-primary-foreground shadow-xl shadow-primary/10 sm:px-8 lg:px-10 lg:py-10">
      <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.18)_1px,transparent_0)] [background-size:24px_24px]" />
      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent">
            {nextClass?.status === 'current'
              ? 'Clase en curso'
              : nextClass
                ? `Tu próxima clase · empieza en ${minutes ?? 0} min`
                : 'Sin clase programada'}
          </p>

          <h2 className="mt-5 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl">
            {nextClass ? nextClass.subjectName : 'Agenda libre'}
            {nextClass && (
              <span className="block font-normal text-white/55">
                para {nextClass.gradeName} {nextClass.sectionName}
              </span>
            )}
          </h2>

          {nextClass ? (
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/72 sm:text-base">
              <span className="inline-flex items-center gap-2">
                <Clock3 className="size-5 text-accent" />
                {formatTime(nextClass.startTime)} · {nextClass.durationMinutes} min
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="size-5 text-accent" />
                {nextClass.room ?? 'Aula sin asignar'}
              </span>
              <span className="inline-flex items-center gap-2">
                <UsersRound className="size-5 text-accent" />
                {nextClass.studentCount} estudiantes
              </span>
            </div>
          ) : (
            <p className="mt-5 max-w-xl text-base text-white/65">
              No hay clases activas para hoy. Puedes revisar el horario o trabajar con pendientes.
            </p>
          )}

          {nextClass && (
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                className="h-12 rounded-xl px-5"
                onClick={() => onStartClass(nextClass)}
              >
                <Play className="size-5 fill-current" />
                Iniciar clase
              </Button>
              <Button
                variant="outline"
                className="h-12 rounded-xl border-white/18 bg-white/5 px-5 text-white hover:bg-white/10"
                onClick={() => onViewPlanning(nextClass)}
              >
                Ver planificación
                <ArrowRight className="size-5" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="relative flex size-48 items-center justify-center sm:size-56">
            <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
              <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth="10" />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="var(--accent)"
                strokeDasharray={`${(progress / 100) * 314} 314`}
                strokeLinecap="round"
                strokeWidth="10"
              />
            </svg>
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/50">
                {nextClass?.status === 'current' ? 'Ahora' : 'Empieza'}
              </p>
              <p className="mt-1 text-6xl font-bold text-accent">
                {minutes ?? '—'}
              </p>
              <p className="text-sm font-semibold text-white/65">minutos</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function formatTime(value: string) {
  return value.slice(0, 5)
}
