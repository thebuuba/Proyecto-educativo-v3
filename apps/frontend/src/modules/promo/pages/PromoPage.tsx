import {
  ArrowRight,
  Bell,
  CalendarDays,
  ChartNoAxesColumn,
  Check,
  ChevronRight,
  GraduationCap,
  Shield,
  SquareCheckBig,
  Star,
  Users,
} from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '@/modules/auth/hooks/useAuth'

const primary = '#1F4E5F'
const primaryHover = '#2D6977'
const primaryLight = '#EBF5F7'
const primaryBorder = '#A8CDD4'

const features = [
  {
    icon: SquareCheckBig,
    title: 'Asistencia digital',
    desc: 'Registra la asistencia de tus grupos en segundos, desde cualquier dispositivo. Genera reportes automáticos al instante.',
  },
  {
    icon: Star,
    title: 'Calificaciones inteligentes',
    desc: 'Carga notas, define criterios de evaluación y genera boletas de calificaciones con un clic.',
  },
  {
    icon: CalendarDays,
    title: 'Agenda docente',
    desc: 'Organiza tu semana, programa exámenes, reuniones y entrega de tareas con recordatorios automáticos.',
  },
  {
    icon: Users,
    title: 'Gestión de grupos',
    desc: 'Administra tus secciones, listas de estudiantes y comunícate con padres de familia fácilmente.',
  },
  {
    icon: ChartNoAxesColumn,
    title: 'Reportes y analíticos',
    desc: 'Visualiza el rendimiento académico de tus estudiantes con gráficas claras y exportables.',
  },
  {
    icon: Bell,
    title: 'Notificaciones',
    desc: 'Recibe alertas de estudiantes en riesgo, ausencias reiteradas y fechas importantes sin perder nada.',
  },
]

const stats = [
  { value: '12,400+', label: 'Docentes activos', icon: GraduationCap },
  { value: '340+', label: 'Instituciones', icon: Shield },
  { value: '98%', label: 'Satisfacción docente', icon: Star },
  { value: '4.2M', label: 'Asistencias registradas', icon: SquareCheckBig },
]

const plans = [
  {
    name: 'Gratuito',
    price: '$0',
    period: 'para siempre',
    desc: 'Ideal para docentes que están comenzando.',
    features: ['Hasta 2 grupos', 'Asistencia digital', 'Hasta 60 estudiantes', 'Soporte por correo'],
    cta: 'Empezar gratis',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/ mes por docente',
    desc: 'Para docentes que quieren más potencia.',
    features: [
      'Grupos ilimitados',
      'Calificaciones + reportes',
      'Agenda completa',
      'Notificaciones automáticas',
      'Soporte prioritario',
    ],
    cta: 'Comenzar prueba gratis',
    highlight: true,
  },
  {
    name: 'Institución',
    price: 'Personalizado',
    period: 'contactar ventas',
    desc: 'Para colegios y redes educativas.',
    features: ['Todo en Pro', 'Panel de administrador', 'Gestión de directivos', 'SSO / Active Directory', 'SLA garantizado'],
    cta: 'Hablar con ventas',
    highlight: false,
  },
]

function Logo({ small = false }: { small?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={small ? 'flex size-7 items-center justify-center rounded-lg' : 'flex size-8 items-center justify-center rounded-xl'}
        style={{ background: primary, boxShadow: '0 3px 10px rgba(31,78,95,.28)' }}
      >
        <span className={small ? 'text-[10px] font-extrabold text-white' : 'text-[11px] font-extrabold text-white'}>
          AB
        </span>
      </div>
      <div>
        <p className="text-sm font-extrabold leading-none text-[#111827]">Aula Base</p>
        {!small ? <p className="mt-0.5 text-[10px]" style={{ color: primaryHover }}>Sistema docente</p> : null}
      </div>
    </div>
  )
}

export function PromoPage() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return null
  if (isAuthenticated) return <Navigate to="/inicio" replace />

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F8FAFA] text-[#111827]">
      <nav className="sticky top-0 z-50 border-b border-[#E5E7EB] bg-white/90 backdrop-blur-xl">
        <div className="flex h-16 w-full items-center justify-between gap-3 px-4 sm:px-8 lg:px-14 2xl:px-20">
          <Logo />

          <div className="hidden items-center gap-7 md:flex">
            {['Características', 'Precios', 'Testimonios'].map((item) => (
              <a key={item} href="#" className="text-sm font-medium text-[#4B5563] transition hover:opacity-70">
                {item}
              </a>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link to="/login" className="rounded-xl px-3 py-2 text-sm font-semibold text-[#374151] transition hover:bg-[#F9FAFB] sm:px-4">
              Iniciar sesión
            </Link>
            <Link
              to="/registro"
              className="hidden items-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90 sm:flex"
              style={{ background: primary, boxShadow: '0 3px 12px rgba(31,78,95,.25)' }}
            >
              Empezar gratis <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      <section className="flex py-10 sm:py-12 lg:min-h-[calc(100vh-64px)] lg:items-start lg:py-16">
        <div className="grid w-full grid-cols-1 items-start gap-10 px-4 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 lg:px-14 2xl:px-20">
          <div className="min-w-0">
            <span
              className="fu fu1 mb-6 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold"
              style={{ background: primaryLight, color: primary, border: `1px solid ${primaryBorder}` }}
            >
              La plataforma #1 para docentes
            </span>
            <h1 className="fu fu2 mb-5 text-[clamp(2.5rem,10vw,3.25rem)] font-extrabold leading-[1.06] text-[#0D1117]">
              Tu aula,
              <br />
              <span style={{ color: primary }}>digitalizada</span>
              <br />y organizada.
            </h1>
            <p className="fu fu3 mb-8 max-w-[440px] text-[clamp(1rem,3.6vw,1.0625rem)] leading-relaxed text-[#4B5563]">
              Gestiona asistencia, calificaciones, grupos y agenda desde una sola plataforma diseñada para docentes modernos.
            </p>
            <div className="fu fu4 flex flex-wrap items-center gap-4">
              <Link
                to="/registro"
                className="flex w-full items-center justify-center gap-2 rounded-2xl px-7 py-4 text-[15px] font-bold text-white transition hover:opacity-90 active:scale-[0.985] sm:w-auto"
                style={{ background: primary, boxShadow: '0 6px 20px rgba(31,78,95,.30)' }}
              >
                Empezar gratis <ArrowRight size={16} />
              </Link>
              <Link
                to="/login"
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#D1D5DB] px-7 py-4 text-[15px] font-semibold text-[#374151] transition hover:bg-[#F9FAFB] sm:w-auto"
              >
                Ver demo <ChevronRight size={16} />
              </Link>
            </div>
            <p className="fu fu5 mt-4 text-xs text-[#9CA3AF]">Sin tarjeta de crédito · Gratis para siempre en plan básico</p>
          </div>

          <div className="fu fu4 relative min-w-0 pb-16 sm:pb-10">
            <div className="overflow-hidden rounded-3xl border border-[#E5E7EB] shadow-2xl" style={{ boxShadow: '0 24px 64px rgba(31,78,95,.14)' }}>
              <div className="bg-[#F0F4F5] p-3 sm:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#9CA3AF]">Buenos días</p>
                    <p className="text-base font-extrabold text-[#111827]">Prof. García</p>
                  </div>
                  <div className="flex gap-2">
                    {['bg-red-400', 'bg-amber-400', 'bg-emerald-400'].map((color) => (
                      <div key={color} className={`size-3 rounded-full ${color}`} />
                    ))}
                  </div>
                </div>

                <div className="mb-3 grid grid-cols-3 gap-2">
                  {[
                    { label: 'Asistencia', value: '94%', color: '#059669' },
                    { label: 'Mis grupos', value: '6', color: primary },
                    { label: 'Pendientes', value: '3', color: '#D97706' },
                  ].map((item) => (
                    <div key={item.label} className="min-w-0 rounded-xl bg-white p-2.5 sm:p-3">
                      <p className="mb-1 text-[10px] font-medium text-[#9CA3AF]">{item.label}</p>
                      <p className="text-[clamp(1.125rem,6vw,1.25rem)] font-extrabold" style={{ color: item.color }}>{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl bg-white p-3">
                  <p className="mb-2.5 text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">Asistencia - 3°B hoy</p>
                  {[
                    { name: 'Ana Rodríguez', status: 'Presente', color: '#059669', bg: '#D1FAE5' },
                    { name: 'Carlos López', status: 'Ausente', color: '#EF4444', bg: '#FEE2E2' },
                    { name: 'María González', status: 'Presente', color: '#059669', bg: '#D1FAE5' },
                    { name: 'Diego Martínez', status: 'Tardanza', color: '#D97706', bg: '#FEF3C7' },
                  ].map((student) => (
                    <div key={student.name} className="flex items-center justify-between gap-2 border-b border-[#F3F4F6] py-1.5 last:border-0">
                      <div className="flex min-w-0 items-center gap-2">
                        <div className="flex size-5 items-center justify-center rounded-full text-[9px] font-bold text-white" style={{ background: primary }}>
                          {student.name[0]}
                        </div>
                        <p className="truncate text-[11px] font-medium text-[#374151]">{student.name}</p>
                      </div>
                      <span className="shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold" style={{ color: student.color, background: student.bg }}>
                        {student.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-3 flex items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 shadow-lg sm:-bottom-4 sm:-left-2 md:-left-4">
              <div className="flex size-9 items-center justify-center rounded-xl bg-[#D1FAE5]">
                <SquareCheckBig size={18} className="text-[#059669]" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-[#111827]">Asistencia guardada</p>
                <p className="text-[10px] text-[#9CA3AF]">3°B · 28 alumnos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#E5E7EB] bg-white py-10">
        <div className="grid w-full grid-cols-1 gap-6 px-4 sm:grid-cols-2 sm:px-8 md:grid-cols-4 lg:px-14 2xl:px-20">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="flex items-center gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl" style={{ background: primaryLight, color: primary }}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-2xl font-extrabold leading-none" style={{ color: primary }}>{stat.value}</p>
                  <p className="mt-0.5 text-sm text-[#6B7280]">{stat.label}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="w-full px-4 py-16 sm:px-8 md:py-24 lg:px-14 2xl:px-20">
        <div className="mb-10 text-center md:mb-14">
          <span className="mb-4 inline-flex rounded-full px-3 py-1.5 text-[11px] font-bold" style={{ background: primaryLight, color: primary, border: `1px solid ${primaryBorder}` }}>
            Características
          </span>
          <h2 className="mb-4 text-[clamp(2rem,8vw,2.375rem)] font-extrabold leading-tight text-[#0D1117]">
            Todo lo que un docente
            <br />
            necesita en un solo lugar
          </h2>
          <p className="mx-auto max-w-[480px] text-base text-[#6B7280]">
            Diseñado por educadores, para educadores. Cada función está pensada para ahorrar tiempo y mejorar el desempeño.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="rounded-2xl border border-[#E5E7EB] bg-white p-6 transition hover:shadow-md">
                <div className="mb-4 flex size-11 items-center justify-center rounded-2xl" style={{ background: primaryLight, color: primary }}>
                  <Icon size={22} />
                </div>
                <h3 className="mb-2 text-base font-bold text-[#111827]">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-[#6B7280]">{feature.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="bg-[#F0F4F5] py-16 md:py-24">
        <div className="w-full px-4 sm:px-8 lg:px-14 2xl:px-20">
          <div className="mb-10 text-center md:mb-14">
            <span className="mb-4 inline-flex rounded-full px-3 py-1.5 text-[11px] font-bold" style={{ background: primaryLight, color: primary, border: `1px solid ${primaryBorder}` }}>
              Precios
            </span>
            <h2 className="mb-4 text-[clamp(2rem,8vw,2.375rem)] font-extrabold leading-tight text-[#0D1117]">
              Simple, transparente,
              <br />
              sin sorpresas.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="relative rounded-3xl border p-7"
                style={{
                  background: plan.highlight ? primary : '#FFFFFF',
                  borderColor: plan.highlight ? 'transparent' : '#E5E7EB',
                  boxShadow: plan.highlight ? '0 16px 48px rgba(31,78,95,.28)' : 'none',
                  color: plan.highlight ? '#FFFFFF' : '#111827',
                }}
              >
                {plan.highlight ? (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#10B981] px-4 py-1 text-[10px] font-extrabold text-white">
                    Más popular
                  </div>
                ) : null}
                <p className="mb-1 text-lg font-extrabold">{plan.name}</p>
                <p className="mb-4 text-[11px] opacity-70">{plan.desc}</p>
                <div className="mb-6">
                  <span className="text-[38px] font-extrabold leading-none">{plan.price}</span>
                  <span className="ml-1.5 text-[12px] opacity-60">{plan.period}</span>
                </div>
                <div className="mb-7 space-y-2.5">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2.5">
                      <div className="flex size-4 shrink-0 items-center justify-center rounded-full" style={{ background: plan.highlight ? 'rgba(255,255,255,.2)' : primaryLight }}>
                        <Check size={9} color={plan.highlight ? '#FFFFFF' : primary} strokeWidth={3} />
                      </div>
                      <p className="text-[13px] opacity-90">{feature}</p>
                    </div>
                  ))}
                </div>
                <Link
                  to="/registro"
                  className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition hover:opacity-90"
                  style={{
                    background: plan.highlight ? '#FFFFFF' : primary,
                    color: plan.highlight ? primary : '#FFFFFF',
                    boxShadow: plan.highlight ? 'none' : '0 3px 12px rgba(31,78,95,.20)',
                  }}
                >
                  {plan.cta} <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24" style={{ background: primary }}>
        <div className="mx-auto max-w-3xl px-4 text-center text-white sm:px-8 lg:px-14 2xl:px-20">
          <h2 className="mb-4 text-[clamp(2.125rem,8vw,2.625rem)] font-extrabold leading-tight">
            Empieza hoy.
            <br />
            Tu aula te espera.
          </h2>
          <p className="mb-8 text-[16px] leading-relaxed opacity-75">
            Únete a más de 12,000 docentes que ya gestionan su trabajo con Aula Base. Gratis para siempre en el plan básico.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/registro" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-[15px] font-bold transition hover:opacity-90 sm:w-auto" style={{ color: primary }}>
              Crear cuenta gratis <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="w-full rounded-2xl border border-white/30 px-8 py-4 text-[15px] font-semibold text-white transition hover:bg-white/10 sm:w-auto">
              Iniciar sesión
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#E5E7EB] bg-white py-8">
        <div className="flex w-full flex-col gap-5 px-4 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-14 2xl:px-20">
          <Logo small />
          <p className="text-xs text-[#9CA3AF]">© 2026 Aula Base. Todos los derechos reservados.</p>
          <div className="flex flex-wrap gap-5">
            {['Privacidad', 'Términos', 'Contacto'].map((link) => (
              <a key={link} href="#" className="text-xs font-medium text-[#6B7280] transition hover:opacity-70">
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
