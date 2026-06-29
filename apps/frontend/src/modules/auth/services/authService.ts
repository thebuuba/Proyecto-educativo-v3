/**
 * Servicio de autenticación — Funciones para gestionar inicio de sesión,
 * registro, cierre de sesión y obtención de perfil, roles y permisos.
 */

import { api } from '@/services/apiClient'
import type {
  AuthUser,
  CompleteOnboardingInput,
  LoginCredentials,
  LoginResponse,
  OnboardingStatus,
  Permission,
  RegisterCredentials,
  Role,
} from '@/modules/auth/types/auth'
import { supabase } from '@/modules/auth/services/supabaseClient'

/** Inicia sesión con correo y contraseña. */
export async function login({ email, password }: LoginCredentials): Promise<LoginResponse> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message)
  const token = data.session?.access_token
  if (!token) throw new Error('No se pudo iniciar sesión.')
  return createAulaSession(token)
}

/** Registra una nueva institución con los datos del administrador. */
export async function register(credentials: RegisterCredentials): Promise<LoginResponse> {
  const { data, error } = await supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password,
    options: {
      data: {
        full_name: credentials.fullName,
      },
    },
  })
  if (error) throw new Error(error.message)

  const token = data.session?.access_token
  if (!token) {
    throw new Error('Revisa tu correo para confirmar la cuenta antes de continuar.')
  }

  return createAulaSession(token)
}

/** Inicia OAuth con un proveedor social. */
export async function loginWithProvider(provider: 'google' | 'facebook'): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  if (error) throw new Error(error.message)
}

/** Completa el callback OAuth y retorna la sesión Supabase. */
export async function exchangeOAuthCode(): Promise<string> {
  const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href)
  if (error) throw new Error(error.message)
  const token = data.session?.access_token
  if (!token) throw new Error('No se pudo completar el inicio social.')
  return token
}

/** Crea sesión Aula Base desde token Supabase. */
export async function createAulaSession(supabaseAccessToken: string): Promise<LoginResponse> {
  return api.post<LoginResponse>('/auth/session', { supabaseAccessToken })
}

/** Completa el onboarding académico inicial. */
export async function completeOnboarding(
  supabaseAccessToken: string,
  input: CompleteOnboardingInput,
): Promise<LoginResponse> {
  return api.post<LoginResponse>('/auth/onboarding/complete', {
    ...input,
    supabaseAccessToken,
  })
}

/** Obtiene si la estructura académica inicial ya está completa. */
export async function getOnboardingStatus(): Promise<OnboardingStatus> {
  return api.get<OnboardingStatus>('/auth/onboarding/status')
}

/** Cierra la sesión eliminando el token del almacenamiento local. */
export async function logout(): Promise<void> {
  await supabase.auth.signOut().catch(() => undefined)
  localStorage.removeItem('auth_token')
}

/** Obtiene el perfil del usuario autenticado. */
export async function getProfile(): Promise<AuthUser> {
  return api.get<AuthUser>('/auth/profile')
}

/** Obtiene los roles asignados a un usuario. */
export async function getUserRoles(appUserId: string): Promise<Role[]> {
  return api.get<Role[]>(`/users/${appUserId}/roles`)
}

/** Obtiene los permisos asociados a una lista de roles. */
export async function getUserPermissions(roles: Role[]): Promise<Permission[]> {
  const roleIds = roles.map((r) => r.id)
  if (roleIds.length === 0) return []
  return api.get<Permission[]>(`/users/permissions?roleIds=${roleIds.join(',')}`)
}
