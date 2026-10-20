import type { ScheduleEntry, TimeSlot } from '../types'
import { minutesFromScheduleTime, scheduleDays } from './scheduleStructure'

export const CALENDAR_MINUTE_HEIGHT = 1.4
export const shortTime = (value: string) => value.slice(0, 5).replace(/^0/, '')
export const scheduleDay = (day: number) => scheduleDays.find((item) => item.dayOfWeek === day)!
export const slotKey = (slotId: string, day: number) => `${day}:${slotId}`
export const classMinutes = (entry: Pick<ScheduleEntry, 'startTime' | 'endTime'>) =>
  Math.max(0, minutesFromScheduleTime(entry.endTime) - minutesFromScheduleTime(entry.startTime))
export const decimalHours = (minutes: number) =>
  `${new Intl.NumberFormat('es', { maximumFractionDigits: 1 }).format(minutes / 60)} h`

export function configuredScheduleDays(slots: TimeSlot[]) {
  const days = [...new Set(slots.flatMap((slot) => (slot.dayOfWeek ? [slot.dayOfWeek] : [])))].sort(
    (a, b) => a - b,
  )
  return days.length ? days : [1, 2, 3, 4, 5]
}

export function slotsOnDay(slots: TimeSlot[], day: number) {
  return slots
    .filter(
      (slot) =>
        (slot.dayOfWeek === null || slot.dayOfWeek === day) &&
        slot.status.toLowerCase() !== 'inactive',
    )
    .sort((a, b) => a.startTime.localeCompare(b.startTime) || a.sequence - b.sequence)
}

export function calendarBounds(slots: TimeSlot[]) {
  if (!slots.length) return { start: 420, end: 780 }
  return {
    start:
      Math.floor(Math.min(...slots.map((slot) => minutesFromScheduleTime(slot.startTime))) / 60) *
      60,
    end:
      Math.ceil(Math.max(...slots.map((slot) => minutesFromScheduleTime(slot.endTime))) / 60) * 60,
  }
}

export function calendarPosition(startTime: string, endTime: string, start: number) {
  return {
    top: Math.round((minutesFromScheduleTime(startTime) - start) * CALENDAR_MINUTE_HEIGHT),
    height: Math.round(
      (minutesFromScheduleTime(endTime) - minutesFromScheduleTime(startTime)) *
        CALENDAR_MINUTE_HEIGHT,
    ),
  }
}

export function matchingFreePeriods(
  source: TimeSlot,
  day: number,
  slots: TimeSlot[],
  entries: ScheduleEntry[],
) {
  return configuredScheduleDays(slots)
    .filter((candidate) => candidate !== day)
    .flatMap((candidate) => {
      const slot = slotsOnDay(slots, candidate).find(
        (item) =>
          item.blockType === 'CLASS' &&
          item.startTime === source.startTime &&
          item.endTime === source.endTime &&
          !entries.some(
            (entry) =>
              !entry.needsPlacement &&
              entry.dayOfWeek === candidate &&
              entry.timeSlotId === item.id,
          ),
      )
      return slot ? [{ slot, day: candidate }] : []
    })
}

export function nextScheduleClass(entries: ScheduleEntry[], now: Date) {
  const today = now.getDay() || 7
  const minute = now.getHours() * 60 + now.getMinutes()
  return (
    entries
      .filter((entry) => !entry.needsPlacement)
      .flatMap((entry) => {
        let daysAway = (entry.dayOfWeek - today + 7) % 7
        if (!daysAway && minutesFromScheduleTime(entry.endTime) <= minute) daysAway = 7
        const minutesUntil = daysAway * 1440 + minutesFromScheduleTime(entry.startTime) - minute
        return [
          {
            entry,
            minutesUntil: Math.max(0, minutesUntil),
            current: !daysAway && minutesUntil <= 0,
            daysAway,
          },
        ]
      })
      .sort((a, b) => a.minutesUntil - b.minutesUntil)[0] ?? null
  )
}
