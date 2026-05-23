import { useCallback, useEffect, useState } from 'react'

import { useAuth } from '@/modules/auth/hooks/useAuth'
import {
  createSchoolYear,
  getSchoolProfile,
  getSchoolYears,
  setCurrentSchoolYear,
  updateSchoolProfile,
  updateSchoolYear,
} from '@/modules/settings/services/settingsService'
import type {
  CreateSchoolYearInput,
  SchoolProfile,
  SchoolYearItem,
  UpdateSchoolInput,
  UpdateSchoolYearInput,
} from '@/modules/settings/types'

export function useSettings() {
  const { schoolId } = useAuth()
  const [profile, setProfile] = useState<SchoolProfile | null>(null)
  const [schoolYears, setSchoolYears] = useState<SchoolYearItem[]>([])
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
      setProfile(profileData)
      setSchoolYears(yearsData)
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
    loading,
    error,
    refetch,
    saveProfile,
    addSchoolYear,
    editSchoolYear,
    activateSchoolYear,
  }
}
