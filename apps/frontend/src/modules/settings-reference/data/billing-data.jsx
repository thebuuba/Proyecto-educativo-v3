// Recovered from the user-provided Polymet design; layout and sample data preserved.

var currentSubscription = {
  planId: 'pro',
  planName: 'Plan Pro Estudiante',
  cycle: 'monthly',
  price: 19.99,
  currency: 'EUR',
  startedAt: '12 mar 2024',
  nextBillingDate: '12 jul 2025',
  daysLeft: 18,
  periodDays: 30,
  autoRenew: true,
  status: 'active',
}
var usageStats = [
  { id: 'courses', label: 'Cursos activos', used: 7, total: 10, unit: 'cursos' },
  {
    id: 'certificates',
    label: 'Certificados',
    used: 3,
    total: 5,
    unit: 'este mes',
  },
]
var walletBalance = {
  credits: 45.5,
  pendingRefund: 12,
}
var plans = [
  {
    id: 'basic',
    name: 'Básico',
    description: 'Para empezar a aprender a tu ritmo',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      '3 cursos activos',
      'Acceso a foros de la comunidad',
      'Material descargable limitado',
    ],
  },
  {
    id: 'pro',
    name: 'Pro Estudiante',
    description: 'Todo lo que necesitas para avanzar',
    monthlyPrice: 19.99,
    yearlyPrice: 191.9,
    features: [
      '10 cursos activos',
      '5 certificados oficiales al mes',
      'Tutorías en vivo semanales',
      'Descargas sin conexión',
    ],
    highlighted: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Aprendizaje ilimitado y mentoría',
    monthlyPrice: 34.99,
    yearlyPrice: 335.9,
    features: [
      'Cursos ilimitados',
      'Certificados ilimitados',
      'Mentor personal 1:1',
      'Acceso anticipado a contenidos',
      'Soporte prioritario 24/7',
    ],
  },
]
var paymentMethods = [
  {
    id: 'pm_1',
    brand: 'visa',
    label: 'Visa',
    last4: '4242',
    expiry: '08/27',
    holder: 'Ilham Rodríguez',
    isDefault: true,
  },
  {
    id: 'pm_2',
    brand: 'mastercard',
    label: 'Mastercard',
    last4: '8810',
    expiry: '02/26',
    holder: 'Ilham Rodríguez',
    isDefault: false,
  },
  {
    id: 'pm_3',
    brand: 'paypal',
    label: 'PayPal',
    email: 'ilham@correo.com',
    holder: 'Ilham Rodríguez',
    isDefault: false,
  },
]
var invoices = [
  {
    id: 'inv_1',
    number: 'FAC-2025-0612',
    concept: 'Plan Pro Estudiante · Junio',
    type: 'subscription',
    date: '12 jun 2025',
    amount: 19.99,
    status: 'paid',
    method: 'Visa •• 4242',
  },
  {
    id: 'inv_2',
    number: 'FAC-2025-0598',
    concept: 'Certificado: Python para Data Science',
    type: 'certificate',
    date: '03 jun 2025',
    amount: 29,
    status: 'pending',
    method: 'PayPal',
  },
  {
    id: 'inv_3',
    number: 'FAC-2025-0541',
    concept: 'Curso: Diseño UX desde cero',
    type: 'course',
    date: '21 may 2025',
    amount: 49,
    status: 'failed',
    method: 'Mastercard •• 8810',
  },
  {
    id: 'inv_4',
    number: 'FAC-2025-0512',
    concept: 'Plan Pro Estudiante · Mayo',
    type: 'subscription',
    date: '12 may 2025',
    amount: 19.99,
    status: 'paid',
    method: 'Visa •• 4242',
  },
  {
    id: 'inv_5',
    number: 'REM-2025-0044',
    concept: 'Reembolso: Taller de oratoria',
    type: 'refund',
    date: '02 may 2025',
    amount: 12,
    status: 'refunded',
    method: 'Saldo de la cuenta',
  },
  {
    id: 'inv_6',
    number: 'FAC-2025-0433',
    concept: 'Plan Pro Estudiante · Abril',
    type: 'subscription',
    date: '12 abr 2025',
    amount: 19.99,
    status: 'paid',
    method: 'Visa •• 4242',
  },
]
var activityGroups = [
  {
    id: 'today',
    label: 'Hace 2 horas',
    items: [
      {
        id: 'a1',
        kind: 'payment',
        title: 'Pago recibido',
        description: 'Plan Pro Estudiante · Junio',
        amount: 19.99,
        time: '10:24',
      },
    ],
  },
  {
    id: 'yesterday',
    label: 'Ayer',
    items: [
      {
        id: 'a2',
        kind: 'coupon',
        title: 'Cupón aplicado',
        description: 'VUELTAALCOLE · 15% de descuento',
        time: '18:02',
      },
      {
        id: 'a3',
        kind: 'failed',
        title: 'Pago rechazado',
        description: 'Curso: Diseño UX desde cero',
        amount: 49,
        time: '13:40',
      },
    ],
  },
  {
    id: 'may',
    label: '21 may',
    items: [
      {
        id: 'a4',
        kind: 'upgrade',
        title: 'Mejoraste tu plan',
        description: 'Básico → Pro Estudiante',
        time: '09:15',
      },
      {
        id: 'a5',
        kind: 'refund',
        title: 'Reembolso emitido',
        description: 'Taller de oratoria · a saldo',
        amount: 12,
        time: '08:30',
      },
    ],
  },
  {
    id: 'apr',
    label: '12 abr',
    items: [
      {
        id: 'a6',
        kind: 'renewal',
        title: 'Renovación automática',
        description: 'Plan Pro Estudiante · Abril',
        amount: 19.99,
        time: '00:01',
      },
    ],
  },
]
var formatCurrency = (value, currency = 'EUR') =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency }).format(value)

export {
  currentSubscription,
  usageStats,
  walletBalance,
  plans,
  paymentMethods,
  invoices,
  activityGroups,
  formatCurrency,
}
