import { useEffect, useRef, type RefObject } from 'react'

/** Cierra solo el diálogo superior, sin activar controles del fondo. */
export function useOutsideClick({ ref, onClose, active = true, disabled = false }: {
  ref: RefObject<HTMLElement | null>
  onClose: () => void
  active?: boolean
  disabled?: boolean
}) {
  const pointerStartedInside = useRef(false)
  const pointerStarted = useRef(false)
  const pointerDialog = useRef<Element | null>(null)

  useEffect(() => {
    if (!active) return
    const rememberPointerStart = (event: PointerEvent) => {
      pointerStarted.current = true
      pointerStartedInside.current = event.target instanceof Node && Boolean(ref.current?.contains(event.target))
      const dialogs = document.querySelectorAll('[role="dialog"], [role="alertdialog"]')
      pointerDialog.current = dialogs[dialogs.length - 1] ?? null
    }
    const closeOutside = (event: MouseEvent) => {
      if (!pointerStarted.current) return
      pointerStarted.current = false
      const startedInside = pointerStartedInside.current
      const startingDialog = pointerDialog.current
      pointerStartedInside.current = false
      pointerDialog.current = null
      const panel = ref.current
      if (!panel || !(event.target instanceof Node) || panel.contains(event.target) || startedInside) return
      // Un selector puede desmontarse en pointerdown: ese mismo gesto no debe cerrar su modal padre.
      if (startingDialog && startingDialog !== panel) {
        if (!startingDialog.isConnected) {
          event.preventDefault()
          event.stopImmediatePropagation()
        }
        return
      }
      const dialogs = document.querySelectorAll('[role="dialog"], [role="alertdialog"]')
      const topmost = dialogs[dialogs.length - 1]
      if (topmost && topmost !== panel) return
      event.preventDefault()
      event.stopImmediatePropagation()
      if (!disabled) onClose()
    }
    document.addEventListener('pointerdown', rememberPointerStart, true)
    document.addEventListener('click', closeOutside, true)
    return () => {
      document.removeEventListener('pointerdown', rememberPointerStart, true)
      document.removeEventListener('click', closeOutside, true)
    }
  }, [active, disabled, onClose, ref])
}
