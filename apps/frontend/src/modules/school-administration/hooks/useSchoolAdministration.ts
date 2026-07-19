/**
 * @file Hook de Configuración
 *
 * Gestiona el estado del perfil del centro educativo y los
 * años escolares.
 */

import { useCallback, useEffect, useState } from 'react'

import { useAuth } from '@/modules/auth/hooks/useAuth'
import { getAcademicPeriods } from '@/modules/planning/services/planningService'
import type { AcademicPeriodSummary } from '@/modules/planning/types'
import {
  createSchoolYear,
  getSchoolProfile,
  getSchoolYears,
  setCurrentSchoolYear,
  updateSchoolProfile,
  updateSchoolYear,
} from '@/modules/school-administration/services/schoolAdministrationService'
import type {
  CreateSchoolYearInput,
  SchoolProfile,
  SchoolYearItem,
  UpdateSchoolInput,
  UpdateSchoolYearInput,
} from '@/modules/school-administration/types'

/** Hook principal para la gestión de configuración del centro */
export function useSchoolAdministration() {
  const { schoolId } = useAuth()
  const [profile, setProfile] = useState<SchoolProfile | null>(null)
  const [schoolYears, setSchoolYears] = useState<SchoolYearItem[]>([])
  const [academicPeriods, setAcademicPeriods] = useState<AcademicPeriodSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (!schoolId) return
    setLoading(true)
    setError(null)

    try {
      const [profileData, yearsData] = await Promise.all([
        getSchoolProfile(schoolId),
        getSchoolYears(),
      ])
      const currentYear = yearsData.find((year) => year.isCurrent) ?? yearsData[0] ?? null
      const periodsData = currentYear ? await getAcademicPeriods(currentYear.id) : []
      setProfile(profileData)
      setSchoolYears(yearsData)
      setAcademicPeriods(periodsData)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar los datos de configuración.',
      )
    } finally {
      setLoading(false)
    }
  }, [schoolId])

  useEffect(() => {
    void refetch()
  }, [refetch])

  const saveProfile = useCallback(
    async (input: UpdateSchoolInput) => {
      if (!schoolId) return
      const updated = await updateSchoolProfile(schoolId, input)
      setProfile(updated)
    },
    [schoolId],
  )

  const addSchoolYear = useCallback(
    async (input: CreateSchoolYearInput) => {
      await createSchoolYear(input)
      await refetch()
    },
    [refetch],
  )

  const editSchoolYear = useCallback(
    async (id: string, input: UpdateSchoolYearInput) => {
      await updateSchoolYear(id, input)
      await refetch()
    },
    [refetch],
  )

  const activateSchoolYear = useCallback(
    async (id: string) => {
      await setCurrentSchoolYear(id)
      await refetch()
    },
    [refetch],
  )

  return {
    profile,
    schoolYears,
    academicPeriods,
    loading,
    error,
    refetch,
    saveProfile,
    addSchoolYear,
    editSchoolYear,
    activateSchoolYear,
  }
}
