/**
 * Tipos de dominio del sistema de gestión educativa.
 */

/** Estado general de un registro en el sistema. */
export type RecordStatus = 'active' | 'inactive' | 'archived'

/** Estado de una matrícula estudiantil. */
export type EnrollmentStatus =
  | 'active'
  | 'transferred'
  | 'withdrawn'
  | 'completed'

/** Estado de asistencia en clase. */
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'

/** Estado de un registro de calificación. */
export type GradeRecordStatus = 'draft' | 'published' | 'voided'

/** Roles de usuario del sistema. */
export type UserRole =
  | 'admin'
  | 'director'
  | 'coordinator'
  | 'teacher'
  | 'student'
  | 'guardian'
  | 'viewer'

/** Entidad base con campos comunes a todos los registros del sistema. */
export type BaseEntity = {
  /** Identificador único. */
  id: string
  /** Identificador del centro educativo. */
  schoolId: string
  /** Estado del registro. */
  status: RecordStatus
  /** Fecha de creación. */
  createdAt: string
  /** Fecha de última actualización. */
  updatedAt: string
}

/** Centro educativo. */
export type School = BaseEntity & {
  /** Nombre del centro. */
  name: string
  /** Slug único del centro. */
  slug: string
  /** URL del logo. */
  logoUrl: string | null
}

/** Estudiante. */
export type Student = BaseEntity & {
  /** ID del usuario asociado. */
  userId?: string
  /** Código del estudiante. */
  studentCode: string
  /** Primer nombre. */
  firstName: string
  /** Apellido. */
  lastName: string
  /** Documento de identidad. */
  documentId?: string
  /** Fecha de nacimiento. */
  birthDate: string
  /** Género. */
  gender?: string
  /** Dirección. */
  address?: string
}

/** Docente. */
export type Teacher = BaseEntity & {
  /** ID del usuario asociado. */
  userId?: string
  /** Código del empleado. */
  employeeCode: string
  /** Primer nombre. */
  firstName: string
  /** Apellido. */
  lastName: string
  /** Documento de identidad. */
  documentId?: string
  /** Fecha de nacimiento. */
  birthDate?: string
  /** Género. */
  gender?: string
  /** Teléfono. */
  phone?: string
  /** Correo electrónico. */
  email?: string
  /** Fecha de contratación. */
  hireDate?: string
  /** Dirección. */
  address?: string
}

/** Asignatura o materia. */
export type Subject = BaseEntity & {
  /** Código de la asignatura. */
  code: string
  /** Nombre de la asignatura. */
  name: string
  /** Descripción opcional. */
  description?: string
  /** Créditos. */
  credits?: number
}

/** Grado o curso académico. */
export type Grade = BaseEntity & {
  /** Nombre del grado. */
  name: string
  /** Nivel académico. */
  level?: string
  /** Secuencia numérica. */
  sequence?: number
}

/** Sección de un grado. */
export type Section = BaseEntity & {
  /** ID del grado al que pertenece. */
  gradeId: string
  /** Nombre de la sección. */
  name: string
  /** Capacidad máxima de estudiantes. */
  capacity?: number
}

/** Año escolar. */
export type AcademicYear = BaseEntity & {
  /** Nombre del año escolar. */
  name: string
  /** Fecha de inicio. */
  startDate: string
  /** Fecha de fin. */
  endDate: string
  /** Indica si es el año actual. */
  isCurrent: boolean
}

/** Período académico dentro de un año escolar. */
export type AcademicPeriod = BaseEntity & {
  /** ID del año escolar. */
  academicYearId: string
  /** Nombre del período. */
  name: string
  /** Secuencia del período. */
  sequence: number
  /** Fecha de inicio. */
  startDate: string
  /** Fecha de fin. */
  endDate: string
}

/** Matrícula de un estudiante en un año escolar. */
export type Enrollment = {
  /** Identificador. */
  id: string
  /** ID del estudiante. */
  studentId: string
  /** ID del año escolar. */
  academicYearId: string
  /** ID del grado. */
  gradeId: string
  /** ID de la sección. */
  sectionId: string
  /** Fecha de matrícula. */
  enrollmentDate: string
  /** Estado de la matrícula. */
  status: EnrollmentStatus
  /** Fecha de creación. */
  createdAt: string
  /** Fecha de actualización. */
  updatedAt: string
}

/** Registro de asistencia. */
export type AttendanceRecord = {
  /** Identificador. */
  id: string
  /** ID de la matrícula. */
  enrollmentId: string
  /** ID del período académico. */
  academicPeriodId?: string
  /** ID de la asignatura-sección. */
  sectionSubjectId?: string
  /** Fecha de la asistencia. */
  attendanceDate: string
  /** Estado de asistencia. */
  status: AttendanceStatus
  /** Notas adicionales. */
  notes?: string
  /** ID de quien registró. */
  recordedBy?: string
  /** Fecha de creación. */
  createdAt: string
  /** Fecha de actualización. */
  updatedAt: string
}

/** Registro de calificación. */
export type GradeRecord = {
  /** Identificador. */
  id: string
  /** ID de la matrícula. */
  enrollmentId: string
  /** ID de la asignatura-sección. */
  sectionSubjectId: string
  /** ID del período académico. */
  academicPeriodId: string
  /** Nombre de la evaluación. */
  assessmentName: string
  /** Puntuación obtenida. */
  score: number
  /** Puntuación máxima. */
  maxScore: number
  /** Peso de la evaluación. */
  weight: number
  /** Puntuación de recuperación. */
  recoveryScore?: number
  /** Puntuación efectiva final. */
  effectiveScore?: number
  /** Estado del registro. */
  status: GradeRecordStatus
  /** ID de quien registró. */
  recordedBy?: string
  /** Fecha de creación. */
  createdAt: string
  /** Fecha de actualización. */
  updatedAt: string
}
