import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { StatusBadge } from '@/components/ui/SemanticUI'
import type { Activity } from '../types'
import { ReadOnlyInstrument } from './editor/ReadOnlyInstrument'
import { ActivityDescriptionContent, formatActivityDate, formatActivityTechnique, instrumentTitle } from './editor/editorPresentation'

export function ActivityInfoModal({activity,onClose,onEdit,onEvaluate}: {activity:Activity; onClose:()=>void; onEdit?:()=>void; onEvaluate?:()=>void}) {
  return <Modal title="Detalle de la actividad" onClose={onClose} className="max-w-6xl">
    <div className="space-y-5 bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3"><h2 className="text-xl font-bold text-foreground">{activity.name}</h2><StatusBadge tone={activity.evaluatedCount ? 'success' : 'warning'}>{activity.evaluatedCount ? 'Con calificaciones' : 'Pendiente de evaluación'}</StatusBadge></div>
      {activity.profileCompatibility === 'legacy-review-required' ? <p role="alert" className="rounded-xl bg-warning/10 p-3 text-sm">Estructura anterior: sus calificaciones históricas se conservan; revisa los bloques del perfil actual.</p> : null}
      <dl className="grid gap-3 sm:grid-cols-3">
        {[
          ['Valor',`${activity.maxScore} pts`], ['Fecha',formatActivityDate(activity.date)], ['Técnica',formatActivityTechnique(activity.evaluationTechnique)],
          ['Estrategia de enseñanza y aprendizaje',resolveTeachingStrategy(activity.teachingStrategyId??'')?.name??'Sin estrategia'],
          ['Instrumento',instrumentTitle(activity.instrumentType ?? '')], ['Modalidad',activity.activityType === 'group' ? 'Grupal' : 'Individual'],
          ['Competencias',Object.entries(activity.competencyBlockWeights ?? {[activity.competencyBlockId]:1}).map(([block,weight])=>`${block.toUpperCase()}: ${Math.round(weight*100)} %`).join(' · ')],
        ].map(([label,value])=><div key={label} className="rounded-xl border border-border p-3"><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-1 text-sm font-semibold text-foreground">{value}</dd></div>)}
      </dl>
      <section><h3 className="mb-2 font-semibold text-foreground">Descripción de la actividad</h3><ActivityDescriptionContent value={activity.description} fallback="Sin descripción registrada." /></section>
      {activity.studentRole || activity.teacherRole ? <div className="grid gap-3 sm:grid-cols-2">{[['Rol del estudiante',activity.studentRole],['Rol del docente',activity.teacherRole]].map(([label,value])=><div key={label}><h3 className="font-semibold">{label}</h3><p className="text-sm text-muted-foreground">{value || 'Sin especificar'}</p></div>)}</div> : null}
      {activity.evidenceInstructions ? <section><h3 className="font-semibold">Evidencia esperada</h3><p className="text-sm">{activity.evidenceInstructions}</p></section> : null}
      <section><h3 className="mb-2 font-semibold text-foreground">Recursos necesarios</h3><p className="text-sm text-muted-foreground">{activity.resources?.join(', ') || 'No se registraron recursos.'}</p></section>
      <section><h3 className="mb-2 font-semibold text-foreground">Instrumento de evaluación · Solo lectura</h3><ReadOnlyInstrument type={activity.instrumentType} fields={activity.instrumentCriteria ?? {}} maxScore={activity.maxScore} /></section>
      {activity.observations ? <section><h3 className="font-semibold">Observaciones</h3><p className="text-sm">{activity.observations}</p></section> : null}
      <footer className="flex flex-wrap justify-end gap-2 border-t border-border pt-4"><Button data-ui-action="close" variant="ghost" onClick={onClose}>Cerrar</Button>{onEdit ? <Button variant="outline" onClick={onEdit}>Editar actividad</Button> : null}{onEvaluate ? <Button onClick={onEvaluate}>Calificar</Button> : null}</footer>
    </div>
  </Modal>
}
import {resolveTeachingStrategy} from '@aula/shared'
