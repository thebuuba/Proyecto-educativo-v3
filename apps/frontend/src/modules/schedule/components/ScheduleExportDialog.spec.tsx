import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ScheduleExportDialog } from './ScheduleExportDialog'

// jsdom has no raster engine; exercise the UI with a deterministic 2D surface.
const context = { fillRect: vi.fn(), fillText: vi.fn(), strokeRect: vi.fn(), beginPath: vi.fn(), moveTo: vi.fn(), lineTo: vi.fn(), stroke: vi.fn(), save: vi.fn(), restore: vi.fn(), rect: vi.fn(), clip: vi.fn(), measureText: (text: string) => ({ width: text.length * 8 }) }
const props = { journeys: [], slots: [], entries: [], schoolYearName: '2026–2027', selectedDay: 2, onClose: vi.fn() }

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals() })

describe('ScheduleExportDialog', () => {
  it('muestra el calendario real y cambia contenido y formato antes de descargar', async () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context as unknown as CanvasRenderingContext2D)
    render(<ScheduleExportDialog {...props} />)
    await waitFor(() => expect(screen.getByRole('button', { name: 'Descargar PDF' })).toBeEnabled())
    expect(context.fillText).toHaveBeenCalledWith('2026–2027', 52, 80)
    fireEvent.click(screen.getByRole('radio', { name: /Un día/ }))
    expect(screen.getByRole('combobox')).toHaveValue('2')
    fireEvent.click(screen.getByRole('radio', { name: /Imagen PNG/ }))
    await waitFor(() => expect(screen.getByRole('button', { name: 'Descargar PNG' })).toBeEnabled())
    expect(screen.getByRole('switch', { name: 'Incluir aulas' })).toBeChecked()
    expect(screen.getByRole('img', { name: /diario/ })).toHaveAttribute('width', '1190')
  })
  it('explica un fallo real de Canvas e impide descargar un archivo vacío', async () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    render(<ScheduleExportDialog {...props} />)
    expect(await screen.findByRole('alert')).toHaveTextContent('no permite generar')
    expect(screen.getByRole('button', { name: 'Descargar PDF' })).toBeDisabled()
  })
})
