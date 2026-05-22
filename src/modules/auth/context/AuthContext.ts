import { createContext } from 'react'

import type { AuthState, LoginCredentials } from '@/modules/auth/types/auth'

export type AuthContextValue = AuthState & {
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  refreshAuth: () => Promise<void>
  hasRole: (roleKeys: string[]) => boolean
  hasPermission: (permissionKey: string) => boolean
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
