/**
 * Contexto de autenticación — Define el contrato del contexto que provee
 * el estado de autenticación, el usuario, roles, permisos y las funciones
 * para iniciar/cerrar sesión, registrar y verificar roles/permisos.
 */

import { createContext } from 'react'

import type { AuthState, LoginCredentials, RegisterCredentials } from '@/modules/auth/types/auth'
import type { UserRole } from '@/types/domain'

/** Valor expuesto por el AuthContext con el estado y las funciones de autenticación. */
export type AuthContextValue = AuthState & {
  /** Indica si hay un usuario autenticado con token válido. */
  isAuthenticated: boolean
  /** Identificador de la escuela del usuario autenticado. */
  schoolId: string | null
  /** Inicia sesión con credenciales de correo y contraseña. */
  login: (credentials: LoginCredentials) => Promise<void>
  /** Registra una nueva institución. */
  register: (credentials: RegisterCredentials) => Promise<void>
  /** Cierra la sesión del usuario actual. */
  logout: () => Promise<void>
  /** Recarga el estado de autenticación desde el servidor. */
  refreshAuth: () => Promise<void>
  /** Verifica si el usuario tiene al menos uno de los roles indicados. */
  hasRole: (roleKeys: UserRole[]) => boolean
  /** Verifica si el usuario tiene un permiso específico. */
  hasPermission: (permissionKey: string) => boolean
}

/** Contexto de React para la autenticación. */
export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
