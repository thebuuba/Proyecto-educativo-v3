import type { ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { AuthContext, type AuthContextValue } from '@/modules/auth/context/AuthContext'
import {
  login as loginService,
  register as registerService,
  logout as logoutService,
  getProfile,
  getUserRoles,
  getUserPermissions,
} from '@/modules/auth/services/authService'
import { getAuthToken, setAuthToken } from '@/services/apiClient'
import type {
  AppUser,
  AuthState,
  AuthUser,
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

const initialState: AuthState = {
  user: null,
  token: null,
  appUser: null,
  roles: [],
  permissions: [],
  loading: true,
  authError: null,
  needsProfile: false,
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>(initialState)

  const clearAuthState = useCallback((authError: string | null = null) => {
    setAuthToken(null)
    setState({
      user: null,
      token: null,
      appUser: null,
      roles: [],
      permissions: [],
      loading: false,
      authError,
      needsProfile: false,
    })
  }, [])

  const loadAuthState = useCallback(async () => {
    const token = getAuthToken()
    if (!token) {
      clearAuthState()
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
      const permissions: Permission[] = await getUserPermissions(roles)

      setState({
        user,
        token,
        appUser,
        roles,
        permissions,
        loading: false,
        authError: null,
        needsProfile: false,
      })
    } catch (error) {
      console.error(error)
      clearAuthState(
        'No se pudo cargar tu perfil. Revisa tu conexión e inténtalo de nuevo.',
      )
    }
  }, [clearAuthState])

  useEffect(() => {
    void loadAuthState()
  }, [loadAuthState])

  const applySession = useCallback((response: LoginResponse) => {
    setAuthToken(response.token)
    setState({
      user: response.user,
      token: response.token,
      appUser: response.appUser,
      roles: response.roles,
      permissions: response.permissions,
      loading: false,
      authError: null,
      needsProfile: false,
    })
  }, [])

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      applySession(await loginService(credentials))
    },
    [applySession],
  )

  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      applySession(await registerService(credentials))
    },
    [applySession],
  )

  const loginWithOAuth = useCallback(async (_provider: string) => {
    throw new Error('OAuth login not yet supported with JWT auth')
  }, [])

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
      loginWithOAuth,
      logout,
      refreshAuth: () => loadAuthState(),
      hasRole: (roleKeys: UserRole[]) =>
        roles.some((role: Role) => roleKeys.includes(role.key)),
      hasPermission: (permissionKey: string) =>
        permissions.some(
          (permission: Permission) => permission.key === permissionKey,
        ),
    }
  }, [loadAuthState, login, loginWithOAuth, logout, register, state])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
