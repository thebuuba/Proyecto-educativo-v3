import { Send, Bell, Clock, Mail } from 'lucide-react'
import { Button } from '../reference-ui'
import { SettingsPageHeader } from '../components/settings-page-header'
import { SettingsSectionCard } from '../components/settings-section-card'

// Catálogo de funciones, sin preferencias ni estados de entrega inventados.
const categories = ['Clases en vivo', 'Tareas y entregas', 'Calificaciones', 'Contenido nuevo', 'Mensajes de profesores', 'Respuestas en foros', 'Alertas de seguridad', 'Pagos y facturas', 'Novedades y ofertas']
function NotificationsSettingsPage() {
  return <div className="space-y-8">
    <SettingsPageHeader activeTab="notifications" title="Notificaciones" description="Consulta la disponibilidad de los canales y preferencias de tu cuenta."
      actions={<Button variant="outline" disabled title="El envío de prueba aún no está disponible"><Send className="mr-2 h-4 w-4" />Enviar prueba</Button>} />
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
      <SettingsSectionCard title="Qué quieres recibir" description="Las preferencias por categoría y canal aún no están disponibles." icon={<Bell className="h-5 w-5" />}>
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-border"><th className="py-3 pr-3">Actividad</th>{['Email','Push','SMS'].map(c => <th className="px-2 py-3 text-center" key={c}>{c}</th>)}</tr></thead><tbody>{categories.map(label => <tr key={label} className="border-b border-border/60"><th scope="row" className="py-4 pr-3 font-medium">{label}</th>{['email','push','sms'].map(c => <td key={c} className="px-2 text-center text-muted-foreground"><span aria-label={`${label} por ${c}: no disponible`}>—</span></td>)}</tr>)}</tbody></table></div>
        <p className="mt-4 text-xs text-muted-foreground">— indica que no hay una configuración consultable. No se han activado ni desactivado canales desde esta pantalla.</p>
      </SettingsSectionCard>
      <div className="space-y-6">
        <SettingsSectionCard title="Frecuencia de resumen" icon={<Mail className="h-5 w-5" />}><p className="text-sm text-muted-foreground">El resumen de notificaciones aún no está disponible.</p></SettingsSectionCard>
        <SettingsSectionCard title="Modo no molestar" icon={<Clock className="h-5 w-5" />}><p className="text-sm text-muted-foreground">La gestión de horarios de silencio aún no está disponible en este panel.</p></SettingsSectionCard>
      </div>
    </div>
  </div>
}
export { NotificationsSettingsPage }
