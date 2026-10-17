import { Navigate } from 'react-router-dom'

/** Conserva los enlaces antiguos usando el nuevo perfil de Ajustes. */
export function ProfilePage() {
  return <Navigate to="/configuracion?tab=cuenta" replace />
}
