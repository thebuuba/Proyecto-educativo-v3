import { useEffect, useRef, useState } from 'react'

export function useDebouncedSearch(delay = 300) {
  const [raw, setRaw] = useState('')
  const [debounced, setDebounced] = useState('')
  const timerRef = useRef<ReturnType<typeof window.setTimeout> | undefined>(undefined)

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
