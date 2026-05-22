import { X } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/Button'

type DrawerProps = {
  title: string
  eyebrow?: string
  children: ReactNode
  onClose: () => void
}

export function Drawer({ title, eyebrow, children, onClose }: DrawerProps) {
  return (
    <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l border-border bg-popover text-popover-foreground shadow-xl">
      <div className="flex items-start justify-between border-b border-border px-5 py-4">
        <div>
          {eyebrow ? (
            <p className="text-xs font-medium uppercase text-muted-foreground">
              {eyebrow}
            </p>
          ) : null}
          <h3 className="mt-1 text-lg font-semibold text-foreground">{title}</h3>
        </div>
        <Button variant="ghost" size="icon" aria-label="Cerrar" onClick={onClose}>
          <X className="size-5" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-5">{children}</div>
    </aside>
  )
}
