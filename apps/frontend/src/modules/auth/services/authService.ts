import { api } from '@/services/apiClient'
import type {
  AuthUser,
  LoginCredentials,
  LoginResponse,
  Permission,
  RegisterCredentials,
  Role,
} from '@/modules/auth/types/auth'

export async function login({ email, password }: LoginCredentials): Promise<LoginResponse> {
  return api.post<LoginResponse>('/auth/login', { email, password })
}

export async function register(credentials: RegisterCredentials): Promise<LoginResponse> {
  return api.post<LoginResponse>('/auth/register', credentials)
}

export async function logout(): Promise<void> {
  localStorage.removeItem('auth_token')
}

export async function getProfile(): Promise<AuthUser> {
  return api.get<AuthUser>('/auth/profile')
}

export async function getUserRoles(appUserId: string): Promise<Role[]> {
  return api.get<Role[]>(`/users/${appUserId}/roles`)
}

export async function getUserPermissions(roles: Role[]): Promise<Permission[]> {
  const roleIds = roles.map((r) => r.id)
  if (roleIds.length === 0) return []
  return api.get<Permission[]>(`/users/permissions?roleIds=${roleIds.join(',')}`)
}
