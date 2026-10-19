/**
 * Contenido de la portada pública reconstruida desde el diseño aprobado de
 * Polymet para Aula Base.
 *
 * El precio, el período y la referencia DOP se derivan de la oferta aprobada
 * (`SUBSCRIPTION_OFFER`): no se mantiene una segunda fuente de verdad.
 *
 * Los nombres de estudiantes y de clases son ilustrativos; no son datos reales
 * de personas usuarias.
 */

import { SUBSCRIPTION_OFFER } from '@aula/shared'
import {
  dopReferenceNotice,
  formatOfferAmount,
  offerPeriodLabel,
} from '@/modules/billing/utils/offer'

/** Destino real del alta de cuenta. */
export const APP_URL = '/registro'
/** Destino real del inicio de sesión. */
export const LOGIN_URL = '/login'
export const REPO_URL = 'https://github.com/thebuuba/Proyecto-educativo-v3'

/** Aviso comercial vigente de la rama: crear la cuenta no inicia la prueba. */
export const TRIAL_START_NOTICE =
  'La prueba comienza al completar el checkout con tarjeta, no al crear tu cuenta.'

/** Los anclajes internos se resuelven desde la raíz para poder reutilizarse. */
export const navLinks = [
  { label: 'Funciones', href: '/#funciones' },
  { label: 'Módulos', href: '/#modulos' },
  { label: 'Cómo empezar', href: '/#como-funciona' },
  { label: 'Precio', href: '/#precio' },
  { label: 'Preguntas', href: '/#preguntas' },
]

/** Precio aprobado formateado (p. ej. `US$7.99`). */
const price = formatOfferAmount(SUBSCRIPTION_OFFER)
/** Período de renovación aprobado (p. ej. `mes`). */
const period = offerPeriodLabel(SUBSCRIPTION_OFFER)

export const plan = {
  name: 'Docente Completo',
  price,
  period,
  trial: '1 mes gratis',
  audience: 'Plan individual para cada docente',
  conditions: [
    'Se requiere tarjeta para iniciar el mes gratuito.',
    'Renovación automática mensual; puedes cancelar cuando quieras.',
    'Si cancelas, conservas la cobertura que ya pagaste.',
    TRIAL_START_NOTICE,
    dopReferenceNotice(SUBSCRIPTION_OFFER),
  ],
}

/** Módulos funcionales presentes en `apps/backend/src/modules`. */
export const platformModules = [
  'Estudiantes',
  'Cursos',
  'Asignaturas',
  'Asistencia',
  'Calificaciones',
  'Instrumentos de evaluación',
  'Actividades',
  'Planificación',
  'Horario',
  'Diario',
  'Recursos',
  'Reportes',
  'Panel',
  'Perfil',
  'Administración escolar',
]

export const valuePoints = [
  {
    title: 'Todo en una sola plataforma',
    description:
      'Estudiantes, asistencia, calificaciones, planificación, horario y reportes sin saltar entre hojas de cálculo y cuadernos.',
  },
  {
    title: 'Tu información, protegida',
    description:
      'Entra con tu cuenta para consultar y gestionar la información de tus cursos y estudiantes.',
  },
  {
    title: 'Conserva tu trabajo',
    description:
      'Si cancelas el plan, tus registros académicos no se borran automáticamente.',
  },
]

export type StudentRow = {
  id: string
  name: string
  section: string
  average: string
  status: 'Al día' | 'Pendiente' | 'En riesgo'
}

export const studentRows: StudentRow[] = [
  { id: 's1', name: 'María Fernández', section: '3ro A', average: '92', status: 'Al día' },
  { id: 's2', name: 'Luis Martínez', section: '3ro A', average: '78', status: 'Pendiente' },
  { id: 's3', name: 'Ana Rodríguez', section: '4to B', average: '88', status: 'Al día' },
  { id: 's4', name: 'Carlos Peña', section: '5to A', average: '64', status: 'En riesgo' },
]

export type FeatureHighlight = {
  id: string
  title: string
  description: string
  kind: 'grades' | 'instruments' | 'attendance'
}

export const featureHighlights: FeatureHighlight[] = [
  {
    id: 'f1',
    title: 'Calificaciones',
    description:
      'Registra las calificaciones de tus estudiantes por curso y asignatura, y tenlas siempre a mano.',
    kind: 'grades',
  },
  {
    id: 'f2',
    title: 'Instrumentos de evaluación',
    description:
      'Crea y reutiliza tus instrumentos de evaluación. Consulta las versiones anteriores para saber con qué evaluaste.',
    kind: 'instruments',
  },
  {
    id: 'f3',
    title: 'Asistencia',
    description:
      'Lleva el registro de asistencia de cada curso desde el navegador, sin listas en papel.',
    kind: 'attendance',
  },
]

export type ModuleTab = {
  id: string
  label: string
  title: string
  description: string
  bullets: string[]
  column: string
  values: string[]
}

export const moduleTabs: ModuleTab[] = [
  {
    id: 'estudiantes',
    label: 'Estudiantes y cursos',
    title: 'Tus cursos, asignaturas y estudiantes, organizados',
    description:
      'Crea tus cursos, asocia tus asignaturas y mantén la lista de estudiantes de cada uno en un solo lugar.',
    bullets: ['Cursos', 'Asignaturas', 'Estudiantes por curso'],
    column: 'Curso',
    values: ['3ro A', '3ro A', '4to B', '5to A'],
  },
  {
    id: 'planificacion',
    label: 'Planificación',
    title: 'Planifica tus clases y actividades',
    description:
      'Organiza tu planificación y las actividades de cada curso dentro de la misma herramienta donde evalúas.',
    bullets: ['Planificación docente', 'Actividades', 'Vinculada a tus cursos'],
    column: 'Actividad',
    values: ['Entregada', 'Pendiente', 'Entregada', 'Pendiente'],
  },
  {
    id: 'horario',
    label: 'Horario',
    title: 'Tu horario de clases, siempre visible',
    description:
      'Consulta qué curso y asignatura te toca en cada momento de la semana.',
    bullets: ['Horario semanal', 'Por curso y asignatura', 'Accesible desde el panel'],
    column: 'Bloque',
    values: ['Lun 8:00', 'Mar 10:00', 'Mié 8:00', 'Jue 11:00'],
  },
  {
    id: 'diario',
    label: 'Diario y recursos',
    title: 'Tu diario docente y tus recursos',
    description:
      'Lleva el diario de tu trabajo en clase y guarda los recursos que usas con tus estudiantes.',
    bullets: ['Diario', 'Recursos', 'Todo junto a tus cursos'],
    column: 'Registro',
    values: ['Hoy', 'Ayer', 'Lun', 'Vie'],
  },
  {
    id: 'reportes',
    label: 'Reportes',
    title: 'Reportes a partir de tu propio registro',
    description:
      'Consulta reportes construidos con la información que ya registras de asistencia y calificaciones.',
    bullets: ['Reportes', 'Panel de resumen', 'Basados en tus datos'],
    column: 'Promedio',
    values: ['92', '78', '88', '64'],
  },
]

export const steps = [
  {
    step: '01',
    title: 'Crea tu cuenta',
    description: 'Regístrate y verifica tu correo electrónico.',
  },
  {
    step: '02',
    title: 'Prepara tus cursos',
    description: 'Configura tu perfil, tu centro, tus cursos y tus asignaturas.',
  },
  {
    step: '03',
    title: 'Empieza a trabajar',
    description: 'Registra asistencia, calificaciones, planificación y más desde tu panel.',
  },
]

export type FaqItem = { q: string; a: string }

export const faqs: FaqItem[] = [
  {
    q: '¿Cuánto cuesta Aula Base?',
    a: `El plan Docente Completo cuesta ${price} al mes e incluye todas las funciones docentes. El primer mes es gratis.`,
  },
  {
    q: '¿Necesito tarjeta para el mes gratis?',
    a: 'Sí. La prueba gratuita requiere registrar una tarjeta y se renueva automáticamente al terminar el mes. Puedes cancelar en cualquier momento antes de la renovación.',
  },
  {
    q: '¿El plan es por centro o por docente?',
    a: 'Es un plan individual: cada docente tiene su propia suscripción, aunque trabaje en el mismo centro que otros docentes.',
  },
  {
    q: '¿Qué pasa con mis datos si cancelo?',
    a: 'Conservas la cobertura que ya pagaste. Además, la falta de pago no borra automáticamente tus datos académicos ni cambia tus roles en el centro.',
  },
  {
    q: '¿Necesito instalar algo?',
    a: 'No. Aula Base es una aplicación web: entras desde el navegador con tu cuenta.',
  },
]

export type FooterLink = { label: string; href: string }
export type FooterColumn = { title: string; links: FooterLink[] }

export const footerColumns: FooterColumn[] = [
  {
    title: 'Producto',
    links: [
      { label: 'Funciones', href: '/#funciones' },
      { label: 'Módulos', href: '/#modulos' },
      { label: 'Precio', href: '/#precio' },
    ],
  },
  {
    title: 'Recursos',
    links: [
      { label: 'Cómo empezar', href: '/#como-funciona' },
      { label: 'Preguntas frecuentes', href: '/#preguntas' },
      { label: 'Código fuente', href: REPO_URL },
    ],
  },
  {
    title: 'Cuenta',
    links: [
      { label: 'Iniciar sesión', href: LOGIN_URL },
      { label: 'Crear cuenta', href: APP_URL },
    ],
  },
]

/** Enlaces legales y de contacto en un renglón pequeño del pie. */
export const legalLinks: FooterLink[] = [
  { label: 'Términos y condiciones', href: '/terminos' },
  { label: 'Política de privacidad', href: '/privacidad' },
  { label: 'Contacto', href: '/contacto' },
]
