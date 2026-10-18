import { CreditCard } from 'lucide-react'
import { SemanticIcon } from '@/components/ui/SemanticUI'
import { Button } from '../reference-ui'

function PaymentMethodsCard({ onManage, pending = false }) {
  return (
    <section className="space-y-5 rounded-3xl bg-card p-5 shadow-xs sm:p-6">
      <div className="flex items-center gap-3">
        <SemanticIcon icon={CreditCard} tone="info" />
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Métodos de pago</h2>
      </div>
      <div
        data-testid="payment-card-empty"
        className="rounded-2xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground"
      >
        <p className="font-medium text-foreground">Tus datos de tarjeta están protegidos</p>
        <p className="mt-2">
          Consulta o actualiza tu método de pago en el portal seguro del proveedor.
        </p>
      </div>
      <Button
        variant="outline"
        className="w-full rounded-xl"
        onClick={onManage}
        disabled={!onManage || pending}
      >
        Gestionar método de pago
      </Button>
      {!onManage && (
        <p className="text-xs text-muted-foreground">
          Disponible cuando tengas una suscripción con tarjeta y la gestión de pagos esté
          habilitada.
        </p>
      )}
    </section>
  )
}

export { PaymentMethodsCard }
