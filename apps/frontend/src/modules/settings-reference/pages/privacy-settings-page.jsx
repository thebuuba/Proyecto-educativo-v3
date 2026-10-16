import { ChartPie, UsersRound, Eye, Database } from 'lucide-react'
import { Button } from '../reference-ui'
import { SettingsPageHeader } from '../components/settings-page-header'
import { SettingsSectionCard } from '../components/settings-section-card'

const communityOptions = ['Aparecer en rankings', 'Mostrar progreso de cursos', 'Aparecer en el directorio de estudiantes', 'Recibir mensajes', 'Mostrar estado en línea']
const dataOptions = ['Personalización', 'Analítica de uso', 'Investigación educativa']
function PrivacySettingsPage() {
  return <div className="space-y-8">
    <SettingsPageHeader activeTab="privacy" title="Privacidad" description="Consulta qué controles de privacidad están disponibles para tu cuenta." />
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="min-w-0 space-y-6">
        <SettingsSectionCard title="Visibilidad del perfil" icon={<Eye className="h-5 w-5" />}><p className="text-sm text-muted-foreground">La publicación de perfiles y sus preferencias de visibilidad aún no están disponibles. Esta pantalla no publica tus datos.</p></SettingsSectionCard>
        <SettingsSectionCard title="Actividad en la comunidad" description="Estos controles requieren los servicios de comunidad." icon={<UsersRound className="h-5 w-5" />}><ul className="divide-y divide-border/60">{communityOptions.map(label => <li className="flex flex-wrap items-center justify-between gap-2 py-4 text-sm" key={label}><span className="font-medium">{label}</span><span className="text-xs text-muted-foreground">No disponible</span></li>)}</ul></SettingsSectionCard>
        <SettingsSectionCard title="Uso de datos" description="No hay preferencias consultables desde este panel." icon={<ChartPie className="h-5 w-5" />}><ul className="divide-y divide-border/60">{dataOptions.map(label => <li className="flex flex-wrap items-center justify-between gap-2 py-4 text-sm" key={label}><span className="font-medium">{label}</span><span className="text-xs text-muted-foreground">No disponible</span></li>)}</ul></SettingsSectionCard>
      </div>
      <div className="space-y-6">
        <SettingsSectionCard title="Tus datos" description="La exportación de datos personales aún no está disponible." icon={<Database className="h-5 w-5" />}><Button className="w-full rounded-xl" disabled>Solicitar descarga</Button></SettingsSectionCard>
        <SettingsSectionCard title="Eliminar cuenta" description="La eliminación de cuenta aún no está disponible en este panel."><Button variant="outline" className="w-full rounded-xl text-destructive" disabled>Eliminar mi cuenta</Button></SettingsSectionCard>
      </div>
    </div>
  </div>
}
export { PrivacySettingsPage }
