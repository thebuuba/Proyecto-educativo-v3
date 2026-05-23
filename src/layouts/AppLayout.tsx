import { useCallback, useState } from 'react'
import { Outlet } from 'react-router-dom'

import { Header } from '@/components/navigation/Header'
import { Sidebar } from '@/components/navigation/Sidebar'
import { cn } from '@/utils/cn'

const STORAGE_KEY = 'aula-base:sidebar-collapsed'

function getInitialCollapsed(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'true'
  } catch {
    return false
  }
}

export function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(getInitialCollapsed)

  const handleToggleCollapse = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem(STORAGE_KEY, String(next))
      } catch { /* localStorage may throw in private mode */ }
      return next
    })
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <Sidebar
          collapsed={collapsed}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onToggleCollapse={handleToggleCollapse}
        />

        <div className={cn(
          'min-w-0 flex-1 transition-all duration-200',
          collapsed ? 'lg:pl-16' : 'lg:pl-72',
        )}>
          <Header onOpenSidebar={() => setIsSidebarOpen(true)} />

          <main className="px-4 py-5 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
