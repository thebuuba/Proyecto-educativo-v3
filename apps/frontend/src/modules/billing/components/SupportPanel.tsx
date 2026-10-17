/**
 * Formulario de soporte de Suscripción y pagos.
 *
 * Persiste un caso con número en el servidor. Solo muestra el número cuando
 * la respuesta confirma el registro, y recuerda no enviar datos sensibles.
 */

import { LifeBuoy, Send } from 'lucide-react'
import { useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { FeedbackBanner, SemanticIcon } from '@/components/ui/SemanticUI'
import { Textarea } from '@/components/ui/Textarea'
import { createSupportCase } from '@/modules/billing/services/billingService'
import type { BillingCase, BillingPayment, SupportCategory } from '@/modules/billing/types'
import { billingErrorMessage, formatAmount } from '@/modules/billing/utils/billingFormat'

const categoryLabels: Record<SupportCategory, string> = {
  payment: 'Pago o transferencia',
  access: 'Acceso o cobertura',
  other: 'Otro tema',
}

type SupportPanelProps = {
  /** Correo de contacto publicado por el servidor, si existe. */
  supportEmail: string | null
  payments: BillingPayment[]
  /** Indica si las operaciones comerciales están habilitadas. */
  moduleEnabled: boolean
}

export function SupportPanel({ supportEmail, payments, moduleEnabled }: SupportPanelProps) {
  const [category, setCategory] = useState<SupportCategory>('payment')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [paymentId, setPaymentId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdCase, setCreatedCase] = useState<BillingCase | null>(null)

  const canSubmit = subject.trim().length > 0 && message.trim().length > 0 && !submitting

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    setError(null)
    setCreatedCase(null)
    try {
      const created = await createSupportCase({
        category,
        subject: subject.trim(),
        message: message.trim(),
        ...(paymentId ? { paymentId } : {}),
      })
      setCreatedCase(created)
      setSubject('')
      setMessage('')
    } catch (err) {
      setError(billingErrorMessage(err, 'No se pudo registrar tu solicitud de soporte.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <SemanticIcon icon={LifeBuoy} tone="info" />
          <div>
            <CardTitle>Soporte</CardTitle>
            <CardDescription>
              Cuéntanos qué ocurre con tu pago o tu acceso. Registramos un caso con número de
              seguimiento.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {supportEmail ? (
          <p className="text-sm text-muted-foreground">
            Canal de soporte:{' '}
            <a className="font-semibold text-primary underline-offset-4 hover:underline" href={`mailto:${supportEmail}`}>
              {supportEmail}
            </a>
          </p>
        ) : null}

        {moduleEnabled ? (
          <>
            <FeedbackBanner tone="warning">
              Por tu seguridad, no incluyas números completos de tarjeta, CVV, contraseñas ni datos de
              estudiantes en este mensaje.
            </FeedbackBanner>

            {!supportEmail ? (
              <p className="text-sm text-muted-foreground">
                Puedes registrar tu caso aquí; el servidor aún no publica un canal de correo.
              </p>
            ) : null}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground" htmlFor="billing-support-category">
                Categoría
              </label>
              <Select
                id="billing-support-category"
                aria-label="Categoría de soporte"
                value={category}
                disabled={submitting}
                onChange={(event) => setCategory(event.target.value as SupportCategory)}
              >
                {(Object.keys(categoryLabels) as SupportCategory[]).map((value) => (
                  <option key={value} value={value}>
                    {categoryLabels[value]}
                  </option>
                ))}
              </Select>
            </div>

            {payments.length > 0 ? (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground" htmlFor="billing-support-payment">
                  Pago relacionado (opcional)
                </label>
                <Select
                  id="billing-support-payment"
                  aria-label="Pago relacionado"
                  value={paymentId}
                  disabled={submitting}
                  onChange={(event) => setPaymentId(event.target.value)}
                >
                  <option value="">Ninguno</option>
                  {payments.map((payment) => (
                    <option key={payment.id} value={payment.id}>
                      {formatAmount(payment.amountMinor, payment.currency)} · {payment.status}
                    </option>
                  ))}
                </Select>
              </div>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground" htmlFor="billing-support-subject">
              Asunto
            </label>
            <Input
              id="billing-support-subject"
              aria-label="Asunto"
              maxLength={120}
              value={subject}
              disabled={submitting}
              onChange={(event) => setSubject(event.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground" htmlFor="billing-support-message">
              Mensaje
            </label>
            <Textarea
              id="billing-support-message"
              aria-label="Mensaje"
              maxLength={2000}
              value={message}
              disabled={submitting}
              onChange={(event) => setMessage(event.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" loading={submitting} disabled={!canSubmit}>
              <Send className="size-4" aria-hidden="true" />
              Enviar solicitud de soporte
            </Button>
            <span className="text-xs text-muted-foreground">
              Puedes solicitar soporte aunque tu cobertura esté vencida o la contratación no esté
              disponible.
            </span>
          </div>
            </form>
          </>
        ) : (
          <FeedbackBanner tone="neutral">
            {supportEmail
              ? 'El registro y seguimiento de casos está desactivado por ahora; no se generará un número de caso. Puedes escribir al canal de correo indicado arriba, pero no habrá seguimiento en la aplicación.'
              : 'El canal de soporte aún no está configurado. Vuelve a intentarlo más tarde.'}
          </FeedbackBanner>
        )}

        {error ? (
          <FeedbackBanner tone="danger" role="alert">
            {error}
          </FeedbackBanner>
        ) : null}

        {createdCase ? (
          <FeedbackBanner tone="success" role="status">
            Recibimos tu solicitud. Número de caso: <span className="font-extrabold">{createdCase.number}</span>.
            Guarda este número para dar seguimiento.
          </FeedbackBanner>
        ) : null}
      </CardContent>
    </Card>
  )
}
