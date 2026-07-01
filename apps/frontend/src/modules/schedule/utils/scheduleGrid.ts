import type { ScheduleEntry, TimeSlot } from '@/modules/schedule/types'

export const scheduleWeekDays = [
  { label: 'LUN', name: 'Lunes', dayOfWeek: 1 },
  { label: 'MAR', name: 'Martes', dayOfWeek: 2 },
  { label: 'MIÉ', name: 'Miércoles', dayOfWeek: 3 },
  { label: 'JUE', name: 'Jueves', dayOfWeek: 4 },
  { label: 'VIE', name: 'Viernes', dayOfWeek: 5 },
]

export const defaultScheduleDayIds = scheduleWeekDays.map((day) => day.dayOfWeek)

export function getScheduleDaysByIds(dayIds: number[]) {
  const selected = scheduleWeekDays.filter((day) => dayIds.includes(day.dayOfWeek))
  return selected.length > 0 ? selected : scheduleWeekDays
}

export type ScheduleBreakInput = {
  id: string
  name: string
  startTime: string
  endTime: string
}

export type ScheduleBlockPreview = {
  name: string
  startTime: string
  endTime: string
  sequence: number
  kind: 'class' | 'break'
}

export function formatTime(value: string) {
  return value.slice(0, 5)
}

export function minutesFromTime(value: string) {
  const [hours, minutes] = value.split(':').map(Number)
  return hours * 60 + minutes
}

export function timeFromMinutes(value: number) {
  const hours = Math.floor(value / 60)
  const minutes = value % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

export function getDurationHours(startTime: string, endTime: string) {
  return Math.max((minutesFromTime(endTime) - minutesFromTime(startTime)) / 60, 0)
}

export function isBreakSlot(slot: Pick<TimeSlot, 'name'>) {
  const normalized = slot.name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
  return normalized.includes('recreo') || normalized.includes('receso') || normalized.includes('descanso')
}

export function buildSchedulePreview(input: {
  startTime: string
  endTime: string
  classDurationMinutes: number
  breaks: ScheduleBreakInput[]
}) {
  const start = minutesFromTime(input.startTime)
  const end = minutesFromTime(input.endTime)
  const breaks = input.breaks
    .map((item) => ({
      ...item,
      start: minutesFromTime(item.startTime),
      end: minutesFromTime(item.endTime),
    }))
    .filter((item) => item.name.trim() && item.start < item.end && item.start >= start && item.end <= end)
    .sort((first, second) => first.start - second.start)

  const blocks: ScheduleBlockPreview[] = []
  let cursor = start
  let classIndex = 1
  let breakIndex = 0

  while (cursor < end) {
    const nextBreak = breaks[breakIndex]

    if (nextBreak && cursor >= nextBreak.start) {
      blocks.push({
        name: nextBreak.name.trim(),
        startTime: timeFromMinutes(nextBreak.start),
        endTime: timeFromMinutes(nextBreak.end),
        sequence: blocks.length + 1,
        kind: 'break',
      })
      cursor = nextBreak.end
      breakIndex += 1
      continue
    }

    const blockEnd = Math.min(
      cursor + input.classDurationMinutes,
      nextBreak?.start ?? end,
      end,
    )

    if (blockEnd <= cursor) {
      cursor += input.classDurationMinutes
      continue
    }

    blocks.push({
      name: `${classIndex}.º período`,
      startTime: timeFromMinutes(cursor),
      endTime: timeFromMinutes(blockEnd),
      sequence: blocks.length + 1,
      kind: 'class',
    })
    classIndex += 1
    cursor = blockEnd
  }

  return blocks
}

export function getEntryKey(dayOfWeek: number, timeSlotId: string) {
  return `${dayOfWeek}:${timeSlotId}`
}

export function mapEntriesByCell(entries: ScheduleEntry[]) {
  const map = new Map<string, ScheduleEntry>()
  entries.forEach((entry) => {
    map.set(getEntryKey(entry.dayOfWeek, entry.timeSlotId), entry)
  })
  return map
}
