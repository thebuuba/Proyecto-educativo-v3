import { Building2, Save } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { FeedbackBanner, SemanticIcon, SectionHeader } from '@/components/ui/SemanticUI'
import type { SchoolProfile, UpdateSchoolInput } from '@/modules/school-administration/types'

type Props = { profile: SchoolProfile | null; onSave: (input: UpdateSchoolInput) => Promise<void> }
const shifts = [
  ['morning', 'Matutina'], ['afternoon', 'Vespertina'], ['night', 'Nocturna'],
  ['extended', 'Extendida'], ['full_day', 'Día completo'],
] as const
const offers = [
  ['initial', 'Inicial'], ['primary', 'Primaria'], ['secondary', 'Secundaria'],
  ['regular', 'Educación regular'], ['adultos', 'Jóvenes y adultos'], ['other', 'Otra oferta'],
] as const
const modalities = [
  ['general', 'General'], ['academic', 'Académica'], ['technical_professional', 'Técnico profesional'], ['arts', 'Artes'],
] as const

function draftFrom(profile: SchoolProfile | null) {
  return {
    name: profile?.name ?? '', slug: profile?.slug ?? '', logoUrl: profile?.logoUrl ?? '',
    sector: profile?.sector ?? 'private', centerCode: profile?.centerCode ?? '',
    schoolShift: profile?.schoolShift ?? 'extended', primaryModality: profile?.primaryModality ?? 'general',
    enabledSubsystems: profile?.enabledSubsystems ?? ['regular'], officialExportsEnabled: profile?.officialExportsEnabled ?? false,
  }
}

export function SchoolProfileForm({ profile, onSave }: Props) {
  const [draft, setDraft] = useState(() => draftFrom(profile))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const edited = useRef(false)
  const schoolId = useRef(profile?.id)
  useEffect(() => {
    if (schoolId.current !== profile?.id) edited.current = false
    if (!edited.current) setDraft(draftFrom(profile))
    schoolId.current = profile?.id
  }, [profile])

  function toggleShift(value: string) {
    const selected = draft.schoolShift.split(',').filter(Boolean)
    setDraft({ ...draft, schoolShift: (selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]).join(',') })
    setSuccess(false)
  }
  function toggleOffer(value: string) {
    const selected = draft.enabledSubsystems
    setDraft({ ...draft, enabledSubsystems: selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value] })
    setSuccess(false)
  }
  async function save(event: FormEvent) {
    event.preventDefault()
    if (saving) return
    setError(''); setSuccess(false)
    if (!draft.name.trim() || !draft.slug.trim()) return setError('Completa el nombre y el identificador del centro.')
    if (!draft.schoolShift || !draft.enabledSubsystems.length) return setError('Selecciona al menos una jornada y un tipo de oferta.')
    setSaving(true)
    try {
      await onSave({
        ...draft, name: draft.name.trim(), slug: draft.slug.trim(),
        logoUrl: draft.logoUrl.trim() || null, centerCode: draft.centerCode.trim() || null,
      })
      edited.current = false
      setSuccess(true)
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'No se pudo guardar la configuración.') }
    finally { setSaving(false) }
  }

  if (!profile) return <Card><CardContent><p className="text-sm text-muted-foreground">No hay información del centro disponible.</p></CardContent></Card>
  const shiftChoices = [...shifts.map(([value, label]) => ({ value, label })), ...draft.schoolShift.split(',').filter((value) => value && !shifts.some(([known]) => known === value)).map((value) => ({ value, label: value }))]
  const offerChoices = [...offers.map(([value, label]) => ({ value, label })), ...draft.enabledSubsystems.filter((value) => !offers.some(([known]) => known === value)).map((value) => ({ value, label: value }))]
  return (
    <Card>
      <CardHeader className="flex items-start gap-3">
        <SemanticIcon icon={Building2} tone="info" />
        <div><CardTitle>Centro educativo</CardTitle><CardDescription>Identidad y oferta educativa de tu institución.</CardDescription></div>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={(event) => void save(event)} onChange={() => { edited.current = true; setSuccess(false) }}>
          {error ? <FeedbackBanner tone="danger" role="alert">{error}</FeedbackBanner> : null}
          {success ? <FeedbackBanner tone="success" role="status">Configuración del centro guardada.</FeedbackBanner> : null}
          <fieldset disabled={saving} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nombre de la institución *"><Input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} required maxLength={200} className="rounded-full" /></Field>
              <Field label="Identificador del centro"><Input value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: event.target.value })} required maxLength={200} className="rounded-full" /></Field>
              <Field label="Sector"><Select value={draft.sector} onChange={(event) => setDraft({ ...draft, sector: event.target.value as SchoolProfile['sector'] })} className="rounded-full"><option value="public">Público</option><option value="private">Privado</option><option value="semiofficial">Semioficial</option></Select></Field>
              <Field label="Código de centro"><Input value={draft.centerCode} onChange={(event) => setDraft({ ...draft, centerCode: event.target.value })} maxLength={200} className="rounded-full" /></Field>
            </div>
            <div className="space-y-4 border-t border-border pt-5">
              <SectionHeader title="Identidad visual" description="El logo identifica al centro en su información institucional." />
              <Field label="Logo del centro"><Input type="url" value={draft.logoUrl} onChange={(event) => setDraft({ ...draft, logoUrl: event.target.value })} placeholder="https://..." className="rounded-full" /></Field>
            </div>
            <div className="space-y-4 border-t border-border pt-5">
              <SectionHeader title="Oferta educativa" />
              <Field label="Modalidad principal"><Select value={draft.primaryModality} onChange={(event) => setDraft({ ...draft, primaryModality: event.target.value })} className="rounded-full">
                {!modalities.some(([value]) => value === draft.primaryModality) ? <option value={draft.primaryModality}>{draft.primaryModality}</option> : null}
                {modalities.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </Select></Field>
              <fieldset className="space-y-3"><legend className="mb-2 text-sm font-medium text-foreground">Jornadas</legend><div className="flex flex-wrap gap-2">{shiftChoices.map(({ value, label }) => <Choice key={value} label={label} checked={draft.schoolShift.split(',').includes(value)} onChange={() => toggleShift(value)} />)}</div></fieldset>
              <fieldset className="space-y-3"><legend className="mb-2 text-sm font-medium text-foreground">Enseñanzas y programas</legend><div className="flex flex-wrap gap-2">{offerChoices.map(({ value, label }) => <Choice key={value} label={label} checked={draft.enabledSubsystems.includes(value)} onChange={() => toggleOffer(value)} />)}</div></fieldset>
              <label className="flex items-start gap-3 rounded-2xl bg-muted/45 p-4">
                <input type="checkbox" className="mt-1 size-4 shrink-0 accent-primary" checked={draft.officialExportsEnabled} onChange={(event) => setDraft({ ...draft, officialExportsEnabled: event.target.checked })} />
                <span><strong className="block text-sm font-medium">Documentos oficiales</strong><span className="mt-1 block text-xs text-muted-foreground">Indica que el centro está habilitado para emitir documentos oficiales.</span></span>
              </label>
            </div>
          </fieldset>
          <div className="flex items-center justify-end border-t border-border pt-4">
            <Button type="submit" loading={saving} className="rounded-full" disabled={!draft.name.trim() || !draft.slug.trim()}><Save className="size-4" /> Guardar cambios</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="grid min-w-0 gap-2 text-sm font-medium text-foreground"><span>{label}</span>{children}</label>
}
function Choice({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return <label className="flex min-h-10 cursor-pointer items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm"><input type="checkbox" checked={checked} onChange={onChange} className="size-4 accent-primary" /><span>{label}</span></label>
}
