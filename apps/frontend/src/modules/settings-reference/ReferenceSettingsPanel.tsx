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

export function ReferenceSettingsPanel({ section, onManageBilling }: { section: ReferenceSettingsSection; onManageBilling?: () => void }) {
  const Page = pages[section]
  return (
    <section className="settings-reference-workspace mx-auto min-w-0 w-full max-w-[1360px]">
      {section === 'suscripcion' ? <BillingSettingsPage onManage={onManageBilling} /> : <Page />}
    </section>
  )
}
