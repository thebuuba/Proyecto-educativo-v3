import type { DashboardSetupProgress } from '@/modules/dashboard/types/dashboard'
import { getNextSetupTourStep } from '@/modules/dashboard/setupTour'

export type TourStepDefinition = {
  title: string
  description: string
  selector?: string
  path?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
}

export type TourDefinition = {
  key: string
  version: number
  title: string
  description: string
  steps: TourStepDefinition[]
}

const generalTour: TourDefinition = {
  key: 'general-navigation', version: 1, title: 'Conoce Aula Base',
  description: 'Un recorrido corto por las áreas principales del sistema.',
  steps: [
    { title: 'Tu espacio de trabajo', description: 'Aquí verás lo importante del día y las acciones que requieren atención.' },
    { title: 'Navegación principal', description: 'Desde esta barra puedes entrar a cada módulo disponible para tu rol.', selector: '[data-tour="nav-courses"]', side: 'right' },
    { title: 'Ayuda siempre disponible', description: 'Puedes volver a abrir cualquier recorrido desde este botón.', selector: '[data-tour="help-center"]', side: 'bottom' },
  ],
}

const teacherTour: TourDefinition = {
  key: 'teacher-workflow', version: 1, title: 'Tu flujo docente',
  description: 'Aprende a organizar clases, asistencia y planificación.',
  steps: [
    { title: 'Tus cursos', description: 'Consulta las asignaturas y grupos que tienes asignados.', selector: '[data-tour="nav-courses"]', path: '/cursos', side: 'right' },
    { title: 'Asistencia', description: 'Registra el pase de lista desde aquí.', selector: '[data-tour="nav-attendance"]', path: '/asistencia', side: 'right' },
    { title: 'Planificaciones', description: 'Prepara y consulta tus planificaciones docentes.', selector: '[data-tour="nav-planning"]', path: '/planificaciones', side: 'right' },
  ],
}

const managementRoles = new Set(['admin', 'director', 'coordinator'])

export function getToursForRoles(roles: string[], setup: DashboardSetupProgress): TourDefinition[] {
  const tours = [generalTour]
  if (roles.some((role) => managementRoles.has(role))) {
    const next = getNextSetupTourStep(setup)
    if (next) tours.push({
      key: 'management-setup', version: 1, title: 'Configura tu centro',
      description: 'Te llevamos al siguiente paso pendiente de la configuración inicial.',
      steps: [
        { title: next.title, description: next.description },
        { title: 'Abre el módulo', description: 'Entra por esta opción para continuar.', selector: next.navSelector, path: next.path, side: 'right' },
        { title: next.title, description: 'Usa esta acción. La guía reconocerá el cambio cuando guardes.', selector: next.actionSelector, side: 'bottom' },
      ],
    })
  } else if (roles.includes('teacher')) tours.push(teacherTour)
  return tours
}
