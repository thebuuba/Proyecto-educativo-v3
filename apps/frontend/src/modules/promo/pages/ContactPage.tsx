import type { FormEvent } from 'react'
import { useState } from 'react'
import { Mail, MapPin, MessageSquare, Phone, Send } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { PromoLayout } from '@/modules/promo/components/PromoLayout'

export function ContactPage() {
  const [sent, setSent] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <PromoLayout>
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-8 lg:px-14">
        <h1 className="mb-2 text-center text-[clamp(2rem,6vw,2.5rem)] font-extrabold leading-tight text-[#0D1117]">
          Contáctanos
        </h1>
        <p className="mb-12 text-center text-[15px] text-[#6B7280]">
          Estamos aquí para ayudarte. Escríbenos y te responderemos a la brevedad.
        </p>

        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-6">
            {[
              { icon: Mail, label: 'Correo', value: 'hola@aulabase.com', href: 'mailto:hola@aulabase.com' },
              { icon: Phone, label: 'Teléfono', value: '+1 (809) 555-0123', href: 'tel:+18095550123' },
              { icon: MapPin, label: 'Ubicación', value: 'Santo Domingo, República Dominicana' },
              { icon: MessageSquare, label: 'Soporte', value: 'Soporte prioritario en plan Pro', href: '/registro' },
            ].map((item) => {
              const Icon = item.icon
              const Wrapper = item.href ? 'a' : 'div'
              return (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#111827]">{item.label}</p>
                    <Wrapper
                      {...(item.href ? { href: item.href, className: 'text-sm text-[#6B7280] transition hover:text-primary', ...(item.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {}) } : { className: 'text-sm text-[#6B7280]' })}
                    >
                      {item.value}
                    </Wrapper>
                  </div>
                </div>
              )
            })}
          </div>

          {sent ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E5E7EB] bg-white p-10 text-center">
              <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-success/10 text-success">
                <Send size={24} />
              </div>
              <h3 className="mb-1 text-lg font-bold text-[#111827]">Mensaje enviado</h3>
              <p className="text-sm text-[#6B7280]">Gracias por escribirnos. Te responderemos en menos de 24 horas.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-[#374151]">Nombre completo</label>
                <input
                  id="name"
                  required
                  className="w-full rounded-xl border border-[#D1D5DB] px-4 py-2.5 text-sm text-[#111827] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-[#374151]">Correo electrónico</label>
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full rounded-xl border border-[#D1D5DB] px-4 py-2.5 text-sm text-[#111827] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="correo@ejemplo.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-[#374151]">Mensaje</label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  className="w-full resize-y rounded-xl border border-[#D1D5DB] px-4 py-2.5 text-sm text-[#111827] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="¿En qué podemos ayudarte?"
                />
              </div>
              <Button type="submit" variant="primary" className="w-full">
                Enviar mensaje <Send size={14} />
              </Button>
            </form>
          )}
        </div>
      </div>
    </PromoLayout>
  )
}
