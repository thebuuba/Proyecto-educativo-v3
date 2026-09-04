/** Página de error 403 — Acceso no autorizado. */
import { ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { useAuth } from '@/modules/auth/hooks/useAuth'

export function UnauthorizedPage() {
  const { logout } = useAuth()

  return (
    <main className="auth-screen flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <section className="dashboard-warm-shadow w-full max-w-md rounded-3xl bg-card p-7 text-center">
        <div className="relative mx-auto flex size-14 items-center justify-center rounded-2xl bg-warning/24 text-foreground">
          <ShieldAlert className="size-6" />
          <span className="absolute -right-1 -top-1 size-3 rounded-full bg-destructive" />
        </div>
        <h1 className="mt-5 text-2xl font-extrabold text-foreground">Acceso no autorizado</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Tu usuario no tiene permisos para ver esta sección. Contacta al administrador si necesitas acceso.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/inicio"><Button variant="primary">Volver al inicio</Button></Link>
          <Button variant="outline" onClick={() => void logout()}>Cerrar sesión</Button>
        </div>
      </section>
    </main>
  )
}
