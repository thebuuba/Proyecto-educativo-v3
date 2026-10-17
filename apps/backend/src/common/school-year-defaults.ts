import { BadRequestException } from '@nestjs/common'

type CalendarEnvironment = Record<string, string | undefined>

function isoDate(value: string, field: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new BadRequestException(`${field} no es una fecha válida.`)
  const date = new Date(`${value}T00:00:00.000Z`)
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new BadRequestException(`${field} no es una fecha válida.`)
  }
  return date
}

function monthDay(env: CalendarEnvironment, key: string, fallback: string) {
  const value = env[key]?.trim() || fallback
  if (!/^\d{2}-\d{2}$/.test(value)) throw new Error(`${key} debe usar MM-DD.`)
  isoDate(`2000-${value}`, key)
  return value
}

/** Única política de respaldo; las fechas ya guardadas de cada centro no se modifican. */
export function resolveSchoolYearDates(name = '', startDate?: string, endDate?: string, now = new Date(), env: CalendarEnvironment = process.env) {
  const startMonthDay = monthDay(env, 'SCHOOL_YEAR_START_MONTH_DAY', '08-01')
  const endMonthDay = monthDay(env, 'SCHOOL_YEAR_END_MONTH_DAY', '06-30')
  const namedYears = name.match(/(\d{4})\D+(\d{4})/)
  const currentDate = now.toISOString().slice(0, 10)
  const currentYear = now.getUTCFullYear()
  const fallbackStartYear = currentDate.slice(5) < startMonthDay ? currentYear - 1 : currentYear
  const explicitStart = startDate ? isoDate(startDate, 'Fecha de inicio') : null
  const explicitEnd = endDate ? isoDate(endDate, 'Fecha de fin') : null
  const startYear = explicitStart?.getUTCFullYear()
    ?? (namedYears ? Number(namedYears[1]) : explicitEnd
      ? explicitEnd.getUTCFullYear() - Number(endMonthDay < startMonthDay)
      : fallbackStartYear)
  const start = explicitStart ?? isoDate(`${startYear}-${startMonthDay}`, 'Fecha de inicio')
  const endYear = namedYears ? Number(namedYears[2])
    : start.getUTCFullYear() + Number(endMonthDay <= start.toISOString().slice(5, 10))
  const end = explicitEnd ?? isoDate(`${endYear}-${endMonthDay}`, 'Fecha de fin')
  if (end <= start) throw new BadRequestException('La fecha de fin debe ser posterior a la fecha de inicio.')
  return { startDate: start, endDate: end }
}

export function defaultSchoolYear(now = new Date(), env: CalendarEnvironment = process.env) {
  const dates = resolveSchoolYearDates('', undefined, undefined, now, env)
  return { name: `${dates.startDate.getUTCFullYear()}-${dates.endDate.getUTCFullYear()}`, ...dates }
}
