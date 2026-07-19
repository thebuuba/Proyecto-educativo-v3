/**
 * Modal o diálogo superpuesto con foco atrapado y cierre por Escape.
 */
import { X } from 'lucide-react'
import { useRef, type ReactNode } from 'react'

import { Button } from '@/components/ui/Button'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { cn } from '@/utils/cn'

/** Propiedades del componente Modal. */
type ModalProps = {
  /** Título del modal. */
  title: string
  /** Descripción opcional mostrada bajo el título. */
  description?: string
  /** Contenido interno del modal. */
  children: ReactNode
  /** Función llamada al cerrar el modal. */
  onClose: () => void
  /** Clases adicionales para el contenedor del diálogo. */
  className?: string
  /** Clases adicionales para el contenedor desplazable del contenido. */
  contentClassName?: string
  /** Clases adicionales para el fondo superpuesto. */
  overlayClassName?: string
  /** Oculta el encabezado estandar para permitir una cabecera personalizada. */
  hideHeader?: boolean
}

/**
 * Modal centrado con overlay oscuro, encabezado fijo y contenido
 * desplazable. Atrapa el foco y cierra con Escape.
 *
 * @param props.title - Título del modal.
 * @param props.description - Descripción opcional.
 * @param props.children - Contenido del cuerpo.
 * @param props.onClose - Callback de cierre.
 */
export function Modal({ title, description, children, onClose, className, contentClassName, overlayClassName, hideHeader = false }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  useFocusTrap({ ref: dialogRef, active: true, onEscape: onClose })

  return (
    <div className={cn('fixed inset-0 z-50 flex items-center justify-center bg-primary/45 px-4 py-6', overlayClassName)}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-xl',
          className,
        )}
      >
        {!hideHeader ? (
          <div className="flex shrink-0 items-start justify-between border-b border-border px-5 py-4">
            <div>
              <h3 className="text-base font-semibold text-foreground">{title}</h3>
              {description ? (
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
              ) : null}
            </div>
            <Button variant="ghost" size="icon" aria-label="Cerrar" onClick={onClose}>
              <X className="size-5" />
            </Button>
          </div>
        ) : null}
        <div className={cn('overflow-y-auto', contentClassName)}>
          {children}
        </div>
      </div>
    </div>
  )
}
