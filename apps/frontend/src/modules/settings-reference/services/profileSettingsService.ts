import { api, ApiError } from '@/services/apiClient'
import type { ProfileSettings, UpdateProfileSettingsInput } from '@aula/shared'

export const getOwnProfileSettings = () => api.get<ProfileSettings>('/profile/settings')
export const updateOwnProfileSettings = (input: UpdateProfileSettingsInput) => api.patch<ProfileSettings>('/profile/settings', input)
export const removeOwnAvatar = () => api.delete<ProfileSettings>('/profile/avatar')
export async function uploadOwnAvatar(file: File): Promise<ProfileSettings> {
  const body = new FormData(); body.append('file', file)
  const response = await fetch('/api/v1/profile/avatar', { method: 'POST', credentials: 'include', body })
  const result = await response.json().catch(() => null)
  if (!response.ok) throw new ApiError(response.status, result?.error || result?.message || 'No se pudo subir la foto.', 'POST')
  return result.data
}
