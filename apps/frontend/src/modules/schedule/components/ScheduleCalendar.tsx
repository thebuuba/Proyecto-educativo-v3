import type { CSSProperties } from 'react'
import { Clock3, Plus } from 'lucide-react'
import type { ScheduleEntry, ScheduleJourney, TimeSlot } from '../types'
import { blockTypeLabels, scheduleTimeFromMinutes } from '../utils/scheduleStructure'
import {
  calendarBounds,
  calendarPosition,
  configuredScheduleDays,
  scheduleDay,
  shortTime,
  slotsOnDay,
  slotKey,
} from '../utils/scheduleCalendar'
import { getSubjectPalette } from '@/utils/subjectPalette'

type Props = {
  slots: TimeSlot[]
  journeys: ScheduleJourney[]
  entries: ScheduleEntry[]
  view?: 'week' | 'day'
  selectedDay?: number
  onSelectDay?: (day: number) => void
  selectedKey?: string | null
  onSelect?: (slot: TimeSlot, day: number) => void
  highlightFree?: boolean
  now?: Date
  preview?: boolean
  affectedEntryIds?: Set<string>
}

export function ScheduleCalendar({
  slots,
  journeys,
  entries,
  view = 'week',
  selectedDay = 1,
  onSelectDay,
  selectedKey,
  onSelect,
  highlightFree,
  now = new Date(),
  preview,
  affectedEntryIds,
}: Props) {
  const days = configuredScheduleDays(slots)
  const bounds = calendarBounds(slots)
  const height = (bounds.end - bounds.start) * 1.4
  const today = now.getDay() || 7
  const currentMinute = now.getHours() * 60 + now.getMinutes()
  const entryFor = (slot: TimeSlot, day: number) =>
    entries.find(
      (entry) => !entry.needsPlacement && entry.timeSlotId === slot.id && entry.dayOfWeek === day,
    )
  const block = (slot: TimeSlot, day: number) => {
    const entry = entryFor(slot, day)
    const palette = entry ? getSubjectPalette(entry.subjectName, entry.appearanceColor) : null
    const free = slot.blockType === 'CLASS' && !entry
    const content = (
      <>
        {entry ? (
          <>
            <strong>{entry.subjectName}</strong>
            <span>
              {entry.gradeName} · {entry.sectionName}
            </span>
            <small>
              {shortTime(slot.startTime)}–{shortTime(slot.endTime)}
              {entry.room ? ` · ${entry.room}` : ''}
            </small>
            {affectedEntryIds?.has(entry.id) && (
              <small className="schedule-review-label">Requiere revisión</small>
            )}
          </>
        ) : free ? (
          <>
            <span className="schedule-free-title">
              <Plus size={12} /> Libre
            </span>
            <small>
              {shortTime(slot.startTime)}–{shortTime(slot.endTime)}
            </small>
          </>
        ) : (
          <span>{slot.name || blockTypeLabels[slot.blockType]}</span>
        )}
      </>
    )
    const position = calendarPosition(slot.startTime, slot.endTime, bounds.start)
    const style = {
      ...(view === 'week' ? { top: position.top, height: Math.max(18, position.height - 4) } : {}),
      ...(palette
        ? {
            '--class-color': palette.color,
            '--class-soft': palette.soft,
            '--class-foreground': palette.foreground,
          }
        : {}),
    } as CSSProperties
    const className = `schedule-period ${entry ? 'is-assigned' : free ? 'is-free' : 'is-break'} ${highlightFree && free ? 'is-highlighted' : ''} ${selectedKey === slotKey(slot.id, day) ? 'is-selected' : ''} ${position.height < 48 ? 'is-compact' : ''}`
    return onSelect && slot.blockType === 'CLASS' ? (
      <button
        type="button"
        key={slot.id}
        className={className}
        style={style}
        onClick={() => onSelect(slot, day)}
        aria-label={`${scheduleDay(day).name}, ${shortTime(slot.startTime)}, ${entry ? `${entry.subjectName}, ${entry.gradeName} ${entry.sectionName}` : 'período libre'}`}
      >
        {content}
      </button>
    ) : (
      <div key={slot.id} className={className} style={style}>
        {content}
      </div>
    )
  }
  if (view === 'day')
    return (
      <div className="schedule-daily">
        <div className="schedule-day-tabs" aria-label="Día del horario">
          {days.map((day) => (
            <button
              type="button"
              key={day}
              aria-pressed={selectedDay === day}
              onClick={() => onSelectDay?.(day)}
            >
              <span>{scheduleDay(day).short}</span>
              <small>{entries.filter((e) => e.dayOfWeek === day).length} clases</small>
            </button>
          ))}
        </div>
        <div className="schedule-agenda">
          {journeys.map((journey) => {
            const daySlots = slotsOnDay(slots, selectedDay).filter(
              (slot) => slot.journeyId === journey.id,
            )
            if (!daySlots.length) return null
            return (
              <section key={journey.id}>
                <h3>
                  {journey.name}{' '}
                  <span>
                    {shortTime(journey.startTime)}–{shortTime(journey.endTime)}
                  </span>
                </h3>
                {daySlots.map((slot) => (
                  <div className="schedule-agenda-row" key={slot.id}>
                    <div className="schedule-agenda-time">
                      <strong>{shortTime(slot.startTime)}</strong>
                      <small>{shortTime(slot.endTime)}</small>
                    </div>
                    {block(slot, selectedDay)}
                  </div>
                ))}
              </section>
            )
          })}
          {slotsOnDay(slots, selectedDay)
            .filter((slot) => !slot.journeyId)
            .map((slot) => (
              <div className="schedule-agenda-row" key={slot.id}>
                <div className="schedule-agenda-time">{shortTime(slot.startTime)}</div>
                {block(slot, selectedDay)}
              </div>
            ))}
        </div>
      </div>
    )
  return (
    <div className={`schedule-calendar ${preview ? 'is-preview' : ''}`}>
      <div
        className="schedule-calendar-head"
        style={{ gridTemplateColumns: `64px repeat(${days.length}, minmax(0, 1fr))` }}
      >
        <div className="schedule-time-icon">
          <Clock3 size={15} />
        </div>
        {days.map((day) => {
          const count = entries.filter(
            (entry) => entry.dayOfWeek === day && !entry.needsPlacement,
          ).length
          const capacity = slotsOnDay(slots, day).filter(
            (slot) => slot.blockType === 'CLASS',
          ).length
          return (
            <div key={day} className={day === today && !preview ? 'is-today' : ''}>
              <strong>{scheduleDay(day).name}</strong>
              {day === today && !preview && <em>HOY</em>}
              <small>{preview ? `${capacity} períodos` : `${count} clases`}</small>
              <span className="schedule-day-load">
                <i style={{ width: `${capacity ? (count / capacity) * 100 : 0}%` }} />
              </span>
            </div>
          )
        })}
      </div>
      <div
        className="schedule-calendar-body"
        style={{ gridTemplateColumns: `64px repeat(${days.length}, minmax(0, 1fr))` }}
      >
        <div className="schedule-time-axis" style={{ height }}>
          {Array.from({ length: (bounds.end - bounds.start) / 60 + 1 }, (_, index) => (
            <span key={index} style={{ top: index * 84 }}>
              {shortTime(scheduleTimeFromMinutes(bounds.start + index * 60))}
            </span>
          ))}
          {journeys.map((journey) => (
            <em
              key={journey.id}
              style={{
                top: calendarPosition(journey.startTime, journey.endTime, bounds.start).top + 25,
              }}
            >
              {journey.name}
            </em>
          ))}
        </div>
        {days.map((day) => (
          <div
            key={day}
            className={`schedule-day-column ${day === today && !preview ? 'is-today' : ''}`}
            style={{ height }}
          >
            {Array.from({ length: (bounds.end - bounds.start) / 60 }, (_, index) => (
              <div className="schedule-hour-line" key={index} style={{ top: index * 84 }} />
            ))}
            {slotsOnDay(slots, day).map((slot) => block(slot, day))}
            {day === today &&
              !preview &&
              currentMinute >= bounds.start &&
              currentMinute <= bounds.end && (
                <div className="schedule-now" style={{ top: (currentMinute - bounds.start) * 1.4 }}>
                  <span />
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  )
}
