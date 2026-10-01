import { describe, expect, it } from 'vitest'
import { calendarDate } from './calendarDate'

describe('calendarDate', () => {
  it('conserva el día académico en fechas ISO de PostgreSQL', () => {
    expect(calendarDate('2026-09-27T00:00:00.000Z').getDate()).toBe(27)
    expect(calendarDate('2026-09-27').getDate()).toBe(27)
  })
})
