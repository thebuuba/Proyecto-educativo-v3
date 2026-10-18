import { useState } from 'react'
import { BellRing, LifeBuoy, Mail, Phone } from 'lucide-react'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { sendPasswordReset } from '@/modules/profile/services/profileService'
import { FeedbackBanner } from '@/components/ui/SemanticUI'
import { PasswordChangeCard } from '../components/password-change-card'
import { SecurityScoreCard } from '../components/security-score-card'
import { SettingsToggleRow } from '../components/settings-toggle-row'
import { SettingsPageHeader } from '../components/settings-page-header'
import { SettingsSectionCard } from '../components/settings-section-card'

function SecuritySettingsPage() {
  const { appUser } = useAuth()
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [pending, setPending] = useState(false)
  const reset = async () => {
    if (!appUser?.email || pending) return
    setPending(true); setError(''); setNotice('')
    try { await sendPasswordReset(appUser.email); setNotice('Solicitud recibida. Revisa tu correo para continuar con el cambio de contraseña.') }
    catch (e) { setError(e instanceof Error ? e.message : 'No se pudo solicitar el cambio de contraseña.') }
    finally { setPending(false) }
  }
  return <div className="space-y-8">
    <SettingsPageHeader activeTab="security" title="Seguridad" description="Consulta la protección y los datos de recuperación de tu cuenta." />
    {error && <FeedbackBanner tone="danger" role="alert">{error}</FeedbackBanner>}
    {notice && <FeedbackBanner role="status">{notice}</FeedbackBanner>}
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="min-w-0 space-y-6">
        <PasswordChangeCard onForgot={appUser?.email ? () => void reset() : undefined} pendingReset={pending} />
        <SettingsSectionCard id="recovery" title="Recuperación y alertas" description="Datos de tu cuenta. La configuración de recuperación y alertas aún no está disponible." icon={<LifeBuoy className="h-5 w-5" />}>
          <div className="space-y-1">
            <SettingsToggleRow id="recovery-email" label="Correo de recuperación" description={appUser?.email || 'Sin correo disponible'} icon={<Mail className="h-4 w-4" />} checked={null} />
            <SettingsToggleRow id="recovery-phone" label="Teléfono de recuperación" description={appUser?.phone || 'No registrado'} icon={<Phone className="h-4 w-4" />} checked={null} />
            <SettingsToggleRow id="login-alerts" label="Avisarme de inicios de sesión nuevos" description="Preferencia no disponible" icon={<BellRing className="h-4 w-4" />} checked={null} />
          </div>
        </SettingsSectionCard>
      </div>
      <div className="space-y-6">
        <SecurityScoreCard items={[
          {id:'password',label:'Contraseña segura',done:null}, {id:'email',label:'Correo de recuperación',done:null},
          {id:'phone',label:'Teléfono de recuperación',done:null},
        ]} onItemClick={id => document.getElementById(id === 'email' || id === 'phone' ? 'recovery' : id)?.scrollIntoView({block:'start',behavior:'smooth'})} />
      </div>
    </div>
  </div>
}
export { SecuritySettingsPage }
