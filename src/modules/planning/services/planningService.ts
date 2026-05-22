import { supabase } from '@/services/supabase'
import { assertNoSupabaseError, firstOrNull, getSupabaseErrorMessage } from '@/utils/helpers'
import type { Database } from '@/types/database.types'
import type { RecordStatus } from '@/types/domain'
import type {
  AcademicPeriodSummary,
  CreatePlanningEntryInput,
  PlanningEntryWithDetails,
  PlanningFilters,
} from '@/modules/planning/types'

type EntryRow = {
  id: string
  section_subject_id: string
  academic_period_id: string
  title: string
  sequence: number
  specific_competence: string
  achievement_indicator: string
  content_conceptual: string
  content_procedural: string
  content_attitudinal: string
  strategies: string
  activities: {
    inicio: string
    desarrollo: string
    cierre: string
  }
  resources: string
  evaluation_method: string
  duration_minutes: number | null
  planned_date: string | null
  status: RecordStatus
  created_at: string
  updated_at: string
  section_subjects: {
    subjects: { name: string } | { name: string }[] | null
    sections: {
      name: string
      grades: { name: string } | { name: string }[] | null
    } | { name: string; grades: { name: string } | { name: string }[] | null }[] | null
  } | { subjects: { name: string } | { name: string }[] | null; sections: { name: string; grades: { name: string } | { name: string }[] | null } | { name: string; grades: { name: string } | { name: string }[] | null }[] | null }[] | null
  academic_periods: { name: string } | { name: string }[] | null
}

const entrySelect = `
  id,
  section_subject_id,
  academic_period_id,
  title,
  sequence,
  specific_competence,
  achievement_indicator,
  content_conceptual,
  content_procedural,
  content_attitudinal,
  strategies,
  activities,
  resources,
  evaluation_method,
  duration_minutes,
  planned_date,
  status,
  created_at,
  updated_at,
  section_subjects(
    subjects(name),
    sections!inner(
      name,
      grades(name)
    )
  ),
  academic_periods(name)
`

function mapEntry(row: EntryRow): PlanningEntryWithDetails {
  const sectionSubject = firstOrNull(row.section_subjects)
  const subject = sectionSubject ? firstOrNull(sectionSubject.subjects) : null
  const section = sectionSubject ? firstOrNull(sectionSubject.sections) : null
  const grade = section ? firstOrNull(section.grades) : null
  const period = firstOrNull(row.academic_periods)

  return {
    id: row.id,
    sectionSubjectId: row.section_subject_id,
    academicPeriodId: row.academic_period_id,
    title: row.title,
    sequence: row.sequence,
    specificCompetence: row.specific_competence,
    achievementIndicator: row.achievement_indicator,
    contentConceptual: row.content_conceptual,
    contentProcedural: row.content_procedural,
    contentAttitudinal: row.content_attitudinal,
    strategies: row.strategies,
    activities: row.activities,
    resources: row.resources,
    evaluationMethod: row.evaluation_method,
    durationMinutes: row.duration_minutes,
    plannedDate: row.planned_date,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    subjectName: subject?.name ?? '—',
    sectionName: section?.name ?? '—',
    gradeName: grade?.name ?? '—',
    periodName: period?.name ?? '—',
  }
}

function getEntryError(error: { message: string; code?: string }) {
  if (error.code === '23505') {
    return 'Ya existe una planificación con ese título para este período.'
  }
  return getSupabaseErrorMessage(error)
}

function assertEntryError(
  error: { message: string; code?: string } | null,
  fallback: string,
) {
  if (error) {
    throw new Error(getEntryError(error) || fallback)
  }
}

export async function getAcademicPeriods(
  schoolYearId: string,
): Promise<AcademicPeriodSummary[]> {
  const { data, error } = await supabase
    .from('academic_periods')
    .select('id, name, sequence, start_date, end_date, status')
    .eq('school_year_id', schoolYearId)
    .eq('status', 'active')
    .order('sequence', { ascending: true })

  assertNoSupabaseError(error, 'No se pudieron cargar los períodos académicos.')

  return ((data ?? []) as Database['public']['Tables']['academic_periods']['Row'][]).map(
    (row) => ({
      id: row.id,
      name: row.name,
      sequence: row.sequence,
      startDate: row.start_date,
      endDate: row.end_date,
      status: row.status,
    }),
  )
}

export async function createAcademicPeriod(input: {
  schoolYearId: string
  name: string
  sequence: number
  startDate: string
  endDate: string
}): Promise<void> {
  const { error } = await supabase.from('academic_periods').insert({
    school_year_id: input.schoolYearId,
    name: input.name,
    sequence: input.sequence,
    start_date: input.startDate,
    end_date: input.endDate,
  })

  assertNoSupabaseError(error, 'No se pudo crear el período académico.')
}

export async function updateAcademicPeriod(
  id: string,
  input: {
    name?: string
    sequence?: number
    startDate?: string
    endDate?: string
    status?: RecordStatus
  },
): Promise<void> {
  const payload: Record<string, string | number | RecordStatus> = {}
  if (input.name !== undefined) payload.name = input.name
  if (input.sequence !== undefined) payload.sequence = input.sequence
  if (input.startDate !== undefined) payload.start_date = input.startDate
  if (input.endDate !== undefined) payload.end_date = input.endDate
  if (input.status !== undefined) payload.status = input.status

  const { error } = await supabase.from('academic_periods').update(payload).eq('id', id)
  assertNoSupabaseError(error, 'No se pudo actualizar el período académico.')
}

export async function deleteAcademicPeriod(id: string): Promise<void> {
  const { error } = await supabase.from('academic_periods').delete().eq('id', id)
  assertNoSupabaseError(error, 'No se pudo eliminar el período académico.')
}

export async function getPlanningEntries(
  filters: PlanningFilters,
): Promise<PlanningEntryWithDetails[]> {
  let query = supabase.from('planning_entries').select(entrySelect)

  if (filters.academicPeriodId) {
    query = query.eq('academic_period_id', filters.academicPeriodId)
  }

  if (filters.sectionSubjectId) {
    query = query.eq('section_subject_id', filters.sectionSubjectId)
  }

  query = query.order('sequence', { ascending: true }).order('planned_date', { ascending: true })

  const { data, error } = await query
  assertEntryError(error, 'No se pudieron cargar las planificaciones.')

  return ((data ?? []) as EntryRow[]).map(mapEntry)
}

export async function createPlanningEntry(
  input: CreatePlanningEntryInput,
): Promise<void> {
  if (!input.title.trim()) {
    throw new Error('El título de la planificación es requerido.')
  }

  const { error } = await supabase.from('planning_entries').insert({
    section_subject_id: input.sectionSubjectId,
    academic_period_id: input.academicPeriodId,
    title: input.title.trim(),
    sequence: input.sequence ?? 1,
    specific_competence: input.specificCompetence ?? '',
    achievement_indicator: input.achievementIndicator ?? '',
    content_conceptual: input.contentConceptual ?? '',
    content_procedural: input.contentProcedural ?? '',
    content_attitudinal: input.contentAttitudinal ?? '',
    strategies: input.strategies ?? '',
    activities: input.activities ?? { inicio: '', desarrollo: '', cierre: '' },
    resources: input.resources ?? '',
    evaluation_method: input.evaluationMethod ?? '',
    duration_minutes: input.durationMinutes ?? null,
    planned_date: input.plannedDate ?? null,
  })

  assertEntryError(error, 'No se pudo crear la planificación.')
}

export async function updatePlanningEntry(
  id: string,
  input: CreatePlanningEntryInput,
): Promise<void> {
  const payload: Record<string, unknown> = {}
  if (input.title !== undefined) payload.title = input.title.trim()
  if (input.sequence !== undefined) payload.sequence = input.sequence
  if (input.specificCompetence !== undefined) payload.specific_competence = input.specificCompetence
  if (input.achievementIndicator !== undefined) payload.achievement_indicator = input.achievementIndicator
  if (input.contentConceptual !== undefined) payload.content_conceptual = input.contentConceptual
  if (input.contentProcedural !== undefined) payload.content_procedural = input.contentProcedural
  if (input.contentAttitudinal !== undefined) payload.content_attitudinal = input.contentAttitudinal
  if (input.strategies !== undefined) payload.strategies = input.strategies
  if (input.activities !== undefined) payload.activities = input.activities
  if (input.resources !== undefined) payload.resources = input.resources
  if (input.evaluationMethod !== undefined) payload.evaluation_method = input.evaluationMethod
  if (input.durationMinutes !== undefined) payload.duration_minutes = input.durationMinutes
  if (input.plannedDate !== undefined) payload.planned_date = input.plannedDate

  const { error } = await supabase.from('planning_entries').update(payload).eq('id', id)
  assertEntryError(error, 'No se pudo actualizar la planificación.')
}

export async function deletePlanningEntry(id: string): Promise<void> {
  const { error } = await supabase.from('planning_entries').delete().eq('id', id)
  assertEntryError(error, 'No se pudo eliminar la planificación.')
}

export async function getTeacherSectionSubjects(): Promise<
  { id: string; subjectName: string; sectionName: string; gradeName: string }[]
> {
  const { data, error } = await supabase
    .from('section_subjects')
    .select(
      `
        id,
        subjects(name),
        sections!inner(
          name,
          grades(name)
        )
      `,
    )
    .eq('status', 'active')

  assertNoSupabaseError(error, 'No se pudieron cargar las secciones.')

  return ((data ?? []) as {
    id: string
    subjects: { name: string } | { name: string }[] | null
    sections: {
      name: string
      grades: { name: string } | { name: string }[] | null
    } | { name: string; grades: { name: string } | { name: string }[] | null }[] | null
  }[]).map((row) => {
    const subject = firstOrNull(row.subjects)
    const section = firstOrNull(row.sections)
    const grade = section ? firstOrNull(section.grades) : null
    return {
      id: row.id,
      subjectName: subject?.name ?? '—',
      sectionName: section?.name ?? '—',
      gradeName: grade?.name ?? '—',
    }
  })
}
