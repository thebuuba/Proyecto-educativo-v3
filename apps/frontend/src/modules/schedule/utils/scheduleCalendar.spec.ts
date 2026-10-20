import { describe, expect, it } from 'vitest'
import type { ScheduleEntry, TimeSlot } from '../types'
import {
  calendarBounds,
  calendarPosition,
  matchingFreePeriods,
  nextScheduleClass,
} from './scheduleCalendar'

const slot = (id: string, dayOfWeek: number, endTime = '08:45'): TimeSlot => ({
  id,
  dayOfWeek,
  name: 'Período 1',
  startTime: '08:00',
  endTime,
  sequence: 1,
  status: 'active',
  journeyId: 'morning',
  blockType: 'CLASS',
})

describe('calendario proporcional del docente', () => {
  it('representa una hora con el doble de altura que media hora', () => {
    expect(calendarPosition('08:00', '09:00', 420)).toEqual({ top: 84, height: 84 })
    expect(calendarPosition('08:30', '09:00', 420)).toEqual({ top: 126, height: 42 })
  })

  it('incluye jornadas con duraciones distintas sin alinear períodos por número', () => {
    expect(
      calendarBounds([
        slot('monday', 1),
        { ...slot('night', 2), startTime: '18:10', endTime: '21:20' },
      ]),
    ).toEqual({ start: 480, end: 1320 })
  })

  it('solo permite repetir a la misma hora en días con un período libre de igual duración', () => {
    const slots = [slot('mon', 1), slot('tue', 2), slot('wed', 3), slot('thu', 4, '09:00')]
    const entries = [{ id: 'occupied', timeSlotId: 'wed', dayOfWeek: 3 }] as ScheduleEntry[]
    expect(matchingFreePeriods(slots[0], 1, slots, entries).map(({ day }) => day)).toEqual([2])
  })

  it('no cuenta una clase pendiente como clase en curso o próxima', () => {
    const entries = [
      { id: 'pending', dayOfWeek: 1, startTime: '08:00', endTime: '08:45', needsPlacement: true },
      { id: 'next', dayOfWeek: 1, startTime: '09:00', endTime: '09:45' },
    ] as ScheduleEntry[]
    expect(nextScheduleClass(entries, new Date(2026, 9, 19, 7, 30))?.entry.id).toBe('next')
  })

  it('encuentra la siguiente clase al cruzar al día siguiente', () => {
    const entries = [
      { id: 'tuesday', dayOfWeek: 2, startTime: '07:30', endTime: '08:15' },
    ] as ScheduleEntry[]
    expect(nextScheduleClass(entries, new Date(2026, 9, 19, 20, 0))).toMatchObject({
      entry: { id: 'tuesday' },
      minutesUntil: 690,
      current: false,
      daysAway: 1,
    })
  })
})
