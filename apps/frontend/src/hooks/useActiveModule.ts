import { useLocation } from 'react-router-dom'

import { navigationRoutes } from '@/routes/appRoutes'

export function useActiveModule() {
  const { pathname } = useLocation()

  return (
    navigationRoutes.find((item) =>
      item.path === '/' ? pathname === '/' : pathname.startsWith(item.path),
    ) ?? navigationRoutes[0]
  )
}
