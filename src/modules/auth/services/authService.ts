import type { Session } from '@supabase/supabase-js'

import { supabase } from '@/services/supabase'
import { firstOrNull } from '@/utils/helpers'
import type {
  AppUser,
  LoginCredentials,
  Permission,
  Role,
} from '@/modules/auth/types/auth'

type RolePermissionRow = {
  permissions: Permission | Permission[] | null
}

type UserRoleRow = {
  roles: Role | Role[] | null
}

export async function login({ email, password }: LoginCredentials) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw error
  }

  return data
}

export async function loginWithOAuth(provider: 'google' | 'facebook') {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/login`,
    },
  })

  if (error) {
    throw error
  }

  return data
}

export async function forgotPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/login`,
  })

  if (error) {
    throw error
  }
}

export async function logout() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw error
  }
}

export async function getCurrentSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    throw error
  }

  return data.session
}

export async function getCurrentAppUser(
  authUserId: string,
): Promise<AppUser | null> {
  const { data, error } = await supabase
    .from('app_users')
    .select('*')
    .eq('auth_user_id', authUserId)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data as AppUser | null
}

export async function getUserRoles(appUserId: string): Promise<Role[]> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('roles(id, key, name, description, status)')
    .eq('user_id', appUserId)
    .eq('status', 'active')

  if (error) {
    throw error
  }

  return ((data ?? []) as UserRoleRow[])
    .map((row) => firstOrNull(row.roles))
    .filter((role): role is Role => {
      return role !== null && role.status === 'active'
    })
}

export async function getUserPermissions(roles: Role[]): Promise<Permission[]> {
  const roleIds = roles.map((role) => role.id)

  if (roleIds.length === 0) {
    return []
  }

  const { data, error } = await supabase
    .from('role_permissions')
    .select('permissions(id, key, name, description, status)')
    .in('role_id', roleIds)
    .eq('status', 'active')

  if (error) {
    throw error
  }

  const permissions = ((data ?? []) as RolePermissionRow[])
    .map((row) => firstOrNull(row.permissions))
    .filter((permission): permission is Permission => {
      return permission !== null && permission.status === 'active'
    })

  return Array.from(
    new Map(permissions.map((permission) => [permission.key, permission])).values(),
  )
}
