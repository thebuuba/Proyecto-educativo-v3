import { useEffect, useRef, useState } from 'react'
import type { ProfilePreferences, ProfileSettings, UpdateProfileSettingsInput } from '@aula/shared'
import { ExternalLink } from 'lucide-react'
import { Button } from '../reference-ui'
import { FeedbackBanner } from '@/components/ui/SemanticUI'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { SettingsPageHeader } from '../components/settings-page-header'
import { ProfileIdentityCard } from '../components/profile-identity-card'
import { PersonalInfoForm } from '../components/personal-info-form'
import { AcademicInfoCard } from '../components/academic-info-card'
import { SettingsSaveBar } from '../components/settings-save-bar'
import { getOwnProfileSettings, updateOwnProfileSettings, uploadOwnAvatar, removeOwnAvatar } from '../services/profileSettingsService'

const inputOf = (p: ProfileSettings): UpdateProfileSettingsInput => ({ fullName: p.fullName, phone: p.phone || null,
  preferences: Object.fromEntries(Object.entries(p.preferences).map(([key, value]) => [key, value === '' ? null : value])) as ProfilePreferences })
const message = (error: unknown) => error instanceof Error ? error.message : 'No se pudo completar la operación. Inténtalo de nuevo.'

export function ProfileSettingsPage() {
  const { appUser, refreshAuth } = useAuth()
  const [saved, setSaved] = useState<ProfileSettings | null>(null)
  const [draft, setDraft] = useState<ProfileSettings | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [pending, setPending] = useState(false)
  const [justSaved, setJustSaved] = useState(false)
  const [reload, setReload] = useState(0)
  const generation = useRef(0)
  const busy = useRef(false)
  const fileInput = useRef<HTMLInputElement>(null)
  useEffect(() => {
    const version = ++generation.current
    busy.current = false; setPending(false); setSaved(null); setDraft(null); setError(''); setNotice(''); setJustSaved(false)
    if (appUser?.id) void getOwnProfileSettings().then(value => {
      if (version === generation.current) { setSaved(value); setDraft(value) }
    }).catch(e => { if (version === generation.current) setError(message(e)) })
    return () => { generation.current = version + 1 }
  }, [appUser?.id, reload])
  useEffect(() => {
    if (!justSaved) return
    const timer = setTimeout(() => setJustSaved(false), 2500)
    return () => clearTimeout(timer)
  }, [justSaved])
  const dirty = Boolean(saved && draft && JSON.stringify(inputOf(saved)) !== JSON.stringify(inputOf(draft)))
  const update = (field: string, value: string | string[]) => {
    setJustSaved(false)
    setDraft(current => current ? field === 'fullName' || field === 'phone'
      ? { ...current, [field]: value } : { ...current, preferences: { ...current.preferences, [field]: value } } : current)
  }
  const mutate = async (operation: () => Promise<ProfileSettings>, photo = false) => {
    if (busy.current) return
    busy.current = true; setPending(true); setError(''); setNotice(''); setJustSaved(false)
    const version = generation.current
    try {
      const value = await operation()
      if (version !== generation.current) return
      if (photo) {
        setSaved(current => current && ({ ...current, avatarUrl: value.avatarUrl, completeness: value.completeness }))
        setDraft(current => current && ({ ...current, avatarUrl: value.avatarUrl, completeness: value.completeness }))
        setNotice('Foto actualizada correctamente.')
      } else { setSaved(value); setDraft(value); setJustSaved(true) }
      try { await refreshAuth({ background: true }) } catch {
        if (version === generation.current) setNotice('Los cambios están guardados. No se pudo actualizar la cabecera; recarga la página.')
      }
    } catch (e) { if (version === generation.current) setError(message(e)) }
    finally { if (version === generation.current) { busy.current = false; setPending(false) } }
  }
  if (!draft || !saved) return <div className="space-y-6">
    <SettingsPageHeader activeTab="profile" title="Perfil" description="Gestiona tu información personal y académica." actions={null} />
    {error ? <FeedbackBanner tone="danger" role="alert">{error}<button className="ml-3 underline" onClick={() => setReload(v => v + 1)}>Reintentar</button></FeedbackBanner>
      : <p role="status">{appUser?.id ? 'Cargando tu perfil…' : 'Inicia sesión para consultar tu perfil.'}</p>}
  </div>
  const values = { ...draft.preferences, fullName: draft.fullName, phone: draft.phone ?? '', email: draft.email,
    institution: draft.institution, academicIdentifier: draft.academicIdentifier,
    publicName: draft.preferences.publicName ?? '', bio: draft.preferences.bio ?? '', birthDate: draft.preferences.birthDate ?? '',
    country: draft.preferences.country ?? '', city: draft.preferences.city ?? '', educationLevel: draft.preferences.educationLevel ?? '' }
  const memberSince = new Intl.DateTimeFormat('es', { month: 'short', year: 'numeric', timeZone: saved.preferences.timezone }).format(new Date(saved.createdAt)).replace('.', '')
  return <div className="space-y-8">
    <SettingsPageHeader activeTab="profile" title="Perfil" description="Gestiona tu información personal y académica."
      actions={<Button variant="outline" className="h-11 rounded-xl border-transparent bg-card font-semibold shadow-xs" disabled title="Disponible al conectar la visibilidad de perfiles"><ExternalLink className="mr-2 h-4 w-4 text-primary" />Ver perfil público · Próximamente</Button>} />
    {error && <FeedbackBanner tone="danger" role="alert">{error}</FeedbackBanner>}
    {notice && <FeedbackBanner tone="info" role="status">{notice}</FeedbackBanner>}
    <input ref={fileInput} aria-label="Archivo de foto" type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" disabled={pending}
      onChange={e => {
        const file = e.currentTarget.files?.[0]; e.currentTarget.value = ''
        if (!file) return
        if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size === 0 || file.size > 2097152) { setError('Selecciona una imagen PNG, JPEG o WebP de hasta 2 MB.'); return }
        void mutate(() => uploadOwnAvatar(file), true)
      }} />
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-[360px_minmax(0,1fr)]">
      <div className="xl:sticky xl:top-28 xl:self-start">
        <ProfileIdentityCard name={draft.fullName} username={draft.preferences.publicName || 'Completa tu nombre público'}
          avatarUrl={draft.avatarUrl} role={draft.roles.map(r => ({ teacher: 'Docente', admin: 'Administrador', student: 'Estudiante', guardian: 'Tutor' }[r] ?? r)).join(' · ')}
          memberSince={memberSince} stats={saved.stats.map(s => ({ ...s, value: s.value === null ? '—' : String(s.value) }))}
          completeness={saved.completeness} pending={pending} onChangePhoto={() => fileInput.current?.click()} onRemovePhoto={() => void mutate(removeOwnAvatar, true)} />
      </div>
      <fieldset disabled={pending} className="min-w-0 space-y-6">
        <PersonalInfoForm values={values} onChange={update} />
        <AcademicInfoCard values={values} onChange={update} onInterestsChange={(interests: string[]) => update('interests', interests)} />
      </fieldset>
    </div>
    <SettingsSaveBar visible={dirty} saved={justSaved} pending={pending} onDiscard={() => { setDraft(saved); setError('') }} onSave={() => void mutate(() => updateOwnProfileSettings(inputOf(draft)))} />
  </div>
}
