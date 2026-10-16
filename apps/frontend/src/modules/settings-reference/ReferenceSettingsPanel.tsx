import { BillingSettingsPage } from './pages/billing-settings-page'
import { ProfileSettingsPage } from './pages/profile-settings-page'
import { SecuritySettingsPage } from './pages/security-settings-page'
import { NotificationsSettingsPage } from './pages/notifications-settings-page'
import { PrivacySettingsPage } from './pages/privacy-settings-page'
import './reference-settings.css'

const pages = {
  cuenta: ProfileSettingsPage,
  seguridad: SecuritySettingsPage,
  notificaciones: NotificationsSettingsPage,
  suscripcion: BillingSettingsPage,
  privacidad: PrivacySettingsPage,
}

export type ReferenceSettingsSection = keyof typeof pages

export function ReferenceSettingsPanel({ section }: { section: ReferenceSettingsSection }) {
  const Page = pages[section]
  return (
    <section className="settings-reference-workspace mx-auto min-w-0 w-full max-w-[1360px]">
      {section !== 'cuenta' && <p className="mb-3 text-xs text-muted-foreground">
        Vista de diseño · Datos de ejemplo de Polymet · Las acciones de esta vista son simuladas.
      </p>}
      <Page />
    </section>
  )
}
