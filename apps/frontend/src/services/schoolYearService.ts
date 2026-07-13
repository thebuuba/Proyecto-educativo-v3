/**
 * Servicio para obtener información del año escolar.
 */
import { api, API_CACHE_TAGS, API_CACHE_TTL } from '@/services/apiClient'

/** Resumen de un año escolar. */
export type SchoolYearSummary = {
  /** Identificador del año escolar. */
  id: string
  /** Nombre del año escolar. */
  name: string
  /** Indica si es el año escolar actual. */
  isCurrent: boolean
}

/**
 * Obtiene el año escolar actual. Si ninguno está marcado como actual,
 * retorna el primero de la lista. Retorna null si no hay años escolares.
 *
 * @returns El año escolar actual o null.
 */
export async function getCurrentSchoolYear(): Promise<SchoolYearSummary | null> {
  const years = await api.get<SchoolYearSummary[]>('/school-administration/school-years', {
    cacheTtlMs: API_CACHE_TTL.sessionList,
    cacheTags: [API_CACHE_TAGS.schoolYears],
  })
  return years.find((year) => year.isCurrent) ?? years[0] ?? null
}
