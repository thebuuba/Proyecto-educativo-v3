import {
  Accessibility,
  AlignCenter,
  AlignLeft,
  AlignRight,
  AudioLines,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
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
  Copy,
  Eye,
  EllipsisVertical,
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
  GripVertical,
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
import { Fragment, useEffect, useMemo, useRef, useState, type Dispatch, type KeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactNode, type SetStateAction } from 'react'
import { createPortal } from 'react-dom'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { ActivityDescriptionEditor as StructuredActivityDescriptionEditor } from '@/modules/grading/components/ActivityDescriptionEditor'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import type {
  GradeCalculationConfig,
  GradeCellSaveState,
  GradeRecordRow,
  GradingActivity,
  RecoveryScores,
  StudentGradeRow,
} from '@/modules/grading/types'
import {
  activityGradeCellKey,
  blockTotal,
  competencyBlocks,
  competencyPeriods,
  defaultGradeCalculationConfig,
  effectivePeriodScore,
  finalBlockAverage,
  finalSubjectScore,
  formatGrade,
  getRecoveryScores,
  plainActivityText,
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
  onAddActivity: (activity: Omit<GradingActivity, 'id'>) => void
  onUpdateActivity: (activity: GradingActivity) => void
  onDeleteActivity: (activityId: string) => void
  onSaveScore: (enrollmentId: string, activity: GradingActivity, value: string) => void
  onSaveRecovery: (enrollmentId: string, blockId: string, value: string) => void
  loadFinalRecords: () => Promise<Map<CompetencyPeriodId, GradeRecordRow[]>>
  getActivitiesForPeriod: (periodId: CompetencyPeriodId) => GradingActivity[]
  onActivityWorkspaceChange?: (active: boolean) => void
}

const mainViewTabs = ['blocks', 'period', 'annual', 'final'] as const
type MainView = (typeof mainViewTabs)[number]
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
    gradient: 'linear-gradient(90deg, #60a5fa 0%, #2563eb 55%, #1d4ed8 100%)',
    button: 'bg-blue-600 text-white hover:bg-blue-700',
    border: 'border-blue-200',
    ring: 'focus-visible:ring-blue-500',
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
    gradient: 'linear-gradient(90deg, #34d399 0%, #059669 55%, #047857 100%)',
    button: 'bg-emerald-600 text-white hover:bg-emerald-700',
    border: 'border-emerald-200',
    ring: 'focus-visible:ring-emerald-500',
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
    gradient: 'linear-gradient(90deg, #fcd34d 0%, #f59e0b 55%, #d97706 100%)',
    button: 'bg-amber-500 text-amber-950 hover:bg-amber-600',
    border: 'border-amber-200',
    ring: 'focus-visible:ring-amber-500',
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
    gradient: 'linear-gradient(90deg, #a78bfa 0%, #7c3aed 55%, #6d28d9 100%)',
    button: 'bg-violet-600 text-white hover:bg-violet-700',
    border: 'border-violet-200',
    ring: 'focus-visible:ring-violet-500',
    text: 'text-violet-700',
  },
]

const blockShortNames: Record<string, string> = {
  b1: 'Competencia Comunicativa',
  b2: 'Pensamiento Lógico, Creativo y Crítico y Resolución de Problemas',
  b3: 'Ética y Ciudadana y Desarrollo Personal y Espiritual',
  b4: 'Científica y Tecnológica y Ambiental y de la Salud',
}

function getBlockAccent(blockId: string) {
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

  function selectMainView(view: MainView) {
    setMainView(view)
    setDetailView(null)
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
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Vistas del panel de evaluaciones">
          <ViewButton active={mainView === 'blocks'} tabId="blocks" icon={<BookOpen className="size-4" />} label="Bloques" onClick={() => selectMainView('blocks')} onKeyDown={(event) => moveTabFocus(event, mainViewTabs, mainView, selectMainView)} />
          <ViewButton active={mainView === 'period'} tabId="period" icon={<ClipboardList className="size-4" />} label="Período" onClick={() => selectMainView('period')} onKeyDown={(event) => moveTabFocus(event, mainViewTabs, mainView, selectMainView)} />
          <ViewButton active={mainView === 'annual'} tabId="annual" icon={<CalendarDays className="size-4" />} label="Matriz anual" onClick={() => selectMainView('annual')} onKeyDown={(event) => moveTabFocus(event, mainViewTabs, mainView, selectMainView)} />
          <ViewButton active={mainView === 'final'} tabId="final" icon={<Trophy className="size-4" />} label="Resumen final" onClick={() => selectMainView('final')} onKeyDown={(event) => moveTabFocus(event, mainViewTabs, mainView, selectMainView)} />
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
  const blockTabs = ['matrix', 'activities', 'students', 'stats'] as const
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
    { id: 'stats', label: 'Estadísticas del bloque' },
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
          <h3 className="font-black text-primary">Estadísticas del bloque</h3>
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

function CellSaveIndicator({ state }: { state?: GradeCellSaveState }) {
  const label = state === 'saving'
    ? 'Guardando...'
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

function ActivityInfoModal({ activity, onClose }: { activity: GradingActivity; onClose: () => void }) {
  const block = competencyBlocks.find((item) => item.id === activity.competencyBlockId) ?? competencyBlocks[0]
  const accent = getBlockAccent(block.id)
  const resources = activity.resources ?? []
  const activityDetails = [
    { icon: <Target className="size-4" />, label: 'Valor', value: `${activity.maxScore} pts` },
    { icon: <CalendarDays className="size-4" />, label: 'Fecha', value: formatActivityDate(activity.date) },
    { icon: <Tags className="size-4" />, label: 'Técnica', value: formatActivityTechnique(activity.evaluationTechnique) },
    { icon: <ClipboardList className="size-4" />, label: 'Instrumento', value: instrumentTitle(activity.instrumentType || '') },
    { icon: <Users className="size-4" />, label: 'Modalidad', value: activity.activityType === 'group' ? 'Grupal' : 'Individual' },
    { icon: <Clock3 className="size-4" />, label: 'Momento', value: activityMomentTitle(activity.planningMoment) },
  ]

  return (
    <Modal title="Detalle de la actividad" onClose={onClose} hideHeader className="max-w-6xl rounded-2xl">
      <div className="h-1.5" style={{ background: accent.gradient }} />
      <header className="flex items-start justify-between gap-4 border-b border-border bg-card px-6 py-4">
        <div className="flex items-start gap-3">
          <span className={cn('grid size-11 shrink-0 place-items-center rounded-xl shadow-sm', accent.card, accent.text)}><ClipboardList className="size-5" /></span>
          <div><p className={cn('text-[10px] font-black uppercase tracking-[0.15em]', accent.text)}>Información de la actividad</p><h3 className="mt-1 text-lg font-black text-foreground">Detalle de la actividad</h3><p className="mt-0.5 text-xs text-muted-foreground">Consulta la información completa y el instrumento creado para esta actividad.</p></div>
        </div>
        <Button variant="ghost" size="icon" aria-label="Cerrar" onClick={onClose}><X className="size-5" /></Button>
      </header>

      <div className="space-y-4 bg-muted/10 p-5">
        <section className={cn('relative overflow-hidden rounded-xl border p-4 shadow-sm', accent.card, accent.border)}>
          <div className="relative z-10 flex flex-wrap items-start justify-between gap-3"><div><h4 className={cn('text-xl font-black', accent.text)}>{activity.name || 'Actividad sin nombre'}</h4><p className="mt-1 text-sm text-muted-foreground">{blockShortNames[block.id] ?? block.name}</p></div><Badge className={cn(accent.badge)}>{block.shortName}</Badge></div>
          <span className="absolute -right-7 -top-12 size-36 rounded-full bg-white/25" />
        </section>

        <dl className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {activityDetails.map((item) => <div key={item.label} className="flex min-w-0 items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm"><span className={cn('grid size-9 shrink-0 place-items-center rounded-lg', accent.panel, accent.text)}>{item.icon}</span><div className="min-w-0"><dt className="text-[9px] font-black uppercase tracking-[0.12em] text-muted-foreground">{item.label}</dt><dd className="mt-0.5 truncate text-xs font-black text-foreground" title={item.value}>{item.value}</dd></div></div>)}
        </dl>

        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(16rem,0.55fr)]">
          <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-center gap-3 border-b border-border bg-muted/15 px-4 py-3"><span className={cn('grid size-8 place-items-center rounded-lg', accent.panel, accent.text)}><FileText className="size-4" /></span><div><h5 className={cn('text-sm font-black', accent.text)}>Descripción de la actividad</h5><p className="text-[10px] text-muted-foreground">Propósito, desarrollo e indicaciones.</p></div></div>
            <div className="p-4 text-sm leading-7 text-foreground"><ActivityDescriptionContent value={activity.description} fallback="No hay una descripción registrada para esta actividad." /></div>
          </section>
          <section className={cn('overflow-hidden rounded-xl border bg-card shadow-sm', accent.border)}>
            <div className={cn('flex items-center gap-3 border-b px-4 py-3', accent.card, accent.border)}><span className={cn('grid size-8 place-items-center rounded-lg bg-card shadow-sm', accent.text)}><Box className="size-4" /></span><div><h5 className={cn('text-sm font-black', accent.text)}>Recursos necesarios</h5><p className="text-[10px] text-muted-foreground">{resources.length} seleccionados</p></div></div>
            {resources.length > 0 ? <div className="flex flex-wrap gap-2 p-4">{resources.map((resource) => <span key={resource} className={cn('inline-flex items-center gap-1.5 rounded-lg border bg-card px-2.5 py-1.5 text-xs font-bold shadow-sm', accent.border, accent.text)}>{resourceIcon(resource)}{resource}</span>)}</div> : <div className="flex items-center gap-2 p-4 text-xs text-muted-foreground"><Box className="size-4" />No se registraron recursos.</div>}
          </section>
        </div>

        <section className={cn('overflow-hidden rounded-xl border bg-card shadow-sm', accent.border)}>
          <div className={cn('flex items-center gap-3 border-b px-4 py-3', accent.card, accent.border)}><span className={cn('grid size-8 place-items-center rounded-lg bg-card shadow-sm', accent.text)}><ClipboardList className="size-4" /></span><div><h5 className={cn('text-sm font-black', accent.text)}>Instrumento de evaluación</h5><p className="text-[10px] text-muted-foreground">{instrumentTitle(activity.instrumentType || '')} · Solo lectura</p></div><Badge tone="success" className="ml-auto">Completo</Badge></div>
          <div className="max-h-[24rem] overflow-auto p-4">
            <ReadOnlyInstrument type={activity.instrumentType} fields={activity.instrumentCriteria ?? {}} maxScore={activity.maxScore} accent={accent} />
          </div>
        </section>
      </div>
    </Modal>
  )
}

function ReadOnlyInstrument(props: { type?: string; fields: Record<string, string>; maxScore: number; accent?: (typeof blockAccents)[number] }) {
  return <div className={instrumentTypographyClass(props.type, props.fields)}><ReadOnlyInstrumentContent {...props} /></div>
}

function ReadOnlyInstrumentContent({ type, fields, maxScore, accent }: { type?: string; fields: Record<string, string>; maxScore: number; accent?: (typeof blockAccents)[number] }) {
  const entries = Object.entries(fields).filter(([, value]) => value.trim())
  const criterionEntries = type ? entries.filter(([key]) => key.startsWith(`${type}:criterion:`)) : []
  const indexes = [...new Set(criterionEntries.map(([key]) => Number(key.split(':')[2])).filter(Number.isFinite))].sort((a, b) => a - b)
  if (!type || indexes.length === 0) {
    return <p className="rounded-lg bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">Este instrumento no tiene criterios configurados guardados.</p>
  }
  if (type === 'rubrica') {
    const levelCount = Number(fields['rubrica:meta:levelCount']) || inferRubricLevels(fields, 4)
    const levels = Array.from({ length: levelCount }, (_, index) => levelCount - index)
    return (
      <div className="space-y-2"><InstrumentTable><thead><tr><th className="border border-border bg-slate-50 px-3 py-2">Criterios</th>{levels.map((level, index) => { const visual = rubricLevelVisual(index, levels.length); return <th key={level} className="border px-3 py-2 text-center" style={{ backgroundColor: visual.background, borderColor: visual.border, color: visual.foreground }}><span className="block font-black">{fields[instrumentFieldKey(type, 'level-name', level)] || `Nivel ${level}`}</span><span className="text-[10px] font-bold opacity-80">{fields[instrumentFieldKey(type, 'level-points', level)] || level} pts</span></th> })}<th className="border border-border bg-slate-50 px-3 py-2 text-center">Valor</th></tr></thead><tbody>
        {indexes.map((index) => <tr key={index}><td className="border border-border px-3 py-3 font-bold">{fields[instrumentFieldKey(type, 'criterion', index)]}</td>{levels.map((level) => <td key={level} className="border border-border px-3 py-3 leading-5 text-muted-foreground">{fields[instrumentFieldKey(type, 'descriptor', index, level)] || '—'}</td>)}<td className="border border-border px-3 py-3 text-center font-bold">{fields[instrumentFieldKey(type, 'points', index)] || '—'} pts</td></tr>)}
      </tbody></InstrumentTable><p className="text-right text-xs font-black text-primary">Puntuación máxima: {maxScore} pts</p></div>
    )
  }
  if (type === 'lista-cotejo') {
    const hasNoApply = fields['lista-cotejo:meta:noApply'] === 'true'
    const options = [{ label: fields['lista-cotejo:meta:yesLabel'] || 'Sí', tone: 'positive' as const }, { label: fields['lista-cotejo:meta:noLabel'] || 'No', tone: 'negative' as const }, ...(hasNoApply ? [{ label: fields['lista-cotejo:meta:naLabel'] || 'No aplica', tone: 'neutral' as const }] : [])]
    return <div className="space-y-3"><InstrumentTable><thead><tr><th className={cn('border px-3 py-3', accent ? cn(accent.card, accent.border, accent.text) : 'border-blue-200 bg-blue-50 text-blue-700')}>Criterios</th>{options.map((option) => <th key={option.label} className={cn('border px-3 py-3 text-center', option.tone === 'positive' ? 'border-emerald-300 bg-emerald-100 text-emerald-800' : option.tone === 'negative' ? 'border-red-300 bg-red-100 text-red-700' : 'border-amber-300 bg-amber-100 text-amber-800')}>{option.label}</th>)}<th className={cn('border px-3 py-3 text-center', accent ? cn(accent.card, accent.border, accent.text) : 'border-blue-200 bg-blue-50 text-blue-700')}>Valor</th></tr></thead><tbody>{indexes.map((index) => <tr key={index}><td className="border border-border bg-card px-3 py-3 font-bold">{fields[instrumentFieldKey(type,'criterion',index)] || `Criterio ${index+1}`}</td>{options.map((option) => <td key={option.label} className={cn('border text-center', option.tone === 'positive' ? 'border-emerald-200 bg-emerald-50/55' : option.tone === 'negative' ? 'border-red-200 bg-red-50/55' : 'border-amber-200 bg-amber-50/55')}><InstrumentCheckPlaceholder tone={option.tone} /></td>)}<td className={cn('border px-3 py-3 text-center font-black', accent ? cn(accent.card, accent.border, accent.text) : 'border-blue-200 bg-blue-50 text-blue-700')}>{fields[instrumentFieldKey(type,'points',index)] || 0} pts</td></tr>)}</tbody></InstrumentTable><p className={cn('text-right text-sm font-black', accent?.text || 'text-emerald-700')}>Puntuación máxima: {maxScore} pts</p></div>
  }
  if (type === 'escala') {
    const levelCount = Number(fields['escala:meta:levelCount']) || 4
    const levels = Array.from({length:levelCount},(_,index)=>levelCount-index)
    const hasNoApply = fields['escala:meta:noApply'] === 'true'
    const previewAccent = accent ?? blockAccents[0]
    return <div className="space-y-3"><InstrumentTable><thead><tr><th className={cn('border px-3 py-3',previewAccent.card,previewAccent.border,previewAccent.text)}>Indicadores</th>{levels.map((level,index)=>{const visual=scaleLevelVisual(previewAccent,index,levels.length);return <th key={level} className="border px-3 py-3 text-center" style={{backgroundColor:visual.background,borderColor:visual.border,color:visual.foreground}}><span className="block font-black">{fields[instrumentFieldKey(type,'level-name',level)]||`Nivel ${level}`}</span><span className="text-[10px] font-medium opacity-75">{fields[instrumentFieldKey(type,'level-points',level)]||level} pts</span></th>})}{hasNoApply?<th className="border border-slate-300 bg-slate-100 px-3 py-3 text-center text-slate-600">No aplica<span className="block text-[10px]">N/A</span></th>:null}<th className={cn('border px-3 py-3 text-center',previewAccent.card,previewAccent.border,previewAccent.text)}>Máximo</th></tr></thead><tbody>{indexes.map((index)=><tr key={index}><td className="border border-border bg-card px-3 py-3 font-bold">{fields[instrumentFieldKey(type,'criterion',index)]||`Indicador ${index+1}`}</td>{levels.map((level,levelIndex)=>{const visual=scaleLevelVisual(previewAccent,levelIndex,levels.length);return <td key={level} className="border bg-card text-center" style={{borderColor:visual.border}}><span className="mx-auto block size-4 rounded-full border-2 bg-card" style={{borderColor:visual.border}}/></td>})}{hasNoApply?<td className="border border-slate-200 bg-slate-50 text-center"><span className="mx-auto block size-4 rounded-full border-2 border-slate-300 bg-card"/></td>:null}<td className={cn('border px-3 py-3 text-center font-black',previewAccent.card,previewAccent.border,previewAccent.text)}>{fields[instrumentFieldKey(type,'points',index)]||0} pts</td></tr>)}</tbody></InstrumentTable><p className={cn('text-right text-sm font-black',previewAccent.text)}>Puntuación máxima: {maxScore} pts</p></div>
  }
  const hasPartial = fields['lista-ponderada:meta:partial'] !== 'false'
  const weightedLabels = { yes: fields['lista-ponderada:meta:yesLabel'] || 'Sí', partial: fields['lista-ponderada:meta:partialLabel'] || 'Parcial', no: fields['lista-ponderada:meta:noLabel'] || 'No' }
  const totalWeight = indexes.reduce((sum,index)=>sum+Number(fields[instrumentFieldKey(type,'weight',index)]||0),0)
  const previewAccent = accent ?? blockAccents[0]
  return <div className="space-y-3"><InstrumentTable><thead><tr><th className={cn('border px-3 py-2',previewAccent.card,previewAccent.border)}>Criterio</th><th className={cn('border px-3 py-2',previewAccent.card,previewAccent.border)}>Indicador observable</th><th className={cn('border px-3 py-2 text-center',previewAccent.card,previewAccent.border)}>Ponderación</th><th className={cn('border px-3 py-2 text-center',previewAccent.card,previewAccent.border)}>Valor máximo</th><th className="border border-emerald-200 bg-emerald-50 px-3 py-2 text-center text-emerald-700">{weightedLabels.yes}<span className="block text-[9px]">100 %</span></th>{hasPartial?<th className="border border-amber-200 bg-amber-50 px-3 py-2 text-center text-amber-700">{weightedLabels.partial}<span className="block text-[9px]">{fields['lista-ponderada:meta:partialValue']||50} %</span></th>:null}<th className="border border-red-200 bg-red-50 px-3 py-2 text-center text-red-700">{weightedLabels.no}<span className="block text-[9px]">0 %</span></th></tr></thead><tbody>{indexes.map((index)=>{const weight=Number(fields[instrumentFieldKey(type,'weight',index)]||0);return <tr key={index}><td className="border border-border bg-card px-3 py-3 font-bold">{fields[instrumentFieldKey(type,'criterion',index)]||`Criterio ${index+1}`}</td><td className="border border-border bg-card px-3 py-3 text-muted-foreground">{fields[instrumentFieldKey(type,'indicator',index)]||'—'}</td><td className="border border-border bg-card px-3 py-3 text-center font-black">{formatInstrumentNumber(weight)} %</td><td className={cn('border px-3 py-3 text-center font-black',previewAccent.card,previewAccent.border,previewAccent.text)}>{formatInstrumentNumber(weight/100*maxScore)} pts</td><td className="border border-emerald-200 bg-emerald-50/40 text-center"><span className="mx-auto block size-4 rounded-full border-2 border-emerald-500 bg-card"/></td>{hasPartial?<td className="border border-amber-200 bg-amber-50/40 text-center"><span className="mx-auto block size-4 rounded-full border-2 border-amber-500 bg-card"/></td>:null}<td className="border border-red-200 bg-red-50/40 text-center"><span className="mx-auto block size-4 rounded-full border-2 border-red-400 bg-card"/></td></tr>})}</tbody></InstrumentTable><div className={cn('flex justify-between rounded-xl border px-4 py-3 text-sm font-black',previewAccent.card,previewAccent.border)}><span className={Math.abs(totalWeight-100)<.001?'text-emerald-700':'text-destructive'}>Ponderación: {formatInstrumentNumber(totalWeight)}/100 %</span><span className={previewAccent.text}>Puntuación máxima: {formatInstrumentNumber(maxScore)} pts</span></div></div>
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
  const rubricConfiguration = activityRubricConfiguration(activity)
  const levelRows = rubricConfiguration.criteria.map((criterion, index) => {
    const levelIndex = Math.min(rubricConfiguration.levels.length - 1, suggestedLevelIndex(index, currentScore, activity.maxScore))
    const highestLevel = rubricConfiguration.levels[0]?.points || 1
    const selectedLevel = rubricConfiguration.levels[levelIndex]?.points || 0
    return { criterion, levelIndex, points: Number((criterion.maximum * selectedLevel / highestLevel).toFixed(2)) }
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
          levelLabels={rubricConfiguration.levels}
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
  levelLabels,
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
  levelRows: Array<{ criterion: { title: string; description: string; maximum: number }; levelIndex: number; points: number }>
  levelLabels: Array<{ label: string; points: number }>
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
            {instrumentTitle(activity.instrumentType || 'rubrica')} - {levelRows.length} criterios - Total {activity.maxScore} pts
          </p>
        </div>

        <div className={cn('overflow-x-auto', instrumentTypographyClass(activity.instrumentType, activity.instrumentCriteria ?? {}))}>
          <table className="min-w-[52rem] w-full text-sm">
            <thead className="bg-muted/35 text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
              <tr>
                <th rowSpan={2} className="w-[16rem] border-b border-r border-border px-4 py-3 text-left">Criterios</th>
                <th colSpan={levelLabels.length} className="border-b border-r border-border px-4 py-2 text-center">{activity.instrumentType === 'escala' ? 'Niveles de la escala' : 'Niveles de desempeño'}</th>
                <th rowSpan={2} className="w-28 border-b border-border px-4 py-3 text-center">Puntaje</th>
              </tr>
              <tr>
                {levelLabels.map((level, index) => {
                  const visual = activity.instrumentType === 'escala' ? scaleLevelVisual(getBlockAccent(activity.competencyBlockId), index, levelLabels.length) : activity.instrumentType === 'lista-ponderada' ? weightedResponseVisual(index, levelLabels.length) : rubricLevelVisual(index, levelLabels.length)
                  return <th key={level.label} className="border-b border-r px-3 py-2 text-center" style={{ backgroundColor: visual.background, borderColor: visual.border, color: visual.foreground }}>
                    <span className="block font-black">{level.label}</span>
                    <span className="font-bold opacity-80">{formatGrade(level.points)}{activity.instrumentType === 'lista-ponderada' ? '%' : ' pts'}</span>
                  </th>
                })}
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
                      <span className={cn(
                        'inline-flex size-5 items-center justify-center rounded-full border-2',
                        row.levelIndex === levelIndex ? 'border-primary bg-primary shadow-[inset_0_0_0_4px_white]' : 'border-border bg-card',
                      )} />
                    </td>
                  ))}
                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex h-10 min-w-20 items-center justify-center rounded-lg border border-border bg-card px-3 font-black text-primary">
                      {formatGrade(row.points)} / {formatGrade(row.criterion.maximum)}
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
  cellSaveStates,
  saving,
  students,
}: {
  activity: GradingActivity
  config: GradeCalculationConfig
  onBack: () => void
  onEditActivity: (activity: GradingActivity) => void
  onSaveScore: (enrollmentId: string, activity: GradingActivity, value: string) => void
  records: GradeRecordRow[]
  cellSaveStates: Record<string, GradeCellSaveState>
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
                    const saveState = cellSaveStates[activityGradeCellKey(student.enrollmentId, activity.id)]
                    return (
                      <tr key={student.enrollmentId} className="border-t border-border">
                        <td className="px-4 py-3 font-medium">{student.lastName}, {student.firstName}</td>
                        <td className="px-4 py-2 text-center">
                          <div className="inline-flex flex-col items-center gap-0.5">
                            <Input
                              type="number"
                              min={0}
                              max={activity.maxScore}
                              step="0.01"
                              defaultValue={record?.score ?? ''}
                              disabled={saving || saveState === 'saving'}
                              className="grade-cell h-9 w-24 text-center font-bold"
                              onKeyDown={focusNextGradeCell}
                              onBlur={(event) => onSaveScore(student.enrollmentId, activity, event.target.value)}
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

const transientHighlightClass = 'rounded-xl ring-2 ring-primary/70 ring-offset-2 ring-offset-background shadow-[0_0_24px_rgba(37,99,235,0.45)] motion-safe:animate-pulse transition-shadow duration-300'

function useTransientActivityHighlight(duration = 3000) {
  const [highlightTarget, setHighlightTarget] = useState<ActivityCompletionTarget | null>(null)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => () => {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current)
  }, [])

  function clearHighlight() {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current)
    timeoutRef.current = null
    setHighlightTarget(null)
  }

  function showHighlight(target: ActivityCompletionTarget) {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current)
    setHighlightTarget(target)
    timeoutRef.current = window.setTimeout(() => {
      setHighlightTarget(null)
      timeoutRef.current = null
    }, duration)
  }

  return { clearHighlight, highlightTarget, showHighlight }
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
    highlightTarget === target ? transientHighlightClass : ''

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
}: {
  accent: (typeof blockAccents)[number]
  activities: GradingActivity[]
  block: (typeof competencyBlocks)[number]
  draftCount: number
  onSelectBlock: () => void
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

      <Button className="mt-auto h-9 w-full" onClick={onSelectBlock}>
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
  const { clearHighlight, highlightTarget, showHighlight } = useTransientActivityHighlight()
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
    showHighlight(issue.target)
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

  function continueFlow() {
    if (stage === 'activity') {
      setStage('instrument')
    } else if (stage === 'instrument') {
      setStage('review')
    } else {
      saveActivity()
    }
  }

  const continueLabel = stage === 'activity'
    ? 'Continuar al instrumento'
    : stage === 'instrument'
      ? 'Continuar a revisión'
      : editingActivityId
        ? 'Guardar cambios'
        : 'Guardar actividad'

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <button type="button" className="font-medium text-primary hover:underline" onClick={onBack}>Calificaciones</button>
        <span>›</span><span>{block.shortName}</span><span>›</span>
        <span>{editingActivityId ? 'Editar actividad' : 'Crear actividad'}</span>
      </div>

      <div className="relative overflow-hidden rounded-xl px-5 py-4 text-white shadow-sm" style={{ background: accent.gradient }}>
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
              <ProgressBar value={progressMeta.completion} className="mt-2" indicatorGradient={accent.gradient} />
            </div>
          </div>

          <nav className="grid grid-cols-3 overflow-hidden rounded-xl border border-border bg-card shadow-sm" aria-label="Etapas de creación">
            {stages.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={cn('relative flex min-h-14 items-center justify-center gap-2 border-r border-border px-3 text-sm font-black transition last:border-r-0 hover:bg-muted/30', stage === item.id ? cn(accent.panel, accent.text) : 'text-muted-foreground')}
                onClick={() => { setStage(item.id); clearHighlight() }}
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
              <div className={cn('rounded-xl border px-4 py-3', accent.card)}>
                <p className={cn('text-xs font-black uppercase tracking-[0.14em]', accent.text)}>Instrumento seleccionado: {instrumentLabel}</p>
                <p className="mt-1 text-sm text-muted-foreground">Configura los criterios y niveles que utilizarás para evaluar esta actividad.</p>
              </div>
              <InstrumentPreview
                key={activityDraft.instrumentType}
                accent={accent}
                activityName={activityDraft.name}
                block={block}
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
            <ActivityReview activityDraft={activityDraft} issues={progressMeta.pendingIssues} />
          ) : null}

        </main>

        <ActivityProgressCard
          cancelHint={editingActivityId ? 'Los cambios no guardados de esta edición se descartarán.' : 'Tu trabajo se conserva automáticamente como borrador.'}
          continueDisabled={stage === 'review' && saving}
          continueLabel={continueLabel}
          meta={progressMeta}
          onCancel={onBack}
          onContinue={continueFlow}
          onSelectIssue={goToIssue}
        />
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
  const highlight = (target: ActivityCompletionTarget) => highlightTarget === target ? transientHighlightClass : ''
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
  return escapeHtml(plainActivityText(value)).replace(/\n/g, '<br>')
}

function activityDescriptionText(value: string) {
  if (!value) return ''
  if (!/<\/?[a-z][\s\S]*>/i.test(value)) return plainActivityText(value)
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

function ActivityReview({ activityDraft, issues }: { activityDraft: ActivityDraft; issues: ActivityCompletionIssue[] }) {
  const [showDescriptionPreview, setShowDescriptionPreview] = useState(false)
  const [showInstrumentPreview, setShowInstrumentPreview] = useState(false)
  const reviewBlock = competencyBlocks.find((block) => block.id === activityDraft.competencyBlockId) ?? competencyBlocks[0]
  const accent = getBlockAccent(reviewBlock.id)
  const ready = issues.length === 0
  const instrumentType = activityDraft.instrumentType
  const instrumentFields = activityDraft.instrumentFields
  const criteriaCount = instrumentType
    ? Number(instrumentFields[`${instrumentType}:meta:criteriaCount`]) || inferInstrumentCount(instrumentFields, instrumentType, 'criterion', 0)
    : 0
  const levelCount = instrumentType === 'rubrica'
    ? Number(instrumentFields['rubrica:meta:levelCount']) || inferRubricLevels(instrumentFields, 0)
    : instrumentType === 'escala'
      ? Number(instrumentFields['escala:meta:levelCount']) || 0
      : 0
  const levels = levelCount > 0 ? Array.from({ length: levelCount }, (_, index) => levelCount - index) : []
  const instrumentSummaryTiles = levels.length > 0
    ? levels.map((level) => ({
        key: `level-${level}`,
        name: instrumentFields[instrumentFieldKey(instrumentType, 'level-name', level)] || `Nivel ${level}`,
        detail: `${instrumentFields[instrumentFieldKey(instrumentType, 'level-points', level)] || level} pts`,
      }))
    : instrumentType === 'lista-cotejo'
      ? [
          { key: 'yes', name: instrumentFields['lista-cotejo:meta:yesLabel'] || 'Sí', detail: 'Cumple' },
          { key: 'no', name: instrumentFields['lista-cotejo:meta:noLabel'] || 'No', detail: 'No cumple' },
          ...(instrumentFields['lista-cotejo:meta:noApply'] === 'true' ? [{ key: 'na', name: instrumentFields['lista-cotejo:meta:naLabel'] || 'No aplica', detail: 'Opcional' }] : []),
        ]
      : instrumentType === 'lista-ponderada'
        ? [
            { key: 'yes', name: instrumentFields['lista-ponderada:meta:yesLabel'] || 'Sí', detail: 'Logrado' },
            ...(instrumentFields['lista-ponderada:meta:partial'] !== 'false' ? [{ key: 'partial', name: instrumentFields['lista-ponderada:meta:partialLabel'] || 'Parcial', detail: 'En proceso' }] : []),
            { key: 'no', name: instrumentFields['lista-ponderada:meta:noLabel'] || 'No', detail: 'No logrado' },
          ]
        : []
  const summaryItems = [
    { icon: <CalendarDays className="size-4" />, label: 'Nombre de la actividad', value: activityDraft.name || 'Sin nombre' },
    { icon: <Target className="size-4" />, label: 'Valor de la actividad', value: activityDraft.maxScore ? `${activityDraft.maxScore} puntos` : 'Sin valor' },
    { icon: <CalendarDays className="size-4" />, label: 'Fecha de realización', value: formatActivityDate(activityDraft.date) },
    { icon: <Clock3 className="size-4" />, label: 'Momento de la clase', value: activityDraft.planningMoment ? activityMomentTitle(activityDraft.planningMoment) : 'Sin definir' },
    { icon: <Tags className="size-4" />, label: 'Técnica de evaluación', value: formatActivityTechnique(activityDraft.evaluationTechnique) },
    { icon: <ClipboardList className="size-4" />, label: 'Instrumento de evaluación', value: instrumentTitle(instrumentType) },
    { icon: <Users className="size-4" />, label: 'Modalidad de la actividad', value: activityDraft.activityType === 'group' ? 'Grupal' : activityDraft.activityType === 'individual' ? 'Individual' : 'Sin definir' },
  ]
  return (
    <div className="space-y-3">
      <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className={cn('font-black', accent.text)}>Revisión final</h3><p className="mt-0.5 text-xs text-muted-foreground">Verifica que toda la información esté correcta antes de guardar la actividad.</p></div><Badge tone={ready ? 'success' : 'warning'}>{ready ? 'Lista para guardar' : `${issues.length} pendiente${issues.length === 1 ? '' : 's'}`}</Badge></div>
        <dl className="mt-3 overflow-hidden rounded-xl border border-border bg-card">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4">
            {summaryItems.slice(0, 4).map((item) => <div key={item.label} className="flex min-w-0 items-center gap-3 border-b border-border px-3 py-3 sm:border-r lg:border-b-0 last:border-r-0"><span className="grid size-8 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-100">{item.icon}</span><div className="min-w-0"><dt className="truncate text-[9px] font-bold text-muted-foreground">{item.label}</dt><dd className="truncate text-xs font-black text-foreground" title={item.value}>{item.value}</dd></div></div>)}
          </div>
          <div className="grid border-t border-border sm:grid-cols-3">
            {summaryItems.slice(4).map((item) => <div key={item.label} className="flex min-w-0 items-center gap-3 border-b border-border px-3 py-3 sm:border-b-0 sm:border-r last:border-r-0"><span className="grid size-8 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-100">{item.icon}</span><div className="min-w-0"><dt className="truncate text-[9px] font-bold text-muted-foreground">{item.label}</dt><dd className="truncate text-xs font-black text-foreground" title={item.value}>{item.value}</dd></div></div>)}
          </div>
        </dl>
      </section>

      <section className={cn('rounded-xl border border-l-2 bg-card px-4 py-3 shadow-sm', accent.border)}>
        <div className="flex items-start gap-3"><span className="grid size-8 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-100"><Box className="size-4" /></span><div className="min-w-0 flex-1"><h4 className={cn('text-xs font-black', accent.text)}>Recursos y materiales</h4><p className="text-[10px] text-muted-foreground">Materiales y herramientas que se utilizarán en esta actividad.</p>{activityDraft.resources.length ? <div className="mt-2 flex flex-wrap gap-1.5">{activityDraft.resources.map((resource) => <span key={resource} className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold', accent.card, accent.text)}>{resourceIcon(resource)}{resource}</span>)}</div> : <p className="mt-2 text-xs text-muted-foreground">Sin recursos seleccionados (opcional).</p>}</div></div>
      </section>

      <section className={cn('rounded-xl border border-l-2 bg-card px-4 py-3 shadow-sm', accent.border)}>
        <div className="flex items-start gap-3"><span className="grid size-8 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-100"><FileText className="size-4" /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><h4 className={cn('text-xs font-black', accent.text)}>Descripción de la actividad</h4><Button type="button" variant="outline" className="group h-9 rounded-lg border-blue-200 bg-blue-50/70 px-3.5 text-xs font-black text-blue-700 shadow-sm transition-all hover:-translate-y-px hover:border-blue-300 hover:bg-blue-100 hover:text-blue-800 hover:shadow-md" onClick={() => setShowDescriptionPreview(true)}><Eye className="size-4 transition-transform group-hover:scale-110" />Ver descripción completa</Button></div><div className="mt-1 line-clamp-4 text-[11px] leading-5 text-muted-foreground"><ActivityDescriptionContent value={activityDraft.description} fallback="Sin descripción." /></div></div></div>
      </section>

      <section className={cn('overflow-hidden rounded-xl border bg-card shadow-sm', accent.border)}>
        <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3"><span className="grid size-8 place-items-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-100"><ClipboardList className="size-4" /></span><h4 className={cn('text-xs font-black', accent.text)}>Instrumento de evaluación</h4><span className="text-xs text-muted-foreground">{instrumentTitle(instrumentType)}</span><Badge tone={activityDraft.instrumentCompleted ? 'success' : 'warning'}>{activityDraft.instrumentCompleted ? 'Completo' : 'Incompleto'}</Badge><Button type="button" variant="outline" className="group ml-auto h-9 rounded-lg border-blue-200 bg-blue-50/70 px-3.5 text-xs font-black text-blue-700 shadow-sm transition-all hover:-translate-y-px hover:border-blue-300 hover:bg-blue-100 hover:text-blue-800 hover:shadow-md" onClick={() => setShowInstrumentPreview(true)}><Eye className="size-4 transition-transform group-hover:scale-110" />Ver {instrumentType === 'rubrica' ? 'rúbrica' : 'instrumento'} completo</Button></div>
        <div className="grid gap-2.5 rounded-b-xl bg-blue-50/20 p-3" style={{ gridTemplateColumns: `repeat(${Math.max(2, instrumentSummaryTiles.length + 1)}, minmax(0, 1fr))` }}>
          <div className="grid min-h-16 place-items-center rounded-xl border border-blue-100 bg-white px-3 text-center shadow-sm"><div><span className="block text-base font-black text-blue-700">{criteriaCount}</span><span className="text-[11px] font-bold text-slate-700">{instrumentType === 'escala' ? 'Indicadores' : 'Criterios'}</span></div></div>
          {instrumentSummaryTiles.length ? instrumentSummaryTiles.map((tile, index) => { const scaleVisual = instrumentType === 'escala' ? scaleLevelVisual(accent, index, instrumentSummaryTiles.length) : null; const weightedVisual = instrumentType === 'lista-ponderada' ? weightedResponseVisual(index, instrumentSummaryTiles.length) : null; const rubricVisual = instrumentType === 'escala' || instrumentType === 'lista-ponderada' ? null : rubricLevelVisual(index, instrumentSummaryTiles.length); const backgroundColor = scaleVisual?.background ?? weightedVisual?.background ?? rubricVisual?.soft; const borderColor = scaleVisual?.border ?? weightedVisual?.border ?? rubricVisual?.border; const foregroundColor = scaleVisual?.foreground ?? weightedVisual?.foreground ?? rubricVisual?.foreground; return <div key={tile.key} className="grid min-h-16 place-items-center rounded-xl border px-3 text-center shadow-sm" style={{ backgroundColor, borderColor }}><div className="min-w-0"><span className="block truncate text-[11px] font-black" style={{ color: foregroundColor }}>{tile.name}</span><span className="mt-1 block text-[11px] font-bold text-slate-700">{tile.detail}</span></div></div> }) : <div className="grid min-h-16 place-items-center rounded-xl border border-emerald-500 bg-emerald-100 px-3 text-center shadow-sm"><div><span className="block text-base font-black text-emerald-700">{formatInstrumentNumber(Number(activityDraft.maxScore) || 0)}</span><span className="text-[11px] font-bold text-slate-700">Puntos máximos</span></div></div>}
        </div>
      </section>
      {showDescriptionPreview ? <Modal title="Descripción completa de la actividad" onClose={() => setShowDescriptionPreview(false)} className="max-h-[88vh] max-w-4xl rounded-xl" hideHeader><div className="flex max-h-[88vh] flex-col"><div className="h-1.5 shrink-0" style={{ background: accent.gradient }} /><header className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-6 py-4"><div><p className={cn('text-xs font-black uppercase tracking-[0.14em]', accent.text)}>Descripción de la actividad · Solo lectura</p><h3 className="mt-1 text-xl font-black text-foreground">{activityDraft.name || 'Actividad sin nombre'}</h3><p className="mt-1 text-sm text-muted-foreground">Contenido completo de las orientaciones de la actividad.</p></div><Button type="button" variant="ghost" size="icon" aria-label="Cerrar descripción completa" onClick={() => setShowDescriptionPreview(false)}><X className="size-5" /></Button></header><div className="min-h-0 flex-1 overflow-auto bg-muted/10 p-6"><article className="rounded-xl border border-border bg-card p-6 text-sm leading-7 text-foreground shadow-sm"><ActivityDescriptionContent value={activityDraft.description} fallback="Sin descripción." /></article></div><footer className="flex shrink-0 justify-end border-t border-border bg-card px-6 py-4"><Button type="button" className={accent.button} onClick={() => setShowDescriptionPreview(false)}>Cerrar</Button></footer></div></Modal> : null}
      {showInstrumentPreview ? <InstrumentPreviewModal accent={accent} activityName={activityDraft.name} block={reviewBlock} fields={instrumentFields} instrumentType={instrumentType} maxScore={Number(activityDraft.maxScore) || 0} onClose={() => setShowInstrumentPreview(false)} /> : null}
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
  const { clearHighlight, highlightTarget, showHighlight } = useTransientActivityHighlight()

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
    showHighlight(issue.target)
    setCompletionIssues([])
  }

  function handleSaveActivity() {
    const issues = validateActivityCompletion(activityDraft)
    if (issues.length > 0) {
      setCompletionIssues(issues)
      if (issues[0]) showHighlight(issues[0].target)
      setCreationTab(issues[0]?.tab ?? 'activity')
      return
    }
    setCompletionIssues([])
    clearHighlight()
    onSaveActivity()
  }

  function continueLater() {
    setCompletionIssues([])
    clearHighlight()
    onBack()
  }

  function discardIncompleteActivity() {
    setCompletionIssues([])
    clearHighlight()
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
          accent={getBlockAccent(block.id)}
          activityName={activityDraft.name}
          block={block}
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
  cancelHint,
  continueDisabled,
  continueLabel,
  meta,
  onCancel,
  onContinue,
  onSelectIssue,
}: {
  cancelHint?: string
  continueDisabled?: boolean
  continueLabel?: string
  meta: ActivityDraftMeta
  onCancel?: () => void
  onContinue?: () => void
  onSelectIssue: (issue: ActivityCompletionIssue) => void
}) {
  const accent = getBlockAccent(meta.blockId)
  const pendingTargets = new Set(meta.pendingIssues.map((issue) => issue.target))
  const checkpoints: Array<{ label: string; targets: ActivityCompletionTarget[] }> = [
    { label: 'Nombre de la actividad', targets: ['name'] },
    { label: 'Valor de la actividad', targets: ['maxScore'] },
    { label: 'Fecha de realización', targets: ['date'] },
    { label: 'Momento de la clase', targets: ['planningMoment'] },
    { label: 'Técnica de evaluación', targets: ['evaluationTechnique'] },
    { label: 'Instrumento seleccionado', targets: ['instrumentType'] },
    { label: 'Modalidad de la actividad', targets: ['activityType'] },
    { label: 'Descripción de la actividad', targets: ['description'] },
  ]
  const instrumentType = meta.draft.instrumentType
  const instrumentFields = meta.draft.instrumentFields
  const instrumentCount = instrumentType ? Number(instrumentFields[`${instrumentType}:meta:criteriaCount`]) || inferInstrumentCount(instrumentFields, instrumentType, 'criterion', 0) : 0
  const hasInstrumentTitle = Boolean(
    instrumentFields[instrumentFieldKey(instrumentType, 'title')]?.trim()
      || (meta.draft.name.trim() && instrumentType),
  )
  const instrumentIssue = meta.pendingIssues.find((issue) => issue.target === 'instrumentBody')
  const instrumentSubchecks = instrumentType ? [
    { label: 'Título del instrumento', complete: hasInstrumentTitle },
    { label: instrumentType === 'escala' ? 'Cantidad de indicadores' : 'Cantidad de criterios', complete: instrumentCount > 0 },
    ...(instrumentType === 'rubrica' || instrumentType === 'escala' ? [{ label: 'Niveles de desempeño', complete: Number(instrumentFields[`${instrumentType}:meta:levelCount`]) >= 2 }] : []),
    { label: 'Contenido del instrumento', complete: meta.draft.instrumentCompleted },
  ] : []
  const circumference = 2 * Math.PI * 34
  const pendingCheckpoint = checkpoints.find((item) => item.targets.some((target) => pendingTargets.has(target)))
  const nextIssue = pendingCheckpoint
    ? meta.pendingIssues.find((issue) => pendingCheckpoint.targets.includes(issue.target))
    : meta.pendingIssues[0]
  const completedItems = checkpoints.filter((checkpoint) => !meta.pendingIssues.some((issue) => checkpoint.targets.includes(issue.target))).length
    + instrumentSubchecks.filter((checkpoint) => checkpoint.complete).length
    + 1
  const totalItems = checkpoints.length + instrumentSubchecks.length + 1

  return (
    <aside className={cn('h-fit overflow-hidden rounded-xl border bg-card shadow-sm xl:sticky xl:top-4', accent.border)}>
      <div className="h-1" style={{ background: accent.gradient }} />
      <div className="p-4">
      <div className="flex items-center gap-2">
        <Lightbulb className={cn('size-4', accent.text)} />
        <h3 className={cn('font-black', accent.text)}>Tu progreso</h3>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <div className="relative grid size-20 shrink-0 place-items-center" role="img" aria-label={`${meta.completion}% completado`}>
          <svg className="absolute inset-0 size-20 -rotate-90" viewBox="0 0 80 80" aria-hidden="true">
            <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="7" className="text-muted" />
            <circle cx="40" cy="40" r="34" fill="none" stroke={accent.progressColor} strokeWidth="7" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - meta.completion / 100)} className="motion-safe:transition-[stroke-dashoffset] motion-safe:duration-500 motion-safe:ease-out" />
          </svg>
          <div className={cn('relative grid size-14 place-items-center rounded-full bg-card text-lg font-black tabular-nums', accent.text)}>
            {meta.completion}%
          </div>
        </div>
        <div><p className={cn('text-sm font-black', accent.text)}>{meta.completion === 100 ? 'Actividad lista' : meta.completion >= 75 ? 'Actividad casi lista' : 'Actividad en progreso'}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{meta.completion === 100 ? 'Ya puedes revisar y guardar.' : 'Completa los elementos pendientes.'}</p></div>
      </div>
      <div className="mt-4 border-t border-border pt-4">
        <p className={cn('text-xs font-black', accent.text)}>Elementos completados ({completedItems}/{totalItems})</p>
        <div className="mt-2 space-y-1">
          {checkpoints.map((checkpoint) => {
            const issue = meta.pendingIssues.find((item) => checkpoint.targets.includes(item.target))
            const complete = !issue
            return <button key={checkpoint.label} type="button" disabled={complete} className={cn('flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs font-bold transition', complete ? 'cursor-default text-emerald-700' : 'text-amber-700 hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-2', accent.ring)} onClick={() => issue && onSelectIssue(issue)}><span className={cn('grid size-5 shrink-0 place-items-center rounded-full border text-[10px]', complete ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-amber-400 bg-amber-50 text-amber-700')}>{complete ? '✓' : '!'}</span><span>{checkpoint.label}</span></button>
          })}
          {instrumentSubchecks.map((checkpoint) => <button key={checkpoint.label} type="button" disabled={checkpoint.complete || !instrumentIssue} className={cn('flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs font-bold transition', checkpoint.complete ? 'cursor-default text-emerald-700' : 'text-amber-700 hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-2', accent.ring)} onClick={() => instrumentIssue && onSelectIssue(instrumentIssue)}><span className={cn('grid size-5 shrink-0 place-items-center rounded-full border text-[10px]', checkpoint.complete ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-amber-400 bg-amber-50 text-amber-700')}>{checkpoint.complete ? '✓' : '!'}</span><span>{checkpoint.label}</span></button>)}
          <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-bold text-emerald-700"><span className="grid size-5 place-items-center rounded-full border border-emerald-500 bg-emerald-500 text-[10px] text-white">✓</span><span>Recursos y materiales <span className="font-medium">(opcional)</span></span></div>
        </div>
      </div>
      {nextIssue ? <Button type="button" variant="outline" className={cn('mt-4 w-full justify-between', accent.text, accent.border)} onClick={() => onSelectIssue(nextIssue)}>Ir al siguiente pendiente<ArrowRight className="size-4" /></Button> : null}
      </div>
      {onCancel && onContinue ? <div className="space-y-2.5 border-t border-border bg-card p-4"><Button type="button" className="h-14 w-full justify-center rounded-xl border-0 bg-[#f04444] text-base font-black text-white shadow-md transition-all hover:-translate-y-px hover:bg-[#dc3636] hover:shadow-lg" onClick={onCancel}><X className="size-5" />Cancelar</Button><Button type="button" className="h-14 w-full justify-center rounded-xl border-0 bg-[#245a9f] text-base font-black text-white shadow-md transition-all hover:-translate-y-px hover:bg-[#1d4c89] hover:shadow-lg" disabled={continueDisabled} onClick={onContinue}>{continueLabel || 'Continuar'}<ArrowRight className="size-5" /></Button>{cancelHint ? <p className="px-1 text-center text-[10px] leading-4 text-muted-foreground">{cancelHint}</p> : null}</div> : null}
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
  void maxScore
  return { criteria: 4, levels: 4 }
}

function distributeScore(maxScore: number, count: number) {
  const safeCount = Math.max(1, count)
  const totalCents = Math.max(0, Math.round(maxScore * 100))
  const base = Math.floor(totalCents / safeCount)
  const remainder = totalCents - base * safeCount
  return Array.from({ length: safeCount }, (_, index) => Number(((base + (index < remainder ? 1 : 0)) / 100).toFixed(2)))
}

function InstrumentPreview({
  accent,
  activityName,
  block,
  completed,
  fields,
  highlight,
  instrumentType,
  maxScore,
  onCompletedChange,
  onFieldsChange,
}: {
  accent: (typeof blockAccents)[number]
  activityName: string
  block: (typeof competencyBlocks)[number]
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
  const [weightedCriteria, setWeightedCriteria] = useState(() => Number(fields['lista-ponderada:meta:criteriaCount']) || inferInstrumentCount(fields, 'lista-ponderada', 'criterion', 5))
  const [weightedHasPartial, setWeightedHasPartial] = useState(() => fields['lista-ponderada:meta:partial'] !== 'false')
  const [showInstrumentPreview, setShowInstrumentPreview] = useState(false)
  const editorRef = useRef<HTMLElement>(null)
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
      const automaticPoints = distributeScore(maxScore, rubricCriteria)
      for (let index = 0; index < rubricCriteria; index += 1) {
        const pointsKey = instrumentFieldKey('rubrica', 'points', index)
        next[pointsKey] = String(automaticPoints[index])
      }
      for (let index = 0; index < rubricLevels; index += 1) {
        const score = rubricLevels - index
        const nameKey = instrumentFieldKey('rubrica', 'level-name', score)
        if (!next[nameKey]) next[nameKey] = rubricDefaultLevelNames(rubricLevels)[index]
        const levelPointsKey = instrumentFieldKey('rubrica', 'level-points', score)
        if (next['rubrica:meta:customLevelPoints'] !== 'true' || !next[levelPointsKey]) next[levelPointsKey] = String(defaultRubricLevelPoints(automaticPoints[0] || maxScore, rubricLevels)[index])
      }
    }
    if (instrumentType === 'escala') {
      next['escala:meta:criteriaCount'] = String(scaleCriteria)
      next['escala:meta:levelCount'] = String(scaleLevels)
      distributeScore(maxScore, scaleCriteria).forEach((points, index) => {
        const key = instrumentFieldKey('escala', 'points', index)
        next[key] = String(points)
      })
      const scaleDefaults = scaleTemplateLevels(next['escala:meta:template'] || 'frecuencia')
      for (let index = 0; index < scaleLevels; index += 1) {
        const score = scaleLevels - index
        if (!next[instrumentFieldKey('escala', 'level-name', score)]) next[instrumentFieldKey('escala', 'level-name', score)] = scaleDefaults[index]?.name || `Nivel ${index + 1}`
        if (!next[instrumentFieldKey('escala', 'level-points', score)]) next[instrumentFieldKey('escala', 'level-points', score)] = String(scaleDefaults[index]?.points ?? score)
      }
    }
    if (instrumentType === 'lista-cotejo') {
      next['lista-cotejo:meta:criteriaCount'] = String(checklistCriteria)
      distributeScore(maxScore, checklistCriteria).forEach((points, index) => {
        const key = instrumentFieldKey('lista-cotejo', 'points', index)
        if (next['lista-cotejo:meta:pointsMode'] !== 'individual' || !next[key]) next[key] = String(points)
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

  useEffect(() => {
    if (!highlight) return
    const timeout = window.setTimeout(() => {
      const emptyField = Array.from(editorRef.current?.querySelectorAll<HTMLTextAreaElement>('textarea') ?? []).find((field) => !field.value.trim())
      emptyField?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' })
      emptyField?.focus()
    }, 80)
    return () => window.clearTimeout(timeout)
  }, [highlight, instrumentType])

  function updateField(key: string, value: string) {
    onFieldsChange({ ...fields, [key]: value })
  }

  const criterionCount = instrumentType === 'rubrica' ? rubricCriteria : instrumentType === 'escala' ? scaleCriteria : instrumentType === 'lista-cotejo' ? checklistCriteria : weightedCriteria
  const configuredValue = instrumentConfiguredValue(instrumentType, fields, criterionCount)
  const configuredTarget = instrumentType === 'lista-ponderada' ? 100 : maxScore
  const configuredMatches = Math.abs(configuredValue - configuredTarget) < 0.001
  const textSize = instrumentTextSize(instrumentType, fields)
  const boldText = fields[`${instrumentType}:meta:bold`] === 'true'
  const textAlign = instrumentTextAlign(instrumentType, fields)
  const typographyControls = <InstrumentTypographyControls textSize={textSize} textAlign={textAlign} bold={boldText} onTextSizeChange={(value) => updateField(`${instrumentType}:meta:textSize`, value)} onTextAlignChange={(value) => updateField(`${instrumentType}:meta:textAlign`, value)} onBoldChange={(value) => updateField(`${instrumentType}:meta:bold`, String(value))} />

  return (
    <section ref={editorRef} className={cn('overflow-hidden rounded-xl border bg-card shadow-sm', accent.border, highlight ? transientHighlightClass : '')}>
      <div className="h-1" style={{ background: accent.gradient }} />
      <div className="px-4 py-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.14em] text-muted-foreground">Instrumento seleccionado</p>
          <h3 className={cn('mt-1 text-xl font-black', accent.text)}>{title}</h3>
          <p className="mt-1 text-xs text-muted-foreground">Construye el instrumento que utilizarás para evaluar esta actividad.</p>
        </div>
      </div>

      {instrumentType ? <div className="border-y border-border bg-muted/10 px-4 py-3"><div className="grid items-end gap-2 sm:grid-cols-[minmax(0,1fr)_auto]"><label className="block text-xs font-black text-muted-foreground">Título del instrumento<Input className="mt-1.5 h-10 bg-card" value={fields[instrumentFieldKey(instrumentType, 'title')] ?? ''} onChange={(event) => updateField(instrumentFieldKey(instrumentType, 'title'), event.target.value)} placeholder={`Ej. ${title} para la actividad`} /></label><Button type="button" variant="outline" className="h-10" onClick={() => setShowInstrumentPreview(true)}><Eye className="size-4" />Vista previa</Button></div><div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-5"><InstrumentSummaryItem label="Actividad" value={`${maxScore} puntos`} /><InstrumentSummaryItem label={instrumentType === 'escala' ? 'Indicadores' : 'Criterios'} value={String(criterionCount)} /><InstrumentSummaryItem label={instrumentType === 'lista-ponderada' ? 'Ponderación actual' : 'Niveles'} value={instrumentType === 'lista-ponderada' ? `${configuredValue}/100 %` : instrumentType === 'rubrica' ? String(rubricLevels) : instrumentType === 'escala' ? String(scaleLevels) : 'No aplica'} good={instrumentType === 'lista-ponderada' ? configuredMatches : undefined} /><InstrumentSummaryItem label="Puntuación configurada" value={instrumentType === 'lista-ponderada' ? `${maxScore}/${maxScore} pts` : `${configuredValue}/${maxScore} pts`} good={configuredMatches} /><InstrumentSummaryItem label="Estado" value={isComplete ? 'Listo para revisar' : configuredMatches ? 'Faltan contenidos' : `Faltan ${formatInstrumentNumber(Math.max(0, configuredTarget - configuredValue))}${instrumentType === 'lista-ponderada' ? '%' : ' pts'}`} good={isComplete} /></div></div> : null}

      <div className={cn('p-4', instrumentTypographyClass(instrumentType, fields))}>
        {instrumentType === 'rubrica' ? (
          <RubricInstrument
            criteriaCount={rubricCriteria}
            fields={fields}
            levelCount={rubricLevels}
            maxScore={maxScore}
            accent={accent}
            onFieldChange={updateField}
            onCriteriaCountChange={setRubricCriteria}
            onFieldsChange={onFieldsChange}
            onLevelCountChange={setRubricLevels}
            typographyControls={typographyControls}
          />
        ) : null}
        {instrumentType === 'escala' ? (
          <ScaleInstrument
            criteriaCount={scaleCriteria}
            fields={fields}
            levelCount={scaleLevels}
            maxScore={maxScore}
            accent={accent}
            onFieldsChange={onFieldsChange}
            onFieldChange={updateField}
            onCriteriaCountChange={setScaleCriteria}
            onLevelCountChange={setScaleLevels}
            typographyControls={typographyControls}
          />
        ) : null}
        {instrumentType === 'lista-cotejo' ? (
          <ChecklistInstrument
            criteriaCount={checklistCriteria}
            fields={fields}
            maxScore={maxScore}
            accent={accent}
            onFieldsChange={onFieldsChange}
            onFieldChange={updateField}
            onCriteriaCountChange={setChecklistCriteria}
            typographyControls={typographyControls}
          />
        ) : null}
        {instrumentType === 'lista-ponderada' ? (
          <WeightedListInstrument
            criteriaCount={weightedCriteria}
            fields={fields}
            hasPartial={weightedHasPartial}
            maxScore={maxScore}
            accent={accent}
            onFieldsChange={onFieldsChange}
            onFieldChange={updateField}
            onCriteriaCountChange={setWeightedCriteria}
            onHasPartialChange={setWeightedHasPartial}
            typographyControls={typographyControls}
          />
        ) : null}
        {!instrumentType ? <EmptyInstrumentState /> : null}
      </div>
      {showInstrumentPreview ? <InstrumentPreviewModal accent={accent} activityName={activityName} block={block} fields={fields} instrumentType={instrumentType} maxScore={maxScore} onClose={() => setShowInstrumentPreview(false)} /> : null}
    </section>
  )
}

function formatInstrumentNumber(value: number) {
  if (!Number.isFinite(value)) return '—'
  return Number(value.toFixed(2)).toLocaleString('es-DO', { maximumFractionDigits: 2 })
}

function instrumentConfiguredValue(type: string, fields: Record<string, string>, count: number) {
  const field = type === 'lista-ponderada' ? 'weight' : 'points'
  return Number(Array.from({ length: count }, (_, index) => Number(fields[instrumentFieldKey(type, field, index)] || 0)).reduce((sum, value) => sum + value, 0).toFixed(2))
}

function InstrumentSummaryItem({ good, label, value }: { good?: boolean; label: string; value: string }) {
  return <div className="rounded-lg border border-border bg-card px-3 py-2"><p className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground">{label}</p><p className={cn('mt-1 truncate text-sm font-black', good === true ? 'text-emerald-700' : good === false ? 'text-amber-700' : 'text-foreground')}>{value}{good ? <CheckCircle2 className="ml-1 inline size-3.5" /> : null}</p></div>
}

type InstrumentTextSize = 'compact' | 'normal' | 'large'
type InstrumentTextAlign = 'left' | 'center' | 'right'

function instrumentTextSize(type: string | undefined, fields: Record<string, string>): InstrumentTextSize {
  const value = type ? fields[`${type}:meta:textSize`] : undefined
  return value === 'compact' || value === 'large' ? value : 'normal'
}

function instrumentTypographyClass(type: string | undefined, fields: Record<string, string>) {
  const textSize = instrumentTextSize(type, fields)
  const bold = Boolean(type && fields[`${type}:meta:bold`] === 'true')
  const textAlign = instrumentTextAlign(type, fields)
  return cn(
    textSize === 'compact' ? '[&_input]:text-xs [&_table]:text-xs [&_textarea]:h-14 [&_textarea]:text-xs' : '',
    textSize === 'normal' ? '[&_input]:text-sm [&_table]:text-sm [&_textarea]:h-16 [&_textarea]:text-sm' : '',
    textSize === 'large' ? '[&_input]:text-base [&_table]:text-base [&_textarea]:h-20 [&_textarea]:text-base [&_textarea]:leading-6' : '',
    bold ? '[&_input]:font-semibold [&_td]:font-semibold [&_textarea]:font-semibold' : '',
    textAlign === 'left' ? '[&_input]:text-left [&_td]:text-left [&_th]:text-left [&_textarea]:text-left' : '',
    textAlign === 'center' ? '[&_input]:text-center [&_td]:text-center [&_th]:text-center [&_textarea]:text-center' : '',
    textAlign === 'right' ? '[&_input]:text-right [&_td]:text-right [&_th]:text-right [&_textarea]:text-right' : '',
  )
}

function instrumentTextAlign(type: string | undefined, fields: Record<string, string>): InstrumentTextAlign {
  const value = type ? fields[`${type}:meta:textAlign`] : undefined
  return value === 'center' || value === 'right' ? value : 'left'
}

function InstrumentTypographyControls({ bold, onBoldChange, onTextAlignChange, onTextSizeChange, textAlign, textSize }: { bold: boolean; onBoldChange: (value: boolean) => void; onTextAlignChange: (value: InstrumentTextAlign) => void; onTextSizeChange: (value: InstrumentTextSize) => void; textAlign: InstrumentTextAlign; textSize: InstrumentTextSize }) {
  const sizes: Array<{ label: string; title: string; value: InstrumentTextSize }> = [
    { label: 'A−', title: 'Texto compacto', value: 'compact' },
    { label: 'A', title: 'Texto normal', value: 'normal' },
    { label: 'A+', title: 'Texto grande', value: 'large' },
  ]
  const alignments: Array<{ icon: ReactNode; label: string; value: InstrumentTextAlign }> = [
    { icon: <AlignLeft className="size-4" />, label: 'Alinear a la izquierda', value: 'left' },
    { icon: <AlignCenter className="size-4" />, label: 'Centrar', value: 'center' },
    { icon: <AlignRight className="size-4" />, label: 'Alinear a la derecha', value: 'right' },
  ]
  return <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1 shadow-sm">{sizes.map((item) => <button key={item.value} type="button" title={item.title} aria-label={item.title} aria-pressed={textSize === item.value} className={cn('grid h-7 min-w-8 place-items-center rounded-md px-1.5 text-xs font-black transition hover:bg-primary/10 hover:text-primary', textSize === item.value ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground')} onClick={() => onTextSizeChange(item.value)}>{item.label}</button>)}<span className="mx-0.5 h-5 w-px bg-border" /><button type="button" title="Alternar negrita" aria-label="Alternar negrita" aria-pressed={bold} className={cn('grid size-7 place-items-center rounded-md text-sm font-black transition hover:bg-primary/10 hover:text-primary', bold ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground')} onClick={() => onBoldChange(!bold)}>B</button><span className="mx-0.5 h-5 w-px bg-border" />{alignments.map((item) => <button key={item.value} type="button" title={item.label} aria-label={item.label} aria-pressed={textAlign === item.value} className={cn('grid size-7 place-items-center rounded-md transition hover:bg-primary/10 hover:text-primary', textAlign === item.value ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground')} onClick={() => onTextAlignChange(item.value)}>{item.icon}</button>)}</div>
}

type RubricLevelDraft = { id: string; sourceScore: number | null; name: string; points: number }
type RubricPointMode = 'automatic' | 'manual'

const rubricLevelPalette = [
  { background: '#059669', border: '#047857', foreground: '#ffffff', soft: '#d1fae5' },
  { background: '#22b87a', border: '#10a369', foreground: '#ffffff', soft: '#dcfce7' },
  { background: '#72cf78', border: '#4fbd65', foreground: '#123524', soft: '#e8f8d8' },
  { background: '#c7df72', border: '#aacb52', foreground: '#334019', soft: '#f2f8cf' },
  { background: '#f6c453', border: '#e9a92c', foreground: '#51350b', soft: '#fff4c7' },
  { background: '#f59e0b', border: '#df8305', foreground: '#4a2703', soft: '#ffebbd' },
]

function rubricLevelVisual(index: number, count: number) {
  const paletteIndex = count <= 1 ? 0 : Math.round(index * (rubricLevelPalette.length - 1) / (count - 1))
  return rubricLevelPalette[Math.min(rubricLevelPalette.length - 1, Math.max(0, paletteIndex))]
}

function automaticRubricLevelDrafts(drafts: RubricLevelDraft[], maximum: number) {
  const points = defaultRubricLevelPoints(maximum, drafts.length)
  return drafts.map((draft, index) => ({ ...draft, points: points[index] ?? 0 }))
}

function InstrumentSettingsDrawer({ accent, applyButtonClassName, applyDisabled = false, children, description, onApply, onClose, panelClassName, title }: { accent: (typeof blockAccents)[number]; applyButtonClassName?: string; applyDisabled?: boolean; children: ReactNode; description: string; onApply: () => void; onClose: () => void; panelClassName?: string; title: string }) {
  const panelRef = useRef<HTMLDivElement>(null)
  useFocusTrap({ ref: panelRef, active: true, onEscape: onClose })
  return <div className="fixed inset-0 z-50 bg-slate-950/35 motion-safe:animate-[fadeIn_200ms_ease-out]" role="presentation"><div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="instrument-settings-title" className={cn('ml-auto flex h-full w-full flex-col border-l border-border bg-card shadow-2xl motion-safe:animate-[slideInRight_250ms_ease-out]', panelClassName || 'max-w-[34rem]')}><div className="h-1 shrink-0" style={{ background: accent.gradient }} /><header className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-5 py-4"><div><h3 id="instrument-settings-title" className="text-lg font-black text-foreground">{title}</h3><p className="mt-1 text-sm leading-5 text-muted-foreground">{description}</p></div><Button type="button" variant="ghost" size="icon" aria-label="Cerrar configuración" onClick={onClose}><X className="size-5" /></Button></header><div className="min-h-0 flex-1 overflow-y-auto p-5">{children}</div><footer className="flex shrink-0 justify-end gap-3 border-t border-border bg-card px-5 py-4"><Button type="button" variant="outline" onClick={onClose}>Cancelar</Button><Button type="button" className={applyButtonClassName || accent.button} disabled={applyDisabled} onClick={onApply}>Aplicar cambios</Button></footer></div></div>
}

function InstrumentPreviewModal({ accent, activityName, block, fields, instrumentType, maxScore, onClose }: { accent: (typeof blockAccents)[number]; activityName: string; block: (typeof competencyBlocks)[number]; fields: Record<string, string>; instrumentType: string; maxScore: number; onClose: () => void }) {
  const title = fields[instrumentFieldKey(instrumentType, 'title')] || instrumentTitle(instrumentType)
  const criteriaCount = Number(fields[`${instrumentType}:meta:criteriaCount`]) || inferInstrumentCount(fields, instrumentType, 'criterion', 0)
  const levelCount = instrumentType === 'rubrica' ? Number(fields['rubrica:meta:levelCount']) || inferRubricLevels(fields, 0) : instrumentType === 'escala' ? Number(fields['escala:meta:levelCount']) || 0 : 0
  return <Modal title={`Vista previa de ${instrumentTitle(instrumentType).toLocaleLowerCase()}`} onClose={onClose} className="max-h-[90vh] max-w-[94vw] rounded-xl" hideHeader><div className="flex max-h-[90vh] flex-col"><div className="h-1.5 shrink-0" style={{ background: accent.gradient }} /><header className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-6 py-4"><div><p className={cn('text-xs font-black uppercase tracking-[0.14em]', accent.text)}>Vista previa · Solo lectura</p><h3 className="mt-1 text-xl font-black text-foreground">{title}</h3><p className="mt-1 text-sm text-muted-foreground">Actividad: {activityName || 'Sin nombre'} · {block.shortName} · {maxScore} puntos · {criteriaCount} {instrumentType === 'escala' ? 'indicadores' : 'criterios'}{levelCount ? ` · ${levelCount} niveles` : ''}</p></div><Button type="button" variant="ghost" size="icon" aria-label="Cerrar vista previa" onClick={onClose}><X className="size-5" /></Button></header><div className="min-h-0 flex-1 overflow-auto bg-muted/10 p-6"><ReadOnlyInstrument type={instrumentType} fields={fields} maxScore={maxScore} accent={accent} /></div><footer className="flex shrink-0 justify-end border-t border-border bg-card px-6 py-4"><Button type="button" className={accent.button} onClick={onClose}>Volver a editar</Button></footer></div></Modal>
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

function setDragDocumentState(active: boolean) {
  document.documentElement.style.cursor = active ? 'grabbing' : ''
  document.body.style.userSelect = active ? 'none' : ''
}

function RubricLevelSettingsDrawer({
  accent,
  criteriaCount,
  drafts,
  fields,
  maxScore,
  onAdd,
  onApply,
  onClose,
  onDraftsChange,
  onRequestDelete,
  pointMode,
  scoreMatches,
  setPointMode,
  total,
}: {
  accent: (typeof blockAccents)[number]
  criteriaCount: number
  drafts: RubricLevelDraft[]
  fields: Record<string, string>
  maxScore: number
  onAdd: () => void
  onApply: () => void
  onClose: () => void
  onDraftsChange: Dispatch<SetStateAction<RubricLevelDraft[]>>
  onRequestDelete: (draft: RubricLevelDraft) => void
  pointMode: RubricPointMode
  scoreMatches: boolean
  setPointMode: Dispatch<SetStateAction<RubricPointMode>>
  total: number
}) {
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragTargetIndex, setDragTargetIndex] = useState<number | null>(null)
  const [dragPreviewHeight, setDragPreviewHeight] = useState(66)
  const levelListRef = useRef<HTMLDivElement>(null)
  const dragPreviewRef = useRef<HTMLElement | null>(null)
  const pointerDragRef = useRef<{ id: string; offsetY: number; pointerId: number; targetIndex: number } | null>(null)
  const criterionMaximum = criterionPointsMaximum(fields, criteriaCount, maxScore)

  useEffect(() => () => {
    dragPreviewRef.current?.remove()
    setDragDocumentState(false)
  }, [])

  function normalizeDrafts(next: RubricLevelDraft[]) {
    return pointMode === 'automatic' ? automaticRubricLevelDrafts(next, criterionMaximum) : next
  }

  function reorderDrafts(sourceId: string, targetId: string) {
    if (sourceId === targetId) return
    onDraftsChange((current) => {
      const sourceIndex = current.findIndex((item) => item.id === sourceId)
      const targetIndex = current.findIndex((item) => item.id === targetId)
      if (sourceIndex < 0 || targetIndex < 0) return current
      const next = [...current]
      const [moved] = next.splice(sourceIndex, 1)
      next.splice(targetIndex, 0, moved)
      return normalizeDrafts(next)
    })
  }

  function moveDraftWithKeyboard(index: number, direction: -1 | 1) {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= drafts.length) return
    reorderDrafts(drafts[index].id, drafts[targetIndex].id)
  }

  function setMode(mode: RubricPointMode) {
    setPointMode(mode)
    if (mode === 'automatic') onDraftsChange((current) => automaticRubricLevelDrafts(current, criterionMaximum))
  }

  function cleanupPointerDrag() {
    dragPreviewRef.current?.remove()
    dragPreviewRef.current = null
    pointerDragRef.current = null
    setDragDocumentState(false)
    setDraggedId(null)
    setDragTargetIndex(null)
  }

  function finishPointerDrag(cancelled = false) {
    const drag = pointerDragRef.current
    if (drag && !cancelled) {
      onDraftsChange((current) => {
        const source = current.find((item) => item.id === drag.id)
        if (!source) return current
        const remaining = current.filter((item) => item.id !== drag.id)
        const targetIndex = Math.min(remaining.length, Math.max(0, drag.targetIndex))
        remaining.splice(targetIndex, 0, source)
        return normalizeDrafts(remaining)
      })
    }
    cleanupPointerDrag()
  }

  useEffect(() => {
    if (!draggedId) return

    function handlePointerMove(event: PointerEvent) {
      const drag = pointerDragRef.current
      const list = levelListRef.current
      const preview = dragPreviewRef.current
      if (!drag || !list || !preview || event.pointerId !== drag.pointerId) return
      event.preventDefault()

      const listBounds = list.getBoundingClientRect()
      const previewHeight = preview.getBoundingClientRect().height
      const top = Math.min(listBounds.bottom - previewHeight, Math.max(listBounds.top, event.clientY - drag.offsetY))
      preview.style.top = `${top}px`

      const cards = Array.from(list.querySelectorAll<HTMLElement>('[data-rubric-sort-card]'))
      let targetIndex = cards.length
      for (let index = 0; index < cards.length; index += 1) {
        const bounds = cards[index].getBoundingClientRect()
        if (event.clientY < bounds.top + bounds.height / 2) {
          targetIndex = index
          break
        }
      }
      if (targetIndex !== drag.targetIndex) {
        drag.targetIndex = targetIndex
        setDragTargetIndex(targetIndex)
      }
    }

    function handlePointerUp(event: PointerEvent) {
      if (event.pointerId === pointerDragRef.current?.pointerId) finishPointerDrag(false)
    }

    function handlePointerCancel(event: PointerEvent) {
      if (event.pointerId === pointerDragRef.current?.pointerId) finishPointerDrag(true)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: false })
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerCancel)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerCancel)
    }
  }, [draggedId, finishPointerDrag])

  function startPointerDrag(event: ReactPointerEvent<HTMLButtonElement>, level: RubricLevelDraft) {
    if (event.button !== 0) return
    const card = event.currentTarget.closest<HTMLElement>('[data-rubric-level-card]')
    if (!card) return
    event.preventDefault()

    dragPreviewRef.current?.remove()
    const preview = card.cloneNode(true) as HTMLElement
    const bounds = card.getBoundingClientRect()
    setDragPreviewHeight(bounds.height)
    preview.removeAttribute('data-rubric-level-card')
    preview.querySelectorAll<HTMLElement>('button, input').forEach((element) => { element.tabIndex = -1 })
    Object.assign(preview.style, {
      background: '#ffffff',
      borderColor: rubricLevelVisual(drafts.findIndex((draft) => draft.id === level.id), drafts.length).border,
      boxShadow: '0 22px 50px rgba(15, 23, 42, 0.28)',
      left: `${bounds.left}px`,
      margin: '0',
      opacity: '1',
      pointerEvents: 'none',
      position: 'fixed',
      top: `${bounds.top}px`,
      transform: 'scale(1.015)',
      transformOrigin: 'center',
      transition: 'box-shadow 160ms ease, transform 160ms ease',
      width: `${bounds.width}px`,
      willChange: 'top',
      zIndex: '9999',
    })
    document.body.appendChild(preview)
    dragPreviewRef.current = preview
    const sourceIndex = drafts.findIndex((draft) => draft.id === level.id)
    pointerDragRef.current = { id: level.id, offsetY: event.clientY - bounds.top, pointerId: event.pointerId, targetIndex: sourceIndex }
    setDragDocumentState(true)
    setDragTargetIndex(sourceIndex)
    setDraggedId(level.id)
  }

  const renderedDrafts: Array<RubricLevelDraft | null> = draggedId
    ? drafts.filter((draft) => draft.id !== draggedId)
    : [...drafts]
  if (draggedId) renderedDrafts.splice(Math.min(renderedDrafts.length, Math.max(0, dragTargetIndex ?? 0)), 0, null)

  return (
    <InstrumentSettingsDrawer
      accent={accent}
      applyButtonClassName="bg-blue-700 text-white shadow-md shadow-blue-700/20 hover:bg-blue-800"
      title="Configurar niveles de desempeño"
      description="Personaliza los niveles, su orden y las puntuaciones utilizadas en esta rúbrica."
      onClose={onClose}
      onApply={onApply}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2 rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-100 via-teal-50 to-blue-100 p-2.5 shadow-sm">
          <InstrumentSummaryItem label="Niveles" value={String(drafts.length)} />
          <InstrumentSummaryItem label="Actividad" value={`${maxScore} puntos`} />
          <InstrumentSummaryItem label="Criterios" value={String(criteriaCount)} />
          <InstrumentSummaryItem label="Puntuación total" value={`${total}/${maxScore} pts`} good={scoreMatches} />
        </div>

        <div>
          <p className="mb-1.5 text-xs font-black text-foreground">Distribución de puntuaciones</p>
          <div className="grid max-w-60 grid-cols-2 overflow-hidden rounded-lg border border-border bg-muted/20 p-0.5" role="group" aria-label="Distribución de puntuaciones">
            {(['automatic', 'manual'] as const).map((mode) => {
              const selected = pointMode === mode
              return <button key={mode} type="button" aria-pressed={selected} className={cn('flex h-8 items-center justify-center gap-1.5 rounded-md text-xs font-black transition', selected ? 'bg-emerald-600 text-white shadow-sm' : 'text-muted-foreground hover:bg-card')} onClick={() => setMode(mode)}>{mode === 'automatic' ? 'Automática' : 'Manual'}{selected ? <CheckCircle2 className="size-3.5" /> : null}</button>
            })}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black text-foreground">Orden de mayor a menor desempeño</p>
              <p className="text-[11px] text-muted-foreground">Arrastra cada nivel desde el controlador de puntos.</p>
            </div>
            <Button type="button" size="sm" variant="outline" disabled={drafts.length >= 6} onClick={onAdd}><Plus className="size-4" />Agregar nivel</Button>
          </div>
          <div ref={levelListRef} className="space-y-1.5">
            {renderedDrafts.map((level, index) => {
              if (!level) {
                return <div key="rubric-level-placeholder" aria-hidden="true" className="grid place-items-center rounded-xl border-2 border-dashed border-emerald-400 bg-emerald-50/80 text-[11px] font-black text-emerald-700 shadow-inner transition-all duration-200" style={{ height: `${dragPreviewHeight}px` }}>Suelta aquí</div>
              }
              const visual = rubricLevelVisual(index, drafts.length)
              const keyboardIndex = drafts.findIndex((draft) => draft.id === level.id)
              return (
                <div
                  key={level.id}
                  data-rubric-level-card
                  data-rubric-sort-card
                  className="relative grid grid-cols-[1.75rem_1.75rem_minmax(0,1fr)_5.5rem_2rem] items-center gap-2 rounded-xl border bg-card px-2.5 py-2 shadow-sm transition-all duration-200"
                  style={{ borderColor: visual.border }}
                >
                  <button
                    type="button"
                    aria-label={`Arrastrar nivel ${level.name}. Usa flecha arriba o abajo para reordenar con el teclado.`}
                    className="grid size-7 touch-none cursor-grab place-items-center rounded-md text-slate-400 hover:bg-muted hover:text-slate-700 active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    onPointerDown={(event) => startPointerDrag(event, level)}
                    onKeyDown={(event) => { if (event.key === 'ArrowUp') { event.preventDefault(); moveDraftWithKeyboard(keyboardIndex, -1) } else if (event.key === 'ArrowDown') { event.preventDefault(); moveDraftWithKeyboard(keyboardIndex, 1) } }}
                  >
                    <GripVertical className="size-4" />
                  </button>
                  <span className="grid size-6 place-items-center rounded-full text-[11px] font-black" style={{ backgroundColor: visual.background, color: visual.foreground }}>{index + 1}</span>
                  <label className="min-w-0 text-[10px] font-bold text-muted-foreground">Nombre<Input className="mt-0.5 h-8 px-2 text-sm font-bold" value={level.name} onChange={(event) => onDraftsChange((current) => current.map((item) => item.id === level.id ? { ...item, name: event.target.value } : item))} /></label>
                  <label className="text-[10px] font-bold leading-3 text-muted-foreground">Puntos<Input className="mt-0.5 h-8 px-2 text-sm font-black" type="number" min={0} step="0.25" disabled={pointMode === 'automatic'} value={level.points} onChange={(event) => onDraftsChange((current) => current.map((item) => item.id === level.id ? { ...item, points: Number(event.target.value) } : item))} /></label>
                  <button type="button" aria-label={`Eliminar nivel ${level.name}`} disabled={drafts.length <= 2} className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-red-50 hover:text-destructive disabled:opacity-30" onClick={() => onRequestDelete(level)}><Trash2 className="size-4" /></button>
                </div>
              )
            })}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">Vista previa de encabezados</p>
          <div className="grid overflow-hidden rounded-lg border border-border shadow-sm" style={{ gridTemplateColumns: `repeat(${Math.max(1, drafts.length)}, minmax(0, 1fr))` }}>
            {drafts.map((level, index) => {
              const visual = rubricLevelVisual(index, drafts.length)
              return <div key={level.id} className="border-r px-2 py-2 text-center last:border-r-0" style={{ backgroundColor: visual.background, borderColor: visual.border, color: visual.foreground }}><p className="truncate text-[10px] font-black uppercase">{level.name || `Nivel ${index + 1}`}</p><p className="mt-0.5 text-[10px] font-bold opacity-80">{level.points} pts</p></div>
            })}
          </div>
        </div>
      </div>
    </InstrumentSettingsDrawer>
  )
}

function RubricInstrument({
  accent,
  criteriaCount,
  fields,
  levelCount,
  maxScore,
  onFieldChange,
  onCriteriaCountChange,
  onFieldsChange,
  onLevelCountChange,
  typographyControls,
}: {
  accent: (typeof blockAccents)[number]
  criteriaCount: number
  fields: Record<string, string>
  levelCount: number
  maxScore: number
  onFieldChange: (key: string, value: string) => void
  onCriteriaCountChange: (value: number) => void
  onFieldsChange: (fields: Record<string, string>) => void
  onLevelCountChange: (value: number) => void
  typographyControls: ReactNode
}) {
  const [editingLevels, setEditingLevels] = useState(false)
  const [levelDrafts, setLevelDrafts] = useState<RubricLevelDraft[]>([])
  const [levelPointMode, setLevelPointMode] = useState<RubricPointMode>('automatic')
  const [pendingCriterionDelete, setPendingCriterionDelete] = useState<number | null>(null)
  const [pendingLevelDelete, setPendingLevelDelete] = useState<number | null>(null)
  const [pendingDraftLevelDelete, setPendingDraftLevelDelete] = useState<string | null>(null)
  const [highlightedRow, setHighlightedRow] = useState<number | null>(null)
  const levels = Array.from({ length: levelCount }, (_, index) => {
    const score = levelCount - index
    return {
      score,
      name: fields[instrumentFieldKey('rubrica', 'level-name', score)] || rubricDefaultLevelNames(levelCount)[index],
      points: Number(fields[instrumentFieldKey('rubrica', 'level-points', score)] || defaultRubricLevelPoints(criterionPointsMaximum(fields, criteriaCount, maxScore), levelCount)[index]),
    }
  })
  const criterionPoints = Array.from({ length: criteriaCount }, (_, index) => Number(fields[instrumentFieldKey('rubrica', 'points', index)] || 0))
  const total = Number(criterionPoints.reduce((sum, points) => sum + (Number.isFinite(points) ? points : 0), 0).toFixed(2))
  const scoreMatches = Math.abs(total - maxScore) < 0.001

  function resizeCriteria(nextCount: number) {
    const next: Record<string, string> = { ...fields, 'rubrica:meta:criteriaCount': String(nextCount) }
    distributeScore(maxScore, nextCount).forEach((points, index) => { next[instrumentFieldKey('rubrica', 'points', index)] = String(points) })
    if (nextCount < criteriaCount) {
      Object.keys(next).forEach((key) => {
        const match = key.match(/^rubrica:(criterion|descriptor|points):(\d+)/)
        if (match && Number(match[2]) >= nextCount) delete next[key]
      })
    }
    onFieldsChange(next)
    onCriteriaCountChange(nextCount)
    if (nextCount > criteriaCount) focusNewInstrumentRow('rubrica', nextCount - 1, setHighlightedRow)
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
    distributeScore(maxScore, nextCount).forEach((points, index) => { next[instrumentFieldKey('rubrica', 'points', index)] = String(points) })
    next['rubrica:meta:criteriaCount'] = String(nextCount)
    onFieldsChange(next)
    onCriteriaCountChange(nextCount)
  }

  function requestRemoveCriterion(index: number) {
    const hasContent = Boolean(fields[instrumentFieldKey('rubrica', 'criterion', index)]?.trim()) || Array.from({ length: levelCount }, (_, levelIndex) => levelCount - levelIndex).some((score) => fields[instrumentFieldKey('rubrica', 'descriptor', index, score)]?.trim())
    if (hasContent) setPendingCriterionDelete(index)
    else removeCriterion(index)
  }

  function moveCriterion(from: number, to: number) {
    if (to < 0 || to >= criteriaCount || from === to) return
    const next = { ...fields }
    const fieldNames = ['criterion', 'points']
    for (let score = 1; score <= levelCount; score += 1) fieldNames.push(`descriptor:${score}`)
    fieldNames.forEach((fieldName) => {
      const [field, score] = fieldName.split(':')
      const fromKey = score ? instrumentFieldKey('rubrica', field, from, score) : instrumentFieldKey('rubrica', field, from)
      const toKey = score ? instrumentFieldKey('rubrica', field, to, score) : instrumentFieldKey('rubrica', field, to)
      const temp = next[fromKey] ?? ''
      next[fromKey] = next[toKey] ?? ''
      next[toKey] = temp
    })
    onFieldsChange(next)
  }

  function duplicateCriterion(index: number) {
    if (criteriaCount >= 12) return
    const nextCount = criteriaCount + 1
    const next: Record<string, string> = { ...fields, 'rubrica:meta:criteriaCount': String(nextCount) }
    next[instrumentFieldKey('rubrica', 'criterion', criteriaCount)] = fields[instrumentFieldKey('rubrica', 'criterion', index)] ? `${fields[instrumentFieldKey('rubrica', 'criterion', index)]} (copia)` : ''
    for (let score = 1; score <= levelCount; score += 1) next[instrumentFieldKey('rubrica', 'descriptor', criteriaCount, score)] = fields[instrumentFieldKey('rubrica', 'descriptor', index, score)] || ''
    distributeScore(maxScore, nextCount).forEach((points, row) => { next[instrumentFieldKey('rubrica', 'points', row)] = String(points) })
    onFieldsChange(next)
    onCriteriaCountChange(nextCount)
    focusNewInstrumentRow('rubrica', criteriaCount, setHighlightedRow)
  }

  function removeLevel(scoreToRemove: number) {
    if (levelCount <= 2) return
    const remaining = levels.filter((level) => level.score !== scoreToRemove)
    const nextCount = levelCount - 1
    const next: Record<string, string> = { ...fields, 'rubrica:meta:levelCount': String(nextCount), 'rubrica:meta:customLevelPoints': 'true' }
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
    distributeScore(maxScore, criteriaCount).forEach((points, index) => { next[instrumentFieldKey('rubrica', 'points', index)] = String(points) })
    onFieldsChange(next)
    onLevelCountChange(nextCount)
  }

  function requestRemoveLevel(score: number) {
    const descriptorCount = Array.from({ length: criteriaCount }, (_, index) => fields[instrumentFieldKey('rubrica', 'descriptor', index, score)]?.trim()).filter(Boolean).length
    if (descriptorCount > 0) setPendingLevelDelete(score)
    else removeLevel(score)
  }

  function openLevelEditor() {
    const mode = fields['rubrica:meta:customLevelPoints'] === 'true' ? 'manual' : 'automatic'
    const drafts = levels.map((level) => ({ id: `level-${level.score}`, sourceScore: level.score, name: level.name, points: level.points }))
    setLevelPointMode(mode)
    setLevelDrafts(mode === 'automatic' ? automaticRubricLevelDrafts(drafts, criterionPointsMaximum(fields, criteriaCount, maxScore)) : drafts)
    setEditingLevels(true)
  }

  function addLevelDraft() {
    if (levelDrafts.length >= 6) return
    const names = rubricDefaultLevelNames(levelDrafts.length + 1)
    const used = new Set(levelDrafts.map((level) => level.name.trim().toLocaleLowerCase()))
    const name = names.find((candidate) => !used.has(candidate.toLocaleLowerCase())) || `Nivel ${levelDrafts.length + 1}`
    const nextPoints = defaultRubricLevelPoints(criterionPointsMaximum(fields, criteriaCount, maxScore), levelDrafts.length + 1)
    const targetIndex = Math.max(0, names.indexOf(name))
    setLevelDrafts((current) => {
      const insertAt = current.findIndex((level) => { const canonicalIndex = names.findIndex((candidate) => candidate.toLocaleLowerCase() === level.name.trim().toLocaleLowerCase()); return canonicalIndex >= 0 && canonicalIndex > targetIndex })
      const next = [...current]
      next.splice(insertAt < 0 ? next.length : insertAt, 0, { id: `new-${Date.now()}`, sourceScore: null, name, points: nextPoints[targetIndex] ?? 1 })
      return levelPointMode === 'automatic' ? automaticRubricLevelDrafts(next, criterionPointsMaximum(fields, criteriaCount, maxScore)) : next
    })
  }

  function removeLevelDraftById(id: string) {
    setLevelDrafts((current) => {
      const next = current.filter((item) => item.id !== id)
      return levelPointMode === 'automatic' ? automaticRubricLevelDrafts(next, criterionPointsMaximum(fields, criteriaCount, maxScore)) : next
    })
  }

  function applyLevelDrafts() {
    const nextCount = levelDrafts.length
    const next: Record<string, string> = { ...fields, 'rubrica:meta:levelCount': String(nextCount), 'rubrica:meta:customLevelPoints': String(levelPointMode === 'manual') }
    Object.keys(next).forEach((key) => { if (/^rubrica:level-(?:name|points):\d+$/.test(key) || /^rubrica:descriptor:\d+:\d+$/.test(key)) delete next[key] })
    levelDrafts.forEach((level, index) => {
      const newScore = nextCount - index
      next[instrumentFieldKey('rubrica', 'level-name', newScore)] = level.name.trim() || rubricDefaultLevelNames(nextCount)[index]
      next[instrumentFieldKey('rubrica', 'level-points', newScore)] = String(level.points)
      for (let criterionIndex = 0; criterionIndex < criteriaCount; criterionIndex += 1) next[instrumentFieldKey('rubrica', 'descriptor', criterionIndex, newScore)] = level.sourceScore === null ? '' : fields[instrumentFieldKey('rubrica', 'descriptor', criterionIndex, level.sourceScore)] || ''
    })
    onFieldsChange(next)
    onLevelCountChange(nextCount)
    setEditingLevels(false)
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className={cn('font-black', accent.text)}>Criterios y niveles de desempeño</p>
          <p className="text-xs text-muted-foreground">La puntuación se redistribuye automáticamente para sumar {maxScore} puntos.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {typographyControls}
          <Button type="button" size="sm" variant="outline" onClick={openLevelEditor}><Settings className="size-4" />Configurar niveles</Button>
          <Button type="button" size="sm" className={accent.button} onClick={() => resizeCriteria(Math.min(12, criteriaCount + 1))} disabled={criteriaCount >= 12}><Plus className="size-4" />Agregar criterio</Button>
        </div>
      </div>

      {editingLevels ? (
        <RubricLevelSettingsDrawer
          accent={accent}
          criteriaCount={criteriaCount}
          drafts={levelDrafts}
          fields={fields}
          maxScore={maxScore}
          pointMode={levelPointMode}
          scoreMatches={scoreMatches}
          total={total}
          onAdd={addLevelDraft}
          onApply={applyLevelDrafts}
          onClose={() => setEditingLevels(false)}
          onDraftsChange={setLevelDrafts}
          setPointMode={setLevelPointMode}
          onRequestDelete={(level) => {
            const descriptors = level.sourceScore === null ? 0 : Array.from({ length: criteriaCount }, (_, row) => fields[instrumentFieldKey('rubrica', 'descriptor', row, level.sourceScore!)]?.trim()).filter(Boolean).length
            if (descriptors) setPendingDraftLevelDelete(level.id)
            else removeLevelDraftById(level.id)
          }}
        />
      ) : null}
      {pendingDraftLevelDelete ? <ConfirmDialog title="¿Eliminar este nivel?" description="Este nivel contiene descriptores. Si lo eliminas, también se eliminará esa información al aplicar los cambios." confirmLabel="Eliminar nivel" destructive onClose={() => setPendingDraftLevelDelete(null)} onConfirm={() => { removeLevelDraftById(pendingDraftLevelDelete); setPendingDraftLevelDelete(null) }} /> : null}

      <InstrumentTable>
        <thead className="sticky top-0 z-20 bg-slate-50 text-[10px] font-bold uppercase text-slate-700">
          <tr>
            <th className="sticky left-0 z-30 w-[24%] border border-border bg-slate-50 px-2 py-2">Criterios de evaluación</th>
            {levels.map((level, index) => {
              const visual = rubricLevelVisual(index, levels.length)
              return <th key={level.score} className="group relative border px-2 py-2 text-center" style={{ backgroundColor: visual.background, borderColor: visual.border, color: visual.foreground }}><span className="block pr-4 font-black">{level.name}</span><span className="mt-0.5 block pr-4 normal-case font-bold opacity-80">{level.points} pts</span><button type="button" aria-label={`Eliminar nivel ${level.name}`} title={levelCount <= 2 ? 'Debe haber al menos 2 niveles' : 'Eliminar nivel'} disabled={levelCount <= 2} className="absolute right-1 top-1 grid size-5 place-items-center rounded opacity-70 transition hover:bg-white/40 hover:text-destructive group-hover:opacity-100 disabled:hidden" onClick={() => requestRemoveLevel(level.score)}><X className="size-3" /></button></th>
            })}
            <th className="w-24 border border-border px-2 py-2 text-center">Puntaje por criterio</th>
            <th className="w-10 border border-border" />
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: criteriaCount }, (_, index) => (
            <tr key={index} className={cn('transition-colors motion-safe:duration-500', highlightedRow === index ? accent.panel : '')}>
              <td className="sticky left-0 z-10 border border-border bg-card p-1.5"><div className="flex items-start gap-1"><span className={cn('mt-1 grid size-6 shrink-0 place-items-center rounded-full text-[10px] font-black text-white', accent.progress)}>{index + 1}</span><InstrumentTextarea dataInstrumentRow={`rubrica-${index}`} placeholder="Criterio de evaluación" value={fields[instrumentFieldKey('rubrica', 'criterion', index)] ?? ''} onChange={(value) => onFieldChange(instrumentFieldKey('rubrica', 'criterion', index), value)} /></div></td>
              {levels.map((level) => <td key={level.score} className="border border-border p-1.5"><InstrumentTextarea value={fields[instrumentFieldKey('rubrica', 'descriptor', index, level.score)] ?? ''} onChange={(value) => onFieldChange(instrumentFieldKey('rubrica', 'descriptor', index, level.score), value)} /></td>)}
              <td className="border border-border px-2 py-3 text-center"><span className={cn('inline-flex min-w-14 items-center justify-center rounded-lg px-2 py-2 font-black', accent.panel, accent.text)}>{criterionPoints[index]} pts</span></td>
              <td className="border border-border text-center"><InstrumentRowMenu canMoveDown={index < criteriaCount - 1} canMoveUp={index > 0} onDelete={() => requestRemoveCriterion(index)} onDuplicate={() => duplicateCriterion(index)} onMoveDown={() => moveCriterion(index, index + 1)} onMoveUp={() => moveCriterion(index, index - 1)} /></td>
            </tr>
          ))}
        </tbody>
      </InstrumentTable>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">Los valores por criterio son automáticos y siempre conservan el total.</p>
        <div className="text-right"><p className={cn('text-sm font-black', scoreMatches ? 'text-emerald-600' : 'text-destructive')}>Puntuación máxima total: {total} / {maxScore} pts</p>{!scoreMatches ? <p className="mt-1 text-xs text-destructive">La puntuación no coincide con el valor de la actividad.</p> : null}</div>
      </div>
      {pendingCriterionDelete !== null ? <ConfirmDialog title="¿Eliminar este criterio?" description={`Se eliminará “${fields[instrumentFieldKey('rubrica', 'criterion', pendingCriterionDelete)] || `Criterio ${pendingCriterionDelete + 1}`}” junto con sus ${levelCount} descriptores asociados. Esta acción no se puede deshacer.`} confirmLabel="Eliminar criterio" destructive onClose={() => setPendingCriterionDelete(null)} onConfirm={() => { removeCriterion(pendingCriterionDelete); setPendingCriterionDelete(null) }} /> : null}
      {pendingLevelDelete !== null ? <ConfirmDialog title="¿Eliminar este nivel?" description={`Se eliminará “${fields[instrumentFieldKey('rubrica', 'level-name', pendingLevelDelete)] || 'este nivel'}” y todos sus descriptores asociados. Esta acción no se puede deshacer.`} confirmLabel="Eliminar nivel" destructive onClose={() => setPendingLevelDelete(null)} onConfirm={() => { removeLevel(pendingLevelDelete); setPendingLevelDelete(null) }} /> : null}
    </div>
  )
}
type ScaleLevelDraft = { id: string; name: string; points: number }
type ScalePointMode = 'automatic' | 'manual'

const scaleTemplateOptions = [
  { id: 'frecuencia', label: 'Frecuencia', description: 'Evalúa con qué regularidad se manifiesta una conducta.', summary: 'Siempre · Casi siempre · A veces · Nunca', icon: BarChart3 },
  { id: 'desempeno', label: 'Desempeño', description: 'Evalúa la calidad con que se ejecuta una tarea.', summary: 'Excelente · Bueno · Satisfactorio · Insuficiente', icon: Medal },
  { id: 'logro', label: 'Logro', description: 'Evalúa el grado de consecución de un aprendizaje.', summary: 'Logrado · En proceso · Inicial · No logrado', icon: Goal },
  { id: 'personalizada', label: 'Personalizada', description: 'Define libremente nombres, cantidad, orden y valores.', summary: 'Configuración completamente flexible', icon: PenLine },
] as const

function scaleLevelVisual(accent: (typeof blockAccents)[number], index: number, count: number) {
  const ratio = count <= 1 ? 0 : index / (count - 1)
  const backgroundStrength = Math.round(20 - ratio * 13)
  const borderStrength = Math.round(52 - ratio * 22)
  return {
    background: `color-mix(in srgb, ${accent.progressColor} ${backgroundStrength}%, white)`,
    border: `color-mix(in srgb, ${accent.progressColor} ${borderStrength}%, white)`,
    foreground: `color-mix(in srgb, ${accent.progressColor} 72%, #0f172a)`,
  }
}

function ScaleSettingsDrawer({
  accent,
  criteriaCount,
  fields,
  indicatorPoints,
  levelDrafts,
  maxScore,
  noApply,
  onAddLevel,
  onApply,
  onClose,
  onIndicatorPointsChange,
  onLevelsChange,
  onNoApplyChange,
  onPointModeChange,
  onTemplateSelect,
  pointMode,
  template,
}: {
  accent: (typeof blockAccents)[number]
  criteriaCount: number
  fields: Record<string, string>
  indicatorPoints: string[]
  levelDrafts: ScaleLevelDraft[]
  maxScore: number
  noApply: boolean
  onAddLevel: () => void
  onApply: () => void
  onClose: () => void
  onIndicatorPointsChange: Dispatch<SetStateAction<string[]>>
  onLevelsChange: Dispatch<SetStateAction<ScaleLevelDraft[]>>
  onNoApplyChange: (value: boolean) => void
  onPointModeChange: (value: ScalePointMode) => void
  onTemplateSelect: (value: string) => void
  pointMode: ScalePointMode
  template: string
}) {
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragTargetIndex, setDragTargetIndex] = useState<number | null>(null)
  const [dragPreviewHeight, setDragPreviewHeight] = useState(52)
  const listRef = useRef<HTMLDivElement>(null)
  const dragPreviewRef = useRef<HTMLElement | null>(null)
  const pointerDragRef = useRef<{ id: string; offsetY: number; pointerId: number; targetIndex: number } | null>(null)
  const automaticPoints = distributeScore(maxScore, criteriaCount)
  const configuredPoints = pointMode === 'automatic' ? automaticPoints : Array.from({ length: criteriaCount }, (_, index) => Number(indicatorPoints[index] || 0))
  const configuredTotal = Number(configuredPoints.reduce((sum, value) => sum + value, 0).toFixed(2))
  const levelNamesValid = levelDrafts.length >= 2 && levelDrafts.every((level) => level.name.trim())
  const levelPointsValid = levelDrafts.every((level) => Number.isFinite(level.points) && level.points >= 0)
  const levelOrderValid = levelDrafts.every((level, index) => index === 0 || levelDrafts[index - 1].points >= level.points)
  const duplicateLevelValues = new Set(levelDrafts.map((level) => level.points)).size !== levelDrafts.length
  const distributionValid = pointMode === 'automatic' || (configuredPoints.every((value) => Number.isFinite(value) && value >= 0) && Math.abs(configuredTotal - maxScore) < 0.001)
  const configurationValid = levelNamesValid && levelPointsValid && levelOrderValid && distributionValid
  const maximumLevel = Math.max(...levelDrafts.map((level) => level.points), 1)
  const sampleScore = Number(Array.from({ length: criteriaCount }, (_, index) => {
    const level = levelDrafts[index % Math.max(1, levelDrafts.length)]
    return level ? (level.points / maximumLevel) * (configuredPoints[index] || 0) : 0
  }).reduce((sum, value) => sum + value, 0).toFixed(2))

  useEffect(() => () => {
    dragPreviewRef.current?.remove()
    setDragDocumentState(false)
  }, [])

  function cleanupPointerDrag() {
    dragPreviewRef.current?.remove()
    dragPreviewRef.current = null
    pointerDragRef.current = null
    setDragDocumentState(false)
    setDraggedId(null)
    setDragTargetIndex(null)
  }

  function finishPointerDrag(cancelled = false) {
    const drag = pointerDragRef.current
    if (drag && !cancelled) {
      onLevelsChange((current) => {
        const source = current.find((level) => level.id === drag.id)
        if (!source) return current
        const remaining = current.filter((level) => level.id !== drag.id)
        remaining.splice(Math.min(remaining.length, Math.max(0, drag.targetIndex)), 0, source)
        return remaining
      })
    }
    cleanupPointerDrag()
  }

  useEffect(() => {
    if (!draggedId) return
    function handlePointerMove(event: PointerEvent) {
      const drag = pointerDragRef.current
      const list = listRef.current
      const preview = dragPreviewRef.current
      if (!drag || !list || !preview || event.pointerId !== drag.pointerId) return
      event.preventDefault()
      const listBounds = list.getBoundingClientRect()
      const previewHeight = preview.getBoundingClientRect().height
      preview.style.top = `${Math.min(listBounds.bottom - previewHeight, Math.max(listBounds.top, event.clientY - drag.offsetY))}px`
      const cards = Array.from(list.querySelectorAll<HTMLElement>('[data-scale-sort-card]'))
      let targetIndex = cards.length
      for (let index = 0; index < cards.length; index += 1) {
        const bounds = cards[index].getBoundingClientRect()
        if (event.clientY < bounds.top + bounds.height / 2) { targetIndex = index; break }
      }
      if (targetIndex !== drag.targetIndex) { drag.targetIndex = targetIndex; setDragTargetIndex(targetIndex) }
    }
    function handlePointerUp(event: PointerEvent) { if (event.pointerId === pointerDragRef.current?.pointerId) finishPointerDrag(false) }
    function handlePointerCancel(event: PointerEvent) { if (event.pointerId === pointerDragRef.current?.pointerId) finishPointerDrag(true) }
    window.addEventListener('pointermove', handlePointerMove, { passive: false })
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerCancel)
    return () => { window.removeEventListener('pointermove', handlePointerMove); window.removeEventListener('pointerup', handlePointerUp); window.removeEventListener('pointercancel', handlePointerCancel) }
  }, [draggedId, finishPointerDrag])

  function startPointerDrag(event: ReactPointerEvent<HTMLButtonElement>, level: ScaleLevelDraft) {
    if (event.button !== 0) return
    const card = event.currentTarget.closest<HTMLElement>('[data-scale-level-card]')
    if (!card) return
    event.preventDefault()
    const preview = card.cloneNode(true) as HTMLElement
    const bounds = card.getBoundingClientRect()
    setDragPreviewHeight(bounds.height)
    preview.removeAttribute('data-scale-level-card')
    preview.querySelectorAll<HTMLElement>('button, input').forEach((element) => { element.tabIndex = -1 })
    Object.assign(preview.style, { background: '#ffffff', borderColor: accent.progressColor, boxShadow: '0 22px 50px rgba(15, 23, 42, 0.25)', left: `${bounds.left}px`, margin: '0', opacity: '1', pointerEvents: 'none', position: 'fixed', top: `${bounds.top}px`, transform: 'scale(1.012)', width: `${bounds.width}px`, zIndex: '9999' })
    document.body.appendChild(preview)
    dragPreviewRef.current = preview
    const sourceIndex = levelDrafts.findIndex((item) => item.id === level.id)
    pointerDragRef.current = { id: level.id, offsetY: event.clientY - bounds.top, pointerId: event.pointerId, targetIndex: sourceIndex }
    setDragDocumentState(true)
    setDragTargetIndex(sourceIndex)
    setDraggedId(level.id)
  }

  function moveWithKeyboard(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= levelDrafts.length) return
    onLevelsChange((current) => { const next = [...current]; const [moved] = next.splice(index, 1); next.splice(target, 0, moved); return next })
  }

  const renderedLevels: Array<ScaleLevelDraft | null> = draggedId ? levelDrafts.filter((level) => level.id !== draggedId) : [...levelDrafts]
  if (draggedId) renderedLevels.splice(Math.min(renderedLevels.length, Math.max(0, dragTargetIndex ?? 0)), 0, null)

  return (
    <InstrumentSettingsDrawer accent={accent} applyDisabled={!configurationValid} description="Selecciona una plantilla y personaliza sus niveles, orden y puntuaciones." onApply={onApply} onClose={onClose} panelClassName="max-w-[42rem]" title="Configurar escala estimativa">
      <div className="space-y-4">
        <section>
          <p className={cn('text-sm font-black', accent.text)}>1. Tipo de escala</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">{scaleTemplateOptions.map((option) => { const Icon = option.icon; const selected = template === option.id; return <button key={option.id} type="button" aria-pressed={selected} className={cn('relative rounded-xl border bg-card p-3 text-left transition hover:shadow-sm', selected ? cn(accent.card, accent.border, 'ring-1') : 'border-border')} onClick={() => onTemplateSelect(option.id)}><div className="flex items-start gap-2.5"><span className={cn('grid size-8 shrink-0 place-items-center rounded-lg', selected ? cn(accent.progress, 'text-white') : cn(accent.panel, accent.text))}><Icon className="size-4" /></span><div><p className={cn('text-sm font-black', selected ? accent.text : 'text-foreground')}>{option.label}</p><p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">{option.description}</p><p className="mt-1 text-[9px] font-bold text-muted-foreground">{option.summary}</p></div></div>{selected ? <CheckCircle2 className={cn('absolute right-2 top-2 size-4', accent.text)} /> : null}</button> })}</div>
        </section>

        <section className="border-t border-border pt-4">
          <div className="flex items-center justify-between gap-3"><div><p className={cn('text-sm font-black', accent.text)}>2. Niveles de la escala</p><p className="text-[10px] text-muted-foreground">Ordenados de mayor a menor valoración. Arrastra para reordenar.</p></div><Button type="button" size="sm" variant="outline" disabled={levelDrafts.length >= 6} onClick={onAddLevel}><Plus className="size-4" />Agregar nivel</Button></div>
          <div ref={listRef} className="mt-2 space-y-1.5">{renderedLevels.map((level, visualIndex) => {
            if (!level) return <div key="scale-placeholder" className={cn('grid place-items-center rounded-xl border-2 border-dashed text-[10px] font-black', accent.card, accent.border, accent.text)} style={{ height: `${dragPreviewHeight}px` }}>Suelta aquí</div>
            const index = levelDrafts.findIndex((item) => item.id === level.id)
            const visual = scaleLevelVisual(accent, visualIndex, levelDrafts.length)
            return <div key={level.id} data-scale-level-card data-scale-sort-card className="grid grid-cols-[1.75rem_1.5rem_minmax(0,1fr)_5rem_2rem] items-center gap-2 rounded-xl border bg-card px-2.5 py-2 shadow-sm" style={{ borderColor: visual.border }}><button type="button" aria-label={`Arrastrar nivel ${level.name}`} className={cn('grid size-7 touch-none cursor-grab place-items-center rounded-md text-slate-400 hover:bg-muted active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2', accent.ring)} onPointerDown={(event) => startPointerDrag(event, level)} onKeyDown={(event) => { if (event.key === 'ArrowUp') { event.preventDefault(); moveWithKeyboard(index, -1) } else if (event.key === 'ArrowDown') { event.preventDefault(); moveWithKeyboard(index, 1) } }}><GripVertical className="size-4" /></button><span className="grid size-6 place-items-center rounded-full text-[10px] font-black" style={{ backgroundColor: visual.background, color: visual.foreground }}>{visualIndex + 1}</span><Input aria-label={`Nombre del nivel ${visualIndex + 1}`} className="h-8 font-bold" value={level.name} onChange={(event) => onLevelsChange((current) => current.map((item) => item.id === level.id ? { ...item, name: event.target.value } : item))} /><label className="relative"><Input aria-label={`Puntos del nivel ${visualIndex + 1}`} className="h-8 pr-7 font-black" type="number" min={0} step="0.25" value={level.points} onChange={(event) => onLevelsChange((current) => current.map((item) => item.id === level.id ? { ...item, points: Number(event.target.value) } : item))} /><span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground">pts</span></label><button type="button" aria-label={`Eliminar nivel ${level.name}`} disabled={levelDrafts.length <= 2} className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-red-50 hover:text-destructive disabled:opacity-30" onClick={() => onLevelsChange((current) => current.filter((item) => item.id !== level.id))}><Trash2 className="size-4" /></button></div>
          })}</div>
          {!levelNamesValid ? <p className="mt-2 text-xs font-bold text-destructive">Todos los niveles necesitan un nombre y deben existir al menos dos.</p> : null}
          {!levelPointsValid ? <p className="mt-2 text-xs font-bold text-destructive">Introduce puntuaciones válidas y no negativas.</p> : null}
          {!levelOrderValid ? <p className="mt-2 text-xs font-bold text-destructive">Ordena los niveles de mayor a menor puntuación.</p> : null}
          {duplicateLevelValues ? <p className="mt-2 text-xs font-bold text-amber-700">Hay puntuaciones repetidas; esto puede generar ambigüedad al evaluar.</p> : null}
          <div className={cn('mt-2 rounded-lg border px-3 py-2 text-[10px] leading-4', accent.card, accent.border)}><CircleDot className={cn('mr-1 inline size-3.5', accent.text)} />La puntuación se calcula proporcionalmente según el valor del nivel seleccionado y el máximo del indicador.</div>
        </section>

        <section className="border-t border-border pt-4">
          <p className={cn('text-sm font-black', accent.text)}>3. Distribución de puntos</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2"><button type="button" className={cn('rounded-xl border p-3 text-left', pointMode === 'automatic' ? cn(accent.card, accent.border, 'ring-1') : 'border-border')} onClick={() => onPointModeChange('automatic')}><p className="text-xs font-black">Distribución automática</p><p className="mt-1 text-[10px] leading-4 text-muted-foreground">AulaBase conserva exactamente el total de la actividad.</p><p className={cn('mt-2 rounded-lg bg-card px-2 py-1.5 text-[10px] font-bold', accent.text)}>{formatInstrumentNumber(maxScore)} puntos entre {criteriaCount} indicadores</p></button><button type="button" className={cn('rounded-xl border p-3 text-left', pointMode === 'manual' ? cn(accent.card, accent.border, 'ring-1') : 'border-border')} onClick={() => onPointModeChange('manual')}><p className="text-xs font-black">Valores personalizados</p><p className="mt-1 text-[10px] leading-4 text-muted-foreground">Asigna un valor máximo diferente a cada indicador.</p><p className={cn('mt-2 rounded-lg bg-card px-2 py-1.5 text-[10px] font-bold', distributionValid ? 'text-emerald-700' : 'text-amber-700')}>{formatInstrumentNumber(configuredTotal)}/{formatInstrumentNumber(maxScore)} pts {distributionValid ? '✓' : ''}</p></button></div>
          {pointMode === 'manual' ? <div className="mt-2 space-y-1.5">{Array.from({ length: criteriaCount }, (_, index) => <label key={index} className="grid grid-cols-[minmax(0,1fr)_6.5rem] items-center gap-3 rounded-lg border border-border bg-muted/10 px-3 py-2 text-xs"><span className="truncate font-bold">{fields[instrumentFieldKey('escala', 'criterion', index)] || `${index + 1}. Indicador`}</span><span className="relative"><Input type="number" min={0} step="0.01" className="h-8 pr-8" value={indicatorPoints[index] || ''} onChange={(event) => onIndicatorPointsChange((current) => { const next = [...current]; next[index] = event.target.value; return next })} /><span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground">pts</span></span></label>)}</div> : null}
          {!distributionValid ? <p className="mt-2 text-xs font-bold text-amber-700">La puntuación configurada debe coincidir con {formatInstrumentNumber(maxScore)} puntos.</p> : null}
          <div className="mt-3"><ToggleControl label="Permitir “No aplica”" checked={noApply} onChange={onNoApplyChange} /><p className="mt-1 text-[10px] leading-4 text-muted-foreground">Excluye un indicador del cálculo cuando no corresponda y reajusta la puntuación aplicable.</p></div>
        </section>

        <section className="border-t border-border pt-4">
          <p className={cn('text-sm font-black', accent.text)}>4. Vista previa de la escala</p>
          <div className="mt-2 overflow-x-auto rounded-xl border border-border bg-muted/10 p-1"><div className="grid gap-1" style={{ gridTemplateColumns: `minmax(8rem,1.5fr) repeat(${levelDrafts.length + (noApply ? 1 : 0)}, minmax(4.25rem,1fr))` }}><div className="rounded-lg border border-border bg-card px-2 py-2 text-[9px] font-black uppercase">Indicador</div>{levelDrafts.map((level, index) => { const visual = scaleLevelVisual(accent, index, levelDrafts.length); return <div key={level.id} className="rounded-lg border px-1 py-2 text-center text-[9px] font-black" style={{ backgroundColor: visual.background, borderColor: visual.border, color: visual.foreground }}>{level.name}<span className="block font-medium">{level.points} pts</span></div> })}{noApply ? <div className="rounded-lg border border-slate-200 bg-slate-100 px-1 py-2 text-center text-[9px] font-black text-slate-600">No aplica<span className="block font-medium">N/A</span></div> : null}{Array.from({ length: Math.min(criteriaCount, 3) }, (_, row) => <Fragment key={row}><div className="truncate rounded-lg border border-border bg-card px-2 py-2 text-[9px] font-bold">{fields[instrumentFieldKey('escala', 'criterion', row)] || `${row + 1}. Indicador`}</div>{levelDrafts.map((level, column) => <div key={level.id} className="grid place-items-center rounded-lg border border-border bg-card"><span className={cn('size-3.5 rounded-full border-2', column === row % levelDrafts.length ? 'shadow-[inset_0_0_0_3px_white]' : 'border-slate-300')} style={column === row % levelDrafts.length ? { backgroundColor: accent.progressColor, borderColor: accent.progressColor } : undefined} /></div>)}{noApply ? <div className="grid place-items-center rounded-lg border border-border bg-card"><span className="size-3.5 rounded-full border-2 border-slate-300" /></div> : null}</Fragment>)}</div><div className={cn('mt-1 flex items-center justify-between rounded-lg px-3 py-2 text-[10px] font-bold', accent.card)}><span>Puntuación obtenida de ejemplo</span><span className={accent.text}>{formatInstrumentNumber(sampleScore)}/{formatInstrumentNumber(maxScore)} pts</span></div></div>
        </section>
      </div>
    </InstrumentSettingsDrawer>
  )
}

function ScaleInstrument({
  accent,
  criteriaCount,
  fields,
  levelCount,
  maxScore,
  onFieldChange,
  onCriteriaCountChange,
  onFieldsChange,
  onLevelCountChange,
  typographyControls,
}: {
  accent: (typeof blockAccents)[number]
  criteriaCount: number
  fields: Record<string, string>
  levelCount: number
  maxScore: number
  onFieldChange: (key: string, value: string) => void
  onCriteriaCountChange: (value: number) => void
  onFieldsChange: (fields: Record<string, string>) => void
  onLevelCountChange: (value: number) => void
  typographyControls: ReactNode
}) {
  const levels = Array.from({ length: levelCount }, (_, index) => levelCount - index)
  const total = Number(Array.from({ length: criteriaCount }, (_, index) => Number(fields[instrumentFieldKey('escala', 'points', index)] || 0)).reduce((sum, value) => sum + value, 0).toFixed(2))
  const hasNoApply = fields['escala:meta:noApply'] === 'true'
  const [configuring, setConfiguring] = useState(false)
  const [levelDrafts, setLevelDrafts] = useState<ScaleLevelDraft[]>([])
  const [template, setTemplate] = useState(fields['escala:meta:template'] || 'frecuencia')
  const [pointMode, setPointMode] = useState<ScalePointMode>(fields['escala:meta:pointsMode'] === 'manual' ? 'manual' : 'automatic')
  const [noApply, setNoApply] = useState(fields['escala:meta:noApply'] === 'true')
  const [indicatorPoints, setIndicatorPoints] = useState<string[]>(() => Array.from({ length: criteriaCount }, (_, index) => fields[instrumentFieldKey('escala', 'points', index)] || '0'))
  const [pendingDelete, setPendingDelete] = useState<number | null>(null)
  const [highlightedRow, setHighlightedRow] = useState<number | null>(null)

  function addIndicator() {
    if (criteriaCount >= 12) return
    const nextCount = criteriaCount + 1
    const next: Record<string,string> = {...fields,'escala:meta:criteriaCount':String(nextCount)}
    if (fields['escala:meta:pointsMode'] === 'manual') next[instrumentFieldKey('escala', 'points', criteriaCount)] = '0'
    else distributeScore(maxScore,nextCount).forEach((points,row)=>{next[instrumentFieldKey('escala','points',row)]=String(points)})
    onFieldsChange(next)
    onCriteriaCountChange(nextCount)
    focusNewInstrumentRow('escala', criteriaCount, setHighlightedRow)
  }

  function removeIndicator(index: number) {
    const nextCount = criteriaCount - 1
    if (nextCount < 1) return
    const next = shiftInstrumentRows(fields, 'escala', index, criteriaCount, ['criterion', 'points'])
    next['escala:meta:criteriaCount'] = String(nextCount)
    if (fields['escala:meta:pointsMode'] !== 'manual') distributeScore(maxScore, nextCount).forEach((points, row) => { next[instrumentFieldKey('escala', 'points', row)] = String(points) })
    onFieldsChange(next); onCriteriaCountChange(nextCount)
  }

  function openConfiguration() {
    const savedTemplate = fields['escala:meta:template'] || template
    const defaults = scaleTemplateLevels(savedTemplate)
    setTemplate(savedTemplate)
    setLevelDrafts(levels.map((score, index) => ({ id: `scale-${score}`, name: fields[instrumentFieldKey('escala', 'level-name', score)] || defaults[index]?.name || `Nivel ${index + 1}`, points: Number(fields[instrumentFieldKey('escala', 'level-points', score)] || defaults[index]?.points || score) })))
    setPointMode(fields['escala:meta:pointsMode'] === 'manual' ? 'manual' : 'automatic')
    setNoApply(fields['escala:meta:noApply'] === 'true')
    setIndicatorPoints(Array.from({ length: criteriaCount }, (_, index) => fields[instrumentFieldKey('escala', 'points', index)] || '0'))
    setConfiguring(true)
  }

  function applyScaleTemplate(nextTemplate: string) {
    setTemplate(nextTemplate)
    if (nextTemplate === 'personalizada') return
    setLevelDrafts(scaleTemplateLevels(nextTemplate).map((level, index) => ({ id: `${nextTemplate}-${index}`, ...level })))
  }

  function selectScaleTemplate(nextTemplate: string) {
    if (nextTemplate === template) return
    applyScaleTemplate(nextTemplate)
  }

  function applyConfiguration() {
    const configuredIndicatorPoints = pointMode === 'automatic' ? distributeScore(maxScore, criteriaCount) : Array.from({ length: criteriaCount }, (_, index) => Number(indicatorPoints[index] || 0))
    const next: Record<string, string> = { ...fields, 'escala:meta:template': template, 'escala:meta:levelCount': String(levelDrafts.length), 'escala:meta:pointsMode': pointMode, 'escala:meta:noApply': String(noApply) }
    Object.keys(next).forEach((key) => { if (/^escala:level-(?:name|points):\d+$/.test(key)) delete next[key] })
    levelDrafts.forEach((level, index) => { const score = levelDrafts.length - index; next[instrumentFieldKey('escala', 'level-name', score)] = level.name.trim(); next[instrumentFieldKey('escala', 'level-points', score)] = String(level.points) })
    configuredIndicatorPoints.forEach((points, index) => { next[instrumentFieldKey('escala', 'points', index)] = String(points) })
    onFieldsChange(next); onLevelCountChange(levelDrafts.length); setConfiguring(false)
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2"><div><p className={cn('font-black', accent.text)}>Indicadores y niveles de la escala</p><p className="text-xs text-muted-foreground">Evalúa el grado, frecuencia o nivel de desempeño alcanzado en cada indicador.</p></div><div className="flex flex-wrap items-center gap-2">{typographyControls}<Button type="button" size="sm" variant="outline" onClick={openConfiguration}><Settings className="size-4" />Configurar escala</Button><Button type="button" size="sm" className={accent.button} onClick={addIndicator} disabled={criteriaCount >= 12}><Plus className="size-4" />Agregar indicador</Button></div></div>
      {configuring ? <ScaleSettingsDrawer accent={accent} criteriaCount={criteriaCount} fields={fields} indicatorPoints={indicatorPoints} levelDrafts={levelDrafts} maxScore={maxScore} noApply={noApply} onAddLevel={() => { setTemplate('personalizada'); setLevelDrafts((current) => [...current, { id: `new-${Date.now()}`, name: `Nivel ${current.length + 1}`, points: Math.max(0, current.length ? current[current.length - 1].points - 1 : 1) }]) }} onApply={applyConfiguration} onClose={() => setConfiguring(false)} onIndicatorPointsChange={setIndicatorPoints} onLevelsChange={(value) => { setTemplate('personalizada'); setLevelDrafts(value) }} onNoApplyChange={setNoApply} onPointModeChange={setPointMode} onTemplateSelect={selectScaleTemplate} pointMode={pointMode} template={template} /> : null}
      <InstrumentTable>
        <thead className="sticky top-0 z-20 text-[10px] font-bold uppercase">
          <tr>
            <th className={cn('sticky left-0 z-30 w-[34%] border px-3 py-3', accent.card, accent.border, accent.text)}>Indicadores</th>
            {levels.map((level, index) => {
              const visual = scaleLevelVisual(accent, index, levels.length)
              return <th key={level} className="border px-3 py-3 text-center" style={{ backgroundColor: visual.background, borderColor: visual.border, color: visual.foreground }}><span className="block font-black">{fields[instrumentFieldKey('escala', 'level-name', level)] || `Nivel ${level}`}</span><span className="mt-0.5 block normal-case font-bold opacity-75">{fields[instrumentFieldKey('escala', 'level-points', level)] || level} pts</span></th>
            })}
            {hasNoApply ? <th className="border border-slate-300 bg-slate-100 px-3 py-3 text-center text-slate-600">No aplica<span className="mt-0.5 block normal-case font-bold opacity-75">N/A</span></th> : null}
            <th className={cn('w-24 border px-3 py-3 text-center', accent.card, accent.border, accent.text)}>Valor máximo</th>
            <th className={cn('w-10 border', accent.card, accent.border)} />
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: criteriaCount }, (_, index) => ({ criterion: `Criterio ${index + 1}`, index })).map(({ criterion, index }) => (
            <tr key={criterion} className={cn('transition-colors motion-safe:duration-500', highlightedRow === index ? accent.panel : '')}>
              <td className="sticky left-0 z-10 border border-border bg-card p-1.5">
                <div className="flex items-start gap-1.5"><span className={cn('mt-1 grid size-6 shrink-0 place-items-center rounded-full text-[10px] font-black text-white', accent.progress)}>{index + 1}</span><InstrumentTextarea
                  dataInstrumentRow={`escala-${index}`}
                  placeholder="Indicador"
                  value={fields[instrumentFieldKey('escala', 'criterion', index)] ?? ''}
                  onChange={(value) => onFieldChange(instrumentFieldKey('escala', 'criterion', index), value)}
                /></div>
              </td>
              {levels.map((value, levelIndex) => (
                <td key={value} className="border bg-card text-center" style={{ borderColor: scaleLevelVisual(accent, levelIndex, levels.length).border }}><span className="mx-auto block size-5 rounded-full border-2 bg-white shadow-sm" style={{ borderColor: scaleLevelVisual(accent, levelIndex, levels.length).border }} /></td>
              ))}
              {hasNoApply ? <td className="border border-slate-200 bg-slate-50 text-center"><span className="mx-auto block size-5 rounded-full border-2 border-slate-300 bg-white shadow-sm" /></td> : null}
              <td className={cn('border p-1.5 text-center', accent.card, accent.border)}><span className={cn('inline-flex rounded-lg bg-card px-2 py-2 font-black shadow-sm', accent.text)}>{fields[instrumentFieldKey('escala', 'points', index)] ?? '0'} pts</span></td><td className={cn('border bg-card', accent.border)}><InstrumentRowMenu canMoveDown={index < criteriaCount - 1} canMoveUp={index > 0} onDelete={() => fields[instrumentFieldKey('escala', 'criterion', index)]?.trim() ? setPendingDelete(index) : removeIndicator(index)} onDuplicate={() => { if (criteriaCount >= 12) return; const nextCount = criteriaCount + 1; const next = {...fields,'escala:meta:criteriaCount':String(nextCount),[instrumentFieldKey('escala','criterion',criteriaCount)]:`${fields[instrumentFieldKey('escala','criterion',index)] || ''} (copia)`}; if (fields['escala:meta:pointsMode'] === 'manual') next[instrumentFieldKey('escala','points',criteriaCount)] = fields[instrumentFieldKey('escala','points',index)] || '0'; else distributeScore(maxScore,nextCount).forEach((points,row)=>{next[instrumentFieldKey('escala','points',row)]=String(points)}); onFieldsChange(next); onCriteriaCountChange(nextCount) }} onMoveDown={() => onFieldsChange(swapInstrumentRows(fields,'escala',index,index+1,['criterion','points']))} onMoveUp={() => onFieldsChange(swapInstrumentRows(fields,'escala',index,index-1,['criterion','points']))} /></td>
            </tr>
          ))}
          <tr className="font-bold"><td className={cn('border px-3 py-3', accent.card, accent.border, accent.text)} colSpan={levelCount + 1 + (hasNoApply ? 1 : 0)}>Puntuación máxima total</td><td className={cn('border px-2 py-2 text-center', accent.card, accent.border, Math.abs(total - maxScore) < 0.001 ? 'text-emerald-700' : 'text-destructive')}>{total} / {maxScore} pts</td><td className={cn('border', accent.card, accent.border)} /></tr>
        </tbody>
      </InstrumentTable>
      {pendingDelete !== null ? <ConfirmDialog title="¿Eliminar este indicador?" description={`Se eliminará “${fields[instrumentFieldKey('escala','criterion',pendingDelete)]}” y su configuración asociada.`} confirmLabel="Eliminar indicador" destructive onClose={() => setPendingDelete(null)} onConfirm={() => { removeIndicator(pendingDelete); setPendingDelete(null) }} /> : null}
    </div>
  )
}

const checklistResponsePresets = [
  { id: 'yes-no', positive: 'Sí', negative: 'No' },
  { id: 'compliance', positive: 'Cumple', negative: 'No cumple' },
  { id: 'achievement', positive: 'Logrado', negative: 'No logrado' },
  { id: 'correctness', positive: 'Correcto', negative: 'Incorrecto' },
  { id: 'completion', positive: 'Realizado', negative: 'No realizado' },
] as const

type ChecklistLabelMode = (typeof checklistResponsePresets)[number]['id'] | 'custom'

function checklistLabelMode(positive: string, negative: string): ChecklistLabelMode {
  return checklistResponsePresets.find((preset) => preset.positive === positive && preset.negative === negative)?.id ?? 'custom'
}

function ChecklistInstrument({
  accent,
  criteriaCount,
  fields,
  maxScore,
  onFieldChange,
  onCriteriaCountChange,
  onFieldsChange,
  typographyControls,
}: {
  accent: (typeof blockAccents)[number]
  criteriaCount: number
  fields: Record<string, string>
  maxScore: number
  onFieldChange: (key: string, value: string) => void
  onCriteriaCountChange: (value: number) => void
  onFieldsChange: (fields: Record<string, string>) => void
  typographyControls: ReactNode
}) {
  const total = Number(Array.from({ length: criteriaCount }, (_, index) => Number(fields[instrumentFieldKey('lista-cotejo', 'points', index)] || 0)).reduce((sum, value) => sum + value, 0).toFixed(2))
  const [configuring, setConfiguring] = useState(false)
  const [draftNoApply, setDraftNoApply] = useState(fields['lista-cotejo:meta:noApply'] === 'true')
  const [draftUniformPoints, setDraftUniformPoints] = useState(fields['lista-cotejo:meta:pointsMode'] !== 'individual')
  const [draftLabels, setDraftLabels] = useState({ yes: fields['lista-cotejo:meta:yesLabel'] || 'Sí', no: fields['lista-cotejo:meta:noLabel'] || 'No', na: fields['lista-cotejo:meta:naLabel'] || 'No aplica' })
  const [draftLabelMode, setDraftLabelMode] = useState<ChecklistLabelMode>(() => checklistLabelMode(fields['lista-cotejo:meta:yesLabel'] || 'Sí', fields['lista-cotejo:meta:noLabel'] || 'No'))
  const [draftPoints, setDraftPoints] = useState<string[]>(() => Array.from({ length: criteriaCount }, (_, index) => fields[instrumentFieldKey('lista-cotejo', 'points', index)] || '0'))
  const [pendingDelete, setPendingDelete] = useState<number | null>(null)
  const [highlightedRow, setHighlightedRow] = useState<number | null>(null)
  const hasNoApply = fields['lista-cotejo:meta:noApply'] === 'true'
  const uniformPoints = fields['lista-cotejo:meta:pointsMode'] !== 'individual'
  const labels = { yes: fields['lista-cotejo:meta:yesLabel'] || 'Sí', no: fields['lista-cotejo:meta:noLabel'] || 'No', na: fields['lista-cotejo:meta:naLabel'] || 'No aplica' }
  const uniformDraftPoints = distributeScore(maxScore, criteriaCount)
  const configuredDraftPoints = draftUniformPoints ? uniformDraftPoints : Array.from({ length: criteriaCount }, (_, index) => Number(draftPoints[index] || 0))
  const draftTotal = Number(configuredDraftPoints.reduce((sum, value) => sum + value, 0).toFixed(2))
  const customLabelsValid = draftLabelMode !== 'custom' || Boolean(draftLabels.yes.trim() && draftLabels.no.trim() && draftLabels.yes.trim().toLocaleLowerCase() !== draftLabels.no.trim().toLocaleLowerCase())
  const customPointsValid = configuredDraftPoints.every((value) => Number.isFinite(value) && value >= 0)
  const distributionValid = draftUniformPoints || (customPointsValid && Math.abs(draftTotal - maxScore) < 0.001)
  const configurationValid = customLabelsValid && distributionValid

  function addCriterion() { if (criteriaCount >= 20) return; const nextCount=criteriaCount+1; const next:Record<string,string>={...fields,'lista-cotejo:meta:criteriaCount':String(nextCount)}; if(uniformPoints)distributeScore(maxScore,nextCount).forEach((points,row)=>{next[instrumentFieldKey('lista-cotejo','points',row)]=String(points)});else next[instrumentFieldKey('lista-cotejo','points',criteriaCount)]='0';onFieldsChange(next);onCriteriaCountChange(nextCount); focusNewInstrumentRow('lista-cotejo', criteriaCount, setHighlightedRow) }
  function removeCriterion(index: number) { if (criteriaCount <= 1) return; const nextCount = criteriaCount - 1; const next = shiftInstrumentRows(fields,'lista-cotejo',index,criteriaCount,['criterion','points']); next['lista-cotejo:meta:criteriaCount']=String(nextCount); if(uniformPoints) distributeScore(maxScore,nextCount).forEach((points,row)=>{next[instrumentFieldKey('lista-cotejo','points',row)]=String(points)}); onFieldsChange(next); onCriteriaCountChange(nextCount) }
  function openConfiguration() {
    setDraftNoApply(hasNoApply)
    setDraftUniformPoints(uniformPoints)
    setDraftLabels(labels)
    setDraftLabelMode(checklistLabelMode(labels.yes, labels.no))
    setDraftPoints(Array.from({ length: criteriaCount }, (_, index) => fields[instrumentFieldKey('lista-cotejo', 'points', index)] || '0'))
    setConfiguring(true)
  }
  function applyConfiguration() {
    if (!configurationValid) return
    const next: Record<string, string> = {
      ...fields,
      'lista-cotejo:meta:observations': 'false',
      'lista-cotejo:meta:noApply': String(draftNoApply),
      'lista-cotejo:meta:pointsMode': draftUniformPoints ? 'uniform' : 'individual',
      'lista-cotejo:meta:yesLabel': draftLabels.yes.trim(),
      'lista-cotejo:meta:noLabel': draftLabels.no.trim(),
      'lista-cotejo:meta:naLabel': draftLabels.na.trim() || 'No aplica',
    }
    Object.keys(next).filter((key) => key.startsWith('lista-cotejo:observation:')).forEach((key) => delete next[key])
    configuredDraftPoints.forEach((points, row) => { next[instrumentFieldKey('lista-cotejo', 'points', row)] = String(points) })
    onFieldsChange(next)
    setConfiguring(false)
  }
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2"><div><p className={cn('font-black',accent.text)}>Criterios de cumplimiento</p><p className="text-xs text-muted-foreground">Verifica el cumplimiento de criterios específicos.</p></div><div className="flex flex-wrap items-center gap-2">{typographyControls}<Button type="button" size="sm" variant="outline" onClick={openConfiguration}><Settings className="size-4" />Configurar lista</Button><Button type="button" size="sm" className={accent.button} onClick={addCriterion} disabled={criteriaCount >= 20}><Plus className="size-4" />Agregar criterio</Button></div></div>
      {configuring ? (
        <InstrumentSettingsDrawer
          accent={accent}
          applyDisabled={!configurationValid}
          description="Personaliza las respuestas, la distribución de puntos y el comportamiento de este instrumento."
          onClose={() => setConfiguring(false)}
          onApply={applyConfiguration}
          panelClassName="max-w-[42rem]"
          title="Configurar lista de cotejo"
        >
          <div className="space-y-4">
            <div className={cn('grid grid-cols-2 gap-2 rounded-xl border p-2 sm:grid-cols-4', accent.card)}>
              {[
                { icon: <Target className="size-4" />, label: 'Actividad', value: `${maxScore} puntos` },
                { icon: <Grid3X3 className="size-4" />, label: 'Criterios', value: String(criteriaCount) },
                { icon: <ClipboardList className="size-4" />, label: 'Instrumento', value: 'Lista de cotejo' },
                { icon: <CheckCircle2 className="size-4" />, label: 'Puntuación configurada', value: `${formatInstrumentNumber(draftTotal)}/${formatInstrumentNumber(maxScore)} pts` },
              ].map((item) => (
                <div key={item.label} className="min-w-0 rounded-lg border border-border bg-card/90 p-2.5 shadow-sm">
                  <p className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.1em] text-muted-foreground"><span className={accent.text}>{item.icon}</span>{item.label}</p>
                  <p className={cn('mt-1 truncate text-xs font-black', item.label === 'Puntuación configurada' && distributionValid ? 'text-emerald-700' : 'text-foreground')} title={item.value}>{item.value}{item.label === 'Puntuación configurada' && distributionValid ? ' ✓' : ''}</p>
                </div>
              ))}
            </div>

            <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div><p className={cn('text-sm font-black', accent.text)}>1. Etiquetas de respuesta</p><p className="mt-0.5 text-xs text-muted-foreground">Elige cómo se representará el cumplimiento de cada criterio.</p></div>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {checklistResponsePresets.map((preset) => {
                  const selected = draftLabelMode === preset.id
                  return <button key={preset.id} type="button" aria-pressed={selected} className={cn('relative min-h-16 rounded-xl border bg-card px-3 py-2 text-left text-xs transition hover:shadow-sm', selected ? cn(accent.card, accent.border, accent.text, 'ring-1') : 'border-border text-foreground')} onClick={() => { setDraftLabelMode(preset.id); setDraftLabels((current) => ({ ...current, yes: preset.positive, no: preset.negative })) }}><span className="block font-black">{preset.positive}</span><span className="mt-0.5 block text-[10px] text-muted-foreground">{preset.negative}</span>{selected ? <CheckCircle2 className={cn('absolute right-2 top-2 size-4', accent.text)} /> : null}</button>
                })}
                <button type="button" aria-pressed={draftLabelMode === 'custom'} className={cn('relative min-h-16 rounded-xl border bg-card px-3 py-2 text-left text-xs transition hover:shadow-sm', draftLabelMode === 'custom' ? cn(accent.card, accent.border, accent.text, 'ring-1') : 'border-border text-foreground')} onClick={() => setDraftLabelMode('custom')}><PenLine className="mb-1 size-4" /><span className="font-black">Personalizadas</span>{draftLabelMode === 'custom' ? <CheckCircle2 className={cn('absolute right-2 top-2 size-4', accent.text)} /> : null}</button>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg bg-muted/25 px-3 py-2 text-[10px] font-bold"><span className="text-muted-foreground">Vista previa:</span><span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">{draftLabels.yes} (positivo)</span><span className="rounded-full bg-red-50 px-2 py-1 text-red-600">{draftLabels.no} (negativo)</span></div>
              {draftLabelMode === 'custom' ? <div className="mt-3 grid gap-3 sm:grid-cols-2"><label className="text-xs font-bold text-muted-foreground">Etiqueta positiva<Input className="mt-1" value={draftLabels.yes} placeholder="Ej. Demostrado" onChange={(event) => setDraftLabels((current) => ({ ...current, yes: event.target.value }))} /></label><label className="text-xs font-bold text-muted-foreground">Etiqueta negativa<Input className="mt-1" value={draftLabels.no} placeholder="Ej. No demostrado" onChange={(event) => setDraftLabels((current) => ({ ...current, no: event.target.value }))} /></label>{!customLabelsValid ? <p className="text-xs font-bold text-destructive sm:col-span-2">Las etiquetas deben tener contenido y ser diferentes entre sí.</p> : null}</div> : null}
            </section>

            <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <p className={cn('text-sm font-black', accent.text)}>2. Opción “No aplica”</p>
              <div className="mt-2"><ToggleControl label="Permitir No aplica" checked={draftNoApply} onChange={setDraftNoApply} /></div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">Permite marcar un criterio que no corresponde al estudiante o a la situación evaluada.</p>
              {draftNoApply ? <div className={cn('mt-3 flex items-start gap-2 rounded-lg border p-3 text-xs leading-5', accent.card, accent.border)}><CircleDot className={cn('mt-0.5 size-4 shrink-0', accent.text)} /><p>Los criterios marcados como <strong>No aplica</strong> serán excluidos del cálculo y la puntuación se reajustará proporcionalmente para no perjudicar al estudiante.</p></div> : null}
            </section>

            <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <p className={cn('text-sm font-black', accent.text)}>3. Distribución de puntos</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Define cómo se asignan los puntos de la actividad entre los criterios.</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <button type="button" aria-pressed={draftUniformPoints} className={cn('rounded-xl border p-3 text-left transition hover:shadow-sm', draftUniformPoints ? cn(accent.card, accent.border, 'ring-1') : 'border-border')} onClick={() => setDraftUniformPoints(true)}><span className={cn('block text-sm font-black', draftUniformPoints ? accent.text : 'text-foreground')}>Distribución uniforme</span><span className="mt-1 block text-xs leading-5 text-muted-foreground">AulaBase distribuye automáticamente el valor total.</span></button>
                <button type="button" aria-pressed={!draftUniformPoints} className={cn('rounded-xl border p-3 text-left transition hover:shadow-sm', !draftUniformPoints ? cn(accent.card, accent.border, 'ring-1') : 'border-border')} onClick={() => setDraftUniformPoints(false)}><span className={cn('block text-sm font-black', !draftUniformPoints ? accent.text : 'text-foreground')}>Valores personalizados</span><span className="mt-1 block text-xs leading-5 text-muted-foreground">Asigna manualmente un valor diferente a cada criterio.</span></button>
              </div>
              {draftUniformPoints ? <div className={cn('mt-3 rounded-xl border p-3', accent.card, accent.border)}><p className="text-sm font-black">{formatInstrumentNumber(maxScore)} puntos entre {criteriaCount} criterios</p><p className="mt-1 text-xs text-muted-foreground">≈ {formatInstrumentNumber(maxScore / Math.max(1, criteriaCount))} pts por criterio. Los centésimos se ajustan para conservar el total exacto.</p></div> : <div className="mt-3 space-y-2">{Array.from({ length: criteriaCount }, (_, index) => <label key={index} className="grid grid-cols-[minmax(0,1fr)_7rem] items-center gap-3 rounded-lg border border-border bg-muted/10 px-3 py-2 text-xs"><span className="truncate font-bold text-foreground">{fields[instrumentFieldKey('lista-cotejo', 'criterion', index)] || `${index + 1}. Criterio`}</span><span className="relative"><Input type="number" min={0} step="0.01" className="h-9 pr-9" value={draftPoints[index] || ''} onChange={(event) => setDraftPoints((current) => { const next = [...current]; next[index] = event.target.value; return next })} /><span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">pts</span></span></label>)}</div>}
              <div className={cn('mt-3 flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-bold', distributionValid ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-700')}><span>Puntuación configurada</span><span>{formatInstrumentNumber(draftTotal)}/{formatInstrumentNumber(maxScore)} pts {distributionValid ? '✓' : ''}</span></div>
              <div className="mt-2 rounded-lg bg-muted/25 px-3 py-2 text-[11px] leading-5 text-muted-foreground"><strong className="text-foreground">Cálculo:</strong> {draftLabels.yes} otorga el valor completo del criterio; {draftLabels.no} otorga 0 puntos.</div>
            </section>

            <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <p className={cn('text-sm font-black', accent.text)}>4. Vista previa</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Así se verá la lista de cotejo con la configuración actual.</p>
              <div className="mt-3 rounded-xl border border-border bg-slate-50/50 p-1">
                <table className="w-full table-fixed border-separate border-spacing-1 text-[10px] sm:text-xs"><thead><tr><th className="w-[38%] rounded-lg border border-border bg-card px-2 py-2 text-left sm:px-3">Criterio</th><th className="break-words rounded-lg border border-emerald-200 bg-emerald-50 px-1 py-2 text-emerald-700 sm:px-3">{draftLabels.yes}<span className="block text-[8px] sm:text-[9px]">(valor completo)</span></th><th className="break-words rounded-lg border border-red-200 bg-red-50 px-1 py-2 text-red-600 sm:px-3">{draftLabels.no}<span className="block text-[8px] sm:text-[9px]">(0 pts)</span></th>{draftNoApply ? <th className="break-words rounded-lg border border-slate-200 bg-slate-100 px-1 py-2 text-slate-600 sm:px-3">No aplica<span className="block text-[8px] sm:text-[9px]">(excluido)</span></th> : null}</tr></thead><tbody>{Array.from({ length: Math.min(criteriaCount, 3) }, (_, index) => <tr key={index}><td className="break-words rounded-lg border border-border bg-card px-2 py-2 font-bold sm:px-3">{fields[instrumentFieldKey('lista-cotejo', 'criterion', index)] || `${index + 1}. Criterio`}</td><td className="rounded-lg border border-emerald-100 bg-card text-center text-emerald-600">✓</td><td className="rounded-lg border border-red-100 bg-card text-center text-red-500">×</td>{draftNoApply ? <td className="rounded-lg border border-slate-200 bg-card text-center text-slate-500">—</td> : null}</tr>)}</tbody></table>
                {criteriaCount > 3 ? <p className="px-3 py-2 text-[10px] font-bold text-muted-foreground">Y {criteriaCount - 3} criterios más…</p> : null}
              </div>
            </section>
          </div>
        </InstrumentSettingsDrawer>
      ) : null}
      <InstrumentTable>
        <thead className="sticky top-0 z-20 text-[10px] font-bold uppercase">
          <tr>
            <th className={cn('sticky left-0 z-30 w-[48%] border px-3 py-3', accent.card, accent.border, accent.text)}>Criterios</th>
            <th className="border border-emerald-300 bg-emerald-100 px-3 py-3 text-center text-emerald-800">{labels.yes}</th>
            <th className="border border-red-300 bg-red-100 px-3 py-3 text-center text-red-700">{labels.no}</th>
            {hasNoApply ? <th className="border border-amber-300 bg-amber-100 px-3 py-3 text-center text-amber-800">{labels.na}</th> : null}
            <th className={cn('w-24 border px-3 py-3 text-center', accent.card, accent.border, accent.text)}>Valor</th>
            <th className={cn('w-10 border', accent.card, accent.border)} />
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: criteriaCount }, (_, index) => (
            <tr key={index} className={cn('transition-colors motion-safe:duration-500',highlightedRow===index?accent.panel:'')}>
              <td className="sticky left-0 z-10 border border-border bg-card p-1.5">
                <InstrumentTextarea
                  dataInstrumentRow={`lista-cotejo-${index}`}
                  placeholder={`${index + 1}. Criterio`}
                  value={fields[instrumentFieldKey('lista-cotejo', 'criterion', index)] ?? ''}
                  onChange={(value) => onFieldChange(instrumentFieldKey('lista-cotejo', 'criterion', index), value)}
                />
              </td>
              <td className="border border-emerald-200 bg-emerald-50/55 text-center"><span className="mx-auto block size-5 rounded-md border-2 border-emerald-500 bg-white shadow-sm" /></td>
              <td className="border border-red-200 bg-red-50/55 text-center"><span className="mx-auto block size-5 rounded-md border-2 border-red-400 bg-white shadow-sm" /></td>
              {hasNoApply ? <td className="border border-amber-200 bg-amber-50/55 text-center"><span className="mx-auto block size-5 rounded-md border-2 border-amber-500 bg-white shadow-sm" /></td> : null}
              <td className={cn('border p-1.5 text-center', accent.card, accent.border)}>{uniformPoints?<span className={cn('inline-flex rounded-lg px-2 py-2 font-black shadow-sm',accent.panel,accent.text)}>{fields[instrumentFieldKey('lista-cotejo','points',index)]??'0'} pts</span>:<InstrumentInput value={fields[instrumentFieldKey('lista-cotejo','points',index)]??''} onChange={(value)=>onFieldChange(instrumentFieldKey('lista-cotejo','points',index),value)} placeholder="0"/>}</td>
              <td className={cn('border bg-card', accent.border)}><InstrumentRowMenu canMoveDown={index<criteriaCount-1} canMoveUp={index>0} onDelete={()=>fields[instrumentFieldKey('lista-cotejo','criterion',index)]?.trim()?setPendingDelete(index):removeCriterion(index)} onDuplicate={()=>{if(criteriaCount>=20)return;const nextCount=criteriaCount+1;const next:Record<string,string>={...fields,'lista-cotejo:meta:criteriaCount':String(nextCount),[instrumentFieldKey('lista-cotejo','criterion',criteriaCount)]:`${fields[instrumentFieldKey('lista-cotejo','criterion',index)]||''} (copia)`};if(uniformPoints)distributeScore(maxScore,nextCount).forEach((points,row)=>{next[instrumentFieldKey('lista-cotejo','points',row)]=String(points)});else next[instrumentFieldKey('lista-cotejo','points',criteriaCount)]=fields[instrumentFieldKey('lista-cotejo','points',index)]||'0';onFieldsChange(next);onCriteriaCountChange(nextCount)}} onMoveDown={()=>onFieldsChange(swapInstrumentRows(fields,'lista-cotejo',index,index+1,['criterion','points']))} onMoveUp={()=>onFieldsChange(swapInstrumentRows(fields,'lista-cotejo',index,index-1,['criterion','points']))} /></td>
            </tr>
          ))}
          <tr className="font-bold"><td className={cn('border px-3 py-3', accent.card, accent.border, accent.text)} colSpan={3+(hasNoApply?1:0)}>Puntuación máxima total</td><td className={cn('border px-2 py-2 text-center', accent.card, accent.border, Math.abs(total - maxScore) < 0.001 ? 'text-emerald-700' : 'text-destructive')}>{total} / {maxScore} pts</td><td className={cn('border', accent.card, accent.border)} /></tr>
        </tbody>
      </InstrumentTable>
      {pendingDelete!==null?<ConfirmDialog title="¿Eliminar este criterio?" description={`Se eliminará “${fields[instrumentFieldKey('lista-cotejo','criterion',pendingDelete)]}” y sus datos asociados.`} confirmLabel="Eliminar criterio" destructive onClose={()=>setPendingDelete(null)} onConfirm={()=>{removeCriterion(pendingDelete);setPendingDelete(null)}}/>:null}
    </div>
  )
}

const weightedLabelTemplates = [
  { id: 'standard', title: 'Sí / Parcial / No', yes: 'Sí', partial: 'Parcial', no: 'No' },
  { id: 'cumplimiento', title: 'Cumple / Parcialmente / No cumple', yes: 'Cumple', partial: 'Cumple parcialmente', no: 'No cumple' },
  { id: 'logro', title: 'Logrado / En proceso / No logrado', yes: 'Logrado', partial: 'En proceso', no: 'No logrado' },
  { id: 'completo', title: 'Completo / Incompleto / No realizado', yes: 'Completo', partial: 'Incompleto', no: 'No realizado' },
  { id: 'personalizadas', title: 'Personalizadas', yes: '', partial: '', no: '' },
] as const

function weightedResponseVisual(index: number, count = 3) {
  return [
    { background: '#ecfdf5', border: '#a7f3d0', foreground: '#047857' },
    { background: '#fffbeb', border: '#fde68a', foreground: '#b45309' },
    { background: '#fef2f2', border: '#fecaca', foreground: '#b91c1c' },
  ][count === 2 && index === 1 ? 2 : Math.min(2, Math.max(0, index))]
}

type WeightedLabelTemplateId = (typeof weightedLabelTemplates)[number]['id']
type WeightedLabels = { yes: string; partial: string; no: string }

function inferWeightedLabelTemplate(labels: WeightedLabels): WeightedLabelTemplateId {
  const match = weightedLabelTemplates.find((template) => template.id !== 'personalizadas' && template.yes === labels.yes && template.partial === labels.partial && template.no === labels.no)
  return match?.id ?? 'personalizadas'
}

function weightedStatus(total: number) {
  if (!Number.isFinite(total)) return { label: 'Inválido', detail: 'Revisa los porcentajes: hay un valor no válido.', tone: 'error' as const }
  if (Math.abs(total - 100) < 0.001) return { label: 'Correcto', detail: 'Configuración correcta.', tone: 'success' as const }
  if (total < 100) return { label: 'Incompleto', detail: `Falta distribuir ${formatInstrumentNumber(100 - total)} %.`, tone: 'warning' as const }
  return { label: 'Excedido', detail: `Se excede por ${formatInstrumentNumber(total - 100)} %.`, tone: 'error' as const }
}

function WeightedListSettingsDrawer({
  accent,
  criteriaCount,
  decimals,
  fields,
  labels,
  maxScore,
  onApply,
  onClose,
  partial,
  partialValue,
}: {
  accent: (typeof blockAccents)[number]
  criteriaCount: number
  decimals: boolean
  fields: Record<string, string>
  labels: WeightedLabels
  maxScore: number
  onApply: (settings: { decimals: boolean; labels: WeightedLabels; partial: boolean; partialValue: number; redistribute: boolean; template: WeightedLabelTemplateId }) => void
  onClose: () => void
  partial: boolean
  partialValue: number
}) {
  const [draftPartial, setDraftPartial] = useState(partial)
  const [draftPartialValue, setDraftPartialValue] = useState(partialValue)
  const [draftDecimals, setDraftDecimals] = useState(decimals)
  const [draftLabels, setDraftLabels] = useState<WeightedLabels>(labels)
  const [draftTemplate, setDraftTemplate] = useState<WeightedLabelTemplateId>(() => {
    const stored = fields['lista-ponderada:meta:labelTemplate'] as WeightedLabelTemplateId
    return weightedLabelTemplates.some((template) => template.id === stored) ? stored : inferWeightedLabelTemplate(labels)
  })
  const [redistribute, setRedistribute] = useState(false)
  const weights = redistribute
    ? distributeScore(100, criteriaCount)
    : Array.from({ length: criteriaCount }, (_, index) => Number(fields[instrumentFieldKey('lista-ponderada', 'weight', index)] || 0))
  const effectiveTotal = Number(weights.reduce((sum, value) => sum + value, 0).toFixed(2))
  const status = weightedStatus(effectiveTotal)
  const firstCriterionIndex = Array.from({ length: criteriaCount }, (_, index) => index).find((index) => fields[instrumentFieldKey('lista-ponderada', 'criterion', index)]?.trim()) ?? 0
  const exampleWeight = weights[firstCriterionIndex] ?? 0
  const exampleMaximum = exampleWeight / 100 * maxScore
  const formatPoints = (value: number) => draftDecimals ? formatInstrumentNumber(value) : String(Math.round(value))
  const labelsValid = Boolean(draftLabels.yes.trim() && draftLabels.no.trim() && (!draftPartial || draftLabels.partial.trim()))
  const partialValid = !draftPartial || (Number.isFinite(draftPartialValue) && draftPartialValue > 0 && draftPartialValue < 100)
  const configurationValid = labelsValid && partialValid

  function selectTemplate(templateId: WeightedLabelTemplateId) {
    setDraftTemplate(templateId)
    const template = weightedLabelTemplates.find((item) => item.id === templateId)
    if (template && template.id !== 'personalizadas') setDraftLabels({ yes: template.yes, partial: template.partial, no: template.no })
  }

  return (
    <InstrumentSettingsDrawer
      accent={accent}
      applyDisabled={!configurationValid}
      description="Define el cumplimiento parcial, las etiquetas y las reglas de ponderación."
      onApply={() => onApply({ decimals: draftDecimals, labels: draftLabels, partial: draftPartial, partialValue: draftPartialValue, redistribute, template: draftTemplate })}
      onClose={onClose}
      panelClassName="max-w-[43rem]"
      title="Configurar lista ponderada"
    >
      <div className="space-y-6">
        <section>
          <p className={cn('mb-2 text-xs font-black uppercase tracking-[0.12em]', accent.text)}>1. Resumen</p>
          <div className={cn('grid grid-cols-2 gap-2 rounded-xl border p-2 sm:grid-cols-4', accent.card)}>
            <InstrumentSummaryItem label="Criterios" value={String(criteriaCount)} />
            <InstrumentSummaryItem label="Actividad" value={`${formatInstrumentNumber(maxScore)} puntos`} />
            <InstrumentSummaryItem label="Ponderación" value={`${formatInstrumentNumber(effectiveTotal)}/100 %`} good={Math.abs(effectiveTotal - 100) < 0.001} />
            <InstrumentSummaryItem label="Estado" value={status.label} good={status.tone === 'success'} />
          </div>
        </section>

        <section className="space-y-3">
          <p className={cn('text-xs font-black uppercase tracking-[0.12em]', accent.text)}>2. Grados de cumplimiento</p>
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
            <span><span className="block text-sm font-black text-foreground">Permitir cumplimiento parcial</span><span className="mt-0.5 block text-xs text-muted-foreground">Agrega una respuesta intermedia entre el cumplimiento total y el no cumplimiento.</span></span>
            <input className="peer sr-only" type="checkbox" checked={draftPartial} onChange={(event) => setDraftPartial(event.target.checked)} />
            <span className={cn('relative h-6 w-11 shrink-0 rounded-full bg-slate-300 transition-colors after:absolute after:left-1 after:top-1 after:size-4 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-focus-visible:ring-2', accent.ring, draftPartial ? `${accent.progress} after:translate-x-5` : '')} />
          </label>
          {draftPartial ? <label className="block text-xs font-bold text-muted-foreground">Valor del cumplimiento parcial (%)<div className="relative mt-1.5"><Input className="h-11 pr-10" type="number" min={1} max={99} value={draftPartialValue} onChange={(event) => setDraftPartialValue(Number(event.target.value))} /><span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-black text-muted-foreground">%</span></div>{!partialValid ? <span className="mt-1 block text-destructive">Debe ser mayor que 0 % y menor que 100 %.</span> : null}</label> : null}
          <div className={cn('rounded-xl border p-3 text-xs leading-5', accent.card)}>
            <div className="flex gap-2"><AlertCircle className={cn('mt-0.5 size-4 shrink-0', accent.text)} /><div><p><strong>{draftLabels.yes || 'Respuesta positiva'}</strong> otorga el 100 % del valor del criterio.</p>{draftPartial ? <p><strong>{draftLabels.partial || 'Respuesta parcial'}</strong> otorga el {formatInstrumentNumber(draftPartialValue)} %.</p> : null}<p><strong>{draftLabels.no || 'Respuesta negativa'}</strong> no otorga puntos.</p></div></div>
          </div>
        </section>

        <section className="space-y-3">
          <div><p className={cn('text-xs font-black uppercase tracking-[0.12em]', accent.text)}>3. Etiquetas de respuesta</p><p className="mt-1 text-xs text-muted-foreground">Selecciona una plantilla o crea etiquetas personalizadas.</p></div>
          <div className="grid gap-2 sm:grid-cols-2">
            {weightedLabelTemplates.map((template) => {
              const active = draftTemplate === template.id
              const summary = template.id === 'personalizadas' ? 'Define tus propios términos' : draftPartial ? template.title : `${template.yes} / ${template.no}`
              return <button key={template.id} type="button" className={cn('flex min-h-16 items-start gap-3 rounded-xl border bg-card p-3 text-left transition-all hover:-translate-y-px hover:shadow-sm', active ? accent.border : 'border-border')} style={active ? { backgroundColor: accent.cardTint, boxShadow: `inset 0 0 0 1px ${accent.progressColor}` } : undefined} onClick={() => selectTemplate(template.id)}><span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2" style={{ borderColor: active ? accent.progressColor : '#cbd5e1' }}>{active ? <span className="size-2.5 rounded-full" style={{ backgroundColor: accent.progressColor }} /> : null}</span><span><span className="block text-xs font-black text-foreground">{template.title}</span><span className="mt-1 block text-[11px] leading-4 text-muted-foreground">{summary}</span></span></button>
            })}
          </div>
          {draftTemplate === 'personalizadas' ? <div className={cn('grid gap-2 rounded-xl border p-3', accent.card, draftPartial ? 'sm:grid-cols-3' : 'sm:grid-cols-2')}><label className="text-[11px] font-bold text-muted-foreground">Respuesta positiva<Input className="mt-1 h-10 bg-card" value={draftLabels.yes} onChange={(event) => setDraftLabels((current) => ({ ...current, yes: event.target.value }))} /></label>{draftPartial ? <label className="text-[11px] font-bold text-muted-foreground">Respuesta parcial<Input className="mt-1 h-10 bg-card" value={draftLabels.partial} onChange={(event) => setDraftLabels((current) => ({ ...current, partial: event.target.value }))} /></label> : null}<label className="text-[11px] font-bold text-muted-foreground">Respuesta negativa<Input className="mt-1 h-10 bg-card" value={draftLabels.no} onChange={(event) => setDraftLabels((current) => ({ ...current, no: event.target.value }))} /></label></div> : null}
          {!labelsValid ? <p className="text-xs font-bold text-destructive">Completa todas las etiquetas visibles.</p> : null}
        </section>

        <section className="space-y-3">
          <div><p className={cn('text-xs font-black uppercase tracking-[0.12em]', accent.text)}>4. Ponderación</p><p className="mt-1 text-xs text-muted-foreground">La suma de los pesos debe ser exactamente 100 %.</p></div>
          <div className={cn('rounded-xl border p-4 transition-colors', status.tone === 'success' ? 'border-emerald-200 bg-emerald-50' : status.tone === 'warning' ? 'border-amber-200 bg-amber-50' : 'border-red-200 bg-red-50')}>
            <div className="flex flex-wrap items-center justify-between gap-3"><div><p className={cn('text-sm font-black', status.tone === 'success' ? 'text-emerald-800' : status.tone === 'warning' ? 'text-amber-800' : 'text-red-800')}>Ponderación actual: {formatInstrumentNumber(effectiveTotal)}/100 %</p><p className="mt-1 text-xs text-muted-foreground">{status.detail}</p></div><Button type="button" size="sm" variant="outline" onClick={() => setRedistribute(true)}><Dices className="size-4" />Redistribuir equitativamente</Button></div>
          </div>
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-border bg-card px-4 py-3 shadow-sm"><span><span className="block text-sm font-black text-foreground">Permitir valores decimales</span><span className="mt-0.5 block text-xs text-muted-foreground">Muestra hasta dos decimales en porcentajes y puntos equivalentes.</span></span><input className="peer sr-only" type="checkbox" checked={draftDecimals} onChange={(event) => setDraftDecimals(event.target.checked)} /><span className={cn('relative h-6 w-11 shrink-0 rounded-full bg-slate-300 transition-colors after:absolute after:left-1 after:top-1 after:size-4 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-focus-visible:ring-2', accent.ring, draftDecimals ? `${accent.progress} after:translate-x-5` : '')} /></label>
        </section>

        <section className="space-y-2">
          <div><p className={cn('text-xs font-black uppercase tracking-[0.12em]', accent.text)}>5. Vista previa de la ponderación</p><p className="mt-1 text-xs text-muted-foreground">Ejemplo de cómo se calculará un criterio durante la evaluación.</p></div>
          <div className="overflow-x-auto rounded-xl border border-border bg-card p-1">
            <div className="grid min-w-[37rem] gap-1 text-[10px]" style={{ gridTemplateColumns: `minmax(10rem,1.5fr) 5rem 6rem repeat(${draftPartial ? 3 : 2}, minmax(5rem,1fr))` }}>
              {['Criterio', 'Peso', 'Valor máx.', draftLabels.yes || 'Positiva', ...(draftPartial ? [draftLabels.partial || 'Parcial'] : []), draftLabels.no || 'Negativa'].map((label) => <div key={label} className={cn('rounded-lg border px-2 py-2 text-center font-black first:text-left', accent.card, accent.border)}>{label}</div>)}
              <div className="rounded-lg border border-border px-2 py-3 font-bold">{fields[instrumentFieldKey('lista-ponderada', 'criterion', firstCriterionIndex)] || 'Criterio de ejemplo'}</div><div className="rounded-lg border border-border px-2 py-3 text-center font-black">{formatInstrumentNumber(exampleWeight)} %</div><div className={cn('rounded-lg border px-2 py-3 text-center font-black', accent.card, accent.border, accent.text)}>{formatPoints(exampleMaximum)} pts</div><div className="rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-3 text-center font-black text-emerald-700">{formatPoints(exampleMaximum)} pts</div>{draftPartial ? <div className="rounded-lg border border-amber-200 bg-amber-50 px-2 py-3 text-center font-black text-amber-700">{formatPoints(exampleMaximum * draftPartialValue / 100)} pts</div> : null}<div className="rounded-lg border border-red-200 bg-red-50 px-2 py-3 text-center font-black text-red-700">0 pts</div>
            </div>
          </div>
        </section>
      </div>
    </InstrumentSettingsDrawer>
  )
}

function WeightedListInstrument({
  accent,
  criteriaCount,
  fields,
  hasPartial,
  maxScore,
  onFieldChange,
  onCriteriaCountChange,
  onFieldsChange,
  onHasPartialChange,
  typographyControls,
}: {
  accent: (typeof blockAccents)[number]
  criteriaCount: number
  fields: Record<string, string>
  hasPartial: boolean
  maxScore: number
  onFieldChange: (key: string, value: string) => void
  onCriteriaCountChange: (value: number) => void
  onFieldsChange: (fields: Record<string, string>) => void
  onHasPartialChange: (value: boolean) => void
  typographyControls: ReactNode
}) {
  const totalWeight = Number(Array.from({ length: criteriaCount }, (_, index) => Number(fields[instrumentFieldKey('lista-ponderada', 'weight', index)] || 0)).reduce((sum, value) => sum + value, 0).toFixed(2))
  const [configuring, setConfiguring] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<number | null>(null)
  const [highlightedRow, setHighlightedRow] = useState<number | null>(null)
  const labels = { yes: fields['lista-ponderada:meta:yesLabel'] || 'Sí', partial: fields['lista-ponderada:meta:partialLabel'] || 'Parcial', no: fields['lista-ponderada:meta:noLabel'] || 'No' }
  const decimals = fields['lista-ponderada:meta:decimals'] !== 'false'
  const partialValue = Number(fields['lista-ponderada:meta:partialValue'] || 50)
  const status = weightedStatus(totalWeight)

  function addCriterion() {
    if (criteriaCount >= 12) return
    const nextCount = criteriaCount + 1
    const next: Record<string, string> = { ...fields, 'lista-ponderada:meta:criteriaCount': String(nextCount) }
    distributeScore(100, nextCount).forEach((weight, row) => { next[instrumentFieldKey('lista-ponderada', 'weight', row)] = String(weight) })
    onFieldsChange(next)
    onCriteriaCountChange(nextCount)
    focusNewInstrumentRow('lista-ponderada', criteriaCount, setHighlightedRow)
  }

  function removeCriterion(index: number) {
    if (criteriaCount <= 1) return
    const nextCount = criteriaCount - 1
    const next = shiftInstrumentRows(fields, 'lista-ponderada', index, criteriaCount, ['criterion', 'indicator', 'weight', 'observation'])
    next['lista-ponderada:meta:criteriaCount'] = String(nextCount)
    distributeScore(100, nextCount).forEach((weight, row) => { next[instrumentFieldKey('lista-ponderada', 'weight', row)] = String(weight) })
    onFieldsChange(next)
    onCriteriaCountChange(nextCount)
  }

  function applyConfiguration(settings: { decimals: boolean; labels: WeightedLabels; partial: boolean; partialValue: number; redistribute: boolean; template: WeightedLabelTemplateId }) {
    const next: Record<string, string> = { ...fields, 'lista-ponderada:meta:partial': String(settings.partial), 'lista-ponderada:meta:partialValue': String(settings.partialValue), 'lista-ponderada:meta:observations': 'false', 'lista-ponderada:meta:decimals': String(settings.decimals), 'lista-ponderada:meta:labelTemplate': settings.template, 'lista-ponderada:meta:yesLabel': settings.labels.yes.trim(), 'lista-ponderada:meta:partialLabel': settings.labels.partial.trim(), 'lista-ponderada:meta:noLabel': settings.labels.no.trim() }
    Object.keys(next).filter((key) => key.startsWith('lista-ponderada:observation:')).forEach((key) => delete next[key])
    if (settings.redistribute) distributeScore(100, criteriaCount).forEach((weight, row) => { next[instrumentFieldKey('lista-ponderada', 'weight', row)] = String(weight) })
    onFieldsChange(next)
    onHasPartialChange(settings.partial)
    setConfiguring(false)
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2"><div><p className={cn('font-black', accent.text)}>Criterios y ponderaciones</p><p className="text-xs text-muted-foreground">Define los criterios, sus indicadores y el peso de cada uno dentro de la actividad.</p></div><div className="flex flex-wrap items-center gap-2">{typographyControls}<Button type="button" size="sm" variant="outline" onClick={() => setConfiguring(true)}><Settings className="size-4" />Configurar lista</Button><Button type="button" size="sm" className={accent.button} onClick={addCriterion} disabled={criteriaCount >= 12}><Plus className="size-4" />Agregar criterio</Button></div></div>
      {configuring ? <WeightedListSettingsDrawer accent={accent} criteriaCount={criteriaCount} decimals={decimals} fields={fields} labels={labels} maxScore={maxScore} onApply={applyConfiguration} onClose={() => setConfiguring(false)} partial={hasPartial} partialValue={partialValue} /> : null}
      <InstrumentTable>
        <thead className="sticky top-0 z-20 text-[10px] font-bold uppercase text-slate-700">
          <tr>
            <th className={cn('w-10 border px-2 py-2 text-center', accent.card, accent.border)}>#</th>
            <th className={cn('w-[25%] border px-3 py-2', accent.card, accent.border)}>Criterio</th>
            <th className={cn('w-[39%] border px-3 py-2', accent.card, accent.border)}>Indicador observable</th>
            <th className={cn('w-28 border px-3 py-2 text-center', accent.card, accent.border)}>Ponderación</th>
            <th className={cn('w-28 border px-3 py-2 text-center', accent.card, accent.border)}>Valor máximo</th>
            <th className={cn('w-12 border px-2 py-2 text-center', accent.card, accent.border)}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: criteriaCount }, (_, index) => (
            <tr key={index} className={cn('transition-colors motion-safe:duration-500', highlightedRow === index ? accent.panel : '')}>
              <td className={cn('border bg-card text-center', accent.border)}><span className={cn('mx-auto grid size-7 place-items-center rounded-full text-xs font-black text-white', accent.progress)}>{index + 1}</span></td>
              <td className={cn('border bg-card p-1.5', accent.border)}>
                <InstrumentTextarea
                  className="font-bold"
                  dataInstrumentRow={`lista-ponderada-${index}`}
                  placeholder={`Criterio ${index + 1}`}
                  value={fields[instrumentFieldKey('lista-ponderada', 'criterion', index)] ?? ''}
                  onChange={(value) => onFieldChange(instrumentFieldKey('lista-ponderada', 'criterion', index), value)}
                />
              </td>
              <td className={cn('border bg-card p-1.5', accent.border)}>
                <InstrumentTextarea
                  className="text-muted-foreground"
                  placeholder="Describe la evidencia observable de este criterio"
                  value={fields[instrumentFieldKey('lista-ponderada', 'indicator', index)] ?? ''}
                  onChange={(value) => onFieldChange(instrumentFieldKey('lista-ponderada', 'indicator', index), value)}
                />
              </td>
              <td className={cn('border bg-card p-1.5', accent.border)}><div className="relative"><InstrumentInput placeholder="0" value={fields[instrumentFieldKey('lista-ponderada', 'weight', index)] ?? ''} onChange={(value) => onFieldChange(instrumentFieldKey('lista-ponderada', 'weight', index), value)} /><span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs font-black text-muted-foreground">%</span></div></td>
              <td className={cn('border p-1.5 text-center', accent.card, accent.border)}><span className={cn('inline-flex min-w-20 items-center justify-center rounded-lg bg-card px-2 py-2 font-black shadow-sm', accent.text)}>{decimals ? formatInstrumentNumber(Number(fields[instrumentFieldKey('lista-ponderada', 'weight', index)] || 0) / 100 * maxScore) : Math.round(Number(fields[instrumentFieldKey('lista-ponderada', 'weight', index)] || 0) / 100 * maxScore)} pts</span></td>
              <td className={cn('border bg-card', accent.border)}><InstrumentRowMenu canMoveDown={index < criteriaCount - 1} canMoveUp={index > 0} onDelete={() => fields[instrumentFieldKey('lista-ponderada', 'criterion', index)]?.trim() || fields[instrumentFieldKey('lista-ponderada', 'indicator', index)]?.trim() ? setPendingDelete(index) : removeCriterion(index)} onDuplicate={() => { if (criteriaCount >= 12) return; const nextCount = criteriaCount + 1; const next = { ...fields, 'lista-ponderada:meta:criteriaCount': String(nextCount), [instrumentFieldKey('lista-ponderada', 'criterion', criteriaCount)]: `${fields[instrumentFieldKey('lista-ponderada', 'criterion', index)] || ''} (copia)`, [instrumentFieldKey('lista-ponderada', 'indicator', criteriaCount)]: fields[instrumentFieldKey('lista-ponderada', 'indicator', index)] || '' }; distributeScore(100, nextCount).forEach((weight, row) => { next[instrumentFieldKey('lista-ponderada', 'weight', row)] = String(weight) }); onFieldsChange(next); onCriteriaCountChange(nextCount) }} onMoveDown={() => onFieldsChange(swapInstrumentRows(fields, 'lista-ponderada', index, index + 1, ['criterion', 'indicator', 'weight', 'observation']))} onMoveUp={() => onFieldsChange(swapInstrumentRows(fields, 'lista-ponderada', index, index - 1, ['criterion', 'indicator', 'weight', 'observation']))} /></td>
            </tr>
          ))}
          <tr className="font-bold">
            <td className={cn('border px-3 py-3', accent.card, accent.border, accent.text)} colSpan={3}><span className="inline-flex items-center gap-2"><CheckCircle2 className="size-4" />Ponderación máxima total</span><span className="ml-2 text-[10px] font-medium text-muted-foreground">{status.detail}</span></td>
            <td className={cn('border px-2 py-2 text-center', accent.card, accent.border, status.tone === 'success' ? 'text-emerald-700' : status.tone === 'warning' ? 'text-amber-700' : 'text-destructive')}>{formatInstrumentNumber(totalWeight)}/100 %</td>
            <td className={cn('border px-2 py-2 text-center font-black', accent.card, accent.border, accent.text)}>{formatInstrumentNumber(maxScore)} pts</td>
            <td className={cn('border', accent.card, accent.border)} />
          </tr>
        </tbody>
      </InstrumentTable>
      {pendingDelete !== null ? <ConfirmDialog title="¿Eliminar este criterio?" description={`Se eliminará “${fields[instrumentFieldKey('lista-ponderada', 'criterion', pendingDelete)]}”, su indicador y ponderación.`} confirmLabel="Eliminar criterio" destructive onClose={() => setPendingDelete(null)} onConfirm={() => { removeCriterion(pendingDelete); setPendingDelete(null) }} /> : null}
    </div>
  )
}

function InstrumentRowMenu({ canMoveDown, canMoveUp, onDelete, onDuplicate, onMoveDown, onMoveUp }: { canMoveDown: boolean; canMoveUp: boolean; onDelete: () => void; onDuplicate: () => void; onMoveDown: () => void; onMoveUp: () => void }) {
  const [open, setOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node
      if (!buttonRef.current?.contains(target) && !popupRef.current?.contains(target)) setOpen(false)
    }
    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    function closeOnViewportChange() { setOpen(false) }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', closeOnViewportChange)
    window.addEventListener('scroll', closeOnViewportChange, true)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', closeOnViewportChange)
      window.removeEventListener('scroll', closeOnViewportChange, true)
    }
  }, [open])

  function toggleMenu() {
    if (open) { setOpen(false); return }
    const rect = buttonRef.current?.getBoundingClientRect()
    if (!rect) return
    const menuHeight = 178
    const viewportPadding = 8
    const gap = 4
    const spaceBelow = window.innerHeight - rect.bottom
    const openUpward = spaceBelow < menuHeight + gap && rect.top > spaceBelow
    const desiredTop = openUpward ? rect.top - menuHeight - gap : rect.bottom + gap
    setMenuPosition({
      top: Math.min(Math.max(viewportPadding, desiredTop), window.innerHeight - menuHeight - viewportPadding),
      right: Math.max(viewportPadding, window.innerWidth - rect.right),
    })
    setOpen(true)
  }

  function runAction(action: () => void) {
    action()
    setOpen(false)
  }

  const popup = open ? <div ref={popupRef} role="menu" className="fixed z-[100] w-44 overflow-hidden rounded-lg border border-border bg-popover p-1 text-left shadow-xl" style={{ top: menuPosition.top, right: menuPosition.right }}><button type="button" role="menuitem" className="flex w-full items-center gap-2 rounded px-2 py-2 text-xs font-bold hover:bg-muted" onClick={() => runAction(onDuplicate)}><Copy className="size-3.5" />Duplicar</button><button type="button" role="menuitem" disabled={!canMoveUp} className="flex w-full items-center gap-2 rounded px-2 py-2 text-xs font-bold hover:bg-muted disabled:opacity-40" onClick={() => runAction(onMoveUp)}><ArrowUp className="size-3.5" />Mover arriba</button><button type="button" role="menuitem" disabled={!canMoveDown} className="flex w-full items-center gap-2 rounded px-2 py-2 text-xs font-bold hover:bg-muted disabled:opacity-40" onClick={() => runAction(onMoveDown)}><ArrowDown className="size-3.5" />Mover abajo</button><div className="my-1 h-px bg-border"/><button type="button" role="menuitem" className="flex w-full items-center gap-2 rounded px-2 py-2 text-xs font-bold text-destructive hover:bg-red-50" onClick={() => runAction(onDelete)}><Trash2 className="size-3.5" />Eliminar</button></div> : null
  return <div className="mx-auto w-fit"><button ref={buttonRef} type="button" aria-label="Acciones de la fila" aria-haspopup="menu" aria-expanded={open} className={cn('grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary', open ? 'bg-muted text-foreground' : '')} onClick={toggleMenu}><EllipsisVertical className="size-4" /></button>{popup ? createPortal(popup, document.body) : null}</div>
}

function focusNewInstrumentRow(type: string, index: number, setHighlightedRow: Dispatch<SetStateAction<number | null>>) {
  setHighlightedRow(index)
  window.setTimeout(() => {
    const field = document.querySelector<HTMLTextAreaElement>(`[data-instrument-row="${type}-${index}"]`)
    field?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' })
    field?.focus()
  }, 50)
  window.setTimeout(() => setHighlightedRow(null), 1300)
}

function shiftInstrumentRows(fields: Record<string, string>, type: string, removedIndex: number, count: number, fieldNames: string[]) {
  const next = { ...fields }
  for (let index = removedIndex; index < count - 1; index += 1) fieldNames.forEach((field) => { next[instrumentFieldKey(type, field, index)] = next[instrumentFieldKey(type, field, index + 1)] || '' })
  fieldNames.forEach((field) => { delete next[instrumentFieldKey(type, field, count - 1)] })
  return next
}

function swapInstrumentRows(fields: Record<string, string>, type: string, from: number, to: number, fieldNames: string[]) {
  if (to < 0) return fields
  const next = { ...fields }
  fieldNames.forEach((field) => { const fromKey=instrumentFieldKey(type,field,from); const toKey=instrumentFieldKey(type,field,to); const value=next[fromKey]||''; next[fromKey]=next[toKey]||''; next[toKey]=value })
  return next
}

function scaleTemplateLevels(template: string) {
  if (template === 'desempeno') return [{ name: 'Excelente', points: 4 }, { name: 'Bueno', points: 3 }, { name: 'Satisfactorio', points: 2 }, { name: 'Insuficiente', points: 1 }]
  if (template === 'logro') return [{ name: 'Logrado', points: 4 }, { name: 'En proceso', points: 3 }, { name: 'Inicial', points: 2 }, { name: 'No logrado', points: 1 }]
  return [{ name: 'Siempre', points: 4 }, { name: 'Casi siempre', points: 3 }, { name: 'A veces', points: 2 }, { name: 'Nunca', points: 1 }]
}

function rubricDefaultLevelNames(count: number) {
  if (count === 2) return ['Logrado', 'En proceso']
  if (count === 3) return ['Excelente', 'Satisfactorio', 'Insuficiente']
  if (count === 4) return ['Excelente', 'Bueno', 'Satisfactorio', 'Insuficiente']
  if (count === 5) return ['Excelente', 'Muy bueno', 'Bueno', 'Básico', 'Insuficiente']
  if (count === 6) return ['Excelente', 'Muy bueno', 'Bueno', 'Satisfactorio', 'Básico', 'Insuficiente']
  return Array.from({ length: count }, (_, index) => `Nivel ${index + 1}`)
}

function defaultRubricLevelPoints(maximum: number, count: number) {
  const safeMaximum = Math.max(0, Number(maximum) || 0)
  if (count <= 1) return [safeMaximum]
  if (safeMaximum >= count) return Array.from({ length: count }, (_, index) => Number((index === count - 1 ? Math.min(1, safeMaximum) : Math.max(1, safeMaximum - index)).toFixed(2)))
  return Array.from({ length: count }, (_, index) => {
    if (index === 0) return Number(safeMaximum.toFixed(2))
    if (index === count - 1) return Number(Math.max(0, safeMaximum / count).toFixed(2))
    return Number(Math.max(0, safeMaximum * ((count - index) / count)).toFixed(2))
  })
}

function criterionPointsMaximum(fields: Record<string, string>, criteriaCount: number, maxScore: number) {
  return Number(fields[instrumentFieldKey('rubrica', 'points', 0)] || distributeScore(maxScore, criteriaCount)[0] || maxScore)
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

function InstrumentCheckPlaceholder({ tone = 'default' }: { tone?: 'default' | 'positive' | 'negative' | 'neutral' }) {
  return (
    <span
      aria-hidden="true"
      className={cn('mx-auto block size-4 rounded border-2 bg-card shadow-sm', tone === 'positive' ? 'border-emerald-500' : tone === 'negative' ? 'border-red-400' : tone === 'neutral' ? 'border-amber-500' : 'border-muted-foreground/70')}
    />
  )
}

function InstrumentTable({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-auto rounded-xl border border-border bg-slate-50/60 p-1 shadow-sm">
      <table className="min-w-[42rem] w-full border-separate border-spacing-1 text-left text-xs [&_td]:rounded-lg [&_th]:rounded-lg">
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
  dataInstrumentRow,
  onChange,
  placeholder = '',
  value,
}: {
  className?: string
  dataInstrumentRow?: string
  onChange?: (value: string) => void
  placeholder?: string
  value?: string
}) {
  return (
    <textarea
      data-instrument-row={dataInstrumentRow}
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
      <div className="relative" onMouseEnter={() => setShowOptions(true)} onMouseLeave={() => setShowOptions(false)}>
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
      <div className="space-y-2" onMouseEnter={() => setShowMyResources(true)} onMouseLeave={() => setShowMyResources(false)}>
        <button type="button" className="flex w-full items-center justify-between rounded-lg border border-blue-200 bg-blue-50/30 px-3 py-2.5 text-left text-sm font-black text-blue-600 transition hover:border-blue-300 hover:bg-blue-50/70" onClick={() => { setShowMyResources((value) => !value); setShowOptions(false) }}>
          <span className="flex items-center gap-2.5"><span className="grid size-8 place-items-center rounded-lg bg-blue-50"><Plus className="size-4" /></span><span><span className="block">Mis recursos</span><span className="mt-0.5 block text-xs font-medium text-blue-600/70">{customResources.length} recursos personalizados</span></span></span>
          <ChevronDown className={cn('size-4 transition', showMyResources ? 'rotate-180' : '')} />
        </button>
        {showMyResources ? <div className="rounded-lg border border-blue-100 bg-blue-50/20 p-3">{customResources.length ? <div className="flex flex-wrap gap-1.5">{customResources.map(resourceButton)}</div> : <p className="text-xs text-blue-600/70">Los recursos personalizados que agregues aparecerán aquí.</p>}</div> : null}
      </div>
      {showBank ? (
        <div className="rounded-xl border border-border bg-muted/10 p-2" onMouseLeave={() => { setShowBank(false); setExpandedCategory(null) }}>
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
  if (value === 'inicio') return 'Inicio'
  if (value === 'desarrollo') return 'Desarrollo'
  if (value === 'cierre') return 'Cierre'
  return 'Sin definir'
}

function activityRubricConfiguration(activity: GradingActivity) {
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
    maximum: Number(fields[instrumentFieldKey('rubrica', 'points', index)] || distributeScore(activity.maxScore, criteriaCount)[index] || 0),
  }))
  const levels = Array.from({ length: levelCount }, (_, index) => {
    const score = levelCount - index
    return { label: fields[instrumentFieldKey('rubrica', 'level-name', score)] || rubricDefaultLevelNames(levelCount)[index], points: Number(fields[instrumentFieldKey('rubrica', 'level-points', score)] || defaultRubricLevelPoints(criteria[0]?.maximum || activity.maxScore, levelCount)[index]) }
  })
  return { criteria, levels }
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
  indicatorGradient,
  value,
}: {
  className?: string
  indicatorClassName?: string
  indicatorColor?: string
  indicatorGradient?: string
  value: number
}) {
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-muted', className)}>
      <div
        className={cn('h-full rounded-full bg-primary transition-all', indicatorClassName)}
        style={{
          background: indicatorGradient || indicatorColor,
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
    const levelNames = Array.from({ length: rubricLevels }, (_, index) => fields[instrumentFieldKey('rubrica', 'level-name', rubricLevels - index)]?.trim().toLocaleLowerCase() || '')
    const levelPoints = Array.from({ length: rubricLevels }, (_, index) => Number(fields[instrumentFieldKey('rubrica', 'level-points', rubricLevels - index)]))
    if (levelNames.some((name) => !name) || new Set(levelNames).size !== levelNames.length) return false
    if (levelPoints.some((points) => !Number.isFinite(points) || points < 0) || levelPoints.some((points, index) => index > 0 && points >= levelPoints[index - 1])) return false
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
    const levelCount = Number(fields['escala:meta:levelCount']) || 4
    const levelNames = Array.from({ length: levelCount }, (_, index) => fields[instrumentFieldKey('escala', 'level-name', levelCount - index)]?.trim().toLocaleLowerCase() || '')
    if (levelNames.some((name) => !name) || new Set(levelNames).size !== levelNames.length) return false
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
    const weights = Array.from({ length: weightedCriteria }, (_, index) => Number(fields[instrumentFieldKey('lista-ponderada', 'weight', index)] || 0))
    if (weights.some((weight) => !Number.isFinite(weight) || weight < 0)) return false
    const assignedWeight = weights.reduce((sum, value) => sum + value, 0)
    if (Math.abs(assignedWeight - 100) >= 0.001) return false
    const hasPartial = fields['lista-ponderada:meta:partial'] !== 'false'
    const partialValue = Number(fields['lista-ponderada:meta:partialValue'] || 50)
    if (hasPartial && (!Number.isFinite(partialValue) || partialValue <= 0 || partialValue >= 100)) return false
    if (!(fields['lista-ponderada:meta:yesLabel'] || 'Sí').trim() || !(fields['lista-ponderada:meta:noLabel'] || 'No').trim()) return false
    if (hasPartial && !(fields['lista-ponderada:meta:partialLabel'] || 'Parcial').trim()) return false
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
    const instrumentIssue = describeInstrumentIncomplete(draft)
    issues.push({ detail: instrumentIssue.detail, tab: 'instrument', target: 'instrumentBody', title: instrumentIssue.title })
  }
  if (!activityDescriptionText(draft.description).trim()) {
    issues.push({ detail: 'Describe que haran los estudiantes y que evidencia entregaran.', tab: 'activity', target: 'description', title: 'Descripcion de la actividad' })
  }

  return issues
}

function describeInstrumentIncomplete(draft: ActivityDraft) {
  const fields = draft.instrumentFields
  const type = draft.instrumentType
  const maxScore = Number(draft.maxScore) || 0
  const count = Number(fields[`${type}:meta:criteriaCount`]) || inferInstrumentCount(fields, type, 'criterion', 0)
  const emptyCriteria = Array.from({ length: count }, (_, index) => fields[instrumentFieldKey(type, 'criterion', index)]?.trim()).filter((value) => !value).length
  if (emptyCriteria > 0) return { title: `Falta completar ${emptyCriteria} ${type === 'escala' ? 'indicadores' : 'criterios'}`, detail: 'Escribe el contenido de las filas vacías para completar el instrumento.' }
  if (type === 'rubrica') {
    const levels = Number(fields['rubrica:meta:levelCount']) || inferRubricLevels(fields, 4)
    const missingDescriptors = Array.from({ length: count }, (_, criterion) => Array.from({ length: levels }, (_, level) => fields[instrumentFieldKey(type, 'descriptor', criterion, level + 1)]?.trim())).flat().filter((value) => !value).length
    if (missingDescriptors > 0) return { title: `Falta completar ${missingDescriptors} descriptores`, detail: 'Completa las celdas vacías de la matriz de desempeño.' }
  }
  if (type === 'lista-ponderada') {
    const total = instrumentConfiguredValue(type, fields, count)
    return { title: 'Falta validar la ponderación', detail: `La ponderación actual es ${formatInstrumentNumber(total)}/100 %. Ajusta ${formatInstrumentNumber(Math.abs(100 - total))} %.` }
  }
  const total = instrumentConfiguredValue(type, fields, count)
  if (Math.abs(total - maxScore) >= 0.001) return { title: 'Falta validar la puntuación', detail: `El instrumento suma ${formatInstrumentNumber(total)}/${formatInstrumentNumber(maxScore)} puntos.` }
  return { title: 'Instrumento incompleto', detail: 'Revisa el título, los niveles y los contenidos requeridos.' }
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
