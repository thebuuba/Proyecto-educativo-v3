/**
 * Hook que proporciona búsqueda con debounce para retrasar
 * la actualización del valor hasta que el usuario deje de escribir.
 */
import { useEffect, useRef, useState } from 'react'

/**
 * Retorna el valor de búsqueda crudo y una versión con debounce.
 *
 * @param delay - Milisegundos de retraso para el debounce.
 * @returns Objeto con search (valor crudo), debouncedSearch (valor retardado)
 * y setSearch (actualizador).
 */
export function useDebouncedSearch(delay = 300) {
  const [raw, setRaw] = useState('')
  const [debounced, setDebounced] = useState('')
  const timerRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    timerRef.current = window.setTimeout(() => {
      setDebounced(raw)
    }, delay)

    return () => {
      window.clearTimeout(timerRef.current)
    }
  }, [raw, delay])

  return { search: raw, debouncedSearch: debounced, setSearch: setRaw }
}
