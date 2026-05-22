import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import { Header } from '@/components/navigation/Header'
import { Sidebar } from '@/components/navigation/Sidebar'

export function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div className="min-w-0 flex-1 lg:pl-72">
          <Header onOpenSidebar={() => setIsSidebarOpen(true)} />

          <main className="px-4 py-5 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
