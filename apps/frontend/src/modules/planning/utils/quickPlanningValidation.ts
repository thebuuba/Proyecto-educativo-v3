import { addWeekdays } from '@aula/shared'

import type { PlanningDay } from '@/modules/planning/types'

export type QuickPlanningValues = {
  planningType: 'DAILY' | 'UNIT' | 'SEQUENCE'
  durationDays: string
  days: PlanningDay[]
  courseKey: string
  sectionSubjectId: string
  academicPeriodId: string
  plannedDate: string
  periodStartDate?: string
  periodEndDate?: string
  topic: string
  duration: string
  inicio: string
  desarrollo: string
  cierre: string
  evidence: string
  fundamentalCompetencies: string[]
  specificCompetence: string
  achievementIndicator: string
  contentConceptual: string
  contentProcedural: string
  contentAttitudinal: string
}

const GENERATION_CONTEXT_MAX_LENGTH = 1_000

export function curriculumPromptExcerpt(value: string) {
  if (value.length <= GENERATION_CONTEXT_MAX_LENGTH) return value
  return `${value.slice(0, GENERATION_CONTEXT_MAX_LENGTH - 1).trimEnd()}…`
}

export function quickPlanningValidationError(targetStep: number, values: QuickPlanningValues) {
  if (targetStep >= 1 && !values.courseKey) return 'Selecciona el curso.'
  if (targetStep >= 1 && !values.sectionSubjectId) return 'Selecciona la asignatura.'
  if (targetStep >= 1 && !values.academicPeriodId) return 'Selecciona el período académico.'
  if (targetStep >= 1 && !values.plannedDate) return 'Selecciona la fecha de la planificación.'
  if (targetStep >= 1 && values.periodStartDate && values.periodEndDate
    && (values.plannedDate < values.periodStartDate || values.plannedDate > values.periodEndDate)) {
    return 'La fecha planificada debe estar dentro del período académico.'
  }
  if (targetStep >= 1 && !values.topic.trim()) return 'Escribe el tema que se trabajará.'
  if (targetStep >= 1 && (!values.duration || Number(values.duration) < 1)) return 'Indica la duración de la clase.'
  if (targetStep >= 1 && values.planningType !== 'DAILY'
    && (!values.durationDays || Number(values.durationDays) < 1 || Number(values.durationDays) > 30)) {
    return 'Indica una cantidad de días entre 1 y 30.'
  }
  if (targetStep >= 1 && values.planningType !== 'DAILY' && values.periodEndDate
    && addWeekdays(values.plannedDate, Number(values.durationDays) - 1) > values.periodEndDate) {
    return 'La planificación termina fuera del período académico.'
  }
  if (targetStep >= 2 && values.planningType === 'DAILY' && !values.inicio.trim()) return 'Describe brevemente cómo iniciarás la clase.'
  if (targetStep >= 2 && values.planningType === 'DAILY' && !values.desarrollo.trim()) return 'Describe la actividad principal de la clase.'
  if (targetStep >= 2 && values.planningType === 'DAILY' && !values.cierre.trim()) return 'Describe cómo cerrarás la clase.'
  if (targetStep >= 2 && !values.evidence.trim()) return 'Indica cómo demostrarán los estudiantes lo aprendido.'
  if (targetStep >= 2 && values.planningType !== 'DAILY') {
    if (values.days.length !== Number(values.durationDays)) return 'Completa todos los días de la planificación.'
    const incompleteDay = values.days.find((day) =>
      !day.inicio.trim() || !day.desarrollo.trim() || !day.cierre.trim()
      || !day.evidence.trim() || !day.evaluationMethod.trim()
    )
    if (incompleteDay) return `Completa las actividades y evaluación del día ${incompleteDay.day}.`
  }
  if (targetStep >= 3 && !values.fundamentalCompetencies.length) return 'Revisa las competencias fundamentales en los detalles curriculares.'
  if (targetStep >= 3 && !values.specificCompetence.trim()) return 'Revisa las competencias específicas en los detalles curriculares.'
  if (targetStep >= 3 && (!values.contentConceptual.trim() || !values.contentProcedural.trim() || !values.contentAttitudinal.trim())) {
    return 'Revisa los contenidos conceptuales, procedimentales y actitudinales en los detalles curriculares.'
  }
  if (targetStep >= 3 && !values.achievementIndicator.trim()) return 'Revisa los indicadores de logro en los detalles curriculares.'
  return ''
}
