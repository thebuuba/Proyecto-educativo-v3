/**
 * Hook que atrapa el foco del teclado dentro de un contenedor
 * y permite cerrar con la tecla Escape.
 */
import { useEffect, type RefObject } from 'react'

/** Opciones del hook useFocusTrap. */
type UseFocusTrapOptions = {
  /** Referencia al contenedor que atrapa el foco. */
  ref: RefObject<HTMLDivElement | null>
  /** Si es true, activa el atrapado de foco. */
  active: boolean
  /** Callback ejecutado al presionar Escape. */
  onEscape?: () => void
}

/**
 * Atrapa el foco en elementos enfocables dentro de un contenedor,
 * ciclando entre el primer y último elemento con Tab/Shift+Tab.
 * Ejecuta onEscape al presionar Escape.
 *
 * @param options.ref - Referencia al contenedor.
 * @param options.active - Activa o desactiva el hook.
 * @param options.onEscape - Callback de tecla Escape.
 */
export function useFocusTrap({ ref, active, onEscape }: UseFocusTrapOptions) {
  useEffect(() => {
    if (!active) return

    const el = ref.current
    if (!el) return

    const focusableSelector =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    const focusable = el.querySelectorAll<HTMLElement>(focusableSelector)
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    first?.focus()

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onEscape?.()
        return
      }

      if (e.key !== 'Tab') return

      const isTabForward = !e.shiftKey

      if (isTabForward && document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      } else if (!isTabForward && document.activeElement === first) {
        e.preventDefault()
        last?.focus()
      }
    }

    el.addEventListener('keydown', handleKeyDown)

    return () => {
      el.removeEventListener('keydown', handleKeyDown)
    }
  }, [ref, active, onEscape])
}
