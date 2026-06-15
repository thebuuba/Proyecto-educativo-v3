/**
 * @file Servicio de Configuración
 *
 * Proporciona funciones para gestionar el perfil del centro
 * educativo y los años escolares.
 */

import { api } from '@/services/apiClient'
import type {
  SchoolProfile,
  SchoolYearItem,
  UpdateSchoolInput,
  CreateSchoolYearInput,
  UpdateSchoolYearInput,
} from '@/modules/settings/types'

/** Obtiene el perfil del centro educativo */
export async function getSchoolProfile(_schoolId: string): Promise<SchoolProfile | null> {
  return api.get<SchoolProfile | null>('/settings/school')
}

/** Actualiza los datos del perfil del centro educativo */
export async function updateSchoolProfile(_schoolId: string, input: UpdateSchoolInput): Promise<SchoolProfile> {
  return api.patch<SchoolProfile>('/settings/school', input)
}

/** Obtiene la lista de años escolares registrados */
export async function getSchoolYears(): Promise<SchoolYearItem[]> {
  return api.get<SchoolYearItem[]>('/settings/school-years')
}

/** Crea un nuevo año escolar */
export async function createSchoolYear(input: CreateSchoolYearInput): Promise<SchoolYearItem> {
  return api.post<SchoolYearItem>('/settings/school-years', input)
}

/** Actualiza un año escolar existente */
export async function updateSchoolYear(id: string, input: UpdateSchoolYearInput): Promise<SchoolYearItem> {
  return api.patch<SchoolYearItem>(`/settings/school-years/${id}`, input)
}

/** Establece un año escolar como el activo */
export async function setCurrentSchoolYear(id: string): Promise<void> {
  await api.post(`/settings/school-years/${id}/set-current`)
}
