import {
  BookOpen,
  Box,
  CalendarDays,
  ClipboardList,
  Clock3,
  FileText,
  Files,
  Laptop,
  Monitor,
  Presentation,
  Target,
  Tags,
  Users,
  X,
} from 'lucide-react'
import type { ReactNode } from 'react'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import type { GradingActivity } from '@/modules/grading/types'
import { competencyBlocks, plainActivityText } from '@/modules/grading/utils/competencyGrades'
import { cn } from '@/utils/cn'

type Accent = {
  card: string
  panel: string
  badge: string
  progressColor: string
  gradient: string
  border: string
  text: string
}

const blockAccents: Accent[] = [
  { card: 'border-blue-200 bg-blue-50/70', panel: 'bg-blue-50 text-blue-950', badge: 'bg-blue-100 text-blue-700 ring-blue-200', progressColor: '#2563eb', gradient: 'linear-gradient(90deg, #60a5fa 0%, #2563eb 55%, #1d4ed8 100%)', border: 'border-blue-200', text: 'text-blue-700' },
  { card: 'border-emerald-200 bg-emerald-50/70', panel: 'bg-emerald-50 text-emerald-950', badge: 'bg-emerald-100 text-emerald-700 ring-emerald-200', progressColor: '#059669', gradient: 'linear-gradient(90deg, #34d399 0%, #059669 55%, #047857 100%)', border: 'border-emerald-200', text: 'text-emerald-700' },
  { card: 'border-amber-200 bg-amber-50/70', panel: 'bg-amber-50 text-amber-950', badge: 'bg-amber-100 text-amber-700 ring-amber-200', progressColor: '#f59e0b', gradient: 'linear-gradient(90deg, #fcd34d 0%, #f59e0b 55%, #d97706 100%)', border: 'border-amber-200', text: 'text-amber-700' },
  { card: 'border-violet-200 bg-violet-50/70', panel: 'bg-violet-50 text-violet-950', badge: 'bg-violet-100 text-violet-700 ring-violet-200', progressColor: '#7c3aed', gradient: 'linear-gradient(90deg, #a78bfa 0%, #7c3aed 55%, #6d28d9 100%)', border: 'border-violet-200', text: 'text-violet-700' },
]

const blockShortNames: Record<string, string> = {
  b1: 'Competencia Comunicativa',
  b2: 'Pensamiento Lógico, Creativo y Crítico y Resolución de Problemas',
  b3: 'Ética y Ciudadana y Desarrollo Personal y Espiritual',
  b4: 'Científica y Tecnológica y Ambiental y de la Salud',
}

const rubricLevelPalette = [
  { background: '#059669', border: '#047857', foreground: '#ffffff' },
  { background: '#22b87a', border: '#10a369', foreground: '#ffffff' },
  { background: '#72cf78', border: '#4fbd65', foreground: '#123524' },
  { background: '#c7df72', border: '#aacb52', foreground: '#334019' },
  { background: '#f6c453', border: '#e9a92c', foreground: '#51350b' },
  { background: '#f59e0b', border: '#df8305', foreground: '#4a2703' },
]

export function ActivityInfoModal({ activity, onClose, onEdit, onEvaluate }: {
  activity: GradingActivity
  onClose: () => void
  onEdit?: () => void
  onEvaluate?: () => void
}) {
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
    <Modal title="Detalle de la actividad" onClose={onClose} hideHeader className="max-h-[92vh] max-w-6xl rounded-2xl">
      <div className="h-1.5 shrink-0" style={{ background: accent.gradient }} />
      <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border bg-card px-6 py-4">
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
          <div className="max-h-[24rem] overflow-auto p-4"><ReadOnlyInstrument type={activity.instrumentType} fields={activity.instrumentCriteria ?? {}} maxScore={activity.maxScore} accent={accent} /></div>
        </section>

        {onEdit || onEvaluate ? <footer className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end"><Button variant="outline" onClick={onClose}>Cerrar</Button>{onEdit ? <Button variant="outline" onClick={onEdit}>Editar actividad</Button> : null}{onEvaluate ? <Button onClick={onEvaluate}><ClipboardList className="size-4" /> Calificar actividad</Button> : null}</footer> : null}
      </div>
    </Modal>
  )
}

function ReadOnlyInstrument(props: { type?: string; fields: Record<string, string>; maxScore: number; accent?: Accent }) {
  return <div className={instrumentTypographyClass(props.type, props.fields)}><ReadOnlyInstrumentContent {...props} /></div>
}

function ReadOnlyInstrumentContent({ type, fields, maxScore, accent }: { type?: string; fields: Record<string, string>; maxScore: number; accent?: Accent }) {
  const entries = Object.entries(fields).filter(([, value]) => value.trim())
  const criterionEntries = type ? entries.filter(([key]) => key.startsWith(`${type}:criterion:`)) : []
  const indexes = [...new Set(criterionEntries.map(([key]) => Number(key.split(':')[2])).filter(Number.isFinite))].sort((a, b) => a - b)
  if (!type || indexes.length === 0) return <p className="rounded-lg bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">Este instrumento no tiene criterios configurados guardados.</p>

  if (type === 'rubrica') {
    const levelCount = Number(fields['rubrica:meta:levelCount']) || inferRubricLevels(fields, 4)
    const levels = Array.from({ length: levelCount }, (_, index) => levelCount - index)
    return <div className="space-y-2"><InstrumentTable><thead><tr><th className="border border-border bg-slate-50 px-3 py-2">Criterios</th>{levels.map((level, index) => { const visual = rubricLevelVisual(index, levels.length); return <th key={level} className="border px-3 py-2 text-center" style={{ backgroundColor: visual.background, borderColor: visual.border, color: visual.foreground }}><span className="block font-black">{fields[instrumentFieldKey(type, 'level-name', level)] || `Nivel ${level}`}</span><span className="text-[10px] font-bold opacity-80">{fields[instrumentFieldKey(type, 'level-points', level)] || level} pts</span></th> })}<th className="border border-border bg-slate-50 px-3 py-2 text-center">Valor</th></tr></thead><tbody>{indexes.map((index) => <tr key={index}><td className="border border-border px-3 py-3 font-bold">{fields[instrumentFieldKey(type, 'criterion', index)]}</td>{levels.map((level) => <td key={level} className="border border-border px-3 py-3 leading-5 text-muted-foreground">{fields[instrumentFieldKey(type, 'descriptor', index, level)] || '—'}</td>)}<td className="border border-border px-3 py-3 text-center font-bold">{fields[instrumentFieldKey(type, 'points', index)] || '—'} pts</td></tr>)}</tbody></InstrumentTable><p className="text-right text-xs font-black text-primary">Puntuación máxima: {maxScore} pts</p></div>
  }

  if (type === 'lista-cotejo') {
    const hasNoApply = fields['lista-cotejo:meta:noApply'] === 'true'
    const options = [{ label: fields['lista-cotejo:meta:yesLabel'] || 'Sí', tone: 'positive' as const }, { label: fields['lista-cotejo:meta:noLabel'] || 'No', tone: 'negative' as const }, ...(hasNoApply ? [{ label: fields['lista-cotejo:meta:naLabel'] || 'No aplica', tone: 'neutral' as const }] : [])]
    return <div className="space-y-3"><InstrumentTable><thead><tr><th className={cn('border px-3 py-3', accent ? cn(accent.card, accent.border, accent.text) : 'border-blue-200 bg-blue-50 text-blue-700')}>Criterios</th>{options.map((option) => <th key={option.label} className={cn('border px-3 py-3 text-center', option.tone === 'positive' ? 'border-emerald-300 bg-emerald-100 text-emerald-800' : option.tone === 'negative' ? 'border-red-300 bg-red-100 text-red-700' : 'border-amber-300 bg-amber-100 text-amber-800')}>{option.label}</th>)}<th className={cn('border px-3 py-3 text-center', accent ? cn(accent.card, accent.border, accent.text) : 'border-blue-200 bg-blue-50 text-blue-700')}>Valor</th></tr></thead><tbody>{indexes.map((index) => <tr key={index}><td className="border border-border bg-card px-3 py-3 font-bold">{fields[instrumentFieldKey(type, 'criterion', index)] || `Criterio ${index + 1}`}</td>{options.map((option) => <td key={option.label} className={cn('border text-center', option.tone === 'positive' ? 'border-emerald-200 bg-emerald-50/55' : option.tone === 'negative' ? 'border-red-200 bg-red-50/55' : 'border-amber-200 bg-amber-50/55')}><InstrumentCheckPlaceholder tone={option.tone} /></td>)}<td className={cn('border px-3 py-3 text-center font-black', accent ? cn(accent.card, accent.border, accent.text) : 'border-blue-200 bg-blue-50 text-blue-700')}>{fields[instrumentFieldKey(type, 'points', index)] || 0} pts</td></tr>)}</tbody></InstrumentTable><p className={cn('text-right text-sm font-black', accent?.text || 'text-emerald-700')}>Puntuación máxima: {maxScore} pts</p></div>
  }

  if (type === 'escala') {
    const levelCount = Number(fields['escala:meta:levelCount']) || 4
    const levels = Array.from({ length: levelCount }, (_, index) => levelCount - index)
    const hasNoApply = fields['escala:meta:noApply'] === 'true'
    const previewAccent = accent ?? blockAccents[0]
    return <div className="space-y-3"><InstrumentTable><thead><tr><th className={cn('border px-3 py-3', previewAccent.card, previewAccent.border, previewAccent.text)}>Indicadores</th>{levels.map((level, index) => { const visual = scaleLevelVisual(previewAccent, index, levels.length); return <th key={level} className="border px-3 py-3 text-center" style={{ backgroundColor: visual.background, borderColor: visual.border, color: visual.foreground }}><span className="block font-black">{fields[instrumentFieldKey(type, 'level-name', level)] || `Nivel ${level}`}</span><span className="text-[10px] font-medium opacity-75">{fields[instrumentFieldKey(type, 'level-points', level)] || level} pts</span></th> })}{hasNoApply ? <th className="border border-slate-300 bg-slate-100 px-3 py-3 text-center text-slate-600">No aplica<span className="block text-[10px]">N/A</span></th> : null}<th className={cn('border px-3 py-3 text-center', previewAccent.card, previewAccent.border, previewAccent.text)}>Máximo</th></tr></thead><tbody>{indexes.map((index) => <tr key={index}><td className="border border-border bg-card px-3 py-3 font-bold">{fields[instrumentFieldKey(type, 'criterion', index)] || `Indicador ${index + 1}`}</td>{levels.map((level, levelIndex) => { const visual = scaleLevelVisual(previewAccent, levelIndex, levels.length); return <td key={level} className="border bg-card text-center" style={{ borderColor: visual.border }}><span className="mx-auto block size-4 rounded border-2 bg-card shadow-sm" style={{ borderColor: visual.border }} /></td> })}{hasNoApply ? <td className="border border-slate-200 bg-slate-50 text-center"><InstrumentCheckPlaceholder tone="default" /></td> : null}<td className={cn('border px-3 py-3 text-center font-black', previewAccent.card, previewAccent.border, previewAccent.text)}>{fields[instrumentFieldKey(type, 'points', index)] || 0} pts</td></tr>)}</tbody></InstrumentTable><p className={cn('text-right text-sm font-black', previewAccent.text)}>Puntuación máxima: {maxScore} pts</p></div>
  }

  const hasPartial = fields['lista-ponderada:meta:partial'] !== 'false'
  const weightedLabels = { yes: fields['lista-ponderada:meta:yesLabel'] || 'Sí', partial: fields['lista-ponderada:meta:partialLabel'] || 'Parcial', no: fields['lista-ponderada:meta:noLabel'] || 'No' }
  const totalWeight = indexes.reduce((sum, index) => sum + Number(fields[instrumentFieldKey(type, 'weight', index)] || 0), 0)
  const previewAccent = accent ?? blockAccents[0]
  return <div className="space-y-3"><InstrumentTable><thead><tr><th className={cn('border px-3 py-2', previewAccent.card, previewAccent.border)}>Criterio</th><th className={cn('border px-3 py-2', previewAccent.card, previewAccent.border)}>Indicador observable</th><th className={cn('border px-3 py-2 text-center', previewAccent.card, previewAccent.border)}>Ponderación</th><th className={cn('border px-3 py-2 text-center', previewAccent.card, previewAccent.border)}>Valor máximo</th><th className="border border-emerald-200 bg-emerald-50 px-3 py-2 text-center text-emerald-700">{weightedLabels.yes}<span className="block text-[9px]">100 %</span></th>{hasPartial ? <th className="border border-amber-200 bg-amber-50 px-3 py-2 text-center text-amber-700">{weightedLabels.partial}<span className="block text-[9px]">{fields['lista-ponderada:meta:partialValue'] || 50} %</span></th> : null}<th className="border border-red-200 bg-red-50 px-3 py-2 text-center text-red-700">{weightedLabels.no}<span className="block text-[9px]">0 %</span></th></tr></thead><tbody>{indexes.map((index) => { const weight = Number(fields[instrumentFieldKey(type, 'weight', index)] || 0); return <tr key={index}><td className="border border-border bg-card px-3 py-3 font-bold">{fields[instrumentFieldKey(type, 'criterion', index)] || `Criterio ${index + 1}`}</td><td className="border border-border bg-card px-3 py-3 text-muted-foreground">{fields[instrumentFieldKey(type, 'indicator', index)] || '—'}</td><td className="border border-border bg-card px-3 py-3 text-center font-black">{formatInstrumentNumber(weight)} %</td><td className={cn('border px-3 py-3 text-center font-black', previewAccent.card, previewAccent.border, previewAccent.text)}>{formatInstrumentNumber(weight / 100 * maxScore)} pts</td><td className="border border-emerald-200 bg-emerald-50/40 text-center"><InstrumentCheckPlaceholder tone="positive" /></td>{hasPartial ? <td className="border border-amber-200 bg-amber-50/40 text-center"><InstrumentCheckPlaceholder tone="neutral" /></td> : null}<td className="border border-red-200 bg-red-50/40 text-center"><InstrumentCheckPlaceholder tone="negative" /></td></tr> })}</tbody></InstrumentTable><div className={cn('flex justify-between rounded-xl border px-4 py-3 text-sm font-black', previewAccent.card, previewAccent.border)}><span className={Math.abs(totalWeight - 100) < .001 ? 'text-emerald-700' : 'text-destructive'}>Ponderación: {formatInstrumentNumber(totalWeight)}/100 %</span><span className={previewAccent.text}>Puntuación máxima: {formatInstrumentNumber(maxScore)} pts</span></div></div>
}

function InstrumentTable({ children }: { children: ReactNode }) { return <div className="overflow-x-auto rounded-xl border border-border bg-card"><table className="w-full min-w-[44rem] border-collapse text-xs">{children}</table></div> }
function InstrumentCheckPlaceholder({ tone = 'default' }: { tone?: 'default' | 'positive' | 'negative' | 'neutral' }) { return <span aria-hidden="true" className={cn('mx-auto block size-4 rounded border-2 bg-card shadow-sm', tone === 'positive' ? 'border-emerald-500' : tone === 'negative' ? 'border-red-400' : tone === 'neutral' ? 'border-amber-500' : 'border-muted-foreground/70')} /> }
function instrumentFieldKey(type: string, field: string, index: number, level?: number) { return level === undefined ? `${type}:${field}:${index}` : `${type}:${field}:${index}:${level}` }
function inferRubricLevels(fields: Record<string, string>, fallback: number) { const matches = Object.keys(fields).map((key) => key.match(/^rubrica:level-name:(\d+)$/)?.[1]).filter(Boolean).map(Number); return matches.length ? Math.max(...matches) : fallback }
function rubricLevelVisual(index: number, count: number) { const paletteIndex = count <= 1 ? 0 : Math.round(index * (rubricLevelPalette.length - 1) / (count - 1)); return rubricLevelPalette[Math.min(rubricLevelPalette.length - 1, Math.max(0, paletteIndex))] }
function scaleLevelVisual(accent: Accent, index: number, count: number) { const ratio = count <= 1 ? 0 : index / (count - 1); const backgroundRatio = 0.18 - ratio * 0.1; const borderRatio = 0.5 - ratio * 0.25; return { background: mixHex(accent.progressColor, '#ffffff', 1 - backgroundRatio), border: mixHex(accent.progressColor, '#ffffff', 1 - borderRatio), foreground: mixHex(accent.progressColor, '#0f172a', 0.2) } }
function getBlockAccent(blockId: string) { const index = competencyBlocks.findIndex((item) => item.id === blockId); return blockAccents[index >= 0 ? index : 0] }

function ActivityDescriptionContent({ value, fallback }: { value?: string; fallback: string }) {
  if (!value) return <p>{fallback}</p>
  return <div className="activity-description space-y-2 [&_a]:text-primary [&_a]:underline [&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-blue-300 [&_blockquote]:bg-blue-50/50 [&_blockquote]:px-4 [&_blockquote]:py-3 [&_blockquote]:text-slate-700 [&_figcaption]:mt-2 [&_figcaption]:text-center [&_figcaption]:text-xs [&_figcaption]:text-muted-foreground [&_figure]:my-4 [&_figure]:w-full [&_figure[data-align='center']_img]:mx-auto [&_figure[data-align='right']_img]:ml-auto [&_figure[data-size='full']_img]:w-full [&_figure[data-size='large']_img]:w-3/4 [&_figure[data-size='medium']_img]:w-1/2 [&_figure[data-size='small']_img]:w-1/4 [&_h3]:text-xl [&_h3]:font-semibold [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg [&_li]:ml-5 [&_ol]:list-decimal [&_ul]:list-disc" dangerouslySetInnerHTML={{ __html: descriptionToEditorHtml(value) }} />
}

function descriptionToEditorHtml(value: string) {
  if (!value) return ''
  if (/<\/?[a-z][\s\S]*>/i.test(value)) return sanitizeActivityDescriptionHtml(value)
  return escapeHtml(plainActivityText(value)).replace(/\n/g, '<br>')
}

function sanitizeActivityDescriptionHtml(value: string) {
  if (typeof DOMParser === 'undefined') return escapeHtml(plainActivityText(value)).replace(/\n/g, '<br>')
  const parsed = new DOMParser().parseFromString(value, 'text/html')
  parsed.querySelectorAll('script,style,iframe,object,embed,form,input,button').forEach((node) => node.remove())
  parsed.body.querySelectorAll('*').forEach((element) => {
    for (const attribute of Array.from(element.attributes)) {
      const name = attribute.name.toLowerCase()
      const raw = attribute.value.trim()
      if (name.startsWith('on') || name === 'srcdoc' || name === 'style') element.removeAttribute(attribute.name)
      else if ((name === 'href' || name === 'src') && /^(?:javascript|data:text\/html)/i.test(raw)) element.removeAttribute(attribute.name)
    }
  })
  return parsed.body.innerHTML
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
function instrumentTextSize(type: string | undefined, fields: Record<string, string>) { const value = type ? fields[`${type}:meta:textSize`] : undefined; return value === 'compact' || value === 'large' ? value : 'normal' }
function instrumentTextAlign(type: string | undefined, fields: Record<string, string>) { const value = type ? fields[`${type}:meta:textAlign`] : undefined; return value === 'center' || value === 'right' ? value : 'left' }
function escapeHtml(value: string) { return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;') }
function formatInstrumentNumber(value: number) { if (!Number.isFinite(value)) return '—'; return Number(value.toFixed(2)).toLocaleString('es-DO', { maximumFractionDigits: 2 }) }
function instrumentTitle(value: string) { const label = ({ rubrica: 'Rúbrica de evaluación', 'lista-cotejo': 'Lista de cotejo', escala: 'Escala estimativa', 'lista-ponderada': 'Lista ponderada' } as Record<string, string>)[value]; return label ?? (value || 'Sin instrumento') }
function activityMomentTitle(value?: string) { return ({ inicio: 'Inicio', desarrollo: 'Desarrollo', cierre: 'Cierre' } as Record<string, string>)[value ?? ''] ?? 'Sin definir' }
function formatActivityTechnique(value?: string) { if (!value) return 'Sin técnica'; const text = value.replace(/[-_]+/g, ' ').trim(); return text ? text.charAt(0).toLocaleUpperCase('es') + text.slice(1) : 'Sin técnica' }
function formatActivityDate(value?: string | null) { if (!value) return 'Sin fecha'; const date = new Date(value); return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('es-DO', { day: '2-digit', month: '2-digit', year: 'numeric' }) }
function resourceIcon(resource: string) { const value = resource.toLocaleLowerCase(); const cls = 'size-4'; if (value.includes('computadora') || value.includes('portátil')) return <Laptop className={cn(cls, 'text-violet-600')} />; if (value.includes('presentación') || value.includes('powerpoint')) return <Presentation className={cn(cls, 'text-orange-500')} />; if (value.includes('pantalla') || value.includes('televisión') || value.includes('proyector')) return <Monitor className={cn(cls, 'text-emerald-600')} />; if (value.includes('libro')) return <BookOpen className={cn(cls, 'text-blue-600')} />; if (value.includes('hojas') || value.includes('papel') || value.includes('cartulina')) return <Files className={cn(cls, 'text-amber-600')} />; return <FileText className={cn(cls, 'text-blue-600')} /> }

function mixHex(first: string, second: string, weight: number) {
  const parse = (hex: string) => { const value = hex.replace('#', ''); return [0, 2, 4].map((offset) => Number.parseInt(value.slice(offset, offset + 2), 16)) }
  const [r1, g1, b1] = parse(first)
  const [r2, g2, b2] = parse(second)
  const channel = (a: number, b: number) => Math.round(a * (1 - weight) + b * weight).toString(16).padStart(2, '0')
  return `#${channel(r1, r2)}${channel(g1, g2)}${channel(b1, b2)}`
}
