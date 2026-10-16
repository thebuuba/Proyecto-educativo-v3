import { Send } from 'lucide-react'
import { Button } from '../reference-ui'
import { SettingsPageHeader } from '../components/settings-page-header'
import { NotificationChannelsMatrix } from '../components/notification-channels-matrix'
import { QuietHoursCard } from '../components/quiet-hours-card'
import { DigestFrequencyCard } from '../components/digest-frequency-card'
import { notificationGroups } from '../data/settings-catalogs'

function NotificationsSettingsPage() {
  return <div className="space-y-8">
    <SettingsPageHeader activeTab="notifications" title="Notificaciones" description="Decide cómo y cuándo quieres enterarte de tus clases, tareas, calificaciones y mensajes."
      actions={<Button variant="outline" className="h-11 rounded-xl border-transparent bg-card font-semibold shadow-xs" disabled title="El envío de prueba aún no está disponible"><Send className="mr-2 h-4 w-4 text-primary" />Enviar prueba</Button>} />
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="min-w-0"><NotificationChannelsMatrix groups={notificationGroups} /></div>
      <div className="space-y-6"><DigestFrequencyCard value={null} /><QuietHoursCard value={null} /></div>
    </div>
  </div>
}
export { NotificationsSettingsPage }
