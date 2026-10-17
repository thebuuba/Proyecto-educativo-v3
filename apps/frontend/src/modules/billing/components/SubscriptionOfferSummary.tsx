import { SUBSCRIPTION_OFFER } from '@aula/shared'
import { dopReferenceNotice, formatOfferAmount } from '@/modules/billing/utils/offer'

/** Condiciones visibles antes de crear una cuenta; registrarse no activa la prueba. */
export function SubscriptionOfferSummary() {
  return (
    <div className="space-y-2 text-sm leading-6">
      <p className="text-2xl font-semibold tracking-tight text-foreground">
        {formatOfferAmount(SUBSCRIPTION_OFFER)} <span className="text-sm font-normal text-muted-foreground">/ mes</span>
      </p>
      <p className="text-muted-foreground">{dopReferenceNotice(SUBSCRIPTION_OFFER)}</p>
      <p className="text-foreground">Primer mes gratis con tarjeta. El cargo es en USD. Después, renovación automática mensual; cancela antes del primer cobro desde Ajustes → Suscripción y pagos.</p>
      <p className="text-muted-foreground">La prueba comienza al completar el checkout con tarjeta, no al crear tu cuenta.</p>
    </div>
  )
}
