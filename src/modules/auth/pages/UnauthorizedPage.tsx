import { ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'

import { useAuth } from '@/modules/auth/hooks/useAuth'

export function UnauthorizedPage() {
  const { logout } = useAuth()

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
        <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
          <ShieldAlert className="size-6" />
        </div>
        <h1 className="mt-5 text-xl font-semibold text-slate-950">
          Acceso no autorizado
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Tu usuario no tiene permisos para ver esta sección. Contacta al
          administrador si necesitas acceso.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-cyan-700 px-4 text-sm font-semibold text-white hover:bg-cyan-800"
          >
            Volver al inicio
          </Link>
          <button
            type="button"
            onClick={() => void logout()}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cerrar sesión
          </button>
        </div>
      </section>
    </main>
  )
}
