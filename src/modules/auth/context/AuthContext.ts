import { createContext } from 'react'

import type { AuthState, LoginCredentials, OAuthProvider } from '@/modules/auth/types/auth'
import type { UserRole } from '@/types/domain'

export type AuthContextValue = AuthState & {
  isAuthenticated: boolean
  schoolId: string | null
  login: (credentials: LoginCredentials) => Promise<void>
  loginWithOAuth: (provider: OAuthProvider) => Promise<void>
  logout: () => Promise<void>
  refreshAuth: () => Promise<void>
  hasRole: (roleKeys: UserRole[]) => boolean
  // Los permisos se cargan desde base de datos y no existe aún un catálogo
  // TypeScript cerrado generado desde Supabase. Por eso se acepta string.
  hasPermission: (permissionKey: string) => boolean
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
