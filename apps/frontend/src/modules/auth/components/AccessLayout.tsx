import { GraduationCap } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function AccessLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:h-[72px] lg:px-[4vw]">
        <Link
          to="/"
          className="flex items-center gap-2.5 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          aria-label="Aula Base, inicio"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap size={21} aria-hidden="true" />
          </span>
          <span className="text-lg font-semibold tracking-tight">Aula Base</span>
        </Link>
        <Link to="/precios" className="inline-flex min-h-11 items-center text-sm font-medium text-primary hover:underline">Precios</Link>
      </header>
      <main>{children}</main>
    </div>
  )
}
