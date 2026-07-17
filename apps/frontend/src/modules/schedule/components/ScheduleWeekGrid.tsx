import { ClipboardList, Coffee, Pencil, Plus, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'
import type { ScheduleEntry } from '@/modules/schedule/types'
import { formatTime, getDurationHours } from '@/modules/schedule/utils/scheduleGrid'
import type { ScheduleBlock, ScheduleConfig } from '@/modules/schedule/components/ScheduleWizard'

const SUBJECT_PALETTE = [
  { chip: 'bg-sky-100/80 text-sky-800', dot: 'bg-sky-500' },
  { chip: 'bg-orange-100/80 text-orange-800', dot: 'bg-orange-500' },
  { chip: 'bg-emerald-100/80 text-emerald-800', dot: 'bg-emerald-500' },
  { chip: 'bg-violet-100/80 text-violet-800', dot: 'bg-violet-500' },
  { chip: 'bg-rose-100/80 text-rose-800', dot: 'bg-rose-500' },
  { chip: 'bg-teal-100/80 text-teal-800', dot: 'bg-teal-500' },
  { chip: 'bg-amber-100/80 text-amber-800', dot: 'bg-amber-500' },
  { chip: 'bg-red-100/80 text-red-800', dot: 'bg-red-500' },
]

type AssignedEntry = {
  scheduleEntryId: string
  subjectName: string
  gradeName: string
  academicLevelName: string
  sectionName: string
  teacherName: string
  startTime: string
  endTime: string
}

type SectionSubjectOption = {
  id: string
  sectionId: string
  label: string
  subjectName: string
  gradeName: string
  academicLevelName: string
  sectionName: string
  teacherName: string
}

type PedagogicalBlock = {
  dayOfWeek: number
  start: string
  end: string
  label: string
}

type ScheduleWeekGridProps = {
  config: ScheduleConfig
  blocks: ScheduleBlock[]
  entries: ScheduleEntry[]
  pedagogicalBlocks?: PedagogicalBlock[]
  sectionSubjects?: SectionSubjectOption[]
  activeDays: Array<{ dayOfWeek: number; label: string; name: string }>
  onEdit: () => void
  onAssign: (dayOfWeek: number, block: ScheduleBlock, sectionSubjectId: string, sectionId: string) => void
  onRemove: (entryId: string) => void
  onMarkPedagogical: (dayOfWeek: number, block: ScheduleBlock) => void
  onRemovePedagogical: (dayOfWeek: number, block: Pick<ScheduleBlock, 'start' | 'end'>) => void
  loading?: boolean
}

function hashString(value: string) {
  let hash = 0
  for (let index = 0; index < value.length; index++) {
    hash = ((hash << 5) - hash) + value.charCodeAt(index)
    hash |= 0
  }
  return Math.abs(hash)
}

export function ScheduleWeekGrid({
  config,
  blocks,
  entries,
  pedagogicalBlocks = [],
  sectionSubjects = [],
  activeDays,
  onEdit,
  onAssign,
  onRemove,
  onMarkPedagogical,
  onRemovePedagogical,
  loading,
}: ScheduleWeekGridProps) {
  const classCount = blocks.filter((b) => b.type === 'class').length
  const [openDropdown, setOpenDropdown] = useState<{ day: number; blockId: string } | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const entriesByCell = useMemo(() => {
    const map = new Map<string, AssignedEntry>()
    entries.forEach((e) => {
      const key = `${e.dayOfWeek}:${formatTime(e.startTime)}-${formatTime(e.endTime)}`
      map.set(key, {
        scheduleEntryId: e.id,
        subjectName: e.subjectName,
        gradeName: e.gradeName,
        academicLevelName: e.academicLevelName,
        sectionName: e.sectionName,
        teacherName: e.teacherName,
        startTime: e.startTime,
        endTime: e.endTime,
      })
    })
    return map
  }, [entries])

  const pedagogicalBlocksByCell = useMemo(() => {
    const map = new Map<string, PedagogicalBlock>()
    pedagogicalBlocks.forEach((block) => {
      map.set(`${block.dayOfWeek}:${formatTime(block.start)}-${formatTime(block.end)}`, block)
    })
    return map
  }, [pedagogicalBlocks])

  useEffect(() => {
    if (!openDropdown) return
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenDropdown(null)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [openDropdown])

  const totalHours = entries.reduce(
    (sum, e) => sum + getDurationHours(e.startTime, e.endTime),
    0,
  )

  const hoursFormatted = (() => {
    if (totalHours <= 0) return '0h'
    const h = Math.floor(totalHours)
    const m = Math.round((totalHours - h) * 60)
    return h > 0 ? `${h}h ${m}min` : `${m}min`
  })()

  const totalSlots = activeDays.length * classCount
  const filledSlots = entries.length + pedagogicalBlocks.length
  const freeSlots = Math.max(totalSlots - filledSlots, 0)

  function getColor(subjectName: string) {
    return SUBJECT_PALETTE[hashString(subjectName) % SUBJECT_PALETTE.length]
  }

  function getCellKey(dayOfWeek: number, block: ScheduleBlock) {
    return `${dayOfWeek}:${formatTime(block.start)}-${formatTime(block.end)}`
  }

  function handleCellClick(dayOfWeek: number, block: ScheduleBlock) {
    if (block.type === 'break') return
    setOpenDropdown((prev) =>
      prev?.day === dayOfWeek && prev?.blockId === block.id
        ? null
        : { day: dayOfWeek, blockId: block.id },
    )
  }

  function formatDuration(hours: number) {
    if (hours <= 0) return '0 min'
    const totalMinutes = Math.round(hours * 60)
    const wholeHours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    if (wholeHours === 0) return `${minutes} min`
    if (minutes === 0) return `${wholeHours} h`
    return `${wholeHours} h ${minutes} min`
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="mr-auto">
          <h2 className="text-lg font-semibold text-foreground">
            Configurar asignaciones
          </h2>
          <p className="text-sm text-muted-foreground">
            Toca un período vacío para asignarle una materia u hora pedagógica.
          </p>
        </div>
        <Badge tone="accent" className="rounded-full px-3 py-1">
          Tanda {SHIFT_LABELS[config.shift] ?? config.shift}
        </Badge>
        <Badge tone="default" className="rounded-full px-3 py-1">
          {classCount} períodos · {config.structureMode === 'custom' ? 'duración variable' : `${config.blockDuration} min`}
        </Badge>
        {freeSlots > 0 ? (
          <Badge tone="muted" className="rounded-full px-3 py-1">
            {filledSlots}/{totalSlots} ocupados
          </Badge>
        ) : null}
        <Button variant="outline" size="sm" onClick={onEdit} className="gap-1.5 rounded-full bg-card">
          <Pencil className="size-3.5" />
          Editar horario
        </Button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-border bg-card py-20 text-sm text-muted-foreground">
          Cargando horario...
        </div>
      ) : (
        <>
          {/* Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            {activeDays.map((day) => {
              const dayEntries = entries.filter((e) => e.dayOfWeek === day.dayOfWeek)
              const dayHours = dayEntries.reduce(
                (sum, e) => sum + getDurationHours(e.startTime, e.endTime),
                0,
              )

              return (
                <div
                  key={day.dayOfWeek}
                  className="flex min-h-[34rem] min-w-0 flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm"
                >
                  {/* Day header */}
                  <div className="bg-primary px-4 py-3 text-center">
                    <p className="text-sm font-bold uppercase tracking-widest text-primary-foreground">
                      {day.name}
                    </p>
                    {dayHours > 0 ? (
                      <p className="mt-0.5 text-[11px] font-semibold text-primary-foreground/65">
                        {formatDuration(dayHours)}
                      </p>
                    ) : null}
                  </div>

                  {/* Blocks */}
                  <div className="flex max-h-[31rem] flex-col gap-2 overflow-y-auto p-3">
                    {blocks.map((block) => {
                      if (block.type === 'break') {
                        return (
                          <div
                            key={block.id}
                            className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-100/80 px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-amber-700"
                          >
                            <Coffee className="size-3.5" />
                            {block.label} - {formatTime(block.start)} a {formatTime(block.end)}
                          </div>
                        )
                      }

                      const entryKey = getCellKey(day.dayOfWeek, block)
                      const assigned = entriesByCell.get(entryKey)
                      const pedagogical = pedagogicalBlocksByCell.get(entryKey)
                      const color = assigned ? getColor(assigned.subjectName) : null

                      return (
                        <div key={block.id} className="relative">
                          {assigned && color ? (
                            <div
                              className={cn(
                                'group flex h-28 flex-col justify-between rounded-xl px-3 py-2.5 text-left transition-transform hover:scale-[1.02]',
                                color.chip,
                              )}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="line-clamp-4 text-[13px] font-semibold leading-[1.15]">
                                  {assigned.subjectName}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onRemove(assigned.scheduleEntryId)
                                  }}
                                  className="shrink-0 rounded-full p-0.5 opacity-0 transition-opacity hover:bg-black/10 group-hover:opacity-100"
                                  aria-label="Quitar asignatura"
                                >
                                  <X className="size-3" />
                                </button>
                              </div>
                              <span className="text-[11px] opacity-75">
                                {assigned.academicLevelName} · {assigned.gradeName} {assigned.sectionName}
                              </span>
                              <span className="text-[11px] opacity-60">
                                {formatTime(block.start)} – {formatTime(block.end)}
                              </span>
                            </div>
                          ) : pedagogical ? (
                            <div className="group flex h-28 flex-col justify-between rounded-xl bg-slate-100 px-3 py-2.5 text-left text-slate-700 transition-transform hover:scale-[1.02]">
                              <div className="flex items-center justify-between gap-2">
                                <span className="line-clamp-3 text-sm font-semibold leading-tight">
                                  {pedagogical.label}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onRemovePedagogical(day.dayOfWeek, block)
                                  }}
                                  className="shrink-0 rounded-full p-0.5 opacity-0 transition-opacity hover:bg-black/10 group-hover:opacity-100"
                                  aria-label="Quitar hora pedagógica"
                                >
                                  <X className="size-3" />
                                </button>
                              </div>
                              <span className="text-[11px] opacity-70">
                                Trabajo no lectivo
                              </span>
                              <span className="text-[11px] opacity-60">
                                {formatTime(block.start)} - {formatTime(block.end)}
                              </span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleCellClick(day.dayOfWeek, block)}
                              className="group flex h-28 w-full items-center justify-between rounded-xl border border-dashed border-border px-3 py-2.5 text-left transition-colors hover:border-primary/50 hover:bg-accent/30"
                            >
                              <span className="text-[11px] font-medium text-muted-foreground">
                                {formatTime(block.start)} – {formatTime(block.end)}
                              </span>
                              <Plus className="size-3.5 text-muted-foreground/50 group-hover:text-primary" />
                            </button>
                          )}

                          {/* Dropdown */}
                          {openDropdown?.day === day.dayOfWeek &&
                            openDropdown?.blockId === block.id && (
                              <div
                                ref={dropdownRef}
                                className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-border bg-card shadow-lg"
                              >
                                <div className="max-h-56 overflow-y-auto">
                                  <button
                                    type="button"
                                    className="flex w-full items-center gap-3 border-b border-border px-4 py-2.5 text-left text-sm transition-colors hover:bg-muted"
                                    onClick={() => {
                                      onMarkPedagogical(day.dayOfWeek, block)
                                      setOpenDropdown(null)
                                    }}
                                  >
                                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                                      <ClipboardList className="size-3.5" />
                                    </span>
                                    <div className="min-w-0">
                                      <span className="block font-medium text-foreground">
                                        {config.pedagogicalLabel || 'Hora pedagógica'}
                                      </span>
                                      <span className="block text-xs text-muted-foreground">
                                        Bloque no lectivo editable
                                      </span>
                                    </div>
                                  </button>
                                  {sectionSubjects.length === 0 ? (
                                    <div className="px-4 py-3 text-xs text-muted-foreground">
                                      No hay cursos disponibles. Crea cursos primero.
                                    </div>
                                  ) : (
                                    sectionSubjects.map((ss) => (
                                      <button
                                        key={ss.id}
                                        type="button"
                                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-muted"
                                        onClick={() => {
                                          onAssign(day.dayOfWeek, block, ss.id, ss.sectionId)
                                          setOpenDropdown(null)
                                        }}
                                      >
                                        <span
                                          className={cn(
                                            'size-2.5 shrink-0 rounded-full',
                                            getColor(ss.subjectName).dot,
                                          )}
                                        />
                                        <div className="min-w-0">
                                          <span className="block font-medium text-foreground">
                                            {ss.subjectName}
                                          </span>
                                          <span className="block text-xs text-muted-foreground">
                                            {ss.academicLevelName} · {ss.gradeName} {ss.sectionName} · {ss.teacherName}
                                          </span>
                                        </div>
                                      </button>
                                    ))
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Summary footer */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {entries.length} clases
            </span>
            <span className="text-border">·</span>
            <span>{hoursFormatted}</span>
            {pedagogicalBlocks.length > 0 ? (
              <>
                <span className="text-border">·</span>
                <span>{pedagogicalBlocks.length} horas pedagógicas</span>
              </>
            ) : null}
            {freeSlots > 0 ? (
              <>
                <span className="text-border">·</span>
                <span>{freeSlots} espacios libres</span>
              </>
            ) : null}
          </div>
        </>
      )}
    </div>
  )
}

const SHIFT_LABELS: Record<string, string> = {
  morning: 'Matutina',
  afternoon: 'Vespertina',
  evening: 'Nocturna',
  extended: 'Extendida',
}
