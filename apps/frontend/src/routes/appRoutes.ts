/**
 * Definición de rutas de la aplicación y navegación por módulos.
 */
import {
  BookOpen,
  CalendarCheck,
  CalendarClock,
  ChartNoAxesCombined,
  GraduationCap,
  Grid3x3,
  LayoutDashboard,
  LibraryBig,
  NotebookPen,
  Settings,
  UsersRound,
} from 'lucide-react'
import { lazy } from 'react'
import type { ComponentType } from 'react'

import type { UserRole } from '@/types/domain'

/**
 * Carga diferida de un componente exportado por un módulo.
 *
 * @param importFn - Función de importación dinámica.
 * @param exportName - Nombre del export a cargar.
 * @returns Componente lazy.
 */
function lazyPage(importFn: () => Promise<Record<string, unknown>>, exportName: string) {
  return lazy(() => importFn().then((m) => ({ default: m[exportName] as ComponentType })))
}

const GradingPage = lazyPage(() => import('@/modules/grading/pages/GradingPage'), 'GradingPage')
const DashboardPage = lazyPage(() => import('@/modules/dashboard/pages/DashboardPage'), 'DashboardPage')
const AttendancePage = lazyPage(() => import('@/modules/attendance/pages/AttendancePage'), 'AttendancePage')
const CoursesPage = lazyPage(() => import('@/modules/courses/pages/CoursesPage'), 'CoursesPage')
const ReportsPage = lazyPage(() => import('@/modules/reports/pages/ReportsPage'), 'ReportsPage')
const CompetencyMatrixPage = lazyPage(() => import('@/modules/competency-matrix/pages/CompetencyMatrixPage'), 'CompetencyMatrixPage')
const PlanningPage = lazyPage(() => import('@/modules/planning/pages/PlanningPage'), 'PlanningPage')
const ProfilePage = lazyPage(() => import('@/modules/profile/pages/ProfilePage'), 'ProfilePage')
const SchedulePage = lazyPage(() => import('@/modules/schedule/pages/SchedulePage'), 'SchedulePage')
const SchoolAdministrationPage = lazyPage(() => import('@/modules/school-administration/pages/SchoolAdministrationPage'), 'SchoolAdministrationPage')
const StudentsPage = lazyPage(() => import('@/modules/students/pages/StudentsPage'), 'StudentsPage')
const SubjectsPage = lazyPage(() => import('@/modules/subjects/pages/SubjectsPage'), 'SubjectsPage')

/** Definición de una ruta de la aplicación. */
export type AppRoute = {
  /** Ruta URL. */
  path: string
  /** Etiqueta mostrada en la navegación. */
  label: string
  /** Icono de la ruta. */
  icon: ComponentType<{ className?: string }>
  /** Componente de la página. */
  component: ComponentType
  /** Roles con acceso permitido. */
  allowedRoles: UserRole[]
  /** Si es la ruta index del layout. */
  index?: boolean
  /** Si se muestra en la barra lateral. */
  showInSidebar?: boolean
}

/** Todos los roles del sistema. */
const allRoles: UserRole[] = [
  'admin',
  'director',
  'coordinator',
  'teacher',
  'student',
  'guardian',
  'viewer',
]

export const appRoutes: AppRoute[] = [
  {
    path: '/inicio',
    label: 'Inicio',
    icon: LayoutDashboard,
    component: DashboardPage,
    allowedRoles: allRoles,
  },
  {
    path: '/cursos',
    label: 'Cursos',
    icon: LibraryBig,
    component: CoursesPage,
    allowedRoles: ['admin', 'director', 'coordinator'],
  },
  {
    path: '/estudiantes',
    label: 'Matrícula',
    icon: UsersRound,
    component: StudentsPage,
    allowedRoles: ['admin', 'director', 'coordinator', 'teacher'],
  },
  {
    path: '/asignaturas',
    label: 'Asignaturas',
    icon: BookOpen,
    component: SubjectsPage,
    allowedRoles: ['admin', 'director', 'coordinator', 'teacher'],
    showInSidebar: false,
  },
  {
    path: '/horario',
    label: 'Horario',
    icon: CalendarClock,
    component: SchedulePage,
    allowedRoles: ['admin', 'director', 'coordinator', 'teacher'],
  },
  {
    path: '/asistencia',
    label: 'Asistencia',
    icon: CalendarCheck,
    component: AttendancePage,
    allowedRoles: ['admin', 'coordinator', 'teacher'],
  },
  {
    path: '/calificaciones',
    label: 'Evaluación',
    icon: GraduationCap,
    component: GradingPage,
    allowedRoles: ['admin', 'director', 'coordinator', 'teacher', 'student', 'guardian'],
  },
  {
    path: '/planificaciones',
    label: 'Planificación',
    icon: NotebookPen,
    component: PlanningPage,
    allowedRoles: ['admin', 'director', 'coordinator', 'teacher'],
  },
  {
    path: '/matriz',
    label: 'Matriz',
    icon: Grid3x3,
    component: CompetencyMatrixPage,
    allowedRoles: ['admin', 'director', 'coordinator', 'teacher'],
    showInSidebar: false,
  },
  {
    path: '/reportes',
    label: 'Reportes',
    icon: ChartNoAxesCombined,
    component: ReportsPage,
    allowedRoles: ['admin', 'director', 'coordinator', 'teacher'],
  },
  {
    path: '/configuracion',
    label: 'Administración escolar',
    icon: Settings,
    component: SchoolAdministrationPage,
    allowedRoles: ['admin'],
  },
  {
    path: '/perfil',
    label: 'Perfil',
    icon: UsersRound,
    component: ProfilePage,
    allowedRoles: allRoles,
    showInSidebar: false,
  },
]

/** Prefetch de cada ruta: llama a la función para cargar el chunk en background. */
export const routePrefetchers: Record<string, () => void> = {
  '/inicio': () => void import('@/modules/dashboard/pages/DashboardPage'),
  '/cursos': () => void import('@/modules/courses/pages/CoursesPage'),
  '/estudiantes': () => void import('@/modules/students/pages/StudentsPage'),
  '/horario': () => void import('@/modules/schedule/pages/SchedulePage'),
  '/asistencia': () => void import('@/modules/attendance/pages/AttendancePage'),
  '/calificaciones': () => void import('@/modules/grading/pages/GradingPage'),
  '/planificaciones': () => void import('@/modules/planning/pages/PlanningPage'),
  '/reportes': () => void import('@/modules/reports/pages/ReportsPage'),
  '/configuracion': () => void import('@/modules/school-administration/pages/SchoolAdministrationPage'),
}

/** Rutas filtradas para mostrar en la barra de navegación lateral. */
export const navigationRoutes = appRoutes
  .filter((route) => route.showInSidebar !== false)
  .map(({ path, label, icon, allowedRoles }) => ({
    path,
    label,
    icon,
    allowedRoles,
  }))
