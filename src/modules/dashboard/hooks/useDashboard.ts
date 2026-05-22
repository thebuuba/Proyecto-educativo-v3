import { useCallback, useEffect, useState } from 'react'

import {
  getAcademicAlerts,
  getAttendanceData,
  getDashboardStats,
  getPerformanceData,
  getQuickActions,
  getRecentStudents,
} from '@/modules/dashboard/services/dashboardService'
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
      const [stats, attendanceData, performanceData, recentStudents, alerts] =
        await Promise.all([
          getDashboardStats(),
          getAttendanceData(),
          getPerformanceData(),
          getRecentStudents(),
          getAcademicAlerts(),
        ])

      setData({
        stats,
        attendanceData,
        performanceData,
        recentStudents,
        alerts,
        quickActions: getQuickActions(),
      })
    } catch (dashboardError) {
      setData(null)
      setError(
        dashboardError instanceof Error
          ? dashboardError.message
          : 'Error al cargar dashboard.',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void refetch()
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [refetch])

  return {
    data,
    loading,
    error,
    refetch,
  }
}
