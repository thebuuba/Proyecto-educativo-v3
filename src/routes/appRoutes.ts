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
import type { ComponentType } from 'react'

import { AcademicGradesPage } from '@/modules/academic-grades/pages/AcademicGradesPage'
import { AttendancePage } from '@/modules/attendance/pages/AttendancePage'
import { DashboardPage } from '@/modules/dashboard/pages/DashboardPage'
import { GradesSectionsPage } from '@/modules/grades-sections/pages/GradesSectionsPage'
import { ReportsPage } from '@/modules/reports/pages/ReportsPage'
import { MatrixPage } from '@/modules/matrix/pages/MatrixPage'
import { PlanningPage } from '@/modules/planning/pages/PlanningPage'
import { SchedulePage } from '@/modules/schedule/pages/SchedulePage'
import { SettingsPage } from '@/modules/settings/pages/SettingsPage'
import { StudentsPage } from '@/modules/students/pages/StudentsPage'
import { SubjectsPage } from '@/modules/subjects/pages/SubjectsPage'
import type { UserRole } from '@/types/domain'

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
