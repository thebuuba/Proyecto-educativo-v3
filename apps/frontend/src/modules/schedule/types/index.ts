/**
 * @file Módulo de Horario — Tipos y constantes
 *
 * Define las estructuras para la gestión de bloques horarios,
 * entradas de horario y resumen semanal del docente.
 */

/** Bloque horario disponible para asignar clases */
export type TimeSlot = {
  id: string
  name: string
  startTime: string
  endTime: string
  sequence: number
  status: string
}

/** Datos para crear un nuevo bloque horario */
export type CreateTimeSlotInput = {
  name: string
  startTime: string
  endTime: string
  sequence: number
}

/** Datos para actualizar un bloque horario (todos los campos opcionales) */
export type UpdateTimeSlotInput = Partial<CreateTimeSlotInput>

/** Entrada de horario que asigna una materia a un bloque y día */
export type ScheduleEntry = {
  id: string
  schoolYearId: string
  academicPeriodId: string | null
  sectionSubjectId: string
  sectionId: string
  timeSlotId: string
  dayOfWeek: number
  room: string | null
  status: string
  subjectName: string
  teacherName: string
  gradeName: string
  academicLevelName: string
  sectionName: string
  timeSlotName: string
  startTime: string
  endTime: string
}

/** Entrada del horario adaptada para visualización en calendario */
export type ScheduleCalendarEntry = {
  id: string
  dayOfWeek: number
  room: string | null
  subjectName: string
  gradeName: string | null
  sectionName: string | null
  startTime: string
  endTime: string
  studentCount: number
  tone: 'accent' | 'primary' | 'success' | 'muted'
}

/** Resumen del horario con clases, horas y carga semanal */
export type ScheduleSummary = {
  entries: ScheduleCalendarEntry[]
  totalClasses: number
  totalHours: number
  sectionCount: number
  weeklyLoad: Array<{
    dayLabel: string
    dayOfWeek: number
    hours: number
  }>
}

/** Datos para crear una nueva entrada en el horario */
export type CreateScheduleEntryInput = {
  schoolYearId: string
  academicPeriodId?: string | null
  sectionSubjectId: string
  sectionId: string
  timeSlotId: string
  dayOfWeek: number
  room?: string | null
}

/** Datos para actualizar una entrada de horario (todos los campos opcionales) */
export type UpdateScheduleEntryInput = Partial<CreateScheduleEntryInput>

/** Filtros para consultar entradas del horario */
export type ScheduleFilters = {
  schoolYearId?: string
  academicPeriodId?: string
  sectionId?: string
  sectionSubjectId?: string
  teacherId?: string
  gradeId?: string
}

/** Entrada del horario organizada por bloque horario para la cuadrícula */
export type ScheduleGridEntry = {
  timeSlotId: string
  timeSlotName: string
  startTime: string
  endTime: string
  entries: (ScheduleEntry | null)[] // one per day (1-7), null = free period
}

/** Opción de sección para seleccionar en formularios de horario */
export type SectionOption = {
  id: string
  name: string
  gradeName: string
  academicLevelName: string
}

/** Opción de docente para seleccionar en formularios */
export type TeacherOption = {
  id: string
  firstName: string
  lastName: string
}

/** Opción de asignatura para seleccionar en formularios */
export type SubjectOption = {
  id: string
  name: string
  code: string
}
