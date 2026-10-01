/**
 * Proveedor de autenticación: componente que envuelve la aplicación y
 * provee el estado de autenticación, los métodos para iniciar/cerrar sesión,
 * registrar, recargar el perfil y verificar roles/permisos.
 */

import type { ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { AuthContext, type AuthContextValue } from '@/modules/auth/context/AuthContext'
import {
  completeOnboarding as completeOnboardingService,
  createAulaSession,
  exchangeOAuthCode,
  getOnboardingStatus,
  login as loginService,
  loginWithProvider as loginWithProviderService,
  register as registerService,
  logout as logoutService,
  getAuthBootstrap,
} from '@/modules/auth/services/authService'
import { ApiError, AUTH_UNAUTHORIZED_EVENT } from '@/services/apiClient'
import { supabase } from '@/modules/auth/services/supabaseClient'
import { shouldReportBootstrapFailure } from '@/modules/auth/utils/bootstrapFailure'
import type {
  AuthState,
  AuthUser,
  CompleteOnboardingInput,
  LoginCredentials,
  Permission,
  RegisterCredentials,
  Role,
  LoginResponse,
} from '@/modules/auth/types/auth'
import type { UserRole } from '@/types/domain'

type AuthProviderProps = {
  children: ReactNode
}

let oauthCallbackHrefInFlight: string | null = null
let oauthCallbackPromise: Promise<'authenticated' | 'profile-required'> | null = null
let aulaSessionInFlight: Promise<LoginResponse> | null = null
let aulaSessionToken: string | null = null

function createAulaSessionOnce(token: string): Promise<LoginResponse> {
  if (aulaSessionInFlight && aulaSessionToken === token) return aulaSessionInFlight
  const previous = aulaSessionInFlight
  aulaSessionToken = token
  aulaSessionInFlight = (previous ? previous.catch(() => undefined) : Promise.resolve())
    .then(() => createAulaSession(token))
  void aulaSessionInFlight.finally(() => {
    if (aulaSessionToken === token) {
      aulaSessionInFlight = null
      aulaSessionToken = null
    }
  }).catch(() => undefined)
  return aulaSessionInFlight
}

const ONBOARDING_CACHE_KEY = 'aulabase:onboarding-complete'

function rememberAccount(appUser: LoginResponse['appUser'], roles: Role[]) {
  try {
    localStorage.setItem('aulabase:last-account', JSON.stringify({
      email: appUser.email,
      fullName: appUser.fullName,
      avatarUrl: appUser.avatarUrl,
      role: roles[0]?.name,
    }))
  } catch { /* El inicio de sesión funciona aunque el navegador bloquee el almacenamiento. */ }
}

function setCachedOnboardingStatus(complete: boolean) {
  if (complete) localStorage.setItem(ONBOARDING_CACHE_KEY, 'true')
  else localStorage.removeItem(ONBOARDING_CACHE_KEY)
}

const initialState: AuthState = {
  user: null,
  supabaseAccessToken: null,
  appUser: null,
  roles: [],
  permissions: [],
  loading: true,
  authError: null,
  profileRequired: false,
  onboardingComplete: null,
}

/**
 * Componente proveedor de autenticación.
 * Gestiona el estado de sesión, carga el perfil al montar y expone
 * funciones para login, register, logout y verificación de roles/permisos.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>(initialState)
  const authEpoch = useRef(0)
  const loggingOut = useRef(false)

  /** Limpia el estado de autenticación local. */
  const clearAuthState = useCallback((authError: string | null = null) => {
    setState({
      user: null,
      supabaseAccessToken: null,
      appUser: null,
      roles: [],
      permissions: [],
      loading: false,
      authError,
      profileRequired: false,
      onboardingComplete: null,
    })
  }, [])

  /** Aplica los datos de una sesión (login o registro) al estado global. */
  const applySession = useCallback(async (response: LoginResponse, checkOnboarding = true, epoch = authEpoch.current) => {
    if (epoch !== authEpoch.current) return
    rememberAccount(response.appUser, response.roles)
    const onboardingComplete = checkOnboarding
      ? await getOnboardingStatus().then((status) => {
          setCachedOnboardingStatus(status.complete)
          return status.complete
        }).catch(() => null)
      : null
    if (epoch !== authEpoch.current) return
    setState({
      user: response.user,
      supabaseAccessToken: null,
      appUser: response.appUser,
      roles: response.roles,
      permissions: response.permissions,
      loading: false,
      authError: null,
      profileRequired: false,
      onboardingComplete,
    })
  }, [])

  const restoreFromSupabaseSession = useCallback(async () => {
    if (loggingOut.current) return false
    const epoch = authEpoch.current
    const { data, error } = await supabase.auth.refreshSession().catch(() => ({ data: { session: null }, error: true }))
    if (error) return false

    const supabaseToken = data.session?.access_token ?? null
    if (!supabaseToken) return false
    if (epoch !== authEpoch.current || loggingOut.current) return false

    try {
      const response = await createAulaSessionOnce(supabaseToken)
      if (epoch !== authEpoch.current) return false
      await applySession(response, true, epoch)
      return true
    } catch (error) {
      if (error instanceof ApiError && error.message === 'VERIFICATION_REQUIRED') {
        const method = error.method === 'totp' ? 'totp' : 'email'
        clearAuthState(`VERIFICATION_REQUIRED:${method}`)
        return method
      }
      if (error instanceof ApiError && error.message === 'PROFILE_REQUIRED') {
        setState({
          user: null,
          supabaseAccessToken: supabaseToken,
          appUser: null,
          roles: [],
          permissions: [],
          loading: false,
          authError: null,
          profileRequired: true,
          onboardingComplete: false,
        })
        return true
      }
      return false
    }
  }, [applySession])

  /** Carga el estado de autenticación desde el servidor (perfil, roles, permisos). */
  const loadAuthState = useCallback(async () => {
    const epoch = authEpoch.current
    setState((current) => ({ ...current, loading: true }))

    try {
      const bootstrap = await getAuthBootstrap()
      if (epoch !== authEpoch.current) return
      const appUser = bootstrap?.appUser

      if (!appUser) {
        clearAuthState()
        return
      }

      const user: AuthUser = { id: appUser.id, email: appUser.email }
      const roles = bootstrap.roles
      rememberAccount(appUser, roles)
      const permissions = bootstrap.permissions
      const onboardingStatus = bootstrap.onboardingComplete
      setCachedOnboardingStatus(onboardingStatus)

      setState({
        user,
        supabaseAccessToken: null,
        appUser,
        roles,
        permissions,
        loading: false,
        authError: null,
        profileRequired: false,
        onboardingComplete: onboardingStatus ?? null,
      })
    } catch (error) {
      if (epoch !== authEpoch.current) return
      console.error(error)
      if (!await restoreFromSupabaseSession()) {
        if (error instanceof ApiError && error.status === 401) {
          clearAuthState()
        } else if (shouldReportBootstrapFailure(error)) {
          clearAuthState(
            'No se pudo cargar tu perfil. Revisa tu conexión e inténtalo de nuevo.',
          )
        } else {
          clearAuthState()
        }
      }
    }
  }, [clearAuthState, restoreFromSupabaseSession])

  useEffect(() => {
    void loadAuthState()
  }, [loadAuthState])

  useEffect(() => {
    let recovering = false
    const recoverSession = () => {
      if (recovering) return
      recovering = true
      void loadAuthState().finally(() => { recovering = false })
    }
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, recoverSession)
    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, recoverSession)
  }, [loadAuthState])

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'TOKEN_REFRESHED' && session?.access_token && !loggingOut.current) {
        const epoch = authEpoch.current
        void createAulaSessionOnce(session.access_token)
          .then((response) => applySession(response, false, epoch))
          .catch((error) => {
            if (epoch !== authEpoch.current) return
            if (error instanceof ApiError && error.message === 'VERIFICATION_REQUIRED') {
              clearAuthState(`VERIFICATION_REQUIRED:${error.method === 'totp' ? 'totp' : 'email'}`)
            }
          })
      }
    })
    return () => data.subscription.unsubscribe()
  }, [applySession, clearAuthState])

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const epoch = authEpoch.current
      try {
        await applySession(await loginService(credentials), true, epoch)
      } catch (error) {
        if (error instanceof ApiError && error.message === 'PROFILE_REQUIRED') {
          const { data } = await supabase.auth.getSession()
          setState((current) => ({
            ...current,
            supabaseAccessToken: data.session?.access_token ?? null,
            loading: false,
            profileRequired: true,
            onboardingComplete: false,
            authError: null,
          }))
          return
        }
        throw error
      }
    },
    [applySession],
  )

  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      const result = await registerService(credentials)
      if (result === 'confirmation-required') return result
      const { data } = await supabase.auth.getSession()
      setState((current) => ({
        ...current,
        supabaseAccessToken: data.session?.access_token ?? null,
        loading: false,
        profileRequired: true,
        onboardingComplete: false,
        authError: null,
      }))
      return result
    },
    [],
  )

  const loginWithProvider = useCallback((provider: 'google' | 'facebook') => {
    return loginWithProviderService(provider)
  }, [])

  const finishOAuthCallback = useCallback(async () => {
    const epoch = authEpoch.current
    const href = window.location.href
    const code = new URL(href).searchParams.get('code')

    if (!code) {
      const restored = await restoreFromSupabaseSession()
      if (restored === true) return 'authenticated'
      if (restored) throw new ApiError(409, 'VERIFICATION_REQUIRED', restored)
      throw new Error('No se pudo completar el inicio social.')
    }

    if (oauthCallbackHrefInFlight === href && oauthCallbackPromise) return oauthCallbackPromise

    oauthCallbackHrefInFlight = href
    oauthCallbackPromise = (async () => {
      const supabaseToken = await exchangeOAuthCode(code)
      window.history.replaceState({}, '', '/auth/callback')
      try {
        await applySession(await createAulaSessionOnce(supabaseToken), true, epoch)
        return 'authenticated'
      } catch (error) {
        if (error instanceof ApiError && error.message === 'PROFILE_REQUIRED') {
          setState({
            user: null,
            supabaseAccessToken: supabaseToken,
            appUser: null,
            roles: [],
            permissions: [],
            loading: false,
            authError: null,
            profileRequired: true,
            onboardingComplete: false,
          })
          return 'profile-required'
        }
        throw error
      }
    })()

    try {
      return await oauthCallbackPromise
    } finally {
      oauthCallbackHrefInFlight = null
      oauthCallbackPromise = null
    }
  }, [applySession, restoreFromSupabaseSession])

  const completeOnboarding = useCallback(
    async (input: CompleteOnboardingInput) => {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData.user?.id) {
        throw new Error('Tu sesión expiró. Inicia sesión nuevamente.')
      }

      const { data } = await supabase.auth.getSession()
      const supabaseToken = data.session?.access_token ?? state.supabaseAccessToken ?? null
      if (!supabaseToken) {
        throw new Error('Tu sesión expiró. Inicia sesión nuevamente.')
      }

      try {
        await applySession(await completeOnboardingService(supabaseToken, input))
      } catch (error) {
        if (error instanceof ApiError && error.message === 'VERIFICATION_REQUIRED') {
          window.location.assign(`/login?verify=${error.method === 'totp' ? 'totp' : 'email'}`)
          return
        }
        if (error instanceof ApiError && error.message === 'Invalid Supabase session') {
          throw new Error('Tu sesión expiró. Inicia sesión nuevamente.', { cause: error })
        }
        throw error
      }
    },
    [applySession, state.supabaseAccessToken],
  )

  const logout = useCallback(async () => {
    authEpoch.current += 1
    loggingOut.current = true
    try {
      await aulaSessionInFlight?.catch(() => undefined)
      await logoutService()
      clearAuthState()
    } finally {
      loggingOut.current = false
    }
  }, [clearAuthState])

  const value = useMemo<AuthContextValue>(() => {
    const roles = state.roles
    const permissions = state.permissions

    return {
      ...state,
      isAuthenticated: Boolean(state.user),
      schoolId: state.appUser?.schoolId ?? null,
      login,
      register,
      loginWithProvider,
      finishOAuthCallback,
      completeOnboarding,
      logout,
      refreshAuth: () => loadAuthState(),
      hasRole: (roleKeys: UserRole[]) =>
        roles.some((role: Role) => roleKeys.includes(role.key)),
      hasPermission: (permissionKey: string) =>
        permissions.some(
          (permission: Permission) => permission.key === permissionKey,
        ),
    }
  }, [completeOnboarding, finishOAuthCallback, loadAuthState, login, loginWithProvider, logout, register, state])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
