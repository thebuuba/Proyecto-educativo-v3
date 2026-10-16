// Layout adapted from the user-provided Polymet design.
import { Fragment } from 'react'
import { CircleCheck } from 'lucide-react'
import { cn } from '@/utils/cn'
import { Button } from '../reference-ui'

function SettingsSaveBar({ visible, saved, onSave, onDiscard, pending = false }) {
  const show = visible || saved
  if (!show) return null
  return (
    <div
      aria-live="polite"
      className={cn(
        'pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4 transition-all duration-300',
        show ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
      )}
    >
      <div className="pointer-events-auto flex w-full max-w-xl flex-wrap items-center gap-3 rounded-2xl border border-border/60 bg-card/95 p-3 pl-5 shadow-2xl backdrop-blur sm:flex-nowrap">
        {saved && !visible ? (
          <p className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            <CircleCheck className="h-4 w-4" />
            {'Cambios guardados correctamente'}
          </p>
        ) : (
          <Fragment>
            <span className="h-2 w-2 shrink-0 rounded-full bg-amber-400" />
            <p className="flex-1 text-sm font-semibold">{'Tienes cambios sin guardar'}</p>
            <Button
              variant="ghost"
              className="h-10 rounded-xl font-semibold text-muted-foreground"
              onClick={onDiscard}
              disabled={pending}
            >
              {'Descartar'}
            </Button>
            <Button className="h-10 rounded-xl px-5 font-semibold" onClick={onSave} disabled={pending}>
              {pending ? 'Guardando…' : 'Guardar'}
            </Button>
          </Fragment>
        )}
      </div>
    </div>
  )
}

export { SettingsSaveBar }
