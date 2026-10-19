import { ZoomIn } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Modal } from '@/components/ui/Modal'
import { cn } from '@/utils/cn'

/** Captura de AppLayout y DashboardPage reales, preparada con datos de ejemplo. */
export function ProductDemo({ className }: { className?: string }) {
  const [expanded, setExpanded] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!expanded) return
    const trigger = triggerRef.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
      trigger?.focus()
    }
  }, [expanded])

  return (
    <>
      <figure
        className={cn(
          'overflow-hidden rounded-[28px] border border-border/60 bg-card shadow-2xl shadow-primary/10',
          className,
        )}
      >
        <button
          ref={triggerRef}
          type="button"
          aria-label="Ampliar captura del Inicio de AulaBase"
          aria-haspopup="dialog"
          onClick={() => setExpanded(true)}
          className="relative block w-full cursor-zoom-in text-left focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-primary"
        >
          <img
            src="/images/aulabase-inicio.jpg"
            alt="Pantalla de inicio real de AulaBase: clases del día, asistencia, calificaciones y seguimiento docente."
            width={1905}
            height={889}
            fetchPriority="high"
            className="block h-auto w-full"
          />
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full border border-border bg-card/95 px-3 py-2 text-xs font-semibold text-primary shadow-md">
            <ZoomIn className="h-4 w-4" aria-hidden="true" />
            Ampliar imagen
          </span>
        </button>
        <figcaption className="px-4 py-2 text-center text-[11px] text-muted-foreground">
          Captura del sistema real con datos de ejemplo.
        </figcaption>
      </figure>
      {expanded && (
        <Modal
          title="Inicio de AulaBase"
          description="Datos de ejemplo. Desliza o usa las flechas para recorrer la imagen."
          className="promo-product-preview"
          onClose={() => setExpanded(false)}
        >
          <div
            role="region"
            aria-label="Captura ampliada de AulaBase"
            tabIndex={0}
            className="max-h-[65vh] overflow-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
          >
            <img
              src="/images/aulabase-inicio.jpg"
              alt="Vista ampliada del Inicio de AulaBase con datos de ejemplo."
              width={1905}
              height={889}
              className="block h-auto max-w-none"
            />
          </div>
        </Modal>
      )}
    </>
  )
}
