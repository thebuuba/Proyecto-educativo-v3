import type { InputHTMLAttributes } from 'react'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { Input } from '@/components/ui/Input'
import { cn } from '@/utils/cn'

export type PasswordInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  inputClassName?: string
}

export function PasswordInput({
  label,
  id,
  className,
  inputClassName,
  ...props
}: PasswordInputProps) {
  const [show, setShow] = useState(false)

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="relative mt-2">
        <Input
          id={id}
          type={show ? 'text' : 'password'}
          className={cn('pr-10', inputClassName)}
          autoComplete={props.autoComplete}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
          aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          tabIndex={-1}
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </div>
  )
}
