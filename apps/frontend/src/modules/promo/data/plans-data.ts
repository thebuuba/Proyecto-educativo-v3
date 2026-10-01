/**
 * Tabla de planes editable (propuesta comercial).
 *
 * - `price: null` => se muestra "Importe por definir".
 * - Límites con `value: null` => "Por definir".
 * - `featureMatrix`: `true`, `false` o un texto corto.
 * - La distribución de funciones por plan es una PROPUESTA: mientras
 *   `commerce.planAccessConfirmed` sea `false`, la interfaz lo indica.
 */

export type BillingPeriod = 'mensual' | 'anual'

export interface PlanPrice {
  mensual: number | null
  anual: number | null
}

export interface PlanLimit {
  label: string
  value: string | null
}

export interface Plan {
  id: 'docente' | 'centro' | 'institucional'
  name: string
  audience: string
  description: string
  /** Unidad de cobro, p. ej. "por docente" o "por centro". */
  unit: string
  price: PlanPrice
  limits: PlanLimit[]
  highlights: string[]
  /** "checkout" lleva a /contratar; "contact" lleva a /contacto. */
  purchase: 'checkout' | 'contact'
  featured?: boolean
}

/** Interruptores comerciales. Cambiar solo cuando estén validados. */
export const commerce = {
  /** El cobro real está activo (proveedor de pago integrado). */
  checkoutEnabled: false,
  /** La restricción de funciones por plan está implementada en la aplicación. */
  planAccessConfirmed: false,
  /** La renovación y cancelación de suscripciones están operativas. */
  subscriptionsOperational: false,
}

export const pricingTerms = {
  currency: { code: 'DOP', label: 'Pesos dominicanos (RD$)', confirmed: false },
  taxes: {
    label: 'ITBIS',
    rate: 0.18,
    /** Define si los importes publicados incluyen el ITBIS. */
    included: null as boolean | null,
  },
  periods: ['mensual', 'anual'] as BillingPeriod[],
  /** Textos definitivos. Dejar en null hasta que estén aprobados. */
  annualNote: null as string | null,
  renewal: null as string | null,
  cancellation: null as string | null,
  refunds: null as string | null,
  invoicing: null as string | null,
}

export const plans: Plan[] = [
  {
    id: 'docente',
    name: 'Docente',
    audience: 'Para un docente que organiza sus propios cursos',
    description:
      'Horario, asistencia, evaluaciones, calificaciones, planificación y bitácora de tus cursos.',
    unit: 'por docente',
    price: { mensual: null, anual: null },
    limits: [
      { label: 'Docentes', value: '1' },
      { label: 'Cursos activos', value: null },
      { label: 'Estudiantes', value: null },
      { label: 'Almacenamiento', value: null },
    ],
    highlights: [
      'Cursos, asignaturas y estudiantes',
      'Horario y asistencia',
      'Actividades e instrumentos de evaluación',
      'Calificaciones por período',
      'Planificación curricular y bitácora',
      'Reportes de tus cursos',
    ],
    purchase: 'checkout',
  },
  {
    id: 'centro',
    name: 'Centro',
    audience: 'Para directores y coordinadores de un centro',
    description:
      'Los módulos del plan Docente, más administración escolar y perfiles según rol para el equipo del centro.',
    unit: 'por centro',
    price: { mensual: null, anual: null },
    limits: [
      { label: 'Docentes', value: null },
      { label: 'Estudiantes', value: null },
      { label: 'Años escolares', value: null },
      { label: 'Almacenamiento', value: null },
    ],
    highlights: [
      'Módulos del plan Docente',
      'Administración escolar y matrículas',
      'Perfiles de director, coordinador y administrador',
      'Perfiles de estudiante y tutor',
      'Reportes del centro',
    ],
    purchase: 'checkout',
    featured: true,
  },
  {
    id: 'institucional',
    name: 'Institucional',
    audience: 'Para necesidades que no encajan en los planes anteriores',
    description: 'Conversemos sobre tu caso antes de preparar una propuesta.',
    unit: 'según propuesta',
    price: { mensual: null, anual: null },
    limits: [
      { label: 'Docentes', value: null },
      { label: 'Estudiantes', value: null },
      { label: 'Almacenamiento', value: null },
    ],
    highlights: ['Módulos del plan Centro', 'Condiciones según propuesta'],
    purchase: 'contact',
  },
]

export interface FeatureRow {
  group: string
  feature: string
  included: Record<Plan['id'], boolean | string>
}

export const featureMatrix: FeatureRow[] = [
  {
    group: 'Organización',
    feature: 'Escuela y año escolar',
    included: { docente: true, centro: true, institucional: true },
  },
  {
    group: 'Organización',
    feature: 'Cursos y asignaturas',
    included: { docente: true, centro: true, institucional: true },
  },
  {
    group: 'Organización',
    feature: 'Estudiantes y matrículas',
    included: { docente: 'Propios', centro: true, institucional: true },
  },
  {
    group: 'Organización',
    feature: 'Horario',
    included: { docente: true, centro: true, institucional: true },
  },
  {
    group: 'Trabajo en el aula',
    feature: 'Asistencia',
    included: { docente: true, centro: true, institucional: true },
  },
  {
    group: 'Trabajo en el aula',
    feature: 'Actividades e instrumentos de evaluación',
    included: { docente: true, centro: true, institucional: true },
  },
  {
    group: 'Trabajo en el aula',
    feature: 'Calificaciones',
    included: { docente: true, centro: true, institucional: true },
  },
  {
    group: 'Trabajo en el aula',
    feature: 'Planificación curricular',
    included: { docente: true, centro: true, institucional: true },
  },
  {
    group: 'Trabajo en el aula',
    feature: 'Bitácora docente',
    included: { docente: true, centro: true, institucional: true },
  },
  {
    group: 'Seguimiento',
    feature: 'Reportes',
    included: { docente: 'De tus cursos', centro: 'Del centro', institucional: 'Del centro' },
  },
  {
    group: 'Centro',
    feature: 'Administración escolar',
    included: { docente: false, centro: true, institucional: true },
  },
  {
    group: 'Centro',
    feature: 'Perfiles según rol',
    included: { docente: false, centro: true, institucional: true },
  },
]

export function formatPrice(amount: number | null): string | null {
  if (amount == null) return null
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: pricingTerms.currency.code,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function getPlan(id: string | null | undefined): Plan | undefined {
  return plans.find((p) => p.id === id)
}

export function periodLabel(p: BillingPeriod): string {
  return p === 'mensual' ? 'Mensual' : 'Anual'
}
