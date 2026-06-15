/**
 * Estado vacío para cuando no hay datos que mostrar.
 */
import type { ReactNode } from 'react'

/** Propiedades del componente EmptyState. */
type EmptyStateProps = {
  /** Título del estado vacío. */
  title: string
  /** Descripción explicativa. */
  description: string
  /** Acción opcional (ej. botón para crear un recurso). */
  action?: ReactNode
}

/**
 * Mensaje de contenido vacío con título, descripción y acción opcional.
 *
 * @param props.title - Título informativo.
 * @param props.description - Descripción del estado.
 * @param props.action - Acción sugerida.
 */
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-[280px] items-center justify-center rounded-lg bg-muted px-4 text-center">
      <div className="max-w-md">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
      </div>
    </div>
  )
}
