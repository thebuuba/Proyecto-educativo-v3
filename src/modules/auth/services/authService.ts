import type { Session, User } from '@supabase/supabase-js'

import { supabase } from '@/services/supabase'
import type {
  AppUser,
  LoginCredentials,
  Permission,
  Role,
} from '@/modules/auth/types/auth'
import type { UserRole } from '@/types/domain'

type RolePermissionRow = {
  permissions: Permission | Permission[] | null
}

type UserRoleRow = {
  roles: Role | Role[] | null
}

function firstOrNull<T>(value: T | T[] | null): T | null {
  return Array.isArray(value) ? (value[0] ?? null) : value
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

export async function getCurrentUser(): Promise<User | null> {
  const session = await getCurrentSession()

  if (!session) {
    return null
  }

  const { data, error } = await supabase.auth.getUser()

  if (error) {
    throw error
  }

  return data.user
}

export async function getCurrentAppUser(
  authUserId?: string,
): Promise<AppUser | null> {
  const userId = authUserId ?? (await getCurrentUser())?.id

  if (!userId) {
    return null
  }

  const { data, error } = await supabase
    .from('app_users')
    .select('*')
    .eq('auth_user_id', userId)
    .eq('status', 'active')
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

export function hasRole(roles: Role[], allowedRoles: UserRole[]) {
  return roles.some((role) => allowedRoles.includes(role.key))
}

export function hasPermission(permissions: Permission[], permissionKey: string) {
  return permissions.some((permission) => permission.key === permissionKey)
}
