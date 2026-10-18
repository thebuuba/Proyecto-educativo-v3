// Layout adapted from the user-provided Polymet design.
import { CirclePause, CircleX } from 'lucide-react'
import {
  Button,
  Switch2,
  AlertDialog2,
  AlertDialogAction2,
  AlertDialogCancel2,
  AlertDialogContent2,
  AlertDialogDescription2,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle2,
  AlertDialogTrigger2,
} from '../reference-ui'

function SubscriptionPreferencesCard({
  planName,
  nextBillingDate,
  autoRenew,
  onAutoRenewChange,
  emailReceipts,
  onEmailReceiptsChange,
  renewalReminders,
  onRenewalRemindersChange,
  onPause,
  onCancel,
  pending = false,
  statusText,
}) {
  const prefs = [
    {
      id: 'auto-renew',
      label: 'Renovación automática',
      description: autoRenew == null ? 'Sin estado de renovación disponible' : autoRenew ? `Fin del período: ${nextBillingDate ?? '—'}` : 'Sin renovación automática vigente',
      checked: autoRenew,
      onChange: onAutoRenewChange,
    },
    {
      id: 'receipts',
      label: 'Recibos por correo',
      description: emailReceipts == null ? 'Preferencia no disponible' : 'Recibos comerciales por correo',
      checked: emailReceipts,
      onChange: onEmailReceiptsChange,
    },
    {
      id: 'reminders',
      label: 'Aviso antes de renovar',
      description: renewalReminders == null ? 'Preferencia no disponible' : 'Avisos de renovación',
      checked: renewalReminders,
      onChange: onRenewalRemindersChange,
    },
  ]
  return (
    <section className="space-y-5 rounded-3xl bg-card p-5 shadow-xs sm:p-6">
      <h2 className="text-lg font-semibold tracking-tight">{'Preferencias de suscripción'}</h2>
      <div className="space-y-1">
        {prefs.filter(p => p.checked != null || p.onChange).map((p) => (
          <label
            key={p.id}
            htmlFor={p.id}
            className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl px-3 py-3 transition-colors hover:bg-muted/60"
          >
            <div>
              <p className="text-sm font-semibold">{p.label}</p>
              <p className="text-xs text-muted-foreground">{p.description}</p>
            </div>
            <Switch2 id={p.id} aria-label={p.label} checked={p.checked} onCheckedChange={p.onChange} disabled={pending || !p.onChange} />
          </label>
        ))}
      </div>
      {statusText && <p className="text-xs text-muted-foreground">{statusText}</p>}
      <div className="rounded-2xl border border-dashed border-destructive/30 bg-destructive/5 p-4">
        <p className="text-sm font-semibold">
          {'Gestionar '}
          {planName}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {planName ? 'Consulta las condiciones y la cobertura vigente antes de gestionar tu suscripción.' : 'No hay una suscripción registrada.'}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {onPause && <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-xl bg-card font-semibold"
            onClick={onPause}
            disabled={!onPause || pending}
          >
            <CirclePause className="mr-1.5 h-4 w-4" />
            {'Pausar 1 mes'}
          </Button>}
          {onCancel && <AlertDialog2>
            <AlertDialogTrigger2 asChild={true}>
              <Button
                variant="ghost"
                size="sm"
                disabled={!onCancel || pending}
                className="h-9 rounded-xl font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <CircleX className="mr-1.5 h-4 w-4" />
                {'Cancelar renovación'}
              </Button>
            </AlertDialogTrigger2>
            <AlertDialogContent2 className="rounded-3xl">
              <AlertDialogHeader>
                <AlertDialogTitle2>{'¿Cancelar la renovación?'}</AlertDialogTitle2>
                <AlertDialogDescription2>
                  {'Se detendrá la renovación automática. La cobertura actual seguirá vigente hasta el final del período informado por el servidor: '}{nextBillingDate ?? '—'}{'.'}
                </AlertDialogDescription2>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel2 className="rounded-xl">
                  {'Seguir aprendiendo'}
                </AlertDialogCancel2>
                <AlertDialogAction2
                  className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={onCancel}
                >
                  {'Sí, cancelar'}
                </AlertDialogAction2>
              </AlertDialogFooter>
            </AlertDialogContent2>
          </AlertDialog2>}
        </div>
      </div>
    </section>
  )
}

export { SubscriptionPreferencesCard }
