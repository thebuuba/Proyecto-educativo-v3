// Layout adapted from the user-provided Polymet design.
import { useState, useMemo, Fragment } from 'react'
import { Check, Eye, EyeOff, KeyRound, X } from 'lucide-react'
import { cn } from '@/utils/cn'
import { Button, Input, Label2 } from '../reference-ui'
import { SettingsSectionCard } from './settings-section-card'

var rules = [
  { id: 'length', label: 'Mínimo 8 caracteres', test: (v) => v.length >= 8 },
  { id: 'upper', label: 'Una letra mayúscula', test: (v) => /[A-Z]/.test(v) },
  { id: 'number', label: 'Un número', test: (v) => /\d/.test(v) },
  { id: 'symbol', label: 'Un símbolo (!@#$…)', test: (v) => /[^A-Za-z0-9]/.test(v) },
]
var strengthMeta = [
  { label: 'Muy débil', bar: 'bg-destructive', text: 'text-destructive' },
  { label: 'Débil', bar: 'bg-destructive', text: 'text-destructive' },
  { label: 'Aceptable', bar: 'bg-amber-400', text: 'text-amber-600 dark:text-amber-400' },
  { label: 'Buena', bar: 'bg-sky-500', text: 'text-sky-600 dark:text-sky-400' },
  { label: 'Excelente', bar: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
]
function PasswordInput({ id, value, onChange, placeholder }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 rounded-xl border-transparent bg-muted/50 pr-11 focus-visible:bg-card"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  )
}
function PasswordChangeCard({ lastChanged, onSubmit }) {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [success, setSuccess] = useState(false)
  const passed = useMemo(() => rules.filter((r) => r.test(next)).length, [next])
  const strength = strengthMeta[next ? passed : 0]
  const mismatch = confirm.length > 0 && confirm !== next
  const canSubmit = current.length > 0 && passed === rules.length && confirm === next
  const handleSubmit = () => {
    if (!canSubmit) return
    onSubmit?.(current, next)
    setCurrent('')
    setNext('')
    setConfirm('')
    setSuccess(true)
  }
  return (
    <SettingsSectionCard
      id="password"
      title="Contraseña"
      description={`Último cambio ${lastChanged}. Te recomendamos cambiarla cada 6 meses.`}
      icon={<KeyRound className="h-5 w-5" />}
      footer={
        <Fragment>
          {success && (
            <p className="mr-auto flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              <Check className="h-4 w-4" />
              {'Contraseña actualizada'}
            </p>
          )}
          <Button variant="ghost" className="h-10 rounded-xl font-semibold">
            {'¿Olvidaste tu contraseña?'}
          </Button>
          <Button
            className="h-10 rounded-xl px-5 font-semibold"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            {'Actualizar contraseña'}
          </Button>
        </Fragment>
      }
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-5">
          <div className="space-y-2">
            <Label2 htmlFor="current-password">{'Contraseña actual'}</Label2>
            <PasswordInput
              id="current-password"
              value={current}
              onChange={(v) => {
                setCurrent(v)
                setSuccess(false)
              }}
            />
          </div>
          <div className="space-y-2">
            <Label2 htmlFor="new-password">{'Nueva contraseña'}</Label2>
            <PasswordInput id="new-password" value={next} onChange={setNext} />
            <div className="flex gap-1.5 pt-1">
              {rules.map((r, i) => (
                <span
                  key={r.id}
                  className={cn(
                    'h-1.5 flex-1 rounded-full transition-colors',
                    next && i < passed ? strength.bar : 'bg-muted',
                  )}
                />
              ))}
            </div>
            {next && <p className={cn('text-xs font-semibold', strength.text)}>{strength.label}</p>}
          </div>
          <div className="space-y-2">
            <Label2 htmlFor="confirm-password">{'Confirmar contraseña'}</Label2>
            <PasswordInput id="confirm-password" value={confirm} onChange={setConfirm} />
            {mismatch && (
              <p className="text-xs font-semibold text-destructive">
                {'Las contraseñas no coinciden'}
              </p>
            )}
          </div>
        </div>
        <div className="rounded-2xl bg-muted/60 p-5">
          <p className="text-sm font-semibold">{'Tu contraseña debe tener'}</p>
          <ul className="mt-4 space-y-3">
            {rules.map((r) => {
              const ok = r.test(next)
              return (
                <li key={r.id} className="flex items-center gap-2.5 text-sm">
                  <span
                    className={cn(
                      'flex h-5 w-5 items-center justify-center rounded-full transition-colors',
                      ok ? 'bg-emerald-500 text-white' : 'bg-card text-muted-foreground',
                    )}
                  >
                    {ok ? <Check className="h-3 w-3" strokeWidth={3} /> : <X className="h-3 w-3" />}
                  </span>
                  <span className={ok ? 'text-foreground' : 'text-muted-foreground'}>
                    {r.label}
                  </span>
                </li>
              )
            })}
          </ul>
          <p className="mt-5 text-xs text-muted-foreground">
            {'Al cambiarla, cerraremos la sesión en el resto de dispositivos.'}
          </p>
        </div>
      </div>
    </SettingsSectionCard>
  )
}

export { PasswordChangeCard }
