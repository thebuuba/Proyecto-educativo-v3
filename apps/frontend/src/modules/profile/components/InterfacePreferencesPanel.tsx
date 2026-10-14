import { LayoutPanelLeft, Sparkles } from 'lucide-react'
import { useId, useState } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { FeedbackBanner, SemanticIcon } from '@/components/ui/SemanticUI'
import { setReduceAnimations, setSidebarExpanded, useInterfacePreferences, useReducedMotion } from '@/hooks/useInterfacePreferences'

export function InterfacePreferencesPanel() {
  const { sidebarExpanded, reduceAnimations } = useInterfacePreferences()
  const reducedMotion = useReducedMotion()
  const [error, setError] = useState(false)
  const id = useId()

  return (
    <Card>
      <CardHeader className="flex items-center gap-3 border-b-0 pb-2">
        <SemanticIcon icon={LayoutPanelLeft} tone="info" className="size-10 rounded-xl" iconClassName="size-4" />
        <div>
          <CardTitle>Preferencias de interfaz</CardTitle>
          <CardDescription>Los cambios se guardan automáticamente en este navegador.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? <FeedbackBanner tone="danger" role="alert">No se pudo guardar la preferencia. Revisa si el navegador permite almacenar datos.</FeedbackBanner> : null}
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border p-4">
            <input type="checkbox" className="mt-1 size-5 shrink-0 accent-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20" checked={sidebarExpanded} onChange={(event) => setError(!setSidebarExpanded(event.target.checked))} aria-labelledby={`${id}-sidebar-label`} aria-describedby={`${id}-sidebar`} />
            <span>
              <span id={`${id}-sidebar-label`} className="block text-sm font-semibold text-foreground">Menú lateral expandido</span>
              <span id={`${id}-sidebar`} className="mt-1 block text-xs leading-5 text-muted-foreground">Muestra los nombres de los módulos en pantallas grandes.</span>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border p-4">
            <input type="checkbox" className="mt-1 size-5 shrink-0 accent-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20" checked={reduceAnimations} onChange={(event) => setError(!setReduceAnimations(event.target.checked))} aria-labelledby={`${id}-motion-label`} aria-describedby={`${id}-motion`} />
            <span>
              <span id={`${id}-motion-label`} className="block text-sm font-semibold text-foreground">Reducir animaciones</span>
              <span id={`${id}-motion`} className="mt-1 block text-xs leading-5 text-muted-foreground">Limita transiciones y desplazamientos. También se respeta la preferencia de tu sistema.</span>
            </span>
          </label>
        </div>
        {reducedMotion ? <p className="flex items-center gap-2 text-xs text-muted-foreground"><Sparkles className="size-4 shrink-0" aria-hidden="true" />La reducción de movimiento está activa.</p> : null}
      </CardContent>
    </Card>
  )
}
