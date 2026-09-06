/**
 * Componente de entrada de texto estilizado con borde,
 * foco resaltado y estados deshabilitado.
 */
import {
  BellRing,
  BookOpenCheck,
  Brain,
  Check,
  ChevronDown,
  ChevronUp,
  CircleAlert,
  Clock3,
  Handshake,
  HeartHandshake,
  Lightbulb,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UserCheck,
  UsersRound,
} from 'lucide-react'
import { useState, type ChangeEvent, type InputHTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

type ObservationCategory = {
  label: string
  icon: typeof UserCheck
  tone: string
}

const primaryObservationCategories: ObservationCategory[] = [
  { label: 'Conducta', icon: ShieldCheck, tone: 'border-destructive/35 text-destructive hover:bg-destructive/8' },
  { label: 'Participación', icon: UserCheck, tone: 'border-primary/35 text-primary hover:bg-primary/8' },
  { label: 'Progreso', icon: TrendingUp, tone: 'border-success/40 text-success hover:bg-success/10' },
  { label: 'Seguimiento', icon: BellRing, tone: 'border-warning/55 text-warning-foreground hover:bg-warning/15' },
  { label: 'Trabajo en equipo', icon: UsersRound, tone: 'border-primary/25 text-primary-variant hover:bg-primary/8' },
]

const extraObservationCategories: ObservationCategory[] = [
  { label: 'Asistencia', icon: UserCheck, tone: 'border-success/35 text-success hover:bg-success/10' },
  { label: 'Puntualidad', icon: Clock3, tone: 'border-primary/30 text-primary hover:bg-primary/8' },
  { label: 'Responsabilidad', icon: ShieldCheck, tone: 'border-warning/45 text-warning-foreground hover:bg-warning/15' },
  { label: 'Cumplimiento', icon: BookOpenCheck, tone: 'border-success/35 text-success hover:bg-success/10' },
  { label: 'Tareas', icon: BookOpenCheck, tone: 'border-primary/30 text-primary hover:bg-primary/8' },
  { label: 'Rendimiento académico', icon: TrendingUp, tone: 'border-success/40 text-success hover:bg-success/10' },
  { label: 'Comprensión', icon: Brain, tone: 'border-primary/35 text-primary hover:bg-primary/8' },
  { label: 'Dificultad de aprendizaje', icon: CircleAlert, tone: 'border-destructive/35 text-destructive hover:bg-destructive/8' },
  { label: 'Mejora', icon: TrendingUp, tone: 'border-success/40 text-success hover:bg-success/10' },
  { label: 'Esfuerzo', icon: Target, tone: 'border-warning/50 text-warning-foreground hover:bg-warning/15' },
  { label: 'Motivación', icon: Sparkles, tone: 'border-warning/50 text-warning-foreground hover:bg-warning/15' },
  { label: 'Atención', icon: Target, tone: 'border-primary/30 text-primary hover:bg-primary/8' },
  { label: 'Concentración', icon: Brain, tone: 'border-primary/30 text-primary hover:bg-primary/8' },
  { label: 'Iniciativa', icon: Lightbulb, tone: 'border-warning/45 text-warning-foreground hover:bg-warning/15' },
  { label: 'Creatividad', icon: Lightbulb, tone: 'border-warning/45 text-warning-foreground hover:bg-warning/15' },
  { label: 'Autonomía', icon: Target, tone: 'border-success/35 text-success hover:bg-success/10' },
  { label: 'Organización', icon: BookOpenCheck, tone: 'border-primary/30 text-primary hover:bg-primary/8' },
  { label: 'Comunicación', icon: MessageCircle, tone: 'border-primary/35 text-primary hover:bg-primary/8' },
  { label: 'Liderazgo', icon: Sparkles, tone: 'border-warning/45 text-warning-foreground hover:bg-warning/15' },
  { label: 'Colaboración', icon: Handshake, tone: 'border-success/35 text-success hover:bg-success/10' },
  { label: 'Convivencia', icon: HeartHandshake, tone: 'border-success/35 text-success hover:bg-success/10' },
  { label: 'Respeto', icon: HeartHandshake, tone: 'border-primary/30 text-primary hover:bg-primary/8' },
  { label: 'Disciplina', icon: ShieldCheck, tone: 'border-destructive/30 text-destructive hover:bg-destructive/8' },
  { label: 'Relaciones interpersonales', icon: UsersRound, tone: 'border-primary/30 text-primary hover:bg-primary/8' },
  { label: 'Manejo de conflictos', icon: Handshake, tone: 'border-warning/45 text-warning-foreground hover:bg-warning/15' },
  { label: 'Estado emocional', icon: HeartHandshake, tone: 'border-destructive/25 text-destructive hover:bg-destructive/8' },
  { label: 'Integración', icon: UsersRound, tone: 'border-success/35 text-success hover:bg-success/10' },
  { label: 'Necesita apoyo', icon: CircleAlert, tone: 'border-warning/50 text-warning-foreground hover:bg-warning/15' },
  { label: 'Reconocimiento', icon: Sparkles, tone: 'border-success/35 text-success hover:bg-success/10' },
  { label: 'Acuerdo o compromiso', icon: Handshake, tone: 'border-primary/30 text-primary hover:bg-primary/8' },
]

function parseTags(value: InputHTMLAttributes<HTMLInputElement>['value']) {
  return String(value ?? '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

/** Campo de entrada de texto con estilos consistentes. */
export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const [showAllObservationCategories, setShowAllObservationCategories] = useState(false)
  const isObservationTagsInput = props.placeholder === 'Ej.: participación, conducta, seguimiento'

  const input = (
    <input
      className={cn(
        'h-11 w-full rounded-xl border border-input bg-card px-4 text-sm font-medium text-foreground outline-none transition-[border-color,box-shadow,background-color] placeholder:font-normal placeholder:text-muted-foreground focus:border-ring focus:ring-4 focus:ring-ring/15 disabled:cursor-not-allowed disabled:bg-muted/45 disabled:opacity-65',
        className,
      )}
      {...props}
      placeholder={isObservationTagsInput ? 'Agregar etiqueta personalizada…' : props.placeholder}
    />
  )

  if (!isObservationTagsInput) return input

  const selectedTags = parseTags(props.value)
  const selectedNormalized = new Set(selectedTags.map((tag) => tag.toLocaleLowerCase('es')))

  const toggleCategory = (label: string) => {
    const normalized = label.toLocaleLowerCase('es')
    const nextTags = selectedNormalized.has(normalized)
      ? selectedTags.filter((tag) => tag.toLocaleLowerCase('es') !== normalized)
      : [...selectedTags, label]
    props.onChange?.({ target: { value: nextTags.join(', ') } } as ChangeEvent<HTMLInputElement>)
  }

  const renderCategory = ({ label, icon: Icon, tone }: ObservationCategory) => {
    const active = selectedNormalized.has(label.toLocaleLowerCase('es'))
    return (
      <button
        key={label}
        type="button"
        aria-pressed={active}
        onClick={() => toggleCategory(label)}
        className={cn(
          'inline-flex h-8 items-center gap-1.5 rounded-lg border bg-card px-2.5 text-xs font-semibold transition-[background-color,border-color,box-shadow,transform] hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25',
          tone,
          active && 'bg-muted shadow-sm ring-1 ring-current/15',
        )}
      >
        <Icon className="size-3.5" />
        <span>{label}</span>
        {active ? <Check className="size-3" /> : null}
      </button>
    )
  }

  return (
    <div className="grid gap-2.5">
      <div className="flex flex-wrap gap-2">
        {primaryObservationCategories.map(renderCategory)}
        <button
          type="button"
          onClick={() => setShowAllObservationCategories((current) => !current)}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 text-xs font-semibold text-muted-foreground transition hover:border-primary/30 hover:bg-muted hover:text-foreground"
        >
          {showAllObservationCategories ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
          {showAllObservationCategories ? 'Mostrar menos' : 'Más categorías'}
        </button>
      </div>

      {showAllObservationCategories ? (
        <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto rounded-xl border border-border/70 bg-muted/20 p-2.5">
          {extraObservationCategories.map(renderCategory)}
        </div>
      ) : null}

      {input}
    </div>
  )
}
