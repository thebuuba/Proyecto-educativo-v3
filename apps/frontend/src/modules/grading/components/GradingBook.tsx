import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  ClipboardList,
  Plus,
  Settings,
  Trophy,
} from 'lucide-react'
import { useEffect, useMemo, useState, type KeyboardEvent, type ReactNode } from 'react'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Drawer } from '@/components/ui/Drawer'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
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
}

type MainView = 'blocks' | 'period' | 'annual' | 'final'
type DetailView = { type: 'block'; blockId: CompetencyBlockId } | { type: 'activity'; activityId: string }

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
  b2: 'Pensamiento lógico',
  b3: 'Ética y ciudadanía',
  b4: 'Científica y tecnológica',
}

type ActivityDraft = {
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
}

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
  planningMoment: '',
  observations: '',
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
  initialView = 'blocks',
  onAddActivity,
  onUpdateActivity,
  onDeleteActivity,
  onSaveScore,
  onSaveRecovery,
  loadFinalRecords,
  getActivitiesForPeriod,
}: GradingBookProps) {
  const [mainView, setMainView] = useState<MainView>(initialView)
  const [detailView, setDetailView] = useState<DetailView | null>(null)
  const [showConfig, setShowConfig] = useState(false)
  const [showActivityManager, setShowActivityManager] = useState(false)
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null)
  const [activityDraft, setActivityDraft] = useState(emptyActivityDraft)
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
  const selectedActivity = detailView?.type === 'activity'
    ? activities.find((activity) => activity.id === detailView.activityId) ?? null
    : null

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

  function saveActivityDraft() {
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
    }

    if (editingActivityId) {
      onUpdateActivity({ ...activity, id: editingActivityId })
      setEditingActivityId(null)
    } else {
      onAddActivity(activity)
    }
    setActivityDraft(emptyActivityDraft)
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
    })
    setShowActivityManager(true)
  }

  if (students.length === 0) {
    return (
      <div className="flex min-h-[280px] items-center justify-center rounded-lg border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
        Este curso todavía no tiene estudiantes matriculados.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-sm xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap gap-2">
          <ViewButton active={mainView === 'blocks'} icon={<BookOpen className="size-4" />} label="Bloques" onClick={() => { setMainView('blocks'); setDetailView(null) }} />
          <ViewButton active={mainView === 'period'} icon={<ClipboardList className="size-4" />} label="Resumen del período" onClick={() => { setMainView('period'); setDetailView(null) }} />
          <ViewButton active={mainView === 'annual'} icon={<CalendarDays className="size-4" />} label="Vista anual" onClick={() => { setMainView('annual'); setDetailView(null) }} />
          <ViewButton active={mainView === 'final'} icon={<Trophy className="size-4" />} label="Resultado anual" onClick={() => { setMainView('final'); setDetailView(null) }} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone="muted" className="h-10 rounded-xl px-3">
            {periodShortName}
          </Badge>
          <Button variant="outline" onClick={() => setShowConfig(true)}>
            <Settings className="size-4" />
            Configurar cálculo
          </Button>
          <Button onClick={() => setShowActivityManager(true)}>
            <Plus className="size-4" />
            Agregar actividad
          </Button>
        </div>
      </div>

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
            saving={saving}
            students={students}
          />
        ) : null
      ) : mainView === 'blocks' ? (
        <BlockMatrixView
          blockSummaries={blockSummaries}
          config={config}
          onOpenBlock={(blockId) => setDetailView({ type: 'block', blockId })}
          onOpenActivity={(activityId) => setDetailView({ type: 'activity', activityId })}
          records={records}
          students={students}
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

      {showActivityManager ? (
        <Drawer title="Gestionar actividades" eyebrow="Calificaciones" onClose={() => setShowActivityManager(false)}>
          <ActivityManager
            activityDraft={activityDraft}
            activities={activities}
            editingActivityId={editingActivityId}
            onCancelEdit={() => {
              setEditingActivityId(null)
              setActivityDraft(emptyActivityDraft)
            }}
            onChangeDraft={setActivityDraft}
            onDeleteActivity={onDeleteActivity}
            onEditActivity={editActivity}
            onSaveActivity={saveActivityDraft}
            saving={saving}
          />
        </Drawer>
      ) : null}

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
}: {
  active: boolean
  icon: ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <Button variant={active ? 'primary' : 'ghost'} className="h-10" onClick={onClick}>
      {icon}
      {label}
    </Button>
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
  onOpenBlock: (blockId: CompetencyBlockId) => void
  onOpenActivity: (activityId: string) => void
  records: GradeRecordRow[]
  students: StudentGradeRow[]
}) {
  return (
    <div className="grid gap-4 2xl:grid-cols-2">
      {blockSummaries.map((summary) => {
        const accent = blockAccents[summary.index]
        return (
          <article key={summary.block.id} className={cn('rounded-lg border bg-card p-4 shadow-sm', accent.card)}>
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
  onBack,
  onOpenActivity,
  onSaveRecovery,
  onSaveScore,
  records,
  recoveryLabel,
  recoveryScores,
  saving,
  students,
}: {
  blockId: CompetencyBlockId
  activities: GradingActivity[]
  config: GradeCalculationConfig
  courseTitle: string
  onBack: () => void
  onOpenActivity: (activityId: string) => void
  onSaveRecovery: (enrollmentId: string, blockId: string, value: string) => void
  onSaveScore: (enrollmentId: string, activity: GradingActivity, value: string) => void
  records: GradeRecordRow[]
  recoveryLabel: string
  recoveryScores: RecoveryScores
  saving: boolean
  students: StudentGradeRow[]
}) {
  const block = competencyBlocks.find((item) => item.id === blockId) ?? competencyBlocks[0]
  const blockIndex = competencyBlocks.findIndex((item) => item.id === blockId)
  const accent = blockAccents[blockIndex]
  const studentTotals = students.map((student) => {
    const total = blockTotal({ records, activities, enrollmentId: student.enrollmentId, blockId, config })
    const recovery = recoveryScores[blockId]?.[student.enrollmentId] ?? null
    return effectivePeriodScore(total, recovery, config)
  })
  const average = averageNumbers(studentTotals.filter((value) => value > 0))

  return (
    <div className="space-y-4">
      <div className={cn('rounded-lg border p-4 shadow-sm', accent.card)}>
        <button className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline" onClick={onBack}>
          <ArrowLeft className="size-4" />
          Volver a bloques
        </button>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
          {courseTitle} &gt; Bloque {blockIndex + 1}
        </p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary">{blockShortNames[block.id]}</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{block.name}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-3xl font-black text-primary">{formatGrade(average)} / {config.expectedBlockTotal}</p>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Promedio del bloque</p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-max border-separate border-spacing-0 text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="sticky left-0 z-30 min-w-[16rem] border-b border-r border-border bg-muted px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  Actividad
                </th>
                <th className="w-24 border-b border-r border-border px-3 py-3 text-center text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  Valor
                </th>
                {students.map((student) => (
                  <th key={student.enrollmentId} className="min-w-[7rem] border-b border-r border-border px-3 py-3 text-center text-xs font-bold uppercase text-muted-foreground">
                    {student.firstName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activities.length === 0 ? (
                <tr>
                  <td colSpan={students.length + 2} className="px-4 py-8 text-center text-muted-foreground">
                    Este bloque todavía no tiene actividades.
                  </td>
                </tr>
              ) : activities.map((activity) => (
                <tr key={activity.id} className="group hover:bg-muted/20">
                  <td className="sticky left-0 z-20 border-b border-r border-border bg-card px-4 py-3 group-hover:bg-muted/20">
                    <button className="text-left font-bold text-primary hover:underline" onClick={() => onOpenActivity(activity.id)}>
                      {activity.name}
                    </button>
                    <p className="mt-1 text-xs text-muted-foreground">{activity.evaluationTechnique || activity.instrumentType || 'Sin técnica registrada'}</p>
                  </td>
                  <td className="border-b border-r border-border px-3 py-3 text-center font-bold text-primary">
                    {activity.maxScore}
                  </td>
                  {students.map((student) => {
                    const record = scoreForActivity(records, student.enrollmentId, activity.id)
                    return (
                      <td key={student.enrollmentId} className="border-b border-r border-border p-1 text-center">
                        <Input
                          type="number"
                          min={0}
                          max={activity.maxScore}
                          step="0.01"
                          defaultValue={record?.score ?? ''}
                          disabled={saving}
                          className="grade-cell h-9 w-20 rounded-md border-border/70 bg-card px-2 text-center text-sm font-bold focus:bg-background"
                          onKeyDown={focusNextGradeCell}
                          onBlur={(event) => onSaveScore(student.enrollmentId, activity, event.target.value)}
                        />
                      </td>
                    )
                  })}
                </tr>
              ))}
              <tr className="bg-muted/35">
                <td className="sticky left-0 z-20 border-r border-border bg-muted px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-primary">
                  Total estudiante
                </td>
                <td className="border-r border-border px-3 py-3 text-center font-black text-primary">
                  {sumActivityMaxScore(activities, blockId)}
                </td>
                {students.map((student) => {
                  const total = blockTotal({ records, activities, enrollmentId: student.enrollmentId, blockId, config })
                  const recovery = recoveryScores[blockId]?.[student.enrollmentId] ?? null
                  const effectiveTotal = effectivePeriodScore(total, recovery, config)
                  return (
                    <td key={student.enrollmentId} className="border-r border-border px-3 py-3 text-center">
                      <p className="font-black text-primary">{formatGrade(effectiveTotal)}</p>
                      {config.showRecovery ? (
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          step="0.01"
                          defaultValue={recovery ?? ''}
                          disabled={saving}
                          placeholder={recoveryLabel || 'RP'}
                          className="grade-cell mt-2 h-8 w-20 rounded-md border-border/70 bg-card px-2 text-center text-xs"
                          onKeyDown={focusNextGradeCell}
                          onBlur={(event) => onSaveRecovery(student.enrollmentId, blockId, event.target.value)}
                        />
                      ) : null}
                    </td>
                  )
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function ActivityDetailView({
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
            <p className="mt-1 text-sm text-muted-foreground">{activity.description || 'Actividad sin descripción registrada.'}</p>
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
              <p>{activity.description || 'No hay descripción detallada para esta actividad.'}</p>
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
  onEditActivity,
  onSaveActivity,
  saving,
}: {
  activityDraft: ActivityDraft
  activities: GradingActivity[]
  editingActivityId: string | null
  onCancelEdit: () => void
  onChangeDraft: (draft: ActivityDraft) => void
  onDeleteActivity: (activityId: string) => void
  onEditActivity: (activity: GradingActivity) => void
  onSaveActivity: () => void
  saving: boolean
}) {
  return (
    <div className="grid gap-3">
      <Select value={activityDraft.competencyBlockId} onChange={(event) => onChangeDraft({ ...activityDraft, competencyBlockId: event.target.value })}>
        {competencyBlocks.map((block) => (
          <option key={block.id} value={block.id}>{block.shortName} · {block.name}</option>
        ))}
      </Select>
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_8rem]">
        <Input value={activityDraft.name} onChange={(event) => onChangeDraft({ ...activityDraft, name: event.target.value })} placeholder="Nombre de la actividad" />
        <Input type="number" min={1} value={activityDraft.maxScore} onChange={(event) => onChangeDraft({ ...activityDraft, maxScore: event.target.value })} placeholder="Valor" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Input type="date" value={activityDraft.date} onChange={(event) => onChangeDraft({ ...activityDraft, date: event.target.value })} />
        <Input value={activityDraft.evaluationTechnique} onChange={(event) => onChangeDraft({ ...activityDraft, evaluationTechnique: event.target.value })} placeholder="Técnica de evaluación" />
        <Select value={activityDraft.instrumentType} onChange={(event) => onChangeDraft({ ...activityDraft, instrumentType: event.target.value })}>
          <option value="">Instrumento</option>
          <option value="rubrica">Rúbrica</option>
          <option value="lista-cotejo">Lista de cotejo</option>
          <option value="escala">Escala estimativa</option>
          <option value="prueba">Prueba escrita</option>
          <option value="otro">Otro</option>
        </Select>
      </div>
      <Input value={activityDraft.description} onChange={(event) => onChangeDraft({ ...activityDraft, description: event.target.value })} placeholder="Descripción" />
      <div className="grid gap-3 sm:grid-cols-2">
        <Input value={activityDraft.studentRole} onChange={(event) => onChangeDraft({ ...activityDraft, studentRole: event.target.value })} placeholder="Rol del estudiante" />
        <Input value={activityDraft.teacherRole} onChange={(event) => onChangeDraft({ ...activityDraft, teacherRole: event.target.value })} placeholder="Rol del docente" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Select value={activityDraft.planningMoment} onChange={(event) => onChangeDraft({ ...activityDraft, planningMoment: event.target.value })}>
          <option value="">Momento de planificación</option>
          <option value="inicio">Inicio</option>
          <option value="desarrollo">Desarrollo</option>
          <option value="cierre">Cierre</option>
        </Select>
        <Input value={activityDraft.observations} onChange={(event) => onChangeDraft({ ...activityDraft, observations: event.target.value })} placeholder="Observaciones" />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button onClick={onSaveActivity} disabled={saving}>
          {editingActivityId ? 'Guardar actividad' : 'Agregar actividad'}
        </Button>
        {editingActivityId ? <Button variant="outline" onClick={onCancelEdit}>Cancelar edición</Button> : null}
      </div>
      <div className="max-h-72 overflow-y-auto rounded-lg border border-border">
        {activities.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">Aún no hay actividades creadas.</p>
        ) : activities.map((activity) => (
          <div key={activity.id} className="flex flex-col gap-3 border-b border-border px-4 py-3 text-sm last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-bold text-primary">{activity.name}</p>
              <p className="text-xs text-muted-foreground">{activity.maxScore} pts · {blockShortNames[activity.competencyBlockId] ?? 'Bloque'} · {activity.instrumentType || 'Sin instrumento'}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => onEditActivity(activity)}>Editar</Button>
              <Button variant="destructive" size="sm" onClick={() => onDeleteActivity(activity.id)}>Eliminar</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
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
    <Modal title="Configurar cálculo" description="Ajusta las reglas de cálculo del libro de calificaciones." onClose={onClose}>
      <div className="grid gap-5 p-5 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="grid gap-4">
          <label className="space-y-2 text-sm font-bold">
            Nota mínima de aprobación
            <Input type="number" value={config.passingScore} onChange={(event) => onChange({ ...config, passingScore: Number(event.target.value) || 0 })} />
          </label>
          <label className="space-y-2 text-sm font-bold">
            Método del bloque
            <Select value={config.blockMethod} onChange={(event) => onChange({ ...config, blockMethod: event.target.value as GradeCalculationConfig['blockMethod'] })}>
              <option value="sum">Suma de actividades</option>
              <option value="average">Promedio de actividades</option>
              <option value="weighted">Porcentaje ponderado</option>
            </Select>
          </label>
          <label className="space-y-2 text-sm font-bold">
            Total esperado por bloque
            <Input type="number" value={config.expectedBlockTotal} onChange={(event) => onChange({ ...config, expectedBlockTotal: Number(event.target.value) || 100 })} />
          </label>
          <label className="space-y-2 text-sm font-bold">
            Regla de recuperación
            <Select value={config.recoveryRule} onChange={(event) => onChange({ ...config, recoveryRule: event.target.value as GradeCalculationConfig['recoveryRule'] })}>
              <option value="replace">Sustituye la nota del período</option>
              <option value="replace-if-higher">Solo sustituye si mejora</option>
              <option value="average">Se promedia con el período</option>
              <option value="none">No usar recuperación</option>
            </Select>
          </label>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="space-y-2 text-sm font-bold">
              Decimales PC
              <Input type="number" min={0} max={4} value={config.pcDecimals} onChange={(event) => onChange({ ...config, pcDecimals: Number(event.target.value) || 0 })} />
            </label>
            <label className="space-y-2 text-sm font-bold">
              Decimales anual
              <Input type="number" min={0} max={4} value={config.annualDecimals} onChange={(event) => onChange({ ...config, annualDecimals: Number(event.target.value) || 0 })} />
            </label>
            <label className="space-y-2 text-sm font-bold">
              Decimales final
              <Input type="number" min={0} max={4} value={config.finalDecimals} onChange={(event) => onChange({ ...config, finalDecimals: Number(event.target.value) || 0 })} />
            </label>
          </div>
          <label className="space-y-2 text-sm font-bold">
            Redondeo final
            <Select value={config.finalRounding} onChange={(event) => onChange({ ...config, finalRounding: event.target.value as GradeCalculationConfig['finalRounding'] })}>
              <option value="standard">Redondeo estándar</option>
              <option value="floor">Redondear hacia abajo</option>
              <option value="ceil">Redondear hacia arriba</option>
              <option value="decimals">Mantener decimales</option>
            </Select>
          </label>
          <label className="flex items-center gap-3 text-sm font-bold">
            <input type="checkbox" checked={config.showRecovery} onChange={(event) => onChange({ ...config, showRecovery: event.target.checked })} />
            Mostrar columna de recuperación
          </label>
        </div>

        <aside className="rounded-lg border border-border bg-muted/25 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Reglas actuales</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
            <li>Cada bloque suma {config.expectedBlockTotal} puntos.</li>
            <li>La recuperación sustituye la nota del período.</li>
            <li>La nota final es el promedio de las 4 competencias.</li>
            <li>El promedio se redondea según la regla seleccionada.</li>
          </ul>
        </aside>
      </div>
    </Modal>
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
