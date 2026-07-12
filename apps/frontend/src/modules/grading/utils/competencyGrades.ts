import type {
  GradeRecordRow,
  GradeCalculationConfig,
  GradingActivity,
  RecoveryScores,
  StudentGradeRow,
} from '@/modules/grading/types'

export const passingScore = 70

export const defaultGradeCalculationConfig: GradeCalculationConfig = {
  passingScore,
  blockMethod: 'sum',
  expectedBlockTotal: 100,
  recoveryRule: 'replace',
  finalRounding: 'standard',
  pcDecimals: 2,
  annualDecimals: 2,
  finalDecimals: 0,
  showRecovery: true,
}

export const competencyPeriods = [
  { id: 'p1', name: 'P1 — Agosto, septiembre y octubre', shortName: 'P1', recoveryLabel: 'RP1' },
  { id: 'p2', name: 'P2 — Noviembre, diciembre y enero', shortName: 'P2', recoveryLabel: 'RP2' },
  { id: 'p3', name: 'P3 — Febrero, marzo y abril', shortName: 'P3', recoveryLabel: 'RP3' },
  { id: 'p4', name: 'P4 — Mayo', shortName: 'P4', recoveryLabel: 'RP4' },
  { id: 'final', name: 'Resumen final', shortName: 'Resumen final', recoveryLabel: '' },
] as const

export const competencyBlocks = [
  { id: 'b1', shortName: 'Bloque 1', name: 'Competencia Comunicativa' },
  {
    id: 'b2',
    shortName: 'Bloque 2',
    name: 'Pensamiento Lógico, Creativo y Crítico y Resolución de Problemas',
  },
  {
    id: 'b3',
    shortName: 'Bloque 3',
    name: 'Ética y Ciudadana y Desarrollo Personal y Espiritual',
  },
  {
    id: 'b4',
    shortName: 'Bloque 4',
    name: 'Científica y Tecnológica y Ambiental y de la Salud',
  },
] as const

export type CompetencyPeriodId = (typeof competencyPeriods)[number]['id']
export type CompetencyBlockId = (typeof competencyBlocks)[number]['id']

const activityPrefix = 'ABV2:activity'
const recoveryPrefix = 'ABV2:recovery'

export function activityRecordName(activity: GradingActivity) {
  return `${activityPrefix}:${activity.competencyBlockId}:${activity.id}:${encodeURIComponent(activity.name)}`
}

export function recoveryRecordName(blockId: string, periodId: string) {
  return `${recoveryPrefix}:${blockId}:${periodId}`
}

export function getActivityIdFromRecordName(value: string) {
  const parts = value.split(':')
  return parts[0] === 'ABV2' && parts[1] === 'activity' ? parts[3] : null
}

export function getRecoveryInfoFromRecordName(value: string) {
  const parts = value.split(':')
  if (parts[0] !== 'ABV2' || parts[1] !== 'recovery') return null
  return { blockId: parts[2], periodId: parts[3] }
}

export function sumActivityMaxScore(activities: GradingActivity[], blockId: string) {
  return activities
    .filter((activity) => activity.competencyBlockId === blockId)
    .reduce((total, activity) => total + activity.maxScore, 0)
}

export function scoreForActivity(records: GradeRecordRow[], enrollmentId: string, activityId: string) {
  return records.find((record) =>
    record.enrollmentId === enrollmentId &&
    getActivityIdFromRecordName(record.assessmentName) === activityId
  ) ?? null
}

export function blockTotal(input: {
  records: GradeRecordRow[]
  activities: GradingActivity[]
  enrollmentId: string
  blockId: string
  config?: GradeCalculationConfig
}) {
  const activities = input.activities
    .filter((activity) => activity.competencyBlockId === input.blockId)
  if (activities.length === 0) return 0
  const total = activities.reduce((sum, activity) => {
      const record = scoreForActivity(input.records, input.enrollmentId, activity.id)
      return sum + (record?.score ?? 0)
    }, 0)
  const config = input.config ?? defaultGradeCalculationConfig
  if (config.blockMethod === 'average') return total / activities.length
  if (config.blockMethod === 'weighted') {
    const max = sumActivityMaxScore(activities, input.blockId)
    return max > 0 ? (total / max) * config.expectedBlockTotal : 0
  }
  return total
}

export function blockStatus(total: number, config = defaultGradeCalculationConfig) {
  return total >= config.passingScore ? 'Aprobado' : 'En recuperación'
}

export function effectivePeriodScore(
  total: number,
  recovery: number | null | undefined,
  config = defaultGradeCalculationConfig,
) {
  if (recovery === null || recovery === undefined || config.recoveryRule === 'none') return total
  if (config.recoveryRule === 'replace-if-higher') return Math.max(total, recovery)
  if (config.recoveryRule === 'average') return (total + recovery) / 2
  return recovery
}

export function finalBlockAverage(scores: Array<number | null | undefined>, config = defaultGradeCalculationConfig) {
  const values = scores.filter((value): value is number => typeof value === 'number')
  if (values.length === 0) return null
  const average = values.reduce((total, value) => total + value, 0) / values.length
  return Number(average.toFixed(config.pcDecimals))
}

export function applyFinalRounding(value: number, config = defaultGradeCalculationConfig) {
  if (config.finalRounding === 'floor') return Math.floor(value)
  if (config.finalRounding === 'ceil') return Math.ceil(value)
  if (config.finalRounding === 'decimals') return Number(value.toFixed(config.pcDecimals))
  return Math.round(value)
}

export function finalSubjectScore(blockAverages: Array<number | null>, config = defaultGradeCalculationConfig) {
  const values = blockAverages.filter((value): value is number => value !== null)
  if (values.length === 0) return null
  return applyFinalRounding(values.reduce((total, value) => total + value, 0) / values.length, config)
}

export function formatGrade(value: number | null | undefined) {
  if (value === null || value === undefined) return '—'
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.?0+$/, '')
}

export function sortStudentsForGrades(students: StudentGradeRow[]) {
  return [...students].sort((first, second) => {
    const firstNumber = first.listNumber ?? Number.MAX_SAFE_INTEGER
    const secondNumber = second.listNumber ?? Number.MAX_SAFE_INTEGER
    if (firstNumber !== secondNumber) return firstNumber - secondNumber
    const lastName = first.lastName.localeCompare(second.lastName, 'es')
    if (lastName !== 0) return lastName
    return first.firstName.localeCompare(second.firstName, 'es')
  })
}

export function getRecoveryScores(records: GradeRecordRow[]) {
  const scores: RecoveryScores = {}
  records.forEach((record) => {
    const info = getRecoveryInfoFromRecordName(record.assessmentName)
    if (!info) return
    scores[info.blockId] ??= {}
    scores[info.blockId][record.enrollmentId] = record.score
  })
  return scores
}

export function validateScore(value: number, maxScore: number) {
  if (Number.isNaN(value)) return 'La calificación debe ser numérica.'
  if (value < 0) return 'No se permiten valores negativos.'
  if (value > maxScore) return `La calificación no puede superar ${maxScore}.`
  return null
}
