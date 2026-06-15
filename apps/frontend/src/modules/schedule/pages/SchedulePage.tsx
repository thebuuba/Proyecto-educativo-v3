/**
 * @file Página de Horario
 *
 * Vista principal del horario docente con calendario semanal,
 * carga horaria, próxima clase y gestión de bloques.
 */

import {
  CalendarDays,
  Clock,
  Download,
  MapPin,
  Plus,
  Printer,
  Settings2,
  Users,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { PageShell } from '@/components/ui/PageShell'
import { ScheduleEntryForm } from '@/modules/schedule/components/ScheduleEntryForm'
import { TimeSlotForm } from '@/modules/schedule/components/TimeSlotForm'
import { TimeSlotList } from '@/modules/schedule/components/TimeSlotList'
import { getScheduleSummary } from '@/modules/schedule/services/scheduleService'
import { useSchedule } from '@/modules/schedule/hooks/useSchedule'
import type { ScheduleCalendarEntry, ScheduleSummary, TimeSlot } from '@/modules/schedule/types'
import { DEFAULTS } from '@/constants'
import { cn } from '@/utils/cn'

/** Días de la semana laborales */
const weekDays = [
  { label: 'LUN', dayOfWeek: 1 },
  { label: 'MAR', dayOfWeek: 2 },
  { label: 'MIÉ', dayOfWeek: 3 },
  { label: 'JUE', dayOfWeek: 4 },
  { label: 'VIE', dayOfWeek: 5 },
]

const visibleHours = Array.from({ length: DEFAULTS.VISIBLE_HOUR_COUNT }, (_, index) => index + DEFAULTS.VISIBLE_START_HOUR)
const hourHeight = DEFAULTS.HOUR_HEIGHT_REM

const subjectPalette = [
  'border-l-accent bg-accent/18 text-accent-foreground shadow-accent/10',
  'border-l-primary bg-primary/10 text-primary shadow-primary/10',
  'border-l-success bg-success/12 text-success shadow-success/10',
  'border-l-secondary bg-secondary/20 text-secondary-foreground shadow-secondary/10',
  'border-l-warning bg-warning/12 text-warning-foreground shadow-warning/10',
  'border-l-destructive bg-destructive/10 text-destructive-foreground shadow-destructive/10',
]

/** Genera un hash numérico a partir de un string */
function hashString(value: string) {
  let hash = 0
  for (let index = 0; index < value.length; index++) {
    const char = value.charCodeAt(index)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  return Math.abs(hash)
}

/** Formatea una hora ISO (HH:mm) quitando los segundos */
function formatTime(value: string) {
  return value.slice(0, 5)
}

/** Formatea un número de horas a formato legible (ej: 1h 30min) */
function formatHours(value: number) {
  if (Number.isInteger(value)) return `${value}h`
  const hours = Math.floor(value)
  const minutes = Math.round((value - hours) * 60)
  return `${hours}h ${minutes}min`
}

/** Convierte una hora ISO a su valor numérico en horas */
function getTimeAsHour(value: string) {
  const [hours, minutes] = value.split(':').map(Number)
  return hours + minutes / 60
}

/** Obtiene el nombre del curso a partir de una entrada del calendario */
function getEntryCourse(entry: ScheduleCalendarEntry) {
  if (entry.gradeName && entry.sectionName) {
    return `${entry.gradeName} ${entry.sectionName}`
  }
  return entry.gradeName ?? entry.sectionName ?? 'Sin sección'
}

/** Calcula la posición y altura de una entrada en el calendario visual */
function getEntryPosition(entry: ScheduleCalendarEntry) {
  const start = getTimeAsHour(entry.startTime)
  const end = getTimeAsHour(entry.endTime)
  const top = Math.max(start - DEFAULTS.VISIBLE_START_HOUR, 0) * hourHeight
  const height = Math.max((end - start) * hourHeight, DEFAULTS.MIN_ENTRY_HEIGHT_REM)
  return { top: `${top}rem`, height: `${height}rem` }
}

/** Obtiene el rótulo de la semana actual (ej: "10 — 14 de marzo") */
function getWeekLabel() {
  const today = new Date()
  const day = today.getDay() === 0 ? 7 : today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - day + 1)
  const friday = new Date(monday)
  friday.setDate(monday.getDate() + 4)
  const month = new Intl.DateTimeFormat('es-DO', { month: 'long' }).format(friday)
  return `${monday.getDate()} — ${friday.getDate()} de ${month}`
}

/** Obtiene el día de la semana actual (1=lunes, 7=domingo) */
function getTodayDayOfWeek() {
  const day = new Date().getDay()
  return day === 0 ? 7 : day
}

/** Obtiene el número de día del mes para un día de la semana */
function getDayDate(dayOfWeek: number) {
  const today = new Date()
  const currentDay = today.getDay() === 0 ? 7 : today.getDay()
  const diff = dayOfWeek - currentDay
  const date = new Date(today)
  date.setDate(today.getDate() + diff)
  return date.getDate()
}

/** Descarga el horario como archivo CSV */
function downloadScheduleAsCsv(entries: ScheduleCalendarEntry[]) {
  const header = 'Materia,Curso,Día,Hora Inicio,Hora Fin,Aula,Estudiantes'
  const dayNames: Record<number, string> = { 1: 'LUN', 2: 'MAR', 3: 'MIÉ', 4: 'JUE', 5: 'VIE' }
  const rows = entries.map((entry) =>
    [
      entry.subjectName,
      entry.gradeName && entry.sectionName ? `${entry.gradeName} ${entry.sectionName}` : (entry.gradeName ?? entry.sectionName ?? ''),
      dayNames[entry.dayOfWeek] ?? String(entry.dayOfWeek),
      entry.startTime,
      entry.endTime,
      entry.room ?? '',
      entry.studentCount,
    ].join(','),
  )
  const blob = new Blob([`${header}\n${rows.join('\n')}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `horario-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/** Obtiene la próxima clase del horario a partir del momento actual */
function getNextClass(entries: ScheduleCalendarEntry[]) {
  const today = getTodayDayOfWeek()
  const now = new Date()
  const currentHour = now.getHours() + now.getMinutes() / 60
  return (
    entries
      .filter((entry) => {
        if (entry.dayOfWeek > today) return true
        if (entry.dayOfWeek < today) return false
        return getTimeAsHour(entry.startTime) >= currentHour
      })
      .sort((first, second) => {
        if (first.dayOfWeek !== second.dayOfWeek) return first.dayOfWeek - second.dayOfWeek
        return getTimeAsHour(first.startTime) - getTimeAsHour(second.startTime)
      })[0] ?? entries[0]
  )
}

/** Página principal del horario docente con calendario semanal */
export function SchedulePage() {
  const {
    timeSlots,
    schoolYearId,
    createEntry,
    createTimeSlot,
    updateTimeSlot,
    removeTimeSlot,
  } = useSchedule()

  const [summary, setSummary] = useState<ScheduleSummary>({
    entries: [],
    totalClasses: 0,
    totalHours: 0,
    sectionCount: 0,
    weeklyLoad: weekDays.map((day) => ({
      dayLabel: day.label,
      dayOfWeek: day.dayOfWeek,
      hours: 0,
    })),
  })
  const [summaryLoading, setSummaryLoading] = useState(true)
  const [summaryError, setSummaryError] = useState<string | null>(null)

  const [showEntryForm, setShowEntryForm] = useState(false)
  const [showTimeSlotForm, setShowTimeSlotForm] = useState(false)
  const [showTimeSlotManager, setShowTimeSlotManager] = useState(false)
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null)
  const [deleteSlotId, setDeleteSlotId] = useState<string | null>(null)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const todayDayOfWeek = getTodayDayOfWeek()
  const nextClass = useMemo(() => getNextClass(summary.entries), [summary.entries])
  const maxDailyHours = Math.max(...summary.weeklyLoad.map((day) => day.hours), 1)

  /** Carga el resumen del horario desde el servidor */
  const loadSummary = useCallback(async () => {
    setSummaryLoading(true)
    setSummaryError(null)
    try {
      const data = await getScheduleSummary()
      setSummary(data)
    } catch (error) {
      setSummaryError(
        error instanceof Error ? error.message : 'No se pudo cargar el horario.',
      )
    } finally {
      setSummaryLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadSummary()
  }, [loadSummary])

  async function handleCreateEntry(input: Parameters<typeof createEntry>[0]) {
    setFormSubmitting(true)
    setFormError(null)
    try {
      await createEntry(input)
      setShowEntryForm(false)
      await loadSummary()
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Error al crear la clase.')
    } finally {
      setFormSubmitting(false)
    }
  }

  async function handleCreateTimeSlot(input: Parameters<typeof createTimeSlot>[0]) {
    setFormSubmitting(true)
    setFormError(null)
    try {
      await createTimeSlot(input)
      setShowTimeSlotForm(false)
      setEditingSlot(null)
      await loadSummary()
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Error al crear el bloque.')
    } finally {
      setFormSubmitting(false)
    }
  }

  async function handleUpdateTimeSlot(id: string, input: Parameters<typeof updateTimeSlot>[1]) {
    setFormSubmitting(true)
    setFormError(null)
    try {
      await updateTimeSlot(id, input)
      setShowTimeSlotForm(false)
      setEditingSlot(null)
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Error al actualizar el bloque.')
    } finally {
      setFormSubmitting(false)
    }
  }

  async function handleDeleteSlot() {
    if (!deleteSlotId) return
    try {
      await removeTimeSlot(deleteSlotId)
      setDeleteSlotId(null)
    } catch (error) {
      console.error('Error al eliminar bloque horario:', error)
    }
  }

  function openEditSlot(slot: TimeSlot) {
    setEditingSlot(slot)
    setShowTimeSlotForm(true)
  }

  function openAddSlot() {
    setEditingSlot(null)
    setShowTimeSlotForm(true)
  }

  return (
    <PageShell
      title="Horario docente"
      description={`${summary.totalClasses} clases · ${formatHours(summary.totalHours)} · ${summary.sectionCount} secciones`}
      actions={
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowTimeSlotManager(!showTimeSlotManager)}
            aria-label="Gestionar bloques horarios"
          >
            <Settings2 className="size-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => window.print()} aria-label="Imprimir horario">
            <Printer className="size-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => downloadScheduleAsCsv(summary.entries)} aria-label="Descargar horario">
            <Download className="size-5" />
          </Button>
          <Button variant="secondary" onClick={() => setShowEntryForm(true)}>
            <Plus className="size-4" />
            Nueva clase
          </Button>
        </div>
      }
    >
      <div className="mb-7 rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="items-center gap-5 hidden sm:flex">
            <div>
              <p className="text-lg font-bold text-primary">{getWeekLabel()}</p>
              <p className="mt-1 text-sm text-muted-foreground">Semana actual</p>
            </div>
          </div>

          <div className="no-print inline-flex rounded-lg bg-muted p-1">
            {['Semana', 'Día', 'Lista'].map((view) => (
              <button
                key={view}
                type="button"
                aria-label={`Vista ${view}`}
                aria-pressed={view === 'Semana'}
                className={cn(
                  'h-10 rounded-lg px-5 text-sm font-bold transition-colors',
                  view === 'Semana'
                    ? 'bg-card text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {view}
              </button>
            ))}
          </div>
        </div>
      </div>

      {summaryError ? (
        <div className="no-print mb-4 rounded-lg border border-destructive/20 bg-destructive/12 p-3 text-sm text-destructive">
          {summaryError}
        </div>
      ) : null}

      <div
        className={cn(
          'grid gap-6',
          showTimeSlotManager
            ? 'xl:grid-cols-[minmax(0,1fr)_18rem]'
            : 'xl:grid-cols-[minmax(0,1fr)_22rem]',
        )}
      >
        {showTimeSlotManager ? (
          <div className="order-last xl:order-first">
            <TimeSlotList
              timeSlots={timeSlots}
              onAdd={openAddSlot}
              onEdit={openEditSlot}
              onDelete={(id) => setDeleteSlotId(id)}
            />
          </div>
        ) : null}

        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <div className="grid grid-cols-[5.5rem_repeat(5,minmax(10rem,1fr))] border-b border-border">
            <div className="border-r border-border" />
            {weekDays.map((day) => (
              <div
                key={day.dayOfWeek}
                className="border-r border-border px-5 py-6 text-center last:border-r-0"
              >
                <p
                  className={cn(
                    'text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground',
                    day.dayOfWeek === todayDayOfWeek && 'text-accent',
                  )}
                >
                  {day.label}
                </p>
                <p
                  className={cn(
                    'mt-2 text-3xl font-bold leading-none text-primary',
                    day.dayOfWeek === todayDayOfWeek &&
                      'mx-auto flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-sm',
                  )}
                >
                  {getDayDate(day.dayOfWeek)}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-[5.5rem_repeat(5,minmax(10rem,1fr))]">
            <div className="relative">
              {visibleHours.map((hour) => (
                <div
                  key={hour}
                  className="h-[7.25rem] border-r border-border pr-3 text-right text-xs font-bold text-muted-foreground"
                >
                  <span className="-translate-y-1/2 inline-block">
                    {String(hour).padStart(2, '0')}:00
                  </span>
                </div>
              ))}
            </div>

            {weekDays.map((day) => (
              <div
                key={day.dayOfWeek}
                className="relative min-h-[65.25rem] border-r border-border last:border-r-0"
              >
                {visibleHours.map((hour) => (
                  <div
                    key={hour}
                    className="h-[7.25rem] border-b border-dashed border-border"
                  />
                ))}

                {summary.entries
                  .filter((entry) => entry.dayOfWeek === day.dayOfWeek)
                  .map((entry) => (
                    <div
                      key={entry.id}
                      className={cn(
                        'absolute left-2 right-2 rounded-lg border-l-4 p-4 shadow-sm',
                        subjectPalette[
                          hashString(entry.subjectName) % subjectPalette.length
                        ],
                      )}
                      style={getEntryPosition(entry)}
                    >
                      <p className="text-sm font-bold">{entry.subjectName}</p>
                      <p className="mt-1 text-xs font-bold opacity-80">
                        {getEntryCourse(entry)}
                      </p>
                      <p className="mt-2 text-xs opacity-80">
                        {formatTime(entry.startTime)}
                        {entry.room ? ` · ${entry.room}` : ''}
                      </p>
                    </div>
                  ))}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 border-t border-border px-5 py-4 text-sm text-foreground">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Materias
            </span>
            {Array.from(
              new Map(
                summary.entries.map((entry) => [
                  entry.subjectName,
                  subjectPalette[
                    hashString(entry.subjectName) % subjectPalette.length
                  ],
                ]),
              ).entries(),
            ).map(([subjectName, fullClass]) => {
              const bgClass = fullClass.split(' ').find((c) => c.startsWith('bg-')) ?? 'bg-muted'
              const baseColor = bgClass.replace(/\/\d+$/, '')
              return (
                <span key={subjectName} className="inline-flex items-center gap-2">
                  <span className={cn('size-3 rounded-full', baseColor)} />
                  {subjectName}
                </span>
              )
            })}
          </div>
        </div>

        <aside className="no-print space-y-6">
          <div className="rounded-lg bg-primary p-6 text-primary-foreground shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent">
              Próxima clase
            </p>
            {nextClass ? (
              <>
                <h2 className="mt-6 text-2xl font-bold">{nextClass.subjectName}</h2>
                <p className="mt-2 text-base text-muted-foreground">
                  {getEntryCourse(nextClass)}
                </p>
                <div className="mt-7 space-y-4 text-sm text-muted-foreground">
                  <p className="flex items-center gap-3">
                    <Clock className="size-5 text-accent" />
                    {formatTime(nextClass.startTime)} ·{' '}
                    {Math.round(
                      (getTimeAsHour(nextClass.endTime) - getTimeAsHour(nextClass.startTime)) * 60,
                    )}{' '}
                    min
                  </p>
                  <p className="flex items-center gap-3">
                    <MapPin className="size-5 text-accent" />
                    {nextClass.room ?? 'Sin aula asignada'}
                  </p>
                  <p className="flex items-center gap-3">
                    <Users className="size-5 text-accent" />
                    {nextClass.studentCount} estudiantes
                  </p>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-3">
                  <Button className="bg-accent hover:bg-accent-hover">
                    Pasar lista
                  </Button>
                  <Button variant="outline" className="border-primary-foreground/20 bg-primary">
                    Plan de clase
                  </Button>
                </div>
              </>
            ) : (
              <p className="mt-6 text-sm text-muted-foreground">
                No hay clases activas en el horario.
              </p>
            )}
          </div>

          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-bold text-primary">Carga semanal</h2>
            <div className="mt-6 space-y-4">
              {summary.weeklyLoad.map((day) => (
                <div key={day.dayOfWeek} className="grid grid-cols-[2.5rem_1fr_3rem] items-center gap-3">
                  <span
                    className={cn(
                      'text-sm font-bold text-muted-foreground',
                      day.dayOfWeek === todayDayOfWeek && 'text-accent',
                    )}
                  >
                    {day.dayLabel}
                  </span>
                  <span className="h-2 overflow-hidden rounded-full bg-muted">
                    <span
                      className={cn(
                        'block h-full rounded-full',
                        day.dayOfWeek === todayDayOfWeek ? 'bg-accent' : 'bg-primary',
                      )}
                      style={{ width: `${(day.hours / maxDailyHours) * 100}%` }}
                    />
                  </span>
                  <span className="text-right text-sm font-bold text-primary">
                    {formatHours(day.hours)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
              <span className="text-sm text-muted-foreground">Total semana</span>
              <span className="text-sm font-bold text-primary">
                {formatHours(summary.totalHours)}
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-dashed border-accent p-6">
            <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-accent">
              <CalendarDays className="size-5" />
              Periodos libres
            </p>
            <p className="mt-6 text-3xl font-bold text-primary">
              {formatHours(Math.max(DEFAULTS.MAX_WEEKLY_HOURS - summary.totalHours, 0))}
            </p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Tiempo disponible para planificación, reuniones o tutorías individuales
              esta semana.
            </p>
          </div>
        </aside>
      </div>

      {summaryLoading ? (
        <div className="no-print fixed bottom-4 right-4 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-muted-foreground shadow-sm">
          Cargando horario...
        </div>
      ) : null}

      {showEntryForm && schoolYearId ? (
        <ScheduleEntryForm
          schoolYearId={schoolYearId}
          submitting={formSubmitting}
          error={formError}
          onSubmit={handleCreateEntry}
          onClose={() => {
            setShowEntryForm(false)
            setFormError(null)
          }}
        />
      ) : null}

      {showTimeSlotForm ? (
        <TimeSlotForm
          slot={editingSlot}
          submitting={formSubmitting}
          error={formError}
          onSubmit={(input) => {
            if (editingSlot) {
              return handleUpdateTimeSlot(editingSlot.id, input)
            }
            return handleCreateTimeSlot(input as Parameters<typeof createTimeSlot>[0])
          }}
          onClose={() => {
            setShowTimeSlotForm(false)
            setEditingSlot(null)
            setFormError(null)
          }}
        />
      ) : null}

      {deleteSlotId ? (
        <ConfirmDialog
          title="Eliminar bloque horario"
          description="¿Estás seguro de eliminar este bloque? Las clases asociadas quedarán visibles pero el bloque dejará de estar disponible para nuevas asignaciones."
          confirmLabel="Eliminar"
          destructive
          onConfirm={handleDeleteSlot}
          onClose={() => setDeleteSlotId(null)}
        />
      ) : null}
    </PageShell>
  )
}
