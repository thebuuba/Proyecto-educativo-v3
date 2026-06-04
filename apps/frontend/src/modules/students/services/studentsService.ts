import { api } from '@/services/apiClient'
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

export async function getStudentById(
  id: string,
): Promise<StudentDetail | null> {
  const student = await api.get<RawStudentDetail | null>(`/students/${id}`)
  return student ? normalizeStudentDetail(student) : null
}

export async function createStudent(input: CreateStudentInput): Promise<Student> {
  return api.post<Student>('/students', input)
}

export async function updateStudent(id: string, input: UpdateStudentInput): Promise<Student> {
  return api.patch<Student>(`/students/${id}`, input)
}

export async function deactivateStudent(id: string): Promise<Student> {
  return api.patch<Student>(`/students/${id}`, { status: 'inactive' })
}

export async function importStudents(rows: { firstName: string; lastName: string; studentCode: string; documentId: string; birthDate: string; gender: string; address: string }[]): Promise<{
  imported: number
  errors: { row: number; reason: string }[]
}> {
  return api.post('/students/import', { students: rows })
}

export async function getStudentEnrollments(studentId: string): Promise<EnrollmentListItem[]> {
  const enrollments = await api.get<EnrollmentListItem[]>(`/students/${studentId}/enrollments`)
  return Array.isArray(enrollments) ? enrollments.map(normalizeEnrollmentListItem) : []
}

export async function createEnrollment(input: CreateEnrollmentInput): Promise<void> {
  await api.post('/students/enrollments', input)
}

export async function deleteEnrollment(id: string): Promise<void> {
  await api.delete(`/students/enrollments/${id}`)
}

export async function getGradesWithSections(): Promise<GradeWithSections[]> {
  return api.get<GradeWithSections[]>('/students/grades-with-sections')
}

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

function normalizeStatus(status: Student['status'] | string): Student['status'] {
  return String(status).toLowerCase() as Student['status']
}

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

function normalizeStudentDetail(student: RawStudentDetail): StudentDetail {
  return {
    ...student,
    status: normalizeStatus(student.status),
    currentEnrollment: student.currentEnrollment ?? null,
    guardians: Array.isArray(student.guardians) ? student.guardians : [],
  }
}

function normalizeEnrollmentListItem(enrollment: EnrollmentListItem): EnrollmentListItem {
  return {
    ...enrollment,
    status: normalizeStatus(enrollment.status) as EnrollmentListItem['status'],
  }
}
