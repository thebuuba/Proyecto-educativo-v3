/**
 * @file Módulo de Configuración — Tipos y constantes
 *
 * Define las estructuras para el perfil del centro educativo
 * y la gestión de años escolares.
 */

import type { RecordStatus } from '@/types/domain'

/** Perfil del centro educativo */
export type SchoolProfile = {
  id: string
  name: string
  slug: string
  logoUrl: string | null
  sector: 'public' | 'private' | 'semiofficial'
  regionalCode: string | null
  regionalName: string | null
  districtCode: string | null
  districtName: string | null
  centerCode: string | null
  schoolShift: 'morning' | 'afternoon' | 'night' | 'extended' | 'full_day'
  primaryModality: 'general' | 'academic' | 'technical_professional' | 'arts'
  enabledSubsystems: string[]
  officialExportsEnabled: boolean
  status: RecordStatus
  createdAt: string
  updatedAt: string
}

/** Año escolar registrado en el sistema */
export type SchoolYearItem = {
  id: string
  name: string
  startDate: string
  endDate: string
  periodScheme: 'trimester' | 'semester' | 'quarter' | 'custom'
  periodCount: number
  calendarSource: string
  instructionalDays: number | null
  studentWeeks: number | null
  teacherWeeks: number | null
  isCurrent: boolean
  status: RecordStatus
  createdAt: string
  updatedAt: string
}

export type UpdateSchoolInput = {
  name?: string
  slug?: string
  logoUrl?: string | null
  sector?: SchoolProfile['sector']
  regionalCode?: string | null
  regionalName?: string | null
  districtCode?: string | null
  districtName?: string | null
  centerCode?: string | null
  schoolShift?: SchoolProfile['schoolShift']
  primaryModality?: SchoolProfile['primaryModality']
  enabledSubsystems?: string[]
  officialExportsEnabled?: boolean
}

export type CreateSchoolYearInput = {
  name: string
  startDate: string
  endDate: string
  periodScheme?: SchoolYearItem['periodScheme']
  periodCount?: number
  calendarSource?: string
  instructionalDays?: number | null
  studentWeeks?: number | null
  teacherWeeks?: number | null
  isCurrent?: boolean
}

export type UpdateSchoolYearInput = Partial<CreateSchoolYearInput> & {
  status?: RecordStatus
}
