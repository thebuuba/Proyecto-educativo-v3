/**
 * Módulo de autenticación — Tipos y constantes del sistema de autenticación.
 * Define las estructuras de datos para usuarios, roles, permisos y sesiones.
 */

import type { RecordStatus, UserRole } from '@/types/domain'

/** Usuario completo de la aplicación con datos del perfil institucional. */
export type AppUser = {
  /** Identificador único del usuario. */
  id: string
  /** Identificador del usuario en el sistema de autenticación. */
  authUserId: string
  /** Identificador de la escuela a la que pertenece. */
  schoolId: string
  /** Nombre completo del usuario. */
  fullName: string
  /** Correo electrónico del usuario. */
  email: string
  /** Número de teléfono del usuario (puede ser nulo). */
  phone: string | null
  /** URL del avatar del usuario (puede ser nulo). */
  avatarUrl: string | null
  /** Fecha y hora del último inicio de sesión (puede ser nulo). */
  lastLoginAt: string | null
  /** Estado del registro del usuario. */
  status: RecordStatus
  /** Fecha de creación del registro. */
  createdAt: string
  /** Fecha de la última actualización del registro. */
  updatedAt: string
}

/** Usuario de autenticación con datos mínimos de sesión. */
export type AuthUser = {
  id: string
  email: string
}

/** Permiso individual del sistema asociado a un rol. */
export type Permission = {
  id: string
  key: string
  name: string
  description: string | null
  status: RecordStatus
}

/** Rol de usuario dentro del sistema educativo. */
export type Role = {
  id: string
  key: UserRole
  name: string
  description: string | null
  status: RecordStatus
}

/** Estado global del módulo de autenticación. */
export type AuthState = {
  user: AuthUser | null
  token: string | null
  appUser: AppUser | null
  roles: Role[]
  permissions: Permission[]
  loading: boolean
  authError: string | null
}

/** Credenciales para iniciar sesión. */
export type LoginCredentials = {
  email: string
  password: string
}

/** Credenciales para registrar una nueva institución. */
export type RegisterCredentials = LoginCredentials & {
  schoolName: string
  fullName: string
  slug: string
}

/** Respuesta del servidor tras un inicio de sesión exitoso. */
export type LoginResponse = {
  user: AuthUser
  token: string
  appUser: AppUser
  roles: Role[]
  permissions: Permission[]
}
