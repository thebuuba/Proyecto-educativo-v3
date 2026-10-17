import { describe, expect, it } from 'vitest'
import { defaultSchoolYear, resolveSchoolYearDates } from './school-year-defaults'

describe('calendario de respaldo compartido', () => {
  it.each(['2027-01-15', '2027-07-31'])('no adelanta el curso antes de agosto: %s', (day) => {
    const year = defaultSchoolYear(new Date(`${day}T12:00:00Z`), {})
    expect(year.name).toBe('2026-2027')
    expect(year.startDate.toISOString().slice(0, 10)).toBe('2026-08-01')
    expect(year.endDate.toISOString().slice(0, 10)).toBe('2027-06-30')
  })
  it('cambia exactamente en el inicio configurado', () => {
    expect(defaultSchoolYear(new Date('2027-08-01T00:00:00Z'), {}).name).toBe('2027-2028')
  })
  it('respeta fechas explícitas y no las sustituye por las de respaldo', () => {
    const dates = resolveSchoolYearDates('Curso especial', '2027-02-01', '2027-11-30', new Date(), {})
    expect(dates.startDate.toISOString()).toBe('2027-02-01T00:00:00.000Z')
    expect(dates.endDate.toISOString()).toBe('2027-11-30T00:00:00.000Z')
  })
  it('comparte los mismos valores para Cursos y el nombre recibido por Auth', () => {
    const defaults = defaultSchoolYear(new Date('2027-01-15'), {})
    expect(resolveSchoolYearDates(defaults.name, undefined, undefined, new Date(), {})).toEqual({ startDate: defaults.startDate, endDate: defaults.endDate })
  })
  it('acepta un calendario configurable dentro del mismo año', () => {
    const year = defaultSchoolYear(new Date('2027-02-01'), { SCHOOL_YEAR_START_MONTH_DAY: '01-10', SCHOOL_YEAR_END_MONTH_DAY: '12-20' })
    expect(year.name).toBe('2027-2027')
    expect(year.startDate.toISOString().slice(0, 10)).toBe('2027-01-10')
  })
  it.each([['2027-02-29', '2027-06-30'], ['2027-09-01', '2027-08-01'], ['2027-2-01', '2027-06-30']])('rechaza fechas inválidas o invertidas', (start, end) => {
    expect(() => resolveSchoolYearDates('', start, end, new Date(), {})).toThrow()
  })
})
