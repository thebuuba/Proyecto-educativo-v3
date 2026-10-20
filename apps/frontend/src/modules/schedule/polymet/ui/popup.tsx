import * as React from 'react';
import { createPortal } from 'react-dom';
import { useOutsideClick } from '@/hooks/useOutsideClick';

import { PopupContext } from './popup-context';
export function PopupRoot({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false); const triggerRef = React.useRef<HTMLButtonElement>(null); const id = React.useId();
  return <PopupContext.Provider value={{ open, setOpen, triggerRef, id }}>{children}</PopupContext.Provider>;
}
export function Popup({ children, className, role, align = 'start', sideOffset = 4, ...props }: React.HTMLAttributes<HTMLDivElement> & { align?: 'start' | 'end'; sideOffset?: number }) {
  const { open, setOpen, triggerRef, id } = React.useContext(PopupContext); const ref = React.useRef<HTMLDivElement>(null); const [rect, setRect] = React.useState<DOMRect | null>(null);
  const close = React.useCallback(() => { setOpen(false); triggerRef.current?.focus(); }, [setOpen, triggerRef]);
  useOutsideClick({ ref, active: open, onClose: close });
  React.useLayoutEffect(() => {
    if (!open) return;
    const update = () => setRect(triggerRef.current?.getBoundingClientRect() ?? null); update();
    window.addEventListener('resize', update); window.addEventListener('scroll', update, true);
    return () => { window.removeEventListener('resize', update); window.removeEventListener('scroll', update, true); };
  }, [open, triggerRef]);
  const hasRect = rect !== null;
  React.useEffect(() => { if (open && hasRect) (ref.current?.querySelector<HTMLElement>('[aria-selected="true"], [role="option"]:not([aria-disabled="true"]), [role="menuitem"]:not([aria-disabled="true"])'))?.focus(); }, [open, hasRect]);
  if (!open || !rect) return null;
  const top = Math.min(rect.bottom + sideOffset, window.innerHeight - 120);
  return createPortal(<div className="schedule-polymet-theme" role="dialog" aria-label="Opciones" ref={ref} style={{ position: 'fixed', zIndex: 100, top, ...(align === 'end' ? { right: Math.max(8, window.innerWidth - rect.right) } : { left: Math.min(rect.left, window.innerWidth - 160) }), maxWidth: 'calc(100vw - 16px)' }} onKeyDown={e => {
    if (e.key === 'Escape' || e.key === 'Tab') { e.stopPropagation(); if (e.key === 'Escape') e.preventDefault(); close(); return; }
    const items = [...(ref.current?.querySelectorAll<HTMLElement>('[role="option"]:not([aria-disabled="true"]), [role="menuitem"]:not([aria-disabled="true"])') ?? [])];
    const index = items.indexOf(document.activeElement as HTMLElement);
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) { e.preventDefault(); items[e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : (index + (e.key === 'ArrowUp' ? -1 : 1) + items.length) % items.length]?.focus(); }
    else if (e.key.length === 1 && e.key !== ' ') { items.find((item, i) => i > index && item.textContent?.trim().toLocaleLowerCase().startsWith(e.key.toLocaleLowerCase()))?.focus(); }
  }}><div id={id} role={role} data-state="open" data-side="bottom" {...props} className={className} style={{ minWidth: role === 'listbox' ? rect.width : undefined, maxHeight: Math.max(100, window.innerHeight - top - 12), overflowY: 'auto', ...props.style }}>{children}</div></div>, document.body);
}
