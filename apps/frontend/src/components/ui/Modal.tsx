/**
 * Modal o diálogo superpuesto con foco atrapado y cierre por Escape.
 */
import { X } from 'lucide-react'
import { useRef, type ComponentType, type ReactNode } from 'react'

import { Button } from '@/components/ui/Button'
import { SemanticIcon, type SemanticTone } from '@/components/ui/SemanticUI'
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
  /** Oculta el encabezado estándar para permitir una cabecera personalizada. */
  hideHeader?: boolean
  /** Icono semántico opcional del diálogo. */
  icon?: ComponentType<{ className?: string }>
  /** Tono del icono semántico. */
  tone?: SemanticTone
  /** Contexto breve mostrado sobre el título. */
  eyebrow?: ReactNode
}

/**
 * Modal centrado con overlay oscuro, encabezado fijo y contenido
 * desplazable. Atrapa el foco y cierra con Escape.
 */
export function Modal({
  title,
  description,
  children,
  onClose,
  className,
  contentClassName,
  overlayClassName,
  hideHeader = false,
  icon,
  tone = 'info',
  eyebrow,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  useFocusTrap({ ref: dialogRef, active: true, onEscape: onClose })

  return (
    <div className={cn('fixed inset-0 z-50 flex items-center justify-center bg-primary/45 px-4 py-6 backdrop-blur-[2px]', overlayClassName)}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border-0 bg-popover text-popover-foreground shadow-2xl',
          className,
        )}
      >
        {!hideHeader ? (
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-5 py-4">
            <div className="flex min-w-0 items-start gap-3">
              {icon ? <SemanticIcon icon={icon} tone={tone} className="size-10 rounded-xl" iconClassName="size-4" /> : null}
              <div className="min-w-0">
                {eyebrow ? (
                  <div className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-accent">
                    {eyebrow}
                  </div>
                ) : null}
                <h3 className="text-base font-extrabold text-foreground">{title}</h3>
                {description ? (
                  <p className="mt-1 max-w-xl text-sm leading-5 text-muted-foreground">{description}</p>
                ) : null}
              </div>
            </div>
            <Button variant="ghost" size="icon" className="shrink-0" aria-label="Cerrar" onClick={onClose}>
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
