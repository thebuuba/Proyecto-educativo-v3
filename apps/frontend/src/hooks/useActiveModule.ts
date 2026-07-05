/**
 * Hook que determina el módulo activo según la ruta actual.
 */
import { useLocation } from 'react-router-dom'

import { navigationRoutes } from '@/routes/appRoutes'

/**
 * Obtiene la ruta de navegación correspondiente a la ubicación actual.
 * Compara el pathname con las rutas definidas en navigationRoutes.
 *
 * @returns La ruta activa o la primera ruta si no hay coincidencia.
 */
export function useActiveModule() {
  const { pathname } = useLocation()

  return (
    navigationRoutes.find((item) =>
      item.path === '/inicio' ? pathname === '/inicio' : pathname.startsWith(item.path),
    ) ?? navigationRoutes[0]
  )
}
