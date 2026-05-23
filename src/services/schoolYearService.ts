import { supabase } from '@/services/supabase'
import { assertNoSupabaseError } from '@/utils/helpers'

export type SchoolYearSummary = {
  id: string
  name: string
}

export async function getCurrentSchoolYear(): Promise<SchoolYearSummary | null> {
  const { data, error } = await supabase
    .from('school_years')
    .select('id, name')
    .eq('is_current', true)
    .maybeSingle()

  assertNoSupabaseError(error, 'No se pudo cargar el año escolar actual.')
  return data
}
