import { CalendarDays, CheckSquare, ClipboardCheck, ClipboardList, Edit3, Layers3, UsersRound } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { activityRubricConfiguration } from '@/modules/grading/components/GradingBook'
import { getGradingWorkspace } from '@/modules/grading/services/gradingService'
import type { GradingActivity, GradingWorkspace } from '@/modules/grading/types'
import { competencyBlocks, scoreForActivity } from '@/modules/grading/utils/competencyGrades'
import { cn } from '@/utils/cn'

type Props = {
  sectionSubjectId: string
  courseId: string
  activityId: string
}

export function SubjectActivityDetailModal({ sectionSubjectId, courseId, activityId }: Props) {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [workspace, setWorkspace] = useState<GradingWorkspace | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    getGradingWorkspace({ sectionSubjectId })
      .then((data) => { if (active) setWorkspace(data) })
      .catch((cause) => { if (active) setError(cause instanceof Error ? cause.message : 'No se pudo cargar la actividad.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [sectionSubjectId])

  const activity = workspace?.activities.find((item) => item.id === activityId) ?? null
  const close = () => {
    const next = new URLSearchParams(searchParams)
    next.delete('activityId')
    setSearchParams(next)
  }

  const openWorkspace = (mode: 'edit' | 'evaluate') => {
    navigate(`/calificaciones?${new URLSearchParams({
      sectionSubjectId,
      activityId,
      activityMode: mode,
      origin: 'subject',
      returnCourseId: courseId,
      returnSubjectId: sectionSubjectId,
      returnTab: 'actividades',
    }).toString()}`)
  }

  if (loading) {
    return <Modal title="Cargando actividad…" description="Preparando la información y el instrumento." onClose={close} className="max-w-5xl"><div className="p-8"><div className="h-72 animate-pulse rounded-3xl bg-muted/60" /></div></Modal>
  }

  if (error || !workspace || !activity) {
    return <Modal title="No se pudo abrir la actividad" description={error ?? 'La actividad ya no está disponible.'} onClose={close}><div className="p-6"><Button onClick={close}>Volver a actividades</Button></div></Modal>
  }

  return <ActivityPreviewModal activity={activity} workspace={workspace} onClose={close} onEdit={() => openWorkspace('edit')} onEvaluate={() => openWorkspace('evaluate')} />
}

function ActivityPreviewModal({ activity, workspace, onClose, onEdit, onEvaluate }: {
  activity: GradingActivity
  workspace: GradingWorkspace
  onClose: () => void
  onEdit: () => void
  onEvaluate: () => void
}) {
  const block = competencyBlocks.find((item) => item.id === activity.competencyBlockId)
  const period = workspace.academicPeriods.find((item) => item.id === workspace.selectedAcademicPeriodId) ?? workspace.academicPeriods[0]
  const graded = workspace.students.filter((student) => Boolean(scoreForActivity(workspace.gradeRecords, student.enrollmentId, activity.id))).length
  const configuration = useMemo(() => activityRubricConfiguration(activity), [activity])
  const description = plainText(activity.description)
  const instrumentComplete = configuration.criteria.length > 0

  return (
    <Modal
      title={activity.name}
      description="Consulta la información completa y el instrumento creado para esta actividad."
      icon={ClipboardList}
      tone="info"
      eyebrow={`${block?.shortName ?? 'Actividad'} · ${block?.name ?? 'Sin competencia asociada'}`}
      onClose={onClose}
      className="max-h-[92vh] max-w-6xl"
      contentClassName="bg-muted/20 p-4 sm:p-5"
    >
      <div className="space-y-4">
        <section className="overflow-hidden rounded-3xl border border-primary/15 bg-card shadow-sm">
          <div className="flex flex-col gap-4 bg-primary/[0.045] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h4 className="truncate text-lg font-black text-primary">{activity.name}</h4>
              <p className="mt-1 text-xs font-semibold text-muted-foreground">{block?.name ?? 'Sin competencia asociada'}</p>
            </div>
            <span className="self-start rounded-full border border-primary/20 bg-background px-3 py-1 text-[10px] font-extrabold text-primary">{block?.shortName ?? 'Sin bloque'}</span>
          </div>

          <div className="grid gap-2 border-t border-border/70 p-3 sm:grid-cols-2 lg:grid-cols-6">
            <Meta icon={CheckSquare} label="Valor" value={`${activity.maxScore} pts`} />
            <Meta icon={CalendarDays} label="Fecha" value={formatDate(activity.date)} />
            <Meta icon={Layers3} label="Técnica" value={activity.evaluationTechnique || 'Sin técnica'} />
            <Meta icon={ClipboardList} label="Instrumento" value={instrumentLabel(activity.instrumentType)} />
            <Meta icon={UsersRound} label="Modalidad" value={activity.activityType === 'group' ? 'Grupal' : 'Individual'} />
            <Meta icon={ClipboardCheck} label="Progreso" value={`${graded}/${workspace.students.length}`} />
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-3 border-b border-border pb-3">
              <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary"><ClipboardList className="size-4" /></span>
              <div><h4 className="text-sm font-extrabold text-foreground">Descripción de la actividad</h4><p className="mt-0.5 text-[10px] text-muted-foreground">Propósito, desarrollo e indicaciones.</p></div>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-7 text-foreground">{description || 'Sin descripción registrada.'}</p>
          </section>

          <aside className="rounded-3xl border border-primary/15 bg-primary/[0.035] p-4 shadow-sm">
            <h4 className="text-sm font-extrabold text-primary">Recursos necesarios</h4>
            <p className="mt-1 text-[10px] text-muted-foreground">{activity.resources?.length ?? 0} seleccionados</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {activity.resources?.length ? activity.resources.map((resource) => <span key={resource} className="rounded-xl border border-primary/15 bg-card px-3 py-2 text-xs font-bold text-primary shadow-sm">{resource}</span>) : <span className="text-xs text-muted-foreground">Sin recursos registrados.</span>}
            </div>
          </aside>
        </div>

        <section className="overflow-hidden rounded-3xl border border-primary/15 bg-card shadow-sm">
          <header className="flex flex-wrap items-center justify-between gap-3 bg-primary/[0.045] px-4 py-3">
            <div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-xl bg-background text-primary shadow-sm"><ClipboardCheck className="size-4" /></span><div><h4 className="text-sm font-extrabold text-primary">Instrumento de evaluación</h4><p className="mt-0.5 text-[10px] text-muted-foreground">{instrumentLabel(activity.instrumentType)}</p></div></div>
            <span className={cn('rounded-full px-3 py-1 text-[10px] font-extrabold', instrumentComplete ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800')}>{instrumentComplete ? 'Completo' : 'Sin configurar'}</span>
          </header>

          {instrumentComplete ? (
            <div className="overflow-x-auto p-4">
              <table className="w-full min-w-[44rem] text-sm">
                <thead><tr className="text-left text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground"><th className="rounded-l-xl bg-muted/55 px-4 py-3">Criterio</th>{configuration.levels.map((level) => <th key={level.label} className="bg-muted/55 px-4 py-3 text-center">{level.label}</th>)}<th className="rounded-r-xl bg-muted/55 px-4 py-3 text-right">Valor</th></tr></thead>
                <tbody className="divide-y divide-border">{configuration.criteria.map((criterion) => <tr key={criterion.title}><td className="px-4 py-4 font-bold text-foreground">{criterion.title}</td>{configuration.levels.map((level) => <td key={level.label} className="px-4 py-4 text-center text-xs text-muted-foreground">{level.points ?? '—'} pts</td>)}<td className="px-4 py-4 text-right font-extrabold text-primary">{criterion.maximum} pts</td></tr>)}</tbody>
              </table>
            </div>
          ) : <p className="p-6 text-sm text-muted-foreground">Esta actividad no tiene criterios de instrumento configurados todavía.</p>}
        </section>

        <footer className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose}>Cerrar</Button>
          <Button variant="outline" onClick={onEdit}><Edit3 className="size-4" /> Editar actividad</Button>
          <Button onClick={onEvaluate}><ClipboardCheck className="size-4" /> Calificar actividad</Button>
        </footer>
      </div>
    </Modal>
  )
}

function Meta({ icon: Icon, label, value }: { icon: typeof CalendarDays; label: string; value: string }) {
  return <div className="flex min-w-0 items-center gap-2 rounded-2xl bg-muted/25 px-3 py-2.5"><span className="grid size-8 shrink-0 place-items-center rounded-xl bg-primary/8 text-primary"><Icon className="size-4" /></span><span className="min-w-0"><span className="block text-[9px] font-extrabold uppercase tracking-wide text-muted-foreground">{label}</span><strong className="mt-0.5 block truncate text-xs text-foreground">{value}</strong></span></div>
}

function plainText(value?: string) {
  if (!value) return ''
  return value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>|<\/h\d>|<\/li>/gi, '\n')
    .replace(/<li>/gi, '• ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function instrumentLabel(value?: string) {
  return ({ rubrica: 'Rúbrica de evaluación', 'lista-cotejo': 'Lista de cotejo', escala: 'Escala estimativa', 'lista-ponderada': 'Lista ponderada' } as Record<string, string>)[value ?? ''] ?? value ?? 'Sin instrumento'
}

function formatDate(value?: string | null) {
  if (!value) return 'Sin fecha'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('es-DO', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
