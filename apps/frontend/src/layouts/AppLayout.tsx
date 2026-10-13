/**
 * Layout principal de la aplicación con barra lateral y encabezado.
 */
import { useLayoutEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { Header } from '@/components/navigation/Header'
import { Sidebar } from '@/components/navigation/Sidebar'
import { GuidedTourProvider } from '@/modules/onboarding/GuidedTourProvider'
import { setSidebarExpanded, useInterfacePreferences, useReducedMotion } from '@/hooks/useInterfacePreferences'
import { cn } from '@/utils/cn'

/**
 * Estructura de layout que combina Sidebar, Header y el contenido
 * renderizado por las rutas anidadas (Outlet).
 */
export function AppLayout() {
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { sidebarExpanded: isSidebarExpanded } = useInterfacePreferences()
  const reducedMotion = useReducedMotion()
  const activeModule = location.pathname.split('/').filter(Boolean)[0] ?? 'inicio'

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [location.pathname])

  useLayoutEffect(() => {
    document.documentElement.dataset.reducedMotion = String(reducedMotion)
    if (reducedMotion) document.getAnimations?.().forEach((animation) => animation.cancel())
  }, [reducedMotion])

  return (
    <GuidedTourProvider>
      <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
        <div className="flex min-h-screen min-w-0">
          <Sidebar
            isOpen={isSidebarOpen}
            isExpanded={isSidebarExpanded}
            onClose={() => setIsSidebarOpen(false)}
          />

          <div
            className={cn(
              'sidebar-workspace min-w-0 flex-1',
              isSidebarExpanded ? 'lg:pl-[256px]' : 'lg:pl-20',
            )}
          >
            <Header
              onOpenSidebar={() => setIsSidebarOpen(true)}
              isSidebarExpanded={isSidebarExpanded}
              onToggleSidebar={() => setSidebarExpanded(!isSidebarExpanded)}
            />

            <main
              data-module={activeModule}
              data-route={location.pathname}
              className="app-main content-density-compact min-w-0 px-4 sm:px-6 lg:px-8"
            >
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </GuidedTourProvider>
  )
}
