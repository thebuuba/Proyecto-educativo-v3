import { ArrowRight, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SUBSCRIPTION_OFFER } from '@aula/shared'
import { Card, CardContent } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/SemanticUI'
import { dopReferenceNotice, formatDopReference, formatOfferAmount } from '@/modules/billing/utils/offer'
import { PromoLayout } from '@/modules/promo/components/PromoLayout'

const teacherFeatures = [
  'Cursos, asignaturas y estudiantes',
  'Horario y asistencia',
  'Actividades e instrumentos de evaluación',
  'Calificaciones por período',
  'Planificación curricular y bitácora',
  'Reportes de tus cursos',
]

export function PricingPage() {
  const amount = formatOfferAmount(SUBSCRIPTION_OFFER)
  return (
    <PromoLayout>
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 sm:pt-16 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Precios</p>
          <h1 className="mt-3 text-[32px] font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
            Un plan para tu día a día en el aula
          </h1>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Organiza tus cursos, prepara tus clases y acompaña a tus estudiantes desde un solo lugar.
          </p>
        </div>
        <Card className="mx-auto mt-10 max-w-sm rounded-[28px] border border-border shadow-sm sm:mt-12">
          <CardContent className="p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-foreground">Docente</h2>
            <p className="mt-2 text-sm text-muted-foreground">Para un docente que organiza sus propios cursos</p>
            <p className="mt-6 text-3xl font-semibold text-foreground">{amount}</p>
            <p className="mt-1 text-xs text-muted-foreground">por docente · facturación mensual</p>
            <p className="mt-2 text-sm text-muted-foreground">≈ {formatDopReference(SUBSCRIPTION_OFFER)} / mes</p>
            <div className="mt-5"><StatusBadge tone="info">Primer mes gratis con tarjeta</StatusBadge></div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Después se renueva automáticamente cada mes. Puedes cancelar antes del primer cobro desde Ajustes.
            </p>
            <Link to="/registro" className="mt-6 flex min-h-12 items-center justify-center gap-2 rounded-full border border-border px-5 text-sm font-semibold text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              Crear cuenta <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <ul className="mt-7 space-y-3 border-t border-border pt-6">
              {teacherFeatures.map((feature) => (
                <li key={feature} className="flex gap-2.5 text-sm leading-relaxed">
                  <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{' '}
          <Link to="/cuenta/suscripcion" className="inline-flex min-h-11 items-center text-primary underline">Gestionar mi suscripción</Link>
        </p>
      </section>
      <section className="mx-auto max-w-2xl px-4 pb-16 sm:px-6" aria-labelledby="payment-questions">
        <h2 id="payment-questions" className="text-xl font-semibold text-foreground">Antes de empezar</h2>
        {[
          ['¿Cuándo empieza el mes gratuito?', 'La prueba de un mes natural comienza al completar el checkout con tarjeta, no al crear tu cuenta. Antes de confirmar verás el importe y la fecha del primer cobro. Su activación depende de que la contratación esté habilitada en tu cuenta.'],
          ['¿En qué moneda se cobra?', `El cargo mensual es de ${amount} en USD. ${dopReferenceNotice(SUBSCRIPTION_OFFER)}`],
          ['¿Cómo cancelo la renovación?', 'Desde Ajustes → Suscripción y pagos. Si cancelas antes del primer cobro, no se inicia el cargo mensual. Puedes consultar allí tu fecha de vencimiento y pedir soporte.'],
        ].map(([question, answer]) => (
          <details key={question} className="border-b border-border py-4">
            <summary className="cursor-pointer rounded-lg py-1 text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{question}</summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{answer}</p>
          </details>
        ))}
        <Link to="/contacto" className="mt-5 inline-flex min-h-11 items-center text-sm text-primary underline">¿Tienes otra duda? Escríbenos</Link>
      </section>
    </PromoLayout>
  )
}
