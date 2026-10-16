// Layout adapted from the user-provided Polymet design.
import { useState, useMemo } from 'react'
import { Award, BookOpen, Crown, Download, Receipt, RotateCw, Undo2 } from 'lucide-react'
import { cn } from '@/utils/cn'
import { Button } from '../reference-ui'
import { formatCurrency } from '../data/format-currency'

var typeMeta = {
  subscription: {
    icon: Crown,
    tint: 'bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400',
  },
  course: {
    icon: BookOpen,
    tint: 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
  },
  certificate: {
    icon: Award,
    tint: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
  },
  refund: {
    icon: Undo2,
    tint: 'bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400',
  },
}
var statusMeta = {
  paid: {
    label: 'Pagada',
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  },
  pending: {
    label: 'Pendiente',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  },
  failed: {
    label: 'Fallida',
    className: 'bg-destructive/10 text-destructive',
  },
  refunded: {
    label: 'Reembolsada',
    className: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400',
  },
}
var filters = [
  { id: 'all', label: 'Todas' },
  { id: 'paid', label: 'Pagadas' },
  { id: 'pending', label: 'Pendientes' },
  { id: 'failed', label: 'Fallidas' },
]
function InvoiceHistoryTable({ invoices, onDownload, onRetry, onSeeAll }) {
  const [filter, setFilter] = useState('all')
  const filtered = useMemo(
    () => (filter === 'all' ? invoices : invoices.filter((i) => i.status === filter)),
    [filter, invoices],
  )
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold tracking-tight">{'Historial de facturas'}</h2>
        <button
          type="button"
          onClick={onSeeAll}
          className="text-sm font-semibold text-primary hover:underline"
        >
          {'Ver todo'}
        </button>
      </div>
      <div className="overflow-hidden rounded-3xl bg-card shadow-xs">
        <div className="flex gap-1 overflow-x-auto border-b border-border/70 px-4 pt-3">
          {filters.map((f) => {
            const count =
              f.id === 'all' ? invoices.length : invoices.filter((i) => i.status === f.id).length
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={cn(
                  'relative shrink-0 px-3 pb-3 pt-1 text-sm font-semibold transition-colors',
                  filter === f.id
                    ? 'text-primary after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {f.label}
                <span className="ml-1.5 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                  {count}
                </span>
              </button>
            )
          })}
        </div>
        <div className="hidden grid-cols-[minmax(0,2.4fr)_1fr_1.2fr_0.9fr_0.9fr_88px] gap-4 px-6 py-3 text-xs font-semibold text-muted-foreground md:grid">
          <span>{'Concepto'}</span>
          <span>{'Fecha'}</span>
          <span>{'Método'}</span>
          <span className="text-right">{'Importe'}</span>
          <span>{'Estado'}</span>
          <span className="sr-only">{'Acciones'}</span>
        </div>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-primary">
              <Receipt className="h-6 w-6" />
            </span>
            <p className="text-sm font-semibold">{'No hay facturas en esta categoría'}</p>
            <p className="text-xs text-muted-foreground">
              {'Cuando se generen nuevos cobros aparecerán aquí.'}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border/60 md:divide-y-0">
            {filtered.map((invoice) => {
              const type = typeMeta[invoice.type]
              const status = statusMeta[invoice.status]
              const Icon = type.icon
              const failed = invoice.status === 'failed'
              return (
                <li
                  key={invoice.id}
                  className={cn(
                    'grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 px-4 py-3.5 transition-colors md:mx-2 md:grid-cols-[minmax(0,2.4fr)_1fr_1.2fr_0.9fr_0.9fr_88px] md:rounded-2xl md:px-4',
                    failed ? 'bg-destructive/5' : 'hover:bg-accent/60',
                  )}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                        type.tint,
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p
                        className={cn(
                          'truncate text-sm font-semibold',
                          failed && 'text-destructive',
                        )}
                      >
                        {invoice.concept}
                      </p>
                      <p className="text-xs text-muted-foreground">{invoice.number}</p>
                    </div>
                  </div>
                  <span className="hidden text-sm text-muted-foreground md:block">
                    {invoice.date}
                  </span>
                  <span className="hidden truncate text-sm text-muted-foreground md:block">
                    {invoice.method}
                  </span>
                  <span
                    className={cn(
                      'text-right text-sm font-bold tabular-nums',
                      invoice.type === 'refund' && 'text-violet-600 dark:text-violet-400',
                    )}
                  >
                    {invoice.type === 'refund' ? '+' : ''}
                    {formatCurrency(invoice.amount)}
                  </span>
                  <span className="flex items-center gap-2 text-xs text-muted-foreground md:block">
                    <span
                      className={cn(
                        'inline-flex rounded-lg px-2 py-1 text-[11px] font-bold',
                        status.className,
                      )}
                    >
                      {status.label}
                    </span>
                    <span className="md:hidden">{invoice.date}</span>
                  </span>
                  <div className="flex items-center justify-end gap-1">
                    {failed && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 rounded-lg px-2 text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => onRetry?.(invoice)}
                      >
                        <RotateCw className="mr-1 h-3.5 w-3.5" />
                        {'Reintentar'}
                      </Button>
                    )}
                    {!failed && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-accent hover:text-primary"
                        aria-label={`Descargar ${invoice.number}`}
                        onClick={() => onDownload?.(invoice)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
        <div className="h-2" />
      </div>
    </section>
  )
}

export { InvoiceHistoryTable }
