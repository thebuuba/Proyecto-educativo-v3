import type { ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { AuthContext, type AuthContextValue } from '@/modules/auth/context/AuthContext'
import {
  getCurrentAppUser,
  getCurrentSession,
  getUserPermissions,
  getUserRoles,
  login as loginWithPassword,
  logout as signOut,
} from '@/modules/auth/services/authService'
import type {
  AuthState,
  LoginCredentials,
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
}

type LoadAuthStateOptions = {
  showLoading?: boolean
  throwOnError?: boolean
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>(initialState)
  const skipNextAuthEventRef = useRef(false)

  const clearAuthState = useCallback(() => {
    setState({
      user: null,
      session: null,
      appUser: null,
      roles: [],
      permissions: [],
      loading: false,
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
        throw new Error(
          'Tu cuenta existe en Supabase Auth, pero no tiene un perfil activo en Aula Base.',
        )
      }

      const roles = appUser ? await getUserRoles(appUser.id) : []

      if (roles.length === 0) {
        throw new Error(
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
      })
    } catch (error) {
      console.error(error)
      clearAuthState()

      if (options?.throwOnError) {
        throw error
      }
    }
  }, [clearAuthState])

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return undefined
    }

    const { data } = supabase.auth.onAuthStateChange(() => {
      if (skipNextAuthEventRef.current) {
        skipNextAuthEventRef.current = false
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

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      skipNextAuthEventRef.current = true
      await loginWithPassword(credentials)
      await loadAuthState({ showLoading: true, throwOnError: true })
    },
    [loadAuthState],
  )

  const logout = useCallback(async () => {
    skipNextAuthEventRef.current = true
    await signOut()
    clearAuthState()
  }, [clearAuthState])

  const value = useMemo<AuthContextValue>(() => {
    const roles = state.roles
    const permissions = state.permissions

    return {
      ...state,
      isAuthenticated: Boolean(state.user && state.session),
      login,
      logout,
      refreshAuth: () => loadAuthState(),
      hasRole: (roleKeys: UserRole[]) =>
        roles.some((role: Role) => roleKeys.includes(role.key)),
      hasPermission: (permissionKey: string) =>
        permissions.some(
          (permission: Permission) => permission.key === permissionKey,
        ),
    }
  }, [loadAuthState, login, logout, state])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
