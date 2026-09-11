import { describe, expect, it } from 'vitest'

import type { ScheduleEntry } from '@/modules/schedule/types'
import { getScheduledClassState } from './classTime'

const entry = (dayOfWeek: number, startTime: string, endTime: string) => ({ id: `${dayOfWeek}-${startTime}`, dayOfWeek, startTime, endTime } as ScheduleEntry)
const santoDomingoTime = (iso: string) => new Date(iso)

describe('estado temporal de una clase', () => {
  it('distingue una clase lejana, próxima y en curso usando America/Santo_Domingo', () => {
    const mondayClass = entry(1, '10:00:00', '10:40:00')

    expect(getScheduledClassState([mondayClass], santoDomingoTime('2026-09-07T12:00:00Z'))).toMatchObject({ state: 'upcoming', seconds: 7200 })
    expect(getScheduledClassState([mondayClass], santoDomingoTime('2026-09-07T13:20:00Z'))).toMatchObject({ state: 'soon', seconds: 2400 })
    expect(getScheduledClassState([mondayClass], santoDomingoTime('2026-09-07T14:00:20Z'))).toMatchObject({ state: 'current', seconds: 2380 })
  })

  it('salta automáticamente a la siguiente sesión cuando termina la actual', () => {
    const schedule = [entry(1, '10:00:00', '10:40:00'), entry(2, '09:00:00', '09:40:00')]

    expect(getScheduledClassState(schedule, santoDomingoTime('2026-09-07T14:39:50Z'))).toMatchObject({ state: 'current', seconds: 10 })
    expect(getScheduledClassState(schedule, santoDomingoTime('2026-09-07T14:40:00Z'))).toMatchObject({ state: 'upcoming', dayOffset: 1, entry: { dayOfWeek: 2 } })
  })
})
