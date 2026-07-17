import { ApiError } from '@/services/apiClient'

/**
 * Los fallos de red y del servidor durante el arranque suelen ocurrir mientras
 * el backend despierta. No deben quedar fijados como un error del perfil en la
 * pantalla de acceso; la siguiente recarga podrá restaurar la sesión.
 */
export function shouldReportBootstrapFailure(error: unknown) {
  if (error instanceof TypeError) return false
  if (error instanceof ApiError && error.status >= 500) return false
  return true
}
