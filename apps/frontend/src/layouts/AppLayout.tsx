/**
 * Layout principal de la aplicación con barra lateral y encabezado.
 */
import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { Header } from '@/components/navigation/Header'
import { Sidebar } from '@/components/navigation/Sidebar'
import { cn } from '@/utils/cn'

/**
 * Estructura de layout que combina Sidebar, Header y el contenido
 * renderizado por las rutas anidadas (Outlet).
 * Controla el estado de apertura/cierre de la barra lateral.
 */
export function AppLayout() {
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(
    () => localStorage.getItem('aulabase:sidebar-expanded') === 'true',
  )
  const isGradingPage = location.pathname.startsWith('/calificaciones')

  useEffect(() => {
    localStorage.setItem('aulabase:sidebar-expanded', String(isSidebarExpanded))
  }, [isSidebarExpanded])

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="flex min-h-screen min-w-0">
        <Sidebar
          isOpen={isSidebarOpen}
          isExpanded={isSidebarExpanded}
          onClose={() => setIsSidebarOpen(false)}
          onToggleExpanded={() => setIsSidebarExpanded((current) => !current)}
        />

        <div className={cn(
          'sidebar-workspace min-w-0 flex-1',
          isSidebarExpanded ? 'lg:pl-[260px]' : 'lg:pl-[88px]',
        )}>
          <Header onOpenSidebar={() => setIsSidebarOpen(true)} />

          <main
            className={cn(
              'content-density-compact min-w-0 px-4 sm:px-6 lg:px-10',
              isGradingPage ? 'py-3 lg:py-3' : 'py-5 lg:py-8',
            )}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
