// Layout adapted from the user-provided Polymet design.
import { CircleCheck, Ellipsis, Plus, Wallet, Wifi } from 'lucide-react'
import { cn } from '@/utils/cn'
import {
  Button,
  DropdownMenu2,
  DropdownMenuContent2,
  DropdownMenuItem2,
  DropdownMenuSeparator2,
  DropdownMenuTrigger2,
} from '../reference-ui'
import { formatCurrency } from '../data/format-currency'

var brandBadge = {
  visa: 'bg-blue-600 text-white',
  mastercard: 'bg-orange-500 text-white',
  amex: 'bg-cyan-600 text-white',
  paypal: 'bg-sky-500 text-white',
}
function BrandMark({ brand }) {
  const label =
    brand === 'visa' ? 'VISA' : brand === 'mastercard' ? 'MC' : brand === 'amex' ? 'AMEX' : 'PP'
  return (
    <span
      className={cn(
        'flex h-9 w-12 shrink-0 items-center justify-center rounded-lg text-[10px] font-extrabold tracking-wider',
        brandBadge[brand],
      )}
    >
      {label}
    </span>
  )
}
function PaymentMethodsCard({ methods, walletCredits, onSetDefault, onRemove, onAdd, onTopUp }) {
  const primary = methods.find((m) => m.isDefault) ?? methods[0]
  return (
    <section className="space-y-5 rounded-3xl bg-card p-5 shadow-xs sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold tracking-tight">{'Métodos de pago'}</h2>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 rounded-lg bg-accent px-3 text-xs font-semibold text-accent-foreground hover:bg-accent/80"
          onClick={onAdd}
        >
          <Plus className="mr-1 h-3.5 w-3.5" />
          {'Añadir'}
        </Button>
      </div>
      {primary && primary.last4 && (
        <div className="relative aspect-[1.7/1] overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-sky-500 to-blue-700 p-5 text-white shadow-xl shadow-primary/25">
          <div
            aria-hidden={true}
            className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-white/10"
          />
          <div
            aria-hidden={true}
            className="absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-white/10"
          />
          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="h-8 w-11 rounded-md bg-gradient-to-br from-amber-200 to-amber-400" />
              <Wifi className="h-5 w-5 rotate-90 opacity-80" />
            </div>
            <p className="font-mono text-lg tracking-[0.2em]">
              {'•••• •••• •••• '}
              {primary.last4}
            </p>
            <div className="flex items-end justify-between text-xs">
              <div>
                <p className="text-white/70">{'Titular'}</p>
                <p className="font-semibold">{primary.holder}</p>
              </div>
              <div className="text-right">
                <p className="text-white/70">{'Caduca'}</p>
                <p className="font-semibold">{primary.expiry}</p>
              </div>
              <span className="text-base font-extrabold italic tracking-wider">
                {primary.label.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      )}
      <ul className="space-y-2">
        {methods.map((method) => (
          <li
            key={method.id}
            className={cn(
              'flex items-center gap-3 rounded-2xl border p-3 transition-colors',
              method.isDefault ? 'border-primary/40 bg-accent/50' : 'border-border',
            )}
          >
            <BrandMark brand={method.brand} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {method.last4 ? `${method.label} •• ${method.last4}` : method.label}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {method.expiry ? `Caduca ${method.expiry}` : method.email}
              </p>
            </div>
            {method.isDefault && (
              <span className="flex items-center gap-1 text-[11px] font-bold text-primary">
                <CircleCheck className="h-3.5 w-3.5" />
                {'Principal'}
              </span>
            )}
            <DropdownMenu2>
              <DropdownMenuTrigger2 asChild={true}>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-lg text-muted-foreground"
                  aria-label="Opciones del método"
                >
                  <Ellipsis className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger2>
              <DropdownMenuContent2 align="end" className="rounded-xl">
                <DropdownMenuItem2
                  disabled={method.isDefault}
                  onClick={() => onSetDefault?.(method.id)}
                >
                  {'Usar como principal'}
                </DropdownMenuItem2>
                <DropdownMenuItem2>{'Editar datos'}</DropdownMenuItem2>
                <DropdownMenuSeparator2 />
                <DropdownMenuItem2
                  disabled={method.isDefault}
                  className="text-destructive focus:text-destructive"
                  onClick={() => onRemove?.(method.id)}
                >
                  {'Eliminar'}
                </DropdownMenuItem2>
              </DropdownMenuContent2>
            </DropdownMenu2>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-3 rounded-2xl bg-muted p-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-card text-primary shadow-xs">
          <Wallet className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">{'Saldo de la cuenta'}</p>
          <p className="text-base font-extrabold tabular-nums">{formatCurrency(walletCredits)}</p>
        </div>
        <Button size="sm" className="h-9 rounded-xl px-4 font-semibold" onClick={onTopUp}>
          {'Recargar'}
        </Button>
      </div>
    </section>
  )
}

export { PaymentMethodsCard }
