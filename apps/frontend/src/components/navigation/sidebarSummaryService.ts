import { api, API_CACHE_TAGS } from '@/services/apiClient'

export function getSidebarSummary(): Promise<{ activeGroups: number; classesToday: number }> {
  return api.get('/dashboard/sidebar-summary', {
    cacheTtlMs: 30_000,
    cacheTags: [API_CACHE_TAGS.courseOptions, API_CACHE_TAGS.schedule],
  })
}
