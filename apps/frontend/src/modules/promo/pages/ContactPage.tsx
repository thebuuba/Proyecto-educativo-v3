import { Mail, MessageCircle, Send } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { PromoLayout } from '@/modules/promo/components/PromoLayout'

export function ContactPage() {
  const [draft, setDraft] = useState('')
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    setDraft(
      `Nombre: ${fields.get('name')}\nCorreo: ${fields.get('email')}\n\n${fields.get('message')}`,
    )
  }
  return (
    <PromoLayout>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Contacto</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Hablemos de tu centro</h1>
          <p className="mt-4 text-muted-foreground">
            Cuéntanos qué necesitas. Estamos preparando los canales de atención de Aula Base.
          </p>
        </div>
        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.3fr]">
          <div className="rounded-3xl bg-card p-8 shadow-sm">
            <MessageCircle className="size-10 text-primary" />
            <h2 className="mt-6 text-xl font-semibold">¿En qué podemos ayudarte?</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Puedes consultar sobre la aplicación, los planes propuestos o el uso de Aula Base en
              tu centro educativo.
            </p>
            <p className="mt-8 flex items-center gap-3 text-sm text-muted-foreground">
              <Mail className="size-5 text-primary" />
              El correo institucional está pendiente de confirmar.
            </p>
          </div>
          <form onSubmit={submit} className="space-y-5 rounded-3xl bg-card p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-semibold">Escríbenos</h2>
            <p className="text-sm text-muted-foreground">
              Puedes preparar tu mensaje aquí. El envío se habilitará cuando confirmemos el correo
              de contacto.
            </p>
            <label className="block text-sm font-medium">
              Nombre completo
              <input name="name" required className="auth-input mt-2" placeholder="Tu nombre" />
            </label>
            <label className="block text-sm font-medium">
              Correo electrónico
              <input
                name="email"
                type="email"
                required
                className="auth-input mt-2"
                placeholder="nombre@correo.com"
              />
            </label>
            <label className="block text-sm font-medium">
              Mensaje
              <textarea
                name="message"
                required
                rows={5}
                className="auth-input mt-2 resize-y"
                placeholder="¿En qué podemos ayudarte?"
              />
            </label>
            <button
              type="submit"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground"
            >
              Preparar mensaje <Send size={16} />
            </button>
            {draft && (
              <div role="status" className="rounded-2xl bg-warning/20 p-4 text-sm">
                <p>
                  El mensaje no se ha enviado. Guarda esta copia para usarla cuando publiquemos el
                  correo de contacto.
                </p>
                <textarea
                  aria-label="Copia del mensaje"
                  readOnly
                  value={draft}
                  rows={6}
                  className="auth-input mt-3 resize-y"
                />
              </div>
            )}
          </form>
        </div>
      </div>
    </PromoLayout>
  )
}
