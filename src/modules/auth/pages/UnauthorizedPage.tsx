import { ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { useAuth } from '@/modules/auth/hooks/useAuth'

export function UnauthorizedPage() {
  const { logout } = useAuth()

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <section className="w-full max-w-md rounded-lg border border-border bg-card p-6 text-center shadow-sm">
        <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-warning/14 text-warning">
          <ShieldAlert className="size-6" />
        </div>
        <h1 className="mt-5 text-xl font-semibold text-foreground">
          Acceso no autorizado
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Tu usuario no tiene permisos para ver esta sección. Contacta al
          administrador si necesitas acceso.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/">
            <Button variant="primary">Volver al inicio</Button>
          </Link>
          <Button variant="outline" onClick={() => void logout()}>
            Cerrar sesión
          </Button>
        </div>
      </section>
    </main>
  )
}
