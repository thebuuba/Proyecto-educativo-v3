import { act, fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { formatSchoolLocation, SchoolSearchInput, type SchoolResult } from './SchoolSearchInput'

const get = vi.hoisted(() => vi.fn())
vi.mock('@/services/apiClient', () => ({ api: { get } }))

const schools = [
  { id: 'school-1', name: 'Centro Duarte', slug: 'duarte-1', sector: 'public', district: 'Distrito 11-01', centerCode: '01234', niveles: ['secondary'], tandas: ['morning'], modalidades: ['regular'], distance: 2.4 },
  { id: 'school-2', name: 'Centro Duarte', slug: 'duarte-2', sector: 'public', district: 'Distrito 11-02', centerCode: '05678', niveles: ['primary'], tandas: ['afternoon'], modalidades: ['regular'], distance: 22 },
]

function Harness({ onSelect = vi.fn() }: { onSelect?: (school: SchoolResult) => void }) {
  const [value, setValue] = useState('')
  return <SchoolSearchInput value={value} onChange={setValue} onSelect={onSelect} />
}

describe('SchoolSearchInput', () => {
  it('formats regional and district with their codes and names', () => {
    expect(formatSchoolLocation({
      ...schools[0],
      regionalCode: '06',
      regionalName: 'LA VEGA',
      districtCode: '0607',
      districtName: 'GASPAR HERNANDEZ',
    })).toEqual(['Regional 06 – La Vega', 'Distrito 0607 – Gaspar Hernandez'])
  })

  beforeEach(() => {
    vi.useFakeTimers()
    get.mockReset().mockResolvedValue(schools)
    Object.defineProperty(navigator, 'geolocation', { configurable: true, value: undefined })
  })
  afterEach(() => vi.useRealTimers())

  it('debounces requests and shows duplicate names as separate centers', async () => {
    render(<Harness />)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Centro Duarte' } })
    expect(get).not.toHaveBeenCalled()
    await act(async () => { vi.advanceTimersByTime(300); await Promise.resolve() })
    expect(get).toHaveBeenCalledOnce()
    expect(screen.getAllByText('Centro Duarte')).toHaveLength(2)
    expect(screen.getByText('Código 01234')).toBeInTheDocument()
    expect(screen.getByText('Código 05678')).toBeInTheDocument()
  })

  it('preserves the unique id when a result is selected', async () => {
    const onSelect = vi.fn()
    render(<Harness onSelect={onSelect} />)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Duarte' } })
    await act(async () => { vi.advanceTimersByTime(300); await Promise.resolve() })
    fireEvent.mouseDown(screen.getByText('Código 05678').closest('[role="option"]')!)
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'school-2', centerCode: '05678' }))
  })

  it('continues searching when location is unavailable', async () => {
    Object.defineProperty(navigator, 'geolocation', { configurable: true, value: { getCurrentPosition: (_success: unknown, error: () => void) => error() } })
    render(<Harness />)
    fireEvent.click(screen.getByRole('button', { name: /usar mi ubicación/i }))
    expect(screen.getByText(/seguirá funcionando sin tu ubicación/i)).toBeInTheDocument()
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Catolico' } })
    await act(async () => { vi.advanceTimersByTime(300); await Promise.resolve() })
    expect(get).toHaveBeenCalledWith(expect.not.stringContaining('lat='), expect.any(Object))
  })

  it('requests location automatically and sends it as a proximity signal', async () => {
    Object.defineProperty(navigator, 'geolocation', {
      configurable: true,
      value: { getCurrentPosition: (success: PositionCallback) => success({ coords: { latitude: 19.22, longitude: -70.53 } } as GeolocationPosition) },
    })
    render(<Harness />)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Eugenio Maria de Hostos' } })
    await act(async () => { vi.advanceTimersByTime(300); await Promise.resolve() })
    expect(get).toHaveBeenCalledWith(expect.stringContaining('lat=19.22&lng=-70.53'), expect.any(Object))
  })

  it('does not let an older response replace the latest search', async () => {
    let resolveOld!: (value: SchoolResult[]) => void
    let resolveLatest!: (value: SchoolResult[]) => void
    get
      .mockImplementationOnce(() => new Promise<SchoolResult[]>((resolve) => { resolveOld = resolve }))
      .mockImplementationOnce(() => new Promise<SchoolResult[]>((resolve) => { resolveLatest = resolve }))
    render(<Harness />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'EUGE' } })
    await act(async () => { vi.advanceTimersByTime(300); await Promise.resolve() })
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Eugenio Maria' } })
    await act(async () => { vi.advanceTimersByTime(300); await Promise.resolve() })

    await act(async () => resolveLatest([{ ...schools[0], id: 'latest', name: 'Eugenio Maria de Hostos' }]))
    await act(async () => resolveOld([{ ...schools[0], id: 'old', name: 'Eugenio Santos' }]))

    expect(screen.getByText('Eugenio Maria de Hostos')).toBeInTheDocument()
    expect(screen.queryByText('Eugenio Santos')).not.toBeInTheDocument()
    expect(get.mock.calls[0][1]).toEqual(expect.objectContaining({ signal: expect.any(AbortSignal) }))
  })

  it('announces empty and error states', async () => {
    get.mockResolvedValueOnce([]).mockRejectedValueOnce(new Error('network'))
    render(<Harness />)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Inexistente' } })
    await act(async () => { vi.advanceTimersByTime(300); await Promise.resolve() })
    expect(screen.getAllByText(/no encontramos tu centro/i).length).toBeGreaterThan(0)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Otro centro' } })
    await act(async () => { vi.advanceTimersByTime(300); await Promise.resolve() })
    expect(screen.getByText(/hubo un problema al buscar/i)).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent(/no pudimos buscar centros/i)
  })
})
