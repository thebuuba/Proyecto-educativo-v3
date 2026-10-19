import { ArrowRightIcon, MenuIcon, XIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { AulaLogo } from '@/modules/promo/components/polymet/AulaLogo'
import { polymetButtonClass } from '@/modules/promo/components/polymet/buttonClasses'
import { APP_URL, LOGIN_URL, navLinks } from '@/modules/promo/data/polymet-content'

/**
 * Cabecera de la portada. El menú móvil es un panel lateral propio, accesible:
 * atrapa el foco, cierra con Escape, cierra al usar un enlace y devuelve el foco
 * al disparador. En escritorio se oculta por completo.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const lastFocused = useRef<HTMLElement | null>(null)

  useFocusTrap({ ref: panelRef, active: open, onEscape: closeMenu })

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [open])

  useEffect(() => {
    const desktop = window.matchMedia?.('(min-width: 1024px)')
    if (!desktop) return
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false) }
    desktop.addEventListener('change', closeOnDesktop)
    return () => desktop.removeEventListener('change', closeOnDesktop)
  }, [])

  function openMenu() {
    lastFocused.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setOpen(true)
  }

  function closeMenu() {
    setOpen(false)
    lastFocused.current?.focus()
  }

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-accent px-4 py-2 text-center text-xs font-medium text-accent-foreground sm:text-sm">
        Aula Base, un programa diseñado para maestros. Prueba el plan Docente Completo un mes gratis.{' '}
        <a href="/#precio" className="font-semibold underline-offset-4 hover:underline">
          Ver precio
        </a>
      </div>
      <div className="border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <Link to="/" aria-label="Aula Base, inicio">
            <AulaLogo />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Link
              to={LOGIN_URL}
              className={polymetButtonClass({
                variant: 'plain',
                className: 'text-primary hover:bg-accent hover:text-primary',
              })}
            >
              Iniciar sesión
            </Link>
            <Link
              to={APP_URL}
              className={polymetButtonClass({
                size: 'none',
                className: 'h-9 rounded-full px-5 py-2 text-sm shadow-md shadow-primary/25',
              })}
            >
              Probar gratis
              <ArrowRightIcon className="ml-1.5 h-4 w-4" />
            </Link>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="polymet-menu-toggle bg-background lg:hidden"
            aria-label="Abrir menú"
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls="polymet-mobile-menu"
            onClick={openMenu}
          >
            <MenuIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/35 backdrop-blur-[2px] lg:hidden"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeMenu()
          }}
        >
          <div
            ref={panelRef}
            id="polymet-mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menú"
            tabIndex={-1}
            className="relative ml-auto flex h-full w-72 max-w-[85vw] flex-col overflow-y-auto border-l border-border bg-background p-5 shadow-2xl"
          >
            <AulaLogo />
            <Button variant="ghost" size="icon" aria-label="Cerrar menú" onClick={closeMenu} className="absolute right-2 top-2">
              <XIcon className="h-4 w-4" />
            </Button>
            <nav className="mt-8 flex flex-col gap-1" aria-label="Menú móvil">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="mt-8 flex flex-col gap-2">
              <Link
                to={LOGIN_URL}
                onClick={closeMenu}
                className={polymetButtonClass({ variant: 'outline', className: 'w-full' })}
              >
                Iniciar sesión
              </Link>
              <Link to={APP_URL} onClick={closeMenu} className={polymetButtonClass({ className: 'w-full' })}>
                Probar 1 mes gratis
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
