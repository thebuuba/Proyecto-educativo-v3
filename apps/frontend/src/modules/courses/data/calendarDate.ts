/** Interpreta las fechas académicas como días de calendario, sin desplazarlas por zona horaria. */
export function calendarDate(value: string): Date {
  const dateOnly = /^\d{4}-\d{2}-\d{2}/.exec(value)?.[0]
  return new Date(dateOnly ? `${dateOnly}T12:00:00` : value)
}
