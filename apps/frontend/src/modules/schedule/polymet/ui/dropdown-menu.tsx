import { PopupContext } from './popup-context';
import * as React from 'react';
import { Popup, PopupRoot } from './popup';
import { Slot } from './slot';
import { cn } from './utils';
export const DropdownMenu = PopupRoot;
export const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }>(({ asChild, onClick, onKeyDown, ...props }, ref) => {
  const { open, setOpen, triggerRef, id } = React.useContext(PopupContext); const Comp = asChild ? Slot : 'button';
  return <Comp {...props} ref={node => { triggerRef.current = node as HTMLButtonElement; if (typeof ref === 'function') ref(node as HTMLButtonElement); else if (ref) ref.current = node as HTMLButtonElement; }} aria-haspopup="menu" aria-expanded={open} aria-controls={open ? id : undefined} onClick={e => { onClick?.(e as React.MouseEvent<HTMLButtonElement>); if (!e.defaultPrevented) setOpen(!open); }} onKeyDown={e => { onKeyDown?.(e as React.KeyboardEvent<HTMLButtonElement>); if (e.key === 'ArrowDown' && !e.defaultPrevented) { e.preventDefault(); setOpen(true); } }} />;
});
export function DropdownMenuContent({ className, ...props }: React.ComponentProps<typeof Popup>) { return <Popup {...props} role="menu" className={cn('z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md', 'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2', className)} />; }
export const DropdownMenuItem = React.forwardRef<HTMLDivElement, Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> & { disabled?: boolean; inset?: boolean; onSelect?: (event: Event) => void }>(({ disabled, inset, onSelect, className, ...props }, ref) => {
  const { setOpen, triggerRef } = React.useContext(PopupContext);
  const choose = () => { if (disabled) return; const event = new Event('select', { cancelable: true }); onSelect?.(event); if (!event.defaultPrevented) { setOpen(false); triggerRef.current?.focus(); } };
  return <div {...props} ref={ref} role="menuitem" tabIndex={-1} aria-disabled={disabled || undefined} data-disabled={disabled ? '' : undefined} className={cn('relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50', inset && 'pl-8', className)} onClick={choose} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(); } }} />;
});
export function DropdownMenuLabel({ className, inset, ...props }: React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }) { return <div {...props} className={cn('px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)} />; }
export function DropdownMenuSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div role="separator" {...props} className={cn('-mx-1 my-1 h-px bg-muted', className)} />; }
