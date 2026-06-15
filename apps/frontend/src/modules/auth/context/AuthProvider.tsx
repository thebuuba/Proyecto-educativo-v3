/**
 * Proveedor de autenticación — Componente que envuelve la aplicación y
 * provee el estado de autenticación, los métodos para iniciar/cerrar sesión,
 * registrar, recargar el perfil y verificar roles/permisos.
 */

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
}

/**
 * Componente proveedor de autenticación.
 * Gestiona el estado de sesión, carga el perfil al montar y expone
 * funciones para login, register, logout y verificación de roles/permisos.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>(initialState)

  /** Limpia el estado de autenticación y elimina el token. */
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
    })
  }, [])

  /** Carga el estado de autenticación desde el servidor (perfil, roles, permisos). */
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

  /** Aplica los datos de una sesión (login o registro) al estado global. */
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
      logout,
      refreshAuth: () => loadAuthState(),
      hasRole: (roleKeys: UserRole[]) =>
        roles.some((role: Role) => roleKeys.includes(role.key)),
      hasPermission: (permissionKey: string) =>
        permissions.some(
          (permission: Permission) => permission.key === permissionKey,
        ),
    }
  }, [loadAuthState, login, logout, register, state])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
