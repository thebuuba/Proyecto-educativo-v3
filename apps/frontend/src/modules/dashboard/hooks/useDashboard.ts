/**
 * Hook useDashboard — Gestiona el estado del dashboard: carga de datos,
 * creación y completado de tareas, y manejo de estados de carga y error.
 */

import { useCallback, useEffect, useRef, useState } from 'react'

import {
  completeDashboardTask,
  createDashboardTask,
  getDashboardData,
  getDashboardInsights,
} from '@/modules/dashboard/services/dashboardService'
import type {
  CreateDashboardTaskInput,
  DashboardData,
} from '@/modules/dashboard/types/dashboard'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { createScopedTtlCache } from '@/utils/scopedTtlCache'

const CACHE_TTL = 60_000
const dashboardCache = createScopedTtlCache<DashboardData>(CACHE_TTL)

function updateCachedData(
  scope: string | null,
  current: DashboardData | null,
  update: (data: DashboardData) => DashboardData,
) {
  if (!current) return current
  const next = update(current)
  // Actualiza el valor sin renovar el TTL de los demás bloques del dashboard.
  dashboardCache.update(scope, () => next)
  return next
}

/** Hook principal del dashboard. Retorna datos, estado de carga/error y acciones. */
export function useDashboard() {
  const { appUser } = useAuth()
  const appUserId = appUser?.id ?? null
  const cacheScope = appUser ? `${appUser.id}:${appUser.schoolId}` : null
  const [data, setData] = useState<DashboardData | null>(() => dashboardCache.read(cacheScope))
  const [dataScope, setDataScope] = useState(cacheScope)
  const [loading, setLoading] = useState(!data)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const activeScopeRef = useRef(cacheScope)
  const pendingActionsRef = useRef(new Map<string | null, number>())

  useEffect(() => {
    activeScopeRef.current = cacheScope
    setActionLoading((pendingActionsRef.current.get(cacheScope) ?? 0) > 0)
  }, [cacheScope])

  const beginAction = useCallback((scope: string | null) => {
    pendingActionsRef.current.set(scope, (pendingActionsRef.current.get(scope) ?? 0) + 1)
    if (activeScopeRef.current === scope) setActionLoading(true)
  }, [])

  const finishAction = useCallback((scope: string | null) => {
    const remaining = Math.max(0, (pendingActionsRef.current.get(scope) ?? 1) - 1)
    if (remaining > 0) pendingActionsRef.current.set(scope, remaining)
    else pendingActionsRef.current.delete(scope)
    if (activeScopeRef.current === scope) setActionLoading(remaining > 0)
  }, [])

  const refetch = useCallback(async (forceRefresh = true) => {
    const requestedScope = cacheScope
    setLoading(true)
    setError(null)

    try {
      const result = await getDashboardData(appUser, forceRefresh)
      if (activeScopeRef.current !== requestedScope) return
      dashboardCache.write(requestedScope, result)
      setData(result)
      setDataScope(requestedScope)
      setLoading(false)

      void getDashboardInsights().then((insights) => {
        if (activeScopeRef.current !== requestedScope) return
        setData((current) => updateCachedData(requestedScope, current, (dashboard) => ({ ...dashboard, ...insights })))
      }).catch(() => undefined)
    } catch (error) {
      if (activeScopeRef.current !== requestedScope) return
      setData(null)
      setDataScope(requestedScope)
      setError(
        error instanceof Error
          ? error.message
          : 'Error al cargar dashboard.',
      )
    } finally {
      if (activeScopeRef.current === requestedScope) setLoading(false)
    }
  }, [appUser, cacheScope])

  const addTask = useCallback(
    async (input: CreateDashboardTaskInput) => {
      const requestedScope = cacheScope
      beginAction(requestedScope)
      setError(null)

      try {
        const task = await createDashboardTask(input, appUserId)
        if (activeScopeRef.current !== requestedScope) return
        setData((current) =>
          updateCachedData(requestedScope, current, (dashboard) => ({
            ...dashboard,
            tasks: [task, ...dashboard.tasks].slice(0, 8),
          })),
        )
      } catch (error) {
        if (activeScopeRef.current !== requestedScope) return
        setError(error instanceof Error ? error.message : 'No se pudo crear la tarea.')
      } finally {
        finishAction(requestedScope)
      }
    },
    [appUserId, beginAction, cacheScope, finishAction],
  )

  const completeTask = useCallback(
    async (id: string) => {
      const requestedScope = cacheScope
      beginAction(requestedScope)
      setError(null)

      try {
        await completeDashboardTask(id)
        if (activeScopeRef.current !== requestedScope) return
        setData((current) =>
          updateCachedData(requestedScope, current, (dashboard) => ({
            ...dashboard,
            tasks: dashboard.tasks.filter((task) => task.id !== id),
          })),
        )
      } catch (error) {
        if (activeScopeRef.current !== requestedScope) return
        setError(error instanceof Error ? error.message : 'No se pudo completar la tarea.')
      } finally {
        finishAction(requestedScope)
      }
    },
    [beginAction, cacheScope, finishAction],
  )

  useEffect(() => {
    const cached = dashboardCache.read(cacheScope)
    if (cached) {
      setData(cached)
      setDataScope(cacheScope)
      setError(null)
      setLoading(false)
      return
    }

    setData(null)
    setDataScope(cacheScope)
    void refetch(false)
  }, [cacheScope, refetch])

  useEffect(() => {
    const refreshOnFocus = () => void refetch()
    window.addEventListener('focus', refreshOnFocus)
    return () => window.removeEventListener('focus', refreshOnFocus)
  }, [refetch])

  const scopedData = dataScope === cacheScope ? data : null
  const scopedLoading = dataScope === cacheScope ? loading : true

  return {
    data: scopedData,
    loading: scopedLoading,
    actionLoading,
    error,
    refetch,
    addTask,
    completeTask,
  }
}
