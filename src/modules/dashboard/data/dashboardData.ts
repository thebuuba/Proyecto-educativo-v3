import {
  AlertTriangle,
  BookOpenCheck,
  CalendarCheck,
  ClipboardList,
  FileText,
  GraduationCap,
  TrendingUp,
  UserPlus,
  UsersRound,
} from 'lucide-react'

import type {
  AcademicAlert,
  ChartDatum,
  DashboardStat,
  QuickAction,
  RecentStudent,
} from '@/modules/dashboard/types/dashboard'

export const dashboardStats: DashboardStat[] = [
  {
    label: 'Estudiantes activos',
    value: '1,284',
    change: '+8.2%',
    trend: 'vs. mes anterior',
    icon: UsersRound,
    tone: 'cyan',
  },
  {
    label: 'Asistencia promedio',
    value: '92.6%',
    change: '+3.1%',
    trend: 'últimos 30 días',
    icon: CalendarCheck,
    tone: 'emerald',
  },
  {
    label: 'Promedio académico',
    value: '87.4',
    change: '+1.8 pts',
    trend: 'año escolar actual',
    icon: GraduationCap,
    tone: 'indigo',
  },
  {
    label: 'Alertas abiertas',
    value: '24',
    change: '-6',
    trend: 'pendientes críticas',
    icon: AlertTriangle,
    tone: 'amber',
  },
]

export const attendanceData: ChartDatum[] = [
  { label: 'Lun', value: 94 },
  { label: 'Mar', value: 91 },
  { label: 'Mié', value: 96 },
  { label: 'Jue', value: 89 },
  { label: 'Vie', value: 93 },
  { label: 'Sáb', value: 86 },
]

export const performanceData: ChartDatum[] = [
  { label: 'Ene', value: 78 },
  { label: 'Feb', value: 81 },
  { label: 'Mar', value: 84 },
  { label: 'Abr', value: 82 },
  { label: 'May', value: 87 },
  { label: 'Jun', value: 89 },
]

export const recentStudents: RecentStudent[] = [
  {
    name: 'Laura Méndez',
    grade: '4to A',
    status: 'Activo',
    average: '91.5',
    attendance: '96%',
  },
  {
    name: 'Carlos Jiménez',
    grade: '3ro B',
    status: 'Seguimiento',
    average: '76.2',
    attendance: '88%',
  },
  {
    name: 'Ana Castillo',
    grade: '5to C',
    status: 'Activo',
    average: '88.0',
    attendance: '94%',
  },
  {
    name: 'Miguel Santos',
    grade: '2do A',
    status: 'Nuevo',
    average: '84.7',
    attendance: '91%',
  },
]

export const academicAlerts: AcademicAlert[] = [
  {
    title: 'Rendimiento bajo',
    description: '8 estudiantes requieren revisión de calificaciones.',
    severity: 'Alta',
  },
  {
    title: 'Asistencia irregular',
    description: '12 registros por debajo del umbral semanal.',
    severity: 'Media',
  },
  {
    title: 'Recuperación pendiente',
    description: '5 notas de recuperación pedagógica por publicar.',
    severity: 'Media',
  },
]

export const quickActions: QuickAction[] = [
  { label: 'Registrar estudiante', icon: UserPlus, path: '/estudiantes' },
  { label: 'Tomar asistencia', icon: ClipboardList, path: '/asistencia' },
  { label: 'Cargar calificaciones', icon: BookOpenCheck, path: '/calificaciones' },
  { label: 'Generar reporte', icon: FileText, path: '/reportes' },
  { label: 'Ver rendimiento', icon: TrendingUp, path: '/calificaciones' },
]
