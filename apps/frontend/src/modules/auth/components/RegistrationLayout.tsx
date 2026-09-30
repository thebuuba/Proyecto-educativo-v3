import { Check, GraduationCap, ShieldCheck } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { PromoLayout } from '@/modules/promo/components/PromoLayout'

export function AccessFooter() {
  return (
    <footer className="login-legal">
      <span>
        <ShieldCheck size={13} />
        Conexión segura
      </span>
      <Link to="/terminos">Términos</Link>
      <Link to="/privacidad">Privacidad</Link>
    </footer>
  )
}

const steps = [
  ['Crea tu cuenta', 'Nombre, correo y contraseña.'],
  ['Confirma tu correo', 'Cuando te lo pidamos, abre el enlace que te enviamos.'],
  ['Configuración inicial', 'Tus datos como docente, tu centro y el año escolar.'],
  ['Entra a la aplicación', 'Tus cursos, horario y registros te esperan.'],
]

export function RegistrationLayout({
  children,
  confirmation = false,
}: {
  children: ReactNode
  confirmation?: boolean
}) {
  const currentStep = confirmation ? 1 : 0
  return (
    <PromoLayout>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 sm:py-14 lg:grid-cols-[1fr_400px] lg:gap-10 lg:px-8">
        <section
          className={`${confirmation ? 'confirm-email-card ' : ''}rounded-[28px] bg-card p-6 shadow-sm sm:p-10`}
        >
          <div className="polymet-register-content">{children}</div>
        </section>
        <aside
          aria-labelledby="flujo-title"
          className="rounded-[28px] bg-primary p-6 text-primary-foreground shadow-lg sm:p-8"
        >
          <div className="flex items-center gap-3">
            <GraduationCap className="size-7" />
            <span className="text-lg font-semibold">Aula Base</span>
          </div>
          <h2 id="flujo-title" className="mt-10 text-sm font-semibold uppercase tracking-[0.14em]">
            Cómo empiezas
          </h2>
          <ol className="mt-6 space-y-5">
            {steps.map(([title, description], i) => (
              <li
                key={title}
                className="flex gap-3"
                aria-current={i === currentStep ? 'step' : undefined}
              >
                <span
                  className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-semibold ${i <= currentStep ? 'bg-card text-primary' : 'bg-white/20 text-white'}`}
                >
                  {i < currentStep ? <Check size={16} /> : i + 1}
                </span>
                <div className={i > currentStep ? 'opacity-80' : ''}>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="text-xs leading-relaxed text-white/90">{description}</p>
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </PromoLayout>
  )
}
