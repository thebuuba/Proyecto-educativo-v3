/**
 * @file Página de Horario
 *
 * Vista principal del horario docente con configuración inicial,
 * grilla semanal por bloques y asignación de clases desde cursos existentes.
 */

import {
  CalendarDays,
  Clock,
  Download,
  Plus,
  Printer,
  Settings2,
  Sparkles,
} from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { PageShell } from '@/components/ui/PageShell'
import { ScheduleEntryForm } from '@/modules/schedule/components/ScheduleEntryForm'
import {
  ScheduleSetupWizard,
  type ScheduleSetupPayload,
} from '@/modules/schedule/components/ScheduleSetupWizard'
import { TimeSlotForm } from '@/modules/schedule/components/TimeSlotForm'
import { TimeSlotList } from '@/modules/schedule/components/TimeSlotList'
import { useSchedule } from '@/modules/schedule/hooks/useSchedule'
import type { ScheduleEntry, TimeSlot } from '@/modules/schedule/types'
import {
  defaultScheduleDayIds,
  formatTime,
  getDurationHours,
  getEntryKey,
  getScheduleDaysByIds,
  isBreakSlot,
  mapEntriesByCell,
} from '@/modules/schedule/utils/scheduleGrid'
import { cn } from '@/utils/cn'

const subjectPalette = [
  'border-l-accent bg-accent/14 text-accent-foreground shadow-accent/10',
  'border-l-primary bg-primary/10 text-primary shadow-primary/10',
  'border-l-success bg-success/12 text-success shadow-success/10',
  'border-l-secondary bg-secondary/20 text-secondary-foreground shadow-secondary/10',
  'border-l-warning bg-warning/12 text-warning-foreground shadow-warning/10',
]

type SelectedCell = {
  dayOfWeek: number
  timeSlotId: string
} | null

const workDaysStorageKey = 'aula-base:schedule:work-days'

function hashString(value: string) {
  let hash = 0
  for (let index = 0; index < value.length; index++) {
    hash = ((hash << 5) - hash) + value.charCodeAt(index)
    hash |= 0
  }
  return Math.abs(hash)
}

function formatHours(value: number) {
  if (value <= 0) return '0h'
  if (Number.isInteger(value)) return `${value}h`
  const hours = Math.floor(value)
  const minutes = Math.round((value - hours) * 60)
  return hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`
}

function getEntryCourse(entry: ScheduleEntry) {
  if (entry.gradeName && entry.sectionName) return `${entry.gradeName} ${entry.sectionName}`
  return entry.gradeName || entry.sectionName || 'Sin sección'
}

function getTodayDayOfWeek() {
  const day = new Date().getDay()
  return day === 0 ? 7 : day
}

function getNextClass(entries: ScheduleEntry[]) {
  const today = getTodayDayOfWeek()
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  return (
    entries
      .filter((entry) => {
        const [hours, minutes] = entry.startTime.split(':').map(Number)
        const startMinutes = hours * 60 + minutes
        if (entry.dayOfWeek > today) return true
        if (entry.dayOfWeek < today) return false
        return startMinutes >= currentMinutes
      })
      .sort((first, second) => {
        if (first.dayOfWeek !== second.dayOfWeek) return first.dayOfWeek - second.dayOfWeek
        return first.startTime.localeCompare(second.startTime)
      })[0] ?? entries[0]
  )
}

function downloadScheduleAsCsv(entries: ScheduleEntry[]) {
  const dayNames: Record<number, string> = {
    1: 'Lunes',
    2: 'Martes',
    3: 'Miércoles',
    4: 'Jueves',
    5: 'Viernes',
  }
  const header = 'Curso,Asignatura,Día,Hora inicio,Hora fin'
  const rows = entries.map((entry) =>
    [
      getEntryCourse(entry),
      entry.subjectName,
      dayNames[entry.dayOfWeek] ?? String(entry.dayOfWeek),
      entry.startTime,
      entry.endTime,
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

export function SchedulePage() {
  const {
    timeSlots,
    entries,
    schoolYearId,
    loading,
    error,
    createEntry,
    createTimeSlot,
    updateTimeSlot,
    removeTimeSlot,
    refetchAll,
  } = useSchedule()

  const [showSetupWizard, setShowSetupWizard] = useState(false)
  const [showEntryForm, setShowEntryForm] = useState(false)
  const [selectedCell, setSelectedCell] = useState<SelectedCell>(null)
  const [showTimeSlotForm, setShowTimeSlotForm] = useState(false)
  const [showTimeSlotManager, setShowTimeSlotManager] = useState(false)
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null)
  const [deleteSlotId, setDeleteSlotId] = useState<string | null>(null)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [workDayIds, setWorkDayIds] = useState(() => {
    if (typeof window === 'undefined') return defaultScheduleDayIds
    const stored = window.localStorage.getItem(workDaysStorageKey)
    if (!stored) return defaultScheduleDayIds
    try {
      const parsed = JSON.parse(stored)
      return Array.isArray(parsed) && parsed.every((item) => typeof item === 'number')
        ? parsed
        : defaultScheduleDayIds
    } catch {
      return defaultScheduleDayIds
    }
  })

  const sortedSlots = useMemo(
    () => [...timeSlots].sort((first, second) => first.sequence - second.sequence),
    [timeSlots],
  )
  const activeWeekDays = useMemo(() => getScheduleDaysByIds(workDayIds), [workDayIds])
  const weekEntries = useMemo(
    () => entries.filter((entry) => activeWeekDays.some((day) => day.dayOfWeek === entry.dayOfWeek)),
    [activeWeekDays, entries],
  )
  const entriesByCell = useMemo(() => mapEntriesByCell(weekEntries), [weekEntries])
  const todayDayOfWeek = getTodayDayOfWeek()
  const nextClass = useMemo(() => getNextClass(weekEntries), [weekEntries])
  const classSlots = sortedSlots.filter((slot) => !isBreakSlot(slot))
  const totalHours = weekEntries.reduce(
    (total, entry) => total + getDurationHours(entry.startTime, entry.endTime),
    0,
  )
  const weeklyLoad = activeWeekDays.map((day) => {
    const hours = weekEntries
      .filter((entry) => entry.dayOfWeek === day.dayOfWeek)
      .reduce((total, entry) => total + getDurationHours(entry.startTime, entry.endTime), 0)
    return { ...day, hours }
  })
  const maxDailyHours = Math.max(...weeklyLoad.map((day) => day.hours), 1)
  const freeCells = Math.max(classSlots.length * activeWeekDays.length - weekEntries.length, 0)

  async function handleCreateEntry(input: Parameters<typeof createEntry>[0]) {
    setFormSubmitting(true)
    setFormError(null)
    try {
      await createEntry(input)
      setShowEntryForm(false)
      setSelectedCell(null)
      await refetchAll()
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Error al crear la clase.')
    } finally {
      setFormSubmitting(false)
    }
  }

  async function handleCreateScheduleStructure(payload: ScheduleSetupPayload) {
    setFormSubmitting(true)
    setFormError(null)
    try {
      for (const slot of payload.slots) {
        await createTimeSlot(slot)
      }
      window.localStorage.setItem(workDaysStorageKey, JSON.stringify(payload.workDayIds))
      setWorkDayIds(payload.workDayIds)
      setShowSetupWizard(false)
      await refetchAll()
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Error al configurar el horario.')
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

  function openCell(dayOfWeek: number, timeSlotId: string) {
    setSelectedCell({ dayOfWeek, timeSlotId })
    setShowEntryForm(true)
  }

  function openAddSlot() {
    setEditingSlot(null)
    setShowTimeSlotForm(true)
  }

  function openEditSlot(slot: TimeSlot) {
    setEditingSlot(slot)
    setShowTimeSlotForm(true)
  }

  const hasStructure = sortedSlots.length > 0

  return (
    <PageShell
      title="Horario docente"
      description={
        hasStructure
          ? `${weekEntries.length} clases - ${formatHours(totalHours)} - ${freeCells} espacios libres`
          : 'Organiza tu semana académica antes de registrar clases.'
      }
      actions={
        hasStructure ? (
          <div className="flex flex-wrap gap-3">
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
            <Button variant="outline" size="icon" onClick={() => downloadScheduleAsCsv(weekEntries)} aria-label="Descargar horario">
              <Download className="size-5" />
            </Button>
            <Button variant="secondary" onClick={() => setShowEntryForm(true)}>
              <Plus className="size-4" />
              Nueva clase
            </Button>
          </div>
        ) : null
      }
    >
      {error ? (
        <div className="no-print mb-4 rounded-lg border border-destructive/20 bg-destructive/12 p-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {!loading && !hasStructure ? (
        <div className="rounded-lg border border-dashed border-border bg-card p-8 shadow-sm">
          <div className="mx-auto max-w-2xl text-center">
            <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-accent/15 text-accent">
              <CalendarDays className="size-7" />
            </span>
            <h2 className="mt-6 text-2xl font-bold text-primary">
              Configura tu horario docente
            </h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Antes de registrar tus clases configura la estructura de tu semana académica.
            </p>
            <Button className="mt-7" onClick={() => setShowSetupWizard(true)}>
              <Sparkles className="size-4" />
              Configurar horario
            </Button>
          </div>
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground shadow-sm">
          Cargando horario...
        </div>
      ) : null}

      {hasStructure ? (
        <div
          className={cn(
            'grid gap-6',
            showTimeSlotManager
              ? 'xl:grid-cols-[18rem_minmax(0,1fr)]'
              : 'xl:grid-cols-[minmax(0,1fr)_20rem]',
          )}
        >
          {showTimeSlotManager ? (
            <div className="order-last xl:order-first">
              <TimeSlotList
                timeSlots={sortedSlots}
                onAdd={openAddSlot}
                onEdit={openEditSlot}
                onDelete={(id) => setDeleteSlotId(id)}
              />
            </div>
          ) : null}

          <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-sm">
            <div className="min-w-[58rem]">
              <div
                className="grid border-b border-border bg-muted/35"
                style={{ gridTemplateColumns: `8rem repeat(${activeWeekDays.length}, minmax(10rem, 1fr))` }}
              >
                <div className="border-r border-border px-4 py-4 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  Bloques
                </div>
                {activeWeekDays.map((day) => (
                  <div
                    key={day.dayOfWeek}
                    className={cn(
                      'border-r border-border px-4 py-4 text-center last:border-r-0',
                      day.dayOfWeek === todayDayOfWeek && 'bg-accent/10',
                    )}
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                      {day.label}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-primary">{day.name}</p>
                  </div>
                ))}
              </div>

              {sortedSlots.map((slot) => {
                const breakSlot = isBreakSlot(slot)
                return (
                  <div
                    key={slot.id}
                    className="grid min-h-[6.5rem] border-b border-border last:border-b-0"
                    style={{ gridTemplateColumns: `8rem repeat(${activeWeekDays.length}, minmax(10rem, 1fr))` }}
                  >
                    <div className="border-r border-border bg-muted/20 px-4 py-4">
                      <p className="text-sm font-bold text-foreground">{slot.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                      </p>
                    </div>

                    {breakSlot ? (
                      <div
                        className="flex items-center justify-center bg-warning/12 px-4 py-4 text-sm font-bold text-warning-foreground"
                        style={{ gridColumn: `span ${activeWeekDays.length} / span ${activeWeekDays.length}` }}
                      >
                        {slot.name} - {formatTime(slot.startTime)} a {formatTime(slot.endTime)}
                      </div>
                    ) : (
                      activeWeekDays.map((day) => {
                        const entry = entriesByCell.get(getEntryKey(day.dayOfWeek, slot.id))
                        return (
                          <div
                            key={`${day.dayOfWeek}-${slot.id}`}
                            className="border-r border-border p-2 last:border-r-0"
                          >
                            {entry ? (
                              <div
                                className={cn(
                                  'h-full rounded-lg border-l-4 p-3 shadow-sm',
                                  subjectPalette[hashString(entry.subjectName) % subjectPalette.length],
                                )}
                              >
                                <p className="text-sm font-bold leading-5">{entry.subjectName}</p>
                                <p className="mt-1 text-xs font-semibold opacity-80">
                                  {getEntryCourse(entry)}
                                </p>
                                <p className="mt-3 text-xs opacity-75">
                                  {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
                                </p>
                              </div>
                            ) : (
                              <button
                                type="button"
                                className="flex h-full min-h-[5rem] w-full items-center justify-center rounded-lg border border-dashed border-border text-sm font-semibold text-muted-foreground transition hover:border-accent hover:bg-accent/10 hover:text-accent"
                                onClick={() => openCell(day.dayOfWeek, slot.id)}
                              >
                                Libre
                              </button>
                            )}
                          </div>
                        )
                      })
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {!showTimeSlotManager ? (
            <aside className="no-print space-y-6">
              <div className="rounded-lg bg-primary p-6 text-primary-foreground shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
                  Próxima clase
                </p>
                {nextClass ? (
                  <>
                    <h2 className="mt-6 text-2xl font-bold">{nextClass.subjectName}</h2>
                    <p className="mt-2 text-sm text-primary-foreground/75">
                      {getEntryCourse(nextClass)}
                    </p>
                    <p className="mt-6 flex items-center gap-3 text-sm text-primary-foreground/75">
                      <Clock className="size-5 text-accent" />
                      {formatTime(nextClass.startTime)} - {formatTime(nextClass.endTime)}
                    </p>
                  </>
                ) : (
                  <p className="mt-6 text-sm text-primary-foreground/75">
                    Todavía no hay clases registradas en la semana.
                  </p>
                )}
              </div>

              <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                <h2 className="text-lg font-bold text-primary">Carga semanal</h2>
                <div className="mt-6 space-y-4">
                  {weeklyLoad.map((day) => (
                    <div key={day.dayOfWeek} className="grid grid-cols-[2.5rem_1fr_3rem] items-center gap-3">
                      <span
                        className={cn(
                          'text-sm font-bold text-muted-foreground',
                          day.dayOfWeek === todayDayOfWeek && 'text-accent',
                        )}
                      >
                        {day.label}
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
              </div>

              <div className="rounded-lg border border-dashed border-accent p-6">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
                  Espacios libres
                </p>
                <p className="mt-5 text-3xl font-bold text-primary">{freeCells}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Celdas disponibles para clases u horas pedagógicas futuras.
                </p>
              </div>
            </aside>
          ) : null}
        </div>
      ) : null}

      {showSetupWizard ? (
        <ScheduleSetupWizard
          submitting={formSubmitting}
          error={formError}
          onSubmit={handleCreateScheduleStructure}
          onClose={() => {
            setShowSetupWizard(false)
            setFormError(null)
          }}
        />
      ) : null}

      {showEntryForm && schoolYearId ? (
        <ScheduleEntryForm
          schoolYearId={schoolYearId}
          defaultDayOfWeek={selectedCell?.dayOfWeek}
          defaultTimeSlotId={selectedCell?.timeSlotId}
          submitting={formSubmitting}
          error={formError}
          onSubmit={handleCreateEntry}
          onClose={() => {
            setShowEntryForm(false)
            setSelectedCell(null)
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
          description="Al eliminar este bloque también se eliminarán las clases asociadas a ese bloque."
          confirmLabel="Eliminar"
          destructive
          onConfirm={handleDeleteSlot}
          onClose={() => setDeleteSlotId(null)}
        />
      ) : null}
    </PageShell>
  )
}
