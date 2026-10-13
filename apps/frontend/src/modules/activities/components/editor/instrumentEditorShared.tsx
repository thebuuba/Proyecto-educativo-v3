import { Button } from '@/components/ui/Button'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { blockAccents } from '@/modules/activities/components/editor/editorPresentation'
import { cn } from '@/utils/cn'
import { distributeScoreUnits, validateInstrumentDefinition } from '@aula/shared'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Copy,
  EllipsisVertical,
  Trash2,
  X,
} from 'lucide-react'
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'
import { createPortal } from 'react-dom'
import { scoreInstrumentFields } from '../../services/instrumentScoring'

export function inferInstrumentCount(
  fields: Record<string, string>,
  type: string,
  field: string,
  fallback: number,
) {
  const indexes = Object.keys(fields)
    .filter((key) => key.startsWith(`${type}:${field}:`))
    .map((key) => Number(key.split(':')[2]))
    .filter(Number.isFinite)
  return indexes.length > 0 ? Math.max(...indexes) + 1 : fallback
}

export function inferRubricLevels(fields: Record<string, string>, fallback: number) {
  const levels = Object.keys(fields)
    .filter((key) => key.startsWith('rubrica:descriptor:'))
    .map((key) => Number(key.split(':')[3]))
    .filter(Number.isFinite)
  return levels.length > 0 ? Math.max(...levels) : fallback
}

export function defaultRubricStructure(maxScore: number) {
  void maxScore
  return { criteria: 4, levels: 4 }
}

export function distributeScore(maxScore: number, count: number) {
  const safeCount = Math.max(1, count)
  const totalCents = Math.max(0, Math.round(maxScore * 100))
  const base = Math.floor(totalCents / safeCount)
  const remainder = totalCents - base * safeCount
  return Array.from({ length: safeCount }, (_, index) =>
    Number(((base + (index < remainder ? 1 : 0)) / 100).toFixed(2)),
  )
}

export function formatInstrumentNumber(value: number) {
  if (!Number.isFinite(value)) return '—'
  return Number(value.toFixed(2)).toLocaleString('es-DO', { maximumFractionDigits: 2 })
}

export function instrumentConfiguredValue(
  type: string,
  fields: Record<string, string>,
  count: number,
) {
  const field = type === 'lista-ponderada' ? 'weight' : 'points'
  return Number(
    Array.from({ length: count }, (_, index) =>
      Number(fields[instrumentFieldKey(type, field, index)] || 0),
    )
      .reduce((sum, value) => sum + value, 0)
      .toFixed(2),
  )
}

export function InstrumentSummaryItem({
  good,
  label,
  value,
}: {
  good?: boolean
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2">
      <p className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          'mt-1 truncate text-sm font-black',
          good === true
            ? 'text-success'
            : good === false
              ? 'text-warning-foreground'
              : 'text-foreground',
        )}
      >
        {value}
        {good ? <CheckCircle2 className="ml-1 inline size-3.5" /> : null}
      </p>
    </div>
  )
}

export type InstrumentTextSize = 'compact' | 'normal' | 'large'

export type InstrumentTextAlign = 'left' | 'center' | 'right'

export function instrumentTextSize(
  type: string | undefined,
  fields: Record<string, string>,
): InstrumentTextSize {
  const value = type ? fields[`${type}:meta:textSize`] : undefined
  return value === 'compact' || value === 'large' ? value : 'normal'
}

export function instrumentTypographyClass(
  type: string | undefined,
  fields: Record<string, string>,
) {
  const textSize = instrumentTextSize(type, fields)
  const bold = Boolean(type && fields[`${type}:meta:bold`] === 'true')
  const textAlign = instrumentTextAlign(type, fields)
  return cn(
    textSize === 'compact'
      ? '[&_input]:text-xs [&_table]:text-xs [&_textarea]:h-14 [&_textarea]:text-xs'
      : '',
    textSize === 'normal'
      ? '[&_input]:text-sm [&_table]:text-sm [&_textarea]:h-16 [&_textarea]:text-sm'
      : '',
    textSize === 'large'
      ? '[&_input]:text-base [&_table]:text-base [&_textarea]:h-20 [&_textarea]:text-base [&_textarea]:leading-6'
      : '',
    bold ? '[&_input]:font-semibold [&_td]:font-semibold [&_textarea]:font-semibold' : '',
    textAlign === 'left'
      ? '[&_input]:text-left [&_td]:text-left [&_th]:text-left [&_textarea]:text-left'
      : '',
    textAlign === 'center'
      ? '[&_input]:text-center [&_td]:text-center [&_th]:text-center [&_textarea]:text-center'
      : '',
    textAlign === 'right'
      ? '[&_input]:text-right [&_td]:text-right [&_th]:text-right [&_textarea]:text-right'
      : '',
  )
}

export function instrumentTextAlign(
  type: string | undefined,
  fields: Record<string, string>,
): InstrumentTextAlign {
  const value = type ? fields[`${type}:meta:textAlign`] : undefined
  return value === 'center' || value === 'right' ? value : 'left'
}

export function InstrumentTypographyControls({
  bold,
  onBoldChange,
  onTextAlignChange,
  onTextSizeChange,
  textAlign,
  textSize,
}: {
  bold: boolean
  onBoldChange: (value: boolean) => void
  onTextAlignChange: (value: InstrumentTextAlign) => void
  onTextSizeChange: (value: InstrumentTextSize) => void
  textAlign: InstrumentTextAlign
  textSize: InstrumentTextSize
}) {
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
  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1 shadow-sm">
      {sizes.map((item) => (
        <button
          key={item.value}
          type="button"
          title={item.title}
          aria-label={item.title}
          aria-pressed={textSize === item.value}
          className={cn(
            'grid h-7 min-w-8 place-items-center rounded-md px-1.5 text-xs font-black transition hover:bg-primary/10 hover:text-primary',
            textSize === item.value
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground',
          )}
          onClick={() => onTextSizeChange(item.value)}
        >
          {item.label}
        </button>
      ))}
      <span className="mx-0.5 h-5 w-px bg-border" />
      <button
        type="button"
        title="Alternar negrita"
        aria-label="Alternar negrita"
        aria-pressed={bold}
        className={cn(
          'grid size-7 place-items-center rounded-md text-sm font-black transition hover:bg-primary/10 hover:text-primary',
          bold ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground',
        )}
        onClick={() => onBoldChange(!bold)}
      >
        B
      </button>
      <span className="mx-0.5 h-5 w-px bg-border" />
      {alignments.map((item) => (
        <button
          key={item.value}
          type="button"
          title={item.label}
          aria-label={item.label}
          aria-pressed={textAlign === item.value}
          className={cn(
            'grid size-7 place-items-center rounded-md transition hover:bg-primary/10 hover:text-primary',
            textAlign === item.value
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground',
          )}
          onClick={() => onTextAlignChange(item.value)}
        >
          {item.icon}
        </button>
      ))}
    </div>
  )
}

export type RubricLevelDraft = {
  id: string
  sourceScore: number | null
  name: string
  points: number
}

export type RubricPointMode = 'automatic' | 'manual'

export const rubricLevelPalette = [
  {
    background: 'var(--muted)',
    border: 'var(--border)',
    foreground: 'var(--foreground)',
    soft: 'var(--border)',
  },
  {
    background: 'var(--muted)',
    border: 'var(--border)',
    foreground: 'var(--foreground)',
    soft: 'var(--border)',
  },
  {
    background: 'var(--muted)',
    border: 'var(--border)',
    foreground: 'var(--foreground)',
    soft: 'var(--border)',
  },
  {
    background: 'var(--muted)',
    border: 'var(--border)',
    foreground: 'var(--foreground)',
    soft: 'var(--border)',
  },
  {
    background: 'var(--muted)',
    border: 'var(--border)',
    foreground: 'var(--foreground)',
    soft: 'var(--border)',
  },
  {
    background: 'var(--muted)',
    border: 'var(--border)',
    foreground: 'var(--foreground)',
    soft: 'var(--border)',
  },
]

export function rubricLevelVisual(index: number, count: number) {
  const paletteIndex =
    count <= 1 ? 0 : Math.round((index * (rubricLevelPalette.length - 1)) / (count - 1))
  return rubricLevelPalette[Math.min(rubricLevelPalette.length - 1, Math.max(0, paletteIndex))]
}

export function automaticRubricLevelDrafts(drafts: RubricLevelDraft[], maximum: number) {
  const points = defaultRubricLevelPoints(maximum, drafts.length)
  return drafts.map((draft, index) => ({ ...draft, points: points[index] ?? 0 }))
}

export function InstrumentSettingsDrawer({
  accent,
  applyButtonClassName,
  applyDisabled = false,
  children,
  description,
  onApply,
  onClose,
  panelClassName,
  title,
}: {
  accent: (typeof blockAccents)[number]
  applyButtonClassName?: string
  applyDisabled?: boolean
  children: ReactNode
  description: string
  onApply: () => void
  onClose: () => void
  panelClassName?: string
  title: string
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  useFocusTrap({ ref: panelRef, active: true, onEscape: onClose })
  return (
    <div
      className="fixed inset-0 z-50 bg-foreground/40 motion-safe:animate-[fadeIn_200ms_ease-out]"
      role="presentation"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="instrument-settings-title"
        className={cn(
          'ml-auto flex h-full w-full flex-col border-l border-border bg-card shadow-2xl motion-safe:animate-[slideInRight_250ms_ease-out]',
          panelClassName || 'max-w-[34rem]',
        )}
      >
        <div className="h-1 shrink-0" style={{ background: accent.gradient }} />
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div>
            <h3 id="instrument-settings-title" className="text-lg font-black text-foreground">
              {title}
            </h3>
            <p className="mt-1 text-sm leading-5 text-muted-foreground">{description}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Cerrar configuración"
            onClick={onClose}
          >
            <X className="size-5" />
          </Button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto p-5">{children}</div>
        <footer className="flex shrink-0 justify-end gap-3 border-t border-border bg-card px-5 py-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="button"
            className={applyButtonClassName || accent.button}
            disabled={applyDisabled}
            onClick={onApply}
          >
            Aplicar cambios
          </Button>
        </footer>
      </div>
    </div>
  )
}

export function setDragDocumentState(active: boolean) {
  document.documentElement.style.cursor = active ? 'grabbing' : ''
  document.body.style.userSelect = active ? 'none' : ''
}

export function InstrumentRowMenu({
  onComplete,
  completing = false,
  completionDisabled = false,
  canMoveDown,
  canMoveUp,
  onDelete,
  onDuplicate,
  onMoveDown,
  onMoveUp,
}: {
  onComplete?: () => void
  completing?: boolean
  completionDisabled?: boolean
  canMoveDown: boolean
  canMoveUp: boolean
  onDelete: () => void
  onDuplicate: () => void
  onMoveDown: () => void
  onMoveUp: () => void
}) {
  const [open, setOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node
      if (!buttonRef.current?.contains(target) && !popupRef.current?.contains(target))
        setOpen(false)
    }
    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    function closeOnViewportChange() {
      setOpen(false)
    }
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
    if (open) {
      setOpen(false)
      return
    }
    const rect = buttonRef.current?.getBoundingClientRect()
    if (!rect) return
    const menuHeight = onComplete ? 214 : 178
    const viewportPadding = 8
    const gap = 4
    const spaceBelow = window.innerHeight - rect.bottom
    const openUpward = spaceBelow < menuHeight + gap && rect.top > spaceBelow
    const desiredTop = openUpward ? rect.top - menuHeight - gap : rect.bottom + gap
    setMenuPosition({
      top: Math.min(
        Math.max(viewportPadding, desiredTop),
        window.innerHeight - menuHeight - viewportPadding,
      ),
      right: Math.max(viewportPadding, window.innerWidth - rect.right),
    })
    setOpen(true)
  }

  function runAction(action: () => void) {
    action()
    setOpen(false)
  }

  const popup = open ? (
    <div
      ref={popupRef}
      role="menu"
      className="fixed z-[100] w-44 overflow-hidden rounded-lg border border-border bg-popover p-1 text-left shadow-xl"
      style={{ top: menuPosition.top, right: menuPosition.right }}
    >
      {onComplete ? <button type="button" role="menuitem" disabled={completionDisabled || completing}
        className="flex w-full items-center gap-2 rounded px-2 py-2 text-xs font-bold hover:bg-muted disabled:opacity-40"
        onClick={() => runAction(onComplete)}>Completar criterio</button> : null}
      <button
        type="button"
        role="menuitem"
        className="flex w-full items-center gap-2 rounded px-2 py-2 text-xs font-bold hover:bg-muted"
        onClick={() => runAction(onDuplicate)}
      >
        <Copy className="size-3.5" />
        Duplicar
      </button>
      <button
        type="button"
        role="menuitem"
        disabled={!canMoveUp}
        className="flex w-full items-center gap-2 rounded px-2 py-2 text-xs font-bold hover:bg-muted disabled:opacity-40"
        onClick={() => runAction(onMoveUp)}
      >
        <ArrowUp className="size-3.5" />
        Mover arriba
      </button>
      <button
        type="button"
        role="menuitem"
        disabled={!canMoveDown}
        className="flex w-full items-center gap-2 rounded px-2 py-2 text-xs font-bold hover:bg-muted disabled:opacity-40"
        onClick={() => runAction(onMoveDown)}
      >
        <ArrowDown className="size-3.5" />
        Mover abajo
      </button>
      <div className="my-1 h-px bg-border" />
      <button
        type="button"
        role="menuitem"
        className="flex w-full items-center gap-2 rounded px-2 py-2 text-xs font-bold text-destructive hover:bg-destructive/10"
        onClick={() => runAction(onDelete)}
      >
        <Trash2 className="size-3.5" />
        Eliminar
      </button>
    </div>
  ) : null
  return (
    <div className="instrument-row-actions mx-auto w-fit">
      <button
        ref={buttonRef}
        type="button"
        aria-label={completing ? 'Completando criterio…' : 'Acciones de la fila'}
        aria-busy={completing}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          'grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          open ? 'bg-muted text-foreground' : '',
        )}
        onClick={toggleMenu}
      >
        <EllipsisVertical className="size-4" />
      </button>
      {popup ? createPortal(popup, document.body) : null}
    </div>
  )
}

export function focusNewInstrumentRow(
  type: string,
  index: number,
  setHighlightedRow: Dispatch<SetStateAction<number | null>>,
) {
  setHighlightedRow(index)
  window.setTimeout(() => {
    const field = document.querySelector<HTMLTextAreaElement>(
      `[data-instrument-row="${type}-${index}"]`,
    )
    field?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'center',
    })
    field?.focus()
  }, 50)
  window.setTimeout(() => setHighlightedRow(null), 1300)
}

export function shiftInstrumentRows(
  fields: Record<string, string>,
  type: string,
  removedIndex: number,
  count: number,
  _fieldNames: string[] = [],
) {
  return remapInstrumentRows(
    fields,
    type,
    Array.from({ length: count }, (_, i) => i).filter((i) => i !== removedIndex),
  )
}

export function swapInstrumentRows(
  fields: Record<string, string>,
  type: string,
  from: number,
  to: number,
  _fieldNames: string[] = [],
) {
  const count = inferInstrumentCount(fields, type, 'criterion', 0)
  const order = Array.from({ length: count }, (_, i) => i)
  if (from < 0 || to < 0 || from >= count || to >= count) return fields
  ;[order[from], order[to]] = [order[to], order[from]]
  return remapInstrumentRows(fields, type, order)
}

export function scaleTemplateLevels(template: string) {
  if (template === 'desempeno')
    return [
      { name: 'Excelente', points: 4 },
      { name: 'Bueno', points: 3 },
      { name: 'Satisfactorio', points: 2 },
      { name: 'Insuficiente', points: 1 },
    ]
  if (template === 'logro')
    return [
      { name: 'Logrado', points: 4 },
      { name: 'En proceso', points: 3 },
      { name: 'Inicial', points: 2 },
      { name: 'No logrado', points: 1 },
    ]
  return [
    { name: 'Siempre', points: 4 },
    { name: 'Casi siempre', points: 3 },
    { name: 'A veces', points: 2 },
    { name: 'Nunca', points: 1 },
  ]
}

export function rubricDefaultLevelNames(count: number) {
  if (count === 2) return ['Logrado', 'En proceso']
  if (count === 3) return ['Excelente', 'Satisfactorio', 'Insuficiente']
  if (count === 4) return ['Excelente', 'Bueno', 'Satisfactorio', 'Insuficiente']
  if (count === 5) return ['Excelente', 'Muy bueno', 'Bueno', 'Básico', 'Insuficiente']
  if (count === 6)
    return ['Excelente', 'Muy bueno', 'Bueno', 'Satisfactorio', 'Básico', 'Insuficiente']
  return Array.from({ length: count }, (_, index) => `Nivel ${index + 1}`)
}

export function defaultRubricLevelPoints(_maximum: number, count: number) {
  return Array.from({ length: count }, (_, i) => count - i - 1)
}

export function criterionPointsMaximum(
  fields: Record<string, string>,
  criteriaCount: number,
  maxScore: number,
) {
  return Number(
    fields[instrumentFieldKey('rubrica', 'points', 0)] ||
      distributeScore(maxScore, criteriaCount)[0] ||
      maxScore,
  )
}

export function EmptyInstrumentState() {
  return (
    <div className="grid min-h-72 place-items-center rounded-lg border border-dashed border-border p-6 text-center">
      <p className="max-w-sm text-sm leading-6 text-muted-foreground">
        Selecciona un instrumento para generar aquí una plantilla vacía editable.
      </p>
    </div>
  )
}

export function ToggleControl({
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

export function InstrumentCheckPlaceholder({
  tone = 'default',
}: {
  tone?: 'default' | 'positive' | 'negative' | 'neutral'
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'mx-auto block size-4 rounded border-2 bg-card shadow-sm',
        tone === 'positive'
          ? 'border-success/30'
          : tone === 'negative'
            ? 'border-destructive/30'
            : tone === 'neutral'
              ? 'border-warning/30'
              : 'border-muted-foreground/70',
      )}
    />
  )
}

export function InstrumentTable({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'overflow-auto rounded-xl border border-border bg-card p-1 shadow-sm',
        className,
      )}
    >
      <table className="min-w-[42rem] w-full border-separate border-spacing-1 text-left text-xs [&_td]:rounded-lg [&_th]:rounded-lg">
        {children}
      </table>
    </div>
  )
}

export function InstrumentInput({
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

export function InstrumentTextarea({
  ariaLabel,
  className = '',
  dataInstrumentRow,
  onChange,
  placeholder = '',
  value,
}: {
  ariaLabel?: string
  className?: string
  dataInstrumentRow?: string
  onChange?: (value: string) => void
  placeholder?: string
  value?: string
}) {
  return (
    <textarea
      aria-label={ariaLabel}
      data-instrument-row={dataInstrumentRow}
      className={cn(
        'h-24 w-full min-h-20 max-h-44 resize-y overflow-y-auto rounded-md border border-input bg-card px-2 py-1.5 text-xs leading-5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20',
        className,
      )}
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      placeholder={placeholder}
    />
  )
}

export function instrumentFieldKey(
  instrumentType: string,
  field: string,
  ...parts: Array<number | string>
) {
  return [instrumentType, field, ...parts].join(':')
}

export function hasInstrumentField(fields: Record<string, string>, key: string) {
  return Boolean(fields[key]?.trim())
}

export function isInstrumentComplete(input: {
  checklistCriteria: number
  fields: Record<string, string>
  instrumentType: string
  maxScore: number
  rubricCriteria: number
  rubricLevels: number
  scaleCriteria: number
  weightedCriteria: number
}) {
  return (
    validateInstrumentDefinition(input.instrumentType, input.fields, input.maxScore).length === 0
  )
}

export function scaleLevelVisual(
  accent: (typeof blockAccents)[number],
  index: number,
  count: number,
) {
  const ratio = count <= 1 ? 0 : index / (count - 1)
  const backgroundStrength = Math.round(20 - ratio * 13)
  const borderStrength = Math.round(52 - ratio * 22)
  return {
    background: `color-mix(in srgb, ${accent.progressColor} ${backgroundStrength}%, white)`,
    border: `color-mix(in srgb, ${accent.progressColor} ${borderStrength}%, white)`,
    foreground: 'var(--foreground)',
  }
}

export function weightedResponseVisual(index: number, count = 3) {
  return [
    { background: 'var(--muted)', border: 'var(--border)', foreground: 'var(--foreground)' },
    { background: 'var(--muted)', border: 'var(--border)', foreground: 'var(--foreground)' },
    { background: 'var(--muted)', border: 'var(--border)', foreground: 'var(--foreground)' },
  ][count === 2 && index === 1 ? 2 : Math.min(2, Math.max(0, index))]
}

export function remapInstrumentRows(
  fields: Record<string, string>,
  type: string,
  order: number[],
  duplicateAt = -1,
) {
  const next = { ...fields }
  const isRow = (key: string) =>
    key.startsWith(type + ':') &&
    /^(criterion-id|criterion-template|criterion-evidence|criterion-weight|criterion|description|descriptor|indicator|points|weight|observation)$/.test(
      key.split(':')[1],
    ) &&
    /^\d+$/.test(key.split(':')[2] ?? '')
  Object.keys(next)
    .filter(isRow)
    .forEach((key) => delete next[key])
  order.forEach((source, index) => {
    Object.entries(fields)
      .filter(([key]) => isRow(key) && Number(key.split(':')[2]) === source)
      .forEach(([key, value]) => {
        const parts = key.split(':')
        parts[2] = String(index)
        next[parts.join(':')] = value
      })
    if (index === duplicateAt) next[type + ':criterion-id:' + index] = crypto.randomUUID()
  })
  next[type + ':meta:criteriaCount'] = String(order.length)
  const key = type + ':meta:scoreWeights'
  let weights: unknown
  try {
    weights = JSON.parse(fields[key] ?? 'null')
  } catch {
    weights = null
  }
  next[key] = JSON.stringify(
    order.map((i) => {
      const value = Array.isArray(weights) ? weights[i] : fields[type + ':points:' + i]
      return value !== undefined &&
        value !== '' &&
        Number.isFinite(Number(value)) &&
        Number(value) >= 0
        ? Number(value)
        : 1
    }),
  )
  return next
}
export function duplicateInstrumentRow(
  fields: Record<string, string>,
  type: string,
  index: number,
) {
  const count = inferInstrumentCount(fields, type, 'criterion', 0)
  if (count >= 20) return fields
  return remapInstrumentRows(
    fields,
    type,
    [...Array.from({ length: count }, (_, i) => i), index],
    count,
  )
}

export function rebalanceInstrumentRows(
  fields: Record<string, string>,
  type: string,
  maxScore: number,
) {
  let next = { ...fields }
  if (type === 'lista-ponderada') {
    const count = inferInstrumentCount(next, type, 'criterion', 0)
    distributeScoreUnits(
      10000,
      Array.from({ length: count }, (_, i) => Number(next[type + ':weight:' + i] ?? 1)),
    ).forEach((weight, i) => (next[type + ':weight:' + i] = String(weight / 100)))
  }
  return scoreInstrumentFields(next, type, maxScore > 0 ? maxScore : null)
}
