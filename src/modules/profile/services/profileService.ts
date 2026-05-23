import { supabase } from '@/services/supabase'
import { assertNoSupabaseError } from '@/utils/helpers'
import type { AppUser } from '@/modules/auth/types/auth'

export type UpdateProfileInput = {
  fullName: string
  phone: string | null
  avatarUrl: string | null
}

export async function updateOwnProfile(
  appUserId: string,
  input: UpdateProfileInput,
): Promise<AppUser> {
  const { data, error } = await supabase
    .from('app_users')
    .update({
      full_name: input.fullName.trim(),
      phone: input.phone?.trim() || null,
      avatar_url: input.avatarUrl?.trim() || null,
    })
    .eq('id', appUserId)
    .select('*')
    .single()

  assertNoSupabaseError(error, 'No se pudo actualizar el perfil.')
  return data as AppUser
}

export async function sendPasswordReset(email: string): Promise<void> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/login`,
  })

  if (error) {
    throw error
  }
}
