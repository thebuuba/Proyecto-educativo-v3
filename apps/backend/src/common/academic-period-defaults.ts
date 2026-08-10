export const defaultAcademicPeriods = [
  { name: 'P1 — Agosto, septiembre y octubre', sequence: 1, startMonth: 8, startDay: 1, endMonth: 10, endDay: 31 },
  { name: 'P2 — Noviembre, diciembre y enero', sequence: 2, startMonth: 11, startDay: 1, endMonth: 1, endDay: 31 },
  { name: 'P3 — Febrero, marzo y abril', sequence: 3, startMonth: 2, startDay: 1, endMonth: 4, endDay: 30 },
  { name: 'P4 — Mayo', sequence: 4, startMonth: 5, startDay: 1, endMonth: 5, endDay: 31 },
] as const

export function academicPeriodDate(schoolYearStart: Date, month: number, day: number) {
  const startYear = schoolYearStart.getUTCFullYear()
  const year = month >= 8 ? startYear : startYear + 1
  return new Date(Date.UTC(year, month - 1, day))
}
