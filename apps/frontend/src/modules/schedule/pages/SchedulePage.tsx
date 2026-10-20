import {
  CalendarDays,
  ChevronDown,
  Download,
  Plus,
  WifiOff,
  BookOpen,
  ArrowRight,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { useSchedule } from '../hooks/useSchedule'
import { ScheduleCalendar } from '../components/ScheduleCalendar'
import {
  ScheduleContextPanel,
  type AssignmentOption,
  type ScheduleSelection,
} from '../components/ScheduleContextPanel'
import { ScheduleBuilderDialog } from '../components/ScheduleBuilderDialog'
import { ScheduleExportDialog } from '../components/ScheduleExportDialog'
import {
  getSectionSubjects,
  saveScheduleStructure,
  scheduleSaveErrorMessage,
} from '../services/scheduleService'
import type { SaveScheduleStructureInput, ScheduleEntry, TimeSlot } from '../types'
import {
  classMinutes,
  configuredScheduleDays,
  decimalHours,
  matchingFreePeriods,
  nextScheduleClass,
  scheduleDay,
  shortTime,
  slotsOnDay,
  slotKey,
} from '../utils/scheduleCalendar'
import '../styles/schedule-workspace.css'

export function SchedulePage() {
  const {
    journeys,
    timeSlots,
    entries,
    pendingEntries = [],
    integrityIssues = [],
    sections,
    schoolYearId,
    schoolYearName = '',
    loading,
    error,
    createEntry,
    updateEntry,
    removeEntry,
    refetchAll,
  } = useSchedule()
  const { hasRole } = useAuth()
  const canEdit = hasRole(['admin', 'director', 'coordinator', 'teacher'])
  const [view, setView] = useState<'week' | 'day'>(() =>
    window.matchMedia?.('(max-width: 760px)').matches ? 'day' : 'week',
  )
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() || 7)
  const [selection, setSelection] = useState<ScheduleSelection | null>(null)
  const [builder, setBuilder] = useState<'edit' | 'new' | null>(null)
  const [exporting, setExporting] = useState(false)
  const [menu, setMenu] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [failure, setFailure] = useState<string | null>(null)
  const [confirmRemove, setConfirmRemove] = useState<ScheduleEntry | null>(null)
  const [confirmNew, setConfirmNew] = useState(false)
  const [highlightFree, setHighlightFree] = useState(false)
  const [online, setOnline] = useState(navigator.onLine)
  const [options, setOptions] = useState<AssignmentOption[]>([])
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])
  useEffect(() => {
    const update = () => setOnline(navigator.onLine)
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    return () => {
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
    }
  }, [])
  useEffect(() => {
    let cancelled = false
    Promise.all(
      sections.map(async (section) =>
        (await getSectionSubjects(section.id)).map((subject) => ({
          id: subject.id,
          sectionId: section.id,
          subjectName: subject.subjectName,
          courseName: `${section.gradeName} · ${section.name} · ${section.academicLevelName}`,
        })),
      ),
    )
      .then((groups) => {
        if (!cancelled) setOptions(groups.flat())
      })
      .catch(() => {
        if (!cancelled)
          setFailure(
            'No se pudieron cargar las asignaturas. Actualiza desde el servidor para reintentarlo.',
          )
      })
    return () => {
      cancelled = true
    }
  }, [sections])
  const days = configuredScheduleDays(timeSlots)
  const activeDay = days.includes(selectedDay) ? selectedDay : days[0]
  const freePeriods = days.flatMap((day) =>
    slotsOnDay(timeSlots, day)
      .filter(
        (slot) =>
          slot.blockType === 'CLASS' &&
          !entries.some((entry) => entry.timeSlotId === slot.id && entry.dayOfWeek === day),
      )
      .map((slot) => ({ slot, day })),
  )
  const next = nextScheduleClass(entries, now)
  const reviewIds = new Set([
    ...pendingEntries.map((entry) => entry.id),
    ...integrityIssues.flatMap((issue) => issue.entryIds),
  ])
  const select = (slot: TimeSlot, day: number) => {
    setSelection((previous) => ({
      slot,
      day,
      pending: entries.some((entry) => entry.timeSlotId === slot.id && entry.dayOfWeek === day)
        ? undefined
        : previous?.pending,
    }))
    setFailure(null)
  }
  const refresh = async () => {
    setMenu(false)
    await refetchAll()
  }
  const saveStructure = async (input: SaveScheduleStructureInput) => {
    if (!online) {
      setFailure(
        'Sin conexión. Tus cambios permanecen aquí; vuelve a guardar cuando recuperes la conexión.',
      )
      return
    }
    setBusy(true)
    setFailure(null)
    try {
      await saveScheduleStructure(input)
      await refetchAll()
      setBuilder(null)
      setSelection(null)
      setMessage('Estructura guardada. Ya puedes asignar tus clases.')
    } catch (cause) {
      setFailure(scheduleSaveErrorMessage(cause))
    } finally {
      setBusy(false)
    }
  }
  const assign = async (option: AssignmentOption, room: string, repeatDays: number[]) => {
    if (!selection || !schoolYearId || !online) {
      setFailure(
        !online
          ? 'Sin conexión. Tu selección permanece aquí para volver a intentarlo.'
          : 'Necesitas un año escolar activo para asignar clases.',
      )
      return
    }
    setBusy(true)
    setFailure(null)
    try {
      const previous = entries.find(
        (entry) => entry.timeSlotId === selection.slot.id && entry.dayOfWeek === selection.day,
      )
      const input = {
        schoolYearId,
        sectionSubjectId: option.id,
        sectionId: option.sectionId,
        timeSlotId: selection.slot.id,
        dayOfWeek: selection.day,
        room: room.trim() || null,
      }
      if (selection.pending || (selection.editing && previous))
        await updateEntry((selection.pending || previous)!.id, {
          sectionSubjectId: option.id,
          sectionId: option.sectionId,
          timeSlotId: selection.slot.id,
          dayOfWeek: selection.day,
          room: room.trim() || null,
        })
      else {
        const destinations = [
          { slot: selection.slot, day: selection.day },
          ...matchingFreePeriods(selection.slot, selection.day, timeSlots, entries).filter((item) =>
            repeatDays.includes(item.day),
          ),
        ]
        let saved = 0
        for (const destination of destinations) {
          try {
            await createEntry({
              ...input,
              timeSlotId: destination.slot.id,
              dayOfWeek: destination.day,
            })
            saved++
          } catch (cause) {
            await refetchAll()
            if (saved) setSelection(null)
            throw new Error(
              `${saved ? `Se guardaron ${saved} clases. ` : ''}${cause instanceof Error ? cause.message : 'No se pudo asignar la clase.'}`,
              { cause },
            )
          }
        }
      }
      await refetchAll()
      setSelection(null)
      setMessage(selection.pending ? 'Clase reubicada.' : 'Clase guardada en el horario.')
    } catch (cause) {
      setFailure(
        cause instanceof Error
          ? cause.message
          : 'No se pudo guardar la clase. Tu selección permanece aquí.',
      )
    } finally {
      setBusy(false)
    }
  }
  const preview = (input: SaveScheduleStructureInput) => (
    <ScheduleCalendar
      preview
      slots={input.blocks.map((block, index) => ({
        ...block,
        id: block.id || `preview-${index}`,
        journeyId: block.journeyKey,
        status: 'active',
      }))}
      journeys={input.journeys.map((journey) => ({ ...journey, status: 'active' }))}
      entries={entries.flatMap((entry) => {
        const block = input.blocks.find(
          (block) =>
            block.id === entry.timeSlotId &&
            block.dayOfWeek === entry.dayOfWeek &&
            block.blockType === 'CLASS',
        )
        return block ? [{ ...entry, startTime: block.startTime, endTime: block.endTime }] : []
      })}
    />
  )
  return (
    <div className="schedule-workspace">
      <header className="schedule-header">
        <div>
          <p className="schedule-school-year">
            <i /> Año escolar {schoolYearName || 'actual'}
          </p>
          <h1>Horario docente</h1>
        </div>
        <div className="schedule-toolbar">
          <div className="schedule-view-toggle" aria-label="Vista del horario">
            <button aria-pressed={view === 'week'} onClick={() => setView('week')}>
              Semana
            </button>
            <button aria-pressed={view === 'day'} onClick={() => setView('day')}>
              Día
            </button>
          </div>
          <Button variant="outline" disabled={!timeSlots.length} onClick={() => setExporting(true)}>
            <Download size={15} /> Exportar
          </Button>
          <div className="schedule-menu-wrap">
            <Button variant="outline" aria-expanded={menu} onClick={() => setMenu(!menu)}>
              Estructura <ChevronDown size={14} />
            </Button>
            {menu && (
              <>
                <button
                  className="schedule-menu-backdrop"
                  aria-label="Cerrar menú"
                  onClick={() => setMenu(false)}
                />
                <div className="schedule-structure-menu">
                  <button
                    disabled={!canEdit || !online}
                    onClick={() => {
                      setBuilder('edit')
                      setMenu(false)
                      setFailure(null)
                    }}
                  >
                    Editar días, jornadas y períodos
                  </button>
                  <button onClick={() => void refresh()}>Actualizar desde el servidor</button>
                  <button
                    disabled={!canEdit || !online}
                    onClick={() => {
                      setMenu(false)
                      setConfirmNew(true)
                    }}
                  >
                    Crear un horario nuevo
                  </button>
                  {!canEdit && <small>Solo lectura: sin permiso de edición</small>}
                </div>
              </>
            )}
          </div>
          {canEdit && timeSlots.length > 0 && (
            <Button
              disabled={!freePeriods.length || !online}
              onClick={() => {
                const first = freePeriods[0]
                if (first) select(first.slot, first.day)
              }}
            >
              <Plus size={16} />
              {freePeriods.length ? 'Asignar clase' : 'Sin períodos libres'}
            </Button>
          )}
        </div>
      </header>
      {!online && (
        <div className="schedule-notice" role="status">
          <WifiOff size={16} /> Sin conexión. Puedes consultar el horario; tus cambios se
          conservarán hasta que vuelvas a conectarte.
        </div>
      )}
      {(failure || error) && !builder && (
        <div className="schedule-error" role="alert">
          {failure || error}
          <button onClick={() => void refresh()}>Reintentar</button>
        </div>
      )}
      {message && (
        <div className="schedule-success" role="status">
          {message}
          <button aria-label="Cerrar aviso" onClick={() => setMessage(null)}>
            ×
          </button>
        </div>
      )}
      {loading ? (
        <div className="schedule-loading" role="status">
          Cargando tu horario…
        </div>
      ) : timeSlots.length ? (
        <>
          <div className="schedule-metrics">
            <div className="schedule-next">
              <span className="schedule-next-icon">
                <BookOpen size={22} />
              </span>
              <div>
                <small>
                  {next
                    ? next.current
                      ? 'EN CLASE AHORA'
                      : `PRÓXIMA CLASE · ${next.daysAway ? `${scheduleDay(next.entry.dayOfWeek).name.toUpperCase()}` : `EN ${next.minutesUntil} MIN`}`
                    : 'TU SEMANA, EN ORDEN'}
                </small>
                <strong>{next?.entry.subjectName || 'Tu horario está listo'}</strong>
                <span>
                  {next
                    ? `${next.entry.gradeName} · ${next.entry.sectionName} · ${shortTime(next.entry.startTime)}–${shortTime(next.entry.endTime)}${next.entry.room ? ` · ${next.entry.room}` : ''}`
                    : 'Asigna tus clases a los períodos libres'}
                </span>
              </div>
            </div>
            <div className="schedule-metric">
              <strong>{entries.length}</strong>
              <span>clases / semana</span>
            </div>
            <div className="schedule-metric">
              <strong>
                {decimalHours(entries.reduce((sum, entry) => sum + classMinutes(entry), 0))}
              </strong>
              <span>horas lectivas</span>
            </div>
            <button
              className={`schedule-metric ${highlightFree ? 'is-active' : ''}`}
              aria-pressed={highlightFree}
              onClick={() => setHighlightFree(!highlightFree)}
            >
              <strong>{freePeriods.length}</strong>
              <span>períodos libres</span>
            </button>
            <button
              className="schedule-metric"
              onClick={() => {
                setSelection(null)
                document
                  .getElementById('schedule-review')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
              }}
            >
              <strong className={reviewIds.size ? 'schedule-warning-text' : ''}>
                {reviewIds.size}
              </strong>
              <span>requieren revisión</span>
            </button>
          </div>
          <div className="schedule-main">
            <ScheduleCalendar
              slots={timeSlots}
              journeys={journeys}
              entries={entries}
              view={view}
              selectedDay={activeDay}
              onSelectDay={setSelectedDay}
              selectedKey={selection ? slotKey(selection.slot.id, selection.day) : null}
              onSelect={select}
              highlightFree={highlightFree}
              affectedEntryIds={reviewIds}
              now={now}
            />
            <ScheduleContextPanel
              key={`${selection?.slot.id}:${selection?.day}:${selection?.editing}:${selection?.pending?.id}`}
              selection={selection}
              slots={timeSlots}
              entries={entries}
              pendingEntries={pendingEntries}
              issues={integrityIssues}
              options={options}
              canEdit={canEdit}
              busy={busy}
              onBack={() => setSelection(null)}
              onEdit={() => setSelection((value) => (value ? { ...value, editing: true } : null))}
              onRemove={setConfirmRemove}
              onSelect={select}
              onPending={(entry) => {
                const first = freePeriods[0]
                if (first) setSelection({ ...first, pending: entry })
                else
                  setFailure(
                    'No hay períodos libres. Edita la estructura para añadir uno antes de reubicar la clase.',
                  )
              }}
              onAssign={assign}
            />
          </div>
        </>
      ) : (
        <div className="schedule-empty">
          <div className="schedule-empty-icon">
            <CalendarDays size={30} />
          </div>
          <span className="schedule-eyebrow">TU SEMANA, EN ORDEN</span>
          <h2>
            Construyamos tu horario
            <br />
            en cuatro pasos
          </h2>
          <p>Organiza tus días, define tus jornadas y dale un lugar a cada clase.</p>
          <div className="schedule-empty-steps">
            {[
              'Elige tus días',
              'Define tus jornadas',
              'Crea tus períodos',
              'Asigna tus clases',
            ].map((text, index) => (
              <div key={text}>
                <span>{index + 1}</span>
                <strong>{text}</strong>
              </div>
            ))}
          </div>
          {canEdit && (
            <Button
              disabled={!online}
              onClick={() => {
                setBuilder('new')
                setFailure(null)
              }}
            >
              Crear mi horario <ArrowRight size={16} />
            </Button>
          )}
          {pendingEntries.length > 0 && (
            <p className="schedule-notice">
              Tienes {pendingEntries.length} clases pendientes de reubicar. Se conservarán al crear
              la estructura.
            </p>
          )}
        </div>
      )}
      {!loading && !timeSlots.length && pendingEntries.length > 0 && (
        <section className="schedule-context" id="schedule-review">
          <div className="schedule-section-heading">
            <h2>Requiere revisión</h2>
            <span>{pendingEntries.length}</span>
          </div>
          {pendingEntries.map((entry) => (
            <div className="schedule-review-item" key={entry.id}>
              <strong>{entry.subjectName}</strong>
              <small>
                {entry.gradeName} · {entry.sectionName}
              </small>
              <p>
                Sin período · antes {scheduleDay(entry.dayOfWeek).name} {shortTime(entry.startTime)}
                –{shortTime(entry.endTime)}
              </p>
              {canEdit && (
                <button onClick={() => setConfirmRemove(entry)}>Quitar del horario</button>
              )}
            </div>
          ))}
        </section>
      )}
      {builder && (
        <ScheduleBuilderDialog
          journeys={builder === 'new' ? [] : journeys}
          slots={builder === 'new' ? [] : timeSlots}
          entries={[...entries, ...pendingEntries]}
          submitting={busy}
          error={failure}
          onClose={() => {
            setBuilder(null)
            setFailure(null)
          }}
          onSave={(input) => void saveStructure(input)}
          renderPreview={preview}
        />
      )}
      {exporting && (
        <ScheduleExportDialog
          journeys={journeys}
          slots={timeSlots}
          entries={entries}
          schoolYearName={schoolYearName}
          selectedDay={activeDay}
          onClose={() => setExporting(false)}
        />
      )}
      {confirmRemove && (
        <ConfirmDialog
          title="Quitar clase del horario"
          description="El período quedará libre. La asignatura seguirá disponible en tus cursos."
          confirmLabel="Quitar del horario"
          destructive
          onClose={() => setConfirmRemove(null)}
          onConfirm={async () => {
            try {
              await removeEntry(confirmRemove.id)
              await refetchAll()
              setConfirmRemove(null)
              setSelection(null)
            } catch (cause) {
              setConfirmRemove(null)
              setFailure(cause instanceof Error ? cause.message : 'No se pudo quitar la clase.')
            }
          }}
        />
      )}
      {confirmNew && (
        <ConfirmDialog
          title="Crear un horario nuevo"
          description="Definirás una nueva estructura. Las clases que pierdan su período se conservarán en Requiere revisión para reubicarlas."
          confirmLabel="Crear nueva estructura"
          onClose={() => setConfirmNew(false)}
          onConfirm={() => {
            setConfirmNew(false)
            setBuilder('new')
            setFailure(null)
          }}
        />
      )}
    </div>
  )
}
