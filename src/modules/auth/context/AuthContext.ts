import { createContext } from 'react'

import type { AuthState, LoginCredentials } from '@/modules/auth/types/auth'
import type { UserRole } from '@/types/domain'

export type AuthContextValue = AuthState & {
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  refreshAuth: () => Promise<void>
  hasRole: (roleKeys: UserRole[]) => boolean
  hasPermission: (permissionKey: string) => boolean
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
