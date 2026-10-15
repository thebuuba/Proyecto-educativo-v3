/**
 * Tipos del módulo de Suscripción y pagos.
 *
 * Reflejan el contrato de solo lectura expuesto por `GET /billing` y las
 * operaciones autorizadas. El servidor decide importes, precios y titular;
 * el navegador nunca envía identificadores de cliente o proveedor editables.
 */

/** Cobertura efectiva calculada en el servidor. */
export type BillingAccess = {
  /** Si el titular tiene cobertura vigente. */
  allowed: boolean
  /** Motivo trazable de la cobertura (prueba, pago, gracia, cortesía…). */
  reason: string
  /** Fecha de fin de cobertura, si aplica. */
  until: string | null
}

/** Prueba gratuita única por cuenta. */
export type BillingTrial = {
  startsAt: string
  endsAt: string
}

/** Cortesía concedida por administración comercial. */
export type BillingGrant = {
  id: string
  status?: string
  reason?: string
  startsAt?: string
  endsAt?: string | null
}

/** Pago registrado por el servidor. Importes en unidades menores. */
export type BillingPayment = {
  id: string
  amountMinor: number
  currency: string
  status: string
  createdAt: string
}

/** Solicitud de transferencia local. */
export type BillingTransfer = {
  id: string
  status: string
  reference: string | null
  amountMinor: number
  currency: string
  /** Vencimiento informado por el servidor, si existe. */
  expiresAt?: string | null
  /** Momento en que el titular reportó el comprobante o la referencia. */
  reportedAt?: string | null
  rejectionReason?: string | null
  /** `true` solo si el servidor guardó un comprobante privado para esta solicitud. */
  receiptAvailable?: boolean
}

/** Suscripción automática con el estado original del proveedor. */
export type BillingSubscription = {
  id: string
  providerStatus: string
  currentPeriodEnd: string | null
  cancelAtPeriodEnd: boolean
  /** Modalidad del proveedor: `paddle` (tarjeta) o `manual` (transferencia). */
  mode: string
}

/**
 * Precio autorizado por el servidor.
 *
 * `mode` distingue la modalidad de cobro; la interfaz no debe ofrecer tarjeta
 * para un precio manual ni prometer débito para una transferencia.
 */
export type BillingPrice = {
  id: string
  label: string
  amountMinor: number
  currency: string
  interval: string
  mode: string
}

/** Caso de soporte persistido. */
export type BillingCase = {
  id: string
  number: string
  category: string
  status: string
  createdAt: string
  subject?: string | null
}

/** Mensaje público de un caso de soporte. */
export type BillingSupportMessage = {
  id: string
  body: string
  authorType: string
  createdAt: string
}

/** Respuesta de `GET /billing/support/:id` para el titular o el revisor. */
export type BillingSupportDetail = {
  case: BillingCase
  messages: BillingSupportMessage[]
}

/**
 * Aviso interno persistido por el servidor (`in_app`).
 *
 * No implica un correo enviado: el servidor registra el aviso en su bandeja.
 */
export type BillingNotice = {
  id: string
  template: string
  payload: unknown
  createdAt: string
}

/** Documento emitido y guardado por el servidor. No es un comprobante fiscal. */
export type BillingDocument = {
  id: string
  number: string
  type: string
  amountMinor: number
  currency: string
  issuedAt: string
}

/** Vista completa de `GET /billing`. */
export type BillingOverview = {
  enabled: boolean
  environment: string
  checkoutEnabled: boolean
  eventsEnabled: boolean
  access: BillingAccess
  trial: BillingTrial | null
  grants: BillingGrant[]
  payments: BillingPayment[]
  /** Documentos emitidos por el servidor, si existen. */
  documents: BillingDocument[]
  transfers: BillingTransfer[]
  subscriptions: BillingSubscription[]
  prices: BillingPrice[]
  cases: BillingCase[]
  /** Avisos internos persistidos (`in_app`); no confirman un correo enviado. */
  notices: BillingNotice[]
  commercialAdmin: boolean
  supportEmail: string | null
  bankInstructions: string | null
  /** Versión de condiciones publicada por el servidor, o `null` si no existe. */
  termsVersion: string | null
  /** Reloj del servidor para calcular vencimientos sin depender del equipo. */
  serverNow: string
}

/** Resultado de `POST /billing/checkout` en sandbox. */
export type CheckoutResult = {
  url: string | null
  status: string
}

/** Categorías permitidas para un caso de soporte. */
export type SupportCategory = 'payment' | 'access' | 'other'

/** Datos para `POST /billing/support`. */
export type SupportInput = {
  category: SupportCategory
  subject: string
  message: string
  paymentId?: string
}

/* ------------------------------------------------------------------ *
 * Panel comercial de administración (`GET /billing/admin` y acciones). *
 * ------------------------------------------------------------------ */

/** Titular real que el servidor adjunta a cada registro comercial. */
export type BillingAdminHolder = {
  accountId?: string | null
  userId?: string | null
  email?: string | null
  fullName?: string | null
}

/** Suscripción vista desde administración. */
export type BillingAdminSubscription = BillingAdminHolder & {
  id: string
  status: string
  providerStatus?: string | null
  cancelAtPeriodEnd?: boolean
  currentPeriodEnd?: string | null
}

/** Transferencia pendiente o resuelta vista desde administración. */
export type BillingAdminTransfer = BillingAdminHolder & {
  id: string
  reference?: string | null
  status: string
  amountMinor?: number
  currency?: string
  expiresAt?: string | null
  reportedAt?: string | null
  rejectionReason?: string | null
  /** `true` solo si el servidor guardó un comprobante privado. */
  receiptAvailable?: boolean
}

/** Cortesía vista desde administración. */
export type BillingAdminCourtesy = BillingAdminHolder & {
  id: string
  planId?: string | null
  status: string
  startsAt?: string | null
  endsAt?: string | null
  reason?: string | null
  revokedAt?: string | null
  revocationReason?: string | null
}

/** Caso de soporte visto desde administración. */
export type BillingAdminCase = BillingAdminHolder & {
  id: string
  number: string
  category: string
  status: string
  subject?: string
  createdAt: string
}

/** Evento del proveedor que requiere reintento. */
export type BillingFailedEvent = {
  id: string
  provider?: string | null
  eventType?: string | null
  attempts?: number
  lastError?: string | null
  receivedAt?: string | null
}

/** Registro de auditoría comercial. */
export type BillingAuditEntry = {
  id: string
  action: string
  entityType?: string | null
  actorType?: string | null
  entityId?: string | null
  accountId?: string | null
  createdAt: string
}

/**
 * Fila de ingresos por moneda (solo pagos confirmados).
 *
 * Cada valor es el que publica el servidor o `null` si no lo informó: nunca se
 * sustituye por cero, para no simular ingresos inexistentes.
 */
export type BillingAdminCurrencyMetric = {
  currency: string
  grossMinor: number | null
  refundedMinor: number | null
  netMinor: number | null
  count: number | null
}

/** Métricas reales publicadas por el servidor. */
export type BillingAdminMetrics = {
  byCurrency: BillingAdminCurrencyMetric[]
}

/** Conteo de cuentas por situación, o `null` si el servidor no lo informa. */
export type BillingAdminCounts = {
  paidAccounts: number | null
  trialAccounts: number | null
  courtesyAccounts: number | null
}

/** Respuesta de `GET /billing/admin?q=&page=`. */
export type BillingAdminOverview = {
  page: number
  pageSize: number
  subscriptions: BillingAdminSubscription[]
  transfers: BillingAdminTransfer[]
  courtesies: BillingAdminCourtesy[]
  cases: BillingAdminCase[]
  failedEvents: BillingFailedEvent[]
  audit: BillingAuditEntry[]
  /** `null` cuando el servidor no publicó métricas; no equivale a cero. */
  metrics: BillingAdminMetrics | null
  /** `null` cuando el servidor no publicó conteos. */
  counts: BillingAdminCounts | null
}

/** Respuesta de `GET /billing/admin/catalog`. */
export type BillingAdminCatalog = {
  plans: { id: string; name: string }[]
  configuration: Record<string, unknown>
}

/** Datos para `POST /billing/admin/courtesies`. */
export type CreateCourtesyInput = {
  userId: string
  planId: string
  startsAt: string
  endsAt?: string
  reason: string
  acknowledgeActiveRenewal: boolean
}

/** Datos para `POST /billing/admin/transfers/:id/approve`. */
export type ApproveTransferInput = {
  bankMovementId: string
  amountMinor: number
  currency: string
  receivedAt: string
  reason: string
}

/** Estado administrativo de un caso de soporte. */
export type SupportStatus = 'open' | 'in_progress' | 'resolved'

/** Datos para `POST /billing/admin/support/:id`. */
export type UpdateSupportInput = {
  status: SupportStatus
  reason: string
}
