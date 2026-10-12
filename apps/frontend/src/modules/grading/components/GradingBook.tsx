import { ActivityEditorWorkspace } from '@/modules/activities/components/ActivityEditorWorkspace'
import { activityToDraft,buildActivityDraftMetas,emptyActivityDraft,formatDraftDate,newActivityDraft,sortDraftMetas,type ActivityDraftMeta,type ActivityDraftsByBlock } from '@/modules/activities/components/editor/editorModel'
import { ActivityDescriptionContent,activityDescriptionText,activityMomentTitle,blockAccents,blockShortNames,formatActivityDate,getBlockAccent,instrumentTitle,ProgressBar } from '@/modules/activities/components/editor/editorPresentation'
import { defaultRubricLevelPoints,distributeScore,inferInstrumentCount,inferRubricLevels,instrumentFieldKey,instrumentTypographyClass,rubricDefaultLevelNames,rubricLevelVisual,scaleLevelVisual,scaleTemplateLevels,weightedResponseVisual } from '@/modules/activities/components/editor/instrumentEditorShared'
import { useActivityDrafts } from '@/modules/activities/hooks/useActivityDrafts'
import type { ActivityDraftContext } from '@/modules/activities/utils/activityDraftStorage'
import { instrumentEvaluationConfiguration,instrumentEvaluationResult,validateInstrumentDefinition } from '@aula/shared'
import {
AlertCircle,
ArrowRight,
BarChart3,
BookOpen,
Calculator,
CalendarDays,
CheckCircle2,
ClipboardList,
Download,
Ellipsis,
Eye,
FileText,
GraduationCap,
Hourglass,
Layers,
NotebookPen,
Pencil,
Play,
Plus,
Search,
Settings,
SlidersHorizontal,
Target,
Trash2,
TrendingUp,
Trophy,
Users,
X
} from 'lucide-react'

import { useEffect,useMemo,useRef,useState,type Dispatch,type KeyboardEvent,type ReactNode,type SetStateAction } from 'react'


import { Badge } from '@/components/ui/Badge'

import { BackIcon } from '@/components/ui/BackIcon'

import { Button } from '@/components/ui/Button'


import { Input } from '@/components/ui/Input'

import { Modal } from '@/components/ui/Modal'

import { Select } from '@/components/ui/Select'

import { Textarea } from '@/components/ui/Textarea'


import { ActivityInfoModal } from '@/modules/activities/components/ActivityInfoModal'

import type { CourseTeam } from '@/modules/courses/types'


import type {
EvaluatedInstrumentResult,
GradeCalculationConfig,
GradeCellSaveState,
GradeRecordRow,
GradingActivity,
RecoveryScores,
StudentGradeRow,
} from '@/modules/grading/types'

import {
activityAppliesToBlock,
activityGradeCellKey,
blockTotal,
buildCompactGradeRows,
competencyPeriods,
defaultGradeCalculationConfig,
effectivePeriodScore,
finalBlockAverage,
finalSubjectScore,
formatGrade,
getRecoveryScores,
scoreForActivity,
scoreNeedsPersistence,
competencyBlocks as secondaryCompetencyBlocks,
sumActivityMaxScore,
type CompetencyBlockId,
type CompetencyPeriodId
} from '@/modules/grading/utils/competencyGrades'

import { cn } from '@/utils/cn'


import { secondaryEvaluationProfile,type EvaluationProfile } from '@aula/shared'





type GradingBookProps = {
  activityDraftContext?: ActivityDraftContext
  firstSecondaryLanguage?: boolean
  secondSecondaryLanguage?: boolean
  evaluationProfile?: EvaluationProfile
  sectionSubjectId?: string
  students: StudentGradeRow[]
  teams?: CourseTeam[]
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
  initialActivityAction?: 'create'
  initialActivityBlockId?: CompetencyBlockId
  initialActivityDraftId?: string
  initialActivityId?: string
  initialActivityMode?: 'view' | 'edit' | 'evaluate' | 'results'
  originReturnLabel?: string
  onReturnToOrigin?: () => void
  onAddActivity: (activity: Omit<GradingActivity, 'id'>) => Promise<GradingActivity>
  onUpdateActivity: (activity: GradingActivity) => Promise<GradingActivity>
  onDeleteActivity: (activityId: string) => void
  onSaveScore: (enrollmentId: string, activity: GradingActivity, value: string, instrumentResult?: EvaluatedInstrumentResult | null) => Promise<boolean>
  onSaveRecovery: (enrollmentId: string, blockId: string, value: string) => void
  loadFinalRecords: () => Promise<Map<CompetencyPeriodId, GradeRecordRow[]>>
  getActivitiesForPeriod: (periodId: CompetencyPeriodId) => GradingActivity[]
  onActivityWorkspaceChange?: (active: boolean) => void
  onGradeCreatedActivity?: (activity: GradingActivity) => void
  onViewCreatedActivity?: (activity: GradingActivity) => void
  onCreateActivityRequested?: (blockId?: CompetencyBlockId) => void
}

let competencyBlocks: EvaluationProfile['blocks'] = secondaryCompetencyBlocks

let activeEvaluationProfile: EvaluationProfile = secondaryEvaluationProfile

type MainView = 'blocks' | 'period' | 'annual' | 'final'

type ActivityDetailTab = 'evaluation' | 'results' | 'details'

type BlockGradeTab = 'matrix' | 'activities' | 'students' | 'stats'

type DraftsReturnView =
  | { type: 'blocks' }
  | { type: 'activity-hub' }
  | { type: 'block'; blockId: CompetencyBlockId; initialTab?: BlockGradeTab }

type DetailView =
  | { type: 'block'; blockId: CompetencyBlockId; initialTab?: BlockGradeTab }
  | { type: 'activity'; activityId: string; initialTab?: ActivityDetailTab }
  | { type: 'activity-hub' }
  | { type: 'activity-drafts'; initialBlock?: 'all' | CompetencyBlockId; returnTo?: DraftsReturnView }
  | { type: 'activity-create'; blockId: CompetencyBlockId }

type ActivitySaveCompletion =
  | { kind: 'created'; activity: GradingActivity; updated: boolean }
  | { kind: 'draft'; blockId: CompetencyBlockId; activityName: string }

export function GradingBook({
  activityDraftContext,
  firstSecondaryLanguage = false,
  secondSecondaryLanguage = false,
  evaluationProfile,
  sectionSubjectId,
  students,
  teams = [],
  activities,
  records,
  recoveryScores,
  periodName,
  periodShortName,
  courseTitle,
  saving,
  cellSaveStates,
  initialView = 'blocks',
  initialActivityAction,
  initialActivityBlockId,
  initialActivityDraftId,
  initialActivityId,
  initialActivityMode = 'view',
  originReturnLabel,
  onReturnToOrigin,
  onAddActivity,
  onUpdateActivity,
  onDeleteActivity,
  onSaveScore,
  loadFinalRecords,
  getActivitiesForPeriod,
  onActivityWorkspaceChange,
  onGradeCreatedActivity,
  onViewCreatedActivity,
  onCreateActivityRequested,
}: GradingBookProps) {
  activeEvaluationProfile = evaluationProfile ?? secondaryEvaluationProfile
  competencyBlocks = activeEvaluationProfile.blocks
  const initialLaunchKey = initialActivityAction === 'create'
    ? `create:${initialActivityBlockId ?? 'select-block'}`
    : null
  const [mainView, setMainView] = useState<MainView>(initialView)
  const [detailView, setDetailView] = useState<DetailView | null>(() => initialActivityAction === 'create'
    ? initialActivityBlockId
      ? { type: 'activity-create', blockId: initialActivityBlockId }
      : { type: 'activity-hub' }
    : initialActivityId
      ? { type: 'activity', activityId: initialActivityId, initialTab: initialActivityMode === 'evaluate' ? 'evaluation' : initialActivityMode === 'results' ? 'results' : 'details' }
      : null)
  const [activityCreateReturnView, setActivityCreateReturnView] = useState<DetailView | null>(() => initialActivityBlockId ? { type: 'activity-hub' } : null)
  const [showConfig, setShowConfig] = useState(false)
  const [infoActivity, setInfoActivity] = useState<GradingActivity | null>(null)
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null)
  const [activityDraft, setActivityDraft] = useState(() => initialActivityBlockId ? newActivityDraft(initialActivityBlockId) : emptyActivityDraft)
  const draftStore = useActivityDrafts(activityDraftContext, courseTitle, periodShortName)
  const activityDrafts = draftStore.drafts
  function setActivityDrafts(update: (current: ActivityDraftsByBlock) => ActivityDraftsByBlock) { draftStore.persist(update(activityDrafts)) }
  const [config, setConfig] = useState<GradeCalculationConfig>(defaultGradeCalculationConfig)
  const [recordsByPeriod, setRecordsByPeriod] = useState<Map<CompetencyPeriodId, GradeRecordRow[]>>(new Map())
  const [loadingAnnual, setLoadingAnnual] = useState(false)
  const [annualError, setAnnualError] = useState<string | null>(null)
  const [annualRetryKey, setAnnualRetryKey] = useState(0)
  const [activitySaveCompletion, setActivitySaveCompletion] = useState<ActivitySaveCompletion | null>(null)
  const hasPendingCellSaves = Object.values(cellSaveStates).some((state) => state === 'saving')
  const handledInitialLaunch = useRef(initialLaunchKey)
  const handledInitialEdit = useRef<string | null>(null)
  const previousInitialView = useRef(initialView)

  useEffect(() => {
    if (!hasPendingCellSaves) return
    const warnBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener('beforeunload', warnBeforeUnload)
    return () => window.removeEventListener('beforeunload', warnBeforeUnload)
  }, [hasPendingCellSaves])

  useEffect(() => {
    if (previousInitialView.current === initialView) return
    previousInitialView.current = initialView
    setMainView(initialView)
    setDetailView(null)
  }, [initialView])

  useEffect(() => {
    if (!initialLaunchKey || handledInitialLaunch.current === initialLaunchKey) return
    handledInitialLaunch.current = initialLaunchKey
    setMainView('blocks')
    if (initialActivityBlockId) {
      setEditingActivityId(null)
      setActivityDraft(newActivityDraft(initialActivityBlockId))
      setActivityCreateReturnView({ type: 'activity-hub' })
      setDetailView({ type: 'activity-create', blockId: initialActivityBlockId })
      return
    }
    setDetailView({ type: 'activity-hub' })
  }, [initialActivityBlockId, initialLaunchKey])

  useEffect(() => {
    if (!initialActivityId || initialActivityMode !== 'edit' || handledInitialEdit.current === initialActivityId) return
    const activity = activities.find((item) => item.id === initialActivityId)
    if (!activity) return
    handledInitialEdit.current = initialActivityId
    setEditingActivityId(activity.id)
    setActivityDraft(activityToDraft(activity))
    setActivityCreateReturnView({ type: 'activity', activityId: activity.id, initialTab: 'details' })
    setDetailView({ type: 'activity-create', blockId: activity.competencyBlockId as CompetencyBlockId })
  }, [activities, initialActivityId, initialActivityMode])

  const selectedBlock = detailView?.type === 'block'
    ? competencyBlocks.find((block) => block.id === detailView.blockId) ?? null
    : null
  const selectedCreateBlock = detailView?.type === 'activity-create'
    ? competencyBlocks.find((block) => block.id === detailView.blockId) ?? null
    : null
  const selectedActivity = detailView?.type === 'activity'
    ? activities.find((activity) => activity.id === detailView.activityId) ?? null
    : null
  const isFocusedWorkspace = Boolean(detailView)

  useEffect(() => {
    onActivityWorkspaceChange?.(isFocusedWorkspace)
    return () => onActivityWorkspaceChange?.(false)
  }, [isFocusedWorkspace, onActivityWorkspaceChange])

  const blockSummaries = useMemo(
    () => competencyBlocks.map((block, index) => {
      const blockActivities = activities.filter((activity) => activityAppliesToBlock(activity, block.id))
      const expected = config.expectedBlockTotal
      const maxScore = sumActivityMaxScore(blockActivities, block.id)
      const studentScores = students.flatMap((student) => {
        const hasRecordedScore = blockActivities.some((activity) => scoreForActivity(records, student.enrollmentId, activity.id))
        const recovery = recoveryScores[block.id]?.[student.enrollmentId] ?? null
        if (!hasRecordedScore && recovery === null) return []
        const total = blockTotal({
          records,
          activities: blockActivities,
          enrollmentId: student.enrollmentId,
          blockId: block.id,
          config,
        })
        return [effectivePeriodScore(total, recovery, config)]
      })
      const average = studentScores.length > 0
        ? studentScores.reduce((sum, value) => sum + value, 0) / studentScores.length
        : null
      const hasRecovery = Object.values(recoveryScores[block.id] ?? {}).some((value) => typeof value === 'number')
      const totalGradeCells = students.length * blockActivities.length
      const gradedCells = students.reduce((total, student) => total + blockActivities.filter((activity) => scoreForActivity(records, student.enrollmentId, activity.id)).length, 0)
      const gradingProgress = totalGradeCells > 0 ? Math.round(gradedCells / totalGradeCells * 100) : 0
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
        gradingProgress,
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
  const draftMetas = useMemo(
    () => buildActivityDraftMetas(activityDrafts),
    [activityDrafts],
  )

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
          setAnnualError(
            loadError instanceof Error
              ? loadError.message
              : 'No se pudo cargar la información anual.',
          )
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


  function openActivityHub() {
    setEditingActivityId(null)
    setActivityDraft(emptyActivityDraft)
    setDetailView({ type: 'activity-hub' })
  }

  function openActivityCreator(blockId: CompetencyBlockId) {
    setEditingActivityId(null)
    setActivityDraft(newActivityDraft(blockId))
    setActivityCreateReturnView(detailView?.type === 'block' ? { ...detailView, initialTab: 'activities' } : detailView ?? { type: 'activity-hub' })
    setDetailView({ type: 'activity-create', blockId })
  }

  function openActivity(activityId: string, initialTab?: ActivityDetailTab) {
    const activity = activities.find((item) => item.id === activityId)
    if (!activity) return
    if (initialTab) {
      setDetailView({ type: 'activity', activityId, initialTab })
      return
    }
    setInfoActivity(activity)
  }

  function openActivityDraft(blockId: CompetencyBlockId, draftId: string) {
    const draft = activityDrafts[blockId]?.find((item) => item.draftId === draftId)
    setEditingActivityId(null)
    setActivityDraft(draft ?? newActivityDraft(blockId))
    setActivityCreateReturnView(detailView ?? { type: 'activity-hub' })
    setDetailView({ type: 'activity-create', blockId })
  }

  function goBackFromDrafts(returnTo?: DraftsReturnView) {
    if (returnTo?.type === 'blocks') {
      setDetailView(null)
      return
    }
    if (returnTo?.type === 'block') {
      setDetailView({ type: 'block', blockId: returnTo.blockId, initialTab: returnTo.initialTab })
      return
    }
    setDetailView({ type: 'activity-hub' })
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
      return next
    })
    if (detailView?.type === 'activity-create' && detailView.blockId === blockId && !editingActivityId && (!draftId || draftId === activityDraft.draftId)) {
      setActivityDraft(newActivityDraft(blockId))
    }
  }

  function editActivity(activity: GradingActivity) {
    setEditingActivityId(activity.id)
    setActivityDraft(activityToDraft(activity))
    setActivityCreateReturnView(detailView?.type === 'block' ? { ...detailView, initialTab: 'activities' } : detailView)
    setDetailView({ type: 'activity-create', blockId: activity.competencyBlockId as CompetencyBlockId })
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

  function selectMainView(view: MainView) {
    setMainView(view)
    setDetailView(null)
  }

  if (students.length === 0 && !initialActivityAction) {
    return (
      <div className="flex min-h-[280px] items-center justify-center rounded-lg border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
        Este curso todavía no tiene estudiantes matriculados.
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {!isFocusedWorkspace ? (
        <header className="rounded-3xl bg-card p-3 shadow-sm sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1">
                <div className="min-w-0 flex-1 overflow-x-auto pb-0.5">
                  <nav className="grading-view-tabs relative grid min-w-[32rem] grid-cols-4 rounded-2xl bg-muted/70 p-1 sm:min-w-0 sm:max-w-[42rem]" aria-label="Vistas del panel de evaluaciones">
                    <span
                      className="grading-tab-indicator pointer-events-none absolute inset-y-1 left-1 w-[calc((100%_-_0.5rem)/4)] rounded-xl bg-primary transition-transform duration-[260ms] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none will-change-transform"
                      style={{ transform: `translateX(${(['blocks', 'period', 'annual', 'final'] as MainView[]).indexOf(mainView) * 100}%)` }}
                      aria-hidden="true"
                    />
                    <ViewButton active={mainView === 'blocks'} icon={<BookOpen className="size-4" />} label="Bloques" onClick={() => selectMainView('blocks')} />
                    <ViewButton active={mainView === 'period'} icon={<ClipboardList className="size-4" />} label="Período" onClick={() => selectMainView('period')} />
                    <ViewButton active={mainView === 'annual'} icon={<CalendarDays className="size-4" />} label="Matriz anual" onClick={() => selectMainView('annual')} />
                    <ViewButton active={mainView === 'final'} icon={<Trophy className="size-4" />} label="Resumen final" onClick={() => selectMainView('final')} />
                  </nav>
                </div>

                <details className="group relative">
                  <summary aria-label="Más acciones" title="Más acciones" className="grid size-10 cursor-pointer list-none place-items-center rounded-xl text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
                    <Ellipsis className="size-5" aria-hidden="true" />
                  </summary>
                  <div className="absolute right-0 z-20 mt-2 w-56 rounded-xl border border-border bg-card p-1.5 shadow-xl">
                    <button type="button" className="flex h-10 w-full items-center gap-2 rounded-lg px-3 text-left text-sm font-medium text-emerald-700 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={(event) => { downloadBlockSummary('csv'); event.currentTarget.closest('details')?.removeAttribute('open') }}>
                      <OfficeIcon app="excel" /> Exportar a Excel
                    </button>
                    <button type="button" className="flex h-10 w-full items-center gap-2 rounded-lg px-3 text-left text-sm font-medium text-blue-700 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={(event) => { downloadBlockSummary('doc'); event.currentTarget.closest('details')?.removeAttribute('open') }}>
                      <OfficeIcon app="word" /> Exportar a Word
                    </button>
                    <button type="button" className="flex h-10 w-full items-center gap-2 rounded-lg px-3 text-left text-sm font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={(event) => { setShowConfig(true); event.currentTarget.closest('details')?.removeAttribute('open') }}>
                      <Settings className="size-4" /> Configurar cálculo
                    </button>
                  </div>
                </details>
              </div>

              {!detailView && mainView === 'blocks' ? (
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 px-1 text-sm text-muted-foreground" aria-label="Resumen de evaluación">
                  <span><strong className="font-bold text-foreground tabular-nums">{students.length}</strong> estudiantes</span>
                  <span className="text-border" aria-hidden="true">•</span>
                  <span><strong className="font-bold text-foreground tabular-nums">{activities.length}</strong> actividades</span>
                  <span className="text-border" aria-hidden="true">•</span>
                  <span><strong className="font-bold text-foreground tabular-nums">{pendingBlocks}</strong> bloques pendientes</span>
                  <span className="hidden text-border sm:inline" aria-hidden="true">•</span>
                  <span className="basis-full sm:basis-auto">
                    {periodAverage === null ? 'Aún no hay calificaciones' : <>Promedio <strong className="font-bold text-primary tabular-nums">{formatGrade(periodAverage)}</strong></>}
                  </span>
                </div>
              ) : null}
            </div>

            <Button className="h-10 shrink-0 px-4" onClick={() => onCreateActivityRequested ? onCreateActivityRequested() : openActivityHub()}>
              <Plus className="size-4" />
              <span className="hidden sm:inline">Agregar actividad</span>
              <span className="sm:hidden">Agregar</span>
            </Button>
          </div>
        </header>
      ) : null}

      {detailView ? (
        detailView.type === 'block' && selectedBlock ? (
          <BlockGradeView
            blockId={selectedBlock.id}
            activities={activities.filter((activity) => activityAppliesToBlock(activity, selectedBlock.id))}
            config={config}
            courseTitle={courseTitle}
            draftMetas={draftMetas}
            initialTab={detailView.initialTab}
            onBack={() => setDetailView(null)}
            onCreateActivity={() => onCreateActivityRequested ? onCreateActivityRequested(selectedBlock.id) : openActivityCreator(selectedBlock.id)}
            onDeleteActivity={onDeleteActivity}
            onEditActivity={editActivity}
            onOpenConfig={() => setShowConfig(true)}
            onOpenActivity={openActivity}
            onViewDrafts={(blockId) => setDetailView({
              type: 'activity-drafts',
              initialBlock: blockId,
              returnTo: { type: 'block', blockId: selectedBlock.id, initialTab: 'activities' },
            })}
            records={records}
            students={students}
          />
        ) : detailView.type === 'activity-hub' ? (
          <ActivitiesHubView
            activities={activities}
            courseTitle={courseTitle}
            draftMetas={draftMetas}
            onBack={() => setDetailView(null)}
            onDeleteDraft={discardActivityDraft}
            onOpenDraft={openActivityDraft}
            onSelectBlock={(blockId) => onCreateActivityRequested ? onCreateActivityRequested(blockId) : openActivityCreator(blockId)}
            onViewDrafts={(blockId) => setDetailView({ type: 'activity-drafts', initialBlock: blockId, returnTo: { type: 'activity-hub' } })}
            periodShortName={periodShortName}
            periodName={periodName}
          />
        ) : detailView.type === 'activity-drafts' ? (
          <ActivityDraftsView
            courseTitle={courseTitle}
            draftMetas={draftMetas}
            initialBlock={detailView.initialBlock}
            onBack={() => goBackFromDrafts(detailView.returnTo)}
            onCreateActivity={() => onCreateActivityRequested ? onCreateActivityRequested(competencyBlocks[0].id) : openActivityCreator(competencyBlocks[0].id)}
            onDeleteDraft={discardActivityDraft}
            onOpenDraft={openActivityDraft}
            periodName={periodName}
            periodShortName={periodShortName}
          />
        ) : detailView.type === 'activity-create' && selectedCreateBlock ? (
          <ActivityEditorWorkspace
            evaluationProfile={evaluationProfile} activityDraftContext={activityDraftContext}
            firstSecondaryLanguage={firstSecondaryLanguage} secondSecondaryLanguage={secondSecondaryLanguage}
            sectionSubjectId={sectionSubjectId} teams={teams} saving={saving}
            initialActivityBlockId={selectedCreateBlock.id as CompetencyBlockId}
            initialActivityDraftId={initialActivityDraftId ?? activityDraft.draftId}
            initialDraft={activityDraft}
            activity={editingActivityId ? {...activities.find(item => item.id === editingActivityId)!, evaluatedCount: records.filter(item => item.evaluationActivityId === editingActivityId).length || activities.find(item => item.id === editingActivityId)?.evaluatedCount} : undefined}
            courseTitle={courseTitle} periodShortName={periodShortName}
            originReturnLabel={originReturnLabel ?? 'Volver a Evaluación'} onReturnToOrigin={onReturnToOrigin ?? goBackFromActivityCreator}
            onAddActivity={onAddActivity} onUpdateActivity={onUpdateActivity}
            onGradeCreatedActivity={onGradeCreatedActivity ?? ((activity) => {setDetailView({type:'activity',activityId:activity.id,initialTab:'evaluation'})})}
            onViewCreatedActivity={onViewCreatedActivity ?? ((activity) => setInfoActivity(activity))}
          />
        ) : selectedActivity ? (
          <ActivityDetailView
            activity={selectedActivity}
            cellSaveStates={cellSaveStates}
            courseTitle={courseTitle}
            initialTab={detailView.type === 'activity' ? detailView.initialTab : undefined}
            onBack={() => {
              if (hasPendingCellSaves) return
              if (initialActivityId && onReturnToOrigin) {
                onReturnToOrigin()
                return
              }
              setDetailView({ type: 'block', blockId: selectedActivity.competencyBlockId as CompetencyBlockId })
            }}
            onEditActivity={editActivity}
            onSaveScore={onSaveScore}
            records={records}
            periodName={periodName}
            saving={saving}
            students={students}
          />
        ) : null
      ) : mainView === 'blocks' ? (
        <BlockMatrixView
          blockSummaries={blockSummaries}
          config={config}
          onOpenBlock={(blockId) => setDetailView({ type: 'block', blockId })}
          draftMetas={draftMetas}
          onOpenActivity={openActivity}
          records={records}
          students={students}
          onViewDrafts={(blockId) => setDetailView({ type: 'activity-drafts', initialBlock: blockId, returnTo: { type: 'blocks' } })}
        />
      ) : mainView === 'period' ? (
        <PeriodSummaryView
          blockSummaries={blockSummaries}
          config={config}
          courseTitle={courseTitle}
          periodShortName={periodShortName}
          records={records}
          recoveryScores={recoveryScores}
          students={students}
        />
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
      {infoActivity ? (
        <ActivityInfoModal
          activity={infoActivity}
          onClose={() => setInfoActivity(null)}
          onEdit={() => {
            const activity = infoActivity
            setInfoActivity(null)
            editActivity(activity)
          }}
          onEvaluate={() => {
            const activity = infoActivity
            setInfoActivity(null)
            setDetailView({ type: 'activity', activityId: activity.id, initialTab: 'evaluation' })
          }}
        />
      ) : null}
      {activitySaveCompletion ? (
        <ActivitySavedDialog
          completion={activitySaveCompletion}
          returnLabel={originReturnLabel ?? (activitySaveCompletion.kind === 'created' ? 'Volver al bloque' : 'Salir a actividades')}
          onClose={() => {
            setActivitySaveCompletion(null)
            if (activitySaveCompletion.kind === 'created') {
              setDetailView({ type: 'block', blockId: activitySaveCompletion.activity.competencyBlockId as CompetencyBlockId, initialTab: 'activities' })
            }
          }}
          onCreateAnother={() => {
            setActivitySaveCompletion(null)
            openActivityHub()
          }}
          onGrade={activitySaveCompletion.kind === 'created' ? () => {
            if (onGradeCreatedActivity) {
              onGradeCreatedActivity(activitySaveCompletion.activity)
              return
            }
            setActivitySaveCompletion(null)
            setDetailView({ type: 'activity', activityId: activitySaveCompletion.activity.id, initialTab: 'evaluation' })
          } : undefined}
          onReturn={() => {
            if (onReturnToOrigin) {
              onReturnToOrigin()
              return
            }
            setActivitySaveCompletion(null)
            setDetailView(activitySaveCompletion.kind === 'created'
              ? { type: 'block', blockId: activitySaveCompletion.activity.competencyBlockId as CompetencyBlockId, initialTab: 'activities' }
              : { type: 'activity-hub' })
          }}
          onView={() => {
            if (activitySaveCompletion.kind === 'created' && onViewCreatedActivity) {
              onViewCreatedActivity(activitySaveCompletion.activity)
              return
            }
            setActivitySaveCompletion(null)
            if (activitySaveCompletion.kind === 'created') {
              setDetailView({ type: 'activity', activityId: activitySaveCompletion.activity.id, initialTab: 'details' })
            } else {
              setDetailView(null)
            }
          }}
        />
      ) : null}
    </div>
  )
}

export function ActivitySavedDialog({ completion, returnLabel, onClose, onCreateAnother, onGrade, onReturn, onView }: {
  completion: ActivitySaveCompletion
  returnLabel: string
  onClose: () => void
  onCreateAnother: () => void
  onGrade?: () => void
  onReturn: () => void
  onView: () => void
}) {
  const created = completion.kind === 'created'
  const title = created
    ? completion.updated ? 'Actividad actualizada' : 'Actividad creada correctamente'
    : 'Borrador guardado'
  const activityName = created ? completion.activity.name : completion.activityName

  return (
    <Modal title={title} onClose={onClose} className="max-w-2xl rounded-2xl" hideHeader>
      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className={cn('flex size-14 shrink-0 items-center justify-center rounded-2xl', created ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700')}>
              {created ? <CheckCircle2 className="size-7" /> : <ClipboardList className="size-7" />}
            </span>
            <div>
              <h3 className="text-xl font-black text-foreground">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{created ? 'La actividad y su instrumento ya están disponibles en Evaluación.' : 'Tu progreso se conservó y podrás completar la actividad más adelante.'}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" aria-label="Cerrar" onClick={onClose}><X className="size-5" /></Button>
        </div>

        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Actividad</p>
          <p className="mt-1 font-extrabold text-foreground">{activityName}</p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {created && onGrade ? <Button className="h-12 justify-center" onClick={onGrade}><GraduationCap className="size-5" /> Calificar ahora</Button> : null}
          <Button variant="outline" className="h-12 justify-center" onClick={onReturn}><BackIcon /> {returnLabel}</Button>
          <Button variant="outline" className="h-12 justify-center" onClick={onView}><Eye className="size-5" /> {created ? 'Ver actividad' : 'Ver borradores'}</Button>
          <Button variant="ghost" className="h-12 justify-center text-primary" onClick={onCreateAnother}><Plus className="size-5" /> Crear otra actividad</Button>
        </div>
      </div>
    </Modal>
  )
}

function ViewButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean
  icon: ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-current={active ? 'page' : undefined}
      className={cn(
        'relative z-10 inline-flex h-10 min-w-0 items-center justify-center gap-2 rounded-xl px-2 text-sm font-bold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        active ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
      )}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
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

function AnnualLoadError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center">
      <p className="font-bold text-destructive">No se pudo cargar la vista anual.</p>
      <p className="max-w-xl text-sm text-muted-foreground">{message}</p>
      <Button variant="outline" onClick={onRetry}>Reintentar</Button>
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
  config,
  onOpenBlock,
  onOpenActivity,
  records,
  students,
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
  config: GradeCalculationConfig
  draftMetas: ActivityDraftMeta[]
  onOpenBlock: (blockId: CompetencyBlockId) => void
  onOpenActivity: (activityId: string, initialTab?: ActivityDetailTab) => void
  onViewDrafts: (blockId?: CompetencyBlockId) => void
  records: GradeRecordRow[]
  students: StudentGradeRow[]
}) {
  return (
    <section>
      <div className="grid gap-4 md:grid-cols-2">
        {blockSummaries.map((summary) => {
          const accent = blockAccents[summary.index]
          const progress = summary.average === null
            ? 0
            : Math.max(0, Math.min(100, (summary.average / summary.expected) * 100))
          return (
            <article
              key={summary.block.id}
              className="overflow-hidden rounded-2xl bg-card shadow-sm transition-shadow duration-200 hover:shadow-md"
            >
              <button
                type="button"
                aria-label={`Abrir bloque ${summary.index + 1}: ${blockShortNames[summary.block.id]}`}
                className={cn('group block w-full px-5 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset', accent.ring)}
                onClick={() => onOpenBlock(summary.block.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className={cn('text-xs font-bold', accent.text)}>Bloque {summary.index + 1}</p>
                    <h3 className="mt-1.5 text-pretty text-base font-extrabold leading-6 text-foreground sm:text-lg">
                      {blockShortNames[summary.block.id]}
                    </h3>
                  </div>
                  <span className={cn('grid size-9 shrink-0 place-items-center rounded-xl', accent.panel)} aria-hidden="true">
                    <ArrowRight className="size-4" />
                  </span>
                </div>

                {summary.average === null ? (
                  <div className="mt-5 flex items-center gap-3">
                    <span className={cn('grid size-10 shrink-0 place-items-center rounded-xl', accent.panel)} aria-hidden="true">
                      <Hourglass className="size-5" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        {summary.activities.length === 0 ? 'Aún sin actividades' : 'Pendiente de calificar'}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {summary.activities.length === 0 ? 'Agrega una actividad para comenzar.' : 'Registra las primeras calificaciones.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5">
                    <div className="flex items-end justify-between gap-3">
                      <p className="text-2xl font-extrabold leading-none text-primary tabular-nums">
                        {formatGrade(summary.average)} <span className="text-sm font-semibold text-muted-foreground">/ {summary.expected}</span>
                      </p>
                      <span className="text-xs text-muted-foreground">Promedio</span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-border" aria-label={`${formatGrade(summary.average)} de ${summary.expected} puntos`}>
                      <span className={cn('block h-full rounded-full', accent.progress)} style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-3 text-xs">
                  <span className="font-medium text-muted-foreground">{summary.activities.length} actividades</span>
                  <Badge tone={statusTone(summary.status)}>{summary.status}</Badge>
                </div>
              </button>
            </article>
          )
        })}
      </div>
    </section>
  )

  return (
    <div className="grid gap-4 2xl:grid-cols-2">
      {blockSummaries.map((summary) => {
        const accent = blockAccents[summary.index]
        return (
          <article
            key={summary.block.id}
            className={cn('rounded-lg border bg-card p-4 shadow-sm', accent.card)}
            style={{ backgroundColor: accent.cardTint, borderColor: accent.cardBorder }}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Bloque {summary.index + 1}
                </p>
                <h3 className="mt-1 text-xl font-bold text-primary">{blockShortNames[summary.block.id]}</h3>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">{summary.block.name}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-3xl font-black text-primary">
                  {formatGrade(summary.average)} / {summary.expected}
                </p>
                <Badge tone={statusTone(summary.status)} className="mt-2">
                  {summary.status}
                </Badge>
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-lg border border-border bg-card/80">
              <table className="w-full text-sm">
                <thead className={accent.panel}>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.14em]">Actividad</th>
                    <th className="w-36 px-4 py-3 text-right text-xs font-bold uppercase tracking-[0.14em]">Promedio / Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.activities.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="px-4 py-6 text-center text-sm text-muted-foreground">
                        Sin actividades para este bloque.
                      </td>
                    </tr>
                  ) : summary.activities.map((activity, index) => {
                    const average = averageActivityScore(records, students, activity)
                    return (
                      <tr key={activity.id} className="border-t border-border hover:bg-muted/20">
                        <td className="px-4 py-3">
                          <button className="text-left font-medium text-primary hover:underline" onClick={() => onOpenActivity(activity.id)}>
                            {index + 1}. {activity.name}
                          </button>
                          <p className="mt-1 text-xs text-muted-foreground">{activity.instrumentType || 'Sin instrumento'}</p>
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-primary">
                          {formatGrade(average)} / {activity.maxScore}
                        </td>
                      </tr>
                    )
                  })}
                  <tr className="border-t border-border bg-muted/35">
                    <td className="px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                      Total del bloque
                    </td>
                    <td className="px-4 py-3 text-right font-black text-primary">
                      {formatGrade(summary.average)} / {summary.expected}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                {summary.activities.length} actividades · {summary.maxScore} pts creados · esperado {config.expectedBlockTotal}
              </p>
              <Button variant="outline" onClick={() => onOpenBlock(summary.block.id)}>
                Abrir bloque
              </Button>
            </div>
          </article>
        )
      })}
    </div>
  )
}

function BlockGradeView({
  blockId,
  activities,
  config,
  courseTitle,
  initialTab = 'matrix',
  onBack,
  onCreateActivity,
  onDeleteActivity,
  onEditActivity,
  onOpenConfig,
  onOpenActivity,
  records,
  students,
}: {
  blockId: CompetencyBlockId
  activities: GradingActivity[]
  config: GradeCalculationConfig
  courseTitle: string
  draftMetas: ActivityDraftMeta[]
  initialTab?: BlockGradeTab
  onBack: () => void
  onCreateActivity: () => void
  onDeleteActivity: (activityId: string) => void
  onEditActivity: (activity: GradingActivity) => void
  onOpenConfig: () => void
  onOpenActivity: (activityId: string, initialTab?: ActivityDetailTab) => void
  onViewDrafts: (blockId?: CompetencyBlockId) => void
  records: GradeRecordRow[]
  students: StudentGradeRow[]
}) {
  const [activeTab, setActiveTab] = useState<BlockGradeTab>(initialTab)
  const blockTabs = ['matrix', 'activities', 'students', 'stats'] as const
  const block = competencyBlocks.find((item) => item.id === blockId) ?? competencyBlocks[0]
  const blockIndex = competencyBlocks.findIndex((item) => item.id === blockId)
  const studentTotals = students.map((student) => {
    return blockTotal({ records, activities, enrollmentId: student.enrollmentId, blockId, config })
  })
  const evaluatedStudentTotals = students.flatMap((student, index) => activities.some((activity) => scoreForActivity(records, student.enrollmentId, activity.id)) ? [studentTotals[index]] : [])
  const average = averageNumbers(evaluatedStudentTotals)
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

  const completedStudents = studentTotals.filter((value) => value >= config.passingScore).length
  const riskStudents = evaluatedStudentTotals.filter((value) => value < config.passingScore).length
  const plannedTotal = sumActivityMaxScore(activities, blockId)
  const activitySummaries = activities.map((activity) => {
    const scored = students.filter((student) => scoreForActivity(records, student.enrollmentId, activity.id)).length
    const averageScore = averageActivityScore(records, students, activity)
    return {
      activity,
      averageScore,
      pending: Math.max(students.length - scored, 0),
      scored,
    }
  })
  const bestActivity = activitySummaries
    .filter((item) => item.averageScore !== null)
    .sort((a, b) => (b.averageScore ?? 0) - (a.averageScore ?? 0))[0]
  const lowestActivity = activitySummaries
    .filter((item) => item.averageScore !== null)
    .sort((a, b) => (a.averageScore ?? 0) - (b.averageScore ?? 0))[0]
  const tabs = [
    { id: 'matrix', label: 'Calificaciones' },
    { id: 'activities', label: 'Actividades' },
    { id: 'students', label: 'Estudiantes' },
    { id: 'stats', label: 'Análisis' },
  ] as const

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
          <h2 className="mt-3 text-3xl font-black leading-tight text-foreground">{blockShortNames[block.id]}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{block.name}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onBack}>
            <BackIcon />
            Volver
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            <Download className="size-4" />
            Descargar
          </Button>
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-5">
        <BlockMetric icon={<Layers className="size-5" />} label="Total planificado" value={`${formatGrade(plannedTotal)} pts`} helper={`/ ${config.expectedBlockTotal} esperados`} tone="default" />
        <BlockMetric icon={<Target className="size-5" />} label="Promedio del bloque" value={formatGrade(average)} helper="puntos" tone="success" />
        <BlockMetric icon={<ClipboardList className="size-5" />} label="Actividades" value={activities.length} helper="actividades" tone="accent" />
        <BlockMetric icon={<Hourglass className="size-5" />} label="Pendientes" value={pendingActivities} helper="actividades" tone="warning" />
        <BlockMetric icon={<CheckCircle2 className="size-5" />} label="Estado" value={blockState} helper="" tone="success" />
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border text-sm font-bold text-muted-foreground" role="tablist" aria-label={`Vistas de ${block.shortName}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            data-tab={tab.id}
            aria-selected={activeTab === tab.id}
            tabIndex={activeTab === tab.id ? 0 : -1}
            className={cn(
              'border-b-2 border-transparent px-3 py-3 transition hover:text-primary',
              activeTab === tab.id ? 'border-primary text-primary' : 'text-muted-foreground',
            )}
            onClick={() => setActiveTab(tab.id)}
            onKeyDown={(event) => moveTabFocus(event, blockTabs, activeTab, setActiveTab)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <section className="min-h-[calc(100vh-24rem)] rounded-lg border border-border bg-card shadow-sm">
      {activeTab === 'matrix' ? (<div className="space-y-3 p-3">
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="max-h-[calc(100vh-31rem)] overflow-auto">
          <table className="min-w-max border-separate border-spacing-0 text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="sticky left-0 top-0 z-40 w-14 border-b border-r border-border bg-muted px-3 py-4 text-center text-xs font-bold uppercase text-muted-foreground">#</th>
                <th className="sticky left-14 top-0 z-40 min-w-[14rem] border-b border-r border-border bg-muted px-4 py-4 text-left text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Estudiante</th>
                  {activities.map((activity, index) => (
                    <th
                      key={activity.id}
                      role="button"
                      tabIndex={0}
                      className="min-w-[13rem] border-b border-r border-border px-4 py-4 text-center outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                      onClick={() => onOpenActivity(activity.id)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          onOpenActivity(activity.id)
                        }
                      }}
                    >
                      <span className="font-bold text-primary">
                        {index + 1}. {activity.name}
                      </span>
                      <p className="mt-1 text-xs font-bold text-primary">{activity.maxScore} pts</p>
                    </th>
                  ))}
                  <th
                    role="button"
                    tabIndex={0}
                    className="w-28 border-b border-r border-border px-4 py-4 text-center text-xs font-bold uppercase text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                    onClick={onOpenConfig}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        onOpenConfig()
                      }
                    }}
                  >
                    Total /{config.expectedBlockTotal}
                  </th>
                  <th
                    role="button"
                    tabIndex={0}
                    className="w-28 border-b border-r border-border px-4 py-4 text-center text-xs font-bold uppercase text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                    onClick={() => setActiveTab('stats')}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        setActiveTab('stats')
                      }
                    }}
                  >
                    Estado
                  </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => {
                const total = blockTotal({ records, activities, enrollmentId: student.enrollmentId, blockId, config })
                const hasResult = activities.some((activity) => scoreForActivity(records, student.enrollmentId, activity.id))
                const status = !hasResult ? 'Sin calificar' : total >= config.passingScore ? 'Aprobado' : 'En recuperación'
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
                      return (
                        <td key={activity.id} className="border-b border-r border-border px-4 py-2 text-center">
                          <div className="inline-flex min-h-9 items-center gap-1 rounded-md px-3 text-sm font-bold text-primary">
                            <span>{record ? formatGrade(record.score) : '—'}</span>
                            <span className="text-xs font-medium text-muted-foreground">/ {activity.maxScore}</span>
                          </div>
                        </td>
                      )
                    })}
                    <td className="border-b border-r border-border px-4 py-3 text-center text-lg font-black text-primary">{hasResult ? formatGrade(total) : '—'}</td>
                    <td className="border-b border-r border-border px-4 py-3 text-center"><Badge tone={statusTone(status)}>{status}</Badge></td>
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
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-lg border border-primary/15 bg-primary/5 px-4 py-3 text-sm font-medium text-primary">
        La calificación del bloque se obtiene sumando los puntos de cada actividad. Total esperado: {config.expectedBlockTotal} puntos.
      </div>
      </div>) : null}

      {activeTab === 'activities' ? (
        <div className="max-h-[calc(100vh-24rem)] overflow-y-auto p-4">
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-xl font-black text-primary">Actividades del bloque</h3>
                <p className="mt-1 text-sm text-muted-foreground">Administra, evalúa y da seguimiento a las actividades de este bloque.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={onCreateActivity}>
                  <Plus className="size-4" />
                  Crear actividad
                </Button>
              </div>
            </div>

            <div className="grid gap-3 border-b border-border p-4 lg:grid-cols-[minmax(12rem,1fr)_14rem_13rem_13rem_3rem]">
              <label className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="h-10 pl-9" placeholder="Buscar actividad..." />
              </label>
              <Select className="h-10" defaultValue="all">
                <option value="all">Todos los instrumentos</option>
                <option value="rubrica">Rúbrica</option>
                <option value="lista-cotejo">Lista de cotejo</option>
                <option value="escala">Escala estimativa</option>
                <option value="lista-ponderada">Lista ponderada</option>
              </Select>
              <Select className="h-10" defaultValue="all">
                <option value="all">Todos los estados</option>
                <option value="pending">Pendiente</option>
                <option value="partial">Parcial</option>
                <option value="complete">Completada</option>
              </Select>
              <Select className="h-10" defaultValue="recent">
                <option value="recent">Fecha (más reciente)</option>
                <option value="oldest">Fecha (más antigua)</option>
                <option value="name">Nombre</option>
              </Select>
              <Button size="icon" variant="outline" aria-label="Ordenar actividades">
                <SlidersHorizontal className="size-4" />
              </Button>
            </div>

            {activities.length === 0 ? (
              <div className="p-6 text-sm text-muted-foreground">
                Aun no hay actividades en este bloque.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-[64rem] w-full text-left text-sm">
                  <thead className="bg-muted/35 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Actividad</th>
                      <th className="px-4 py-3">Puntos</th>
                      <th className="px-4 py-3">Instrumento</th>
                      <th className="px-4 py-3">Fecha</th>
                      <th className="px-4 py-3">Estado</th>
                      <th className="px-4 py-3">Progreso</th>
                      <th className="px-4 py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activitySummaries.map(({ activity, scored }) => {
                      const progress = students.length > 0 ? Math.round((scored / students.length) * 100) : 0
                      const status = activityEvaluationStatus(scored, students.length)
                      const statusToneValue = activityEvaluationStatusTone(status)
                      return (
                        <tr
                          key={activity.id}
                          role="button"
                          tabIndex={0}
                          className="group cursor-pointer border-t border-border transition hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40"
                          aria-label={`Ver información de ${activity.name || 'la actividad'}`}
                          onClick={() => onOpenActivity(activity.id)}
                          onKeyDown={(event) => {
                            if (event.target !== event.currentTarget || (event.key !== 'Enter' && event.key !== ' ')) return
                            event.preventDefault()
                            onOpenActivity(activity.id)
                          }}
                        >
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <span className={cn('flex size-10 shrink-0 items-center justify-center rounded-full', activityIconTone(activity.instrumentType))}>
                                <ClipboardList className="size-5" />
                              </span>
                              <div className="min-w-0">
                                <span className="text-left font-black text-primary group-hover:underline">
                                  {activity.name || 'Actividad sin nombre'}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 font-black text-foreground">{activity.maxScore} pts</td>
                          <td className="px-4 py-4">
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                              <span className={cn('size-2 rounded-full', activityInstrumentDot(activity.instrumentType))} />
                              {activityInstrumentTitle(activity.instrumentType)}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-muted-foreground">{formatActivityDate(activity.date)}</td>
                          <td className="px-4 py-4"><Badge tone={statusToneValue}>{status}</Badge></td>
                          <td className="px-4 py-4">
                            <div className="min-w-28">
                              <p className="text-xs font-black text-primary">{scored} / {students.length}</p>
                              <p className="text-[11px] text-muted-foreground">evaluados</p>
                              <ProgressBar value={progress} className="mt-1.5 h-2" indicatorColor={progress >= 100 ? '#22c55e' : '#1d4ed8'} />
                              <p className="mt-1 text-[11px] font-bold text-muted-foreground">{progress}%</p>
                            </div>
                          </td>
                          <td className="px-4 py-4" onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                className="h-8 px-3"
                                onClick={() => onOpenActivity(activity.id, status === 'Completada' ? 'results' : 'evaluation')}
                              >
                                <Play className="size-3.5" />
                                {status === 'Pendiente' ? 'Calificar' : status === 'Parcial' ? 'Continuar' : 'Ver resultados'}
                              </Button>
                              <Button size="sm" variant="outline" className="h-8 px-3" aria-label="Editar actividad" onClick={() => onEditActivity(activity)}>
                                <Pencil className="size-4" />
                                Editar
                              </Button>
                              <Button size="sm" variant="destructive" className="h-8 px-3" aria-label="Eliminar actividad" onClick={() => onDeleteActivity(activity.id)}>
                                <Trash2 className="size-4" />
                                Eliminar
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="border-t border-border px-4 py-3 text-sm text-muted-foreground">
              Mostrando {activities.length === 0 ? 0 : 1} a {activities.length} de {activities.length} actividades
            </div>
          </div>
        </div>
      ) : null}
      {activeTab === 'students' ? (
        <div className="max-h-[calc(100vh-24rem)] overflow-auto p-3">
        <section className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <h3 className="font-black text-primary">Estudiantes del bloque</h3>
          </div>
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="w-14 px-4 py-3 text-center text-xs font-bold uppercase text-muted-foreground">#</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Estudiante</th>
                <th className="w-36 px-4 py-3 text-center text-xs font-bold uppercase text-muted-foreground">Total</th>
                <th className="w-36 px-4 py-3 text-center text-xs font-bold uppercase text-muted-foreground">Completadas</th>
                <th className="w-32 px-4 py-3 text-center text-xs font-bold uppercase text-muted-foreground">Pendientes</th>
                <th className="w-36 px-4 py-3 text-center text-xs font-bold uppercase text-muted-foreground">Estado</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => {
                const total = blockTotal({ records, activities, enrollmentId: student.enrollmentId, blockId, config })
                const completed = activities.filter((activity) => scoreForActivity(records, student.enrollmentId, activity.id)).length
                const pending = Math.max(activities.length - completed, 0)
                const status = completed === 0 ? 'Sin calificar' : total >= config.passingScore ? 'Aprobado' : 'En recuperación'
                return (
                  <tr key={student.enrollmentId} className="border-t border-border hover:bg-muted/20">
                    <td className="px-4 py-3 text-center text-muted-foreground">{student.listNumber ?? index + 1}</td>
                    <td className="px-4 py-3 font-bold text-foreground">{student.lastName}, {student.firstName}</td>
                    <td className="px-4 py-3 text-center text-lg font-black text-primary">{completed > 0 ? `${formatGrade(total)} / ${config.expectedBlockTotal}` : '—'}</td>
                    <td className="px-4 py-3 text-center font-bold">{completed}/{activities.length}</td>
                    <td className="px-4 py-3 text-center font-bold">{pending}</td>
                    <td className="px-4 py-3 text-center"><Badge tone={statusTone(status)}>{status}</Badge></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>
        </div>
      ) : null}

      {activeTab === 'stats' ? (
        <div className="max-h-[calc(100vh-24rem)] overflow-y-auto p-4">
        <section className="space-y-3">
          <h3 className="font-black text-foreground">Análisis del bloque</h3>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <BlockMetric icon={<TrendingUp className="size-5" />} label="Promedio" value={formatGrade(average)} helper={`/ ${config.expectedBlockTotal}`} tone="success" />
            <BlockMetric icon={<CheckCircle2 className="size-5" />} label="Aprobados" value={completedStudents} helper={`${students.length} estudiantes`} tone="default" />
            <BlockMetric icon={<Hourglass className="size-5" />} label="En riesgo" value={riskStudents} helper="requieren seguimiento" tone="warning" />
            <BlockMetric icon={<ClipboardList className="size-5" />} label="Pendientes" value={pendingActivities} helper="actividades con faltantes" tone="accent" />
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            <article className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Actividad con mejor resultado</p>
              <h3 className="mt-2 text-lg font-black text-primary">{bestActivity?.activity.name ?? 'Sin datos suficientes'}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {bestActivity ? `${formatGrade(bestActivity.averageScore)} / ${bestActivity.activity.maxScore}` : 'Califica una actividad para calcularlo.'}
              </p>
            </article>
            <article className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Actividad que requiere refuerzo</p>
              <h3 className="mt-2 text-lg font-black text-primary">{lowestActivity?.activity.name ?? 'Sin datos suficientes'}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {lowestActivity ? `${formatGrade(lowestActivity.averageScore)} / ${lowestActivity.activity.maxScore}` : 'Califica una actividad para calcularlo.'}
              </p>
            </article>
          </div>
        </section>
        </div>
      ) : null}
      </section>
    </div>
  )

}

function CellSaveIndicator({ state, evaluated }: { state?: GradeCellSaveState; evaluated?: boolean }) {
  const label = state === 'saving'
    ? 'Guardando...'
    : state === 'saved'
      ? 'Guardado'
      : state === 'error'
        ? 'Error al guardar · Reintenta'
        : evaluated
          ? 'Guardado'
          : 'Sin evaluar'

  return (
    <span
      aria-live="polite"
      className={cn(
        'h-3 text-[10px] font-bold leading-3',
        state === 'error' ? 'text-destructive' : state === 'saved' || evaluated ? 'text-success' : 'text-muted-foreground',
      )}
    >
      {label}
    </span>
  )
}

function ActivityDetailView({
  activity,
  cellSaveStates,
  courseTitle,
  initialTab = 'evaluation',
  onBack,
  onEditActivity,
  onSaveScore,
  records,
  periodName,
  saving,
  students,
}: {
  activity: GradingActivity
  cellSaveStates: Record<string, GradeCellSaveState>
  courseTitle: string
  initialTab?: ActivityDetailTab
  onBack: () => void
  onEditActivity: (activity: GradingActivity) => void
  onSaveScore: (enrollmentId: string, activity: GradingActivity, value: string, instrumentResult?: EvaluatedInstrumentResult | null) => Promise<boolean>
  records: GradeRecordRow[]
  periodName: string
  saving: boolean
  students: StudentGradeRow[]
}) {
  const block = competencyBlocks.find((item) => item.id === activity.competencyBlockId) ?? competencyBlocks[0]
  const [tab, setTab] = useState<ActivityDetailTab>(initialTab)
  const [studentIndex, setStudentIndex] = useState(0)
  const selectedStudent = students[studentIndex] ?? students[0] ?? null
  const average = averageActivityScore(records, students, activity)
  const evaluatedCount = students.filter((student) => scoreForActivity(records, student.enrollmentId, activity.id)).length
  const activityStatus = activityEvaluationStatus(evaluatedCount, students.length)
  const currentRecord = selectedStudent ? scoreForActivity(records, selectedStudent.enrollmentId, activity.id) : null
  const rubricConfiguration = activityRubricConfiguration(activity)
  const [levelSelections, setLevelSelections] = useState<Array<number | null>>([])
  const [observation, setObservation] = useState('')
  useEffect(() => {
    const saved = currentRecord?.instrumentResult?.selections
    setLevelSelections(saved?.length === rubricConfiguration.criteria.length
      ? saved.map((value) => Number.isInteger(value) && ((value >= 0 && value < rubricConfiguration.levels.length) || (value === -1 && rubricConfiguration.noApply)) ? value : null)
      : rubricConfiguration.criteria.map(() => null))
    setObservation(currentRecord?.instrumentResult?.observation ?? '')
  }, [activity.id, currentRecord?.id, selectedStudent?.enrollmentId])
  const evaluationResult = instrumentEvaluationResult(rubricConfiguration, levelSelections.map(value => value ?? NaN))
  const levelRows = rubricConfiguration.criteria.map((criterion,index) => ({
    criterion: {...criterion, maximum: evaluationResult?.applicableMaximums[index] ?? criterion.maximum},
    levelIndex: levelSelections[index] ?? null,
    points: evaluationResult?.criterionScores[index] ?? null,
  }))
  const instrumentComplete = evaluationResult !== null
  const totalRubricScore = evaluationResult?.score ?? null
  const distribution = gradeDistribution(records, students, activity)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-medium text-muted-foreground">
        <div className="flex flex-wrap items-center gap-2">
          <button className="text-primary hover:underline" onClick={onBack}>Calificaciones</button>
          <span>&gt;</span>
          <span>{block.shortName}</span>
          <span>&gt;</span>
          <span>Actividades</span>
          <span>&gt;</span>
          <span>{tab === 'results' ? 'Resultados' : 'Evaluación'}</span>
        </div>
        <button className="font-black text-primary hover:underline" onClick={onBack}>Salir</button>
      </div>

      <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3">
            <span className={cn('flex size-12 shrink-0 items-center justify-center rounded-full', activityIconTone(activity.instrumentType))}>
              <ClipboardList className="size-6" />
            </span>
            <div>
              <h2 className="text-2xl font-black text-foreground">{activity.name || 'Actividad sin nombre'}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{activityDescriptionText(activity.description || '') || 'Evaluación de presentación y dominio del tema'}</p>
              <p className="mt-2 text-xs font-bold text-muted-foreground">{courseTitle} · {periodName} · {block.shortName}</p>
            </div>
          </div>
          <Badge tone={activityEvaluationStatusTone(activityStatus)}>{activityStatus}</Badge>
        </div>

        <div className="mt-5 grid gap-4 border-t border-border pt-4 sm:grid-cols-3 lg:grid-cols-5">
          <InfoItem label="Valor" value={`${activity.maxScore} pts`} />
          <InfoItem label="Estudiantes" value={String(students.length)} />
          <InfoItem label="Instrumento" value={instrumentTitle(activity.instrumentType || '')} />
          <InfoItem label="Fecha" value={formatActivityDate(activity.date)} />
          <InfoItem label="Momento" value={activityMomentTitle(activity.planningMoment)} />
        </div>
      </section>

      <div className="flex flex-wrap gap-6 border-b border-border text-sm font-black text-muted-foreground">
        {([
          ['evaluation', 'Evaluación'],
          ['results', 'Resultados'],
          ['details', 'Detalles'],
        ] as const).map(([id, label]) => (
          <button
            key={id}
            className={cn('border-b-2 border-transparent px-1 py-3 transition hover:text-primary', tab === id ? 'border-primary text-primary' : null)}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'evaluation' ? (
        activity.instrumentType ? (
          <ActivityEvaluationPanel
            activity={activity}
            blockName={block.shortName}
            courseTitle={courseTitle}
            currentRecord={currentRecord}
            noApply={rubricConfiguration.noApply}
            levelRows={levelRows}
            levelLabels={rubricConfiguration.levels}
            instrumentComplete={instrumentComplete}
            observation={observation}
            onChangeObservation={setObservation}
            onSaveScore={onSaveScore}
            onSelectLevel={(criterionIndex, levelIndex) => setLevelSelections((current) => rubricConfiguration.criteria.map((_, index) => index === criterionIndex ? levelIndex : current[index] ?? null))}
            periodName={periodName}
            saving={saving}
            selectedStudent={selectedStudent}
            setStudentIndex={setStudentIndex}
            setTab={setTab}
            studentIndex={studentIndex}
            students={students}
            totalRubricScore={totalRubricScore}
          />
        ) : (
          <QuickActivityGradePanel
            activity={activity}
            cellSaveStates={cellSaveStates}
            onSaveScore={onSaveScore}
            records={records}
            students={students}
          />
        )
      ) : null}

      {tab === 'results' ? (
        <ActivityResultsPanel
          activity={activity}
          average={average}
          distribution={distribution}
          evaluatedCount={evaluatedCount}
          onEvaluate={(index) => { setStudentIndex(index); setTab('evaluation') }}
          records={records}
          students={students}
        />
      ) : null}

      {tab === 'details' ? (
        <section className="grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Información de actividad</p>
            <dl className="mt-4 grid gap-4 text-sm">
              <InfoItem label="Competencia" value={block.name} />
              <InfoItem label="Valor" value={`${activity.maxScore} puntos`} />
              <InfoItem label="Promedio" value={`${formatGrade(average)} / ${activity.maxScore}`} />
              <InfoItem label="Fecha" value={activity.date || 'Sin fecha'} />
              <InfoItem label="Momento de planificación" value={activityMomentTitle(activity.planningMoment)} />
              <InfoItem label="Instrumento" value={instrumentTitle(activity.instrumentType || '')} />
              <InfoItem label="Técnica de evaluación" value={activity.evaluationTechnique || 'Sin técnica'} />
            </dl>
          </div>
          <div className="rounded-lg border border-border bg-card p-5 text-sm leading-7 text-muted-foreground shadow-sm">
            <ActivityDescriptionContent value={activity.description} fallback="No hay descripción detallada para esta actividad." />
            <Button variant="outline" className="mt-4" onClick={() => onEditActivity(activity)}>
              <Pencil className="size-4" />
              Editar actividad
            </Button>
          </div>
        </section>
      ) : null}
    </div>
  )
}

function QuickActivityGradePanel({
  activity,
  cellSaveStates,
  onSaveScore,
  records,
  students,
}: {
  activity: GradingActivity
  cellSaveStates: Record<string, GradeCellSaveState>
  onSaveScore: (enrollmentId: string, activity: GradingActivity, value: string, instrumentResult?: EvaluatedInstrumentResult | null) => Promise<boolean>
  records: GradeRecordRow[]
  students: StudentGradeRow[]
}) {
  const evaluated = students.filter((student) => scoreForActivity(records, student.enrollmentId, activity.id)).length
  const average = averageActivityScore(records, students, activity)

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm" aria-labelledby="quick-grade-title">
      <header className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 id="quick-grade-title" className="font-black text-foreground">Entrada rápida de notas</h3>
          <p className="mt-1 text-xs text-muted-foreground">Fallback para actividades antiguas sin instrumento. Escribe una nota y pulsa Enter para avanzar.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <Badge tone="success">{evaluated} evaluados</Badge>
          <Badge tone="warning">{students.length - evaluated} pendientes</Badge>
          <Badge tone="default">Promedio {formatGrade(average)}</Badge>
        </div>
      </header>

      <div className="hidden grid-cols-[3.5rem_minmax(0,1fr)_8rem_8rem] gap-3 border-b border-border bg-muted/35 px-4 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground sm:grid">
        <span>N.º</span><span>Estudiante</span><span className="text-center">Nota</span><span>Estado</span>
      </div>
      <ol className="divide-y divide-border">
        {students.map((student, index) => {
          const record = scoreForActivity(records, student.enrollmentId, activity.id)
          const saveState = cellSaveStates[activityGradeCellKey(student.enrollmentId, activity.id)]
          const studentName = `${student.firstName} ${student.lastName}`
          return (
            <li key={student.enrollmentId} className="grid grid-cols-[2.75rem_minmax(0,1fr)_6.75rem] items-center gap-2 px-3 py-3 sm:grid-cols-[3.5rem_minmax(0,1fr)_8rem_8rem] sm:gap-3 sm:px-4">
              <span className="font-black tabular-nums text-muted-foreground">{String(student.listNumber ?? index + 1).padStart(2, '0')}</span>
              <span className="min-w-0 font-bold text-foreground"><span className="block truncate">{studentName}</span><span className="mt-0.5 block text-[10px] font-semibold text-muted-foreground sm:hidden">{record ? 'Evaluado' : 'Sin evaluar'}</span></span>
              <label className="relative">
                <span className="sr-only">Nota de {studentName}, máximo {activity.maxScore}</span>
                <Input
                  aria-invalid={saveState === 'error' || undefined}
                  className="grade-cell h-11 pr-8 text-center font-black tabular-nums"
                  defaultValue={record?.score ?? ''}
                  disabled={saveState === 'saving'}
                  inputMode="decimal"
                  max={activity.maxScore}
                  min={0}
                  onBlur={(event) => {
                    const value = event.target.value
                    const score = value.trim() === '' ? null : Number(value)
                    if (!scoreNeedsPersistence(record?.score, score)) return
                    onSaveScore(student.enrollmentId, activity, value, null)
                  }}
                  onFocus={(event) => event.currentTarget.select()}
                  onKeyDown={focusNextGradeCell}
                  placeholder="—"
                  step="0.01"
                  type="number"
                />
                <span aria-hidden="true" className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">/{activity.maxScore}</span>
              </label>
              <span className="col-span-3 min-h-3 sm:col-span-1">
                <CellSaveIndicator evaluated={Boolean(record)} state={saveState} />
              </span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

function ActivityEvaluationPanel({
  noApply,
  activity,
  blockName,
  courseTitle,
  currentRecord,
  levelRows,
  levelLabels,
  instrumentComplete,
  observation,
  onChangeObservation,
  onSaveScore,
  onSelectLevel,
  periodName,
  saving,
  selectedStudent,
  setStudentIndex,
  setTab,
  studentIndex,
  students,
  totalRubricScore,
}: {
  activity: GradingActivity
  blockName: string
  courseTitle: string
  currentRecord: GradeRecordRow | null
  noApply: boolean
  levelRows: Array<{ criterion: { title: string; description: string; maximum: number; descriptors?: string[] }; levelIndex: number | null; points: number | null }>
  levelLabels: Array<{ label: string; points: number }>
  instrumentComplete: boolean
  observation: string
  onChangeObservation: (value: string) => void
  onSaveScore: (enrollmentId: string, activity: GradingActivity, value: string, instrumentResult?: EvaluatedInstrumentResult | null) => Promise<boolean>
  onSelectLevel: (criterionIndex: number, levelIndex: number) => void
  periodName: string
  saving: boolean
  selectedStudent: StudentGradeRow | null
  setStudentIndex: Dispatch<SetStateAction<number>>
  setTab: Dispatch<SetStateAction<ActivityDetailTab>>
  studentIndex: number
  students: StudentGradeRow[]
  totalRubricScore: number | null
}) {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const workspaceRef = useRef<HTMLElement>(null)

  useEffect(() => setSaveStatus('idle'), [selectedStudent?.enrollmentId])

  const saveCurrentScore = async () => {
    if (!selectedStudent || totalRubricScore === null) return false
    setSaveStatus('saving')
    const saved = await onSaveScore(selectedStudent.enrollmentId, activity, String(totalRubricScore), {
      instrumentType: activity.instrumentType ?? '',
      selections: levelRows.map((row) => row.levelIndex!),
      criterionScores: levelRows.map((row) => row.points!),
      applicableMaximums: levelRows.map(row => row.criterion.maximum),
      instrumentSnapshotId: activity.instrumentSnapshotId,
      snapshotVersion: activity.instrumentSnapshotVersion,
      completedAt: new Date().toISOString(),
      observation: observation.trim() || undefined,
    })
    setSaveStatus(saved ? 'saved' : 'error')
    return saved
  }

  return (
    <section ref={workspaceRef} className="space-y-4">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 sm:gap-3">
        <Button aria-label="Estudiante anterior" variant="outline" disabled={studentIndex <= 0 || saveStatus === 'saving'} onClick={() => setStudentIndex((current) => Math.max(0, current - 1))}>
          <BackIcon />
          <span className="hidden sm:inline">Anterior</span>
        </Button>
        <Select value={String(studentIndex)} onChange={(event) => setStudentIndex(Number(event.target.value))} className="h-12 text-center font-black">
          {students.map((student, index) => (
            <option key={student.enrollmentId} value={index}>
              {index + 1} / {students.length} - {student.firstName}
            </option>
          ))}
        </Select>
        <Button aria-label="Estudiante siguiente" className="justify-self-end" variant="outline" disabled={studentIndex >= students.length - 1 || saveStatus === 'saving'} onClick={() => setStudentIndex((current) => Math.min(students.length - 1, current + 1))}>
          <span className="hidden sm:inline">Siguiente</span>
          <ArrowRight className="size-4" />
        </Button>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(17rem,35%)_minmax(0,65%)]">
        <aside className="space-y-4 rounded-2xl border border-border bg-card p-4 shadow-sm lg:sticky lg:top-4">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-full bg-primary/10 text-lg font-black text-primary">{studentInitials(selectedStudent)}</span>
            <div className="min-w-0"><h3 className="truncate font-black text-foreground">{selectedStudent ? `${selectedStudent.firstName} ${selectedStudent.lastName}` : 'Sin estudiante'}</h3><p className="text-xs text-muted-foreground">N.º {selectedStudent?.listNumber ?? studentIndex + 1} · {studentIndex + 1} de {students.length}</p></div>
          </div>
          <dl className="grid gap-3 border-t border-border pt-4 text-sm">
            <InfoItem label="Actividad" value={activity.name} />
            <InfoItem label="Curso / asignatura" value={courseTitle} />
            <InfoItem label="Período y bloque" value={`${periodName} · ${blockName}`} />
            <InfoItem label="Valor" value={`${activity.maxScore} puntos`} />
            <InfoItem label="Fecha" value={formatActivityDate(activity.date)} />
          </dl>
          <div className="border-t border-border pt-4 text-sm leading-6 text-muted-foreground"><ActivityDescriptionContent value={activity.description} fallback="Sin descripción." /></div>
        </aside>

      <div className="min-w-0 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-full bg-primary/10 text-lg font-black text-primary">
              {studentInitials(selectedStudent)}
            </span>
            <div>
              <h3 className="font-black text-foreground">{selectedStudent ? `${selectedStudent.firstName} ${selectedStudent.lastName}` : 'Sin estudiante'}</h3>
              <p className="mt-1 text-xs text-muted-foreground">Código: {selectedStudent?.studentCode || 'N/D'}</p>
            </div>
          </div>
          <Badge tone={currentRecord ? 'success' : 'default'}>{currentRecord ? 'Evaluado' : 'En progreso'}</Badge>
        </div>

        <div className="border-b border-border p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
            {instrumentTitle(activity.instrumentType || 'rubrica')} - {levelRows.length} criterios - Total {activity.maxScore} pts
          </p>
        </div>

        {currentRecord && !currentRecord.instrumentResult ? <p className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold text-amber-800">Esta calificación histórica conserva el total, pero no el desglose por criterio. Selecciona los niveles para registrar su evidencia evaluada.</p> : null}

        <div className={cn('overflow-x-auto', instrumentTypographyClass(activity.instrumentType, activity.instrumentCriteria ?? {}))}>
          <table className="min-w-[52rem] w-full text-sm">
            <thead className="bg-muted/35 text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
              <tr>
                <th rowSpan={2} className="w-[16rem] border-b border-r border-border px-4 py-3 text-left">Criterios</th>
                <th colSpan={levelLabels.length + (noApply ? 1 : 0)} className="border-b border-r border-border px-4 py-2 text-center">{activity.instrumentType === 'escala' ? 'Niveles de la escala' : 'Niveles de desempeño'}</th>
                <th rowSpan={2} className="w-28 border-b border-border px-4 py-3 text-center">Puntaje</th>
              </tr>
              <tr>
                {levelLabels.map((level, index) => {
                  const visual = activity.instrumentType === 'escala' ? scaleLevelVisual(getBlockAccent(activity.competencyBlockId), index, levelLabels.length) : activity.instrumentType === 'lista-ponderada' ? weightedResponseVisual(index, levelLabels.length) : rubricLevelVisual(index, levelLabels.length)
                  return <th key={level.label} className="border-b border-r px-3 py-2 text-center" style={{ backgroundColor: visual.background, borderColor: visual.border, color: visual.foreground }}>
                    <span className="block font-black">{level.label}</span>
                    <span className="font-bold opacity-80">Valor relativo: {formatGrade(level.points)}</span>
                  </th>
                })}
                {noApply ? <th className="border border-border px-3 py-2">No aplica</th> : null}
              </tr>
            </thead>
            <tbody>
              {levelRows.map((row, criterionIndex) => (
                <tr key={row.criterion.title} className="border-b border-border">
                  <td className="border-r border-border px-4 py-4">
                    <p className="font-black text-foreground">{criterionIndex + 1}. {row.criterion.title}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{row.criterion.description}</p>
                  </td>
                  {levelLabels.map((level, levelIndex) => (
                    <td key={level.label} className="border-r border-border px-4 py-4 text-center">
                      <button type="button" aria-label={`${row.criterion.title}: ${level.label}`} aria-pressed={row.levelIndex === levelIndex} onClick={() => onSelectLevel(criterionIndex, levelIndex)} className={cn(
                        'inline-flex min-h-24 w-full min-w-28 flex-col items-center justify-center gap-1 rounded-xl border-2 px-2 py-3 text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        row.levelIndex === levelIndex ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card text-muted-foreground hover:border-primary/50',
                      )}>
                        <span className="font-black">{level.label} · {formatGrade(row.criterion.maximum * level.points / Math.max(...levelLabels.map(item => item.points)))} pts</span>
                        {row.criterion.descriptors?.[levelIndex] ? <span className="leading-4">{row.criterion.descriptors[levelIndex]}</span> : null}
                      </button>
                    </td>
                  ))}
                  {noApply ? <td className="border-r border-border p-3 text-center"><Button variant="outline" aria-label={row.criterion.title + ': No aplica'} aria-pressed={row.levelIndex === -1} onClick={() => onSelectLevel(criterionIndex,-1)}>No aplica{row.levelIndex === -1 ? ' ✓' : ''}</Button></td> : null}
                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex h-10 min-w-20 items-center justify-center rounded-lg border border-border bg-card px-3 font-black text-primary">
                      {row.points === null ? '—' : formatGrade(row.points)} / {formatGrade(row.criterion.maximum)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-border p-4">
          <label className="text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">Observación (opcional)</label>
          <Textarea aria-label="Observación (opcional)" value={observation} onChange={(event) => onChangeObservation(event.target.value)} className="mt-2 min-h-20" placeholder="Escribe una observación sobre el desempeño del estudiante..." />
        </div>

        <div className="flex flex-col gap-3 border-t border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <p role="status" className={cn('inline-flex items-center gap-2 text-xs font-bold', saveStatus === 'error' ? 'text-destructive' : saveStatus === 'saved' ? 'text-success' : 'text-muted-foreground')}>
            {saveStatus === 'saved' ? <CheckCircle2 className="size-4" /> : null}
            {saveStatus === 'saving' ? 'Guardando…' : saveStatus === 'saved' ? 'Guardado ✓' : saveStatus === 'error' ? 'No se pudo guardar. Intenta de nuevo.' : 'Los cambios se guardan al confirmar.'}
          </p>
          <div className="flex items-center gap-4">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">Puntaje total</p>
            <p className="text-3xl font-black text-primary">{totalRubricScore === null ? currentRecord?.score ?? '—' : formatGrade(totalRubricScore)} <span className="text-base text-muted-foreground">/ {activity.maxScore} pts</span></p>
          </div>
        </div>
      </div>
      </div>

      {levelRows.length > 0 && levelRows.every(row => row.levelIndex === -1) ? <p role="alert" className="rounded-xl border border-warning/40 bg-warning/10 p-3">Todos los criterios están marcados como No aplica. Selecciona al menos un criterio aplicable para guardar una calificación.</p> : null}
      <footer className="sticky bottom-2 z-30 flex flex-col-reverse gap-2 rounded-2xl border border-border bg-card/95 p-3 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-end">
        <Button disabled={saving || saveStatus === 'saving' || !instrumentComplete} variant="outline" onClick={async () => {
          if (await saveCurrentScore()) setTab('results')
        }}>
          Guardar y salir
        </Button>
        <Button disabled={saving || saveStatus === 'saving' || !instrumentComplete} onClick={async () => {
          if (!await saveCurrentScore()) return
          setStudentIndex((current) => Math.min(students.length - 1, current + 1))
          window.requestAnimationFrame(() => {
            if (typeof workspaceRef.current?.scrollIntoView === 'function') workspaceRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
          })
        }}>
          {saveStatus === 'saving' ? 'Guardando…' : saveStatus === 'saved' ? 'Guardado ✓' : 'Guardar y siguiente →'}
        </Button>
      </footer>
    </section>
  )
}

function ActivityResultsPanel({
  activity,
  average,
  distribution,
  evaluatedCount,
  onEvaluate,
  records,
  students,
}: {
  activity: GradingActivity
  average: number | null
  distribution: Array<{ color: string; count: number; label: string; percent: number }>
  evaluatedCount: number
  onEvaluate: (studentIndex: number) => void
  records: GradeRecordRow[]
  students: StudentGradeRow[]
}) {
  return (
    <section className="space-y-4">
      <header className="rounded-2xl bg-card p-4 shadow-sm">
        <p className="text-xs font-bold text-primary">Resultados de la actividad</p>
        <h3 className="mt-1 text-xl font-black text-foreground">{activity.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{activity.maxScore} pts · {evaluatedCount}/{students.length} evaluados · Promedio {formatGrade(average)}</p>
      </header>
      <div className="grid gap-3 md:grid-cols-3">
        <BlockMetric icon={<Users className="size-5" />} label="Evaluados" value={`${evaluatedCount} / ${students.length}`} helper="" tone="default" />
        <BlockMetric icon={<ClipboardList className="size-5" />} label="Promedio general" value={`${formatGrade(average)} / ${activity.maxScore}`} helper="" tone="success" />
        <BlockMetric icon={<BarChart3 className="size-5" />} label="Porcentaje promedio" value={`${average ? Math.round((average / activity.maxScore) * 100) : 0}%`} helper="" tone="accent" />
      </div>

      <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <h3 className="text-lg font-black text-primary">Distribución de calificaciones</h3>
        <div className="mt-4 space-y-4">
          {distribution.map((item) => (
            <div key={item.label} className="grid gap-3 sm:grid-cols-[12rem_1fr_5rem] sm:items-center">
              <p className="text-sm font-bold text-muted-foreground">{item.label}</p>
              <ProgressBar value={item.percent} indicatorColor={item.color} />
              <p className="text-sm font-bold text-muted-foreground">{item.count} ({item.percent}%)</p>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="border-b border-border p-4">
          <h3 className="text-lg font-black text-primary">Lista de estudiantes</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-[minmax(12rem,1fr)_14rem]">
            <label className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="h-10 pl-9" placeholder="Buscar estudiante..." />
            </label>
            <Select className="h-10" defaultValue="all">
              <option value="all">Todos los niveles</option>
              <option value="excellent">Excelente</option>
              <option value="good">Bueno</option>
              <option value="pending">Pendiente</option>
            </Select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[44rem] w-full text-sm">
            <thead className="bg-muted/35 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              <tr>
                <th className="w-12 px-4 py-3">#</th>
                <th className="px-4 py-3 text-left">Estudiante</th>
                <th className="px-4 py-3">Puntaje</th>
                <th className="px-4 py-3">Porcentaje</th>
                <th className="px-4 py-3">Nivel</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => {
                const record = scoreForActivity(records, student.enrollmentId, activity.id)
                const score = record?.score ?? null
                const percent = score !== null && activity.maxScore > 0 ? Math.round((score / activity.maxScore) * 100) : null
                const level = score !== null ? gradeLevel(score, activity.maxScore) : 'Pendiente'
                return (
                  <tr key={student.enrollmentId} className="border-t border-border">
                    <td className="px-4 py-3 text-muted-foreground">{student.listNumber ?? index + 1}</td>
                    <td className="px-4 py-3 font-bold text-foreground">{student.firstName} {student.lastName}</td>
                    <td className="px-4 py-3 font-bold text-primary">{score !== null ? `${formatGrade(score)} / ${activity.maxScore}` : '—'}</td>
                    <td className="px-4 py-3 font-bold">{percent !== null ? `${percent}%` : '—'}</td>
                    <td className="px-4 py-3"><span className={cn('font-bold', gradeLevelTextColor(level))}>{level}</span></td>
                    <td className="px-4 py-3"><span className={score !== null ? 'font-bold text-emerald-700' : 'font-bold text-muted-foreground'}>{score !== null ? 'Evaluado' : 'Pendiente'}</span></td>
                    <td className="px-4 py-3 text-right"><Button size="sm" variant="outline" onClick={() => onEvaluate(index)}>{score !== null ? 'Editar evaluación' : 'Calificar'}</Button></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

function PeriodSummaryView({
  blockSummaries,
  config,
  courseTitle,
  periodShortName,
  records,
  recoveryScores,
  students,
}: {
  blockSummaries: Array<{
    block: (typeof competencyBlocks)[number]
    index: number
    activities: GradingActivity[]
    average: number | null
    gradingProgress: number
    expected: number
    status: string
  }>
  config: GradeCalculationConfig
  courseTitle: string
  periodShortName: string
  records: GradeRecordRow[]
  recoveryScores: RecoveryScores
  students: StudentGradeRow[]
}) {
  const activities = [...new Map(blockSummaries.flatMap((summary) => summary.activities).map((activity) => [activity.id, activity])).values()]
  const rows = buildCompactGradeRows(students, activities, records, activeEvaluationProfile)
  const evaluatedCells = students.reduce((total, student) => total + activities.filter((activity) => scoreForActivity(records, student.enrollmentId, activity.id)).length, 0)
  const coverage = students.length && activities.length ? Math.round(evaluatedCells / (students.length * activities.length) * 100) : 0
  const groupAverage = averageNumbers(rows.map((row) => row.average).filter((value): value is number => value !== null))
  const studentsWithResults = rows.filter((row) => row.average !== null).length
  const followUp = rows.filter((row) => row.average !== null && row.average < config.passingScore).length

  return (
    <section className="space-y-4">
      <header className="rounded-2xl bg-card p-5 shadow-sm">
        <p className="text-xs font-bold text-primary">Vista del período</p>
        <h2 className="mt-1 text-2xl font-black text-foreground">{periodShortName}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{courseTitle} · Desempeño del grupo en las cuatro competencias.</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <BlockMetric icon={<TrendingUp className="size-5" />} label="Promedio general" value={formatGrade(groupAverage)} helper="del período" tone="success" />
        <BlockMetric icon={<Users className="size-5" />} label="Con resultados" value={`${studentsWithResults}/${students.length}`} helper="estudiantes" tone="default" />
        <BlockMetric icon={<CheckCircle2 className="size-5" />} label="Evaluación completada" value={`${coverage}%`} helper="de registros" tone="accent" />
        <BlockMetric icon={<Hourglass className="size-5" />} label="Requieren seguimiento" value={followUp} helper="estudiantes" tone="warning" />
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {blockSummaries.map((summary) => {
          const accent = blockAccents[summary.index]
          const hasRecovery = Object.values(recoveryScores[summary.block.id] ?? {}).some((value) => typeof value === 'number')
          const progress = summary.gradingProgress
          return (
            <article
              key={summary.block.id}
              className="rounded-2xl bg-card p-4 shadow-sm"
            >
              <p className={cn('text-xs font-bold', accent.text)}>
                C{summary.index + 1}
              </p>
              <h3 className="mt-1.5 text-pretty text-base font-extrabold leading-6 text-primary sm:text-lg">
                {blockShortNames[summary.block.id]}
              </h3>

              {summary.average === null ? (
                <div className="mt-5 flex items-center gap-3">
                  <span className={cn('grid size-10 shrink-0 place-items-center rounded-xl', accent.panel)} aria-hidden="true">
                    <Hourglass className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      {summary.status === 'Sin actividades' ? 'Aún sin actividades' : 'Pendiente de calificar'}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {summary.status === 'Sin actividades' ? 'Agrega una actividad para comenzar.' : 'Registra las primeras calificaciones.'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-5">
                  <div className="flex items-end justify-between gap-3">
                    <p className="text-2xl font-extrabold leading-none text-primary tabular-nums">
                      {formatGrade(summary.average)} <span className="text-sm font-semibold text-muted-foreground">/ {summary.expected}</span>
                    </p>
                    <span className="text-xs text-muted-foreground">Promedio</span>
                  </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-border" aria-label={`${progress}% de calificaciones registradas`}>
                      <span className={cn('block h-full rounded-full', accent.progress)} style={{ width: `${progress}%` }} />
                    </div>
                    <p className="mt-1 text-right text-xs text-muted-foreground">{progress}% calificado</p>
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-3">
                <Badge tone={statusTone(summary.status)}>{summary.status}</Badge>
                {hasRecovery ? <Badge tone="warning">RP · Nota de recuperación</Badge> : null}
              </div>
            </article>
          )
        })}
      </div>

      <div className="max-h-[65vh] overflow-auto rounded-2xl border border-border bg-card shadow-sm">
        <table className="min-w-[48rem] w-full border-separate border-spacing-0 text-sm">
          <thead><tr className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground"><th className="sticky left-0 top-0 z-30 w-14 border-b border-r border-border bg-muted px-3 py-3">N.º</th><th className="sticky left-14 top-0 z-30 min-w-56 border-b border-r border-border bg-muted px-4 py-3 text-left">Estudiante</th>{competencyBlocks.map((block, index) => <th key={block.id} className="sticky top-0 z-20 border-b border-r border-border bg-muted px-4 py-3">C{index + 1}</th>)}<th className="sticky top-0 z-20 border-b border-border bg-primary-light px-4 py-3 text-primary">{periodShortName}</th></tr></thead>
          <tbody>{rows.map((row) => <tr key={row.enrollmentId} className="group hover:bg-muted/20"><td className="sticky left-0 z-10 border-b border-r border-border bg-card px-3 py-3 text-center text-muted-foreground group-hover:bg-muted/20">{row.listNumber}</td><td className="sticky left-14 z-10 border-b border-r border-border bg-card px-4 py-3 font-bold text-foreground group-hover:bg-muted/20">{row.lastName}, {row.firstName}</td>{competencyBlocks.map((block) => <td key={block.id} className="border-b border-r border-border px-4 py-3 text-center font-bold">{formatGrade(row.blockAverages[block.id])}</td>)}<td className="border-b border-border bg-primary/[0.035] px-4 py-3 text-center font-black text-primary">{formatGrade(row.average)}</td></tr>)}</tbody>
        </table>
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
      <header className="flex flex-col gap-4 rounded-2xl bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex min-w-0 items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-light text-primary" aria-hidden="true">
            <CalendarDays className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold text-primary">Matriz anual por períodos</p>
            <h2 className="mt-0.5 text-2xl font-extrabold tracking-tight text-foreground">Registro anual de competencias</h2>
            <p className="mt-1 text-sm leading-5 text-muted-foreground">
            P1, P2, P3 y P4 conservan la nota ordinaria. RP sustituye esa nota solo para el cálculo final.
            </p>
          </div>
        </div>
        <Button variant="outline" className="h-10 self-start px-4 !shadow-none sm:self-auto" onClick={() => window.print()}>
          <Download className="size-4" />
          Descargar
        </Button>
      </header>

      <div className="overflow-hidden rounded-2xl bg-card shadow-sm">
        <div className="flex flex-col gap-2 border-b border-border px-4 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>Las columnas de estudiantes permanecen visibles mientras recorres los períodos.</span>
          <span className="flex items-center gap-3 whitespace-nowrap">
            <span><strong className="text-primary">P</strong> · Período</span>
            <span><strong className="text-foreground">RP</strong> · Recuperación</span>
          </span>
        </div>
        <div className="max-h-[68vh] overflow-auto">
          <table className="min-w-[1900px] border-separate border-spacing-0 text-xs [&_td]:border-border/60 [&_th]:border-border/60">
            <thead>
              <tr>
                <th rowSpan={2} className="sticky left-0 top-0 z-50 w-12 border-b border-r border-border bg-muted/90 px-2 py-3 text-center font-extrabold text-muted-foreground">#</th>
                <th rowSpan={2} className="sticky left-12 top-0 z-50 min-w-[14rem] border-b border-r border-border bg-muted/90 px-4 py-3 text-left font-extrabold text-foreground shadow-[8px_0_16px_-14px_rgba(15,23,42,.45)]">Estudiantes</th>
                {competencyBlocks.map((block, index) => (
                  <th key={block.id} colSpan={8} className={cn('sticky top-0 z-40 border-b border-r border-border px-3 py-3 text-center font-extrabold leading-5', blockAccents[index].panel)}>
                    {block.shortName}: {blockShortNames[block.id]}
                  </th>
                ))}
                <th colSpan={4} className="sticky top-0 z-40 border-b border-r border-border bg-primary-light px-3 py-3 text-center font-extrabold text-primary">Promedios por competencia</th>
                <th rowSpan={2} className="sticky top-0 z-40 w-24 border-b border-r border-border bg-primary-light px-3 py-3 text-center font-extrabold text-primary">Calificación final</th>
                <th rowSpan={2} className="sticky top-0 z-40 w-28 border-b border-border bg-muted/90 px-3 py-3 text-center font-extrabold text-muted-foreground">Estado</th>
              </tr>
              <tr>
                {competencyBlocks.flatMap((block) =>
                  periods.flatMap((period, periodIndex) => [
                    <th key={`${block.id}-${period.id}`} className={cn('sticky top-16 z-30 border-b border-r border-border bg-card px-2 py-2 text-center font-bold text-primary', periodIndex === 0 ? 'border-l-2' : null)}>{period.shortName}</th>,
                    <th key={`${block.id}-${period.id}-rp`} className="sticky top-16 z-30 border-b border-r border-border bg-muted/40 px-2 py-2 text-center font-bold text-muted-foreground">{period.recoveryLabel}</th>,
                  ]),
                )}
                {competencyBlocks.map((block) => (
                  <th key={`${block.id}-pc`} className="sticky top-16 z-30 border-b border-r border-border bg-card px-2 py-2 text-center font-black text-primary">{block.shortName}</th>
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
                  <tr key={student.enrollmentId} className="group transition-colors hover:bg-muted/15">
                    <td className="sticky left-0 z-20 border-b border-r border-border bg-card px-2 py-3 text-center text-muted-foreground group-hover:bg-muted/15">{student.listNumber ?? index + 1}</td>
                    <td className="sticky left-12 z-20 border-b border-r border-border bg-card px-4 py-3 font-bold text-foreground shadow-[8px_0_16px_-14px_rgba(15,23,42,.35)] group-hover:bg-muted/15">
                      {student.lastName}, {student.firstName}
                    </td>
                    {competencyBlocks.flatMap((block) =>
                      periods.flatMap((period, periodIndex) => {
                        const result = getStudentPeriodBlockScore({
                          blockId: block.id,
                          config,
                          getActivitiesForPeriod,
                          periodId: period.id as CompetencyPeriodId,
                          recordsByPeriod,
                          student,
                        })
                        return [
                          <td key={`${student.enrollmentId}-${block.id}-${period.id}`} className={cn('border-b border-r border-border px-2 py-3 text-center font-bold', periodIndex === 0 ? 'border-l-2' : null, gradeColor(result.period, config))}>
                            {formatGrade(result.period)}
                          </td>,
                          <td key={`${student.enrollmentId}-${block.id}-${period.id}-rp`} className={cn('border-b border-r border-border bg-muted/15 px-2 py-3 text-center font-bold', result.recovery !== null ? 'bg-emerald-50 text-emerald-700' : 'text-muted-foreground')}>
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

      <aside className="flex gap-3 rounded-2xl bg-primary-light/60 px-4 py-3 text-sm leading-5 text-primary">
        <Calculator className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <p>La calificación final promedia las cuatro competencias específicas. La recuperación sustituye la nota del período correspondiente.</p>
      </aside>
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
  const periods = competencyPeriods.filter((period) => period.id !== 'final')
  const studentResults = props.students.map((student, index) => {
    const periodScores = periods.map((period) => finalSubjectScore(competencyBlocks.map((block) => getStudentPeriodBlockScore({ blockId: block.id, config: props.config, getActivitiesForPeriod: props.getActivitiesForPeriod, periodId: period.id as CompetencyPeriodId, recordsByPeriod: props.recordsByPeriod, student }).effective), props.config))
    const annualBlocks = competencyBlocks.map((block) => finalBlockAverage(periods.map((period) => getStudentPeriodBlockScore({ blockId: block.id, config: props.config, getActivitiesForPeriod: props.getActivitiesForPeriod, periodId: period.id as CompetencyPeriodId, recordsByPeriod: props.recordsByPeriod, student }).effective), props.config))
    return { student, listNumber: student.listNumber ?? index + 1, periodScores, annual: finalSubjectScore(annualBlocks, props.config) }
  })
  const completeStudents = studentResults.filter((result) => result.periodScores.every((score) => score !== null)).length
  const pendingStudents = studentResults.length - completeStudents
  const reviewStudents = studentResults.filter((result) => result.annual !== null && result.annual < props.config.passingScore).length
  const groupFinalAverage = averageNumbers(studentResults.map((result) => result.annual).filter((value): value is number => value !== null))

  return (
    <section className="space-y-4">
      <header className="rounded-2xl bg-card p-5 shadow-sm"><p className="text-xs font-bold text-primary">Resumen final</p><h2 className="mt-1 text-2xl font-black text-foreground">Resultado anual de la asignatura</h2><p className="mt-1 text-sm text-muted-foreground">Los períodos futuros o sin evaluar permanecen como —.</p></header>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <BlockMetric icon={<TrendingUp className="size-5" />} label="Promedio del grupo" value={formatGrade(groupFinalAverage)} helper="resultado anual" tone="success" />
        <BlockMetric icon={<CheckCircle2 className="size-5" />} label="Resultado completo" value={completeStudents} helper={`${props.students.length} estudiantes`} tone="default" />
        <BlockMetric icon={<Hourglass className="size-5" />} label="Pendientes" value={pendingStudents} helper="con períodos faltantes" tone="warning" />
        <BlockMetric icon={<AlertCircle className="size-5" />} label="Requieren revisión" value={reviewStudents} helper="bajo el mínimo" tone="warning" />
      </div>

      <div className="max-h-[65vh] overflow-auto rounded-2xl border border-border bg-card shadow-sm"><table className="min-w-[52rem] w-full border-separate border-spacing-0 text-sm"><thead><tr className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground"><th className="sticky left-0 top-0 z-30 w-14 border-b border-r border-border bg-muted px-3 py-3">N.º</th><th className="sticky left-14 top-0 z-30 min-w-56 border-b border-r border-border bg-muted px-4 py-3 text-left">Estudiante</th>{periods.map((period) => <th key={period.id} className="sticky top-0 z-20 border-b border-r border-border bg-muted px-4 py-3">{period.shortName}</th>)}<th className="sticky top-0 z-20 border-b border-r border-border bg-primary-light px-4 py-3 text-primary">Promedio anual</th><th className="sticky top-0 z-20 border-b border-border bg-muted px-4 py-3">Condición</th></tr></thead><tbody>{studentResults.map((result) => { const condition = result.annual === null ? 'Pendiente' : result.annual >= props.config.passingScore ? 'Aprobado' : 'Revisión'; return <tr key={result.student.enrollmentId} className="group hover:bg-muted/20"><td className="sticky left-0 z-10 border-b border-r border-border bg-card px-3 py-3 text-center text-muted-foreground group-hover:bg-muted/20">{result.listNumber}</td><td className="sticky left-14 z-10 border-b border-r border-border bg-card px-4 py-3 font-bold text-foreground group-hover:bg-muted/20">{result.student.lastName}, {result.student.firstName}</td>{result.periodScores.map((score, index) => <td key={periods[index].id} className="border-b border-r border-border px-4 py-3 text-center font-bold">{formatGrade(score)}</td>)}<td className="border-b border-r border-border bg-primary/[0.035] px-4 py-3 text-center font-black text-primary">{formatGrade(result.annual)}</td><td className="border-b border-border px-4 py-3 text-center"><Badge tone={condition === 'Aprobado' ? 'success' : condition === 'Pendiente' ? 'muted' : 'warning'}>{condition}</Badge></td></tr> })}</tbody></table></div>

      <div className="grid gap-4 md:grid-cols-2">
        {competencyBlocks.map((block, index) => {
          const accent = blockAccents[index]
          const average = blockAverages[index]

          return (
            <article key={block.id} className="rounded-2xl bg-card p-5 shadow-sm">
              <p className={cn('text-xs font-bold', accent.text)}>{block.shortName}</p>
              <h3 className="mt-1.5 text-pretty text-base font-extrabold leading-6 text-primary sm:text-lg">
                {blockShortNames[block.id]}
              </h3>

              {average === null ? (
                <div className="mt-5 flex items-center gap-3">
                  <span className={cn('grid size-10 shrink-0 place-items-center rounded-xl', accent.panel)} aria-hidden="true">
                    <Hourglass className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-foreground">Aún sin promedio anual</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Completa las calificaciones de los períodos.</p>
                  </div>
                </div>
              ) : (
                <div className="mt-5">
                  <div className="flex items-end justify-between gap-3">
                    <p className="text-2xl font-extrabold leading-none text-primary tabular-nums">
                      {formatGrade(average)} <span className="text-sm font-semibold text-muted-foreground">/ 100</span>
                    </p>
                    <span className="text-xs text-muted-foreground">Promedio anual</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-border" aria-label={`${formatGrade(average)} de 100 puntos`}>
                    <span className={cn('block h-full rounded-full', accent.progress)} style={{ width: `${Math.max(0, Math.min(100, average))}%` }} />
                  </div>
                </div>
              )}
            </article>
          )
        })}
      </div>

      {final === null ? (
        <div className="flex flex-col gap-4 rounded-2xl bg-card p-5 shadow-sm sm:flex-row sm:items-center">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-light text-primary" aria-hidden="true">
            <Hourglass className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-extrabold text-foreground">Aún no hay resultado anual</p>
            <p className="mt-1 text-sm text-muted-foreground">Completa las calificaciones de los períodos para calcular el promedio y la nota final.</p>
          </div>
          <Badge tone="muted" className="shrink-0">Pendiente</Badge>
        </div>
      ) : (
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <div className="grid gap-5 md:grid-cols-3 md:divide-x md:divide-border">
            <ResultMetric label="Promedio general" value={`${formatGrade(generalAverage)} / 100`} />
            <ResultMetric label="Calificación final" value={`${formatGrade(final)} / 100`} />
            <div className="px-2 md:pl-5">
              <p className="text-xs font-bold text-muted-foreground">Estado</p>
              <Badge tone={state === 'Aprobado' ? 'success' : 'warning'} className="mt-3">
                {state}
              </Badge>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}



function ActivitiesHubView({
  activities,
  courseTitle,
  onBack,
  onSelectBlock,
  periodName,
}: {
  activities: GradingActivity[]
  courseTitle: string
  draftMetas: ActivityDraftMeta[]
  onBack: () => void
  onDeleteDraft: (blockId: CompetencyBlockId, draftId?: string) => void
  onOpenDraft: (blockId: CompetencyBlockId, draftId: string) => void
  onSelectBlock: (blockId: CompetencyBlockId) => void
  onViewDrafts: (blockId?: CompetencyBlockId) => void
  periodName: string
  periodShortName: string
}) {
  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-3 rounded-2xl bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex min-w-0 items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-light text-primary" aria-hidden="true">
            <NotebookPen className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold text-primary">Nueva actividad</p>
            <h2 className="mt-0.5 text-2xl font-extrabold tracking-tight text-foreground">Actividades</h2>
            <p className="mt-1 text-sm text-foreground">
              Elige el bloque de competencias para tu nueva actividad.
            </p>
            <p className="mt-1 truncate text-xs font-medium text-muted-foreground">
              {courseTitle} · {periodName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 self-start">
          <Button variant="ghost" className="h-10 px-3" onClick={onBack}>
            <BackIcon />
            Volver
          </Button>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {competencyBlocks.map((block, index) => (
          <ActivityBlockHubCard
            key={block.id}
            activities={activities.filter((activity) => activityAppliesToBlock(activity, block.id))}
            accent={blockAccents[index]}
            block={block}
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
  onSelectBlock,
}: {
  accent: (typeof blockAccents)[number]
  activities: GradingActivity[]
  block: (typeof competencyBlocks)[number]
  onSelectBlock: () => void
}) {
  const plannedPoints = sumActivityMaxScore(activities, block.id)

  return (
    <article className="flex flex-col rounded-2xl bg-card p-4 shadow-sm sm:p-5">
      <div className="flex items-start gap-3">
        <span className={cn('grid size-9 shrink-0 place-items-center rounded-xl text-sm font-extrabold', accent.panel)} aria-hidden="true">
          {block.shortName.replace(/\D/g, '')}
        </span>
        <div className="min-w-0">
          <p className={cn('text-xs font-bold', accent.text)}>{block.shortName}</p>
          <h3 className="mt-1 text-pretty text-base font-extrabold leading-6 text-primary sm:min-h-12 sm:text-lg">{blockShortNames[block.id] ?? block.name}</h3>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
        <span><strong className="font-extrabold text-foreground tabular-nums">{activities.length}</strong> {activities.length === 1 ? 'actividad' : 'actividades'}</span>
        <span className="text-border" aria-hidden="true">•</span>
        <span><strong className="font-extrabold text-foreground tabular-nums">{formatGrade(plannedPoints)}</strong> pts planificados</span>
      </div>

      <button
        type="button"
        className="mt-4 inline-flex h-9 w-fit items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={onSelectBlock}
      >
        <Plus className="size-4" />
        Crear actividad
      </button>
    </article>
  )
}

export function DraftCenter({
  blocksWithDrafts,
  courseTitle,
  draftMetas,
  onDeleteDraft,
  onOpenDraft,
  onViewDrafts,
  periodShortName,
  totalDrafts,
}: {
  blocksWithDrafts: number
  courseTitle: string
  draftMetas: ActivityDraftMeta[]
  onDeleteDraft: (blockId: CompetencyBlockId, draftId?: string) => void
  onOpenDraft: (blockId: CompetencyBlockId, draftId: string) => void
  onViewDrafts: () => void
  periodShortName: string
  totalDrafts: number
}) {
  const latestDraft = draftMetas[0] ?? null

  if (totalDrafts === 0) {
    return (
      <section className="flex flex-col gap-3 rounded-2xl border border-dashed border-border bg-card/60 p-4 sm:flex-row sm:items-center">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-light text-primary" aria-hidden="true">
          <FileText className="size-5" />
        </span>
        <div>
          <h3 className="text-sm font-extrabold text-foreground">Sin borradores pendientes</h3>
          <p className="mt-1 text-sm leading-5 text-muted-foreground">
            Las actividades incompletas que guardes aparecerán aquí automáticamente.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-light text-primary">
            <FileText className="size-5" />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-extrabold text-foreground">Borradores pendientes</h3>
            <p className="mt-1 max-w-md text-sm leading-5 text-muted-foreground">
              Continúa las actividades que dejaste incompletas.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span><strong className="font-extrabold text-foreground tabular-nums">{totalDrafts}</strong> borradores</span>
          <span className="text-border" aria-hidden="true">•</span>
          <span><strong className="font-extrabold text-foreground tabular-nums">{blocksWithDrafts}</strong> bloques</span>
          <span className="text-border" aria-hidden="true">•</span>
          <span>Última edición: <strong className="font-bold text-foreground">{latestDraft ? formatDraftDate(latestDraft.updatedAt) : '-'}</strong></span>
        </div>
        <Button variant="ghost" className="h-10 justify-center px-3 text-primary" onClick={onViewDrafts}>
          Ver todos
          <ArrowRight className="size-4" />
        </Button>
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {draftMetas.map((meta) => {
              const accent = getBlockAccent(meta.blockId)

              const draftName = meta.draft.name || 'Actividad sin nombre'

              return (
                <article
                  key={meta.draft.draftId}
                  className="relative min-h-[8.25rem] overflow-hidden rounded-xl bg-muted/20 px-4 py-3 transition-colors hover:bg-muted/35"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className={cn('inline-flex h-5 items-center whitespace-nowrap rounded-full px-2 text-[10px] font-black ring-1 ring-inset', accent.badge)}>
                      {meta.block.shortName}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        className="inline-flex size-7 items-center justify-center rounded-md text-destructive transition hover:bg-destructive/10"
                        aria-label={`Eliminar borrador ${draftName}`}
                        onClick={() => meta.draft.draftId && onDeleteDraft(meta.blockId, meta.draft.draftId)}
                      >
                        <Trash2 className="size-4" />
                      </button>
                      <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={() => meta.draft.draftId && onOpenDraft(meta.blockId, meta.draft.draftId)}
                  >
                    <p className="mt-2 truncate text-sm font-black text-foreground">{draftName}</p>
                    <p className="mt-1 line-clamp-2 text-xs leading-4 text-muted-foreground">{periodShortName} - {courseTitle}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Última edición: {formatDraftDate(meta.updatedAt)}</p>
                    <ProgressBar value={meta.completion} className="mt-3" indicatorColor={accent.progressColor} />
                    <p className="mt-1 text-xs text-muted-foreground">{meta.completion}% completado</p>
                  </button>
                </article>
              )
          })}
        </div>
      </div>
    </section>
  )
}

function ActivityDraftsView({
  courseTitle,
  draftMetas,
  initialBlock = 'all',
  onBack,
  onCreateActivity,
  onDeleteDraft,
  onOpenDraft,
  periodName,
  periodShortName,
}: {
  courseTitle: string
  draftMetas: ActivityDraftMeta[]
  initialBlock?: 'all' | CompetencyBlockId
  onBack: () => void
  onCreateActivity: () => void
  onDeleteDraft: (blockId: CompetencyBlockId, draftId?: string) => void
  onOpenDraft: (blockId: CompetencyBlockId, draftId: string) => void
  periodName: string
  periodShortName: string
}) {
  const [activeBlock, setActiveBlock] = useState<'all' | CompetencyBlockId>(initialBlock)
  const [instrumentFilter, setInstrumentFilter] = useState('all')
  const [periodFilter, setPeriodFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('updated-desc')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const blockCounts = competencyBlocks.reduce<Record<string, number>>((acc, block) => {
    acc[block.id] = draftMetas.filter((meta) => meta.blockId === block.id).length
    return acc
  }, {})
  const visibleMetas = draftMetas
    .filter((meta) => activeBlock === 'all' || meta.blockId === activeBlock)
    .filter(() => periodFilter === 'all' || periodFilter === periodShortName)
    .filter((meta) => instrumentFilter === 'all' || meta.draft.instrumentType === instrumentFilter)
    .filter((meta) => (meta.draft.name || 'Actividad sin nombre').toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) => sortDraftMetas(a, b, sortBy))
  const totalPages = Math.max(1, Math.ceil(visibleMetas.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const pageMetas = visibleMetas.slice((safePage - 1) * pageSize, safePage * pageSize)
  const firstItem = visibleMetas.length === 0 ? 0 : (safePage - 1) * pageSize + 1
  const lastItem = Math.min(safePage * pageSize, visibleMetas.length)

  function clearFilters() {
    setActiveBlock('all')
    setInstrumentFilter('all')
    setPeriodFilter('all')
    setQuery('')
    setSortBy('updated-desc')
    setPage(1)
  }

  function confirmDelete(meta: ActivityDraftMeta) {
    if (!meta.draft.draftId) return
    const shouldDelete = window.confirm('¿Eliminar este borrador? Esta acción no se puede deshacer.')
    if (shouldDelete) onDeleteDraft(meta.blockId, meta.draft.draftId)
  }

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-3 rounded-2xl bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex min-w-0 items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-light text-primary" aria-hidden="true">
            <FileText className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold text-primary">Actividades</p>
            <h2 className="mt-0.5 text-2xl font-extrabold tracking-tight text-foreground">Borradores de actividades</h2>
            <p className="mt-1 text-sm text-foreground">Continúa las actividades que dejaste pendientes.</p>
            <p className="mt-1 truncate text-xs font-medium text-muted-foreground">{courseTitle} · {periodName}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1 self-start sm:self-auto">
          <Button className="h-10 px-4 !shadow-none" onClick={onCreateActivity}>
            <Plus className="size-4" />
            Nueva actividad
          </Button>
          <Button variant="ghost" className="h-10 px-3" onClick={onBack}>
            <BackIcon />
            Volver
          </Button>
        </div>
      </header>

      {draftMetas.length === 0 ? (
        <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 px-5 py-10 text-center">
          <span className="grid size-11 place-items-center rounded-xl bg-primary-light text-primary" aria-hidden="true">
            <FileText className="size-5" />
          </span>
          <h3 className="mt-4 text-base font-extrabold text-foreground">Aún no tienes borradores</h3>
          <p className="mt-1 max-w-md text-sm leading-5 text-muted-foreground">
            Cuando guardes una actividad incompleta, podrás continuarla desde aquí.
          </p>
        </div>
      ) : (
      <div className="rounded-2xl bg-card p-4 shadow-sm">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <DraftFilterChip active={activeBlock === 'all'} label="Todos" count={draftMetas.length} onClick={() => { setActiveBlock('all'); setPage(1) }} />
          {competencyBlocks.map((block) => {
            const accent = getBlockAccent(block.id)

            return (
              <DraftFilterChip
                key={block.id}
                active={activeBlock === block.id}
                label={block.shortName}
                count={blockCounts[block.id] ?? 0}
                accent={accent}
                onClick={() => { setActiveBlock(block.id); setPage(1) }}
              />
            )
          })}
        </div>

        <div className="mt-3 grid gap-2 rounded-xl bg-muted/20 p-3 lg:grid-cols-[minmax(14rem,1fr)_12rem_13rem_13rem]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input aria-label="Buscar borradores" className="h-10 pl-9" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1) }} placeholder="Buscar borradores..." />
          </label>
          <Select aria-label="Filtrar por período" className="h-10" value={periodFilter} onChange={(event) => { setPeriodFilter(event.target.value); setPage(1) }}>
            <option value="all">Todos los periodos</option>
            <option value={periodShortName}>{periodShortName} - {periodName}</option>
          </Select>
          <Select aria-label="Filtrar por instrumento" className="h-10" value={instrumentFilter} onChange={(event) => { setInstrumentFilter(event.target.value); setPage(1) }}>
            <option value="all">Todos los instrumentos</option>
            <option value="rubrica">Rúbrica</option>
            <option value="lista-cotejo">Lista de cotejo</option>
            <option value="escala">Escala estimativa</option>
            <option value="lista-ponderada">Lista ponderada</option>
          </Select>
          <Select aria-label="Ordenar borradores" className="h-10" value={sortBy} onChange={(event) => { setSortBy(event.target.value); setPage(1) }}>
            <option value="updated-desc">Última modificación</option>
            <option value="updated-asc">Más antiguo</option>
            <option value="name-asc">Nombre A-Z</option>
            <option value="completion-desc">Mayor porcentaje</option>
            <option value="completion-asc">Menor porcentaje</option>
          </Select>
        </div>

        {pageMetas.length > 0 ? (
        <div className="mt-3 overflow-x-auto rounded-xl border border-border">
          <table className="min-w-[64rem] w-full text-left text-sm">
            <thead className="bg-muted/40 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Actividad</th>
                <th className="px-4 py-3">Bloque</th>
                <th className="px-4 py-3">Curso / Asignatura</th>
                <th className="px-4 py-3">Período</th>
                <th className="px-4 py-3">Instrumento</th>
                <th className="px-4 py-3">Completado</th>
                <th className="px-4 py-3">Última edición</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pageMetas.map((meta) => {
                const accent = getBlockAccent(meta.blockId)

                return (
                <tr key={meta.draft.draftId} className="border-t border-border">
                  <td className="px-4 py-3">
                    <div className="flex items-start gap-3">
                      <span className={cn('mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full', accent.badge)}>
                        <FileText className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-black text-foreground">{meta.draft.name || 'Actividad sin nombre'}</p>
                        <p className="mt-1 text-xs text-warning">{meta.missingSummary}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('inline-flex h-6 items-center whitespace-nowrap rounded-full px-2.5 text-xs font-black ring-1 ring-inset', accent.badge)}>
                      {meta.block.shortName}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{courseTitle}</td>
                  <td className="px-4 py-3"><Badge tone="muted">{periodShortName}</Badge></td>
                  <td className="px-4 py-3 text-muted-foreground">{instrumentTitle(meta.draft.instrumentType)}</td>
                  <td className="px-4 py-3">
                    <div className="flex min-w-28 items-center gap-2">
                      <span className={cn('w-9 text-xs font-black', accent.text)}>{meta.completion}%</span>
                      <ProgressBar value={meta.completion} indicatorColor={accent.progressColor} />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDraftDate(meta.updatedAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => meta.draft.draftId && onOpenDraft(meta.blockId, meta.draft.draftId)}>
                        <Pencil className="size-3.5" />
                        Continuar
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => confirmDelete(meta)}>
                        <Trash2 className="size-3.5" />
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        ) : (
          <div className="mt-3 flex min-h-48 flex-col items-center justify-center rounded-xl bg-muted/20 px-5 py-8 text-center">
            <Search className="size-5 text-primary" aria-hidden="true" />
            <p className="mt-3 text-sm font-bold text-foreground">Ningún borrador coincide con estos filtros</p>
            <Button variant="ghost" className="mt-2 h-9 px-3 text-primary" onClick={clearFilters}>Limpiar filtros</Button>
          </div>
        )}

        {totalPages > 1 ? (
          <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>Mostrando {firstItem}-{lastItem} de {visibleMetas.length} borradores</span>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" disabled={safePage <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>Anterior</Button>
              <Badge>{safePage}</Badge>
              <Button size="sm" variant="outline" disabled={safePage >= totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>Siguiente</Button>
            </div>
          </div>
        ) : null}
      </div>
      )}
    </section>
  )
}

function DraftFilterChip({
  accent,
  active,
  count,
  label,
  onClick,
}: {
  accent?: (typeof blockAccents)[number]
  active: boolean
  count: number
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        active && !accent ? 'bg-primary text-primary-foreground' : null,
        active && accent ? cn(accent.progress, 'text-white') : null,
        !active ? 'bg-muted/55 text-muted-foreground hover:text-foreground' : null,
      )}
      onClick={onClick}
    >
      {!active && accent ? <span aria-hidden="true" className={cn('size-2 rounded-full', accent.dot)} /> : null}
      <span>{label}</span>
      <span className={cn(
        'inline-flex min-w-5 items-center justify-center rounded-md px-1.5 text-xs',
        active ? 'bg-primary-foreground/15 text-primary-foreground' : null,
        !active && accent ? cn('ring-1', accent.badge) : null,
        !active && !accent ? 'bg-card/80 text-current' : null,
      )}>
        {count}
      </span>
    </button>
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
      title="Configurar cálculo"
      onClose={onClose}
      className="max-w-4xl !rounded-2xl border-0"
      contentClassName="min-h-0"
      overlayClassName="!bg-slate-950/35"
      hideHeader
    >
      <div className="flex max-h-[85vh] flex-col">
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6 sm:py-5">
          <div className="flex min-w-0 items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-light text-primary">
              <Settings className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-bold text-primary">Reglas de evaluación</p>
              <h3 className="mt-0.5 text-xl font-extrabold tracking-tight text-foreground">Configurar cálculo</h3>
              <p className="mt-1 max-w-xl text-sm leading-5 text-muted-foreground">
                Define cómo se obtiene la calificación de cada bloque de competencias.
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" aria-label="Cerrar configuración" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </header>

        <div className="min-h-0 overflow-y-auto p-5 sm:p-6">
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_17rem]">
            <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
              <ConfigField label="Total esperado por bloque">
                <Input className="h-11 bg-muted/25 px-4 font-semibold tabular-nums" type="number" value={config.expectedBlockTotal} onChange={(event) => onChange({ ...config, expectedBlockTotal: Number(event.target.value) || 100 })} />
              </ConfigField>
              <ConfigField label="Nota mínima de aprobación">
                <Input className="h-11 bg-muted/25 px-4 font-semibold tabular-nums" type="number" value={config.passingScore} onChange={(event) => onChange({ ...config, passingScore: Number(event.target.value) || 0 })} />
              </ConfigField>
              <ConfigField label="Método del bloque">
                <Select className="h-11 w-full bg-muted/25 px-4" value={config.blockMethod} onChange={(event) => onChange({ ...config, blockMethod: event.target.value as GradeCalculationConfig['blockMethod'] })}>
                  <option value="sum">Suma de actividades</option>
                  <option value="average">Promedio de actividades</option>
                  <option value="weighted">Porcentaje ponderado</option>
                </Select>
              </ConfigField>
              <ConfigField label="Redondeo de la nota">
                <Select className="h-11 w-full bg-muted/25 px-4" value={config.finalRounding} onChange={(event) => onChange({ ...config, finalRounding: event.target.value as GradeCalculationConfig['finalRounding'] })}>
                  <option value="standard">Redondeo estándar</option>
                  <option value="floor">Redondear hacia abajo</option>
                  <option value="ceil">Redondear hacia arriba</option>
                  <option value="decimals">Mantener decimales</option>
                </Select>
              </ConfigField>
              <ConfigField label="Decimales en la nota">
                <Select className="h-11 w-full bg-muted/25 px-4 sm:max-w-[14rem]" value={String(config.pcDecimals)} onChange={(event) => onChange({ ...config, pcDecimals: Number(event.target.value) })}>
                  <option value="0">Sin decimales</option>
                  <option value="1">1 decimal</option>
                  <option value="2">2 decimales</option>
                  <option value="3">3 decimales</option>
                  <option value="4">4 decimales</option>
                </Select>
              </ConfigField>
            </div>

            <aside className="rounded-2xl bg-primary-light/70 p-4 sm:p-5">
              <p className="text-sm font-extrabold text-primary">Así se calculará</p>
              <ul className="mt-4 space-y-3 text-sm leading-5 text-foreground">
                <RuleItem>El bloque tendrá un total de <strong>{config.expectedBlockTotal} puntos</strong>.</RuleItem>
                <RuleItem>La nota mínima será <strong>{config.passingScore}</strong>.</RuleItem>
                <RuleItem>Se aplicará el método seleccionado.</RuleItem>
                <RuleItem>El resultado seguirá la regla de redondeo.</RuleItem>
              </ul>
            </aside>
          </div>
        </div>

        <footer className="flex shrink-0 justify-end border-t border-border bg-card px-5 py-4 sm:px-6">
          <Button className="h-11 w-full px-6 !shadow-none sm:w-auto" onClick={onClose}>
            Guardar configuración
          </Button>
        </footer>
      </div>
    </Modal>
  )
}

function ConfigField({ children, label }: { children: ReactNode; label: string }) {
  return (
    <label className="space-y-2 text-sm font-bold text-foreground">
      <span className="block">{label}</span>
      {children}
    </label>
  )
}

function RuleItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-2.5">
      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
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

const defaultEvaluationRubricCriteria = [
  { title: 'Dominio del contenido', description: 'Demuestra comprensión y manejo adecuado del tema.' },
  { title: 'Organización y estructura', description: 'Presentación clara, ordenada y bien estructurada.' },
  { title: 'Expresión oral y lenguaje corporal', description: 'Se expresa con claridad y utiliza adecuadamente su lenguaje corporal.' },
  { title: 'Uso de recursos y materiales', description: 'Utiliza recursos de apoyo pertinentes y de calidad.' },
]

function activityEvaluationStatus(scored: number, total: number) {
  if (total <= 0 || scored === 0) return 'Pendiente'
  if (scored >= total) return 'Completada'
  return 'Parcial'
}

function activityEvaluationStatusTone(status: string): 'success' | 'muted' | 'warning' {
  if (status === 'Completada') return 'success'
  return 'warning'
}

function activityInstrumentDot(instrumentType?: string) {
  if (instrumentType === 'lista-cotejo') return 'bg-emerald-400'
  if (instrumentType === 'escala') return 'bg-amber-400'
  if (instrumentType === 'lista-ponderada') return 'bg-blue-500'
  return 'bg-primary'
}

function activityInstrumentTitle(instrumentType?: string) {
  return instrumentType ? instrumentTitle(instrumentType) : 'Instrumento pendiente'
}

function activityIconTone(instrumentType?: string) {
  if (instrumentType === 'lista-cotejo') return 'bg-emerald-100 text-emerald-700'
  if (instrumentType === 'escala') return 'bg-amber-100 text-amber-700'
  if (instrumentType === 'lista-ponderada') return 'bg-blue-100 text-blue-700'
  return 'bg-primary/10 text-primary'
}

function legacyActivityRubricConfiguration(activity: GradingActivity) {
  const fields = activity.instrumentCriteria ?? {}
  if (activity.instrumentType === 'escala') {
    const criteriaCount = Number(fields['escala:meta:criteriaCount']) || inferInstrumentCount(fields, 'escala', 'criterion', 5)
    const levelCount = Number(fields['escala:meta:levelCount']) || 4
    const templateLevels = scaleTemplateLevels(fields['escala:meta:template'] || 'frecuencia')
    return {
      criteria: Array.from({ length: criteriaCount }, (_, index) => ({
        title: fields[instrumentFieldKey('escala', 'criterion', index)] || `Indicador ${index + 1}`,
        description: 'Indicador configurado en la escala estimativa de la actividad.',
        maximum: Number(fields[instrumentFieldKey('escala', 'points', index)] || distributeScore(activity.maxScore, criteriaCount)[index] || 0),
      })),
      levels: Array.from({ length: levelCount }, (_, index) => {
        const score = levelCount - index
        return {
          label: fields[instrumentFieldKey('escala', 'level-name', score)] || templateLevels[index]?.name || `Nivel ${index + 1}`,
          points: Number(fields[instrumentFieldKey('escala', 'level-points', score)] || templateLevels[index]?.points || score),
        }
      }),
    }
  }
  if (activity.instrumentType === 'lista-ponderada') {
    const criteriaCount = Number(fields['lista-ponderada:meta:criteriaCount']) || inferInstrumentCount(fields, 'lista-ponderada', 'criterion', 5)
    const hasPartial = fields['lista-ponderada:meta:partial'] !== 'false'
    const partialValue = Number(fields['lista-ponderada:meta:partialValue'] || 50)
    return {
      criteria: Array.from({ length: criteriaCount }, (_, index) => {
        const weight = Number(fields[instrumentFieldKey('lista-ponderada', 'weight', index)] || distributeScore(100, criteriaCount)[index] || 0)
        return {
          title: fields[instrumentFieldKey('lista-ponderada', 'criterion', index)] || `Criterio ${index + 1}`,
          description: fields[instrumentFieldKey('lista-ponderada', 'indicator', index)] || 'Indicador observable configurado para este criterio.',
          maximum: Number((weight / 100 * activity.maxScore).toFixed(2)),
        }
      }),
      levels: [
        { label: fields['lista-ponderada:meta:yesLabel'] || 'Sí', points: 100 },
        ...(hasPartial ? [{ label: fields['lista-ponderada:meta:partialLabel'] || 'Parcial', points: partialValue }] : []),
        { label: fields['lista-ponderada:meta:noLabel'] || 'No', points: 0 },
      ],
    }
  }
  if (activity.instrumentType === 'lista-cotejo') {
    const criteriaCount = Number(fields['lista-cotejo:meta:criteriaCount']) || inferInstrumentCount(fields, 'lista-cotejo', 'criterion', 0)
    return {
      criteria: Array.from({ length: criteriaCount }, (_, index) => ({
        title: fields[instrumentFieldKey('lista-cotejo', 'criterion', index)] || `Criterio ${index + 1}`,
        description: 'Criterio configurado en la lista de cotejo de la actividad.',
        maximum: Number(fields[instrumentFieldKey('lista-cotejo', 'points', index)] || 0),
      })),
      levels: [
        { label: fields['lista-cotejo:meta:yesLabel'] || 'Sí', points: 1 },
        { label: fields['lista-cotejo:meta:noLabel'] || 'No', points: 0 },
      ],
    }
  }
  if (activity.instrumentType !== 'rubrica') {
    const criteriaPoints = distributeScore(activity.maxScore, defaultEvaluationRubricCriteria.length)
    return {
      criteria: defaultEvaluationRubricCriteria.map((criterion, index) => ({ ...criterion, maximum: criteriaPoints[index] || 0 })),
      levels: ['Excelente', 'Bueno', 'Satisfactorio', 'Básico', 'Insuficiente'].map((label, index) => ({ label, points: [5, 4, 3, 2, 1][index] })),
    }
  }
  const criteriaCount = Number(fields['rubrica:meta:criteriaCount']) || inferInstrumentCount(fields, 'rubrica', 'criterion', 4)
  const levelCount = Number(fields['rubrica:meta:levelCount']) || inferRubricLevels(fields, 4)
  const criteria = Array.from({ length: criteriaCount }, (_, index) => ({
    title: fields[instrumentFieldKey('rubrica', 'criterion', index)] || `Criterio ${index + 1}`,
    description: fields[instrumentFieldKey('rubrica', 'descriptor', index, levelCount)] || 'Criterio configurado en el instrumento de la actividad.',
    descriptors: Array.from({ length: levelCount }, (_, levelIndex) => fields[instrumentFieldKey('rubrica', 'descriptor', index, levelCount - levelIndex)] || ''),
    maximum: Number(fields[instrumentFieldKey('rubrica', 'points', index)] || distributeScore(activity.maxScore, criteriaCount)[index] || 0),
  }))
  const levels = Array.from({ length: levelCount }, (_, index) => {
    const score = levelCount - index
    return { label: fields[instrumentFieldKey('rubrica', 'level-name', score)] || rubricDefaultLevelNames(levelCount)[index], points: Number(fields[instrumentFieldKey('rubrica', 'level-points', score)] || defaultRubricLevelPoints(criteria[0]?.maximum || activity.maxScore, levelCount)[index]) }
  })
  return { criteria, levels }
}

function studentInitials(student: StudentGradeRow | null) {
  if (!student) return '--'
  return `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`.toUpperCase()
}

function gradeLevel(score: number, maxScore: number) {
  const ratio = maxScore > 0 ? score / maxScore : 0
  if (ratio >= 0.85) return 'Excelente'
  if (ratio >= 0.65) return 'Bueno'
  if (ratio >= 0.45) return 'Satisfactorio'
  if (ratio >= 0.25) return 'Básico'
  return 'Insuficiente'
}

function gradeLevelTextColor(level: string) {
  if (level === 'Excelente') return 'text-emerald-700'
  if (level === 'Bueno') return 'text-primary'
  if (level === 'Satisfactorio') return 'text-amber-700'
  if (level === 'Básico') return 'text-orange-700'
  if (level === 'Insuficiente') return 'text-destructive'
  return 'text-muted-foreground'
}

function gradeDistribution(records: GradeRecordRow[], students: StudentGradeRow[], activity: GradingActivity) {
  const groups = [
    { color: '#22c55e', count: 0, label: 'Excelente (85 - 100%)' },
    { color: '#2563eb', count: 0, label: 'Bueno (65 - 84%)' },
    { color: '#fbbf24', count: 0, label: 'Satisfactorio (45 - 64%)' },
    { color: '#f97316', count: 0, label: 'Básico (25 - 44%)' },
    { color: '#e5e7eb', count: 0, label: 'Insuficiente (0 - 24%)' },
  ]
  students.forEach((student) => {
    const score = scoreForActivity(records, student.enrollmentId, activity.id)?.score
    if (typeof score !== 'number') return
    const ratio = activity.maxScore > 0 ? score / activity.maxScore : 0
    if (ratio >= 0.85) groups[0].count += 1
    else if (ratio >= 0.65) groups[1].count += 1
    else if (ratio >= 0.45) groups[2].count += 1
    else if (ratio >= 0.25) groups[3].count += 1
    else groups[4].count += 1
  })
  const total = Math.max(1, groups.reduce((sum, item) => sum + item.count, 0))
  return groups.map((item) => ({ ...item, percent: Math.round((item.count / total) * 100) }))
}

function ResultMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-2 md:pl-5 md:first:pl-2">
      <p className="text-xs font-bold text-muted-foreground">{label}</p>
      <p className="mt-3 text-2xl font-extrabold text-primary tabular-nums">{value}</p>
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
    .filter((activity) => activityAppliesToBlock(activity, input.blockId))
  if (activities.length === 0) return null
  const recoveryScores = getRecoveryScores(records)
  const scores = input.students.flatMap((student) => {
    const hasRecordedScore = activities.some((activity) => scoreForActivity(records, student.enrollmentId, activity.id))
    const recovery = recoveryScores[input.blockId]?.[student.enrollmentId] ?? null
    if (!hasRecordedScore && recovery === null) return []
    const total = blockTotal({
      records,
      activities,
      enrollmentId: student.enrollmentId,
      blockId: input.blockId,
      config: input.config,
    })
    return [effectivePeriodScore(total, recovery, input.config)]
  })
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
    .filter((activity) => activityAppliesToBlock(activity, input.blockId))
  if (activities.length === 0) {
    return { period: null, recovery: null, effective: null }
  }
  const recovery = getRecoveryScores(records)[input.blockId]?.[input.student.enrollmentId] ?? null
  const hasRecordedScore = activities.some((activity) =>
    scoreForActivity(records, input.student.enrollmentId, activity.id),
  )
  if (!hasRecordedScore) {
    return { period: null, recovery, effective: recovery }
  }
  const period = blockTotal({
    records,
    activities,
    enrollmentId: input.student.enrollmentId,
    blockId: input.blockId,
    config: input.config,
  })
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
      h1 { color: #272320; font-size: 24px; margin-bottom: 4px; }
      p { margin: 4px 0; }
      table { border-collapse: collapse; width: 100%; margin-top: 18px; }
      th, td { border: 1px solid #d9e2ec; padding: 8px; font-size: 12px; }
      th { background: #DDEEF9; color: #272320; text-align: left; }
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

export function activityRubricConfiguration(activity: GradingActivity) {
 const fields=activity.instrumentCriteria ?? {}
 if (activity.instrumentType && validateInstrumentDefinition(activity.instrumentType, fields, activity.maxScore).length === 0) return instrumentEvaluationConfiguration(activity.instrumentType,fields,activity.maxScore)
 return {...legacyActivityRubricConfiguration(activity), maxScore: activity.maxScore, noApply: fields[(activity.instrumentType ?? '')+':meta:noApply'] === 'true'}
}
