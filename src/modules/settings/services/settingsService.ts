import { supabase } from '@/services/supabase'
import { assertNoSupabaseError } from '@/utils/helpers'
import type { Database } from '@/types/database.types'
import type {
  SchoolProfile,
  SchoolYearItem,
  UpdateSchoolInput,
  CreateSchoolYearInput,
  UpdateSchoolYearInput,
} from '@/modules/settings/types'

type SchoolRow = Database['public']['Tables']['schools']['Row']
type SchoolYearRow = Database['public']['Tables']['school_years']['Row']

function mapSector(value: string | null | undefined): SchoolProfile['sector'] {
  if (value === 'public' || value === 'semiofficial') return value
  return 'private'
}

function mapShift(value: string | null | undefined): SchoolProfile['schoolShift'] {
  if (
    value === 'morning'
    || value === 'afternoon'
    || value === 'night'
    || value === 'full_day'
  ) {
    return value
  }

  return 'extended'
}

function mapModality(value: string | null | undefined): SchoolProfile['primaryModality'] {
  if (
    value === 'academic'
    || value === 'technical_professional'
    || value === 'arts'
  ) {
    return value
  }

  return 'general'
}

function mapPeriodScheme(value: string | null | undefined): SchoolYearItem['periodScheme'] {
  if (value === 'semester' || value === 'quarter' || value === 'custom') return value
  return 'trimester'
}

function mapSchool(row: SchoolRow): SchoolProfile {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    logoUrl: row.logo_url,
    sector: mapSector(row.sector),
    regionalCode: row.regional_code,
    regionalName: row.regional_name,
    districtCode: row.district_code,
    districtName: row.district_name,
    centerCode: row.center_code,
    schoolShift: mapShift(row.school_shift),
    primaryModality: mapModality(row.primary_modality),
    enabledSubsystems: row.enabled_subsystems ?? ['regular'],
    officialExportsEnabled: row.official_exports_enabled ?? true,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapSchoolYear(row: SchoolYearRow): SchoolYearItem {
  return {
    id: row.id,
    name: row.name,
    startDate: row.start_date,
    endDate: row.end_date,
    periodScheme: mapPeriodScheme(row.period_scheme),
    periodCount: row.period_count ?? 3,
    calendarSource: row.calendar_source ?? 'school',
    instructionalDays: row.instructional_days,
    studentWeeks: row.student_weeks,
    teacherWeeks: row.teacher_weeks,
    isCurrent: row.is_current,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function getSchoolProfile(schoolId: string): Promise<SchoolProfile | null> {
  const { data, error } = await supabase
    .from('schools')
    .select('*')
    .eq('id', schoolId)
    .maybeSingle()

  assertNoSupabaseError(error, 'No se pudo cargar la información de la institución.')
  return data ? mapSchool(data as SchoolRow) : null
}

export async function updateSchoolProfile(
  schoolId: string,
  input: UpdateSchoolInput,
): Promise<SchoolProfile> {
  const payload: Database['public']['Tables']['schools']['Update'] = {}
  if (input.name !== undefined) payload.name = input.name.trim()
  if (input.slug !== undefined) payload.slug = input.slug.trim()
  if (input.logoUrl !== undefined) payload.logo_url = input.logoUrl
  if (input.sector !== undefined) payload.sector = input.sector
  if (input.regionalCode !== undefined) payload.regional_code = input.regionalCode?.trim() || null
  if (input.regionalName !== undefined) payload.regional_name = input.regionalName?.trim() || null
  if (input.districtCode !== undefined) payload.district_code = input.districtCode?.trim() || null
  if (input.districtName !== undefined) payload.district_name = input.districtName?.trim() || null
  if (input.centerCode !== undefined) payload.center_code = input.centerCode?.trim() || null
  if (input.schoolShift !== undefined) payload.school_shift = input.schoolShift
  if (input.primaryModality !== undefined) payload.primary_modality = input.primaryModality
  if (input.enabledSubsystems !== undefined) payload.enabled_subsystems = input.enabledSubsystems
  if (input.officialExportsEnabled !== undefined) payload.official_exports_enabled = input.officialExportsEnabled

  const { data, error } = await supabase
    .from('schools')
    .update(payload)
    .eq('id', schoolId)
    .select('*')
    .single()

  assertNoSupabaseError(error, 'No se pudo actualizar la institución.')
  return mapSchool(data as SchoolRow)
}

export async function getSchoolYears(): Promise<SchoolYearItem[]> {
  const { data, error } = await supabase
    .from('school_years')
    .select('*')
    .order('start_date', { ascending: false })

  assertNoSupabaseError(error, 'No se pudieron cargar los años escolares.')
  return ((data ?? []) as SchoolYearRow[]).map(mapSchoolYear)
}

export async function createSchoolYear(
  input: CreateSchoolYearInput,
): Promise<SchoolYearItem> {
  const { data, error } = await supabase
    .from('school_years')
    .insert({
      name: input.name.trim(),
      start_date: input.startDate,
      end_date: input.endDate,
      period_scheme: input.periodScheme ?? 'trimester',
      period_count: input.periodCount ?? 3,
      calendar_source: input.calendarSource ?? 'school',
      instructional_days: input.instructionalDays ?? null,
      student_weeks: input.studentWeeks ?? null,
      teacher_weeks: input.teacherWeeks ?? null,
      is_current: input.isCurrent ?? false,
    })
    .select('*')
    .single()

  assertNoSupabaseError(error, 'No se pudo crear el año escolar.')
  return mapSchoolYear(data as SchoolYearRow)
}

export async function updateSchoolYear(
  id: string,
  input: UpdateSchoolYearInput,
): Promise<SchoolYearItem> {
  const payload: Database['public']['Tables']['school_years']['Update'] = {}
  if (input.name !== undefined) payload.name = input.name.trim()
  if (input.startDate !== undefined) payload.start_date = input.startDate
  if (input.endDate !== undefined) payload.end_date = input.endDate
  if (input.periodScheme !== undefined) payload.period_scheme = input.periodScheme
  if (input.periodCount !== undefined) payload.period_count = input.periodCount
  if (input.calendarSource !== undefined) payload.calendar_source = input.calendarSource
  if (input.instructionalDays !== undefined) payload.instructional_days = input.instructionalDays
  if (input.studentWeeks !== undefined) payload.student_weeks = input.studentWeeks
  if (input.teacherWeeks !== undefined) payload.teacher_weeks = input.teacherWeeks
  if (input.isCurrent !== undefined) payload.is_current = input.isCurrent
  if (input.status !== undefined) payload.status = input.status

  const { data, error } = await supabase
    .from('school_years')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single()

  assertNoSupabaseError(error, 'No se pudo actualizar el año escolar.')
  return mapSchoolYear(data as SchoolYearRow)
}

export async function setCurrentSchoolYear(id: string): Promise<void> {
  const { error: resetError } = await supabase
    .from('school_years')
    .update({ is_current: false })
    .eq('is_current', true)

  assertNoSupabaseError(resetError, 'No se pudo actualizar el año escolar actual.')

  const { error: setError } = await supabase
    .from('school_years')
    .update({ is_current: true })
    .eq('id', id)

  assertNoSupabaseError(setError, 'No se pudo establecer el año escolar actual.')
}
