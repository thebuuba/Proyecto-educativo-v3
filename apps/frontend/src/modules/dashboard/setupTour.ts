import type { DashboardSetupProgress } from '@/modules/dashboard/types/dashboard'

export type SetupTourStep = {
  id: 'courses' | 'students' | 'schedule' | 'attendance' | 'planning'
  path: string
  navSelector: string
  actionSelector: string
  title: string
  description: string
}

const setupTourSteps: Array<SetupTourStep & { done: (progress: DashboardSetupProgress) => boolean }> = [
  { id: 'courses', path: '/cursos', navSelector: '[data-tour="nav-courses"]', actionSelector: '[data-tour="create-course"]', title: 'Crea tu primer curso', description: 'Aquí comienzas a organizar grados, secciones y asignaturas.' , done: (p) => p.courseCount > 0 },
  { id: 'students', path: '/cursos', navSelector: '[data-tour="nav-courses"]', actionSelector: '[data-tour="manage-students"]', title: 'Agrega tus estudiantes', description: 'Abre un curso y entra en Estudiantes para añadirlos o importar un listado.', done: (p) => p.studentCount > 0 || p.activeEnrollments > 0 },
  { id: 'schedule', path: '/horario', navSelector: '[data-tour="nav-schedule"]', actionSelector: '[data-tour="create-schedule"]', title: 'Organiza tu horario', description: 'Añade la primera clase para que Aula Base prepare tu agenda diaria.', done: (p) => p.scheduleEntryCount > 0 },
  { id: 'attendance', path: '/asistencia', navSelector: '[data-tour="nav-attendance"]', actionSelector: '[data-tour="record-attendance"]', title: 'Registra asistencia', description: 'Selecciona el curso del día y realiza tu primer pase de lista.', done: (p) => p.attendanceCount > 0 },
  { id: 'planning', path: '/planificaciones', navSelector: '[data-tour="nav-planning"]', actionSelector: '[data-tour="create-planning"]', title: 'Crea una planificación', description: 'Prepara tu primera planificación y deja listo el trabajo académico.', done: (p) => p.planningCount > 0 },
]

export function getNextSetupTourStep(progress: DashboardSetupProgress): SetupTourStep | null {
  const step = setupTourSteps.find((candidate) => !candidate.done(progress))
  if (!step) return null
  const { done: _done, ...result } = step
  return result
}

export const SETUP_TOUR_START_EVENT = 'aulabase:setup-tour:start'

export function startSetupTour(step: SetupTourStep) {
  window.dispatchEvent(new CustomEvent<SetupTourStep>(SETUP_TOUR_START_EVENT, { detail: step }))
}
