import { CalendarDays, ChevronDown, ClipboardList, Pencil, Settings2 } from 'lucide-react'
import type { CSSProperties } from 'react'
import { useMemo } from 'react'

import type { ScheduleEntry } from '@/modules/schedule/types'
import { formatTime, getDurationHours } from '@/modules/schedule/utils/scheduleGrid'
import type { ScheduleBlock, ScheduleConfig } from '@/modules/schedule/components/ScheduleWizard'
import { cn } from '@/utils/cn'
import { getSubjectPalette } from '@/utils/subjectPalette'

type PedagogicalBlock = {
  dayOfWeek: number
  start: string
  end: string
  label: string
}

type ScheduleFinalTableProps = {
  config: ScheduleConfig
  blocks: ScheduleBlock[]
  entries: ScheduleEntry[]
  pedagogicalBlocks: PedagogicalBlock[]
  activeDays: Array<{ dayOfWeek: number; label: string; name: string }>
  onEditStructure: () => void
  onConfigureAssignments: () => void
}

type CellContent =
  | { kind: 'class'; entry: ScheduleEntry }
  | { kind: 'pedagogical'; block: PedagogicalBlock }
  | { kind: 'empty' }

const SHIFT_LABELS: Record<string, string> = {
  morning: 'Matutina',
  afternoon: 'Vespertina',
  evening: 'Nocturna',
  extended: 'Extendida',
}

function getCellKey(dayOfWeek: number, block: Pick<ScheduleBlock, 'start' | 'end'>) {
  return `${dayOfWeek}:${formatTime(block.start)}-${formatTime(block.end)}`
}

function formatDuration(hours: number) {
  const totalMinutes = Math.round(hours * 60)
  const wholeHours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (totalMinutes <= 0) return '0 min'
  if (wholeHours === 0) return `${minutes} min`
  if (minutes === 0) return `${wholeHours} h`
  return `${wholeHours} h ${minutes} min`
}

export function ScheduleFinalTable({
  config,
  blocks,
  entries,
  pedagogicalBlocks,
  activeDays,
  onEditStructure,
  onConfigureAssignments,
}: ScheduleFinalTableProps) {
  const classCount = blocks.filter((block) => block.type === 'class').length
  const totalHours = entries.reduce(
    (sum, entry) => sum + getDurationHours(entry.startTime, entry.endTime),
    0,
  )
  const today = new Date().getDay()

  const entriesByCell = useMemo(() => {
    const map = new Map<string, ScheduleEntry>()
    entries.forEach((entry) => {
      map.set(`${entry.dayOfWeek}:${formatTime(entry.startTime)}-${formatTime(entry.endTime)}`, entry)
    })
    return map
  }, [entries])

  const pedagogicalByCell = useMemo(() => {
    const map = new Map<string, PedagogicalBlock>()
    pedagogicalBlocks.forEach((block) => {
      map.set(getCellKey(block.dayOfWeek, block), block)
    })
    return map
  }, [pedagogicalBlocks])

  function getCellContent(dayOfWeek: number, block: ScheduleBlock): CellContent {
    const key = getCellKey(dayOfWeek, block)
    const entry = entriesByCell.get(key)
    if (entry) return { kind: 'class', entry }

    const pedagogical = pedagogicalByCell.get(key)
    if (pedagogical) return { kind: 'pedagogical', block: pedagogical }

    return { kind: 'empty' }
  }

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-border/70 bg-card p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                Semana académica
              </h2>
              <span className="rounded-full bg-primary/8 px-2.5 py-1 text-[10px] font-extrabold text-primary">
                {entries.length} clases
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span>{SHIFT_LABELS[config.shift] ?? config.shift}</span>
              <span className="text-border">•</span>
              <span>{classCount} períodos</span>
              <span className="text-border">•</span>
              <span>{config.structureMode === 'custom' ? 'Duración variable' : `${config.blockDuration} min por período`}</span>
              <span className="text-border">•</span>
              <span>{formatDuration(totalHours)} lectivas</span>
              {pedagogicalBlocks.length ? (
                <>
                  <span className="text-border">•</span>
                  <span>{pedagogicalBlocks.length} horas pedagógicas</span>
                </>
              ) : null}
            </div>
          </div>

          <details className="group/actions relative shrink-0">
            <summary className="flex h-10 cursor-pointer list-none items-center gap-2 rounded-xl border border-border bg-card px-4 text-xs font-extrabold text-foreground shadow-sm transition hover:bg-muted/40 [&::-webkit-details-marker]:hidden">
              Acciones
              <ChevronDown className="size-4 text-muted-foreground transition-transform group-open/actions:rotate-180" />
            </summary>
            <div className="absolute right-0 top-full z-30 mt-2 w-52 overflow-hidden rounded-2xl border border-border bg-card p-1.5 shadow-xl">
              <button
                type="button"
                onClick={onConfigureAssignments}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-foreground transition hover:bg-muted"
              >
                <Settings2 className="size-4 text-primary" />
                Asignar clases
              </button>
              <button
                type="button"
                onClick={onEditStructure}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-foreground transition hover:bg-muted"
              >
                <Pencil className="size-4 text-primary" />
                Editar estructura
              </button>
            </div>
          </details>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm">
        <div
          className="grid grid-cols-[6.75rem_repeat(var(--day-count),minmax(0,1fr))] border-b border-border/70 bg-card"
          style={{ '--day-count': activeDays.length } as CSSProperties}
        >
          <div className="flex items-center justify-center border-r border-border/70 px-3 py-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-muted-foreground">
            Hora
          </div>
          {activeDays.map((day) => {
            const isToday = day.dayOfWeek === today
            return (
              <div
                key={day.dayOfWeek}
                className={cn(
                  'relative border-r border-border/70 px-3 py-3 text-center last:border-r-0',
                  isToday && 'bg-primary/[0.045]',
                )}
              >
                {isToday ? <span className="absolute inset-x-8 top-0 h-0.5 rounded-b-full bg-primary" /> : null}
                <p className={cn('text-xs font-extrabold uppercase tracking-[0.12em] text-foreground', isToday && 'text-primary')}>
                  {day.name}
                </p>
                {isToday ? <p className="mt-0.5 text-[9px] font-bold text-primary">Hoy</p> : null}
              </div>
            )
          })}
        </div>

        <div className="divide-y divide-border/60">
          {blocks.map((block, index) => {
            const isBreak = block.type === 'break'

            return (
              <div
                key={block.id}
                className="grid grid-cols-[6.75rem_repeat(var(--day-count),minmax(0,1fr))]"
                style={{ '--day-count': activeDays.length } as CSSProperties}
              >
                <div
                  className={cn(
                    'flex flex-col items-center justify-center border-r border-border/70 px-2 py-3 text-center',
                    isBreak ? 'bg-warning/10' : 'bg-muted/20',
                  )}
                >
                  <span className="text-[10px] font-extrabold text-muted-foreground">P{index + 1}</span>
                  <span className="mt-0.5 text-xs font-extrabold tabular-nums text-foreground">{formatTime(block.start)}</span>
                  <span className="text-[10px] tabular-nums text-muted-foreground">{formatTime(block.end)}</span>
                </div>

                {isBreak ? (
                  <div
                    className="col-[2/-1] flex min-h-14 items-center justify-center gap-2 px-4 py-2 text-center"
                    style={{ backgroundColor: 'color-mix(in srgb, var(--palette-yellow) 22%, var(--palette-white))' }}
                  >
                    <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-foreground">
                      {block.label}
                    </span>
                    <span className="text-[10px] font-semibold text-muted-foreground">
                      {formatTime(block.start)}–{formatTime(block.end)}
                    </span>
                  </div>
                ) : (
                  activeDays.map((day) => {
                    const content = getCellContent(day.dayOfWeek, block)
                    const isToday = day.dayOfWeek === today
                    return (
                      <div
                        key={day.dayOfWeek}
                        className={cn(
                          'min-h-[76px] border-r border-border/60 p-1.5 last:border-r-0',
                          isToday && 'bg-primary/[0.018]',
                        )}
                      >
                        <ScheduleFinalCell content={content} />
                      </div>
                    )
                  })
                )}
              </div>
            )
          })}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-2 font-semibold text-foreground">
          <CalendarDays className="size-3.5 text-primary" />
          {entries.length} clases
        </span>
        <span>{formatDuration(totalHours)}</span>
        <span className="inline-flex items-center gap-2">
          <ClipboardList className="size-3.5" />
          {pedagogicalBlocks.length} horas pedagógicas
        </span>
      </div>
    </div>
  )
}

function ScheduleFinalCell({ content }: { content: CellContent }) {
  if (content.kind === 'empty') {
    return (
      <div className="flex h-full min-h-16 items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/10 text-[10px] font-semibold text-muted-foreground/70">
        Libre
      </div>
    )
  }

  if (content.kind === 'pedagogical') {
    return (
      <div className="flex h-full min-h-16 flex-col justify-center rounded-xl border border-border/70 bg-muted/30 px-3 py-2 text-foreground">
        <p className="text-xs font-extrabold leading-tight">{content.block.label}</p>
        <p className="mt-1 text-[10px] font-medium text-muted-foreground">Trabajo no lectivo</p>
      </div>
    )
  }

  const palette = getSubjectPalette(content.entry.subjectName)

  return (
    <div
      className="flex h-full min-h-16 flex-col justify-center rounded-xl px-3 py-2 shadow-[0_8px_20px_-20px_rgba(47,53,66,0.28)]"
      style={{ backgroundColor: palette.soft }}
    >
      <p className="text-xs font-extrabold leading-tight" style={{ color: palette.color }}>
        {content.entry.subjectName}
      </p>
      <p className="mt-1 text-[10px] font-semibold text-muted-foreground">
        {content.entry.gradeName} {content.entry.sectionName} · {content.entry.academicLevelName}
      </p>
    </div>
  )
}
