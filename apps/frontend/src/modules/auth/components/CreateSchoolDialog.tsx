import { Building2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { supabase } from '@/modules/auth/services/supabaseClient'
import { api } from '@/services/apiClient'
import type { SchoolResult } from './SchoolSearchInput'

export function CreateSchoolDialog({ initialName, onSelect, onClose }: {
  initialName: string
  onSelect: (school: SchoolResult) => void
  onClose: () => void
}) {
  const [name, setName] = useState(initialName)
  const [sector, setSector] = useState('')
  const [district, setDistrict] = useState('')
  const [centerCode, setCenterCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [existing, setExisting] = useState<SchoolResult | null>(null)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    setError('')
    if (name.trim().length < 3 || district.trim().length < 3) {
      setError('Escribe el nombre completo y la ubicación del centro.')
      return
    }
    setBusy(true)
    try {
      const { data, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !data.session) throw new Error('Inicia sesión para agregar un centro.')
      const result = await api.post<{ school: SchoolResult; created: boolean }>('/schools', {
        name: name.trim(), sector, district: district.trim(), ...(centerCode.trim() ? { centerCode: centerCode.trim().toUpperCase() } : {}),
      }, { headers: { Authorization: `Bearer ${data.session.access_token}` } })
      if (result.created) onSelect(result.school)
      else setExisting(result.school)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No pudimos agregar el centro. Intenta nuevamente.')
    } finally { setBusy(false) }
  }

  return <Modal title="Agregar centro educativo" icon={Building2} description="Quedará disponible en el buscador para ti y para otros maestros." onClose={() => { if (!busy) onClose() }} className="max-w-lg">
    {existing ? <div className="space-y-5 p-6">
      <p role="status" className="text-sm text-muted-foreground">Este centro ya está registrado. Puedes usarlo sin crear un duplicado.</p>
      <div className="rounded-2xl border border-border p-4"><p className="font-semibold">{existing.name}</p><p className="mt-2 text-sm text-muted-foreground">{existing.district}</p>{existing.centerCode && <p className="mt-1 text-xs text-muted-foreground">Código {existing.centerCode}</p>}</div>
      <div className="flex justify-end gap-3"><Button variant="ghost" onClick={() => setExisting(null)}>Volver y editar</Button><Button onClick={() => onSelect(existing)}>Usar este centro</Button></div>
    </div> : <form className="space-y-4 p-6" onSubmit={submit}>
      <label className="block text-sm font-medium">Nombre del centro<Input className="mt-2" value={name} onChange={event => setName(event.target.value)} required minLength={3} maxLength={160} disabled={busy} autoFocus placeholder="Nombre completo de la escuela o colegio" /></label>
      <label className="block text-sm font-medium">Tipo de centro<Select className="mt-2" value={sector} onChange={event => setSector(event.target.value)} required disabled={busy}><option value="" disabled>Selecciona una opción</option><option value="public">Público</option><option value="private">Privado</option></Select></label>
      <label className="block text-sm font-medium">Ubicación del centro<Input className="mt-2" value={district} onChange={event => setDistrict(event.target.value)} required minLength={3} maxLength={160} disabled={busy} placeholder="Municipio, provincia y sector" /><span className="mt-1 block text-xs font-normal text-muted-foreground">Ayuda a distinguir centros con el mismo nombre.</span></label>
      <label className="block text-sm font-medium">Código del centro <span className="font-normal text-muted-foreground">(opcional)</span><Input className="mt-2" value={centerCode} onChange={event => setCenterCode(event.target.value.toUpperCase())} maxLength={20} pattern="[A-Za-z0-9\-]+" disabled={busy} placeholder="Si lo conoces, escríbelo aquí" /></label>
      <p className="text-xs leading-5 text-muted-foreground">Comprueba que los datos correspondan al centro educativo. En el siguiente paso elegirás tu nivel, tanda y tipo de oferta.</p>
      {error && <p role="alert" className="rounded-xl bg-destructive/10 p-3 text-sm text-foreground">{error}</p>}
      <div className="flex justify-end gap-3 pt-2"><Button variant="ghost" disabled={busy} onClick={onClose}>Cancelar</Button><Button type="submit" loading={busy}>Guardar y seleccionar</Button></div>
    </form>}
  </Modal>
}
