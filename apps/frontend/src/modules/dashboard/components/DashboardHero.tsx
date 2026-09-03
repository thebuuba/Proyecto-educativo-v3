/**
 * Componente DashboardHero — Muestra la clase activa o la siguiente clase
 * del docente en una tarjeta compacta con contador en vivo.
 */

import { ArrowRight, Clock3, MapPin, Play, UsersRound } from 'lucide-react'
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
  nextClass: DashboardClass | null
  onStartClass: (item: DashboardClass) => void
  onViewPlanning: (item: DashboardClass) => void
  canManageClass?: boolean
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

function CountdownBadge({ item, seconds }: { item: DashboardClass; seconds: number }) {
  const isCurrent = item.status === 'current'
  const durationSeconds = Math.max(1, item.durationMinutes * 60)
  const progress = isCurrent
    ? Math.max(0, Math.min(100, (seconds / durationSeconds) * 100))
    : Math.max(0, Math.min(100, 100 - (seconds / (90 * 60)) * 100))
  const ringLength = (progress / 100) * RING_CIRCUMFERENCE
  const label = isCurrent ? 'Termina' : 'Empieza'

  return (
    <div
      className="relative flex size-[88px] shrink-0 items-center justify-center sm:size-24"
      aria-label={`${label} en ${formatCountdown(seconds)}`}
    >
      <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke="var(--palette-white)"
          strokeOpacity="0.58"
          strokeWidth="8"
        />
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke="var(--class-accent)"
          strokeDasharray={`${ringLength} ${RING_CIRCUMFERENCE}`}
          strokeLinecap="round"
          strokeWidth="8"
          className="transition-[stroke-dasharray] duration-1000 ease-linear"
        />
      </svg>
      <div className="text-center leading-none text-[var(--class-foreground)]">
        <p className="text-[8px] font-bold uppercase tracking-[0.16em] sm:text-[9px]">
          {label}
        </p>
        <p className="mt-1 text-xl font-extrabold tabular-nums sm:text-2xl">
          {formatCountdown(seconds)}
        </p>
      </div>
    </div>
  )
}

export function DashboardHero({
  nextClass,
  onStartClass,
  onViewPlanning,
  canManageClass = true,
  onCountdownEnd,
}: DashboardHeroProps) {
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
      <section
        className="ml-auto w-full max-w-[520px] rounded-3xl border border-border px-5 py-5 text-[var(--class-foreground)] shadow-sm"
        style={{ backgroundColor: 'var(--class-panel)' }}
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.22em]">Sin clase programada</p>
        <h2 className="mt-2 text-xl font-bold">Agenda libre</h2>
        <p className="mt-1 text-sm text-[var(--class-muted)]">No tienes otra clase programada para hoy.</p>
      </section>
    )
  }

  const isCurrent = nextClass.status === 'current'

  return (
    <section
      className="relative ml-auto w-full max-w-[520px] overflow-hidden rounded-3xl border border-border p-5 pr-[7.5rem] text-[var(--class-foreground)] shadow-sm sm:p-6 sm:pr-[8.5rem]"
      style={{ backgroundColor: 'var(--class-panel)' }}
    >
      <div className="absolute right-4 top-4 z-10 sm:right-5 sm:top-5">
        <CountdownBadge item={nextClass} seconds={countdownSeconds} />
      </div>

      <div className="relative min-w-0">
        <div className="inline-flex items-center gap-2">
          <span className="size-1.5 animate-pulse rounded-full bg-[var(--class-accent)]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.22em]">
            {isCurrent ? 'Clase en curso' : 'Próxima clase'}
          </span>
        </div>

        <h2 className="mt-3 line-clamp-2 text-xl font-extrabold leading-tight tracking-tight sm:text-2xl">
          {nextClass.subjectName}
        </h2>
        <p className="mt-1 text-sm font-semibold text-[var(--class-muted)]">
          {nextClass.gradeName} {nextClass.sectionName}
        </p>

        <div className="mt-4 grid gap-2 text-xs text-[var(--class-muted)]">
          <span className="inline-flex items-center gap-2">
            <Clock3 className="size-3.5 shrink-0 text-[var(--class-foreground)]" />
            {nextClass.startTime.slice(0, 5)}–{nextClass.endTime.slice(0, 5)}
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin className="size-3.5 shrink-0 text-[var(--class-foreground)]" />
            {nextClass.room ?? 'Aula sin asignar'}
          </span>
          <span className="inline-flex items-center gap-2">
            <UsersRound className="size-3.5 shrink-0 text-[var(--class-foreground)]" />
            {nextClass.studentCount} estudiantes
          </span>
        </div>

        {canManageClass ? (
          <div className="mt-5 flex flex-wrap gap-2">
            <Button
              variant="secondary"
              className="h-10 rounded-xl bg-[var(--palette-white)] px-4 text-sm text-[var(--palette-text)] hover:bg-[var(--palette-gray)]"
              onClick={() => onStartClass(nextClass)}
            >
              <Play className="size-4 fill-current" />
              Iniciar clase
            </Button>
            <Button
              variant="outline"
              className="h-10 rounded-xl border-[var(--palette-text)] bg-transparent px-4 text-sm text-[var(--palette-text)] hover:bg-[var(--palette-white)]"
              onClick={() => onViewPlanning(nextClass)}
            >
              Planificación
              <ArrowRight className="size-4" />
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  )
}
