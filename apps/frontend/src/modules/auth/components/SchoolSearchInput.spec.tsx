import { act, fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { SchoolSearchInput, type SchoolResult } from './SchoolSearchInput'

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
  beforeEach(() => {
    vi.useFakeTimers()
    get.mockReset().mockResolvedValue(schools)
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
    expect(get).toHaveBeenCalledWith(expect.not.stringContaining('lat='))
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
  })
})
