/**
 * Proveedor de autenticaciÃ³n â€” Componente que envuelve la aplicaciÃ³n y
 * provee el estado de autenticaciÃ³n, los mÃ©todos para iniciar/cerrar sesiÃ³n,
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
  getProfile,
  getUserRoles,
  getUserPermissions,
} from '@/modules/auth/services/authService'
import { ApiError, getAuthToken, setAuthToken } from '@/services/apiClient'
import { supabase } from '@/modules/auth/services/supabaseClient'
import type {
  AppUser,
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
let oauthCallbackPromise: Promise<void> | null = null

const initialState: AuthState = {
  user: null,
  token: null,
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
 * Componente proveedor de autenticaciÃ³n.
 * Gestiona el estado de sesiÃ³n, carga el perfil al montar y expone
 * funciones para login, register, logout y verificaciÃ³n de roles/permisos.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>(initialState)

  /** Limpia el estado de autenticaciÃ³n y elimina el token. */
  const clearAuthState = useCallback((authError: string | null = null) => {
    setAuthToken(null)
    setState({
      user: null,
      token: null,
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

  /** Aplica los datos de una sesiÃ³n (login o registro) al estado global. */
  const applySession = useCallback(async (response: LoginResponse, checkOnboarding = true) => {
    setAuthToken(response.token)
    const onboardingComplete = checkOnboarding
      ? await getOnboardingStatus().then((status) => status.complete).catch(() => null)
      : null
    setState({
      user: response.user,
      token: response.token,
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
    const { data } = await supabase.auth.getSession()
    const supabaseToken = data.session?.access_token ?? null
    if (!supabaseToken) return false

    try {
      await applySession(await createAulaSession(supabaseToken))
      return true
    } catch (error) {
      if (error instanceof ApiError && error.message === 'PROFILE_REQUIRED') {
        setAuthToken(null)
        setState({
          user: null,
          token: null,
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

  /** Carga el estado de autenticaciÃ³n desde el servidor (perfil, roles, permisos). */
  const loadAuthState = useCallback(async () => {
    const token = getAuthToken()
    if (!token) {
      if (!await restoreFromSupabaseSession()) clearAuthState()
      return
    }

    setState((current) => ({ ...current, loading: true }))

    try {
      const appUser = await getProfile() as unknown as AppUser

      if (!appUser) {
        clearAuthState()
        return
      }

      const user: AuthUser = { id: appUser.id, email: appUser.email }
      const roles: Role[] = await getUserRoles(appUser.id)
      const [permissions, onboardingStatus] = await Promise.all([
        getUserPermissions(roles),
        getOnboardingStatus().catch(() => null),
      ])

      setState({
        user,
        token,
        supabaseAccessToken: null,
        appUser,
        roles,
        permissions,
        loading: false,
        authError: null,
        profileRequired: false,
        onboardingComplete: onboardingStatus?.complete ?? null,
      })
    } catch (error) {
      console.error(error)
      if (!await restoreFromSupabaseSession()) {
        clearAuthState(
          'No se pudo cargar tu perfil. Revisa tu conexiÃ³n e intÃ©ntalo de nuevo.',
        )
      }
    }
  }, [clearAuthState, restoreFromSupabaseSession])

  useEffect(() => {
    void loadAuthState()
  }, [loadAuthState])

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
      try {
        await applySession(await registerService(credentials))
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

  const loginWithProvider = useCallback((provider: 'google' | 'facebook') => {
    return loginWithProviderService(provider)
  }, [])

  const finishOAuthCallback = useCallback(async () => {
    const href = window.location.href
    const code = new URL(href).searchParams.get('code')

    if (!code) {
      if (await restoreFromSupabaseSession()) return
      throw new Error('No se pudo completar el inicio social.')
    }

    if (oauthCallbackHrefInFlight === href && oauthCallbackPromise) return oauthCallbackPromise

    oauthCallbackHrefInFlight = href
    oauthCallbackPromise = (async () => {
      const supabaseToken = await exchangeOAuthCode(code)
      window.history.replaceState({}, '', '/auth/callback')
      try {
        await applySession(await createAulaSession(supabaseToken))
      } catch (error) {
        if (error instanceof ApiError && error.message === 'PROFILE_REQUIRED') {
          setState({
            user: null,
            token: null,
            supabaseAccessToken: supabaseToken,
            appUser: null,
            roles: [],
            permissions: [],
            loading: false,
            authError: null,
            profileRequired: true,
            onboardingComplete: false,
          })
          return
        }
        throw error
      }
    })()

    try {
      await oauthCallbackPromise
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
      isAuthenticated: Boolean(state.token && state.user),
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
