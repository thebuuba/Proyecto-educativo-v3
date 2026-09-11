import type { ScheduleEntry } from '@/modules/schedule/types'

export const CLASS_TIME_ZONE = 'America/Santo_Domingo'
export const COUNTDOWN_THRESHOLD_SECONDS = 60 * 60
const DAY_SECONDS = 24 * 60 * 60

const clockFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: CLASS_TIME_ZONE,
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
})

export function timeToSeconds(value: string) {
  const [hours = 0, minutes = 0, seconds = 0] = value.split(':').map(Number)
  return hours * 3600 + minutes * 60 + seconds
}

export function getClassClock(now = new Date()) {
  const parts = Object.fromEntries(clockFormatter.formatToParts(now).map(({ type, value }) => [type, value]))
  const year = Number(parts.year)
  const month = Number(parts.month)
  const day = Number(parts.day)
  return {
    year, month, day,
    dayOfWeek: new Date(Date.UTC(year, month - 1, day)).getUTCDay(),
    seconds: Number(parts.hour) * 3600 + Number(parts.minute) * 60 + Number(parts.second),
  }
}

export function getClassCountdownSeconds(status: 'current' | 'upcoming' | 'next' | 'completed', startTime: string, endTime: string, now = new Date()) {
  if (status === 'completed') return 0
  const currentSeconds = getClassClock(now).seconds
  const targetSeconds = timeToSeconds(status === 'current' ? endTime : startTime)
  let difference = targetSeconds - currentSeconds
  if (difference < 0 && targetSeconds < 3 * 60 * 60 && currentSeconds > 21 * 60 * 60) difference += DAY_SECONDS
  return Math.max(0, difference)
}

export function getScheduledClassState(entries: ScheduleEntry[], now = new Date()) {
  const clock = getClassClock(now)
  const current = entries.find((entry) => entry.dayOfWeek === clock.dayOfWeek
    && timeToSeconds(entry.startTime) <= clock.seconds
    && clock.seconds < timeToSeconds(entry.endTime))
  if (current) return { entry: current, state: 'current' as const, seconds: timeToSeconds(current.endTime) - clock.seconds, dayOffset: 0 }

  const next = entries
    .map((entry) => {
      let dayOffset = (entry.dayOfWeek - clock.dayOfWeek + 7) % 7
      if (dayOffset === 0 && timeToSeconds(entry.startTime) <= clock.seconds) dayOffset = 7
      return { entry, dayOffset, seconds: dayOffset * DAY_SECONDS + timeToSeconds(entry.startTime) - clock.seconds }
    })
    .sort((left, right) => left.seconds - right.seconds)[0]
  if (!next) return null
  return { ...next, state: next.seconds <= COUNTDOWN_THRESHOLD_SECONDS ? 'soon' as const : 'upcoming' as const }
}

export function getScheduledClassDate(dayOffset: number, now = new Date()) {
  const { year, month, day } = getClassClock(now)
  return new Date(Date.UTC(year, month - 1, day + dayOffset))
}

export function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  return `${minutes}:${String(totalSeconds % 60).padStart(2, '0')}`
}

export function formatHumanCountdown(totalSeconds: number) {
  if (totalSeconds < 60) return 'menos de 1 min'
  const totalMinutes = Math.ceil(totalSeconds / 60)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours <= 0) return `${totalMinutes} min`
  return minutes === 0 ? `${hours} h` : `${hours} h ${minutes} min`
}
