import type { ScheduleEntry, ScheduleJourney, TimeSlot } from '../types'
import { getSubjectPalette } from '@/utils/subjectPalette'
import { minutesFromScheduleTime, scheduleDays, scheduleTimeFromMinutes } from './scheduleStructure'

export type ScheduleExportContent = 'week' | 'day'
export type ScheduleExportOptions = {
  content: ScheduleExportContent
  selectedDay: number
  showFreePeriods: boolean
  includeRooms: boolean
}
export type ScheduleExportData = {
  journeys: ScheduleJourney[]
  slots: TimeSlot[]
  entries: ScheduleEntry[]
  schoolYearName: string
}

export function getScheduleExportSize(content: ScheduleExportContent) {
  return content === 'week' ? { width: 1684, height: 1190 } : { width: 1190, height: 1684 }
}

export function buildScheduleExportModel(slots: TimeSlot[], entries: ScheduleEntry[], options: ScheduleExportOptions) {
  const placed = entries.filter(entry => !(entry as ScheduleEntry & { needsPlacement?: boolean }).needsPlacement)
  const activeSlots = slots.filter(slot => !['ARCHIVED', 'INACTIVE'].includes(slot.status.toUpperCase()))
  const configured = new Set([...activeSlots.flatMap(slot => slot.dayOfWeek === null ? [1, 2, 3, 4, 5] : [slot.dayOfWeek]), ...placed.map(entry => entry.dayOfWeek)])
  const days = scheduleDays.filter(day => options.content === 'day' ? day.dayOfWeek === options.selectedDay : configured.size ? configured.has(day.dayOfWeek) : day.dayOfWeek <= 5)
  const blocks = days.flatMap(day => {
    const dayEntries = placed.filter(entry => entry.dayOfWeek === day.dayOfWeek)
    const daySlots = activeSlots.filter(slot => slot.dayOfWeek === null || slot.dayOfWeek === day.dayOfWeek)
    return [
      ...dayEntries.map(entry => ({ dayOfWeek: day.dayOfWeek, startTime: entry.startTime, endTime: entry.endTime, entry, slot: daySlots.find(slot => slot.id === entry.timeSlotId) })),
      ...daySlots.filter(slot => !dayEntries.some(entry => entry.timeSlotId === slot.id) && (options.showFreePeriods || slot.blockType !== 'CLASS')).map(slot => ({ dayOfWeek: day.dayOfWeek, startTime: slot.startTime, endTime: slot.endTime, slot, entry: undefined })),
    ].filter(block => minutesFromScheduleTime(block.endTime) > minutesFromScheduleTime(block.startTime))
  })
  // The time axis remains stable when free periods are hidden.
  const times = [...activeSlots, ...placed].filter(block => options.content === 'week' || !('dayOfWeek' in block) || block.dayOfWeek === null || block.dayOfWeek === options.selectedDay)
  const starts = times.map(block => minutesFromScheduleTime(block.startTime)).filter(Number.isFinite)
  const ends = times.map(block => minutesFromScheduleTime(block.endTime)).filter(Number.isFinite)
  const start = starts.length ? Math.min(...starts) : 480
  return { days, blocks, start, end: Math.max(start + 60, ends.length ? Math.max(...ends) : 960) }
}

/** Canvas needs computed CSS values; browser tokens stay the single source of truth. */
function exportColors() {
  const styles = getComputedStyle(document.documentElement)
  return {
    ink: styles.getPropertyValue('--palette-text').trim(),
    muted: styles.getPropertyValue('--palette-text-muted').trim(),
    border: styles.getPropertyValue('--palette-gray').trim(),
    paper: styles.getPropertyValue('--palette-white').trim(),
  }
}

function wrapCanvasText(ctx: CanvasRenderingContext2D, text: string, width: number) {
  const lines: string[] = []
  let line = ''
  for (const word of text.split(/\s+/)) {
    if (ctx.measureText(`${line} ${word}`.trim()).width <= width) line = `${line} ${word}`.trim()
    else {
      if (line) lines.push(line)
      line = ''
      // Long subject/room identifiers still fit without truncation.
      for (const letter of word) {
        if (line && ctx.measureText(line + letter).width > width) { lines.push(line); line = '' }
        line += letter
      }
    }
  }
  if (line) lines.push(line)
  return lines
}

export function renderScheduleCanvas(canvas: HTMLCanvasElement, data: ScheduleExportData, options: ScheduleExportOptions) {
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Tu navegador no permite generar la imagen del horario.')
  const size = getScheduleExportSize(options.content)
  canvas.width = size.width
  canvas.height = size.height
  const colors = exportColors()
  const model = buildScheduleExportModel(data.slots, data.entries, options)
  ctx.fillStyle = colors.paper
  ctx.fillRect(0, 0, size.width, size.height)
  ctx.textBaseline = 'top'
  const margin = 52
  ctx.fillStyle = colors.ink
  ctx.font = '600 30px Poppins, sans-serif'
  ctx.fillText('Mi horario', margin, 36)
  ctx.font = '400 17px Poppins, sans-serif'
  ctx.fillStyle = colors.muted
  ctx.fillText(data.schoolYearName || 'Horario docente', margin, 80)
  const top = 156
  const left = margin + 92
  const bottom = size.height - 62
  const width = (size.width - left - margin) / model.days.length
  const scale = (bottom - top) / (model.end - model.start)
  const y = (time: string) => top + (minutesFromScheduleTime(time) - model.start) * scale
  model.days.forEach((day, index) => {
    ctx.fillStyle = colors.ink
    ctx.font = '600 18px Poppins, sans-serif'
    ctx.fillText(day.name, left + index * width + 12, 118)
    ctx.strokeStyle = colors.border
    ctx.strokeRect(left + index * width, top, width, bottom - top)
  })
  for (let minute = model.start; minute <= model.end; minute += 60) {
    const row = top + (minute - model.start) * scale
    ctx.fillStyle = colors.muted
    ctx.font = '400 15px Poppins, sans-serif'
    ctx.fillText(scheduleTimeFromMinutes(minute), margin, row - 7)
    ctx.strokeStyle = colors.border
    ctx.beginPath(); ctx.moveTo(left, row); ctx.lineTo(size.width - margin, row); ctx.stroke()
  }
  model.blocks.forEach(block => {
    const index = model.days.findIndex(day => day.dayOfWeek === block.dayOfWeek)
    const x = left + index * width + 5
    const row = y(block.startTime) + 3
    const height = y(block.endTime) - row - 3
    const cardWidth = width - 10
    const entry = block.entry
    const isFree = !entry && block.slot?.blockType === 'CLASS'
    const accent = entry ? getSubjectPalette(entry.subjectName, entry.appearanceColor).color : colors.border
    ctx.save()
    ctx.beginPath(); ctx.rect(x, row, cardWidth, height); ctx.clip()
    ctx.globalAlpha = 0.12
    ctx.fillStyle = accent
    ctx.fillRect(x, row, cardWidth, height)
    ctx.globalAlpha = 1
    ctx.fillStyle = accent
    ctx.fillRect(x, row, 4, height)
    const labels = [entry?.subjectName ?? (isFree ? 'Período libre' : block.slot?.name ?? 'Pausa'), ...(entry ? [[entry.gradeName, entry.sectionName].filter(Boolean).join(' · '), ...(options.includeRooms && entry.room ? [`Aula ${entry.room}`] : [])] : []), `${block.startTime.slice(0, 5)}–${block.endTime.slice(0, 5)}`].filter(Boolean)
    let fontSize = options.content === 'day' ? 22 : 17
    let lines: string[] = []
    do {
      ctx.font = `400 ${fontSize}px Poppins, sans-serif`
      lines = labels.flatMap(label => wrapCanvasText(ctx, label, cardWidth - 24))
      if (lines.length * fontSize * 1.25 <= height - 14) break
      fontSize -= 0.5
    } while (fontSize > 5)
    ctx.fillStyle = colors.ink
    lines.forEach((line, lineIndex) => ctx.fillText(line, x + 12, row + 7 + lineIndex * fontSize * 1.25))
    ctx.restore()
  })
  ctx.font = '400 13px Poppins, sans-serif'
  ctx.fillStyle = colors.muted
  ctx.fillText('AulaBase · Horario docente', margin, size.height - 30)
  return canvas
}

/** One-page PDF with a JPEG XObject; offsets and lengths are measured in bytes. */
export function buildSchedulePdf(jpeg: Uint8Array, width: number, height: number, content: ScheduleExportContent) {
  if (!jpeg.length || width <= 0 || height <= 0) throw new Error('No se pudo generar el PDF del horario.')
  const [pageWidth, pageHeight] = content === 'week' ? [841.89, 595.28] : [595.28, 841.89]
  const encoder = new TextEncoder()
  const chunks: Uint8Array[] = []
  let length = 0
  const append = (value: string | Uint8Array) => { const bytes = typeof value === 'string' ? encoder.encode(value) : value; chunks.push(bytes); length += bytes.length }
  const offsets = [0]
  const object = (id: number, body: string) => { offsets[id] = length; append(`${id} 0 obj\n${body}\nendobj\n`) }
  append('%PDF-1.4\n')
  object(1, '<< /Type /Catalog /Pages 2 0 R >>')
  object(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>')
  object(3, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /XObject << /Im0 5 0 R >> >> /Contents 4 0 R >>`)
  const stream = `q\n${pageWidth} 0 0 ${pageHeight} 0 0 cm\n/Im0 Do\nQ\n`
  object(4, `<< /Length ${encoder.encode(stream).length} >>\nstream\n${stream}endstream`)
  offsets[5] = length
  append(`5 0 obj\n<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`)
  append(jpeg)
  append('\nendstream\nendobj\n')
  const xref = length
  append(`xref\n0 6\n0000000000 65535 f \n${offsets.slice(1).map(offset => `${String(offset).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`)
  const result = new Uint8Array(length)
  let position = 0
  chunks.forEach(chunk => { result.set(chunk, position); position += chunk.length })
  return result
}

export function canvasToBlob(canvas: HTMLCanvasElement, type: 'image/png' | 'image/jpeg') {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('No se pudo generar la imagen del horario.')), type, 0.95)
  })
}

export async function createScheduleExportBlob(canvas: HTMLCanvasElement, format: 'pdf' | 'png', content: ScheduleExportContent) {
  if (format === 'png') return canvasToBlob(canvas, 'image/png')
  const jpeg = await canvasToBlob(canvas, 'image/jpeg')
  const bytes = buildSchedulePdf(new Uint8Array(await jpeg.arrayBuffer()), canvas.width, canvas.height, content)
  return new Blob([bytes], { type: 'application/pdf' })
}

export function downloadScheduleBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  try { document.body.append(anchor); anchor.click() }
  finally { anchor.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000) }
}
