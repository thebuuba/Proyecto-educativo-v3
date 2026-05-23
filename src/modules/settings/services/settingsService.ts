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

function mapSchool(row: SchoolRow): SchoolProfile {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    logoUrl: row.logo_url,
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
