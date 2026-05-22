import { X } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/Button'

type ModalProps = {
  title: string
  description?: string
  children: ReactNode
  onClose: () => void
}

export function Modal({ title, description, children, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/45 px-4 py-6">
      <div className="w-full max-w-2xl overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-xl">
        <div className="flex items-start justify-between border-b border-border px-5 py-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
            {description ? (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          <Button variant="ghost" size="icon" aria-label="Cerrar" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  )
}
