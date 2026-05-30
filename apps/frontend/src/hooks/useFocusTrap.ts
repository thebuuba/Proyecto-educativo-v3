import { useEffect, type RefObject } from 'react'

type UseFocusTrapOptions = {
  ref: RefObject<HTMLDivElement | null>
  active: boolean
  onEscape?: () => void
}

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
