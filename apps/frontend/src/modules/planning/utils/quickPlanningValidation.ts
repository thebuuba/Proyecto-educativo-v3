export type QuickPlanningValues = {
  courseKey: string
  sectionSubjectId: string
  academicPeriodId: string
  plannedDate: string
  topic: string
  duration: string
  inicio: string
  desarrollo: string
  cierre: string
  evidence: string
  fundamentalCompetencies: string[]
  specificCompetence: string
  achievementIndicator: string
}

export function quickPlanningValidationError(targetStep: number, values: QuickPlanningValues) {
  if (targetStep >= 1 && !values.courseKey) return 'Selecciona el curso.'
  if (targetStep >= 1 && !values.sectionSubjectId) return 'Selecciona la asignatura.'
  if (targetStep >= 1 && !values.academicPeriodId) return 'Selecciona el período académico.'
  if (targetStep >= 1 && !values.plannedDate) return 'Selecciona la fecha de la planificación.'
  if (targetStep >= 1 && !values.topic.trim()) return 'Escribe el tema que se trabajará.'
  if (targetStep >= 1 && (!values.duration || Number(values.duration) < 1)) return 'Indica la duración de la clase.'
  if (targetStep >= 2 && !values.inicio.trim()) return 'Describe brevemente cómo iniciarás la clase.'
  if (targetStep >= 2 && !values.desarrollo.trim()) return 'Describe la actividad principal de la clase.'
  if (targetStep >= 2 && !values.cierre.trim()) return 'Describe cómo cerrarás la clase.'
  if (targetStep >= 2 && !values.evidence.trim()) return 'Indica cómo demostrarán los estudiantes lo aprendido.'
  if (targetStep >= 3 && !values.fundamentalCompetencies.length) return 'Revisa las competencias fundamentales en los detalles curriculares.'
  if (targetStep >= 3 && !values.specificCompetence.trim()) return 'Revisa las competencias específicas en los detalles curriculares.'
  if (targetStep >= 3 && !values.achievementIndicator.trim()) return 'Revisa los indicadores de logro en los detalles curriculares.'
  return ''
}
