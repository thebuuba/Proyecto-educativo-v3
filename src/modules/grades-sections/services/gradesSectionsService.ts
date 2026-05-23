import { DB_ERROR } from '@/constants'
import { getCurrentSchoolYear } from '@/services/schoolYearService'
import { supabase } from '@/services/supabase'
import type {
  AcademicCycle,
  AcademicLevel,
  AssignSubjectInput,
  CourseCatalogs,
  CourseData,
  CreateGradeInput,
  CreateSectionInput,
  CreateSubjectInput,
  Grade,
  Modality,
  Section,
  SectionSubjectAssignment,
  Subject,
  TeacherOption,
  UpdateGradeInput,
  UpdateSectionInput,
} from '@/modules/grades-sections/types'
import type { Database } from '@/types/database.types'
import { getSupabaseErrorMessage } from '@/utils/helpers'

type GradeRow = Database['public']['Tables']['grades']['Row']
type SectionRow = Database['public']['Tables']['sections']['Row']
type LevelRow = Database['public']['Tables']['dr_academic_levels']['Row']
type CycleRow = Database['public']['Tables']['dr_academic_cycles']['Row']
type ModalityRow = Database['public']['Tables']['dr_modalities']['Row']
type SubjectRow = Database['public']['Tables']['subjects']['Row']
type TeacherRow = Database['public']['Tables']['teachers']['Row']
type SectionSubjectRow = Database['public']['Tables']['section_subjects']['Row']

function getError(error: { message: string; code?: string }) {
  if (error.code === DB_ERROR.UNIQUE_VIOLATION) {
    return 'Ya existe un registro con ese nombre o código.'
  }
  return getSupabaseErrorMessage(error)
}

function assertError(
  error: { message: string; code?: string } | null,
  fallback: string,
) {
  if (error) {
    throw new Error(getError(error) || fallback)
  }
}

function mapLevel(row: LevelRow): AcademicLevel {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    sequence: row.sequence,
  }
}

function mapCycle(row: CycleRow): AcademicCycle {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    levelId: row.level_id,
    sequence: row.sequence,
    gradeSequenceFrom: row.grade_sequence_from,
    gradeSequenceTo: row.grade_sequence_to,
  }
}

function mapModality(row: ModalityRow): Modality {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    appliesFromGradeSequence: row.applies_from_grade_sequence,
    appliesToGradeSequence: row.applies_to_grade_sequence,
  }
}

function mapSubject(row: SubjectRow): Subject {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    description: row.description,
    credits: row.credits,
  }
}

function mapTeacher(row: TeacherRow): TeacherOption {
  return {
    id: row.id,
    name: `${row.first_name} ${row.last_name}`.trim(),
    email: row.email,
  }
}

function mapGrade(
  row: GradeRow,
  catalogs: Pick<CourseCatalogs, 'levels' | 'cycles' | 'modalities'>,
): Grade {
  const level = catalogs.levels.find((item) => item.id === row.academic_level_id)
  const cycle = catalogs.cycles.find((item) => item.id === row.academic_cycle_id)
  const modality = catalogs.modalities.find((item) => item.id === row.default_modality_id)

  return {
    id: row.id,
    name: row.name,
    level: row.level,
    academicLevelId: row.academic_level_id,
    academicCycleId: row.academic_cycle_id,
    defaultModalityId: row.default_modality_id,
    academicLevelName: level?.name ?? row.level,
    academicCycleName: cycle?.name ?? null,
    defaultModalityName: modality?.name ?? null,
    sequence: row.sequence,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapSection(
  row: SectionRow,
  assignmentsBySection: Map<string, SectionSubjectAssignment[]>,
): Section {
  return {
    id: row.id,
    gradeId: row.grade_id,
    name: row.name,
    capacity: row.capacity,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    assignments: assignmentsBySection.get(row.id) ?? [],
  }
}

export async function getCourseData(): Promise<CourseData> {
  const [
    currentSchoolYear,
    gradeData,
    sectionData,
    levels,
    cycles,
    modalities,
    subjects,
    teachers,
  ] = await Promise.all([
    getCurrentSchoolYear(),
    getGrades(),
    getSections(),
    getAcademicLevels(),
    getAcademicCycles(),
    getModalities(),
    getSubjects(),
    getTeachers(),
  ])

  const catalogs: CourseCatalogs = {
    levels,
    cycles,
    modalities,
    subjects,
    teachers,
  }

  const assignments = currentSchoolYear
    ? await getSectionSubjectAssignments(currentSchoolYear.id, subjects, teachers)
    : []

  const assignmentsBySection = new Map<string, SectionSubjectAssignment[]>()
  for (const assignment of assignments) {
    const list = assignmentsBySection.get(assignment.sectionId) ?? []
    list.push(assignment)
    assignmentsBySection.set(assignment.sectionId, list)
  }

  const sectionsByGradeId = new Map<string, Section[]>()
  for (const section of sectionData) {
    const list = sectionsByGradeId.get(section.grade_id) ?? []
    list.push(mapSection(section, assignmentsBySection))
    sectionsByGradeId.set(section.grade_id, list)
  }

  const grades = gradeData.map((grade) => ({
    ...mapGrade(grade, catalogs),
    sections: sectionsByGradeId.get(grade.id) ?? [],
  }))

  return {
    grades,
    catalogs,
    currentSchoolYear,
  }
}

async function getGrades(): Promise<GradeRow[]> {
  const { data, error } = await supabase
    .from('grades')
    .select('*')
    .order('sequence', { ascending: true, nullsFirst: false })
    .order('name', { ascending: true })

  assertError(error, 'No se pudieron cargar los cursos.')
  return (data ?? []) as GradeRow[]
}

async function getSections(): Promise<SectionRow[]> {
  const { data, error } = await supabase
    .from('sections')
    .select('*')
    .order('name', { ascending: true })

  assertError(error, 'No se pudieron cargar las secciones.')
  return (data ?? []) as SectionRow[]
}

async function getAcademicLevels(): Promise<AcademicLevel[]> {
  const { data, error } = await supabase
    .from('dr_academic_levels')
    .select('*')
    .eq('status', 'active')
    .order('sequence', { ascending: true })

  assertError(error, 'No se pudieron cargar los niveles académicos.')
  return ((data ?? []) as LevelRow[]).map(mapLevel)
}

async function getAcademicCycles(): Promise<AcademicCycle[]> {
  const { data, error } = await supabase
    .from('dr_academic_cycles')
    .select('*')
    .eq('status', 'active')
    .order('sequence', { ascending: true })

  assertError(error, 'No se pudieron cargar los ciclos académicos.')
  return ((data ?? []) as CycleRow[]).map(mapCycle)
}

async function getModalities(): Promise<Modality[]> {
  const { data, error } = await supabase
    .from('dr_modalities')
    .select('*')
    .eq('status', 'active')
    .order('name', { ascending: true })

  assertError(error, 'No se pudieron cargar las modalidades.')
  return ((data ?? []) as ModalityRow[]).map(mapModality)
}

async function getSubjects(): Promise<Subject[]> {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('status', 'active')
    .order('name', { ascending: true })

  assertError(error, 'No se pudieron cargar las asignaturas.')
  return ((data ?? []) as SubjectRow[]).map(mapSubject)
}

async function getTeachers(): Promise<TeacherOption[]> {
  const { data, error } = await supabase
    .from('teachers')
    .select('*')
    .eq('status', 'active')
    .order('last_name', { ascending: true })
    .order('first_name', { ascending: true })

  assertError(error, 'No se pudieron cargar los docentes.')
  return ((data ?? []) as TeacherRow[]).map(mapTeacher)
}

async function getSectionSubjectAssignments(
  schoolYearId: string,
  subjects: Subject[],
  teachers: TeacherOption[],
): Promise<SectionSubjectAssignment[]> {
  const { data, error } = await supabase
    .from('section_subjects')
    .select('*')
    .eq('school_year_id', schoolYearId)
    .order('created_at', { ascending: true })

  assertError(error, 'No se pudieron cargar las asignaturas por curso.')

  const subjectById = new Map(subjects.map((subject) => [subject.id, subject]))
  const teacherById = new Map(teachers.map((teacher) => [teacher.id, teacher]))

  return ((data ?? []) as SectionSubjectRow[]).map((row) => {
    const subject = subjectById.get(row.subject_id)
    const teacher = row.teacher_id ? teacherById.get(row.teacher_id) : null

    return {
      id: row.id,
      sectionId: row.section_id,
      gradeId: row.grade_id,
      subjectId: row.subject_id,
      subjectCode: subject?.code ?? '',
      subjectName: subject?.name ?? 'Asignatura no disponible',
      teacherId: row.teacher_id,
      teacherName: teacher?.name ?? null,
      status: row.status,
    }
  })
}

export async function createGrade(input: CreateGradeInput): Promise<Grade> {
  const { data, error } = await supabase
    .from('grades')
    .insert({
      name: input.name.trim(),
      level: input.level?.trim() || null,
      sequence: input.sequence ?? null,
      academic_level_id: input.academicLevelId || null,
      academic_cycle_id: input.academicCycleId || null,
      default_modality_id: input.defaultModalityId || null,
    })
    .select('*')
    .single()

  assertError(error, 'No se pudo crear el curso.')
  return mapGrade(data as GradeRow, { levels: [], cycles: [], modalities: [] })
}

export async function updateGrade(
  id: string,
  input: UpdateGradeInput,
): Promise<Grade> {
  const payload: Database['public']['Tables']['grades']['Update'] = {}
  if (input.name !== undefined) payload.name = input.name.trim()
  if (input.level !== undefined) payload.level = input.level?.trim() || null
  if (input.sequence !== undefined) payload.sequence = input.sequence
  if (input.status !== undefined) payload.status = input.status
  if (input.academicLevelId !== undefined) {
    payload.academic_level_id = input.academicLevelId || null
  }
  if (input.academicCycleId !== undefined) {
    payload.academic_cycle_id = input.academicCycleId || null
  }
  if (input.defaultModalityId !== undefined) {
    payload.default_modality_id = input.defaultModalityId || null
  }

  const { data, error } = await supabase
    .from('grades')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single()

  assertError(error, 'No se pudo actualizar el curso.')
  return mapGrade(data as GradeRow, { levels: [], cycles: [], modalities: [] })
}

export async function deactivateGrade(id: string): Promise<void> {
  const { error } = await supabase
    .from('grades')
    .update({ status: 'inactive' })
    .eq('id', id)

  assertError(error, 'No se pudo inactivar el curso.')
}

export async function createSection(input: CreateSectionInput): Promise<Section> {
  const { data, error } = await supabase
    .from('sections')
    .insert({
      grade_id: input.gradeId,
      name: input.name.trim(),
      capacity: input.capacity ?? null,
    })
    .select('*')
    .single()

  assertError(error, 'No se pudo crear la sección.')
  return mapSection(data as SectionRow, new Map())
}

export async function updateSection(
  id: string,
  input: UpdateSectionInput,
): Promise<Section> {
  const payload: Database['public']['Tables']['sections']['Update'] = {}
  if (input.name !== undefined) payload.name = input.name.trim()
  if (input.capacity !== undefined) payload.capacity = input.capacity
  if (input.status !== undefined) payload.status = input.status

  const { data, error } = await supabase
    .from('sections')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single()

  assertError(error, 'No se pudo actualizar la sección.')
  return mapSection(data as SectionRow, new Map())
}

export async function deactivateSection(id: string): Promise<void> {
  const { error } = await supabase
    .from('sections')
    .update({ status: 'inactive' })
    .eq('id', id)

  assertError(error, 'No se pudo inactivar la sección.')
}

export async function createSubject(input: CreateSubjectInput): Promise<Subject> {
  const { data, error } = await supabase
    .from('subjects')
    .insert({
      code: input.code.trim().toUpperCase(),
      name: input.name.trim(),
      description: input.description?.trim() || null,
      credits: input.credits ?? null,
    })
    .select('*')
    .single()

  assertError(error, 'No se pudo crear la asignatura.')
  return mapSubject(data as SubjectRow)
}

export async function assignSubjectToSection(
  input: AssignSubjectInput,
): Promise<void> {
  const { data: existing, error: existingError } = await supabase
    .from('section_subjects')
    .select('id')
    .eq('school_year_id', input.schoolYearId)
    .eq('section_id', input.sectionId)
    .eq('subject_id', input.subjectId)
    .maybeSingle()

  assertError(existingError, 'No se pudo validar la asignatura.')

  if (existing?.id) {
    const { error } = await supabase
      .from('section_subjects')
      .update({
        teacher_id: input.teacherId || null,
        status: 'active',
      })
      .eq('id', existing.id)

    assertError(error, 'No se pudo reactivar la asignatura.')
    return
  }

  const { error } = await supabase
    .from('section_subjects')
    .insert({
      school_year_id: input.schoolYearId,
      grade_id: input.gradeId,
      section_id: input.sectionId,
      subject_id: input.subjectId,
      teacher_id: input.teacherId || null,
    })

  assertError(error, 'No se pudo asignar la asignatura.')
}

export async function deactivateSectionSubject(id: string): Promise<void> {
  const { error } = await supabase
    .from('section_subjects')
    .update({ status: 'inactive' })
    .eq('id', id)

  assertError(error, 'No se pudo inactivar la asignatura del curso.')
}
