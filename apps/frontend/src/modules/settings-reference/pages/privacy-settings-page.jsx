// Recovered from the user-provided Polymet design; layout and sample data preserved.
import { useState, useEffect, useMemo } from 'react'
import { ChartPie, UsersRound } from 'lucide-react'
import { SettingsPageHeader } from '../components/settings-page-header'
import { SettingsSectionCard } from '../components/settings-section-card'
import { privacyOptions, dataOptions } from '../data/settings-data'
import { SettingsSaveBar } from '../components/settings-save-bar'
import { SettingsToggleRow } from '../components/settings-toggle-row'
import { ProfileVisibilityCard } from '../components/profile-visibility-card'
import { DataManagementCard } from '../components/data-management-card'

var initialPrefs2 = {
  visibility: 'classmates',
  social: privacyOptions,
  data: dataOptions,
}
var toggleIn = (list, id, enabled) => list.map((o) => (o.id === id ? { ...o, enabled } : o))
function PrivacySettingsPage() {
  const [saved, setSaved] = useState(initialPrefs2)
  const [draft, setDraft] = useState(initialPrefs2)
  const [justSaved, setJustSaved] = useState(false)
  const dirty = useMemo(() => JSON.stringify(saved) !== JSON.stringify(draft), [saved, draft])
  useEffect(() => {
    if (!justSaved) return
    const t = setTimeout(() => setJustSaved(false), 2500)
    return () => clearTimeout(t)
  }, [justSaved])
  return (
    <div className="space-y-8">
      <SettingsPageHeader
        activeTab="privacy"
        title="Privacidad"
        description="Tú decides qué compartes con tus compañeros, profesores y la plataforma."
      />
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-6">
          <ProfileVisibilityCard
            value={draft.visibility}
            onChange={(visibility) => setDraft((d) => ({ ...d, visibility }))}
          />
          <SettingsSectionCard
            title="Actividad en la comunidad"
            description="Cómo te ven otros estudiantes dentro de los cursos."
            icon={<UsersRound className="h-5 w-5" />}
          >
            <div className="space-y-1">
              {draft.social.map((o) => (
                <SettingsToggleRow
                  key={o.id}
                  id={`social-${o.id}`}
                  label={o.label}
                  description={o.description}
                  checked={o.enabled}
                  onCheckedChange={(v) =>
                    setDraft((d) => ({ ...d, social: toggleIn(d.social, o.id, v) }))
                  }
                />
              ))}
            </div>
          </SettingsSectionCard>
          <SettingsSectionCard
            title="Uso de datos"
            description="Cumplimos con el RGPD. Puedes cambiar estas opciones en cualquier momento."
            icon={<ChartPie className="h-5 w-5" />}
          >
            <div className="space-y-1">
              {draft.data.map((o) => (
                <SettingsToggleRow
                  key={o.id}
                  id={`data-${o.id}`}
                  label={o.label}
                  description={o.description}
                  checked={o.enabled}
                  onCheckedChange={(v) =>
                    setDraft((d) => ({ ...d, data: toggleIn(d.data, o.id, v) }))
                  }
                />
              ))}
            </div>
          </SettingsSectionCard>
        </div>
        <div>
          <DataManagementCard lastExport="12 ene 2025" />
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

export { PrivacySettingsPage }
