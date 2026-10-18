import { Suspense, lazy } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import {
  ReferenceSettingsPanel,
  type ReferenceSettingsSection,
} from '@/modules/settings-reference/ReferenceSettingsPanel'

const SchoolAdministrationWorkspace = lazy(() =>
  import('./SchoolAdministrationWorkspace').then((module) => ({
    default: module.SchoolAdministrationWorkspace,
  })),
)
const personalSections = ['cuenta', 'seguridad', 'notificaciones', 'suscripcion', 'privacidad']
const adminSections = ['centro', 'calendario', 'usuarios', 'modulos']

export function SchoolAdministrationPage() {
  const { hasRole } = useAuth()
  const [params] = useSearchParams()
  const { hash } = useLocation()
  const requested = params.get('tab')
  const section =
    requested === 'perfil' ? 'cuenta' : requested === 'pagos' ? 'suscripcion' : requested
  const administrative =
    hasRole(['admin']) &&
    (adminSections.includes(section ?? '') ||
      (!personalSections.includes(section ?? '') &&
        ['#anos-escolares', '#periodos-academicos'].includes(hash)))
  if (administrative)
    return (
      <Suspense fallback={<p role="status">Cargando configuración...</p>}>
        <SchoolAdministrationWorkspace />
      </Suspense>
    )

  const personal = (
    personalSections.includes(section ?? '') ? section : 'suscripcion'
  ) as ReferenceSettingsSection
  return (
    <div className="w-full min-w-0">
      <ReferenceSettingsPanel section={personal} />
    </div>
  )
}
