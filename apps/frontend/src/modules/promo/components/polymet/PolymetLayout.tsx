import { useEffect, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

import { SiteFooter } from '@/modules/promo/components/polymet/SiteFooter'
import { SiteHeader } from '@/modules/promo/components/polymet/SiteHeader'
import '@/modules/promo/promo-polymet.css'

/**
 * Layout local de la portada pública de Polymet. Aísla el tema y la tipografía
 * dentro de `.promo-polymet`; las demás páginas públicas siguen usando
 * `PromoLayout`.
 */
export function PolymetLayout({ children }: { children: ReactNode }) {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    const frame = requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView?.()
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])

  return (
    <div className="promo-polymet min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  )
}
