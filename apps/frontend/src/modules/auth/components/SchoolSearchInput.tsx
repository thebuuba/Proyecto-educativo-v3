import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { api } from '@/services/apiClient'
import { shouldSearchSchoolQuery } from '@/modules/auth/utils/schoolSearch'

export type SchoolResult = {
  id: string
  name: string
  slug: string
  sector: string
  district?: string
  niveles: string[]
  tandas: string[]
  modalidades: string[]
}

type Props = {
  value: string
  onChange: (value: string) => void
  onSelect: (school: SchoolResult) => void
  error?: string
  placeholder?: string
}

export function SchoolSearchInput({ value, onChange, onSelect, error, placeholder }: Props) {
  const [query, setQuery] = useState(value)
  const [results, setResults] = useState<SchoolResult[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [dropdownTop, setDropdownTop] = useState(0)
  const [dropdownLeft, setDropdownLeft] = useState(0)
  const [dropdownWidth, setDropdownWidth] = useState(0)
  const [dropdownMaxHeight, setDropdownMaxHeight] = useState(320)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const locationRef = useRef<{ lat: number; lng: number } | null>(null)
  const locationFetchedRef = useRef(false)
  const selectedQueryRef = useRef<string | null>(value || null)

  useEffect(() => {
    if (locationFetchedRef.current) return
    locationFetchedRef.current = true
    fetch('//ip-api.com/json/')
      .then(r => r.json())
      .then(d => { if (d.lat && d.lon) locationRef.current = { lat: d.lat, lng: d.lon } })
      .catch(() => {})
  }, [])

  const search = useCallback(async (term: string) => {
    if (!shouldSearchSchoolQuery(term, selectedQueryRef.current)) {
      setResults([])
      setOpen(false)
      return
    }
    setLoading(true)
    try {
      let url = `/schools?q=${encodeURIComponent(term)}&limit=50`
      const loc = locationRef.current
      if (loc) url += `&lat=${loc.lat}&lng=${loc.lng}`
      const data = await api.get<SchoolResult[]>(url)
      if (inputRef.current) {
        const rect = inputRef.current.getBoundingClientRect()
        const spaceBelow = window.innerHeight - rect.bottom - 8
        setDropdownTop(rect.bottom + 4)
        setDropdownLeft(rect.left)
        setDropdownWidth(rect.width)
        setDropdownMaxHeight(Math.min(420, Math.max(160, spaceBelow)))
      }
      setResults(data)
      setOpen(data.length > 0)
      setHighlightedIndex(-1)
    } catch {
      setResults([])
      setOpen(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => search(query), 300)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [query, search])

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    selectedQueryRef.current = null
    setQuery(val)
    onChange(val)
    if (!val) setOpen(false)
  }

  function select(school: SchoolResult) {
    selectedQueryRef.current = school.name
    setQuery(school.name)
    onChange(school.name)
    onSelect(school)
    setResults([])
    setOpen(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (open && highlightedIndex >= 0) select(results[highlightedIndex])
      return
    }

    if (!open || results.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex((prev) => Math.min(prev + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  useEffect(() => {
    if (!open || highlightedIndex < 0 || !listRef.current) return
    const item = listRef.current.children[highlightedIndex] as HTMLElement | undefined
    item?.scrollIntoView({ block: 'nearest' })
  }, [highlightedIndex, open])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (inputRef.current && !inputRef.current.parentElement?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder ?? 'Busca tu centro educativo'}
        required
        autoComplete="off"
        value={query}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={() => { if (results.length > 0) setOpen(true) }}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 transition-all focus:border-[#1E3D8F] focus:outline-none focus:ring-2 focus:ring-[#1E3D8F]/10"
      />

      {open && results.length > 0 && createPortal(
        <ul
          ref={listRef}
          style={{
            position: 'fixed',
            top: dropdownTop,
            left: dropdownLeft,
            width: dropdownWidth,
            maxHeight: dropdownMaxHeight,
            overflowY: 'auto',
          }}
          className="z-[9999] rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
        >
          {results.map((school, index) => (
            <li
              key={school.id}
              onMouseEnter={() => setHighlightedIndex(index)}
              onMouseDown={() => select(school)}
              className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                index === highlightedIndex ? 'bg-[#1E3D8F]/10 text-[#1E3D8F]' : 'text-gray-700'
              }`}
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-500">
                {school.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium">{school.name}</p>
                <p className="truncate text-xs text-gray-400">
                  {school.sector === 'public' ? 'Pública' : 'Privada'}
                  {school.district ? ` · ${school.district}` : ''}
                </p>
              </div>
            </li>
          ))}
        </ul>,
        document.body,
      )}

      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="size-4 animate-spin rounded-full border-2 border-gray-300 border-t-[#1E3D8F]" />
        </div>
      )}

      {error ? <p className="mt-1 text-xs font-medium text-red-600">{error}</p> : null}
    </div>
  )
}
