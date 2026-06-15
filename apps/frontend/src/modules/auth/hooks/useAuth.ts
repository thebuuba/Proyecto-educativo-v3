/**
 * Hook useAuth — Accede al contexto de autenticación.
 * Debe ser usado dentro de un AuthProvider.
 */

import { useContext } from 'react'

import { AuthContext } from '@/modules/auth/context/AuthContext'

/** Hook que retorna el contexto de autenticación. Lanza error si se usa fuera de AuthProvider. */
export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider.')
  }

  return context
}
