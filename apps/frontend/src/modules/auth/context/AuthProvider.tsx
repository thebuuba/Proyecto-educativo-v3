/**
 * Proveedor de autenticación: componente que envuelve la aplicación y
 * provee el estado de autenticación, los métodos para iniciar/cerrar sesión,
 * registrar, recargar el perfil y verificar roles/permisos.
 */

import type { ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'

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
import { ApiError } from '@/services/apiClient'
import { supabase } from '@/modules/auth/services/supabaseClient'
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

const ONBOARDING_CACHE_KEY = 'aulabase:onboarding-complete'

function getCachedOnboardingStatus(): boolean | null {
  const cached = localStorage.getItem(ONBOARDING_CACHE_KEY)
  if (cached === null) return null
  return cached === 'true'
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
  const applySession = useCallback(async (response: LoginResponse, checkOnboarding = true) => {
    const onboardingComplete = checkOnboarding
      ? (getCachedOnboardingStatus() ?? await getOnboardingStatus().then((status) => {
          setCachedOnboardingStatus(status.complete)
          return status.complete
        }).catch(() => null))
      : null
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
    const { data, error } = await supabase.auth.refreshSession()
    if (error) return false

    const supabaseToken = data.session?.access_token ?? null
    if (!supabaseToken) return false

    try {
      await applySession(await createAulaSession(supabaseToken))
      return true
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
        return true
      }
      return false
    }
  }, [applySession])

  /** Carga el estado de autenticación desde el servidor (perfil, roles, permisos). */
  const loadAuthState = useCallback(async () => {
    setState((current) => ({ ...current, loading: true }))

    try {
      const bootstrap = await getAuthBootstrap()
      const appUser = bootstrap?.appUser

      if (!appUser) {
        clearAuthState()
        return
      }

      const user: AuthUser = { id: appUser.id, email: appUser.email }
      const roles = bootstrap.roles
      const permissions = bootstrap.permissions
      const onboardingStatus = getCachedOnboardingStatus() ?? bootstrap.onboardingComplete
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
      console.error(error)
      if (!await restoreFromSupabaseSession()) {
        if (error instanceof ApiError && error.status === 401) {
          clearAuthState()
        } else {
          clearAuthState(
            'No se pudo cargar tu perfil. Revisa tu conexión e inténtalo de nuevo.',
          )
        }
      }
    }
  }, [clearAuthState, restoreFromSupabaseSession])

  useEffect(() => {
    void loadAuthState()
  }, [loadAuthState])

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'TOKEN_REFRESHED' && session?.access_token) {
        void createAulaSession(session.access_token)
          .then((response) => applySession(response, false))
      }
    })
    return () => data.subscription.unsubscribe()
  }, [applySession])

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        await applySession(await loginService(credentials))
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
      await registerService(credentials)
      const { data } = await supabase.auth.getSession()
      setState((current) => ({
        ...current,
        supabaseAccessToken: data.session?.access_token ?? null,
        loading: false,
        profileRequired: true,
        onboardingComplete: false,
        authError: null,
      }))
    },
    [],
  )

  const loginWithProvider = useCallback((provider: 'google' | 'facebook') => {
    return loginWithProviderService(provider)
  }, [])

  const finishOAuthCallback = useCallback(async () => {
    const href = window.location.href
    const code = new URL(href).searchParams.get('code')

    if (!code) {
      if (await restoreFromSupabaseSession()) return 'authenticated'
      throw new Error('No se pudo completar el inicio social.')
    }

    if (oauthCallbackHrefInFlight === href && oauthCallbackPromise) return oauthCallbackPromise

    oauthCallbackHrefInFlight = href
    oauthCallbackPromise = (async () => {
      const supabaseToken = await exchangeOAuthCode(code)
      window.history.replaceState({}, '', '/auth/callback')
      try {
        await applySession(await createAulaSession(supabaseToken))
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
        if (error instanceof ApiError && error.message === 'Invalid Supabase session') {
          throw new Error('Tu sesión expiró. Inicia sesión nuevamente.', { cause: error })
        }
        throw error
      }
    },
    [applySession, state.supabaseAccessToken],
  )

  const logout = useCallback(async () => {
    await logoutService()
    clearAuthState()
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
