import { CalendarDays, Clock3, Coffee, Pencil, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { EmptyState } from '@/components/ui/EmptyState'
import { FeedbackBanner, PageHero, StatusBadge } from '@/components/ui/SemanticUI'
import { FlexibleScheduleWizard } from '@/modules/schedule/components/FlexibleScheduleWizard'
import { useSchedule } from '@/modules/schedule/hooks/useSchedule'
import {
  getSectionSubjects,
  saveScheduleStructure,
  scheduleSaveErrorMessage,
} from '@/modules/schedule/services/scheduleService'
import type {
  CreateScheduleEntryInput,
  SaveScheduleStructureInput,
  ScheduleEntry,
  ScheduleJourney,
  TimeSlot,
} from '@/modules/schedule/types'
import {
  blockTypeLabels,
  formatScheduleRange,
  formatScheduleTime,
  scheduleDays,
} from '@/modules/schedule/utils/scheduleStructure'
import { cn } from '@/utils/cn'
import { ApiError } from '@/services/apiClient'

type SubjectOption = { id: string; sectionId: string; label: string }

export function SchedulePage() {
  const {
    journeys,
    timeSlots,
    entries,
    sections,
    schoolYearId,
    loading,
    error,
    createEntry,
    removeEntry,
    refetchAll,
  } = useSchedule()
  const [editing, setEditing] = useState(false)
  const [assigning, setAssigning] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [selectedDay, setSelectedDay] = useState(1)
  const [subjects, setSubjects] = useState<SubjectOption[]>([])
  const [wizardSummary, setWizardSummary] = useState<{
    days: number
    journeys: number
    periods: number
    lectiveMinutes: number
  } | null>(null)

  const configuredDays = useMemo(() => {
    const values = [
      ...new Set(
        timeSlots
          .map((slot) => slot.dayOfWeek)
          .filter((day): day is number => typeof day === 'number' && day >= 1 && day <= 7),
      ),
    ].sort()
    return values.length ? values : [1, 2, 3, 4, 5]
  }, [timeSlots])

  useEffect(() => {
    if (!configuredDays.includes(selectedDay)) setSelectedDay(configuredDays[0] ?? 1)
  }, [configuredDays, selectedDay])

  const loadSubjects = useCallback(async () => {
    const result = await Promise.all(
      sections.map(async (section) => {
        const sectionSubjects = await getSectionSubjects(section.id)
        return sectionSubjects.map((item) => ({
          id: item.id,
          sectionId: section.id,
          label: `${section.gradeName} ${section.name} · ${item.subjectName}`,
        }))
      }),
    )
    setSubjects(result.flat())
  }, [sections])

  useEffect(() => {
    if (sections.length) void loadSubjects()
  }, [loadSubjects, sections.length])

  async function handleStructure(input: SaveScheduleStructureInput) {
    setSaving(true)
    setSaveError(null)
    try {
      await saveScheduleStructure(input)
      await refetchAll()
      setEditing(false)
      setAssigning(true)
    } catch (cause) {
      console.error('POST /api/v1/schedule/structure falló:', {
        status: cause instanceof ApiError ? cause.status : 'network-or-unknown',
        message: cause instanceof Error ? cause.message : String(cause),
      })
      setSaveError(scheduleSaveErrorMessage(cause))
    } finally {
      setSaving(false)
    }
  }

  async function assign(slot: TimeSlot, subjectId: string) {
    const subject = subjects.find((item) => item.id === subjectId)
    if (!subject || !schoolYearId || (slot.blockType ?? 'CLASS') !== 'CLASS') return
    const input: CreateScheduleEntryInput = {
      schoolYearId,
      sectionSubjectId: subject.id,
      sectionId: subject.sectionId,
      timeSlotId: slot.id,
      dayOfWeek: slot.dayOfWeek ?? selectedDay,
    }
    try {
      await createEntry(input)
      await refetchAll()
    } catch (cause) {
      setSaveError(cause instanceof Error ? cause.message : 'No se pudo asignar la clase.')
    }
  }

  async function remove(entry: ScheduleEntry) {
    try {
      await removeEntry(entry.id)
      await refetchAll()
    } catch (cause) {
      setSaveError(cause instanceof Error ? cause.message : 'No se pudo quitar la clase.')
    }
  }

  const hasStructure = timeSlots.length > 0
  const lectiveMinutes = entries.reduce(
    (sum, entry) => sum + duration(entry.startTime, entry.endTime),
    0,
  )

  const configuring = !hasStructure || editing
  const visibleSummary =
    configuring && wizardSummary
      ? wizardSummary
      : {
          days: configuredDays.length,
          journeys: journeys.length || (hasStructure ? 1 : 0),
          periods: timeSlots.filter((slot) => (slot.blockType ?? 'CLASS') === 'CLASS').length,
          lectiveMinutes,
        }

  return (
    <section data-tour="create-schedule" className="w-full min-w-0 space-y-5 pb-10">
      <PageHero
        title="Horario docente"
        description={
          hasStructure
            ? 'Tu jornada, períodos y clases en una vista flexible.'
            : 'Configura tus días, jornadas, períodos y clases.'
        }
        icon={CalendarDays}
        tone="info"
        eyebrow="Semana académica"
        actions={
          hasStructure && !editing ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setAssigning((value) => !value)}>
                {assigning ? 'Finalizar asignación' : 'Asignar clases'}
              </Button>
              <Button onClick={() => setEditing(true)}>
                <Pencil className="size-4" />
                Editar estructura
              </Button>
            </div>
          ) : null
        }
      >
        <div className="flex flex-wrap gap-2">
          <StatusBadge tone="info">{entries.length} clases</StatusBadge>
          <StatusBadge tone="neutral">{visibleSummary.days} días</StatusBadge>
          <StatusBadge tone="neutral">{visibleSummary.journeys} jornadas</StatusBadge>
          <StatusBadge tone="success">
            {Math.floor(visibleSummary.lectiveMinutes / 60)} h {visibleSummary.lectiveMinutes % 60}{' '}
            min lectivos
          </StatusBadge>
        </div>
      </PageHero>
      {error ? <FeedbackBanner tone="danger">{error}</FeedbackBanner> : null}
      {saveError && !configuring ? (
        <FeedbackBanner tone="danger">{saveError}</FeedbackBanner>
      ) : null}
      {loading ? (
        <div className="rounded-3xl bg-card py-28 text-center text-sm text-muted-foreground shadow-sm">
          Cargando horario…
        </div>
      ) : null}
      {!loading && configuring ? (
        <FlexibleScheduleWizard
          initialJourneys={journeys}
          initialSlots={timeSlots}
          submitting={saving}
          error={saveError}
          onComplete={handleStructure}
          onSummaryChange={setWizardSummary}
          onCancel={hasStructure ? () => setEditing(false) : undefined}
        />
      ) : null}
      {!loading && hasStructure && !editing ? (
        <WeeklySchedule
          journeys={journeys}
          slots={timeSlots}
          entries={entries}
          days={configuredDays}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
          assigning={assigning}
          subjects={subjects}
          onAssign={assign}
          onRemove={remove}
        />
      ) : null}
    </section>
  )
}

function WeeklySchedule({
  journeys,
  slots,
  entries,
  days,
  selectedDay,
  onSelectDay,
  assigning,
  subjects,
  onAssign,
  onRemove,
}: {
  journeys: ScheduleJourney[]
  slots: TimeSlot[]
  entries: ScheduleEntry[]
  days: number[]
  selectedDay: number
  onSelectDay: (day: number) => void
  assigning: boolean
  subjects: SubjectOption[]
  onAssign: (slot: TimeSlot, subjectId: string) => void
  onRemove: (entry: ScheduleEntry) => void
}) {
  return (
    <section className="overflow-hidden rounded-3xl bg-card shadow-sm">
      <header className="border-b border-border p-4">
        <div className="flex gap-2 overflow-x-auto" role="tablist" aria-label="Días del horario">
          {days.map((day) => {
            const data = scheduleDays.find((item) => item.dayOfWeek === day)!
            return (
              <button
                key={day}
                type="button"
                role="tab"
                aria-selected={selectedDay === day}
                onClick={() => onSelectDay(day)}
                className={cn(
                  'min-h-11 min-w-20 rounded-xl px-4 text-sm font-bold',
                  selectedDay === day
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 text-muted-foreground',
                )}
              >
                {data.short}
              </button>
            )
          })}
        </div>
      </header>
      <div className="p-4 sm:p-6">
        <div
          className="hidden grid-cols-[7rem_repeat(var(--schedule-days),minmax(12rem,1fr))] gap-3 lg:grid"
          style={{ '--schedule-days': days.length } as React.CSSProperties}
        >
          <span />
          {days.map((day) => (
            <strong
              key={day}
              className="text-center text-xs uppercase tracking-wide text-muted-foreground"
            >
              {scheduleDays.find((item) => item.dayOfWeek === day)?.name ?? `Día ${day}`}
            </strong>
          ))}
          <DesktopRows
            journeys={journeys}
            slots={slots}
            entries={entries}
            days={days}
            assigning={assigning}
            subjects={subjects}
            onAssign={onAssign}
            onRemove={onRemove}
          />
        </div>
        <div className="space-y-5 lg:hidden">
          <DayColumn
            day={selectedDay}
            journeys={journeys}
            slots={slots}
            entries={entries}
            assigning={assigning}
            subjects={subjects}
            onAssign={onAssign}
            onRemove={onRemove}
          />
        </div>
      </div>
    </section>
  )
}

function DesktopRows({
  journeys,
  slots,
  entries,
  days,
  assigning,
  subjects,
  onAssign,
  onRemove,
}: Omit<Parameters<typeof WeeklySchedule>[0], 'selectedDay' | 'onSelectDay'>) {
  const times = [
    ...new Set(slots.map((slot) => `${slot.startTime.slice(0, 5)}-${slot.endTime.slice(0, 5)}`)),
  ].sort()
  return (
    <>
      {times.map((time) => {
        const [start, end] = time.split('-')
        return (
          <div key={time} className="contents">
            <div className="pt-3 text-right text-xs font-bold text-muted-foreground">
              <span className="block">{formatScheduleTime(start)}</span>
              <span>{formatScheduleTime(end)}</span>
            </div>
            {days.map((day) => {
              const slot = slots.find(
                (item) =>
                  (item.dayOfWeek === day || item.dayOfWeek == null) &&
                  item.startTime.startsWith(start) &&
                  item.endTime.startsWith(end),
              )
              return (
                <div key={`${day}-${time}`}>
                  {slot ? (
                    <ScheduleCell
                      slot={slot}
                      entry={entries.find(
                        (item) => item.dayOfWeek === day && item.timeSlotId === slot.id,
                      )}
                      journey={journeys.find((item) => item.id === slot.journeyId)}
                      assigning={assigning}
                      subjects={subjects}
                      onAssign={onAssign}
                      onRemove={onRemove}
                    />
                  ) : (
                    <div
                      className="min-h-20 rounded-2xl border border-dashed border-border bg-muted/10"
                      aria-label="Espacio disponible"
                    />
                  )}
                </div>
              )
            })}
          </div>
        )
      })}
    </>
  )
}

function DayColumn({
  day,
  journeys,
  slots,
  entries,
  assigning,
  subjects,
  onAssign,
  onRemove,
}: {
  day: number
  journeys: ScheduleJourney[]
  slots: TimeSlot[]
  entries: ScheduleEntry[]
  assigning: boolean
  subjects: SubjectOption[]
  onAssign: (slot: TimeSlot, subjectId: string) => void
  onRemove: (entry: ScheduleEntry) => void
}) {
  const daySlots = slots
    .filter((slot) => slot.dayOfWeek === day || slot.dayOfWeek == null)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
  if (!daySlots.length)
    return (
      <EmptyState
        title="Sin estructura para este día"
        description="Personaliza este día desde Editar estructura."
      />
    )
  return (
    <>
      {journeys.length
        ? journeys.map((journey) => {
            const journeySlots = daySlots.filter((slot) => slot.journeyId === journey.id)
            if (!journeySlots.length) return null
            return (
              <section key={journey.id} className="space-y-2">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <strong className="text-sm uppercase tracking-wide">{journey.name}</strong>
                  <span className="text-xs text-muted-foreground">
                    {formatScheduleRange(journey.startTime, journey.endTime)}
                  </span>
                </div>
                {journeySlots.map((slot) => (
                  <ScheduleCell
                    key={slot.id}
                    slot={slot}
                    entry={entries.find(
                      (entry) => entry.dayOfWeek === day && entry.timeSlotId === slot.id,
                    )}
                    journey={journey}
                    assigning={assigning}
                    subjects={subjects}
                    onAssign={onAssign}
                    onRemove={onRemove}
                  />
                ))}
              </section>
            )
          })
        : daySlots.map((slot) => (
            <ScheduleCell
              key={slot.id}
              slot={slot}
              entry={entries.find(
                (entry) => entry.dayOfWeek === day && entry.timeSlotId === slot.id,
              )}
              assigning={assigning}
              subjects={subjects}
              onAssign={onAssign}
              onRemove={onRemove}
            />
          ))}
    </>
  )
}

function ScheduleCell({
  slot,
  entry,
  journey,
  assigning,
  subjects,
  onAssign,
  onRemove,
}: {
  slot: TimeSlot
  entry?: ScheduleEntry
  journey?: ScheduleJourney
  assigning: boolean
  subjects: SubjectOption[]
  onAssign: (slot: TimeSlot, subjectId: string) => void
  onRemove: (entry: ScheduleEntry) => void
}) {
  const blockType = slot.blockType ?? 'CLASS'
  const nonLective = blockType !== 'CLASS'
  return (
    <article
      className={cn(
        'min-h-20 rounded-2xl border p-3',
        nonLective
          ? 'border-warning/30 bg-warning/10'
          : entry
            ? 'border-primary/25 bg-primary/5'
            : 'border-border bg-card',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-bold text-muted-foreground">
            {formatScheduleRange(slot.startTime, slot.endTime)} ·{' '}
            {duration(slot.startTime, slot.endTime)} min
          </p>
          <p className="mt-1 text-sm font-extrabold text-foreground">
            {entry ? entry.subjectName : slot.name}
          </p>
          {entry ? (
            <p className="text-xs text-muted-foreground">
              {entry.gradeName} {entry.sectionName}
            </p>
          ) : nonLective ? (
            <p className="text-xs text-warning-foreground">{blockTypeLabels[blockType]}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Disponible{journey ? ` · ${journey.name}` : ''}
            </p>
          )}
        </div>
        {nonLective ? (
          <Coffee className="size-4 text-warning-foreground" />
        ) : (
          <Clock3 className="size-4 text-primary" />
        )}
      </div>
      {assigning && blockType === 'CLASS' ? (
        <div className="mt-3">
          {entry ? (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="text-destructive"
              onClick={() => onRemove(entry)}
            >
              <Trash2 className="size-4" />
              Quitar
            </Button>
          ) : (
            <Select
              aria-label={`Asignar clase a ${slot.name}`}
              defaultValue=""
              onChange={(event) => {
                if (event.target.value) onAssign(slot, event.target.value)
              }}
            >
              <option value="">+ Asignar clase</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.label}
                </option>
              ))}
            </Select>
          )}
        </div>
      ) : null}
    </article>
  )
}

function duration(start: string, end: string) {
  const [sh, sm] = start.slice(0, 5).split(':').map(Number)
  const [eh, em] = end.slice(0, 5).split(':').map(Number)
  return Math.max(0, eh * 60 + em - sh * 60 - sm)
}
