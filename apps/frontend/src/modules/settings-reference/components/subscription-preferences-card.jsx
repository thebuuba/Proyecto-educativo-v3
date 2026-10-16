// Recovered from the user-provided Polymet design; layout and sample data preserved.
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
}) {
  const prefs = [
    {
      id: 'auto-renew',
      label: 'Renovación automática',
      description: `Se cobrará el ${nextBillingDate}`,
      checked: autoRenew,
      onChange: onAutoRenewChange,
    },
    {
      id: 'receipts',
      label: 'Recibos por correo',
      description: 'Recibe cada factura en tu email',
      checked: emailReceipts,
      onChange: onEmailReceiptsChange,
    },
    {
      id: 'reminders',
      label: 'Aviso antes de renovar',
      description: 'Te avisamos 3 días antes del cobro',
      checked: renewalReminders,
      onChange: onRenewalRemindersChange,
    },
  ]
  return (
    <section className="space-y-5 rounded-3xl bg-card p-5 shadow-xs sm:p-6">
      <h2 className="text-lg font-bold tracking-tight">{'Preferencias de suscripción'}</h2>
      <div className="space-y-1">
        {prefs.map((p) => (
          <label
            key={p.id}
            htmlFor={p.id}
            className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl px-3 py-3 transition-colors hover:bg-muted/60"
          >
            <div>
              <p className="text-sm font-semibold">{p.label}</p>
              <p className="text-xs text-muted-foreground">{p.description}</p>
            </div>
            <Switch2 id={p.id} checked={p.checked} onCheckedChange={p.onChange} />
          </label>
        ))}
      </div>
      <div className="rounded-2xl border border-dashed border-destructive/30 bg-destructive/5 p-4">
        <p className="text-sm font-semibold">
          {'Gestionar '}
          {planName}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {'Mantendrás el acceso a tus cursos hasta el final del periodo pagado.'}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-xl bg-card font-semibold"
            onClick={onPause}
          >
            <CirclePause className="mr-1.5 h-4 w-4" />
            {'Pausar 1 mes'}
          </Button>
          <AlertDialog2>
            <AlertDialogTrigger2 asChild={true}>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 rounded-xl font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <CircleX className="mr-1.5 h-4 w-4" />
                {'Cancelar suscripción'}
              </Button>
            </AlertDialogTrigger2>
            <AlertDialogContent2 className="rounded-3xl">
              <AlertDialogHeader>
                <AlertDialogTitle2>{'¿Cancelar tu suscripción?'}</AlertDialogTitle2>
                <AlertDialogDescription2>
                  {'Perderás el acceso a tutorías en vivo y certificados a partir del'}{' '}
                  {nextBillingDate}
                  {'. Tu progreso en los cursos se conservará.'}
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
          </AlertDialog2>
        </div>
      </div>
    </section>
  )
}

export { SubscriptionPreferencesCard }
