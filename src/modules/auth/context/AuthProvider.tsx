import type { ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { AuthContext, type AuthContextValue } from '@/modules/auth/context/AuthContext'
import {
  getCurrentAppUser,
  getCurrentSession,
  getUserPermissions,
  getUserRoles,
  login as loginWithPassword,
  loginWithOAuth as loginWithOAuthService,
  logout as signOut,
} from '@/modules/auth/services/authService'
import type {
  AuthState,
  LoginCredentials,
  OAuthProvider,
  Permission,
  Role,
} from '@/modules/auth/types/auth'
import { isSupabaseConfigured, supabase } from '@/services/supabase'
import type { UserRole } from '@/types/domain'

type AuthProviderProps = {
  children: ReactNode
}

const initialState: AuthState = {
  user: null,
  session: null,
  appUser: null,
  roles: [],
  permissions: [],
  loading: isSupabaseConfigured,
  authError: null,
  needsProfile: false,
}

type LoadAuthStateOptions = {
  showLoading?: boolean
  throwOnError?: boolean
}

type AuthStateErrorKind =
  | 'missing_profile'
  | 'missing_roles'
  | 'load_failed'
  | 'inactive_user'

class AuthStateError extends Error {
  kind: AuthStateErrorKind

  constructor(kind: AuthStateErrorKind, message: string) {
    super(message)
    this.name = 'AuthStateError'
    this.kind = kind
  }
}

type PendingAuthEvent = {
  resolve: () => void
  reject: (error: unknown) => void
}

function normalizeAuthStateError(error: unknown) {
  if (error instanceof AuthStateError) {
    return error
  }

  return new AuthStateError(
    'load_failed',
    'No se pudo cargar tu perfil, roles o permisos. Revisa tu conexión e inténtalo de nuevo.',
  )
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>(initialState)
  const skipNextAuthEventRef = useRef(false)
  const pendingAuthEventRef = useRef<PendingAuthEvent | null>(null)

  const clearAuthState = useCallback((authError: string | null = null) => {
    setState({
      user: null,
      session: null,
      appUser: null,
      roles: [],
      permissions: [],
      loading: false,
      authError,
      needsProfile: false,
    })
  }, [])

  const loadAuthState = useCallback(async (options?: LoadAuthStateOptions) => {
    const showLoading = options?.showLoading ?? true

    if (showLoading) {
      setState((current) => ({ ...current, loading: true }))
    }

    if (!isSupabaseConfigured) {
      clearAuthState()
      return
    }

    try {
      const session = await getCurrentSession()
      const user = session?.user ?? null

      if (!user) {
        clearAuthState()
        return
      }

      const appUser = await getCurrentAppUser(user.id)

      if (!appUser) {
        setState((current) => ({
          ...current,
          user,
          session,
          appUser: null,
          roles: [],
          permissions: [],
          loading: false,
          authError: null,
          needsProfile: true,
        }))
        return
      }

      if (appUser.status !== 'active') {
        throw new AuthStateError(
          'inactive_user',
          'Tu perfil de Aula Base está inactivo. Contacta al administrador.',
        )
      }

      let roles: Role[]

      const cachedRoles = sessionStorage.getItem('auth_roles')
      const cachedRolesTs = sessionStorage.getItem('auth_roles_ts')

      if (cachedRoles && cachedRolesTs && Date.now() - Number(cachedRolesTs) < 5 * 60 * 1000) {
        roles = JSON.parse(cachedRoles)
      } else {
        roles = await getUserRoles(appUser.id)
        sessionStorage.setItem('auth_roles', JSON.stringify(roles))
        sessionStorage.setItem('auth_roles_ts', String(Date.now()))
      }

      if (roles.length === 0) {
        throw new AuthStateError(
          'missing_roles',
          'Tu perfil no tiene roles activos asignados. Contacta al administrador.',
        )
      }

      const permissions = await getUserPermissions(roles)

      setState({
        user,
        session,
        appUser,
        roles,
        permissions,
        loading: false,
        authError: null,
        needsProfile: false,
      })
    } catch (error) {
      console.error(error)
      const authStateError = normalizeAuthStateError(error)

      if (options?.throwOnError) {
        clearAuthState(authStateError.message)
        throw authStateError
      }

      clearAuthState(authStateError.message)
    }
  }, [clearAuthState])

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return undefined
    }

    const { data } = supabase.auth.onAuthStateChange(() => {
      if (skipNextAuthEventRef.current) {
        skipNextAuthEventRef.current = false
        const pendingAuthEvent = pendingAuthEventRef.current
        pendingAuthEventRef.current = null

        window.setTimeout(() => {
          loadAuthState({
            showLoading: false,
            throwOnError: Boolean(pendingAuthEvent),
          })
            .then(() => pendingAuthEvent?.resolve())
            .catch((error: unknown) => pendingAuthEvent?.reject(error))
        }, 0)

        return
      }

      window.setTimeout(() => {
        void loadAuthState({ showLoading: false })
      }, 0)
    })

    return () => {
      data.subscription.unsubscribe()
    }
  }, [clearAuthState, loadAuthState])

  const waitForAuthEvent = useCallback(() => {
    let authEventSettled = false

    const authEventPromise = new Promise<boolean>((resolve, reject) => {
      pendingAuthEventRef.current = {
        resolve: () => {
          authEventSettled = true
          resolve(true)
        },
        reject: (error: unknown) => {
          authEventSettled = true
          reject(error)
        },
      }
    })

    const timeoutPromise = new Promise<boolean>((resolve) => {
      window.setTimeout(() => resolve(false), 750)
    })

    return Promise.race([authEventPromise, timeoutPromise]).finally(() => {
      if (!authEventSettled) {
        pendingAuthEventRef.current = null
        skipNextAuthEventRef.current = false
      }
    })
  }, [])

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      skipNextAuthEventRef.current = true
      const authEventHandled = waitForAuthEvent()

      try {
        await loginWithPassword(credentials)
        const handledByAuthEvent = await authEventHandled

        if (!handledByAuthEvent) {
          await loadAuthState({ showLoading: true, throwOnError: true })
        }
      } catch (error) {
        void authEventHandled.catch(() => undefined)
        throw error
      } finally {
        skipNextAuthEventRef.current = false
        pendingAuthEventRef.current = null
      }
    },
    [loadAuthState, waitForAuthEvent],
  )

  const loginWithOAuth = useCallback(async (provider: OAuthProvider) => {
    await loginWithOAuthService(provider)
  }, [])

  const logout = useCallback(async () => {
    skipNextAuthEventRef.current = true
    const authEventHandled = waitForAuthEvent()

    try {
      await signOut()
      const handledByAuthEvent = await authEventHandled

      if (!handledByAuthEvent) {
        clearAuthState()
      }
    } catch (error) {
      void authEventHandled.catch(() => undefined)
      throw error
    } finally {
      skipNextAuthEventRef.current = false
      pendingAuthEventRef.current = null
    }
  }, [clearAuthState, waitForAuthEvent])

  const value = useMemo<AuthContextValue>(() => {
    const roles = state.roles
    const permissions = state.permissions

    return {
      ...state,
      isAuthenticated: Boolean(state.user && state.session),
      schoolId: state.appUser?.school_id ?? null,
      login,
      loginWithOAuth,
      logout,
      refreshAuth: () => loadAuthState({ throwOnError: true }),
      hasRole: (roleKeys: UserRole[]) =>
        roles.some((role: Role) => roleKeys.includes(role.key)),
      hasPermission: (permissionKey: string) =>
        permissions.some(
          (permission: Permission) => permission.key === permissionKey,
        ),
    }
  }, [loadAuthState, login, loginWithOAuth, logout, state])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


