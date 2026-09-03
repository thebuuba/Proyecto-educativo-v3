import { api } from '@/services/apiClient'
import type { AppUser } from '@/modules/auth/types/auth'
import type { CreateDashboardTaskInput, DashboardData, DashboardInsights, DashboardTask } from '@/modules/dashboard/types/dashboard'

/** Obtiene en una sola petición el resumen del usuario actual. */
export async function getDashboardData(_appUser: AppUser | null, forceRefresh = false): Promise<DashboardData> {
  return api.get<DashboardData>('/dashboard/overview', { cacheTtlMs: 30_000, forceRefresh })
}

/** Carga actividad y gráficas después de pintar las tarjetas principales. */
export async function getDashboardInsights(): Promise<DashboardInsights> {
  return api.get<DashboardInsights>('/dashboard/insights')
}

/** Crea una tarea personal del dashboard. */
export async function createDashboardTask(input: CreateDashboardTaskInput, appUserId: string | null): Promise<DashboardTask> {
  if (!input.title.trim()) throw new Error('Escribe un título para la tarea.')
  return api.post<DashboardTask>('/dashboard/tasks', { ...input, assignedTo: appUserId })
}

/** Marca una tarea como completada. */
export async function completeDashboardTask(id: string): Promise<void> {
  await api.patch(`/dashboard/tasks/${id}`, { status: 'completed' })
}
