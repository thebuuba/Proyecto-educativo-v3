import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useId,
  useRef,
  useState,
} from 'react'
import { Button as SharedButton } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Modal } from '@/components/ui/Modal'
import { useOutsideClick } from '@/hooks/useOutsideClick'
import { cn } from '@/utils/cn'

// Small adapters keep the recovered Polymet composition on AulaBase's existing controls.
export { Input, Textarea }
export function Button({ variant = 'primary', ...props }) {
  return <SharedButton variant={variant === 'default' ? 'primary' : variant} {...props} />
}
export function Label2(props) {
  return <label {...props} className={cn('text-sm font-medium leading-none', props.className)} />
}
export function Badge({ variant: _variant, ...props }) {
  return (
    <span
      {...props}
      className={cn(
        'inline-flex items-center rounded-md border border-border px-2.5 py-0.5 text-xs font-semibold',
        props.className,
      )}
    />
  )
}
export function Switch2({ checked, onCheckedChange, className, ...props }) {
  return (
    <input
      {...props}
      type="checkbox"
      role="switch"
      checked={checked}
      onChange={(event) => onCheckedChange?.(event.target.checked)}
      className={cn('reference-switch', className)}
    />
  )
}
export function Progress2({ value, className }) {
  return (
    <div
      role="progressbar"
      aria-label="Progreso"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('overflow-hidden rounded-full bg-muted', className)}
    >
      <div
        className="h-full rounded-full bg-primary"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}

const AvatarContext = createContext(null)
export function Avatar2({ children, className }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <AvatarContext.Provider value={{ loaded, setLoaded }}>
      <span className={cn('relative inline-flex shrink-0 overflow-hidden rounded-full', className)}>
        {children}
      </span>
    </AvatarContext.Provider>
  )
}
export function AvatarImage2({ src, alt, ...props }) {
  const avatar = useContext(AvatarContext)
  return src ? (
    <img
      {...props}
      src={src}
      alt={alt}
      className="absolute inset-0 size-full object-cover"
      referrerPolicy="no-referrer"
      onLoad={() => avatar.setLoaded(true)}
      onError={() => avatar.setLoaded(false)}
      style={{ opacity: avatar.loaded ? 1 : 0 }}
    />
  ) : null
}
export function AvatarFallback2({ className, ...props }) {
  const avatar = useContext(AvatarContext)
  return avatar.loaded ? null : (
    <span {...props} className={cn('grid size-full place-items-center bg-muted', className)} />
  )
}

function descendants(children, type) {
  return Children.toArray(children).flatMap((child) =>
    !isValidElement(child)
      ? []
      : child.type === type
        ? [child]
        : descendants(child.props.children, type),
  )
}
export function Select2({ value, onValueChange, disabled, children }) {
  const options = descendants(children, SelectItem2)
  const trigger = descendants(children, SelectTrigger2)[0]
  const placeholder = descendants(children, SelectValue2)[0]?.props.placeholder
  return (
    <Select
      {...trigger?.props}
      value={value}
      disabled={disabled}
      onChange={(event) => onValueChange?.(event.target.value)}
    >
      {placeholder ? (
        <option value="" disabled>
          {placeholder}
        </option>
      ) : null}
      {options.map((option) => (
        <option
          key={option.props.value}
          value={option.props.value}
          disabled={option.props.disabled}
        >
          {option.props.children}
        </option>
      ))}
    </Select>
  )
}
export function SelectTrigger2({ children }) {
  return children
}
export function SelectContent2({ children }) {
  return children
}
export function SelectItem2({ children }) {
  return children
}
export function SelectValue2() {
  return null
}

const MenuContext = createContext(null)
export function DropdownMenu2({ children }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useOutsideClick({ ref, onClose: () => setOpen(false), active: open })
  return (
    <MenuContext.Provider value={{ open, setOpen }}>
      <div
        ref={ref}
        className="relative"
        onKeyDown={(event) => {
          if (event.key === 'Escape') setOpen(false)
        }}
      >
        {children}
      </div>
    </MenuContext.Provider>
  )
}
export function DropdownMenuTrigger2({ children }) {
  const menu = useContext(MenuContext)
  return cloneElement(children, {
    'aria-expanded': menu.open,
    'aria-haspopup': 'menu',
    onClick: () => menu.setOpen(!menu.open),
  })
}
export function DropdownMenuContent2({ children, className, align: _align }) {
  const menu = useContext(MenuContext)
  return menu.open ? (
    <div
      role="menu"
      className={cn(
        'absolute right-0 top-full z-30 mt-2 min-w-44 rounded-xl border border-border bg-card p-1 shadow-lg',
        className,
      )}
    >
      {children}
    </div>
  ) : null
}
export function DropdownMenuItem2({ onClick, className, ...props }) {
  const menu = useContext(MenuContext)
  return (
    <button
      {...props}
      role="menuitem"
      type="button"
      className={cn(
        'block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40',
        className,
      )}
      onClick={(event) => {
        onClick?.(event)
        menu.setOpen(false)
      }}
    />
  )
}
export function DropdownMenuSeparator2() {
  return <hr className="my-1 border-border" />
}

const DialogContext = createContext(null)
export function AlertDialog2({ children, onOpenChange }) {
  const [open, setOpenState] = useState(false)
  const titleId = useId()
  const setOpen = (value) => {
    setOpenState(value)
    onOpenChange?.(value)
  }
  return (
    <DialogContext.Provider value={{ open, setOpen, titleId }}>{children}</DialogContext.Provider>
  )
}
export function AlertDialogTrigger2({ children }) {
  const dialog = useContext(DialogContext)
  return cloneElement(children, { onClick: () => dialog.setOpen(true), 'aria-haspopup': 'dialog' })
}
export function AlertDialogContent2({ children, className }) {
  const dialog = useContext(DialogContext)
  return dialog.open ? (
    <Modal
      title="Confirmación"
      hideHeader
      className={cn('settings-reference-workspace max-w-lg p-6', className)}
      onClose={() => dialog.setOpen(false)}
    >
      <div aria-labelledby={dialog.titleId}>{children}</div>
    </Modal>
  ) : null
}
export function AlertDialogHeader({ children }) {
  return <div className="mb-5 space-y-2">{children}</div>
}
export function AlertDialogTitle2(props) {
  const dialog = useContext(DialogContext)
  return <h2 {...props} id={dialog.titleId} className="text-lg font-semibold" />
}
export function AlertDialogDescription2(props) {
  return <p {...props} className="text-sm leading-6 text-muted-foreground" />
}
export function AlertDialogFooter({ children }) {
  return <div className="mt-5 flex flex-wrap justify-end gap-2">{children}</div>
}
export function AlertDialogCancel2({ onClick, ...props }) {
  const dialog = useContext(DialogContext)
  return (
    <Button
      {...props}
      variant="outline"
      onClick={(event) => {
        onClick?.(event)
        dialog.setOpen(false)
      }}
    />
  )
}
export function AlertDialogAction2({ onClick, ...props }) {
  const dialog = useContext(DialogContext)
  return (
    <Button
      {...props}
      onClick={(event) => {
        onClick?.(event)
        dialog.setOpen(false)
      }}
    />
  )
}
