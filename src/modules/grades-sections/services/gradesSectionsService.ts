import { supabase } from '@/services/supabase'
import { DB_ERROR } from '@/constants'
import { getSupabaseErrorMessage } from '@/utils/helpers'
import type { Database } from '@/types/database.types'
import type {
  Grade,
  GradeWithSections,
  Section,
  CreateGradeInput,
  UpdateGradeInput,
  CreateSectionInput,
  UpdateSectionInput,
} from '@/modules/grades-sections/types'

type GradeRow = Database['public']['Tables']['grades']['Row']
type SectionRow = Database['public']['Tables']['sections']['Row']

function mapGrade(row: GradeRow): Grade {
  return {
    id: row.id,
    name: row.name,
    level: row.level,
    sequence: row.sequence,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapSection(row: SectionRow): Section {
  return {
    id: row.id,
    gradeId: row.grade_id,
    name: row.name,
    capacity: row.capacity,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function getError(error: { message: string; code?: string }) {
  if (error.code === DB_ERROR.UNIQUE_VIOLATION) {
    return 'Ya existe un registro con ese nombre.'
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

export async function getGrades(): Promise<GradeWithSections[]> {
  const { data: gradeData, error: gradeError } = await supabase
    .from('grades')
    .select('*')
    .order('sequence', { ascending: true, nullsFirst: false })
    .order('name', { ascending: true })

  assertError(gradeError, 'No se pudieron cargar los grados.')

  const grades = (gradeData ?? []) as GradeRow[]
  const gradeIds = grades.map((g) => g.id)

  if (gradeIds.length === 0) return []

  const { data: sectionData, error: sectionError } = await supabase
    .from('sections')
    .select('*')
    .in('grade_id', gradeIds)
    .order('name', { ascending: true })

  assertError(sectionError, 'No se pudieron cargar las secciones.')

  const sectionsByGradeId = new Map<string, Section[]>()
  for (const section of (sectionData ?? []) as SectionRow[]) {
    const list = sectionsByGradeId.get(section.grade_id) ?? []
    list.push(mapSection(section))
    sectionsByGradeId.set(section.grade_id, list)
  }

  return grades.map((grade) => ({
    ...mapGrade(grade),
    sections: sectionsByGradeId.get(grade.id) ?? [],
  }))
}

export async function createGrade(input: CreateGradeInput): Promise<Grade> {
  const { data, error } = await supabase
    .from('grades')
    .insert({
      name: input.name.trim(),
      level: input.level?.trim() || null,
      sequence: input.sequence ?? null,
    })
    .select('*')
    .single()

  assertError(error, 'No se pudo crear el grado.')
  return mapGrade(data as GradeRow)
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

  const { data, error } = await supabase
    .from('grades')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single()

  assertError(error, 'No se pudo actualizar el grado.')
  return mapGrade(data as GradeRow)
}

export async function deleteGrade(id: string): Promise<void> {
  const { error } = await supabase.from('grades').delete().eq('id', id)
  assertError(error, 'No se pudo eliminar el grado.')
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
  return mapSection(data as SectionRow)
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
  return mapSection(data as SectionRow)
}

export async function deleteSection(id: string): Promise<void> {
  const { error } = await supabase.from('sections').delete().eq('id', id)
  assertError(error, 'No se pudo eliminar la sección.')
}
