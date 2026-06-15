/**
 * Diálogo de confirmación con acciones de aceptar y cancelar.
 */
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'

/** Propiedades del componente ConfirmDialog. */
type ConfirmDialogProps = {
  /** Título del diálogo. */
  title: string
  /** Descripción del mensaje de confirmación. */
  description: string
  /** Texto del botón de confirmación. */
  confirmLabel?: string
  /** Texto del botón de cancelación. */
  cancelLabel?: string
  /** Si es true, usa la variante destructiva en el botón de confirmación. */
  destructive?: boolean
  /** Función ejecutada al confirmar. Puede ser asíncrona. */
  onConfirm: () => void | Promise<void>
  /** Función llamada al cerrar el diálogo. */
  onClose: () => void
}

/**
 * Diálogo modal de confirmación con botones personalizables y
 * estado de carga mientras se ejecuta onConfirm.
 *
 * @param props.title - Título del diálogo.
 * @param props.description - Mensaje de confirmación.
 * @param props.confirmLabel - Etiqueta del botón confirmar.
 * @param props.cancelLabel - Etiqueta del botón cancelar.
 * @param props.destructive - Modo destructivo.
 * @param props.onConfirm - Callback de confirmación.
 * @param props.onClose - Callback de cierre.
 */
export function ConfirmDialog({
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  destructive = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirm()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title={title} description={description} onClose={onClose}>
      <div className="flex justify-end gap-3 p-5">
        <Button variant="outline" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button
          variant={destructive ? 'destructive' : 'primary'}
          loading={loading}
          onClick={handleConfirm}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
