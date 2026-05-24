import { supabase } from '@/services/supabase'
import { DB_ERROR } from '@/constants'
import {
  assertNoSupabaseError,
  firstOrNull,
  getSupabaseErrorMessage,
} from '@/utils/helpers'
import type {
  CreateStudentInput,
  Student,
  StudentDetail,
  StudentFilters,
  StudentGuardianSummary,
  StudentListItem,
  UpdateStudentInput,
} from '@/modules/students/types'
import type { ParsedStudentRow } from '@/modules/students/services/importService'
import type {
  CreateEnrollmentInput,
  EnrollmentListItem,
  GradeWithSections,
} from '@/modules/students/types'
import type { Database } from '@/types/database.types'
import type { EnrollmentStatus, RecordStatus } from '@/types/domain'

type StudentUpdate = Database['public']['Tables']['students']['Update']

type StudentRow = {
  id: string
  user_id: string | null
  student_code: string
  first_name: string
  last_name: string
  document_id: string | null
  birth_date: string
  gender: string | null
  address: string | null
  status: RecordStatus
  created_at: string
  updated_at: string
  app_users?: { email: string | null; avatar_url: string | null } | { email: string | null; avatar_url: string | null }[] | null
}

type EnrollmentRow = {
  id: string
  student_id?: string
  enrollment_date: string
  status: EnrollmentStatus
  section_id: string
  grade_id: string
  school_years: { name: string } | { name: string }[] | null
  grades: { name: string } | { name: string }[] | null
  sections: { name: string } | { name: string }[] | null
}

type SectionRow = {
  id: string
  grade_id: string
  name: string
}

type AttendanceSummaryRow = {
  enrollment_id: string
  status: 'present' | 'absent' | 'late' | 'excused'
}

type GradeRecordSummaryRow = {
  enrollment_id: string
  score: number
  max_score: number
  weight: number
  status: 'draft' | 'published' | 'voided'
}

type StudentGuardianRow = {
  relationship: string
  is_primary: boolean
  can_pick_up: boolean
  guardians: {
    id: string
    full_name: string
    phone: string | null
    email: string | null
  } | {
    id: string
    full_name: string
    phone: string | null
    email: string | null
  }[] | null
}

type GuardianNotificationInsert = {
  student_id: string
  guardian_id: string | null
  channel: 'manual'
  subject: string
  message: string
  status: 'draft'
}

type GuardianNotificationTable = {
  insert: (
    values: GuardianNotificationInsert[],
  ) => PromiseLike<{ error: { message: string; code?: string } | null }>
}

const studentSelect = `
  id,
  user_id,
  app_users(email, avatar_url),
  student_code,
  first_name,
  last_name,
  document_id,
  birth_date,
  gender,
  address,
  status,
  created_at,
  updated_at
`

function getGuardianNotificationsTable() {
  return (supabase as unknown as {
    from(table: 'guardian_notifications'): GuardianNotificationTable
  }).from('guardian_notifications')
}

function normalizeOptionalText(value: string | undefined) {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

function mapStudent(row: StudentRow): Student {
  return {
    id: row.id,
    userId: row.user_id,
    studentCode: row.student_code,
    firstName: row.first_name,
    lastName: row.last_name,
    documentId: row.document_id,
    birthDate: row.birth_date,
    gender: row.gender,
    address: row.address,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapStudentListItem(
  row: StudentRow,
  enrollmentByStudentId: Map<string, EnrollmentRow>,
  sectionByKey: Map<string, SectionRow>,
  metricsByEnrollmentId: Map<string, StudentListItem['metrics']>,
): StudentListItem {
  const student = mapStudent(row)
  const enrollment = enrollmentByStudentId.get(student.id)
  const grade = firstOrNull(enrollment?.grades ?? null)
  const section = enrollment
    ? sectionByKey.get(`${enrollment.grade_id}:${enrollment.section_id}`)
    : undefined
  const appUser = firstOrNull(row.app_users ?? null)
  const metrics = enrollment
    ? metricsByEnrollmentId.get(enrollment.id) ?? {
        attendancePercentage: null,
        averageScore: null,
        pendingCount: 0,
      }
    : {
        attendancePercentage: null,
        averageScore: null,
        pendingCount: 0,
      }

  return {
    ...student,
    currentEnrollment: enrollment
      ? {
          id: enrollment.id,
          gradeName: grade?.name ?? null,
          sectionName: section?.name ?? null,
        }
      : null,
    metrics,
    displayEmail:
      appUser?.email ??
      `${student.studentCode.toLowerCase().replace(/[^a-z0-9._-]+/g, '.')}@aulabase.edu`,
    displayAvatarSeed: appUser?.avatar_url ?? `${student.firstName} ${student.lastName} ${student.studentCode}`,
    riskReason: getRiskReason(student.status, metrics),
  }
}

function getRiskReason(
  status: RecordStatus,
  metrics: StudentListItem['metrics'],
) {
  if (status !== 'active') return 'Expediente inactivo'
  if (
    metrics.attendancePercentage !== null &&
    metrics.attendancePercentage < 70
  ) {
    return `${metrics.attendancePercentage}% asistencia`
  }
  if (metrics.averageScore !== null && metrics.averageScore < 6.5) {
    return `${metrics.averageScore.toFixed(1)} promedio`
  }
  if (metrics.pendingCount > 0) {
    return `${metrics.pendingCount} pendiente${metrics.pendingCount === 1 ? '' : 's'}`
  }
  return null
}

function getStudentSupabaseErrorMessage(error: { message: string; code?: string }) {
  if (error.code === DB_ERROR.UNIQUE_VIOLATION) {
    return 'Ya existe un estudiante con ese código o documento.'
  }

  return getSupabaseErrorMessage(error)
}

function assertNoStudentSupabaseError(
  error: { message: string; code?: string } | null,
  fallbackMessage: string,
) {
  if (error) {
    throw new Error(getStudentSupabaseErrorMessage(error) || fallbackMessage)
  }
}

async function getMatchingAppUserIds(search: string) {
  const term = search.trim().replace(/[(),%]/g, ' ')

  if (!term) return []

  try {
    const { data, error } = await supabase
      .from('app_users')
      .select('id')
      .ilike('email', `%${term}%`)
      .limit(100)

    if (error) {
      console.warn('No se pudo buscar estudiantes por correo:', error.message)
      return []
    }

    return (data ?? []).map((user) => user.id)
  } catch (error) {
    console.warn('No se pudo buscar estudiantes por correo:', error)
    return []
  }
}

function buildSearchFilter(search: string, appUserIds: string[] = []) {
  const term = search.trim().replace(/[(),%]/g, ' ')

  if (!term) {
    return ''
  }

  const filters = [
    `first_name.ilike.%${term}%`,
    `last_name.ilike.%${term}%`,
    `student_code.ilike.%${term}%`,
  ]

  if (appUserIds.length > 0) {
    filters.push(`user_id.in.(${appUserIds.join(',')})`)
  }

  return filters.join(',')
}

async function getStudentsCount(
  search: string,
  filters: StudentFilters,
  appUserIds: string[],
): Promise<number> {
  let query = supabase
    .from('students')
    .select('*', { count: 'exact', head: true })

  if (filters.status !== 'all') {
    query = query.eq('status', filters.status)
  }

  const searchFilter = buildSearchFilter(search, appUserIds)

  if (searchFilter) {
    query = query.or(searchFilter)
  }

  const { count, error } = await query
  assertNoStudentSupabaseError(error, 'No se pudieron contar los estudiantes.')
  return count ?? 0
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
  const matchingAppUserIds = await getMatchingAppUserIds(search)
  const totalCount = await getStudentsCount(search, filters, matchingAppUserIds)

  let query = supabase
    .from('students')
    .select(studentSelect)
    .order('last_name', { ascending: true })
    .order('first_name', { ascending: true })
    .range((page - 1) * pageSize, page * pageSize - 1)

  if (filters.status !== 'all') {
    query = query.eq('status', filters.status)
  }

  const searchFilter = buildSearchFilter(search, matchingAppUserIds)

  if (searchFilter) {
    query = query.or(searchFilter)
  }

  const { data, error } = await query
  assertNoStudentSupabaseError(error, 'No se pudieron cargar los estudiantes.')

  if (totalCount === 0) {
    return { data: [], count: 0 }
  }

  const studentRows = (data ?? []) as StudentRow[]
  const studentIds = studentRows.map((student) => student.id)

  if (studentIds.length === 0) {
    return { data: [], count: totalCount }
  }

  const { data: enrollmentData, error: enrollmentError } = await supabase
    .from('enrollments')
    .select(
      `
        id,
        student_id,
        enrollment_date,
        status,
        section_id,
        grade_id,
        school_years(name),
        grades(name)
      `,
    )
    .in('student_id', studentIds)
    .eq('status', 'active')
    .order('enrollment_date', { ascending: false })

  assertNoSupabaseError(enrollmentError, 'No se pudieron cargar las matrículas.')

  const enrollmentByStudentId = new Map<string, EnrollmentRow>()

  for (const enrollment of (enrollmentData ?? []) as EnrollmentRow[]) {
    if (enrollment.student_id && !enrollmentByStudentId.has(enrollment.student_id)) {
      enrollmentByStudentId.set(enrollment.student_id, enrollment)
    }
  }

  const enrollments = Array.from(enrollmentByStudentId.values())
  const enrollmentIds = enrollments.map((enrollment) => enrollment.id)
  const sectionKeys = enrollments.map((enrollment) => ({
    id: enrollment.section_id,
    gradeId: enrollment.grade_id,
  }))
  const sectionIds = Array.from(new Set(sectionKeys.map((section) => section.id)))

  const { data: sectionData, error: sectionError } = sectionIds.length
    ? await supabase
        .from('sections')
        .select('id, grade_id, name')
        .in('id', sectionIds)
    : { data: [], error: null }

  assertNoSupabaseError(sectionError, 'No se pudieron cargar las secciones.')

  const sectionByKey = new Map(
    ((sectionData ?? []) as SectionRow[]).map((section) => [
      `${section.grade_id}:${section.id}`,
      section,
    ]),
  )

  const [attendanceResult, gradeRecordsResult] = enrollmentIds.length
    ? await Promise.all([
        supabase
          .from('attendance_daily')
          .select('enrollment_id, status')
          .in('enrollment_id', enrollmentIds),
        supabase
          .from('grades_records')
          .select('enrollment_id, score, max_score, weight, status')
          .in('enrollment_id', enrollmentIds),
      ])
    : [
        { data: [], error: null },
        { data: [], error: null },
      ]

  assertNoSupabaseError(attendanceResult.error, 'No se pudo cargar la asistencia.')
  assertNoSupabaseError(gradeRecordsResult.error, 'No se pudieron cargar las calificaciones.')

  const attendanceByEnrollmentId = new Map<
    string,
    { present: number; total: number }
  >()

  for (const row of (attendanceResult.data ?? []) as AttendanceSummaryRow[]) {
    const summary = attendanceByEnrollmentId.get(row.enrollment_id) ?? {
      present: 0,
      total: 0,
    }

    summary.total += 1
    if (row.status === 'present' || row.status === 'late') {
      summary.present += 1
    }

    attendanceByEnrollmentId.set(row.enrollment_id, summary)
  }

  const gradeRecordsByEnrollmentId = new Map<
    string,
    { weightedScore: number; totalWeight: number; pendingCount: number }
  >()

  for (const row of (gradeRecordsResult.data ?? []) as GradeRecordSummaryRow[]) {
    const summary = gradeRecordsByEnrollmentId.get(row.enrollment_id) ?? {
      weightedScore: 0,
      totalWeight: 0,
      pendingCount: 0,
    }

    if (row.status === 'draft') {
      summary.pendingCount += 1
    }

    if (row.status === 'published') {
      summary.weightedScore += (row.score / row.max_score) * 10 * row.weight
      summary.totalWeight += row.weight
    }

    gradeRecordsByEnrollmentId.set(row.enrollment_id, summary)
  }

  const metricsByEnrollmentId = new Map<string, StudentListItem['metrics']>()

  for (const enrollmentId of enrollmentIds) {
    const attendance = attendanceByEnrollmentId.get(enrollmentId)
    const grades = gradeRecordsByEnrollmentId.get(enrollmentId)

    metricsByEnrollmentId.set(enrollmentId, {
      attendancePercentage:
        attendance && attendance.total > 0
          ? Math.round((attendance.present / attendance.total) * 100)
          : null,
      averageScore:
        grades && grades.totalWeight > 0
          ? Math.round((grades.weightedScore / grades.totalWeight) * 10) / 10
          : null,
      pendingCount: grades?.pendingCount ?? 0,
    })
  }

  return {
    data: studentRows.map((student) =>
      mapStudentListItem(
        student,
        enrollmentByStudentId,
        sectionByKey,
        metricsByEnrollmentId,
      ),
    ),
    count: totalCount,
  }
}

export async function notifyGuardiansForAtRiskStudents(studentIds: string[]): Promise<{
  created: number
  skipped: number
}> {
  const uniqueStudentIds = Array.from(new Set(studentIds))

  if (uniqueStudentIds.length === 0) {
    throw new Error('Selecciona al menos un estudiante en riesgo.')
  }

  const { data, error } = await supabase
    .from('student_guardians')
    .select('student_id, guardian_id, guardians(full_name)')
    .in('student_id', uniqueStudentIds)
    .eq('status', 'active')

  assertNoSupabaseError(error, 'No se pudieron cargar los tutores.')

  type Row = {
    student_id: string
    guardian_id: string
    guardians: { full_name: string } | { full_name: string }[] | null
  }

  const notifications: GuardianNotificationInsert[] = []
  const studentsWithGuardian = new Set<string>()

  for (const row of (data ?? []) as Row[]) {
    studentsWithGuardian.add(row.student_id)
    notifications.push({
      student_id: row.student_id,
      guardian_id: row.guardian_id,
      channel: 'manual',
      subject: 'Seguimiento académico requerido',
      message:
        'Se requiere dar seguimiento al rendimiento o asistencia del estudiante. Favor contactar al centro educativo.',
      status: 'draft',
    })
  }

  if (notifications.length === 0) {
    throw new Error('No hay tutores activos vinculados a los estudiantes seleccionados.')
  }

  const { error: insertError } = await getGuardianNotificationsTable().insert(notifications)
  assertNoSupabaseError(insertError, 'No se pudieron registrar las notificaciones.')

  return {
    created: notifications.length,
    skipped: uniqueStudentIds.length - studentsWithGuardian.size,
  }
}

export async function getStudentById(
  id: string,
  options: { includeGuardians?: boolean } = {},
): Promise<StudentDetail | null> {
  const { data, error } = await supabase
    .from('students')
    .select(studentSelect)
    .eq('id', id)
    .maybeSingle()

  assertNoStudentSupabaseError(error, 'No se pudo cargar el estudiante.')

  if (!data) {
    return null
  }

  const student = mapStudent(data as StudentRow)
  const [enrollments, guardians] = await Promise.all([
    getCurrentEnrollment(student.id),
    options.includeGuardians ? getStudentGuardians(student.id) : Promise.resolve([]),
  ])

  return {
    ...student,
    currentEnrollment: enrollments,
    guardians,
  }
}

export async function createStudent(
  input: CreateStudentInput,
): Promise<Student> {
  const { data, error } = await supabase
    .from('students')
    .insert({
      student_code: input.studentCode.trim(),
      first_name: input.firstName.trim(),
      last_name: input.lastName.trim(),
      birth_date: input.birthDate,
      document_id: normalizeOptionalText(input.documentId),
      gender: normalizeOptionalText(input.gender),
      address: normalizeOptionalText(input.address),
      ...(input.status ? { status: input.status } : {}),
    })
    .select(studentSelect)
    .single()

  assertNoStudentSupabaseError(error, 'No se pudo crear el estudiante.')
  return mapStudent(data as StudentRow)
}

export async function updateStudent(
  id: string,
  input: UpdateStudentInput,
): Promise<Student> {
  const payload: StudentUpdate = {}
  if (input.studentCode !== undefined) payload.student_code = input.studentCode.trim()
  if (input.firstName !== undefined) payload.first_name = input.firstName.trim()
  if (input.lastName !== undefined) payload.last_name = input.lastName.trim()
  if (input.birthDate !== undefined) payload.birth_date = input.birthDate
  if (input.documentId !== undefined) payload.document_id = normalizeOptionalText(input.documentId)
  if (input.gender !== undefined) payload.gender = normalizeOptionalText(input.gender)
  if (input.address !== undefined) payload.address = normalizeOptionalText(input.address)
  if (input.status !== undefined) payload.status = input.status

  const { data, error } = await supabase
    .from('students')
    .update(payload)
    .eq('id', id)
    .select(studentSelect)
    .single()

  assertNoStudentSupabaseError(error, 'No se pudo actualizar el estudiante.')
  return mapStudent(data as StudentRow)
}

export async function deactivateStudent(id: string): Promise<Student> {
  return updateStudent(id, { status: 'inactive' })
}

export async function importStudents(rows: ParsedStudentRow[]): Promise<{
  imported: number
  errors: { row: number; reason: string }[]
}> {
  const codes = rows
    .map((row) => row.studentCode.trim())
    .filter(Boolean)

  const existingCodes = new Set<string>()

  if (codes.length > 0) {
    const { data: existing } = await supabase
      .from('students')
      .select('student_code')
      .in('student_code', codes)

    for (const student of existing ?? []) {
      existingCodes.add(student.student_code)
    }
  }

  const errors: { row: number; reason: string }[] = []
  const toInsert: (Database['public']['Tables']['students']['Insert'] & { _row: number })[] = []

  for (const row of rows) {
    const code = row.studentCode.trim()

    if (code && existingCodes.has(code)) {
      errors.push({ row: row.rowNumber, reason: `El código "${code}" ya existe` })
      continue
    }

    const student_code = code || `IMP-${Date.now().toString(36)}-${row.rowNumber}`
    const birth_date = row.birthDate.trim()

    if (!birth_date) {
      errors.push({ row: row.rowNumber, reason: 'Fecha de nacimiento requerida' })
      continue
    }

    toInsert.push({
      _row: row.rowNumber,
      student_code,
      first_name: row.firstName.trim(),
      last_name: row.lastName.trim(),
      birth_date,
      document_id: row.documentId.trim() || null,
      gender: row.gender.trim() || null,
      address: row.address.trim() || null,
    })
  }

  if (toInsert.length === 0) {
    return { imported: 0, errors }
  }

  const BATCH_SIZE = 50
  let imported = 0

  for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
    const batch = toInsert.slice(i, i + BATCH_SIZE)
    const insertPayload = batch.map(({ _row, ...rest }) => rest)
    const { error } = await supabase.from('students').insert(insertPayload)

    if (error) {
      const first = batch[0]._row
      const last = batch[batch.length - 1]._row
      errors.push({ row: first, reason: `Error en ${first === last ? `fila ${first}` : `filas ${first}-${last}`}: ${error.message}` })
    } else {
      imported += batch.length
    }
  }

  return { imported, errors }
}

async function getCurrentEnrollment(
  studentId: string,
): Promise<StudentDetail['currentEnrollment']> {
  const { data, error } = await supabase
    .from('enrollments')
    .select(
      `
        id,
        enrollment_date,
        status,
        section_id,
        grade_id,
        school_years(name),
        grades(name),
        sections!inner(name)
      `,
    )
    .eq('student_id', studentId)
    .eq('status', 'active')
    .order('enrollment_date', { ascending: false })
    .limit(1)
    .maybeSingle()

  assertNoSupabaseError(error, 'No se pudo cargar la matrícula actual.')

  if (!data) {
    return null
  }

  const row = data as EnrollmentRow
  const schoolYear = firstOrNull(row.school_years)
  const grade = firstOrNull(row.grades)
  const section = firstOrNull(row.sections)

  return {
    id: row.id,
    enrollmentDate: row.enrollment_date,
    status: row.status,
    schoolYearName: schoolYear?.name ?? null,
    gradeName: grade?.name ?? null,
    sectionName: section?.name ?? null,
  }
}

export async function createEnrollment(input: CreateEnrollmentInput): Promise<void> {
  const { data: gradeData, error: gradeError } = await supabase
    .from('grades')
    .select('academic_level_id, academic_cycle_id, default_modality_id')
    .eq('id', input.gradeId)
    .maybeSingle()

  assertNoSupabaseError(gradeError, 'No se pudo cargar la estructura académica del grado.')

  const { data: subsystemData, error: subsystemError } = await supabase
    .from('dr_subsystems')
    .select('id')
    .eq('code', 'regular')
    .maybeSingle()

  assertNoSupabaseError(subsystemError, 'No se pudo cargar el subsistema académico.')

  const { error } = await supabase.from('enrollments').insert({
    student_id: input.studentId,
    grade_id: input.gradeId,
    section_id: input.sectionId,
    school_year_id: input.schoolYearId,
    enrollment_date: input.enrollmentDate ?? new Date().toISOString().split('T')[0],
    status: input.status ?? 'active',
    academic_level_id: gradeData?.academic_level_id ?? null,
    academic_cycle_id: gradeData?.academic_cycle_id ?? null,
    modality_id: gradeData?.default_modality_id ?? null,
    subsystem_id: subsystemData?.id ?? null,
    academic_status: input.academicStatus ?? 'active',
    is_repeating: input.isRepeating ?? false,
    promotion_status: input.promotionStatus ?? null,
    final_condition: input.finalCondition ?? null,
    transfer_notes: input.transferNotes ?? null,
  })

  assertNoSupabaseError(error, 'No se pudo crear la matrícula.')
}

export async function deleteEnrollment(id: string): Promise<void> {
  const { error } = await supabase.from('enrollments').delete().eq('id', id)
  assertNoSupabaseError(error, 'No se pudo eliminar la matrícula.')
}

export async function getStudentEnrollments(
  studentId: string,
): Promise<EnrollmentListItem[]> {
  const { data, error } = await supabase
    .from('enrollments')
    .select(
      `
        id,
        enrollment_date,
        status,
        section_id,
        school_years(name),
        grades(name)
      `,
    )
    .eq('student_id', studentId)
    .order('enrollment_date', { ascending: false })

  assertNoSupabaseError(error, 'No se pudieron cargar las matrículas.')

  type Row = {
    id: string
    enrollment_date: string
    status: EnrollmentStatus
    section_id: string
    school_years: { name: string } | { name: string }[] | null
    grades: { name: string } | { name: string }[] | null
  }

  const enrollments = (data ?? []) as Row[]
  const sectionIds = enrollments.map((e) => e.section_id)

  const sectionMap = new Map<string, string>()

  if (sectionIds.length > 0) {
    const { data: sectionData } = await supabase
      .from('sections')
      .select('id, name')
      .in('id', sectionIds)

    for (const section of (sectionData ?? []) as { id: string; name: string }[]) {
      sectionMap.set(section.id, section.name)
    }
  }

  return enrollments.map((enrollment) => ({
    id: enrollment.id,
    schoolYearName: firstOrNull(enrollment.school_years)?.name ?? null,
    gradeName: firstOrNull(enrollment.grades)?.name ?? null,
    sectionName: sectionMap.get(enrollment.section_id) ?? null,
    enrollmentDate: enrollment.enrollment_date,
    status: enrollment.status,
  }))
}

export async function getGradesWithSections(): Promise<GradeWithSections[]> {
  const { data: grades, error: gradesError } = await supabase
    .from('grades')
    .select('id, name')
    .eq('status', 'active')
    .order('sequence', { ascending: true, nullsFirst: false })

  assertNoSupabaseError(gradesError, 'No se pudieron cargar los grados.')

  const gradeIds = (grades ?? []).map((g) => g.id)

  const { data: sections, error: sectionsError } = await supabase
    .from('sections')
    .select('id, name, grade_id')
    .eq('status', 'active')
    .in('grade_id', gradeIds)
    .order('name', { ascending: true })

  assertNoSupabaseError(sectionsError, 'No se pudieron cargar las secciones.')

  const sectionsByGradeId = new Map<string, { id: string; name: string }[]>()
  for (const section of (sections ?? []) as { id: string; name: string; grade_id: string }[]) {
    const list = sectionsByGradeId.get(section.grade_id) ?? []
    list.push({ id: section.id, name: section.name })
    sectionsByGradeId.set(section.grade_id, list)
  }

  return (grades ?? []).map((grade) => ({
    id: grade.id,
    name: grade.name,
    sections: sectionsByGradeId.get(grade.id) ?? [],
  }))
}

async function getStudentGuardians(
  studentId: string,
): Promise<StudentGuardianSummary[]> {
  const { data, error } = await supabase
    .from('student_guardians')
    .select(
      `
        relationship,
        is_primary,
        can_pick_up,
        guardians(id, full_name, phone, email)
      `,
    )
    .eq('student_id', studentId)
    .eq('status', 'active')
    .order('is_primary', { ascending: false })

  assertNoSupabaseError(error, 'No se pudieron cargar los tutores.')

  return ((data ?? []) as StudentGuardianRow[])
    .map((row) => {
      const guardian = firstOrNull(row.guardians)

      if (!guardian) {
        return null
      }

      return {
        id: guardian.id,
        fullName: guardian.full_name,
        phone: guardian.phone,
        email: guardian.email,
        relationship: row.relationship,
        isPrimary: row.is_primary,
        canPickUp: row.can_pick_up,
      }
    })
    .filter((guardian): guardian is StudentGuardianSummary => guardian !== null)
}
