/**
 * Servicio para obtener información del año escolar.
 */
import { api } from '@/services/apiClient'

/** Resumen de un año escolar. */
export type SchoolYearSummary = {
  /** Identificador del año escolar. */
  id: string
  /** Nombre del año escolar. */
  name: string
  /** Indica si es el año escolar actual. */
  isCurrent: boolean
}

let currentSchoolYearRequest: Promise<SchoolYearSummary | null> | null = null

/**
 * Obtiene el año escolar actual. Si ninguno está marcado como actual,
 * retorna el primero de la lista. Retorna null si no hay años escolares.
 *
 * @returns El año escolar actual o null.
 */
export async function getCurrentSchoolYear(): Promise<SchoolYearSummary | null> {
  if (!currentSchoolYearRequest) {
    currentSchoolYearRequest = api
      .get<SchoolYearSummary[]>('/school-administration/school-years')
      .then((years) => years.find((y) => y.isCurrent) ?? years[0] ?? null)
      .finally(() => {
        // La deduplicación cubre sólo consumidores concurrentes; una futura
        // navegación puede consultar cambios hechos en administración.
        currentSchoolYearRequest = null
      })
  }

  return currentSchoolYearRequest
}
