import { ArrowLeft, BookOpen, Clock3, MapPin, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import type { ScheduleEntry, ScheduleIntegrityIssue, TimeSlot } from '../types'
import {
  classMinutes,
  decimalHours,
  matchingFreePeriods,
  scheduleDay,
  shortTime,
  slotsOnDay,
} from '../utils/scheduleCalendar'
import { scheduleDays } from '../utils/scheduleStructure'

export type AssignmentOption = {
  id: string
  sectionId: string
  subjectName: string
  courseName: string
}
export type ScheduleSelection = {
  slot: TimeSlot
  day: number
  editing?: boolean
  pending?: ScheduleEntry
}
type Props = {
  selection: ScheduleSelection | null
  entries: ScheduleEntry[]
  pendingEntries: ScheduleEntry[]
  slots: TimeSlot[]
  issues: ScheduleIntegrityIssue[]
  options: AssignmentOption[]
  canEdit: boolean
  busy: boolean
  onBack: () => void
  onEdit: () => void
  onRemove: (entry: ScheduleEntry) => void
  onSelect: (slot: TimeSlot, day: number) => void
  onPending: (entry: ScheduleEntry) => void
  onAssign: (option: AssignmentOption, room: string, days: number[]) => Promise<void>
}
export function ScheduleContextPanel(props: Props) {
  const {
    selection,
    entries,
    pendingEntries,
    slots,
    issues,
    options,
    canEdit,
    busy,
    onBack,
    onEdit,
    onRemove,
    onSelect,
    onPending,
    onAssign,
  } = props
  const [query, setQuery] = useState('')
  const initialEntry =
    selection?.pending ||
    entries.find(
      (entry) => entry.timeSlotId === selection?.slot.id && entry.dayOfWeek === selection?.day,
    )
  const [chosen, setChosen] = useState(initialEntry?.sectionSubjectId || '')
  const [room, setRoom] = useState(initialEntry?.room || '')
  const [repeatDays, setRepeatDays] = useState<number[]>([])
  const [compact, setCompact] = useState(
    () => window.matchMedia?.('(max-width: 760px)').matches ?? false,
  )
  useEffect(() => {
    const media = window.matchMedia?.('(max-width: 760px)')
    if (!media) return
    const update = () => setCompact(media.matches)
    media.addEventListener?.('change', update)
    return () => media.removeEventListener?.('change', update)
  }, [])
  const selected =
    selection &&
    entries.find(
      (entry) => entry.timeSlotId === selection.slot.id && entry.dayOfWeek === selection.day,
    )
  const isForm = selection && (!selected || selection.editing || selection.pending)
  const today = new Date().getDay() || 7
  const agenda = entries
    .filter((entry) => entry.dayOfWeek === today)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
  const reviewEntries = [
    ...pendingEntries,
    ...entries.filter((entry) => issues.some((issue) => issue.entryIds.includes(entry.id))),
  ]
  const panel = (
    <aside className="schedule-context" aria-label="Panel del horario">
      {selection ? (
        <>
          <button className="schedule-back" onClick={onBack}>
            <ArrowLeft size={14} /> Volver al resumen
          </button>
          <div className="schedule-context-heading">
            <span className="schedule-eyebrow">
              {scheduleDay(selection.day).name} · {shortTime(selection.slot.startTime)}–
              {shortTime(selection.slot.endTime)}
            </span>
            <h2>
              {isForm
                ? selection.pending
                  ? 'Reubicar clase'
                  : selection.editing
                    ? 'Cambiar clase'
                    : 'Asignar período'
                : selected?.subjectName}
            </h2>
            <p>
              {isForm
                ? `${selection.slot.name} · ${shortTime(selection.slot.startTime)}–${shortTime(selection.slot.endTime)}`
                : `${selected?.gradeName} · ${selected?.sectionName}`}
            </p>
          </div>
          {isForm && canEdit ? (
            <form
              onSubmit={(event) => {
                event.preventDefault()
                const option = selection.pending
                  ? {
                      id: selection.pending.sectionSubjectId,
                      sectionId: selection.pending.sectionId,
                      subjectName: selection.pending.subjectName,
                      courseName: selection.pending.gradeName,
                    }
                  : options.find((item) => item.id === chosen)
                if (option) void onAssign(option, room, repeatDays)
              }}
            >
              {selection.pending && (
                <label className="schedule-field">
                  Período de destino
                  <select
                    value={`${selection.day}:${selection.slot.id}`}
                    onChange={(event) => {
                      const [day, id] = event.target.value.split(':')
                      const slot = slots.find((item) => item.id === id)
                      if (slot) onSelect(slot, Number(day))
                    }}
                  >
                    {scheduleDays.flatMap((day) =>
                      slotsOnDay(slots, day.dayOfWeek)
                        .filter(
                          (slot) =>
                            slot.blockType === 'CLASS' &&
                            !entries.some(
                              (entry) =>
                                entry.timeSlotId === slot.id && entry.dayOfWeek === day.dayOfWeek,
                            ),
                        )
                        .map((slot) => (
                          <option
                            key={`${day.dayOfWeek}:${slot.id}`}
                            value={`${day.dayOfWeek}:${slot.id}`}
                          >
                            {day.name} · {shortTime(slot.startTime)}–{shortTime(slot.endTime)}
                          </option>
                        )),
                    )}
                  </select>
                </label>
              )}
              {selection.pending ? (
                <div className="schedule-notice">
                  {selection.pending.subjectName} · {selection.pending.gradeName}{' '}
                  {selection.pending.sectionName}
                </div>
              ) : (
                <>
                  <label className="schedule-field">
                    Asignatura y curso
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Buscar asignatura, grado o sección"
                    />
                  </label>
                  <div className="schedule-subject-options">
                    {options
                      .filter((option) =>
                        `${option.subjectName} ${option.courseName}`
                          .toLocaleLowerCase()
                          .includes(query.toLocaleLowerCase()),
                      )
                      .map((option) => (
                        <label key={option.id} className={chosen === option.id ? 'is-chosen' : ''}>
                          <input
                            type="radio"
                            name="schedule-subject"
                            value={option.id}
                            checked={chosen === option.id}
                            onChange={() => setChosen(option.id)}
                          />
                          <span>
                            <strong>{option.subjectName}</strong>
                            <small>{option.courseName}</small>
                          </span>
                        </label>
                      ))}
                    {!options.length && <p>No hay asignaturas disponibles en tus cursos.</p>}
                  </div>
                </>
              )}
              <label className="schedule-field">
                Aula <small>Opcional</small>
                <input
                  value={room}
                  onChange={(event) => setRoom(event.target.value)}
                  placeholder={selected?.room || 'Ej. Aula 204'}
                  maxLength={100}
                />
              </label>
              {!selection.editing && !selection.pending && (
                <div className="schedule-repeat">
                  <p>También a la misma hora el…</p>
                  <div>
                    {matchingFreePeriods(selection.slot, selection.day, slots, entries).map(
                      ({ day }) => (
                        <button
                          type="button"
                          key={day}
                          aria-pressed={repeatDays.includes(day)}
                          onClick={() =>
                            setRepeatDays((days) =>
                              days.includes(day)
                                ? days.filter((value) => value !== day)
                                : [...days, day],
                            )
                          }
                        >
                          {scheduleDay(day).short}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              )}
              <div className="schedule-form-actions">
                <Button variant="outline" onClick={onBack} type="button" disabled={busy}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={busy || (!chosen && !selection.pending)}>
                  {busy
                    ? 'Guardando…'
                    : selection.editing
                      ? 'Guardar cambio'
                      : selection.pending
                        ? 'Reubicar clase'
                        : `Asignar el ${scheduleDay(selection.day).name.toLowerCase()}`}
                </Button>
              </div>
            </form>
          ) : selected ? (
            <>
              {issues
                .filter((issue) => issue.entryIds.includes(selected.id))
                .map((issue) => (
                  <p className="schedule-notice" key={issue.code}>
                    {issue.message}
                  </p>
                ))}
              <dl className="schedule-detail-list">
                <div>
                  <dt>
                    <Clock3 size={14} /> Horario
                  </dt>
                  <dd>
                    {shortTime(selected.startTime)}–{shortTime(selected.endTime)} ·{' '}
                    {classMinutes(selected)} min
                  </dd>
                </div>
                <div>
                  <dt>
                    <BookOpen size={14} /> Curso
                  </dt>
                  <dd>
                    {selected.gradeName} · {selected.sectionName}
                    <small>{selected.academicLevelName}</small>
                  </dd>
                </div>
                <div>
                  <dt>Período</dt>
                  <dd>{selection.slot.name}</dd>
                </div>
                <div>
                  <dt>
                    <MapPin size={14} /> Aula
                  </dt>
                  <dd>{selected.room || 'Sin aula asignada'}</dd>
                </div>
              </dl>
              {canEdit ? (
                <div className="schedule-detail-actions">
                  <Button onClick={onEdit}>Cambiar clase</Button>
                  <Button variant="outline" onClick={() => onRemove(selected)}>
                    Quitar del horario
                  </Button>
                </div>
              ) : (
                <p className="schedule-muted">
                  Solo lectura: no tienes permiso para modificar clases.
                </p>
              )}
            </>
          ) : (
            <p className="schedule-muted">Solo lectura: no tienes permiso para modificar clases.</p>
          )}
        </>
      ) : (
        <>
          <section>
            <div className="schedule-section-heading">
              <h2>Hoy · {scheduleDay(today).name}</h2>
              <span>{agenda.length} clases</span>
            </div>
            <div className="schedule-today-agenda">
              {agenda.length ? (
                agenda.map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => {
                      const slot = slots.find((item) => item.id === entry.timeSlotId)
                      if (slot) onSelect(slot, today)
                    }}
                  >
                    <time>{shortTime(entry.startTime)}</time>
                    <span>
                      <strong>{entry.subjectName}</strong>
                      <small>
                        {entry.gradeName} · {entry.sectionName}
                        {entry.room ? ` · ${entry.room}` : ''}
                      </small>
                    </span>
                  </button>
                ))
              ) : (
                <p className="schedule-muted">Hoy no tienes clases programadas.</p>
              )}
            </div>
          </section>
          <section>
            <div className="schedule-section-heading">
              <h2>Carga semanal</h2>
              <Clock3 size={14} />
            </div>
            <div className="schedule-load-list">
              {scheduleDays
                .filter((day) => slotsOnDay(slots, day.dayOfWeek).length)
                .map((day) => {
                  const minutes = entries
                    .filter((entry) => entry.dayOfWeek === day.dayOfWeek)
                    .reduce((sum, entry) => sum + classMinutes(entry), 0)
                  return (
                    <div key={day.dayOfWeek}>
                      <span>{day.short}</span>
                      <div>
                        <i style={{ width: `${Math.min(100, (minutes / 480) * 100)}%` }} />
                      </div>
                      <small>{decimalHours(minutes)}</small>
                    </div>
                  )
                })}
            </div>
          </section>
          <section id="schedule-review">
            <div className="schedule-section-heading">
              <h2>Requiere revisión</h2>
              <span className="schedule-review-count">{reviewEntries.length}</span>
            </div>
            {reviewEntries.length ? (
              reviewEntries.map((entry) => (
                <div className="schedule-review-item" key={entry.id}>
                  <strong>{entry.subjectName}</strong>
                  <small>
                    {entry.gradeName} · {entry.sectionName}
                  </small>
                  <p>
                    {entry.needsPlacement
                      ? `Sin período · antes ${scheduleDay(entry.dayOfWeek).short} ${shortTime(entry.startTime)}`
                      : issues.find((issue) => issue.entryIds.includes(entry.id))?.message}
                  </p>
                  {canEdit &&
                    (entry.needsPlacement ? (
                      <button onClick={() => onPending(entry)}>
                        Reubicar clase <Plus size={12} />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          const slot = slots.find((slot) => slot.id === entry.timeSlotId)
                          if (slot) onSelect(slot, entry.dayOfWeek)
                        }}
                      >
                        Revisar clase
                      </button>
                    ))}
                  {canEdit && entry.needsPlacement && (
                    <button onClick={() => onRemove(entry)}>Quitar del horario</button>
                  )}
                </div>
              ))
            ) : (
              <p className="schedule-muted">Todo está en orden.</p>
            )}
          </section>
          <div className="schedule-legend">
            <span>
              <i className="is-class" /> Clase
            </span>
            <span>
              <i className="is-free" /> Libre
            </span>
            <span>
              <i className="is-break" /> Descanso
            </span>
            <span>
              <i className="is-review" /> Revisión
            </span>
          </div>
        </>
      )}
    </aside>
  )
  return compact && selection ? (
    <Modal
      title="Detalle del período"
      hideHeader
      onClose={onBack}
      closeDisabled={busy}
      className="schedule-mobile-context"
      overlayClassName="schedule-mobile-context-overlay"
    >
      {panel}
    </Modal>
  ) : (
    panel
  )
}
