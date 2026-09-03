import { ClipboardList, Coffee, Pencil, Plus, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { Button } from '@/components/ui/Button'
import type { ScheduleEntry } from '@/modules/schedule/types'
import { formatTime, getDurationHours } from '@/modules/schedule/utils/scheduleGrid'
import type { ScheduleBlock, ScheduleConfig } from '@/modules/schedule/components/ScheduleWizard'
import { getSubjectPalette } from '@/utils/subjectPalette'

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
  const today = new Date().getDay()

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
    <div className="space-y-4">
      <section className="rounded-3xl border border-border/70 bg-card p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-extrabold tracking-tight text-foreground">Asignar clases</h2>
              <span className="rounded-full bg-primary/8 px-2.5 py-1 text-[10px] font-extrabold text-primary">
                {filledSlots}/{totalSlots} ocupados
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Selecciona un espacio libre para asignar una materia o marcar una hora pedagógica.
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span>{SHIFT_LABELS[config.shift] ?? config.shift}</span>
              <span className="text-border">•</span>
              <span>{classCount} períodos</span>
              <span className="text-border">•</span>
              <span>{hoursFormatted}</span>
              {freeSlots > 0 ? (
                <>
                  <span className="text-border">•</span>
                  <span>{freeSlots} espacios libres</span>
                </>
              ) : null}
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onEdit} className="h-10 gap-2 rounded-xl bg-card px-4">
            <Pencil className="size-4" />
            Editar estructura
          </Button>
        </div>
      </section>

      {loading ? (
        <div className="flex items-center justify-center rounded-3xl border border-border/70 bg-card py-20 text-sm text-muted-foreground shadow-sm">
          Cargando horario...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
            {activeDays.map((day) => {
              const dayEntries = entries.filter((e) => e.dayOfWeek === day.dayOfWeek)
              const dayHours = dayEntries.reduce(
                (sum, e) => sum + getDurationHours(e.startTime, e.endTime),
                0,
              )
              const isToday = day.dayOfWeek === today

              return (
                <section
                  key={day.dayOfWeek}
                  className="min-w-0 overflow-visible rounded-3xl border border-border/70 bg-card shadow-sm"
                >
                  <header className={`relative border-b border-border/70 px-4 py-3 ${isToday ? 'bg-primary/[0.045]' : 'bg-card'}`}>
                    {isToday ? <span className="absolute inset-x-8 top-0 h-0.5 rounded-b-full bg-primary" /> : null}
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-xs font-extrabold uppercase tracking-[0.12em] ${isToday ? 'text-primary' : 'text-foreground'}`}>
                        {day.name}
                      </p>
                      {isToday ? <span className="text-[9px] font-extrabold text-primary">Hoy</span> : null}
                    </div>
                    <p className="mt-0.5 text-[10px] font-semibold text-muted-foreground">
                      {dayHours > 0 ? formatDuration(dayHours) : 'Sin clases asignadas'}
                    </p>
                  </header>

                  <div className="flex flex-col gap-2 p-2.5">
                    {blocks.map((block) => {
                      if (block.type === 'break') {
                        return (
                          <div
                            key={block.id}
                            className="flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 py-2 text-center"
                            style={{ backgroundColor: 'color-mix(in srgb, var(--palette-yellow) 22%, var(--palette-white))' }}
                          >
                            <Coffee className="size-3.5 text-foreground" />
                            <span className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-foreground">{block.label}</span>
                            <span className="text-[9px] text-muted-foreground">{formatTime(block.start)}–{formatTime(block.end)}</span>
                          </div>
                        )
                      }

                      const entryKey = getCellKey(day.dayOfWeek, block)
                      const assigned = entriesByCell.get(entryKey)
                      const pedagogical = pedagogicalBlocksByCell.get(entryKey)
                      const assignedPalette = assigned ? getSubjectPalette(assigned.subjectName) : null

                      return (
                        <div key={block.id} className="relative">
                          {assigned && assignedPalette ? (
                            <div
                              className="group relative flex min-h-[86px] flex-col justify-between overflow-hidden rounded-xl border px-3 py-2.5 shadow-[0_8px_20px_-20px_rgba(47,53,66,0.35)]"
                              style={{ backgroundColor: assignedPalette.soft, borderColor: `${assignedPalette.color}38` }}
                            >
                              <span className="absolute inset-y-2 left-0 w-1 rounded-r-full" style={{ backgroundColor: assignedPalette.color }} />
                              <div className="flex items-start justify-between gap-2 pl-1">
                                <span
                                  className="line-clamp-3 text-[12px] font-extrabold leading-[1.2]"
                                  style={{ color: assignedPalette.color }}
                                >
                                  {assigned.subjectName}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onRemove(assigned.scheduleEntryId)
                                  }}
                                  className="shrink-0 rounded-lg p-1 text-muted-foreground opacity-0 transition hover:bg-white/60 group-hover:opacity-100 focus-visible:opacity-100"
                                  aria-label="Quitar asignatura"
                                >
                                  <X className="size-3.5" />
                                </button>
                              </div>
                              <span className="pl-1 text-[10px] font-semibold text-muted-foreground">
                                {assigned.gradeName} {assigned.sectionName} · {assigned.academicLevelName}
                              </span>
                              <span className="pl-1 text-[9px] font-medium tabular-nums text-muted-foreground/80">
                                {formatTime(block.start)}–{formatTime(block.end)}
                              </span>
                            </div>
                          ) : pedagogical ? (
                            <div className="group flex min-h-[86px] flex-col justify-between rounded-xl border border-border/70 bg-muted/30 px-3 py-2.5 text-left">
                              <div className="flex items-start justify-between gap-2">
                                <span className="line-clamp-2 text-xs font-extrabold leading-tight text-foreground">
                                  {pedagogical.label}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onRemovePedagogical(day.dayOfWeek, block)
                                  }}
                                  className="shrink-0 rounded-lg p-1 text-muted-foreground opacity-0 transition hover:bg-muted group-hover:opacity-100 focus-visible:opacity-100"
                                  aria-label="Quitar hora pedagógica"
                                >
                                  <X className="size-3.5" />
                                </button>
                              </div>
                              <span className="text-[10px] text-muted-foreground">Trabajo no lectivo</span>
                              <span className="text-[9px] tabular-nums text-muted-foreground/80">
                                {formatTime(block.start)}–{formatTime(block.end)}
                              </span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleCellClick(day.dayOfWeek, block)}
                              className="group flex min-h-[86px] w-full flex-col justify-between rounded-xl border border-dashed border-border/80 bg-muted/5 px-3 py-2.5 text-left transition hover:border-primary/40 hover:bg-primary/[0.025]"
                            >
                              <span className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">Espacio libre</span>
                              <span className="flex items-center justify-between gap-2 text-[10px] font-semibold tabular-nums text-muted-foreground">
                                {formatTime(block.start)}–{formatTime(block.end)}
                                <Plus className="size-3.5 transition group-hover:text-primary" />
                              </span>
                            </button>
                          )}

                          {openDropdown?.day === day.dayOfWeek && openDropdown?.blockId === block.id ? (
                            <div
                              ref={dropdownRef}
                              className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
                            >
                              <div className="max-h-64 overflow-y-auto p-1.5">
                                <button
                                  type="button"
                                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-muted"
                                  onClick={() => {
                                    onMarkPedagogical(day.dayOfWeek, block)
                                    setOpenDropdown(null)
                                  }}
                                >
                                  <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                                    <ClipboardList className="size-4" />
                                  </span>
                                  <div className="min-w-0">
                                    <span className="block text-xs font-extrabold text-foreground">
                                      {config.pedagogicalLabel || 'Hora pedagógica'}
                                    </span>
                                    <span className="block text-[10px] text-muted-foreground">Trabajo no lectivo</span>
                                  </div>
                                </button>
                                <div className="my-1 border-t border-border/70" />
                                {sectionSubjects.length === 0 ? (
                                  <div className="px-3 py-4 text-center text-xs text-muted-foreground">
                                    No hay cursos disponibles. Crea cursos primero.
                                  </div>
                                ) : (
                                  sectionSubjects.map((ss) => {
                                    const palette = getSubjectPalette(ss.subjectName)
                                    return (
                                      <button
                                        key={ss.id}
                                        type="button"
                                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-primary/[0.035]"
                                        onClick={() => {
                                          onAssign(day.dayOfWeek, block, ss.id, ss.sectionId)
                                          setOpenDropdown(null)
                                        }}
                                      >
                                        <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: palette.color }} />
                                        <div className="min-w-0">
                                          <span className="block text-xs font-extrabold text-foreground">{ss.subjectName}</span>
                                          <span className="block truncate text-[10px] text-muted-foreground">
                                            {ss.gradeName} {ss.sectionName} · {ss.academicLevelName} · {ss.teacherName}
                                          </span>
                                        </div>
                                      </button>
                                    )
                                  })
                                )}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      )
                    })}
                  </div>
                </section>
              )
            })}
          </div>

          <footer className="flex flex-wrap items-center gap-x-3 gap-y-1 px-1 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{entries.length} clases</span>
            <span className="text-border">•</span>
            <span>{hoursFormatted}</span>
            {pedagogicalBlocks.length > 0 ? (
              <>
                <span className="text-border">•</span>
                <span>{pedagogicalBlocks.length} horas pedagógicas</span>
              </>
            ) : null}
            {freeSlots > 0 ? (
              <>
                <span className="text-border">•</span>
                <span>{freeSlots} espacios libres</span>
              </>
            ) : null}
          </footer>
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
