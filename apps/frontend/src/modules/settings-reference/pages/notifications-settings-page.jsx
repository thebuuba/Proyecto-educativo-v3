// Recovered from the user-provided Polymet design; layout and sample data preserved.
import { useState, useEffect, useMemo } from 'react'
import { Send } from 'lucide-react'
import { Button } from '../reference-ui'
import { SettingsPageHeader } from '../components/settings-page-header'
import { notificationGroups } from '../data/settings-data'
import { SettingsSaveBar } from '../components/settings-save-bar'
import { NotificationChannelsMatrix } from '../components/notification-channels-matrix'
import { QuietHoursCard } from '../components/quiet-hours-card'
import { DigestFrequencyCard } from '../components/digest-frequency-card'

var initialPrefs = {
  groups: notificationGroups,
  quiet: { enabled: true, from: '22:00', to: '07:30', days: ['L', 'M', 'X', 'J', 'V'] },
  digest: 'daily',
}
function NotificationsSettingsPage() {
  const [saved, setSaved] = useState(initialPrefs)
  const [draft, setDraft] = useState(initialPrefs)
  const [justSaved, setJustSaved] = useState(false)
  const [testSent, setTestSent] = useState(false)
  const dirty = useMemo(() => JSON.stringify(saved) !== JSON.stringify(draft), [saved, draft])
  useEffect(() => {
    if (!justSaved) return
    const t = setTimeout(() => setJustSaved(false), 2500)
    return () => clearTimeout(t)
  }, [justSaved])
  useEffect(() => {
    if (!testSent) return
    const t = setTimeout(() => setTestSent(false), 2500)
    return () => clearTimeout(t)
  }, [testSent])
  return (
    <div className="space-y-8">
      <SettingsPageHeader
        activeTab="notifications"
        title="Notificaciones"
        description="Decide cómo y cuándo quieres enterarte de tus clases, tareas, calificaciones y mensajes."
        actions={
          <Button
            variant="outline"
            className="h-11 rounded-xl border-transparent bg-card font-semibold shadow-xs"
            onClick={() => setTestSent(true)}
          >
            <Send className="mr-2 h-4 w-4 text-primary" />
            {testSent ? '¡Enviada!' : 'Enviar prueba'}
          </Button>
        }
      />
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0">
          <NotificationChannelsMatrix
            groups={draft.groups}
            onChange={(groups) => setDraft((d) => ({ ...d, groups }))}
          />
        </div>
        <div className="space-y-6">
          <DigestFrequencyCard
            value={draft.digest}
            onChange={(digest) => setDraft((d) => ({ ...d, digest }))}
          />
          <QuietHoursCard
            value={draft.quiet}
            onChange={(quiet) => setDraft((d) => ({ ...d, quiet }))}
          />
        </div>
      </div>
      <SettingsSaveBar
        visible={dirty}
        saved={justSaved}
        onDiscard={() => setDraft(saved)}
        onSave={() => {
          setSaved(draft)
          setJustSaved(true)
        }}
      />
    </div>
  )
}

export { NotificationsSettingsPage }
