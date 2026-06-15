/**
 * Hook useDashboard — Gestiona el estado del dashboard: carga de datos,
 * creación y completado de tareas, y manejo de estados de carga y error.
 */

import { useCallback, useEffect, useState } from 'react'

import {
  completeDashboardTask,
  createDashboardTask,
  getDashboardData,
} from '@/modules/dashboard/services/dashboardService'
import type {
  CreateDashboardTaskInput,
  DashboardData,
} from '@/modules/dashboard/types/dashboard'
import { useAuth } from '@/modules/auth/hooks/useAuth'

/** Hook principal del dashboard. Retorna datos, estado de carga/error y acciones. */
export function useDashboard() {
  const { appUser } = useAuth()
  const appUserId = appUser?.id ?? null
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await getDashboardData(appUser)
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
  }, [appUser])

  const addTask = useCallback(
    async (input: CreateDashboardTaskInput) => {
      setActionLoading(true)
      setError(null)

      try {
        const task = await createDashboardTask(input, appUserId)
        setData((current) =>
          current
            ? {
                ...current,
                tasks: [task, ...current.tasks].slice(0, 8),
              }
            : current,
        )
      } catch (error) {
        setError(error instanceof Error ? error.message : 'No se pudo crear la tarea.')
      } finally {
        setActionLoading(false)
      }
    },
    [appUserId],
  )

  const completeTask = useCallback(async (id: string) => {
    setActionLoading(true)
    setError(null)

    try {
      await completeDashboardTask(id)
      setData((current) =>
        current
          ? {
              ...current,
              tasks: current.tasks.filter((task) => task.id !== id),
            }
          : current,
      )
    } catch (error) {
      setError(error instanceof Error ? error.message : 'No se pudo completar la tarea.')
    } finally {
      setActionLoading(false)
    }
  }, [])

  useEffect(() => {
    void refetch()
  }, [refetch])

  return {
    data,
    loading,
    actionLoading,
    error,
    refetch,
    addTask,
    completeTask,
  }
}
