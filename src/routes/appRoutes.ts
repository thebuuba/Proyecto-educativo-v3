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

function lazyPage(importFn: () => Promise<Record<string, unknown>>, exportName: string) {
  return lazy(() => importFn().then((m) => ({ default: m[exportName] as ComponentType })))
}

const AcademicGradesPage = lazyPage(() => import('@/modules/academic-grades/pages/AcademicGradesPage'), 'AcademicGradesPage')
const AttendancePage = lazyPage(() => import('@/modules/attendance/pages/AttendancePage'), 'AttendancePage')
const DashboardPage = lazyPage(() => import('@/modules/dashboard/pages/DashboardPage'), 'DashboardPage')
const GradesSectionsPage = lazyPage(() => import('@/modules/grades-sections/pages/GradesSectionsPage'), 'GradesSectionsPage')
const ReportsPage = lazyPage(() => import('@/modules/reports/pages/ReportsPage'), 'ReportsPage')
const MatrixPage = lazyPage(() => import('@/modules/matrix/pages/MatrixPage'), 'MatrixPage')
const PlanningPage = lazyPage(() => import('@/modules/planning/pages/PlanningPage'), 'PlanningPage')
const SchedulePage = lazyPage(() => import('@/modules/schedule/pages/SchedulePage'), 'SchedulePage')
const SettingsPage = lazyPage(() => import('@/modules/settings/pages/SettingsPage'), 'SettingsPage')
const StudentsPage = lazyPage(() => import('@/modules/students/pages/StudentsPage'), 'StudentsPage')
const SubjectsPage = lazyPage(() => import('@/modules/subjects/pages/SubjectsPage'), 'SubjectsPage')

export type AppRoute = {
  path: string
  label: string
  icon: ComponentType<{ className?: string }>
  component: ComponentType
  allowedRoles: UserRole[]
  index?: boolean
}

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
    path: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
    component: DashboardPage,
    allowedRoles: allRoles,
    index: true,
  },
  {
    path: '/estudiantes',
    label: 'Estudiantes',
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
  },
  {
    path: '/grados-secciones',
    label: 'Grados y secciones',
    icon: LibraryBig,
    component: GradesSectionsPage,
    allowedRoles: ['admin', 'director', 'coordinator'],
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
    label: 'Calificaciones',
    icon: GraduationCap,
    component: AcademicGradesPage,
    allowedRoles: ['admin', 'director', 'coordinator', 'teacher', 'student', 'guardian'],
  },
  {
    path: '/planificaciones',
    label: 'Planificaciones',
    icon: NotebookPen,
    component: PlanningPage,
    allowedRoles: ['admin', 'director', 'coordinator', 'teacher'],
  },
  {
    path: '/matriz',
    label: 'Matriz',
    icon: Grid3x3,
    component: MatrixPage,
    allowedRoles: ['admin', 'director', 'coordinator', 'teacher'],
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
    label: 'Configuración',
    icon: Settings,
    component: SettingsPage,
    allowedRoles: ['admin'],
  },
]

export const navigationRoutes = appRoutes.map(
  ({ path, label, icon, allowedRoles }) => ({
    path,
    label,
    icon,
    allowedRoles,
  }),
)
