import { GraduationCapIcon } from 'lucide-react'

import { cn } from '@/utils/cn'

interface AulaLogoProps {
  className?: string
  showText?: boolean
}

/** Logotipo de la portada, fiel al diseño original. */
export function AulaLogo({ className, showText = true }: AulaLogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/30">
        <GraduationCapIcon className="h-5 w-5" />
      </span>
      {showText && (
        <span className="text-lg font-bold tracking-tight text-foreground">
          Aula<span className="text-primary">Base</span>
        </span>
      )}
    </span>
  )
}
