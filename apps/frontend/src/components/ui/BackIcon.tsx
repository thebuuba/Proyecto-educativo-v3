import { cn } from '@/utils/cn'

export function BackIcon({ className }: { className?: string }) {
  return <img src="/flecha-izquierda.png" alt="" aria-hidden="true" className={cn('size-5 shrink-0', className)} />
}
