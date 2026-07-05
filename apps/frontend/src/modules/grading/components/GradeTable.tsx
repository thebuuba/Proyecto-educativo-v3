import { Settings, TableProperties } from 'lucide-react'
import { useState, type KeyboardEvent } from 'react'

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
  blockStatus,
  blockTotal,
  competencyBlocks,
  defaultGradeCalculationConfig,
  effectivePeriodScore,
  formatGrade,
  scoreForActivity,
  sumActivityMaxScore,
} from '@/modules/grading/utils/competencyGrades'
import { cn } from '@/utils/cn'

type GradeTableProps = {
  students: StudentGradeRow[]
  activities: GradingActivity[]
  records: GradeRecordRow[]
  recoveryScores: RecoveryScores
  recoveryLabel: string
  saving: boolean
  onAddActivity: (activity: Omit<GradingActivity, 'id'>) => void
  onUpdateActivity: (activity: GradingActivity) => void
  onDeleteActivity: (activityId: string) => void
  onSaveScore: (enrollmentId: string, activity: GradingActivity, value: string) => void
  onSaveRecovery: (enrollmentId: string, blockId: string, value: string) => void
}

const blockStyles = [
  'bg-blue-50/70 text-blue-950',
  'bg-emerald-50/70 text-emerald-950',
  'bg-amber-50/70 text-amber-950',
  'bg-violet-50/70 text-violet-950',
]

const blockDisplayNames = [
  'Comunicativa',
  'Pensamiento lógico',
  'Ética y ciudadanía',
  'Científica y tecnológica',
]

export function GradeTable({
  students,
  activities,
  records,
  recoveryScores,
  recoveryLabel,
  saving,
  onAddActivity,
  onUpdateActivity,
  onDeleteActivity,
  onSaveScore,
  onSaveRecovery,
}: GradeTableProps) {
  const [showActivityManager, setShowActivityManager] = useState(false)
  const [showConfig, setShowConfig] = useState(false)
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null)
  const [config, setConfig] = useState<GradeCalculationConfig>(defaultGradeCalculationConfig)
  const [activityDraft, setActivityDraft] = useState<{
    name: string
    maxScore: string
    competencyBlockId: string
    date: string
    description: string
    studentRole: string
    teacherRole: string
    instrumentType: string
    planningMoment: string
  }>({
    name: '',
    maxScore: '20',
    competencyBlockId: competencyBlocks[0].id,
    date: '',
    description: '',
    studentRole: '',
    teacherRole: '',
    instrumentType: '',
    planningMoment: '',
  })

  function addActivity() {
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
      planningMoment: activityDraft.planningMoment as GradingActivity['planningMoment'],
    }
    if (editingActivityId) {
      onUpdateActivity({ ...activity, id: editingActivityId })
      setEditingActivityId(null)
    } else {
      onAddActivity(activity)
    }
    setActivityDraft((draft) => ({ ...draft, name: '', maxScore: '20', description: '' }))
  }

  function startEditingActivity(activity: GradingActivity) {
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
      planningMoment: activity.planningMoment ?? '',
    })
  }

  function duplicateActivity(activity: GradingActivity) {
    onAddActivity({
      ...activity,
      name: `${activity.name} copia`,
    })
  }

  if (students.length === 0) {
    return (
      <div className="flex min-h-[220px] items-center justify-center rounded-lg border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
        Este curso todavía no tiene estudiantes matriculados.
      </div>
    )
  }

  return (
    <div className="min-w-0 space-y-3">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            Registro de calificaciones por competencias
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Regla actual: suma de actividades · recuperación sustituye nota · nota mínima {config.passingScore}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setShowConfig(true)}>
            <Settings className="size-4" />
            Configurar cálculo
          </Button>
          <Button onClick={() => setShowActivityManager(true)}>
            <TableProperties className="size-4" />
            Gestionar actividades
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="max-h-[calc(100vh-18rem)] overflow-auto">
          <table className="min-w-max border-separate border-spacing-0 text-xs">
            <thead>
              <tr>
                <th rowSpan={2} className="sticky left-0 top-0 z-40 w-11 border-b border-r border-border bg-muted px-2 py-2 text-center font-bold uppercase text-muted-foreground">
                  #
                </th>
                <th rowSpan={2} className="sticky left-11 top-0 z-40 min-w-[12rem] border-b border-r border-border bg-muted px-3 py-2 text-left font-bold uppercase text-muted-foreground">
                  Estudiante
                </th>
                {competencyBlocks.map((block, index) => {
                  const blockActivities = activities.filter((activity) => activity.competencyBlockId === block.id)
                  return (
                    <th
                      key={block.id}
                      colSpan={blockActivities.length + 2 + (config.showRecovery ? 1 : 0)}
                      className={cn('sticky top-0 z-30 border-b border-r border-border px-3 py-2 text-center font-black', blockStyles[index])}
                    >
                      <span className="block">{index + 1}. {blockDisplayNames[index]}</span>
                      <span className="mt-1 block font-bold text-primary">
                        {config.expectedBlockTotal} pts
                      </span>
                    </th>
                  )
                })}
              </tr>
              <tr>
                {competencyBlocks.map((block) => {
                  const blockActivities = activities.filter((activity) => activity.competencyBlockId === block.id)
                  return (
                    <FragmentHeader
                      key={block.id}
                      activities={blockActivities}
                      recoveryLabel={recoveryLabel}
                      showRecovery={config.showRecovery}
                    />
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.enrollmentId} className="group hover:bg-muted/20">
                  <td className="sticky left-0 z-20 border-b border-r border-border bg-card px-2 py-1.5 text-center text-muted-foreground group-hover:bg-muted/20">
                    {student.listNumber}
                  </td>
                  <td className="sticky left-11 z-20 border-b border-r border-border bg-card px-3 py-1.5 font-medium text-foreground group-hover:bg-muted/20">
                    {student.lastName}, {student.firstName}
                  </td>
                  {competencyBlocks.map((block) => {
                    const blockActivities = activities.filter((activity) => activity.competencyBlockId === block.id)
                    const total = blockTotal({
                      records,
                      activities: blockActivities,
                      enrollmentId: student.enrollmentId,
                      blockId: block.id,
                      config,
                    })
                    const recovery = recoveryScores[block.id]?.[student.enrollmentId] ?? null
                    const effectiveTotal = effectivePeriodScore(total, recovery, config)
                    const status = blockStatus(effectiveTotal, config)
                    return (
                      <FragmentCells
                        key={block.id}
                        student={student}
                        blockId={block.id}
                        activities={blockActivities}
                        records={records}
                        total={effectiveTotal}
                        status={status}
                        recovery={recovery}
                        saving={saving}
                        showRecovery={config.showRecovery}
                        onSaveScore={onSaveScore}
                        onSaveRecovery={onSaveRecovery}
                      />
                    )
                  })}
                </tr>
              ))}
              <tr>
                <td colSpan={2} className="sticky left-0 z-20 border-r border-border bg-muted px-4 py-3 text-xs font-bold uppercase text-primary">
                  Máximo por bloque
                </td>
                {competencyBlocks.map((block) => {
                  const blockActivities = activities.filter((activity) => activity.competencyBlockId === block.id)
                  const max = sumActivityMaxScore(blockActivities, block.id)
                  return (
                    <td
                      key={block.id}
                      colSpan={blockActivities.length + 2 + (config.showRecovery ? 1 : 0)}
                      className="border-r border-border bg-muted/60 px-4 py-3 text-center font-bold text-primary"
                    >
                      {max} / {config.expectedBlockTotal}
                    </td>
                  )
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <details className="rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground">
        <summary className="cursor-pointer font-bold text-foreground">Información y cálculo</summary>
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <ul className="list-disc space-y-1 pl-5">
            <li>Las actividades se calculan según el método seleccionado.</li>
            <li>La nota mínima actual de aprobación es {config.passingScore} puntos.</li>
            <li>La recuperación se aplica con la regla configurada.</li>
          </ul>
          <p>
            Bloque: {methodLabel(config.blockMethod)}. Recuperación: {recoveryRuleLabel(config.recoveryRule)}.
            Final con {roundingLabel(config.finalRounding)}.
          </p>
        </div>
      </details>

      {showActivityManager && (
        <Drawer title="Gestionar actividades" eyebrow="Calificaciones" onClose={() => setShowActivityManager(false)}>
          <div className="grid gap-3">
            <Select
              value={activityDraft.competencyBlockId}
              onChange={(event) => setActivityDraft((draft) => ({ ...draft, competencyBlockId: event.target.value }))}
            >
              {competencyBlocks.map((block) => (
                <option key={block.id} value={block.id}>{block.name}</option>
              ))}
            </Select>
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_8rem]">
              <Input value={activityDraft.name} onChange={(event) => setActivityDraft((draft) => ({ ...draft, name: event.target.value }))} placeholder="Nombre de la actividad" />
              <Input type="number" min={1} value={activityDraft.maxScore} onChange={(event) => setActivityDraft((draft) => ({ ...draft, maxScore: event.target.value }))} placeholder="Valor" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input type="date" value={activityDraft.date} onChange={(event) => setActivityDraft((draft) => ({ ...draft, date: event.target.value }))} />
              <Select value={activityDraft.instrumentType} onChange={(event) => setActivityDraft((draft) => ({ ...draft, instrumentType: event.target.value }))}>
                <option value="">Instrumento</option>
                <option value="rubrica">Rúbrica</option>
                <option value="lista-cotejo">Lista de cotejo</option>
                <option value="escala">Escala estimativa</option>
                <option value="prueba">Prueba escrita</option>
                <option value="otro">Otro</option>
              </Select>
            </div>
            <Input value={activityDraft.description} onChange={(event) => setActivityDraft((draft) => ({ ...draft, description: event.target.value }))} placeholder="Descripción" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Input value={activityDraft.studentRole} onChange={(event) => setActivityDraft((draft) => ({ ...draft, studentRole: event.target.value }))} placeholder="Rol del estudiante" />
              <Input value={activityDraft.teacherRole} onChange={(event) => setActivityDraft((draft) => ({ ...draft, teacherRole: event.target.value }))} placeholder="Rol del docente" />
            </div>
            <Select value={activityDraft.planningMoment} onChange={(event) => setActivityDraft((draft) => ({ ...draft, planningMoment: event.target.value }))}>
              <option value="">Momento de planificación</option>
              <option value="inicio">Inicio</option>
              <option value="desarrollo">Desarrollo</option>
              <option value="cierre">Cierre</option>
            </Select>
            <Button onClick={addActivity} disabled={saving}>
              {editingActivityId ? 'Guardar actividad' : 'Agregar actividad'}
            </Button>
            <div className="max-h-56 overflow-y-auto rounded-lg border border-border">
              {activities.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">Aún no hay actividades creadas.</p>
              ) : activities.map((activity) => (
                <div key={activity.id} className="flex flex-col gap-3 border-b border-border px-4 py-3 text-sm last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium">{activity.name}</p>
                    <p className="text-xs text-muted-foreground">{activity.maxScore} pts</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {activity.description || 'Sin descripción'} · {activity.instrumentType || 'Sin instrumento'} · {activity.planningMoment || 'Sin planificación'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => startEditingActivity(activity)}>
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => duplicateActivity(activity)}>
                      Duplicar
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => onDeleteActivity(activity.id)}>
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Drawer>
      )}

      {showConfig && (
        <Modal title="Configurar cálculo" description="Ajusta las reglas de cálculo para esta vista." onClose={() => setShowConfig(false)}>
          <div className="grid gap-4 p-5">
            <label className="space-y-2 text-sm font-bold">
              Nota mínima de aprobación
              <Input type="number" value={config.passingScore} onChange={(event) => setConfig((current) => ({ ...current, passingScore: Number(event.target.value) || 0 }))} />
            </label>
            <label className="space-y-2 text-sm font-bold">
              Método del bloque
              <Select value={config.blockMethod} onChange={(event) => setConfig((current) => ({ ...current, blockMethod: event.target.value as GradeCalculationConfig['blockMethod'] }))}>
                <option value="sum">Suma de actividades</option>
                <option value="average">Promedio de actividades</option>
                <option value="weighted">Porcentaje ponderado</option>
              </Select>
            </label>
            <label className="space-y-2 text-sm font-bold">
              Total esperado por bloque
              <Input type="number" value={config.expectedBlockTotal} onChange={(event) => setConfig((current) => ({ ...current, expectedBlockTotal: Number(event.target.value) || 100 }))} />
            </label>
            <label className="space-y-2 text-sm font-bold">
              Regla de recuperación
              <Select value={config.recoveryRule} onChange={(event) => setConfig((current) => ({ ...current, recoveryRule: event.target.value as GradeCalculationConfig['recoveryRule'] }))}>
                <option value="replace">Sustituye la nota del período</option>
                <option value="replace-if-higher">Solo sustituye si es mayor</option>
                <option value="average">Se promedia con la nota original</option>
                <option value="none">No usar recuperación</option>
              </Select>
            </label>
            <label className="space-y-2 text-sm font-bold">
              Redondeo final
              <Select value={config.finalRounding} onChange={(event) => setConfig((current) => ({ ...current, finalRounding: event.target.value as GradeCalculationConfig['finalRounding'] }))}>
                <option value="standard">Redondeo estándar</option>
                <option value="floor">Redondear hacia abajo</option>
                <option value="ceil">Redondear hacia arriba</option>
                <option value="decimals">Mantener decimales</option>
              </Select>
            </label>
            <label className="space-y-2 text-sm font-bold">
              Decimales para PC
              <Input type="number" min={0} max={4} value={config.pcDecimals} onChange={(event) => setConfig((current) => ({ ...current, pcDecimals: Number(event.target.value) || 0 }))} />
            </label>
            <label className="flex items-center gap-3 text-sm font-bold">
              <input type="checkbox" checked={config.showRecovery} onChange={(event) => setConfig((current) => ({ ...current, showRecovery: event.target.checked }))} />
              Mostrar columnas de recuperación
            </label>
          </div>
        </Modal>
      )}
    </div>
  )
}

function FragmentHeader({
  activities,
  recoveryLabel,
  showRecovery,
}: {
  activities: GradingActivity[]
  recoveryLabel: string
  showRecovery: boolean
}) {
  return (
    <>
      {activities.map((activity, index) => (
        <th key={activity.id} className="sticky top-[3.4rem] z-20 min-w-[5.5rem] border-b border-r border-border bg-muted/35 px-2 py-2 text-center font-bold text-foreground">
          <span className="block truncate" title={activity.name}>{activity.name || `Act. ${index + 1}`}</span>
          <span className="block text-[10px] text-muted-foreground">({activity.maxScore})</span>
        </th>
      ))}
      <th className="sticky top-[3.4rem] z-20 w-20 border-b border-r border-border bg-muted/35 px-2 py-2 text-center font-bold uppercase text-primary">
        Total
      </th>
      <th className="sticky top-[3.4rem] z-20 w-20 border-b border-r border-border bg-muted/35 px-2 py-2 text-center font-bold uppercase text-muted-foreground">
        Estado
      </th>
      {showRecovery && (
        <th className="sticky top-[3.4rem] z-20 w-16 border-b border-r border-border bg-muted/35 px-2 py-2 text-center font-bold uppercase text-muted-foreground">
          {recoveryLabel || 'RP'}
        </th>
      )}
    </>
  )
}

function FragmentCells({
  student,
  blockId,
  activities,
  records,
  total,
  status,
  recovery,
  saving,
  showRecovery,
  onSaveScore,
  onSaveRecovery,
}: {
  student: StudentGradeRow
  blockId: string
  activities: GradingActivity[]
  records: GradeRecordRow[]
  total: number
  status: string
  recovery: number | null
  saving: boolean
  showRecovery: boolean
  onSaveScore: (enrollmentId: string, activity: GradingActivity, value: string) => void
  onSaveRecovery: (enrollmentId: string, blockId: string, value: string) => void
}) {
  return (
    <>
      {activities.map((activity) => {
  const record = scoreForActivity(records, student.enrollmentId, activity.id)
        return (
          <td key={activity.id} className="border-b border-r border-border p-0.5 text-center">
            <Input
              type="number"
              min={0}
              max={activity.maxScore}
              step="0.01"
              defaultValue={record?.score ?? ''}
              disabled={saving}
              className="grade-cell h-8 w-16 rounded-md border-transparent bg-transparent px-1 text-center text-xs focus:bg-card"
              onKeyDown={focusNextGradeCell}
              onBlur={(event) => onSaveScore(student.enrollmentId, activity, event.target.value)}
            />
          </td>
        )
      })}
      <td className="border-b border-r border-border px-2 py-1.5 text-center font-bold text-primary">
        {formatGrade(total)}
      </td>
      <td className="border-b border-r border-border px-2 py-1.5 text-center">
        <Badge
          tone={status === 'Aprobado' ? 'success' : total === 0 ? 'muted' : 'warning'}
          className="h-5 px-1.5 text-[10px]"
        >
          {status === 'Aprobado' ? 'Aprob.' : total === 0 ? '—' : 'Recup.'}
        </Badge>
      </td>
      {showRecovery && (
        <td className="border-b border-r border-border p-0.5 text-center">
          {status === 'Aprobado' && recovery === null ? (
            <span className="text-muted-foreground">—</span>
          ) : (
            <Input
              type="number"
              min={0}
              max={100}
              step="0.01"
              defaultValue={recovery ?? ''}
              disabled={saving}
              className="grade-cell h-8 w-16 rounded-md border-transparent bg-transparent px-1 text-center text-xs focus:bg-card"
              onKeyDown={focusNextGradeCell}
              onBlur={(event) => onSaveRecovery(student.enrollmentId, blockId, event.target.value)}
            />
          )}
        </td>
      )}
    </>
  )
}

function focusNextGradeCell(event: KeyboardEvent<HTMLInputElement>) {
  if (event.key !== 'Enter') return
  event.preventDefault()
  const cells = Array.from(document.querySelectorAll<HTMLInputElement>('.grade-cell:not(:disabled)'))
  const index = cells.indexOf(event.currentTarget)
  cells[index + 1]?.focus()
  cells[index + 1]?.select()
}

function methodLabel(value: GradeCalculationConfig['blockMethod']) {
  if (value === 'average') return 'promedio de actividades'
  if (value === 'weighted') return 'porcentaje ponderado'
  return 'suma de actividades'
}

function recoveryRuleLabel(value: GradeCalculationConfig['recoveryRule']) {
  if (value === 'replace-if-higher') return 'sustituye solo si mejora'
  if (value === 'average') return 'se promedia con el período'
  if (value === 'none') return 'no se usa'
  return 'sustituye el período'
}

function roundingLabel(value: GradeCalculationConfig['finalRounding']) {
  if (value === 'floor') return 'redondeo hacia abajo'
  if (value === 'ceil') return 'redondeo hacia arriba'
  if (value === 'decimals') return 'decimales'
  return 'redondeo estándar'
}
