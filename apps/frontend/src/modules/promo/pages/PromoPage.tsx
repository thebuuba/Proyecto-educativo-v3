import { Navigate } from 'react-router-dom'

import { useAuth } from '@/modules/auth/hooks/useAuth'
import { CtaSection } from '@/modules/promo/components/polymet/CtaSection'
import { FaqSection } from '@/modules/promo/components/polymet/FaqSection'
import { FeatureHighlights } from '@/modules/promo/components/polymet/FeatureHighlights'
import { HeroSection } from '@/modules/promo/components/polymet/HeroSection'
import { HowItWorks } from '@/modules/promo/components/polymet/HowItWorks'
import { ModulesTabs } from '@/modules/promo/components/polymet/ModulesTabs'
import { PlatformOverview } from '@/modules/promo/components/polymet/PlatformOverview'
import { PolymetLayout } from '@/modules/promo/components/polymet/PolymetLayout'
import { PricingSection } from '@/modules/promo/components/polymet/PricingSection'
import {
  faqs,
  featureHighlights,
  moduleTabs,
  plan,
  platformModules,
  steps,
  studentRows,
  valuePoints,
} from '@/modules/promo/data/polymet-content'

/**
 * Portada pública reconstruida desde el diseño aprobado de Polymet. Mantiene el
 * tema aislado en `PolymetLayout` y la redirección de las personas autenticadas.
 */
export function PromoPage() {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) return <Navigate to="/inicio" replace />

  return (
    <PolymetLayout>
      <HeroSection />
      <PlatformOverview modules={platformModules} points={valuePoints} />
      <FeatureHighlights features={featureHighlights} />
      <ModulesTabs modules={moduleTabs} students={studentRows} />
      <HowItWorks steps={steps} />
      <PricingSection plan={plan} modules={platformModules} />
      <FaqSection faqs={faqs} />
      <CtaSection />
    </PolymetLayout>
  )
}
