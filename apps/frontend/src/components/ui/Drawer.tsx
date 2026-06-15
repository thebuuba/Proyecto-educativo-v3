/**
 * Panel lateral deslizable desde la derecha.
 */
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/Button'

/** Propiedades del componente Drawer. */
type DrawerProps = {
  /** Título del panel. */
  title: string
  /** Texto secundario sobre el título. */
  eyebrow?: string
  /** Contenido del panel. */
  children: ReactNode
  /** Función llamada al cerrar el panel. */
  onClose: () => void
}

/**
 * Drawer lateral que se superpone desde el borde derecho,
 * con encabezado fijo y área de contenido desplazable.
 *
 * @param props.title - Título del drawer.
 * @param props.eyebrow - Texto secundario opcional.
 * @param props.children - Contenido del drawer.
 * @param props.onClose - Callback de cierre.
 */
export function Drawer({ title, eyebrow, children, onClose }: DrawerProps) {
  return (
    <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l border-border bg-popover text-popover-foreground shadow-xl">
      <div className="flex items-start justify-between border-b border-border px-5 py-4">
        <div>
          {eyebrow ? (
            <p className="text-xs font-medium uppercase text-muted-foreground">
              {eyebrow}
            </p>
          ) : null}
          <h3 className="mt-1 text-lg font-semibold text-foreground">{title}</h3>
        </div>
        <Button variant="ghost" size="icon" aria-label="Cerrar" onClick={onClose}>
          <X className="size-5" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-5">{children}</div>
    </aside>
  )
}
