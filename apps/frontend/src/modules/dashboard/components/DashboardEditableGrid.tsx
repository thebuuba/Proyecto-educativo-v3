import { Check, GripVertical, LayoutDashboard, MoveDiagonal2, RotateCcw } from 'lucide-react'
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'

export type DashboardWidgetLayout = {
  x: number
  y: number
  w: number
  h: number
  minW?: number
  minH?: number
  maxW?: number
  maxH?: number
}

export type DashboardGridWidget = {
  id: string
  label: string
  content: ReactNode
  layout: DashboardWidgetLayout
}

type DashboardEditableGridProps = {
  widgets: DashboardGridWidget[]
  storageKey: string
}

type LayoutItem = DashboardWidgetLayout & { id: string }

type Interaction = {
  kind: 'move' | 'resize'
  id: string
  startClientX: number
  startClientY: number
  startItem: LayoutItem
  startLayout: LayoutItem[]
}

const COLS = 12
const ROW_HEIGHT = 44
const GAP = 20
const DESKTOP_MIN_WIDTH = 1024

function overlaps(a: LayoutItem, b: LayoutItem) {
  return !(
    a.x + a.w <= b.x ||
    b.x + b.w <= a.x ||
    a.y + a.h <= b.y ||
    b.y + b.h <= a.y
  )
}

function clampItem(item: LayoutItem): LayoutItem {
  const minW = item.minW ?? 1
  const minH = item.minH ?? 1
  const maxW = Math.min(COLS, item.maxW ?? COLS)
  const maxH = item.maxH ?? 30
  const w = Math.max(minW, Math.min(maxW, item.w))
  const h = Math.max(minH, Math.min(maxH, item.h))
  const x = Math.max(0, Math.min(COLS - w, item.x))

  return { ...item, x, y: Math.max(0, item.y), w, h }
}

function compactLayout(items: LayoutItem[], pinnedId?: string) {
  const pinned = pinnedId ? items.find((item) => item.id === pinnedId) : undefined
  const placed: LayoutItem[] = pinned ? [{ ...pinned }] : []
  const movable = items
    .filter((item) => item.id !== pinnedId)
    .map((item) => ({ ...item }))
    .sort((a, b) => a.y - b.y || a.x - b.x)

  movable.forEach((item) => {
    let next = clampItem(item)

    while (next.y > 0) {
      const candidate = { ...next, y: next.y - 1 }
      if (placed.some((other) => overlaps(candidate, other))) break
      next = candidate
    }

    placed.push(next)
  })

  const byId = new Map(placed.map((item) => [item.id, item]))
  return items.map((item) => byId.get(item.id) ?? item)
}

function resolveCollisions(items: LayoutItem[], activeId: string, candidate: LayoutItem) {
  const next = items.map((item) => item.id === activeId ? clampItem(candidate) : { ...item })
  const byId = new Map(next.map((item) => [item.id, item]))
  const queue = [activeId]
  let guard = 0

  while (queue.length && guard < 100) {
    guard += 1
    const sourceId = queue.shift()
    if (!sourceId) break
    const source = byId.get(sourceId)
    if (!source) continue

    next.forEach((other) => {
      if (other.id === source.id || other.id === activeId) return
      if (!overlaps(source, other)) return

      const pushed = clampItem({ ...other, y: source.y + source.h })
      byId.set(other.id, pushed)
      const index = next.findIndex((item) => item.id === other.id)
      if (index >= 0) next[index] = pushed
      queue.push(other.id)
    })
  }

  return compactLayout(next, activeId)
}

function reconcileLayout(widgets: DashboardGridWidget[], saved?: LayoutItem[]) {
  const savedById = new Map(saved?.map((item) => [item.id, item]) ?? [])
  const merged = widgets.map((widget) => {
    const stored = savedById.get(widget.id)
    return clampItem({
      id: widget.id,
      ...widget.layout,
      ...(stored ? {
        x: stored.x,
        y: stored.y,
        w: stored.w,
        h: stored.h,
      } : {}),
    })
  })

  return compactLayout(merged)
}

function readStoredLayout(storageKey: string) {
  if (typeof window === 'undefined') return undefined

  try {
    const raw = window.localStorage.getItem(storageKey)
    if (!raw) return undefined
    const parsed = JSON.parse(raw) as LayoutItem[]
    return Array.isArray(parsed) ? parsed : undefined
  } catch {
    return undefined
  }
}

export function DashboardEditableGrid({ widgets, storageKey }: DashboardEditableGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetsRef = useRef(widgets)
  widgetsRef.current = widgets

  const [containerWidth, setContainerWidth] = useState(0)
  const [editing, setEditing] = useState(false)
  const [interaction, setInteraction] = useState<Interaction | null>(null)
  const [layout, setLayout] = useState<LayoutItem[]>(() =>
    reconcileLayout(widgets, readStoredLayout(storageKey)),
  )

  const widgetSignature = useMemo(() => widgets.map((widget) => widget.id).join('|'), [widgets])
  const isDesktop = containerWidth >= DESKTOP_MIN_WIDTH

  useEffect(() => {
    const node = containerRef.current
    if (!node) return undefined

    const updateWidth = () => setContainerWidth(node.getBoundingClientRect().width)
    updateWidth()

    if (typeof ResizeObserver === 'undefined') return undefined

    const observer = new ResizeObserver(updateWidth)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    setLayout((current) => reconcileLayout(widgetsRef.current, current))
  }, [widgetSignature])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const timeout = window.setTimeout(() => {
      window.localStorage.setItem(storageKey, JSON.stringify(layout))
    }, 120)

    return () => window.clearTimeout(timeout)
  }, [layout, storageKey])

  useEffect(() => {
    if (!interaction || !isDesktop) return undefined

    const availableWidth = containerWidth - GAP * (COLS - 1)
    const colWidth = availableWidth / COLS
    const horizontalUnit = colWidth + GAP
    const verticalUnit = ROW_HEIGHT + GAP

    const handleMove = (event: PointerEvent) => {
      const deltaX = event.clientX - interaction.startClientX
      const deltaY = event.clientY - interaction.startClientY
      const deltaCols = Math.round(deltaX / horizontalUnit)
      const deltaRows = Math.round(deltaY / verticalUnit)
      const start = interaction.startItem

      const candidate = interaction.kind === 'move'
        ? { ...start, x: start.x + deltaCols, y: start.y + deltaRows }
        : { ...start, w: start.w + deltaCols, h: start.h + deltaRows }

      setLayout(resolveCollisions(interaction.startLayout, interaction.id, clampItem(candidate)))
    }

    const handleUp = () => setInteraction(null)
    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp, { once: true })
    window.addEventListener('pointercancel', handleUp, { once: true })

    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
      window.removeEventListener('pointercancel', handleUp)
    }
  }, [containerWidth, interaction, isDesktop])

  const beginInteraction = (
    event: ReactPointerEvent<HTMLButtonElement>,
    id: string,
    kind: Interaction['kind'],
  ) => {
    if (!editing || !isDesktop) return
    event.preventDefault()
    event.stopPropagation()

    const item = layout.find((candidate) => candidate.id === id)
    if (!item) return

    setInteraction({
      kind,
      id,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startItem: { ...item },
      startLayout: layout.map((candidate) => ({ ...candidate })),
    })
  }

  const resetLayout = () => {
    const next = reconcileLayout(widgetsRef.current)
    setLayout(next)
    if (typeof window !== 'undefined') window.localStorage.removeItem(storageKey)
  }

  const layoutById = new Map(layout.map((item) => [item.id, item]))
  const mobileWidgets = [...widgets].sort((first, second) => {
    const a = layoutById.get(first.id) ?? { x: 0, y: 0 }
    const b = layoutById.get(second.id) ?? { x: 0, y: 0 }
    return a.y - b.y || a.x - b.x
  })

  return (
    <section aria-label="Panel personalizable">
      <div className="mb-3 hidden items-center justify-end gap-2 lg:flex">
        {editing ? (
          <>
            <button
              type="button"
              onClick={resetLayout}
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-border bg-card px-3 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20"
            >
              <RotateCcw className="size-3.5" />
              Restablecer
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="inline-flex h-9 items-center gap-2 rounded-xl bg-primary px-3 text-xs font-bold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20"
            >
              <Check className="size-3.5" />
              Listo
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-border bg-card px-3 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary-container hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20"
          >
            <LayoutDashboard className="size-3.5" />
            Editar panel
          </button>
        )}
      </div>

      <div ref={containerRef}>
        {isDesktop ? (
          <div
            className="dashboard-custom-grid"
            data-editing={editing ? 'true' : 'false'}
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
              gridAutoRows: `${ROW_HEIGHT}px`,
              gap: `${GAP}px`,
            }}
          >
            {widgets.map((widget) => {
              const item = layoutById.get(widget.id) ?? { id: widget.id, ...widget.layout }
              const isActive = interaction?.id === widget.id

              return (
                <div
                  key={widget.id}
                  className="dashboard-grid-widget relative min-h-0 min-w-0"
                  data-interacting={isActive ? 'true' : 'false'}
                  style={{
                    gridColumn: `${item.x + 1} / span ${item.w}`,
                    gridRow: `${item.y + 1} / span ${item.h}`,
                    zIndex: isActive ? 20 : 1,
                  }}
                >
                  {editing ? (
                    <button
                      type="button"
                      onPointerDown={(event) => beginInteraction(event, widget.id, 'move')}
                      className="dashboard-widget-drag-handle absolute left-1/2 top-2 z-30 inline-flex h-7 -translate-x-1/2 touch-none items-center gap-1 rounded-full border border-primary/25 bg-card/95 px-2.5 text-[10px] font-bold text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20"
                      aria-label={`Mover ${widget.label}`}
                    >
                      <GripVertical className="size-3" />
                      Mover
                    </button>
                  ) : null}

                  <div className="dashboard-grid-widget-content h-full min-h-0 overflow-auto rounded-3xl">
                    {widget.content}
                  </div>

                  {editing ? (
                    <button
                      type="button"
                      onPointerDown={(event) => beginInteraction(event, widget.id, 'resize')}
                      className="dashboard-widget-resize-handle absolute bottom-2 right-2 z-30 flex size-8 touch-none items-center justify-center rounded-xl border border-primary/25 bg-card/95 text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20"
                      aria-label={`Cambiar tamaño de ${widget.label}`}
                    >
                      <MoveDiagonal2 className="size-3.5" />
                    </button>
                  ) : null}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="space-y-5">
            {mobileWidgets.map((widget) => (
              <div key={widget.id}>{widget.content}</div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
