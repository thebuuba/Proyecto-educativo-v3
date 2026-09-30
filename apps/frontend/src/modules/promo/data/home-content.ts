import {
  CalendarCheckIcon,
  ClipboardListIcon,
  NotebookPenIcon,
  BarChart3Icon,
  BookOpenIcon,
  UsersIcon,
  Clock3Icon,
  Building2Icon,
  GraduationCapIcon,
  type LucideIcon,
} from 'lucide-react'

export type Tone = 'brand' | 'success' | 'warning' | 'incident' | 'violet'

export interface ModuleItem {
  id: string
  title: string
  description: string
  icon: LucideIcon
  tone: Tone
}

export const modules: ModuleItem[] = [
  {
    id: 'cursos',
    title: 'Cursos y estudiantes',
    description:
      'Crea cursos y asignaturas por año escolar, y matricula a tus estudiantes una sola vez.',
    icon: UsersIcon,
    tone: 'brand',
  },
  {
    id: 'horario',
    title: 'Horario',
    description: 'Tu semana de clases a la vista, con aula, curso y cantidad de estudiantes.',
    icon: Clock3Icon,
    tone: 'violet',
  },
  {
    id: 'asistencia',
    title: 'Asistencia',
    description: 'Pasa lista por clase y distingue presentes, ausentes, justificadas y tardanzas.',
    icon: CalendarCheckIcon,
    tone: 'success',
  },
  {
    id: 'evaluacion',
    title: 'Evaluación y calificaciones',
    description:
      'Define actividades e instrumentos de evaluación y registra calificaciones por período.',
    icon: ClipboardListIcon,
    tone: 'warning',
  },
  {
    id: 'planificacion',
    title: 'Planificación curricular',
    description:
      'Organiza unidades y planificaciones y compártelas con coordinación para su revisión.',
    icon: BookOpenIcon,
    tone: 'brand',
  },
  {
    id: 'bitacora',
    title: 'Bitácora docente',
    description: 'Anota observaciones, seguimientos académicos y situaciones de conducta.',
    icon: NotebookPenIcon,
    tone: 'incident',
  },
  {
    id: 'reportes',
    title: 'Reportes',
    description:
      'Consulta el progreso de cada estudiante y de cada curso a partir de lo que registras.',
    icon: BarChart3Icon,
    tone: 'violet',
  },
  {
    id: 'administracion',
    title: 'Administración escolar',
    description:
      'Configura el centro, los años escolares, los períodos y los perfiles de cada usuario.',
    icon: Building2Icon,
    tone: 'success',
  },
  {
    id: 'perfiles',
    title: 'Perfiles según rol',
    description:
      'Docentes, directores, coordinadores, administradores, estudiantes y tutores ven lo que les corresponde.',
    icon: GraduationCapIcon,
    tone: 'warning',
  },
]

export interface Step {
  title: string
  description: string
}

export const steps: Step[] = [
  { title: 'Crea tu cuenta', description: 'Regístrate con tu nombre y correo electrónico.' },
  {
    title: 'Confirma tu correo',
    description: 'Si te lo pedimos, abre el enlace que te enviamos para activar la cuenta.',
  },
  {
    title: 'Configura tu centro',
    description: 'Indica tu escuela, el año escolar y tus cursos y asignaturas.',
  },
  {
    title: 'Empieza a trabajar',
    description: 'Pasa lista, registra calificaciones y planifica desde la aplicación.',
  },
]

export interface FaqItem {
  q: string
  a: string
}

export const faqs: FaqItem[] = [
  {
    q: '¿Qué es Aula Base?',
    a: 'Es una plataforma web de gestión académica. Organiza el trabajo de un centro por escuela y año escolar: cursos, asignaturas, estudiantes, horario, asistencia, evaluaciones, calificaciones, planificación, bitácora y reportes.',
  },
  {
    q: '¿Puedo usarla como docente aunque mi centro no la use?',
    a: 'Sí. Al registrarte indicas tu centro y configuras tus propios cursos. Si más adelante tu centro se suma, se puede organizar el trabajo desde la cuenta del centro.',
  },
  {
    q: '¿Necesito instalar algo?',
    a: 'No. Aula Base funciona en el navegador de tu computadora, tableta o celular con conexión a internet.',
  },
  {
    q: '¿Quién puede ver la información de mis estudiantes?',
    a: 'Cada persona accede según su rol. Un docente ve sus cursos; la dirección y coordinación ven lo que corresponde al centro; estudiantes y tutores solo ven su propia información cuando el centro les da acceso. Los detalles están en la Política de privacidad.',
  },
  {
    q: '¿Cuánto cuesta?',
    a: 'Los importes están en proceso de definición. En la página de precios verás la propuesta de planes y la unidad de cobro. Si representas a un centro, puedes escribirnos para conversar.',
  },
  {
    q: '¿Aula Base sigue el calendario escolar del MINERD?',
    a: 'Puedes configurar el año escolar y sus períodos para que coincidan con el calendario de tu centro.',
  },
]

export const toneClasses: Record<Tone, { soft: string; solid: string; text: string }> = {
  brand: { soft: 'bg-brand-soft', solid: 'bg-brand', text: 'text-primary' },
  success: { soft: 'bg-success-soft', solid: 'bg-success', text: 'text-success' },
  warning: { soft: 'bg-warning-soft', solid: 'bg-warning', text: 'text-warning-foreground' },
  incident: { soft: 'bg-incident-soft', solid: 'bg-incident', text: 'text-incident-foreground' },
  violet: { soft: 'bg-violet-soft', solid: 'bg-violet', text: 'text-violet' },
}
