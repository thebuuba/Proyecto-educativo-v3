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

function getWeekDate(dayOfWeek: number) {
  const now = new Date()
  const currentDay = now.getDay()
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay
  const date = new Date(now)
  date.setHours(12, 0, 0, 0)
  date.setDate(now.getDate() + mondayOffset + (dayOfWeek - 1))
  return date
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
      <section className="rounded-[26px] bg-card px-4 py-4 shadow-sm sm:px-5">
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
            <summary className="flex h-10 cursor-pointer list-none items-center gap-2 rounded-xl border border-border/80 bg-card px-4 text-xs font-extrabold text-foreground transition hover:bg-muted/40 [&::-webkit-details-marker]:hidden">
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

      <section className="overflow-hidden rounded-[28px] bg-card shadow-[0_18px_45px_-34px_rgba(15,23,42,0.38)]">
        <div className="overflow-x-auto">
          <div className="min-w-[940px] bg-[#fbfbfc] p-2.5 sm:p-3">
            <div
              className="grid grid-cols-[5.75rem_repeat(var(--day-count),minmax(0,1fr))] gap-1.5"
              style={{ '--day-count': activeDays.length } as CSSProperties}
            >
              <div className="flex min-h-[72px] flex-col items-center justify-center rounded-2xl px-2 text-center">
                <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Hora</span>
                <span className="mt-1 text-[10px] font-semibold text-muted-foreground/70">
                  {SHIFT_LABELS[config.shift] ?? config.shift}
                </span>
              </div>

              {activeDays.map((day) => {
                const isToday = day.dayOfWeek === today
                const date = getWeekDate(day.dayOfWeek)

                return (
                  <div
                    key={day.dayOfWeek}
                    className={cn(
                      'relative flex min-h-[72px] flex-col items-center justify-center rounded-2xl px-3 text-center transition-colors',
                      isToday ? 'bg-primary/[0.075]' : 'bg-white',
                    )}
                  >
                    <p className={cn('text-[9px] font-bold uppercase tracking-[0.12em]', isToday ? 'text-primary' : 'text-muted-foreground')}>
                      {day.name}
                    </p>
                    <p className={cn('mt-0.5 text-2xl font-extrabold leading-none tabular-nums', isToday ? 'text-primary' : 'text-foreground')}>
                      {date.getDate()}
                    </p>
                    {isToday ? (
                      <span className="absolute bottom-1.5 rounded-full bg-primary px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wide text-primary-foreground">
                        Hoy
                      </span>
                    ) : null}
                  </div>
                )
              })}
            </div>

            <div className="mt-1.5 overflow-hidden rounded-2xl bg-white">
              {blocks.map((block, index) => {
                const isBreak = block.type === 'break'

                return (
                  <div
                    key={block.id}
                    className={cn(
                      'grid grid-cols-[5.75rem_repeat(var(--day-count),minmax(0,1fr))]',
                      index > 0 && 'border-t border-slate-100',
                    )}
                    style={{ '--day-count': activeDays.length } as CSSProperties}
                  >
                    <div className="flex min-h-[92px] flex-col items-center justify-start border-r border-slate-100 px-2 pt-3 text-center">
                      <span className="text-[10px] font-bold tabular-nums text-muted-foreground">
                        {formatTime(block.start)}
                      </span>
                      <span className="mt-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/55">
                        {isBreak ? 'Receso' : `P${index + 1}`}
                      </span>
                    </div>

                    {isBreak ? (
                      <div
                        className="col-[2/-1] m-1.5 flex min-h-[74px] items-center justify-center gap-2 rounded-[14px] px-4 py-2 text-center"
                        style={{ backgroundColor: 'color-mix(in srgb, var(--palette-yellow) 20%, var(--palette-white))' }}
                      >
                        <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-foreground">
                          {block.label}
                        </span>
                        <span className="text-[9px] font-semibold text-muted-foreground">
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
                              'min-h-[92px] border-r border-slate-100 p-1.5 last:border-r-0',
                              isToday && 'bg-primary/[0.012]',
                            )}
                          >
                            <ScheduleFinalCell
                              content={content}
                              start={block.start}
                              end={block.end}
                            />
                          </div>
                        )
                      })
                    )}
                  </div>
                )
              })}
            </div>
          </div>
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

function ScheduleFinalCell({
  content,
  start,
  end,
}: {
  content: CellContent
  start: string
  end: string
}) {
  if (content.kind === 'empty') {
    return <div className="h-full min-h-[78px] rounded-[14px] transition-colors hover:bg-muted/20" />
  }

  if (content.kind === 'pedagogical') {
    return (
      <div className="flex h-full min-h-[78px] flex-col justify-between rounded-[14px] bg-slate-100 px-3.5 py-3 text-foreground">
        <div>
          <p className="text-[11px] font-extrabold leading-tight">{content.block.label}</p>
          <p className="mt-1 text-[9px] font-medium text-muted-foreground">Trabajo no lectivo</p>
        </div>
        <p className="mt-2 text-[9px] font-semibold tabular-nums text-muted-foreground/80">
          {formatTime(start)}–{formatTime(end)}
        </p>
      </div>
    )
  }

  const palette = getSubjectPalette(content.entry.subjectName)

  return (
    <div
      className="flex h-full min-h-[78px] flex-col justify-between rounded-[14px] px-3.5 py-3 shadow-[0_8px_18px_-16px_rgba(35,35,45,0.28)]"
      style={{ backgroundColor: palette.soft, color: palette.foreground }}
    >
      <div>
        <p className="line-clamp-2 text-[11px] font-extrabold leading-[1.22]">
          {content.entry.subjectName}
        </p>
        <p className="mt-1 text-[9px] font-semibold opacity-70">
          {content.entry.gradeName} {content.entry.sectionName} · {content.entry.academicLevelName}
        </p>
      </div>
      <p className="mt-2 text-[9px] font-semibold tabular-nums opacity-55">
        {formatTime(start)}–{formatTime(end)}
      </p>
    </div>
  )
}
