/**
 * Componente RequireAuth — Protege rutas verificando autenticación y roles.
 * Redirige a /login si no hay sesión, a /sin-acceso si no tiene el rol requerido.
 */

import { Navigate, useLocation } from 'react-router-dom'
import type { ReactElement } from 'react'

import { useAuth } from '@/modules/auth/hooks/useAuth'
import type { UserRole } from '@/types/domain'

type RequireAuthProps = {
  /** Lista de roles permitidos para acceder a la ruta. */
  allowedRoles: UserRole[]
  /** Componente hijo que se renderiza si está autorizado. */
  children: ReactElement
}

/**
 * Componente de guardia de ruta.
 * Muestra un estado de carga mientras se verifica la sesión, redirige al login
 * si no hay autenticación, o a /sin-acceso si el rol no está permitido.
 */
export function RequireAuth({ allowedRoles, children }: RequireAuthProps) {
  const { hasRole, isAuthenticated, loading, onboardingComplete, profileRequired } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="rounded-lg border border-border bg-card px-5 py-4 text-sm font-medium text-foreground shadow-sm">
          Cargando sesión...
        </div>
      </div>
    )
  }

  if (profileRequired || (isAuthenticated && onboardingComplete === false)) {
    return <Navigate to="/onboarding" replace />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!hasRole(allowedRoles)) {
    return <Navigate to="/sin-acceso" replace />
  }

  return children
}
