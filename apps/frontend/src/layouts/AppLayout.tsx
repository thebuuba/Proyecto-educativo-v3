/**
 * Layout principal de la aplicación con barra lateral y encabezado.
 */
import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { Header } from '@/components/navigation/Header'
import { Sidebar } from '@/components/navigation/Sidebar'
import { GuidedTourProvider } from '@/modules/onboarding/GuidedTourProvider'
import { cn } from '@/utils/cn'

/**
 * Estructura de layout que combina Sidebar, Header y el contenido
 * renderizado por las rutas anidadas (Outlet).
 */
export function AppLayout() {
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(
    () => localStorage.getItem('aulabase:sidebar-expanded') !== 'false',
  )
  const isGradingPage = location.pathname.startsWith('/calificaciones')
  const activeModule = location.pathname.split('/').filter(Boolean)[0] ?? 'inicio'

  useEffect(() => {
    localStorage.setItem('aulabase:sidebar-expanded', String(isSidebarExpanded))
  }, [isSidebarExpanded])

  return (
    <GuidedTourProvider>
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
          isSidebarExpanded ? 'lg:pl-[255px]' : 'lg:pl-[76px]',
        )}>
          <Header onOpenSidebar={() => setIsSidebarOpen(true)} />

          <main
            data-module={activeModule}
            data-route={location.pathname}
            className={cn(
              'content-density-compact min-w-0 px-4 sm:px-6 lg:px-8',
              isGradingPage ? 'py-3 lg:py-3' : 'py-5 lg:py-8',
            )}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </div>
    </GuidedTourProvider>
  )
}
