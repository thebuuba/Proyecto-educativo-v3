import { Navigate, useLocation } from 'react-router-dom'
import type { ReactElement } from 'react'

import { useAuth } from '@/modules/auth/hooks/useAuth'
import type { UserRole } from '@/types/domain'

type RequireAuthProps = {
  allowedRoles: UserRole[]
  children: ReactElement
}

export function RequireAuth({ allowedRoles, children }: RequireAuthProps) {
  const { hasRole, isAuthenticated, loading } = useAuth()
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

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!hasRole(allowedRoles)) {
    return <Navigate to="/sin-acceso" replace />
  }

  return children
}
