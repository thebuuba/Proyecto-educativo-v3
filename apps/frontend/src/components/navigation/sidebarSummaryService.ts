import { api } from '@/services/apiClient'

export function getSidebarSummary(): Promise<{ activeGroups: number; classesToday: number }> {
  return api.get('/dashboard/sidebar-summary', { cacheTtlMs: 30_000 })
}
