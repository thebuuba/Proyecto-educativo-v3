import {
  ArrowRight,
  BookOpen,
  CalendarCheck,
  Check,
  CheckCircle2,
  MessageCircle,
} from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { PromoLayout } from '@/modules/promo/components/PromoLayout'
import { ProductDemo } from '@/modules/promo/components/ProductDemo'
import { faqs, modules, steps } from '@/modules/promo/data/home-content'

const teacherBenefits = [
  'Pasa lista por clase desde el celular o la computadora.',
  'Registra calificaciones por actividad e instrumento de evaluación.',
  'Prepara tus planificaciones y compártelas con coordinación.',
  'Anota observaciones en la bitácora y dales seguimiento.',
  'Consulta quién necesita apoyo según asistencia, promedio o conducta.',
]
const centerBenefits = [
  'Organiza el centro por año escolar y períodos.',
  'Gestiona cursos, asignaturas, estudiantes y matrículas.',
  'Revisa planificaciones y el avance de calificaciones por curso.',
  'Asigna perfiles según el rol de cada persona.',
  'Consulta reportes del centro con la información que registran los docentes.',
]
const tones: Record<string, string> = {
  brand: 'bg-primary/12 text-primary',
  violet: 'bg-primary/12 text-primary',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/25 text-foreground',
  incident: 'bg-destructive/12 text-destructive',
}

export function PromoPage() {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) return <Navigate to="/inicio" replace />
  return (
    <PromoLayout>
      <section className="overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pt-16 lg:px-8 lg:pb-24 lg:pt-20">
          <HeroSides />
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
              <span className="size-1.5 rounded-full bg-success" />
              Para docentes y centros de República Dominicana
            </p>
            <h1 className="mt-5 text-[32px] font-semibold leading-[1.12] tracking-tight sm:text-5xl lg:text-[56px]">
              Tu trabajo académico, <span className="text-primary">organizado</span> en un solo
              lugar
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Aula Base reúne cursos, asistencia, evaluaciones, calificaciones, planificación y
              bitácora para que registres la información una vez y consultes el progreso de tus
              estudiantes cuando lo necesites.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary-hover"
                to="/registro"
              >
                Crear mi cuenta <ArrowRight size={18} />
              </Link>
              <Link
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border bg-card px-6 font-semibold hover:bg-muted"
                to="/contacto?motivo=centro"
              >
                <MessageCircle size={18} /> Hablar con el equipo
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{' '}
              <Link className="font-medium text-primary hover:underline" to="/login">
                Inicia sesión
              </Link>
            </p>
            <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {[
                'Por escuela y año escolar',
                'Pensado para el aula dominicana',
                'Funciona en el navegador',
              ].map((point) => (
                <li className="flex items-center gap-1.5" key={point}>
                  <Check className="size-4 text-success" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <ProductDemo className="mx-auto mt-12 max-w-5xl lg:mt-16" />
        </div>
      </section>
      <section id="modulos" className="scroll-mt-24 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Heading
            eyebrow="Módulos"
            title="Lo que necesitas para el día a día del centro"
            description="Cada módulo se conecta con los demás: lo que registras en asistencia y calificaciones alimenta los reportes de cada estudiante y curso."
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((m) => (
              <li key={m.id} className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
                <span className={`grid size-11 place-items-center rounded-2xl ${tones[m.tone]}`}>
                  <m.icon size={21} />
                </span>
                <h3 className="mt-4 font-semibold">{m.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {m.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="bg-card py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Heading
              eyebrow="Cómo empezar"
              title="De tu registro a tu primera clase"
              description="La configuración inicial te guía para dejar listo tu centro, el año escolar y tus cursos."
            />
            <Link
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
              to="/registro"
            >
              Empezar ahora <ArrowRight className="ml-2 inline size-4" />
            </Link>
          </div>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <li key={step.title} className="rounded-3xl bg-background p-6">
                <span className="grid size-10 place-items-center rounded-full bg-primary font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-semibold">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="py-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Audience
            id="docentes"
            eyebrow="Para docentes"
            title="Tu aula, al día y sin papeles sueltos"
            benefits={teacherBenefits}
            cta="Crear cuenta de docente"
            to="/registro"
          />
          <Audience
            id="centros"
            eyebrow="Para centros educativos"
            title="Una vista ordenada de todo el centro"
            benefits={centerBenefits}
            cta="Hablar con el equipo"
            to="/contacto?motivo=centro"
          />
        </div>
      </section>
      <section id="preguntas" className="scroll-mt-24 bg-card py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Heading
            eyebrow="Preguntas frecuentes"
            title="Respuestas antes de empezar"
            description="¿No encuentras lo que buscas? Escríbenos desde la página de contacto."
          />
          <div className="mt-8 rounded-3xl bg-background px-5 sm:px-7">
            {faqs.map((f) => (
              <details key={f.q} className="group border-b border-border last:border-b-0">
                <summary className="cursor-pointer py-5 text-[15px] font-medium">{f.q}</summary>
                <p className="pb-5 text-[15px] leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section className="px-4 pb-16 pt-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-8 rounded-[32px] bg-primary px-6 py-12 text-primary-foreground sm:px-12 lg:py-16">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Empieza a organizar tu año escolar
            </h2>
            <p className="mt-3 text-[15px]">
              Crea tu cuenta, configura tu centro y tus cursos, y registra tu primera clase.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              className="rounded-full bg-card px-6 py-3 font-semibold text-primary"
              to="/registro"
            >
              Crear mi cuenta <ArrowRight className="ml-2 inline size-4" />
            </Link>
            <Link
              className="rounded-full border border-white/50 px-6 py-3 font-semibold text-primary-foreground"
              to="/contacto"
            >
              Contactar
            </Link>
          </div>
        </div>
      </section>
    </PromoLayout>
  )
}

function Heading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{description}</p>
    </div>
  )
}
function Audience({
  id,
  eyebrow,
  title,
  benefits,
  cta,
  to,
}: {
  id: string
  eyebrow: string
  title: string
  benefits: string[]
  cta: string
  to: string
}) {
  return (
    <article id={id} className="scroll-mt-24 rounded-[32px] bg-card p-6 shadow-sm sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">{title}</h2>
      <ul className="mt-6 space-y-3">
        {benefits.map((b) => (
          <li className="flex gap-3 text-[15px] leading-relaxed" key={b}>
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />
            {b}
          </li>
        ))}
      </ul>
      <Link
        className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
        to={to}
      >
        {cta} <ArrowRight className="ml-2 size-4" />
      </Link>
    </article>
  )
}

function HeroSides() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden 2xl:block">
      <div className="absolute left-0 top-20 size-64 rounded-full bg-primary/8 blur-3xl" />
      <div className="absolute right-0 top-44 size-64 rounded-full bg-success/8 blur-3xl" />
      <div className="absolute left-2 top-40 w-52 -rotate-3 rounded-3xl border border-border/70 bg-card/95 p-4 shadow-lg shadow-primary/8">
        <span className="flex items-center gap-2 text-sm font-semibold">
          <span className="grid size-9 place-items-center rounded-xl bg-success/15 text-success">
            <CalendarCheck size={19} />
          </span>
          Asistencia
        </span>
        <div className="mt-4 space-y-2.5">
          {[0, 1, 2].map((item) => (
            <span key={item} className="flex items-center gap-2">
              <span className="size-6 rounded-full bg-muted" />
              <span className="h-2 flex-1 rounded-full bg-muted" />
              <Check className="size-4 text-success" />
            </span>
          ))}
        </div>
      </div>
      <div className="absolute right-2 top-56 w-52 rotate-3 rounded-3xl border border-border/70 bg-card/95 p-4 shadow-lg shadow-primary/8">
        <span className="flex items-center gap-2 text-sm font-semibold">
          <span className="grid size-9 place-items-center rounded-xl bg-warning/25 text-foreground">
            <BookOpen size={19} />
          </span>
          Planificación
        </span>
        <div className="mt-4 space-y-3">
          <span className="block h-2 w-full rounded-full bg-muted" />
          <span className="block h-2 w-4/5 rounded-full bg-primary/20" />
          <span className="block h-2 w-3/5 rounded-full bg-muted" />
        </div>
      </div>
      <span className="absolute left-12 top-[28rem] -rotate-3 rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-muted-foreground shadow-sm">
        Evaluaciones por período
      </span>
      <span className="absolute right-10 top-[31rem] rotate-3 rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-muted-foreground shadow-sm">
        Reportes a tu alcance
      </span>
    </div>
  )
}
