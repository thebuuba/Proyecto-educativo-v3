import { api } from '@/services/apiClient'
import type { AppUser } from '@/modules/auth/types/auth'
import type { UpdateProfileInput } from '@/modules/profile/types'

export async function updateOwnProfile(
  appUserId: string,
  input: UpdateProfileInput,
): Promise<AppUser> {
  return api.patch<AppUser>(`/users/${appUserId}`, input)
}

export async function sendPasswordReset(email: string): Promise<void> {
  await api.post('/auth/forgot-password', { email })
}
