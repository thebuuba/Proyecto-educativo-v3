// Recovered from the user-provided Polymet design; layout and sample data preserved.
import { useState } from 'react'
import { BellRing, LifeBuoy, Mail, Phone } from 'lucide-react'
import { SettingsPageHeader } from '../components/settings-page-header'
import { SettingsSectionCard } from '../components/settings-section-card'
import { activeSessions, loginHistory } from '../data/settings-data'
import { SecurityScoreCard } from '../components/security-score-card'
import { PasswordChangeCard } from '../components/password-change-card'
import { TwoFactorCard } from '../components/two-factor-card'
import { ActiveSessionsCard } from '../components/active-sessions-card'
import { SettingsToggleRow } from '../components/settings-toggle-row'

var sectionFor = {
  password: 'password',
  '2fa': '2fa',
  phone: 'recovery',
  email: 'recovery',
}
function SecuritySettingsPage() {
  const [twoFactor, setTwoFactor] = useState(false)
  const [method, setMethod] = useState('app')
  const [sessions, setSessions] = useState(activeSessions)
  const [recoveryPhone, setRecoveryPhone] = useState(false)
  const [recoveryEmail, setRecoveryEmail] = useState(true)
  const [loginAlerts, setLoginAlerts] = useState(true)
  const checklist = [
    { id: 'password', label: 'Contraseña segura', done: true },
    { id: 'email', label: 'Correo de recuperación', done: recoveryEmail },
    { id: '2fa', label: 'Verificación en dos pasos', done: twoFactor },
    { id: 'phone', label: 'Teléfono de recuperación', done: recoveryPhone },
  ]
  const scrollTo = (id) =>
    document
      .getElementById(sectionFor[id] ?? id)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  return (
    <div className="space-y-8">
      <SettingsPageHeader
        activeTab="security"
        title="Seguridad"
        description="Protege tu cuenta, tus cursos y tus certificados con una contraseña segura y verificación en dos pasos."
      />
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-6">
          <PasswordChangeCard lastChanged="hace 3 meses" />
          <TwoFactorCard
            enabled={twoFactor}
            onEnabledChange={setTwoFactor}
            method={method}
            onMethodChange={setMethod}
            backupCodesLeft={8}
          />
          <SettingsSectionCard
            id="recovery"
            title="Recuperación y alertas"
            description="Cómo te ayudaremos a recuperar el acceso si lo pierdes."
            icon={<LifeBuoy className="h-5 w-5" />}
          >
            <div className="space-y-1">
              <SettingsToggleRow
                id="recovery-email"
                label="Correo de recuperación"
                description="i••••@gmail.com"
                icon={<Mail className="h-4 w-4" />}
                checked={recoveryEmail}
                onCheckedChange={setRecoveryEmail}
              />
              <SettingsToggleRow
                id="recovery-phone"
                label="Teléfono de recuperación"
                description="+34 ••• ••• 678 · sin verificar"
                icon={<Phone className="h-4 w-4" />}
                checked={recoveryPhone}
                onCheckedChange={setRecoveryPhone}
              />
              <SettingsToggleRow
                id="login-alerts"
                label="Avisarme de inicios de sesión nuevos"
                description="Te enviaremos un email si alguien entra desde otro dispositivo"
                icon={<BellRing className="h-4 w-4" />}
                checked={loginAlerts}
                onCheckedChange={setLoginAlerts}
              />
            </div>
          </SettingsSectionCard>
        </div>
        <div className="space-y-6">
          <SecurityScoreCard items={checklist} onItemClick={scrollTo} />
          <ActiveSessionsCard
            sessions={sessions}
            history={loginHistory}
            onRevoke={(id) => setSessions((s) => s.filter((x) => x.id !== id))}
            onRevokeAll={() => setSessions((s) => s.filter((x) => x.current))}
          />
        </div>
      </div>
    </div>
  )
}

export { SecuritySettingsPage }
