import { CalendarDays, ClipboardList, Pencil, Settings2 } from 'lucide-react'
import type { CSSProperties } from 'react'
import { useMemo } from 'react'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { ScheduleEntry } from '@/modules/schedule/types'
import { formatTime, getDurationHours } from '@/modules/schedule/utils/scheduleGrid'
import type { ScheduleBlock, ScheduleConfig } from '@/modules/schedule/components/ScheduleWizard'
import { cn } from '@/utils/cn'

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

const SUBJECT_STYLES = [
  'bg-sky-50 text-sky-900 border-sky-200',
  'bg-emerald-50 text-emerald-900 border-emerald-200',
  'bg-violet-50 text-violet-900 border-violet-200',
  'bg-amber-50 text-amber-900 border-amber-200',
  'bg-rose-50 text-rose-900 border-rose-200',
  'bg-teal-50 text-teal-900 border-teal-200',
  'bg-orange-50 text-orange-900 border-orange-200',
]

const SHIFT_LABELS: Record<string, string> = {
  morning: 'Matutina',
  afternoon: 'Vespertina',
  evening: 'Nocturna',
  extended: 'Extendida',
}

function hashString(value: string) {
  let hash = 0
  for (let index = 0; index < value.length; index++) {
    hash = ((hash << 5) - hash) + value.charCodeAt(index)
    hash |= 0
  }
  return Math.abs(hash)
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
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="mr-auto">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Mi semana académica
          </h2>
          <p className="text-sm text-muted-foreground">
            Vista final unificada del horario docente.
          </p>
        </div>
        <Badge tone="accent" className="rounded-full px-3 py-1">
          Tanda {SHIFT_LABELS[config.shift] ?? config.shift}
        </Badge>
        <Badge tone="default" className="rounded-full px-3 py-1">
          {classCount} períodos · {config.structureMode === 'custom' ? 'duración variable' : `${config.blockDuration} min`}
        </Badge>
        <Button variant="outline" size="sm" onClick={onConfigureAssignments} className="gap-1.5 rounded-full bg-card">
          <Settings2 className="size-3.5" />
          Asignar clases
        </Button>
        <Button variant="outline" size="sm" onClick={onEditStructure} className="gap-1.5 rounded-full bg-card">
          <Pencil className="size-3.5" />
          Editar horario
        </Button>
      </div>

      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="grid grid-cols-[7.5rem_repeat(var(--day-count),minmax(0,1fr))] bg-primary text-primary-foreground" style={{ '--day-count': activeDays.length } as CSSProperties}>
          <div className="flex items-center justify-center border-r border-primary-foreground/20 px-3 py-3 text-xs font-bold uppercase tracking-widest">
            Hora
          </div>
          {activeDays.map((day) => (
            <div key={day.dayOfWeek} className="border-r border-primary-foreground/20 px-3 py-3 text-center last:border-r-0">
              <p className="text-sm font-extrabold uppercase tracking-widest">{day.name}</p>
            </div>
          ))}
        </div>

        <div className="divide-y divide-border">
          {blocks.map((block, index) => {
            const isBreak = block.type === 'break'

            return (
              <div
                key={block.id}
                className="grid grid-cols-[7.5rem_repeat(var(--day-count),minmax(0,1fr))]"
                style={{ '--day-count': activeDays.length } as CSSProperties}
              >
                <div className={cn(
                  'flex flex-col items-center justify-center border-r border-border px-2 py-3 text-center text-xs',
                  isBreak ? 'bg-amber-100/80 text-amber-800' : 'bg-muted/50 text-muted-foreground',
                )}>
                  <span className="font-extrabold text-foreground">{index + 1}</span>
                  <span>{formatTime(block.start)}</span>
                  <span>{formatTime(block.end)}</span>
                </div>

                {activeDays.map((day) => {
                  if (isBreak) {
                    return (
                      <div
                        key={day.dayOfWeek}
                        className="flex min-h-14 items-center justify-center border-r border-border bg-amber-50 px-2 py-2 text-center text-xs font-extrabold uppercase tracking-widest text-amber-800 last:border-r-0"
                      >
                        {block.label}
                      </div>
                    )
                  }

                  const content = getCellContent(day.dayOfWeek, block)

                  return (
                    <div key={day.dayOfWeek} className="min-h-20 border-r border-border p-1.5 last:border-r-0">
                      <ScheduleFinalCell content={content} />
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-2 font-semibold text-foreground">
          <CalendarDays className="size-4" />
          {entries.length} clases
        </span>
        <span>{formatDuration(totalHours)}</span>
        <span className="inline-flex items-center gap-2">
          <ClipboardList className="size-4" />
          {pedagogicalBlocks.length} horas pedagógicas
        </span>
      </div>
    </div>
  )
}

function ScheduleFinalCell({ content }: { content: CellContent }) {
  if (content.kind === 'empty') {
    return (
      <div className="flex h-full min-h-16 items-center justify-center rounded-md border border-dashed border-border bg-muted/20 text-xs font-medium text-muted-foreground">
        Libre
      </div>
    )
  }

  if (content.kind === 'pedagogical') {
    return (
      <div className="flex h-full min-h-16 flex-col justify-center rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 text-slate-700">
        <p className="text-xs font-extrabold leading-tight">{content.block.label}</p>
        <p className="mt-1 text-[11px] text-slate-500">Trabajo no lectivo</p>
      </div>
    )
  }

  const style = SUBJECT_STYLES[hashString(content.entry.subjectName) % SUBJECT_STYLES.length]

  return (
    <div className={cn('flex h-full min-h-16 flex-col justify-center rounded-md border px-2 py-1.5', style)}>
      <p className="text-xs font-extrabold leading-tight">{content.entry.subjectName}</p>
      <p className="mt-1 text-[11px] font-semibold opacity-80">
        {content.entry.gradeName} {content.entry.sectionName}
      </p>
    </div>
  )
}
