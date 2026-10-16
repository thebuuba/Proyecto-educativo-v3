// Recovered from the user-provided Polymet design; layout and sample data preserved.
import { Lock } from 'lucide-react'
import { Switch2 } from '../reference-ui'

function SettingsToggleRow({ id, label, description, checked, onCheckedChange, icon, locked }) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl px-3 py-3 transition-colors hover:bg-muted/60"
    >
      <div className="flex items-center gap-3">
        {icon && (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            {icon}
          </span>
        )}
        <div>
          <p className="flex items-center gap-1.5 text-sm font-semibold">
            {label}
            {locked && <Lock className="h-3 w-3 text-muted-foreground" />}
          </p>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      </div>
      <Switch2 id={id} checked={checked} disabled={locked} onCheckedChange={onCheckedChange} />
    </label>
  )
}

export { SettingsToggleRow }
