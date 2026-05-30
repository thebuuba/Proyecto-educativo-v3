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

  if (!nextClass) {
    return (
      <section className="relative rounded-[28px] bg-primary px-6 py-8 text-primary-foreground shadow-xl shadow-primary/10 sm:px-8 lg:px-10 lg:py-10">
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.18)_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent">Sin clase programada</p>
          <h2 className="mt-5 text-4xl font-bold leading-tight text-white sm:text-5xl">Agenda libre</h2>
          <p className="mt-5 max-w-xl text-base text-white/65">
            No hay clases activas para hoy. Puedes revisar el horario o trabajar con pendientes.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="relative rounded-[28px] overflow-hidden p-8 lg:p-10 shadow-xl" style={{ backgroundColor: '#1a1f3a', boxShadow: '0 20px 50px -10px rgba(26,31,58,0.3)' }}>
      <div
        className="absolute -top-20 -right-10 size-[400px] rounded-full opacity-40 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,139,107,0.5) 0%, transparent 70%)' }}
      />
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}
      />

      <div className="relative grid lg:grid-cols-12 gap-8 items-end">
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-accent">
              {nextClass.status === 'current'
                ? 'Clase en curso'
                : `Tu próxima clase · empieza en ${minutes ?? 0} min`}
            </span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.05]">
            {nextClass.subjectName}
            <br />
            <span className="text-white/50 font-medium">para {nextClass.gradeName} {nextClass.sectionName}</span>
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
            <span className="inline-flex items-center gap-2">
              <Clock3 className="size-4 text-accent" />
              {nextClass.startTime.slice(0, 5)} · {nextClass.durationMinutes} min
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="size-4 text-accent" />
              {nextClass.room ?? 'Aula sin asignar'}
            </span>
            <span className="inline-flex items-center gap-2">
              <UsersRound className="size-4 text-accent" />
              {nextClass.studentCount} estudiantes
            </span>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
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
        </div>

        <div className="lg:col-span-5 flex justify-end">
          <div className="relative flex size-48 items-center justify-center sm:size-56">
            <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
              <circle cx="60" cy="60" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
              <circle
                cx="60"
                cy="60"
                r="45"
                fill="none"
                stroke="var(--accent)"
                strokeDasharray={`${(progress / 100) * 282.6} 282.6`}
                strokeLinecap="round"
                strokeWidth="8"
              />
            </svg>
            <div className="text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
                {nextClass.status === 'current' ? 'Ahora' : 'Empieza'}
              </p>
              <p className="mt-1 text-6xl font-bold text-accent">
                {minutes ?? '—'}
              </p>
              <p className="text-sm font-semibold text-white/50">minutos</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
