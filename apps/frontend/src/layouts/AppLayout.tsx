/**
 * Layout principal de la aplicación con barra lateral y encabezado.
 */
import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import { Header } from '@/components/navigation/Header'
import { Sidebar } from '@/components/navigation/Sidebar'

/**
 * Estructura de layout que combina Sidebar, Header y el contenido
 * renderizado por las rutas anidadas (Outlet).
 * Controla el estado de apertura/cierre de la barra lateral.
 */
export function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarPinned, setIsSidebarPinned] = useState(false)

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="flex min-h-screen min-w-0">
        <Sidebar
          isOpen={isSidebarOpen}
          isPinned={isSidebarPinned}
          onClose={() => setIsSidebarOpen(false)}
          onTogglePinned={() => setIsSidebarPinned((current) => !current)}
        />

        <div className={isSidebarPinned ? 'min-w-0 flex-1 lg:pl-[260px]' : 'min-w-0 flex-1 lg:pl-[88px]'}>
          <Header onOpenSidebar={() => setIsSidebarOpen(true)} />

          <main className="content-density-compact min-w-0 px-4 py-5 sm:px-6 lg:px-10 lg:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
