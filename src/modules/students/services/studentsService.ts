import { supabase } from '@/services/supabase'
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
}

type EnrollmentRow = {
  id: string
  enrollment_date: string
  status: EnrollmentStatus
  section_id: string
  grade_id: string
  school_years: { name: string } | { name: string }[] | null
  grades: { name: string } | { name: string }[] | null
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

const studentSelect = `
  id,
  user_id,
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

function getStudentSupabaseErrorMessage(error: { message: string; code?: string }) {
  if (error.code === '23505') {
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

function buildSearchFilter(search: string) {
  const term = search.trim().replace(/[(),%]/g, ' ')

  if (!term) {
    return ''
  }

  return [
    `first_name.ilike.%${term}%`,
    `last_name.ilike.%${term}%`,
    `student_code.ilike.%${term}%`,
  ].join(',')
}

export async function getStudents({
  search = '',
  filters = { status: 'active' },
}: {
  search?: string
  filters?: StudentFilters
} = {}): Promise<StudentListItem[]> {
  let query = supabase
    .from('students')
    .select(studentSelect)
    .order('last_name', { ascending: true })
    .order('first_name', { ascending: true })

  if (filters.status !== 'all') {
    query = query.eq('status', filters.status)
  }

  const searchFilter = buildSearchFilter(search)

  if (searchFilter) {
    query = query.or(searchFilter)
  }

  const { data, error } = await query
  assertNoStudentSupabaseError(error, 'No se pudieron cargar los estudiantes.')

  return ((data ?? []) as StudentRow[]).map(mapStudent)
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
        grades(name)
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

  const { data: sectionRow } = await supabase
    .from('sections')
    .select('name')
    .eq('id', row.section_id)
    .eq('grade_id', row.grade_id)
    .maybeSingle()

  return {
    id: row.id,
    enrollmentDate: row.enrollment_date,
    status: row.status,
    schoolYearName: schoolYear?.name ?? null,
    gradeName: grade?.name ?? null,
    sectionName: sectionRow?.name ?? null,
  }
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
