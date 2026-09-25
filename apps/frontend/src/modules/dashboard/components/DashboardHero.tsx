import { Clock, FlaskConical, MapPin, Play, Users } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import type { DashboardClass } from '@/modules/dashboard/types/dashboard'
import {
  COUNTDOWN_THRESHOLD_SECONDS,
  formatCountdown,
  getClassCountdownSeconds,
} from '@/modules/schedule/utils/classTime'

const RING_CIRCUMFERENCE = 2 * Math.PI * 45

type DashboardHeroProps = {
  nextClass: DashboardClass | null
  onStartClass: (item: DashboardClass) => void
  onViewPlanning: (item: DashboardClass) => void
  canManageClass?: boolean
  onCountdownEnd?: () => void
}

function CountdownBadge({ item, seconds }: { item: DashboardClass; seconds: number }) {
  const isCurrent = item.status === 'current'
  const showCountdown = isCurrent || seconds <= COUNTDOWN_THRESHOLD_SECONDS
  const durationSeconds = Math.max(1, item.durationMinutes * 60)
  const progress = isCurrent
    ? Math.max(0, Math.min(100, (seconds / durationSeconds) * 100))
    : Math.max(0, Math.min(100, 100 - (seconds / COUNTDOWN_THRESHOLD_SECONDS) * 100))
  const ringLength = showCountdown
    ? (progress / 100) * RING_CIRCUMFERENCE
    : RING_CIRCUMFERENCE * 0.035
  const label = isCurrent ? 'Termina' : showCountdown ? 'Empieza' : 'Hora'
  const value = showCountdown ? formatCountdown(seconds) : item.startTime.slice(0, 5)

  return (
    <div
      className="relative flex size-16 shrink-0 items-center justify-center"
      role="timer"
      aria-label={
        showCountdown ? `${label} en ${formatCountdown(seconds)}` : `Clase a las ${value}`
      }
    >
      <svg
        className="absolute inset-0 size-full -rotate-90"
        viewBox="0 0 120 120"
        aria-hidden="true"
      >
        <circle
          data-countdown-progress
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke="white"
          strokeOpacity="0.28"
          strokeWidth="8"
        />
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke="white"
          strokeDasharray={`${ringLength} ${RING_CIRCUMFERENCE}`}
          strokeLinecap="round"
          strokeWidth="8"
        />
      </svg>
      <div className="text-center leading-none text-white">
        <p
          data-countdown-label
          className="whitespace-nowrap text-[8px] font-bold uppercase tracking-[0.06em] sm:text-[9px]"
        >
          {label}
        </p>
        <p className="mt-1 text-lg font-semibold tabular-nums sm:text-xl">{value}</p>
      </div>
    </div>
  )
}

export function DashboardHero({
  nextClass,
  onStartClass,
  canManageClass = true,
  onCountdownEnd,
}: DashboardHeroProps) {
  const [countdownSeconds, setCountdownSeconds] = useState(() =>
    nextClass
      ? getClassCountdownSeconds(nextClass.status, nextClass.startTime, nextClass.endTime)
      : 0,
  )
  const countdownEndNotified = useRef(false)
  const onCountdownEndRef = useRef(onCountdownEnd)

  useEffect(() => {
    onCountdownEndRef.current = onCountdownEnd
  }, [onCountdownEnd])

  useEffect(() => {
    countdownEndNotified.current = false
    if (!nextClass) {
      setCountdownSeconds(0)
      return undefined
    }
    const updateCountdown = () => {
      const seconds = getClassCountdownSeconds(
        nextClass.status,
        nextClass.startTime,
        nextClass.endTime,
      )
      setCountdownSeconds((current) => current === seconds ? current : seconds)
      if (seconds === 0 && !countdownEndNotified.current) {
        countdownEndNotified.current = true
        onCountdownEndRef.current?.()
      }
    }
    updateCountdown()
    const interval = window.setInterval(updateCountdown, 1000)
    return () => window.clearInterval(interval)
  }, [nextClass])

  if (!nextClass) {
    return (
      <section className="home-class-card" data-home-widget="class">
        <span className="home-class-icon">
          <FlaskConical size={21} aria-hidden="true" />
        </span>
        <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.18em]">
          Sin clase programada
        </p>
        <h2 className="mt-2 text-xl font-semibold">Agenda libre</h2>
        <p className="mt-2 text-sm">No tienes otra clase programada para hoy.</p>
      </section>
    )
  }

  return (
    <section className="home-class-card relative overflow-hidden" data-home-widget="class">
      <span className="home-class-decoration home-class-decoration-one" aria-hidden="true" />
      <span className="home-class-decoration home-class-decoration-two" aria-hidden="true" />
      <div className="absolute right-4 top-4 z-10">
        <CountdownBadge item={nextClass} seconds={countdownSeconds} />
      </div>
      <div className="relative z-10 min-w-0">
        <span className="home-class-icon">
          <FlaskConical size={21} aria-hidden="true" />
        </span>
        <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.17em]">
          <span className="mr-2 inline-block size-1.5 rounded-full bg-white align-middle" />
          {nextClass.status === 'current' ? 'Clase en curso' : 'Próxima clase'} ·{' '}
          {nextClass.gradeName} {nextClass.sectionName}
        </p>
        <h2 className="mt-1 line-clamp-2 text-[15px] font-semibold leading-snug">
          {nextClass.subjectName}
        </h2>
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-medium">
          <span className="inline-flex items-center gap-1">
            <Clock size={12} />
            {nextClass.startTime.slice(0, 5)} – {nextClass.endTime.slice(0, 5)}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={12} />
            {nextClass.room ?? 'Aula sin asignar'}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users size={12} />
            {nextClass.studentCount} est.
          </span>
        </div>
        {canManageClass ? (
          <button
            type="button"
            className="mt-4 inline-flex min-h-9 items-center gap-2 rounded-xl bg-white px-4 text-xs font-semibold text-primary shadow-sm hover:bg-primary-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            onClick={() => onStartClass(nextClass)}
          >
            <Play size={13} fill="currentColor" aria-hidden="true" />
            Iniciar clase
          </button>
        ) : null}
      </div>
    </section>
  )
}
