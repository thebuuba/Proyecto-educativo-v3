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
import { type ComponentType, useEffect, useRef, useState } from 'react'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { PromoLayout } from '@/modules/promo/components/PromoLayout'

const primary = '#1e4f8f'
const primaryLight = '#edf4fb'
const primaryBorder = '#b7cfe6'

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
  { value: 12400, label: 'Docentes activos', suffix: '+', icon: GraduationCap },
  { value: 340, label: 'Instituciones', suffix: '+', icon: Shield },
  { value: 98, label: 'Satisfacción docente', suffix: '%', icon: Star },
  { value: 4200000, label: 'Asistencias registradas', suffix: '+', icon: SquareCheckBig, compact: true },
]

function formatStat(value: number, compact?: boolean): string {
  if (compact) return `${(value / 1000000).toFixed(1)}M`
  return value.toLocaleString('es-DO')
}

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

function AnimatedStat({ value, label, suffix, icon: Icon, compact }: {
  value: number
  label: string
  suffix: string
  icon: ComponentType<{ size?: number; className?: string }>
  compact?: boolean
}) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const counted = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !counted.current) {
        counted.current = true
        const duration = 1500
        const steps = 30
        const stepTime = duration / steps
        const increment = value / steps
        let current = 0
        const timer = setInterval(() => {
          current += increment
          if (current >= value) {
            setCount(value)
            clearInterval(timer)
          } else {
            setCount(Math.floor(current))
          }
        }, stepTime)
        obs.disconnect()
      }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [value])

  return (
    <div ref={ref} className="flex items-center gap-4">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl" style={{ background: primaryLight, color: primary }}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-extrabold leading-none" style={{ color: primary }}>
          {compact ? formatStat(count, true) : formatStat(count)}{suffix}
        </p>
        <p className="mt-0.5 text-sm text-[#6B7280]">{label}</p>
      </div>
    </div>
  )
}

function useScrollReveal<T extends HTMLElement>(delay: number = 0) {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => setVisible(true), delay)
        obs.disconnect()
      }
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])

  return { ref, visible }
}

function RevealSection({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>(delay)
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} ${className}`}
    >
      {children}
    </div>
  )
}

export function PromoPage() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return null
  if (isAuthenticated) return <Navigate to="/inicio" replace />

  return (
    <PromoLayout>
      <section className="relative flex overflow-hidden py-10 sm:py-12 lg:min-h-[calc(100vh-64px)] lg:items-start lg:py-16">
        <div className="pointer-events-none absolute -right-40 -top-40 size-[500px] rounded-full opacity-[0.04]" style={{ background: primary }} />
        <div className="pointer-events-none absolute -bottom-32 -left-32 size-[400px] rounded-full opacity-[0.03]" style={{ background: primary }} />

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
                className="flex w-full items-center justify-center gap-2 rounded-2xl px-7 py-4 text-[15px] font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.985] sm:w-auto"
                style={{ background: primary, boxShadow: '0 6px 20px rgba(30,79,143,.30)' }}
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
            <div
              className="overflow-hidden rounded-3xl border border-[#E5E7EB] shadow-2xl"
              style={{ boxShadow: '0 24px 64px rgba(30,79,143,.14)' }}
            >
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

      <section id="caracteristicas" className="border-y border-[#E5E7EB] bg-white py-10">
        <div className="grid w-full grid-cols-1 gap-6 px-4 sm:grid-cols-2 sm:px-8 md:grid-cols-4 lg:px-14 2xl:px-20">
          {stats.map((stat) => (
            <AnimatedStat key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      <RevealSection>
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
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <RevealSection key={feature.title} delay={i * 100}>
                  <div className="group rounded-2xl border border-[#E5E7EB] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="mb-4 flex size-11 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110" style={{ background: primaryLight, color: primary }}>
                      <Icon size={22} />
                    </div>
                    <h3 className="mb-2 text-base font-bold text-[#111827]">{feature.title}</h3>
                    <p className="text-sm leading-relaxed text-[#6B7280]">{feature.desc}</p>
                  </div>
                </RevealSection>
              )
            })}
          </div>
        </section>
      </RevealSection>

      <RevealSection>
        <section id="precios" className="bg-[#F0F4F5] py-16 md:py-24">
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
              {plans.map((plan, i) => (
                <RevealSection key={plan.name} delay={i * 100}>
                  <div
                    className="relative rounded-3xl border p-7 transition-all duration-300 hover:-translate-y-1"
                    style={{
                      background: plan.highlight ? primary : '#FFFFFF',
                      borderColor: plan.highlight ? 'transparent' : '#E5E7EB',
                      boxShadow: plan.highlight ? '0 16px 48px rgba(30,79,143,.28)' : 'none',
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
                      className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-all hover:scale-[1.02]"
                      style={{
                        background: plan.highlight ? '#FFFFFF' : primary,
                        color: plan.highlight ? primary : '#FFFFFF',
                        boxShadow: plan.highlight ? 'none' : '0 3px 12px rgba(30,79,143,.20)',
                      }}
                    >
                      {plan.cta} <ArrowRight size={14} />
                    </Link>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      <RevealSection>
        <section id="testimonios" className="py-16 md:py-24" style={{ background: primary }}>
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
              <Link to="/registro" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-[15px] font-bold transition-all hover:scale-[1.02] sm:w-auto" style={{ color: primary }}>
                Crear cuenta gratis <ArrowRight size={16} />
              </Link>
              <Link to="/login" className="w-full rounded-2xl border border-white/30 px-8 py-4 text-[15px] font-semibold text-white transition hover:bg-white/10 sm:w-auto">
                Iniciar sesión
              </Link>
            </div>
          </div>
        </section>
      </RevealSection>

    </PromoLayout>
  )
}
