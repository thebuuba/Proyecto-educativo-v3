/**
 * Servicio de Estudiantes — Funciones CRUD para estudiantes, matrículas,
 * importación, notificaciones y consulta de grados con secciones.
 */

import { api, API_CACHE_TAGS, API_CACHE_TTL } from '@/services/apiClient'
import type {
  Student,
  StudentDetail,
  StudentListItem,
  StudentFilters,
  CreateStudentInput,
  UpdateStudentInput,
  GradeWithSections,
  EnrollmentListItem,
  CreateEnrollmentInput,
  EnrollmentCourse,
  CourseStudent,
  CreateCourseStudentInput,
  ImportCourseStudentRow,
  CourseImportPreview,
} from '@/modules/students/types'

type PaginatedResponse<T> = {
  data: T[]
  count?: number
  total?: number
}

type RawStudentListItem = Student & Partial<StudentListItem>
type RawStudentDetail = Student & Partial<StudentDetail>

type GuardianNotificationResult = {
  notified: number
  message: string
  subject: string
}

/** Obtiene una lista paginada de estudiantes con filtros y búsqueda. */
export async function getStudents({
  search = '',
  filters = { status: 'active' },
  page = 1,
  pageSize = 50,
}: {
  search?: string
  filters?: StudentFilters
  page?: number
  pageSize?: number
} = {}): Promise<{ data: StudentListItem[]; count: number }> {
  const params = new URLSearchParams()
  if (search) params.set('search', search)
  if (filters.status && filters.status !== 'all') params.set('status', filters.status)
  params.set('page', String(page))
  params.set('pageSize', String(pageSize))

  const response = await api.get<PaginatedResponse<RawStudentListItem>>(`/students?${params}`)

  return {
    data: response.data.map(normalizeStudentListItem),
    count: response.count ?? response.total ?? response.data.length,
  }
}

/** Obtiene el detalle completo de un estudiante por su ID. */
export async function getStudentById(
  id: string,
): Promise<StudentDetail | null> {
  const student = await api.get<RawStudentDetail | null>(`/students/${id}`)
  return student ? normalizeStudentDetail(student) : null
}

/** Crea un nuevo estudiante. */
export async function createStudent(input: CreateStudentInput): Promise<Student> {
  return api.post<Student>('/students', input)
}

/** Actualiza los datos de un estudiante existente. */
export async function updateStudent(id: string, input: UpdateStudentInput): Promise<Student> {
  return api.patch<Student>(`/students/${id}`, input)
}

/** Desactiva un estudiante (cambia su estado a 'inactive'). */
export async function deactivateStudent(id: string): Promise<Student> {
  return api.patch<Student>(`/students/${id}/deactivate`, {})
}

/** Importa una lista de estudiantes desde un archivo. */
export async function importStudents(rows: { firstName: string; lastName: string; studentCode: string; documentId: string; birthDate: string; gender: string; address: string }[]): Promise<{
  imported: number
  errors: { row: number; reason: string }[]
}> {
  return api.post('/students/import', { students: rows })
}

/** Obtiene la lista de matrículas de un estudiante. */
export async function getStudentEnrollments(studentId: string): Promise<EnrollmentListItem[]> {
  const enrollments = await api.get<EnrollmentListItem[]>(`/students/${studentId}/enrollments`)
  return Array.isArray(enrollments) ? enrollments.map(normalizeEnrollmentListItem) : []
}

/** Crea una nueva matrícula para un estudiante. */
export async function createEnrollment(input: CreateEnrollmentInput): Promise<void> {
  await api.post('/students/enrollments', input, {
    invalidateCacheTags: [API_CACHE_TAGS.enrollmentOptions],
  })
}

/** Elimina una matrícula por su ID. */
export async function deleteEnrollment(id: string): Promise<void> {
  await api.delete(`/students/enrollments/${id}`, {
    invalidateCacheTags: [API_CACHE_TAGS.enrollmentOptions],
  })
}

/** Obtiene la lista de grados con sus secciones disponibles. */
export async function getGradesWithSections(): Promise<GradeWithSections[]> {
  return api.get<GradeWithSections[]>('/students/grades-with-sections', {
    cacheTtlMs: API_CACHE_TTL.options,
    cacheTags: [API_CACHE_TAGS.courseOptions],
  })
}

export async function getEnrollmentCourses(): Promise<EnrollmentCourse[]> {
  return api.get<EnrollmentCourse[]>('/students/enrollment-courses', {
    cacheTtlMs: API_CACHE_TTL.sessionList,
    cacheTags: [
      API_CACHE_TAGS.courseOptions,
      API_CACHE_TAGS.enrollmentOptions,
      API_CACHE_TAGS.schoolYears,
    ],
  })
}

export async function getStudentsByCourse(courseId: string): Promise<CourseStudent[]> {
  return api.get<CourseStudent[]>(`/students/courses/${courseId}/students`)
}

export async function createStudentInCourse(
  courseId: string,
  input: CreateCourseStudentInput,
): Promise<CourseStudent> {
  return api.post<CourseStudent>(`/students/courses/${courseId}/students`, input, {
    invalidateCacheTags: [API_CACHE_TAGS.enrollmentOptions],
  })
}

export async function previewCourseStudentImport(
  courseId: string,
  students: ImportCourseStudentRow[],
): Promise<CourseImportPreview> {
  return api.post<CourseImportPreview>(`/students/courses/${courseId}/import-preview`, { students })
}

export async function importStudentsInCourse(
  courseId: string,
  students: ImportCourseStudentRow[],
): Promise<{ imported: number; errors: { row: number; reason: string }[] }> {
  return api.post(`/students/courses/${courseId}/import`, { students }, {
    invalidateCacheTags: [API_CACHE_TAGS.enrollmentOptions],
  })
}

export async function withdrawStudentFromCourse(
  courseId: string,
  studentId: string,
): Promise<void> {
  await api.patch(`/students/courses/${courseId}/students/${studentId}/withdraw`, {}, {
    invalidateCacheTags: [API_CACHE_TAGS.enrollmentOptions],
  })
}

export async function transferStudentToCourse(
  courseId: string,
  studentId: string,
  targetCourseId: string,
): Promise<void> {
  await api.patch(`/students/courses/${courseId}/students/${studentId}/transfer`, {
    targetCourseId,
  }, {
    invalidateCacheTags: [API_CACHE_TAGS.enrollmentOptions],
  })
}

/** Notifica a los tutores de estudiantes en riesgo de bajo rendimiento. */
export async function notifyGuardiansForAtRiskStudents(studentIds: string[]): Promise<{
  notified: number
  message: string
  subject: string
}[]> {
  const results = await Promise.allSettled(
    studentIds.map((id) =>
      api.post(`/students/${id}/notify-guardians`, {
        message: 'Notificación de bajo rendimiento académico',
        subject: 'Alerta académica',
      }),
    ),
  )
  return results
    .filter((r) => r.status === 'fulfilled')
    .map((r) => (r as PromiseFulfilledResult<GuardianNotificationResult>).value)
}

/** Normaliza el valor del estado a minúsculas. */
function normalizeStatus(status: Student['status'] | string): Student['status'] {
  return String(status).toLowerCase() as Student['status']
}

/** Normaliza los datos de un estudiante para listados con valores por defecto. */
function normalizeStudentListItem(student: RawStudentListItem): StudentListItem {
  return {
    ...student,
    status: normalizeStatus(student.status),
    currentEnrollment: student.currentEnrollment ?? null,
    metrics: {
      attendancePercentage: student.metrics?.attendancePercentage ?? null,
      averageScore: student.metrics?.averageScore ?? null,
      pendingCount: student.metrics?.pendingCount ?? 0,
    },
    displayEmail: student.displayEmail ?? '',
    displayAvatarSeed: student.displayAvatarSeed ?? student.id,
    riskReason: student.riskReason ?? null,
  }
}

/** Normaliza los datos de detalle de un estudiante. */
function normalizeStudentDetail(student: RawStudentDetail): StudentDetail {
  return {
    ...student,
    status: normalizeStatus(student.status),
    currentEnrollment: student.currentEnrollment ?? null,
    guardians: Array.isArray(student.guardians) ? student.guardians : [],
  }
}

/** Normaliza los datos de un elemento de lista de matrículas. */
function normalizeEnrollmentListItem(enrollment: EnrollmentListItem): EnrollmentListItem {
  return {
    ...enrollment,
    status: normalizeStatus(enrollment.status) as EnrollmentListItem['status'],
  }
}
