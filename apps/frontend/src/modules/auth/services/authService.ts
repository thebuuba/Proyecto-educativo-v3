/**
 * Servicio de autenticación — Funciones para gestionar inicio de sesión,
 * registro, cierre de sesión y obtención de perfil, roles y permisos.
 */

import { api, ApiError } from '@/services/apiClient'
import type {
  AuthUser,
  AuthBootstrap,
  CompleteOnboardingInput,
  LoginCredentials,
  LoginResponse,
  OnboardingStatus,
  Permission,
  RegisterCredentials,
  RegistrationResult,
  Role,
} from '@/modules/auth/types/auth'
import { clearPersistedSupabaseSession, isRememberSessionEnabled, supabase } from '@/modules/auth/services/supabaseClient'
import { getOAuthCallbackUrl } from '@/utils/oauthCallback'

/** Restaura perfil, roles, permisos y onboarding en un solo viaje. */
export function getAuthBootstrap(): Promise<AuthBootstrap> {
  return api.get<AuthBootstrap>('/auth/bootstrap')
}

/** Inicia sesión con correo y contraseña. */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const { data, error } = await supabase.auth.signInWithPassword(credentials)
  if (error) {
    if (/failed to fetch/i.test(error.message)) {
      const response = await api.post<LoginResponse & { verificationRequired?: 'email' | 'totp'; supabaseSession?: { accessToken: string; refreshToken: string } }>('/auth/login', credentials, {
        clearResponseCache: true,
      })
      if (response.supabaseSession) {
        const restored = await supabase.auth.setSession({
          access_token: response.supabaseSession.accessToken,
          refresh_token: response.supabaseSession.refreshToken,
        }).catch(() => null)
        if (response.verificationRequired && (!restored || restored.error)) {
          throw new Error('No se pudo conservar la sesión para verificarla. Reintenta cuando tengas conexión.')
        }
      }
      if (response.verificationRequired) throw new ApiError(409, 'VERIFICATION_REQUIRED', response.verificationRequired)
      return response
    }
    throw new Error(error.message)
  }
  const token = data.session?.access_token
  if (!token) throw new Error('No se pudo crear la sesión.')
  return createAulaSession(token)
}

/** Envía un enlace de acceso de un solo uso a una cuenta existente. */
export async function requestMagicLink(email: string): Promise<void> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: getOAuthCallbackUrl(window.location.origin),
      shouldCreateUser: false,
    },
  })
  if (error) throw new Error(error.message)
}

/** Registra una nueva institución con los datos del administrador. */
export async function register(credentials: RegisterCredentials): Promise<RegistrationResult> {
  const { data, error } = await supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password,
    options: {
      emailRedirectTo: getOAuthCallbackUrl(window.location.origin),
      data: {
        full_name: credentials.fullName,
      },
    },
  })
  if (error) throw new Error(error.message)
  // Una identidad nueva nunca debe heredar el centro ni el contexto académico
  // que otra cuenta dejó guardados en este navegador.
  localStorage.removeItem('aulabase:onboarding-draft-v2')
  localStorage.removeItem('aulabase:onboarding-draft-v3')
  localStorage.setItem('aulabase:registration-name', credentials.fullName)

  return data.session?.access_token ? 'ready' : 'confirmation-required'
}

/** Inicia OAuth con un proveedor social. */
export async function loginWithProvider(provider: 'google' | 'facebook'): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: getOAuthCallbackUrl(window.location.origin),
      ...(provider === 'google' ? { queryParams: { prompt: 'select_account' } } : {}),
    },
  })
  if (error) throw new Error(error.message)
}

/** Completa el callback OAuth y retorna la sesión Supabase. */
export async function exchangeOAuthCode(code: string): Promise<string> {
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) throw new Error(error.message)
  const token = data.session?.access_token
  if (!token) throw new Error('No se pudo completar el inicio social.')
  return token
}

/** Crea sesión Aula Base desde token Supabase. */
export async function createAulaSession(supabaseAccessToken: string): Promise<LoginResponse> {
  const session = await api.post<LoginResponse>('/auth/session', undefined, {
    headers: {
      Authorization: `Bearer ${supabaseAccessToken}`,
      'X-Remember-Session': String(isRememberSessionEnabled()),
    },
    clearResponseCache: true,
  })
  const bootstrap = await getAuthBootstrap()
  return { ...session, ...bootstrap }
}

/** Completa el onboarding académico inicial. */
export async function completeOnboarding(
  supabaseAccessToken: string,
  input: CompleteOnboardingInput,
): Promise<LoginResponse> {
  return api.post<LoginResponse>('/auth/onboarding/complete', input, {
    headers: { Authorization: `Bearer ${supabaseAccessToken}` },
    clearResponseCache: true,
  })
}

/** Obtiene si la estructura académica inicial ya está completa. */
export async function getOnboardingStatus(): Promise<OnboardingStatus> {
  return api.get<OnboardingStatus>('/auth/onboarding/status')
}

/** Solicita un correo de recuperación sin revelar si la cuenta existe. */
export async function requestPasswordReset(email: string): Promise<void> {
  await api.post('/auth/forgot-password', { email })
}

/** Cierra la sesión del backend y de Supabase. */
export async function logout(): Promise<void> {
  await api.post('/auth/logout', undefined, { clearResponseCache: true })
  try {
    await supabase.auth.signOut({ scope: 'local' })
  } catch {
    // La cookie de AulaBase ya fue eliminada; limpiar el token local evita restaurarla.
  } finally {
    clearPersistedSupabaseSession()
  }
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
