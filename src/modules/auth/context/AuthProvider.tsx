import type { ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'

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

type AuthProviderProps = {
  children: ReactNode
}

const initialState: AuthState = {
  user: null,
  session: null,
  appUser: null,
  roles: [],
  permissions: [],
  loading: true,
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>(initialState)

  const loadAuthState = useCallback(async () => {
    setState((current) => ({ ...current, loading: true }))

    if (!isSupabaseConfigured) {
      setState({
        user: null,
        session: null,
        appUser: null,
        roles: [],
        permissions: [],
        loading: false,
      })
      return
    }

    try {
      const session = await getCurrentSession()
      const user = session?.user ?? null

      if (!user) {
        setState({
          user: null,
          session: null,
          appUser: null,
          roles: [],
          permissions: [],
          loading: false,
        })
        return
      }

      const appUser = await getCurrentAppUser(user.id)
      const roles = appUser ? await getUserRoles(appUser.id) : []
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
      setState({
        user: null,
        session: null,
        appUser: null,
        roles: [],
        permissions: [],
        loading: false,
      })
    }
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadAuthState()
    }, 0)

    if (!isSupabaseConfigured) {
      return () => {
        window.clearTimeout(timeoutId)
      }
    }

    const { data } = supabase.auth.onAuthStateChange(() => {
      window.setTimeout(() => {
        void loadAuthState()
      }, 0)
    })

    return () => {
      window.clearTimeout(timeoutId)
      data.subscription.unsubscribe()
    }
  }, [loadAuthState])

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      await loginWithPassword(credentials)
      await loadAuthState()
    },
    [loadAuthState],
  )

  const logout = useCallback(async () => {
    await signOut()
    setState({
      user: null,
      session: null,
      appUser: null,
      roles: [],
      permissions: [],
      loading: false,
    })
  }, [])

  const value = useMemo<AuthContextValue>(() => {
    const roles = state.roles
    const permissions = state.permissions

    return {
      ...state,
      isAuthenticated: Boolean(state.user && state.session),
      login,
      logout,
      refreshAuth: loadAuthState,
      hasRole: (roleKeys: string[]) =>
        roles.some((role: Role) => roleKeys.includes(role.key)),
      hasPermission: (permissionKey: string) =>
        permissions.some(
          (permission: Permission) => permission.key === permissionKey,
        ),
    }
  }, [loadAuthState, login, logout, state])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
