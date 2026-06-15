/**
 * Servicio de autenticación — Funciones para gestionar inicio de sesión,
 * registro, cierre de sesión y obtención de perfil, roles y permisos.
 */

import { api } from '@/services/apiClient'
import type {
  AuthUser,
  LoginCredentials,
  LoginResponse,
  Permission,
  RegisterCredentials,
  Role,
} from '@/modules/auth/types/auth'

/** Inicia sesión con correo y contraseña. */
export async function login({ email, password }: LoginCredentials): Promise<LoginResponse> {
  return api.post<LoginResponse>('/auth/login', { email, password })
}

/** Registra una nueva institución con los datos del administrador. */
export async function register(credentials: RegisterCredentials): Promise<LoginResponse> {
  return api.post<LoginResponse>('/auth/register', credentials)
}

/** Cierra la sesión eliminando el token del almacenamiento local. */
export async function logout(): Promise<void> {
  localStorage.removeItem('auth_token')
}

/** Obtiene el perfil del usuario autenticado. */
export async function getProfile(): Promise<AuthUser> {
  return api.get<AuthUser>('/auth/profile')
}

/** Obtiene los roles asignados a un usuario. */
export async function getUserRoles(appUserId: string): Promise<Role[]> {
  return api.get<Role[]>(`/users/${appUserId}/roles`)
}

/** Obtiene los permisos asociados a una lista de roles. */
export async function getUserPermissions(roles: Role[]): Promise<Permission[]> {
  const roleIds = roles.map((r) => r.id)
  if (roleIds.length === 0) return []
  return api.get<Permission[]>(`/users/permissions?roleIds=${roleIds.join(',')}`)
}
