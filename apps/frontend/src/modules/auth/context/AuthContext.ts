import { createContext } from 'react'

import type { AuthState, LoginCredentials, RegisterCredentials } from '@/modules/auth/types/auth'
import type { UserRole } from '@/types/domain'

export type AuthContextValue = AuthState & {
  isAuthenticated: boolean
  schoolId: string | null
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  loginWithOAuth: (provider: string) => Promise<void>
  logout: () => Promise<void>
  refreshAuth: () => Promise<void>
  hasRole: (roleKeys: UserRole[]) => boolean
  hasPermission: (permissionKey: string) => boolean
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
