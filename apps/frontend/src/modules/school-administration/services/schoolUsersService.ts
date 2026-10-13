import { api } from '@/services/apiClient'
import type { Role } from '@/modules/auth/types/auth'

export type SchoolUser = { id: string; email: string; fullName: string; status: string }
export type SchoolUserDetail = SchoolUser & { avatarUrl: string | null }

export function listSchoolUsers(signal?: AbortSignal) {
  return api.get<SchoolUser[]>('/users', { signal })
}

export function getSchoolUser(id: string, signal?: AbortSignal) {
  return api.get<SchoolUserDetail | null>(`/users/${encodeURIComponent(id)}`, { signal })
}

export function getSchoolUserRoles(id: string, signal?: AbortSignal) {
  return api.get<Role[]>(`/users/${encodeURIComponent(id)}/roles`, { signal })
}

export function updateSchoolUser(id: string, input: { fullName: string; avatarUrl: string }) {
  return api.patch<SchoolUserDetail>(`/users/${encodeURIComponent(id)}`, {
    fullName: input.fullName.trim(), avatarUrl: input.avatarUrl.trim(),
  })
}
