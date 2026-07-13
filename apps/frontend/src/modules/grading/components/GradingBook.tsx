import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Download,
  Hourglass,
  Layers,
  Plus,
  Settings,
  Target,
  Trophy,
  TrendingUp,
  Users,
} from 'lucide-react'
import { useEffect, useMemo, useState, type KeyboardEvent, type ReactNode } from 'react'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import type {
  GradeCalculationConfig,
  GradeCellSaveState,
  GradeRecordRow,
  GradingActivity,
  RecoveryScores,
  StudentGradeRow,
} from '@/modules/grading/types'
import {
  blockTotal,
  activityGradeCellKey,
  competencyBlocks,
  competencyPeriods,
  defaultGradeCalculationConfig,
  effectivePeriodScore,
  finalBlockAverage,
  finalSubjectScore,
  formatGrade,
  getRecoveryScores,
  plainActivityText,
  recoveryGradeCellKey,
  scoreForActivity,
  sumActivityMaxScore,
  type CompetencyBlockId,
  type CompetencyPeriodId,
} from '@/modules/grading/utils/competencyGrades'
import { cn } from '@/utils/cn'

type GradingBookProps = {
  students: StudentGradeRow[]
  activities: GradingActivity[]
  records: GradeRecordRow[]
  recoveryScores: RecoveryScores
  periodName: string
  periodShortName: string
  recoveryLabel: string
  courseTitle: string
  saving: boolean
  cellSaveStates: Record<string, GradeCellSaveState>
  initialView?: MainView
  onAddActivity: (activity: Omit<GradingActivity, 'id'>) => Promise<void>
  onUpdateActivity: (activity: GradingActivity) => Promise<void>
  onDeleteActivity: (activityId: string) => Promise<void>
  onSaveScore: (enrollmentId: string, activity: GradingActivity, value: string) => Promise<void>
  onSaveRecovery: (enrollmentId: string, blockId: string, value: string) => Promise<void>
  loadFinalRecords: () => Promise<Map<CompetencyPeriodId, GradeRecordRow[]>>
  getActivitiesForPeriod: (periodId: CompetencyPeriodId) => GradingActivity[]
  onActivityWorkspaceChange?: (active: boolean) => void
}

const mainViewTabs = ['blocks', 'period', 'annual', 'final'] as const
type MainView = (typeof mainViewTabs)[number]
type DetailView =
  | { type: 'block'; blockId: CompetencyBlockId }
  | { type: 'activity'; activityId: string }
  | { type: 'activity-hub' }
  | { type: 'activity-create'; blockId: CompetencyBlockId }

const blockAccents = [
  {
    card: 'border-blue-100 bg-blue-50/35',
    panel: 'bg-blue-50 text-blue-950',
    dot: 'bg-blue-500',
  },
  {
    card: 'border-emerald-100 bg-emerald-50/35',
    panel: 'bg-emerald-50 text-emerald-950',
    dot: 'bg-emerald-500',
  },
  {
    card: 'border-amber-100 bg-amber-50/35',
    panel: 'bg-amber-50 text-amber-950',
    dot: 'bg-amber-500',
  },
  {
    card: 'border-violet-100 bg-violet-50/35',
    panel: 'bg-violet-50 text-violet-950',
    dot: 'bg-violet-500',
  },
]

const blockShortNames: Record<string, string> = {
  b1: 'Competencia Comunicativa',
  b2: 'Pensamiento Lógico, Creativo y Crítico y Resolución de Problemas',
  b3: 'Ética y Ciudadana y Desarrollo Personal y Espiritual',
  b4: 'Científica y Tecnológica y Ambiental y de la Salud',
}

type ActivityDraft = {
  draftId?: string
  name: string
  maxScore: string
  competencyBlockId: string
  date: string
  description: string
  studentRole: string
  teacherRole: string
  instrumentType: string
  evaluationTechnique: string
  planningMoment: string
  observations: string
  activityType: 'individual' | 'group'
}

type ActivityDraftsByBlock = Partial<Record<CompetencyBlockId, ActivityDraft[]>>

const emptyActivityDraft: ActivityDraft = {
  name: '',
  maxScore: '20',
  competencyBlockId: competencyBlocks[0].id,
  date: '',
  description: '',
  studentRole: '',
  teacherRole: '',
  instrumentType: '',
  evaluationTechnique: '',
  planningMoment: 'desarrollo',
  observations: '',
  activityType: 'individual',
}

export function GradingBook({
  students,
  activities,
  records,
  recoveryScores,
  periodName,
  periodShortName,
  recoveryLabel,
  courseTitle,
  saving,
  cellSaveStates,
  initialView = 'blocks',
  onAddActivity,
  onUpdateActivity,
  onDeleteActivity,
  onSaveScore,
  onSaveRecovery,
  loadFinalRecords,
  getActivitiesForPeriod,
  onActivityWorkspaceChange,
}: GradingBookProps) {
  const [mainView, setMainView] = useState<MainView>(initialView)
  const [detailView, setDetailView] = useState<DetailView | null>(null)
  const [activityCreateReturnView, setActivityCreateReturnView] = useState<DetailView | null>(null)
  const [showConfig, setShowConfig] = useState(false)
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null)
  const [activityDraft, setActivityDraft] = useState(emptyActivityDraft)
  const [activityDrafts, setActivityDrafts] = useState<ActivityDraftsByBlock>({})
  const [draftsReadyKey, setDraftsReadyKey] = useState<string | null>(null)
  const [config, setConfig] = useState<GradeCalculationConfig>(defaultGradeCalculationConfig)
  const [recordsByPeriod, setRecordsByPeriod] = useState<Map<CompetencyPeriodId, GradeRecordRow[]>>(new Map())
  const [loadingAnnual, setLoadingAnnual] = useState(false)
  const [annualError, setAnnualError] = useState<string | null>(null)
  const [annualRetryKey, setAnnualRetryKey] = useState(0)

  useEffect(() => {
    setMainView(initialView)
    setDetailView(null)
  }, [initialView])

  const selectedBlock = detailView?.type === 'block'
    ? competencyBlocks.find((block) => block.id === detailView.blockId) ?? null
    : null
  const selectedCreateBlock = detailView?.type === 'activity-create'
    ? competencyBlocks.find((block) => block.id === detailView.blockId) ?? null
    : null
  const selectedActivity = detailView?.type === 'activity'
    ? activities.find((activity) => activity.id === detailView.activityId) ?? null
    : null
  const isActivityWorkspace = detailView?.type === 'activity-hub' || detailView?.type === 'activity-create' || detailView?.type === 'activity'
  const draftStorageKey = useMemo(
    () => `grading-activity-drafts:${courseTitle}:${periodShortName}`,
    [courseTitle, periodShortName],
  )

  useEffect(() => {
    onActivityWorkspaceChange?.(isActivityWorkspace)
    return () => onActivityWorkspaceChange?.(false)
  }, [isActivityWorkspace, onActivityWorkspaceChange])

  const blockSummaries = useMemo(
    () => competencyBlocks.map((block, index) => {
      const blockActivities = activities.filter((activity) => activity.competencyBlockId === block.id)
      const expected = config.expectedBlockTotal
      const maxScore = sumActivityMaxScore(blockActivities, block.id)
      const studentScores = students.map((student) => {
        const total = blockTotal({
          records,
          activities: blockActivities,
          enrollmentId: student.enrollmentId,
          blockId: block.id,
          config,
        })
        const recovery = recoveryScores[block.id]?.[student.enrollmentId] ?? null
        return effectivePeriodScore(total, recovery, config)
      })
      const gradedScores = studentScores.filter((value) => value > 0)
      const average = gradedScores.length > 0
        ? gradedScores.reduce((sum, value) => sum + value, 0) / gradedScores.length
        : null
      const hasRecovery = Object.values(recoveryScores[block.id] ?? {}).some((value) => typeof value === 'number')
      const status = blockActivities.length === 0
        ? 'Sin actividades'
        : average === null
          ? 'Sin calificar'
          : hasRecovery
            ? 'En recuperación'
            : average >= config.passingScore
              ? 'Completado'
              : 'Pendiente'

      return {
        block,
        index,
        activities: blockActivities,
        expected,
        maxScore,
        average,
        status,
      }
    }),
    [activities, config, records, recoveryScores, students],
  )
  const periodAverage = averageNumbers(
    blockSummaries
      .map((summary) => summary.average)
      .filter((value): value is number => value !== null),
  )
  const pendingBlocks = blockSummaries.filter((summary) =>
    summary.status === 'Pendiente' || summary.status === 'Sin calificar' || summary.status === 'En recuperación',
  ).length

  useEffect(() => {
    if (mainView !== 'annual' && mainView !== 'final') return
    let ignore = false
    async function loadAnnualRecords() {
      setLoadingAnnual(true)
      setAnnualError(null)
      try {
        const next = await loadFinalRecords()
        if (!ignore) setRecordsByPeriod(next)
      } catch (loadError) {
        if (!ignore) {
          setAnnualError(loadError instanceof Error ? loadError.message : 'No se pudo cargar la información anual.')
        }
      } finally {
        if (!ignore) setLoadingAnnual(false)
      }
    }
    void loadAnnualRecords()
    return () => {
      ignore = true
    }
  }, [annualRetryKey, loadFinalRecords, mainView])

  useEffect(() => {
    setDraftsReadyKey(null)
    try {
      const stored = window.localStorage.getItem(draftStorageKey)
      setActivityDrafts(stored ? normalizeStoredActivityDrafts(JSON.parse(stored)) : {})
    } catch {
      setActivityDrafts({})
    }
    setDraftsReadyKey(draftStorageKey)
  }, [draftStorageKey])

  useEffect(() => {
    if (draftsReadyKey !== draftStorageKey) return
    try {
      window.localStorage.setItem(draftStorageKey, JSON.stringify(activityDrafts))
    } catch {
      // Local draft persistence is optional; failing storage should not block grading.
    }
  }, [activityDrafts, draftStorageKey, draftsReadyKey])

  function openActivityHub() {
    setEditingActivityId(null)
    setActivityDraft(emptyActivityDraft)
    setDetailView({ type: 'activity-hub' })
  }

  function openActivityCreator(blockId: CompetencyBlockId) {
    setEditingActivityId(null)
    setActivityDraft(newActivityDraft(blockId))
    setActivityCreateReturnView(detailView ?? { type: 'activity-hub' })
    setDetailView({ type: 'activity-create', blockId })
  }

  function openActivityDraft(blockId: CompetencyBlockId, draftId: string) {
    const draft = activityDrafts[blockId]?.find((item) => item.draftId === draftId)
    setEditingActivityId(null)
    setActivityDraft(draft ?? newActivityDraft(blockId))
    setActivityCreateReturnView(detailView ?? { type: 'activity-hub' })
    setDetailView({ type: 'activity-create', blockId })
  }

  function goBackFromActivityCreator() {
    setEditingActivityId(null)
    setActivityDraft(emptyActivityDraft)
    setDetailView(activityCreateReturnView)
    setActivityCreateReturnView(null)
  }

  function discardActivityDraft(blockId: CompetencyBlockId, draftId?: string) {
    setActivityDrafts((current) => {
      const next = { ...current }
      if (draftId) {
        const remaining = (next[blockId] ?? []).filter((item) => item.draftId !== draftId)
        if (remaining.length > 0) {
          next[blockId] = remaining
        } else {
          delete next[blockId]
        }
      } else {
        delete next[blockId]
      }
      persistActivityDrafts(next)
      return next
    })
    if (detailView?.type === 'activity-create' && detailView.blockId === blockId && !editingActivityId && (!draftId || draftId === activityDraft.draftId)) {
      setActivityDraft(newActivityDraft(blockId))
    }
  }

  function persistActivityDrafts(nextDrafts: ActivityDraftsByBlock) {
    if (draftsReadyKey !== draftStorageKey) return
    try {
      window.localStorage.setItem(draftStorageKey, JSON.stringify(nextDrafts))
    } catch {
      // Local draft persistence is optional; failing storage should not block grading.
    }
  }

  function updateActivityDraft(nextDraft: ActivityDraft) {
    setActivityDraft(nextDraft)
    if (detailView?.type !== 'activity-create' || editingActivityId) return
    const blockId = detailView.blockId
    const normalizedDraft = {
      ...nextDraft,
      draftId: nextDraft.draftId ?? createDraftId(),
      competencyBlockId: blockId,
    }
    const draftToStore = isMeaningfulActivityDraft(nextDraft) ? normalizedDraft : nextDraft
    if (draftToStore.draftId !== nextDraft.draftId) {
      setActivityDraft(draftToStore)
    }
    setActivityDrafts((current) => {
      const next = { ...current }
      if (isMeaningfulActivityDraft(nextDraft)) {
        const blockDrafts = next[blockId] ?? []
        const existingIndex = blockDrafts.findIndex((item) => item.draftId === normalizedDraft.draftId)
        next[blockId] = existingIndex >= 0
          ? blockDrafts.map((item, index) => (index === existingIndex ? normalizedDraft : item))
          : [normalizedDraft, ...blockDrafts]
      } else {
        const remaining = (next[blockId] ?? []).filter((item) => item.draftId !== nextDraft.draftId)
        if (remaining.length > 0) {
          next[blockId] = remaining
        } else {
          delete next[blockId]
        }
      }
      persistActivityDrafts(next)
      return next
    })
  }

  async function saveActivityDraft() {
    const maxScore = Number(activityDraft.maxScore)
    if (!activityDraft.name.trim() || Number.isNaN(maxScore) || maxScore <= 0) return
    const activity = {
      name: activityDraft.name.trim(),
      maxScore,
      competencyBlockId: activityDraft.competencyBlockId,
      date: activityDraft.date || undefined,
      description: activityDraft.description.trim() || undefined,
      studentRole: activityDraft.studentRole.trim() || undefined,
      teacherRole: activityDraft.teacherRole.trim() || undefined,
      instrumentType: activityDraft.instrumentType || undefined,
      evaluationTechnique: activityDraft.evaluationTechnique.trim() || undefined,
      planningMoment: activityDraft.planningMoment as GradingActivity['planningMoment'],
      observations: activityDraft.observations.trim() || undefined,
      activityType: activityDraft.activityType,
    }

    if (editingActivityId) {
      await onUpdateActivity({ ...activity, id: editingActivityId })
      setEditingActivityId(null)
    } else {
      await onAddActivity(activity)
      discardActivityDraft(activity.competencyBlockId as CompetencyBlockId, activityDraft.draftId)
    }
    setActivityDraft(emptyActivityDraft)
    setDetailView({ type: 'block', blockId: activity.competencyBlockId as CompetencyBlockId })
  }

  function editActivity(activity: GradingActivity) {
    setEditingActivityId(activity.id)
    setActivityDraft({
      name: activity.name,
      maxScore: String(activity.maxScore),
      competencyBlockId: activity.competencyBlockId,
      date: activity.date ?? '',
      description: activity.description ?? '',
      studentRole: activity.studentRole ?? '',
      teacherRole: activity.teacherRole ?? '',
      instrumentType: activity.instrumentType ?? '',
      evaluationTechnique: activity.evaluationTechnique ?? '',
      planningMoment: activity.planningMoment ?? '',
      observations: activity.observations ?? '',
      activityType: activity.activityType ?? 'individual',
    })
    setActivityCreateReturnView(detailView)
    setDetailView({ type: 'activity-create', blockId: activity.competencyBlockId as CompetencyBlockId })
  }

  async function duplicateActivity(activity: GradingActivity) {
    await onAddActivity({
      ...activity,
      name: `${activity.name} copia`,
    })
  }

  function selectMainView(view: MainView) {
    setMainView(view)
    setDetailView(null)
  }

  function downloadBlockSummary(format: 'csv' | 'doc') {
    const rows = blockSummaries.map((summary) => ({
      block: `Bloque ${summary.index + 1}`,
      competency: blockShortNames[summary.block.id],
      activities: summary.activities.length,
      average: formatGrade(summary.average),
      pending: countPendingScores(summary.activities, records, students),
      status: summary.status,
    }))
    const payload = {
      courseTitle,
      periodName,
      periodAverage: formatGrade(periodAverage),
      students: students.length,
      activities: activities.length,
      pendingBlocks,
      rows,
    }

    if (format === 'csv') {
      downloadTextFile({
        content: blockSummaryCsv(payload),
        filename: blockSummaryFilename(courseTitle, periodShortName, 'csv'),
        type: 'text/csv;charset=utf-8',
      })
      return
    }

    downloadTextFile({
      content: blockSummaryDoc(payload),
      filename: blockSummaryFilename(courseTitle, periodShortName, 'doc'),
      type: 'application/msword;charset=utf-8',
    })
  }

  if (students.length === 0) {
    return (
      <div className="flex min-h-[280px] items-center justify-center rounded-lg border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
        Este curso todavía no tiene estudiantes matriculados.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {!isActivityWorkspace ? (
      <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-2 shadow-sm xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Vistas del panel de evaluaciones">
          <ViewButton active={mainView === 'blocks'} tabId="blocks" icon={<BookOpen className="size-4" />} label="Bloques" onClick={() => selectMainView('blocks')} onKeyDown={(event) => moveTabFocus(event, mainViewTabs, mainView, selectMainView)} />
          <ViewButton active={mainView === 'period'} tabId="period" icon={<ClipboardList className="size-4" />} label="Período" onClick={() => selectMainView('period')} onKeyDown={(event) => moveTabFocus(event, mainViewTabs, mainView, selectMainView)} />
          <ViewButton active={mainView === 'annual'} tabId="annual" icon={<CalendarDays className="size-4" />} label="Matriz anual" onClick={() => selectMainView('annual')} onKeyDown={(event) => moveTabFocus(event, mainViewTabs, mainView, selectMainView)} />
          <ViewButton active={mainView === 'final'} tabId="final" icon={<Trophy className="size-4" />} label="Resumen final" onClick={() => selectMainView('final')} onKeyDown={(event) => moveTabFocus(event, mainViewTabs, mainView, selectMainView)} />
        </div>
        <div className="flex flex-wrap gap-2">
          {mainView === 'blocks' || mainView === 'period' ? (
          <>
          <Button
            variant="outline"
            className="h-9 px-3 text-emerald-700"
            aria-label="Descargar resumen en Excel"
            onClick={() => downloadBlockSummary('csv')}
          >
            <OfficeIcon app="excel" />
            Excel
          </Button>
          <Button
            variant="outline"
            className="h-9 px-3 text-blue-700"
            aria-label="Descargar resumen en Word"
            onClick={() => downloadBlockSummary('doc')}
          >
            <OfficeIcon app="word" />
            Word
          </Button>
          </>
          ) : null}
          <Button variant="outline" className="h-9 px-3" onClick={() => setShowConfig(true)}>
            <Settings className="size-4" />
            Configurar cálculo
          </Button>
          {mainView === 'blocks' || mainView === 'period' ? (
          <Button className="h-9 px-3" onClick={() => {
            if (detailView?.type === 'block') {
              openActivityCreator(detailView.blockId)
              return
            }
            openActivityHub()
          }}>
            <Plus className="size-4" />
            Agregar actividad
          </Button>
          ) : null}
        </div>
      </div>
      ) : null}

      {!detailView && mainView === 'blocks' ? (
        <div className="rounded-lg border border-border bg-card p-3 shadow-sm">
          <div className="grid gap-2 md:grid-cols-5">
            <SummaryMetric icon={<Layers className="size-5" />} label="Bloques de competencias" value="4" helper="activos" tone="success" />
            <SummaryMetric icon={<ClipboardList className="size-5" />} label="Actividades totales" value={activities.length} helper="en el período" tone="default" />
            <SummaryMetric icon={<Users className="size-5" />} label="Estudiantes" value={students.length} helper="matriculados" tone="accent" />
            <SummaryMetric icon={<TrendingUp className="size-5" />} label="Promedio general" value={formatGrade(periodAverage)} helper="actual" tone="warning" />
            <SummaryMetric icon={<Hourglass className="size-5" />} label="Pendientes" value={pendingBlocks} helper="por evaluar" tone="destructive" />
          </div>
        </div>
      ) : null}

      {detailView ? (
        detailView.type === 'block' && selectedBlock ? (
          <BlockGradeView
            blockId={selectedBlock.id}
            activities={activities.filter((activity) => activity.competencyBlockId === selectedBlock.id)}
            config={config}
            courseTitle={courseTitle}
            onBack={() => setDetailView(null)}
            onOpenActivity={(activityId) => setDetailView({ type: 'activity', activityId })}
            onSaveRecovery={onSaveRecovery}
            onSaveScore={onSaveScore}
            records={records}
            recoveryLabel={recoveryLabel}
            recoveryScores={recoveryScores}
            cellSaveStates={cellSaveStates}
            students={students}
          />
        ) : detailView.type === 'activity-hub' ? (
          <ActivitiesHubView
            activities={activities}
            courseTitle={courseTitle}
            drafts={activityDrafts}
            onBack={() => setDetailView(null)}
            onDiscardDraft={discardActivityDraft}
            onOpenActivity={(activityId) => setDetailView({ type: 'activity', activityId })}
            onOpenDraft={openActivityDraft}
            onSelectBlock={openActivityCreator}
            periodName={periodName}
          />
        ) : detailView.type === 'activity-create' && selectedCreateBlock ? (
          <ActivityCreationView
            activityDraft={activityDraft}
            hasDraft={Boolean(activityDraft.draftId && isMeaningfulActivityDraft(activityDraft)) && !editingActivityId}
            activities={activities.filter((activity) => activity.competencyBlockId === selectedCreateBlock.id)}
            block={selectedCreateBlock}
            editingActivityId={editingActivityId}
            onBack={goBackFromActivityCreator}
            onCancelEdit={() => {
              setEditingActivityId(null)
              setActivityDraft({ ...emptyActivityDraft, competencyBlockId: selectedCreateBlock.id })
            }}
            onChangeDraft={updateActivityDraft}
            onDeleteActivity={onDeleteActivity}
            onDuplicateActivity={duplicateActivity}
            onEditActivity={editActivity}
            onOpenActivity={(activityId) => setDetailView({ type: 'activity', activityId })}
            onSaveActivity={saveActivityDraft}
            saving={saving}
            students={students}
          />
        ) : selectedActivity ? (
          <ActivityDetailView
            activity={selectedActivity}
            config={config}
            onBack={() => {
              setDetailView({ type: 'block', blockId: selectedActivity.competencyBlockId as CompetencyBlockId })
            }}
            onEditActivity={editActivity}
            onSaveScore={onSaveScore}
            records={records}
            cellSaveStates={cellSaveStates}
            students={students}
          />
        ) : null
      ) : mainView === 'blocks' ? (
        <BlockMatrixView
          blockSummaries={blockSummaries}
          onOpenBlock={(blockId) => setDetailView({ type: 'block', blockId })}
        />
      ) : mainView === 'period' ? (
        <PeriodSummaryView blockSummaries={blockSummaries} periodName={periodName} recoveryScores={recoveryScores} />
      ) : mainView === 'annual' ? (
        annualError ? (
          <AnnualLoadError message={annualError} onRetry={() => setAnnualRetryKey((value) => value + 1)} />
        ) : (
          <AnnualComparisonView
            config={config}
            getActivitiesForPeriod={getActivitiesForPeriod}
            loading={loadingAnnual}
            recordsByPeriod={recordsByPeriod}
            students={students}
          />
        )
      ) : (
        annualError ? (
          <AnnualLoadError message={annualError} onRetry={() => setAnnualRetryKey((value) => value + 1)} />
        ) : (
          <AnnualResultView
            config={config}
            getActivitiesForPeriod={getActivitiesForPeriod}
            loading={loadingAnnual}
            recordsByPeriod={recordsByPeriod}
            students={students}
          />
        )
      )}

      {showConfig ? (
        <CalculationConfigModal config={config} onChange={setConfig} onClose={() => setShowConfig(false)} />
      ) : null}
    </div>
  )
}

function ViewButton({
  active,
  icon,
  label,
  onClick,
  onKeyDown,
  tabId,
}: {
  active: boolean
  icon: ReactNode
  label: string
  onClick: () => void
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void
  tabId: MainView
}) {
  return (
    <Button
      role="tab"
      data-tab={tabId}
      aria-selected={active}
      tabIndex={active ? 0 : -1}
      variant={active ? 'primary' : 'ghost'}
      className="h-9 px-3"
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      {icon}
      {label}
    </Button>
  )
}

function moveTabFocus<T extends string>(
  event: KeyboardEvent<HTMLButtonElement>,
  tabs: readonly T[],
  current: T,
  onChange: (tab: T) => void,
) {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
  event.preventDefault()
  const currentIndex = tabs.indexOf(current)
  const nextIndex = event.key === 'Home'
    ? 0
    : event.key === 'End'
      ? tabs.length - 1
      : event.key === 'ArrowRight'
        ? (currentIndex + 1) % tabs.length
        : (currentIndex - 1 + tabs.length) % tabs.length
  const next = tabs[nextIndex]
  onChange(next)
  const tablist = event.currentTarget.parentElement
  window.requestAnimationFrame(() => {
    tablist?.querySelector<HTMLButtonElement>(`[role="tab"][data-tab="${next}"]`)?.focus()
  })
}

function CellSaveIndicator({ state }: { state?: GradeCellSaveState }) {
  const label = state === 'saving'
    ? 'Guardando…'
    : state === 'saved'
      ? 'Guardado'
      : state === 'error'
        ? 'Error al guardar'
        : ''
  return (
    <span
      aria-live="polite"
      className={cn(
        'h-3 text-[10px] font-bold leading-3',
        state === 'error' ? 'text-destructive' : state === 'saved' ? 'text-emerald-700' : 'text-muted-foreground',
      )}
    >
      {label}
    </span>
  )
}

function AnnualLoadError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center">
      <p className="font-bold text-destructive">No se pudo cargar la vista anual.</p>
      <p className="max-w-xl text-sm text-muted-foreground">{message}</p>
      <Button variant="outline" onClick={onRetry}>Reintentar</Button>
    </div>
  )
}

function SummaryMetric({
  icon,
  label,
  value,
  helper,
  tone,
}: {
  icon: ReactNode
  label: string
  value: number | string
  helper: string
  tone: 'default' | 'accent' | 'success' | 'warning' | 'destructive'
}) {
  const toneClasses = {
    default: 'bg-blue-50 text-blue-700',
    accent: 'bg-violet-50 text-violet-700',
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    destructive: 'bg-red-50 text-red-700',
  }

  return (
    <div className="flex items-center gap-3 border-border py-1 md:border-r md:last:border-r-0">
      <div className={cn('grid size-11 place-items-center rounded-full', toneClasses[tone])}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-xl font-black leading-none text-primary">{value}</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">{helper}</p>
      </div>
    </div>
  )
}

function BlockMetric({
  icon,
  label,
  value,
  helper,
  tone,
}: {
  icon: ReactNode
  label: string
  value: number | string
  helper: string
  tone: 'default' | 'accent' | 'success' | 'warning'
}) {
  const toneClasses = {
    default: 'bg-blue-50 text-blue-700',
    accent: 'bg-violet-50 text-violet-700',
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
  }

  return (
    <article className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className={cn('grid size-14 place-items-center rounded-full', toneClasses[tone])}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-black leading-none text-primary">{value}</p>
        {helper ? <p className="mt-1 text-xs text-muted-foreground">{helper}</p> : null}
      </div>
    </article>
  )
}

function BlockMatrixView({
  blockSummaries,
  onOpenBlock,
}: {
  blockSummaries: Array<{
    block: (typeof competencyBlocks)[number]
    index: number
    activities: GradingActivity[]
    expected: number
    maxScore: number
    average: number | null
    status: string
  }>
  onOpenBlock: (blockId: CompetencyBlockId) => void
}) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-2xl font-bold leading-tight text-primary">Bloques de competencias</h2>
      </div>
      <div className="grid gap-3 xl:grid-cols-4">
        {blockSummaries.map((summary) => {
          const accent = blockAccents[summary.index]
          return (
            <article key={summary.block.id} className={cn('overflow-hidden rounded-lg border bg-card shadow-sm', accent.card)}>
              <div className={cn('h-1.5', accent.dot)} />
              <div className="p-4">
                <Badge tone="default" className="h-6 rounded-lg px-2 text-[11px] uppercase">
                  Bloque {summary.index + 1}
                </Badge>
                <h3 className="mt-2 min-h-12 text-[0.82rem] font-black leading-4 text-primary">
                  {blockShortNames[summary.block.id]}
                </h3>
                <div className="mt-2 flex items-end gap-3">
                  <div className={cn('grid size-16 place-items-center rounded-full border-4 bg-card text-xl font-black text-primary', accent.panel)}>
                    {formatGrade(summary.average)}
                  </div>
                  <p className="pb-2 text-sm font-bold text-muted-foreground">/ {summary.expected}</p>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {formatGrade(summary.average)} puntos obtenidos de {summary.expected}
                </p>
                <div className="mt-3 border-t border-border pt-3">
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="font-medium text-muted-foreground">{summary.activities.length} actividades</span>
                    <Badge tone={statusTone(summary.status)}>{summary.status}</Badge>
                  </div>
                  <Button variant="outline" className="mt-3 h-10 w-full justify-between" onClick={() => onOpenBlock(summary.block.id)}>
                    Ver bloque
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
      <div className="rounded-lg border border-primary/15 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
        Las calificaciones reflejan el progreso actual del período. Los promedios finales se calculan al completar los cuatro períodos del año escolar.
      </div>
    </section>
  )

}

function BlockGradeView({
  blockId,
  activities,
  config,
  courseTitle,
  onBack,
  onOpenActivity,
  onSaveRecovery,
  onSaveScore,
  records,
  recoveryLabel,
  recoveryScores,
  cellSaveStates,
  students,
}: {
  blockId: CompetencyBlockId
  activities: GradingActivity[]
  config: GradeCalculationConfig
  courseTitle: string
  onBack: () => void
  onOpenActivity: (activityId: string) => void
  onSaveRecovery: (enrollmentId: string, blockId: string, value: string) => Promise<void>
  onSaveScore: (enrollmentId: string, activity: GradingActivity, value: string) => Promise<void>
  records: GradeRecordRow[]
  recoveryLabel: string
  recoveryScores: RecoveryScores
  cellSaveStates: Record<string, GradeCellSaveState>
  students: StudentGradeRow[]
}) {
  const blockTabs = ['matrix', 'activities', 'students', 'stats'] as const
  type BlockTab = (typeof blockTabs)[number]
  const [blockTab, setBlockTab] = useState<BlockTab>('matrix')
  const block = competencyBlocks.find((item) => item.id === blockId) ?? competencyBlocks[0]
  const blockIndex = competencyBlocks.findIndex((item) => item.id === blockId)
  const studentTotals = students.map((student) => {
    const total = blockTotal({ records, activities, enrollmentId: student.enrollmentId, blockId, config })
    const recovery = recoveryScores[blockId]?.[student.enrollmentId] ?? null
    return effectivePeriodScore(total, recovery, config)
  })
  const average = averageNumbers(studentTotals.filter((value) => value > 0))
  const pendingActivities = activities.filter((activity) =>
    students.some((student) => !scoreForActivity(records, student.enrollmentId, activity.id)),
  ).length
  const blockState = activities.length === 0
    ? 'Sin actividades'
    : pendingActivities > 0
      ? 'Pendiente'
      : average !== null && average >= config.passingScore
        ? 'Completado'
        : 'En recuperación'

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <button className="text-primary hover:underline" onClick={onBack}>Calificaciones</button>
        <span>&gt;</span>
        <span>{courseTitle}</span>
        <span>&gt;</span>
        <span>Bloque {blockIndex + 1}</span>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge tone="default" className="h-8 rounded-lg uppercase">Bloque {blockIndex + 1}</Badge>
          <h2 className="mt-3 text-3xl font-black leading-tight text-primary">{blockShortNames[block.id]}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{block.name}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="size-4" />
            Volver
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            <Download className="size-4" />
            Descargar
          </Button>
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-5">
        <BlockMetric icon={<Layers className="size-5" />} label="Total obtenido" value={formatGrade(average)} helper={`/ ${config.expectedBlockTotal} puntos`} tone="default" />
        <BlockMetric icon={<Target className="size-5" />} label="Promedio del bloque" value={formatGrade(average)} helper="puntos" tone="success" />
        <BlockMetric icon={<ClipboardList className="size-5" />} label="Actividades" value={activities.length} helper="actividades" tone="accent" />
        <BlockMetric icon={<Hourglass className="size-5" />} label="Pendientes" value={pendingActivities} helper="actividades" tone="warning" />
        <BlockMetric icon={<CheckCircle2 className="size-5" />} label="Estado" value={blockState} helper="" tone="success" />
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border text-sm font-bold text-muted-foreground" role="tablist" aria-label={`Vistas de ${block.shortName}`}>
        {blockTabs.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            data-tab={item}
            aria-selected={blockTab === item}
            tabIndex={blockTab === item ? 0 : -1}
            className={cn(
              'border-b-2 px-3 py-3 transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              blockTab === item ? 'border-primary text-primary' : 'border-transparent',
            )}
            onClick={() => setBlockTab(item)}
            onKeyDown={(event) => moveTabFocus(event, blockTabs, blockTab, setBlockTab)}
          >
            {item === 'matrix' ? 'Matriz de calificaciones' : item === 'activities' ? 'Actividades' : item === 'students' ? 'Estudiantes' : 'Estadísticas del bloque'}
          </button>
        ))}
      </div>

      {blockTab === 'matrix' ? (
      <div role="tabpanel" className="space-y-4">
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-max border-separate border-spacing-0 text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="sticky left-0 top-0 z-40 w-14 border-b border-r border-border bg-muted px-3 py-4 text-center text-xs font-bold uppercase text-muted-foreground">#</th>
                <th className="sticky left-14 top-0 z-40 min-w-[14rem] border-b border-r border-border bg-muted px-4 py-4 text-left text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Estudiante</th>
                {activities.map((activity, index) => (
                  <th key={activity.id} className="min-w-[13rem] border-b border-r border-border px-4 py-4 text-center">
                    <button className="font-bold text-primary hover:underline" onClick={() => onOpenActivity(activity.id)}>
                      {index + 1}. {activity.name}
                    </button>
                    <p className="mt-1 text-xs font-bold text-primary">{activity.maxScore} pts</p>
                  </th>
                ))}
                <th className="w-28 border-b border-r border-border px-4 py-4 text-center text-xs font-bold uppercase text-primary">Total /100</th>
                <th className="w-28 border-b border-r border-border px-4 py-4 text-center text-xs font-bold uppercase text-muted-foreground">Estado</th>
                {config.showRecovery ? (
                  <th className="w-28 border-b border-border px-4 py-4 text-center text-xs font-bold uppercase text-muted-foreground">{recoveryLabel || 'RP'}</th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => {
                const total = blockTotal({ records, activities, enrollmentId: student.enrollmentId, blockId, config })
                const recovery = recoveryScores[blockId]?.[student.enrollmentId] ?? null
                const effectiveTotal = effectivePeriodScore(total, recovery, config)
                const status = activities.length === 0 ? 'Sin calificación' : effectiveTotal >= config.passingScore ? 'Aprobado' : 'En recuperación'
                return (
                  <tr key={student.enrollmentId} className="group hover:bg-muted/20">
                    <td className="sticky left-0 z-20 border-b border-r border-border bg-card px-3 py-3 text-center text-muted-foreground group-hover:bg-muted/20">
                      {student.listNumber ?? index + 1}
                    </td>
                    <td className="sticky left-14 z-20 border-b border-r border-border bg-card px-4 py-3 font-bold text-foreground group-hover:bg-muted/20">
                      {student.lastName}, {student.firstName}
                    </td>
                    {activities.map((activity) => {
                      const record = scoreForActivity(records, student.enrollmentId, activity.id)
                      const saveState = cellSaveStates[activityGradeCellKey(student.enrollmentId, activity.id)]
                      return (
                        <td key={activity.id} className="border-b border-r border-border px-4 py-2 text-center">
                          <div className="inline-flex items-center gap-2">
                            <div className="flex flex-col items-center gap-0.5">
                            <Input
                              key={`${record?.id ?? 'empty'}:${record?.score ?? ''}`}
                              type="number"
                              min={0}
                              max={activity.maxScore}
                              step="0.01"
                              defaultValue={record?.score ?? ''}
                              disabled={saveState === 'saving'}
                              aria-label={`${activity.name} de ${student.firstName} ${student.lastName}`}
                              className="grade-cell h-9 w-24 rounded-md border-border/80 bg-card px-2 text-center font-bold"
                              onKeyDown={focusNextGradeCell}
                              onBlur={(event) => void onSaveScore(student.enrollmentId, activity, event.target.value)}
                            />
                            <CellSaveIndicator state={saveState} />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground">/ {activity.maxScore}</span>
                          </div>
                        </td>
                      )
                    })}
                    <td className="border-b border-r border-border px-4 py-3 text-center text-lg font-black text-primary">{formatGrade(effectiveTotal)}</td>
                    <td className="border-b border-r border-border px-4 py-3 text-center"><Badge tone={statusTone(status)}>{status}</Badge></td>
                    {config.showRecovery ? (
                      <td className="border-b border-border px-4 py-2 text-center">
                        <div className="flex flex-col items-center gap-0.5">
                        <Input
                          key={`${student.enrollmentId}:${recovery ?? ''}`}
                          type="number"
                          min={0}
                          max={100}
                          step="0.01"
                          defaultValue={recovery ?? ''}
                          disabled={cellSaveStates[recoveryGradeCellKey(student.enrollmentId, blockId)] === 'saving'}
                          aria-label={`${recoveryLabel || 'Recuperación'} de ${student.firstName} ${student.lastName}`}
                          placeholder={recoveryLabel || 'RP'}
                          className="grade-cell h-9 w-24 rounded-md border-border/80 bg-card px-2 text-center font-bold"
                          onKeyDown={focusNextGradeCell}
                          onBlur={(event) => void onSaveRecovery(student.enrollmentId, blockId, event.target.value)}
                        />
                        <CellSaveIndicator state={cellSaveStates[recoveryGradeCellKey(student.enrollmentId, blockId)]} />
                        </div>
                      </td>
                    ) : null}
                  </tr>
                )
              })}
              <tr className="bg-muted/35">
                <td colSpan={2} className="sticky left-0 z-20 border-r border-border bg-muted px-4 py-4 text-xs font-black uppercase tracking-[0.12em] text-primary">
                  Promedio por actividad
                </td>
                {activities.map((activity) => {
                  const average = averageActivityScore(records, students, activity)
                  return (
                    <td key={activity.id} className="border-r border-border px-4 py-4 text-center">
                      <p className="text-lg font-black text-primary">{formatGrade(average)} / {activity.maxScore}</p>
                      <p className="text-xs text-muted-foreground">{formatGrade(average === null ? null : (average / activity.maxScore) * 100)}%</p>
                    </td>
                  )
                })}
                <td className="border-r border-border px-4 py-4 text-center font-black text-primary">{formatGrade(average)} / 100</td>
                <td className="border-r border-border px-4 py-4 text-center"><Badge tone={statusTone(blockState)}>{blockState}</Badge></td>
                {config.showRecovery ? <td className="px-4 py-4" /> : null}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-lg border border-primary/15 bg-primary/5 px-4 py-3 text-sm font-medium text-primary">
        La calificación del bloque se obtiene sumando los puntos de cada actividad. Total esperado: {config.expectedBlockTotal} puntos.
      </div>
      </div>
      ) : (
        <BlockSecondaryPanel
          activeTab={blockTab}
          activities={activities}
          blockId={blockId}
          config={config}
          onOpenActivity={onOpenActivity}
          records={records}
          recoveryScores={recoveryScores}
          students={students}
        />
      )}
    </div>
  )

}

function BlockSecondaryPanel({
  activeTab,
  activities,
  blockId,
  config,
  onOpenActivity,
  records,
  recoveryScores,
  students,
}: {
  activeTab: 'activities' | 'students' | 'stats'
  activities: GradingActivity[]
  blockId: CompetencyBlockId
  config: GradeCalculationConfig
  onOpenActivity: (activityId: string) => void
  records: GradeRecordRow[]
  recoveryScores: RecoveryScores
  students: StudentGradeRow[]
}) {
  const rows = students.map((student) => {
    const ordinary = blockTotal({ records, activities, enrollmentId: student.enrollmentId, blockId, config })
    const recovery = recoveryScores[blockId]?.[student.enrollmentId] ?? null
    const effective = effectivePeriodScore(ordinary, recovery, config)
    return { student, ordinary, recovery, effective }
  })

  if (activeTab === 'activities') {
    return (
      <section role="tabpanel" aria-label="Actividades del bloque" className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-4">
          <h3 className="font-black text-primary">Actividades del bloque</h3>
          <p className="mt-1 text-sm text-muted-foreground">Seguimiento de cobertura y calificaciones pendientes.</p>
        </div>
        {activities.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-muted-foreground">Este bloque todavía no tiene actividades.</p>
        ) : (
          <div className="divide-y divide-border">
            {activities.map((activity, index) => {
              const graded = students.filter((student) => scoreForActivity(records, student.enrollmentId, activity.id)).length
              const average = averageActivityScore(records, students, activity)
              return (
                <button
                  key={activity.id}
                  type="button"
                  className="grid w-full gap-3 px-5 py-4 text-left transition hover:bg-muted/25 sm:grid-cols-[minmax(0,1fr)_8rem_8rem_auto] sm:items-center"
                  onClick={() => onOpenActivity(activity.id)}
                >
                  <span>
                    <span className="block font-bold text-primary">{index + 1}. {activity.name}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">{activity.instrumentType || 'Sin instrumento'} · {activity.maxScore} puntos</span>
                  </span>
                  <span className="text-sm"><strong>{graded}</strong> / {students.length} evaluados</span>
                  <span className="text-sm font-bold text-primary">Prom. {formatGrade(average)}</span>
                  <ArrowRight className="size-4 text-primary" />
                </button>
              )
            })}
          </div>
        )}
      </section>
    )
  }

  if (activeTab === 'students') {
    return (
      <section role="tabpanel" aria-label="Estudiantes del bloque" className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-4">
          <h3 className="font-black text-primary">Estudiantes del bloque</h3>
          <p className="mt-1 text-sm text-muted-foreground">Resultado ordinario, recuperación y calificación efectiva.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/40 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Estudiante</th>
                <th className="px-4 py-3 text-center">Ordinaria</th>
                <th className="px-4 py-3 text-center">Recuperación</th>
                <th className="px-4 py-3 text-center">Efectiva</th>
                <th className="px-4 py-3 text-center">Estado</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ student, ordinary, recovery, effective }) => {
                const state = activities.length === 0 ? 'Sin calificación' : effective >= config.passingScore ? 'Aprobado' : 'En recuperación'
                return (
                  <tr key={student.enrollmentId} className="border-t border-border">
                    <td className="px-4 py-3 font-medium">{student.lastName}, {student.firstName}</td>
                    <td className="px-4 py-3 text-center font-bold">{formatGrade(ordinary)}</td>
                    <td className="px-4 py-3 text-center">{formatGrade(recovery)}</td>
                    <td className="px-4 py-3 text-center font-black text-primary">{formatGrade(effective)}</td>
                    <td className="px-4 py-3 text-center"><Badge tone={statusTone(state)}>{state}</Badge></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    )
  }

  const gradedScores = rows.map((row) => row.effective).filter((score) => score > 0)
  const approved = gradedScores.filter((score) => score >= config.passingScore).length
  const average = averageNumbers(gradedScores)
  const ranges = [
    { label: '90–100', count: gradedScores.filter((score) => score >= 90).length },
    { label: '80–89', count: gradedScores.filter((score) => score >= 80 && score < 90).length },
    { label: '70–79', count: gradedScores.filter((score) => score >= 70 && score < 80).length },
    { label: 'Menos de 70', count: gradedScores.filter((score) => score < 70).length },
  ]

  return (
    <section role="tabpanel" aria-label="Estadísticas del bloque" className="space-y-4">
      <div>
        <h3 className="font-black text-primary">Estadísticas del bloque</h3>
        <p className="mt-1 text-sm text-muted-foreground">Distribución calculada con la nota efectiva de cada estudiante.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Promedio" value={formatGrade(average)} />
        <StatCard label="Nota más alta" value={formatGrade(gradedScores.length ? Math.max(...gradedScores) : null)} />
        <StatCard label="Nota más baja" value={formatGrade(gradedScores.length ? Math.min(...gradedScores) : null)} />
        <StatCard label="Aprobación" value={gradedScores.length ? `${Math.round((approved / gradedScores.length) * 100)}%` : '—'} />
      </div>
      <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Distribución de resultados</p>
        <div className="mt-4 space-y-3">
          {ranges.map((range) => {
            const percentage = gradedScores.length ? (range.count / gradedScores.length) * 100 : 0
            return (
              <div key={range.label} className="grid grid-cols-[7rem_minmax(0,1fr)_3rem] items-center gap-3 text-sm">
                <span className="font-medium">{range.label}</span>
                <span className="h-2 overflow-hidden rounded-full bg-muted"><span className="block h-full rounded-full bg-primary" style={{ width: `${percentage}%` }} /></span>
                <span className="text-right font-bold text-primary">{range.count}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-black text-primary">{value}</p>
    </article>
  )
}

function ActivityDetailView({
  activity,
  config,
  onBack,
  onEditActivity,
  onSaveScore,
  records,
  cellSaveStates,
  students,
}: {
  activity: GradingActivity
  config: GradeCalculationConfig
  onBack: () => void
  onEditActivity: (activity: GradingActivity) => void
  onSaveScore: (enrollmentId: string, activity: GradingActivity, value: string) => Promise<void>
  records: GradeRecordRow[]
  cellSaveStates: Record<string, GradeCellSaveState>
  students: StudentGradeRow[]
}) {
  const block = competencyBlocks.find((item) => item.id === activity.competencyBlockId) ?? competencyBlocks[0]
  const [tab, setTab] = useState<'info' | 'grades' | 'notes'>('info')
  const average = averageActivityScore(records, students, activity)

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
        <button className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline" onClick={onBack}>
          <ArrowLeft className="size-4" />
          Volver al bloque
        </button>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
          {blockShortNames[block.id]} &gt; Actividad
        </p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary">{activity.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{plainActivityText(activity.description) || 'Actividad sin descripción registrada.'}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => onEditActivity(activity)}>
              Editar actividad
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Secciones de la actividad">
        {(['info', 'grades', 'notes'] as const).map((item) => (
          <Button
            key={item}
            role="tab"
            data-tab={item}
            aria-selected={tab === item}
            tabIndex={tab === item ? 0 : -1}
            variant={tab === item ? 'primary' : 'outline'}
            onClick={() => setTab(item)}
            onKeyDown={(event) => moveTabFocus(event, ['info', 'grades', 'notes'] as const, tab, setTab)}
          >
            {item === 'info' ? 'Información' : item === 'grades' ? 'Calificaciones' : 'Evidencias / Observaciones'}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Información de actividad</p>
          <dl className="mt-4 grid gap-4 text-sm">
            <InfoItem label="Competencia" value={block.name} />
            <InfoItem label="Valor" value={`${activity.maxScore} puntos`} />
            <InfoItem label="Promedio" value={`${formatGrade(average)} / ${activity.maxScore}`} />
            <InfoItem label="Fecha" value={activity.date || 'Sin fecha'} />
            <InfoItem label="Momento de planificación" value={activity.planningMoment || 'Sin momento'} />
            <InfoItem label="Instrumento" value={activity.instrumentType || 'Sin instrumento'} />
            <InfoItem label="Técnica de evaluación" value={activity.evaluationTechnique || 'Sin técnica'} />
            <InfoItem label="Rol del estudiante" value={activity.studentRole || 'Sin rol registrado'} />
            <InfoItem label="Rol del docente" value={activity.teacherRole || 'Sin rol registrado'} />
          </dl>
        </section>

        <section role="tabpanel" className="rounded-lg border border-border bg-card shadow-sm">
          {tab === 'info' ? (
            <div className="p-5 text-sm leading-7 text-muted-foreground">
              <p>{plainActivityText(activity.description) || 'No hay descripción detallada para esta actividad.'}</p>
              <p className="mt-4 font-medium text-foreground">Observaciones</p>
              <p>{activity.observations || 'Sin observaciones registradas.'}</p>
            </div>
          ) : tab === 'grades' ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Estudiante</th>
                    <th className="w-32 px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Puntuación</th>
                    <th className="w-32 px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">%</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => {
                    const record = scoreForActivity(records, student.enrollmentId, activity.id)
                    const percentage = record ? (record.score / activity.maxScore) * config.expectedBlockTotal : null
                    const saveState = cellSaveStates[activityGradeCellKey(student.enrollmentId, activity.id)]
                    return (
                      <tr key={student.enrollmentId} className="border-t border-border">
                        <td className="px-4 py-3 font-medium">{student.lastName}, {student.firstName}</td>
                        <td className="px-4 py-2 text-center">
                          <div className="flex flex-col items-center gap-0.5">
                          <Input
                            key={`${record?.id ?? 'empty'}:${record?.score ?? ''}`}
                            type="number"
                            min={0}
                            max={activity.maxScore}
                            step="0.01"
                            defaultValue={record?.score ?? ''}
                            disabled={saveState === 'saving'}
                            aria-label={`${activity.name} de ${student.firstName} ${student.lastName}`}
                            className="grade-cell h-9 w-24 text-center font-bold"
                            onKeyDown={focusNextGradeCell}
                            onBlur={(event) => void onSaveScore(student.enrollmentId, activity, event.target.value)}
                          />
                          <CellSaveIndicator state={saveState} />
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center font-bold text-primary">{formatGrade(percentage)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-5 text-sm leading-7 text-muted-foreground">
              <p className="font-medium text-foreground">Vínculos futuros</p>
              <p>Planificación: {activity.futurePlanningLink || activity.planningId || 'Pendiente de vincular'}</p>
              <p>Instrumento: {activity.futureInstrumentLink || 'Pendiente de vincular'}</p>
              <p className="mt-4 font-medium text-foreground">Observaciones</p>
              <p>{activity.observations || 'Sin observaciones.'}</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function PeriodSummaryView({
  blockSummaries,
  periodName,
  recoveryScores,
}: {
  blockSummaries: Array<{
    block: (typeof competencyBlocks)[number]
    index: number
    average: number | null
    status: string
  }>
  periodName: string
  recoveryScores: RecoveryScores
}) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Resumen del período</p>
        <h2 className="mt-1 text-2xl font-bold text-primary">{periodName}</h2>
      </div>
      <div className="grid gap-4 xl:grid-cols-4">
        {blockSummaries.map((summary) => {
          const hasRecovery = Object.values(recoveryScores[summary.block.id] ?? {}).some((value) => typeof value === 'number')
          return (
            <article key={summary.block.id} className={cn('rounded-lg border p-5 shadow-sm', blockAccents[summary.index].card)}>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                {summary.block.shortName}
              </p>
              <h3 className="mt-2 min-h-12 text-base font-bold text-primary">{blockShortNames[summary.block.id]}</h3>
              <p className="mt-4 text-4xl font-black text-primary">{formatGrade(summary.average)}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone={statusTone(summary.status)}>{summary.status}</Badge>
                {hasRecovery ? <Badge tone="warning">RP · Nota de recuperación</Badge> : null}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function AnnualComparisonView({
  config,
  getActivitiesForPeriod,
  loading,
  recordsByPeriod,
  students,
}: {
  config: GradeCalculationConfig
  getActivitiesForPeriod: (periodId: CompetencyPeriodId) => GradingActivity[]
  loading: boolean
  recordsByPeriod: Map<CompetencyPeriodId, GradeRecordRow[]>
  students: StudentGradeRow[]
}) {
  if (loading) {
    return <div className="flex min-h-[220px] items-center justify-center text-sm font-medium text-muted-foreground">Calculando vista anual...</div>
  }
  const periods = competencyPeriods.filter((period) => period.id !== 'final')

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Matriz anual por períodos</p>
          <h2 className="mt-1 text-2xl font-black text-primary">Registro anual de competencias</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            P1, P2, P3 y P4 conservan la nota ordinaria. RP sustituye esa nota solo para el cálculo final.
          </p>
        </div>
        <Button variant="outline" onClick={() => window.print()}>
          <Download className="size-4" />
          Descargar
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="max-h-[70vh] overflow-auto">
          <table className="min-w-[1900px] border-separate border-spacing-0 text-xs">
            <thead>
              <tr>
                <th rowSpan={2} className="sticky left-0 top-0 z-50 w-12 border-b border-r border-border bg-muted px-2 py-3 text-center font-black uppercase text-muted-foreground">#</th>
                <th rowSpan={2} className="sticky left-12 top-0 z-50 min-w-[14rem] border-b border-r border-border bg-muted px-3 py-3 text-left font-black uppercase text-muted-foreground">Estudiantes</th>
                {competencyBlocks.map((block, index) => (
                  <th key={block.id} colSpan={8} className={cn('sticky top-0 z-40 border-b border-r border-border px-3 py-3 text-center font-black', blockAccents[index].panel)}>
                    {block.shortName}: {blockShortNames[block.id]}
                  </th>
                ))}
                <th colSpan={4} className="sticky top-0 z-40 border-b border-r border-border bg-muted px-3 py-3 text-center font-black uppercase text-primary">Promedios de competencias específicas</th>
                <th rowSpan={2} className="sticky top-0 z-40 w-24 border-b border-r border-border bg-muted px-3 py-3 text-center font-black uppercase text-primary">Calificación final</th>
                <th rowSpan={2} className="sticky top-0 z-40 w-28 border-b border-border bg-muted px-3 py-3 text-center font-black uppercase text-muted-foreground">Estado</th>
              </tr>
              <tr>
                {competencyBlocks.flatMap((block) =>
                  periods.flatMap((period) => [
                    <th key={`${block.id}-${period.id}`} className="sticky top-[2.6rem] z-30 border-b border-r border-border bg-card px-2 py-2 text-center font-bold text-primary">{period.shortName}</th>,
                    <th key={`${block.id}-${period.id}-rp`} className="sticky top-[2.6rem] z-30 border-b border-r border-border bg-card px-2 py-2 text-center font-bold text-muted-foreground">{period.recoveryLabel}</th>,
                  ]),
                )}
                {competencyBlocks.map((block) => (
                  <th key={`${block.id}-pc`} className="sticky top-[2.6rem] z-30 border-b border-r border-border bg-card px-2 py-2 text-center font-black text-primary">{block.shortName}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => {
                const blockAverages = competencyBlocks.map((block) => {
                  const scores = periods.map((period) => getStudentPeriodBlockScore({
                    blockId: block.id,
                    config,
                    getActivitiesForPeriod,
                    periodId: period.id as CompetencyPeriodId,
                    recordsByPeriod,
                    student,
                  }).effective)
                  return finalBlockAverage(scores, config)
                })
                const final = finalSubjectScore(blockAverages, config)
                const state = final === null ? 'Pendiente' : final >= config.passingScore ? 'Aprobado' : 'En recuperación'
                return (
                  <tr key={student.enrollmentId} className="group hover:bg-muted/20">
                    <td className="sticky left-0 z-20 border-b border-r border-border bg-card px-2 py-3 text-center text-muted-foreground group-hover:bg-muted/20">{student.listNumber ?? index + 1}</td>
                    <td className="sticky left-12 z-20 border-b border-r border-border bg-card px-3 py-3 font-bold text-foreground group-hover:bg-muted/20">
                      {student.lastName}, {student.firstName}
                    </td>
                    {competencyBlocks.flatMap((block) =>
                      periods.flatMap((period) => {
                        const result = getStudentPeriodBlockScore({
                          blockId: block.id,
                          config,
                          getActivitiesForPeriod,
                          periodId: period.id as CompetencyPeriodId,
                          recordsByPeriod,
                          student,
                        })
                        return [
                          <td key={`${student.enrollmentId}-${block.id}-${period.id}`} className={cn('border-b border-r border-border px-2 py-3 text-center font-bold', gradeColor(result.period, config))}>
                            {formatGrade(result.period)}
                          </td>,
                          <td key={`${student.enrollmentId}-${block.id}-${period.id}-rp`} className={cn('border-b border-r border-border px-2 py-3 text-center font-bold', result.recovery !== null ? 'bg-emerald-50 text-emerald-700' : 'text-muted-foreground')}>
                            {formatGrade(result.recovery)}
                          </td>,
                        ]
                      }),
                    )}
                    {blockAverages.map((value, blockIndex) => (
                      <td key={`${student.enrollmentId}-${competencyBlocks[blockIndex].id}-pc`} className="border-b border-r border-border px-2 py-3 text-center font-black text-primary">
                        {formatGrade(value)}
                      </td>
                    ))}
                    <td className={cn('border-b border-r border-border px-3 py-3 text-center text-lg font-black', gradeColor(final, config))}>{formatGrade(final)}</td>
                    <td className="border-b border-border px-3 py-3 text-center"><Badge tone={statusTone(state)}>{state}</Badge></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-lg border border-primary/15 bg-primary/5 px-4 py-3 text-sm font-medium text-primary">
        La calificación final se obtiene promediando los promedios de las 4 competencias específicas. La recuperación sustituye la calificación del período correspondiente.
      </div>
    </section>
  )
}

function AnnualResultView(props: {
  config: GradeCalculationConfig
  getActivitiesForPeriod: (periodId: CompetencyPeriodId) => GradingActivity[]
  loading: boolean
  recordsByPeriod: Map<CompetencyPeriodId, GradeRecordRow[]>
  students: StudentGradeRow[]
}) {
  if (props.loading) {
    return <div className="flex min-h-[220px] items-center justify-center text-sm font-medium text-muted-foreground">Calculando resultado anual...</div>
  }

  const blockAverages = competencyBlocks.map((block) => {
    const periodScores = competencyPeriods
      .filter((period) => period.id !== 'final')
      .map((period) => averageBlockForPeriod({
        blockId: block.id,
        config: props.config,
        periodId: period.id as CompetencyPeriodId,
        recordsByPeriod: props.recordsByPeriod,
        getActivitiesForPeriod: props.getActivitiesForPeriod,
        students: props.students,
      }))
    return finalBlockAverage(periodScores, props.config)
  })
  const values = blockAverages.filter((value): value is number => value !== null)
  const generalAverage = values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : null
  const final = finalSubjectScore(blockAverages, props.config)
  const state = final === null ? 'Pendiente' : final >= props.config.passingScore ? 'Aprobado' : final >= 60 ? 'En recuperación' : 'Reprobado'

  return (
    <section className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-4">
        {competencyBlocks.map((block, index) => (
          <article key={block.id} className={cn('rounded-lg border p-5 shadow-sm', blockAccents[index].card)}>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">{block.shortName}</p>
            <h3 className="mt-2 text-sm font-bold text-primary">{blockShortNames[block.id]}</h3>
            <p className="mt-4 text-3xl font-black text-primary">{formatGrade(blockAverages[index])}</p>
          </article>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Resultado anual</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <ResultMetric label="Promedio general" value={`${formatGrade(generalAverage)} / 100`} />
          <ResultMetric label="Calificación final" value={`${formatGrade(final)} / 100`} />
          <div className="rounded-lg border border-border bg-muted/25 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Estado</p>
            <Badge tone={state === 'Aprobado' ? 'success' : state === 'Pendiente' ? 'muted' : 'warning'} className="mt-3">
              {state}
            </Badge>
          </div>
        </div>
      </div>
    </section>
  )
}

function ActivityManager({
  activityDraft,
  activities,
  editingActivityId,
  onCancelEdit,
  onChangeDraft,
  onDeleteActivity,
  onDuplicateActivity,
  onEditActivity,
  onSaveActivity,
  saving,
  showCompetencySelect = true,
}: {
  activityDraft: ActivityDraft
  activities: GradingActivity[]
  editingActivityId: string | null
  onCancelEdit: () => void
  onChangeDraft: (draft: ActivityDraft) => void
  onDeleteActivity: (activityId: string) => Promise<void>
  onDuplicateActivity: (activity: GradingActivity) => Promise<void>
  onEditActivity: (activity: GradingActivity) => void
  onSaveActivity: () => Promise<void>
  saving: boolean
  showCompetencySelect?: boolean
}) {
  const [descriptionExpanded, setDescriptionExpanded] = useState(false)
  const [descriptionEditing, setDescriptionEditing] = useState(false)
  const hasLongDescription = activityDraft.description.length > 160

  return (
    <div className="grid gap-2.5">
      {showCompetencySelect ? (
        <Select value={activityDraft.competencyBlockId} onChange={(event) => onChangeDraft({ ...activityDraft, competencyBlockId: event.target.value })}>
          {competencyBlocks.map((block) => (
            <option key={block.id} value={block.id}>{block.shortName} · {block.name}</option>
          ))}
        </Select>
      ) : null}
      <div className="grid gap-2.5 sm:grid-cols-[minmax(0,1fr)_7rem]">
        <label className="space-y-1 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
          Nombre de la actividad
          <Input className="h-10" value={activityDraft.name} onChange={(event) => onChangeDraft({ ...activityDraft, name: event.target.value })} placeholder="Ej. Exposición oral sobre ecosistemas" />
        </label>
        <label className="space-y-1 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
          Valor
          <Input className="h-10" type="number" min={1} value={activityDraft.maxScore} onChange={(event) => onChangeDraft({ ...activityDraft, maxScore: event.target.value })} placeholder="20" />
        </label>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-3">
        <label className="space-y-1 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
          Fecha de realización
          <Input className="h-10" type="date" value={activityDraft.date} onChange={(event) => onChangeDraft({ ...activityDraft, date: event.target.value })} />
        </label>
        <label className="space-y-1 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
          Técnica de evaluación
          <Select className="h-10" value={activityDraft.evaluationTechnique} onChange={(event) => onChangeDraft({ ...activityDraft, evaluationTechnique: event.target.value })}>
            <option value="" disabled>Ej. Observación directa</option>
            <option value="observacion-directa">Observación directa</option>
            <option value="observacion-sistematica">Observación sistemática</option>
            <option value="preguntas-orales">Preguntas orales</option>
            <option value="dialogo-reflexivo">Diálogo reflexivo</option>
            <option value="debate">Debate</option>
            <option value="exposicion">Exposición</option>
            <option value="presentacion">Presentación</option>
            <option value="entrevista">Entrevista</option>
            <option value="mesa-redonda">Mesa redonda</option>
            <option value="dramatizacion">Dramatización</option>
            <option value="analisis-producciones">Análisis de producciones</option>
            <option value="portafolio">Portafolio</option>
            <option value="diario-reflexivo">Diario reflexivo</option>
            <option value="estudio-caso">Estudio de caso</option>
            <option value="proyecto">Proyecto</option>
            <option value="resolucion-problemas">Resolución de problemas</option>
            <option value="mapa-conceptual">Mapa conceptual</option>
            <option value="ensayo">Ensayo</option>
            <option value="prueba-escrita">Prueba escrita</option>
            <option value="autoevaluacion">Autoevaluación</option>
            <option value="coevaluacion">Coevaluación</option>
            <option value="heteroevaluacion">Heteroevaluación</option>
          </Select>
        </label>
        <label className="space-y-1 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
          Instrumento de evaluación
          <Select className="h-10" value={activityDraft.instrumentType} onChange={(event) => onChangeDraft({ ...activityDraft, instrumentType: event.target.value })}>
            <option value="" disabled>Ej. Rúbrica</option>
            <option value="rubrica">Rúbrica</option>
            <option value="lista-cotejo">Lista de cotejo</option>
            <option value="escala">Escala estimativa</option>
            <option value="prueba">Prueba escrita</option>
            <option value="otro">Otro</option>
          </Select>
        </label>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2">
        <Select className="h-10" value={activityDraft.activityType} onChange={(event) => onChangeDraft({ ...activityDraft, activityType: event.target.value as ActivityDraft['activityType'] })}>
          <option value="individual">Actividad individual</option>
          <option value="group">Actividad grupal</option>
        </Select>
        <Select className="h-10" value={activityDraft.planningMoment || 'desarrollo'} onChange={(event) => onChangeDraft({ ...activityDraft, planningMoment: event.target.value })}>
          <option value="inicio">Inicio</option>
          <option value="desarrollo">Desarrollo</option>
          <option value="cierre">Cierre</option>
        </Select>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground" htmlFor="activity-description">
          Descripción de la actividad
        </label>
        <div className="relative">
          {descriptionExpanded || descriptionEditing || !activityDraft.description ? (
            <Textarea
              id="activity-description"
              className={cn(
                'resize-none pr-12 text-base leading-6',
                descriptionExpanded || descriptionEditing ? 'min-h-32' : 'h-[6rem]',
              )}
              rows={descriptionExpanded || descriptionEditing ? 5 : 3}
              value={activityDraft.description}
              onChange={(event) => onChangeDraft({ ...activityDraft, description: event.target.value })}
              onFocus={() => setDescriptionEditing(true)}
              onBlur={() => setDescriptionEditing(false)}
              placeholder="Describe qué harán los estudiantes, qué recursos usarán y qué evidencia entregarán."
            />
          ) : (
            <div
              id="activity-description"
              className={cn(
                'h-[6rem] overflow-hidden rounded-lg border border-input bg-card px-3 py-3 pr-12 text-base leading-6 text-foreground outline-none transition',
                activityDraft.description ? '' : 'text-muted-foreground',
              )}
              onClick={() => {
                if (hasLongDescription) setDescriptionExpanded(true)
              }}
            >
              <p className="[display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] overflow-hidden">
                {activityDraft.description || 'Describe qué harán los estudiantes, qué recursos usarán y qué evidencia entregarán.'}
              </p>
            </div>
          )}
          {hasLongDescription ? (
            <button
              type="button"
              className="absolute bottom-2 right-3 grid size-6 place-items-center text-primary transition hover:scale-110"
              aria-label={descriptionExpanded ? 'Contraer descripción' : 'Expandir descripción'}
              onClick={() => setDescriptionExpanded((value) => !value)}
            >
              <ChevronDown className={cn('size-4 transition-transform', descriptionExpanded ? 'rotate-180' : '')} />
            </button>
          ) : null}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button className="h-10 px-5" onClick={() => void onSaveActivity().catch(() => undefined)} disabled={saving}>
          {editingActivityId ? 'Guardar actividad' : 'Agregar actividad'}
        </Button>
        {editingActivityId ? <Button variant="outline" onClick={onCancelEdit}>Cancelar edición</Button> : null}
      </div>
      {activities.length > 0 ? (
      <div className="max-h-52 overflow-y-auto rounded-lg border border-border">
        {activities.map((activity) => (
          <div key={activity.id} className="flex flex-col gap-3 border-b border-border px-4 py-3 text-sm last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-bold text-primary">{activity.name}</p>
              <p className="text-xs text-muted-foreground">{activity.maxScore} pts · {blockShortNames[activity.competencyBlockId] ?? 'Bloque'} · {activity.activityType === 'group' ? 'Grupal' : 'Individual'} · {activity.instrumentType || 'Sin instrumento'}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => onEditActivity(activity)}>Editar</Button>
              <Button variant="outline" size="sm" onClick={() => void onDuplicateActivity(activity).catch(() => undefined)}>Duplicar</Button>
              <Button variant="destructive" size="sm" onClick={() => void onDeleteActivity(activity.id).catch(() => undefined)}>Eliminar</Button>
            </div>
          </div>
        ))}
      </div>
      ) : null}
    </div>
  )
}

function ActivitiesHubView({
  activities,
  courseTitle,
  drafts,
  onBack,
  onDiscardDraft,
  onOpenActivity,
  onOpenDraft,
  onSelectBlock,
  periodName,
}: {
  activities: GradingActivity[]
  courseTitle: string
  drafts: ActivityDraftsByBlock
  onBack: () => void
  onDiscardDraft: (blockId: CompetencyBlockId, draftId?: string) => void
  onOpenActivity: (activityId: string) => void
  onOpenDraft: (blockId: CompetencyBlockId, draftId: string) => void
  onSelectBlock: (blockId: CompetencyBlockId) => void
  periodName: string
}) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <button type="button" className="font-medium text-primary hover:underline" onClick={onBack}>
              Calificaciones
            </button>
            <span>›</span>
            <span>Actividades</span>
          </div>
          <h2 className="mt-3 text-3xl font-black text-primary">Actividades</h2>
          <p className="mt-1 text-sm font-medium text-foreground">
            {courseTitle} · {periodName}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Elige el bloque de competencias para tu nueva actividad.
          </p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="size-4" />
          Volver
        </Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        {competencyBlocks.map((block, index) => (
          <ActivityBlockHubCard
            key={block.id}
            activities={activities.filter((activity) => activity.competencyBlockId === block.id)}
            accent={blockAccents[index]}
            block={block}
            drafts={drafts[block.id] ?? []}
            onDiscardDraft={(draftId) => onDiscardDraft(block.id, draftId)}
            onOpenActivity={onOpenActivity}
            onOpenDraft={(draftId) => onOpenDraft(block.id, draftId)}
            onSelectBlock={() => onSelectBlock(block.id)}
          />
        ))}
      </div>
    </section>
  )
}

function ActivityBlockHubCard({
  accent,
  activities,
  block,
  drafts,
  onDiscardDraft,
  onOpenActivity,
  onOpenDraft,
  onSelectBlock,
}: {
  accent: (typeof blockAccents)[number]
  activities: GradingActivity[]
  block: (typeof competencyBlocks)[number]
  drafts: ActivityDraft[]
  onDiscardDraft: (draftId: string) => void
  onOpenActivity: (activityId: string) => void
  onOpenDraft: (draftId: string) => void
  onSelectBlock: () => void
}) {
  return (
    <article className={cn('flex min-h-[23rem] flex-col rounded-lg border p-4 shadow-sm', accent.card)}>
      <div className="flex items-start gap-3">
        <span className={cn('mt-1 h-14 w-1.5 shrink-0 rounded-full', accent.dot)} />
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">{block.shortName}</p>
          <h3 className="mt-1 text-base font-black leading-tight text-foreground">{blockShortNames[block.id] ?? block.name}</h3>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-card/75 p-3 ring-1 ring-border">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Creadas</p>
          <p className="mt-1 text-2xl font-black text-primary">{activities.length}</p>
        </div>
        <div className="rounded-lg bg-card/75 p-3 ring-1 ring-border">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Borradores</p>
          <p className="mt-1 text-2xl font-black text-primary">{drafts.length}</p>
        </div>
      </div>

      <Button className="mt-4 w-full" onClick={onSelectBlock}>
        <Plus className="size-4" />
        Crear actividad
      </Button>

      {drafts.length > 0 ? (
        <div className="mt-3 max-h-[7.25rem] space-y-2 overflow-y-auto pr-1">
            {drafts.map((draft) => (
              <div
                key={draft.draftId}
                role="button"
                tabIndex={0}
                className="w-full rounded-lg border border-primary/20 bg-card/80 px-3 py-2 text-left text-sm transition hover:border-primary hover:bg-card"
                onClick={() => draft.draftId && onOpenDraft(draft.draftId)}
                onKeyDown={(event) => {
                  if (event.key !== 'Enter' && event.key !== ' ') return
                  event.preventDefault()
                  if (draft.draftId) onOpenDraft(draft.draftId)
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-amber-600">Borrador</p>
                    <p className="mt-0.5 truncate font-medium">{draft.name || 'Actividad sin nombre'}</p>
                  </div>
                  <button
                    type="button"
                    className="rounded-md px-2 py-1 text-xs font-bold text-destructive hover:bg-destructive/10"
                    onClick={(event) => {
                      event.stopPropagation()
                      if (draft.draftId) onDiscardDraft(draft.draftId)
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
        </div>
      ) : null}

      {activities.length > 0 ? (
      <div className="mt-3 max-h-[7.25rem] space-y-2 overflow-y-auto pr-1">
          {activities.map((activity) => (
            <button
              key={activity.id}
              type="button"
              className="flex w-full items-start justify-between rounded-lg border border-primary/15 bg-card/80 px-3 py-2 text-left text-sm transition hover:border-primary hover:bg-card"
              onClick={() => onOpenActivity(activity.id)}
            >
              <span className="min-w-0">
                <span className="block text-xs font-black uppercase tracking-[0.12em] text-primary">Actividad</span>
                <span className="mt-0.5 block truncate font-medium text-foreground">{activity.name}</span>
              </span>
              <ArrowRight className="ml-3 mt-2 size-4 shrink-0 text-primary" />
            </button>
          ))}
      </div>
      ) : null}
    </article>
  )
}

function ActivityCreationView({
  activityDraft,
  hasDraft,
  activities,
  block,
  editingActivityId,
  onBack,
  onCancelEdit,
  onChangeDraft,
  onDeleteActivity,
  onDuplicateActivity,
  onEditActivity,
  onOpenActivity,
  onSaveActivity,
  saving,
  students,
}: {
  activityDraft: ActivityDraft
  hasDraft: boolean
  activities: GradingActivity[]
  block: (typeof competencyBlocks)[number]
  editingActivityId: string | null
  onBack: () => void
  onCancelEdit: () => void
  onChangeDraft: (draft: ActivityDraft) => void
  onDeleteActivity: (activityId: string) => Promise<void>
  onDuplicateActivity: (activity: GradingActivity) => Promise<void>
  onEditActivity: (activity: GradingActivity) => void
  onOpenActivity: (activityId: string) => void
  onSaveActivity: () => Promise<void>
  saving: boolean
  students: StudentGradeRow[]
}) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <button type="button" className="font-medium text-primary hover:underline" onClick={onBack}>
              Calificaciones
            </button>
            <span>›</span>
            <span>{block.shortName}</span>
            <span>›</span>
            <span>{editingActivityId ? 'Editar actividad' : 'Nueva actividad'}</span>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Badge>{block.shortName}</Badge>
            {hasDraft ? <Badge tone="warning">Borrador autoguardado</Badge> : null}
            <p className="font-bold text-primary">{blockShortNames[block.id] ?? block.name}</p>
          </div>
          <h2 className="mt-3 text-3xl font-black text-primary">
            {editingActivityId ? 'Editar actividad' : 'Crear actividad'}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Completa los datos de la actividad evaluativa de este bloque.
          </p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="size-4" />
          Volver
        </Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(20rem,0.55fr)]">
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 border-b border-border pb-4">
              <h3 className="font-black text-foreground">Información de la actividad</h3>
            </div>
            <ActivityManager
              activityDraft={activityDraft}
              activities={activities}
              editingActivityId={editingActivityId}
              onCancelEdit={onCancelEdit}
              onChangeDraft={(draft) => onChangeDraft({ ...draft, competencyBlockId: block.id })}
              onDeleteActivity={onDeleteActivity}
              onDuplicateActivity={onDuplicateActivity}
              onEditActivity={onEditActivity}
              onSaveActivity={onSaveActivity}
              saving={saving}
              showCompetencySelect={false}
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <h3 className="font-black text-foreground">Criterios de evaluación</h3>
            <div className="mt-4 overflow-hidden rounded-lg border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/35 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Criterio</th>
                    <th className="px-4 py-3">Excelente</th>
                    <th className="px-4 py-3">Bueno</th>
                    <th className="px-4 py-3">En proceso</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border">
                    <td className="px-4 py-4 font-medium">Pendiente de definir</td>
                    <td className="px-4 py-4 text-muted-foreground">Se configurará desde el instrumento.</td>
                    <td className="px-4 py-4 text-muted-foreground">Editable.</td>
                    <td className="px-4 py-4 text-muted-foreground">Editable.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-black text-foreground">Calificaciones de los estudiantes</h3>
              <Badge>{activityDraft.maxScore || 0} pts</Badge>
            </div>
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/35 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  <tr>
                    <th className="w-12 px-3 py-3 text-center">#</th>
                    <th className="px-3 py-3 text-left">Estudiante</th>
                    <th className="px-3 py-3 text-center">Calificación</th>
                  </tr>
                </thead>
                <tbody>
                  {students.slice(0, 6).map((student, index) => (
                    <tr key={student.enrollmentId} className="border-t border-border">
                      <td className="px-3 py-3 text-center text-muted-foreground">{index + 1}</td>
                      <td className="px-3 py-3 font-medium">{student.firstName} {student.lastName}</td>
                      <td className="px-3 py-3 text-center">
                        <input
                          className="h-9 w-20 rounded-lg border border-border bg-muted/35 text-center text-muted-foreground"
                          disabled
                          placeholder="-"
                        />
                      </td>
                    </tr>
                  ))}
                  {students.length === 0 ? (
                    <tr>
                      <td className="px-3 py-8 text-center text-muted-foreground" colSpan={3}>
                        No hay estudiantes matriculados.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
            <p className="mt-3 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
              La tabla de calificaciones se activará después de crear la actividad.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-black text-foreground">Evidencias / Archivos</h3>
              <Button variant="outline" size="sm" disabled>Subir evidencia</Button>
            </div>
            <p className="mt-4 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
              Las evidencias se adjuntarán cuando la actividad esté creada.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <h3 className="font-black text-foreground">Actividades de este bloque</h3>
            <div className="mt-4 space-y-2">
              {activities.length === 0 ? (
                <p className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
                  Aún no hay actividades creadas para este bloque.
                </p>
              ) : activities.map((activity) => (
                <button
                  key={activity.id}
                  type="button"
                  className="flex w-full items-center justify-between rounded-lg border border-border p-3 text-left text-sm transition hover:border-primary hover:bg-primary/5"
                  onClick={() => onOpenActivity(activity.id)}
                >
                  <span>
                    <span className="block font-bold text-primary">{activity.name}</span>
                    <span className="text-xs text-muted-foreground">{activity.maxScore} pts · {activity.instrumentType || 'Sin instrumento'}</span>
                  </span>
                  <ArrowRight className="size-4 text-primary" />
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}

function CalculationConfigModal({
  config,
  onChange,
  onClose,
}: {
  config: GradeCalculationConfig
  onChange: (config: GradeCalculationConfig) => void
  onClose: () => void
}) {
  return (
    <Modal
      title="Configurar cálculo de calificaciones"
      description="Ajusta las reglas según tu forma de evaluar."
      onClose={onClose}
      className="max-w-6xl rounded-xl"
    >
      <div className="grid gap-6 p-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="grid gap-6 lg:grid-cols-2 lg:divide-x lg:divide-border">
          <div className="grid content-start gap-3 lg:pr-8">
            <label className="space-y-1.5 text-sm font-bold text-foreground">
              Nota mínima de aprobación
              <Input type="number" value={config.passingScore} onChange={(event) => onChange({ ...config, passingScore: Number(event.target.value) || 0 })} />
            </label>
            <label className="space-y-1.5 text-sm font-bold text-foreground">
              Método del bloque
              <Select value={config.blockMethod} onChange={(event) => onChange({ ...config, blockMethod: event.target.value as GradeCalculationConfig['blockMethod'] })}>
                <option value="sum">Suma de actividades</option>
                <option value="average">Promedio de actividades</option>
                <option value="weighted">Porcentaje ponderado</option>
              </Select>
            </label>
            <label className="space-y-1.5 text-sm font-bold text-foreground">
              Total esperado por bloque
              <Input type="number" value={config.expectedBlockTotal} onChange={(event) => onChange({ ...config, expectedBlockTotal: Number(event.target.value) || 100 })} />
            </label>
            <label className="space-y-1.5 text-sm font-bold text-foreground">
              Regla de recuperación
              <Select value={config.recoveryRule} onChange={(event) => onChange({ ...config, recoveryRule: event.target.value as GradeCalculationConfig['recoveryRule'] })}>
                <option value="replace">Sustituye la nota del bloque</option>
                <option value="replace-if-higher">Solo sustituye si mejora</option>
                <option value="average">Se promedia con el bloque</option>
                <option value="none">No usar recuperación</option>
              </Select>
            </label>
            <label className="flex items-center gap-3 pt-1 text-sm font-bold text-muted-foreground">
              <input className="size-5 rounded border-border accent-primary" type="checkbox" checked={config.showRecovery} onChange={(event) => onChange({ ...config, showRecovery: event.target.checked })} />
              Mostrar columna de recuperación (RP)
            </label>
          </div>

          <div className="grid content-start gap-3 lg:pl-8">
            <label className="space-y-1.5 text-sm font-bold text-foreground">
              Redondeo final
              <Select value={config.finalRounding} onChange={(event) => onChange({ ...config, finalRounding: event.target.value as GradeCalculationConfig['finalRounding'] })}>
                <option value="standard">Redondeo estándar (≥ .5 = +1)</option>
                <option value="floor">Redondear hacia abajo</option>
                <option value="ceil">Redondear hacia arriba</option>
                <option value="decimals">Mantener decimales</option>
              </Select>
            </label>
            <label className="space-y-1.5 text-sm font-bold text-foreground">
              Decimales en bloques
              <Select value={String(config.pcDecimals)} onChange={(event) => onChange({ ...config, pcDecimals: Number(event.target.value) })}>
                <option value="0">Sin decimales</option>
                <option value="1">1 decimal</option>
                <option value="2">2 decimales</option>
                <option value="3">3 decimales</option>
                <option value="4">4 decimales</option>
              </Select>
            </label>
            <label className="space-y-1.5 text-sm font-bold text-foreground">
              Decimales en promedio anual
              <Select value={String(config.annualDecimals)} onChange={(event) => onChange({ ...config, annualDecimals: Number(event.target.value) })}>
                <option value="0">Sin decimales</option>
                <option value="1">1 decimal</option>
                <option value="2">2 decimales</option>
                <option value="3">3 decimales</option>
                <option value="4">4 decimales</option>
              </Select>
            </label>
            <label className="space-y-1.5 text-sm font-bold text-foreground">
              Decimales en nota final
              <Select value={String(config.finalDecimals)} onChange={(event) => onChange({ ...config, finalDecimals: Number(event.target.value) })}>
                <option value="0">Sin decimales</option>
                <option value="1">1 decimal</option>
                <option value="2">2 decimales</option>
                <option value="3">3 decimales</option>
                <option value="4">4 decimales</option>
              </Select>
            </label>
          </div>
        </div>

        <aside className="flex flex-col justify-between gap-5">
          <div className="rounded-xl bg-emerald-50 p-5 text-emerald-950">
            <p className="text-sm font-black text-emerald-800">Reglas actuales</p>
            <ul className="mt-4 space-y-4 text-sm font-bold leading-6">
              <RuleItem>Cada bloque suma {config.expectedBlockTotal} puntos.</RuleItem>
              <RuleItem>La recuperación sustituye la nota del bloque.</RuleItem>
              <RuleItem>La nota final es el promedio de las 4 competencias.</RuleItem>
              <RuleItem>El promedio se redondea según la regla seleccionada.</RuleItem>
            </ul>
          </div>
          <Button className="ml-auto h-11 bg-emerald-700 px-6 hover:bg-emerald-800" onClick={onClose}>
            Guardar configuración
          </Button>
        </aside>
      </div>
    </Modal>
  )
}

function RuleItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 text-lg leading-none text-emerald-700">✓</span>
      <span>{children}</span>
    </li>
  )
}

function OfficeIcon({ app }: { app: 'excel' | 'word' }) {
  const isExcel = app === 'excel'

  return (
    <span
      className={cn(
        'relative grid size-5 shrink-0 place-items-center rounded-[4px] text-[11px] font-black leading-none text-white shadow-sm',
        isExcel ? 'bg-[#107c41]' : 'bg-[#185abd]',
      )}
      aria-hidden="true"
    >
      <span
        className={cn(
          'absolute -right-0.5 top-1 size-2 rounded-[1px] opacity-90',
          isExcel ? 'bg-[#21a366]' : 'bg-[#2b7cd3]',
        )}
      />
      <span className="relative">{isExcel ? 'X' : 'W'}</span>
    </span>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-medium text-foreground">{value}</dd>
    </div>
  )
}

function ResultMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/25 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="mt-3 text-3xl font-black text-primary">{value}</p>
    </div>
  )
}

function averageActivityScore(records: GradeRecordRow[], students: StudentGradeRow[], activity: GradingActivity) {
  const values = students
    .map((student) => scoreForActivity(records, student.enrollmentId, activity.id)?.score ?? null)
    .filter((value): value is number => typeof value === 'number')
  return averageNumbers(values)
}

function averageBlockForPeriod(input: {
  blockId: string
  config: GradeCalculationConfig
  periodId: CompetencyPeriodId
  recordsByPeriod: Map<CompetencyPeriodId, GradeRecordRow[]>
  getActivitiesForPeriod: (periodId: CompetencyPeriodId) => GradingActivity[]
  students: StudentGradeRow[]
}) {
  const records = input.recordsByPeriod.get(input.periodId) ?? []
  const activities = input.getActivitiesForPeriod(input.periodId)
    .filter((activity) => activity.competencyBlockId === input.blockId)
  if (activities.length === 0) return null
  const recoveryScores = getRecoveryScores(records)
  const scores = input.students.map((student) => {
    const total = blockTotal({
      records,
      activities,
      enrollmentId: student.enrollmentId,
      blockId: input.blockId,
      config: input.config,
    })
    const recovery = recoveryScores[input.blockId]?.[student.enrollmentId] ?? null
    return effectivePeriodScore(total, recovery, input.config)
  }).filter((value) => value > 0)
  return averageNumbers(scores)
}

function getStudentPeriodBlockScore(input: {
  blockId: string
  config: GradeCalculationConfig
  periodId: CompetencyPeriodId
  recordsByPeriod: Map<CompetencyPeriodId, GradeRecordRow[]>
  getActivitiesForPeriod: (periodId: CompetencyPeriodId) => GradingActivity[]
  student: StudentGradeRow
}) {
  const records = input.recordsByPeriod.get(input.periodId) ?? []
  const activities = input.getActivitiesForPeriod(input.periodId)
    .filter((activity) => activity.competencyBlockId === input.blockId)
  if (activities.length === 0) {
    return { period: null, recovery: null, effective: null }
  }
  const period = blockTotal({
    records,
    activities,
    enrollmentId: input.student.enrollmentId,
    blockId: input.blockId,
    config: input.config,
  })
  const recovery = getRecoveryScores(records)[input.blockId]?.[input.student.enrollmentId] ?? null
  return {
    period,
    recovery,
    effective: effectivePeriodScore(period, recovery, input.config),
  }
}

function gradeColor(value: number | null | undefined, config: GradeCalculationConfig) {
  if (value === null || value === undefined) return 'text-muted-foreground'
  if (value < config.passingScore) return 'text-red-600'
  return 'text-emerald-700'
}

type BlockSummaryExport = {
  courseTitle: string
  periodName: string
  periodAverage: string
  students: number
  activities: number
  pendingBlocks: number
  rows: Array<{
    block: string
    competency: string
    activities: number
    average: string
    pending: number
    status: string
  }>
}

function countPendingScores(activities: GradingActivity[], records: GradeRecordRow[], students: StudentGradeRow[]) {
  if (activities.length === 0) return 0
  return activities.reduce((total, activity) => {
    const missing = students.filter((student) =>
      !scoreForActivity(records, student.enrollmentId, activity.id),
    ).length
    return total + missing
  }, 0)
}

function blockSummaryCsv(payload: BlockSummaryExport) {
  const rows = [
    ['Curso / asignatura', payload.courseTitle],
    ['Periodo', payload.periodName],
    ['Promedio general', payload.periodAverage],
    ['Estudiantes', String(payload.students)],
    ['Actividades totales', String(payload.activities)],
    ['Bloques pendientes', String(payload.pendingBlocks)],
    [],
    ['Bloque', 'Competencia', 'Actividades', 'Promedio /100', 'Pendientes', 'Estado'],
    ...payload.rows.map((row) => [
      row.block,
      row.competency,
      String(row.activities),
      row.average,
      String(row.pending),
      row.status,
    ]),
  ]

  return `\uFEFF${rows.map((row) => row.map(csvCell).join(',')).join('\n')}`
}

function blockSummaryDoc(payload: BlockSummaryExport) {
  const rows = payload.rows.map((row) => `
    <tr>
      <td>${escapeHtml(row.block)}</td>
      <td>${escapeHtml(row.competency)}</td>
      <td>${row.activities}</td>
      <td>${escapeHtml(row.average)} / 100</td>
      <td>${row.pending}</td>
      <td>${escapeHtml(row.status)}</td>
    </tr>
  `).join('')

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Resumen de bloques</title>
    <style>
      body { font-family: Arial, sans-serif; color: #111827; }
      h1 { color: #1f4e95; font-size: 24px; margin-bottom: 4px; }
      p { margin: 4px 0; }
      table { border-collapse: collapse; width: 100%; margin-top: 18px; }
      th, td { border: 1px solid #d9e2ec; padding: 8px; font-size: 12px; }
      th { background: #eef4ff; color: #1f4e95; text-align: left; }
    </style>
  </head>
  <body>
    <h1>Resumen de bloques de competencias</h1>
    <p><strong>Curso / asignatura:</strong> ${escapeHtml(payload.courseTitle)}</p>
    <p><strong>Periodo:</strong> ${escapeHtml(payload.periodName)}</p>
    <p><strong>Promedio general:</strong> ${escapeHtml(payload.periodAverage)} / 100</p>
    <p><strong>Estudiantes:</strong> ${payload.students}</p>
    <p><strong>Actividades totales:</strong> ${payload.activities}</p>
    <p><strong>Bloques pendientes:</strong> ${payload.pendingBlocks}</p>
    <table>
      <thead>
        <tr>
          <th>Bloque</th>
          <th>Competencia</th>
          <th>Actividades</th>
          <th>Promedio /100</th>
          <th>Pendientes</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  </body>
</html>`
}

function downloadTextFile(input: { content: string; filename: string; type: string }) {
  const blob = new Blob([input.content], { type: input.type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = input.filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function blockSummaryFilename(courseTitle: string, periodShortName: string, extension: 'csv' | 'doc') {
  const date = new Date().toISOString().slice(0, 10)
  const course = slugify(courseTitle || 'curso')
  const period = slugify(periodShortName || 'periodo')
  return `resumen-bloques-${course}-${period}-${date}.${extension}`
}

function csvCell(value: string) {
  return `"${value.replace(/"/g, '""')}"`
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64)
}

function averageNumbers(values: number[]) {
  if (values.length === 0) return null
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function createDraftId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `draft-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function newActivityDraft(blockId: CompetencyBlockId): ActivityDraft {
  return {
    ...emptyActivityDraft,
    draftId: createDraftId(),
    competencyBlockId: blockId,
  }
}

function normalizeStoredActivityDrafts(value: unknown): ActivityDraftsByBlock {
  if (!value || typeof value !== 'object') return {}
  const source = value as Record<string, unknown>
  const normalized: ActivityDraftsByBlock = {}

  competencyBlocks.forEach((block) => {
    const raw = source[block.id]
    if (!raw) return
    const drafts = Array.isArray(raw) ? raw : [raw]
    const validDrafts = drafts
      .filter((item): item is Partial<ActivityDraft> => Boolean(item && typeof item === 'object'))
      .map((draft) => ({
        ...emptyActivityDraft,
        ...draft,
        draftId: typeof draft.draftId === 'string' ? draft.draftId : createDraftId(),
        competencyBlockId: block.id,
      }))
      .filter(isMeaningfulActivityDraft)

    if (validDrafts.length > 0) {
      normalized[block.id] = validDrafts
    }
  })

  return normalized
}

function isMeaningfulActivityDraft(draft: ActivityDraft) {
  return Boolean(
    draft.name.trim() ||
    draft.date ||
    draft.description.trim() ||
    draft.instrumentType ||
    draft.evaluationTechnique ||
    draft.maxScore !== emptyActivityDraft.maxScore ||
    draft.activityType !== emptyActivityDraft.activityType ||
    draft.planningMoment !== emptyActivityDraft.planningMoment,
  )
}

function statusTone(status: string): 'success' | 'muted' | 'warning' {
  if (status === 'Completado' || status === 'Aprobado') return 'success'
  if (status === 'Sin actividades' || status === 'Sin calificar') return 'muted'
  return 'warning'
}

function focusNextGradeCell(event: KeyboardEvent<HTMLInputElement>) {
  if (event.key !== 'Enter') return
  event.preventDefault()
  const cells = Array.from(document.querySelectorAll<HTMLInputElement>('.grade-cell:not(:disabled)'))
  const index = cells.indexOf(event.currentTarget)
  cells[index + 1]?.focus()
  cells[index + 1]?.select()
}
