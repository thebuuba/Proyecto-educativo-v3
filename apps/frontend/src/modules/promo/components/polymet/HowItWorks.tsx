import {
  ClipboardCheckIcon,
  GlobeIcon,
  LayoutGridIcon,
  ShieldCheckIcon,
  UserPlusIcon,
  CloudIcon,
} from 'lucide-react'

interface HowItWorksProps {
  steps: { step: string; title: string; description: string }[]
}

const stepIcons = [UserPlusIcon, LayoutGridIcon, ClipboardCheckIcon]

const guarantees = [
  { icon: ShieldCheckIcon, label: 'Datos protegidos' },
  { icon: GlobeIcon, label: 'Desde el navegador' },
  { icon: CloudIcon, label: 'Siempre en la nube' },
]

export function HowItWorks({ steps }: HowItWorksProps) {
  return (
    <section id="como-funciona" className="scroll-mt-28 bg-muted/60 px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Cómo empezar
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Empieza en tres pasos
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {guarantees.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground"
              >
                <Icon className="h-3.5 w-3.5 text-primary" />
                {label}
              </span>
            ))}
          </div>
        </div>

        <ol className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => {
            const Icon = stepIcons[i % stepIcons.length]
            return (
              <li
                key={s.step}
                className="relative rounded-[28px] border border-border/60 bg-card p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-5xl font-extrabold text-muted">{s.step}</span>
                </div>
                <h3 className="mt-6 text-xl font-bold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
