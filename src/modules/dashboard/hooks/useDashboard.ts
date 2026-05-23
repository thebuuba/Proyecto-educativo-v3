import { useCallback, useEffect, useState } from 'react'

import { getDashboardData } from '@/modules/dashboard/services/dashboardService'
import type {
  AcademicAlert,
  ChartDatum,
  DashboardStat,
  QuickAction,
  RecentStudent,
} from '@/modules/dashboard/types/dashboard'

type DashboardData = {
  stats: DashboardStat[]
  attendanceData: ChartDatum[]
  performanceData: ChartDatum[]
  recentStudents: RecentStudent[]
  alerts: AcademicAlert[]
  quickActions: QuickAction[]
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await getDashboardData()
      setData(result)
    } catch (error) {
      setData(null)
      setError(
        error instanceof Error
          ? error.message
          : 'Error al cargar dashboard.',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refetch()
  }, [refetch])

  return {
    data,
    loading,
    error,
    refetch,
  }
}
