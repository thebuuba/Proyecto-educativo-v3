import { Check, GraduationCap, ShieldCheck } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AccessLayout } from '@/modules/auth/components/AccessLayout'

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
  ['Activa tu mes gratuito', 'En Ajustes, confirma la tarjeta, el precio y la renovación antes de iniciar la prueba.'],
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
    <AccessLayout>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 sm:py-14 lg:grid-cols-[1fr_400px] lg:gap-10 lg:px-8">
        <section
          className={`${confirmation ? 'confirm-email-card ' : ''}rounded-[28px] bg-card p-6 shadow-sm sm:p-10`}
        >
          <div className="polymet-register-content">{children}</div>
        </section>
        <aside
          aria-labelledby="flujo-title"
          className="rounded-[28px] bg-card p-6 text-foreground shadow-sm sm:p-8"
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
                  className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-semibold ${i <= currentStep ? 'bg-card text-primary' : 'bg-muted text-muted-foreground'}`}
                >
                  {i < currentStep ? <Check size={16} /> : i + 1}
                </span>
                <div className={i > currentStep ? 'opacity-80' : ''}>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </AccessLayout>
  )
}
