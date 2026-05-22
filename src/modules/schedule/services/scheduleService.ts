import { supabase } from '@/services/supabase'
import { assertNoSupabaseError, firstOrNull } from '@/utils/helpers'
import type {
  CreateScheduleEntryInput,
  CreateTimeSlotInput,
  ScheduleCalendarEntry,
  ScheduleEntry,
  ScheduleFilters,
  ScheduleSummary,
  SectionOption,
  SubjectOption,
  TeacherOption,
  TimeSlot,
  UpdateScheduleEntryInput,
  UpdateTimeSlotInput,
} from '@/modules/schedule/types'

type TimeSlotRow = {
  id: string
  name: string
  start_time: string
  end_time: string
  sequence: number
  status: string
}

type ScheduleEntryRow = {
  id: string
  school_year_id: string
  academic_period_id: string | null
  section_subject_id: string
  section_id: string
  time_slot_id: string
  day_of_week: number
  room: string | null
  status: string
  time_slots: unknown
  section_subjects: unknown
}

type SchoolYearRow = {
  id: string
  name: string
}

type SectionRow = {
  id: string
  name: string
  grades: unknown
}

type TeacherRow = {
  id: string
  first_name: string
  last_name: string
}

type SubjectRow = {
  id: string
  name: string
  code: string
}

type EnrollmentCountRow = {
  section_id: string
}

const dayLabels = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE']

const toneByIndex: ScheduleCalendarEntry['tone'][] = [
  'accent',
  'primary',
  'success',
  'muted',
]

const SCHEDULE_ENTRY_SELECT = `
  id,
  school_year_id,
  academic_period_id,
  section_subject_id,
  section_id,
  time_slot_id,
  day_of_week,
  room,
  status,
  time_slots!inner(name, start_time, end_time),
  section_subjects!inner(
    subject_id,
    teacher_id,
    subjects!inner(name),
    grades(name),
    sections!inner(name),
    teachers(first_name, last_name)
  )
`

function mapTimeSlot(row: TimeSlotRow): TimeSlot {
  return {
    id: row.id,
    name: row.name,
    startTime: row.start_time,
    endTime: row.end_time,
    sequence: row.sequence,
    status: row.status,
  }
}

function getHoursBetween(startTime: string, endTime: string) {
  const [startHours, startMinutes] = startTime.split(':').map(Number)
  const [endHours, endMinutes] = endTime.split(':').map(Number)
  const start = startHours + startMinutes / 60
  const end = endHours + endMinutes / 60

  return Math.max(end - start, 0)
}

async function validateNoOverlap(
  startTime: string,
  endTime: string,
  excludeId?: string,
): Promise<void> {
  let query = supabase
    .from('time_slots')
    .select('id')
    .eq('status', 'active')
    .lt('start_time', endTime)
    .gt('end_time', startTime)

  if (excludeId) query = query.neq('id', excludeId)

  const { data, error } = await query
  assertNoSupabaseError(error, 'Error al validar solapamiento de horarios.')

  if (data && data.length > 0) {
    throw new Error(
      'El bloque horario se solapa con uno existente. Verifica los horarios.',
    )
  }
}

type JoinedSectionSubject = {
  subject_id: string
  teacher_id: string | null
  subjects: { name: string }
  grades: { name: string } | null
  sections: { name: string }
  teachers: { first_name: string; last_name: string } | null
}

function parseJoinedSectionSubject(raw: unknown): JoinedSectionSubject {
  const value = firstOrNull(raw) as Record<string, unknown>
  return {
    subject_id: value.subject_id as string,
    teacher_id: (value.teacher_id as string) ?? null,
    subjects: firstOrNull(value.subjects) as { name: string },
    grades: firstOrNull(value.grades) as { name: string } | null,
    sections: firstOrNull(value.sections) as { name: string },
    teachers: firstOrNull(value.teachers) as {
      first_name: string
      last_name: string
    } | null,
  }
}

function mapScheduleEntry(row: ScheduleEntryRow): ScheduleEntry {
  const timeSlot = firstOrNull(row.time_slots) as {
    name: string
    start_time: string
    end_time: string
  }
  const sectionSubject = parseJoinedSectionSubject(row.section_subjects)

  return {
    id: row.id,
    schoolYearId: row.school_year_id,
    academicPeriodId: row.academic_period_id,
    sectionSubjectId: row.section_subject_id,
    sectionId: row.section_id,
    timeSlotId: row.time_slot_id,
    dayOfWeek: row.day_of_week,
    room: row.room,
    status: row.status,
    subjectName: sectionSubject.subjects.name,
    teacherName: sectionSubject.teachers
      ? `${sectionSubject.teachers.first_name} ${sectionSubject.teachers.last_name}`
      : 'Sin docente',
    sectionName: sectionSubject.sections.name,
    gradeName: sectionSubject.grades?.name ?? '—',
    timeSlotName: timeSlot.name,
    startTime: timeSlot.start_time,
    endTime: timeSlot.end_time,
  }
}

function mapCalendarEntry(
  row: ScheduleEntryRow,
  index: number,
  studentCountBySectionId: Map<string, number>,
): ScheduleCalendarEntry {
  const timeSlot = firstOrNull(row.time_slots) as {
    name: string
    start_time: string
    end_time: string
  }
  const sectionSubject = parseJoinedSectionSubject(row.section_subjects)

  return {
    id: row.id,
    dayOfWeek: row.day_of_week,
    room: row.room,
    subjectName: sectionSubject.subjects.name,
    gradeName: sectionSubject.grades?.name ?? null,
    sectionName: sectionSubject.sections.name,
    startTime: timeSlot.start_time,
    endTime: timeSlot.end_time,
    studentCount: studentCountBySectionId.get(row.section_id) ?? 0,
    tone: toneByIndex[index % toneByIndex.length],
  }
}

function buildScheduleQuery() {
  return supabase.from('schedule_entries').select(SCHEDULE_ENTRY_SELECT)
}

export async function getTimeSlots(): Promise<TimeSlot[]> {
  const { data, error } = await supabase
    .from('time_slots')
    .select('id, name, start_time, end_time, sequence, status')
    .eq('status', 'active')
    .order('sequence', { ascending: true })

  assertNoSupabaseError(error, 'No se pudieron cargar los bloques horarios.')

  return ((data ?? []) as TimeSlotRow[]).map(mapTimeSlot)
}

export async function createTimeSlot(input: CreateTimeSlotInput): Promise<TimeSlot> {
  await validateNoOverlap(input.startTime, input.endTime)
  const { data, error } = await supabase
    .from('time_slots')
    .insert({
      name: input.name.trim(),
      start_time: input.startTime,
      end_time: input.endTime,
      sequence: input.sequence,
    })
    .select('id, name, start_time, end_time, sequence, status')
    .single()

  assertNoSupabaseError(error, 'No se pudo crear el bloque horario.')
  return mapTimeSlot(data as TimeSlotRow)
}

export async function updateTimeSlot(
  id: string,
  input: UpdateTimeSlotInput,
): Promise<TimeSlot> {
  if (input.startTime !== undefined && input.endTime !== undefined) {
    await validateNoOverlap(input.startTime, input.endTime, id)
  }
  const { data, error } = await supabase
    .from('time_slots')
    .update({
      ...(input.name !== undefined ? { name: input.name.trim() } : {}),
      ...(input.startTime !== undefined ? { start_time: input.startTime } : {}),
      ...(input.endTime !== undefined ? { end_time: input.endTime } : {}),
      ...(input.sequence !== undefined ? { sequence: input.sequence } : {}),
    })
    .eq('id', id)
    .select('id, name, start_time, end_time, sequence, status')
    .single()

  assertNoSupabaseError(error, 'No se pudo actualizar el bloque horario.')
  return mapTimeSlot(data as TimeSlotRow)
}

export async function deleteTimeSlot(id: string): Promise<void> {
  const { error } = await supabase
    .from('time_slots')
    .update({ status: 'archived' })
    .eq('id', id)

  assertNoSupabaseError(error, 'No se pudo eliminar el bloque horario.')
}

export async function getCurrentSchoolYear(): Promise<SchoolYearRow | null> {
  const { data, error } = await supabase
    .from('school_years')
    .select('id, name')
    .eq('is_current', true)
    .maybeSingle()

  assertNoSupabaseError(error, 'No se pudo cargar el año escolar actual.')
  return data as SchoolYearRow | null
}

export async function getScheduleEntries(
  filters: ScheduleFilters = {},
): Promise<ScheduleEntry[]> {
  let query = buildScheduleQuery().eq('status', 'active')

  if (filters.schoolYearId) query = query.eq('school_year_id', filters.schoolYearId)
  if (filters.academicPeriodId) {
    query = query.eq('academic_period_id', filters.academicPeriodId)
  }
  if (filters.sectionId) query = query.eq('section_id', filters.sectionId)
  if (filters.teacherId) {
    query = query.eq('section_subjects.teacher_id', filters.teacherId)
  }
  if (filters.gradeId) {
    query = query.eq('section_subjects.grade_id', filters.gradeId)
  }

  const { data, error } = await query.order('day_of_week', { ascending: true })

  assertNoSupabaseError(error, 'No se pudieron cargar las entradas de horario.')

  return ((data ?? []) as ScheduleEntryRow[]).map(mapScheduleEntry)
}

export async function createScheduleEntry(
  input: CreateScheduleEntryInput,
): Promise<ScheduleEntry> {
  const { data, error } = await supabase
    .from('schedule_entries')
    .insert({
      school_year_id: input.schoolYearId,
      academic_period_id: input.academicPeriodId ?? null,
      section_subject_id: input.sectionSubjectId,
      section_id: input.sectionId,
      time_slot_id: input.timeSlotId,
      day_of_week: input.dayOfWeek,
      room: input.room ?? null,
    })
    .select(SCHEDULE_ENTRY_SELECT)
    .single()

  assertNoSupabaseError(error, 'No se pudo crear la clase.')

  return mapScheduleEntry(data as ScheduleEntryRow)
}

export async function updateScheduleEntry(
  id: string,
  input: UpdateScheduleEntryInput,
): Promise<ScheduleEntry> {
  const { data, error } = await supabase
    .from('schedule_entries')
    .update({
      ...(input.schoolYearId !== undefined ? { school_year_id: input.schoolYearId } : {}),
      ...(input.academicPeriodId !== undefined
        ? { academic_period_id: input.academicPeriodId }
        : {}),
      ...(input.sectionSubjectId !== undefined
        ? { section_subject_id: input.sectionSubjectId }
        : {}),
      ...(input.sectionId !== undefined ? { section_id: input.sectionId } : {}),
      ...(input.timeSlotId !== undefined ? { time_slot_id: input.timeSlotId } : {}),
      ...(input.dayOfWeek !== undefined ? { day_of_week: input.dayOfWeek } : {}),
      ...(input.room !== undefined ? { room: input.room } : {}),
    })
    .eq('id', id)
    .select(SCHEDULE_ENTRY_SELECT)
    .single()

  assertNoSupabaseError(error, 'No se pudo actualizar la clase.')

  return mapScheduleEntry(data as ScheduleEntryRow)
}

export async function deleteScheduleEntry(id: string): Promise<void> {
  const { error } = await supabase
    .from('schedule_entries')
    .update({ status: 'archived' })
    .eq('id', id)

  assertNoSupabaseError(error, 'No se pudo eliminar la clase.')
}

export async function getSections(): Promise<SectionOption[]> {
  const { data, error } = await supabase
    .from('sections')
    .select('id, name, grades(name)')
    .eq('status', 'active')
    .order('name', { ascending: true })

  assertNoSupabaseError(error, 'No se pudieron cargar las secciones.')

  return ((data ?? []) as SectionRow[]).map((section) => {
    const grade = firstOrNull(section.grades) as { name: string } | null

    return {
      id: section.id,
      name: section.name,
      gradeName: grade?.name ?? 'Sin grado',
    }
  })
}

export async function getTeachers(): Promise<TeacherOption[]> {
  const { data, error } = await supabase
    .from('teachers')
    .select('id, first_name, last_name')
    .eq('status', 'active')
    .order('last_name', { ascending: true })

  assertNoSupabaseError(error, 'No se pudieron cargar los docentes.')

  return ((data ?? []) as TeacherRow[]).map((teacher) => ({
    id: teacher.id,
    firstName: teacher.first_name,
    lastName: teacher.last_name,
  }))
}

export async function getSubjects(): Promise<SubjectOption[]> {
  const { data, error } = await supabase
    .from('subjects')
    .select('id, name, code')
    .eq('status', 'active')
    .order('name', { ascending: true })

  assertNoSupabaseError(error, 'No se pudieron cargar las asignaturas.')

  return ((data ?? []) as SubjectRow[]).map((subject) => ({
    id: subject.id,
    name: subject.name,
    code: subject.code,
  }))
}

export async function getSectionSubjects(
  sectionId: string,
): Promise<
  Array<{
    id: string
    subjectName: string
    teacherName: string
  }>
> {
  const { data, error } = await supabase
    .from('section_subjects')
    .select(
      `id, subjects!inner(name), teachers(first_name, last_name)`,
    )
    .eq('section_id', sectionId)
    .eq('status', 'active')

  assertNoSupabaseError(error, 'No se pudieron cargar las materias de la sección.')

  return ((data ?? []) as Record<string, unknown>[]).map((row) => {
    const subject = firstOrNull(row.subjects) as { name: string } | null
    const teacher = firstOrNull(row.teachers) as
      | { first_name: string; last_name: string }
      | null

    return {
      id: row.id as string,
      subjectName: subject?.name ?? '—',
      teacherName: teacher
        ? `${teacher.first_name} ${teacher.last_name}`
        : 'Sin docente',
    }
  })
}

export async function getScheduleSummary(): Promise<ScheduleSummary> {
  const currentYear = await getCurrentSchoolYear()
  const yearId = currentYear?.id

  let query = buildScheduleQuery()
    .eq('status', 'active')
    // Solo se consideran LUN-VIE (day_of_week 1-5).
    // Entradas en sábado (6) o domingo (7) se excluyen del resumen.
    .gte('day_of_week', 1)
    .lte('day_of_week', 5)

  if (yearId) {
    query = query.eq('school_year_id', yearId)
  }

  const { data, error } = await query.order('day_of_week', { ascending: true })

  assertNoSupabaseError(error, 'No se pudo cargar el horario.')

  const rows = (data ?? []) as ScheduleEntryRow[]
  const sectionIds = Array.from(new Set(rows.map((row) => row.section_id)))

  const { data: enrollmentData, error: enrollmentError } =
    sectionIds.length && yearId
      ? await supabase
          .from('enrollments')
          .select('section_id')
          .in('section_id', sectionIds)
          .eq('school_year_id', yearId)
          .eq('status', 'active')
      : { data: [], error: null }

  assertNoSupabaseError(enrollmentError, 'No se pudo cargar la carga de estudiantes.')

  const studentCountBySectionId = new Map<string, number>()

  for (const enrollment of (enrollmentData ?? []) as EnrollmentCountRow[]) {
    studentCountBySectionId.set(
      enrollment.section_id,
      (studentCountBySectionId.get(enrollment.section_id) ?? 0) + 1,
    )
  }

  const entries = rows.map((row, index) =>
    mapCalendarEntry(row, index, studentCountBySectionId),
  )
  const sectionCount = new Set(
    entries.map((entry) => `${entry.gradeName ?? ''}:${entry.sectionName ?? ''}`),
  ).size
  const weeklyLoad = dayLabels.map((dayLabel, index) => {
    const dayOfWeek = index + 1
    const hours = entries
      .filter((entry) => entry.dayOfWeek === dayOfWeek)
      .reduce(
        (total, entry) => total + getHoursBetween(entry.startTime, entry.endTime),
        0,
      )

    return { dayLabel, dayOfWeek, hours }
  })
  const totalHours = weeklyLoad.reduce((total, day) => total + day.hours, 0)

  return {
    entries,
    totalClasses: entries.length,
    totalHours,
    sectionCount,
    weeklyLoad,
  }
}
