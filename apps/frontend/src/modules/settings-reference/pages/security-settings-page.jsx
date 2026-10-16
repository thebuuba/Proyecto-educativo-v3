import { useEffect, useState } from 'react'
import { KeyRound, ShieldCheck, LifeBuoy, Monitor } from 'lucide-react'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { supabase } from '@/modules/auth/services/supabaseClient'
import { sendPasswordReset } from '@/modules/profile/services/profileService'
import { FeedbackBanner } from '@/components/ui/SemanticUI'
import { Button } from '../reference-ui'
import { SettingsPageHeader } from '../components/settings-page-header'
import { SettingsSectionCard } from '../components/settings-section-card'

function SecuritySettingsPage() {
  const { appUser } = useAuth()
  const [factorState, setFactorState] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [pending, setPending] = useState(false)
  useEffect(() => {
    let active = true
    setFactorState(null); setError(''); setNotice('')
    if (appUser?.id) void supabase.auth.mfa.listFactors().then(({data,error}) => {
      if (!active) return
      if (error) setFactorState('unavailable')
      else setFactorState(data.all.some(f => f.status === 'verified') ? 'verified' : 'none')
    }).catch(() => { if (active) setFactorState('unavailable') })
    return () => { active = false }
  }, [appUser?.id])
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
        <SettingsSectionCard title="Cambiar contraseña" description="Solicita un enlace al correo de tu cuenta para cambiarla de forma segura." icon={<KeyRound className="h-5 w-5" />}>
          <p className="text-sm text-muted-foreground">No hay una fecha de último cambio disponible.</p>
          <Button className="mt-5 rounded-xl" onClick={() => void reset()} disabled={pending || !appUser?.email}>{pending ? 'Solicitando…' : 'Solicitar cambio de contraseña'}</Button>
        </SettingsSectionCard>
        <SettingsSectionCard title="Verificación en dos pasos" description="Estado consultado en el servicio de autenticación." icon={<ShieldCheck className="h-5 w-5" />}>
          <p className="font-semibold" role="status">{factorState === 'verified' ? 'Factor verificado en tu cuenta' : factorState === 'none' ? 'Sin factores verificados' : factorState === 'unavailable' ? 'No se pudo consultar la verificación en dos pasos.' : 'Consultando verificación…'}</p>
          <p className="mt-2 text-sm text-muted-foreground">La gestión de factores y códigos de recuperación aún no está disponible en este panel.</p>
        </SettingsSectionCard>
        <SettingsSectionCard title="Recuperación y alertas" description="Datos de contacto de tu cuenta." icon={<LifeBuoy className="h-5 w-5" />}>
          <dl className="space-y-4 text-sm"><div><dt className="font-semibold">Correo de la cuenta</dt><dd className="mt-1 break-all text-muted-foreground">{appUser?.email || 'Sin correo disponible'}</dd></div><div><dt className="font-semibold">Teléfono de contacto</dt><dd className="mt-1 text-muted-foreground">{appUser?.phone || 'No registrado'}</dd></div></dl>
          <p className="mt-4 text-xs text-muted-foreground">El teléfono de contacto no implica un método de recuperación verificado. La configuración de alertas aún no está disponible.</p>
        </SettingsSectionCard>
      </div>
      <div className="space-y-6">
        <SettingsSectionCard title="Estado de seguridad" icon={<ShieldCheck className="h-5 w-5" />}><p className="text-sm text-muted-foreground">No hay una puntuación de seguridad calculada. Consulta el estado de verificación en dos pasos.</p></SettingsSectionCard>
        <SettingsSectionCard title="Dispositivos conectados" icon={<Monitor className="h-5 w-5" />}><p className="text-sm text-muted-foreground">La lista de dispositivos aún no está disponible.</p><h3 className="mt-6 text-sm font-semibold">Historial de accesos</h3><p className="mt-2 text-sm text-muted-foreground">El historial de accesos aún no está disponible.</p></SettingsSectionCard>
      </div>
    </div>
  </div>
}
export { SecuritySettingsPage }
