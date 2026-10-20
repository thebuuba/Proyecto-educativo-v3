import * as React from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { Slot } from './slot';

const Context = React.createContext({ open: false, setOpen: (_open: boolean) => {}, title: '', description: '', depth: 0 });
let scrollLocks = 0;
let previousOverflow = '';
export function Root({ open: controlled, defaultOpen = false, onOpenChange, children }: { open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; children: React.ReactNode }) {
  const parent = React.useContext(Context); const [local, setLocal] = React.useState(defaultOpen); const id = React.useId(); const open = controlled ?? local;
  const setOpen = React.useCallback((next: boolean) => { if (controlled === undefined) setLocal(next); onOpenChange?.(next); }, [controlled, onOpenChange]);
  return <Context.Provider value={{ open, setOpen, title: `${id}-title`, description: `${id}-description`, depth: parent.depth + 1 }}>{children}</Context.Provider>;
}
export function Portal({ children }: { children?: React.ReactNode }) {
  const { open, depth } = React.useContext(Context);
  React.useLayoutEffect(() => {
    if (!open) return;
    // Nested portals can mount before their parent; DOM order also drives useOutsideClick.
    [...document.body.querySelectorAll<HTMLElement>(':scope > [data-polymet-modal-depth]')].sort((a, b) => Number(a.dataset.polymetModalDepth) - Number(b.dataset.polymetModalDepth)).forEach(node => document.body.appendChild(node));
  }, [open]);
  return open ? createPortal(<div className="schedule-polymet-theme" data-polymet-modal-depth={depth} style={{ position: 'relative', zIndex: 50 + depth * 10 }}>{children}</div>, document.body) : null;
}
export const Overlay = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => <div {...props} ref={ref} data-state="open" />);
type ContentProps = React.HTMLAttributes<HTMLDivElement> & { onEscapeKeyDown?: (event: KeyboardEvent) => void; onPointerDownOutside?: (event: Event) => void };
export const Content = React.forwardRef<HTMLDivElement, ContentProps>(({ onEscapeKeyDown, onPointerDownOutside, ...props }, forwardedRef) => {
  const { open, setOpen, title, description } = React.useContext(Context); const ref = React.useRef<HTMLDivElement>(null);
  const isTop = () => [...document.querySelectorAll('[role="dialog"], [role="alertdialog"]')].at(-1) === ref.current;
  useFocusTrap({ ref, active: open, onEscape: () => { if (!isTop()) return; const event = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true }); onEscapeKeyDown?.(event); if (!event.defaultPrevented) setOpen(false); } });
  React.useEffect(() => {
    if (!open || isTop()) return;
    const top = [...document.querySelectorAll<HTMLElement>('[role="dialog"], [role="alertdialog"]')].at(-1);
    if (top && !top.contains(document.activeElement)) (top.querySelector<HTMLElement>('button:not(:disabled), input:not(:disabled), [tabindex="0"]') ?? top).focus();
  }, [open]);
  useOutsideClick({ ref, active: open, onClose: () => { const event = new Event('pointerdownoutside', { cancelable: true }); onPointerDownOutside?.(event); if (!event.defaultPrevented) setOpen(false); } });
  React.useLayoutEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    if (scrollLocks++ === 0) { previousOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; }
    if (ref.current && !ref.current.contains(document.activeElement)) ref.current.focus();
    return () => { if (--scrollLocks === 0) document.body.style.overflow = previousOverflow; if (previous?.isConnected) previous.focus(); };
  }, [open]);
  if (!open) return null;
  return <div role="dialog" data-ui-density="custom" aria-modal="true" aria-labelledby={title} aria-describedby={description} tabIndex={-1} {...props} data-state="open" ref={node => { ref.current = node; if (typeof forwardedRef === 'function') forwardedRef(node); else if (forwardedRef) forwardedRef.current = node; }} />;
});
export const Title = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>((props, ref) => <h2 id={React.useContext(Context).title} {...props} ref={ref} />);
export const Description = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>((props, ref) => <p id={React.useContext(Context).description} {...props} ref={ref} />);
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean };
export const Trigger = React.forwardRef<HTMLButtonElement, ButtonProps>(({ asChild, onClick, ...props }, ref) => { const { setOpen, open } = React.useContext(Context); const Comp = asChild ? Slot : 'button'; return <Comp {...props} ref={ref} aria-haspopup="dialog" aria-expanded={open} onClick={e => { onClick?.(e as React.MouseEvent<HTMLButtonElement>); if (!e.defaultPrevented) setOpen(true); }} />; });
export const Close = React.forwardRef<HTMLButtonElement, ButtonProps>(({ asChild, onClick, ...props }, ref) => { const { setOpen } = React.useContext(Context); const Comp = asChild ? Slot : 'button'; return <Comp type="button" {...props} ref={ref} onClick={e => { onClick?.(e as React.MouseEvent<HTMLButtonElement>); if (!e.defaultPrevented) setOpen(false); }} />; });
export const Action = Close;
export const Cancel = Close;
