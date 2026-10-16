// Recovered from the user-provided Polymet design; layout and sample data preserved.
import { KeySquare, MessageSquareText, Shield, Smartphone } from 'lucide-react'
import { cn } from '@/utils/cn'
import { Button, Switch2 } from '../reference-ui'
import { SettingsSectionCard } from './settings-section-card'

var methods = [
  {
    id: 'app',
    label: 'App de autenticación',
    description: 'Google Authenticator, Authy o similar',
    icon: Smartphone,
    recommended: true,
  },
  {
    id: 'sms',
    label: 'Mensaje SMS',
    description: 'Código enviado a +34 ••• ••• 678',
    icon: MessageSquareText,
  },
  {
    id: 'key',
    label: 'Llave de seguridad',
    description: 'YubiKey u otra llave física FIDO2',
    icon: KeySquare,
  },
]
function TwoFactorCard({
  enabled,
  onEnabledChange,
  method,
  onMethodChange,
  backupCodesLeft,
  onViewBackupCodes,
}) {
  return (
    <SettingsSectionCard
      id="2fa"
      title="Verificación en dos pasos"
      description="Añade una capa extra de protección pidiendo un código al iniciar sesión."
      icon={<Shield className="h-5 w-5" />}
      action={
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'hidden rounded-lg px-2 py-1 text-[11px] font-bold sm:inline-flex',
              enabled
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
            )}
          >
            {enabled ? 'Activada' : 'Desactivada'}
          </span>
          <Switch2
            checked={enabled}
            onCheckedChange={onEnabledChange}
            aria-label="Activar verificación en dos pasos"
          />
        </div>
      }
    >
      <div
        role="radiogroup"
        aria-label="Método de verificación"
        className={cn(
          'grid grid-cols-1 gap-3 transition-opacity md:grid-cols-3',
          !enabled && 'pointer-events-none opacity-50',
        )}
      >
        {methods.map((m) => {
          const selected = m.id === method
          const Icon = m.icon
          return (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={!enabled}
              onClick={() => onMethodChange(m.id)}
              className={cn(
                'relative flex flex-col items-start gap-3 rounded-2xl border p-4 text-left transition-all',
                selected
                  ? 'border-primary bg-accent/60 ring-4 ring-primary/10'
                  : 'border-border hover:border-primary/40',
              )}
            >
              <div className="flex w-full items-center justify-between">
                <span
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-xl',
                    selected
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span
                  className={cn(
                    'flex h-4 w-4 items-center justify-center rounded-full border-2',
                    selected ? 'border-primary' : 'border-muted-foreground/30',
                  )}
                >
                  {selected && <span className="h-2 w-2 rounded-full bg-primary" />}
                </span>
              </div>
              <div>
                <p className="flex flex-wrap items-center gap-1.5 text-sm font-semibold">
                  {m.label}
                  {m.recommended && (
                    <span className="rounded-md bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                      {'Recomendado'}
                    </span>
                  )}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{m.description}</p>
              </div>
            </button>
          )
        })}
      </div>
      <div className="mt-4 flex flex-col gap-3 rounded-2xl bg-muted/60 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold">{'Códigos de respaldo'}</p>
          <p className="text-xs text-muted-foreground">
            {'Te quedan '}
            {backupCodesLeft}
            {' códigos de un solo uso por si pierdes tu dispositivo.'}
          </p>
        </div>
        <Button
          variant="outline"
          className="h-10 rounded-xl bg-card font-semibold"
          disabled={!enabled}
          onClick={onViewBackupCodes}
        >
          {'Ver códigos'}
        </Button>
      </div>
    </SettingsSectionCard>
  )
}

export { TwoFactorCard }
