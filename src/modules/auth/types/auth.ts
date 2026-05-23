import type { Session, User } from '@supabase/supabase-js'

import type { RecordStatus, UserRole } from '@/types/domain'

export type AppUser = {
  id: string
  auth_user_id: string
  school_id: string
  full_name: string
  email: string
  phone: string | null
  avatar_url: string | null
  last_login_at: string | null
  status: RecordStatus
  created_at: string
  updated_at: string
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
  user: User | null
  session: Session | null
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
