// Recovered from the user-provided Polymet design; layout and sample data preserved.
import { cn } from '@/utils/cn'

function SettingsSectionCard({
  title,
  description,
  icon,
  action,
  footer,
  children,
  className,
  id,
}) {
  return (
    <section
      id={id}
      className={cn('scroll-mt-28 rounded-3xl bg-card p-5 shadow-xs sm:p-6', className)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {icon && (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
              {icon}
            </span>
          )}
          <div>
            <h2 className="text-lg font-bold tracking-tight">{title}</h2>
            {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
          </div>
        </div>
        {action}
      </div>
      <div className="mt-5" children={children} />
      {footer && (
        <div className="mt-6 flex flex-wrap items-center justify-end gap-2 border-t border-border/70 pt-5">
          {footer}
        </div>
      )}
    </section>
  )
}

export { SettingsSectionCard }
