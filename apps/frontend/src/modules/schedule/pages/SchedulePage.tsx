import { useCallback, useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { PageShell } from '@/components/ui/PageShell'
import { ScheduleFinalTable } from '@/modules/schedule/components/ScheduleFinalTable'
import { ScheduleWeekGrid } from '@/modules/schedule/components/ScheduleWeekGrid'
import {
  ScheduleWizard,
  type ScheduleBlock,
  type ScheduleConfig,
} from '@/modules/schedule/components/ScheduleWizard'
import { useSchedule } from '@/modules/schedule/hooks/useSchedule'
import {
  createTimeSlot as apiCreateTimeSlot,
  getSectionSubjects,
  getTimeSlots,
  updateTimeSlot as apiUpdateTimeSlot,
} from '@/modules/schedule/services/scheduleService'
import type { CreateScheduleEntryInput, TimeSlot } from '@/modules/schedule/types'

const CONFIG_KEY = 'aula-base:schedule:config'
const BLOCKS_KEY = 'aula-base:schedule:blocks'
const PEDAGOGICAL_BLOCKS_KEY = 'aula-base:schedule:pedagogical-blocks'

export type PedagogicalBlock = {
  dayOfWeek: number
  start: string
  end: string
  label: string
}

type SectionSubjectOption = {
  id: string
  sectionId: string
  label: string
  subjectName: string
  gradeName: string
  sectionName: string
  teacherName: string
}

type ApiSectionSubject = {
  id: string
  subjectName: string
  teacherName: string
}

function timeSlotsToBlocks(slots: TimeSlot[]): ScheduleBlock[] {
  return slots.map((slot) => ({
    id: slot.id,
    label: slot.name,
    type: (slot.name.toLowerCase().includes('recreo') || slot.name.toLowerCase().includes('receso'))
      ? 'break' as const
      : 'class' as const,
    start: slot.startTime,
    end: slot.endTime,
  }))
}

function hasSameTimeSlot(slot: Pick<TimeSlot, 'startTime' | 'endTime'>, block: ScheduleBlock) {
  return slot.startTime.slice(0, 5) === block.start && slot.endTime.slice(0, 5) === block.end
}

function getPedagogicalBlockKey(dayOfWeek: number, block: Pick<ScheduleBlock, 'start' | 'end'>) {
  return `${dayOfWeek}:${block.start}-${block.end}`
}

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const stored = localStorage.getItem(key)
    if (!stored) return fallback
    return JSON.parse(stored) as T
  } catch {
    return fallback
  }
}

const activeWeekDays = [
  { dayOfWeek: 1, label: 'Lun', name: 'Lunes' },
  { dayOfWeek: 2, label: 'Mar', name: 'Martes' },
  { dayOfWeek: 3, label: 'Mié', name: 'Miércoles' },
  { dayOfWeek: 4, label: 'Jue', name: 'Jueves' },
  { dayOfWeek: 5, label: 'Vie', name: 'Viernes' },
] as const

function getActiveDays(config: ScheduleConfig) {
  return activeWeekDays.filter((d) => config.days.includes(d.dayOfWeek))
}

export function SchedulePage() {
  const {
    timeSlots: apiTimeSlots,
    entries,
    sections,
    schoolYearId,
    loading,
    error,
    createEntry,
    removeEntry,
    refetchAll,
  } = useSchedule()

  const [showWizard, setShowWizard] = useState(false)
  const [config, setConfig] = useState<ScheduleConfig | null>(null)
  const [storedBlocks, setStoredBlocks] = useState<ScheduleBlock[]>([])
  const [pedagogicalBlocks, setPedagogicalBlocks] = useState<PedagogicalBlock[]>([])
  const [assignmentMode, setAssignmentMode] = useState(false)
  const [sectionSubjects, setSectionSubjects] = useState<SectionSubjectOption[]>([])
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const hasTimeSlots = apiTimeSlots.length > 0
  const hasConfig = config !== null

  useEffect(() => {
    const savedConfig = loadFromStorage<ScheduleConfig | null>(CONFIG_KEY, null)
    if (savedConfig) {
      setConfig({
        ...savedConfig,
        pedagogicalLabel: savedConfig.pedagogicalLabel || 'Hora pedagógica',
        structureMode: savedConfig.structureMode ?? 'uniform',
        customBlocks: savedConfig.customBlocks ?? [],
      })
      const savedBlocks = loadFromStorage<ScheduleBlock[]>(BLOCKS_KEY, [])
      setStoredBlocks(savedBlocks)
      setPedagogicalBlocks(loadFromStorage<PedagogicalBlock[]>(PEDAGOGICAL_BLOCKS_KEY, []))
    }
  }, [])

  useEffect(() => {
    if (hasTimeSlots && !hasConfig) {
      const inferredConfig: ScheduleConfig = {
        days: [1, 2, 3, 4, 5],
        shift: 'morning',
        blockDuration: 45,
        startTime: '08:00',
        endTime: '12:30',
        pedagogicalLabel: 'Hora pedagógica',
        structureMode: 'uniform',
        customBlocks: [],
        breaks: [],
      }
      setConfig(inferredConfig)
      setStoredBlocks(timeSlotsToBlocks(apiTimeSlots))
    }
  }, [hasTimeSlots, hasConfig, apiTimeSlots])

  const gridBlocks = useMemo(() => {
    if (storedBlocks.length > 0) return storedBlocks
    if (hasTimeSlots) return timeSlotsToBlocks(apiTimeSlots)
    return []
  }, [hasTimeSlots, apiTimeSlots, storedBlocks])

  const hasStructure = hasTimeSlots || storedBlocks.length > 0
  const showFinalSchedule = hasStructure && !showWizard && !assignmentMode
  const showAssignmentGrid = hasStructure && !showWizard && assignmentMode
  const days = config ? getActiveDays(config) : activeWeekDays.filter(() => true)
  const visiblePedagogicalBlocks = useMemo(() => {
    const activeDayIds = new Set<number>(days.map((day) => day.dayOfWeek))
    const visibleBlockKeys = new Set(
      gridBlocks
        .filter((block) => block.type === 'class')
        .map((block) => `${block.start}-${block.end}`),
    )

    return pedagogicalBlocks.filter(
      (block) =>
        activeDayIds.has(block.dayOfWeek) &&
        visibleBlockKeys.has(`${block.start}-${block.end}`),
    )
  }, [days, gridBlocks, pedagogicalBlocks])

  const loadSectionSubjects = useCallback(async () => {
    if (sections.length === 0) {
      setSectionSubjects([])
      return
    }
    try {
      const results = await Promise.all(
        sections.map(async (section) => {
          const subjects = await getSectionSubjects(section.id)
          return subjects.map((s: ApiSectionSubject) => ({
            id: s.id,
            sectionId: section.id,
            label: `${section.gradeName} ${section.name} - ${s.subjectName}`,
            subjectName: s.subjectName,
            gradeName: section.gradeName,
            sectionName: section.name,
            teacherName: s.teacherName,
          }))
        }),
      )
      setSectionSubjects(results.flat())
    } catch {
      setSectionSubjects([])
    }
  }, [sections])

  useEffect(() => {
    if (sections.length > 0) {
      void loadSectionSubjects()
    }
  }, [sections, loadSectionSubjects])

  async function handleWizardComplete(newConfig: ScheduleConfig, blocks: ScheduleBlock[]) {
    setSaving(true)
    setSaveError(null)
    try {
      const normalizedConfig = {
        ...newConfig,
        pedagogicalLabel: newConfig.pedagogicalLabel.trim() || 'Hora pedagógica',
      }
      const existingSlots = await getTimeSlots()
      const classBlocks = blocks.filter((b) => b.type === 'class')

      await Promise.all(
        classBlocks.map((block, index) => {
          const existingSlot = existingSlots.find((slot) => hasSameTimeSlot(slot, block))
          const payload = {
            name: block.label,
            startTime: block.start,
            endTime: block.end,
            sequence: index + 1,
          }

          if (!existingSlot) {
            return apiCreateTimeSlot(payload)
          }

          if (
            existingSlot.name !== payload.name ||
            existingSlot.sequence !== payload.sequence
          ) {
            return apiUpdateTimeSlot(existingSlot.id, payload)
          }

          return Promise.resolve(existingSlot)
        }),
      )

      localStorage.setItem(CONFIG_KEY, JSON.stringify(normalizedConfig))
      localStorage.setItem(BLOCKS_KEY, JSON.stringify(blocks))

      if (pedagogicalBlocks.length > 0) {
        updatePedagogicalBlocks(
          pedagogicalBlocks.map((block) => ({
            ...block,
            label: normalizedConfig.pedagogicalLabel,
          })),
        )
      }

      setConfig(normalizedConfig)
      setStoredBlocks(blocks)
      setShowWizard(false)
      setAssignmentMode(true)
      await refetchAll()
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Error al crear el horario.')
    } finally {
      setSaving(false)
    }
  }

  async function handleAssign(
    dayOfWeek: number,
    block: ScheduleBlock,
    sectionSubjectId: string,
    sectionId: string,
  ) {
    if (!schoolYearId || !apiTimeSlots.length) return

    const timeSlot = apiTimeSlots.find(
      (ts) => hasSameTimeSlot(ts, block),
    )
    if (!timeSlot) return

    const input: CreateScheduleEntryInput = {
      schoolYearId,
      sectionSubjectId,
      sectionId,
      timeSlotId: timeSlot.id,
      dayOfWeek,
    }

    try {
      await createEntry(input)
      removePedagogicalBlock(dayOfWeek, block)
      await refetchAll()
    } catch (err) {
      console.error('Error al asignar materia:', err)
    }
  }

  function updatePedagogicalBlocks(nextBlocks: PedagogicalBlock[]) {
    setPedagogicalBlocks(nextBlocks)
    localStorage.setItem(PEDAGOGICAL_BLOCKS_KEY, JSON.stringify(nextBlocks))
  }

  function markPedagogicalBlock(dayOfWeek: number, block: ScheduleBlock) {
    const key = getPedagogicalBlockKey(dayOfWeek, block)
    const label = config?.pedagogicalLabel?.trim() || 'Hora pedagógica'
    updatePedagogicalBlocks([
      ...pedagogicalBlocks.filter(
        (item) => getPedagogicalBlockKey(item.dayOfWeek, item) !== key,
      ),
      {
        dayOfWeek,
        start: block.start,
        end: block.end,
        label,
      },
    ])
  }

  function removePedagogicalBlock(dayOfWeek: number, block: Pick<ScheduleBlock, 'start' | 'end'>) {
    const key = getPedagogicalBlockKey(dayOfWeek, block)
    updatePedagogicalBlocks(
      pedagogicalBlocks.filter(
        (item) => getPedagogicalBlockKey(item.dayOfWeek, item) !== key,
      ),
    )
  }

  async function handleRemove(entryId: string) {
    try {
      await removeEntry(entryId)
      await refetchAll()
    } catch (err) {
      console.error('Error al quitar asignatura:', err)
    }
  }

  const description = !hasStructure
    ? 'Configura la estructura de tu semana académica en unos pocos pasos.'
    : assignmentMode
      ? 'Completa o corrige las asignaciones antes de volver a la vista final.'
      : `${entries.length} clases organizadas en una vista semanal unificada.`

  return (
    <PageShell
      title=""
      description=""
    >
      <div className="w-full min-w-0 space-y-8 pb-10">
        {/* Page header */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Planificación
            </p>
            <h1 className="mt-1 text-4xl font-bold tracking-tight text-foreground">
              Horario docente
            </h1>
            <p className="mt-2 max-w-lg text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        {error || saveError ? (
          <div className="rounded-lg border border-destructive/20 bg-destructive/12 p-3 text-sm text-destructive">
            {error || saveError}
          </div>
        ) : null}

        {loading ? (
          <div className="flex items-center justify-center rounded-2xl border border-border bg-card py-32 text-sm text-muted-foreground">
            Cargando horario...
          </div>
        ) : null}

        {/* Show wizard if no structure */}
        {!loading && !hasStructure ? (
          <div className="mx-auto max-w-3xl">
            <ScheduleWizard
              submitting={saving}
              error={saveError}
              onComplete={handleWizardComplete}
            />
          </div>
        ) : null}

        {/* Show final schedule when structure exists */}
        {!loading && showFinalSchedule && config ? (
          <ScheduleFinalTable
            config={config}
            blocks={gridBlocks}
            entries={entries}
            pedagogicalBlocks={visiblePedagogicalBlocks}
            activeDays={days}
            onEditStructure={() => setShowWizard(true)}
            onConfigureAssignments={() => setAssignmentMode(true)}
          />
        ) : null}

        {/* Show assignment grid when editing assignments */}
        {!loading && showAssignmentGrid && config ? (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setAssignmentMode(false)}>
                Ver horario final
              </Button>
            </div>
            <ScheduleWeekGrid
              config={config}
              blocks={gridBlocks}
              entries={entries}
              pedagogicalBlocks={visiblePedagogicalBlocks}
              sectionSubjects={sectionSubjects}
              activeDays={days}
              onEdit={() => setShowWizard(true)}
              onAssign={handleAssign}
              onRemove={handleRemove}
              onMarkPedagogical={markPedagogicalBlock}
              onRemovePedagogical={removePedagogicalBlock}
            />
          </div>
        ) : null}

        {/* Edit wizard overlay */}
        {!loading && showWizard && config ? (
          <div className="mx-auto max-w-3xl">
            <ScheduleWizard
              initialConfig={config}
              submitting={saving}
              error={saveError}
              onComplete={handleWizardComplete}
              onCancel={() => setShowWizard(false)}
            />
          </div>
        ) : null}
      </div>
    </PageShell>
  )
}
