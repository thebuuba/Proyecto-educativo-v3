import { describe, expect, it, vi } from 'vitest'
import type { ScheduleEntry, TimeSlot } from '../types'
import { buildScheduleExportModel, buildSchedulePdf, canvasToBlob, downloadScheduleBlob, getScheduleExportSize } from './scheduleExport'

const slot = (id: string, dayOfWeek: number | null, blockType: TimeSlot['blockType'] = 'CLASS'): TimeSlot => ({ id, dayOfWeek, blockType, name: id, startTime: '08:00', endTime: '09:00', sequence: 1, status: 'ACTIVE', journeyId: null })
const entry = (id: string, dayOfWeek: number, extra = {}): ScheduleEntry => ({ id, timeSlotId: 'class', dayOfWeek, startTime: '08:00', endTime: '09:00', subjectName: 'Matemática', room: 'A-1', ...extra } as ScheduleEntry)
const options = { content: 'week' as const, selectedDay: 1, showFreePeriods: true, includeRooms: true }

describe('exportación de horario', () => {
  it('usa A4 horizontal semanal y vertical diario en alta resolución', () => {
    expect(getScheduleExportSize('week')).toEqual({ width: 1684, height: 1190 })
    expect(getScheduleExportSize('day')).toEqual({ width: 1190, height: 1684 })
  })
  it('preserva días configurados incluidos fines de semana y excluye pendientes', () => {
    const model = buildScheduleExportModel([slot('class', 6), slot('break', 6, 'BREAK')], [entry('placed', 6), entry('pending', 7, { needsPlacement: true })], options)
    expect(model.days.map(day => day.dayOfWeek)).toEqual([6])
    expect(model.blocks.map(block => block.entry?.id ?? block.slot?.id)).toEqual(['placed', 'break'])
    expect(model.start).toBe(480)
    expect(model.end).toBe(540)
  })
  it('expande bloques compartidos de lunes a viernes y filtra libres sin ocultar recreos', () => {
    const slots = [slot('class', null), slot('break', null, 'BREAK')]
    expect(buildScheduleExportModel(slots, [], options).days).toHaveLength(5)
    const model = buildScheduleExportModel(slots, [], { ...options, content: 'day', selectedDay: 3, showFreePeriods: false })
    expect(model.days.map(day => day.dayOfWeek)).toEqual([3])
    expect(model.blocks.map(block => block.slot?.id)).toEqual(['break'])
  })
  it('conserva la hora pedagógica y su nombre al ocultar períodos libres', () => {
    const pedagogical = { ...slot('pedagogical', 1, 'FREE'), name: 'Preparación pedagógica' }
    const model = buildScheduleExportModel([slot('class', 1), pedagogical], [], { ...options, showFreePeriods: false })
    expect(model.blocks.map(block => block.slot?.name)).toEqual(['Preparación pedagógica'])
  })
  it('excluye bloques inactivos y archivados sin depender de mayúsculas', () => {
    const slots = [slot('active', 1), { ...slot('inactive', 6), status: 'inactive' }, { ...slot('archived', 7), status: 'Archived' }]
    const model = buildScheduleExportModel(slots, [], options)
    expect(model.blocks.map(block => block.slot?.id)).toEqual(['active'])
    expect(model.days.map(day => day.dayOfWeek)).toEqual([1])
  })
  it('crea un PDF binario de una página con xref y longitud de JPEG correctos', () => {
    const jpeg = new Uint8Array([255, 216, 0, 128, 255, 217])
    const bytes = buildSchedulePdf(jpeg, 1684, 1190, 'week')
    const text = new TextDecoder('latin1').decode(bytes)
    expect(text.startsWith('%PDF-1.4')).toBe(true)
    expect(text).toContain('/Count 1')
    expect(text).toContain('/MediaBox [0 0 841.89 595.28]')
    expect(text).toContain('/Length 6')
    const xref = Number(text.match(/startxref\n(\d+)/)?.[1])
    expect(new TextDecoder().decode(bytes.slice(xref, xref + 4))).toBe('xref')
    const offsets = text.slice(xref).split('\n').slice(3, 8).map(line => Number(line.slice(0, 10)))
    offsets.forEach((offset, index) => expect(new TextDecoder().decode(bytes.slice(offset, offset + 7))).toBe(`${index + 1} 0 obj`))
    expect(() => buildSchedulePdf(new Uint8Array(), 0, 10, 'day')).toThrow()
  })
  it('propaga errores cuando el navegador no puede codificar una imagen', async () => {
    await expect(canvasToBlob({ toBlob: (callback: BlobCallback) => callback(null) } as HTMLCanvasElement, 'image/png')).rejects.toThrow('imagen')
  })
  it('descarga el blob y libera el recurso y el enlace', () => {
    vi.useFakeTimers()
    const create = vi.fn(() => 'blob:schedule')
    const revoke = vi.fn()
    vi.stubGlobal('URL', { createObjectURL: create, revokeObjectURL: revoke })
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    const blob = new Blob(['schedule'])
    downloadScheduleBlob(blob, 'horario.pdf')
    expect(create).toHaveBeenCalledWith(blob)
    expect(click).toHaveBeenCalledOnce()
    expect(document.querySelector('a[download]')).toBeNull()
    vi.runAllTimers()
    expect(revoke).toHaveBeenCalledWith('blob:schedule')
    vi.useRealTimers()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })
})
