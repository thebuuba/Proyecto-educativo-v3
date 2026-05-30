import type { RecordStatus, UserRole } from '@/types/domain'

export type AppUser = {
  id: string
  authUserId: string
  schoolId: string
  fullName: string
  email: string
  phone: string | null
  avatarUrl: string | null
  lastLoginAt: string | null
  status: RecordStatus
  createdAt: string
  updatedAt: string
}

export type AuthUser = {
  id: string
  email: string
}

export type Permission = {
  id: string
  key: string
  name: string
  description: string | null
  status: RecordStatus
}

export type Role = {
  id: string
  key: UserRole
  name: string
  description: string | null
  status: RecordStatus
}

export type AuthState = {
  user: AuthUser | null
  token: string | null
  appUser: AppUser | null
  roles: Role[]
  permissions: Permission[]
  loading: boolean
  authError: string | null
  needsProfile: boolean
}

export type LoginCredentials = {
  email: string
  password: string
}

export type OAuthProvider = 'google' | 'facebook'

export type LoginResponse = {
  user: AuthUser
  token: string
  appUser: AppUser
  roles: Role[]
  permissions: Permission[]
}
