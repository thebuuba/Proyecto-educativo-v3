import { ChartPie, UsersRound } from 'lucide-react'
import { SettingsPageHeader } from '../components/settings-page-header'
import { SettingsSectionCard } from '../components/settings-section-card'
import { SettingsToggleRow } from '../components/settings-toggle-row'
import { ProfileVisibilityCard } from '../components/profile-visibility-card'
import { DataManagementCard } from '../components/data-management-card'
import { privacyOptions, dataOptions } from '../data/settings-catalogs'

function PrivacySettingsPage() {
  return <div className="space-y-8">
    <SettingsPageHeader activeTab="privacy" title="Privacidad" description="Tú decides qué compartes con tus compañeros, profesores y la plataforma." />
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="min-w-0 space-y-6">
        <ProfileVisibilityCard value={null} />
        <SettingsSectionCard title="Actividad en la comunidad" description="Estos controles aún no están disponibles." icon={<UsersRound className="h-5 w-5" />}>
          <div className="space-y-1">{privacyOptions.map(option => <SettingsToggleRow key={option.id} id={`social-${option.id}`} label={option.label} description={option.description} checked={null} />)}</div>
        </SettingsSectionCard>
        <SettingsSectionCard title="Uso de datos" description="No hay preferencias consultables desde este panel." icon={<ChartPie className="h-5 w-5" />}>
          <div className="space-y-1">{dataOptions.map(option => <SettingsToggleRow key={option.id} id={`data-${option.id}`} label={option.label} description={option.description} checked={null} />)}</div>
        </SettingsSectionCard>
      </div>
      <div><DataManagementCard /></div>
    </div>
  </div>
}
export { PrivacySettingsPage }
