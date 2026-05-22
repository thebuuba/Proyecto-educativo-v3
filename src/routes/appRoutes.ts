import {
  BookOpen,
  CalendarCheck,
  ChartNoAxesCombined,
  GraduationCap,
  LayoutDashboard,
  LibraryBig,
  Settings,
  ShieldCheck,
  SquareUserRound,
  UsersRound,
} from 'lucide-react'
import type { ComponentType } from 'react'

import { AcademicGradesPage } from '@/modules/academic-grades/pages/AcademicGradesPage'
import { AttendancePage } from '@/modules/attendance/pages/AttendancePage'
import { DashboardPage } from '@/modules/dashboard/pages/DashboardPage'
import { GradesSectionsPage } from '@/modules/grades-sections/pages/GradesSectionsPage'
import { ReportsPage } from '@/modules/reports/pages/ReportsPage'
import { SettingsPage } from '@/modules/settings/pages/SettingsPage'
import { StudentsPage } from '@/modules/students/pages/StudentsPage'
import { SubjectsPage } from '@/modules/subjects/pages/SubjectsPage'
import { TeachersPage } from '@/modules/teachers/pages/TeachersPage'
import { RolesUsersPage } from '@/modules/users-roles/pages/RolesUsersPage'
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
  'academic_coordinator',
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
    allowedRoles: ['admin', 'academic_coordinator', 'teacher'],
  },
  {
    path: '/docentes',
    label: 'Docentes',
    icon: SquareUserRound,
    component: TeachersPage,
    allowedRoles: ['admin', 'academic_coordinator'],
  },
  {
    path: '/asignaturas',
    label: 'Asignaturas',
    icon: BookOpen,
    component: SubjectsPage,
    allowedRoles: ['admin', 'academic_coordinator', 'teacher'],
  },
  {
    path: '/grados-secciones',
    label: 'Grados y secciones',
    icon: LibraryBig,
    component: GradesSectionsPage,
    allowedRoles: ['admin', 'academic_coordinator'],
  },
  {
    path: '/asistencia',
    label: 'Asistencia',
    icon: CalendarCheck,
    component: AttendancePage,
    allowedRoles: ['admin', 'academic_coordinator', 'teacher'],
  },
  {
    path: '/calificaciones',
    label: 'Calificaciones',
    icon: GraduationCap,
    component: AcademicGradesPage,
    allowedRoles: ['admin', 'academic_coordinator', 'teacher', 'student', 'guardian'],
  },
  {
    path: '/reportes',
    label: 'Reportes',
    icon: ChartNoAxesCombined,
    component: ReportsPage,
    allowedRoles: ['admin', 'academic_coordinator', 'teacher'],
  },
  {
    path: '/usuarios-roles',
    label: 'Usuarios y roles',
    icon: ShieldCheck,
    component: RolesUsersPage,
    allowedRoles: ['admin'],
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
