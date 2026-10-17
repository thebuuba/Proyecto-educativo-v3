// Layout adapted from the user-provided Polymet design.
import { SettingsTabsNav } from './settings-tabs-nav'

function SettingsPageHeader({ activeTab, title, description, actions }) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">{'Ajustes de la cuenta'}</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">{description}</p>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      <SettingsTabsNav activeId={activeTab} />
    </div>
  )
}

export { SettingsPageHeader }
