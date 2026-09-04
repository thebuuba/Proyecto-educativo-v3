import type { FormEvent } from 'react'
import { useState } from 'react'
import { Mail, MapPin, MessageSquare, Phone, Send } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { PromoLayout } from '@/modules/promo/components/PromoLayout'

export function ContactPage() {
  const [sent, setSent] = useState(false)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSent(true)
  }

  return (
    <PromoLayout>
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-8 lg:px-14">
        <div className="mb-12 text-center">
          <span className="mb-4 inline-flex rounded-full bg-warning/22 px-3 py-1.5 text-[11px] font-extrabold text-foreground">Estamos para ayudarte</span>
          <h1 className="text-[clamp(2rem,6vw,2.5rem)] font-extrabold leading-tight text-foreground">Contáctanos</h1>
          <p className="mt-2 text-[15px] text-muted-foreground">Escríbenos y te responderemos a la brevedad.</p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-6">
            {[
              { icon: Mail, label: 'Correo', value: 'hola@aulabase.com', href: 'mailto:hola@aulabase.com', tone: 'info' },
              { icon: Phone, label: 'Teléfono', value: '+1 (809) 555-0123', href: 'tel:+18095550123', tone: 'success' },
              { icon: MapPin, label: 'Ubicación', value: 'Santo Domingo, República Dominicana', tone: 'warning' },
              { icon: MessageSquare, label: 'Soporte', value: 'Soporte prioritario en plan Pro', href: '/registro', tone: 'danger' },
            ].map((item) => {
              const Icon = item.icon
              const Wrapper = item.href ? 'a' : 'div'
              return (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl text-foreground" style={{ background: toneBackground(item.tone) }}><Icon size={18} /></div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    <Wrapper {...(item.href ? { href: item.href, className: 'text-sm text-muted-foreground transition hover:text-foreground' } : { className: 'text-sm text-muted-foreground' })}>{item.value}</Wrapper>
                  </div>
                </div>
              )
            })}
          </div>

          {sent ? (
            <div className="dashboard-warm-shadow flex flex-col items-center justify-center rounded-3xl bg-card p-10 text-center">
              <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-success/18 text-foreground"><Send size={24} /></div>
              <h3 className="mb-1 text-lg font-bold text-foreground">Mensaje enviado</h3>
              <p className="text-sm text-muted-foreground">Gracias por escribirnos. Te responderemos en menos de 24 horas.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="dashboard-warm-shadow space-y-4 rounded-3xl bg-card p-6 sm:p-8">
              <Field label="Nombre completo"><input id="name" required className="auth-input" placeholder="Tu nombre" /></Field>
              <Field label="Correo electrónico"><input id="email" type="email" required className="auth-input" placeholder="correo@ejemplo.com" /></Field>
              <Field label="Mensaje"><textarea id="message" required rows={4} className="auth-input resize-y" placeholder="¿En qué podemos ayudarte?" /></Field>
              <Button type="submit" variant="primary" className="w-full">Enviar mensaje <Send size={14} /></Button>
            </form>
          )}
        </div>
      </div>
    </PromoLayout>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-sm font-semibold text-foreground">{label}</span>{children}</label>
}

function toneBackground(tone: string) {
  if (tone === 'success') return 'color-mix(in srgb, var(--success) 18%, var(--card))'
  if (tone === 'warning') return 'color-mix(in srgb, var(--warning) 24%, var(--card))'
  if (tone === 'danger') return 'color-mix(in srgb, var(--destructive) 16%, var(--card))'
  return 'color-mix(in srgb, var(--primary) 14%, var(--card))'
}
