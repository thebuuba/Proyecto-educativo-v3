import type { ScheduleBlockType, ScheduleStructureBlockInput, ScheduleStructureJourneyInput } from '@/modules/schedule/types'

export const scheduleDays = [
  { dayOfWeek: 1, short: 'Lun', name: 'Lunes' },
  { dayOfWeek: 2, short: 'Mar', name: 'Martes' },
  { dayOfWeek: 3, short: 'Mié', name: 'Miércoles' },
  { dayOfWeek: 4, short: 'Jue', name: 'Jueves' },
  { dayOfWeek: 5, short: 'Vie', name: 'Viernes' },
  { dayOfWeek: 6, short: 'Sáb', name: 'Sábado' },
  { dayOfWeek: 7, short: 'Dom', name: 'Domingo' },
] as const

export const blockTypeLabels: Record<ScheduleBlockType, string> = {
  CLASS: 'Período', BREAK: 'Recreo', LUNCH: 'Almuerzo', PAUSE: 'Pausa', FREE: 'Hora libre',
}

export function minutesFromScheduleTime(value: string) {
  const [hours, minutes] = value.slice(0, 5).split(':').map(Number)
  return hours * 60 + minutes
}

export function scheduleTimeFromMinutes(value: number) {
  const hours = Math.floor(value / 60)
  const minutes = value % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

export function blockDuration(block: Pick<ScheduleStructureBlockInput, 'startTime' | 'endTime'>) {
  return minutesFromScheduleTime(block.endTime) - minutesFromScheduleTime(block.startTime)
}

export function generateJourneyBlocks(input: {
  journeyKey: string
  startTime: string
  durationMinutes: number
  periodCount: number
  days: number[]
}) {
  const blocks: ScheduleStructureBlockInput[] = []
  for (const dayOfWeek of input.days) {
    let cursor = minutesFromScheduleTime(input.startTime)
    for (let index = 0; index < input.periodCount; index += 1) {
      const end = cursor + input.durationMinutes
      blocks.push({
        name: `Período ${index + 1}`,
        startTime: scheduleTimeFromMinutes(cursor),
        endTime: scheduleTimeFromMinutes(end),
        sequence: index + 1,
        dayOfWeek,
        blockType: 'CLASS',
        journeyKey: input.journeyKey,
      })
      cursor = end
    }
  }
  return blocks
}

export function validateScheduleStructure(journeys: ScheduleStructureJourneyInput[], blocks: ScheduleStructureBlockInput[]) {
  const errors: string[] = []
  if (!journeys.length) errors.push('Añade al menos una jornada.')
  journeys.forEach((journey) => {
    if (minutesFromScheduleTime(journey.endTime) <= minutesFromScheduleTime(journey.startTime)) errors.push(`${journey.name}: la hora final debe ser posterior al inicio.`)
  })
  blocks.forEach((block) => {
    if (blockDuration(block) <= 0) errors.push(`${block.name}: la hora final debe ser posterior al inicio.`)
    const journey = journeys.find((item) => item.id === block.journeyKey)
    if (!journey) errors.push(`${block.name}: selecciona una jornada válida.`)
    else if (minutesFromScheduleTime(block.startTime) < minutesFromScheduleTime(journey.startTime) || minutesFromScheduleTime(block.endTime) > minutesFromScheduleTime(journey.endTime)) errors.push(`${block.name}: queda fuera de ${journey.name}.`)
  })
  for (const day of new Set(blocks.map((block) => block.dayOfWeek))) {
    const dayBlocks = blocks.filter((block) => block.dayOfWeek === day).sort((a, b) => minutesFromScheduleTime(a.startTime) - minutesFromScheduleTime(b.startTime))
    for (let index = 1; index < dayBlocks.length; index += 1) {
      if (minutesFromScheduleTime(dayBlocks[index].startTime) < minutesFromScheduleTime(dayBlocks[index - 1].endTime)) errors.push(`${scheduleDays.find((item) => item.dayOfWeek === day)?.name}: hay bloques solapados.`)
    }
  }
  return [...new Set(errors)]
}

export function summarizeBlocks(blocks: ScheduleStructureBlockInput[]) {
  return blocks.reduce((summary, block) => {
    const duration = Math.max(0, blockDuration(block))
    summary.total += duration
    if (block.blockType === 'CLASS') summary.class += duration
    else if (block.blockType === 'FREE') summary.free += duration
    else summary.pause += duration
    return summary
  }, { total: 0, class: 0, pause: 0, free: 0 })
}

