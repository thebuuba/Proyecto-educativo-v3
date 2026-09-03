/**
 * Componente DashboardHero — Muestra la clase activa o la siguiente clase
 * del docente, con un contador en vivo que puede quedar contraído.
 */

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Play,
  UsersRound,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/Button'
import type { DashboardClass } from '@/modules/dashboard/types/dashboard'

const DASHBOARD_TIME_ZONE = 'America/Santo_Domingo'
const DAY_SECONDS = 24 * 60 * 60
const RING_CIRCUMFERENCE = 2 * Math.PI * 45

const dashboardClockFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: DASHBOARD_TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
})

type DashboardHeroProps = {
  /** Clase activa o siguiente clase del día (puede ser nulo). */
  nextClass: DashboardClass | null
  /** Callback al hacer clic en "Iniciar clase". */
  onStartClass: (item: DashboardClass) => void
  /** Callback al hacer clic en "Ver planificación". */
  onViewPlanning: (item: DashboardClass) => void
  /** Muestra acciones operativas solo a roles autorizados. */
  canManageClass?: boolean
  /** Se ejecuta cuando la clase actual termina o comienza la siguiente. */
  onCountdownEnd?: () => void
}

function timeToSeconds(value: string) {
  const [hours = 0, minutes = 0, seconds = 0] = value.split(':').map(Number)
  return hours * 3600 + minutes * 60 + seconds
}

function getDashboardClockSeconds(now = new Date()) {
  const parts = Object.fromEntries(
    dashboardClockFormatter.formatToParts(now).map(({ type, value }) => [type, value]),
  )

  return Number(parts.hour) * 3600 + Number(parts.minute) * 60 + Number(parts.second)
}

function getCountdownSeconds(item: DashboardClass, now = new Date()) {
  if (item.status === 'completed') return 0

  const currentSeconds = getDashboardClockSeconds(now)
  const targetSeconds = timeToSeconds(item.status === 'current' ? item.endTime : item.startTime)
  let difference = targetSeconds - currentSeconds

  // Protege horarios que eventualmente crucen medianoche sin alterar el flujo normal del día.
  if (difference < 0 && targetSeconds < 3 * 60 * 60 && currentSeconds > 21 * 60 * 60) {
    difference += DAY_SECONDS
  }

  return Math.max(0, difference)
}

function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

function CountdownCircle({
  item,
  seconds,
  compact = false,
}: {
  item: DashboardClass
  seconds: number
  compact?: boolean
}) {
  const isCurrent = item.status === 'current'
  const durationSeconds = Math.max(1, item.durationMinutes * 60)
  const progress = isCurrent
    ? Math.max(0, Math.min(100, (seconds / durationSeconds) * 100))
    : Math.max(0, Math.min(100, 100 - (seconds / (90 * 60)) * 100))
  const ringLength = (progress / 100) * RING_CIRCUMFERENCE
  const label = isCurrent ? 'Termina en' : 'Empieza en'

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center ${compact ? 'size-44 sm:size-48' : 'size-48 sm:size-56'}`}
      aria-label={`${label} ${formatCountdown(seconds)}`}
    >
      <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke="var(--accent)"
          strokeDasharray={`${ringLength} ${RING_CIRCUMFERENCE}`}
          strokeLinecap="round"
          strokeWidth="8"
          className="transition-[stroke-dasharray] duration-1000 ease-linear"
        />
      </svg>
      <div className="text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent sm:text-[11px]">
          {label}
        </p>
        <p className={`mt-1 font-bold tabular-nums text-accent ${compact ? 'text-4xl sm:text-5xl' : 'text-5xl sm:text-6xl'}`}>
          {formatCountdown(seconds)}
        </p>
        <p className="mt-1 text-xs font-semibold text-white/50 sm:text-sm">min:seg</p>
      </div>
    </div>
  )
}

/** Hero del dashboard que muestra la próxima clase o un estado vacío. */
export function DashboardHero({
  nextClass,
  onStartClass,
  onViewPlanning,
  canManageClass = true,
  onCountdownEnd,
}: DashboardHeroProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [countdownSeconds, setCountdownSeconds] = useState(() =>
    nextClass ? getCountdownSeconds(nextClass) : 0,
  )
  const countdownEndNotified = useRef(false)

  useEffect(() => {
    countdownEndNotified.current = false

    if (!nextClass) {
      setCountdownSeconds(0)
      return undefined
    }

    const updateCountdown = () => {
      const nextSeconds = getCountdownSeconds(nextClass)
      setCountdownSeconds(nextSeconds)

      if (nextSeconds === 0 && !countdownEndNotified.current) {
        countdownEndNotified.current = true
        onCountdownEnd?.()
      }
    }

    updateCountdown()
    const interval = window.setInterval(updateCountdown, 1000)

    return () => window.clearInterval(interval)
  }, [nextClass, onCountdownEnd])

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
    <section
      className={`relative overflow-hidden rounded-[28px] shadow-xl transition-[width,padding] duration-500 ease-out ${
        collapsed ? 'w-[220px] max-w-full p-3 sm:w-[244px]' : 'w-full p-8 lg:p-10'
      }`}
      style={{ backgroundColor: '#1a1f3a', boxShadow: '0 20px 50px -10px rgba(26,31,58,0.3)' }}
    >
      <div
        className="pointer-events-none absolute -right-10 -top-20 size-[400px] rounded-full opacity-40"
        style={{ background: 'radial-gradient(circle, rgba(255,139,107,0.5) 0%, transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      <button
        type="button"
        onClick={() => setCollapsed((value) => !value)}
        className="absolute right-3 top-3 z-20 inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/8 text-white/65 backdrop-blur transition-colors hover:bg-white/14 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-label={collapsed ? 'Expandir información de la clase' : 'Contraer información de la clase'}
        title={collapsed ? 'Expandir' : 'Contraer'}
      >
        {collapsed ? <ChevronRight className="size-5" /> : <ChevronLeft className="size-5" />}
      </button>

      {collapsed ? (
        <div className="relative flex justify-center pr-2 pt-2">
          <CountdownCircle item={nextClass} seconds={countdownSeconds} compact />
        </div>
      ) : (
        <div className="relative grid items-end gap-8 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-7">
            <div className="inline-flex items-center gap-2">
              <span className="size-1.5 animate-pulse rounded-full bg-accent" />
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-accent">
                {nextClass.status === 'current'
                  ? 'Clase en curso'
                  : `Tu próxima clase · empieza en ${Math.ceil(countdownSeconds / 60)} min`}
              </span>
            </div>

            <h2 className="text-4xl font-bold leading-[1.05] tracking-tight text-white lg:text-5xl">
              {nextClass.subjectName}
              <br />
              <span className="font-medium text-white/50">
                para {nextClass.gradeName} {nextClass.sectionName}
              </span>
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
              <span className="inline-flex items-center gap-2">
                <Clock3 className="size-4 text-accent" />
                {nextClass.startTime.slice(0, 5)}–{nextClass.endTime.slice(0, 5)} · {nextClass.durationMinutes} min
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

            {canManageClass ? (
              <div className="flex flex-wrap gap-3 pt-2">
                <Button className="h-12 rounded-xl px-5" onClick={() => onStartClass(nextClass)}>
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
            ) : null}
          </div>

          <div className="flex justify-end lg:col-span-5">
            <CountdownCircle item={nextClass} seconds={countdownSeconds} />
          </div>
        </div>
      )}
    </section>
  )
}
