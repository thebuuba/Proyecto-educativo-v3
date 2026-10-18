import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { ReferenceSettingsPanel } from './ReferenceSettingsPanel'

vi.mock('@/modules/auth/hooks/useAuth', () => ({ useAuth: () => ({ appUser: {id:'user-1',email:'ana@example.test',phone:null}, roles: [], refreshAuth: vi.fn() }) }))
vi.mock('@/modules/auth/services/supabaseClient', () => ({supabase: {auth: {mfa: {listFactors: vi.fn().mockResolvedValue({data:{all:[]},error:null})}}}}))
vi.mock('@/modules/billing/hooks/useBilling', () => ({useBilling: () => ({loading:false,error:null,refetch:vi.fn(),overview:{enabled:true,environment:'sandbox',access:{allowed:false,reason:'none',until:null},trial:null,grants:[],payments:[],documents:[],transfers:[],subscriptions:[],prices:[],notices:[],serverNow:'2026-10-15T12:00:00Z'}})}))

vi.mock('./services/profileSettingsService', () => ({ getOwnProfileSettings: vi.fn().mockResolvedValue({
  id: 'user-1', fullName: 'Ana P?rez', email: 'ana@example.test', phone: null, avatarUrl: null,
  createdAt: '2026-01-01T00:00:00Z', roles: ['teacher'], institution: 'Centro Aula', academicIdentifier: null,
  preferences: { publicName:null, bio:null, birthDate:null, country:null, city:null, educationLevel:null, language:'es', timezone:'UTC', interests:[] },
  stats: [], completeness: 10,
}), updateOwnProfileSettings: vi.fn(), uploadOwnAvatar: vi.fn(), removeOwnAvatar: vi.fn() }))

describe('copia completa del diseño de ajustes', () => {
  it('conserva las tarjetas de pagos sin inventar planes, saldo ni facturas', async () => {
    render(
      <MemoryRouter>
        <ReferenceSettingsPanel section="suscripcion" />
      </MemoryRouter>,
    )
    for (const name of [
      'Configuración',
      'Historial de facturas',
      'Planes de suscripción',
      'Métodos de pago',
      'Preferencias de suscripción',
      'Actividad',
    ]) {
      expect(screen.getByRole('heading', { name })).toBeInTheDocument()
    }
    expect(screen.getByText('No hay pagos ni documentos registrados.')).toBeInTheDocument()
    expect(screen.getByText('No hay una suscripción registrada.')).toBeInTheDocument()
    expect(screen.queryByText(/FAC-2025|4242|8810|45,50|Pro Estudiante|19,99/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Datos de ejemplo|acciones.*simuladas/)).not.toBeInTheDocument()
    expect(screen.getAllByRole('progressbar')).toHaveLength(3)
    expect(screen.getByRole('button',{name:/Mensual/})).toBeInTheDocument()
    expect(screen.getByRole('button',{name:/Anual/})).toBeDisabled()
    expect(screen.getByRole('button',{name:/Fallidas/})).toBeInTheDocument()
    expect(screen.getByRole('button',{name:'Reciente'})).toBeInTheDocument()
    expect(screen.getByRole('button',{name:'Detalles'})).toBeInTheDocument()
    expect(screen.getByTestId('payment-card-empty')).toBeInTheDocument()
    expect(screen.queryByRole('button',{name:'Recargar'})).not.toBeInTheDocument()
    expect(screen.getByRole('button',{name:'Gestionar método de pago'})).toBeDisabled()
  })

  it('conserva los campos del perfil y las selecciones académicas de la referencia', async () => {
    render(
      <MemoryRouter>
        <ReferenceSettingsPanel section="cuenta" />
      </MemoryRouter>,
    )
    await screen.findByLabelText('Nombre completo')
    for (const name of [
      'Nombre completo',
      'Nombre público',
      'Correo electrónico',
      'Teléfono',
      'Fecha de nacimiento',
      'Ciudad',
      'Biografía',
    ]) {
      expect(screen.getByLabelText(name, { exact: true })).toBeInTheDocument()
    }
    expect(screen.getByRole('heading', { name: 'Perfil académico' })).toBeInTheDocument()
    expect(screen.queryByText('Áreas de interés')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Diseño UX' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Ver perfil público · Próximamente' })).not.toBeInTheDocument()
    expect(within(screen.getByRole('navigation', { name: 'Secciones de ajustes' })).getAllByRole('link')).toHaveLength(5)
    for (const name of ['País', 'Nivel educativo', 'Idioma de la plataforma', 'Zona horaria']) {
      expect(screen.getByRole('combobox', { name })).toBeInTheDocument()
    }
  })

  it('mantiene la matriz sin simular preferencias guardadas ni envíos', async () => {
    render(
      <MemoryRouter>
        <ReferenceSettingsPanel section="notificaciones" />
      </MemoryRouter>,
    )
    expect(screen.getByRole('button',{name:'Clases en vivo por Email: no disponible'})).toBeDisabled()
    expect(screen.queryAllByRole('radio',{checked:true})).toHaveLength(0)
    expect(screen.getByLabelText('Desde')).toBeDisabled()
    expect(screen.getByLabelText('Desde')).toHaveValue('')
    expect(screen.getByRole('radio',{name:/Resumen diario/})).toBeDisabled()
    expect(screen.getByRole('button',{name:'Enviar prueba'})).toBeDisabled()
    expect(screen.queryByText('¡Enviada!')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Modo no molestar' })).toBeInTheDocument()
    expect(
      within(screen.getByRole('navigation', { name: 'Secciones de ajustes' })).getAllByRole('link'),
    ).toHaveLength(5)
  })

  it('conserva recuperación y seguridad sin mostrar las tarjetas retiradas', async () => {
    render(<MemoryRouter><ReferenceSettingsPanel section="seguridad" /></MemoryRouter>)
    expect(screen.getByText('ana@example.test')).toBeInTheDocument()
    expect(screen.getByRole('heading', {name:'Recuperación y alertas'})).toBeInTheDocument()
    expect(screen.queryByText('Dispositivos conectados')).not.toBeInTheDocument()
    expect(screen.queryByText('Actividad reciente')).not.toBeInTheDocument()
    expect(screen.queryByText('Verificación en dos pasos')).not.toBeInTheDocument()
    expect(screen.queryByText('Sin factores verificados')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña actual')).toBeDisabled()
    expect(screen.getByLabelText('Nueva contraseña')).toBeDisabled()
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow')
    expect(within(screen.getByRole('navigation', {name:'Secciones de ajustes'})).getAllByRole('link')).toHaveLength(5)
  })

  it('conserva controles de datos y pestañas sin mostrar opciones de privacidad retiradas', async () => {
    render(<MemoryRouter><ReferenceSettingsPanel section="privacidad" /></MemoryRouter>)
    expect(screen.getByRole('heading', {name:'Uso de datos'})).toBeInTheDocument()
    expect(screen.queryByRole('heading', {name:'Actividad en la comunidad'})).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', {name:'Visibilidad del perfil'})).not.toBeInTheDocument()
    expect(screen.getByRole('button',{name:'Solicitar descarga'})).toBeDisabled()
    expect(screen.getByRole('button',{name:'Eliminar mi cuenta'})).toBeDisabled()
    expect(screen.queryByText(/12 ene 2025|Cumplimos con el RGPD|Te lo enviamos/)).not.toBeInTheDocument()
    expect(within(screen.getByRole('navigation', {name:'Secciones de ajustes'})).getAllByRole('link')).toHaveLength(5)
  })
})
