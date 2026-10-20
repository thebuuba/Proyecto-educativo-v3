import { useEffect, useMemo, useRef, useState } from 'react'
import { Download, FileImage, FileText, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import type { ScheduleEntry, ScheduleJourney, TimeSlot } from '../types'
import { scheduleDays } from '../utils/scheduleStructure'
import { buildScheduleExportModel, createScheduleExportBlob, downloadScheduleBlob, renderScheduleCanvas, type ScheduleExportContent } from '../utils/scheduleExport'

type ScheduleExportDialogProps = {
  journeys: ScheduleJourney[]
  slots: TimeSlot[]
  entries: ScheduleEntry[]
  schoolYearName: string
  selectedDay: number
  onClose: () => void
}

export function ScheduleExportDialog({ journeys, slots, entries, schoolYearName, selectedDay, onClose }: ScheduleExportDialogProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [format, setFormat] = useState<'pdf' | 'png'>('pdf')
  const [content, setContent] = useState<ScheduleExportContent>('week')
  const [day, setDay] = useState(selectedDay >= 1 && selectedDay <= 7 ? selectedDay : 1)
  const [showFreePeriods, setShowFreePeriods] = useState(true)
  const [includeRooms, setIncludeRooms] = useState(true)
  const [busy, setBusy] = useState(false)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const options = useMemo(() => ({ content, selectedDay: day, showFreePeriods, includeRooms }), [content, day, showFreePeriods, includeRooms])
  const data = useMemo(() => ({ journeys, slots, entries, schoolYearName }), [journeys, slots, entries, schoolYearName])
  const days = useMemo(() => buildScheduleExportModel(slots, entries, { ...options, content: 'week' }).days, [slots, entries, options])

  useEffect(() => {
    let active = true
    setReady(false)
    setError(null)
    async function preview() {
      try {
        if (document.fonts) await document.fonts.ready
        if (!active || !canvasRef.current) return
        renderScheduleCanvas(canvasRef.current, data, options)
        setReady(true)
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : 'No se pudo generar la vista previa.')
      }
    }
    void preview()
    return () => { active = false }
  }, [data, options])

  async function download() {
    if (!canvasRef.current || !ready) return
    setBusy(true)
    setError(null)
    try {
      const blob = await createScheduleExportBlob(canvasRef.current, format, content)
      const suffix = content === 'week' ? 'semana' : scheduleDays.find(item => item.dayOfWeek === day)?.name.toLocaleLowerCase('es') ?? 'dia'
      downloadScheduleBlob(blob, `horario-${suffix}.${format}`)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo descargar el horario. Vuelve a intentarlo.')
    } finally { setBusy(false) }
  }

  return (
    <Modal title="Exportar horario" hideHeader onClose={onClose} closeDisabled={busy} className="max-w-4xl" contentClassName="p-0">
      <div className="grid min-w-0 md:grid-cols-[0.85fr_1.15fr]">
        <div className="flex min-h-64 flex-col items-center justify-center gap-5 border-b border-border bg-muted/50 p-6 md:border-b-0 md:border-r md:p-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Vista previa</span>
          <div className="flex w-full items-center justify-center rounded-xl border border-border bg-card p-3 shadow-sm">
            <canvas ref={canvasRef} role="img" aria-label={`Vista previa real del horario ${content === 'week' ? 'semanal' : 'diario'}`} className="block h-auto max-h-[390px] max-w-full object-contain" style={{ opacity: ready ? 1 : 0.3 }} />
          </div>
          <p className="text-center text-xs text-muted-foreground" aria-live="polite">{ready ? `${format.toUpperCase()} · A4 ${content === 'week' ? 'horizontal' : 'vertical'}` : error ? 'Vista previa no disponible' : 'Preparando vista previa…'}</p>
        </div>
        <div className="min-w-0 p-6 md:p-8">
          <div className="mb-6 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">Exportar horario</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">El archivo se genera con los datos actuales de tu horario</p>
            </div>
            <Button variant="ghost" size="icon" data-ui-action="close" aria-label="Cerrar" disabled={busy} onClick={onClose}><X className="size-4" /></Button>
          </div>
          <fieldset disabled={busy} className="space-y-5">
            <fieldset>
              <legend className="mb-2 text-sm font-semibold text-foreground">Formato</legend>
              <div className="grid grid-cols-2 gap-3">
                {([{ value: 'pdf', title: 'PDF', detail: 'Hoja A4 lista para imprimir', icon: FileText }, { value: 'png', title: 'Imagen PNG', detail: 'Para compartir o fijar', icon: FileImage }] as const).map(item => (
                  <label key={item.value} className={`flex min-w-0 cursor-pointer flex-col gap-2 rounded-xl border p-3 ${format === item.value ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}>
                    <div className="flex items-center justify-between"><item.icon aria-hidden="true" className="size-5 text-primary" /><input type="radio" name="schedule-export-format" value={item.value} checked={format === item.value} onChange={() => setFormat(item.value)} className="size-4 accent-primary" /></div>
                    <span className="text-sm font-semibold text-foreground">{item.title}</span><span className="text-xs leading-5 text-muted-foreground">{item.detail}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="mb-2 text-sm font-semibold text-foreground">Contenido</legend>
              <div className="grid grid-cols-2 gap-3">
                {([{ value: 'week', title: 'Semana', detail: `${days.length} días · horizontal` }, { value: 'day', title: 'Un día', detail: 'Vertical' }] as const).map(item => (
                  <label key={item.value} className={`flex cursor-pointer items-start gap-2 rounded-xl border p-3 ${content === item.value ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}>
                    <input type="radio" name="schedule-export-content" value={item.value} checked={content === item.value} onChange={() => setContent(item.value)} className="mt-1 size-4 accent-primary" />
                    <span><span className="block text-sm font-semibold text-foreground">{item.title}</span><span className="mt-1 block text-xs text-muted-foreground">{item.detail}</span></span>
                  </label>
                ))}
              </div>
              {content === 'day' ? <label className="mt-3 block text-sm font-medium text-foreground">Día<Select aria-label="Día del horario a exportar" value={day} onChange={event => setDay(Number(event.target.value))} className="mt-2">{scheduleDays.map(item => <option key={item.dayOfWeek} value={item.dayOfWeek}>{item.name}</option>)}</Select></label> : null}
            </fieldset>
            <div className="space-y-3 border-t border-border pt-4">
              {[{ label: 'Mostrar períodos libres', checked: showFreePeriods, update: setShowFreePeriods }, { label: 'Incluir aulas', checked: includeRooms, update: setIncludeRooms }].map(item => (
                <label key={item.label} className="flex min-h-11 cursor-pointer items-center justify-between gap-4 text-sm text-foreground">
                  <span>{item.label}</span>
                  <span className="relative flex shrink-0">
                    <input role="switch" type="checkbox" checked={item.checked} onChange={event => item.update(event.target.checked)} className="peer sr-only" />
                    <span aria-hidden="true" className="h-6 w-11 rounded-full bg-border transition-colors peer-checked:bg-primary peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring" />
                    <span aria-hidden="true" className="pointer-events-none absolute left-1 top-1 size-4 rounded-full bg-card shadow-sm transition-transform peer-checked:translate-x-5" />
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          {error ? <p role="alert" className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}
          <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-border pt-5">
            <Button variant="outline" data-ui-action="cancel" disabled={busy} onClick={onClose}>Cancelar</Button>
            <Button disabled={!ready} loading={busy} onClick={() => void download()}><Download className="size-4" aria-hidden="true" />Descargar {format.toUpperCase()}</Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
