/**
 * @file Módulo de Cursos — Tipos y constantes
 *
 * Define las estructuras para la gestión de grados, secciones,
 * asignaturas y asignación docente.
 */

import type { RecordStatus } from '@/types/domain'

/** Grado o curso académico */
export type Grade = {
  id: string
  name: string
  level: string | null
  academicLevelId: string | null
  academicCycleId: string | null
  defaultModalityId: string | null
  academicLevelName: string | null
  academicCycleName: string | null
  defaultModalityName: string | null
  sequence: number | null
  status: RecordStatus
  createdAt: string
  updatedAt: string
}

/** Sección o grupo dentro de un grado */
export type Section = {
  id: string
  gradeId: string
  name: string
  capacity: number | null
  studentCount: number
  teamCount: number
  status: RecordStatus
  createdAt: string
  updatedAt: string
  assignments: SectionSubjectAssignment[]
}

/** Grado con sus secciones incluidas */
export type GradeWithSections = Grade & {
  sections: Section[]
}

/** Nivel académico (MINERD) */
export type AcademicLevel = {
  id: string
  code: string
  name: string
  sequence: number
}

/** Ciclo académico dentro de un nivel */
export type AcademicCycle = {
  id: string
  code: string
  name: string
  levelId: string
  sequence: number
  gradeSequenceFrom: number | null
  gradeSequenceTo: number | null
}

/** Modalidad educativa (general, técnica, artes) */
export type Modality = {
  id: string
  code: string
  name: string
  appliesFromGradeSequence: number | null
  appliesToGradeSequence: number | null
}

/** Asignatura o materia del catálogo */
export type Subject = {
  id: string
  code: string
  name: string
  description: string | null
  credits: number | null
}

/** Opción de docente para seleccionar en formularios */
export type TeacherOption = {
  id: string
  name: string
  email: string | null
}

/** Asignación de una asignatura a una sección con su docente */
export type SectionSubjectAssignment = {
  id: string
  sectionId: string
  gradeId: string
  subjectId: string
  subjectCode: string
  subjectName: string
  teacherId: string | null
  teacherName: string | null
  appearanceColor: string | null
  appearanceIcon: string | null
  teamCount: number
  activityCount: number
  lastAttendanceDate: string | null
  averageScore: number | null
  lastPlanningDate: string | null
  lastPlanningTitle: string | null
  relatedDataCount: number
  canDelete: boolean
  status: RecordStatus
}

export type CourseTeamMemberInput = {
  enrollmentId: string
  role?: string
}

export type CourseTeamInput = {
  name: string
  color?: string
  icon?: string
  description?: string
  teamType: 'permanent' | 'temporary'
  startsAt?: string | null
  endsAt?: string | null
  members: CourseTeamMemberInput[]
}

export type CourseTeamMember = {
  id: string
  enrollmentId: string
  role: string | null
  enrollment: {
    id: string
    student: {
      id: string
      studentCode: string
      firstName: string
      lastName: string
    }
  }
}

export type CourseTeam = {
  id: string
  sectionId: string
  sectionSubjectId: string | null
  schoolYearId: string
  name: string
  color: string
  icon: string
  description: string
  teamType: 'permanent' | 'temporary'
  startsAt: string | null
  endsAt: string | null
  orderPosition: number
  members: CourseTeamMember[]
}

/** Catálogos completos del sistema: niveles, ciclos, modalidades, asignaturas, docentes */
export type CourseCatalogs = {
  levels: AcademicLevel[]
  cycles: AcademicCycle[]
  modalities: Modality[]
  subjects: Subject[]
  teachers: TeacherOption[]
}

/** Datos completos de cursos: grados, catálogos y año escolar activo */
export type CourseData = {
  grades: GradeWithSections[]
  catalogs: CourseCatalogs
  currentSchoolYear: { id: string; name: string } | null
}

export type CreateGradeInput = {
  name: string
  level?: string
  academicLevelId?: string | null
  academicCycleId?: string | null
  defaultModalityId?: string | null
  sequence?: number | null
}

export type UpdateGradeInput = Partial<CreateGradeInput> & {
  status?: RecordStatus
}

export type CreateSectionInput = {
  gradeId: string
  name: string
  capacity?: number | null
}

export type UpdateSectionInput = Partial<Omit<CreateSectionInput, 'gradeId'>> & {
  status?: RecordStatus
}

export type CreateSubjectInput = {
  code: string
  name: string
  description?: string | null
  credits?: number | null
}

export type AssignSubjectInput = {
  schoolYearId: string
  gradeId: string
  sectionId: string
  subjectId: string
  teacherId?: string | null
}

export type TeacherAssignmentInput = {
  academicLevelId: string | null
  academicLevelName: string
  academicCycleId: string | null
  academicCycleName: string
  gradeName: string
  gradeSequence: number
  sectionName: string
  subjectId?: string
  subjectCode: string
  subjectName: string
}
