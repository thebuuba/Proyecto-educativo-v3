import { ArrowRight, Check, CreditCard } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SubscriptionOfferSummary } from '@/modules/billing/components/SubscriptionOfferSummary'
import { Card, CardContent } from '@/components/ui/Card'
import { FeedbackBanner, SemanticIcon } from '@/components/ui/SemanticUI'
import { PromoLayout } from '@/modules/promo/components/PromoLayout'

export function PricingPage() {
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
          <SubscriptionOfferSummary />
          <ul className="space-y-3 text-sm">
            {['Cursos, asistencia y calificaciones.', 'Actividades e instrumentos de evaluación.', 'Planificación, bitácora y reportes según tu rol.', 'Suscripción, cancelación, pagos y soporte desde Ajustes.'].map(text => (
              <li key={text} className="flex gap-2"><Check className="size-4 shrink-0 text-success" aria-hidden="true" />{text}</li>
            ))}
          </ul>
          <Link to="/registro" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            Crear cuenta para continuar <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <p className="text-sm text-muted-foreground">¿Ya tienes cuenta? <Link to="/cuenta/suscripcion" className="inline-flex min-h-11 items-center text-primary underline">Gestionar mi suscripción</Link></p>
        </CardContent></Card>
        <FeedbackBanner tone="info">
          El primer mes es gratuito y requiere tarjeta. La fecha exacta del primer cobro la confirma
          Paddle antes de confirmar el checkout. Crear una cuenta no activa la prueba ni autoriza cargos.
        </FeedbackBanner>
        <div className="space-y-3 text-sm leading-6 text-muted-foreground">
          <p>Una transferencia requiere revisión del ingreso bancario por administración comercial; subir un comprobante no activa el plan. La transferencia no autoriza débitos mensuales ni sustituye la prueba con tarjeta.</p>
          <p>Las cortesías administrativas se registran por separado y no son pagos. Soporte permanece disponible para cuentas con cobertura vencida.</p>
          <Link to="/contacto" className="inline-flex min-h-11 items-center text-primary underline">Contactar con AulaBase</Link>
        </div>
      </section>
    </PromoLayout>
  )
}
