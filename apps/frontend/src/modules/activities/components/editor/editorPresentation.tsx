import { type ActivityCompletionTarget } from '@/modules/activities/components/editor/editorModel'
import { competencyBlocks, plainActivityText } from '@/modules/grading/utils/competencyGrades'
import { cn } from '@/utils/cn'
import { useEffect, useRef, useState } from 'react'

export function instrumentTitle(instrumentType: string) {
  const titles: Record<string, string> = {
    rubrica: 'Rúbrica de evaluación',
    'lista-cotejo': 'Lista de cotejo',
    escala: 'Escala estimativa',
    'lista-ponderada': 'Lista ponderada',
  }

  return titles[instrumentType] ?? 'Selecciona un instrumento'
}

export const blockAccents = ['primary', 'success', 'warning', 'destructive'].map((token) => ({
  card: 'border-border bg-card',
  cardBorder: 'var(--border)',
  cardTint: 'var(--card)',
  panel: 'bg-muted/40 text-foreground',
  dot: 'bg-primary',
  badge: 'bg-muted text-foreground ring-border',
  progress: 'bg-primary',
  progressColor: 'var(--primary)',
  gradient: 'var(--primary)',
  button: 'bg-primary text-primary-foreground hover:bg-primary/90',
  border: 'border-border',
  ring: 'focus-visible:ring-primary',
  text: 'text-foreground',
  identityColor: 'var(--' + token + ')',
}))

export const blockShortNames: Record<string, string> = {
  b1: 'Competencia Comunicativa',
  b2: 'Pensamiento Lógico, Creativo y Crítico y Resolución de Problemas',
  b3: 'Ética y Ciudadana y Desarrollo Personal y Espiritual',
  b4: 'Científica y Tecnológica y Ambiental y de la Salud',
}

export function getBlockAccent(blockId: string) {
  const blockIndex = competencyBlocks.findIndex((block) => block.id === blockId)
  return blockAccents[blockIndex >= 0 ? blockIndex : 0]
}

export function normalizeEditorUrl(value: string, imageOnly = false) {
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

export function descriptionToEditorHtml(value: string) {
  if (!value) return ''
  if (/<\/?[a-z][\s\S]*>/i.test(value)) return sanitizeActivityDescriptionHtml(value)
  return escapeHtml(plainActivityText(value)).replace(/\n/g, '<br>')
}

export function activityDescriptionText(value: string) {
  if (!value) return ''
  if (!/<\/?[a-z][\s\S]*>/i.test(value)) return plainActivityText(value)
  if (typeof DOMParser === 'undefined') return value.replace(/<[^>]*>/g, ' ')
  const documentValue = new DOMParser().parseFromString(value, 'text/html')
  return documentValue.body.textContent ?? ''
}

export function sanitizeActivityDescriptionHtml(value: string) {
  if (!value || typeof DOMParser === 'undefined') return value
  const parsed = new DOMParser().parseFromString(value, 'text/html')
  parsed
    .querySelectorAll('script, style, iframe, object, embed')
    .forEach((element) => element.remove())
  parsed.body.querySelectorAll('*').forEach((element) => {
    const allowedTags = new Set([
      'P',
      'DIV',
      'BR',
      'B',
      'STRONG',
      'I',
      'EM',
      'U',
      'SPAN',
      'UL',
      'OL',
      'LI',
      'A',
      'IMG',
      'FIGURE',
      'FIGCAPTION',
      'H3',
      'BLOCKQUOTE',
    ])
    if (!allowedTags.has(element.tagName)) {
      element.replaceWith(...Array.from(element.childNodes))
      return
    }
    Array.from(element.attributes).forEach((attribute) => {
      const safeStyle =
        attribute.name === 'style' &&
        attribute.value
          .split(';')
          .filter(Boolean)
          .every((rule) =>
            /^\s*(text-align:\s*(left|center|right)|font-size:\s*(1[0-9]|2[0-9]|3[0-2])px)\s*$/i.test(
              rule,
            ),
          )
      const allowedFigureAttribute =
        element.tagName === 'FIGURE' &&
        ['data-activity-image', 'data-size', 'data-align'].includes(attribute.name)
      const allowedAttribute =
        (element.tagName === 'A' && attribute.name === 'href') ||
        (element.tagName === 'IMG' && ['src', 'alt'].includes(attribute.name)) ||
        allowedFigureAttribute ||
        safeStyle
      if (!allowedAttribute || attribute.name.startsWith('on'))
        element.removeAttribute(attribute.name)
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

export function ActivityDescriptionContent({
  value,
  fallback,
}: {
  value?: string
  fallback: string
}) {
  if (!value) return <p>{fallback}</p>
  return (
    <div
      className="activity-description space-y-2 [&_a]:text-primary [&_a]:underline [&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:bg-primary/50 [&_blockquote]:px-4 [&_blockquote]:py-3 [&_blockquote]:text-muted-foreground [&_figcaption]:mt-2 [&_figcaption]:text-center [&_figcaption]:text-xs [&_figcaption]:text-muted-foreground [&_figure]:my-4 [&_figure]:w-full [&_figure[data-align='center']_img]:mx-auto [&_figure[data-align='right']_img]:ml-auto [&_figure[data-size='full']_img]:w-full [&_figure[data-size='large']_img]:w-3/4 [&_figure[data-size='medium']_img]:w-1/2 [&_figure[data-size='small']_img]:w-1/4 [&_h3]:text-xl [&_h3]:font-semibold [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg [&_li]:ml-5 [&_ol]:list-decimal [&_ul]:list-disc"
      dangerouslySetInnerHTML={{ __html: descriptionToEditorHtml(value) }}
    />
  )
}

export function formatActivityDate(value?: string) {
  if (!value) return 'Sin fecha'
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('es-DO', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function formatActivityTechnique(value?: string) {
  if (!value) return 'Sin técnica'
  return (
    evaluationTechniqueOptions.find(([id]) => id === value)?.[1] ??
    value
      .split('-')
      .map((word) => word.charAt(0).toLocaleUpperCase() + word.slice(1))
      .join(' ')
  )
}

export function activityMomentTitle(value?: string) {
  if (value === 'inicio') return 'Inicio'
  if (value === 'desarrollo') return 'Desarrollo'
  if (value === 'cierre') return 'Cierre'
  return 'Sin definir'
}

export function ProgressBar({
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
  const progress = Math.min(100, Math.max(0, value))

  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-muted', className)}>
      <div
        className={cn(
          'h-full w-full origin-left rounded-full bg-primary transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none',
          indicatorClassName,
        )}
        style={{
          background: indicatorGradient || indicatorColor,
          transform: `scaleX(${progress / 100})`,
        }}
      />
    </div>
  )
}

export const transientHighlightClass =
  'rounded-xl ring-2 ring-primary/70 ring-offset-2 ring-offset-background shadow-sm transition-shadow duration-200'

export function useTransientActivityHighlight(duration = 3000) {
  const [highlightTarget, setHighlightTarget] = useState<ActivityCompletionTarget | null>(null)
  const timeoutRef = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current)
    },
    [],
  )

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

export const evaluationTechniqueOptions = [
  ['observacion-directa', 'Observación directa'],
  ['observacion-sistematica', 'Observación sistemática'],
  ['preguntas-orales', 'Preguntas orales'],
  ['dialogo-reflexivo', 'Diálogo reflexivo'],
  ['debate', 'Debate'],
  ['exposicion', 'Exposición'],
  ['presentacion', 'Presentación'],
  ['entrevista', 'Entrevista'],
  ['mesa-redonda', 'Mesa redonda'],
  ['dramatizacion', 'Dramatización'],
  ['analisis-producciones', 'Análisis de producciones'],
  ['portafolio', 'Portafolio'],
  ['diario-reflexivo', 'Diario reflexivo'],
  ['estudio-caso', 'Estudio de caso'],
  ['proyecto', 'Proyecto'],
  ['resolucion-problemas', 'Resolución de problemas'],
  ['mapa-conceptual', 'Mapa conceptual'],
  ['ensayo', 'Ensayo'],
  ['prueba-escrita', 'Prueba escrita'],
  ['autoevaluacion', 'Autoevaluación'],
  ['coevaluacion', 'Coevaluación'],
  ['heteroevaluacion', 'Heteroevaluación'],
] as const

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
