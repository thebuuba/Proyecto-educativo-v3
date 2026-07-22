/**
 * @file Módulo de Planificación — Tipos y constantes
 *
 * Define las estructuras para la planificación curricular
 * por competencias.
 */

import type { RecordStatus } from '@/types/domain'

/** Momentos de la clase: inicio, desarrollo y cierre */
export type PlanningDay = {
  day: number
  date?: string | null
  inicio: string
  desarrollo: string
  cierre: string
  evidence: string
  evaluationMethod: string
}

export type PlanningActivities = {
  inicio: string
  desarrollo: string
  cierre: string
  days?: PlanningDay[]
}

export type PlanningType = 'DAILY' | 'UNIT' | 'SEQUENCE'

/** Entrada completa de planificación curricular */
export type PlanningEntry = {
  id: string
  sectionSubjectId: string
  academicPeriodId: string
  fundamentalCompetenceId: string | null
  fundamentalCompetenceName: string | null
  title: string
  planningType?: PlanningType
  durationDays?: number
  schoolNameSnapshot?: string | null
  teacherNameSnapshot?: string | null
  curricularArea?: string | null
  educationLevel?: string | null
  topic?: string | null
  transversalAxis?: string | null
  curriculumVersion?: string | null
  curriculumOrdinance?: string | null
  curriculumSourcePages?: string | null
  fundamentalCompetencies?: string[]
  sequence: number
  specificCompetence: string
  achievementIndicator: string
  contentConceptual: string
  contentProcedural: string
  contentAttitudinal: string
  strategies: string
  activities: PlanningActivities
  resources: string
  evaluationMethod: string
  evidence: string
  evaluationInstruments: string
  linkedActivityIds?: string[]
  durationMinutes: number | null
  plannedDate: string | null
  status: RecordStatus
  createdAt: string
  updatedAt: string
}

/** Datos para crear una nueva planificación */
export type CreatePlanningEntryInput = {
  sectionSubjectId: string
  academicPeriodId: string
  fundamentalCompetenceId?: string | null
  title: string
  planningType?: PlanningType
  durationDays?: number
  schoolNameSnapshot?: string | null
  teacherNameSnapshot?: string | null
  curricularArea?: string | null
  educationLevel?: string | null
  topic?: string | null
  transversalAxis?: string | null
  curriculumVersion?: string | null
  curriculumOrdinance?: string | null
  curriculumSourcePages?: string | null
  curricularPolicyContext?: string
  allowAlignmentOverride?: boolean
  fundamentalCompetencies?: string[]
  sequence?: number
  specificCompetence?: string
  achievementIndicator?: string
  contentConceptual?: string
  contentProcedural?: string
  contentAttitudinal?: string
  strategies?: string
  activities?: PlanningActivities
  resources?: string
  evaluationMethod?: string
  evidence?: string
  evaluationInstruments?: string
  durationMinutes?: number | null
  plannedDate?: string | null
  linkedActivityIds?: string[]
}

/** Borrador generado por IA para rellenar el formulario de planificación */
export type GeneratedPlanningEntry = Required<
  Pick<
    CreatePlanningEntryInput,
    | 'title'
    | 'strategies'
    | 'activities'
    | 'resources'
    | 'evaluationMethod'
    | 'evidence'
    | 'evaluationInstruments'
  >
> & {
  durationMinutes: number | null
  alignmentWarning: string | null
}

/** Datos para actualizar una planificación (todos los campos opcionales) */
export type UpdatePlanningEntryInput = Partial<CreatePlanningEntryInput>

/** Planificación con datos adicionales del curso, sección y período */
export type PlanningEntryWithDetails = PlanningEntry & {
  subjectName: string
  sectionName: string
  gradeName: string
  periodName: string
  schoolName?: string
  schoolCode?: string
  teacherName?: string
  schoolYearId?: string
  schoolYearName?: string
}

/** Filtros para consultar planificaciones */
export type PlanningFilters = {
  academicPeriodId?: string
  sectionSubjectId?: string
  query?: string
  date?: string
}

/** Resumen de un período académico para planificación */
export type AcademicPeriodSummary = {
  id: string
  name: string
  sequence: number
  startDate: string
  endDate: string
  status: RecordStatus
}

/** Opción de competencia fundamental para seleccionar en formularios */
export type CompetencyOption = {
  id: string
  code: string
  name: string
}
