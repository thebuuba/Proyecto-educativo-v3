import { Building2, LocateFixed, MapPin, Search } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { api } from '@/services/apiClient'
import { CreateSchoolDialog } from './CreateSchoolDialog'

export type SchoolResult = {
  id: string
  name: string
  slug: string
  sector: string
  centerCode?: string | null
  district?: string | null
  regionalCode?: string | null
  regionalName?: string | null
  districtCode?: string | null
  districtName?: string | null
  niveles: string[]
  tandas: string[]
  modalidades: string[]
  distance?: number | null
  schoolYearName?: string | null
  schoolYearStartDate?: string | null
  schoolYearEndDate?: string | null
}

type Props = {
  value: string
  onChange: (value: string) => void
  onSelect: (school: SchoolResult) => void
  error?: string
  placeholder?: string
}

type LocationState = 'idle' | 'loading' | 'available' | 'unavailable'

function formatDistance(distance?: number | null) {
  if (distance == null || !Number.isFinite(Number(distance))) return null
  const value = Number(distance)
  return value < 10 ? `${value.toFixed(1)} km` : `${Math.round(value)} km`
}

// eslint-disable-next-line react-refresh/only-export-components
export function formatSchoolLocation(school: SchoolResult) {
  const formatPlaceName = (value: string) => value
    .toLocaleLowerCase('es-DO')
    .split(' ')
    .map((word, index) => index > 0 && ['de', 'del', 'la', 'las', 'los', 'y'].includes(word)
      ? word
      : word.replace(/(^|-)\p{L}/gu, (letter) => letter.toLocaleUpperCase('es-DO')))
    .join(' ')
  const regional = school.regionalCode && school.regionalName
    ? `Regional ${school.regionalCode} – ${formatPlaceName(school.regionalName)}`
    : school.regionalName ? formatPlaceName(school.regionalName) : null
  const district = school.districtCode && school.districtName
    ? `Distrito ${school.districtCode} – ${formatPlaceName(school.districtName)}`
    : school.districtName ? formatPlaceName(school.districtName) : school.district
  return [regional, district].filter((value): value is string => Boolean(value))
}

export function SchoolSearchInput({ value, onChange, onSelect, error, placeholder }: Props) {
  const [results, setResults] = useState<SchoolResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searchError, setSearchError] = useState(false)
  const [searched, setSearched] = useState(false)
  const [open, setOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [locationState, setLocationState] = useState<LocationState>('idle')
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationDismissed, setLocationDismissed] = useState(false)
  const [creatingSchool, setCreatingSchool] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const requestRef = useRef(0)
  const selectedQueryRef = useRef<string | null>(null)

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationState('unavailable')
      return
    }
    setLocationState('loading')
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation({ lat: coords.latitude, lng: coords.longitude })
        setLocationState('available')
      },
      () => setLocationState('unavailable'),
      { enableHighAccuracy: false, maximumAge: 10 * 60 * 1000, timeout: 8000 },
    )
  }, [])

  useEffect(() => {
    const term = value.trim()
    const requestId = ++requestRef.current
    if (term && term === selectedQueryRef.current) return
    if (!term && !location) {
      setResults([])
      setOpen(false)
      setSearched(false)
      setSearchError(false)
      setLoading(false)
      return
    }

    const timeout = window.setTimeout(async () => {
      setLoading(true)
      setSearchError(false)
      try {
        let url = `/schools?q=${encodeURIComponent(term)}&limit=50`
        if (location) url += `&lat=${location.lat}&lng=${location.lng}`
        const data = await api.get<SchoolResult[]>(url)
        if (requestRef.current !== requestId) return
        setResults(data)
        setSearched(true)
        setOpen(true)
        setHighlightedIndex(-1)
      } catch {
        if (requestRef.current !== requestId) return
        setResults([])
        setSearched(true)
        setSearchError(true)
        setOpen(true)
      } finally {
        if (requestRef.current === requestId) setLoading(false)
      }
    }, 300)

    return () => window.clearTimeout(timeout)
  }, [location, value])

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (inputRef.current && !inputRef.current.parentElement?.contains(event.target as Node) && !listRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    return () => document.removeEventListener('mousedown', closeOnOutsideClick)
  }, [])

  useEffect(() => {
    if (!open || highlightedIndex < 0) return
    listRef.current?.children[highlightedIndex]?.scrollIntoView({ block: 'nearest' })
  }, [highlightedIndex, open])

  function selectSchool(school: SchoolResult) {
    requestRef.current += 1
    selectedQueryRef.current = school.name
    onChange(school.name)
    onSelect(school)
    setOpen(false)
    setResults([])
    setSearched(false)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown' && results.length) {
      event.preventDefault()
      setOpen(true)
      setHighlightedIndex((current) => Math.min(current + 1, results.length - 1))
    } else if (event.key === 'ArrowUp' && results.length) {
      event.preventDefault()
      setHighlightedIndex((current) => Math.max(current - 1, 0))
    } else if (event.key === 'Enter' && open && highlightedIndex >= 0) {
      event.preventDefault()
      selectSchool(results[highlightedIndex])
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  const status = loading
    ? 'Buscando centros…'
    : searchError
      ? 'Hubo un problema al buscar. Intenta nuevamente.'
      : searched && !results.length
        ? 'No encontramos tu centro. Prueba con menos palabras o busca sin ubicación.'
        : location && !value.trim() ? 'Centros ordenados por cercanía. Selecciona el tuyo o escribe su nombre.' : 'Escribe el nombre de tu centro.'

  return (
    <div>
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input
          ref={inputRef}
          id="school-search"
          type="search"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls="school-search-results"
          aria-activedescendant={highlightedIndex >= 0 ? `school-result-${results[highlightedIndex]?.id}` : undefined}
          aria-invalid={Boolean(error)}
          value={value}
          placeholder={placeholder ?? 'Busca tu centro por nombre'}
          autoComplete="off"
          className="auth-input auth-input-leading-icon h-12"
          onChange={(event) => { selectedQueryRef.current = null; onChange(event.target.value) }}
          onFocus={() => { if (searched) setOpen(true) }}
          onKeyDown={handleKeyDown}
        />
        {locationState === 'available' ? <LocateFixed className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-success" aria-hidden="true" /> : null}
      </div>

      {!locationDismissed && locationState !== 'available' && <div className="setup-location-prompt">
        <span className="setup-location-icon"><LocateFixed size={16} /></span>
        <p><strong>Opcional:</strong> usa tu ubicación para ver centros cercanos. Puedes continuar sin compartirla.</p>
        <Button variant="ghost" size="sm" onClick={() => setLocationDismissed(true)} disabled={locationState === 'loading'}>Ahora no</Button>
        <Button variant="outline" size="sm" loading={locationState === 'loading'} onClick={requestLocation}>Usar mi ubicación</Button>
      </div>}
      {locationState === 'available' && <button type="button" className="setup-location-active" onClick={() => { setLocation(null); setLocationState('idle'); setLocationDismissed(false) }}><LocateFixed size={15} />Cercanía activada · buscar sin ubicación</button>}
      <p className="setup-search-status" aria-live="polite">{!value.trim() && !location ? 'Escribe el nombre de tu centro o usa tu ubicación. Debes seleccionar el centro de la lista de resultados.' : status}</p>
      {locationState === 'unavailable' ? <p className="mt-1 text-xs text-muted-foreground">La búsqueda seguirá funcionando sin tu ubicación.</p> : null}
      {error ? <p className="mt-1 text-xs font-semibold text-foreground"><span className="mr-1 inline-block size-1.5 rounded-full bg-destructive" />{error}</p> : null}

      {open && searched && (
        <ul
          ref={listRef}
          id="school-search-results"
          role="listbox"
          aria-label="Centros educativos encontrados"
          className="setup-school-results"
        >
          {results.map((school, index) => {
            const distance = formatDistance(school.distance)
            return (
              <li
                id={`school-result-${school.id}`}
                key={school.id}
                role="option"
                aria-selected={index === highlightedIndex}
                onMouseEnter={() => setHighlightedIndex(index)}
                onMouseDown={(event) => { event.preventDefault(); selectSchool(school) }}
                className={`cursor-pointer rounded-xl px-3 py-3 transition ${index === highlightedIndex ? 'bg-primary/10' : 'hover:bg-muted/60'}`}
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary"><Building2 className="size-4" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-foreground">{school.name}</p>
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      {formatSchoolLocation(school).map((location, locationIndex) => <span key={location} className="inline-flex items-center gap-1">{locationIndex === 0 ? <MapPin className="size-3" /> : null}{location}</span>)}
                      {school.centerCode ? <span>Código {school.centerCode}</span> : null}
                      {distance ? <span className="font-semibold text-foreground">{distance}</span> : null}
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">{school.sector === 'public' ? 'Centro público' : 'Centro privado'}</p>
                  </div>
                </div>
              </li>
            )
          })}
          {searchError ? (
            <li role="alert" className="px-4 py-5 text-center text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">No pudimos buscar centros en este momento.</p>
              <p className="mt-1">Comprueba la conexión del servicio e intenta nuevamente.</p>
            </li>
          ) : !results.length ? (
            <li className="px-4 py-5 text-center text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">No encontramos tu centro.</p>
              <p className="mt-1">Cambia las palabras o busca sin ubicación e intenta otra vez.</p>
            </li>
          ) : null}
        </ul>
      )}
      {searched && !loading && !searchError && value.trim().length >= 2 && <div className="setup-add-school">
        <div><strong>¿No encuentras tu centro?</strong><p>Revisa los resultados. Si no aparece, puedes agregarlo al directorio.</p></div>
        <Button variant="outline" size="sm" onClick={() => { setOpen(false); setCreatingSchool(true) }}>Agregar centro</Button>
      </div>}
      {creatingSchool && <CreateSchoolDialog initialName={value.trim()} onClose={() => setCreatingSchool(false)} onSelect={school => { setCreatingSchool(false); selectSchool(school) }} />}
    </div>
  )
}
