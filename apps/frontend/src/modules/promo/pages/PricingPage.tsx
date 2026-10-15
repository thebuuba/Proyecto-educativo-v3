import { ArrowRight, Check, CreditCard } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SUBSCRIPTION_OFFER } from '@aula/shared'
import { Card, CardContent } from '@/components/ui/Card'
import { FeedbackBanner, SemanticIcon, StatusBadge } from '@/components/ui/SemanticUI'
import { PromoLayout } from '@/modules/promo/components/PromoLayout'
import {
  dopReferenceNotice,
  formatOfferAmount,
  offerPeriodLabel,
} from '@/modules/billing/utils/offer'

export function PricingPage() {
  const amount = formatOfferAmount(SUBSCRIPTION_OFFER)
  const period = offerPeriodLabel(SUBSCRIPTION_OFFER)
  return (
    <PromoLayout>
      <section className="mx-auto max-w-3xl space-y-6 px-4 py-12 sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Suscripción individual</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">Tu trabajo docente en AulaBase</h1>
          <p className="mt-3 text-muted-foreground">Una cuenta comercial por docente. Tus permisos escolares siguen dependiendo de tu rol.</p>
        </div>
        <Card><CardContent className="space-y-5">
          <div className="flex items-start gap-3">
            <SemanticIcon icon={CreditCard} tone="info" />
            <div><h2 className="text-2xl font-semibold text-foreground">Docente Completo</h2><p className="mt-1 text-sm text-muted-foreground">Periodicidad mensual</p></div>
          </div>
          <StatusBadge tone="info">{amount} / {period}</StatusBadge>
          <p className="text-sm leading-6 text-foreground">
            Primer mes gratis con tarjeta. Después, {amount} cada {period} con renovación automática;
            puedes cancelar antes del primer cobro.
          </p>
          <ul className="space-y-3 text-sm">
            {['Funciones docentes existentes según tu rol.', 'Titularidad individual, vinculada a tu cuenta.', 'Historial de pagos, cobertura y soporte desde Configuración.'].map(text => (
              <li key={text} className="flex gap-2"><Check className="size-4 shrink-0 text-success" aria-hidden="true" />{text}</li>
            ))}
          </ul>
          <Link to="/cuenta/suscripcion" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            Gestionar mi suscripción <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </CardContent></Card>
        <FeedbackBanner tone="info">
          El primer mes es gratuito y requiere tarjeta. La fecha exacta del primer cobro la confirma
          Paddle al crear la suscripción; no se cobra hoy.
        </FeedbackBanner>
        <div className="space-y-3 text-sm leading-6 text-muted-foreground">
          <p>{dopReferenceNotice(SUBSCRIPTION_OFFER)}</p>
          <p>Una transferencia requiere revisión del ingreso bancario por administración comercial; subir un comprobante no activa el plan. La transferencia no autoriza débitos mensuales ni sustituye la prueba con tarjeta.</p>
          <p>Las cortesías administrativas se registran por separado y no son pagos. Soporte permanece disponible para cuentas con cobertura vencida.</p>
          <Link to="/contacto" className="inline-flex min-h-11 items-center text-primary underline">Contactar con AulaBase</Link>
        </div>
      </section>
    </PromoLayout>
  )
}
