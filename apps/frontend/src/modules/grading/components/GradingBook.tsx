import {
  Accessibility,
  AudioLines,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  BarChart3,
  Beaker,
  Blocks,
  BookA,
  BookText,
  BookOpen,
  Box,
  Cable,
  CalendarDays,
  Calculator,
  Camera,
  CheckCircle2,
  ChevronDown,
  CircleDot,
  Circle,
  Clock3,
  ClipboardList,
  Eye,
  Download,
  Dices,
  DraftingCompass,
  Drama,
  Drum,
  Dumbbell,
  Files,
  FileText,
  Flag,
  Flame,
  FlaskConical,
  Globe,
  GraduationCap,
  Glasses,
  Goal,
  Grid3X3,
  Guitar,
  Hand,
  Hash,
  Headphones,
  Hourglass,
  Image as ImageIcon,
  Images,
  Layers,
  Laptop,
  Keyboard,
  Magnet,
  Map as MapIcon,
  Microscope,
  Medal,
  Megaphone,
  MessageSquare,
  Mic,
  Music,
  Newspaper,
  NotebookPen,
  Palette,
  Paintbrush,
  PenLine,
  Lightbulb,
  Link,
  Pencil,
  Play,
  Presentation,
  Printer,
  Projector,
  Puzzle,
  Radio,
  Plus,
  Scale,
  Search,
  ScanLine,
  Scissors,
  Settings,
  SlidersHorizontal,
  Smartphone,
  Speaker,
  Shield,
  Target,
  Tags,
  Tablet,
  TestTube,
  Thermometer,
  Timer,
  Triangle,
  Monitor,
  Ruler,
  Shapes,
  Video,
  Volume2,
  Trash2,
  Trophy,
  TrendingUp,
  Usb,
  Users,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState, type Dispatch, type KeyboardEvent, type ReactNode, type SetStateAction } from 'react'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { ActivityDescriptionEditor as StructuredActivityDescriptionEditor } from '@/modules/grading/components/ActivityDescriptionEditor'
import type {
  GradeCalculationConfig,
  GradeRecordRow,
  GradingActivity,
  RecoveryScores,
  StudentGradeRow,
} from '@/modules/grading/types'
import {
  blockTotal,
  competencyBlocks,
  competencyPeriods,
  defaultGradeCalculationConfig,
  effectivePeriodScore,
  finalBlockAverage,
  finalSubjectScore,
  formatGrade,
  getRecoveryScores,
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
  initialView?: MainView
  onAddActivity: (activity: Omit<GradingActivity, 'id'>) => void
  onUpdateActivity: (activity: GradingActivity) => void
  onDeleteActivity: (activityId: string) => void
  onSaveScore: (enrollmentId: string, activity: GradingActivity, value: string) => void
  onSaveRecovery: (enrollmentId: string, blockId: string, value: string) => void
  loadFinalRecords: () => Promise<Map<CompetencyPeriodId, GradeRecordRow[]>>
  getActivitiesForPeriod: (periodId: CompetencyPeriodId) => GradingActivity[]
  onActivityWorkspaceChange?: (active: boolean) => void
}

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

const blockAccents = [
  {
    card: 'border-blue-200 bg-blue-50/70',
    cardBorder: '#bfdbfe',
    cardTint: '#eff6ff',
    panel: 'bg-blue-50 text-blue-950',
    dot: 'bg-blue-500',
    badge: 'bg-blue-100 text-blue-700 ring-blue-200',
    progress: 'bg-blue-600',
    progressColor: '#2563eb',
    text: 'text-blue-700',
  },
  {
    card: 'border-emerald-200 bg-emerald-50/70',
    cardBorder: '#a7f3d0',
    cardTint: '#ecfdf5',
    panel: 'bg-emerald-50 text-emerald-950',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
    progress: 'bg-emerald-600',
    progressColor: '#059669',
    text: 'text-emerald-700',
  },
  {
    card: 'border-amber-200 bg-amber-50/70',
    cardBorder: '#fde68a',
    cardTint: '#fffbeb',
    panel: 'bg-amber-50 text-amber-950',
    dot: 'bg-amber-500',
    badge: 'bg-amber-100 text-amber-700 ring-amber-200',
    progress: 'bg-amber-500',
    progressColor: '#f59e0b',
    text: 'text-amber-700',
  },
  {
    card: 'border-violet-200 bg-violet-50/70',
    cardBorder: '#ddd6fe',
    cardTint: '#f5f3ff',
    panel: 'bg-violet-50 text-violet-950',
    dot: 'bg-violet-500',
    badge: 'bg-violet-100 text-violet-700 ring-violet-200',
    progress: 'bg-violet-600',
    progressColor: '#7c3aed',
    text: 'text-violet-700',
  },
]

const blockShortNames: Record<string, string> = {
  b1: 'Competencia Comunicativa',
  b2: 'Pensamiento Lógico, Creativo y Crítico y Resolución de Problemas',
  b3: 'Ética y Ciudadana y Desarrollo Personal y Espiritual',
  b4: 'Científica y Tecnológica y Ambiental y de la Salud',
}

function getBlockAccent(blockId: CompetencyBlockId) {
  const blockIndex = competencyBlocks.findIndex((block) => block.id === blockId)
  return blockAccents[blockIndex >= 0 ? blockIndex : 0]
}

type ActivityDraft = {
  draftId?: string
  updatedAt?: string
  name: string
  maxScore: string
  competencyBlockId: string
  date: string
  description: string
  studentRole: string
  teacherRole: string
  instrumentType: string
  instrumentId?: string
  evaluationTechnique: string
  instrumentCompleted: boolean
  instrumentFields: Record<string, string>
  resources: string[]
  planningMoment: string
  observations: string
  activityType: '' | 'individual' | 'group'
}

type ActivityDraftsByBlock = Partial<Record<CompetencyBlockId, ActivityDraft[]>>
type ActivityCompletionTarget =
  | 'name'
  | 'maxScore'
  | 'date'
  | 'evaluationTechnique'
  | 'activityType'
  | 'planningMoment'
  | 'instrumentType'
  | 'instrumentBody'
  | 'description'
type ActivityCompletionIssue = {
  detail: string
  tab: 'activity' | 'instrument'
  target: ActivityCompletionTarget
  title: string
}
type ActivityDraftMeta = {
  block: (typeof competencyBlocks)[number]
  blockId: CompetencyBlockId
  completion: number
  draft: ActivityDraft
  missingSummary: string
  pendingIssues: ActivityCompletionIssue[]
  updatedAt: string
}

const emptyActivityDraft: ActivityDraft = {
  name: '',
  maxScore: '',
  competencyBlockId: competencyBlocks[0].id,
  date: '',
  description: '',
  studentRole: '',
  teacherRole: '',
  instrumentType: '',
  evaluationTechnique: '',
  instrumentCompleted: false,
  instrumentFields: {},
  resources: [],
  planningMoment: '',
  observations: '',
  activityType: '',
}

export function GradingBook({
  students,
  activities,
  records,
  recoveryScores,
  periodName,
  periodShortName,
  courseTitle,
  saving,
  initialView = 'blocks',
  onAddActivity,
  onUpdateActivity,
  onDeleteActivity,
  onSaveScore,
  loadFinalRecords,
  getActivitiesForPeriod,
  onActivityWorkspaceChange,
}: GradingBookProps) {
  const [mainView, setMainView] = useState<MainView>(initialView)
  const [detailView, setDetailView] = useState<DetailView | null>(null)
  const [activityCreateReturnView, setActivityCreateReturnView] = useState<DetailView | null>(null)
  const [showConfig, setShowConfig] = useState(false)
  const [infoActivity, setInfoActivity] = useState<GradingActivity | null>(null)
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null)
  const [activityDraft, setActivityDraft] = useState(emptyActivityDraft)
  const [activityDrafts, setActivityDrafts] = useState<ActivityDraftsByBlock>({})
  const [draftsReadyKey, setDraftsReadyKey] = useState<string | null>(null)
  const [config, setConfig] = useState<GradeCalculationConfig>(defaultGradeCalculationConfig)
  const [recordsByPeriod, setRecordsByPeriod] = useState<Map<CompetencyPeriodId, GradeRecordRow[]>>(new Map())
  const [loadingAnnual, setLoadingAnnual] = useState(false)

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
  const isFocusedWorkspace = Boolean(detailView)
  const draftStorageKey = useMemo(
    () => `grading-activity-drafts:${courseTitle}:${periodShortName}`,
    [courseTitle, periodShortName],
  )

  useEffect(() => {
    onActivityWorkspaceChange?.(isFocusedWorkspace)
    return () => onActivityWorkspaceChange?.(false)
  }, [isFocusedWorkspace, onActivityWorkspaceChange])

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
  const draftMetas = useMemo(
    () => buildActivityDraftMetas(activityDrafts),
    [activityDrafts],
  )

  useEffect(() => {
    if (mainView !== 'annual' && mainView !== 'final') return
    let ignore = false
    async function loadAnnualRecords() {
      setLoadingAnnual(true)
      const next = await loadFinalRecords()
      if (!ignore) {
        setRecordsByPeriod(next)
        setLoadingAnnual(false)
      }
    }
    void loadAnnualRecords()
    return () => {
      ignore = true
    }
  }, [loadFinalRecords, mainView])

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
      updatedAt: new Date().toISOString(),
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

  function saveActivityDraft() {
    const maxScore = Number(activityDraft.maxScore)
    if (validateActivityCompletion(activityDraft).length > 0 || Number.isNaN(maxScore) || maxScore <= 0) return
    const activityType = activityDraft.activityType as Exclude<ActivityDraft['activityType'], ''>
    const activity = {
      name: activityDraft.name.trim(),
      maxScore,
      competencyBlockId: activityDraft.competencyBlockId,
      date: activityDraft.date || undefined,
      description: activityDraft.description.trim() || undefined,
      studentRole: activityDraft.studentRole.trim() || undefined,
      teacherRole: activityDraft.teacherRole.trim() || undefined,
      instrumentType: activityDraft.instrumentType || undefined,
      instrumentId: activityDraft.instrumentId,
      instrumentCriteria: activityDraft.instrumentFields,
      evaluationTechnique: activityDraft.evaluationTechnique.trim() || undefined,
      planningMoment: activityDraft.planningMoment as GradingActivity['planningMoment'],
      observations: activityDraft.observations.trim() || undefined,
      resources: activityDraft.resources,
      activityType,
    }

    if (editingActivityId) {
      onUpdateActivity({ ...activity, id: editingActivityId })
      setEditingActivityId(null)
    } else {
      onAddActivity(activity)
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
      instrumentId: activity.instrumentId,
      evaluationTechnique: activity.evaluationTechnique ?? '',
      instrumentCompleted: Boolean(activity.instrumentType),
      instrumentFields: activity.instrumentCriteria ?? {},
      resources: activity.resources ?? [],
      planningMoment: activity.planningMoment ?? '',
      observations: activity.observations ?? '',
      activityType: activity.activityType ?? 'individual',
    })
    setActivityCreateReturnView(detailView?.type === 'block' ? { ...detailView, initialTab: 'activities' } : detailView)
    setDetailView({ type: 'activity-create', blockId: activity.competencyBlockId as CompetencyBlockId })
  }

  function duplicateActivity(activity: GradingActivity) {
    const { id: _id, instrumentId: _instrumentId, ...copy } = activity
    onAddActivity({
      ...copy,
      name: `${activity.name} copia`,
    })
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
      {!isFocusedWorkspace ? (
      <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-2 shadow-sm xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap gap-2">
          <ViewButton active={mainView === 'blocks'} icon={<BookOpen className="size-4" />} label="Bloques" onClick={() => { setMainView('blocks'); setDetailView(null) }} />
          <ViewButton active={mainView === 'period'} icon={<ClipboardList className="size-4" />} label="Período" onClick={() => { setMainView('period'); setDetailView(null) }} />
          <ViewButton active={mainView === 'annual'} icon={<CalendarDays className="size-4" />} label="Matriz anual" onClick={() => { setMainView('annual'); setDetailView(null) }} />
          <ViewButton active={mainView === 'final'} icon={<Trophy className="size-4" />} label="Resumen final" onClick={() => { setMainView('final'); setDetailView(null) }} />
        </div>
        <div className="flex flex-wrap gap-2">
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
          <Button variant="outline" className="h-9 px-3" onClick={() => setShowConfig(true)}>
            <Settings className="size-4" />
            Configurar cálculo
          </Button>
          <Button className="h-9 px-3" onClick={openActivityHub}>
            <Plus className="size-4" />
            Agregar actividad
          </Button>
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
            draftMetas={draftMetas}
            initialTab={detailView.initialTab}
            onBack={() => setDetailView(null)}
            onCreateActivity={() => openActivityCreator(selectedBlock.id)}
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
            onOpenActivity={(activityId) => openActivity(activityId)}
            onSelectBlock={openActivityCreator}
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
            onCreateActivity={() => openActivityCreator(competencyBlocks[0].id)}
            onDeleteDraft={discardActivityDraft}
            onOpenDraft={openActivityDraft}
            periodName={periodName}
            periodShortName={periodShortName}
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
            onSaveActivity={saveActivityDraft}
            saving={saving}
          />
        ) : selectedActivity ? (
          <ActivityDetailView
            activity={selectedActivity}
            initialTab={detailView.type === 'activity' ? detailView.initialTab : undefined}
            onBack={() => {
              setDetailView({ type: 'block', blockId: selectedActivity.competencyBlockId as CompetencyBlockId })
            }}
            onEditActivity={editActivity}
            onSaveScore={onSaveScore}
            records={records}
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
        <PeriodSummaryView blockSummaries={blockSummaries} periodName={periodName} recoveryScores={recoveryScores} />
      ) : mainView === 'annual' ? (
        <AnnualComparisonView
          config={config}
          getActivitiesForPeriod={getActivitiesForPeriod}
          loading={loadingAnnual}
          recordsByPeriod={recordsByPeriod}
          students={students}
        />
      ) : (
        <AnnualResultView
          config={config}
          getActivitiesForPeriod={getActivitiesForPeriod}
          loading={loadingAnnual}
          recordsByPeriod={recordsByPeriod}
          students={students}
        />
      )}

      {showConfig ? (
        <CalculationConfigModal config={config} onChange={setConfig} onClose={() => setShowConfig(false)} />
      ) : null}
      {infoActivity ? (
        <ActivityInfoModal activity={infoActivity} onClose={() => setInfoActivity(null)} />
      ) : null}
    </div>
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
    <Button variant={active ? 'primary' : 'ghost'} className="h-9 px-3" onClick={onClick}>
      {icon}
      {label}
    </Button>
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
  config,
  draftMetas,
  onOpenBlock,
  onOpenActivity,
  onViewDrafts,
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
    <section className="space-y-3">
      <div>
        <h2 className="text-2xl font-bold leading-tight text-primary">Bloques de competencias</h2>
      </div>
      <div className="grid gap-3 xl:grid-cols-4">
        {blockSummaries.map((summary) => {
          const accent = blockAccents[summary.index]
          const draftCount = draftMetas.filter((meta) => meta.blockId === summary.block.id).length
          return (
            <article
              key={summary.block.id}
              role="button"
              tabIndex={0}
              className={cn('overflow-hidden rounded-lg border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40', accent.card)}
              style={{ backgroundColor: accent.cardTint, borderColor: accent.cardBorder }}
              onClick={() => onOpenBlock(summary.block.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onOpenBlock(summary.block.id)
                }
              }}
            >
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
                  {draftCount > 0 ? (
                    <button
                      type="button"
                      className="mt-2 inline-flex w-full items-center justify-between rounded-lg border border-red-200 bg-red-50/80 px-3 py-2 text-xs font-black text-red-700 shadow-sm transition hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-50 hover:shadow-md"
                      onClick={(event) => {
                        event.stopPropagation()
                        onViewDrafts(summary.block.id)
                      }}
                    >
                      <span>{draftCount} borrador{draftCount === 1 ? '' : 'es'}</span>
                      <ArrowRight className="size-4" />
                    </button>
                  ) : null}
                  <Button
                    variant="outline"
                    className="mt-3 h-10 w-full justify-between"
                    onClick={(event) => {
                      event.stopPropagation()
                      onOpenBlock(summary.block.id)
                    }}
                  >
                    Ver bloque
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </div>
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
  draftMetas,
  initialTab = 'matrix',
  onBack,
  onCreateActivity,
  onDeleteActivity,
  onEditActivity,
  onOpenConfig,
  onOpenActivity,
  onViewDrafts,
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
  const block = competencyBlocks.find((item) => item.id === blockId) ?? competencyBlocks[0]
  const blockIndex = competencyBlocks.findIndex((item) => item.id === blockId)
  const studentTotals = students.map((student) => {
    return blockTotal({ records, activities, enrollmentId: student.enrollmentId, blockId, config })
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

  const completedStudents = studentTotals.filter((value) => value >= config.passingScore).length
  const riskStudents = activities.length === 0 ? 0 : studentTotals.filter((value) => value < config.passingScore).length
  const plannedTotal = sumActivityMaxScore(activities, blockId)
  const blockDraftCount = draftMetas.filter((meta) => meta.blockId === blockId).length
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
    { id: 'matrix', label: 'Matriz de calificaciones' },
    { id: 'activities', label: 'Actividades' },
    { id: 'students', label: 'Estudiantes' },
    { id: 'stats', label: 'Estadisticas del bloque' },
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
        <BlockMetric icon={<Layers className="size-5" />} label="Total planificado" value={`${formatGrade(plannedTotal)} pts`} helper={`/ ${config.expectedBlockTotal} esperados`} tone="default" />
        <BlockMetric icon={<Target className="size-5" />} label="Promedio del bloque" value={formatGrade(average)} helper="puntos" tone="success" />
        <BlockMetric icon={<ClipboardList className="size-5" />} label="Actividades" value={activities.length} helper="actividades" tone="accent" />
        <BlockMetric icon={<Hourglass className="size-5" />} label="Pendientes" value={pendingActivities} helper="actividades" tone="warning" />
        <BlockMetric icon={<CheckCircle2 className="size-5" />} label="Estado" value={blockState} helper="" tone="success" />
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border text-sm font-bold text-muted-foreground">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={cn(
              'border-b-2 border-transparent px-3 py-3 transition hover:text-primary',
              activeTab === tab.id ? 'border-primary text-primary' : 'text-muted-foreground',
            )}
            onClick={() => setActiveTab(tab.id)}
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
                const status = activities.length === 0 ? 'Sin calificacion' : total >= config.passingScore ? 'Aprobado' : 'En recuperacion'
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
                            <span>{record ? formatGrade(record.score) : '-'}</span>
                            <span className="text-xs font-medium text-muted-foreground">/ {activity.maxScore}</span>
                          </div>
                        </td>
                      )
                    })}
                    <td className="border-b border-r border-border px-4 py-3 text-center text-lg font-black text-primary">{formatGrade(total)}</td>
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
                {blockDraftCount > 0 ? (
                  <Button variant="outline" onClick={() => onViewDrafts(blockId)}>
                    <FileText className="size-4" />
                    Borradores ({blockDraftCount})
                  </Button>
                ) : null}
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
                const status = activities.length === 0 ? 'Sin calificacion' : total >= config.passingScore ? 'Aprobado' : 'En recuperacion'
                return (
                  <tr key={student.enrollmentId} className="border-t border-border hover:bg-muted/20">
                    <td className="px-4 py-3 text-center text-muted-foreground">{student.listNumber ?? index + 1}</td>
                    <td className="px-4 py-3 font-bold text-foreground">{student.lastName}, {student.firstName}</td>
                    <td className="px-4 py-3 text-center text-lg font-black text-primary">{formatGrade(total)} / {config.expectedBlockTotal}</td>
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

function ActivityInfoModal({ activity, onClose }: { activity: GradingActivity; onClose: () => void }) {
  const block = competencyBlocks.find((item) => item.id === activity.competencyBlockId) ?? competencyBlocks[0]
  const resources = activity.resources ?? []

  return (
    <Modal title="Detalle de la actividad" onClose={onClose} hideHeader className="max-w-6xl rounded-2xl">
      <div className="flex items-start justify-between gap-4 border-b border-border bg-gradient-to-r from-violet-50 to-card px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700"><ClipboardList className="size-5" /></span>
          <div>
            <h3 className="text-lg font-black text-foreground">Detalle de la actividad</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">Consulta la información completa y el instrumento creado para esta actividad.</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" aria-label="Cerrar" onClick={onClose}><X className="size-5" /></Button>
      </div>

      <div className="space-y-4 p-5">
        <div>
          <h4 className="text-xl font-black text-primary">{activity.name || 'Actividad sin nombre'}</h4>
          <p className="mt-1 text-sm text-muted-foreground">{block.shortName} · {blockShortNames[block.id]}</p>
        </div>

        <div className="grid gap-3 rounded-xl border border-border bg-muted/15 p-4 sm:grid-cols-2 lg:grid-cols-6">
          <InfoItem label="Valor" value={`${activity.maxScore} pts`} />
          <InfoItem label="Fecha" value={formatActivityDate(activity.date)} />
          <InfoItem label="Técnica" value={formatActivityTechnique(activity.evaluationTechnique)} />
          <InfoItem label="Instrumento" value={instrumentTitle(activity.instrumentType || '')} />
          <InfoItem label="Tipo" value={activity.activityType === 'group' ? 'Grupal' : 'Individual'} />
          <InfoItem label="Momento" value={activityMomentTitle(activity.planningMoment)} />
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(16rem,0.55fr)]">
          <section className="rounded-xl border border-border p-4">
            <h5 className="text-sm font-black text-primary">Descripción de la actividad</h5>
            <div className="mt-2 text-sm leading-6 text-muted-foreground"><ActivityDescriptionContent value={activity.description} fallback="No hay una descripción registrada para esta actividad." /></div>
          </section>
          <section className="rounded-xl border border-violet-100 bg-violet-50/60 p-4">
            <h5 className="text-sm font-black text-violet-800">Recursos necesarios</h5>
            {resources.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-1.5">{resources.map((resource) => <span key={resource} className="rounded-full bg-card px-2.5 py-1 text-xs font-bold text-violet-800 ring-1 ring-violet-200">{resource}</span>)}</div>
            ) : <p className="mt-2 text-sm text-muted-foreground">No se registraron recursos.</p>}
          </section>
        </div>

        <section className="overflow-hidden rounded-xl border border-border">
          <div className="border-b border-border bg-muted/20 px-4 py-3">
            <h5 className="text-sm font-black text-primary">Instrumento de evaluación: {instrumentTitle(activity.instrumentType || '')}</h5>
          </div>
          <div className="max-h-[24rem] overflow-auto p-4">
            <ReadOnlyInstrument type={activity.instrumentType} fields={activity.instrumentCriteria ?? {}} maxScore={activity.maxScore} />
          </div>
        </section>
      </div>
    </Modal>
  )
}

function ReadOnlyInstrument({ type, fields, maxScore }: { type?: string; fields: Record<string, string>; maxScore: number }) {
  const entries = Object.entries(fields).filter(([, value]) => value.trim())
  const indexes = [...new Set(entries.map(([key]) => Number(key.split(':')[2])).filter(Number.isFinite))].sort((a, b) => a - b)
  if (!type || entries.length === 0) {
    return <p className="rounded-lg bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">Este instrumento no tiene criterios configurados guardados.</p>
  }
  if (type === 'rubrica') {
    const levels = [...new Set(entries.filter(([key]) => key.startsWith('rubrica:descriptor:')).map(([key]) => Number(key.split(':')[3])).filter(Number.isFinite))].sort((a, b) => b - a)
    return (
      <div className="space-y-2"><InstrumentTable><thead className="bg-violet-50"><tr><th className="border border-border px-3 py-2">Criterios</th>{levels.map((level) => <th key={level} className="border border-border px-3 py-2 text-center"><span className="block">{fields[instrumentFieldKey(type, 'level-name', level)] || `Nivel ${level}`}</span><span className="text-[10px] font-medium text-muted-foreground">{fields[instrumentFieldKey(type, 'level-points', level)] || level} pts</span></th>)}<th className="border border-border px-3 py-2 text-center">Valor</th></tr></thead><tbody>
        {indexes.map((index) => <tr key={index}><td className="border border-border px-3 py-3 font-bold">{fields[instrumentFieldKey(type, 'criterion', index)]}</td>{levels.map((level) => <td key={level} className="border border-border px-3 py-3 leading-5 text-muted-foreground">{fields[instrumentFieldKey(type, 'descriptor', index, level)] || '—'}</td>)}<td className="border border-border px-3 py-3 text-center font-bold">{fields[instrumentFieldKey(type, 'points', index)] || '—'} pts</td></tr>)}
      </tbody></InstrumentTable><p className="text-right text-xs font-black text-primary">Puntuación máxima: {maxScore} pts</p></div>
    )
  }
  const criterionLabel = type === 'lista-ponderada' ? 'Criterio' : 'Indicador'
  return (
    <InstrumentTable><thead className="bg-violet-50"><tr><th className="border border-border px-3 py-2">{criterionLabel}</th>{type === 'lista-ponderada' ? <><th className="border border-border px-3 py-2">Descripción</th><th className="border border-border px-3 py-2">Ponderación</th></> : null}<th className="border border-border px-3 py-2 text-center">Escala de valoración</th></tr></thead><tbody>
      {indexes.map((index) => <tr key={index}><td className="border border-border px-3 py-3 font-bold">{fields[instrumentFieldKey(type, 'criterion', index)] || `Criterio ${index + 1}`}</td>{type === 'lista-ponderada' ? <><td className="border border-border px-3 py-3 text-muted-foreground">{fields[instrumentFieldKey(type, 'indicator', index)] || '—'}</td><td className="border border-border px-3 py-3 text-center">{fields[instrumentFieldKey(type, 'weight', index)] || '—'}</td></> : null}<td className="border border-border px-3 py-3 text-center text-muted-foreground">{type === 'lista-cotejo' ? 'Sí / No' : 'Según niveles definidos'}</td></tr>)}
    </tbody></InstrumentTable>
  )
}

function ActivityDetailView({
  activity,
  initialTab = 'evaluation',
  onBack,
  onEditActivity,
  onSaveScore,
  records,
  saving,
  students,
}: {
  activity: GradingActivity
  initialTab?: ActivityDetailTab
  onBack: () => void
  onEditActivity: (activity: GradingActivity) => void
  onSaveScore: (enrollmentId: string, activity: GradingActivity, value: string) => void
  records: GradeRecordRow[]
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
  const currentScore = currentRecord?.score ?? suggestedScoreForStudent(studentIndex, activity.maxScore)
  const rubricPoints = rubricLevelPoints(activity.maxScore)
  const levelRows = rubricCriteria.map((criterion, index) => {
    const levelIndex = suggestedLevelIndex(index, currentScore, activity.maxScore)
    return { criterion, levelIndex, points: rubricPoints[levelIndex] ?? 0 }
  })
  const totalRubricScore = Math.min(activity.maxScore, Number(levelRows.reduce((sum, row) => sum + row.points, 0).toFixed(2)))
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
              <h2 className="text-2xl font-black text-primary">{activity.name || 'Actividad sin nombre'}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{activityDescriptionText(activity.description || '') || 'Evaluación de presentación y dominio del tema'}</p>
            </div>
          </div>
          <Badge tone={activityEvaluationStatusTone(activityStatus)}>{activityStatus}</Badge>
        </div>

        <div className="mt-5 grid gap-4 border-t border-border pt-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoItem label="Valor" value={`${activity.maxScore} pts`} />
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
        <ActivityEvaluationPanel
          activity={activity}
          currentRecord={currentRecord}
          levelRows={levelRows}
          onSaveScore={onSaveScore}
          saving={saving}
          selectedStudent={selectedStudent}
          setStudentIndex={setStudentIndex}
          studentIndex={studentIndex}
          students={students}
          totalRubricScore={totalRubricScore}
          setTab={setTab}
        />
      ) : null}

      {tab === 'results' ? (
        <ActivityResultsPanel
          activity={activity}
          average={average}
          distribution={distribution}
          evaluatedCount={evaluatedCount}
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

function ActivityEvaluationPanel({
  activity,
  currentRecord,
  levelRows,
  onSaveScore,
  saving,
  selectedStudent,
  setStudentIndex,
  setTab,
  studentIndex,
  students,
  totalRubricScore,
}: {
  activity: GradingActivity
  currentRecord: GradeRecordRow | null
  levelRows: Array<{ criterion: (typeof rubricCriteria)[number]; levelIndex: number; points: number }>
  onSaveScore: (enrollmentId: string, activity: GradingActivity, value: string) => void
  saving: boolean
  selectedStudent: StudentGradeRow | null
  setStudentIndex: Dispatch<SetStateAction<number>>
  setTab: Dispatch<SetStateAction<ActivityDetailTab>>
  studentIndex: number
  students: StudentGradeRow[]
  totalRubricScore: number
}) {
  const saveCurrentScore = () => {
    if (!selectedStudent) return
    onSaveScore(selectedStudent.enrollmentId, activity, String(totalRubricScore))
  }

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-[1fr_minmax(12rem,18rem)_1fr] items-center gap-3">
        <Button variant="outline" disabled={studentIndex <= 0} onClick={() => setStudentIndex((current) => Math.max(0, current - 1))}>
          <ArrowLeft className="size-4" />
          Anterior
        </Button>
        <Select value={String(studentIndex)} onChange={(event) => setStudentIndex(Number(event.target.value))} className="h-12 text-center font-black">
          {students.map((student, index) => (
            <option key={student.enrollmentId} value={index}>
              {index + 1} / {students.length} - {student.firstName}
            </option>
          ))}
        </Select>
        <Button className="justify-self-end" variant="outline" disabled={studentIndex >= students.length - 1} onClick={() => setStudentIndex((current) => Math.min(students.length - 1, current + 1))}>
          Siguiente
          <ArrowRight className="size-4" />
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-full bg-blue-100 text-lg font-black text-primary">
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
            {instrumentTitle(activity.instrumentType || 'rubrica')} - 4 criterios - Total {activity.maxScore} pts
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[52rem] w-full text-sm">
            <thead className="bg-muted/35 text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
              <tr>
                <th rowSpan={2} className="w-[16rem] border-b border-r border-border px-4 py-3 text-left">Criterios</th>
                <th colSpan={5} className="border-b border-r border-border px-4 py-2 text-center">Niveles de desempeño</th>
                <th rowSpan={2} className="w-28 border-b border-border px-4 py-3 text-center">Puntaje</th>
              </tr>
              <tr>
                {rubricLevelLabels(activity.maxScore).map((level) => (
                  <th key={level.label} className="border-b border-r border-border px-3 py-2 text-center">
                    <span className="block text-foreground">{level.label}</span>
                    <span>{formatGrade(level.points)} pts</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {levelRows.map((row, criterionIndex) => (
                <tr key={row.criterion.title} className="border-b border-border">
                  <td className="border-r border-border px-4 py-4">
                    <p className="font-black text-foreground">{criterionIndex + 1}. {row.criterion.title}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{row.criterion.description}</p>
                  </td>
                  {rubricLevelLabels(activity.maxScore).map((level, levelIndex) => (
                    <td key={level.label} className="border-r border-border px-4 py-4 text-center">
                      <span className={cn(
                        'inline-flex size-5 items-center justify-center rounded-full border-2',
                        row.levelIndex === levelIndex ? 'border-primary bg-primary shadow-[inset_0_0_0_4px_white]' : 'border-border bg-card',
                      )} />
                    </td>
                  ))}
                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex h-10 min-w-20 items-center justify-center rounded-lg border border-border bg-card px-3 font-black text-primary">
                      {formatGrade(row.points)} / {formatGrade(activity.maxScore / 4)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-border p-4">
          <label className="text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">Observación (opcional)</label>
          <Textarea className="mt-2 min-h-24" placeholder="Escribe una observación sobre el desempeño del estudiante..." />
        </div>

        <div className="flex flex-col gap-3 border-t border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700">
            <CheckCircle2 className="size-4" />
            Guardado automáticamente
          </p>
          <div className="flex items-center gap-4">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">Puntaje total</p>
            <p className="text-3xl font-black text-primary">{formatGrade(totalRubricScore)} <span className="text-base text-muted-foreground">/ {activity.maxScore} pts</span></p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button disabled={saving} onClick={() => {
          saveCurrentScore()
          setStudentIndex((current) => Math.min(students.length - 1, current + 1))
        }}>
          Guardar y siguiente
        </Button>
        <Button disabled={saving} variant="outline" onClick={() => {
          saveCurrentScore()
          setTab('results')
        }}>
          Guardar y salir
        </Button>
      </div>
    </section>
  )
}

function ActivityResultsPanel({
  activity,
  average,
  distribution,
  evaluatedCount,
  records,
  students,
}: {
  activity: GradingActivity
  average: number | null
  distribution: Array<{ color: string; count: number; label: string; percent: number }>
  evaluatedCount: number
  records: GradeRecordRow[]
  students: StudentGradeRow[]
}) {
  return (
    <section className="space-y-4">
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
                    <td className="px-4 py-3 font-bold text-primary">{score !== null ? `${formatGrade(score)} / ${activity.maxScore}` : '-'}</td>
                    <td className="px-4 py-3 font-bold">{percent !== null ? `${percent}%` : '-'}</td>
                    <td className="px-4 py-3"><span className={cn('font-bold', gradeLevelTextColor(level))}>{level}</span></td>
                    <td className="px-4 py-3"><span className={score !== null ? 'font-bold text-emerald-700' : 'font-bold text-muted-foreground'}>{score !== null ? 'Evaluado' : 'Pendiente'}</span></td>
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

export function LegacyActivityDetailView({
  activity,
  config,
  onBack,
  onEditActivity,
  onSaveScore,
  records,
  saving,
  students,
}: {
  activity: GradingActivity
  config: GradeCalculationConfig
  onBack: () => void
  onEditActivity: (activity: GradingActivity) => void
  onSaveScore: (enrollmentId: string, activity: GradingActivity, value: string) => void
  records: GradeRecordRow[]
  saving: boolean
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
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{activityDescriptionText(activity.description || '') || 'Actividad sin descripción registrada.'}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => onEditActivity(activity)}>
              Editar actividad
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['info', 'grades', 'notes'] as const).map((item) => (
          <Button key={item} variant={tab === item ? 'primary' : 'outline'} onClick={() => setTab(item)}>
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

        <section className="rounded-lg border border-border bg-card shadow-sm">
          {tab === 'info' ? (
            <div className="p-5 text-sm leading-7 text-muted-foreground">
              <ActivityDescriptionContent value={activity.description} fallback="No hay descripción detallada para esta actividad." />
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
                    return (
                      <tr key={student.enrollmentId} className="border-t border-border">
                        <td className="px-4 py-3 font-medium">{student.lastName}, {student.firstName}</td>
                        <td className="px-4 py-2 text-center">
                          <Input
                            type="number"
                            min={0}
                            max={activity.maxScore}
                            step="0.01"
                            defaultValue={record?.score ?? ''}
                            disabled={saving}
                            className="grade-cell h-9 w-24 text-center font-bold"
                            onKeyDown={focusNextGradeCell}
                            onBlur={(event) => onSaveScore(student.enrollmentId, activity, event.target.value)}
                          />
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
          const accent = blockAccents[summary.index]
          const hasRecovery = Object.values(recoveryScores[summary.block.id] ?? {}).some((value) => typeof value === 'number')
          return (
            <article
              key={summary.block.id}
              className={cn('rounded-lg border p-5 shadow-sm', accent.card)}
              style={{ backgroundColor: accent.cardTint, borderColor: accent.cardBorder }}
            >
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

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Competencia</th>
            {competencyPeriods.filter((period) => period.id !== 'final').map((period) => (
              <th key={period.id} className="w-24 px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">{period.shortName}</th>
            ))}
            <th className="w-36 px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Promedio anual</th>
          </tr>
        </thead>
        <tbody>
          {competencyBlocks.map((block) => {
            const periodScores = competencyPeriods
              .filter((period) => period.id !== 'final')
              .map((period) => averageBlockForPeriod({
                blockId: block.id,
                config,
                periodId: period.id as CompetencyPeriodId,
                recordsByPeriod,
                getActivitiesForPeriod,
                students,
              }))
            const annual = finalBlockAverage(periodScores, config)
            return (
              <tr key={block.id} className="border-t border-border">
                <td className="px-4 py-4">
                  <p className="font-bold text-primary">{blockShortNames[block.id]}</p>
                  <p className="text-xs text-muted-foreground">{block.name}</p>
                </td>
                {periodScores.map((score, index) => (
                  <td key={competencyPeriods[index].id} className="px-4 py-4 text-center font-bold text-primary">{formatGrade(score)}</td>
                ))}
                <td className="px-4 py-4 text-center text-lg font-black text-primary">{formatGrade(annual)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
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
        {competencyBlocks.map((block, index) => {
          const accent = blockAccents[index]

          return (
          <article
            key={block.id}
            className={cn('rounded-lg border p-5 shadow-sm', accent.card)}
            style={{ backgroundColor: accent.cardTint, borderColor: accent.cardBorder }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">{block.shortName}</p>
            <h3 className="mt-2 text-sm font-bold text-primary">{blockShortNames[block.id]}</h3>
            <p className="mt-4 text-3xl font-black text-primary">{formatGrade(blockAverages[index])}</p>
          </article>
          )
        })}
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
  compactLayout = false,
  highlightTarget,
  saving,
  showActions = true,
  showActivityList = true,
  showCompetencySelect = true,
}: {
  activityDraft: ActivityDraft
  activities: GradingActivity[]
  editingActivityId: string | null
  onCancelEdit: () => void
  onChangeDraft: (draft: ActivityDraft) => void
  onDeleteActivity: (activityId: string) => void
  onDuplicateActivity: (activity: GradingActivity) => void
  onEditActivity: (activity: GradingActivity) => void
  onSaveActivity: () => void
  compactLayout?: boolean
  highlightTarget?: ActivityCompletionTarget | null
  saving: boolean
  showActions?: boolean
  showActivityList?: boolean
  showCompetencySelect?: boolean
}) {
  const fieldHighlight = (target: ActivityCompletionTarget) =>
    highlightTarget === target ? 'rounded-lg ring-2 ring-red-400 ring-offset-2 ring-offset-card' : ''

  return (
    <div className="grid gap-2">
      {showCompetencySelect ? (
        <Select value={activityDraft.competencyBlockId} onChange={(event) => onChangeDraft({ ...activityDraft, competencyBlockId: event.target.value })}>
          {competencyBlocks.map((block) => (
            <option key={block.id} value={block.id}>{block.shortName} · {block.name}</option>
          ))}
        </Select>
      ) : null}
      <div className={cn('grid gap-2', compactLayout ? 'sm:grid-cols-[minmax(0,1fr)_6rem]' : 'sm:grid-cols-[minmax(0,1fr)_7rem]')}>
        <label className={cn('grid gap-0.5 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground', fieldHighlight('name'))}>
          Nombre de la actividad
          <Input className="h-9" value={activityDraft.name} onChange={(event) => onChangeDraft({ ...activityDraft, name: event.target.value })} placeholder="Ej. Exposición oral sobre ecosistemas" />
        </label>
        <label className={cn('grid gap-0.5 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground', fieldHighlight('maxScore'))}>
          Valor
          <Input className="h-9" type="number" min={1} value={activityDraft.maxScore} onChange={(event) => onChangeDraft({ ...activityDraft, maxScore: event.target.value })} placeholder="20" />
        </label>
      </div>
      <div className={cn('grid gap-2', compactLayout ? 'sm:grid-cols-2' : 'sm:grid-cols-3')}>
        <label className={cn('grid gap-0.5 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground', fieldHighlight('date'))}>
          Fecha de realización
          <Input className="h-9" type="date" value={activityDraft.date} onChange={(event) => onChangeDraft({ ...activityDraft, date: event.target.value })} />
        </label>
        <label className={cn('grid gap-0.5 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground', fieldHighlight('evaluationTechnique'))}>
          Técnica de evaluación
          <Select className="h-9" value={activityDraft.evaluationTechnique} onChange={(event) => onChangeDraft({ ...activityDraft, evaluationTechnique: event.target.value })}>
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
        <label className={cn('grid gap-0.5 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground', compactLayout ? 'sm:col-span-2' : '', fieldHighlight('instrumentType'))}>
          Instrumento de evaluación
          <Select className="h-9" value={activityDraft.instrumentType} onChange={(event) => onChangeDraft({ ...activityDraft, instrumentType: event.target.value })}>
            <option value="" disabled>Ej. Rúbrica</option>
            <option value="rubrica">Rúbrica</option>
            <option value="lista-cotejo">Lista de cotejo</option>
            <option value="escala">Escala estimativa</option>
            <option value="lista-ponderada">Lista ponderada</option>
          </Select>
        </label>
      </div>
      <div className={cn('grid gap-2', compactLayout ? 'sm:grid-cols-2' : 'sm:grid-cols-2')}>
        <label className={cn('grid gap-0.5 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground', fieldHighlight('activityType'))}>
          Tipo de actividad
          <Select className="h-9" value={activityDraft.activityType} onChange={(event) => onChangeDraft({ ...activityDraft, activityType: event.target.value as ActivityDraft['activityType'] })}>
            <option value="" disabled>Selecciona tipo de actividad</option>
            <option value="individual">Actividad individual</option>
            <option value="group">Actividad grupal</option>
          </Select>
        </label>
        <label className={cn('grid gap-0.5 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground', fieldHighlight('planningMoment'))}>
          Momento de la clase
          <Select className="h-9" value={activityDraft.planningMoment} onChange={(event) => onChangeDraft({ ...activityDraft, planningMoment: event.target.value })}>
            <option value="" disabled>Selecciona momento de la clase</option>
            <option value="inicio">Inicio</option>
            <option value="desarrollo">Desarrollo</option>
            <option value="cierre">Cierre</option>
          </Select>
        </label>
      </div>
      <ResourcePicker
        resources={activityDraft.resources}
        onChange={(resources) => onChangeDraft({ ...activityDraft, resources })}
      />
      <div className={cn('space-y-0.5', fieldHighlight('description'))}>
        <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground" htmlFor="activity-description">
          Descripción de la actividad
        </label>
        <Textarea
          id="activity-description"
          className={cn('resize-none text-base leading-6', compactLayout ? 'h-[5.75rem]' : 'h-20')}
          rows={3}
          value={activityDraft.description}
          onChange={(event) => onChangeDraft({ ...activityDraft, description: event.target.value })}
          placeholder="Describe qué harán los estudiantes y qué evidencia entregarán."
        />
      </div>
      {showActions ? (
        <div className="flex flex-wrap gap-2">
          <Button className="h-9 px-4" onClick={onSaveActivity} disabled={saving}>
            Guardar actividad
          </Button>
          {editingActivityId ? <Button variant="outline" onClick={onCancelEdit}>Cancelar edición</Button> : null}
        </div>
      ) : null}
      {showActivityList && activities.length > 0 ? (
      <div className="max-h-52 overflow-y-auto rounded-lg border border-border">
        {activities.map((activity) => (
          <div key={activity.id} className="flex flex-col gap-3 border-b border-border px-4 py-3 text-sm last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-bold text-primary">{activity.name}</p>
              <p className="text-xs text-muted-foreground">{activity.maxScore} pts · {blockShortNames[activity.competencyBlockId] ?? 'Bloque'} · {activity.activityType === 'group' ? 'Grupal' : 'Individual'} · {activity.instrumentType || 'Sin instrumento'}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => onEditActivity(activity)}>Editar</Button>
              <Button variant="outline" size="sm" onClick={() => onDuplicateActivity(activity)}>Duplicar</Button>
              <Button variant="destructive" size="sm" onClick={() => onDeleteActivity(activity.id)}>Eliminar</Button>
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
  draftMetas,
  onBack,
  onDeleteDraft,
  onOpenDraft,
  onOpenActivity,
  onSelectBlock,
  onViewDrafts,
  periodName,
  periodShortName,
}: {
  activities: GradingActivity[]
  courseTitle: string
  draftMetas: ActivityDraftMeta[]
  onBack: () => void
  onDeleteDraft: (blockId: CompetencyBlockId, draftId?: string) => void
  onOpenDraft: (blockId: CompetencyBlockId, draftId: string) => void
  onOpenActivity: (activityId: string) => void
  onSelectBlock: (blockId: CompetencyBlockId) => void
  onViewDrafts: (blockId?: CompetencyBlockId) => void
  periodName: string
  periodShortName: string
}) {
  const recentDrafts = [...draftMetas]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)
  const blocksWithDrafts = new Set(draftMetas.map((meta) => meta.blockId)).size

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
            draftCount={draftMetas.filter((meta) => meta.blockId === block.id).length}
            onSelectBlock={() => onSelectBlock(block.id)}
            onOpenActivity={onOpenActivity}
          />
        ))}
      </div>
      <DraftCenter
        blocksWithDrafts={blocksWithDrafts}
        courseTitle={courseTitle}
        draftMetas={recentDrafts}
        onDeleteDraft={onDeleteDraft}
        periodShortName={periodShortName}
        totalDrafts={draftMetas.length}
        onOpenDraft={onOpenDraft}
        onViewDrafts={onViewDrafts}
      />
    </section>
  )
}

function ActivityBlockHubCard({
  accent,
  activities,
  block,
  draftCount,
  onSelectBlock,
  onOpenActivity,
}: {
  accent: (typeof blockAccents)[number]
  activities: GradingActivity[]
  block: (typeof competencyBlocks)[number]
  draftCount: number
  onSelectBlock: () => void
  onOpenActivity: (activityId: string) => void
}) {
  const plannedPoints = activities.reduce((sum, activity) => sum + activity.maxScore, 0)

  return (
    <article
      className={cn('flex min-h-[14rem] flex-col rounded-lg border p-4 shadow-sm', accent.card)}
      style={{ backgroundColor: accent.cardTint, borderColor: accent.cardBorder }}
    >
      <div className="flex items-start gap-2">
        <span className={cn('mt-0.5 h-12 w-1.5 shrink-0 rounded-full', accent.dot)} />
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">{block.shortName}</p>
          <h3 className="mt-0.5 text-sm font-black leading-tight text-foreground">{blockShortNames[block.id] ?? block.name}</h3>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-card/75 px-3 py-2 ring-1 ring-border">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Creadas</p>
          <p className="text-xl font-black leading-tight text-primary">{activities.length}</p>
        </div>
        <div className="rounded-lg bg-card/75 px-3 py-2 ring-1 ring-border">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Borradores</p>
          <p className="text-xl font-black leading-tight text-primary">{draftCount}</p>
        </div>
      </div>

      <div className="mt-3 rounded-lg bg-card/75 px-3 py-2 text-sm ring-1 ring-border">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Total planificado</p>
        <p className="mt-1 text-lg font-black text-foreground">{plannedPoints} pts</p>
      </div>

      {activities.length > 0 ? (
        <div className="mt-3 space-y-1.5">
          {activities.slice(0, 3).map((activity) => (
            <button
              key={activity.id}
              type="button"
              className="flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-card/90 px-3 py-2 text-left text-xs shadow-sm transition hover:border-primary hover:text-primary"
              onClick={() => onOpenActivity(activity.id)}
            >
              <span className="min-w-0 truncate font-black">{activity.name}</span>
              <Eye className="size-4 shrink-0" />
            </button>
          ))}
          {activities.length > 3 ? <p className="px-1 text-[11px] text-muted-foreground">+{activities.length - 3} actividades más</p> : null}
        </div>
      ) : null}

      <Button className="mt-3 h-9 w-full" onClick={onSelectBlock}>
        <Plus className="size-4" />
        Crear actividad
      </Button>
    </article>
  )
}

function DraftCenter({
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

  return (
    <section className="rounded-lg border border-border bg-card p-3 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[minmax(18rem,1.15fr)_minmax(10rem,0.7fr)_minmax(14rem,0.95fr)_minmax(12rem,0.8fr)_auto] lg:items-center">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <FileText className="size-5" />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-black text-foreground">Centro de borradores</h3>
            <p className="mt-1 max-w-md text-xs leading-5 text-muted-foreground">
              Aqui puedes continuar editando las actividades que dejaste pendientes. Los borradores se guardan automaticamente.
            </p>
          </div>
        </div>
        <DraftMetric icon={<FileText className="size-4" />} label="Total de borradores" value={totalDrafts} />
        <DraftMetric icon={<ClipboardList className="size-4" />} label="Bloques con borradores" tone="success" value={blocksWithDrafts} />
        <DraftMetric icon={<CalendarDays className="size-4" />} label="Ultima edicion" value={latestDraft ? formatDraftDate(latestDraft.updatedAt) : '-'} />
        <Button variant="outline" className="h-10 justify-center whitespace-nowrap px-4 text-xs text-primary" onClick={onViewDrafts}>
          Ver todos los borradores
          <ArrowRight className="size-4" />
        </Button>
      </div>

      <div className="mt-3 rounded-lg border border-border p-2.5">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-black text-foreground">Borradores recientes</p>
          <button type="button" className="text-xs font-black text-primary hover:underline" onClick={onViewDrafts}>
            Ver todos
          </button>
        </div>
        {draftMetas.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {draftMetas.map((meta) => {
              const accent = getBlockAccent(meta.blockId)

              return (
                <button
                  key={meta.draft.draftId}
                  type="button"
                  className={cn(
                    'relative min-h-[8.25rem] overflow-hidden rounded-lg border border-border bg-card px-3 py-2.5 pl-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md',
                    accent.card,
                  )}
                  style={{ backgroundColor: accent.cardTint, borderColor: accent.cardBorder }}
                  onClick={() => meta.draft.draftId && onOpenDraft(meta.blockId, meta.draft.draftId)}
                >
                  <span aria-hidden="true" className={cn('absolute inset-y-3 left-0 w-1 rounded-r-full', accent.dot)} />
                  <div className="flex items-start justify-between gap-2">
                    <span className={cn('inline-flex h-5 items-center whitespace-nowrap rounded-full px-2 text-[10px] font-black ring-1 ring-inset', accent.badge)}>
                      {meta.block.shortName}
                    </span>
                    <div className="flex items-center gap-1">
                      <span
                        role="button"
                        tabIndex={0}
                        className="inline-flex size-7 items-center justify-center rounded-md text-destructive transition hover:bg-destructive/10"
                        aria-label="Eliminar borrador"
                        onClick={(event) => {
                          event.stopPropagation()
                          if (meta.draft.draftId) onDeleteDraft(meta.blockId, meta.draft.draftId)
                        }}
                        onKeyDown={(event) => {
                          if (event.key !== 'Enter' && event.key !== ' ') return
                          event.preventDefault()
                          event.stopPropagation()
                          if (meta.draft.draftId) onDeleteDraft(meta.blockId, meta.draft.draftId)
                        }}
                      >
                        <Trash2 className="size-4" />
                      </span>
                      <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                    </div>
                  </div>
                  <p className="mt-2 truncate text-sm font-black text-foreground">{meta.draft.name || 'Actividad sin nombre'}</p>
                  <p className="mt-1 line-clamp-2 text-xs leading-4 text-muted-foreground">{periodShortName} - {courseTitle}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Ultima edicion: {formatDraftDate(meta.updatedAt)}</p>
                  <ProgressBar value={meta.completion} className="mt-3" indicatorColor={accent.progressColor} />
                  <p className="mt-1 text-xs text-muted-foreground">{meta.completion}% completado</p>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="rounded-lg bg-muted/30 px-4 py-6 text-sm text-muted-foreground">
            <p className="font-bold text-foreground">No tienes actividades pendientes.</p>
            <p className="mt-1">Las actividades incompletas que guardes apareceran aqui automaticamente.</p>
          </div>
        )}
      </div>
    </section>
  )
}

function DraftMetric({
  icon,
  label,
  tone = 'default',
  value,
}: {
  icon: ReactNode
  label: string
  tone?: 'default' | 'success'
  value: string | number
}) {
  return (
    <div className="flex min-h-[3.35rem] items-center gap-3 rounded-lg bg-muted/20 px-3 py-2">
      <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-lg', tone === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700')}>
        {icon}
      </span>
      <div className="min-w-0">
        <p className="whitespace-nowrap text-[10px] font-bold uppercase leading-4 tracking-[0.12em] text-muted-foreground">{label}</p>
        <p className="mt-0.5 truncate text-sm font-black text-foreground">{value}</p>
      </div>
    </div>
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
  const [blockFilter, setBlockFilter] = useState<'all' | CompetencyBlockId>(initialBlock)
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
    .filter((meta) => blockFilter === 'all' || meta.blockId === blockFilter)
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
    setBlockFilter('all')
    setInstrumentFilter('all')
    setPeriodFilter('all')
    setQuery('')
    setSortBy('updated-desc')
    setPage(1)
  }

  function confirmDelete(meta: ActivityDraftMeta) {
    if (!meta.draft.draftId) return
    const shouldDelete = window.confirm('Eliminar este borrador? Esta accion no se puede deshacer.')
    if (shouldDelete) onDeleteDraft(meta.blockId, meta.draft.draftId)
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <button type="button" className="font-medium text-primary hover:underline" onClick={onBack}>
              Calificaciones
            </button>
            <span>/</span>
            <button type="button" className="font-medium text-primary hover:underline" onClick={onBack}>
              Actividades
            </button>
            <span>/</span>
            <span>Borradores</span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <h2 className="text-3xl font-black text-primary">Borradores de actividades</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Continua editando las actividades que dejaste pendientes de completar.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="size-4" />
            Volver
          </Button>
          <Button onClick={onCreateActivity}>
            <Plus className="size-4" />
            Nueva actividad
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-3 shadow-sm">
        <div className="flex flex-wrap gap-2 border-b border-border pb-3">
          <DraftFilterChip active={activeBlock === 'all'} label="Todos" count={draftMetas.length} onClick={() => { setActiveBlock('all'); setBlockFilter('all'); setPage(1) }} />
          {competencyBlocks.map((block) => {
            const accent = getBlockAccent(block.id)

            return (
              <DraftFilterChip
                key={block.id}
                active={activeBlock === block.id}
                label={block.shortName}
                count={blockCounts[block.id] ?? 0}
                accent={accent}
                onClick={() => { setActiveBlock(block.id); setBlockFilter(block.id); setPage(1) }}
              />
            )
          })}
        </div>

        <div className="grid gap-2 py-3 lg:grid-cols-[minmax(14rem,1fr)_12rem_12rem_13rem_13rem]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="h-10 pl-9" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1) }} placeholder="Buscar borradores..." />
          </label>
          <Select className="h-10" value={blockFilter} onChange={(event) => { setBlockFilter(event.target.value as 'all' | CompetencyBlockId); setPage(1) }}>
            <option value="all">Todos los bloques</option>
            {competencyBlocks.map((block) => <option key={block.id} value={block.id}>{block.shortName}</option>)}
          </Select>
          <Select className="h-10" value={periodFilter} onChange={(event) => { setPeriodFilter(event.target.value); setPage(1) }}>
            <option value="all">Todos los periodos</option>
            <option value={periodShortName}>{periodShortName} - {periodName}</option>
          </Select>
          <Select className="h-10" value={instrumentFilter} onChange={(event) => { setInstrumentFilter(event.target.value); setPage(1) }}>
            <option value="all">Todos los instrumentos</option>
            <option value="rubrica">Rubrica</option>
            <option value="lista-cotejo">Lista de cotejo</option>
            <option value="escala">Escala estimativa</option>
            <option value="lista-ponderada">Lista ponderada</option>
          </Select>
          <Select className="h-10" value={sortBy} onChange={(event) => { setSortBy(event.target.value); setPage(1) }}>
            <option value="updated-desc">Ultima modificacion</option>
            <option value="updated-asc">Mas antiguo</option>
            <option value="name-asc">Nombre A-Z</option>
            <option value="completion-desc">Mayor porcentaje</option>
            <option value="completion-asc">Menor porcentaje</option>
          </Select>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="min-w-[64rem] w-full text-left text-sm">
            <thead className="bg-muted/40 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Actividad</th>
                <th className="px-4 py-3">Bloque</th>
                <th className="px-4 py-3">Curso / Asignatura</th>
                <th className="px-4 py-3">Periodo</th>
                <th className="px-4 py-3">Instrumento</th>
                <th className="px-4 py-3">Completado</th>
                <th className="px-4 py-3">Ultima edicion</th>
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
          {pageMetas.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
              <p className="font-bold text-foreground">No hay borradores que coincidan con los filtros seleccionados.</p>
              <Button variant="outline" className="mt-3 h-9 px-4" onClick={clearFilters}>Limpiar filtros</Button>
            </div>
          ) : null}
        </div>

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
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-black transition',
        active && !accent ? 'bg-primary text-primary-foreground shadow-sm' : null,
        active && accent ? cn(accent.progress, 'text-white shadow-sm') : null,
        !active ? 'bg-muted/55 text-muted-foreground hover:text-foreground' : null,
      )}
      onClick={onClick}
    >
      {!active && accent ? <span aria-hidden="true" className={cn('size-2 rounded-full', accent.dot)} /> : null}
      <span>{label}</span>
      <span className={cn(
        'inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-xs',
        active ? 'bg-primary-foreground/15 text-primary-foreground' : null,
        !active && accent ? cn('ring-1', accent.badge) : null,
        !active && !accent ? 'bg-card/80 text-current' : null,
      )}>
        {count}
      </span>
    </button>
  )
}

type ActivityCreationStage = 'activity' | 'instrument' | 'review'

function ActivityCreationView(props: {
  activityDraft: ActivityDraft
  hasDraft: boolean
  activities: GradingActivity[]
  block: (typeof competencyBlocks)[number]
  editingActivityId: string | null
  onBack: () => void
  onCancelEdit: () => void
  onChangeDraft: (draft: ActivityDraft) => void
  onDeleteActivity: (activityId: string) => void
  onDuplicateActivity: (activity: GradingActivity) => void
  onEditActivity: (activity: GradingActivity) => void
  onSaveActivity: () => void
  saving: boolean
}) {
  const { activityDraft, block, editingActivityId, hasDraft, onBack, onChangeDraft, onSaveActivity, saving } = props
  const [stage, setStage] = useState<ActivityCreationStage>('activity')
  const [completionIssues, setCompletionIssues] = useState<ActivityCompletionIssue[]>([])
  const [highlightTarget, setHighlightTarget] = useState<ActivityCompletionTarget | null>(null)
  const accent = getBlockAccent(block.id)
  const progressMeta = buildActivityDraftMeta(activityDraft, block.id)
  const dataIssues = progressMeta.pendingIssues.filter((issue) => issue.tab === 'activity')
  const instrumentLabel = activityDraft.instrumentType ? instrumentTitle(activityDraft.instrumentType) : 'Instrumento de evaluación'

  function handleDraftChange(draft: ActivityDraft) {
    const changedInstrument = draft.instrumentType !== activityDraft.instrumentType
    onChangeDraft({
      ...draft,
      competencyBlockId: block.id,
      instrumentCompleted: changedInstrument ? false : draft.instrumentCompleted,
      instrumentFields: changedInstrument ? {} : draft.instrumentFields,
      instrumentId: changedInstrument ? undefined : draft.instrumentId,
    })
  }

  function goToIssue(issue: ActivityCompletionIssue) {
    setStage(issue.tab === 'instrument' ? 'instrument' : 'activity')
    setHighlightTarget(issue.target)
    setCompletionIssues([])
  }

  function saveActivity() {
    const issues = validateActivityCompletion(activityDraft)
    if (issues.length > 0) {
      setCompletionIssues(issues)
      goToIssue(issues[0])
      setCompletionIssues(issues)
      return
    }
    onSaveActivity()
  }

  const stages: Array<{ id: ActivityCreationStage; label: string; complete: boolean }> = [
    { id: 'activity', label: 'Datos de la actividad', complete: dataIssues.length === 0 },
    { id: 'instrument', label: instrumentLabel, complete: Boolean(activityDraft.instrumentType && activityDraft.instrumentCompleted) },
    { id: 'review', label: 'Revisar y guardar', complete: progressMeta.pendingIssues.length === 0 },
  ]

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <button type="button" className="font-medium text-primary hover:underline" onClick={onBack}>Calificaciones</button>
        <span>›</span><span>{block.shortName}</span><span>›</span>
        <span>{editingActivityId ? 'Editar actividad' : 'Crear actividad'}</span>
      </div>

      <div className="relative overflow-hidden rounded-xl px-5 py-4 text-white shadow-sm" style={{ background: `linear-gradient(115deg, ${accent.progressColor}, #123b88)` }}>
        <div className="relative z-10 flex items-center gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-white/95 text-primary shadow-sm"><ClipboardList className="size-6" /></span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] opacity-80">{block.shortName}</p>
            <h2 className="text-xl font-black">{blockShortNames[block.id] ?? block.name}</h2>
            <p className="mt-1 max-w-3xl text-xs text-white/80">{block.name}</p>
          </div>
          {hasDraft ? <Badge tone="warning" className="ml-auto">Borrador autoguardado</Badge> : null}
        </div>
        <span className="absolute -right-8 -top-16 size-52 rounded-full bg-white/10" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_17rem]">
        <main className="min-w-0 space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-3xl font-black text-primary">{editingActivityId ? 'Editar actividad' : 'Crear actividad'}</h2>
              <p className="mt-1 text-sm text-muted-foreground">Completa la actividad y su instrumento como un único flujo.</p>
            </div>
            <div className="min-w-64 lg:w-72">
              <div className="flex items-center justify-between text-xs font-black"><span>Progreso de la actividad</span><span className={accent.text}>{progressMeta.completion}%</span></div>
              <ProgressBar value={progressMeta.completion} className="mt-2" indicatorColor={accent.progressColor} />
            </div>
          </div>

          <nav className="grid grid-cols-3 overflow-hidden rounded-xl border border-border bg-card shadow-sm" aria-label="Etapas de creación">
            {stages.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={cn('relative flex min-h-14 items-center justify-center gap-2 border-r border-border px-3 text-sm font-black transition last:border-r-0 hover:bg-muted/30', stage === item.id ? cn(accent.panel, accent.text) : 'text-muted-foreground')}
                onClick={() => { setStage(item.id); setHighlightTarget(null) }}
              >
                <span className={cn('grid size-6 shrink-0 place-items-center rounded-full text-xs', item.complete ? 'bg-emerald-500 text-white' : stage === item.id ? cn(accent.progress, 'text-white') : 'bg-muted text-muted-foreground')}>
                  {item.complete ? '✓' : index + 1}
                </span>
                <span className="hidden sm:inline">{index + 1}. {item.label}</span>
                {stage === item.id ? <span className="absolute inset-x-0 bottom-0 h-0.5" style={{ backgroundColor: accent.progressColor }} /> : null}
              </button>
            ))}
          </nav>

          {stage === 'activity' ? (
            <ActivityDataSections activityDraft={activityDraft} accent={accent} highlightTarget={highlightTarget} onChangeDraft={handleDraftChange} />
          ) : null}

          {stage === 'instrument' ? (
            <div className="space-y-3">
              <div className="rounded-xl border border-violet-200 bg-violet-50/70 px-4 py-3">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-violet-700">Instrumento seleccionado: {instrumentLabel}</p>
                <p className="mt-1 text-sm text-muted-foreground">Configura los criterios y niveles que utilizarás para evaluar esta actividad.</p>
              </div>
              <InstrumentPreview
                key={activityDraft.instrumentType}
                activityName={activityDraft.name}
                completed={activityDraft.instrumentCompleted}
                fields={activityDraft.instrumentFields}
                highlight={highlightTarget === 'instrumentBody' || highlightTarget === 'instrumentType'}
                instrumentType={activityDraft.instrumentType}
                maxScore={Number(activityDraft.maxScore) || 0}
                onCompletedChange={(instrumentCompleted) => handleDraftChange({ ...activityDraft, instrumentCompleted })}
                onFieldsChange={(instrumentFields) => handleDraftChange({ ...activityDraft, instrumentFields })}
              />
            </div>
          ) : null}

          {stage === 'review' ? (
            <ActivityReview activityDraft={activityDraft} issues={progressMeta.pendingIssues} onSelectIssue={goToIssue} />
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
            {stage === 'activity' ? (
              <Button variant="outline" onClick={onBack}><X className="size-4" />Cancelar</Button>
            ) : (
              <Button variant="outline" onClick={() => setStage(stage === 'review' ? 'instrument' : 'activity')}><ArrowLeft className="size-4" />{stage === 'review' ? `Volver a ${instrumentLabel}` : 'Volver a datos'}</Button>
            )}
            {stage === 'activity' ? (
              <Button onClick={() => setStage('instrument')}>Continuar al instrumento<ArrowRight className="size-4" /></Button>
            ) : stage === 'instrument' ? (
              <Button onClick={() => setStage('review')}>Guardar y continuar<ArrowRight className="size-4" /></Button>
            ) : (
              <Button onClick={saveActivity} disabled={saving}><CheckCircle2 className="size-4" />{editingActivityId ? 'Guardar cambios' : 'Guardar actividad'}</Button>
            )}
          </div>
        </main>

        <ActivityProgressCard meta={progressMeta} onSelectIssue={goToIssue} />
      </div>

      {completionIssues.length > 0 ? (
        <ActivityCompletionModal
          deleteLabel={editingActivityId ? 'Descartar cambios' : 'Eliminar borrador'}
          issues={completionIssues}
          onClose={() => setCompletionIssues([])}
          onDelete={onBack}
          onSelectIssue={goToIssue}
          onSaveDraft={onBack}
        />
      ) : null}
    </section>
  )
}

const evaluationTechniqueOptions = [
  ['observacion-directa', 'Observación directa'], ['observacion-sistematica', 'Observación sistemática'],
  ['preguntas-orales', 'Preguntas orales'], ['dialogo-reflexivo', 'Diálogo reflexivo'], ['debate', 'Debate'],
  ['exposicion', 'Exposición'], ['presentacion', 'Presentación'], ['entrevista', 'Entrevista'], ['mesa-redonda', 'Mesa redonda'],
  ['dramatizacion', 'Dramatización'], ['analisis-producciones', 'Análisis de producciones'], ['portafolio', 'Portafolio'],
  ['diario-reflexivo', 'Diario reflexivo'], ['estudio-caso', 'Estudio de caso'], ['proyecto', 'Proyecto'],
  ['resolucion-problemas', 'Resolución de problemas'], ['mapa-conceptual', 'Mapa conceptual'], ['ensayo', 'Ensayo'],
  ['prueba-escrita', 'Prueba escrita'], ['autoevaluacion', 'Autoevaluación'], ['coevaluacion', 'Coevaluación'], ['heteroevaluacion', 'Heteroevaluación'],
] as const

function ActivityDataSections({ activityDraft, accent, highlightTarget, onChangeDraft }: {
  activityDraft: ActivityDraft
  accent: (typeof blockAccents)[number]
  highlightTarget: ActivityCompletionTarget | null
  onChangeDraft: (draft: ActivityDraft) => void
}) {
  const highlight = (target: ActivityCompletionTarget) => highlightTarget === target ? 'ring-2 ring-red-400 ring-offset-2' : ''
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <CreationFormSection icon={<FileText className="size-4" />} number={1} title="Información general" accent={accent}>
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_11rem]">
          <label className={cn('space-y-1.5 text-sm font-bold', highlight('name'))}>Nombre de la actividad <span className="text-destructive">*</span><Input className="h-11" value={activityDraft.name} onChange={(event) => onChangeDraft({ ...activityDraft, name: event.target.value })} placeholder="Ej: Exposición oral sobre el cambio climático" /></label>
          <label className={cn('space-y-1.5 text-sm font-bold', highlight('maxScore'))}>Valor en puntos <span className="text-destructive">*</span><div className="relative"><Input className="h-11 pr-12 font-black" type="number" min={1} value={activityDraft.maxScore} onChange={(event) => onChangeDraft({ ...activityDraft, maxScore: event.target.value })} placeholder="20" /><span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-muted-foreground">pts</span></div></label>
        </div>
      </CreationFormSection>

      <CreationFormSection icon={<CalendarDays className="size-4" />} number={2} title="Planificación" accent={accent}>
        <div className="grid gap-4 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <label className={cn('space-y-1.5 text-sm font-bold', highlight('date'))}>Fecha de realización <span className="text-destructive">*</span><Input className="h-11" type="date" value={activityDraft.date} onChange={(event) => onChangeDraft({ ...activityDraft, date: event.target.value })} /></label>
          <div className={cn('space-y-1.5', highlight('planningMoment'))}><p className="text-sm font-bold">Momento de la clase <span className="text-destructive">*</span></p><div className="grid grid-cols-3 gap-2">{([{ id: 'inicio', icon: <Play className="size-4 text-emerald-500" /> }, { id: 'desarrollo', icon: <CircleDot className="size-4 text-blue-600" /> }, { id: 'cierre', icon: <Flag className="size-4 text-violet-500" /> }] as const).map((moment) => <button key={moment.id} type="button" className={cn('flex h-11 items-center justify-center gap-2 rounded-lg border text-sm font-black capitalize transition', activityDraft.planningMoment === moment.id ? cn(accent.card, accent.text, 'shadow-sm') : 'border-border bg-card text-muted-foreground hover:border-primary')} onClick={() => onChangeDraft({ ...activityDraft, planningMoment: moment.id })}>{moment.icon}{moment.id}</button>)}</div></div>
        </div>
      </CreationFormSection>

      <CreationFormSection icon={<Target className="size-4" />} number={3} title="Evaluación" accent={accent}>
        <div className="grid gap-3 md:grid-cols-2">
          <label className={cn('space-y-1.5 text-sm font-bold', highlight('evaluationTechnique'))}>Técnica de evaluación <span className="text-destructive">*</span><Select className="h-11" value={activityDraft.evaluationTechnique} onChange={(event) => onChangeDraft({ ...activityDraft, evaluationTechnique: event.target.value })}><option value="" disabled>Seleccionar técnica</option>{evaluationTechniqueOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</Select></label>
          <label className={cn('space-y-1.5 text-sm font-bold', highlight('instrumentType'))}>Instrumento de evaluación <span className="text-destructive">*</span><Select className="h-11" value={activityDraft.instrumentType} onChange={(event) => onChangeDraft({ ...activityDraft, instrumentType: event.target.value })}><option value="" disabled>Seleccionar instrumento</option><option value="rubrica">Rúbrica</option><option value="lista-cotejo">Lista de cotejo</option><option value="escala">Escala estimativa</option><option value="lista-ponderada">Lista ponderada</option></Select></label>
        </div>
      </CreationFormSection>

      <CreationFormSection icon={<Users className="size-4" />} number={4} title="Modalidad" accent={accent}>
        <div className={cn('grid gap-3 sm:grid-cols-2', highlight('activityType'))}>
          {([{ id: 'individual', title: 'Individual', detail: 'Cada estudiante realiza la actividad de forma individual.' }, { id: 'group', title: 'Grupal', detail: 'La actividad se realiza en grupos de estudiantes.' }] as const).map((option) => (
            <button key={option.id} type="button" className={cn('relative flex min-h-24 items-center gap-4 rounded-xl border p-4 text-left transition', activityDraft.activityType === option.id ? cn(accent.card, accent.text, 'shadow-sm') : 'border-border bg-card hover:border-primary/50')} onClick={() => onChangeDraft({ ...activityDraft, activityType: option.id })}>
              <span className={cn('grid size-11 shrink-0 place-items-center rounded-full', activityDraft.activityType === option.id ? cn(accent.progress, 'text-white') : 'bg-muted text-muted-foreground')}><Users className="size-5" /></span><span><span className="block font-black">{option.title}</span><span className="mt-1 block text-xs leading-5 text-muted-foreground">{option.detail}</span></span>{activityDraft.activityType === option.id ? <CheckCircle2 className="absolute right-3 top-3 size-5" /> : null}
            </button>
          ))}
        </div>
      </CreationFormSection>

      <CreationFormSection icon={<Box className="size-4" />} number={5} title="Recursos y materiales" optional accent={accent}>
        <ResourcePicker resources={activityDraft.resources} onChange={(resources) => onChangeDraft({ ...activityDraft, resources })} />
      </CreationFormSection>

      <CreationFormSection icon={<FileText className="size-4" />} number={6} title="Descripción de la actividad" accent={accent}>
        <div className={highlight('description')}><StructuredActivityDescriptionEditor value={activityDraft.description} onChange={(description) => onChangeDraft({ ...activityDraft, description })} /></div>
      </CreationFormSection>
    </div>
  )
}


function normalizeEditorUrl(value: string, imageOnly = false) {
  const trimmed = value.trim()
  if (!trimmed) return ''
  const candidate = /^[a-z][a-z\d+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`
  try {
    const parsed = new URL(candidate)
    if (!['http:', 'https:'].includes(parsed.protocol)) return ''
    if (imageOnly && !parsed.hostname) return ''
    return parsed.toString()
  } catch {
    return ''
  }
}

function descriptionToEditorHtml(value: string) {
  if (!value) return ''
  if (/<\/?[a-z][\s\S]*>/i.test(value)) return sanitizeActivityDescriptionHtml(value)
  return escapeHtml(value).replace(/\n/g, '<br>')
}

function activityDescriptionText(value: string) {
  if (!value) return ''
  if (typeof DOMParser === 'undefined') return value.replace(/<[^>]*>/g, ' ')
  const documentValue = new DOMParser().parseFromString(value, 'text/html')
  return documentValue.body.textContent ?? ''
}

function sanitizeActivityDescriptionHtml(value: string) {
  if (!value || typeof DOMParser === 'undefined') return value
  const parsed = new DOMParser().parseFromString(value, 'text/html')
  parsed.querySelectorAll('script, style, iframe, object, embed').forEach((element) => element.remove())
  parsed.body.querySelectorAll('*').forEach((element) => {
    const allowedTags = new Set(['P', 'DIV', 'BR', 'B', 'STRONG', 'I', 'EM', 'U', 'SPAN', 'UL', 'OL', 'LI', 'A', 'IMG', 'FIGURE', 'FIGCAPTION', 'H3', 'BLOCKQUOTE'])
    if (!allowedTags.has(element.tagName)) {
      element.replaceWith(...Array.from(element.childNodes))
      return
    }
    Array.from(element.attributes).forEach((attribute) => {
      const safeStyle = attribute.name === 'style' && attribute.value.split(';').filter(Boolean).every((rule) => /^\s*(text-align:\s*(left|center|right)|font-size:\s*(1[0-9]|2[0-9]|3[0-2])px)\s*$/i.test(rule))
      const allowedFigureAttribute = element.tagName === 'FIGURE' && ['data-activity-image', 'data-size', 'data-align'].includes(attribute.name)
      const allowedAttribute = (element.tagName === 'A' && attribute.name === 'href') || (element.tagName === 'IMG' && ['src', 'alt'].includes(attribute.name)) || allowedFigureAttribute || safeStyle
      if (!allowedAttribute || attribute.name.startsWith('on')) element.removeAttribute(attribute.name)
    })
    if (element instanceof HTMLAnchorElement && element.href) {
      const safeHref = normalizeEditorUrl(element.getAttribute('href') ?? '')
      if (!safeHref) element.removeAttribute('href')
      else element.href = safeHref
      element.target = '_blank'
      element.rel = 'noopener noreferrer'
    }
    if (element instanceof HTMLImageElement) {
      const safeSource = normalizeEditorUrl(element.getAttribute('src') ?? '', true)
      if (!safeSource) element.remove()
      else element.src = safeSource
    }
  })
  return parsed.body.innerHTML
}

function ActivityDescriptionContent({ value, fallback }: { value?: string; fallback: string }) {
  if (!value) return <p>{fallback}</p>
  return <div className="activity-description space-y-2 [&_a]:text-primary [&_a]:underline [&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-blue-300 [&_blockquote]:bg-blue-50/50 [&_blockquote]:px-4 [&_blockquote]:py-3 [&_blockquote]:text-slate-700 [&_figcaption]:mt-2 [&_figcaption]:text-center [&_figcaption]:text-xs [&_figcaption]:text-muted-foreground [&_figure]:my-4 [&_figure]:w-full [&_figure[data-align='center']_img]:mx-auto [&_figure[data-align='right']_img]:ml-auto [&_figure[data-size='full']_img]:w-full [&_figure[data-size='large']_img]:w-3/4 [&_figure[data-size='medium']_img]:w-1/2 [&_figure[data-size='small']_img]:w-1/4 [&_h3]:text-xl [&_h3]:font-semibold [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg [&_li]:ml-5 [&_ol]:list-decimal [&_ul]:list-disc" dangerouslySetInnerHTML={{ __html: descriptionToEditorHtml(value) }} />
}

function CreationFormSection({ accent, children, icon, number, optional = false, title }: { accent: (typeof blockAccents)[number]; children: ReactNode; icon: ReactNode; number: number; optional?: boolean; title: string }) {
  return <section className="border-b border-border p-4 last:border-b-0"><div className={cn('mb-3 flex items-center gap-2 text-sm font-black', accent.text)}><span className={cn('grid size-7 place-items-center rounded-lg', accent.card)}>{icon}</span><span>{number}. {title}</span>{optional ? <span className="text-xs font-medium opacity-75">(Opcional)</span> : null}</div>{children}</section>
}

function ActivityReview({ activityDraft, issues, onSelectIssue }: { activityDraft: ActivityDraft; issues: ActivityCompletionIssue[]; onSelectIssue: (issue: ActivityCompletionIssue) => void }) {
  const issueFor = (target: ActivityCompletionTarget) => issues.find((issue) => issue.target === target)
  const checks: Array<[ActivityCompletionTarget, string]> = [['name', 'Nombre completado'], ['maxScore', 'Valor asignado'], ['date', 'Fecha seleccionada'], ['evaluationTechnique', 'Técnica seleccionada'], ['instrumentType', 'Instrumento seleccionado'], ['activityType', 'Modalidad definida'], ['planningMoment', 'Momento de la clase'], ['description', 'Descripción completada'], ['instrumentBody', `${instrumentTitle(activityDraft.instrumentType)} completo`]]
  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm"><h3 className="text-lg font-black text-primary">Revisión final</h3><p className="mt-1 text-sm text-muted-foreground">Confirma la información antes de guardar la actividad.</p>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><InfoItem label="Nombre" value={activityDraft.name || 'Sin nombre'} /><InfoItem label="Valor" value={activityDraft.maxScore ? `${activityDraft.maxScore} pts` : 'Sin valor'} /><InfoItem label="Fecha" value={formatActivityDate(activityDraft.date)} /><InfoItem label="Técnica" value={formatActivityTechnique(activityDraft.evaluationTechnique)} /><InfoItem label="Instrumento" value={instrumentTitle(activityDraft.instrumentType)} /><InfoItem label="Modalidad" value={activityDraft.activityType === 'group' ? 'Grupal' : activityDraft.activityType === 'individual' ? 'Individual' : 'Sin definir'} /><InfoItem label="Momento" value={activityDraft.planningMoment ? activityMomentTitle(activityDraft.planningMoment) : 'Sin definir'} /></dl>
      </section>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-4"><section className="rounded-xl border border-border bg-card p-5 shadow-sm"><h4 className="font-black text-primary">Recursos y materiales</h4>{activityDraft.resources.length ? <div className="mt-3 flex flex-wrap gap-2">{activityDraft.resources.map((resource) => <Badge key={resource}>{resource}</Badge>)}</div> : <p className="mt-2 text-sm text-muted-foreground">Sin recursos seleccionados (opcional).</p>}</section><section className="rounded-xl border border-border bg-card p-5 shadow-sm"><h4 className="font-black text-primary">Descripción</h4><div className="mt-3 text-sm leading-6 text-muted-foreground"><ActivityDescriptionContent value={activityDraft.description} fallback="Sin descripción." /></div></section><section className="rounded-xl border border-border bg-card p-5 shadow-sm"><div className="mb-3 flex items-center justify-between gap-3"><h4 className="font-black text-primary">{instrumentTitle(activityDraft.instrumentType)}</h4><Badge tone={activityDraft.instrumentCompleted ? 'success' : 'warning'}>{activityDraft.instrumentCompleted ? 'Completo' : 'Incompleto'}</Badge></div><ReadOnlyInstrument type={activityDraft.instrumentType} fields={activityDraft.instrumentFields} maxScore={Number(activityDraft.maxScore) || 0} /></section></div>
        <aside className="h-fit rounded-xl border border-border bg-card p-4 shadow-sm"><h4 className="font-black text-primary">Lista de comprobación</h4><div className="mt-3 space-y-1">{checks.map(([target, label]) => { const issue = issueFor(target); return <button key={target} type="button" disabled={!issue} className={cn('flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs font-bold', issue ? 'text-amber-700 hover:bg-amber-50' : 'text-emerald-700')} onClick={() => issue && onSelectIssue(issue)}><span>{issue ? '⚠' : '✓'}</span>{label}</button> })}<div className="flex items-center gap-2 px-2 py-2 text-xs font-bold text-emerald-700"><span>✓</span>Recursos revisados (opcional)</div></div></aside>
      </div>
    </div>
  )
}

export function LegacyActivityCreationView({
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
  onSaveActivity,
  saving,
}: {
  activityDraft: ActivityDraft
  hasDraft: boolean
  activities: GradingActivity[]
  block: (typeof competencyBlocks)[number]
  editingActivityId: string | null
  onBack: () => void
  onCancelEdit: () => void
  onChangeDraft: (draft: ActivityDraft) => void
  onDeleteActivity: (activityId: string) => void
  onDuplicateActivity: (activity: GradingActivity) => void
  onEditActivity: (activity: GradingActivity) => void
  onSaveActivity: () => void
  saving: boolean
}) {
  const [creationTab, setCreationTab] = useState<'activity' | 'instrument'>('activity')
  const [completionIssues, setCompletionIssues] = useState<ActivityCompletionIssue[]>([])
  const [highlightTarget, setHighlightTarget] = useState<ActivityCompletionTarget | null>(null)

  function handleActivityDraftChange(draft: ActivityDraft) {
    const selectedInstrument = draft.instrumentType && draft.instrumentType !== activityDraft.instrumentType
    onChangeDraft({
      ...draft,
      competencyBlockId: block.id,
      instrumentCompleted: selectedInstrument ? false : draft.instrumentCompleted,
      instrumentFields: selectedInstrument ? {} : draft.instrumentFields,
    })
    if (selectedInstrument) {
      setCreationTab('instrument')
    }
  }

  function showMissingItem(issue: ActivityCompletionIssue) {
    setCreationTab(issue.tab)
    setHighlightTarget(issue.target)
    setCompletionIssues([])
  }

  function handleSaveActivity() {
    const issues = validateActivityCompletion(activityDraft)
    if (issues.length > 0) {
      setCompletionIssues(issues)
      setHighlightTarget(issues[0]?.target ?? null)
      setCreationTab(issues[0]?.tab ?? 'activity')
      return
    }
    setCompletionIssues([])
    setHighlightTarget(null)
    onSaveActivity()
  }

  function continueLater() {
    setCompletionIssues([])
    setHighlightTarget(null)
    onBack()
  }

  function discardIncompleteActivity() {
    setCompletionIssues([])
    setHighlightTarget(null)
    if (editingActivityId) {
      onCancelEdit()
      return
    }
    onChangeDraft({
      ...emptyActivityDraft,
      draftId: activityDraft.draftId,
      competencyBlockId: block.id,
    })
    onBack()
  }

  const progressMeta = buildActivityDraftMeta(activityDraft, block.id)

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

      <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted/35 p-1">
          <button
            type="button"
            className={cn(
              'h-9 rounded-md px-4 text-sm font-bold transition',
              creationTab === 'activity' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
            )}
            onClick={() => setCreationTab('activity')}
          >
            Datos de la actividad
          </button>
          <button
            type="button"
            className={cn(
              'h-9 rounded-md px-4 text-sm font-bold transition',
              creationTab === 'instrument' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
            )}
            onClick={() => setCreationTab('instrument')}
          >
            Instrumento
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {editingActivityId ? <Button variant="outline" onClick={onCancelEdit}>Cancelar edición</Button> : null}
          <Button className="h-9 px-4" onClick={handleSaveActivity} disabled={saving}>
            Guardar actividad
          </Button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_16rem]">
      {creationTab === 'activity' ? (
        <div className="w-full rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="mb-3 border-b border-border pb-3">
            <h3 className="font-black text-foreground">Información de la actividad</h3>
          </div>
            <ActivityManager
              activityDraft={activityDraft}
              activities={activities}
              editingActivityId={editingActivityId}
              onCancelEdit={onCancelEdit}
              onChangeDraft={handleActivityDraftChange}
              onDeleteActivity={onDeleteActivity}
              onDuplicateActivity={onDuplicateActivity}
              onEditActivity={onEditActivity}
              onSaveActivity={onSaveActivity}
              saving={saving}
              highlightTarget={highlightTarget}
              showActions={false}
              showActivityList={false}
              showCompetencySelect={false}
            />
        </div>
      ) : (
        <InstrumentPreview
          key={activityDraft.instrumentType}
          activityName={activityDraft.name}
          completed={activityDraft.instrumentCompleted}
          fields={activityDraft.instrumentFields}
          highlight={highlightTarget === 'instrumentBody' || highlightTarget === 'instrumentType'}
          instrumentType={activityDraft.instrumentType}
          maxScore={Number(activityDraft.maxScore) || 0}
          onCompletedChange={(instrumentCompleted) => handleActivityDraftChange({ ...activityDraft, instrumentCompleted })}
          onFieldsChange={(instrumentFields) => handleActivityDraftChange({ ...activityDraft, instrumentFields })}
        />
      )}
        <ActivityProgressCard meta={progressMeta} onSelectIssue={showMissingItem} />
      </div>
      {completionIssues.length > 0 ? (
        <ActivityCompletionModal
          deleteLabel={editingActivityId ? 'Descartar cambios' : 'Eliminar borrador'}
          issues={completionIssues}
          onClose={() => setCompletionIssues([])}
          onDelete={discardIncompleteActivity}
          onSelectIssue={showMissingItem}
          onSaveDraft={continueLater}
        />
      ) : null}
    </section>
  )
}

function ActivityProgressCard({
  meta,
  onSelectIssue,
}: {
  meta: ActivityDraftMeta
  onSelectIssue: (issue: ActivityCompletionIssue) => void
}) {
  return (
    <aside className="h-fit rounded-lg border border-border bg-card p-4 shadow-sm xl:sticky xl:top-4">
      <div className="flex items-center gap-2">
        <Lightbulb className="size-4 text-primary" />
        <h3 className="font-black text-primary">Tu progreso</h3>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <div className="relative grid size-20 place-items-center rounded-full bg-muted">
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: `conic-gradient(var(--primary) ${meta.completion * 3.6}deg, var(--muted) 0deg)` }}
          />
          <div className="relative grid size-16 place-items-center rounded-full bg-card text-lg font-black text-primary">
            {meta.completion}%
          </div>
        </div>
        <p className="text-sm font-medium text-muted-foreground">Campos completados</p>
      </div>
      <div className="mt-4 border-t border-border pt-4">
        <p className="text-sm font-black text-primary">Faltan por completar</p>
        {meta.pendingIssues.length > 0 ? (
          <div className="mt-2 space-y-2">
            {meta.pendingIssues.map((issue) => (
              <button
                key={issue.target}
                type="button"
                className="block w-full rounded-md px-2 py-1 text-left text-xs text-muted-foreground transition hover:bg-muted hover:text-foreground"
                onClick={() => onSelectIssue(issue)}
              >
                {issue.title}
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-success">Todo listo para guardar.</p>
        )}
      </div>
    </aside>
  )
}

function inferInstrumentCount(fields: Record<string, string>, type: string, field: string, fallback: number) {
  const indexes = Object.keys(fields)
    .filter((key) => key.startsWith(`${type}:${field}:`))
    .map((key) => Number(key.split(':')[2]))
    .filter(Number.isFinite)
  return indexes.length > 0 ? Math.max(...indexes) + 1 : fallback
}

function inferRubricLevels(fields: Record<string, string>, fallback: number) {
  const levels = Object.keys(fields)
    .filter((key) => key.startsWith('rubrica:descriptor:'))
    .map((key) => Number(key.split(':')[3]))
    .filter(Number.isFinite)
  return levels.length > 0 ? Math.max(...levels) : fallback
}

function defaultRubricStructure(maxScore: number) {
  const score = Math.max(1, Math.round(maxScore))
  const preferredCriteria = [4, 5, 3, 6]
  for (const criteria of preferredCriteria) {
    const levels = score / criteria
    if (Number.isInteger(levels) && levels >= 2 && levels <= 6) return { criteria, levels }
  }
  return { criteria: 4, levels: 4 }
}

function distributeScore(maxScore: number, count: number) {
  const safeCount = Math.max(1, count)
  const totalCents = Math.max(0, Math.round(maxScore * 100))
  const base = Math.floor(totalCents / safeCount)
  const remainder = totalCents - base * safeCount
  return Array.from({ length: safeCount }, (_, index) => Number(((base + (index < remainder ? 1 : 0)) / 100).toFixed(2)))
}

function distributeInstrumentField(fields: Record<string, string>, type: string, field: string, count: number, total: number) {
  const next: Record<string, string> = { ...fields, [`${type}:meta:criteriaCount`]: String(count) }
  distributeScore(total, count).forEach((value, index) => { next[instrumentFieldKey(type, field, index)] = String(value) })
  return next
}

function InstrumentPreview({
  activityName,
  completed,
  fields,
  highlight,
  instrumentType,
  maxScore,
  onCompletedChange,
  onFieldsChange,
}: {
  activityName: string
  completed: boolean
  fields: Record<string, string>
  highlight?: boolean
  instrumentType: string
  maxScore: number
  onCompletedChange: (completed: boolean) => void
  onFieldsChange: (fields: Record<string, string>) => void
}) {
  const title = instrumentTitle(instrumentType)
  const rubricDefaults = defaultRubricStructure(maxScore)
  const [rubricCriteria, setRubricCriteria] = useState(() => Number(fields['rubrica:meta:criteriaCount']) || inferInstrumentCount(fields, 'rubrica', 'criterion', rubricDefaults.criteria))
  const [rubricLevels, setRubricLevels] = useState(() => Number(fields['rubrica:meta:levelCount']) || inferRubricLevels(fields, rubricDefaults.levels))
  const [scaleCriteria, setScaleCriteria] = useState(() => Number(fields['escala:meta:criteriaCount']) || inferInstrumentCount(fields, 'escala', 'criterion', 5))
  const [scaleLevels, setScaleLevels] = useState(() => Number(fields['escala:meta:levelCount']) || 4)
  const [checklistCriteria, setChecklistCriteria] = useState(() => Number(fields['lista-cotejo:meta:criteriaCount']) || inferInstrumentCount(fields, 'lista-cotejo', 'criterion', 6))
  const [checklistHasObservations, setChecklistHasObservations] = useState(true)
  const [weightedCriteria, setWeightedCriteria] = useState(() => Number(fields['lista-ponderada:meta:criteriaCount']) || inferInstrumentCount(fields, 'lista-ponderada', 'criterion', 5))
  const [weightedHasPartial, setWeightedHasPartial] = useState(true)
  const [instrumentTextSize, setInstrumentTextSize] = useState<'normal' | 'large' | 'xlarge'>('large')
  const [instrumentBold, setInstrumentBold] = useState(false)
  const [instrumentItalic, setInstrumentItalic] = useState(false)
  const [showInstrumentPreview, setShowInstrumentPreview] = useState(false)
  const isComplete = isInstrumentComplete({
    checklistCriteria,
    fields,
    instrumentType,
    maxScore,
    rubricCriteria,
    rubricLevels,
    scaleCriteria,
    weightedCriteria,
  })

  useEffect(() => {
    if (completed !== isComplete) {
      onCompletedChange(isComplete)
    }
  }, [completed, isComplete, onCompletedChange])

  useEffect(() => {
    if (!instrumentType) return
    const next = { ...fields }
    const titleKey = instrumentFieldKey(instrumentType, 'title')
    if (!next[titleKey]) next[titleKey] = `${instrumentTitle(instrumentType).replace(' de evaluación', '')} para ${activityName.trim() || 'la actividad'}`
    if (instrumentType === 'rubrica') {
      next['rubrica:meta:criteriaCount'] = String(rubricCriteria)
      next['rubrica:meta:levelCount'] = String(rubricLevels)
      for (let index = 0; index < rubricCriteria; index += 1) {
        const pointsKey = instrumentFieldKey('rubrica', 'points', index)
        if (!next[pointsKey]) next[pointsKey] = String(rubricLevels)
      }
      for (let index = 0; index < rubricLevels; index += 1) {
        const score = rubricLevels - index
        const nameKey = instrumentFieldKey('rubrica', 'level-name', score)
        if (!next[nameKey]) next[nameKey] = rubricLevelName(index)
        const levelPointsKey = instrumentFieldKey('rubrica', 'level-points', score)
        if (!next[levelPointsKey]) next[levelPointsKey] = String(score)
      }
    }
    if (instrumentType === 'escala') {
      next['escala:meta:criteriaCount'] = String(scaleCriteria)
      next['escala:meta:levelCount'] = String(scaleLevels)
      distributeScore(maxScore, scaleCriteria).forEach((points, index) => {
        const key = instrumentFieldKey('escala', 'points', index)
        if (!next[key]) next[key] = String(points)
      })
    }
    if (instrumentType === 'lista-cotejo') {
      next['lista-cotejo:meta:criteriaCount'] = String(checklistCriteria)
      distributeScore(maxScore, checklistCriteria).forEach((points, index) => {
        const key = instrumentFieldKey('lista-cotejo', 'points', index)
        if (!next[key]) next[key] = String(points)
      })
    }
    if (instrumentType === 'lista-ponderada') {
      next['lista-ponderada:meta:criteriaCount'] = String(weightedCriteria)
      distributeScore(100, weightedCriteria).forEach((weight, index) => {
        const key = instrumentFieldKey('lista-ponderada', 'weight', index)
        if (!next[key]) next[key] = String(weight)
      })
    }
    if (JSON.stringify(next) !== JSON.stringify(fields)) onFieldsChange(next)
  }, [activityName, checklistCriteria, fields, instrumentType, maxScore, onFieldsChange, rubricCriteria, rubricLevels, scaleCriteria, scaleLevels, weightedCriteria])

  function updateField(key: string, value: string) {
    onFieldsChange({ ...fields, [key]: value })
  }

  return (
    <section className={cn('rounded-lg border border-border bg-card p-4 shadow-sm', highlight ? 'ring-2 ring-red-400 ring-offset-2 ring-offset-background' : '')}>
      <div className="flex flex-col gap-3 border-b border-border pb-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          Instrumento de evaluación
        </p>
          <h3 className="mt-1 text-xl font-black text-primary">{title}</h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <InstrumentFormatControls
            bold={instrumentBold}
            italic={instrumentItalic}
            onBoldChange={setInstrumentBold}
            onItalicChange={setInstrumentItalic}
            onTextSizeChange={setInstrumentTextSize}
            textSize={instrumentTextSize}
          />
          <Badge tone={isComplete ? 'success' : 'muted'}>
            {instrumentType ? (isComplete ? 'Completo' : 'Pendiente') : 'Pendiente'}
          </Badge>
        </div>
      </div>

      {instrumentType ? (
        <label className="mt-3 block space-y-1.5 text-sm font-bold text-foreground">
          Título del instrumento
          <Input
            className="h-10"
            value={fields[instrumentFieldKey(instrumentType, 'title')] ?? ''}
            onChange={(event) => updateField(instrumentFieldKey(instrumentType, 'title'), event.target.value)}
            placeholder={`Ej. ${title} para ${'la actividad'}`}
          />
        </label>
      ) : null}

      <div className={cn('mt-3 max-h-[32rem] overflow-auto pr-1', instrumentTypographyClass(instrumentTextSize, instrumentBold, instrumentItalic))}>
        {instrumentType === 'rubrica' ? (
          <RubricInstrument
            criteriaCount={rubricCriteria}
            fields={fields}
            levelCount={rubricLevels}
            maxScore={maxScore}
            onFieldChange={updateField}
            onCriteriaCountChange={setRubricCriteria}
            onFieldsChange={onFieldsChange}
            onLevelCountChange={setRubricLevels}
          />
        ) : null}
        {instrumentType === 'escala' ? (
          <ScaleInstrument
            criteriaCount={scaleCriteria}
            fields={fields}
            levelCount={scaleLevels}
            maxScore={maxScore}
            onFieldChange={updateField}
            onCriteriaCountChange={(value) => { setScaleCriteria(value); onFieldsChange(distributeInstrumentField(fields, 'escala', 'points', value, maxScore)) }}
            onLevelCountChange={(value) => { setScaleLevels(value); onFieldsChange({ ...fields, 'escala:meta:levelCount': String(value) }) }}
          />
        ) : null}
        {instrumentType === 'lista-cotejo' ? (
          <ChecklistInstrument
            criteriaCount={checklistCriteria}
            fields={fields}
            hasObservations={checklistHasObservations}
            maxScore={maxScore}
            onFieldChange={updateField}
            onCriteriaCountChange={(value) => { setChecklistCriteria(value); onFieldsChange(distributeInstrumentField(fields, 'lista-cotejo', 'points', value, maxScore)) }}
            onHasObservationsChange={setChecklistHasObservations}
          />
        ) : null}
        {instrumentType === 'lista-ponderada' ? (
          <WeightedListInstrument
            criteriaCount={weightedCriteria}
            fields={fields}
            hasPartial={weightedHasPartial}
            maxScore={maxScore}
            onFieldChange={updateField}
            onCriteriaCountChange={(value) => { setWeightedCriteria(value); onFieldsChange(distributeInstrumentField(fields, 'lista-ponderada', 'weight', value, 100)) }}
            onHasPartialChange={setWeightedHasPartial}
          />
        ) : null}
        {!instrumentType ? <EmptyInstrumentState /> : null}
      </div>
      {instrumentType && instrumentType !== 'rubrica' ? <div className="mt-3"><Button type="button" size="sm" variant="outline" onClick={() => setShowInstrumentPreview(true)}><Eye className="size-4" />Vista previa de {instrumentTitle(instrumentType).toLocaleLowerCase()}</Button></div> : null}
      {showInstrumentPreview ? <Modal title={`Vista previa: ${instrumentTitle(instrumentType)}`} onClose={() => setShowInstrumentPreview(false)} className="max-w-[94vw]"><div className="max-h-[78vh] overflow-auto p-5"><ReadOnlyInstrument type={instrumentType} fields={fields} maxScore={maxScore} /></div></Modal> : null}
    </section>
  )
}

function ActivityCompletionModal({
  deleteLabel,
  issues,
  onClose,
  onDelete,
  onSelectIssue,
  onSaveDraft,
}: {
  deleteLabel: string
  issues: ActivityCompletionIssue[]
  onClose: () => void
  onDelete: () => void
  onSelectIssue: (issue: ActivityCompletionIssue) => void
  onSaveDraft: () => void
}) {
  return (
    <Modal
      title="Actividad incompleta"
      onClose={onClose}
      className="max-w-[49rem] rounded-[1.35rem]"
      hideHeader
    >
      <div className="space-y-5 p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-500">
              <AlertCircle className="size-9" />
            </div>
            <div className="pt-2">
              <h3 className="text-xl font-black text-foreground">Actividad incompleta</h3>
              <p className="mt-1 text-sm font-medium text-muted-foreground">Aún hay información pendiente por completar.</p>
              <p className="mt-2 text-sm text-muted-foreground">Revisa los siguientes elementos para poder guardar la actividad.</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" aria-label="Cerrar" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="border-b border-border px-5 py-3">
            <p className="font-black text-foreground">Elementos pendientes ({issues.length})</p>
          </div>
          {issues.map((issue) => (
            <ActivityCompletionIssueButton key={issue.target} issue={issue} onSelectIssue={onSelectIssue} />
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_13rem]">
          <div className="flex items-center gap-4 rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 text-primary">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
              <Lightbulb className="size-6" />
            </div>
            <div>
              <p className="font-black">Puedes guardar esta actividad como borrador</p>
              <p className="mt-1 text-sm text-foreground">Se guardará en la sección "Borradores" y podrás editarla más tarde.</p>
            </div>
          </div>
          <Button variant="destructive" className="h-full min-h-16 justify-center" onClick={onDelete}>
            <Trash2 className="size-5" />
            {deleteLabel}
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button variant="outline" className="h-16 justify-start gap-4 px-5 text-left" onClick={onSaveDraft}>
            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-muted text-primary">
              <ClipboardList className="size-5" />
            </span>
            <span>
              <span className="block font-black">Continuar más tarde</span>
              <span className="block text-xs font-medium text-muted-foreground">Guardar como borrador</span>
            </span>
          </Button>
          <Button className="h-16 justify-center gap-4 px-5" onClick={onClose}>
            <ArrowRight className="size-6" />
            <span>
              <span className="block font-black">Volver a la actividad</span>
              <span className="block text-xs font-medium text-primary-foreground/80">Seguir editando</span>
            </span>
          </Button>
        </div>
      </div>
    </Modal>
  )
}

function ActivityCompletionIssueButton({
  issue,
  onSelectIssue,
}: {
  issue: ActivityCompletionIssue
  onSelectIssue: (issue: ActivityCompletionIssue) => void
}) {
  const visual = completionIssueVisual(issue.target)
  return (
    <button
      type="button"
      className="flex w-full items-center gap-4 border-b border-border px-5 py-4 text-left transition last:border-b-0 hover:bg-muted/35"
      onClick={() => onSelectIssue(issue)}
    >
      <span className={cn('flex size-12 shrink-0 items-center justify-center rounded-xl', visual.iconBox)}>
        {visual.icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-black text-foreground">{issue.title}</span>
        <span className="mt-1 block text-sm text-muted-foreground">{issue.detail}</span>
      </span>
      <span className={cn('ml-3 flex shrink-0 items-center gap-2 text-sm font-black', visual.actionText)}>
        Ir completar
        <ArrowRight className="size-4" />
      </span>
    </button>
  )
}

function completionIssueVisual(target: ActivityCompletionTarget) {
  if (target === 'date') {
    return {
      actionText: 'text-rose-500',
      icon: <CalendarDays className="size-6" />,
      iconBox: 'bg-rose-100 text-rose-500',
    }
  }
  if (target === 'activityType') {
    return {
      actionText: 'text-violet-500',
      icon: <Users className="size-6" />,
      iconBox: 'bg-violet-100 text-violet-500',
    }
  }
  if (target === 'planningMoment') {
    return {
      actionText: 'text-orange-500',
      icon: <BookOpen className="size-6" />,
      iconBox: 'bg-orange-100 text-orange-500',
    }
  }
  if (target === 'description') {
    return {
      actionText: 'text-emerald-600',
      icon: <FileText className="size-6" />,
      iconBox: 'bg-emerald-100 text-emerald-600',
    }
  }
  if (target === 'instrumentType' || target === 'instrumentBody') {
    return {
      actionText: 'text-blue-600',
      icon: <ClipboardList className="size-6" />,
      iconBox: 'bg-blue-100 text-blue-600',
    }
  }
  if (target === 'maxScore') {
    return {
      actionText: 'text-amber-600',
      icon: <Target className="size-6" />,
      iconBox: 'bg-amber-100 text-amber-600',
    }
  }
  return {
    actionText: 'text-primary',
    icon: <FileText className="size-6" />,
    iconBox: 'bg-primary/10 text-primary',
  }
}

function RubricInstrument({
  criteriaCount,
  fields,
  levelCount,
  maxScore,
  onFieldChange,
  onCriteriaCountChange,
  onFieldsChange,
  onLevelCountChange,
}: {
  criteriaCount: number
  fields: Record<string, string>
  levelCount: number
  maxScore: number
  onFieldChange: (key: string, value: string) => void
  onCriteriaCountChange: (value: number) => void
  onFieldsChange: (fields: Record<string, string>) => void
  onLevelCountChange: (value: number) => void
}) {
  const [editingLevels, setEditingLevels] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const levels = Array.from({ length: levelCount }, (_, index) => {
    const score = levelCount - index
    return {
      score,
      name: fields[instrumentFieldKey('rubrica', 'level-name', score)] || rubricLevelName(index),
      points: Number(fields[instrumentFieldKey('rubrica', 'level-points', score)] || score),
    }
  })
  const criterionPoints = Array.from({ length: criteriaCount }, (_, index) => Number(fields[instrumentFieldKey('rubrica', 'points', index)] || 0))
  const total = Number(criterionPoints.reduce((sum, points) => sum + (Number.isFinite(points) ? points : 0), 0).toFixed(2))
  const scoreMatches = Math.abs(total - maxScore) < 0.001

  function resizeCriteria(nextCount: number) {
    const next: Record<string, string> = { ...fields, 'rubrica:meta:criteriaCount': String(nextCount) }
    Array.from({ length: nextCount }, (_, index) => { next[instrumentFieldKey('rubrica', 'points', index)] = String(levelCount) })
    if (nextCount < criteriaCount) {
      Object.keys(next).forEach((key) => {
        const match = key.match(/^rubrica:(criterion|descriptor|points):(\d+)/)
        if (match && Number(match[2]) >= nextCount) delete next[key]
      })
    }
    onFieldsChange(next)
    onCriteriaCountChange(nextCount)
  }

  function removeCriterion(indexToRemove: number) {
    if (criteriaCount <= 1) return
    const nextCount = criteriaCount - 1
    const next = { ...fields }
    for (let index = indexToRemove; index < nextCount; index += 1) {
      next[instrumentFieldKey('rubrica', 'criterion', index)] = next[instrumentFieldKey('rubrica', 'criterion', index + 1)] || ''
      for (let score = 1; score <= levelCount; score += 1) {
        next[instrumentFieldKey('rubrica', 'descriptor', index, score)] = next[instrumentFieldKey('rubrica', 'descriptor', index + 1, score)] || ''
      }
    }
    Object.keys(next).forEach((key) => {
      const match = key.match(/^rubrica:(criterion|descriptor|points):(\d+)/)
      if (match && Number(match[2]) >= nextCount) delete next[key]
    })
    Array.from({ length: nextCount }, (_, index) => { next[instrumentFieldKey('rubrica', 'points', index)] = String(levelCount) })
    next['rubrica:meta:criteriaCount'] = String(nextCount)
    onFieldsChange(next)
    onCriteriaCountChange(nextCount)
  }

  function removeLevel(scoreToRemove: number) {
    if (levelCount <= 2) return
    const remaining = levels.filter((level) => level.score !== scoreToRemove)
    const nextCount = levelCount - 1
    const next: Record<string, string> = { ...fields, 'rubrica:meta:levelCount': String(nextCount) }
    Object.keys(next).forEach((key) => {
      if (/^rubrica:level-(?:name|points):\d+$/.test(key) || /^rubrica:descriptor:\d+:\d+$/.test(key)) delete next[key]
    })
    remaining.forEach((level, index) => {
      const newScore = nextCount - index
      next[instrumentFieldKey('rubrica', 'level-name', newScore)] = level.name
      next[instrumentFieldKey('rubrica', 'level-points', newScore)] = String(level.points)
      for (let criterionIndex = 0; criterionIndex < criteriaCount; criterionIndex += 1) {
        next[instrumentFieldKey('rubrica', 'descriptor', criterionIndex, newScore)] = fields[instrumentFieldKey('rubrica', 'descriptor', criterionIndex, level.score)] || ''
      }
    })
    Array.from({ length: criteriaCount }, (_, index) => { next[instrumentFieldKey('rubrica', 'points', index)] = String(nextCount) })
    onFieldsChange(next)
    onLevelCountChange(nextCount)
  }

  function addLevel() {
    if (levelCount >= 6) return
    const nextCount = levelCount + 1
    const next: Record<string, string> = { ...fields, 'rubrica:meta:levelCount': String(nextCount) }
    Object.keys(next).forEach((key) => {
      if (/^rubrica:level-(?:name|points):\d+$/.test(key) || /^rubrica:descriptor:\d+:\d+$/.test(key)) delete next[key]
    })
    levels.forEach((level, index) => {
      const newScore = nextCount - index
      next[instrumentFieldKey('rubrica', 'level-name', newScore)] = level.name
      next[instrumentFieldKey('rubrica', 'level-points', newScore)] = String(level.points)
      for (let criterionIndex = 0; criterionIndex < criteriaCount; criterionIndex += 1) {
        next[instrumentFieldKey('rubrica', 'descriptor', criterionIndex, newScore)] = fields[instrumentFieldKey('rubrica', 'descriptor', criterionIndex, level.score)] || ''
      }
    })
    next[instrumentFieldKey('rubrica', 'level-name', 1)] = rubricLevelName(nextCount - 1)
    next[instrumentFieldKey('rubrica', 'level-points', 1)] = '1'
    Array.from({ length: criteriaCount }, (_, index) => { next[instrumentFieldKey('rubrica', 'points', index)] = String(nextCount) })
    onFieldsChange(next)
    onLevelCountChange(nextCount)
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-violet-100 bg-violet-50/40 p-3">
        <div className="grid gap-3 sm:grid-cols-3">
          <div><p className="text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">Puntuación máxima</p><p className="mt-1 text-lg font-black text-primary">{maxScore} <span className="text-xs text-muted-foreground">pts</span></p></div>
          <div><p className="text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">Niveles de desempeño</p><p className="mt-1 text-lg font-black text-primary">{levelCount} niveles</p></div>
          <div><p className="text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">Escala de valoración</p><p className="mt-1 text-sm font-black text-primary">Descriptiva</p></div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-black text-primary">Criterios y niveles de desempeño</p>
          <p className="text-xs text-muted-foreground">Los puntajes por criterio siempre deben sumar {maxScore} puntos.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" variant="outline" onClick={() => resizeCriteria(Math.min(12, criteriaCount + 1))} disabled={criteriaCount >= 12}><Plus className="size-4" />Agregar criterio</Button>
          <Button type="button" size="sm" variant="outline" onClick={() => setEditingLevels(true)}><Pencil className="size-4" />Editar niveles</Button>
        </div>
      </div>

      {editingLevels ? <Modal title="Editar niveles de desempeño" onClose={() => setEditingLevels(false)} className="max-w-2xl"><div className="space-y-3 p-5"><div className="flex items-center justify-between gap-3 rounded-lg bg-violet-50 px-3 py-2"><p className="text-sm text-violet-800">Organiza entre 2 y 6 niveles. También puedes eliminarlos directamente desde la tabla.</p><Button type="button" size="sm" variant="outline" disabled={levelCount >= 6} onClick={addLevel}><Plus className="size-4" />Agregar nivel</Button></div><div className="space-y-2">{levels.map((level, index) => <div key={level.score} className="grid grid-cols-[2rem_minmax(0,1fr)_5rem_2rem] items-end gap-2 rounded-lg border border-border bg-card p-2"><span className="mb-2 grid size-7 place-items-center rounded-md bg-violet-50 text-xs font-black text-violet-700">{index + 1}</span><label className="text-xs font-bold text-muted-foreground">Nombre<Input className="mt-1 h-9" value={fields[instrumentFieldKey('rubrica', 'level-name', level.score)] ?? level.name} onChange={(event) => onFieldChange(instrumentFieldKey('rubrica', 'level-name', level.score), event.target.value)} /></label><label className="text-xs font-bold text-muted-foreground">Valor<Input className="mt-1 h-9" type="number" min={0} step="0.25" value={fields[instrumentFieldKey('rubrica', 'level-points', level.score)] ?? String(level.points)} onChange={(event) => onFieldChange(instrumentFieldKey('rubrica', 'level-points', level.score), event.target.value)} /></label><button type="button" aria-label={`Eliminar nivel ${level.name}`} title={levelCount <= 2 ? 'Debe haber al menos 2 niveles' : 'Eliminar nivel'} disabled={levelCount <= 2} className="mb-0.5 grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-red-50 hover:text-destructive disabled:opacity-30" onClick={() => removeLevel(level.score)}><Trash2 className="size-4" /></button></div>)}</div><div className="flex justify-end"><Button type="button" onClick={() => setEditingLevels(false)}>Listo</Button></div></div></Modal> : null}

      <InstrumentTable>
        <thead className="bg-sky-50 text-[10px] font-bold uppercase text-slate-700">
          <tr>
            <th className="w-[24%] border border-border px-2 py-2">Criterios de evaluación</th>
            {levels.map((level) => <th key={level.score} className="group relative border border-border px-2 py-2 text-center"><span className="block pr-4 text-primary">{level.name}</span><span className="mt-0.5 block pr-4 normal-case text-muted-foreground">{level.points} pts</span><button type="button" aria-label={`Eliminar nivel ${level.name}`} title={levelCount <= 2 ? 'Debe haber al menos 2 niveles' : 'Eliminar nivel'} disabled={levelCount <= 2} className="absolute right-1 top-1 grid size-5 place-items-center rounded text-slate-400 opacity-70 transition hover:bg-red-50 hover:text-destructive group-hover:opacity-100 disabled:hidden" onClick={() => removeLevel(level.score)}><X className="size-3" /></button></th>)}
            <th className="w-24 border border-border px-2 py-2 text-center">Puntaje por criterio</th>
            <th className="w-10 border border-border" />
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: criteriaCount }, (_, index) => (
            <tr key={index}>
              <td className="border border-border p-1.5"><InstrumentTextarea placeholder={`${index + 1}. Criterio de evaluación`} value={fields[instrumentFieldKey('rubrica', 'criterion', index)] ?? ''} onChange={(value) => onFieldChange(instrumentFieldKey('rubrica', 'criterion', index), value)} /></td>
              {levels.map((level) => <td key={level.score} className="border border-border p-1.5"><InstrumentTextarea value={fields[instrumentFieldKey('rubrica', 'descriptor', index, level.score)] ?? ''} onChange={(value) => onFieldChange(instrumentFieldKey('rubrica', 'descriptor', index, level.score), value)} /></td>)}
              <td className="border border-border p-1.5"><InstrumentInput value={fields[instrumentFieldKey('rubrica', 'points', index)] ?? ''} onChange={(value) => onFieldChange(instrumentFieldKey('rubrica', 'points', index), value)} placeholder="0" /></td>
              <td className="border border-border text-center"><button type="button" aria-label={`Eliminar criterio ${index + 1}`} title="Eliminar criterio" className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-red-50 hover:text-destructive disabled:opacity-30" disabled={criteriaCount <= 1} onClick={() => removeCriterion(index)}><X className="size-4" /></button></td>
            </tr>
          ))}
        </tbody>
      </InstrumentTable>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button type="button" size="sm" variant="outline" onClick={() => setShowPreview(true)}><Eye className="size-4" />Vista previa de la rúbrica</Button>
        <div className="text-right"><p className={cn('text-sm font-black', scoreMatches ? 'text-emerald-600' : 'text-destructive')}>Puntuación máxima total: {total} / {maxScore} pts</p>{!scoreMatches ? <p className="mt-1 text-xs text-destructive">Ajusta los puntajes por criterio hasta completar exactamente {maxScore} puntos.</p> : null}</div>
      </div>

      {showPreview ? <Modal title="Vista previa de la rúbrica" onClose={() => setShowPreview(false)} className="max-w-[94vw]"><div className="max-h-[78vh] overflow-auto p-5"><ReadOnlyInstrument type="rubrica" fields={fields} maxScore={maxScore} /></div></Modal> : null}
    </div>
  )
}
function ScaleInstrument({
  criteriaCount,
  fields,
  levelCount,
  maxScore,
  onFieldChange,
  onCriteriaCountChange,
  onLevelCountChange,
}: {
  criteriaCount: number
  fields: Record<string, string>
  levelCount: number
  maxScore: number
  onFieldChange: (key: string, value: string) => void
  onCriteriaCountChange: (value: number) => void
  onLevelCountChange: (value: number) => void
}) {
  const levels = Array.from({ length: levelCount }, (_, index) => levelCount - index)
  const total = Number(Array.from({ length: criteriaCount }, (_, index) => Number(fields[instrumentFieldKey('escala', 'points', index)] || 0)).reduce((sum, value) => sum + value, 0).toFixed(2))

  return (
    <div className="space-y-3">
      <InstrumentControls>
        <StepperControl label="Indicadores" value={criteriaCount} min={1} max={12} onChange={onCriteriaCountChange} />
        <StepperControl label="Niveles" value={levelCount} min={2} max={6} onChange={onLevelCountChange} />
      </InstrumentControls>
      <InstrumentTable>
        <thead className="bg-sky-50 text-[10px] font-bold uppercase text-slate-700">
          <tr>
            <th className="w-[34%] border border-border px-2 py-2">Criterios</th>
            {levels.map((level) => (
              <th key={level} className="border border-border px-2 py-2">{level}</th>
            ))}
            <th className="w-20 border border-border px-2 py-2">Puntaje</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: criteriaCount }, (_, index) => ({ criterion: `Criterio ${index + 1}`, index })).map(({ criterion, index }) => (
            <tr key={criterion}>
              <td className="border border-border p-1.5">
                <InstrumentTextarea
                  placeholder={criterion}
                  value={fields[instrumentFieldKey('escala', 'criterion', index)] ?? ''}
                  onChange={(value) => onFieldChange(instrumentFieldKey('escala', 'criterion', index), value)}
                />
              </td>
              {levels.map((value) => (
                <td key={value} className="border border-border text-center"><InstrumentCheckPlaceholder /></td>
              ))}
              <td className="border border-border p-1.5"><InstrumentInput value={fields[instrumentFieldKey('escala', 'points', index)] ?? ''} onChange={(value) => onFieldChange(instrumentFieldKey('escala', 'points', index), value)} placeholder="0" /></td>
            </tr>
          ))}
          <tr className="bg-sky-50 font-bold"><td className="border border-border px-2 py-2" colSpan={levelCount + 1}>Puntuación máxima total</td><td className={cn('border border-border px-2 py-2 text-center', Math.abs(total - maxScore) < 0.001 ? 'text-emerald-600' : 'text-destructive')}>{total} / {maxScore} pts</td></tr>
        </tbody>
      </InstrumentTable>
    </div>
  )
}

function ChecklistInstrument({
  criteriaCount,
  fields,
  hasObservations,
  maxScore,
  onFieldChange,
  onCriteriaCountChange,
  onHasObservationsChange,
}: {
  criteriaCount: number
  fields: Record<string, string>
  hasObservations: boolean
  maxScore: number
  onFieldChange: (key: string, value: string) => void
  onCriteriaCountChange: (value: number) => void
  onHasObservationsChange: (value: boolean) => void
}) {
  const total = Number(Array.from({ length: criteriaCount }, (_, index) => Number(fields[instrumentFieldKey('lista-cotejo', 'points', index)] || 0)).reduce((sum, value) => sum + value, 0).toFixed(2))
  return (
    <div className="space-y-3">
      <InstrumentControls>
        <StepperControl label="Indicadores" value={criteriaCount} min={1} max={20} onChange={onCriteriaCountChange} />
        <ToggleControl label="Observaciones" checked={hasObservations} onChange={onHasObservationsChange} />
      </InstrumentControls>
      <InstrumentTable>
        <thead className="bg-sky-50 text-[10px] font-bold uppercase text-slate-700">
          <tr>
            <th className="w-[48%] border border-border px-2 py-2">Criterios</th>
            <th className="border border-border px-2 py-2">Sí</th>
            <th className="border border-border px-2 py-2">No</th>
            <th className="w-20 border border-border px-2 py-2">Valor</th>
            {hasObservations ? <th className="w-[30%] border border-border px-2 py-2">Observaciones</th> : null}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: criteriaCount }, (_, index) => (
            <tr key={index}>
              <td className="border border-border p-1.5">
                <InstrumentTextarea
                  placeholder={`${index + 1}. Criterio`}
                  value={fields[instrumentFieldKey('lista-cotejo', 'criterion', index)] ?? ''}
                  onChange={(value) => onFieldChange(instrumentFieldKey('lista-cotejo', 'criterion', index), value)}
                />
              </td>
              <td className="border border-border text-center"><InstrumentCheckPlaceholder /></td>
              <td className="border border-border text-center"><InstrumentCheckPlaceholder /></td>
              <td className="border border-border p-1.5"><InstrumentInput value={fields[instrumentFieldKey('lista-cotejo', 'points', index)] ?? ''} onChange={(value) => onFieldChange(instrumentFieldKey('lista-cotejo', 'points', index), value)} placeholder="0" /></td>
              {hasObservations ? <td className="border border-border p-1.5"><InstrumentTextarea /></td> : null}
            </tr>
          ))}
          <tr className="bg-sky-50 font-bold"><td className="border border-border px-2 py-2" colSpan={3}>Puntuación máxima total</td><td className={cn('border border-border px-2 py-2 text-center', Math.abs(total - maxScore) < 0.001 ? 'text-emerald-600' : 'text-destructive')}>{total} / {maxScore} pts</td>{hasObservations ? <td className="border border-border" /> : null}</tr>
        </tbody>
      </InstrumentTable>
    </div>
  )
}

function WeightedListInstrument({
  criteriaCount,
  fields,
  hasPartial,
  maxScore,
  onFieldChange,
  onCriteriaCountChange,
  onHasPartialChange,
}: {
  criteriaCount: number
  fields: Record<string, string>
  hasPartial: boolean
  maxScore: number
  onFieldChange: (key: string, value: string) => void
  onCriteriaCountChange: (value: number) => void
  onHasPartialChange: (value: boolean) => void
}) {
  const totalWeight = Number(Array.from({ length: criteriaCount }, (_, index) => Number(fields[instrumentFieldKey('lista-ponderada', 'weight', index)] || 0)).reduce((sum, value) => sum + value, 0).toFixed(2))
  return (
    <div className="space-y-3">
      <InstrumentControls>
        <StepperControl label="Criterios" value={criteriaCount} min={1} max={12} onChange={onCriteriaCountChange} />
        <ToggleControl label="Cumplimiento parcial" checked={hasPartial} onChange={onHasPartialChange} />
      </InstrumentControls>
      <InstrumentTable>
        <thead className="bg-sky-50 text-[10px] font-bold uppercase text-slate-700">
          <tr>
            <th className="w-[18%] border border-border px-2 py-2">Criterios</th>
            <th className="w-[28%] border border-border px-2 py-2">Indicadores</th>
            <th className="border border-border px-2 py-2">Pond.</th>
            <th className="border border-border px-2 py-2">Sí</th>
            {hasPartial ? <th className="border border-border px-2 py-2">Parcial</th> : null}
            <th className="border border-border px-2 py-2">No</th>
            <th className="border border-border px-2 py-2">Puntaje</th>
            <th className="w-[20%] border border-border px-2 py-2">Obs.</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: criteriaCount }, (_, index) => (
            <tr key={index}>
              <td className="border border-border p-1.5">
                <InstrumentTextarea
                  placeholder={`Criterio ${index + 1}`}
                  value={fields[instrumentFieldKey('lista-ponderada', 'criterion', index)] ?? ''}
                  onChange={(value) => onFieldChange(instrumentFieldKey('lista-ponderada', 'criterion', index), value)}
                />
              </td>
              <td className="border border-border p-1.5">
                <InstrumentTextarea
                  value={fields[instrumentFieldKey('lista-ponderada', 'indicator', index)] ?? ''}
                  onChange={(value) => onFieldChange(instrumentFieldKey('lista-ponderada', 'indicator', index), value)}
                />
              </td>
              <td className="border border-border p-1.5">
                <InstrumentInput
                  placeholder="%"
                  value={fields[instrumentFieldKey('lista-ponderada', 'weight', index)] ?? ''}
                  onChange={(value) => onFieldChange(instrumentFieldKey('lista-ponderada', 'weight', index), value)}
                />
              </td>
              {['si', ...(hasPartial ? ['parcial'] : []), 'no'].map((value) => (
                <td key={value} className="border border-border text-center"><InstrumentCheckPlaceholder /></td>
              ))}
              <td className="border border-border p-1.5 text-center font-bold text-primary">Hasta {Number(((Number(fields[instrumentFieldKey('lista-ponderada', 'weight', index)] || 0) / 100) * maxScore).toFixed(2))} pts</td>
              <td className="border border-border p-1.5"><InstrumentTextarea /></td>
            </tr>
          ))}
          <tr className="bg-sky-50 font-bold">
            <td className="border border-border px-2 py-2" colSpan={2}>Total</td>
            <td className={cn('border border-border px-2 py-2 text-center', Math.abs(totalWeight - 100) < 0.001 ? 'text-emerald-600' : 'text-destructive')}>{totalWeight}%</td>
            <td className="border border-border" colSpan={hasPartial ? 3 : 2} />
            <td className="border border-border px-2 py-2 text-center text-primary">{maxScore} pts</td>
            <td className="border border-border" />
          </tr>
        </tbody>
      </InstrumentTable>
    </div>
  )
}

function EmptyInstrumentState() {
  return (
    <div className="grid min-h-72 place-items-center rounded-lg border border-dashed border-border p-6 text-center">
      <p className="max-w-sm text-sm leading-6 text-muted-foreground">
        Selecciona un instrumento para generar aquí una plantilla vacía editable.
      </p>
    </div>
  )
}

function InstrumentControls({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/20 p-2">
      {children}
    </div>
  )
}

function InstrumentFormatControls({
  bold,
  italic,
  onBoldChange,
  onItalicChange,
  onTextSizeChange,
  textSize,
}: {
  bold: boolean
  italic: boolean
  onBoldChange: (value: boolean) => void
  onItalicChange: (value: boolean) => void
  onTextSizeChange: (value: 'normal' | 'large' | 'xlarge') => void
  textSize: 'normal' | 'large' | 'xlarge'
}) {
  const textSizes: Array<{ label: string; value: 'normal' | 'large' | 'xlarge' }> = [
    { label: 'A-', value: 'normal' },
    { label: 'A', value: 'large' },
    { label: 'A+', value: 'xlarge' },
  ]

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
      {textSizes.map((item) => (
        <button
          key={item.value}
          type="button"
          className={cn(
            'h-7 rounded-md px-2 text-xs font-black transition hover:bg-primary/10',
            textSize === item.value ? 'bg-primary text-primary-foreground' : 'text-primary',
          )}
          onClick={() => onTextSizeChange(item.value)}
          aria-label={`Tamaño de texto ${item.label}`}
        >
          {item.label}
        </button>
      ))}
      <span className="mx-1 h-5 w-px bg-border" />
      <button
        type="button"
        className={cn('h-7 rounded-md px-2 text-xs font-black transition hover:bg-primary/10', bold ? 'bg-primary text-primary-foreground' : 'text-primary')}
        onClick={() => onBoldChange(!bold)}
        aria-label="Alternar negrita"
      >
        B
      </button>
      <button
        type="button"
        className={cn('h-7 rounded-md px-2 text-xs font-black italic transition hover:bg-primary/10', italic ? 'bg-primary text-primary-foreground' : 'text-primary')}
        onClick={() => onItalicChange(!italic)}
        aria-label="Alternar cursiva"
      >
        I
      </button>
    </div>
  )
}

function StepperControl({
  label,
  max,
  min,
  onChange,
  value,
}: {
  label: string
  max: number
  min: number
  onChange: (value: number) => void
  value: number
}) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-card px-2 py-1">
      <span className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">{label}</span>
      <button
        type="button"
        className="grid size-7 place-items-center rounded-md text-lg font-bold text-primary hover:bg-primary/10 disabled:text-muted-foreground"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label={`Reducir ${label}`}
      >
        -
      </button>
      <span className="w-6 text-center text-sm font-black text-foreground">{value}</span>
      <button
        type="button"
        className="grid size-7 place-items-center rounded-md text-lg font-bold text-primary hover:bg-primary/10 disabled:text-muted-foreground"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        aria-label={`Aumentar ${label}`}
      >
        +
      </button>
    </div>
  )
}

function ToggleControl({
  checked,
  label,
  onChange,
}: {
  checked: boolean
  label: string
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
      <input
        className="size-4 accent-primary"
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      {label}
    </label>
  )
}

function InstrumentCheckPlaceholder() {
  return (
    <span
      aria-hidden="true"
      className="mx-auto block size-4 rounded border border-muted-foreground/70 bg-card"
    />
  )
}

function InstrumentTable({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-auto rounded-lg border border-border">
      <table className="min-w-[42rem] w-full border-collapse text-left text-xs">
        {children}
      </table>
    </div>
  )
}

function InstrumentInput({
  onChange,
  placeholder = '',
  value,
}: {
  onChange?: (value: string) => void
  placeholder?: string
  value?: string
}) {
  return (
    <input
      className="h-8 w-full rounded-md border border-input bg-card px-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      placeholder={placeholder}
    />
  )
}

function InstrumentTextarea({
  className = '',
  onChange,
  placeholder = '',
  value,
}: {
  className?: string
  onChange?: (value: string) => void
  placeholder?: string
  value?: string
}) {
  return (
    <textarea
      className={cn('h-14 w-full resize-none rounded-md border border-input bg-card px-2 py-1.5 text-xs leading-5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20', className)}
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      placeholder={placeholder}
    />
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
      title="Configurar calculo del bloque"
      description="Ajusta como se obtiene la calificacion de este bloque de competencias."
      onClose={onClose}
      className="max-w-5xl rounded-xl"
    >
      <div className="grid gap-6 p-6 xl:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="grid content-start gap-4 md:grid-cols-2">
          <label className="space-y-1.5 text-sm font-bold text-foreground">
            Total esperado por bloque
            <Input type="number" value={config.expectedBlockTotal} onChange={(event) => onChange({ ...config, expectedBlockTotal: Number(event.target.value) || 100 })} />
          </label>
          <label className="space-y-1.5 text-sm font-bold text-foreground">
            Nota minima de aprobacion
            <Input type="number" value={config.passingScore} onChange={(event) => onChange({ ...config, passingScore: Number(event.target.value) || 0 })} />
          </label>
          <label className="space-y-1.5 text-sm font-bold text-foreground">
            Metodo del bloque
            <Select value={config.blockMethod} onChange={(event) => onChange({ ...config, blockMethod: event.target.value as GradeCalculationConfig['blockMethod'] })}>
              <option value="sum">Suma de actividades</option>
              <option value="average">Promedio de actividades</option>
              <option value="weighted">Porcentaje ponderado</option>
            </Select>
          </label>
          <label className="space-y-1.5 text-sm font-bold text-foreground">
            Redondeo de la nota del bloque
            <Select value={config.finalRounding} onChange={(event) => onChange({ ...config, finalRounding: event.target.value as GradeCalculationConfig['finalRounding'] })}>
              <option value="standard">Redondeo estandar</option>
              <option value="floor">Redondear hacia abajo</option>
              <option value="ceil">Redondear hacia arriba</option>
              <option value="decimals">Mantener decimales</option>
            </Select>
          </label>
          <label className="space-y-1.5 text-sm font-bold text-foreground">
            Decimales en nota del bloque
            <Select value={String(config.pcDecimals)} onChange={(event) => onChange({ ...config, pcDecimals: Number(event.target.value) })}>
              <option value="0">Sin decimales</option>
              <option value="1">1 decimal</option>
              <option value="2">2 decimales</option>
              <option value="3">3 decimales</option>
              <option value="4">4 decimales</option>
            </Select>
          </label>
        </div>

        <aside className="flex flex-col justify-between gap-5">
          <div className="rounded-xl bg-emerald-50 p-5 text-emerald-950">
            <p className="text-sm font-black text-emerald-800">Reglas actuales</p>
            <ul className="mt-4 space-y-4 text-sm font-bold leading-6">
              <RuleItem>El bloque se calcula sobre {config.expectedBlockTotal} puntos.</RuleItem>
              <RuleItem>La nota minima para aprobar es {config.passingScore}.</RuleItem>
              <RuleItem>La calificacion se obtiene segun el metodo seleccionado.</RuleItem>
              <RuleItem>El resultado se redondea segun la regla elegida.</RuleItem>
            </ul>
          </div>
          <Button className="ml-auto h-11 bg-emerald-700 px-6 hover:bg-emerald-800" onClick={onClose}>
            Guardar configuracion
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

const commonActivityResources = [
  'Computadora', 'Proyector', 'Pantalla o televisión', 'Internet', 'Presentación PowerPoint', 'Pizarra',
  'Marcadores', 'Hojas en blanco', 'Cuaderno', 'Libro de texto', 'Lápices', 'Bolígrafo',
  'Cartulina', 'Material impreso', 'Regla', 'Plataforma educativa',
]

const resourceBankCategories = [
  { id: 'technology', label: 'Tecnología y audiovisuales', resources: ['Tableta', 'Dispositivo móvil', 'Pantalla interactiva', 'Cámara', 'Webcam', 'Trípode', 'Micrófono', 'Altavoces', 'Audífonos', 'Impresora', 'Escáner', 'Memoria USB', 'Cable HDMI', 'Grabadora de audio', 'Video', 'Podcast', 'Simulador virtual', 'Software educativo'] },
  { id: 'math', label: 'Matemáticas y geometría', resources: ['Calculadora', 'Compás', 'Transportador', 'Escuadra', 'Cartabón', 'Figuras geométricas', 'Cuerpos geométricos', 'Ábaco', 'Bloques base diez', 'Regletas de Cuisenaire', 'Geoplano', 'Tangram', 'Dados', 'Balanza matemática', 'Cinta métrica', 'Fracciones circulares', 'Plano cartesiano', 'Fichas de conteo', 'Dominó matemático', 'Papel cuadriculado'] },
  { id: 'science', label: 'Ciencias y laboratorio', resources: ['Probeta', 'Vaso de precipitados', 'Tubos de ensayo', 'Gradilla', 'Matraz Erlenmeyer', 'Pipeta', 'Gotero', 'Embudo', 'Placa Petri', 'Microscopio', 'Portaobjetos', 'Cubreobjetos', 'Lupa', 'Termómetro', 'Balanza de laboratorio', 'Cronómetro', 'Mechero', 'Pinzas', 'Espátula', 'Mortero', 'Reactivos', 'Guantes de laboratorio', 'Gafas de seguridad', 'Bata de laboratorio', 'Modelo anatómico', 'Kit de circuitos eléctricos', 'Imanes', 'Brújula', 'Sensor de pH', 'Papel indicador'] },
  { id: 'language', label: 'Lengua y comunicación', resources: ['Diccionario', 'Cuentos', 'Novelas', 'Poemario', 'Tarjetas de vocabulario', 'Fichas de lectura', 'Periódico', 'Revistas', 'Imágenes secuenciales', 'Letras móviles', 'Audiolibro', 'Guion teatral', 'Títeres', 'Láminas ilustradas', 'Organizador gráfico', 'Tarjetas de comprensión'] },
  { id: 'social', label: 'Ciencias sociales y humanidades', resources: ['Mapamundi', 'Globo terráqueo', 'Mapa político', 'Mapa físico', 'Atlas', 'Línea del tiempo', 'Documentos históricos', 'Fotografías históricas', 'Biografías', 'Brújula', 'Maqueta geográfica', 'Banderas', 'Infografías', 'Fichas culturales', 'Mapa conceptual', 'Fuentes primarias'] },
  { id: 'arts', label: 'Artes y manualidades', resources: ['Pintura acrílica', 'Acuarelas', 'Témperas', 'Pinceles', 'Lápices de colores', 'Crayones', 'Lienzo', 'Papel de construcción', 'Arcilla', 'Plastilina', 'Tijeras', 'Pegamento', 'Plantillas', 'Caballete', 'Paleta de pintura', 'Materiales reciclados', 'Papel crepé', 'Foami', 'Cinta adhesiva', 'Hilo y lana'] },
  { id: 'music', label: 'Música y expresión escénica', resources: ['Flauta', 'Guitarra', 'Teclado musical', 'Tambor', 'Maracas', 'Pandereta', 'Xilófono', 'Güira', 'Metrónomo', 'Partituras', 'Atril', 'Pistas musicales', 'Vestuario', 'Máscaras', 'Utilería', 'Luces escénicas', 'Instrumentos de percusión', 'Cancionero'] },
  { id: 'physical', label: 'Educación física y recreación', resources: ['Balón de fútbol', 'Balón de baloncesto', 'Balón de voleibol', 'Pelotas pequeñas', 'Conos', 'Aros', 'Cuerdas para saltar', 'Cronómetro deportivo', 'Silbato', 'Colchonetas', 'Red deportiva', 'Portería', 'Raquetas', 'Bates', 'Testigos de relevo', 'Petos deportivos', 'Obstáculos', 'Escalera de agilidad', 'Bandas elásticas', 'Paracaídas recreativo', 'Discos voladores', 'Sacos para carrera'] },
  { id: 'early', label: 'Inicial y manipulativos', resources: ['Bloques de construcción', 'Rompecabezas', 'Encajables', 'Números móviles', 'Formas clasificables', 'Cuentas para ensartar', 'Pinzas de motricidad', 'Tableros didácticos', 'Juego de memoria', 'Tarjetas sensoriales', 'Cubos apilables', 'Clasificadores de colores', 'Animales de juguete', 'Reloj didáctico', 'Letras magnéticas', 'Caja de arena'] },
  { id: 'inclusion', label: 'Inclusión y apoyo sensorial', resources: ['Pictogramas', 'Tarjetas de comunicación', 'Temporizador visual', 'Audífonos reductores de ruido', 'Objetos antiestrés', 'Cojín sensorial', 'Panel de texturas', 'Tablero de rutinas', 'Letras de alto contraste', 'Lupa de lectura', 'Material táctil', 'Teclado adaptado', 'Agarre para lápiz', 'Mesa de luz', 'Pelota sensorial', 'Comunicador alternativo'] },
] as const

const allCatalogResources = [...new Set([...commonActivityResources, ...resourceBankCategories.flatMap((category) => category.resources)])]

function ResourcePicker({ resources, onChange }: { resources: string[]; onChange: (resources: string[]) => void }) {
  const [customResource, setCustomResource] = useState('')
  const [customResources, setCustomResources] = useState<string[]>([])
  const [recentResources, setRecentResources] = useState<string[]>([])
  const [resourceQuery, setResourceQuery] = useState('')
  const [showOptions, setShowOptions] = useState(false)
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [showBank, setShowBank] = useState(false)
  const [showMyResources, setShowMyResources] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const normalizedQuery = resourceQuery.trim().toLocaleLowerCase()
  const filteredResources = [...new Set([...allCatalogResources, ...customResources])].filter((resource) => resource.toLocaleLowerCase().includes(normalizedQuery))

  useEffect(() => {
    try {
      const storedCustom = JSON.parse(window.localStorage.getItem('grading-custom-resources') || '[]')
      const storedRecent = JSON.parse(window.localStorage.getItem('grading-recent-resources') || '[]')
      setCustomResources(Array.isArray(storedCustom) ? storedCustom.filter((item): item is string => typeof item === 'string') : [])
      setRecentResources(Array.isArray(storedRecent) ? storedRecent.filter((item): item is string => typeof item === 'string').slice(0, 8) : [])
    } catch {
      setCustomResources([])
      setRecentResources([])
    }
  }, [])

  function rememberResource(resource: string) {
    const next = [resource, ...recentResources.filter((item) => item !== resource)].slice(0, 8)
    setRecentResources(next)
    try { window.localStorage.setItem('grading-recent-resources', JSON.stringify(next)) } catch { /* Optional preference. */ }
  }

  function toggleResource(resource: string) {
    if (resources.includes(resource)) {
      onChange(resources.filter((item) => item !== resource))
      return
    }
    onChange([...resources, resource])
    rememberResource(resource)
  }

  function addCustomResource() {
    const value = customResource.trim()
    if (!value) return
    const existing = [...allCatalogResources, ...customResources].find((item) => item.toLocaleLowerCase() === value.toLocaleLowerCase())
    const resource = existing ?? value
    if (!existing) {
      const nextCustom = [resource, ...customResources]
      setCustomResources(nextCustom)
      try { window.localStorage.setItem('grading-custom-resources', JSON.stringify(nextCustom)) } catch { /* Optional preference. */ }
    }
    if (!resources.some((item) => item.toLocaleLowerCase() === resource.toLocaleLowerCase())) onChange([...resources, resource])
    rememberResource(resource)
    setCustomResource('')
    setShowCustomInput(false)
  }

  function resourceButton(resource: string) {
    return (
      <button key={resource} type="button" className={cn('inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-bold transition', resources.includes(resource) ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-border bg-card text-muted-foreground hover:border-primary hover:text-primary')} onClick={() => toggleResource(resource)}>
        {resourceIcon(resource)}{resource}{resources.includes(resource) ? <CheckCircle2 className="size-3.5" /> : null}
      </button>
    )
  }

  return (
    <div className="space-y-2.5">
      <p className="text-xs text-blue-600/75">Selecciona los recursos que utilizarás en esta actividad.</p>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="h-11 pl-10 pr-10"
          value={resourceQuery}
          onFocus={() => setShowOptions(true)}
          onClick={() => setShowOptions(true)}
          onChange={(event) => { setResourceQuery(event.target.value); setShowOptions(true) }}
          placeholder="Buscar o agregar recurso..."
        />
        <button type="button" aria-label="Mostrar recursos" className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center text-blue-600" onClick={() => setShowOptions((value) => !value)}><ChevronDown className={cn('size-4 transition', showOptions ? 'rotate-180' : '')} /></button>
        {showOptions ? (
          <div className="absolute inset-x-0 top-full z-20 mt-1 rounded-xl border border-border bg-popover p-2 shadow-lg">
            <div className="max-h-52 space-y-2 overflow-y-auto">
              {normalizedQuery ? (
                <div className="flex flex-wrap gap-1.5">{filteredResources.map(resourceButton)}{filteredResources.length === 0 ? <p className="px-2 py-3 text-xs text-muted-foreground">Sin coincidencias. Agrégalo como recurso personalizado.</p> : null}</div>
              ) : (
                <>
                  {recentResources.length > 0 ? <div><p className="mb-1.5 px-1 text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">Usados recientemente</p><div className="flex flex-wrap gap-1.5">{recentResources.map(resourceButton)}</div></div> : null}
                  <div><p className="mb-1.5 px-1 text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">Recursos comunes</p><div className="flex flex-wrap gap-1.5">{commonActivityResources.map(resourceButton)}</div></div>
                  {customResources.length > 0 ? <div><p className="mb-1.5 px-1 text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">Mis recursos</p><div className="flex flex-wrap gap-1.5">{customResources.slice(0, 6).map(resourceButton)}</div></div> : null}
                </>
              )}
            </div>
            <button
              type="button"
              className="mt-2 flex w-full items-center justify-between border-t border-border px-2 pt-2 text-left text-xs font-black text-blue-600 hover:underline"
              onClick={() => { setShowOptions(false); setShowBank(true) }}
            >
              <span>Explorar banco completo por áreas</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        ) : null}
      </div>
      {resources.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {resources.map((resource) => (
            <button key={resource} type="button" className="inline-flex h-9 items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 text-xs font-black text-blue-700 transition hover:border-blue-300" onClick={() => toggleResource(resource)}>
              {resourceIcon(resource)}{resource}<X className="size-3.5 text-slate-500" />
            </button>
          ))}
        </div>
      ) : null}
      <button type="button" className="flex w-full items-center justify-between rounded-lg border border-blue-200 bg-blue-50/30 px-3 py-2.5 text-left text-sm font-black text-blue-600 transition hover:border-blue-300 hover:bg-blue-50/70" onClick={() => { setShowMyResources((value) => !value); setShowOptions(false) }}>
        <span className="flex items-center gap-2.5"><span className="grid size-8 place-items-center rounded-lg bg-blue-50"><Plus className="size-4" /></span><span><span className="block">Mis recursos</span><span className="mt-0.5 block text-xs font-medium text-blue-600/70">{customResources.length} recursos personalizados</span></span></span>
        <ChevronDown className={cn('size-4 transition', showMyResources ? 'rotate-180' : '')} />
      </button>
      {showMyResources ? <div className="rounded-lg border border-blue-100 bg-blue-50/20 p-3">{customResources.length ? <div className="flex flex-wrap gap-1.5">{customResources.map(resourceButton)}</div> : <p className="text-xs text-blue-600/70">Los recursos personalizados que agregues aparecerán aquí.</p>}</div> : null}
      {showBank ? (
        <div className="rounded-xl border border-border bg-muted/10 p-2">
          <div className="mb-2 flex items-center justify-between px-1"><div><p className="text-sm font-black text-blue-600">Banco de recursos por áreas</p><p className="text-xs text-blue-600/70">{allCatalogResources.length} recursos disponibles</p></div><button type="button" aria-label="Cerrar banco de recursos" className="grid size-8 place-items-center rounded-lg text-blue-600 hover:bg-blue-50" onClick={() => setShowBank(false)}><X className="size-4" /></button></div>
          <div className="max-h-80 space-y-1 overflow-y-auto pr-1">
            {resourceBankCategories.map((category) => {
              const open = expandedCategory === category.id
              return <div key={category.id} className="overflow-hidden rounded-lg border border-blue-100 bg-card"><button type="button" className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left" onClick={() => setExpandedCategory(open ? null : category.id)}><span className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-lg bg-blue-50 text-blue-600">{resourceCategoryIcon(category.id)}</span><span><span className="block text-sm font-black text-blue-600">{category.label}</span><span className="block text-xs text-blue-600/65">{category.resources.length} recursos</span></span></span><ChevronDown className={cn('size-4 text-blue-600 transition', open ? 'rotate-180' : '')} /></button>{open ? <div className="flex flex-wrap gap-1.5 border-t border-blue-100 bg-blue-50/20 p-3">{category.resources.map(resourceButton)}</div> : null}</div>
            })}
          </div>
        </div>
      ) : null}
      {showCustomInput ? (
        <div className="flex gap-2">
          <Input className="h-9" autoFocus value={customResource} placeholder="Ej. Simulador PhET de circuitos" onChange={(event) => setCustomResource(event.target.value)} onKeyDown={(event) => { if (event.key !== 'Enter') return; event.preventDefault(); addCustomResource() }} />
          <Button type="button" size="sm" className="h-9" onClick={addCustomResource}>Agregar</Button>
          <Button type="button" size="sm" variant="ghost" className="h-9" onClick={() => setShowCustomInput(false)}>Cancelar</Button>
        </div>
      ) : (
        <button type="button" className="inline-flex items-center gap-2 text-sm font-black text-blue-600 hover:underline" onClick={() => { setShowCustomInput(true); setShowOptions(false) }}><Plus className="size-4" />Agregar recurso personalizado</button>
      )}
    </div>
  )
}

function resourceCategoryIcon(categoryId: string) {
  if (categoryId === 'technology') return <Laptop className="size-4" />
  if (categoryId === 'math') return <Calculator className="size-4" />
  if (categoryId === 'science') return <FlaskConical className="size-4" />
  if (categoryId === 'language') return <BookOpen className="size-4" />
  if (categoryId === 'social') return <MapIcon className="size-4" />
  if (categoryId === 'arts') return <Palette className="size-4" />
  if (categoryId === 'music') return <Speaker className="size-4" />
  if (categoryId === 'physical') return <Trophy className="size-4" />
  if (categoryId === 'early') return <Puzzle className="size-4" />
  return <Accessibility className="size-4" />
}

function resourceIcon(resource: string) {
  const value = resource.toLocaleLowerCase()
  const has = (...terms: string[]) => terms.some((term) => value.includes(term))
  const iconClass = cn('size-4', resourceIconColor(resource))

  if (has('computadora', 'portátil', 'software educativo', 'simulador virtual')) return <Laptop className={iconClass} />
  if (has('tableta')) return <Tablet className={iconClass} />
  if (has('dispositivo móvil', 'celular')) return <Smartphone className={iconClass} />
  if (has('proyector')) return <Projector className={iconClass} />
  if (has('powerpoint', 'diapositiva', 'pizarra')) return <Presentation className={iconClass} />
  if (has('pantalla', 'televisión')) return <Monitor className={iconClass} />
  if (has('internet', 'wifi', 'globo terráqueo')) return <Globe className={iconClass} />
  if (has('webcam', 'cámara', 'trípode')) return <Camera className={iconClass} />
  if (has('micrófono')) return <Mic className={iconClass} />
  if (has('altavoz', 'bocina')) return <Volume2 className={iconClass} />
  if (has('audífono')) return <Headphones className={iconClass} />
  if (has('impresora', 'material impreso')) return <Printer className={iconClass} />
  if (has('escáner')) return <ScanLine className={iconClass} />
  if (has('memoria usb')) return <Usb className={iconClass} />
  if (has('cable hdmi', 'circuitos eléctricos', 'bandas elásticas', 'cuerdas para saltar')) return <Cable className={iconClass} />
  if (has('grabadora', 'podcast')) return <Radio className={iconClass} />
  if (has('video')) return <Video className={iconClass} />

  if (has('calculadora')) return <Calculator className={iconClass} />
  if (has('compás')) return <DraftingCompass className={iconClass} />
  if (has('transportador', 'escuadra', 'cartabón')) return <Triangle className={iconClass} />
  if (has('cinta métrica', 'regla')) return <Ruler className={iconClass} />
  if (has('figuras geométricas', 'formas clasificables', 'fracciones circulares')) return <Shapes className={iconClass} />
  if (has('cuerpos geométricos', 'maqueta geográfica', 'caja de arena')) return <Box className={iconClass} />
  if (has('ábaco', 'fichas de conteo', 'números móviles')) return <Hash className={iconClass} />
  if (has('bloques base diez', 'regletas de cuisenaire', 'geoplano', 'plano cartesiano', 'papel cuadriculado')) return <Blocks className={iconClass} />
  if (has('tangram', 'rompecabezas', 'encajables')) return <Puzzle className={iconClass} />
  if (has('dados', 'dominó')) return <Dices className={iconClass} />
  if (has('balanza')) return <Scale className={iconClass} />

  if (has('microscopio')) return <Microscope className={iconClass} />
  if (has('tubos de ensayo')) return <TestTube className={iconClass} />
  if (has('probeta', 'precipitado', 'gradilla', 'matraz', 'pipeta', 'gotero', 'embudo', 'petri', 'portaobjetos', 'cubreobjetos', 'mortero', 'reactivos', 'sensor de ph')) return <Beaker className={iconClass} />
  if (has('lupa')) return <Search className={iconClass} />
  if (has('termómetro')) return <Thermometer className={iconClass} />
  if (has('cronómetro', 'temporizador', 'reloj didáctico', 'metrónomo')) return <Timer className={iconClass} />
  if (has('mechero')) return <Flame className={iconClass} />
  if (has('pinzas', 'espátula', 'guantes', 'agarre para lápiz')) return <Hand className={iconClass} />
  if (has('gafas de seguridad')) return <Glasses className={iconClass} />
  if (has('bata de laboratorio', 'petos deportivos')) return <Shield className={iconClass} />
  if (has('modelo anatómico')) return <Users className={iconClass} />
  if (has('imanes', 'letras magnéticas')) return <Magnet className={iconClass} />
  if (has('brújula')) return <MapIcon className={iconClass} />

  if (has('diccionario')) return <BookA className={iconClass} />
  if (has('cuentos', 'novelas', 'poemario', 'biografías', 'cancionero')) return <BookText className={iconClass} />
  if (has('tarjetas', 'fichas culturales')) return <Tags className={iconClass} />
  if (has('fichas de lectura', 'fuentes primarias', 'documentos históricos')) return <Files className={iconClass} />
  if (has('periódico', 'revistas')) return <Newspaper className={iconClass} />
  if (has('imágenes secuenciales', 'láminas ilustradas', 'fotografías históricas', 'infografías', 'pictogramas')) return <Images className={iconClass} />
  if (has('letras móviles', 'letras de alto contraste')) return <BookA className={iconClass} />
  if (has('audiolibro', 'pistas musicales')) return <AudioLines className={iconClass} />
  if (has('guion teatral', 'títeres', 'vestuario', 'máscaras', 'utilería')) return <Drama className={iconClass} />
  if (has('organizador gráfico', 'mapa conceptual', 'tablero de rutinas')) return <Blocks className={iconClass} />

  if (has('mapa', 'atlas')) return <MapIcon className={iconClass} />
  if (has('línea del tiempo')) return <Clock3 className={iconClass} />
  if (has('banderas')) return <Flag className={iconClass} />

  if (has('pintura', 'acuarelas', 'témperas', 'crayones', 'arcilla', 'plastilina', 'clasificadores de colores')) return <Palette className={iconClass} />
  if (has('pinceles')) return <Paintbrush className={iconClass} />
  if (has('lápices', 'bolígrafo', 'marcadores')) return <PenLine className={iconClass} />
  if (has('lienzo', 'caballete')) return <ImageIcon className={iconClass} />
  if (has('tijeras')) return <Scissors className={iconClass} />
  if (has('pegamento', 'cinta adhesiva', 'hilo y lana')) return <Link className={iconClass} />
  if (has('plantillas')) return <Shapes className={iconClass} />
  if (has('materiales reciclados')) return <Puzzle className={iconClass} />

  if (has('guitarra')) return <Guitar className={iconClass} />
  if (has('teclado musical', 'teclado adaptado')) return <Keyboard className={iconClass} />
  if (has('tambor', 'pandereta', 'instrumentos de percusión')) return <Drum className={iconClass} />
  if (has('flauta', 'maracas', 'xilófono', 'güira', 'partituras', 'atril')) return <Music className={iconClass} />
  if (has('luces escénicas', 'mesa de luz')) return <Lightbulb className={iconClass} />

  if (has('balón', 'pelotas', 'aros', 'discos voladores', 'pelota sensorial')) return <Circle className={iconClass} />
  if (has('conos')) return <Triangle className={iconClass} />
  if (has('colchonetas')) return <Layers className={iconClass} />
  if (has('obstáculos')) return <Target className={iconClass} />
  if (has('escalera de agilidad')) return <Ruler className={iconClass} />
  if (has('silbato')) return <Megaphone className={iconClass} />
  if (has('red deportiva')) return <Grid3X3 className={iconClass} />
  if (has('portería')) return <Goal className={iconClass} />
  if (has('raquetas', 'bates')) return <Dumbbell className={iconClass} />
  if (has('testigos de relevo')) return <Medal className={iconClass} />
  if (has('paracaídas recreativo', 'sacos para carrera')) return <CircleDot className={iconClass} />

  if (has('bloques de construcción', 'cubos apilables')) return <Blocks className={iconClass} />
  if (has('cuentas para ensartar')) return <CircleDot className={iconClass} />
  if (has('tableros didácticos', 'juego de memoria')) return <Layers className={iconClass} />
  if (has('animales de juguete')) return <Puzzle className={iconClass} />
  if (has('objetos antiestrés', 'cojín sensorial', 'panel de texturas', 'material táctil')) return <Hand className={iconClass} />
  if (has('comunicador alternativo', 'tarjetas de comunicación')) return <MessageSquare className={iconClass} />
  if (has('plataforma educativa')) return <GraduationCap className={iconClass} />
  if (has('cuaderno')) return <NotebookPen className={iconClass} />
  if (has('libro')) return <BookOpen className={iconClass} />
  if (has('hojas', 'papel', 'cartulina', 'foami')) return <Files className={iconClass} />
  return <FileText className={iconClass} />
}

function resourceIconColor(resource: string) {
  const colors = [
    'text-blue-600',
    'text-violet-600',
    'text-emerald-600',
    'text-amber-600',
    'text-rose-600',
    'text-cyan-600',
    'text-orange-600',
    'text-fuchsia-600',
  ]
  const hash = [...resource].reduce((total, character) => total + character.codePointAt(0)!, 0)
  return colors[hash % colors.length]
}

const rubricCriteria = [
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
  return 'bg-violet-400'
}

function activityInstrumentTitle(instrumentType?: string) {
  return instrumentType ? instrumentTitle(instrumentType) : 'Instrumento pendiente'
}

function activityIconTone(instrumentType?: string) {
  if (instrumentType === 'lista-cotejo') return 'bg-emerald-100 text-emerald-700'
  if (instrumentType === 'escala') return 'bg-amber-100 text-amber-700'
  if (instrumentType === 'lista-ponderada') return 'bg-blue-100 text-blue-700'
  return 'bg-violet-100 text-violet-700'
}

function formatActivityDate(value?: string) {
  if (!value) return 'Sin fecha'
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('es-DO', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatActivityTechnique(value?: string) {
  if (!value) return 'Sin técnica'
  return value.split('-').map((word) => word.charAt(0).toLocaleUpperCase() + word.slice(1)).join(' ')
}

function activityMomentTitle(value?: string) {
  if (value === 'inicio') return 'Inicio de la clase'
  if (value === 'desarrollo') return 'Durante la clase'
  if (value === 'cierre') return 'Cierre de la clase'
  return 'Durante la clase'
}

function rubricLevelPoints(maxScore: number) {
  const criterionMax = maxScore / 4
  return [criterionMax, criterionMax * 0.75, criterionMax * 0.5, criterionMax * 0.25, 0]
}

function rubricLevelLabels(maxScore: number) {
  return ['Excelente', 'Bueno', 'Satisfactorio', 'Básico', 'Insuficiente'].map((label, index) => ({
    label,
    points: rubricLevelPoints(maxScore)[index] ?? 0,
  }))
}

function suggestedScoreForStudent(index: number, maxScore: number) {
  const ratios = [0.75, 0.9, 0.8, 0.725, 0.85]
  return Number((maxScore * (ratios[index % ratios.length] ?? 0.75)).toFixed(2))
}

function suggestedLevelIndex(criterionIndex: number, score: number, maxScore: number) {
  const ratio = maxScore > 0 ? score / maxScore : 0
  if (ratio >= 0.9) return criterionIndex === 0 ? 0 : 1
  if (ratio >= 0.75) return [1, 0, 1, 2][criterionIndex] ?? 1
  if (ratio >= 0.6) return [2, 1, 2, 3][criterionIndex] ?? 2
  return [3, 2, 3, 4][criterionIndex] ?? 3
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

function instrumentTitle(instrumentType: string) {
  const titles: Record<string, string> = {
    rubrica: 'Rúbrica de evaluación',
    'lista-cotejo': 'Lista de cotejo',
    escala: 'Escala estimativa',
    'lista-ponderada': 'Lista ponderada',
  }

  return titles[instrumentType] ?? 'Selecciona un instrumento'
}

function instrumentTypographyClass(
  textSize: 'normal' | 'large' | 'xlarge',
  bold: boolean,
  italic: boolean,
) {
  return cn(
    textSize === 'normal' ? '[&_input]:text-sm [&_table]:text-xs [&_textarea]:text-xs' : '',
    textSize === 'large' ? '[&_input]:text-base [&_table]:text-sm [&_textarea]:text-sm' : '',
    textSize === 'xlarge' ? '[&_input]:text-lg [&_table]:text-base [&_textarea]:text-base' : '',
    bold ? '[&_input]:font-bold [&_td]:font-bold [&_textarea]:font-bold' : '',
    italic ? '[&_input]:italic [&_td]:italic [&_textarea]:italic' : '',
  )
}

function rubricLevelName(index: number) {
  const names = ['Excelente', 'Bueno', 'Satisfactorio', 'Básico', 'En proceso', 'Insuficiente']
  return names[index] ?? `Nivel ${index + 1}`
}

function buildActivityDraftMetas(drafts: ActivityDraftsByBlock): ActivityDraftMeta[] {
  return competencyBlocks.flatMap((block) =>
    (drafts[block.id] ?? []).map((draft) => buildActivityDraftMeta(draft, block.id)),
  )
}

function buildActivityDraftMeta(draft: ActivityDraft, blockId: CompetencyBlockId): ActivityDraftMeta {
  const block = competencyBlocks.find((item) => item.id === blockId) ?? competencyBlocks[0]
  const pendingIssues = validateActivityCompletion(draft)
  const requiredFields = 8
  const untouchedDraft = !isMeaningfulActivityDraft(draft)
  const completed = Math.max(0, requiredFields - pendingIssues.length)

  return {
    block,
    blockId,
    completion: untouchedDraft ? 0 : Math.round((completed / requiredFields) * 100),
    draft,
    missingSummary: draftMissingSummary(pendingIssues),
    pendingIssues,
    updatedAt: draft.updatedAt ?? new Date().toISOString(),
  }
}

function draftMissingSummary(issues: ActivityCompletionIssue[]) {
  if (issues.length === 0) return 'Lista para guardar como actividad'
  const instrumentIssue = issues.some((issue) => issue.target === 'instrumentBody' || issue.target === 'instrumentType')
  const descriptionIssue = issues.some((issue) => issue.target === 'description')
  if (instrumentIssue && descriptionIssue) return 'Faltan descripcion e instrumento'
  if (instrumentIssue) return 'Falta completar el instrumento'
  if (descriptionIssue) return 'Falta descripcion de la actividad'
  return `Faltan ${issues.length} campos por completar`
}

function sortDraftMetas(a: ActivityDraftMeta, b: ActivityDraftMeta, sortBy: string) {
  if (sortBy === 'updated-asc') return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
  if (sortBy === 'name-asc') return (a.draft.name || 'Actividad sin nombre').localeCompare(b.draft.name || 'Actividad sin nombre')
  if (sortBy === 'completion-desc') return b.completion - a.completion
  if (sortBy === 'completion-asc') return a.completion - b.completion
  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
}

function formatDraftDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  const today = new Date()
  const sameDay = date.toDateString() === today.toDateString()
  const time = date.toLocaleTimeString('es-DO', { hour: 'numeric', minute: '2-digit' })
  if (sameDay) return `Hoy, ${time}`
  return date.toLocaleDateString('es-DO', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function ProgressBar({
  className,
  indicatorClassName,
  indicatorColor,
  value,
}: {
  className?: string
  indicatorClassName?: string
  indicatorColor?: string
  value: number
}) {
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-muted', className)}>
      <div
        className={cn('h-full rounded-full bg-primary transition-all', indicatorClassName)}
        style={{
          backgroundColor: indicatorColor,
          width: `${Math.min(100, Math.max(0, value))}%`,
        }}
      />
    </div>
  )
}

function instrumentFieldKey(instrumentType: string, field: string, ...parts: Array<number | string>) {
  return [instrumentType, field, ...parts].join(':')
}

function hasInstrumentField(fields: Record<string, string>, key: string) {
  return Boolean(fields[key]?.trim())
}

function isInstrumentComplete(input: {
  checklistCriteria: number
  fields: Record<string, string>
  instrumentType: string
  maxScore: number
  rubricCriteria: number
  rubricLevels: number
  scaleCriteria: number
  weightedCriteria: number
}) {
  const { checklistCriteria, fields, instrumentType, maxScore, rubricCriteria, rubricLevels, scaleCriteria, weightedCriteria } = input
  if (!instrumentType) return false

  if (instrumentType === 'rubrica') {
    const assignedScore = Array.from({ length: rubricCriteria }, (_, index) => Number(fields[instrumentFieldKey('rubrica', 'points', index)] || 0)).reduce((sum, value) => sum + value, 0)
    if (Math.abs(assignedScore - maxScore) >= 0.001) return false
    for (let criterionIndex = 0; criterionIndex < rubricCriteria; criterionIndex += 1) {
      if (!hasInstrumentField(fields, instrumentFieldKey('rubrica', 'criterion', criterionIndex))) return false
      for (let levelScore = 1; levelScore <= rubricLevels; levelScore += 1) {
        if (!hasInstrumentField(fields, instrumentFieldKey('rubrica', 'descriptor', criterionIndex, levelScore))) return false
      }
    }
    return true
  }

  if (instrumentType === 'escala') {
    const assignedScore = Array.from({ length: scaleCriteria }, (_, index) => Number(fields[instrumentFieldKey('escala', 'points', index)] || 0)).reduce((sum, value) => sum + value, 0)
    if (Math.abs(assignedScore - maxScore) >= 0.001) return false
    return Array.from({ length: scaleCriteria }, (_, index) =>
      hasInstrumentField(fields, instrumentFieldKey('escala', 'criterion', index)),
    ).every(Boolean)
  }

  if (instrumentType === 'lista-cotejo') {
    const assignedScore = Array.from({ length: checklistCriteria }, (_, index) => Number(fields[instrumentFieldKey('lista-cotejo', 'points', index)] || 0)).reduce((sum, value) => sum + value, 0)
    if (Math.abs(assignedScore - maxScore) >= 0.001) return false
    return Array.from({ length: checklistCriteria }, (_, index) =>
      hasInstrumentField(fields, instrumentFieldKey('lista-cotejo', 'criterion', index)),
    ).every(Boolean)
  }

  if (instrumentType === 'lista-ponderada') {
    const assignedWeight = Array.from({ length: weightedCriteria }, (_, index) => Number(fields[instrumentFieldKey('lista-ponderada', 'weight', index)] || 0)).reduce((sum, value) => sum + value, 0)
    if (Math.abs(assignedWeight - 100) >= 0.001) return false
    for (let index = 0; index < weightedCriteria; index += 1) {
      if (!hasInstrumentField(fields, instrumentFieldKey('lista-ponderada', 'criterion', index))) return false
      if (!hasInstrumentField(fields, instrumentFieldKey('lista-ponderada', 'indicator', index))) return false
      if (!hasInstrumentField(fields, instrumentFieldKey('lista-ponderada', 'weight', index))) return false
    }
    return true
  }

  return false
}

function validateActivityCompletion(draft: ActivityDraft): ActivityCompletionIssue[] {
  const issues: ActivityCompletionIssue[] = []
  const maxScore = Number(draft.maxScore)

  if (!draft.name.trim()) {
    issues.push({ detail: 'Escribe un nombre claro para identificar la actividad.', tab: 'activity', target: 'name', title: 'Nombre de la actividad' })
  }
  if (Number.isNaN(maxScore) || maxScore <= 0) {
    issues.push({ detail: 'Indica un valor mayor que cero.', tab: 'activity', target: 'maxScore', title: 'Valor de la actividad' })
  }
  if (!draft.date) {
    issues.push({ detail: 'Selecciona la fecha en que se realizara.', tab: 'activity', target: 'date', title: 'Fecha de realizacion' })
  }
  if (!draft.evaluationTechnique) {
    issues.push({ detail: 'Selecciona la tecnica que usaras para evaluar.', tab: 'activity', target: 'evaluationTechnique', title: 'Tecnica de evaluacion' })
  }
  if (!draft.activityType) {
    issues.push({ detail: 'Indica si la actividad es grupal o individual.', tab: 'activity', target: 'activityType', title: 'Tipo de actividad' })
  }
  if (!draft.planningMoment) {
    issues.push({ detail: 'Selecciona el momento en que se desarrollara la actividad.', tab: 'activity', target: 'planningMoment', title: 'Momento de la clase' })
  }
  if (!draft.instrumentType) {
    issues.push({ detail: 'Selecciona el instrumento que acompana esta actividad.', tab: 'activity', target: 'instrumentType', title: 'Instrumento de evaluacion' })
  } else if (!draft.instrumentCompleted) {
    issues.push({ detail: 'Completa los campos requeridos del instrumento seleccionado.', tab: 'instrument', target: 'instrumentBody', title: 'Instrumento incompleto' })
  }
  if (!activityDescriptionText(draft.description).trim()) {
    issues.push({ detail: 'Describe que haran los estudiantes y que evidencia entregaran.', tab: 'activity', target: 'description', title: 'Descripcion de la actividad' })
  }

  return issues
}

function newActivityDraft(blockId: CompetencyBlockId): ActivityDraft {
  return {
    ...emptyActivityDraft,
    draftId: createDraftId(),
    competencyBlockId: blockId,
    updatedAt: new Date().toISOString(),
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
        instrumentCompleted: Boolean(draft.instrumentCompleted),
        instrumentFields: draft.instrumentFields && typeof draft.instrumentFields === 'object' && !Array.isArray(draft.instrumentFields)
          ? draft.instrumentFields as Record<string, string>
          : {},
        resources: Array.isArray(draft.resources) ? draft.resources.filter((resource): resource is string => typeof resource === 'string') : [],
        updatedAt: typeof draft.updatedAt === 'string' ? draft.updatedAt : new Date().toISOString(),
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
    activityDescriptionText(draft.description).trim() ||
    draft.instrumentType ||
    draft.instrumentCompleted ||
    Object.values(draft.instrumentFields).some((value) => value.trim()) ||
    draft.resources.length > 0 ||
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



